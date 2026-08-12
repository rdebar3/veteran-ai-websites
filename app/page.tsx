'use client';

import { useEffect } from 'react';
import VideoHero from '@/components/VideoHero';
import OwnerIntro from '@/components/OwnerIntro';
import VeteranBand from '@/components/VeteranBand';
import Demos from '@/components/Demos';
import Packages from '@/components/Packages';
import Ownership from '@/components/Ownership';
import Reviews from '@/components/Reviews';
import Intake from '@/components/Intake';
import LowerBackdrop from '@/components/LowerBackdrop';
import Veterans from '@/components/Veterans';
import { scrollToY, resizeScroll } from '@/lib/scroll-driver';

/**
 * Clean homepage:
 * Video hero → owner → demos → packages → ownership → veterans → contact → review.
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
    <main id="main-content" className="relative flex-1">
      <h1 className="sr-only">More calls for your business. Built in a day.</h1>
      <VideoHero />
      <OwnerIntro />
      <LowerBackdrop>
        <VeteranBand />
        <Demos />
        <Packages />
        <Ownership />
        <Veterans />
        <Intake />
        <Reviews />
      </LowerBackdrop>
    </main>
  );
}
