'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { getViewProgress } from '@/lib/scroll-cinema';

interface ScrollLiftProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  depth?: boolean;
}

/** Progressive lift + perspective depth as blocks enter view. */
export default function ScrollLift({ children, className = '', delay = 0, depth = true }: ScrollLiftProps) {
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
      const p = Math.min(1, Math.max(0, (raw - delay) / Math.max(0.01, 1 - delay)));
      const eased = p * p * (3 - 2 * p);
      const y = (1 - eased) * 52;
      const scale = depth ? 0.92 + eased * 0.08 : 0.97 + eased * 0.03;
      const rotateX = depth ? (1 - eased) * 12 : 0;
      const z = depth ? (1 - eased) * -80 : 0;

      el.style.opacity = String(0.35 + eased * 0.65);
      el.style.transform = `translate3d(0, ${y}px, ${z}px) scale(${scale}) rotateX(${rotateX}deg)`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [delay, depth]);

  return (
    <div ref={ref} className={`scroll-lift ${depth ? 'scroll-lift--depth' : ''} ${className}`.trim()}>
      {children}
    </div>
  );
}