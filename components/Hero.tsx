'use client';

import Image from 'next/image';

interface HeroProps {
  onClaimOffer?: () => void;
}

export default function Hero({ onClaimOffer }: HeroProps) {
  return (
    <section id="hero" className="hero hero--cinematic">
      <div className="hero__visual" aria-hidden="true">
        <div className="hero__image-wrap">
          <Image
            src="/mountains/hero-vista.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero__image"
            quality={95}
          />
        </div>
        <div className="hero__sharpen" />
        <div className="hero__veil" />
        <div className="hero__vignette" />
        <div className="hero__horizon" />
        <div className="hero__grid" />
        <div className="hero__glow" />
        <div className="hero__glow-patriotic" />
      </div>

      <div className="hero__content">
        <div className="hero__badge hero-animate hero-animate--1">
          <span className="hero__badge-dot" />
          <span className="hero__badge-star" aria-hidden="true">★</span>
          WV Veteran Owned
          <span className="hero__badge-divider" />
          AI-Powered Web Systems
        </div>

        <h1 className="hero__title hero-animate hero-animate--2">
          <span className="hero__title-line">Veteran AI</span>
          <span className="hero__title-accent">Websites</span>
        </h1>

        <p className="hero__tagline hero-animate hero-animate--3">
          Professional websites. Built in one day.
        </p>

        <p className="hero__lead hero-animate hero-animate--3">
          Premium one-day sites for West Virginia businesses — veteran discipline,
          modern AI craft, and 100% ownership. No agency runaround.
        </p>

        <div className="hero__offer hero-animate hero-animate--4">
          <div className="hero__offer-shimmer" aria-hidden="true" />
          <div className="hero__offer-glow" aria-hidden="true" />
          <div className="hero__offer-header">
            <span className="hero__offer-label">Limited Time Offer</span>
            <span className="hero__offer-deadline">Ends July 4th</span>
          </div>
          <p className="hero__offer-headline">First Starter 1-Page Website</p>
          <div className="hero__offer-price-row">
            <span className="hero__price-was">$497</span>
            <span className="hero__price-now">$397</span>
            <span className="hero__price-save">Save $100</span>
          </div>
          <p className="hero__offer-note">Single-page Starter package only</p>
        </div>

        <div className="hero__cta hero-animate hero-animate--5">
          <a href="#build" onClick={onClaimOffer} className="btn btn--primary btn--lg btn--glow">
            Claim My $397 Website
          </a>
          <a href="#pricing" className="btn btn--ghost btn--lg">
            View All Packages
          </a>
        </div>

        <p className="hero__note hero-animate hero-animate--6">
          <span className="hero__note-item">Same-day delivery</span>
          <span className="hero__note-item">100% ownership</span>
          <span className="hero__note-item">Pay after approval</span>
        </p>
      </div>

      <div className="hero__scroll hero-animate hero-animate--6" aria-hidden="true">
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}