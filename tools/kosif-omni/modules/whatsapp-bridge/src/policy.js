import { z } from 'zod';
import { normalizeRecipients } from './phone.js';

const payloadShape = z.object({
  recipients: z.unknown().optional(),
  message: z.unknown().optional(),
  requestId: z.unknown().optional()
}).passthrough();

export class PolicyError extends Error {
  constructor(code, message, details = undefined) {
    super(message);
    this.name = 'PolicyError';
    this.code = code;
    this.status = 400;
    if (details !== undefined) this.details = details;
  }
}

function invalidPayload() {
  return new PolicyError('INVALID_PAYLOAD', 'Request body must be a JSON object');
}

export function validateSendPayload(payload, policy) {
  const parsed = payloadShape.safeParse(payload);
  if (!parsed.success) throw invalidPayload();

  const value = parsed.data;
  const maxRecipients = Number(policy?.maxRecipients);
  const maxMessageLength = Number(policy?.maxMessageLength);

  if (!Number.isInteger(maxRecipients) || maxRecipients < 1) {
    throw new PolicyError('POLICY_INVALID', 'Recipient policy is invalid', { field: 'maxRecipients' });
  }
  if (!Number.isInteger(maxMessageLength) || maxMessageLength < 1) {
    throw new PolicyError('POLICY_INVALID', 'Message policy is invalid', { field: 'maxMessageLength' });
  }

  if (!Array.isArray(value.recipients) || value.recipients.length === 0) {
    throw new PolicyError('RECIPIENTS_REQUIRED', 'At least one recipient is required');
  }
  if (value.recipients.length > maxRecipients) {
    throw new PolicyError('MAX_RECIPIENTS', 'Too many recipients');
  }

  if (typeof value.message !== 'string' || value.message.trim().length === 0) {
    throw new PolicyError('MESSAGE_REQUIRED', 'A non-blank message is required');
  }
  if (value.message.length > maxMessageLength) {
    throw new PolicyError('MESSAGE_TOO_LONG', 'Message exceeds the configured length');
  }

  if (typeof value.requestId !== 'string' ||
      !/^[A-Za-z0-9_-]{8,128}$/.test(value.requestId)) {
    throw new PolicyError('REQUEST_ID_INVALID', 'Request id must be 8–128 safe characters');
  }

  return {
    recipients: normalizeRecipients(value.recipients),
    message: value.message,
    requestId: value.requestId
  };
}
