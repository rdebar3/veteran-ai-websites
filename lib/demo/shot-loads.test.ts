import { afterEach, describe, expect, it, vi } from 'vitest';
import {
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
});
