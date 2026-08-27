/** Spec §5 honest strip — exact wording. */
export const HONEST_STRIP =
  'Sample homepage built by Veteran AI Websites from your public listing — a preview, nothing published on your behalf.';

export const HONEST_STRIP_LINK_TEXT = 'Veteran AI Websites';

export const EXPIRED_HEADING = 'This sample has expired';
export const EXPIRED_BODY =
  'This preview is no longer available. If you still want a homepage, get in touch — nothing was published on your behalf.';
export const EXPIRED_CTA_LABEL = 'Get in touch';

export const DEMO_X_ROBOTS_TAG = 'noindex, nofollow';
export const DEMO_ROBOTS_DISALLOW = '/d/';
export const DEMO_STORAGE_BUCKET = 'demo-screenshots';
export const DEMO_TEMPLATE_V0 = 'v0';
export const DEMO_TEMPLATE_TRADES_V1 = 'trades_v1';
export const DEMO_SITE_PUBLIC_ORIGIN = 'https://veteranaiwebsites.com';

export function screenshotStoragePath(slug: string): string {
  return `${DEMO_STORAGE_BUCKET}/${slug}.png`;
}
