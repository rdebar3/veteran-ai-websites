'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
} from 'framer-motion';
import MagneticButton from '@/components/MagneticButton';

/** Scenes for the pinned zoom-scrub intro. Edit copy/images here. */
type Scene = { image: string; eyebrow: string; title: string; cta?: boolean };

const scenes: Scene[] = [
  {
    image: '/briefing/dawn-flag.jpg',
    eyebrow: 'West Virginia · Veteran-Owned',
    title: 'Peak-performance websites.',
  },
  {
    image: '/mountains/golden-overlook.jpg',
    eyebrow: 'Start to finish',
    title: 'Built in a single day.',
  },
  {
    image: '/landmarks/new-river-gorge-bridge.jpg',
    eyebrow: 'No lock-in · No contracts',
    title: 'You own it. 100%.',
  },
  {
    image: '/briefing/launch-summit.jpg',
    eyebrow: 'Ready when you are',
    title: 'Let’s build yours.',
    cta: true,
  },
];

const N = scenes.length;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (x: number) => {
  const c = clamp(x, 0, 1);
  return c * c * (3 - 2 * c);
};

const styles = `
.zoom-root{position:relative;height:520vh;background:var(--bg)}
.zoom-stage{position:sticky;top:0;height:100svh;overflow:hidden;isolation:isolate}
.zoom-layers{position:absolute;inset:0;z-index:0}
.zoom-layer{position:absolute;inset:0;will-change:transform,opacity}
.zoom-layer img{object-fit:cover;object-position:center 46%}
.zoom-veil{position:absolute;inset:0;z-index:1;pointer-events:none;background:
  radial-gradient(120% 92% at 50% 60%,transparent 30%,rgba(6,9,15,.34) 70%,rgba(6,9,15,.72) 100%),
  linear-gradient(180deg,rgba(6,9,15,.34) 0%,transparent 26%,transparent 58%,rgba(6,9,15,.74) 100%)}
.zoom-scenes{position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 24px}
.zoom-scene{position:absolute;max-width:min(92vw,1000px);will-change:transform,opacity}
.zoom-eyebrow{font-family:var(--font-sans);font-size:clamp(11px,1.1vw,13px);font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgba(233,240,246,.78);margin:0 0 20px}
.zoom-title{font-family:var(--font-sans);font-size:clamp(30px,5vw,78px);font-weight:600;letter-spacing:-.035em;line-height:1;color:#fff;margin:0;text-shadow:0 6px 40px rgba(0,0,0,.5)}
.zoom-cta{margin-top:38px;display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:center}
.zoom-cta .btn--primary{min-width:min(100%,232px);background:#f4f7fa;color:#0a0e14;border:none;box-shadow:0 12px 34px rgba(0,0,0,.35);font-weight:600}
.zoom-cta .btn--primary:hover{background:#fff;transform:translateY(-1px)}
.zoom-cta .btn--ghost{min-width:min(100%,168px);border:1px solid rgba(244,247,250,.3);background:transparent;color:#eef4f8;font-weight:500}
.zoom-cta .btn--ghost:hover{border-color:rgba(244,247,250,.7);background:rgba(244,247,250,.06)}
.zoom-hint{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);z-index:3;font-family:var(--font-sans);font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:rgba(233,240,246,.55);text-align:center}
.zoom-hint i{display:block;width:1px;height:28px;margin:10px auto 0;background:linear-gradient(rgba(233,240,246,.65),transparent)}
.zoom-dots{position:absolute;top:50%;right:clamp(14px,2vw,28px);transform:translateY(-50%);z-index:3;display:flex;flex-direction:column;gap:12px}
.zoom-dot{width:7px;height:7px;border-radius:50%;background:rgba(233,240,246,.28);transition:background .3s,transform .3s}
.zoom-dot.is-on{background:#fff;transform:scale(1.35)}
/* Reduced-motion fallback: plain stacked scenes */
.zoom-fallback{position:relative}
.zoom-fallback__scene{position:relative;min-height:80svh;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden}
.zoom-fallback__scene img{object-fit:cover}
@media(max-width:640px){.zoom-cta{flex-direction:column;align-items:stretch}.zoom-cta .btn--primary,.zoom-cta .btn--ghost{min-width:0;width:100%;justify-content:center}}
`;

function ZoomImageLayer({
  scene,
  i,
  progress,
}: {
  scene: Scene;
  i: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, (p) => {
    const s = p * (N - 1);
    return smooth(1 - Math.abs(s - i));
  });
  const scale = useTransform(progress, (p) => {
    const s = p * (N - 1);
    return 1.0 + (s - i + 1) * 0.09;
  });
  return (
    <motion.div className="zoom-layer" style={{ opacity, scale }}>
      <Image src={scene.image} alt="" fill sizes="100vw" quality={90} priority={i <= 1} />
    </motion.div>
  );
}

function ZoomTextLayer({
  scene,
  i,
  progress,
  onClaimOffer,
}: {
  scene: Scene;
  i: number;
  progress: MotionValue<number>;
  onClaimOffer?: () => void;
}) {
  const opacity = useTransform(progress, (p) => {
    const s = p * (N - 1);
    return smooth(1 - Math.abs(s - i) / 0.7);
  });
  const y = useTransform(progress, (p) => {
    const s = p * (N - 1);
    return -(s - i) * 48;
  });
  const scale = useTransform(progress, (p) => {
    const s = p * (N - 1);
    return 1 + (s - i) * 0.05;
  });
  return (
    <motion.div className="zoom-scene" style={{ opacity, y, scale }}>
      <p className="zoom-eyebrow">{scene.eyebrow}</p>
      <h1 className="zoom-title">{scene.title}</h1>
      {scene.cta && (
        <div className="zoom-cta">
          <MagneticButton href="#build" onClick={onClaimOffer} className="btn btn--primary btn--lg">
            Claim my $397 site
          </MagneticButton>
          <a href="#pricing" className="btn btn--ghost btn--lg">
            View packages
          </a>
        </div>
      )}
    </motion.div>
  );
}

interface ZoomIntroProps {
  onClaimOffer?: () => void;
}

export default function ZoomIntro({ onClaimOffer }: ZoomIntroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setActive(clamp(Math.round(p * (N - 1)), 0, N - 1));
  });

  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  // Accessible fallback for reduced-motion users: simple stacked scenes.
  if (prefersReducedMotion) {
    return (
      <div className="zoom-fallback">
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        {scenes.map((scene, i) => (
          <section key={i} className="zoom-fallback__scene">
            <Image src={scene.image} alt="" fill sizes="100vw" quality={90} priority={i === 0} />
            <div className="zoom-veil" />
            <div className="zoom-scene" style={{ position: 'relative', opacity: 1 }}>
              <p className="zoom-eyebrow">{scene.eyebrow}</p>
              <h1 className="zoom-title">{scene.title}</h1>
              {scene.cta && (
                <div className="zoom-cta">
                  <MagneticButton href="#build" onClick={onClaimOffer} className="btn btn--primary btn--lg">
                    Claim my $397 site
                  </MagneticButton>
                  <a href="#pricing" className="btn btn--ghost btn--lg">
                    View packages
                  </a>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="zoom-root" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="zoom-stage">
        <div className="zoom-layers" aria-hidden="true">
          {scenes.map((scene, i) => (
            <ZoomImageLayer key={i} scene={scene} i={i} progress={scrollYProgress} />
          ))}
        </div>
        <div className="zoom-veil" aria-hidden="true" />
        <div className="zoom-scenes">
          {scenes.map((scene, i) => (
            <ZoomTextLayer key={i} scene={scene} i={i} progress={scrollYProgress} onClaimOffer={onClaimOffer} />
          ))}
        </div>

        <div className="zoom-dots" aria-hidden="true">
          {scenes.map((_, i) => (
            <span key={i} className={`zoom-dot${i === active ? ' is-on' : ''}`} />
          ))}
        </div>

        <motion.div className="zoom-hint" aria-hidden="true" style={{ opacity: hintOpacity }}>
          <span>Scroll</span>
          <i />
        </motion.div>
      </div>
    </div>
  );
}
