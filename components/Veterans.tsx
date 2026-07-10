'use client';

const styles = `
.vets{position:relative;color:#eef4f8;padding:clamp(40px,6vw,80px) clamp(20px,6vw,72px)}
.vets__panel{position:relative;overflow:hidden;max-width:760px;margin:0 auto;border:1px solid rgba(227,178,60,.32);border-radius:24px;background:rgba(12,16,22,.72);backdrop-filter:blur(12px) saturate(1.15);-webkit-backdrop-filter:blur(12px) saturate(1.15);padding:clamp(30px,5vw,52px);text-align:center;box-shadow:0 30px 70px rgba(0,0,0,.5)}
.vets__panel::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:#e3b23c;z-index:2}
.vets__mark{width:56px;height:64px;margin:0 auto 18px;display:block}
.vets__eyebrow{font-family:var(--font-sans);font-size:12.5px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#e3b23c;margin:0 0 14px}
.vets__title{font-family:var(--font-sans);font-size:clamp(24px,3.2vw,38px);font-weight:700;letter-spacing:-.02em;line-height:1.08;color:#fff;margin:0}
.vets__sub{margin:14px auto 0;max-width:52ch;font-size:clamp(14px,1.15vw,16.5px);line-height:1.6;color:rgba(233,240,246,.82)}
.vets__list{list-style:none;margin:26px auto 0;padding:0;max-width:440px;display:flex;flex-direction:column;gap:13px;text-align:left}
.vets__list li{display:flex;align-items:flex-start;gap:12px;font-size:15.5px;line-height:1.45;color:#f2f6fa}
.vets__list li b{color:#fff;font-weight:700}
.vets__check{flex:0 0 auto;display:grid;place-items:center;width:24px;height:24px;border-radius:7px;background:rgba(227,178,60,.16);color:#e3b23c;font-size:14px;font-weight:800;margin-top:1px}
.vets__fine{margin:20px auto 0;max-width:48ch;font-size:13px;line-height:1.5;color:rgba(233,240,246,.72)}
.vets__cta{margin-top:26px}
.vets__btn{position:relative;isolation:isolate;overflow:hidden;display:inline-flex;align-items:center;gap:10px;font-family:var(--font-sans);font-size:16px;font-weight:700;padding:16px 30px;border-radius:999px;cursor:pointer;text-decoration:none;border:1px solid rgba(227,178,60,.7);background:rgba(227,178,60,.14);color:#f6e3bd;transition:color .25s,border-color .25s,transform .25s,box-shadow .25s}
.vets__btn::after{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;background:linear-gradient(135deg,#f0c862,#e3b23c);opacity:0;transform:scale(.92);transition:opacity .28s,transform .28s}
.vets__btn:hover{color:#1a1206;border-color:transparent;transform:translateY(-2px);box-shadow:0 16px 38px rgba(0,0,0,.5)}
.vets__btn:hover::after{opacity:1;transform:scale(1)}
.vets__btn .arw{transition:transform .28s}
.vets__btn:hover .arw{transform:translateX(5px)}
.vets__note{margin:18px auto 0;font-size:13.5px;font-style:italic;color:rgba(233,240,246,.66)}
`;

export default function Veterans() {
  return (
    <section id="veterans" className="vets">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="vets__panel">
        <svg className="vets__mark" viewBox="16 16 88 102" fill="#e3b23c" aria-hidden="true">
          <path d="M24 40 L60 22 L96 40 L96 51 L60 33 L24 51 Z" />
          <path d="M24 55 L60 37 L96 55 L96 66 L60 48 L24 66 Z" />
          <path d="M24 70 L60 52 L96 70 L96 81 L60 63 L24 81 Z" />
          <path d="M24 88 Q60 100 96 88 L96 99 Q60 111 24 99 Z" />
        </svg>
        <p className="vets__eyebrow">For those who served</p>
        <h2 className="vets__title">A thank-you to my fellow veterans.</h2>
        <p className="vets__sub">
          I built this company after my own time in the Army, and I want to give back to the people
          who served alongside me. If you’re a veteran starting or growing a business, this one’s for you —
          just mention that you served in the form below, and I’ll get started building your site right away.
        </p>
        <ul className="vets__list">
          <li><span className="vets__check">✓</span><span>Your website <b>designed &amp; built completely free</b> — a real, professional site.</span></li>
          <li><span className="vets__check">✓</span><span><b>3 months of the $97/mo Managed plan, on me</b> — hosting, updates, and changes handled.</span></li>
          <li><span className="vets__check">✓</span><span>You keep <b>100% ownership</b> of your site, always.</span></li>
        </ul>
        <p className="vets__fine">
          After your 3 free months, the Managed plan simply continues at $97/mo — cancel anytime, no contract.
        </p>
        <div className="vets__cta">
          <a href="#contact" className="vets__btn">Claim your veteran offer <span className="arw" aria-hidden="true">→</span></a>
        </div>
        <p className="vets__note">From one veteran to another — thank you for your service.</p>
      </div>
    </section>
  );
}
