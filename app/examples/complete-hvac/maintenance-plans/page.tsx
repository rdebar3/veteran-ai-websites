'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Phone, ShieldCheck, Clock, BadgePercent } from 'lucide-react';
import { plans, HVAC_PHONE, HVAC_PHONE_HREF } from '@/lib/complete-hvac-data';

const perks = [
  { icon: ShieldCheck, title: 'Fewer breakdowns', desc: 'Regular tune-ups catch small problems before they leave you without heat or cooling.' },
  { icon: BadgePercent, title: 'Real savings', desc: 'Members save on every repair and keep equipment running efficiently to lower energy bills.' },
  { icon: Clock, title: 'Front of the line', desc: 'Plan members get priority scheduling — you’re taken care of first, especially in a rush.' },
];

export default function MaintenancePlansPage() {
  return (
    <>
      <section className="hv__phero">
        <div className="hv__phero-bg" aria-hidden="true">
          <Image src="/demos/complete-hvac/entrance-fireplace.jpg?v=2" alt="" fill sizes="100vw" quality={85} priority />
        </div>
        <div className="hv__phero-veil" aria-hidden="true" />
        <div className="hv__wrap hv__phero-in">
          <span className="hv__eyebrow">Comfort plans</span>
          <h1>Peace of mind, one plan at a time.</h1>
          <p>Seasonal tune-ups, priority service, and member discounts — so your system keeps your family comfortable without the surprise repair bills.</p>
        </div>
      </section>

      <section className="hv__sec">
        <div className="hv__wrap">
          <div className="hv__grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {perks.map((p) => (
              <div key={p.title} className="hv__card">
                <span className="hv__ic"><p.icon size={24} /></span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hv__sec hv__sec--tint">
        <div className="hv__wrap">
          <div className="hv__intro hv__center">
            <p className="hv__kicker">Choose your plan</p>
            <h2 className="hv__title">Simple plans, honest pricing.</h2>
            <p className="hv__sub">Pay monthly or save with an annual plan. Cancel anytime — no long contracts, ever.</p>
          </div>
          <div className="hv__plans">
            {plans.map((plan) => (
              <div key={plan.name} className={`hv__plan${plan.featured ? ' hv__plan--feat' : ''}`}>
                {plan.featured && <span className="hv__plan-badge">Most popular</span>}
                <h3>{plan.name}</h3>
                <p className="hv__plan-blurb">{plan.blurb}</p>
                <div className="hv__plan-price">
                  <b>${plan.monthly}</b><span>/ month</span>
                </div>
                <p className="hv__plan-year">or ${plan.yearly}/year — save ${plan.monthly * 12 - plan.yearly}</p>
                <ul className="hv__plan-feats">
                  {plan.features.map((f) => (
                    <li key={f}><CheckCircle size={17} /> {f}</li>
                  ))}
                </ul>
                <Link
                  href="/examples/complete-hvac/contact"
                  className={`hv__btn ${plan.featured ? 'hv__btn--primary' : 'hv__btn--dark'}`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
          <p className="hv__form-note" style={{ marginTop: 22 }}>
            Not sure which plan fits? Call us at <a href={HVAC_PHONE_HREF} style={{ color: 'var(--amber-d)', fontWeight: 600 }}>{HVAC_PHONE}</a> and we’ll help you pick.
          </p>
        </div>
      </section>

      <section className="hv__sec">
        <div className="hv__wrap">
          <div className="hv__band">
            <div className="hv__band-glow" aria-hidden="true" />
            <h2>Join the comfort club.</h2>
            <p>Enroll in minutes and we’ll schedule your first tune-up right away.</p>
            <div className="hv__cta">
              <Link href="/examples/complete-hvac/contact" className="hv__btn hv__btn--primary">Enroll now</Link>
              <a href={HVAC_PHONE_HREF} className="hv__btn hv__btn--ghost"><Phone size={18} /> {HVAC_PHONE}</a>
            </div>
            <p className="hv__band-fin">Need a whole new system? Ask about financing — comfortable monthly payments.</p>
          </div>
        </div>
      </section>
    </>
  );
}
