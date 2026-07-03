'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

type EnterVariant = 'rise' | 'slide-left' | 'slide-right' | 'scale' | 'depth';

interface RoomEnterProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: EnterVariant;
}

const variants: Record<EnterVariant, Variants> = {
  rise: {
    hidden: { opacity: 0, y: 72, rotateX: 18, scale: 0.88 },
    show: { opacity: 1, y: 0, rotateX: 0, scale: 1 },
  },
  'slide-left': {
    hidden: { opacity: 0, x: -80, rotateY: 14, scale: 0.9 },
    show: { opacity: 1, x: 0, rotateY: 0, scale: 1 },
  },
  'slide-right': {
    hidden: { opacity: 0, x: 80, rotateY: -14, scale: 0.9 },
    show: { opacity: 1, x: 0, rotateY: 0, scale: 1 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.82, rotateX: 10 },
    show: { opacity: 1, scale: 1, rotateX: 0 },
  },
  depth: {
    hidden: { opacity: 0, z: -120, scale: 1.08, rotateX: 8 },
    show: { opacity: 1, z: 0, scale: 1, rotateX: 0 },
  },
};

export default function RoomEnter({
  children,
  className = '',
  delay = 0,
  variant = 'rise',
}: RoomEnterProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const v = variants[variant];

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.2, margin: '-60px' }}
      variants={v}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformPerspective: 1400 }}
    >
      {children}
    </motion.div>
  );
}