import { DEMO_SITE_PUBLIC_ORIGIN, screenshotStoragePath } from './copy';
import { isDemoSlug } from './supabase';

export const DEMO_SHOT_VIEWPORT_WIDTH = 1024;

export const DEMO_SHOT_SETTLE_SCRIPT =
  "(async()=>{document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in')});" +
  "if(document.fonts&&document.fonts.ready){await document.fonts.ready}})()";

export function demoPublicOrigin(): string {
  const explicit = process.env.DEMO_PUBLIC_ORIGIN?.trim();
  if (explicit) return explicit.replace(/\/$/, '');
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (prod) {
    return prod.startsWith('http') ? prod.replace(/\/$/, '') : `https://${prod}`;
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, '')}`;
  return DEMO_SITE_PUBLIC_ORIGIN;
}

export function demoShotPageUrl(slug: string, origin = demoPublicOrigin()): string {
  return `${origin.replace(/\/$/, '')}/d/${slug}?preview=1`;
}

export function parseShotSlug(input: {
  searchParams: URLSearchParams;
  bodySlug?: unknown;
}): string | null {
  const fromQuery = input.searchParams.get('slug');
  const fromBody = typeof input.bodySlug === 'string' ? input.bodySlug : '';
  const slug = (fromQuery || fromBody).trim().toLowerCase();
  return isDemoSlug(slug) ? slug : null;
}

export function demoShotRowPatch(slug: string): { screenshot_path: string } {
  return { screenshot_path: screenshotStoragePath(slug) };
}
