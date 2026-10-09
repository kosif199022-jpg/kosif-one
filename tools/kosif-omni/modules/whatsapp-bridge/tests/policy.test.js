import { describe, expect, it } from 'vitest';
import { validateSendPayload } from '../src/policy.js';

const policy = { maxRecipients: 2, maxMessageLength: 10 };

function errorCode(action) {
  try {
    action();
    return undefined;
  } catch (error) {
    return error.code;
  }
}

describe('validateSendPayload', () => {
  it('returns normalized recipients and preserves message whitespace', () => {
    expect(validateSendPayload({
      recipients: ['0551234567'],
      message: '  أهلاً  ',
      requestId: 'req-1234'
    }, policy)).toEqual({
      recipients: ['966551234567'],
      message: '  أهلاً  ',
      requestId: 'req-1234'
    });
  });

  it('rejects a missing or blank message', () => {
    expect(errorCode(() => validateSendPayload({
      recipients: ['0551234567'],
      message: '   ',
      requestId: 'req-1234'
    }, policy))).toBe('MESSAGE_REQUIRED');
  });

  it('rejects missing or empty recipients', () => {
    expect(errorCode(() => validateSendPayload({
      message: 'hello',
      requestId: 'req-1234'
    }, policy))).toBe('RECIPIENTS_REQUIRED');

    expect(errorCode(() => validateSendPayload({
      recipients: [],
      message: 'hello',
      requestId: 'req-1234'
    }, policy))).toBe('RECIPIENTS_REQUIRED');
  });

  it('rejects more than the configured recipient limit', () => {
    expect(errorCode(() => validateSendPayload({
      recipients: ['0551234567', '0551234568', '0551234569'],
      message: 'hello',
      requestId: 'req-1234'
    }, policy))).toBe('MAX_RECIPIENTS');
  });

  it('rejects a message longer than the configured limit', () => {
    expect(errorCode(() => validateSendPayload({
      recipients: ['0551234567'],
      message: '12345678901',
      requestId: 'req-1234'
    }, policy))).toBe('MESSAGE_TOO_LONG');
  });

  it('rejects missing or malformed request ids', () => {
    expect(errorCode(() => validateSendPayload({
      recipients: ['0551234567'],
      message: 'hello'
    }, policy))).toBe('REQUEST_ID_INVALID');

    expect(errorCode(() => validateSendPayload({
      recipients: ['0551234567'],
      message: 'hello',
      requestId: 'bad!'
    }, policy))).toBe('REQUEST_ID_INVALID');
  });

  it('rejects duplicate recipients after normalization', () => {
    expect(errorCode(() => validateSendPayload({
      recipients: ['0551234567', '+966551234567'],
      message: 'hello',
      requestId: 'req-1234'
    }, policy))).toBe('DUPLICATE_RECIPIENT');
  });
});
