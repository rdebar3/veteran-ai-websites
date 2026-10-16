import {
  EXPIRED_BODY,
  EXPIRED_CTA_LABEL,
  EXPIRED_HEADING,
} from './copy';
import { sampleBookHref } from './sample-bar';

export function ExpiredDemo({
  businessId,
}: {
  businessId?: string | null;
}) {
  const href = sampleBookHref(businessId);
  return (
    <div className="demo-expired">
      <style>{EXPIRED_CSS}</style>
      <main className="demo-expired__main">
        <h1>{EXPIRED_HEADING}</h1>
        <p>{EXPIRED_BODY}</p>
        {href ? (
          <p className="demo-expired__cta">
            <a href={href}>{EXPIRED_CTA_LABEL}</a>
          </p>
        ) : null}
      </main>
    </div>
  );
}

const EXPIRED_CSS = `
.demo-expired{min-height:100vh;display:flex;align-items:center;background:#f7f7f5;color:#161616;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;}
.demo-expired__main{max-width:32rem;margin:0 auto;padding:3rem 1.5rem 5rem;}
.demo-expired h1{margin:0 0 .75rem;font-size:1.75rem;font-weight:650;letter-spacing:-.02em;}
.demo-expired p{margin:0 0 1.25rem;line-height:1.5;color:#333;}
.demo-expired__cta{display:flex;flex-wrap:wrap;gap:.35rem .25rem;align-items:center;}
.demo-expired a{color:#0b57d0;font-weight:600;text-decoration:underline;text-underline-offset:3px;}
`;
