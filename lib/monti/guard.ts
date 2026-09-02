const ALLOWED_HOSTS = new Set([
  'www.veteranaiwebsites.com',
  'veteranaiwebsites.com',
]);

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/** First hop of x-forwarded-for, else 'unknown'. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (!forwarded) return 'unknown';
  const first = forwarded.split(',')[0]?.trim();
  return first || 'unknown';
}

/**
 * Same-origin gate for Monti POST routes.
 * Allows www.veteranaiwebsites.com and veteranaiwebsites.com.
 * localhost:* is allowed only when NODE_ENV !== 'production'.
 * Missing Origin on a POST is a reject in production.
 * If Sec-Fetch-Site is present and is not 'same-origin', reject.
 */
export function sameOriginOk(request: Request): boolean {
  const site = request.headers.get('sec-fetch-site');
  if (site !== null && site !== 'same-origin') {
    return false;
  }

  const origin = request.headers.get('origin');
  if (!origin) {
    return !isProduction();
  }

  let hostname: string;
  try {
    hostname = new URL(origin).hostname.toLowerCase();
  } catch {
    return false;
  }

  if (ALLOWED_HOSTS.has(hostname)) return true;
  if (!isProduction() && hostname === 'localhost') return true;
  return false;
}

/**
 * In-memory sliding window per instance, keyed by route + client IP.
 * Pilot-grade bar: not-free-to-abuse, not bulletproof. A durable store
 * (Redis / Upstash) is the later upgrade for multi-instance production.
 */
const hits = new Map<string, number[]>();

export function rateLimit(
  routeKey: string,
  ip: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): boolean {
  const key = `${routeKey}:${ip}`;
  const now = Date.now();
  const stamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (stamps.length >= limit) {
    hits.set(key, stamps);
    return false;
  }
  stamps.push(now);
  hits.set(key, stamps);
  return true;
}

/** Test-only: drop in-memory buckets so cases do not leak across tests. */
export function clearRateLimitBuckets(): void {
  hits.clear();
}
