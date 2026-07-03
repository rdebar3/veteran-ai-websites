/**
 * Hero background media — swap these paths when final assets are ready.
 * Place files in /public/hero/ (video) and /public/ (images).
 */
export const heroMedia = {
  /** Primary full-screen background video (desktop / fast connections) */
  video: {
    src: '/hero/hero-bg.mp4',
    /** Optional WebM for broader codec support */
    webm: '/hero/hero-bg.webm',
    type: 'video/mp4',
  },
  /** High-quality poster + mobile / fallback still image */
  poster: '/natural-beauty-in-west-virginia.webp',
  /** Optional higher-res fallback for retina — same scene as video */
  posterHd: '/natural-beauty-in-west-virginia.webp',
  /** Alt text for accessibility */
  alt: 'West Virginia mountain landscape at golden hour',
} as const;