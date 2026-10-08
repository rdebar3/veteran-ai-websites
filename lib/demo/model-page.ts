import { DEMO_X_ROBOTS_TAG } from './copy';
import type { DemoViewKind } from './types';

/** True only when /s should return the stored Fable page. */
export function shouldServeModelPage(
  kind: DemoViewKind,
  modelStatus: string | null,
): boolean {
  return kind === 'render' && modelStatus === 'ready';
}

export type ModelPageOutcome =
  | { status: 404; body: 'Not found' }
  | { status: 307; location: string }
  | { status: 200 };

/**
 * /s decision. Expired always goes back to /d with no preview query.
 * A render that is not ready, or a ready row with empty HTML, goes back
 * to /d and keeps ?preview=1 when the request had it.
 */
export function modelPageOutcome(input: {
  kind: DemoViewKind;
  modelStatus: string | null;
  html: string | null;
  slug: string;
  preview: boolean;
}): ModelPageOutcome {
  if (input.kind === 'not_found') {
    return { status: 404, body: 'Not found' };
  }
  if (input.kind === 'expired') {
    return { status: 307, location: `/d/${input.slug}` };
  }
  const html = input.html ?? '';
  if (
    !shouldServeModelPage(input.kind, input.modelStatus) ||
    html.trim() === ''
  ) {
    const query = input.preview ? '?preview=1' : '';
    return { status: 307, location: `/d/${input.slug}${query}` };
  }
  return { status: 200 };
}

export function demoModelCsp(
  supabaseOrigin: string | null | undefined,
): string {
  const origin = (supabaseOrigin ?? '').trim().replace(/\/$/, '');
  const images = ["'self'", 'https://app.veteranaiwebsites.com'];
  if (origin) images.push(origin);
  images.push('https://images.pexels.com');
  return [
    "default-src 'none'",
    `img-src ${images.join(' ')}`,
    "style-src 'unsafe-inline' https://fonts.googleapis.com",
    'font-src https://fonts.gstatic.com',
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
  ].join('; ');
}

export function modelPageHeaders(csp: string): Record<string, string> {
  return {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Security-Policy': csp,
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Robots-Tag': DEMO_X_ROBOTS_TAG,
    'Cache-Control': 'private, no-store',
  };
}

/** Pathname of a served Fable page. Template pages stay under /d/. */
export function isModelPagePath(pathname: string): boolean {
  return pathname.startsWith('/s/');
}

/** Finished state for entrance and scroll-reveal animations before a shot. */
export const MODEL_PAGE_SHOT_STYLE =
  '*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;animation-iteration-count:1!important;animation-timeline:auto!important;transition:none!important}';
