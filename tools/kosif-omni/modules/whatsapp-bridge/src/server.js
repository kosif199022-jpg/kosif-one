import 'dotenv/config';
import http from 'node:http';
import { pathToFileURL } from 'node:url';
import pino from 'pino';
import { createRequestStore } from './idempotency-store.js';
import { createApp } from './http-api.js';
import { loadConfig } from './config.js';
import { createWhatsAppClient } from './whatsapp-client.js';

function closeHttpServer(server) {
  if (!server.listening) return Promise.resolve();
  return new Promise((resolve) => server.close(() => resolve()));
}

export function createRuntime({
  env = process.env,
  clientFactory,
  requestStoreFactory = createRequestStore,
  logger
} = {}) {
  const config = loadConfig(env);
  const baseLogger = logger ?? pino({ level: 'info' });
  const requestStore = requestStoreFactory(config.requestStorePath);
  const client = createWhatsAppClient({
    sessionDir: config.sessionDir,
    clientFactory,
    logger: baseLogger,
    onState: (status) => {
      if (typeof baseLogger.info === 'function') {
        baseLogger.info({ state: status.state, ready: status.ready, authenticated: status.authenticated }, 'WhatsApp state');
      }
    }
  });
  const app = createApp({
    token: config.apiToken,
    client,
    requestStore,
    policy: {
      maxRecipients: config.maxRecipientsPerRequest,
      maxMessageLength: config.maxMessageLength
    },
    sendDelayMs: config.sendDelayMs,
    logger: baseLogger
  });
  const server = http.createServer(app);
  let shutdownStarted = false;

  return {
    config,
    client,
    app,
    server,
    logger: baseLogger,
    async shutdown() {
      if (shutdownStarted) return;
      shutdownStarted = true;
      await closeHttpServer(server);
      await client.destroy();
    }
  };
}

export async function startServer(options = {}) {
  const runtime = createRuntime(options);
  try {
    await runtime.client.initialize();
    await new Promise((resolve, reject) => {
      runtime.server.once('error', reject);
      runtime.server.listen(runtime.config.port, runtime.config.host, resolve);
    });
    runtime.logger.info({
      host: runtime.config.host,
      port: runtime.config.port,
      environment: runtime.config.nodeEnv,
      sessionDir: runtime.config.sessionDir
    }, 'WhatsApp bridge started');
    return runtime;
  } catch (error) {
    await runtime.shutdown();
    throw error;
  }
}

async function main() {
  const runtime = await startServer();
  let stopping = false;
  const stop = async () => {
    if (stopping) return;
    stopping = true;
    await runtime.shutdown();
    process.exit(0);
  };
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error?.code === 'CONFIG_INVALID' ? 'Invalid bridge configuration' : 'Bridge startup failed');
    process.exitCode = 1;
  });
}
