'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import {
  testimonials,
  projects,
  HVAC_PHONE,
  HVAC_PHONE_HREF,
} from '@/lib/complete-hvac-data';

export default function ReviewsPage() {
  useEffect(() => {
    document.title =
      'Customer Reviews & HVAC Projects | Appalachian HVAC Solutions | Ridgeview, WV';
  }, []);

  return (
    <>
      <section className="hv__phero">
        <div className="hv__phero-bg" aria-hidden="true">
          <Image
            src="/demos/complete-hvac/project-fall.jpg?v=2"
            alt=""
            fill
            sizes="100vw"
            quality={85}
            priority
          />
        </div>
        <div className="hv__phero-veil" aria-hidden="true" />
        <div className="hv__wrap hv__phero-in">
          <span className="hv__eyebrow">Real results from real homes</span>
          <h1>Reviews &amp; recent projects.</h1>
          <p>
            We&apos;re proud of the work we do and the long-term relationships
            we&apos;ve built with families across Ridgeview and the surrounding
            area.
          </p>
        </div>
      </section>

      <section className="hv__sec">
        <div className="hv__wrap">
          <div className="hv__intro hv__center">
            <p className="hv__kicker">What our customers say</p>
            <h2 className="hv__title">Trusted in homes across WV.</h2>
          </div>
          <div className="hv__reviews">
            {testimonials.map((r) => (
              <div key={r.name} className="hv__rev">
                <div className="hv__stars">★★★★★</div>
                <p>&ldquo;{r.quote}&rdquo;</p>
                <div className="hv__rev-who">
                  {r.name}
                  <span>
                    {r.location} · {r.project}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hv__sec hv__sec--tint">
        <div className="hv__wrap">
          <div className="hv__intro hv__center">
            <p className="hv__kicker">Completed work in our community</p>
            <h2 className="hv__title">Recent projects.</h2>
            <p className="hv__sub">
              Actual HVAC installations performed by our team in the Ridgeview
              area.
            </p>
          </div>
          <div className="hv__grid" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
            {projects.map((p) => (
              <article
                key={p.title}
                className="hv__card"
                style={{ padding: 0, overflow: 'hidden' }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16 / 10',
                  }}
                >
                  <Image
                    src={`${p.image}?v=2`}
                    alt={`${p.title} — ${p.location}`}
                    fill
                    sizes="(max-width:900px) 100vw, 45vw"
                    quality={85}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '22px 24px 26px' }}>
                  <h3 style={{ marginBottom: 4 }}>{p.title}</h3>
                  <p
                    style={{
                      color: 'var(--amber-d)',
                      fontWeight: 600,
                      marginBottom: 10,
                    }}
                  >
                    {p.location}
                  </p>
                  <p>{p.result}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hv__sec">
        <div className="hv__wrap">
          <div className="hv__band">
            <div className="hv__band-glow" aria-hidden="true" />
            <h2>Ready to join them?</h2>
            <p>
              We&apos;re grateful for the trust our community places in us — and
              we&apos;d be glad to earn yours.
            </p>
            <div className="hv__cta">
              <Link
                href="/examples/complete-hvac/contact"
                className="hv__btn hv__btn--primary"
              >
                Start your comfort project
              </Link>
              <a href={HVAC_PHONE_HREF} className="hv__btn hv__btn--ghost">
                <Phone size={18} /> {HVAC_PHONE}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
