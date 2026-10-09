const SAFE_FIELDS = [
  'requestId',
  'status',
  'errorCode',
  'state',
  'authenticated',
  'ready',
  'count',
  'durationMs',
  'at'
];

export function redactRecipient(value) {
  if (typeof value !== 'string') return undefined;
  const digits = value.split('@')[0].replace(/\D/g, '');
  if (digits.length <= 4) return '****';
  return `${'*'.repeat(digits.length - 4)}${digits.slice(-4)}`;
}

export function sanitizeAuditEvent(event, details = {}) {
  const safe = { event };
  for (const field of SAFE_FIELDS) {
    if (details[field] !== undefined) safe[field] = details[field];
  }
  if (details.recipient !== undefined) {
    safe.recipient = redactRecipient(details.recipient);
  }
  return safe;
}

export function createAuditLogger(baseLogger = {}) {
  const record = (event, details = {}) => {
    const safe = sanitizeAuditEvent(event, details);
    if (typeof baseLogger.info === 'function') baseLogger.info(safe, event);
    return safe;
  };

  return {
    record,
    requestAccepted: (details) => record('request.accepted', details),
    requestReplayed: (details) => record('request.replayed', details),
    messageSent: (details) => record('message.sent', details),
    messageFailed: (details) => record('message.failed', details),
    whatsappQr: (details) => record('whatsapp.qr', details),
    whatsappState: (details) => record('whatsapp.state', details)
  };
}
