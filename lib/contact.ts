/** Public contact details — single source of truth. No personal service bio fields. */
export const PHONE = '(304) 591-3835';
export const PHONE_RAW = '3045913835';
export const PHONE_HREF = `tel:+1${PHONE_RAW}`;
export const TOWN = 'Horner';

/** Legal contracting party for privacy, terms, and unsubscribe. */
export const BUSINESS_LEGAL_NAME = 'Veteran AI Websites LLC';
export const CONTACT_EMAIL = 'rdebar3@yahoo.com';
export const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;

export const MAILING_ADDRESS = '12262 Skin Creek Rd, Horner, WV 26372';
export const MAILING = {
  streetAddress: '12262 Skin Creek Rd',
  addressLocality: 'Horner',
  addressRegion: 'WV',
  postalCode: '26372',
  addressCountry: 'US',
} as const;
export const SERVICE_AREA = 'All 55 West Virginia counties';
