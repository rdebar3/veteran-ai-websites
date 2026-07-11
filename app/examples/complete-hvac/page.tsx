'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Phone, Flame, Snowflake, MapPin, CheckCircle, Heart, Users, Shield, ArrowRight,
} from 'lucide-react';
import {
  homeServices, testimonials,
  HVAC_PHONE, HVAC_PHONE_HREF, HVAC_FOUNDED,
} from '@/lib/complete-hvac-data';

const IMG_HERO = '/demos/complete-hvac/hero-fall.jpg?v=2';
const IMG_WINTER = '/demos/complete-hvac/entrance-fireplace.jpg?v=2';
const VID_FIRE = '/demos/complete-hvac/entrance-fireplace.mp4?v=2';
const IMG_SUMMER = '/demos/complete-hvac/entrance-mountains.jpg?v=2';
const IMG_CREW = '/demos/complete-hvac/about-team.jpg?v=2';

const familyPoints = [
  { icon: Heart, text: `Family-owned & veteran-operated since ${HVAC_FOUNDED}` },
  { icon: Users, text: 'Background-checked, uniformed technicians' },
  { icon: CheckCircle, text: 'Upfront pricing — no surprises, ever' },
  { icon: Shield, text: 'Financing & maintenance plans available' },
];

export default function AppalachianHvacHome() {
  const [gateOpen, setGateOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [claimed, setClaimed] = useState(false);

  // Show the new-customer offer only once per visit — not every time you hit Home.
  useEffect(() => {
    try {
      if (!sessionStorage.getItem('hvGateSeen')) setGateOpen(true);
    } catch {
      setGateOpen(true);
    }
  }, []);
  const closeGate = () => {
    try { sessionStorage.setItem('hvGateSeen', '1'); } catch {}
    setGateOpen(false);
  };

  return (
    <>
      {gateOpen && (
        <div className="hv__gate" role="dialog" aria-modal="true" aria-label="New customer offer">
          <div className="hv__gate-bg" aria-hidden="true">
            <video className="hv__gate-video" src={VID_FIRE} poster={IMG_WINTER} autoPlay muted loop playsInline preload="auto" />
          </div>
          <div className="hv__gate-veil" aria-hidden="true" />
          <div className="hv__gate-card">
            {claimed ? (
              <>
                <span className="hv__gate-badge"><Flame size={15} /> You’re in</span>
                <h2>Welcome to the family.</h2>
                <p>Use code <b>COZY10</b> for 10% off your first service — we’ve emailed it to you too.</p>
                <button className="hv__btn hv__btn--primary" onClick={closeGate}>Enter the site →</button>
              </>
            ) : (
              <>
                <span className="hv__gate-badge"><Flame size={15} /> New customer offer</span>
                <h2>Get 10% off your first service.</h2>
                <p>Join our comfort list and we’ll send a code you can use on any repair, tune-up, or install.</p>
                <form
                  className="hv__gate-form"
                  onSubmit={(e) => { e.preventDefault(); if (email.trim() && email.includes('@')) setClaimed(true); }}
                >
                  <input
                    className="hv__gate-input" type="email" placeholder="you@email.com"
                    value={email} onChange={(e) => setEmail(e.target.value)} required
                  />
                  <button type="submit" className="hv__btn hv__btn--primary">Get my 10% off</button>
                </form>
                <button className="hv__gate-skip" onClick={closeGate}>
                  No thanks, take me to the site
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <section className="hv__hero">
        <div className="hv__hero-bg" aria-hidden="true">
          <Image src={IMG_HERO} alt="A West Virginia family comfortable and cozy at home" fill priority sizes="100vw" quality={90} />
        </div>
        <div className="hv__hero-veil" aria-hidden="true" />
        <div className="hv__wrap hv__hero-in">
          <span className="hv__eyebrow"><MapPin size={14} /> Family-owned · Serving West Virginia</span>
          <h1 className="hv__h1">Keeping West Virginia families comfortable, season after season.</h1>
          <p className="hv__lead">
            Warm in the winter, cool in the summer, and cared for by neighbors who treat your
            home like their own. That’s comfort you can count on.
          </p>
          <div className="hv__cta">
            <Link href="/examples/complete-hvac/contact" className="hv__btn hv__btn--primary">Schedule service</Link>
            <a href={HVAC_PHONE_HREF} className="hv__btn hv__btn--ghost"><Phone size={17} /> {HVAC_PHONE}</a>
          </div>
          <div className="hv__hero-trust">
            <span><CheckCircle size={15} /> Family-owned since {HVAC_FOUNDED}</span>
            <span><CheckCircle size={15} /> Licensed &amp; insured</span>
            <span><CheckCircle size={15} /> Financing available</span>
          </div>
        </div>
      </section>

      <section className="hv__stats" aria-label="Why families trust us">
        <div className="hv__wrap hv__stats-in">
          <div className="hv__stat"><b>Since 2009</b><span>Family-owned &amp; veteran-operated</span></div>
          <div className="hv__stat"><b>3,500+</b><span>Systems serviced</span></div>
          <div className="hv__stat"><b>4.9&#9733;</b><span>Average rating</span></div>
          <div className="hv__stat"><b>Licensed</b><span>&amp; fully insured</span></div>
        </div>
      </section>

      <section className="hv__sec">
        <div className="hv__wrap">
          <div className="hv__intro">
            <p className="hv__kicker">What we do</p>
            <h2 className="hv__title">Comfort for every season.</h2>
            <p className="hv__sub">Heating, cooling, and cleaner air — installed, repaired, and maintained by a team that actually picks up the phone.</p>
          </div>
          <div className="hv__grid">
            {homeServices.map((s) => (
              <div key={s.title} className="hv__card">
                <span className="hv__ic"><s.icon size={24} /></span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 30 }}>
            <Link href="/examples/complete-hvac/services" className="hv__btn hv__btn--dark">
              See all services <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="hv__sec hv__sec--tint">
        <div className="hv__wrap">
          <div className="hv__intro hv__center">
            <p className="hv__kicker">Year-round comfort</p>
            <h2 className="hv__title">Cozy when it’s cold. Cool when it’s hot.</h2>
          </div>
          <div className="hv__season">
            <div className="hv__panel hv__panel--w">
              <Image src={IMG_WINTER} alt="Cozy warm living room in winter" fill sizes="(max-width:840px) 100vw, 50vw" quality={90} />
              <div className="hv__panel-veil" aria-hidden="true" />
              <div className="hv__panel-body">
                <span className="tag"><Flame size={15} /> Winter</span>
                <h3>Warm in every room</h3>
                <p>Reliable heat that keeps the whole house cozy — even on the coldest mountain nights.</p>
              </div>
            </div>
            <div className="hv__panel hv__panel--s">
              <Image src={IMG_SUMMER} alt="Bright cool comfortable living room in summer" fill sizes="(max-width:840px) 100vw, 50vw" quality={90} />
              <div className="hv__panel-veil" aria-hidden="true" />
              <div className="hv__panel-body">
                <span className="tag"><Snowflake size={15} /> Summer</span>
                <h3>Cool &amp; fresh all day</h3>
                <p>Efficient cooling and cleaner air so summer stays comfortable and easy to breathe.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hv__sec">
        <div className="hv__wrap">
          <div className="hv__feature">
            <div className="hv__feature-img">
              <Image src={IMG_CREW} alt="Your friendly local Appalachian HVAC technician" fill sizes="(max-width:840px) 100vw, 45vw" quality={90} />
            </div>
            <div className="hv__feature-body">
              <p className="hv__kicker">Our family</p>
              <h2>Your neighbors — not a call center.</h2>
              <p>When you call Appalachian HVAC, you reach real people who live right here. The same friendly faces, season after season, who’ll treat your family and your home with respect.</p>
              <ul className="hv__points">
                {familyPoints.map((p) => (
                  <li key={p.text}><span><p.icon size={18} /></span> {p.text}</li>
                ))}
              </ul>
              <div className="hv__cta" style={{ marginTop: 26 }}>
                <Link href="/examples/complete-hvac/about" className="hv__btn hv__btn--primary">Meet our team <ArrowRight size={17} /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hv__sec hv__sec--tint">
        <div className="hv__wrap">
          <div className="hv__intro hv__center">
            <p className="hv__kicker">Reviews</p>
            <h2 className="hv__title">Trusted in homes across WV.</h2>
          </div>
          <div className="hv__reviews">
            {testimonials.map((r) => (
              <div key={r.name} className="hv__rev">
                <div className="hv__stars">★★★★★</div>
                <p>“{r.quote}”</p>
                <div className="hv__rev-who">{r.name}<span>{r.location} · {r.project}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hv__sec">
        <div className="hv__wrap">
          <div className="hv__band">
            <div className="hv__band-glow" aria-hidden="true" />
            <h2>Let’s get your home comfortable.</h2>
            <p>Book a visit or call now — same-day service available, and financing to make it easy.</p>
            <div className="hv__cta">
              <a href={HVAC_PHONE_HREF} className="hv__btn hv__btn--primary"><Phone size={18} /> {HVAC_PHONE}</a>
              <Link href="/examples/complete-hvac/contact" className="hv__btn hv__btn--ghost">Schedule online</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
