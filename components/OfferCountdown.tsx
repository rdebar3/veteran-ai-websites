'use client';

import { useEffect, useState } from 'react';
import {
  getTimeRemaining,
  padCountdownUnit,
  type TimeRemaining,
} from '@/lib/offer-countdown';

interface OfferCountdownProps {
  compact?: boolean;
  className?: string;
}

const SEGMENTS: { key: keyof Pick<TimeRemaining, 'days' | 'hours' | 'minutes' | 'seconds'>; label: string }[] = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hrs' },
  { key: 'minutes', label: 'Min' },
  { key: 'seconds', label: 'Sec' },
];

export default function OfferCountdown({ compact = false, className = '' }: OfferCountdownProps) {
  const [remaining, setRemaining] = useState<TimeRemaining | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(getTimeRemaining());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const rootClass = [
    'offer-countdown',
    compact ? 'offer-countdown--compact' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass} role="timer" aria-live="polite" aria-atomic="true">
      <span className="offer-countdown__label">Offer Expires In</span>
      <div className="offer-countdown__segments">
        {SEGMENTS.map(({ key, label }) => (
          <div key={key} className="offer-countdown__segment">
            <span className="offer-countdown__value" suppressHydrationWarning>
              {remaining ? padCountdownUnit(remaining[key]) : '--'}
            </span>
            <span className="offer-countdown__unit">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}