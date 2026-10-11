import { DEMO_X_ROBOTS_TAG } from './copy';

/** X-Robots-Tag on every /d/*, /s/*, and /examples/* response. */
export const DEMO_NOINDEX_HEADERS = [
  {
    source: '/d/:path*',
    headers: [{ key: 'X-Robots-Tag', value: DEMO_X_ROBOTS_TAG }],
  },
  {
    source: '/s/:path*',
    headers: [{ key: 'X-Robots-Tag', value: DEMO_X_ROBOTS_TAG }],
  },
  {
    source: '/examples/:path*',
    headers: [{ key: 'X-Robots-Tag', value: DEMO_X_ROBOTS_TAG }],
  },
];
