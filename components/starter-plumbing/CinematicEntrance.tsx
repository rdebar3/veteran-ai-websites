'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

type Phase = 'establish' | 'alert' | 'penetrate' | 'leak' | 'outro';

const PHASE_ORDER: Phase[] = ['establish', 'alert', 'penetrate', 'leak', 'outro'];

const TIMINGS: Record<Exclude<Phase, 'alert'>, number> = {
  establish: 2800,
  penetrate: 2200,
  leak: 3400,
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

      // Pause at alert until the user clicks Investigate (or presses Enter/Space).
      if (next === 'alert') return;

      const upcoming = PHASE_ORDER[PHASE_ORDER.indexOf(next) + 1];
      if (upcoming) {
        const id = window.setTimeout(() => advanceTo(upcoming), TIMINGS[next]);
        timersRef.current.push(id);
      }
    },
    [clearTimers, finish]
  );

  const investigate = useCallback(() => {
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
  }, [prefersReduced, finish, onComplete, advanceTo, clearTimers]);

  useEffect(() => {
    const idx = PHASE_ORDER.indexOf(phase);
    setProgress((idx + 1) / PHASE_ORDER.length);
  }, [phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (phase === 'alert') {
          e.preventDefault();
          investigate();
        }
      }
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, investigate, finish]);

  useEffect(() => {
    if (phase !== 'establish' && phase !== 'alert') return;

    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      setParallax({ x, y });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [phase]);

  const showAlert = phase === 'alert';
  const showPenetrate = phase === 'penetrate';
  const showLeak = phase === 'leak' || phase === 'outro';
  const penetrating = phase === 'penetrate' || phase === 'leak';

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={containerRef}
          className={`sp-intro${penetrating ? ' sp-intro--penetrating' : ''}`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-label="Summit Plumbing emergency dispatch intro"
        >
          <div className="sp-intro__hud">
            <span className="sp-intro__hud-dot" />
            <span>Emergency Dispatch · Ridgeview Sector</span>
            {showAlert && <span className="sp-intro__hud-alert">· Signal Acquired</span>}
          </div>

          <button type="button" className="sp-intro__skip" onClick={finish}>
            Skip Intro →
          </button>

          {/* 3D stage */}
          <motion.div
            className="sp-intro__stage"
            style={{ perspective: 1400 }}
            animate={{
              rotateX: penetrating ? -4 : 0,
              rotateY: parallax.x * 0.15,
            }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          >
            {/* Scene 1 — WV house establishing shot */}
            <motion.div
              className="sp-intro__scene sp-intro__scene--exterior"
              style={{
                backgroundImage: "url('/demos/starter-plumbing/entrance-exterior.jpg')",
                transformStyle: 'preserve-3d',
              }}
              initial={{ scale: 0.94 }}
              animate={{
                scale:
                  phase === 'establish'
                    ? 1
                    : showPenetrate
                      ? 3.2
                      : showAlert
                        ? 1.03
                        : 1.08,
                opacity: showLeak ? 0 : showPenetrate ? 0.08 : 1,
                x: showPenetrate ? 0 : parallax.x,
                y: showPenetrate ? 0 : parallax.y,
                rotateX: showPenetrate ? 12 : 0,
                z: showPenetrate ? -120 : 0,
                filter: showPenetrate ? 'blur(12px) brightness(0.5)' : 'blur(0px) brightness(1)',
              }}
              transition={{
                duration: phase === 'establish' ? 2.8 : showPenetrate ? 2 : 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
            />

            {/* Scene 2 — doorway fly-through bridge */}
            <motion.div
              className="sp-intro__scene sp-intro__scene--doorway"
              style={{
                backgroundImage: "url('/demos/starter-plumbing/entrance-doorway.jpg')",
                transformStyle: 'preserve-3d',
              }}
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{
                opacity: showPenetrate ? 1 : showLeak ? 0 : 0,
                scale: showPenetrate ? 1 : showLeak ? 1.15 : 1.65,
                rotateX: showPenetrate ? 0 : 8,
                z: showPenetrate ? 40 : -80,
                filter: showPenetrate ? 'blur(0px) brightness(1.05)' : 'blur(10px)',
              }}
              transition={{ duration: 1.9, ease: [0.12, 0.9, 0.24, 1] }}
            />

            {/* 3D door frame tunnel */}
            <motion.div
              className="sp-intro__tunnel"
              initial={{ scale: 0.45, opacity: 0 }}
              animate={{
                opacity: showPenetrate ? 1 : 0,
                scale: showPenetrate ? 2.6 : 0.45,
              }}
              transition={{ duration: 2, ease: [0.12, 0.85, 0.22, 1] }}
              aria-hidden
            >
              <div className="sp-intro__tunnel-frame" />
            </motion.div>

            {/* Scene 3 — under-sink leak */}
            <motion.div
              className="sp-intro__scene sp-intro__scene--leak"
              style={{
                backgroundImage: "url('/demos/starter-plumbing/entrance-leak.jpg')",
                transformStyle: 'preserve-3d',
              }}
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{
                opacity: showLeak ? 1 : 0,
                scale: showLeak ? 1 : 1.5,
                rotateX: showLeak ? 0 : -8,
                z: showLeak ? 80 : 0,
                filter: showLeak ? 'blur(0px) brightness(1)' : 'blur(8px)',
              }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>

          {/* Radar ping on house during alert */}
          <AnimatePresence>
            {showAlert && (
              <motion.div
                className="sp-intro__radar"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.5 }}
                aria-hidden
              >
                <span className="sp-intro__radar-ring" />
                <span className="sp-intro__radar-ring sp-intro__radar-ring--2" />
                <span className="sp-intro__radar-dot" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Leak Detected CTA — appears on house BEFORE penetrate */}
          <AnimatePresence>
            {showAlert && !showLeak && (
              <motion.div
                className="sp-intro__alert-card"
                initial={{ opacity: 0, y: 32, scale: 0.92 }}
                animate={{
                  opacity: showAlert ? 1 : 0,
                  y: showAlert ? 0 : 32,
                  scale: showAlert ? 1 : 0.92,
                }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              >
                <motion.span
                  className="sp-intro__alert-pulse"
                  animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  Leak Detected
                </motion.span>
                <h2 className="sp-intro__alert-title">Active water signal · 128 Elm Street</h2>
                <p className="sp-intro__alert-sub">Kitchen sink sector · Ridgeview, WV</p>
                <button type="button" className="sp-intro__alert-btn" onClick={investigate}>
                  Investigate Leak →
                </button>
                <p className="sp-intro__alert-hint">Click Investigate to enter the home</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Under-sink caption */}
          <AnimatePresence>
            {showLeak && (
              <motion.div
                className="sp-intro__caption"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="sp-intro__caption-tag">Source Confirmed</span>
                <h2>Active leak under the sink</h2>
                <p>Summit Plumbing — deploying now.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`sp-intro__drip ${showLeak ? 'sp-intro__drip--active' : ''}`} aria-hidden>
            <span /><span /><span /><span />
          </div>

          <div className="sp-intro__speedlines" aria-hidden />
          <div className="sp-intro__scanlines" />
          <div className="sp-intro__grid" />
          <div className="sp-intro__vignette" />

          <div className="sp-intro__progress" aria-hidden>
            <div className="sp-intro__progress-fill" style={{ width: `${progress * 100}%` }} />
            <div className="sp-intro__progress-dots">
              {PHASE_ORDER.map((p, i) => (
                <span
                  key={p}
                  className={`sp-intro__progress-dot ${PHASE_ORDER.indexOf(phase) >= i ? 'sp-intro__progress-dot--on' : ''}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}