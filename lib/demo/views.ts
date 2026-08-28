import { isDemoSlug, supabaseBaseUrl, supabaseServiceKey } from './supabase';
import type { DemoViewKind } from './types';

export const DEMO_VIEWS_UA_MAX = 512;

export type DemoViewInsert = {
  slug: string;
  is_preview: boolean;
  user_agent: string | null;
};

export function shouldRecordDemoView(kind: DemoViewKind): boolean {
  return kind === 'render';
}

export function demoViewInsert(input: {
  slug: string;
  isPreview: boolean;
  userAgent?: string | null;
}): DemoViewInsert | null {
  if (!isDemoSlug(input.slug)) return null;
  const ua = (input.userAgent || '').trim();
  return {
    slug: input.slug,
    is_preview: Boolean(input.isPreview),
    user_agent: ua ? ua.slice(0, DEMO_VIEWS_UA_MAX) : null,
  };
}

/**
 * Fire-and-forget insert. Never throws. Never writes IPs or cookies.
 * Call only after a successful live/preview render — not 404/expired/killed.
 */
export async function recordDemoView(input: {
  slug: string;
  isPreview: boolean;
  userAgent?: string | null;
}): Promise<void> {
  try {
    const row = demoViewInsert(input);
    if (!row) return;
    const base = supabaseBaseUrl();
    const key = supabaseServiceKey();
    if (!base || !key) return;

    const res = await fetch(`${base}/rest/v1/demo_views`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) {
      console.error('[demo] view insert failed', res.status);
    }
  } catch (err) {
    console.error('[demo] view insert failed', err);
  }
}
