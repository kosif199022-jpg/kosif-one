import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import { dirname } from 'node:path';

export class StoreError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'StoreError';
    this.code = code;
    this.status = code === 'IDEMPOTENCY_CONFLICT' ? 409 : 500;
  }
}

function canonicalize(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => (
      `${JSON.stringify(key)}:${canonicalize(value[key])}`
    )).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function hashRequestPayload(payload) {
  return createHash('sha256').update(canonicalize(payload)).digest('hex');
}

function sanitizeResult(result = {}) {
  const safe = {};
  if (typeof result.requestId === 'string') safe.requestId = result.requestId;
  if (typeof result.accepted === 'boolean') safe.accepted = result.accepted;
  if (typeof result.status === 'string') safe.status = result.status;
  if (typeof result.createdAt === 'string') safe.createdAt = result.createdAt;
  if (typeof result.completedAt === 'string') safe.completedAt = result.completedAt;
  if (Array.isArray(result.results)) {
    safe.results = result.results.slice(0, 50).map((item) => {
      const safeItem = {};
      if (typeof item?.recipient === 'string') safeItem.recipient = item.recipient;
      if (typeof item?.status === 'string') safeItem.status = item.status;
      if (typeof item?.errorCode === 'string') safeItem.errorCode = item.errorCode;
      return safeItem;
    });
  }
  return safe;
}

async function readDatabase(filePath) {
  try {
    const raw = await readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1 || !parsed.requests || typeof parsed.requests !== 'object') {
      throw new Error('invalid shape');
    }
    return parsed;
  } catch (error) {
    if (error?.code === 'ENOENT') return { version: 1, requests: {} };
    if (error instanceof StoreError) throw error;
    throw new StoreError('STORE_UNAVAILABLE', 'Request store is unavailable');
  }
}

async function atomicWrite(filePath, database) {
  await mkdir(dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporaryPath, JSON.stringify(database, null, 2), { mode: 0o600 });
    await rename(temporaryPath, filePath);
  } catch (error) {
    await unlink(temporaryPath).catch(() => {});
    throw new StoreError('STORE_UNAVAILABLE', 'Request store could not be written');
  }
}

export function createRequestStore(filePath) {
  let writeChain = Promise.resolve();

  const waitForWrites = async () => writeChain;
  const enqueue = (operation) => {
    const next = writeChain.then(operation);
    writeChain = next.catch(() => {});
    return next;
  };

  return {
    async get(requestId) {
      await waitForWrites();
      const database = await readDatabase(filePath);
      return database.requests[requestId];
    },

    async put({ requestId, payloadHash, result }) {
      return enqueue(async () => {
        const database = await readDatabase(filePath);
        const existing = database.requests[requestId];
        if (existing) {
          if (existing.payloadHash !== payloadHash) {
            throw new StoreError('IDEMPOTENCY_CONFLICT', 'Request id was used with a different payload');
          }
          return existing;
        }

        const record = {
          requestId,
          payloadHash,
          createdAt: new Date().toISOString(),
          result: sanitizeResult(result)
        };
        database.requests[requestId] = record;
        await atomicWrite(filePath, database);
        return record;
      });
    }
  };
}
