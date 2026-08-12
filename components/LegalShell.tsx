import type { ReactNode } from 'react';
import { PHONE, PHONE_HREF, MAILING_ADDRESS } from '@/lib/contact';

const styles = `
.legal{position:relative;flex:1;color:#eef4f8;background:#06090f;padding:clamp(96px,12vw,140px) clamp(20px,6vw,72px) clamp(48px,7vw,88px)}
.legal__inner{max-width:720px;margin:0 auto}
.legal__eyebrow{font-family:var(--font-sans);font-size:12.5px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(233,240,246,.72);margin:0 0 14px}
.legal__title{font-family:var(--font-sans);font-size:clamp(28px,3.6vw,40px);font-weight:700;letter-spacing:-.03em;line-height:1.08;color:#fff;margin:0 0 10px}
.legal__updated{font-size:13.5px;color:rgba(233,240,246,.65);margin:0 0 28px}
.legal__panel{border:1px solid rgba(233,240,246,.14);border-radius:18px;background:rgba(12,16,22,.72);padding:clamp(22px,3vw,34px)}
.legal__panel h2{font-family:var(--font-sans);font-size:1.125rem;font-weight:650;color:#fff;margin:1.6rem 0 .55rem;letter-spacing:-.015em}
.legal__panel h2:first-child{margin-top:0}
.legal__panel p,.legal__panel li{font-size:15px;line-height:1.65;color:rgba(233,240,246,.86);margin:0 0 .85rem}
.legal__panel ul{margin:0 0 1rem;padding-left:1.2rem}
.legal__panel a{color:#f4f7fa;font-weight:600;text-decoration:none;border-bottom:1px solid rgba(244,247,250,.35)}
.legal__panel a:hover{border-bottom-color:#fff}
.legal__back{display:inline-block;margin-bottom:1.5rem;font-size:14px;font-weight:600;color:rgba(233,240,246,.8);text-decoration:none;border-bottom:1px solid rgba(233,240,246,.3)}
.legal__back:hover{color:#fff;border-bottom-color:#fff}
.legal__draft{font-size:12.5px;line-height:1.5;color:rgba(233,240,246,.55);margin:1.5rem 0 0;padding-top:1rem;border-top:1px solid rgba(233,240,246,.1)}
`;

type LegalShellProps = {
  title: string;
  eyebrow?: string;
  updated: string;
  children: ReactNode;
};

/** Shared chrome for privacy / terms / unsubscribe — matches marketing site dark style. */
export default function LegalShell({ title, eyebrow = 'Legal', updated, children }: LegalShellProps) {
  return (
    <main id="main-content" className="legal">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="legal__inner">
        <a href="/" className="legal__back">
          ← Back to home
        </a>
        <p className="legal__eyebrow">{eyebrow}</p>
        <h1 className="legal__title">{title}</h1>
        <p className="legal__updated">Last updated: {updated}</p>
        <div className="legal__panel">{children}</div>
        <p className="legal__draft">
          Draft for review — not final legal advice. Contact:{' '}
          <a href={PHONE_HREF}>{PHONE}</a> · {MAILING_ADDRESS}
        </p>
      </div>
    </main>
  );
}
