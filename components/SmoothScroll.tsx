'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { notifyScroll, setScrollDriverEnabled } from '@/lib/scroll-driver';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const narrow = window.matchMedia('(max-width: 767px)');

    const applyMotionPreference = () => {
      const reduce = reducedMotion.matches;
      setScrollDriverEnabled(!reduce);
      return reduce;
    };

    if (applyMotionPreference()) return;

    const mobile = narrow.matches;

    const lenis = new Lenis({
      duration: mobile ? 1.05 : 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.2,
      wheelMultiplier: mobile ? 0.95 : 0.85,
      lerp: mobile ? 0.14 : 0.1,
    });

    document.documentElement.classList.add('lenis', 'lenis-smooth');

    lenis.on('scroll', notifyScroll);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onReducedChange = () => {
      if (reducedMotion.matches) {
        cancelAnimationFrame(raf);
        document.documentElement.classList.remove('lenis', 'lenis-smooth');
        lenis.destroy();
        setScrollDriverEnabled(false);
      }
    };

    reducedMotion.addEventListener('change', onReducedChange);

    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -72, duration: mobile ? 1.1 : 1.4 });
      });
    });

    window.addEventListener('resize', notifyScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', notifyScroll);
      reducedMotion.removeEventListener('change', onReducedChange);
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
      lenis.destroy();
      setScrollDriverEnabled(true);
    };
  }, []);

  return <>{children}</>;
}