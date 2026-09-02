import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  clearRateLimitBuckets,
  rateLimit,
  sameOriginOk,
} from './guard';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.useRealTimers();
  clearRateLimitBuckets();
});

function requestWith(
  headers: Record<string, string>,
): Request {
  return new Request('https://www.veteranaiwebsites.com/api/monti/lead', {
    method: 'POST',
    headers,
  });
}

describe('sameOriginOk', () => {
  it('allows www and apex origins in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(
      sameOriginOk(
        requestWith({ Origin: 'https://www.veteranaiwebsites.com' }),
      ),
    ).toBe(true);
    expect(
      sameOriginOk(
        requestWith({ Origin: 'https://veteranaiwebsites.com' }),
      ),
    ).toBe(true);
  });

  it('rejects a foreign origin', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(
      sameOriginOk(requestWith({ Origin: 'https://evil.example' })),
    ).toBe(false);
  });

  it('rejects a missing origin in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(sameOriginOk(requestWith({}))).toBe(false);
  });

  it('allows localhost outside production', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(
      sameOriginOk(requestWith({ Origin: 'http://localhost:3000' })),
    ).toBe(true);
    expect(
      sameOriginOk(requestWith({ Origin: 'http://localhost:5173' })),
    ).toBe(true);
  });

  it("rejects when Sec-Fetch-Site is 'cross-site'", () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(
      sameOriginOk(
        requestWith({
          Origin: 'https://www.veteranaiwebsites.com',
          'Sec-Fetch-Site': 'cross-site',
        }),
      ),
    ).toBe(false);
  });
});

describe('rateLimit', () => {
  it('rejects the (limit+1)th call inside the window', () => {
    const opts = { limit: 2, windowMs: 10_000 };
    expect(rateLimit('r', '1.1.1.1', opts)).toBe(true);
    expect(rateLimit('r', '1.1.1.1', opts)).toBe(true);
    expect(rateLimit('r', '1.1.1.1', opts)).toBe(false);
  });

  it('resets once the window has elapsed', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    const opts = { limit: 1, windowMs: 1_000 };
    expect(rateLimit('r', '2.2.2.2', opts)).toBe(true);
    expect(rateLimit('r', '2.2.2.2', opts)).toBe(false);
    vi.setSystemTime(new Date('2026-01-01T00:00:01.001Z'));
    expect(rateLimit('r', '2.2.2.2', opts)).toBe(true);
  });

  it('does not share a bucket across IPs', () => {
    const opts = { limit: 1, windowMs: 10_000 };
    expect(rateLimit('r', '3.3.3.3', opts)).toBe(true);
    expect(rateLimit('r', '4.4.4.4', opts)).toBe(true);
    expect(rateLimit('r', '3.3.3.3', opts)).toBe(false);
    expect(rateLimit('r', '4.4.4.4', opts)).toBe(false);
  });
});
