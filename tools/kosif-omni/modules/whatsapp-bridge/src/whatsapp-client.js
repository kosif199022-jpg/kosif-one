import whatsappWeb from 'whatsapp-web.js';
import qrcodeTerminal from 'qrcode-terminal';
import { normalizeRecipient } from './phone.js';

const { Client, LocalAuth } = whatsappWeb;

export class WhatsAppClientError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'WhatsAppClientError';
    this.code = code;
    this.status = code === 'WHATSAPP_NOT_READY' ? 409 : 500;
  }
}

export function createDefaultClient({ sessionDir }) {
  const puppeteer = { headless: true };
  if (typeof process.getuid === 'function' && process.getuid() === 0) {
    puppeteer.args = ['--no-sandbox', '--disable-setuid-sandbox'];
  }

  return new Client({
    authStrategy: new LocalAuth({ dataPath: sessionDir }),
    puppeteer
  });
}

export function createWhatsAppClient({
  sessionDir,
  onQr,
  onState,
  logger = {},
  clientFactory = createDefaultClient
} = {}) {
  let state = 'starting';
  let authenticated = false;
  let ready = false;
  let lastErrorAt = null;
  let destroyPromise;
  const client = clientFactory({ sessionDir });

  const getStatus = () => ({
    state,
    authenticated,
    ready,
    lastErrorAt
  });

  const publishState = () => {
    if (typeof onState === 'function') onState(getStatus());
  };

  client.on('qr', (qr) => {
    state = 'qr_required';
    publishState();
    if (typeof onQr === 'function') {
      onQr(qr);
    } else {
      qrcodeTerminal.generate(qr, { small: true });
    }
  });

  client.on('authenticated', () => {
    authenticated = true;
    state = 'authenticated';
    publishState();
  });

  client.on('ready', () => {
    authenticated = true;
    ready = true;
    state = 'ready';
    publishState();
  });

  client.on('auth_failure', () => {
    authenticated = false;
    ready = false;
    state = 'auth_failure';
    lastErrorAt = new Date().toISOString();
    publishState();
  });

  client.on('disconnected', () => {
    authenticated = false;
    ready = false;
    state = 'disconnected';
    publishState();
  });

  client.on('error', (error) => {
    ready = false;
    state = 'error';
    lastErrorAt = new Date().toISOString();
    if (typeof logger.warn === 'function') logger.warn({ code: 'WHATSAPP_CLIENT_ERROR' }, 'WhatsApp client error');
    publishState();
    return error;
  });

  return {
    async initialize() {
      await client.initialize();
    },

    getStatus,

    async sendMessage(recipient, message) {
      if (!ready) {
        throw new WhatsAppClientError('WHATSAPP_NOT_READY', 'WhatsApp session is not ready');
      }
      const digits = recipient.endsWith('@c.us')
        ? normalizeRecipient(recipient.slice(0, -5))
        : normalizeRecipient(recipient);
      return client.sendMessage(`${digits}@c.us`, message);
    },

    async destroy() {
      if (!destroyPromise) {
        destroyPromise = Promise.resolve(client.destroy?.()).finally(() => {
          ready = false;
          authenticated = false;
          state = 'disconnected';
          publishState();
        });
      }
      await destroyPromise;
    }
  };
}
