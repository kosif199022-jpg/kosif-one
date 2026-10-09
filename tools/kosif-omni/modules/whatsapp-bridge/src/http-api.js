import express from 'express';
import { timingSafeEqual } from 'node:crypto';
import { createAuditLogger, redactRecipient } from './audit-log.js';
import { hashRequestPayload } from './idempotency-store.js';
import { validateSendPayload } from './policy.js';

class HttpApiError extends Error {
  constructor(code, status, message) {
    super(message);
    this.name = 'HttpApiError';
    this.code = code;
    this.status = status;
  }
}

function tokenMatches(provided, expected) {
  if (typeof provided !== 'string' || typeof expected !== 'string') return false;
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(providedBuffer, expectedBuffer);
}

function getBearerToken(header) {
  const match = /^Bearer ([^\s]+)$/.exec(header ?? '');
  return match?.[1];
}

function requireAuth(token) {
  return (req, res, next) => {
    if (!tokenMatches(getBearerToken(req.get('authorization')), token)) {
      res.status(401).json({ error: { code: 'UNAUTHORIZED' } });
      return;
    }
    next();
  };
}

function delay(milliseconds) {
  if (milliseconds <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function safeSendError(error) {
  const knownCodes = new Set([
    'INVALID_JSON',
    'INVALID_PAYLOAD',
    'MESSAGE_REQUIRED',
    'MESSAGE_TOO_LONG',
    'RECIPIENTS_REQUIRED',
    'MAX_RECIPIENTS',
    'REQUEST_ID_INVALID',
    'INVALID_RECIPIENT',
    'DUPLICATE_RECIPIENT',
    'POLICY_INVALID',
    'WHATSAPP_NOT_READY',
    'IDEMPOTENCY_CONFLICT',
    'STORE_UNAVAILABLE',
    'PAYLOAD_TOO_LARGE'
  ]);
  const code = knownCodes.has(error?.code) ? error.code : 'INTERNAL_ERROR';
  const status = code === 'INTERNAL_ERROR'
    ? 500
    : (Number.isInteger(error?.status) ? error.status : 400);
  return { status, body: { error: { code } } };
}

export function createApp({
  token,
  client,
  requestStore,
  policy,
  sendDelayMs = 2500,
  logger = {}
}) {
  const app = express();
  const audit = createAuditLogger(logger);
  const inFlight = new Map();
  const maxMessageLength = Number(policy?.maxMessageLength) || 4000;
  const bodyLimitBytes = Number(policy?.bodyLimitBytes) || Math.min(
    64 * 1024,
    Math.max(8 * 1024, maxMessageLength * 4 + 4096)
  );
  const jsonParser = express.json({ limit: `${bodyLimitBytes}b` });
  const auth = requireAuth(token);

  app.disable('x-powered-by');

  app.get('/healthz', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/v1/whatsapp/status', auth, (_req, res) => {
    res.json({ ok: true, status: client.getStatus() });
  });

  app.post('/v1/whatsapp/send', auth, jsonParser, async (req, res, next) => {
    try {
      const validated = validateSendPayload(req.body, policy);
      const payloadHash = hashRequestPayload(validated);
      const existing = await requestStore.get(validated.requestId);

      if (existing) {
        if (existing.payloadHash !== payloadHash) {
          throw new HttpApiError('IDEMPOTENCY_CONFLICT', 409, 'Request id conflict');
        }
        audit.requestReplayed({ requestId: validated.requestId });
        res.json({ ...existing.result, replayed: true });
        return;
      }

      const existingOperation = inFlight.get(validated.requestId);
      if (existingOperation) {
        const result = await existingOperation;
        res.json({ ...result, replayed: true });
        return;
      }

      const operation = (async () => {
        if (!client.getStatus()?.ready) {
          throw new HttpApiError('WHATSAPP_NOT_READY', 409, 'WhatsApp session is not ready');
        }

        const results = [];
        for (let index = 0; index < validated.recipients.length; index += 1) {
          const recipient = validated.recipients[index];
          try {
            await client.sendMessage(recipient, validated.message);
            results.push({ recipient: redactRecipient(recipient), status: 'sent' });
            audit.messageSent({ requestId: validated.requestId, recipient, status: 'sent' });
          } catch (error) {
            results.push({
              recipient: redactRecipient(recipient),
              status: 'failed',
              errorCode: error?.code === 'WHATSAPP_NOT_READY' ? 'WHATSAPP_NOT_READY' : 'SEND_FAILED'
            });
            audit.messageFailed({
              requestId: validated.requestId,
              recipient,
              status: 'failed',
              errorCode: error?.code === 'WHATSAPP_NOT_READY' ? 'WHATSAPP_NOT_READY' : 'SEND_FAILED'
            });
          }
          if (index < validated.recipients.length - 1) await delay(Number(sendDelayMs) || 0);
        }

        const result = { requestId: validated.requestId, accepted: true, results };
        await requestStore.put({
          requestId: validated.requestId,
          payloadHash,
          result
        });
        audit.requestAccepted({ requestId: validated.requestId, count: results.length });
        return result;
      })();

      inFlight.set(validated.requestId, operation);
      try {
        res.json(await operation);
      } finally {
        if (inFlight.get(validated.requestId) === operation) inFlight.delete(validated.requestId);
      }
    } catch (error) {
      next(error);
    }
  });

  app.use((error, _req, res, _next) => {
    if (error?.type === 'entity.parse.failed') {
      res.status(400).json({ error: { code: 'INVALID_JSON' } });
      return;
    }
    if (error?.type === 'entity.too.large') {
      res.status(413).json({ error: { code: 'PAYLOAD_TOO_LARGE' } });
      return;
    }
    const response = safeSendError(error);
    if (response.status >= 500 && typeof logger.error === 'function') {
      logger.error({ code: 'INTERNAL_ERROR' }, 'HTTP API error');
    }
    res.status(response.status).json(response.body);
  });

  return app;
}
