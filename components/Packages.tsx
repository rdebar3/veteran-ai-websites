'use client';

import {
  pricingTiers,
  getDisplayPrice,
  formatUsd,
  allPackagesInclude,
  PAY_ONCE_LINE,
} from '@/lib/data';
import ScheduleCall, { bookHref } from '@/components/ScheduleCall';

const demoLinks: Record<string, string> = {
  Starter: '/examples/starter-plumbing',
  Complete: '/examples/complete-hvac',
  Premium: '/examples/premium-restaurant',
};

const howSteps = [
  ['Pick a plan', 'or just tell me what you need.'],
  ['Grab a time', 'or send me a note at the bottom of the page.'],
  ['I build it', 'usually in a day. You get a link.'],
  ['You approve it', 'then your first payment goes through and the site goes live.'],
] as const;

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
.pk__pop{position:absolute;top:-11px;left:50%;transform:translateX(-50%);font-family:var(--font-sans);font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#0a0e14;background:#f4f7fa;padding:5px 12px;border-radius:999px;z-index:5;white-space:nowrap;pointer-events:none}
.pk__name{font-family:var(--font-sans);font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(233,240,246,.7);margin:0 0 14px}
.pk__down{margin:0 0 6px;font-size:13px;font-weight:600;color:#8fe3b0}
.pk__price{display:flex;flex-direction:column;align-items:flex-start;gap:2px;margin-bottom:16px}
.pk__price b{font-family:var(--font-sans);font-size:40px;font-weight:600;letter-spacing:-.03em;line-height:1;color:#fff}
.pk__mo{font-size:14px;font-weight:500;color:rgba(233,240,246,.72)}
.pk__feats{list-style:none;margin:0 0 22px;padding:0;display:flex;flex-direction:column;gap:9px;flex:1}
.pk__feats li{position:relative;padding-left:24px;font-size:13.5px;line-height:1.45;color:rgba(233,240,246,.86)}
.pk__feats li::before{content:'';position:absolute;left:0;top:3px;width:16px;height:16px;border-radius:50%;background:rgba(143,227,176,.16)}
.pk__feats li::after{content:'';position:absolute;left:5px;top:7px;width:6px;height:3px;border-left:1.5px solid #8fe3b0;border-bottom:1.5px solid #8fe3b0;transform:rotate(-45deg)}
.pk__pick{display:block;width:100%;text-align:center;text-decoration:none;position:relative;isolation:isolate;overflow:hidden;font-family:var(--font-sans);font-size:14px;font-weight:600;padding:13px;border-radius:12px;cursor:pointer;border:1px solid rgba(233,240,246,.28);background:rgba(255,255,255,.05);color:#eef4f8;transition:color .25s,border-color .25s,transform .25s,box-shadow .25s}
.pk__pick::after{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;background:linear-gradient(135deg,#fff,#dbe4ee);opacity:0;transform:scale(.92);transition:opacity .28s,transform .28s}
.pk__pick:hover{color:#0a0e14;border-color:transparent;transform:translateY(-2px);box-shadow:0 12px 28px rgba(0,0,0,.45)}
.pk__pick:hover::after{opacity:1;transform:scale(1)}
.pk__demo{display:inline-block;margin-top:14px;font-size:13px;color:rgba(233,240,246,.72);text-decoration:none;border-bottom:1px solid rgba(233,240,246,.25);align-self:center}
.pk__demo:hover{color:#fff;border-color:#fff}
.pk__once{max-width:760px;margin:18px auto 0;text-align:center;font-size:13.5px;line-height:1.5;color:rgba(233,240,246,.62)}
.pk__every{list-style:none;max-width:640px;margin:22px auto 0;padding:0;display:flex;flex-direction:column;gap:8px;text-align:center}
.pk__every li{font-size:14px;line-height:1.45;color:rgba(233,240,246,.78)}
.pk__sched{display:flex;justify-content:center;margin:22px auto 0}
.pk__how{list-style:none;counter-reset:pkhow;max-width:1000px;margin:clamp(28px,4vw,44px) auto 0;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
.pk__how li{counter-increment:pkhow;font-size:13.5px;line-height:1.45;color:rgba(233,240,246,.74)}
.pk__how li::before{content:counter(pkhow);display:block;font-family:var(--font-sans);font-size:12px;font-weight:700;letter-spacing:.14em;color:rgba(233,240,246,.5);margin-bottom:6px}
.pk__how b{color:#fff;font-weight:650}
@media(max-width:860px){.pk__grid{grid-template-columns:1fr;max-width:420px}.pk__how{grid-template-columns:1fr;max-width:420px;margin-left:auto;margin-right:auto}}
`;

export default function Packages() {
  return (
    <section id="pricing" className="pk">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="pk__head" id="build">
        <p className="pk__eyebrow">Plans</p>
        <h2 className="pk__title">Choose your site.</h2>
        <p className="pk__sub">
          Nothing down, nothing until you’ve seen it. Pick a plan, I build it, you approve it,
          then your first payment starts the plan.
        </p>
      </div>

      <div className="pk__grid">
        {pricingTiers.map((t) => {
          const price = getDisplayPrice(t);
          return (
            <div key={t.name} className="pk__card">
              {t.popular && <span className="pk__pop">Most popular</span>}
              <p className="pk__name">{t.name}</p>
              <p className="pk__down">Nothing down</p>
              <div className="pk__price">
                <b>{formatUsd(price)}</b>
                <span className="pk__mo">/month</span>
              </div>
              <ul className="pk__feats">
                {t.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a className="pk__pick" href={bookHref(`plan=${t.name}`)}>
                Start with {t.name}
              </a>
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

      <p className="pk__once">{PAY_ONCE_LINE}</p>

      <ul className="pk__every">
        {allPackagesInclude.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="pk__sched">
        <ScheduleCall note />
      </div>

      <ol className="pk__how">
        {howSteps.map(([title, rest]) => (
          <li key={title}>
            <b>{title}</b> — {rest}
          </li>
        ))}
      </ol>
    </section>
  );
}
