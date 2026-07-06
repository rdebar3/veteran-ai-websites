'use client';

import { motion } from 'framer-motion';
import HeroBackground from '@/components/HeroBackground';
import HeroConstellationMesh from '@/components/HeroConstellationMesh';
import HeroRadarSweep from '@/components/HeroRadarSweep';
import HeroHeadline from '@/components/HeroHeadline';
import HeroSystemsHud from '@/components/HeroSystemsHud';
import CircuitOverlay from '@/components/CircuitOverlay';
import PatrioticOverlay from '@/components/PatrioticOverlay';
import NeuralOverlay from '@/components/NeuralOverlay';
import OfferCountdown from '@/components/OfferCountdown';
import MagneticButton from '@/components/MagneticButton';
import { baseRooms } from '@/lib/base-rooms';
import { heroFadeUp } from '@/lib/hero-motion';

interface HeroProps {
  onClaimOffer?: () => void;
}

export default function Hero({ onClaimOffer }: HeroProps) {
  const room = baseRooms['main-gate'];

  return (
    <section id="hero" className="hero hero--cinematic hero--outpost hero--gate hero--animated">
      <div className="hero__visual" aria-hidden="true">
        <HeroBackground />
        <HeroConstellationMesh />
        <HeroRadarSweep />
        <div className="hero__ken-burns" />
        <div className="hero__sharpen" />
        <div className="hero__veil" />
        <div className="hero__vignette" />
        <div className="hero__horizon" />
        <div className="hero__circuit">
          <CircuitOverlay />
        </div>
        <NeuralOverlay />
        <PatrioticOverlay />
        <div className="hero__outpost-frame" />
        <div className="hero__outpost-hud" />
        <div className="hero__grid" />
        <div className="hero__glow" />
        <div className="hero__glow-patriotic" />
      </div>

      <div className="hero__gate-status" aria-hidden="true">
        <span className="hero__gate-dot" />
        <span>{room.codename}</span>
      </div>

      <div className="hero__layout">
        <div className="hero__primary">
          <motion.div className="hero__badge" {...heroFadeUp(0.12)}>
            <span className="hero__badge-dot" />
            <span className="hero__badge-star" aria-hidden="true">★</span>
            WV Veteran Owned
            <span className="hero__badge-divider" />
            AI-Powered Web Systems
          </motion.div>

          <HeroHeadline />

          <motion.p className="hero__tagline" {...heroFadeUp(0.72)}>
            Professional websites. Built in one day.
          </motion.p>

          <motion.p className="hero__lead" {...heroFadeUp(0.82)}>
            Premium one-day sites for West Virginia businesses — veteran discipline,
            modern AI craft, and 100% ownership. No agency runaround.
          </motion.p>

          <motion.div className="hero__offer" {...heroFadeUp(0.95)}>
            <div className="hero__offer-shimmer" aria-hidden="true" />
            <div className="hero__offer-glow" aria-hidden="true" />
            <div className="hero__offer-header">
              <span className="hero__offer-label">Limited Time Offer</span>
            </div>
            <OfferCountdown className="hero__offer-countdown" />
            <p className="hero__offer-headline">First Starter 1-Page Website</p>
            <div className="hero__offer-price-row">
              <span className="hero__price-was">$497</span>
              <span className="hero__price-now">$397</span>
              <span className="hero__price-save">Save $100</span>
            </div>
            <p className="hero__offer-note">Single-page Starter package only</p>
          </motion.div>

          <motion.div className="hero__cta" {...heroFadeUp(1.1)}>
            <MagneticButton href="#build" onClick={onClaimOffer} className="btn btn--primary btn--lg btn--glow">
              Claim My $397 Website
            </MagneticButton>
            <a href="#pricing" className="btn btn--ghost btn--lg">
              View All Packages
            </a>
          </motion.div>
        </div>

        <HeroSystemsHud
          className="hero__systems"
          sectorLabel={`${room.vistaName} · Sector Alpha`}
        />

        <motion.p className="hero__note" {...heroFadeUp(1.22)}>
          <span className="hero__note-item">Same-day delivery</span>
          <span className="hero__note-item">100% ownership</span>
          <span className="hero__note-item">Pay after approval</span>
        </motion.p>
      </div>
    </section>
  );
}