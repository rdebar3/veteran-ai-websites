'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface ScrollLiftProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  depth?: boolean;
}

/** One-shot entrance via IntersectionObserver + CSS (no scroll rAF). */
export default function ScrollLift({ children, className = '', delay = 0, depth = true }: ScrollLiftProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.classList.add('scroll-lift--in');
      return;
    }

    if (delay > 0) {
      el.style.transitionDelay = `${delay}s`;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('scroll-lift--in');
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`scroll-lift ${depth ? 'scroll-lift--depth' : 'scroll-lift--flat'} ${className}`.trim()}
    >
      {children}
    </div>
  );
}