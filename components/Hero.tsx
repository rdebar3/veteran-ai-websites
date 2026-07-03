'use client';

import Image from 'next/image';

interface HeroProps {
  onClaimOffer?: () => void;
}

export default function Hero({ onClaimOffer }: HeroProps) {
  return (
    <section id="hero" className="hero">
      <div className="hero__visual" aria-hidden="true">
        <div className="hero__image-wrap">
          <Image
            src="/mountains/hero-vista.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero__image"
            quality={90}
          />
        </div>
        <div className="hero__veil" />
        <div className="hero__grid" />
        <div className="hero__glow" />
      </div>

      <div className="hero__content">
        <div className="hero__badge reveal reveal--up">
          <span className="hero__badge-dot" />
          WV Veteran Owned · AI-Powered Web Systems
        </div>

        <h1 className="hero__title reveal reveal--up reveal--d1">
          Veteran AI
          <span className="hero__title-accent">Websites</span>
        </h1>

        <p className="hero__lead reveal reveal--up reveal--d2">
          Professional one-day websites for West Virginia businesses.
          Built with veteran discipline, modern AI craft, and full ownership.
        </p>

        <div className="hero__offer reveal reveal--scale reveal--d3">
          <p className="hero__offer-label">Limited Time · July 4th</p>
          <p className="hero__offer-headline">First Starter 1-Page Website</p>
          <p className="hero__offer-price">
            <span className="hero__price-was">$497</span>
            <span className="hero__price-now">$397</span>
          </p>
        </div>

        <div className="hero__cta reveal reveal--up reveal--d4">
          <a href="#build" onClick={onClaimOffer} className="btn btn--primary">
            Claim $397 Website
          </a>
          <a href="#pricing" className="btn btn--ghost">
            View Packages
          </a>
        </div>

        <p className="hero__note reveal reveal--up reveal--d5">
          Same-day delivery · 100% ownership · Pay after approval
        </p>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}