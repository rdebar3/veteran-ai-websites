'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import HvacShell from '@/components/complete-hvac/HvacShell';
import { services } from '@/lib/complete-hvac-data';

export default function ServicesPage() {
  useEffect(() => {
    document.title = 'HVAC Services | Appalachian HVAC Solutions | Ridgeview, WV';
  }, []);

  return (
    <HvacShell>
      <section className="hv-hero hv-hero--page">
        <div className="hv-hero__bg">
          <Image
            src="/demos/complete-hvac/hero-tech.jpg"
            alt=""
            fill
            sizes="100vw"
            quality={85}
            className="hv-hero__bg-img"
          />
          <div className="hv-hero__veil" />
          <div className="hv-hero__grid" />
          <div className="hv-hero__glow" />
        </div>

        <div className="hv-hero__content">
          <p className="hv-section__eyebrow">Expertise You Can Rely On</p>
          <h1 className="hv-hero__title" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)' }}>
            Professional
            <span className="hv-hero__title-accent">Smart HVAC Services</span>
          </h1>
          <p className="hv-hero__lead">
            From high-efficiency installations to ongoing care, we deliver climate solutions
            engineered for Ridgeview homes and our Appalachian weather.
          </p>
        </div>
      </section>

      <section className="hv-section">
        <div className="hv-section__inner">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.title} className="hv-service-block hv-reveal">
                <div className="hv-service-block__sticky">
                  <div className="hv-card__icon">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="hv-section__title" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)' }}>
                    {service.title}
                  </h2>
                  <p className="hv-section__lead" style={{ marginBottom: 0 }}>
                    {service.desc}
                  </p>
                </div>

                <div>
                  <Image
                    src={service.image}
                    alt={`${service.title} installation in Ridgeview, West Virginia`}
                    width={900}
                    height={500}
                    className="hv-service-block__img"
                  />
                  <div className="hv-feature-list">
                    {service.features.map((feature) => (
                      <span key={feature}>
                        <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-[var(--hv-cyan)]" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="hv-cta-band">
        <div className="hv-cta-band__inner hv-reveal">
          <h3>Protect your system with a Maintenance Plan</h3>
          <p>
            Twice-yearly visits keep equipment efficient and often include priority service
            and discounts on repairs.
          </p>
          <Link href="/examples/complete-hvac/contact" className="hv-btn hv-btn--primary">
            Get a Maintenance Plan Quote
          </Link>
        </div>
      </section>
    </HvacShell>
  );
}