'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { inViewViewport, scaleUpVariants } from '@/lib/scroll-motion';

interface ScrollLiftProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  depth?: boolean;
}

/** Card/image entrance: fade in + scale 96% → 100% on scroll. */
export default function ScrollLift({
  children,
  className = '',
  delay = 0,
  depth = true,
}: ScrollLiftProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={inViewViewport}
      variants={scaleUpVariants}
      style={{ transformOrigin: depth ? 'center bottom' : 'center center' }}
    >
      {children}
    </motion.div>
  );
}