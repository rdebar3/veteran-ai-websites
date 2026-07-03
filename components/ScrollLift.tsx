'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { getViewProgress } from '@/lib/scroll-cinema';

interface ScrollLiftProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/** Progressive lift + fade for cards and blocks as they enter view. */
export default function ScrollLift({ children, className = '', delay = 0 }: ScrollLiftProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }

    let raf = 0;

    const tick = () => {
      const raw = getViewProgress(el);
      const p = Math.min(1, Math.max(0, (raw - delay) / (1 - delay)));
      const eased = p * p * (3 - 2 * p);
      el.style.opacity = String(0.4 + eased * 0.6);
      el.style.transform = `translate3d(0, ${(1 - eased) * 40}px, 0) scale(${0.97 + eased * 0.03})`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [delay]);

  return (
    <div ref={ref} className={`scroll-lift ${className}`.trim()}>
      {children}
    </div>
  );
}