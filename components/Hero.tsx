'use client';

import { useEffect, useRef } from 'react';
import HeroBackground from '@/components/HeroBackground';
import CircuitOverlay from '@/components/CircuitOverlay';
import PatrioticOverlay from '@/components/PatrioticOverlay';
import NeuralOverlay from '@/components/NeuralOverlay';
import { baseRooms } from '@/lib/base-rooms';
import { getViewProgress } from '@/lib/scroll-cinema';

interface HeroProps {
  onClaimOffer?: () => void;
}

export default function Hero({ onClaimOffer }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const room = baseRooms['main-gate'];

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const content = hero.querySelector<HTMLElement>('.hero__content');
    const circuit = hero.querySelector<HTMLElement>('.hero__circuit');
    const badge = hero.querySelector<HTMLElement>('.hero__landmark-badge');
    let raf = 0;

    const tick = () => {
      const scrollP = hero.offsetHeight > 0
        ? Math.min(1, Math.max(0, window.scrollY / hero.offsetHeight))
        : 0;
      const viewP = getViewProgress(hero);

      if (content) {
        content.style.transform = `translate3d(0, ${scrollP * 32}px, 0) scale(${1 - scrollP * 0.08})`;
        content.style.opacity = String(1 - scrollP * 0.35);
      }

      if (circuit) {
        circuit.style.transform = `translate3d(0, ${scrollP * 18}px, 0)`;
        circuit.style.opacity = String(0.55 - scrollP * 0.2);
      }

      if (badge) {
        badge.style.transform = `translate3d(0, ${scrollP * 12}px, 0)`;
      }

      hero.style.setProperty('--hero-scroll', String(scrollP));
      hero.style.setProperty('--hero-view', String(viewP));

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="hero" ref={heroRef} className="hero hero--cinematic hero--driven hero--outpost hero--gate">
      <div className="hero__visual" aria-hidden="true">
        <HeroBackground />
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
        <div className="hero__landmark-badge">
          <span className="hero__landmark-name">{room.vistaName}</span>
          <span className="hero__landmark-outpost">{room.vistaOutpost}</span>
        </div>
      </div>

      <div className="hero__gate-status" aria-hidden="true">
        <span className="hero__gate-dot" />
        <span>{room.codename}</span>
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
        <span>Enter the command base</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}