'use client';

import { useEffect, useState } from 'react';
import { getHeroMotionTier, type HeroMotionTier } from '@/lib/hero-motion';

export default function HeroRadarSweep() {
  const [tier, setTier] = useState<HeroMotionTier>('lite');

  useEffect(() => {
    const sync = () => setTier(getHeroMotionTier());
    sync();

    const mq = window.matchMedia('(max-width: 767px)');
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', sync);
    motionMq.addEventListener('change', sync);
    return () => {
      mq.removeEventListener('change', sync);
      motionMq.removeEventListener('change', sync);
    };
  }, []);

  if (tier === 'static') return null;

  return (
    <div
      className={`hero__radar ${tier === 'lite' ? 'hero__radar--lite' : ''}`}
      aria-hidden="true"
    >
      <div className="hero__radar-ring" />
      <div className="hero__radar-sweep" />
    </div>
  );
}