import { isDemoSlug, supabaseBaseUrl, supabaseServiceKey } from './supabase';

export const DEMO_SHOT_LOADS_UA_MAX = 512;
export const DEMO_SHOT_LOAD_TIMEOUT_MS = 10_000;
export const DEMO_SHOT_LOAD_RETRY_WAIT_MS = 500;

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

type ShotLoadAttempt =
  | { ok: true }
  | { ok: false; retry: boolean; reason: string };

function isTimeoutError(err: unknown): boolean {
  return (
    !!err &&
    typeof err === 'object' &&
    'name' in err &&
    (err as { name?: unknown }).name === 'TimeoutError'
  );
}

/** One line. Never the error object, so the log has no stack. */
function shotLoadReason(err: unknown): string {
  if (isTimeoutError(err)) return 'TimeoutError';
  const message = err instanceof Error ? err.message : String(err ?? 'error');
  const line = message.replace(/[\r\n]+/g, ' ').trim();
  return line.slice(0, 200) || 'error';
}

function shotLoadLost(slug: string, reason: string): void {
  const safe = reason.replace(/[\r\n]+/g, ' ').trim() || 'error';
  console.error(`[demo] shot load lost slug=${slug} reason=${safe}`);
}

async function postDemoShotLoad(
  url: string,
  key: string,
  row: DemoShotLoadInsert,
): Promise<ShotLoadAttempt> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
      cache: 'no-store',
      signal: AbortSignal.timeout(DEMO_SHOT_LOAD_TIMEOUT_MS),
    });
    if (res.ok) return { ok: true };
    return {
      ok: false,
      retry: res.status >= 500,
      reason: String(res.status),
    };
  } catch (err) {
    const timeout = isTimeoutError(err);
    return {
      ok: false,
      retry: timeout,
      reason: timeout ? 'TimeoutError' : shotLoadReason(err),
    };
  }
}

/**
 * Fire-and-forget insert. Never throws. Never writes IPs or cookies.
 * Call only after a successful PNG serve — not 410. The response must
 * already be on its way: this waits up to 10s, then once more after 500ms
 * when the insert times out or the server returns a 5xx.
 */
export async function recordDemoShotLoad(input: {
  slug: string;
  userAgent?: string | null;
}): Promise<void> {
  const slugForLog = (input.slug || '').trim() || 'unknown';
  try {
    const row = demoShotLoadInsert(input);
    if (!row) return;
    const base = supabaseBaseUrl();
    const key = supabaseServiceKey();
    if (!base || !key) return;

    const url = `${base}/rest/v1/demo_shot_loads`;
    let attempt = await postDemoShotLoad(url, key, row);
    if (!attempt.ok && attempt.retry) {
      await new Promise((resolve) =>
        setTimeout(resolve, DEMO_SHOT_LOAD_RETRY_WAIT_MS),
      );
      attempt = await postDemoShotLoad(url, key, row);
    }
    if (!attempt.ok) shotLoadLost(row.slug, attempt.reason);
  } catch (err) {
    shotLoadLost(slugForLog, shotLoadReason(err));
  }
}
