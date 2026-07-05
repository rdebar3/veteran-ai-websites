'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  delaySteps,
  fadeLeftVariants,
  fadeRightVariants,
  fadeUpVariants,
  inViewViewport,
  scaleUpVariants,
  type RevealDelay,
} from '@/lib/scroll-motion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: RevealDelay;
  variant?: 'up' | 'scale' | 'left' | 'right';
}

const variantMap = {
  up: fadeUpVariants,
  left: fadeLeftVariants,
  right: fadeRightVariants,
  scale: scaleUpVariants,
} as const;

export default function Reveal({
  children,
  className = '',
  delay = 'none',
  variant = 'up',
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      custom={delaySteps[delay]}
      initial="hidden"
      whileInView="visible"
      viewport={inViewViewport}
      variants={variantMap[variant]}
    >
      {children}
    </motion.div>
  );
}