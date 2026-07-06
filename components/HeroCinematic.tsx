'use client';

import { motion } from 'framer-motion';
import MagneticButton from '@/components/MagneticButton';
import OfferCountdown from '@/components/OfferCountdown';

interface HeroCinematicProps {
  onClaimOffer?: () => void;
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: 'easeOut' as const },
});

const styles = `
.hero-cine{position:relative;min-height:100svh;display:flex;align-items:center;overflow:hidden;isolation:isolate}
.hero-cine__bg{position:absolute;inset:0;z-index:0}
.hero-cine__video{width:100%;height:100%;object-fit:cover;opacity:.55}
.hero-cine__veil{position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,14,20,.86),rgba(10,14,20,.42) 55%,rgba(10,14,20,.14)),linear-gradient(180deg,rgba(10,14,20,.55),transparent 30%,transparent 58%,var(--bg))}
.hero-cine__glow{position:absolute;inset:0;pointer-events:none;background:radial-gradient(60% 50% at 20% 45%,rgba(34,211,238,.16),transparent 60%)}
.hero-cine__inner{position:relative;z-index:2;width:100%;max-width:1180px;margin:0 auto;padding:120px clamp(20px,6vw,72px) 0}
.hero-cine__badge{display:inline-flex;align-items:center;gap:10px;font-family:var(--font-mono);font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--cyan);border:1px solid var(--border-glow);background:rgba(34,211,238,.05);padding:8px 14px;border-radius:999px;margin-bottom:24px}
.hero-cine__dot{width:7px;height:7px;border-radius:50%;background:#3ee6a0;box-shadow:0 0 10px #3ee6a0}
.hero-cine__star{color:var(--amber)}
.hero-cine__sep{width:1px;height:12px;background:var(--border-hover)}
.hero-cine__title{font-family:var(--font-sans);font-weight:800;font-size:clamp(44px,8vw,120px);line-height:.9;letter-spacing:-.03em;color:var(--text);text-shadow:0 8px 44px rgba(0,0,0,.5);margin:0}
.hero-cine__grad{background:linear-gradient(100deg,var(--cyan),#dff6fc 55%,var(--cyan-light));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.hero-cine__lead{margin-top:22px;max-width:46ch;font-size:clamp(16px,1.5vw,20px);line-height:1.55;color:#cdd9e5;text-shadow:0 2px 18px rgba(0,0,0,.6)}
.hero-cine__offer{margin-top:24px;display:flex;flex-wrap:wrap;align-items:center;gap:14px}
.hero-cine__offer-label{font-family:var(--font-mono);font-size:12px;letter-spacing:1px;text-transform:uppercase;color:var(--amber)}
.hero-cine__cta{margin-top:30px;display:flex;flex-wrap:wrap;gap:14px}
.hero-cine__trust{margin-top:26px;display:flex;flex-wrap:wrap;gap:22px;font-family:var(--font-mono);font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--text-muted)}
.hero-cine__scroll{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);z-index:2;font-family:var(--font-mono);font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--text-muted);text-align:center}
.hero-cine__scroll i{display:block;width:1px;height:28px;margin:8px auto 0;background:linear-gradient(var(--cyan),transparent)}
@media(max-width:640px){.hero-cine__video{opacity:.4}.hero-cine__inner{padding-top:104px}}
`;

export default function HeroCinematic({ onClaimOffer }: HeroCinematicProps) {
  return (
    <section id="hero" className="hero-cine">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="hero-cine__bg" aria-hidden="true">
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
      </div>

      <div className="hero-cine__inner">
        <motion.div className="hero-cine__badge" {...fadeUp(0.1)}>
          <span className="hero-cine__dot" />
          <span className="hero-cine__star" aria-hidden="true">★</span>
          WV Veteran-Owned
          <span className="hero-cine__sep" />
          AI-Powered Web Systems
        </motion.div>

        <motion.h1 className="hero-cine__title" {...fadeUp(0.25)}>
          Peak-performance
          <br />
          <span className="hero-cine__grad">websites.</span>
        </motion.h1>

        <motion.p className="hero-cine__lead" {...fadeUp(0.45)}>
          Premium, mobile-first sites for West Virginia businesses — engineered in a single day,
          delivered with veteran discipline, and owned 100% by you.
        </motion.p>

        <motion.div className="hero-cine__offer" {...fadeUp(0.6)}>
          <span className="hero-cine__offer-label">Limited-time · $397 Starter</span>
          <OfferCountdown compact />
        </motion.div>

        <motion.div className="hero-cine__cta" {...fadeUp(0.75)}>
          <MagneticButton
            href="#build"
            onClick={onClaimOffer}
            className="btn btn--primary btn--lg btn--glow"
          >
            Claim my $397 site
          </MagneticButton>
          <a href="#pricing" className="btn btn--ghost btn--lg">
            View all packages
          </a>
        </motion.div>

        <motion.p className="hero-cine__trust" {...fadeUp(0.9)}>
          <span>Same-day delivery</span>
          <span>100% ownership</span>
          <span>Pay after approval</span>
        </motion.p>
      </div>

      <div className="hero-cine__scroll" aria-hidden="true">
        <span>Scroll</span>
        <i />
      </div>
    </section>
  );
}
