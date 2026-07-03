'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, CheckCircle, Star, Shield, Award, ThermometerSun } from 'lucide-react';
import CinematicEntrance from '@/components/complete-hvac/CinematicEntrance';
import HvacShell from '@/components/complete-hvac/HvacShell';
import {
  homeServices,
  testimonials,
  HVAC_PHONE,
  HVAC_PHONE_HREF,
} from '@/lib/complete-hvac-data';

export default function HvacHome() {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    document.title =
      'Appalachian HVAC Solutions | Warm Comfort for Ridgeview, WV';
  }, []);

  const handleIntroComplete = useCallback(() => setIntroDone(true), []);

  return (
    <HvacShell introActive={!introDone}>
      {!introDone && <CinematicEntrance onComplete={handleIntroComplete} />}

      <section className="hv-hero hv-hero--home">
        <div className="hv-hero__bg">
          <Image
            src="/demos/complete-hvac/hero-fall.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={92}
            className="hv-hero__bg-img"
          />
          <div className="hv-hero__veil hv-hero__veil--home" />
          <div className="hv-hero__ember" aria-hidden />
        </div>

        <div className="hv-hero__content hv-hero__content--home">
          <p className="hv-hero__eyebrow">Ridgeview, West Virginia · Veteran Owned</p>

          <h1 className="hv-hero__title">
            Reliable Comfort
            <span className="hv-hero__title-accent">for Every Season</span>
          </h1>

          <p className="hv-hero__lead">
            Honest heating and cooling for Ridgeview families — keeping your home warm,
            efficient, and comfortable through every West Virginia season.
          </p>

          <div className="hv-hero__cta-row">
            <Link href="/examples/complete-hvac/contact" className="hv-btn hv-btn--primary">
              Get a Free Quote
            </Link>
            <a href={HVAC_PHONE_HREF} className="hv-btn hv-btn--ghost">
              <Phone className="h-4 w-4" /> Call {HVAC_PHONE}
            </a>
          </div>
        </div>
      </section>

      <div className="hv-trust-strip">
        <div className="hv-trust-strip__inner">
          <span>
            <Shield className="inline h-3.5 w-3.5 text-[var(--hv-orange)]" /> Licensed &amp; Insured · WV #HV-48291
          </span>
          <span>
            <Award className="inline h-3.5 w-3.5 text-[var(--hv-orange)]" /> Veteran Owned &amp; Operated
          </span>
          <span>
            <ThermometerSun className="inline h-3.5 w-3.5 text-[var(--hv-orange)]" /> High-Efficiency Systems
          </span>
          <span>24/7 Emergency Response</span>
        </div>
      </div>

      <section
        className="hv-section hv-section--vista"
        style={{ '--hv-vista': "url('/mountains/golden-overlook.jpg')" } as React.CSSProperties}
      >
        <div className="hv-section__inner hv-reveal">
          <p className="hv-section__eyebrow">What We Deliver</p>
          <h2 className="hv-section__title">Comfort Solutions for Ridgeview Homes</h2>
          <p className="hv-section__lead">
            From furnace tune-ups before the first frost to whole-home air quality, we help
            families stay cozy through West Virginia&apos;s beautiful — and demanding — seasons.
          </p>

          <div className="hv-grid-3">
            {homeServices.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className="hv-card hv-reveal">
                  <div className="hv-card__icon">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="hv-card__title">{service.title}</h3>
                  <p className="hv-card__text">{service.desc}</p>
                  <Link href="/examples/complete-hvac/services" className="hv-card__link">
                    Learn more →
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="hv-section hv-section--warm">
        <div className="hv-section__inner hv-reveal">
          <div className="hv-grid-2" style={{ alignItems: 'center', gap: '2.5rem' }}>
            <div>
              <p className="hv-section__eyebrow">The Appalachian Difference</p>
              <h2 className="hv-section__title">Comfort you can count on, from people you trust.</h2>
              <p className="hv-section__lead" style={{ marginBottom: '1.5rem' }}>
                We design, install, and maintain systems that deliver consistent temperatures,
                lower energy bills, and cleaner air — all while treating your home with respect.
              </p>
              <div className="hv-grid-2">
                {[
                  'Properly sized equipment for maximum efficiency',
                  'Honest, upfront pricing with no hidden fees',
                  'Local technicians who know Ridgeview homes',
                  'Strong warranties backed by our service guarantee',
                ].map((text) => (
                  <div key={text} className="hv-card" style={{ padding: '1rem 1.25rem' }}>
                    <span className="flex gap-2 text-sm text-[var(--hv-muted)]">
                      <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-[var(--hv-orange)]" />
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hv-card hv-reveal" style={{ padding: 0, overflow: 'hidden' }}>
              <Image
                src="/demos/complete-hvac/entrance-fireplace.jpg"
                alt="Cozy living room with warm fireplace and comfortable HVAC"
                width={800}
                height={520}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="hv-section">
        <div className="hv-section__inner hv-reveal">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="hv-section__eyebrow">Real Families. Real Results.</p>
              <h2 className="hv-section__title">What Our Neighbors Are Saying</h2>
            </div>
            <Link href="/examples/complete-hvac/reviews" className="hv-card__link">
              View all reviews &amp; projects →
            </Link>
          </div>

          <div className="hv-grid-3">
            {testimonials.slice(0, 3).map((t) => (
              <article key={t.name} className="hv-card hv-quote hv-reveal">
                <div className="hv-quote__stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="hv-quote__text">&ldquo;{t.quote}&rdquo;</p>
                <p className="hv-quote__author">{t.name}</p>
                <p className="hv-quote__meta">{t.location}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hv-cta-band">
        <div className="hv-cta-band__inner hv-reveal">
          <h3>Ready for reliable comfort this season?</h3>
          <p>Get a no-obligation quote from our local Ridgeview team. Most quotes provided same day.</p>
          <Link href="/examples/complete-hvac/contact" className="hv-btn hv-btn--primary">
            Schedule Service or Get a Quote
          </Link>
          <p className="mt-4 text-sm text-[var(--hv-muted)]">Or call us anytime at {HVAC_PHONE}</p>
        </div>
      </section>
    </HvacShell>
  );
}