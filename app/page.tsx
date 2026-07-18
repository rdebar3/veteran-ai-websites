'use client';

import { useEffect } from 'react';
import VideoHero from '@/components/VideoHero';
import MontiTeaser from '@/components/MontiTeaser';
import Demos from '@/components/Demos';
import Packages from '@/components/Packages';
import Reviews from '@/components/Reviews';
import Intake from '@/components/Intake';
import LowerBackdrop from '@/components/LowerBackdrop';
import Veterans from '@/components/Veterans';
import { scrollToY, resizeScroll } from '@/lib/scroll-driver';

/**
 * Clean homepage:
 * Scroll-scrubbed video hero → Monti teaser → live demos → packages & checkout → reviews → project intake.
 */
export default function Home() {
  // Return visitors to the exact spot they left from when they open a demo.
  useEffect(() => {
    if (sessionStorage.getItem('vaw:restore') !== '1') return;
    sessionStorage.removeItem('vaw:restore');
    const raw = sessionStorage.getItem('vaw:returnY');
    sessionStorage.removeItem('vaw:returnY');
    const y = raw ? parseInt(raw, 10) : NaN;
    if (!Number.isFinite(y) || y <= 0) return;
    let tries = 0;
    const restore = () => {
      resizeScroll();
      const reachable = document.body.scrollHeight - window.innerHeight;
      if (reachable >= y - 4) {
        scrollToY(y, { immediate: true, lock: true });
        setTimeout(() => scrollToY(y, { immediate: true }), 120);
        setTimeout(() => scrollToY(y, { immediate: true }), 360);
        return;
      }
      if (tries++ < 120) requestAnimationFrame(restore);
    };
    restore();
  }, []);

  return (
    <main className="relative flex-1">
      <h1 className="sr-only">Veteran AI Websites — West Virginia veteran-owned web design</h1>
      <VideoHero />
      <LowerBackdrop>
        <MontiTeaser />
        <Demos />
        <Packages />
        <Veterans />
        <Reviews />
        <Intake />
      </LowerBackdrop>
    </main>
  );
}
