'use client';

import { useEffect, useState } from 'react';
import {
  pricingTiers,
  getDisplayPrice,
  formatUsd,
  SHOPPABLE_STORE_PRICE,
  MANAGED_MONTHLY,
} from '@/lib/data';

const demoLinks: Record<string, string> = {
  Starter: '/examples/starter-plumbing',
  Complete: '/examples/complete-hvac',
  Premium: '/examples/premium-restaurant',
};

type Aftercare = 'own' | 'managed';

const ownFeatures = [
  'You own the site, the files, and your domain',
  'Hosting, domain renewal, and backups become yours to manage',
  '30 days of support after launch',
  'Changes after that quoted per job',
];

const managedFeatures = [
  'You still own the site and files — cancel anytime and keep it',
  'Hosting, SSL, backups, and security updates handled',
  'Reasonable content changes included',
  'I check your contact form is still delivering',
  'No contract, cancel anytime',
];

const styles = `
.pk{position:relative;background:transparent;color:#eef4f8;padding:clamp(44px,6vw,84px) clamp(20px,6vw,72px)}
.pk__head{max-width:680px;margin:0 auto clamp(22px,3vw,34px);text-align:center}
.pk__eyebrow{font-family:var(--font-sans);font-size:13px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgba(233,240,246,.72);margin:0 0 16px}
.pk__title{font-family:var(--font-sans);font-size:clamp(26px,3.2vw,42px);font-weight:600;letter-spacing:-.03em;line-height:1.04;color:#fff;margin:0}
.pk__sub{margin:14px auto 0;max-width:52ch;font-size:clamp(14px,1.1vw,16px);line-height:1.6;color:rgba(233,240,246,.72)}
.pk__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:1000px;margin:0 auto;padding-top:14px}
.pk__card{position:relative;display:flex;flex-direction:column;border:1px solid rgba(233,240,246,.14);border-radius:16px;background:rgba(12,16,22,.62);backdrop-filter:blur(12px) saturate(1.15);-webkit-backdrop-filter:blur(12px) saturate(1.15);padding:26px 22px;transition:border-color .25s,transform .3s,box-shadow .3s}
.pk__card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--acc,#5b9bd5);border-radius:16px 16px 0 0;z-index:1;pointer-events:none}
.pk__grid .pk__card:nth-child(1){--acc:#5b9bd5}
.pk__grid .pk__card:nth-child(2){--acc:#e0912f}
.pk__grid .pk__card:nth-child(3){--acc:#c2452f}
.pk__card:hover{border-color:rgba(233,240,246,.34);transform:translateY(-6px);box-shadow:0 28px 64px rgba(0,0,0,.55)}
.pk__card.is-sel{border-color:rgba(233,240,246,.72);background:rgba(22,28,37,.72);box-shadow:0 24px 60px rgba(0,0,0,.5)}
.pk__pop{position:absolute;top:-11px;left:50%;transform:translateX(-50%);font-family:var(--font-sans);font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#0a0e14;background:#f4f7fa;padding:5px 12px;border-radius:999px;z-index:5;white-space:nowrap;pointer-events:none}
.pk__name{font-family:var(--font-sans);font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(233,240,246,.7);margin:0 0 14px}
.pk__price{display:flex;align-items:baseline;gap:10px;margin-bottom:6px}
.pk__price b{font-family:var(--font-sans);font-size:32px;font-weight:600;letter-spacing:-.02em;color:#fff}
.pk__was{font-size:15px;color:rgba(233,240,246,.42);text-decoration:line-through}
.pk__promo{font-size:12px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:#8fe3b0;margin-bottom:18px}
.pk__meta{font-size:13px;color:rgba(233,240,246,.72);margin-bottom:20px}
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
.pk__store{max-width:1000px;margin:20px auto 0;display:flex;gap:14px;align-items:flex-start;border:1px solid rgba(233,240,246,.12);border-radius:14px;padding:18px 20px;cursor:pointer;background:rgba(255,255,255,.02);transition:border-color .2s,background .2s}
.pk__store.is-on{border-color:#8fe3b0;background:rgba(143,227,176,.06)}
.pk__box{flex:0 0 auto;width:22px;height:22px;border-radius:6px;border:1.5px solid rgba(233,240,246,.4);margin-top:2px;position:relative;transition:all .2s}
.pk__store.is-on .pk__box{background:#8fe3b0;border-color:#8fe3b0}
.pk__store.is-on .pk__box::after{content:'';position:absolute;left:7px;top:3px;width:6px;height:11px;border-right:2px solid #08130d;border-bottom:2px solid #08130d;transform:rotate(45deg)}
.pk__store h4{font-family:var(--font-sans);font-size:15px;font-weight:600;color:#fff;margin:0 0 5px}
.pk__store h4 span{font-weight:500;color:rgba(233,240,246,.72);font-size:14px}
.pk__store p{font-size:13px;line-height:1.5;color:rgba(233,240,246,.66);margin:0}
.pk__after-head{max-width:680px;margin:clamp(40px,6vw,64px) auto clamp(22px,3vw,34px);text-align:center}
.pk__after{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;max-width:900px;margin:0 auto;padding-top:14px}
.pk__opt{position:relative;display:flex;flex-direction:column;border:1px solid rgba(233,240,246,.14);border-radius:16px;background:rgba(12,16,22,.62);backdrop-filter:blur(12px) saturate(1.15);-webkit-backdrop-filter:blur(12px) saturate(1.15);padding:26px 22px 22px;cursor:pointer;text-align:left;transition:border-color .25s,transform .3s,box-shadow .3s}
.pk__opt::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--oacc,#5b9bd5);border-radius:16px 16px 0 0;z-index:1;pointer-events:none}
.pk__after .pk__opt:nth-child(1){--oacc:#5b9bd5}
.pk__after .pk__opt:nth-child(2){--oacc:#6cc79a}
.pk__opt:hover{border-color:rgba(233,240,246,.34);transform:translateY(-4px);box-shadow:0 22px 52px rgba(0,0,0,.5)}
.pk__opt.is-sel{border-color:rgba(233,240,246,.72);background:rgba(22,28,37,.72);box-shadow:0 20px 50px rgba(0,0,0,.48)}
.pk__opt.is-rec{border-color:rgba(108,199,154,.45)}
.pk__opt-badge{position:absolute;top:-11px;left:50%;transform:translateX(-50%);font-family:var(--font-sans);font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#0a0e14;background:#8fe3b0;padding:4px 10px;border-radius:999px;z-index:5;white-space:nowrap;pointer-events:none}
.pk__opt-name{font-family:var(--font-sans);font-size:15px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#fff;margin:4px 0 6px}
.pk__opt-price{font-family:var(--font-sans);font-size:28px;font-weight:600;letter-spacing:-.02em;color:#fff;margin:0 0 8px;line-height:1}
.pk__opt-price span{font-size:14px;font-weight:500;color:rgba(233,240,246,.65);letter-spacing:0}
.pk__opt-blurb{font-size:14px;line-height:1.45;color:rgba(233,240,246,.82);margin:0 0 16px;font-style:italic}
.pk__opt-feats{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:9px;flex:1}
.pk__opt-feats li{position:relative;padding-left:22px;font-size:13.5px;line-height:1.45;color:rgba(233,240,246,.88)}
.pk__opt-feats li::before{content:'';position:absolute;left:0;top:6px;width:7px;height:7px;border-radius:50%;background:rgba(143,227,176,.75)}
.pk__checkout{position:relative;overflow:hidden;max-width:1000px;margin:clamp(28px,4vw,44px) auto 0;border:1px solid rgba(233,240,246,.14);border-radius:20px;padding:clamp(20px,3vw,30px);background:rgba(12,16,22,.62);backdrop-filter:blur(12px) saturate(1.15);-webkit-backdrop-filter:blur(12px) saturate(1.15);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px}
.pk__checkout::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#5b9bd5,#e0912f,#c2452f);z-index:3}
.pk__sum-label{font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:rgba(233,240,246,.72);margin-bottom:8px}
.pk__sum-items{font-size:15px;color:rgba(233,240,246,.82);line-height:1.55}
.pk__total{font-family:var(--font-sans);font-size:27px;font-weight:600;color:#fff;margin-top:10px}
.pk__total small{font-size:15px;font-weight:500;color:rgba(233,240,246,.72)}
.pk__buy{position:relative;isolation:isolate;overflow:hidden;font-family:var(--font-sans);font-size:16px;font-weight:600;padding:16px 32px;border-radius:999px;border:1px solid rgba(233,240,246,.3);cursor:pointer;background:rgba(255,255,255,.06);color:#eef4f8;transition:color .25s,border-color .25s,transform .25s,box-shadow .25s;white-space:nowrap}
.pk__buy::after{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;background:linear-gradient(135deg,#fff,#dbe4ee);opacity:0;transform:scale(.92);transition:opacity .28s,transform .28s}
.pk__buy:hover{color:#0a0e14;border-color:transparent;transform:translateY(-2px);box-shadow:0 16px 40px rgba(0,0,0,.5)}
.pk__buy:hover::after{opacity:1;transform:scale(1)}
.pk__buy:disabled{opacity:.6;cursor:default;transform:none}
.pk__err{color:#ff9b9b;font-size:14px;margin-top:12px;width:100%}
.pk__note{max-width:1000px;margin:16px auto 0;font-size:13px;color:rgba(233,240,246,.62);text-align:center}
.pk__success{max-width:1000px;margin:0 auto clamp(24px,4vw,40px);border:1px solid rgba(143,227,176,.4);background:rgba(143,227,176,.08);border-radius:16px;padding:22px 26px;text-align:center;color:#d8f5e4;font-size:16px}
@media(max-width:860px){.pk__grid{grid-template-columns:1fr;max-width:420px}.pk__after{grid-template-columns:1fr;max-width:420px}.pk__checkout{flex-direction:column;align-items:stretch;text-align:center}.pk__buy{width:100%}}
`;

export default function Packages() {
  const [selectedPackage, setSelectedPackage] = useState('Complete');
  const [aftercare, setAftercare] = useState<Aftercare>('managed');
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
  const packagePrice = getDisplayPrice(tier);
  const todayTotal = packagePrice + (store ? SHOPPABLE_STORE_PRICE : 0);
  const isManaged = aftercare === 'managed';

  const orderLine = [
    selectedPackage,
    isManaged ? 'Managed' : 'Own it',
    store ? 'Shoppable Store' : null,
  ]
    .filter(Boolean)
    .join(' · ');

  async function checkout() {
    setLoading(true);
    setError('');
    try {
      const addOns: string[] = [];
      if (store) addOns.push('Shoppable Store');
      if (isManaged) addOns.push('Monthly Website Care');

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package: selectedPackage,
          aftercare,
          addOns,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Could not start checkout. Please try again in a moment.');
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
          Three clear build tiers. The package price always applies — then choose what happens after
          launch.
        </p>
      </div>

      <div className="pk__grid">
        {pricingTiers.map((t) => {
          const sel = selectedPackage === t.name;
          const price = getDisplayPrice(t);
          const discounted = t.promoActive && t.promoPrice != null;
          return (
            <div key={t.name} className={`pk__card${sel ? ' is-sel' : ''}`}>
              {t.popular && <span className="pk__pop">Most popular</span>}
              <p className="pk__name">{t.name}</p>
              <div className="pk__price">
                <b>{formatUsd(price)}</b>
                {discounted && <span className="pk__was">${t.price}</span>}
              </div>
              <p className="pk__promo" style={discounted ? undefined : { visibility: 'hidden' }}>
                {discounted ? t.promoLabel : '—'}
              </p>
              <p className="pk__meta">
                {t.delivery} · {t.revisions}
              </p>
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
                  See a live {t.name} demo →
                </a>
              )}
            </div>
          );
        })}
      </div>

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
            Add a Shoppable Store <span>+{formatUsd(SHOPPABLE_STORE_PRICE)} one-time</span>
          </h4>
          <p>
            Sell online with a secure product catalog and checkout — up to 20 products, built
            alongside your site.
          </p>
        </div>
      </div>

      {/* ── After launch ───────────────────────────────────────── */}
      <div className="pk__after-head">
        <h2 className="pk__title">After launch</h2>
        <p className="pk__sub">You own your site either way. That never changes.</p>
      </div>

      <div className="pk__after" role="listbox" aria-label="After launch plan">
        <div
          role="option"
          aria-selected={aftercare === 'own'}
          tabIndex={0}
          className={`pk__opt${aftercare === 'own' ? ' is-sel' : ''}`}
          onClick={() => setAftercare('own')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setAftercare('own');
            }
          }}
        >
          <p className="pk__opt-name">Own it · $0/month</p>
          <p className="pk__opt-price">
            $0<span>/month</span>
          </p>
          <p className="pk__opt-blurb">You take the keys at launch.</p>
          <ul className="pk__opt-feats">
            {ownFeatures.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>

        <div
          role="option"
          aria-selected={aftercare === 'managed'}
          tabIndex={0}
          className={`pk__opt is-rec${aftercare === 'managed' ? ' is-sel' : ''}`}
          onClick={() => setAftercare('managed')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setAftercare('managed');
            }
          }}
        >
          <span className="pk__opt-badge">Recommended</span>
          <p className="pk__opt-name">Managed · ${MANAGED_MONTHLY}/month</p>
          <p className="pk__opt-price">
            ${MANAGED_MONTHLY}
            <span>/month</span>
          </p>
          <p className="pk__opt-blurb">I keep it online, updated, and working.</p>
          <ul className="pk__opt-feats">
            {managedFeatures.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Checkout ───────────────────────────────────────────── */}
      <div className="pk__checkout">
        <div>
          <p className="pk__sum-label">Your order</p>
          <p className="pk__sum-items">{orderLine}</p>
          <p className="pk__total">
            {isManaged ? (
              <>
                {formatUsd(todayTotal)} <small>today, then {formatUsd(MANAGED_MONTHLY)}/month</small>
              </>
            ) : (
              <>
                {formatUsd(todayTotal)} <small>today</small>
              </>
            )}
          </p>
        </div>
        <button type="button" className="pk__buy" onClick={checkout} disabled={loading}>
          {loading ? 'Starting checkout…' : 'Continue to secure checkout →'}
        </button>
        {error && <p className="pk__err">{error}</p>}
      </div>
      <p className="pk__note">
        Package price is always due today. Managed is an optional monthly add-on after launch.
        Secure billing by Stripe.
      </p>
    </section>
  );
}
