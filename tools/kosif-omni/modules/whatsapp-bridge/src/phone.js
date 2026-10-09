export class RecipientError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'RecipientError';
    this.code = code;
  }
}

function invalidRecipient(message = 'Invalid recipient number') {
  return new RecipientError('INVALID_RECIPIENT', message);
}

export function normalizeRecipient(input) {
  if (typeof input !== 'string') {
    throw invalidRecipient('Recipient must be a string');
  }

  let digits = input.trim().replace(/[\s\-()]/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);

  if (/^05\d{8}$/.test(digits)) {
    digits = `966${digits.slice(1)}`;
  } else if (/^5\d{8}$/.test(digits)) {
    digits = `966${digits}`;
  }

  if (!/^9665\d{8}$/.test(digits)) {
    throw invalidRecipient('Invalid recipient number');
  }

  return digits;
}

export function normalizeRecipients(list) {
  if (!Array.isArray(list) || list.length === 0) {
    throw new RecipientError('RECIPIENTS_REQUIRED', 'Recipients must be a non-empty array');
  }

  const normalized = list.map(normalizeRecipient);
  if (new Set(normalized).size !== normalized.length) {
    throw new RecipientError('DUPLICATE_RECIPIENT', 'Duplicate recipient after normalization');
  }

  return normalized;
}
