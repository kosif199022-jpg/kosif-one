import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  createRequestStore,
  hashRequestPayload
} from '../src/idempotency-store.js';

async function makeStore() {
  const directory = await mkdtemp(join(tmpdir(), 'jev-bridge-store-'));
  return {
    directory,
    filePath: join(directory, 'requests.json'),
    result: {
      requestId: 'req-1234',
      accepted: true,
      results: [{ recipient: '******4567', status: 'sent' }],
      message: 'this must never be persisted'
    }
  };
}

describe('request store', () => {
  it('starts empty and persists records across instances', async () => {
    const { filePath, result } = await makeStore();
    const first = createRequestStore(filePath);

    expect(await first.get('req-1234')).toBeUndefined();
    await first.put({ requestId: 'req-1234', payloadHash: 'hash-1', result });

    const second = createRequestStore(filePath);
    await expect(second.get('req-1234')).resolves.toMatchObject({
      requestId: 'req-1234',
      payloadHash: 'hash-1',
      result: expect.objectContaining({ accepted: true })
    });
  });

  it('returns the same record for the same request and rejects a hash conflict', async () => {
    const { filePath, result } = await makeStore();
    const store = createRequestStore(filePath);
    await store.put({ requestId: 'req-1234', payloadHash: 'hash-1', result });

    await expect(store.put({ requestId: 'req-1234', payloadHash: 'hash-1', result }))
      .resolves.toMatchObject({ payloadHash: 'hash-1' });
    await expect(store.put({ requestId: 'req-1234', payloadHash: 'hash-2', result }))
      .rejects.toMatchObject({ code: 'IDEMPOTENCY_CONFLICT' });
  });

  it('writes atomically and excludes the message body', async () => {
    const { filePath, result } = await makeStore();
    const store = createRequestStore(filePath);
    await store.put({ requestId: 'req-1234', payloadHash: 'hash-1', result });

    const raw = await readFile(filePath, 'utf8');
    expect(raw).toContain('req-1234');
    expect(raw).not.toContain('this must never be persisted');
    expect(JSON.parse(raw).version).toBe(1);
  });

  it('hashes canonical request data consistently regardless of object key order', () => {
    expect(hashRequestPayload({ message: 'hi', requestId: 'req-1234', recipients: ['966551234567'] }))
      .toBe(hashRequestPayload({ recipients: ['966551234567'], requestId: 'req-1234', message: 'hi' }));
  });
});
