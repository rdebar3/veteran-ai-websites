'use client';

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface GlowCanvasHandle {
  /** Pulse the glow as if Monti is speaking for ~n words */
  speak: (wordCount: number) => void;
  /** Brief impulse (e.g. visitor submitted) */
  impulse: () => void;
}

interface GlowCanvasProps {
  /** When true, dampens speech envelope (Phase 1 mute) */
  muted?: boolean;
  className?: string;
}

const GlowCanvas = forwardRef<GlowCanvasHandle, GlowCanvasProps>(
  function GlowCanvas({ muted = false, className }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const stateRef = useRef({
      speaking: false,
      sylls: [] as { t: number; dur: number; peak: number }[],
      speakStart: 0,
      speakDur: 0,
      ampS: 0,
      impulse: 0,
      muted: muted,
      reduced: false,
    });

    useEffect(() => {
      stateRef.current.muted = muted;
    }, [muted]);

    useImperativeHandle(ref, () => ({
      speak(wordCount: number) {
        const s = stateRef.current;
        if (s.muted || s.reduced) {
          s.impulse = 0.4;
          return;
        }
        const sylls: { t: number; dur: number; peak: number }[] = [];
        let t = 0.3;
        const per = 0.32;
        const n = Math.max(3, wordCount);
        for (let i = 0; i < n * 1.7; i++) {
          sylls.push({
            t,
            dur: 0.1 + Math.random() * 0.08,
            peak: 0.55 + Math.random() * 0.45,
          });
          t += per * (0.6 + Math.random() * 0.8);
        }
        s.sylls = sylls;
        s.speakDur = t + 0.4;
        s.speaking = true;
        s.speakStart = performance.now();
        const durMs = Math.min(3200, Math.max(1000, n * 210));
        s.speakDur = durMs / 1000 + 0.3;
        window.setTimeout(() => {
          s.speaking = false;
        }, durMs + 150);
      },
      impulse() {
        stateRef.current.impulse = 1;
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const gx = canvas.getContext('2d');
      if (!gx) return;

      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      stateRef.current.reduced = reduced;

      let SEED = 7;
      function rnd() {
        SEED = (SEED * 1103515245 + 12345) & 0x7fffffff;
        return SEED / 0x7fffffff;
      }

      const blobs: {
        dist: number;
        r: number;
        ph: number;
        sp: number;
        spin: number;
      }[] = [];
      for (let i = 0; i < 7; i++) {
        blobs.push({
          dist: 0.02 + rnd() * 0.06,
          r: 0.13 + rnd() * 0.14,
          ph: rnd() * 6.28,
          sp: 0.00014 + rnd() * 0.00026,
          spin: rnd() < 0.5 ? 1 : -1,
        });
      }

      let raf = 0;
      let cx = 0;
      let cy = 0;
      let unit = 0;

      function size() {
        if (!canvas) return;
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (!w || !h) return;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        gx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      function ampT(now: number) {
        const s = stateRef.current;
        let a = 0.08 + 0.04 * Math.sin(now * 0.0014);
        if (s.speaking && !s.muted && !s.reduced) {
          const tt = (now - s.speakStart) / 1000;
          let syAmp = 0;
          for (const sy of s.sylls) {
            const dz = (tt - sy.t) / sy.dur;
            syAmp = Math.max(syAmp, sy.peak * Math.exp(-dz * dz));
          }
          a = Math.max(a, syAmp) + 0.04 * Math.sin(now * 0.02);
        }
        a += s.impulse * 0.5;
        return Math.min(1.2, a);
      }

      function frame(now: number) {
        if (!canvas || !gx) return;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        cx = w / 2;
        cy = h * 0.36;
        unit = Math.min(w, h);

        const s = stateRef.current;
        const at = ampT(now);
        s.ampS += (at - s.ampS) * 0.1;
        s.impulse *= 0.94;
        const amp = s.ampS;

        gx.clearRect(0, 0, w, h);
        gx.globalCompositeOperation = 'lighter';

        const wash = gx.createRadialGradient(cx, cy, 0, cx, cy, unit * 0.8);
        wash.addColorStop(0, `rgba(120,58,26,${0.06 + amp * 0.07})`);
        wash.addColorStop(1, 'rgba(120,58,26,0)');
        gx.fillStyle = wash;
        gx.fillRect(0, 0, w, h);

        const scale = 1 + amp * 0.45;
        for (const b of blobs) {
          const drift = 0.5 + amp * 0.8;
          const bx =
            cx + Math.cos(now * b.sp * b.spin + b.ph) * b.dist * unit * drift;
          const by =
            cy +
            Math.sin(now * b.sp * 1.25 * b.spin + b.ph) * b.dist * unit * drift;
          const br = b.r * unit * scale * (0.95 + amp * 0.45);
          const g = gx.createRadialGradient(bx, by, 0, bx, by, br);
          g.addColorStop(0, `rgba(255,194,120,${0.055 + amp * 0.06})`);
          g.addColorStop(0.55, `rgba(220,132,60,${0.03 + amp * 0.035})`);
          g.addColorStop(1, 'rgba(190,80,40,0)');
          gx.fillStyle = g;
          gx.beginPath();
          gx.arc(bx, by, br, 0, 6.283);
          gx.fill();
        }

        const cr = unit * 0.17 * scale;
        const core = gx.createRadialGradient(cx, cy, 0, cx, cy, cr);
        core.addColorStop(0, `rgba(255,224,175,${0.28 + amp * 0.26})`);
        core.addColorStop(0.45, `rgba(240,160,95,${0.14 + amp * 0.16})`);
        core.addColorStop(1, 'rgba(230,130,70,0)');
        gx.fillStyle = core;
        gx.beginPath();
        gx.arc(cx, cy, cr, 0, 6.283);
        gx.fill();

        gx.globalCompositeOperation = 'source-over';
        raf = requestAnimationFrame(frame);
      }

      size();
      const ro = new ResizeObserver(size);
      ro.observe(canvas);
      window.addEventListener('resize', size);
      raf = requestAnimationFrame(frame);

      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        window.removeEventListener('resize', size);
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        className={className}
        id="glow"
        aria-hidden="true"
      />
    );
  },
);

export default GlowCanvas;
