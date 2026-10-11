import type { Metadata } from 'next';
import ScheduleCall from '@/components/ScheduleCall';

export const metadata: Metadata = {
  title: 'Thank you | Veteran AI Websites',
  robots: { index: false, follow: false },
};

type ThanksPageProps = {
  searchParams: Promise<{ cancel?: string | string[] }>;
};

function isCancel(value: string | string[] | undefined): boolean {
  if (Array.isArray(value)) return value.includes('1');
  return value === '1';
}

const styles = `
.thanks{flex:1;display:flex;align-items:center;justify-content:center;background:#06090f;color:#eef4f8;padding:clamp(120px,16vw,180px) 20px clamp(64px,8vw,96px)}
.thanks__panel{width:100%;max-width:640px;text-align:center;border:1px solid rgba(233,240,246,.14);border-radius:22px;background:rgba(12,16,22,.72);padding:clamp(28px,4vw,48px)}
.thanks__panel h1{font-family:var(--font-sans);font-size:clamp(28px,3.6vw,40px);font-weight:650;letter-spacing:-.03em;line-height:1.1;color:#fff;margin:0 0 14px}
.thanks__panel p{font-size:16px;line-height:1.6;color:rgba(233,240,246,.86);margin:0 auto;max-width:46ch}
.thanks__book{display:flex;justify-content:center;margin:26px 0 18px}
.thanks__back{display:inline-block;font-size:14px;font-weight:600;color:rgba(233,240,246,.8);text-decoration:none;border-bottom:1px solid rgba(233,240,246,.3)}
.thanks__back:hover{color:#fff;border-bottom-color:#fff}
`;

export default async function ThanksPage({ searchParams }: ThanksPageProps) {
  const query = await searchParams;
  const cancel = isCancel(query.cancel);

  return (
    <main id="main-content" className="thanks">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="thanks__panel">
        <h1>{cancel ? 'No charge was made.' : 'You’re all set.'}</h1>
        <p>
          {cancel
            ? 'Your site is still waiting for you. Pick a time and we’ll sort it out, or just reply to my last email.'
            : 'Your first payment went through and your plan is active. Your site goes live within a day, and I’ll text you the moment it’s up.'}
        </p>
        <div className="thanks__book">
          <ScheduleCall note />
        </div>
        <a className="thanks__back" href="/">
          Back to the site
        </a>
      </div>
    </main>
  );
}
