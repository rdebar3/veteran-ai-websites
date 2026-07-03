/** Dedicated 4K hero poster — full-res Appalachian vista with AI overlay. */
export const HERO_POSTER = '/hero/hero-poster.jpg';

/**
 * Hero background media — looping cinematic video with landmark poster fallback.
 */
export const heroMedia = {
  video: {
    src: '/hero/hero-bg.mp4',
    webm: undefined as string | undefined,
    type: 'video/mp4',
  },
  poster: HERO_POSTER,
  posterHd: HERO_POSTER,
  alt: 'Dramatic Appalachian foothills at dusk over West Virginia with misty valleys and subtle AI neural network overlay',
} as const;