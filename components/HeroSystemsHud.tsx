'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { heroFadeUp, heroEase } from '@/lib/hero-motion';

interface HeroSystemsHudProps {
  sectorLabel?: string;
  className?: string;
}

interface StatConfig {
  label: string;
  to: number;
  prefix?: string;
  suffix?: string;
}

const STATS: StatConfig[] = [
  { label: 'Sites Deployed', to: 48, suffix: '+' },
  { label: 'Avg Build Time', to: 1, suffix: ' Day' },
  { label: 'Ownership', to: 100, suffix: '%' },
  { label: 'Response', to: 24, prefix: '< ', suffix: ' Hrs' },
];

function useCountUp(target: number, duration = 1.35, delay = 0, enabled = true) {
  const [value, setValue] = useState(enabled ? 0 : target);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }

    let frame = 0;
    let start: number | null = null;
    const delayMs = delay * 1000;
    const durationMs = duration * 1000;
    let delayTimer: number;

    const tick = (ts: number) => {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    delayTimer = window.setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      window.clearTimeout(delayTimer);
      cancelAnimationFrame(frame);
    };
  }, [target, duration, delay, enabled]);

  return value;
}

function StatReadout({ stat, index }: { stat: StatConfig; index: number }) {
  const prefersReducedMotion = useReducedMotion();
  const delay = 0.55 + index * 0.12;
  const value = useCountUp(stat.to, 1.25, delay, !prefersReducedMotion);

  return (
    <motion.div
      className="hero-systems__stat"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: heroEase }}
    >
      <span className="hero-systems__stat-label">{stat.label}</span>
      <span className="hero-systems__stat-value">
        {stat.prefix}
        {value}
        {stat.suffix}
      </span>
    </motion.div>
  );
}

export default function HeroSystemsHud({
  sectorLabel = 'Gorge Overlook · Sector Alpha',
  className = '',
}: HeroSystemsHudProps) {
  const rootClass = ['hero-systems', className].filter(Boolean).join(' ');

  return (
    <motion.aside
      className={rootClass}
      aria-label="Systems status"
      {...heroFadeUp(1.15)}
    >
      <div className="hero-systems__panel">
        <div className="hero-systems__header">
          <span className="hero-systems__sector">{sectorLabel}</span>
          <div className="hero-systems__status">
            <span className="hero-systems__status-dot" aria-hidden="true" />
            <span>Systems Online</span>
          </div>
        </div>

        <div className="hero-systems__stats">
          {STATS.map((stat, index) => (
            <StatReadout key={stat.label} stat={stat} index={index} />
          ))}
        </div>

        <div className="hero-systems__footer" aria-hidden="true">
          <span>NRG BRIDGE UPLINK</span>
          <span className="hero-systems__footer-live">Live</span>
        </div>
      </div>
    </motion.aside>
  );
}