import { landmarks } from '@/lib/landmarks';

/**
 * Hero background media — looping cinematic video with landmark poster fallback.
 */
export const heroMedia = {
  video: {
    src: '/hero/hero-bg.mp4',
    webm: undefined as string | undefined,
    type: 'video/mp4',
  },
  poster: landmarks.newRiverGorge.image,
  posterHd: landmarks.newRiverGorge.image,
  alt: landmarks.newRiverGorge.imageAlt,
} as const;