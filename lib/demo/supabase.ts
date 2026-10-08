import type { DemoSiteRow } from './types';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isDemoSlug(slug: string): boolean {
  return slug.length > 0 && slug.length <= 80 && SLUG_RE.test(slug);
}

export function supabaseBaseUrl(): string | null {
  const raw =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  if (!raw) return null;
  return raw.replace(/\/$/, '').replace(/\/rest\/v1\/?$/, '');
}

export function supabaseServiceKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}

/** Origin of the Supabase URL this repo already uses. Null when it is unset. */
export function supabaseOrigin(): string | null {
  const base = supabaseBaseUrl();
  if (!base) return null;
  try {
    return new URL(base).origin;
  } catch {
    return null;
  }
}

/**
 * Read-only lookup. GET only — never POST/PATCH/PUT from this module.
 */
export async function getDemoSiteBySlug(
  slug: string,
): Promise<DemoSiteRow | null> {
  if (!isDemoSlug(slug)) return null;
  const base = supabaseBaseUrl();
  const key = supabaseServiceKey();
  if (!base || !key) {
    console.error(
      '[demo] Missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY',
    );
    return null;
  }

  const url =
    `${base}/rest/v1/demo_sites?slug=eq.${encodeURIComponent(slug)}` +
    '&select=slug,template_key,facts,hero_line,blurbs,status,expires_at,screenshot_path,model_status&limit=1';

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('[demo] lookup failed', res.status);
    return null;
  }

  const rows = (await res.json()) as DemoSiteRow[];
  if (!Array.isArray(rows) || !rows[0]) return null;
  return rows[0];
}

/**
 * model_html only. /d does not call this — a stored page is about 30 KB.
 * Returns the stored HTML, or null when the row, column, or config is missing.
 */
export async function getDemoModelHtml(slug: string): Promise<string | null> {
  if (!isDemoSlug(slug)) return null;
  const base = supabaseBaseUrl();
  const key = supabaseServiceKey();
  if (!base || !key) return null;

  const url =
    `${base}/rest/v1/demo_sites?slug=eq.${encodeURIComponent(slug)}` +
    '&select=model_html&limit=1';

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('[demo] model html lookup failed', res.status);
    return null;
  }

  const rows = (await res.json()) as { model_html?: unknown }[];
  if (!Array.isArray(rows) || !rows[0]) return null;
  const html = rows[0].model_html;
  return typeof html === 'string' ? html : null;
}
