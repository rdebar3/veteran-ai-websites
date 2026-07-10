'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

type Phase = 'establish' | 'alert' | 'penetrate' | 'fireplace' | 'outro';

const PHASE_ORDER: Phase[] = ['establish', 'alert', 'penetrate', 'fireplace', 'outro'];

const TIMINGS: Record<Exclude<Phase, 'alert'>, number> = {
  establish: 3200,
  penetrate: 2600,
  fireplace: 3400,
  outro: 1500,
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
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 5;
      setParallax({ x, y });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [phase]);

  const showAlert = phase === 'alert';
  const showPenetrate = phase === 'penetrate';
  const showFireplace = phase === 'fireplace' || phase === 'outro';
  const penetrating = phase === 'penetrate' || phase === 'fireplace';

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={containerRef}
          className={`hv-intro${penetrating ? ' hv-intro--penetrating' : ''}`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-label="Appalachian HVAC fall welcome intro"
        >
          <div className="hv-intro__tag">
            <span className="hv-intro__tag-leaf" aria-hidden>🍂</span>
            Ridgeview, West Virginia · Fall Season
          </div>

          <button type="button" className="hv-intro__skip" onClick={finish}>
            Skip Intro →
          </button>

          <motion.div
            className="hv-intro__stage"
            style={{ perspective: 1300 }}
            animate={{
              rotateX: penetrating ? -2 : 0,
              rotateY: parallax.x * 0.1,
            }}
            transition={{ type: 'spring', stiffness: 70, damping: 22 }}
          >
            <motion.div
              className="hv-intro__scene hv-intro__scene--mountains"
              style={{
                backgroundImage: "url('/demos/complete-hvac/entrance-fall-mountains.jpg?v=2')",
                transformStyle: 'preserve-3d',
              }}
              initial={{ scale: 1.1 }}
              animate={{
                scale: phase === 'establish' ? 1 : showPenetrate ? 3.2 : showAlert ? 1.03 : 1.08,
                opacity: showFireplace ? 0 : showPenetrate ? 0.08 : 1,
                x: showPenetrate ? 0 : parallax.x,
                y: showPenetrate ? 0 : parallax.y,
                rotateX: showPenetrate ? 10 : 0,
                z: showPenetrate ? -120 : 0,
                filter: showPenetrate ? 'blur(10px) brightness(0.55)' : 'blur(0px) brightness(1)',
              }}
              transition={{
                duration: phase === 'establish' ? 3.2 : showPenetrate ? 2.4 : 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
            />

            <motion.div
              className="hv-intro__scene hv-intro__scene--home"
              style={{
                backgroundImage: "url('/demos/complete-hvac/entrance-fall-home.jpg?v=2')",
                transformStyle: 'preserve-3d',
              }}
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{
                opacity: showPenetrate ? 1 : showFireplace ? 0 : 0,
                scale: showPenetrate ? 1 : showFireplace ? 1.15 : 1.65,
                rotateX: showPenetrate ? 0 : 5,
                z: showPenetrate ? 45 : -80,
                filter: showPenetrate ? 'blur(0px) brightness(1.05)' : 'blur(8px)',
              }}
              transition={{ duration: 2.1, ease: [0.12, 0.9, 0.24, 1] }}
            />

            <motion.div
              className="hv-intro__portal"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                opacity: showPenetrate ? 1 : 0,
                scale: showPenetrate ? 2.5 : 0.5,
              }}
              transition={{ duration: 2.2, ease: [0.12, 0.85, 0.22, 1] }}
              aria-hidden
            >
              <div className="hv-intro__portal-frame" />
            </motion.div>

            <motion.div
              className="hv-intro__scene hv-intro__scene--fireplace"
              style={{
                backgroundImage: "url('/demos/complete-hvac/entrance-fireplace.jpg?v=2')",
                transformStyle: 'preserve-3d',
              }}
              initial={{ opacity: 0, scale: 1.4 }}
              animate={{
                opacity: showFireplace ? 1 : 0,
                scale: showFireplace ? 1 : 1.4,
                rotateX: showFireplace ? 0 : -5,
                z: showFireplace ? 80 : 0,
                filter: showFireplace ? 'blur(0px) brightness(1.02)' : 'blur(6px)',
              }}
              transition={{ duration: 1.7, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>

          <div className={`hv-intro__fire-glow ${showFireplace ? 'hv-intro__fire-glow--active' : ''}`} aria-hidden />

          <AnimatePresence>
            {showAlert && (
              <motion.div
                className="hv-intro__warmth"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.5 }}
                aria-hidden
              >
                <span className="hv-intro__warmth-ring" />
                <span className="hv-intro__warmth-ring hv-intro__warmth-ring--2" />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showAlert && !showFireplace && (
              <motion.div
                className="hv-intro__alert-card"
                initial={{ opacity: 0, y: 28, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 110, damping: 18 }}
              >
                <motion.span
                  className="hv-intro__alert-badge"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  Cozy Home Found
                </motion.span>
                <h2 className="hv-intro__alert-title">128 Mountain View Road · Ridgeview</h2>
                <p className="hv-intro__alert-sub">HVAC system ready · fireplace warming</p>
                <button type="button" className="hv-intro__alert-btn" onClick={enterHome}>
                  Step Inside →
                </button>
                <p className="hv-intro__alert-hint">Click to enter the home</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showFireplace && (
              <motion.div
                className="hv-intro__caption"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="hv-intro__caption-tag">Welcome Home</span>
                <h2>Warmth you can feel, comfort you can trust</h2>
                <p>Appalachian HVAC Solutions — keeping Ridgeview cozy.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="hv-intro__leaves" aria-hidden />
          <div className="hv-intro__warm-veil" />
          <div className="hv-intro__vignette" />

          <div className="hv-intro__progress" aria-hidden>
            <div className="hv-intro__progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}