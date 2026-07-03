'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface HeroProps {
  onClaimOffer?: () => void;
}

export default function Hero({ onClaimOffer }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();

  const motionProps = (delay: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 28 } as const,
          animate: { opacity: 1, y: 0 } as const,
          transition: { duration: 1, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section id="hero" className="cinematic-hero">
      <motion.div className="cinematic-hero__badge" {...motionProps(0.1)}>
        <span className="cinematic-hero__badge-star">★</span>
        West Virginia Veteran Owned
        <span className="cinematic-hero__badge-star">★</span>
      </motion.div>

      <motion.h1 className="cinematic-hero__brand" {...motionProps(0.25)}>
        Veteran AI Websites
        <span className="cinematic-hero__tagline">Professional Websites · Built in One Day</span>
      </motion.h1>

      <motion.p className="cinematic-hero__lead" {...motionProps(0.4)}>
        One-day websites by a local West Virginia builder — built with the discipline,
        precision, and pride of a U.S. veteran.
      </motion.p>

      <motion.div className="cinematic-hero__offer" {...motionProps(0.55)}>
        <div className="cinematic-hero__offer-label">Limited Time Offer</div>
        <p className="cinematic-hero__offer-title">First Starter 1-Page Website</p>
        <p className="cinematic-hero__offer-price">
          <span className="cinematic-hero__price-strike">$497</span>
          <span className="cinematic-hero__price-now">$397</span>
        </p>
        <p className="cinematic-hero__offer-urgency">Ends July 4th — Single-page Starter only</p>
      </motion.div>

      <motion.div className="cinematic-hero__cta-group" {...motionProps(0.7)}>
        <a href="#build" onClick={onClaimOffer} className="btn-premium">
          Claim My $397 Website
        </a>
        <a href="#pricing" className="btn-premium btn-premium--outline">
          View Packages
        </a>
      </motion.div>

      <motion.p className="cinematic-hero__footnote" {...motionProps(0.85)}>
        Same-day delivery · 100% ownership · Pay only after you approve the design
      </motion.p>

      <div className="cinematic-hero__scroll-hint" aria-hidden="true">
        <span>Begin the ascent</span>
        <div className="cinematic-hero__scroll-line" />
      </div>
    </section>
  );
}