'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

type Phase = 'establish' | 'alert' | 'penetrate' | 'hvac' | 'outro';

const PHASE_ORDER: Phase[] = ['establish', 'alert', 'penetrate', 'hvac', 'outro'];

const TIMINGS: Record<Exclude<Phase, 'alert'>, number> = {
  establish: 3000,
  penetrate: 2400,
  hvac: 3200,
  outro: 1400,
};

interface CinematicEntranceProps {
  onComplete: () => void;
}

export default function CinematicEntrance({ onComplete }: CinematicEntranceProps) {
  const prefersReduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('establish');
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const timersRef = useRef<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const finish = useCallback(() => {
    clearTimers();
    setVisible(false);
    onComplete();
  }, [clearTimers, onComplete]);

  const advanceTo = useCallback(
    (next: Phase) => {
      clearTimers();
      setPhase(next);

      if (next === 'outro') {
        const id = window.setTimeout(() => finish(), TIMINGS.outro);
        timersRef.current.push(id);
        return;
      }

      if (next === 'alert') return;

      const upcoming = PHASE_ORDER[PHASE_ORDER.indexOf(next) + 1];
      if (upcoming) {
        const id = window.setTimeout(() => advanceTo(upcoming), TIMINGS[next]);
        timersRef.current.push(id);
      }
    },
    [clearTimers, finish]
  );

  const enterHome = useCallback(() => {
    if (phase === 'establish' || phase === 'alert') {
      advanceTo('penetrate');
    }
  }, [phase, advanceTo]);

  useEffect(() => {
    if (prefersReduced) {
      finish();
      return;
    }

    const id = window.setTimeout(() => advanceTo('alert'), TIMINGS.establish);
    timersRef.current.push(id);

    return clearTimers;
  }, [prefersReduced, finish, advanceTo, clearTimers]);

  useEffect(() => {
    const idx = PHASE_ORDER.indexOf(phase);
    setProgress((idx + 1) / PHASE_ORDER.length);
  }, [phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && phase === 'alert') {
        e.preventDefault();
        enterHome();
      }
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, enterHome, finish]);

  useEffect(() => {
    if (phase !== 'establish' && phase !== 'alert') return;

    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
      setParallax({ x, y });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [phase]);

  const showAlert = phase === 'alert';
  const showPenetrate = phase === 'penetrate';
  const showHvac = phase === 'hvac' || phase === 'outro';
  const penetrating = phase === 'penetrate' || phase === 'hvac';

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={containerRef}
          className={`hv-intro${penetrating ? ' hv-intro--penetrating' : ''}`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-label="Appalachian HVAC smart climate intro"
        >
          <div className="hv-intro__hud">
            <span className="hv-intro__hud-dot" />
            <span>Climate Command · Ridgeview Sector</span>
            {showAlert && <span className="hv-intro__hud-live">· Zone Acquired</span>}
          </div>

          <button type="button" className="hv-intro__skip" onClick={finish}>
            Skip Intro →
          </button>

          <motion.div
            className="hv-intro__stage"
            style={{ perspective: 1400 }}
            animate={{
              rotateX: penetrating ? -3 : 0,
              rotateY: parallax.x * 0.12,
            }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          >
            <motion.div
              className="hv-intro__scene hv-intro__scene--mountains"
              style={{
                backgroundImage: "url('/demos/complete-hvac/entrance-mountains.jpg')",
                transformStyle: 'preserve-3d',
              }}
              initial={{ scale: 1.08 }}
              animate={{
                scale: phase === 'establish' ? 1 : showPenetrate ? 3.4 : showAlert ? 1.04 : 1.1,
                opacity: showHvac ? 0 : showPenetrate ? 0.06 : 1,
                x: showPenetrate ? 0 : parallax.x,
                y: showPenetrate ? 0 : parallax.y,
                rotateX: showPenetrate ? 14 : 0,
                z: showPenetrate ? -140 : 0,
                filter: showPenetrate ? 'blur(14px) brightness(0.45)' : 'blur(0px) brightness(1)',
              }}
              transition={{
                duration: phase === 'establish' ? 3 : showPenetrate ? 2.2 : 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
            />

            <motion.div
              className="hv-intro__scene hv-intro__scene--home"
              style={{
                backgroundImage: "url('/demos/complete-hvac/entrance-home.jpg')",
                transformStyle: 'preserve-3d',
              }}
              initial={{ opacity: 0, scale: 1.55 }}
              animate={{
                opacity: showPenetrate ? 1 : showHvac ? 0 : 0,
                scale: showPenetrate ? 1 : showHvac ? 1.2 : 1.7,
                rotateX: showPenetrate ? 0 : 6,
                z: showPenetrate ? 50 : -90,
                filter: showPenetrate ? 'blur(0px) brightness(1.08)' : 'blur(10px)',
              }}
              transition={{ duration: 2, ease: [0.12, 0.9, 0.24, 1] }}
            />

            <motion.div
              className="hv-intro__tunnel"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{
                opacity: showPenetrate ? 1 : 0,
                scale: showPenetrate ? 2.8 : 0.4,
              }}
              transition={{ duration: 2.1, ease: [0.12, 0.85, 0.22, 1] }}
              aria-hidden
            >
              <div className="hv-intro__tunnel-frame" />
            </motion.div>

            <motion.div
              className="hv-intro__scene hv-intro__scene--hvac"
              style={{
                backgroundImage: "url('/demos/complete-hvac/entrance-hvac.jpg')",
                transformStyle: 'preserve-3d',
              }}
              initial={{ opacity: 0, scale: 1.45 }}
              animate={{
                opacity: showHvac ? 1 : 0,
                scale: showHvac ? 1 : 1.45,
                rotateX: showHvac ? 0 : -6,
                z: showHvac ? 90 : 0,
                filter: showHvac ? 'blur(0px) brightness(1.05)' : 'blur(8px)',
              }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>

          <AnimatePresence>
            {showAlert && (
              <motion.div
                className="hv-intro__ping"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.5 }}
                aria-hidden
              >
                <span className="hv-intro__ping-ring" />
                <span className="hv-intro__ping-ring hv-intro__ping-ring--2" />
                <span className="hv-intro__ping-dot" />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showAlert && !showHvac && (
              <motion.div
                className="hv-intro__alert-card"
                initial={{ opacity: 0, y: 32, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              >
                <motion.span
                  className="hv-intro__alert-badge"
                  animate={{ scale: [1, 1.04, 1], opacity: [0.9, 1, 0.9] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  Smart Climate Zone
                </motion.span>
                <h2 className="hv-intro__alert-title">Modern home detected · 128 Mountain View Rd</h2>
                <p className="hv-intro__alert-sub">HVAC network online · Ridgeview, WV</p>
                <button type="button" className="hv-intro__alert-btn" onClick={enterHome}>
                  Enter Smart Home →
                </button>
                <p className="hv-intro__alert-hint">Click to fly into the climate system</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showHvac && (
              <motion.div
                className="hv-intro__caption"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="hv-intro__caption-tag">System Online</span>
                <h2>Glowing HVAC climate network</h2>
                <p>Appalachian HVAC Solutions — deploying comfort.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`hv-intro__particles ${showHvac ? 'hv-intro__particles--active' : ''}`} aria-hidden>
            <span /><span /><span /><span /><span />
          </div>

          <div className="hv-intro__neural" aria-hidden />
          <div className="hv-intro__speedlines" aria-hidden />
          <div className="hv-intro__scanlines" />
          <div className="hv-intro__grid" />
          <div className="hv-intro__vignette" />

          <div className="hv-intro__progress" aria-hidden>
            <div className="hv-intro__progress-fill" style={{ width: `${progress * 100}%` }} />
            <div className="hv-intro__progress-dots">
              {PHASE_ORDER.map((p, i) => (
                <span
                  key={p}
                  className={`hv-intro__progress-dot ${PHASE_ORDER.indexOf(phase) >= i ? 'hv-intro__progress-dot--on' : ''}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}