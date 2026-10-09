import { describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/http-api.js';

const TOKEN = 't'.repeat(40);
const policy = { maxRecipients: 3, maxMessageLength: 100 };

function createHarness({ ready = true, sendMessage } = {}) {
  const sent = [];
  const records = new Map();
  const client = {
    getStatus: () => ({ state: ready ? 'ready' : 'disconnected', ready, authenticated: ready }),
    sendMessage: vi.fn(async (recipient, message) => {
      sent.push({ recipient, message });
      if (sendMessage) return sendMessage(recipient, message);
      return { id: `message-${sent.length}` };
    })
  };
  const requestStore = {
    get: vi.fn(async (requestId) => records.get(requestId)),
    put: vi.fn(async (record) => {
      const existing = records.get(record.requestId);
      if (existing && existing.payloadHash !== record.payloadHash) {
        throw Object.assign(new Error('conflict'), { code: 'IDEMPOTENCY_CONFLICT', status: 409 });
      }
      records.set(record.requestId, record);
      return record;
    })
  };
  const app = createApp({
    token: TOKEN,
    client,
    requestStore,
    policy,
    sendDelayMs: 0,
    logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
  });
  return { app, client, requestStore, sent };
}

function auth(requestBuilder) {
  return requestBuilder.set('Authorization', `Bearer ${TOKEN}`);
}

describe('HTTP API', () => {
  it('exposes a minimal unauthenticated health check', async () => {
    const { app } = createHarness();
    await request(app).get('/healthz').expect(200, { ok: true });
  });

  it('requires Bearer authentication for status and send', async () => {
    const { app } = createHarness();
    await request(app).get('/v1/whatsapp/status').expect(401)
      .expect(({ body }) => expect(body.error.code).toBe('UNAUTHORIZED'));
    await request(app).post('/v1/whatsapp/send').send({
      recipients: ['0551234567'], message: 'hello', requestId: 'req-1234'
    }).expect(401);
  });

  it('returns redacted status with a valid token', async () => {
    const { app } = createHarness();
    const response = await auth(request(app).get('/v1/whatsapp/status')).expect(200);
    expect(response.body).toEqual({
      ok: true,
      status: { state: 'ready', ready: true, authenticated: true }
    });
  });

  it('returns stable validation errors without a stack trace', async () => {
    const { app } = createHarness();
    const response = await auth(request(app).post('/v1/whatsapp/send'))
      .send({ recipients: ['0551234567'], message: 'hello', requestId: 'bad!' })
      .expect(400);
    expect(response.body).toEqual({ error: { code: 'REQUEST_ID_INVALID' } });
    expect(response.body).not.toHaveProperty('stack');
  });

  it('normalizes recipients and sends sequentially', async () => {
    const { app, client, sent } = createHarness();
    const response = await auth(request(app).post('/v1/whatsapp/send'))
      .send({
        recipients: ['0551234567', '+966551234568'],
        message: 'hello',
        requestId: 'req-seq-1'
      })
      .expect(200);

    expect(client.sendMessage).toHaveBeenCalledTimes(2);
    expect(sent).toEqual([
      { recipient: '966551234567', message: 'hello' },
      { recipient: '966551234568', message: 'hello' }
    ]);
    expect(response.body).toMatchObject({
      requestId: 'req-seq-1',
      accepted: true,
      results: [
        { recipient: '********4567', status: 'sent' },
        { recipient: '********4568', status: 'sent' }
      ]
    });
  });

  it('rejects a new send while WhatsApp is not ready', async () => {
    const { app, client } = createHarness({ ready: false });
    await auth(request(app).post('/v1/whatsapp/send'))
      .send({ recipients: ['0551234567'], message: 'hello', requestId: 'req-1234' })
      .expect(409)
      .expect(({ body }) => expect(body.error.code).toBe('WHATSAPP_NOT_READY'));
    expect(client.sendMessage).not.toHaveBeenCalled();
  });

  it('replays the same request without sending a duplicate', async () => {
    const { app, client } = createHarness();
    const payload = { recipients: ['0551234567'], message: 'hello', requestId: 'req-1234' };
    const first = await auth(request(app).post('/v1/whatsapp/send')).send(payload).expect(200);
    const second = await auth(request(app).post('/v1/whatsapp/send')).send(payload).expect(200);

    expect(client.sendMessage).toHaveBeenCalledTimes(1);
    expect(second.body).toMatchObject({ ...first.body, replayed: true });
  });

  it('rejects reusing a request id with different content', async () => {
    const { app } = createHarness();
    await auth(request(app).post('/v1/whatsapp/send')).send({
      recipients: ['0551234567'], message: 'one', requestId: 'req-1234'
    }).expect(200);
    await auth(request(app).post('/v1/whatsapp/send')).send({
      recipients: ['0551234567'], message: 'two', requestId: 'req-1234'
    }).expect(409)
      .expect(({ body }) => expect(body.error.code).toBe('IDEMPOTENCY_CONFLICT'));
  });

  it('returns per-recipient failure without leaking provider details', async () => {
    const { app } = createHarness({
      sendMessage: async (recipient) => {
        if (recipient.startsWith('966551234568')) {
          throw new Error('provider secret detail');
        }
        return { id: 'ok' };
      }
    });
    const response = await auth(request(app).post('/v1/whatsapp/send'))
      .send({
        recipients: ['0551234567', '0551234568'],
        message: 'hello',
        requestId: 'req-fail-1'
      })
      .expect(200);

    expect(response.body.results).toEqual([
      { recipient: '********4567', status: 'sent' },
      { recipient: '********4568', status: 'failed', errorCode: 'SEND_FAILED' }
    ]);
    expect(JSON.stringify(response.body)).not.toContain('provider secret detail');
  });
});
