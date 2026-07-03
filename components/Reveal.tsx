'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type RevealDelay = 'none' | '1' | '2' | '3' | '4' | '5';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: RevealDelay;
  variant?: 'up' | 'scale' | 'left' | 'right';
}

const delayMs: Record<RevealDelay, number> = {
  none: 0,
  '1': 80,
  '2': 160,
  '3': 240,
  '4': 320,
  '5': 400,
};

/** One-shot entrance via IntersectionObserver — stays in sync with Lenis scroll. */
export default function Reveal({
  children,
  className = '',
  delay = 'none',
  variant = 'up',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.classList.add('reveal--in');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const ms = delayMs[delay];
        if (ms > 0) {
          el.style.transitionDelay = `${ms}ms`;
        }

        el.classList.add('reveal--in');
        observer.disconnect();
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const delayClass = delay !== 'none' ? `reveal--d${delay}` : '';

  return (
    <div
      ref={ref}
      className={`reveal reveal--${variant} ${delayClass} ${className}`.trim()}
    >
      {children}
    </div>
  );
}