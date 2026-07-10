'use client';

import { showcaseDemos } from '@/lib/cinematic';

const accents: Record<string, string> = {
  Starter: '#5b9bd5',
  Complete: '#e0912f',
  Premium: '#c2452f',
};

const styles = `
.dm{position:relative;color:#eef4f8;padding:clamp(56px,8vw,104px) clamp(20px,6vw,72px);border-top:1px solid rgba(233,240,246,.08);background:transparent}
.dm__head{position:relative;max-width:640px;margin:0 auto clamp(34px,4vw,54px);text-align:center}
.dm__eyebrow{font-family:var(--font-sans);font-size:13px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(233,240,246,.72);margin:0 0 16px;text-shadow:0 1px 10px rgba(0,0,0,.7)}
.dm__title{font-family:var(--font-sans);font-size:clamp(26px,3.2vw,42px);font-weight:700;letter-spacing:-.03em;line-height:1.04;color:#fff;margin:0;text-shadow:0 2px 20px rgba(0,0,0,.6)}
.dm__sub{margin:14px auto 0;max-width:52ch;font-size:clamp(14px,1.1vw,16px);line-height:1.6;color:rgba(233,240,246,.82);text-shadow:0 1px 12px rgba(0,0,0,.7)}
.dm__grid{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:22px;max-width:1080px;margin:0 auto}
.dm__card{position:relative;display:flex;flex-direction:column;border:1px solid rgba(233,240,246,.14);border-radius:18px;overflow:hidden;background:rgba(12,16,22,.62);backdrop-filter:blur(12px) saturate(1.15);-webkit-backdrop-filter:blur(12px) saturate(1.15);transition:border-color .25s,transform .3s var(--ease-out,ease),box-shadow .3s}
.dm__card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--acc);z-index:3}
.dm__card:hover{border-color:rgba(233,240,246,.34);transform:translateY(-6px);box-shadow:0 28px 64px rgba(0,0,0,.55)}
.dm__top{position:relative;padding:34px 22px 26px;text-align:center;border-bottom:1px solid rgba(233,240,246,.1);background:linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,.012))}
.dm__tierbadge{display:inline-block;font-family:var(--font-sans);font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#dbe4ee;background:rgba(255,255,255,.08);border:1px solid rgba(233,240,246,.2);padding:5px 13px;border-radius:999px;margin-bottom:18px}
.dm__num{font-family:var(--font-sans);font-size:66px;font-weight:800;line-height:.9;letter-spacing:-.04em;background:linear-gradient(160deg,#ffffff,var(--acc));-webkit-background-clip:text;background-clip:text;color:transparent}
.dm__pagelabel{display:block;margin-top:8px;font-family:var(--font-sans);font-size:13px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:rgba(233,240,246,.66)}
.dm__body{display:flex;flex-direction:column;flex:1;padding:24px 22px 26px;text-align:center}
.dm__biz{font-family:var(--font-sans);font-size:20px;font-weight:700;color:#fff;margin:0 0 10px;letter-spacing:-.01em}
.dm__desc{font-size:14px;line-height:1.6;color:rgba(233,240,246,.78);margin:0 0 22px;flex:1}
.dm__link{position:relative;isolation:isolate;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;gap:9px;font-family:var(--font-sans);font-size:15px;font-weight:600;padding:14px 18px;border-radius:12px;border:1px solid rgba(233,240,246,.28);background:rgba(255,255,255,.05);color:#eef4f8;text-decoration:none;transition:color .25s,border-color .25s,transform .25s,box-shadow .25s}
.dm__link::after{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;background:linear-gradient(135deg,#ffffff,#dbe4ee);opacity:0;transform:scale(.9);transition:opacity .28s,transform .28s}
.dm__link:hover{color:#0a0e14;border-color:transparent;transform:translateY(-2px);box-shadow:0 14px 32px rgba(0,0,0,.5)}
.dm__link:hover::after{opacity:1;transform:scale(1)}
.dm__arrow{display:inline-block;transition:transform .28s}
.dm__link:hover .dm__arrow{transform:translateX(5px)}
.dm__foot{position:relative;max-width:1080px;margin:clamp(28px,3vw,42px) auto 0;text-align:center;font-size:13.5px;color:rgba(233,240,246,.72);text-shadow:0 1px 10px rgba(0,0,0,.7)}
@media(max-width:860px){.dm{background-attachment:scroll,scroll}.dm__grid{grid-template-columns:1fr;max-width:420px}}
`;

export default function Demos() {
  return (
    <section id="examples" className="dm">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="dm__head">
        <p className="dm__eyebrow">Live demos</p>
        <h2 className="dm__title">See what I can build.</h2>
        <p className="dm__sub">
          Three real demo sites — one for each package. Click through any of them and picture
          your business in it.
        </p>
      </div>

      <div className="dm__grid">
        {showcaseDemos.map((demo) => (
          <div
            key={demo.tier}
            className="dm__card"
            style={{ ['--acc']: accents[demo.tier] || '#5b9bd5' } as React.CSSProperties}
          >
            <div className="dm__top">
              <span className="dm__tierbadge">{demo.tier}</span>
              <div className="dm__num">{demo.pages.split(' ')[0]}</div>
              <span className="dm__pagelabel">Page Demo</span>
            </div>
            <div className="dm__body">
              <h3 className="dm__biz">{demo.landmark}</h3>
              <p className="dm__desc">{demo.desc}</p>
              <a className="dm__link" href={demo.href}>
                View live demo <span className="dm__arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      <p className="dm__foot">
        These are demo sites to show the styles I build. As I take on clients, I’ll feature their
        real sites here.
      </p>
    </section>
  );
}
