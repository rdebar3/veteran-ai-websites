import { DEMO_X_ROBOTS_TAG } from './copy';

/** X-Robots-Tag on every /d/* and /s/* response (spec §5 noindex ×3). */
export const DEMO_NOINDEX_HEADERS = [
  {
    source: '/d/:path*',
    headers: [{ key: 'X-Robots-Tag', value: DEMO_X_ROBOTS_TAG }],
  },
  {
    source: '/s/:path*',
    headers: [{ key: 'X-Robots-Tag', value: DEMO_X_ROBOTS_TAG }],
  },
];
