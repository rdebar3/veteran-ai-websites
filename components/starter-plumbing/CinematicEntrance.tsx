'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const STORAGE_KEY = 'summit-plumbing-intro-v2';

type Phase = 'exterior' | 'door' | 'leak' | 'outro';

interface CinematicEntranceProps {
  onComplete: () => void;
}

export default function CinematicEntrance({ onComplete }: CinematicEntranceProps) {
  const prefersReduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('exterior');
  const [visible, setVisible] = useState(true);

  const finish = useCallback(() => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, '1');
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (prefersReduced) {
      finish();
      return;
    }

    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (seen) {
      setVisible(false);
      onComplete();
      return;
    }

    const t1 = window.setTimeout(() => setPhase('door'), 2400);
    const t2 = window.setTimeout(() => setPhase('leak'), 3800);
    const t3 = window.setTimeout(() => setPhase('outro'), 5800);
    const t4 = window.setTimeout(() => finish(), 6800);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [prefersReduced, finish, onComplete]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="sp-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          role="presentation"
          aria-hidden="true"
        >
          <div className="sp-intro__hud">
            <span className="sp-intro__hud-dot" />
            <span>Emergency Dispatch · Ridgeview Sector</span>
          </div>

          <button type="button" className="sp-intro__skip" onClick={finish}>
            Skip Intro →
          </button>

          {/* Scene 1 — fly toward WV house */}
          <motion.div
            className="sp-intro__scene sp-intro__scene--exterior"
            style={{ backgroundImage: "url('/demos/starter-plumbing/entrance-exterior.jpg')" }}
            animate={
              phase === 'exterior'
                ? { scale: [0.42, 1.08], opacity: 1, filter: 'blur(0px)' }
                : phase === 'door'
                  ? { scale: 1.45, opacity: 0.35, filter: 'blur(6px)' }
                  : { scale: 1.6, opacity: 0, filter: 'blur(12px)' }
            }
            transition={{ duration: phase === 'exterior' ? 2.4 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Scene 2 — door rush flash */}
          <AnimatePresence>
            {(phase === 'door' || phase === 'leak') && (
              <motion.div
                className="sp-intro__door-flash"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: phase === 'door' ? 0.85 : 0, scale: 2.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>

          {/* Scene 3 — leak under sink */}
          <motion.div
            className="sp-intro__scene sp-intro__scene--leak"
            style={{ backgroundImage: "url('/demos/starter-plumbing/entrance-leak.jpg')" }}
            initial={{ opacity: 0, scale: 1.35 }}
            animate={
              phase === 'leak' || phase === 'outro'
                ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
                : { opacity: 0, scale: 1.35, filter: 'blur(8px)' }
            }
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />

          <div className={`sp-intro__drip ${phase === 'leak' || phase === 'outro' ? 'sp-intro__drip--active' : ''}`} aria-hidden="true">
            <span /><span /><span />
          </div>

          <motion.div
            className="sp-intro__caption"
            animate={{ opacity: phase === 'leak' || phase === 'outro' ? 1 : 0, y: phase === 'leak' ? 0 : 24 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="sp-intro__caption-tag">Alert Detected</span>
            <h2>Active leak under the sink</h2>
            <p>Summit Plumbing — deploying now.</p>
          </motion.div>

          <div className="sp-intro__scanlines" />
          <div className="sp-intro__grid" />
          <div className="sp-intro__vignette" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}