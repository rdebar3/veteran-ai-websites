'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import HvacShell from '@/components/complete-hvac/HvacShell';
import { testimonials, projects } from '@/lib/complete-hvac-data';

export default function ReviewsPage() {
  useEffect(() => {
    document.title =
      'Customer Reviews & HVAC Projects | Appalachian HVAC Solutions | Ridgeview, WV';
  }, []);

  return (
    <HvacShell>
      <section className="hv-hero hv-hero--page">
        <div className="hv-hero__bg">
          <Image
            src="/demos/complete-hvac/project-fall.jpg?v=2"
            alt=""
            fill
            sizes="100vw"
            quality={85}
            className="hv-hero__bg-img"
          />
          <div className="hv-hero__veil" />
        </div>

        <div className="hv-hero__content">
          <p className="hv-section__eyebrow">Real Results from Real Homes</p>
          <h1 className="hv-hero__title" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)' }}>
            Customer Reviews
            <span className="hv-hero__title-accent">&amp; Projects</span>
          </h1>
          <p className="hv-hero__lead">
            We&apos;re proud of the work we do and the long-term relationships we&apos;ve built
            with families across Ridgeview and the surrounding area.
          </p>
        </div>
      </section>

      <section className="hv-section">
        <div className="hv-section__inner hv-reveal">
          <h2 className="hv-section__title" style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>
            What Our Customers Say
          </h2>

          <div className="hv-grid-2">
            {testimonials.map((t) => (
              <article key={t.name} className="hv-card hv-quote hv-reveal">
                <div className="hv-quote__stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="hv-quote__text">&ldquo;{t.quote}&rdquo;</p>
                <p className="hv-quote__author">{t.name}</p>
                <p className="hv-quote__meta">
                  {t.location} · {t.project}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="hv-section hv-section--vista hv-section--warm"
        style={{ '--hv-vista': "url('/mountains/misty-ridges.jpg')" } as React.CSSProperties}
      >
        <div className="hv-section__inner hv-reveal">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="hv-section__eyebrow">Completed Work in Our Community</p>
              <h2 className="hv-section__title" style={{ fontSize: '1.75rem' }}>
                Recent Projects
              </h2>
            </div>
            <Link href="/examples/complete-hvac/contact" className="hv-card__link">
              Ready to start your project? →
            </Link>
          </div>

          <div className="hv-grid-4">
            {projects.map((p) => (
              <article key={p.title} className="hv-card hv-card--media hv-reveal">
                <Image
                  src={p.image}
                  alt={`${p.title} — ${p.location}`}
                  width={500}
                  height={320}
                  className="w-full h-48 object-cover"
                />
                <div className="hv-card__body">
                  <h3 className="hv-card__title" style={{ fontSize: '1rem' }}>
                    {p.title}
                  </h3>
                  <p className="text-sm text-[var(--hv-muted)] mb-2">{p.location}</p>
                  <p className="text-sm leading-snug text-[var(--hv-rust)]">{p.result}</p>
                </div>
              </article>
            ))}
          </div>

          <p className="text-center text-xs text-[var(--hv-muted)] mt-8 opacity-70">
            All photos show actual HVAC installations performed by our team in the Ridgeview area.
          </p>
        </div>
      </section>

      <section className="hv-cta-band">
        <div className="hv-cta-band__inner hv-reveal">
          <p className="text-lg text-[var(--hv-muted)] mb-6">
            We&apos;re grateful for the trust our community places in us.
          </p>
          <Link href="/examples/complete-hvac/contact" className="hv-btn hv-btn--primary">
            Start Your Comfort Project
          </Link>
        </div>
      </section>
    </HvacShell>
  );
}