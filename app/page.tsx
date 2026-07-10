'use client';

import VideoHero from '@/components/VideoHero';
import Demos from '@/components/Demos';
import Packages from '@/components/Packages';
import Reviews from '@/components/Reviews';
import Intake from '@/components/Intake';
import LowerBackdrop from '@/components/LowerBackdrop';
import Veterans from '@/components/Veterans';

/**
 * Clean homepage:
 * Scroll-scrubbed video hero → live demos → packages & checkout → reviews → project intake.
 */
export default function Home() {
  return (
    <main className="relative flex-1">
      <h1 className="sr-only">Veteran AI Websites — West Virginia veteran-owned web design</h1>
      <VideoHero />
      <LowerBackdrop>
        <Demos />
        <Packages />
        <Veterans />
        <Reviews />
        <Intake />
      </LowerBackdrop>
    </main>
  );
}
