'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getHeroMotionTier, type HeroMotionTier } from '@/lib/hero-motion';

const NODES: [number, number][] = [
  [120, 140], [280, 220], [420, 160], [560, 280], [720, 190],
  [880, 310], [1040, 200], [1180, 340], [1320, 260],
  [200, 420], [380, 520], [540, 460], [700, 580], [860, 490],
  [1020, 620], [1160, 540], [300, 700], [620, 760], [940, 720],
];

const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8],
  [1, 9], [3, 10], [4, 11], [5, 12], [6, 13], [7, 14], [8, 14],
  [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15],
  [9, 16], [11, 17], [13, 18], [16, 17], [17, 18],
];

function driftForTier(tier: HeroMotionTier) {
  if (tier === 'full') {
    return {
      x: [0, 14, -10, 6, 0],
      y: [0, -8, 6, -4, 0],
      transition: { duration: 52, repeat: Infinity, ease: 'linear' as const },
    };
  }

  if (tier === 'lite') {
    return {
      x: [0, 6, 0],
      y: [0, -4, 0],
      transition: { duration: 36, repeat: Infinity, ease: 'linear' as const },
    };
  }

  return false;
}

export default function HeroConstellationMesh() {
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

  const drift = driftForTier(tier);

  return (
    <div className="hero__constellation" aria-hidden="true">
      <motion.svg
        className="hero__constellation-svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        animate={drift || undefined}
      >
        <g className="hero__constellation-lines" stroke="rgba(34, 211, 238, 0.14)" strokeWidth="0.75" fill="none">
          {EDGES.map(([a, b]) => {
            const [x1, y1] = NODES[a];
            const [x2, y2] = NODES[b];
            return <line key={`${a}-${b}`} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>
        <g className="hero__constellation-nodes" fill="rgba(34, 211, 238, 0.35)">
          {NODES.map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={i % 4 === 0 ? 2.2 : 1.4} />
          ))}
        </g>
      </motion.svg>
    </div>
  );
}