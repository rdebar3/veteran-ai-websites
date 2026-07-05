'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  getHeroMotionTier,
  heroWordVariants,
  type HeroMotionTier,
} from '@/lib/hero-motion';

const WORDS = [
  { text: 'Veteran', className: 'hero__title-word hero__title-word--primary' },
  { text: 'AI', className: 'hero__title-word hero__title-word--primary' },
  { text: 'Websites', className: 'hero__title-word hero__title-accent hero__title-accent--shimmer' },
] as const;

export default function HeroHeadline() {
  const [tier, setTier] = useState<HeroMotionTier>('lite');
  const [shimmerReady, setShimmerReady] = useState(false);

  useEffect(() => {
    const sync = () => setTier(getHeroMotionTier());
    sync();

    const mq = window.matchMedia('(max-width: 767px)');
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', sync);
    motionMq.addEventListener('change', sync);

    const shimmerTimer = window.setTimeout(() => setShimmerReady(true), 1100);

    return () => {
      mq.removeEventListener('change', sync);
      motionMq.removeEventListener('change', sync);
      window.clearTimeout(shimmerTimer);
    };
  }, []);

  const staticMotion = tier === 'static';

  return (
    <div className="hero__title-wrap">
      <div className="hero__title-glow" aria-hidden="true">
        <motion.div
          className="hero__title-glow-layer hero__title-glow-layer--cyan"
          animate={staticMotion ? undefined : { opacity: [0.55, 0.25, 0.55] }}
          transition={
            staticMotion ? undefined : { duration: 9, repeat: Infinity, ease: 'easeInOut' }
          }
        />
        <motion.div
          className="hero__title-glow-layer hero__title-glow-layer--amber"
          animate={staticMotion ? undefined : { opacity: [0.2, 0.5, 0.2] }}
          transition={
            staticMotion ? undefined : { duration: 9, repeat: Infinity, ease: 'easeInOut' }
          }
        />
      </div>

      <h1 className="hero__title">
        <span className="hero__title-row">
          {WORDS.slice(0, 2).map((word, index) =>
            staticMotion ? (
              <span key={word.text} className={word.className}>
                {word.text}
                {index === 0 ? ' ' : ''}
              </span>
            ) : (
              <motion.span
                key={word.text}
                className={word.className}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={heroWordVariants}
              >
                {word.text}
                {index === 0 ? ' ' : ''}
              </motion.span>
            )
          )}
        </span>

        {staticMotion ? (
          <span className={WORDS[2].className}>{WORDS[2].text}</span>
        ) : (
          <motion.span
            className={`${WORDS[2].className}${shimmerReady ? ' hero__title-accent--shimmer-active' : ''}`}
            custom={2}
            initial="hidden"
            animate="visible"
            variants={heroWordVariants}
          >
            {WORDS[2].text}
          </motion.span>
        )}
      </h1>
    </div>
  );
}