'use client';

const styles = `
.own{position:relative;color:#eef4f8;padding:clamp(44px,6vw,84px) clamp(20px,6vw,72px);border-top:1px solid rgba(233,240,246,.07)}
.own__inner{max-width:720px;margin:0 auto}
.own__head{text-align:center;margin:0 auto clamp(26px,3.5vw,40px)}
.own__eyebrow{font-family:var(--font-sans);font-size:13px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgba(233,240,246,.72);margin:0 0 16px}
.own__title{font-family:var(--font-sans);font-size:clamp(26px,3.2vw,42px);font-weight:600;letter-spacing:-.03em;line-height:1.04;color:#fff;margin:0}
.own__intro{margin:16px auto 0;max-width:48ch;font-size:clamp(14px,1.15vw,16.5px);line-height:1.6;color:rgba(233,240,246,.78)}
.own__panel{position:relative;overflow:hidden;border:1px solid rgba(233,240,246,.14);border-radius:20px;background:rgba(12,16,22,.62);backdrop-filter:blur(12px) saturate(1.15);-webkit-backdrop-filter:blur(12px) saturate(1.15);padding:clamp(24px,4vw,36px)}
.own__panel::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#5b9bd5,#6cc79a,#e0912f);z-index:2}
.own__list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:16px}
.own__list li{position:relative;padding-left:32px;font-size:clamp(14.5px,1.15vw,16px);line-height:1.5;color:rgba(233,240,246,.9)}
.own__list li::before{content:'';position:absolute;left:0;top:4px;width:18px;height:18px;border-radius:50%;background:rgba(143,227,176,.16)}
.own__list li::after{content:'';position:absolute;left:6px;top:9px;width:6px;height:3px;border-left:1.5px solid #8fe3b0;border-bottom:1.5px solid #8fe3b0;transform:rotate(-45deg)}
.own__close{margin:26px 0 0;padding-top:22px;border-top:1px solid rgba(233,240,246,.12);font-size:clamp(15px,1.2vw,17px);font-weight:600;line-height:1.55;color:#fff;letter-spacing:-.01em}
`;

/**
 * Phase 6 — ownership promise, in writing, on every plan.
 * Placed between the care-plan comparison (Packages) and Veterans.
 */
export default function Ownership() {
  return (
    <section id="ownership" className="own" aria-labelledby="own-title">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="own__inner">
        <div className="own__head">
          <p className="own__eyebrow">Ownership</p>
          <h2 id="own-title" className="own__title">
            What &lsquo;you own it&rsquo; actually means
          </h2>
          <p className="own__intro">
            Some web companies hold your site hostage. Here is exactly what you get from me, in
            writing.
          </p>
        </div>

        <div className="own__panel">
          <ul className="own__list">
            <li>All your files, delivered as a download you keep</li>
            <li>Your domain, in an account with your name on it — not mine</li>
            <li>
              A written handoff document listing where everything lives: your domain, your hosting,
              your DNS, and where your form submissions go
            </li>
            <li>A short recorded walkthrough showing you how to make basic edits</li>
          </ul>
          <p className="own__close">
            This is true on every plan. If you are on a monthly plan and you cancel, you keep the
            site. No license, no lock-in, no clause that takes it back.
          </p>
        </div>
      </div>
    </section>
  );
}
