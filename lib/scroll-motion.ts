import type { Variants } from 'framer-motion';

export const scrollEase = [0.16, 1, 0.3, 1] as const;

export const inViewViewport = {
  once: true,
  amount: 0.14,
  margin: '0px 0px -8% 0px',
} as const;

export const delaySteps = {
  none: 0,
  '1': 0.08,
  '2': 0.16,
  '3': 0.24,
  '4': 0.32,
  '5': 0.4,
} as const;

export type RevealDelay = keyof typeof delaySteps;

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, delay, ease: scrollEase },
  }),
};

export const fadeLeftVariants: Variants = {
  hidden: { opacity: 0, x: -18 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.32, delay, ease: scrollEase },
  }),
};

export const fadeRightVariants: Variants = {
  hidden: { opacity: 0, x: 18 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.32, delay, ease: scrollEase },
  }),
};

export const scaleUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.38, delay, ease: scrollEase },
  }),
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: (stagger = 0.08) => ({
    transition: { staggerChildren: stagger, delayChildren: 0.05 },
  }),
};

export const staggerTextChildVariants = fadeUpVariants;
export const staggerCardChildVariants = scaleUpVariants;