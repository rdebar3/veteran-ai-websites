import { describe, expect, it } from 'vitest';
import { validateInquiry, type InquiryInput, type InquiryRow } from './inquiry';

const base: InquiryInput = {
  name: 'Jane Smith',
  phone: '(304) 555-0192',
};

function rowOf(input: InquiryInput): InquiryRow {
  const result = validateInquiry(input);
  if (!result.ok) throw new Error(`${result.field}: ${result.message}`);
  return result.row;
}

describe('validateInquiry', () => {
  it('requires a name', () => {
    expect(validateInquiry({ ...base, name: '' })).toMatchObject({ ok: false, field: 'name' });
    expect(validateInquiry({ ...base, name: '   ' })).toMatchObject({ ok: false, field: 'name' });
  });

  it('requires a phone number', () => {
    expect(validateInquiry({ ...base, phone: '' })).toMatchObject({ ok: false, field: 'phone' });
    expect(validateInquiry({ ...base, phone: '   ' })).toMatchObject({ ok: false, field: 'phone' });
  });

  it('rejects a phone with only 9 digits and keeps a real number', () => {
    expect(validateInquiry({ ...base, phone: '123456789' })).toMatchObject({
      ok: false,
      field: 'phone',
    });
    const row = rowOf(base);
    expect(row.phone).toBe('(304) 555-0192');
  });

  it('rejects a bad email and stores a blank email as null', () => {
    expect(validateInquiry({ ...base, email: 'not-an-email' })).toMatchObject({
      ok: false,
      field: 'email',
    });
    expect(rowOf({ ...base, email: '' }).email).toBeNull();
    expect(rowOf({ ...base, email: '   ' }).email).toBeNull();
  });

  it('stores a blank message as null and trims a long message to 3000', () => {
    expect(rowOf({ ...base, message: '' }).message).toBeNull();
    expect(rowOf({ ...base, message: '   ' }).message).toBeNull();
    const long = 'a'.repeat(3001);
    expect(rowOf({ ...base, message: long }).message).toBe('a'.repeat(3000));
  });

  it('keeps only the three plan names, and always tags the row as website', () => {
    expect(rowOf({ ...base, plan: 'premium' }).plan).toBeNull();
    expect(rowOf({ ...base, plan: 'Premium' }).plan).toBe('Premium');
    const row = rowOf(base);
    expect(row.source).toBe('website');
    expect(row.wants_store).toBe(false);
    expect(row.is_veteran).toBe(false);
  });
});
