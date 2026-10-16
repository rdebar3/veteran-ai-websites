/**
 * Public business identity.
 * Email, phone, and mailing address stay empty until they exist.
 * An empty constant renders nothing; filling it turns that line on.
 */
export const BUSINESS_LEGAL_NAME = 'Veteran AI Websites LLC';
export const BUSINESS_REGION = 'West Virginia';

/** Business email once one exists (e.g. hello@veteranaiwebsites.com). Empty string = not yet; pages fall back to the note form. */
export const CONTACT_EMAIL = '';
export const CONTACT_EMAIL_HREF = CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : '/#contact';

/** Display form, e.g. "(304) 555-0100". Empty until the business line exists. */
export const CONTACT_PHONE = '';

/** `tel:+1` plus the digits in `display`. Empty when there are no digits. */
export function contactPhoneHref(display: string): string {
  const digits = display.replace(/\D/g, '');
  if (!digits) return '';
  return `tel:+1${digits}`;
}

export const CONTACT_PHONE_HREF = contactPhoneHref(CONTACT_PHONE);

/** One line, e.g. "PO Box 123, Weston, WV 26452". Empty until a mailbox exists. */
export const MAILING_ADDRESS = '';

export const SERVICE_AREA = 'Weston and 34 towns in north-central West Virginia';

/** Google listing place id for this business. */
export const GOOGLE_LISTING_URL =
  'https://www.google.com/maps/place/?q=place_id:ChIJ5Wi9pNDCdqcRDQ03nJD16RA';

export type PublicContactLine =
  | { kind: 'phone'; text: string; href: string }
  | { kind: 'email'; text: string; href: string }
  | { kind: 'address'; text: string };

/** Phone, then email, then mailing address. Blank values are left out. */
export function publicContactLines(contact: {
  phone: string;
  email: string;
  address: string;
}): PublicContactLine[] {
  const lines: PublicContactLine[] = [];
  const phone = contact.phone.trim();
  const email = contact.email.trim();
  const address = contact.address.trim();
  if (phone) {
    const href = contactPhoneHref(phone);
    if (href) lines.push({ kind: 'phone', text: phone, href });
  }
  if (email) lines.push({ kind: 'email', text: email, href: `mailto:${email}` });
  if (address) lines.push({ kind: 'address', text: address });
  return lines;
}

/** Street and ZIP for JSON-LD. Null when the mailing line is empty. */
export function mailingAddressFields(
  line: string,
): { streetAddress: string; postalCode: string } | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  const zip = trimmed.match(/\b(\d{5}(?:-\d{4})?)\b/);
  const postalCode = zip?.[1] ?? '';
  const streetAddress = (trimmed.split(',')[0] ?? '').trim() || trimmed;
  return { streetAddress, postalCode };
}
