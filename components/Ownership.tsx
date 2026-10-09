'use client';

import { KEEP_RUNNING_MONTHLY } from '@/lib/data';

const styles = `
.own{position:relative;color:#eef4f8;padding:clamp(44px,6vw,84px) clamp(20px,6vw,72px);border-top:1px solid rgba(233,240,246,.07)}
.own__inner{max-width:720px;margin:0 auto}
.own__head{text-align:center;margin:0 auto clamp(26px,3.5vw,40px)}
.own__eyebrow{font-family:var(--font-sans);font-size:13px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgba(233,240,246,.72);margin:0 0 16px}
.own__title{font-family:var(--font-sans);font-size:clamp(26px,3.2vw,42px);font-weight:600;letter-spacing:-.03em;line-height:1.04;color:#fff;margin:0}
.own__panel{position:relative;overflow:hidden;border:1px solid rgba(233,240,246,.14);border-radius:20px;background:rgba(12,16,22,.62);backdrop-filter:blur(12px) saturate(1.15);-webkit-backdrop-filter:blur(12px) saturate(1.15);padding:clamp(24px,4vw,36px)}
.own__panel::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#5b9bd5,#6cc79a,#e0912f);z-index:2}
.own__p{margin:0 0 16px;font-size:clamp(15.5px,1.2vw,17.5px);line-height:1.6;color:rgba(233,240,246,.92)}
.own__p:last-child{margin-bottom:0}
`;

/**
 * The ownership rule, in three plain sentences.
 * Placed between pricing and the veterans offer.
 */
export default function Ownership() {
  return (
    <section id="ownership" className="own" aria-labelledby="own-title">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="own__inner">
        <div className="own__head">
          <p className="own__eyebrow">Ownership</p>
          <h2 id="own-title" className="own__title">
            No contract. Cancel anytime. After 12 payments the site is yours.
          </h2>
        </div>

        <div className="own__panel">
          <p className="own__p">Nothing down. Your first payment is month one.</p>
          <p className="own__p">
            Cancel anytime. If you cancel before 12 payments, the site comes down, or you can pay
            off the remaining months and keep it.
          </p>
          <p className="own__p">
            After 12 payments you own the site, the files, and the domain. You can take it
            anywhere, or stay on for ${KEEP_RUNNING_MONTHLY}/month.
          </p>
        </div>
      </div>
    </section>
  );
}
