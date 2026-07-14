'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
} from 'framer-motion';
import MagneticButton from '@/components/MagneticButton';

const VIDEO = '/hero/hero-gorge-loop.mp4';
const MOBILE_VIDEO = '/hero/hero-gorge-mobile.mp4';
const POSTER = '/hero/hero-gorge-poster.jpg';

type Scene = { eyebrow?: string; title: string; cta?: boolean };

const scenes: Scene[] = [
  { eyebrow: 'West Virginia · Veteran-Owned', title: 'Fast, professional websites.' },
  { title: 'Designed & built in a single day.' },
  { title: 'You own it. 100%.' },
  { eyebrow: 'From $397', title: 'Let’s build yours.', cta: true },
];

const N = scenes.length;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (x: number) => {
  const c = clamp(x, 0, 1);
  return c * c * (3 - 2 * c);
};

const styles = `
.vh-root{position:relative;height:340vh;background:#06090f}
.vh-stage{position:sticky;top:0;height:100svh;overflow:hidden;background:#06090f;isolation:isolate}
.vh-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;}
.vh-veil{position:absolute;inset:0;z-index:1;pointer-events:none;background:
  radial-gradient(78% 58% at 50% 50%,rgba(6,9,15,.52),transparent 72%),
  radial-gradient(120% 90% at 50% 55%,transparent 40%,rgba(6,9,15,.32) 74%,rgba(6,9,15,.62) 100%),
  linear-gradient(180deg,rgba(6,9,15,.5) 0%,transparent 30%,transparent 55%,rgba(6,9,15,.72) 80%,rgba(6,9,15,.94) 100%)}
.vh-scenes{position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 24px}
.vh-scene{position:absolute;max-width:min(92vw,1040px);will-change:transform,opacity}
.vh-eyebrow{font-family:var(--font-sans);font-size:clamp(12px,1.45vw,16px);font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#fff;margin:0 0 22px;text-shadow:0 2px 14px rgba(0,0,0,.8),0 1px 3px rgba(0,0,0,.7)}
.vh-title{font-family:var(--font-sans);font-size:clamp(32px,5.6vw,86px);font-weight:600;letter-spacing:-.035em;line-height:1;color:#fff;margin:0;text-shadow:0 2px 3px rgba(0,0,0,.6),0 3px 14px rgba(0,0,0,.55),0 8px 40px rgba(0,0,0,.45);-webkit-text-stroke:0.5px rgba(0,0,0,.2)}
.vh-cta{margin-top:38px;display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:center}
.vh-cta .btn--primary{min-width:min(100%,220px);background:#fff;color:#0a0e14;border:1px solid rgba(255,255,255,.9);box-shadow:0 12px 34px rgba(0,0,0,.45);font-weight:700;transition:transform .25s,box-shadow .25s,background .25s}
.vh-cta .btn--primary:hover{background:#fff;transform:translateY(-2px);box-shadow:0 18px 44px rgba(0,0,0,.55)}
.vh-cta .btn--ghost{min-width:min(100%,210px);background:#12161d;color:#fff;border:1px solid rgba(255,255,255,.38);font-weight:600;box-shadow:0 12px 30px rgba(0,0,0,.5);transition:transform .25s,box-shadow .25s,background .25s,color .25s,border-color .25s}
.vh-cta .btn--ghost:hover{background:#fff;color:#0a0e14;border-color:#fff;transform:translateY(-2px);box-shadow:0 16px 38px rgba(0,0,0,.5)}
.vh-hint{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);z-index:3;font-family:var(--font-sans);font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:rgba(233,240,246,.72);text-align:center}
.vh-hint i{display:block;width:1px;height:28px;margin:10px auto 0;background:linear-gradient(rgba(233,240,246,.7),transparent)}
.vh-dots{position:absolute;top:50%;right:clamp(14px,2vw,28px);transform:translateY(-50%);z-index:3;display:flex;flex-direction:column;gap:12px}
.vh-dot{width:7px;height:7px;border-radius:50%;background:rgba(233,240,246,.28);transition:background .3s,transform .3s}
.vh-dot.is-on{background:#fff;transform:scale(1.35)}
/* simple fallback (mobile / reduced motion) */
.vh-simple{position:relative;min-height:100svh;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden;background:#06090f}
.vh-simple video,.vh-simple img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
.vh-simple .vh-veil{z-index:1}
.vh-simple .vh-scene{position:relative;z-index:2;padding:0 24px}
@media(max-width:640px){.vh-cta{flex-direction:column;align-items:stretch}.vh-cta .btn--primary,.vh-cta .btn--ghost{min-width:0;width:100%;justify-content:center}}
/* mobile: shorter scroll region so the hero text advances quicker */
@media(max-width:768px){.vh-root{height:260vh}}
`;

function SceneText({
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
    return smooth(1 - Math.abs(s - i) / 0.72);
  });
  const y = useTransform(progress, (p) => {
    const s = p * (N - 1);
    return -(s - i) * 46;
  });
  return (
    <motion.div className="vh-scene" style={{ opacity, y }}>
      {scene.eyebrow && <p className="vh-eyebrow">{scene.eyebrow}</p>}
      <h2 className="vh-title">{scene.title}</h2>
      {scene.cta && (
        <div className="vh-cta">
          <MagneticButton href="#build" onClick={onClaimOffer} className="btn btn--primary btn--lg">
            Claim my $397 site
          </MagneticButton>
          <a href="#pricing" className="btn btn--ghost btn--lg">View packages</a>
        </div>
      )}
    </motion.div>
  );
}

interface VideoHeroProps {
  onClaimOffer?: () => void;
}

export default function VideoHero({ onClaimOffer }: VideoHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [simple, setSimple] = useState(false);
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ['start start', 'end end'],
  });

  // Play the sequence over the first HOLD of scroll, then hold the last scene.
  const HOLD = 0.87;
  const anim = useTransform(scrollYProgress, [0, HOLD], [0, 1]);

  useEffect(() => {
    // Only reduced-motion users get the static single-headline fallback.
    setSimple(!!prefersReducedMotion);
    // Mobile gets a purpose-built 9:16 video so the whole scene is visible.
    const setMq = () => setIsMobile(window.matchMedia('(max-width: 767px)').matches);
    setMq();
    window.addEventListener('resize', setMq);
    return () => window.removeEventListener('resize', setMq);
  }, [prefersReducedMotion]);

  useMotionValueEvent(anim, 'change', (a) => {
    setActive(clamp(Math.round(a * (N - 1)), 0, N - 1));
  });




  // Fallback: autoplay loop + static headline (mobile / reduced motion)
  if (simple) {
    return (
      <div className="vh-simple">
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <video src={isMobile ? MOBILE_VIDEO : VIDEO} poster={POSTER} autoPlay muted loop playsInline preload="metadata" />
        <div className="vh-veil" aria-hidden="true" />
        <div className="vh-scene">
          <p className="vh-eyebrow">West Virginia · Veteran-Owned</p>
          <h2 className="vh-title">Fast, professional websites.</h2>
          <div className="vh-cta">
            <MagneticButton href="#build" onClick={onClaimOffer} className="btn btn--primary btn--lg">
              Claim my $397 site
            </MagneticButton>
            <a href="#pricing" className="btn btn--ghost btn--lg">View packages</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vh-root" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="vh-stage">
        <video
          className="vh-video"
          src={isMobile ? MOBILE_VIDEO : VIDEO}
          poster={POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="vh-veil" aria-hidden="true" />
        <div className="vh-scenes">
          {scenes.map((s, i) => (
            <SceneText key={i} scene={s} i={i} progress={anim} onClaimOffer={onClaimOffer} />
          ))}
        </div>
        <div className="vh-dots" aria-hidden="true">
          {scenes.map((_, i) => (
            <span key={i} className={`vh-dot${i === active ? ' is-on' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
