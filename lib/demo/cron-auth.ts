import { timingSafeEqual } from 'node:crypto';

function secretsEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/** Same env as outreach tick: CRON_SECRET via x-cron-secret (Bearer also accepted). */
export function cronAuthorized(
  headerSecret: string | null,
  authorization: string | null,
  expected: string | undefined,
): boolean {
  if (!expected) return false;
  if (headerSecret && secretsEqual(headerSecret, expected)) return true;
  if (authorization?.startsWith('Bearer ')) {
    const token = authorization.slice('Bearer '.length);
    if (token && secretsEqual(token, expected)) return true;
  }
  return false;
}
