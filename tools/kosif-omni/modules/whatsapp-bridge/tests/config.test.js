import { describe, expect, it, vi } from 'vitest';
import { loadConfig } from '../src/config.js';
import { createRuntime } from '../src/server.js';

const token = 'a'.repeat(32);

function configErrorCode(action) {
  try {
    action();
    return undefined;
  } catch (error) {
    return error.code;
  }
}

describe('configuration', () => {
  it('uses safe defaults for optional settings', () => {
    expect(loadConfig({ BRIDGE_API_TOKEN: token })).toMatchObject({
      nodeEnv: 'production',
      host: '127.0.0.1',
      port: 8787,
      maxRecipientsPerRequest: 20,
      maxMessageLength: 4000,
      sendDelayMs: 2500
    });
  });

  it('rejects missing or short tokens', () => {
    expect(configErrorCode(() => loadConfig({}))).toBe('CONFIG_INVALID');
    expect(configErrorCode(() => loadConfig({ BRIDGE_API_TOKEN: 'short' }))).toBe('CONFIG_INVALID');
  });

  it.each([
    ['PORT', '0'],
    ['SEND_DELAY_MS', '-1'],
    ['MAX_RECIPIENTS_PER_REQUEST', '0'],
    ['MAX_RECIPIENTS_PER_REQUEST', '21'],
    ['MAX_MESSAGE_LENGTH', '0']
  ])('rejects invalid %s', (key, value) => {
    expect(configErrorCode(() => loadConfig({ BRIDGE_API_TOKEN: token, [key]: value })))
      .toBe('CONFIG_INVALID');
  });

  it('destroys the WhatsApp client during an idempotent runtime shutdown', async () => {
    const fakeClient = {
      on: vi.fn(() => fakeClient),
      initialize: vi.fn(async () => {}),
      destroy: vi.fn(async () => {})
    };
    const runtime = createRuntime({
      env: { BRIDGE_API_TOKEN: token },
      clientFactory: () => fakeClient,
      requestStoreFactory: () => ({ get: vi.fn(), put: vi.fn() }),
      logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
    });

    await runtime.shutdown();
    await runtime.shutdown();
    expect(fakeClient.destroy).toHaveBeenCalledTimes(1);
  });
});
