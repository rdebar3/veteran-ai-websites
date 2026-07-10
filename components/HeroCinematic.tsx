'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import MagneticButton from '@/components/MagneticButton';
import OfferCountdown from '@/components/OfferCountdown';

interface HeroCinematicProps {
  onClaimOffer?: () => void;
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const styles = `
.hero-cine{position:relative;min-height:100svh;display:flex;align-items:center;overflow:hidden;isolation:isolate}
.hero-cine__bg{position:absolute;inset:0;z-index:0}
.hero-cine__still{position:absolute;inset:0;z-index:0;will-change:transform}
.hero-cine__still img{object-fit:cover;object-position:center 42%}
.hero-cine__veil{position:absolute;inset:0;z-index:2;background:
  linear-gradient(90deg,rgba(10,14,20,.82) 0%,rgba(10,14,20,.55) 38%,rgba(10,14,20,.18) 70%,rgba(10,14,20,.06) 100%),
  linear-gradient(180deg,rgba(10,14,20,.28) 0%,transparent 30%,transparent 58%,rgba(10,14,20,.72) 92%,var(--bg))}
.hero-cine__inner{position:relative;z-index:5;width:100%;max-width:1140px;margin:0 auto;padding:120px clamp(20px,6vw,80px) 0;will-change:transform,opacity}
.hero-cine__eyebrow{font-family:var(--font-sans);font-size:13px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:rgba(233,240,246,.72);margin:0 0 26px}
.hero-cine__title{font-family:var(--font-sans);font-weight:600;font-size:clamp(46px,8.4vw,128px);line-height:.98;letter-spacing:-.035em;color:#fff;margin:0}
.hero-cine__title span{display:block;color:rgba(233,240,246,.62);font-weight:400}
.hero-cine__lead{margin-top:26px;max-width:46ch;font-size:clamp(16px,1.4vw,20px);line-height:1.6;color:rgba(233,240,246,.82);font-weight:400}
.hero-cine__offer{margin-top:30px;display:flex;flex-wrap:wrap;align-items:center;gap:16px}
.hero-cine__offer-label{font-family:var(--font-sans);font-size:13px;font-weight:500;letter-spacing:.04em;color:rgba(233,240,246,.9)}
.hero-cine__cta{margin-top:34px;display:flex;flex-wrap:wrap;gap:14px;align-items:center}
.hero-cine__cta .btn--primary{min-width:min(100%,232px);background:#f4f7fa;color:#0a0e14;border:none;box-shadow:0 10px 30px rgba(0,0,0,.28);font-weight:600;letter-spacing:0}
.hero-cine__cta .btn--primary:hover{background:#fff;transform:translateY(-1px)}
.hero-cine__cta .btn--ghost{min-width:min(100%,180px);border:1px solid rgba(244,247,250,.28);background:transparent;color:#eef4f8;font-weight:500}
.hero-cine__cta .btn--ghost:hover{border-color:rgba(244,247,250,.7);background:rgba(244,247,250,.06)}
.hero-cine__trust{margin-top:34px;display:flex;flex-wrap:wrap;align-items:center;gap:10px 18px;font-family:var(--font-sans);font-size:13px;font-weight:400;color:rgba(233,240,246,.62)}
.hero-cine__trust span{display:inline-flex;align-items:center;gap:18px}
.hero-cine__trust span::after{content:'·';color:rgba(233,240,246,.32)}
.hero-cine__trust span:last-child::after{content:''}
.hero-cine__scroll{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);z-index:5;font-family:var(--font-sans);font-size:12px;font-weight:400;letter-spacing:.16em;text-transform:uppercase;color:rgba(233,240,246,.55);text-align:center}
.hero-cine__scroll i{display:block;width:1px;height:30px;margin:10px auto 0;background:linear-gradient(rgba(233,240,246,.6),transparent)}
@media(max-width:640px){.hero-cine__inner{padding-top:104px}.hero-cine__cta{flex-direction:column;align-items:stretch}.hero-cine__cta .btn--primary,.hero-cine__cta .btn--ghost{min-width:0;width:100%;justify-content:center}}
`;

export default function HeroCinematic({ onClaimOffer }: HeroCinematicProps) {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.16]);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '9%']);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -130]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55, 0.9], [1, 1, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const stillStyle = prefersReducedMotion ? undefined : { scale: bgScale, y: bgY };
  const innerStyle = prefersReducedMotion ? undefined : { y: contentY, opacity: contentOpacity };
  const hintStyle = prefersReducedMotion ? undefined : { opacity: hintOpacity };

  return (
    <section id="hero" className="hero-cine" ref={heroRef}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="hero-cine__bg" aria-hidden="true">
        <motion.div className="hero-cine__still" style={stillStyle}>
          <Image
            src="/briefing/dawn-flag.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={92}
          />
        </motion.div>
        <div className="hero-cine__veil" />
      </div>

      <motion.div className="hero-cine__inner" style={innerStyle}>
        <motion.p className="hero-cine__eyebrow" {...rise(0.05)}>
          West Virginia · Veteran-Owned
        </motion.p>

        <motion.h1 className="hero-cine__title" {...rise(0.15)}>
          Peak-performance
          <span>websites.</span>
        </motion.h1>

        <motion.p className="hero-cine__lead" {...rise(0.3)}>
          Premium, mobile-first websites for West Virginia businesses — designed and built in a
          single day. You own everything, 100%.
        </motion.p>

        <motion.div className="hero-cine__offer" {...rise(0.42)}>
          <span className="hero-cine__offer-label">Limited-time · $397 Starter</span>
          <OfferCountdown compact />
        </motion.div>

        <motion.div className="hero-cine__cta" {...rise(0.54)}>
          <MagneticButton
            href="#build"
            onClick={onClaimOffer}
            className="btn btn--primary btn--lg"
          >
            Claim my $397 site
          </MagneticButton>
          <a href="#pricing" className="btn btn--ghost btn--lg">
            View packages
          </a>
        </motion.div>

        <motion.p className="hero-cine__trust" {...rise(0.66)}>
          <span>Same-day delivery</span>
          <span>100% ownership</span>
          <span>Pay after approval</span>
          <span>Veteran built</span>
        </motion.p>
      </motion.div>

      <motion.div className="hero-cine__scroll" aria-hidden="true" style={hintStyle}>
        <span>Scroll</span>
        <i />
      </motion.div>
    </section>
  );
}
