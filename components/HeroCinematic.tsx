'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import MagneticButton from '@/components/MagneticButton';
import OfferCountdown from '@/components/OfferCountdown';
import PatrioticOverlay from '@/components/PatrioticOverlay';
import NeuralOverlay from '@/components/NeuralOverlay';

interface HeroCinematicProps {
  onClaimOffer?: () => void;
}

const slideIn = (delay: number) => ({
  initial: { opacity: 0, x: -48 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.85, delay, ease: 'easeOut' as const },
});

const styles = `
.hero-cine{position:relative;min-height:100svh;display:flex;align-items:center;overflow:hidden;isolation:isolate}
.hero-cine__bg{position:absolute;inset:0;z-index:0}
.hero-cine__still{position:absolute;inset:0;z-index:0}
.hero-cine__still img{object-fit:cover;object-position:center 40%}
.hero-cine__video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.78;mix-blend-mode:screen;z-index:1}
.hero-cine__veil{position:absolute;inset:0;z-index:2;background:
  linear-gradient(100deg,rgba(10,14,20,.78) 0%,rgba(10,14,20,.42) 42%,rgba(10,14,20,.28) 68%,rgba(10,14,20,.55) 100%),
  linear-gradient(180deg,rgba(10,14,20,.4) 0%,transparent 28%,transparent 62%,rgba(10,14,20,.72) 88%,var(--bg))}
.hero-cine__glow{position:absolute;inset:0;z-index:2;pointer-events:none;background:
  radial-gradient(60% 50% at 18% 45%,rgba(34,211,238,.16),transparent 62%),
  radial-gradient(40% 35% at 78% 30%,rgba(232,163,61,.1),transparent 70%)}
.hero-cine__fx{position:absolute;inset:0;z-index:3;pointer-events:none;opacity:.9}
.hero-cine__hud{position:absolute;top:88px;right:clamp(16px,4vw,48px);z-index:4;display:flex;flex-direction:column;align-items:flex-end;gap:8px;font-family:var(--font-mono);font-size:10px;letter-spacing:1.6px;text-transform:uppercase;color:rgba(199,210,222,.85);text-shadow:0 1px 8px rgba(0,0,0,.7)}
.hero-cine__hud-row{display:inline-flex;align-items:center;gap:8px;padding:7px 12px;border:1px solid rgba(34,211,238,.28);border-radius:999px;background:rgba(10,14,20,.45);backdrop-filter:blur(6px)}
.hero-cine__hud-dot{width:6px;height:6px;border-radius:50%;background:#3ee6a0;box-shadow:0 0 10px #3ee6a0}
.hero-cine__hud-amber{color:var(--amber)}
.hero-cine__inner{position:relative;z-index:5;width:100%;max-width:1180px;margin:0 auto;padding:120px clamp(20px,6vw,72px) 0}
.hero-cine__badge{display:inline-flex;align-items:center;gap:10px;font-family:var(--font-mono);font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--cyan);border:1px solid var(--border-glow);background:rgba(10,14,20,.45);backdrop-filter:blur(6px);padding:8px 14px;border-radius:999px;margin-bottom:24px}
.hero-cine__dot{width:7px;height:7px;border-radius:50%;background:#3ee6a0;box-shadow:0 0 10px #3ee6a0}
.hero-cine__star{color:var(--amber)}
.hero-cine__sep{width:1px;height:12px;background:var(--border-hover)}
.hero-cine__title{font-family:var(--font-sans);font-weight:800;font-size:clamp(44px,8vw,120px);line-height:.9;letter-spacing:-.03em;color:var(--text);text-shadow:0 2px 12px rgba(0,0,0,.65),0 10px 44px rgba(0,0,0,.55);margin:0}
.hero-cine__grad{background:linear-gradient(100deg,var(--cyan),#dff6fc 55%,var(--cyan-light));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.hero-cine__lead{margin-top:22px;max-width:48ch;font-size:clamp(16px,1.5vw,20px);line-height:1.55;color:#eef4f8;text-shadow:0 2px 6px rgba(0,0,0,.75),0 2px 20px rgba(0,0,0,.7)}
.hero-cine__offer{margin-top:24px;display:flex;flex-wrap:wrap;align-items:center;gap:14px}
.hero-cine__offer-label{font-family:var(--font-mono);font-size:12px;letter-spacing:1px;text-transform:uppercase;color:var(--amber);text-shadow:0 1px 6px rgba(0,0,0,.7)}
.hero-cine__cta{margin-top:32px;display:flex;flex-wrap:wrap;gap:14px;align-items:center}
.hero-cine__cta .btn--primary{min-width:min(100%,240px);box-shadow:0 0 0 1px rgba(34,211,238,.35),0 0 32px rgba(34,211,238,.35),0 12px 40px rgba(0,0,0,.35);font-weight:700;letter-spacing:.02em}
.hero-cine__cta .btn--ghost{min-width:min(100%,188px);border-color:rgba(255,255,255,.28);background:rgba(10,14,20,.35);backdrop-filter:blur(6px);font-weight:600}
.hero-cine__cta .btn--ghost:hover{border-color:var(--cyan);color:var(--text)}
.hero-cine__cta .btn--ghost-secondary{border-color:rgba(255,255,255,.16);font-weight:500;opacity:.92}
.hero-cine__trust{margin-top:28px;display:flex;flex-wrap:wrap;gap:18px 24px;font-family:var(--font-mono);font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#c7d2de;text-shadow:0 1px 6px rgba(0,0,0,.7)}
.hero-cine__trust span{display:inline-flex;align-items:center;gap:8px}
.hero-cine__trust span::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--cyan);box-shadow:0 0 8px var(--cyan);opacity:.85}
.hero-cine__scroll{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);z-index:5;font-family:var(--font-mono);font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#c7d2de;text-align:center;text-shadow:0 1px 6px rgba(0,0,0,.7)}
.hero-cine__scroll i{display:block;width:1px;height:28px;margin:8px auto 0;background:linear-gradient(var(--cyan),transparent)}
@media(max-width:768px){.hero-cine__hud{display:none}.hero-cine__video{opacity:.55}}
@media(max-width:640px){.hero-cine__inner{padding-top:104px}.hero-cine__cta{flex-direction:column;align-items:stretch}.hero-cine__cta .btn--primary,.hero-cine__cta .btn--ghost{min-width:0;width:100%;justify-content:center}}
`;

export default function HeroCinematic({ onClaimOffer }: HeroCinematicProps) {
  return (
    <section id="hero" className="hero-cine">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="hero-cine__bg" aria-hidden="true">
        <div className="hero-cine__still">
          <Image
            src="/briefing/dawn-flag.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={90}
          />
        </div>
        <video
          className="hero-cine__video"
          autoPlay
          muted
          loop
          playsInline
          poster="/cinematic/hero-poster.jpg"
        >
          <source src="/cinematic/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-cine__veil" />
        <div className="hero-cine__glow" />
        <div className="hero-cine__fx">
          <PatrioticOverlay />
          <NeuralOverlay />
        </div>
      </div>

      <div className="hero-cine__hud" aria-hidden="true">
        <div className="hero-cine__hud-row">
          <span className="hero-cine__hud-dot" />
          Starlink · Online
        </div>
        <div className="hero-cine__hud-row">
          <span className="hero-cine__hud-amber">★</span>
          Flag Sector · WV
        </div>
        <div className="hero-cine__hud-row">Secure AI Base</div>
      </div>

      <div className="hero-cine__inner">
        <motion.div className="hero-cine__badge" {...slideIn(0.1)}>
          <span className="hero-cine__dot" />
          <span className="hero-cine__star" aria-hidden="true">★</span>
          WV Veteran-Owned
          <span className="hero-cine__sep" />
          AI-Powered Web Systems
        </motion.div>

        <motion.h1 className="hero-cine__title" {...slideIn(0.25)}>
          Peak-performance
          <br />
          <span className="hero-cine__grad">websites.</span>
        </motion.h1>

        <motion.p className="hero-cine__lead" {...slideIn(0.45)}>
          Premium, mobile-first sites for West Virginia businesses — engineered in a single day
          from a mountain command base with Starlink, AI, and veteran discipline. You own 100%.
        </motion.p>

        <motion.div className="hero-cine__offer" {...slideIn(0.6)}>
          <span className="hero-cine__offer-label">Limited-time · $397 Starter</span>
          <OfferCountdown compact />
        </motion.div>

        <motion.div className="hero-cine__cta" {...slideIn(0.75)}>
          <MagneticButton
            href="#build"
            onClick={onClaimOffer}
            className="btn btn--primary btn--lg btn--glow"
          >
            Claim my $397 site
          </MagneticButton>
          <a href="#briefing" className="btn btn--ghost btn--lg">
            Enter mission briefing
          </a>
          <a href="#pricing" className="btn btn--ghost btn--lg btn--ghost-secondary">
            View packages
          </a>
        </motion.div>

        <motion.p className="hero-cine__trust" {...slideIn(0.9)}>
          <span>Same-day delivery</span>
          <span>100% ownership</span>
          <span>Pay after approval</span>
          <span>U.S. veteran built</span>
        </motion.p>
      </div>

      <div className="hero-cine__scroll" aria-hidden="true">
        <span>Scroll the base</span>
        <i />
      </div>
    </section>
  );
}
