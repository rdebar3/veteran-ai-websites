/** Site owner / trust contact — single source of truth for public-facing details. */
export const FULL_NAME = 'Richard E. Debar III';
export const PHONE = '(304) 591-3835';
export const PHONE_RAW = '3045913835';
export const PHONE_HREF = `tel:+1${PHONE_RAW}`;
export const BRANCH = 'Army';
export const SERVICE_YEARS = '2001-2013';
export const TOWN = 'Horner';
export const MAILING_ADDRESS = '12262 Skin Creek Rd, Horner, WV 26372';
export const MAILING = {
  streetAddress: '12262 Skin Creek Rd',
  addressLocality: 'Horner',
  addressRegion: 'WV',
  postalCode: '26372',
  addressCountry: 'US',
} as const;
export const SERVICE_AREA = 'All 55 West Virginia counties';
