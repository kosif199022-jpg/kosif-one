import { EventEmitter } from 'node:events';
import { describe, expect, it, vi } from 'vitest';
import { createWhatsAppClient } from '../src/whatsapp-client.js';

function makeFakeClient() {
  const client = new EventEmitter();
  client.initialize = vi.fn(async () => {});
  client.sendMessage = vi.fn(async () => ({ id: 'message-1' }));
  client.destroy = vi.fn(async () => {});
  return client;
}

describe('WhatsApp client adapter', () => {
  it('tracks QR, authentication, ready, and disconnect states', async () => {
    const fake = makeFakeClient();
    const qrValues = [];
    const states = [];
    const adapter = createWhatsAppClient({
      sessionDir: '/tmp/test-session',
      clientFactory: () => fake,
      onQr: (value) => qrValues.push(value),
      onState: (value) => states.push(value)
    });

    expect(adapter.getStatus().state).toBe('starting');
    await adapter.initialize();

    fake.emit('qr', 'qr-secret-payload');
    expect(adapter.getStatus().state).toBe('qr_required');
    expect(qrValues).toEqual(['qr-secret-payload']);

    fake.emit('authenticated');
    expect(adapter.getStatus()).toMatchObject({ authenticated: true });
    fake.emit('ready');
    expect(adapter.getStatus()).toMatchObject({ state: 'ready', authenticated: true, ready: true });

    fake.emit('disconnected', 'LOGOUT');
    expect(adapter.getStatus()).toMatchObject({ state: 'disconnected', authenticated: false, ready: false });
    expect(states.length).toBeGreaterThanOrEqual(4);
  });

  it('rejects sending until ready and then forwards a WhatsApp JID', async () => {
    const fake = makeFakeClient();
    const adapter = createWhatsAppClient({ clientFactory: () => fake });
    await adapter.initialize();

    await expect(adapter.sendMessage('966551234567', 'hello'))
      .rejects.toMatchObject({ code: 'WHATSAPP_NOT_READY' });

    fake.emit('ready');
    await adapter.sendMessage('966551234567', 'hello');
    expect(fake.sendMessage).toHaveBeenCalledWith('966551234567@c.us', 'hello');
  });

  it('can be destroyed before initialization and repeatedly', async () => {
    const fake = makeFakeClient();
    const adapter = createWhatsAppClient({ clientFactory: () => fake });

    await expect(adapter.destroy()).resolves.toBeUndefined();
    await expect(adapter.destroy()).resolves.toBeUndefined();
    expect(fake.destroy).toHaveBeenCalledTimes(1);
  });
});
