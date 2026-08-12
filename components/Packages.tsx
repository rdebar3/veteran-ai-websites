'use client';

import { useEffect, useState } from 'react';
import {
  pricingTiers,
  getDisplayPrice,
  formatUsd,
  ONLINE_STORE_PRICE,
  addOnsList,
  carePlans,
  getCarePlan,
  getBuildTotal,
  type CheckoutPlanId,
} from '@/lib/data';
import { PHONE, PHONE_HREF } from '@/lib/contact';

const demoLinks: Record<string, string> = {
  Essential: '/examples/starter-plumbing',
  Standard: '/examples/complete-hvac',
  Advanced: '/examples/premium-restaurant',
};

const onlineStore = addOnsList.find((a) => a.id === 'online-store')!;

const styles = `
.pk{position:relative;background:transparent;color:#eef4f8;padding:clamp(44px,6vw,84px) clamp(20px,6vw,72px)}
.pk__head{max-width:680px;margin:0 auto clamp(22px,3vw,34px);text-align:center}
.pk__eyebrow{font-family:var(--font-sans);font-size:13px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgba(233,240,246,.72);margin:0 0 16px}
.pk__title{font-family:var(--font-sans);font-size:clamp(26px,3.2vw,42px);font-weight:600;letter-spacing:-.03em;line-height:1.04;color:#fff;margin:0}
.pk__sub{margin:14px auto 0;max-width:52ch;font-size:clamp(14px,1.1vw,16px);line-height:1.6;color:rgba(233,240,246,.72)}
.pk__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:1000px;margin:0 auto}
.pk__card{position:relative;display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(233,240,246,.14);border-radius:16px;background:rgba(12,16,22,.62);backdrop-filter:blur(12px) saturate(1.15);-webkit-backdrop-filter:blur(12px) saturate(1.15);padding:26px 22px;transition:border-color .25s,transform .3s,box-shadow .3s}
.pk__card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--acc,#5b9bd5);z-index:3}
.pk__grid .pk__card:nth-child(1){--acc:#5b9bd5}
.pk__grid .pk__card:nth-child(2){--acc:#e0912f}
.pk__grid .pk__card:nth-child(3){--acc:#c2452f}
.pk__card:hover{border-color:rgba(233,240,246,.34);transform:translateY(-6px);box-shadow:0 28px 64px rgba(0,0,0,.55)}
.pk__card.is-sel{border-color:rgba(233,240,246,.72);background:rgba(22,28,37,.72);box-shadow:0 24px 60px rgba(0,0,0,.5)}
.pk__card.is-pop{border-color:rgba(233,240,246,.4)}
.pk__pop{position:absolute;top:-11px;left:50%;transform:translateX(-50%);font-family:var(--font-sans);font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#0a0e14;background:#f4f7fa;padding:5px 12px;border-radius:999px;z-index:4;white-space:nowrap}
.pk__name{font-family:var(--font-sans);font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(233,240,246,.7);margin:0 0 14px}
.pk__price{display:flex;align-items:baseline;gap:10px;margin-bottom:6px}
.pk__price b{font-family:var(--font-sans);font-size:32px;font-weight:600;letter-spacing:-.02em;color:#fff}
.pk__tagline{font-size:13.5px;line-height:1.45;color:rgba(233,240,246,.78);margin:0 0 18px;min-height:2.6em}
.pk__feats{list-style:none;margin:0 0 22px;padding:0;display:flex;flex-direction:column;gap:9px;flex:1}
.pk__feats li{position:relative;padding-left:24px;font-size:13.5px;line-height:1.45;color:rgba(233,240,246,.86)}
.pk__feats li::before{content:'';position:absolute;left:0;top:3px;width:16px;height:16px;border-radius:50%;background:rgba(143,227,176,.16)}
.pk__feats li::after{content:'';position:absolute;left:5px;top:7px;width:6px;height:3px;border-left:1.5px solid #8fe3b0;border-bottom:1.5px solid #8fe3b0;transform:rotate(-45deg)}
.pk__pick{width:100%;position:relative;isolation:isolate;overflow:hidden;font-family:var(--font-sans);font-size:14px;font-weight:600;padding:13px;border-radius:12px;cursor:pointer;border:1px solid rgba(233,240,246,.28);background:rgba(255,255,255,.05);color:#eef4f8;transition:color .25s,border-color .25s,transform .25s,box-shadow .25s}
.pk__pick::after{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;background:linear-gradient(135deg,#fff,#dbe4ee);opacity:0;transform:scale(.92);transition:opacity .28s,transform .28s}
.pk__pick:hover{color:#0a0e14;border-color:transparent;transform:translateY(-2px);box-shadow:0 12px 28px rgba(0,0,0,.45)}
.pk__pick:hover::after{opacity:1;transform:scale(1)}
.pk__card.is-sel .pk__pick{color:#0a0e14;border-color:transparent}
.pk__card.is-sel .pk__pick::after{opacity:1;transform:scale(1)}
.pk__demo{display:inline-block;margin-top:14px;font-size:13px;color:rgba(233,240,246,.72);text-decoration:none;border-bottom:1px solid rgba(233,240,246,.25);align-self:center}
.pk__demo:hover{color:#fff;border-color:#fff}
.pk__store{max-width:1100px;margin:20px auto 0;display:flex;gap:14px;align-items:flex-start;border:1px solid rgba(233,240,246,.12);border-radius:14px;padding:18px 20px;cursor:pointer;background:rgba(255,255,255,.02);transition:border-color .2s,background .2s}
.pk__store.is-on{border-color:#8fe3b0;background:rgba(143,227,176,.06)}
.pk__box{flex:0 0 auto;width:22px;height:22px;border-radius:6px;border:1.5px solid rgba(233,240,246,.4);margin-top:2px;position:relative;transition:all .2s}
.pk__store.is-on .pk__box{background:#8fe3b0;border-color:#8fe3b0}
.pk__store.is-on .pk__box::after{content:'';position:absolute;left:7px;top:3px;width:6px;height:11px;border-right:2px solid #08130d;border-bottom:2px solid #08130d;transform:rotate(45deg)}
.pk__store h4{font-family:var(--font-sans);font-size:15px;font-weight:600;color:#fff;margin:0 0 5px}
.pk__store h4 span{font-weight:500;color:rgba(233,240,246,.72);font-size:14px}
.pk__store p{font-size:13px;line-height:1.5;color:rgba(233,240,246,.66);margin:0 0 10px}
.pk__store-feats{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px 16px}
.pk__store-feats li{position:relative;padding-left:16px;font-size:12.5px;color:rgba(233,240,246,.72)}
.pk__store-feats li::before{content:'·';position:absolute;left:0;color:rgba(233,240,246,.5)}
.pk__gov{max-width:1100px;margin:20px auto 0;border:1px solid rgba(233,240,246,.14);border-radius:14px;padding:18px 22px;background:rgba(255,255,255,.02)}
.pk__gov h4{font-family:var(--font-sans);font-size:14px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#fff;margin:0 0 8px}
.pk__gov h4 span{font-weight:600;letter-spacing:0;text-transform:none;color:rgba(233,240,246,.78);margin-left:8px}
.pk__gov p{font-size:13.5px;line-height:1.55;color:rgba(233,240,246,.72);margin:0}
.pk__gov a{color:#f4f7fa;font-weight:600;text-decoration:none;border-bottom:1px solid rgba(244,247,250,.35)}
.pk__gov a:hover{border-bottom-color:#fff}
/* Care plans — four columns */
.pk__plans-head{max-width:680px;margin:clamp(40px,6vw,64px) auto clamp(22px,3vw,34px);text-align:center}
.pk__plans{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;max-width:1100px;margin:0 auto}
.pk__plan{position:relative;display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(233,240,246,.14);border-radius:16px;background:rgba(12,16,22,.62);backdrop-filter:blur(12px) saturate(1.15);-webkit-backdrop-filter:blur(12px) saturate(1.15);padding:22px 18px 20px;transition:border-color .25s,transform .3s,box-shadow .3s;cursor:pointer;text-align:left}
.pk__plan::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--pacc,#5b9bd5);z-index:3}
.pk__plans .pk__plan:nth-child(1){--pacc:#5b9bd5}
.pk__plans .pk__plan:nth-child(2){--pacc:#6cc79a}
.pk__plans .pk__plan:nth-child(3){--pacc:#e0912f}
.pk__plans .pk__plan:nth-child(4){--pacc:#c2452f}
.pk__plan:hover{border-color:rgba(233,240,246,.34);transform:translateY(-4px);box-shadow:0 22px 52px rgba(0,0,0,.5)}
.pk__plan.is-sel{border-color:rgba(233,240,246,.72);background:rgba(22,28,37,.72);box-shadow:0 20px 50px rgba(0,0,0,.48)}
.pk__plan.is-pop{border-color:rgba(224,145,47,.55);box-shadow:0 0 0 1px rgba(224,145,47,.25)}
.pk__plan-pop{position:absolute;top:-11px;left:50%;transform:translateX(-50%);font-family:var(--font-sans);font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#0a0e14;background:#f4f7fa;padding:4px 10px;border-radius:999px;z-index:4;white-space:nowrap}
.pk__plan-name{font-family:var(--font-sans);font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(233,240,246,.78);margin:4px 0 8px}
.pk__plan-price{font-family:var(--font-sans);font-size:28px;font-weight:600;letter-spacing:-.02em;color:#fff;margin:0 0 4px;line-height:1}
.pk__plan-price span{font-size:14px;font-weight:500;color:rgba(233,240,246,.65);letter-spacing:0}
.pk__plan-blurb{font-size:12.5px;line-height:1.45;color:rgba(233,240,246,.72);margin:0 0 14px;min-height:3.2em}
.pk__plan-feats{list-style:none;margin:0 0 14px;padding:0;display:flex;flex-direction:column;gap:8px;flex:1}
.pk__plan-feats li{position:relative;padding-left:18px;font-size:12.5px;line-height:1.4;color:rgba(233,240,246,.86)}
.pk__plan-feats li::before{content:'';position:absolute;left:0;top:6px;width:6px;height:6px;border-radius:50%;background:rgba(143,227,176,.7)}
.pk__plan-note{font-size:12px;line-height:1.4;color:rgba(233,240,246,.62);margin:0 0 4px;padding-top:10px;border-top:1px solid rgba(233,240,246,.1)}
.pk__plan-fine{font-size:11px;line-height:1.35;color:rgba(233,240,246,.48);margin:0}
.pk__plan-select{margin-top:12px;width:100%;font-family:var(--font-sans);font-size:13px;font-weight:600;padding:10px;border-radius:10px;cursor:pointer;border:1px solid rgba(233,240,246,.28);background:rgba(255,255,255,.05);color:#eef4f8;transition:color .2s,border-color .2s,background .2s;text-align:center;text-decoration:none;display:inline-flex;align-items:center;justify-content:center}
.pk__plan.is-sel .pk__plan-select{color:#0a0e14;border-color:transparent;background:linear-gradient(135deg,#fff,#dbe4ee)}
.pk__plan-select:hover{border-color:rgba(233,240,246,.5)}
.pk__plan-select--call{color:#f4f7fa;border-color:rgba(233,240,246,.4);background:rgba(255,255,255,.06);font-size:12.5px;line-height:1.35;padding:11px 10px}
.pk__plan-select--call:hover{color:#0a0e14;border-color:transparent;background:linear-gradient(135deg,#fff,#dbe4ee)}
.pk__plan--consult{cursor:default}
.pk__plan--consult:hover{transform:none}
.pk__need{max-width:640px;margin:18px auto 0;text-align:center;font-size:13px;line-height:1.55;color:rgba(233,240,246,.62)}
.pk__extra{max-width:640px;margin:8px auto 0;text-align:center;font-size:12.5px;line-height:1.5;color:rgba(233,240,246,.52)}
.pk__checkout{position:relative;overflow:hidden;max-width:1100px;margin:clamp(28px,4vw,44px) auto 0;border:1px solid rgba(233,240,246,.14);border-radius:20px;padding:clamp(20px,3vw,30px);background:rgba(12,16,22,.62);backdrop-filter:blur(12px) saturate(1.15);-webkit-backdrop-filter:blur(12px) saturate(1.15);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px}
.pk__checkout::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#5b9bd5,#e0912f,#c2452f);z-index:3}
.pk__sum-label{font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:rgba(233,240,246,.72);margin-bottom:8px}
.pk__sum-items{font-size:15px;color:rgba(233,240,246,.82);line-height:1.55}
.pk__total{font-family:var(--font-sans);font-size:27px;font-weight:600;color:#fff;margin-top:10px}
.pk__total small{font-size:15px;font-weight:500;color:rgba(233,240,246,.72)}
.pk__credit{font-size:13px;color:#8fe3b0;margin-top:6px}
.pk__buy{position:relative;isolation:isolate;overflow:hidden;font-family:var(--font-sans);font-size:16px;font-weight:600;padding:16px 32px;border-radius:999px;border:1px solid rgba(233,240,246,.3);cursor:pointer;background:rgba(255,255,255,.06);color:#eef4f8;transition:color .25s,border-color .25s,transform .25s,box-shadow .25s;white-space:nowrap}
.pk__buy::after{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;background:linear-gradient(135deg,#fff,#dbe4ee);opacity:0;transform:scale(.92);transition:opacity .28s,transform .28s}
.pk__buy:hover{color:#0a0e14;border-color:transparent;transform:translateY(-2px);box-shadow:0 16px 40px rgba(0,0,0,.5)}
.pk__buy:hover::after{opacity:1;transform:scale(1)}
.pk__buy:disabled{opacity:.6;cursor:default;transform:none}
.pk__cta-row{display:flex;flex-wrap:wrap;align-items:center;gap:14px 18px}
.pk__phone{font-family:var(--font-sans);font-size:14px;font-weight:600;color:#f4f7fa;text-decoration:none;border-bottom:1px solid rgba(244,247,250,.35);padding:2px 0;transition:border-color .2s,color .2s;white-space:nowrap}
.pk__phone:hover{color:#fff;border-bottom-color:#fff}
.pk__err{color:#ff9b9b;font-size:14px;margin-top:12px;width:100%}
.pk__success{max-width:1100px;margin:0 auto clamp(24px,4vw,40px);border:1px solid rgba(143,227,176,.4);background:rgba(143,227,176,.08);border-radius:16px;padding:22px 26px;text-align:center;color:#d8f5e4;font-size:16px}
@media(max-width:1100px){.pk__plans{grid-template-columns:repeat(2,1fr);max-width:640px}}
@media(max-width:860px){.pk__grid{grid-template-columns:1fr;max-width:420px}.pk__checkout{flex-direction:column;align-items:stretch;text-align:center}.pk__buy{width:100%}.pk__cta-row{justify-content:center}}
@media(max-width:560px){.pk__plans{grid-template-columns:1fr;max-width:420px}}
`;

export default function Packages() {
  const [selectedPackage, setSelectedPackage] = useState('Standard');
  const [selectedPlan, setSelectedPlan] = useState<CheckoutPlanId>('growth');
  const [store, setStore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment_success') === 'true') {
      setSuccess(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const tier = pricingTiers.find((t) => t.name === selectedPackage) ?? pricingTiers[0];
  const plan = getCarePlan(selectedPlan);
  const packagePrice = getDisplayPrice(tier);
  const buildTotal = getBuildTotal(packagePrice, plan, store);
  const credit = plan.buildCredit ?? 0;

  async function checkout() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package: selectedPackage,
          plan: selectedPlan,
          addOns: store ? ['Online Store'] : [],
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Could not start checkout. Please try again in a moment.');
        setLoading(false);
      }
    } catch {
      setError('Something went wrong reaching checkout. Please try again.');
      setLoading(false);
    }
  }

  return (
    <section id="pricing" className="pk">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {success && (
        <div className="pk__success">
          ✓ You’re all set — thank you! I’ll reach out shortly to kick off your build.
        </div>
      )}

      {/* ── Build packages ─────────────────────────────────────── */}
      <div className="pk__head" id="build">
        <p className="pk__eyebrow">Build packages</p>
        <h2 className="pk__title">Choose your site.</h2>
        <p className="pk__sub">
          Three clear build tiers. You own the site on every plan — always.
        </p>
      </div>

      <div className="pk__grid">
        {pricingTiers.map((t) => {
          const sel = selectedPackage === t.name;
          const price = getDisplayPrice(t);
          return (
            <div
              key={t.name}
              className={`pk__card${sel ? ' is-sel' : ''}${t.popular ? ' is-pop' : ''}`}
            >
              {t.popular && <span className="pk__pop">Most popular</span>}
              <p className="pk__name">{t.name}</p>
              <div className="pk__price">
                <b>{formatUsd(price)}</b>
              </div>
              {t.tagline && <p className="pk__tagline">{t.tagline}</p>}
              <ul className="pk__feats">
                {t.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <button type="button" className="pk__pick" onClick={() => setSelectedPackage(t.name)}>
                {sel ? 'Selected' : `Choose ${t.name}`}
              </button>
              {demoLinks[t.name] && (
                <a
                  className="pk__demo"
                  href={demoLinks[t.name]}
                  onClick={() => {
                    try {
                      sessionStorage.setItem('vaw:returnY', String(Math.round(window.scrollY)));
                    } catch {}
                  }}
                >
                  See a live demo →
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Online Store add-on */}
      <div
        className={`pk__store${store ? ' is-on' : ''}`}
        onClick={() => setStore((v) => !v)}
        role="checkbox"
        aria-checked={store}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setStore((v) => !v);
          }
        }}
      >
        <span className="pk__box" aria-hidden="true" />
        <div>
          <h4>
            Online Store <span>add {formatUsd(ONLINE_STORE_PRICE)} to any package</span>
          </h4>
          <p>{onlineStore.desc}</p>
          {onlineStore.features && (
            <ul className="pk__store-feats">
              {onlineStore.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Government / nonprofit */}
      <div className="pk__gov">
        <h4>
          Government and nonprofit
          <span>$5,000 to $15,000</span>
        </h4>
        <p>
          Sites for towns, counties, fire departments, museums, and nonprofits. Includes
          accessibility remediation to WCAG 2.1 AA and .gov domain migration. Veteran-owned and
          West Virginia based. Quotes provided free for grant applications —{' '}
          <a href={PHONE_HREF}>call {PHONE}</a>.
        </p>
      </div>

      {/* ── Care plans (replaces Own / Managed) ───────────────── */}
      <div className="pk__plans-head">
        <p className="pk__eyebrow">How we work together</p>
        <h2 className="pk__title">Two ways to work together</h2>
        <p className="pk__sub">You own your site either way. That never changes.</p>
      </div>

      <div className="pk__plans" role="listbox" aria-label="Care plan">
        {carePlans.map((p) => {
          const consult = !!p.consultationOnly;
          const sel = !consult && selectedPlan === p.id;
          return (
            <div
              key={p.id}
              role="option"
              aria-selected={sel}
              tabIndex={consult ? -1 : 0}
              className={`pk__plan${sel ? ' is-sel' : ''}${p.popular ? ' is-pop' : ''}${consult ? ' pk__plan--consult' : ''}`}
              onClick={() => {
                if (!consult) setSelectedPlan(p.id as CheckoutPlanId);
              }}
              onKeyDown={(e) => {
                if (consult) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedPlan(p.id as CheckoutPlanId);
                }
              }}
            >
              {p.popular && <span className="pk__plan-pop">Most popular</span>}
              <p className="pk__plan-name">{p.name}</p>
              <p className="pk__plan-price">
                {p.monthly === 0 ? (
                  <>
                    $0<span>/month</span>
                  </>
                ) : (
                  <>
                    {formatUsd(p.monthly)}
                    <span>/month</span>
                  </>
                )}
              </p>
              <p className="pk__plan-blurb">{p.blurb}</p>
              <ul className="pk__plan-feats">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <p className="pk__plan-note">{p.priceNote}</p>
              {p.cancelAnytimeFinePrint && (
                <p className="pk__plan-fine">Cancel anytime · no contract</p>
              )}
              {consult ? (
                <a
                  href={PHONE_HREF}
                  className="pk__plan-select pk__plan-select--call"
                  onClick={(e) => e.stopPropagation()}
                >
                  By consultation — call {PHONE}
                </a>
              ) : (
                <button
                  type="button"
                  className="pk__plan-select"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(p.id as CheckoutPlanId);
                  }}
                >
                  {sel ? 'Selected' : `Choose ${p.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="pk__need">
        What I need from you: about ten minutes a month. Three job photos and a heads-up when
        something changes.
      </p>
      <p className="pk__extra">
        Extra content changes beyond your monthly allowance are $95/hour, 30-minute minimum.
      </p>

      {/* Checkout */}
      <div className="pk__checkout">
        <div>
          <p className="pk__sum-label">Your order</p>
          <p className="pk__sum-items">
            {selectedPackage} · {plan.name}
            {store ? ' · Online Store' : ''}
          </p>
          <p className="pk__total">
            {formatUsd(buildTotal)}
            {plan.monthly > 0 ? (
              <small>
                {' '}
                due today · then {formatUsd(plan.monthly)}/mo
              </small>
            ) : (
              <small> one-time · you own it</small>
            )}
          </p>
          {credit > 0 && (
            <p className="pk__credit">
              Includes {formatUsd(credit)} build credit on the {plan.name} plan
              {packagePrice > credit
                ? ` (${formatUsd(packagePrice)} → ${formatUsd(packagePrice - credit)})`
                : ''}
            </p>
          )}
        </div>
        <div className="pk__cta-row">
          <button type="button" className="pk__buy" onClick={checkout} disabled={loading}>
            {loading ? 'Starting checkout…' : 'Continue to secure checkout →'}
          </button>
          <a href={PHONE_HREF} className="pk__phone">
            {PHONE}
          </a>
        </div>
        {error && <p className="pk__err">{error}</p>}
      </div>
    </section>
  );
}
