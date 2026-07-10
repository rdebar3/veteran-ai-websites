'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Award, Phone } from 'lucide-react';
import {
  values, serviceAreas,
  HVAC_PHONE, HVAC_PHONE_HREF, HVAC_FOUNDED,
} from '@/lib/complete-hvac-data';

const promises = [
  'We stock common parts on every truck for faster repairs',
  'No overtime charges for evenings or weekends on emergencies',
  'Written estimates and clear communication before we start',
  'Many customers have been with us for over a decade',
];

export default function AboutPage() {
  return (
    <>
      <section className="hv__phero">
        <div className="hv__phero-bg" aria-hidden="true">
          <Image src="/demos/complete-hvac/entrance-mountains.jpg?v=2" alt="" fill sizes="100vw" quality={85} priority />
        </div>
        <div className="hv__phero-veil" aria-hidden="true" />
        <div className="hv__wrap hv__phero-in">
          <span className="hv__eyebrow">Our story</span>
          <h1>Built in Ridgeview. Here for the long run.</h1>
          <p>A local, family-owned and veteran-operated team that believes every home deserves dependable comfort — delivered with honesty and care.</p>
        </div>
      </section>

      <section className="hv__sec">
        <div className="hv__wrap">
          <div className="hv__feature">
            <div className="hv__feature-img">
              <Image src="/demos/complete-hvac/about-team.jpg?v=2" alt="The Appalachian HVAC team in Ridgeview, West Virginia" fill sizes="(max-width:840px) 100vw, 45vw" quality={90} />
            </div>
            <div className="hv__feature-body">
              <p className="hv__kicker">How we began</p>
              <h2>One truck, one promise.</h2>
              <p>
                Appalachian HVAC was founded in {HVAC_FOUNDED} by a local Army veteran who grew up in
                the mountains around Ridgeview. After years working for bigger outfits, he wanted to
                build a family company that treats every customer like a neighbor — because here, they are.
              </p>
              <p>
                We started with one truck and a commitment to doing the job right the first time. Today
                we keep families comfortable across Ridgeview and the surrounding communities, with the
                same values we started with.
              </p>
              <div className="hv__points" style={{ marginTop: 6 }}>
                <li><span><Award size={18} /></span> Family-owned &amp; veteran-operated since {HVAC_FOUNDED}</li>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hv__sec hv__sec--tint">
        <div className="hv__wrap">
          <div className="hv__intro hv__center">
            <p className="hv__kicker">What guides us</p>
            <h2 className="hv__title">Our values</h2>
          </div>
          <div className="hv__grid">
            {values.map((v) => (
              <div key={v.title} className="hv__card">
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hv__sec">
        <div className="hv__wrap">
          <div className="hv__feature" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <p className="hv__kicker">Rooted here</p>
              <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, color: 'var(--espresso)', letterSpacing: '-.02em', lineHeight: 1.1, margin: '0 0 16px' }}>
                Deeply local, in every way.
              </h2>
              <p style={{ fontSize: 16.5, lineHeight: 1.65, color: 'var(--muted)', margin: '0 0 22px' }}>
                Many of our customers are families we’ve known for years. We know the homes here — older
                farmhouses, newer builds, and everything between — and how our mountain climate treats a
                heating and cooling system.
              </p>
              <ul className="hv__srv-feat">
                {promises.map((t) => (
                  <li key={t}><CheckCircle size={18} /> {t}</li>
                ))}
              </ul>
            </div>
            <div className="hv__card" style={{ padding: '30px 28px' }}>
              <h3 style={{ fontSize: 19, fontWeight: 700, color: 'var(--espresso)', margin: '0 0 14px' }}>Proudly serving</h3>
              <p style={{ fontSize: 15.5, lineHeight: 1.7, color: 'var(--muted)', margin: 0 }}>
                {serviceAreas.join(' · ')} — and the surrounding communities.
              </p>
              <div className="hv__cta" style={{ marginTop: 24 }}>
                <a href={HVAC_PHONE_HREF} className="hv__btn hv__btn--primary"><Phone size={17} /> {HVAC_PHONE}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hv__sec hv__sec--tint">
        <div className="hv__wrap">
          <div className="hv__band">
            <div className="hv__band-glow" aria-hidden="true" />
            <h2>Meet the team behind your comfort.</h2>
            <p>Give us a call or send a note — a local Ridgeview technician will take good care of you.</p>
            <div className="hv__cta">
              <Link href="/examples/complete-hvac/contact" className="hv__btn hv__btn--primary">Contact us</Link>
              <a href={HVAC_PHONE_HREF} className="hv__btn hv__btn--ghost"><Phone size={18} /> {HVAC_PHONE}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
