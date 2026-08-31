import { isDemoSlug, supabaseBaseUrl, supabaseServiceKey } from './supabase';

export const DEMO_SHOT_LOADS_UA_MAX = 512;

export type DemoShotLoadInsert = {
  slug: string;
  user_agent: string | null;
};

export function demoShotLoadInsert(input: {
  slug: string;
  userAgent?: string | null;
}): DemoShotLoadInsert | null {
  if (!isDemoSlug(input.slug)) return null;
  const ua = (input.userAgent || '').trim();
  return {
    slug: input.slug,
    user_agent: ua ? ua.slice(0, DEMO_SHOT_LOADS_UA_MAX) : null,
  };
}

/**
 * Fire-and-forget insert. Never throws. Never writes IPs or cookies.
 * Call only after a successful PNG serve — not 410.
 */
export async function recordDemoShotLoad(input: {
  slug: string;
  userAgent?: string | null;
}): Promise<void> {
  try {
    const row = demoShotLoadInsert(input);
    if (!row) return;
    const base = supabaseBaseUrl();
    const key = supabaseServiceKey();
    if (!base || !key) return;

    const res = await fetch(`${base}/rest/v1/demo_shot_loads`, {
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
      console.error('[demo] shot load insert failed', res.status);
    }
  } catch (err) {
    console.error('[demo] shot load insert failed', err);
  }
}
