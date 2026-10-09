import { describe, expect, it } from 'vitest';
import { normalizeRecipient, normalizeRecipients } from '../src/phone.js';

describe('normalizeRecipient', () => {
  it.each([
    ['0551234567', '966551234567'],
    ['551234567', '966551234567'],
    ['966551234567', '966551234567'],
    ['+966 55 123 4567', '966551234567']
  ])('normalizes %s', (input, expected) => {
    expect(normalizeRecipient(input)).toBe(expected);
  });

  it.each(['', '12345', '966401234567', 'abc'])('rejects %s', (input) => {
    expect(() => normalizeRecipient(input)).toThrowError(/recipient/i);
  });
});

it('normalizes a list and rejects duplicates after normalization', () => {
  expect(() => normalizeRecipients(['0551234567', '+966551234567']))
    .toThrowError(/duplicate/i);
});
