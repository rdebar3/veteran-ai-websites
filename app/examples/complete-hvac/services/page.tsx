'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, ArrowRight, Phone } from 'lucide-react';
import { services, HVAC_PHONE, HVAC_PHONE_HREF } from '@/lib/complete-hvac-data';

export default function ServicesPage() {
  return (
    <>
      <section className="hv__phero">
        <div className="hv__phero-bg" aria-hidden="true">
          <Image src="/demos/complete-hvac/service-heating-fall.jpg?v=2" alt="" fill sizes="100vw" quality={85} priority />
        </div>
        <div className="hv__phero-veil" aria-hidden="true" />
        <div className="hv__wrap hv__phero-in">
          <span className="hv__eyebrow">What we do</span>
          <h1>Heating, cooling &amp; clean air — done right.</h1>
          <p>From high-efficiency installs to seasonal tune-ups, we handle it all for homes across Ridgeview and central West Virginia.</p>
        </div>
      </section>

      <section className="hv__sec">
        <div className="hv__wrap">
          <div className="hv__srv-list">
            {services.map((s) => (
              <article key={s.title} className="hv__srv">
                <div>
                  <div className="hv__srv-head">
                    <span className="hv__ic"><s.icon size={24} /></span>
                    <h2>{s.title}</h2>
                  </div>
                  <p className="hv__srv-desc">{s.desc}</p>
                </div>
                <ul className="hv__srv-feat">
                  {s.features.map((f) => (
                    <li key={f}><CheckCircle size={18} /> {f}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hv__sec hv__sec--tint">
        <div className="hv__wrap">
          <div className="hv__band">
            <div className="hv__band-glow" aria-hidden="true" />
            <h2>Protect your system year-round.</h2>
            <p>A maintenance plan keeps your equipment efficient, adds priority service, and saves you money on any repairs.</p>
            <div className="hv__cta">
              <Link href="/examples/complete-hvac/maintenance-plans" className="hv__btn hv__btn--primary">See maintenance plans <ArrowRight size={17} /></Link>
              <a href={HVAC_PHONE_HREF} className="hv__btn hv__btn--ghost"><Phone size={17} /> {HVAC_PHONE}</a>
            </div>
            <p className="hv__band-fin">Financing available on new systems — comfortable monthly payments, with fast approval.</p>
          </div>
        </div>
      </section>
    </>
  );
}
