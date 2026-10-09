import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  HOST: z.string().min(1).default('127.0.0.1'),
  PORT: z.coerce.number().int().min(1).max(65535).default(8787),
  BRIDGE_API_TOKEN: z.string().min(32).regex(/^\S+$/),
  MAX_RECIPIENTS_PER_REQUEST: z.coerce.number().int().min(1).max(20).default(20),
  MAX_MESSAGE_LENGTH: z.coerce.number().int().min(1).max(4000).default(4000),
  SEND_DELAY_MS: z.coerce.number().int().min(0).max(600000).default(2500),
  SESSION_DIR: z.string().min(1).default('/var/lib/jev-whatsapp/.wwebjs_auth'),
  LOG_DIR: z.string().min(1).default('/var/log/jev-whatsapp'),
  REQUEST_STORE_PATH: z.string().min(1).default('/var/lib/jev-whatsapp/data/requests.json')
});

export class ConfigError extends Error {
  constructor(details = []) {
    super('Invalid bridge configuration');
    this.name = 'ConfigError';
    this.code = 'CONFIG_INVALID';
    this.status = 500;
    this.details = details;
  }
}

export function loadConfig(env = process.env) {
  const parsed = schema.safeParse(env);
  if (!parsed.success) {
    throw new ConfigError(parsed.error.issues.map((issue) => issue.path.join('.')));
  }

  return {
    nodeEnv: parsed.data.NODE_ENV,
    host: parsed.data.HOST,
    port: parsed.data.PORT,
    apiToken: parsed.data.BRIDGE_API_TOKEN,
    maxRecipientsPerRequest: parsed.data.MAX_RECIPIENTS_PER_REQUEST,
    maxMessageLength: parsed.data.MAX_MESSAGE_LENGTH,
    sendDelayMs: parsed.data.SEND_DELAY_MS,
    sessionDir: parsed.data.SESSION_DIR,
    logDir: parsed.data.LOG_DIR,
    requestStorePath: parsed.data.REQUEST_STORE_PATH
  };
}
