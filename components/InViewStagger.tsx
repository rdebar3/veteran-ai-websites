'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import {
  inViewViewport,
  staggerCardChildVariants,
  staggerContainerVariants,
  staggerTextChildVariants,
} from '@/lib/scroll-motion';

type InViewItemVariant = 'text' | 'card';

interface InViewStaggerProps extends HTMLMotionProps<'div'> {
  stagger?: number;
  children: ReactNode;
}

interface InViewItemProps extends HTMLMotionProps<'div'> {
  variant?: InViewItemVariant;
  children: ReactNode;
}

export function InViewStagger({
  stagger = 0.08,
  children,
  className = '',
  ...rest
}: InViewStaggerProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={inViewViewport}
      variants={staggerContainerVariants}
      custom={stagger}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function InViewItem({
  variant = 'text',
  children,
  className = '',
  ...rest
}: InViewItemProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={variant === 'card' ? staggerCardChildVariants : staggerTextChildVariants}
      {...rest}
    >
      {children}
    </motion.div>
  );
}