'use client';

import ScheduleCall from '@/components/ScheduleCall';
import { SOFTWARE_REVIEW_TOPIC } from '@/lib/data';

const styles = `
.sw{position:relative;color:#eef4f8;padding:clamp(44px,6vw,84px) clamp(20px,6vw,72px);border-top:1px solid rgba(233,240,246,.07)}
.sw__inner{max-width:720px;margin:0 auto}
.sw__head{text-align:center;margin:0 auto clamp(26px,3.5vw,40px)}
.sw__eyebrow{font-family:var(--font-sans);font-size:13px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgba(233,240,246,.72);margin:0 0 16px}
.sw__title{font-family:var(--font-sans);font-size:clamp(26px,3.2vw,42px);font-weight:600;letter-spacing:-.03em;line-height:1.04;color:#fff;margin:0}
.sw__panel{position:relative;overflow:hidden;border:1px solid rgba(233,240,246,.14);border-radius:20px;background:rgba(12,16,22,.62);backdrop-filter:blur(12px) saturate(1.15);-webkit-backdrop-filter:blur(12px) saturate(1.15);padding:clamp(24px,4vw,36px)}
.sw__panel::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#5b9bd5,#6cc79a,#e0912f);z-index:2}
.sw__p{margin:0;font-size:clamp(15.5px,1.2vw,17.5px);line-height:1.6;color:rgba(233,240,246,.92)}
.sw__cta{display:flex;justify-content:center;margin-top:22px}
`;

/** Small software for the shop. Sits between plans and ownership. */
export default function Software() {
  return (
    <section id="software" className="sw" aria-labelledby="sw-title">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="sw__inner">
        <div className="sw__head">
          <p className="sw__eyebrow">ALSO</p>
          <h2 id="sw-title" className="sw__title">
            Small software for your shop.
          </h2>
        </div>

        <div className="sw__panel">
          <p className="sw__p">
            Free 20-minute business software review on every call. I look at how you schedule jobs, track customers and send invoices, and tell you whether a simple tool is worth building. If it isn't, I'll say so.
          </p>
          <div className="sw__cta">
            <ScheduleCall
              label="Book a software review"
              query={`topic=${SOFTWARE_REVIEW_TOPIC}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
