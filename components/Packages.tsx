'use client';

import { useEffect, useState } from 'react';
import { pricingTiers, getDisplayPrice } from '@/lib/data';

const demoLinks: Record<string, string> = {
  Starter: '/examples/starter-plumbing',
  Complete: '/examples/complete-hvac',
  Premium: '/examples/premium-restaurant',
};

const managedIncludes = [
  'I design & build your full site',
  'Hosting — I keep it live & fast',
  'Security checks & regular backups',
  'Up to 2 hours of changes every month',
  'I keep the keys & handle everything',
  'Priority support · cancel anytime',
];

const ownIncludes = [
  'I hand you the keys at launch',
  'You fully own your site & files',
  'No monthly fees, no contracts',
  'Full control from day one',
];

const styles = `
.pk{position:relative;background:transparent;color:#eef4f8;padding:clamp(44px,6vw,84px) clamp(20px,6vw,72px)}
.pk__head{max-width:680px;margin:0 auto clamp(22px,3vw,34px);text-align:center}
.pk__eyebrow{font-family:var(--font-sans);font-size:13px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgba(233,240,246,.72);margin:0 0 16px}
.pk__title{font-family:var(--font-sans);font-size:clamp(26px,3.2vw,42px);font-weight:600;letter-spacing:-.03em;line-height:1.04;color:#fff;margin:0}
.pk__sub{margin:14px auto 0;max-width:52ch;font-size:clamp(14px,1.1vw,16px);line-height:1.6;color:rgba(233,240,246,.72)}
.pk__toggle{display:flex;justify-content:center;margin:0 auto clamp(30px,4vw,44px)}
.pk__toggle-inner{display:inline-flex;background:rgba(255,255,255,.04);border:1px solid rgba(233,240,246,.14);border-radius:999px;padding:5px;gap:4px}
.pk__toggle-inner button{font-family:var(--font-sans);font-size:14px;font-weight:600;padding:11px 22px;border-radius:999px;border:none;background:transparent;color:rgba(233,240,246,.68);cursor:pointer;transition:all .2s;white-space:nowrap}
.pk__toggle-inner button.is-on{background:#f4f7fa;color:#0a0e14}
.pk__toggle-inner button:not(.is-on):hover{color:#fff;background:rgba(255,255,255,.09)}
.pk__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:1000px;margin:0 auto}
.pk__card{position:relative;display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(233,240,246,.14);border-radius:16px;background:rgba(12,16,22,.62);backdrop-filter:blur(12px) saturate(1.15);-webkit-backdrop-filter:blur(12px) saturate(1.15);padding:26px 22px;transition:border-color .25s,transform .3s,box-shadow .3s}
.pk__card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--acc,#5b9bd5);z-index:3}
.pk__grid .pk__card:nth-child(1){--acc:#5b9bd5}
.pk__grid .pk__card:nth-child(2){--acc:#e0912f}
.pk__grid .pk__card:nth-child(3){--acc:#c2452f}
.pk__card:hover{border-color:rgba(233,240,246,.34);transform:translateY(-6px);box-shadow:0 28px 64px rgba(0,0,0,.55)}
.pk__card.is-sel{border-color:rgba(233,240,246,.72);background:rgba(22,28,37,.72);box-shadow:0 24px 60px rgba(0,0,0,.5)}
.pk__pop{position:absolute;top:-11px;left:50%;transform:translateX(-50%);font-family:var(--font-sans);font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#0a0e14;background:#f4f7fa;padding:5px 12px;border-radius:999px}
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
.pk__managed{position:relative;overflow:hidden;max-width:560px;margin:0 auto;border:1px solid rgba(233,240,246,.14);border-radius:20px;background:rgba(12,16,22,.62);backdrop-filter:blur(12px) saturate(1.15);-webkit-backdrop-filter:blur(12px) saturate(1.15);padding:clamp(28px,4vw,40px);text-align:center}
.pk__managed::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:#6cc79a;z-index:3}
.pk__managed-price{display:flex;align-items:baseline;justify-content:center;gap:6px;margin-bottom:6px}
.pk__managed-price b{font-family:var(--font-sans);font-size:46px;font-weight:600;color:#fff;letter-spacing:-.02em}
.pk__managed-price span{font-size:17px;color:rgba(233,240,246,.72)}
.pk__managed-tag{font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#8fe3b0;margin-bottom:22px}
.pk__managed-list{list-style:none;margin:0 auto 26px;padding:0;display:flex;flex-direction:column;gap:11px;text-align:left;max-width:360px}
.pk__managed-list li{position:relative;padding-left:26px;font-size:14.5px;line-height:1.45;color:rgba(233,240,246,.88)}
.pk__managed-list li::before{content:'✓';position:absolute;left:0;color:#8fe3b0;font-weight:700}
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
.pk__buy--wide{margin-top:6px;width:100%;max-width:340px}
.pk__err{color:#ff9b9b;font-size:14px;margin-top:12px}
.pk__note{max-width:1000px;margin:20px auto 0;font-size:13px;color:rgba(233,240,246,.72);text-align:center}
.pk__incl{max-width:1000px;margin:clamp(30px,4vw,50px) auto 0;display:flex;flex-wrap:wrap;justify-content:center;gap:12px 26px}
.pk__incl span{position:relative;padding-left:22px;font-size:13.5px;color:rgba(233,240,246,.72)}
.pk__incl span::before{content:'✓';position:absolute;left:0;color:#8fe3b0}
.pk__success{max-width:1000px;margin:0 auto clamp(24px,4vw,40px);border:1px solid rgba(143,227,176,.4);background:rgba(143,227,176,.08);border-radius:16px;padding:22px 26px;text-align:center;color:#d8f5e4;font-size:16px}
@media(max-width:860px){.pk__grid{grid-template-columns:1fr;max-width:420px}.pk__checkout{flex-direction:column;align-items:stretch;text-align:center}.pk__buy{width:100%}}
`;

export default function Packages() {
  const [mode, setMode] = useState<'own' | 'managed'>('own');
  const [selectedPackage, setSelectedPackage] = useState('Starter');
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
  const ownTotal = getDisplayPrice(tier) + (store ? 497 : 0);

  async function checkout(body: { package?: string; addOns: string[] }) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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

  const buyOwn = () =>
    checkout({ package: selectedPackage, addOns: store ? ['Shoppable Store'] : [] });
  const buyManaged = () => checkout({ addOns: ['Monthly Website Care'] });

  return (
    <section id="pricing" className="pk">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {success && (
        <div className="pk__success">
          ✓ You’re all set — thank you! I’ll reach out shortly to kick off your build.
        </div>
      )}

      <div className="pk__head">
        <p className="pk__eyebrow">Get your site</p>
        <h2 className="pk__title">Two simple ways to work together.</h2>
        <p className="pk__sub">
          Buy your site once and own it outright — or let me build it and run everything for a
          flat monthly. Your call.
        </p>
      </div>

      <div className="pk__toggle" id="build">
        <div className="pk__toggle-inner">
          <button type="button" className={mode === 'own' ? 'is-on' : ''} onClick={() => setMode('own')}>
            Own it — one-time
          </button>
          <button
            type="button"
            className={mode === 'managed' ? 'is-on' : ''}
            onClick={() => setMode('managed')}
          >
            Managed — $97/mo
          </button>
        </div>
      </div>

      {mode === 'own' ? (
        <>
          <div className="pk__grid">
            {pricingTiers.map((t) => {
              const sel = selectedPackage === t.name;
              const price = getDisplayPrice(t);
              const discounted = t.promoActive && t.promoPrice != null;
              return (
                <div key={t.name} className={`pk__card${sel ? ' is-sel' : ''}`}>
                  {/* "Most popular" badge intentionally hidden until we have sales */}
                  <p className="pk__name">{t.name}</p>
                  <div className="pk__price">
                    <b>${price}</b>
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
                    <a className="pk__demo" href={demoLinks[t.name]}>
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
                Add a Shoppable Store <span>+$497 one-time</span>
              </h4>
              <p>Sell online with a secure product catalog and checkout — up to 20 products, built alongside your site.</p>
            </div>
          </div>

          <div className="pk__checkout">
            <div>
              <p className="pk__sum-label">Your order</p>
              <p className="pk__sum-items">
                {selectedPackage} package{store ? ' · Shoppable Store' : ''}
              </p>
              <p className="pk__total">
                ${ownTotal} <small>one-time · you own it</small>
              </p>
            </div>
            <button type="button" className="pk__buy" onClick={buyOwn} disabled={loading}>
              {loading ? 'Starting checkout…' : 'Continue to secure checkout →'}
            </button>
            {error && <p className="pk__err">{error}</p>}
          </div>

          <div className="pk__incl">
            {ownIncludes.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="pk__managed">
            <div className="pk__managed-price">
              <b>$97</b>
              <span>/month</span>
            </div>
            <p className="pk__managed-tag">Built &amp; managed by me · cancel anytime</p>
            <ul className="pk__managed-list">
              {managedIncludes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button
              type="button"
              className="pk__buy pk__buy--wide"
              onClick={buyManaged}
              disabled={loading}
            >
              {loading ? 'Starting checkout…' : 'Start managed plan — $97/mo →'}
            </button>
            {error && <p className="pk__err">{error}</p>}
          </div>
          <p className="pk__note">
            No big upfront cost — I build your site and keep it running. Secure billing by Stripe.
          </p>
        </>
      )}
    </section>
  );
}
