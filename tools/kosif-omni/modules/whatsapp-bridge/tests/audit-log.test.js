import { describe, expect, it } from 'vitest';
import {
  createAuditLogger,
  redactRecipient,
  sanitizeAuditEvent
} from '../src/audit-log.js';

describe('audit log redaction', () => {
  it('keeps only the last four recipient digits', () => {
    const redacted = redactRecipient('966551234567');
    expect(redacted).toMatch(/4567$/);
    expect(redacted).not.toContain('966551234567');
  });

  it('omits message, credentials, QR content, and raw provider errors', () => {
    const safe = sanitizeAuditEvent('message.failed', {
      requestId: 'req-1234',
      recipient: '966551234567',
      message: 'secret message',
      token: 'secret-token',
      qr: 'secret-qr',
      rawError: new Error('provider secret'),
      errorCode: 'PROVIDER_ERROR'
    });

    expect(safe).toMatchObject({
      event: 'message.failed',
      requestId: 'req-1234',
      recipient: '********4567',
      errorCode: 'PROVIDER_ERROR'
    });
    expect(safe).not.toHaveProperty('message');
    expect(safe).not.toHaveProperty('token');
    expect(safe).not.toHaveProperty('qr');
    expect(safe).not.toHaveProperty('rawError');
  });

  it('records safe events through the base logger', () => {
    const calls = [];
    const logger = createAuditLogger({ info: (data, message) => calls.push({ data, message }) });

    logger.record('request.accepted', { requestId: 'req-1234', message: 'secret' });

    expect(calls).toHaveLength(1);
    expect(calls[0].data).toEqual({ event: 'request.accepted', requestId: 'req-1234' });
    expect(calls[0].data).not.toHaveProperty('message');
  });
});
