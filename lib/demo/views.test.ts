import { afterEach, describe, expect, it, vi } from 'vitest';
import { demoViewInsert, recordDemoView, shouldRecordDemoView } from './views';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('shouldRecordDemoView', () => {
  it('records only successful renders, not 404/expired/killed', () => {
    expect(shouldRecordDemoView('render')).toBe(true);
    expect(shouldRecordDemoView('expired')).toBe(false);
    expect(shouldRecordDemoView('not_found')).toBe(false);
  });
});

describe('recordDemoView', () => {
  it('posts a live view row with slug, is_preview false, and user_agent', async () => {
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

    await recordDemoView({
      slug: 'acme-hvac',
      isPreview: false,
      userAgent: 'Mozilla/5.0 Test',
    });

    expect(posts).toEqual([
      {
        url: 'https://example.supabase.co/rest/v1/demo_views',
        method: 'POST',
        body: {
          slug: 'acme-hvac',
          is_preview: false,
          user_agent: 'Mozilla/5.0 Test',
        },
      },
    ]);
    expect(JSON.stringify(posts[0].body)).not.toMatch(/ip|cookie|forwarded/i);
  });

  it('flags preview when ?preview=1 was used', async () => {
    vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role');
    let body: unknown = null;
    globalThis.fetch = (async (_input, init) => {
      body = JSON.parse(String(init?.body || 'null'));
      return new Response(null, { status: 201 });
    }) as typeof fetch;

    await recordDemoView({
      slug: 'acme-hvac',
      isPreview: true,
      userAgent: 'PreviewCard/1',
    });

    expect(body).toEqual({
      slug: 'acme-hvac',
      is_preview: true,
      user_agent: 'PreviewCard/1',
    });
    expect(demoViewInsert({ slug: 'acme-hvac', isPreview: true, userAgent: 'x' })?.is_preview).toBe(
      true,
    );
  });

  it('does not throw when the insert fails, so the page can still render', async () => {
    vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role');
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    globalThis.fetch = (async () => {
      throw new Error('network down');
    }) as typeof fetch;
    await expect(
      recordDemoView({ slug: 'acme-hvac', isPreview: false, userAgent: 'ua' }),
    ).resolves.toBeUndefined();

    globalThis.fetch = (async () =>
      new Response('nope', { status: 500 })) as typeof fetch;
    await expect(
      recordDemoView({ slug: 'acme-hvac', isPreview: true, userAgent: 'ua' }),
    ).resolves.toBeUndefined();

    expect(spy).toHaveBeenCalled();
  });
});
