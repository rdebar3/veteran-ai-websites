import { afterEach, describe, expect, it, vi } from 'vitest';
import { demoRow } from './fixtures';
import { recordDemoShotLoad } from './shot-loads';
import {
  DEMO_SHOT_CACHE_CONTROL,
  DEMO_SHOT_CONTENT_TYPE,
  handleDemoShotRequest,
  parseShotVariant,
  resolveDemoShot,
} from './shot-public';

const originalFetch = globalThis.fetch;
const PNG_BYTES = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

function stubSupabase() {
  vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co');
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role');
}

const TOP_BYTES = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0b,
]);

function mockDemoFetch(opts: {
  row?: ReturnType<typeof demoRow> | null;
  png?: Uint8Array | null;
  topPng?: Uint8Array | null;
  insert?: 'ok' | 'throw' | '500';
}) {
  const calls: { url: string; method: string; body: unknown }[] = [];
  globalThis.fetch = (async (input, init) => {
    const url = String(input);
    const method = (init?.method || 'GET').toUpperCase();
    const body = init?.body ? JSON.parse(String(init.body)) : null;
    calls.push({ url, method, body });

    if (url.includes('/rest/v1/demo_sites') && method === 'GET') {
      if (opts.row === null) return new Response('[]', { status: 200 });
      const row = opts.row ?? demoRow({ status: 'live' });
      return new Response(JSON.stringify([row]), { status: 200 });
    }
    if (url.includes('/storage/v1/object/') && method === 'GET') {
      if (url.includes('-top.png')) {
        if (opts.topPng == null) {
          return new Response('missing', { status: 404 });
        }
        return new Response(Buffer.from(opts.topPng), {
          status: 200,
          headers: { 'Content-Type': 'image/png' },
        });
      }
      if (opts.png === null) return new Response('missing', { status: 404 });
      return new Response(Buffer.from(opts.png ?? PNG_BYTES), {
        status: 200,
        headers: { 'Content-Type': 'image/png' },
      });
    }
    if (url.includes('/rest/v1/demo_shot_loads') && method === 'POST') {
      if (opts.insert === 'throw') throw new Error('insert failed');
      if (opts.insert === '500') return new Response('nope', { status: 500 });
      return new Response(null, { status: 201 });
    }
    throw new Error(`unexpected fetch ${method} ${url}`);
  }) as typeof fetch;
  return calls;
}

describe('parseShotVariant', () => {
  it("accepts only 'top'; anything else is the full PNG", () => {
    expect(parseShotVariant('top')).toBe('top');
    expect(parseShotVariant('full')).toBe('full');
    expect(parseShotVariant('')).toBe('full');
    expect(parseShotVariant(null)).toBe('full');
    expect(parseShotVariant(undefined)).toBe('full');
    expect(parseShotVariant('TOP')).toBe('full');
    expect(parseShotVariant('hero')).toBe('full');
    expect(parseShotVariant('top ')).toBe('full');
  });
});

describe('resolveDemoShot', () => {
  it('live → serve; draft without preview, killed, expired, missing → gone', () => {
    expect(
      resolveDemoShot(demoRow({ status: 'live' }), { preview: false }),
    ).toBe('serve');
    expect(
      resolveDemoShot(demoRow({ status: 'draft' }), { preview: false }),
    ).toBe('gone');
    expect(
      resolveDemoShot(demoRow({ status: 'draft' }), { preview: true }),
    ).toBe('serve');
    expect(
      resolveDemoShot(demoRow({ status: 'killed' }), { preview: false }),
    ).toBe('gone');
    expect(
      resolveDemoShot(demoRow({ status: 'expired' }), { preview: true }),
    ).toBe('gone');
    expect(resolveDemoShot(null, { preview: false })).toBe('gone');
  });
});

describe('GET /shot/[slug]', () => {
  it('live serves png content-type', async () => {
    stubSupabase();
    const calls = mockDemoFetch({ row: demoRow({ status: 'live' }) });

    let recorded = Promise.resolve();
    const res = await handleDemoShotRequest({
      slug: 'acme-hvac',
      preview: false,
      userAgent: 'Mozilla/5.0 Test',
      defer: (work) => {
        recorded = work();
      },
    });

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe(DEMO_SHOT_CONTENT_TYPE);
    expect(res.headers.get('cache-control')).toBe(DEMO_SHOT_CACHE_CONTROL);
    const body = new Uint8Array(await res.arrayBuffer());
    expect(body).toEqual(PNG_BYTES);
    await recorded;
    expect(
      calls.some((c) =>
        c.url.includes('/storage/v1/object/demo-screenshots/acme-hvac.png'),
      ),
    ).toBe(true);
    expect(calls.some((c) => c.url.includes('/rest/v1/demo_shot_loads'))).toBe(
      true,
    );
  });

  it('draft without preview → 410', async () => {
    stubSupabase();
    const calls = mockDemoFetch({ row: demoRow({ status: 'draft' }) });

    const res = await handleDemoShotRequest({
      slug: 'acme-hvac',
      preview: false,
      userAgent: 'Mozilla/5.0 Test',
    });

    expect(res.status).toBe(410);
    expect(await res.text()).toBe('');
    expect(calls.some((c) => c.url.includes('/storage/'))).toBe(false);
    expect(calls.some((c) => c.url.includes('demo_shot_loads'))).toBe(false);
  });

  it('killed → 410', async () => {
    stubSupabase();
    const calls = mockDemoFetch({ row: demoRow({ status: 'killed' }) });

    const res = await handleDemoShotRequest({
      slug: 'acme-hvac',
      preview: false,
      userAgent: 'Mozilla/5.0 Test',
    });

    expect(res.status).toBe(410);
    expect(await res.text()).toBe('');
    expect(calls.some((c) => c.url.includes('/storage/'))).toBe(false);
    expect(calls.some((c) => c.url.includes('demo_shot_loads'))).toBe(false);
  });

  it('variant=top serves the first-screen object when present', async () => {
    stubSupabase();
    const calls = mockDemoFetch({
      row: demoRow({ status: 'live' }),
      topPng: TOP_BYTES,
    });

    let recorded = Promise.resolve();
    const res = await handleDemoShotRequest({
      slug: 'acme-hvac',
      preview: false,
      variant: 'top',
      userAgent: 'Mozilla/5.0 Test',
      defer: (work) => {
        recorded = work();
      },
    });

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe(DEMO_SHOT_CONTENT_TYPE);
    expect(res.headers.get('cache-control')).toBe(DEMO_SHOT_CACHE_CONTROL);
    expect(new Uint8Array(await res.arrayBuffer())).toEqual(TOP_BYTES);
    await recorded;
    expect(
      calls.some((c) =>
        c.url.includes('/storage/v1/object/demo-screenshots/acme-hvac-top.png'),
      ),
    ).toBe(true);
    expect(
      calls.some((c) =>
        c.url.includes('/storage/v1/object/demo-screenshots/acme-hvac.png'),
      ),
    ).toBe(false);
    const load = calls.find((c) => c.url.includes('/rest/v1/demo_shot_loads'));
    expect(load?.body).toEqual({
      slug: 'acme-hvac',
      user_agent: 'Mozilla/5.0 Test',
    });
    expect(load?.body).not.toHaveProperty('variant');
  });

  it('variant=top falls back to the full PNG when the top object is missing', async () => {
    stubSupabase();
    const calls = mockDemoFetch({
      row: demoRow({ status: 'live' }),
      topPng: null,
      png: PNG_BYTES,
    });

    let recorded = Promise.resolve();
    const res = await handleDemoShotRequest({
      slug: 'acme-hvac',
      preview: false,
      variant: 'top',
      userAgent: 'Mozilla/5.0 Test',
      defer: (work) => {
        recorded = work();
      },
    });

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe(DEMO_SHOT_CONTENT_TYPE);
    expect(res.headers.get('cache-control')).toBe(DEMO_SHOT_CACHE_CONTROL);
    expect(new Uint8Array(await res.arrayBuffer())).toEqual(PNG_BYTES);
    expect(
      calls.some((c) =>
        c.url.includes('/storage/v1/object/demo-screenshots/acme-hvac-top.png'),
      ),
    ).toBe(true);
    expect(
      calls.some((c) =>
        c.url.includes('/storage/v1/object/demo-screenshots/acme-hvac.png'),
      ),
    ).toBe(true);
    await recorded;
  });

  it('insert failure does not fail the response', async () => {
    stubSupabase();
    mockDemoFetch({
      row: demoRow({ status: 'live' }),
      insert: 'throw',
    });
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    let insertWork: Promise<void> | null = null;
    const res = await handleDemoShotRequest({
      slug: 'acme-hvac',
      preview: false,
      userAgent: 'Mozilla/5.0 Test',
      defer: (work) => {
        insertWork = work();
      },
    });

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe(DEMO_SHOT_CONTENT_TYPE);
    await expect(insertWork).resolves.toBeUndefined();
    await expect(
      recordDemoShotLoad({ slug: 'acme-hvac', userAgent: 'ua' }),
    ).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalled();
  });
});
