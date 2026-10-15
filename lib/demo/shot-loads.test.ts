import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  DEMO_SHOT_LOAD_RETRY_WAIT_MS,
  DEMO_SHOT_LOADS_UA_MAX,
  demoShotLoadInsert,
  recordDemoShotLoad,
} from './shot-loads';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('recordDemoShotLoad', () => {
  it('posts slug and capped user_agent, never IPs or cookies', async () => {
    vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role');
    const posts: { url: string; method: string; body: unknown }[] = [];
    globalThis.fetch = (async (input, init) => {
      posts.push({
        url: String(input),
        method: (init?.method || 'GET').toUpperCase(),
        body: JSON.parse(String(init?.body || 'null')),
      });
      return new Response(null, { status: 201 });
    }) as typeof fetch;

    const longUa = 'U'.repeat(DEMO_SHOT_LOADS_UA_MAX + 40);
    await recordDemoShotLoad({
      slug: 'acme-hvac',
      userAgent: longUa,
    });

    expect(posts).toEqual([
      {
        url: 'https://example.supabase.co/rest/v1/demo_shot_loads',
        method: 'POST',
        body: {
          slug: 'acme-hvac',
          user_agent: 'U'.repeat(DEMO_SHOT_LOADS_UA_MAX),
        },
      },
    ]);
    expect(JSON.stringify(posts[0].body)).not.toMatch(/ip|cookie|forwarded/i);
    expect(
      demoShotLoadInsert({ slug: 'acme-hvac', userAgent: longUa })?.user_agent
        ?.length,
    ).toBe(DEMO_SHOT_LOADS_UA_MAX);
  });

  it('does not throw when the insert fails, so the image can still serve', async () => {
    vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role');
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    globalThis.fetch = (async () => {
      throw new Error('network down');
    }) as typeof fetch;
    await expect(
      recordDemoShotLoad({ slug: 'acme-hvac', userAgent: 'ua' }),
    ).resolves.toBeUndefined();

    globalThis.fetch = (async () =>
      new Response('nope', { status: 500 })) as typeof fetch;
    await expect(
      recordDemoShotLoad({ slug: 'acme-hvac', userAgent: 'ua' }),
    ).resolves.toBeUndefined();

    expect(spy).toHaveBeenCalled();
  });

  it('posts exactly one row when the first attempt times out and the retry succeeds', async () => {
    vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role');
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const posted: unknown[] = [];
    let calls = 0;
    globalThis.fetch = (async (_input, init) => {
      calls += 1;
      const body = JSON.parse(String(init?.body || 'null'));
      if (calls === 1) {
        const err = new Error('The operation was aborted due to timeout');
        err.name = 'TimeoutError';
        throw err;
      }
      posted.push(body);
      return new Response(null, { status: 201 });
    }) as typeof fetch;

    await recordDemoShotLoad({ slug: 'acme-hvac', userAgent: 'ua' });

    expect(calls).toBe(2);
    expect(posted).toEqual([{ slug: 'acme-hvac', user_agent: 'ua' }]);
    expect(spy).not.toHaveBeenCalled();
  });

  it('logs lost once and does not throw when both attempts fail', async () => {
    vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role');
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    let calls = 0;
    globalThis.fetch = (async () => {
      calls += 1;
      return new Response('nope', { status: 500 });
    }) as typeof fetch;

    const started = Date.now();
    await expect(
      recordDemoShotLoad({ slug: 'acme-hvac', userAgent: 'ua' }),
    ).resolves.toBeUndefined();
    const elapsed = Date.now() - started;

    expect(calls).toBe(2);
    expect(elapsed).toBeGreaterThanOrEqual(DEMO_SHOT_LOAD_RETRY_WAIT_MS - 50);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0]).toEqual([
      '[demo] shot load lost slug=acme-hvac reason=500',
    ]);
  });

  it('does not retry a 4xx', async () => {
    vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role');
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    let calls = 0;
    globalThis.fetch = (async () => {
      calls += 1;
      return new Response('nope', { status: 409 });
    }) as typeof fetch;

    const started = Date.now();
    await recordDemoShotLoad({ slug: 'acme-hvac', userAgent: 'ua' });

    expect(calls).toBe(1);
    expect(Date.now() - started).toBeLessThan(DEMO_SHOT_LOAD_RETRY_WAIT_MS);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0]).toEqual([
      '[demo] shot load lost slug=acme-hvac reason=409',
    ]);
  });
});
