export type HeroMotionTier = 'full' | 'lite' | 'static';

export function getHeroMotionTier(): HeroMotionTier {
  if (typeof window === 'undefined') return 'lite';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'static';
  }

  if (window.matchMedia('(max-width: 767px)').matches) {
    return 'lite';
  }

  return 'full';
}

export const heroEase = [0.16, 1, 0.3, 1] as const;

export const heroWordVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.32 + index * 0.13,
      duration: 0.72,
      ease: heroEase,
    },
  }),
};

export const heroFadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.65, ease: heroEase },
});