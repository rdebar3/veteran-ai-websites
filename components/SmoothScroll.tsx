'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import {
  runScrollFrame,
  setLenisInstance,
  setScrollDriverEnabled,
} from '@/lib/scroll-driver';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const narrow = window.matchMedia('(max-width: 767px)');

    if (reducedMotion.matches) {
      let ticking = false;
      const onNativeScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          runScrollFrame();
          ticking = false;
        });
      };

      runScrollFrame();
      window.addEventListener('scroll', onNativeScroll, { passive: true });
      window.addEventListener('resize', () => runScrollFrame(), { passive: true });

      return () => {
        window.removeEventListener('scroll', onNativeScroll);
      };
    }

    setScrollDriverEnabled(true);

    const mobile = narrow.matches;

    const lenis = new Lenis({
      lerp: mobile ? 0.12 : 0.1,
      smoothWheel: true,
      syncTouch: mobile,
      syncTouchLerp: 0.12,
      touchInertiaExponent: 1.35,
      touchMultiplier: 1,
      wheelMultiplier: 1,
      autoResize: true,
    });

    setLenisInstance(lenis);
    document.documentElement.classList.add('lenis', 'lenis-smooth');

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      runScrollFrame();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onReducedChange = () => {
      if (reducedMotion.matches) {
        cancelAnimationFrame(raf);
        document.documentElement.classList.remove('lenis', 'lenis-smooth');
        setLenisInstance(null);
        lenis.destroy();
        setScrollDriverEnabled(false);
      }
    };

    reducedMotion.addEventListener('change', onReducedChange);

    const onAnchorClick = (e: Event) => {
      const anchor = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, {
        offset: -72,
        lock: true,
      });
    };

    document.addEventListener('click', onAnchorClick);

    const onResize = () => runScrollFrame();
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('click', onAnchorClick);
      window.removeEventListener('resize', onResize);
      reducedMotion.removeEventListener('change', onReducedChange);
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
      setLenisInstance(null);
      lenis.destroy();
      setScrollDriverEnabled(true);
    };
  }, []);

  return <>{children}</>;
}