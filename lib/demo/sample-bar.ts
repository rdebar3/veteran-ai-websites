import { createHash } from 'node:crypto';
import { SAMPLE_BOOK_LABEL, SAMPLE_BAR_TEXT } from './copy';

/** Inline bar script. CSP allows this exact source by sha256 hash. */
export const SAMPLE_BAR_SCRIPT =
  '(function(){var bar=document.getElementById("vai-sample-bar");var mark=document.getElementById("vai-sample-sentinel");if(!bar||!mark||typeof IntersectionObserver!=="function")return;function apply(show){if(show){bar.hidden=false;var h=bar.offsetHeight+"px";document.documentElement.style.setProperty("--vai-sample-h",h);document.body.style.paddingBottom=h;document.body.classList.add("vai-sample-on");}else{bar.hidden=true;document.body.style.paddingBottom="";document.body.classList.remove("vai-sample-on");}}apply(false);new IntersectionObserver(function(entries){var e=entries[0];apply(!e.isIntersecting&&e.boundingClientRect.top<0);}).observe(mark);})();';

export const SAMPLE_BAR_CSS =
  '#vai-sample-sentinel{position:absolute;top:100vh;left:0;width:1px;height:1px;pointer-events:none}#vai-sample-bar{position:fixed;left:0;right:0;bottom:0;z-index:80;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 12px;background:#161616;color:#f7f7f5;font:600 13px/1.3 system-ui,-apple-system,"Segoe UI",sans-serif}#vai-sample-bar[hidden]{display:none}#vai-sample-bar p{margin:0}#vai-sample-bar a{flex:none;display:inline-flex;align-items:center;min-height:40px;padding:0 12px;background:#f4f7fa;color:#161616;text-decoration:none;font-weight:700}body.vai-sample-on .stickybar,body.vai-sample-on .sticky-dock,body.vai-sample-on .dock,body.vai-sample-on .honest,body.vai-sample-on .demo-v0__strip{bottom:var(--vai-sample-h,56px)}';

const BUSINESS_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** sha256 source token for the bar script. CSP uses a hash, not a nonce. */
export function sampleBarScriptSource(): string {
  const digest = createHash('sha256').update(SAMPLE_BAR_SCRIPT, 'utf8').digest('base64');
  return `'sha256-${digest}'`;
}

export function sampleBookHref(businessId: string | null | undefined): string | null {
  const id = (businessId ?? '').trim();
  if (!BUSINESS_ID_RE.test(id)) return null;
  return `https://app.veteranaiwebsites.com/book/${id}?src=sample`;
}

/** Markup injected at serve time. It is not written into stored HTML. */
export function sampleBarMarkup(businessId: string | null | undefined): string {
  const href = sampleBookHref(businessId);
  const button = href ? `<a href="${href}">${SAMPLE_BOOK_LABEL}</a>` : '';
  return (
    '<div id="vai-sample-sentinel" aria-hidden="true" style="position:absolute;top:100vh;left:0;width:1px;height:1px;pointer-events:none"></div>' +
    `<div id="vai-sample-bar" hidden><p>${SAMPLE_BAR_TEXT}</p>${button}</div>` +
    `<style>${SAMPLE_BAR_CSS}</style>` +
    `<script>${SAMPLE_BAR_SCRIPT}</script>`
  );
}

export function injectSampleBar(
  html: string,
  businessId: string | null | undefined,
): string {
  const snippet = sampleBarMarkup(businessId);
  const match = /<\/body>/i.exec(html);
  if (!match || match.index == null) return html + snippet;
  return html.slice(0, match.index) + snippet + html.slice(match.index);
}
