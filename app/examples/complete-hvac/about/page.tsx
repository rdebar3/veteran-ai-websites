'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Award, CheckCircle } from 'lucide-react';
import HvacShell from '@/components/complete-hvac/HvacShell';
import { values, HVAC_PHONE_HREF } from '@/lib/complete-hvac-data';

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About Appalachian HVAC Solutions | Ridgeview, WV';
  }, []);

  return (
    <HvacShell>
      <section className="hv-hero hv-hero--page">
        <div className="hv-hero__bg">
          <Image
            src="/demos/complete-hvac/entrance-fall-home.jpg"
            alt=""
            fill
            sizes="100vw"
            quality={85}
            className="hv-hero__bg-img"
          />
          <div className="hv-hero__veil" />
        </div>

        <div className="hv-hero__content">
          <p className="hv-section__eyebrow">Our Story</p>
          <h1 className="hv-hero__title" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)' }}>
            Built in Ridgeview.
            <span className="hv-hero__title-accent">Here for the long run.</span>
          </h1>
          <p className="hv-hero__lead">
            We&apos;re a local, veteran-owned company that believes every home deserves
            dependable heating, cooling, and clean air — delivered with honesty and care.
          </p>
        </div>
      </section>

      <section className="hv-section">
        <div className="hv-section__inner hv-reveal">
          <div className="hv-grid-2" style={{ alignItems: 'center', gap: '2.5rem' }}>
            <div>
              <h2 className="hv-section__title" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)' }}>
                How Appalachian HVAC began
              </h2>
              <div className="space-y-4 text-[var(--hv-muted)] leading-relaxed">
                <p>
                  Appalachian HVAC Solutions was founded in 2011 by a U.S. Army veteran who grew up
                  in the mountains around Ridgeview. After years working for larger companies, he
                  saw the need for a local team that would treat every customer like a neighbor.
                </p>
                <p>
                  We started small — one truck and a commitment to doing the job right the first time.
                  Today we serve families across Ridgeview, Oakdale, Pine Hollow, and surrounding
                  communities with the same values we started with.
                </p>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--hv-orange)]">
                <Award className="h-5 w-5" /> U.S. Army Veteran Owned &amp; Operated
              </div>
            </div>

            <div className="hv-card" style={{ padding: 0, overflow: 'hidden' }}>
              <Image
                src="/demos/complete-hvac/service-heating-fall.jpg"
                alt="Professional HVAC service in a warm Ridgeview home"
                width={800}
                height={520}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="hv-section hv-section--vista hv-section--warm"
        style={{ '--hv-vista': "url('/mountains/foothills.jpg')" } as React.CSSProperties}
      >
        <div className="hv-section__inner hv-reveal">
          <div className="text-center mb-10">
            <p className="hv-section__eyebrow">What Guides Us</p>
            <h2 className="hv-section__title">Our Values</h2>
          </div>

          <div className="hv-grid-4">
            {values.map((v) => (
              <article key={v.title} className="hv-card hv-reveal">
                <h3 className="hv-card__title">{v.title}</h3>
                <p className="hv-card__text">{v.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hv-section">
        <div className="hv-section__inner hv-reveal">
          <div className="hv-card" style={{ padding: '2.5rem' }}>
            <div className="hv-grid-2" style={{ alignItems: 'start' }}>
              <div>
                <h3 className="hv-section__title" style={{ fontSize: '1.75rem' }}>
                  Deeply rooted in Ridgeview
                </h3>
                <p className="hv-section__lead" style={{ marginBottom: 0 }}>
                  Many of our customers are families we&apos;ve known for years. We know the homes here —
                  older farmhouses, newer builds, and everything in between — and how our mountain
                  climate affects heating and cooling systems.
                </p>
              </div>
              <div className="space-y-3 text-sm text-[var(--hv-muted)]">
                {[
                  'We stock common parts on every truck for faster repairs',
                  'No overtime charges for evenings or weekends on emergencies',
                  'Written estimates and clear communication before we start',
                  'Many customers have been with us for over a decade',
                ].map((text) => (
                  <div key={text} className="flex gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-[var(--hv-orange)]" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hv-cta-band">
        <div className="hv-cta-band__inner hv-reveal">
          <h3>Meet the team behind your comfort</h3>
          <p>Call today and speak with a local Ridgeview technician.</p>
          <a href={HVAC_PHONE_HREF} className="hv-btn hv-btn--primary">
            Contact Us
          </a>
        </div>
      </section>
    </HvacShell>
  );
}