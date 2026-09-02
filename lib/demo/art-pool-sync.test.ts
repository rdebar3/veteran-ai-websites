import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/art-pool/sync/route';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.unstubAllEnvs();
});

function tinyJpeg(): Buffer {
  return Buffer.from([
    0xff, 0xd8, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x20, 0x00, 0x40, 0x01,
    0x01, 0x11, 0x00,
  ]);
}

function authHeaders(): HeadersInit {
  return {
    'content-type': 'application/json',
    'x-cron-secret': 'cron-secret',
  };
}

describe('POST /api/art-pool/sync', () => {
  it('uploads 2 files and upserts 2 rows', async () => {
    vi.stubEnv('CRON_SECRET', 'cron-secret');
    vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role');

    const jpeg = tinyJpeg();
    const calls: { url: string; method: string }[] = [];
    globalThis.fetch = (async (input, init) => {
      const url = String(input);
      const method = (init?.method || 'GET').toUpperCase();
      calls.push({ url, method });

      if (url.includes('manifest.json')) {
        return new Response(
          JSON.stringify({
            trade: 'auto',
            shots: [
              {
                key: '01-lift',
                file: '01-lift-portrait.jpg',
                role: 'hero',
                approved: true,
              },
              {
                key: '02-align',
                file: '02-alignment.jpg',
                role: 'band',
                approved: true,
              },
            ],
          }),
          { status: 200 },
        );
      }
      if (url.includes('raw.githubusercontent.com') && url.endsWith('.jpg')) {
        return new Response(new Uint8Array(jpeg), { status: 200 });
      }
      if (url.includes('/storage/v1/object/demo-art/') && method === 'POST') {
        return new Response(null, { status: 200 });
      }
      if (url.includes('/rest/v1/demo_art') && method === 'POST') {
        return new Response(null, { status: 201 });
      }
      if (url.includes('/rest/v1/demo_art') && method === 'GET') {
        return new Response(
          JSON.stringify([{ shot_key: '01-lift' }, { shot_key: 'old-shot' }]),
          { status: 200 },
        );
      }
      if (url.includes('/rest/v1/demo_art') && method === 'PATCH') {
        return new Response(null, { status: 204 });
      }
      throw new Error(`unexpected fetch ${method} ${url}`);
    }) as typeof fetch;

    const res = await POST(
      new Request('https://www.veteranaiwebsites.com/api/art-pool/sync', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ trade: 'auto' }),
      }),
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      ok: boolean;
      trade: string;
      uploaded: unknown[];
      retired: string[];
    };
    expect(json.ok).toBe(true);
    expect(json.trade).toBe('auto');
    expect(json.uploaded).toHaveLength(2);
    expect(json.retired).toEqual(['old-shot']);
    expect(
      calls.filter((c) => c.url.includes('/storage/v1/object/demo-art/')),
    ).toHaveLength(2);
    expect(
      calls.filter(
        (c) => c.url.includes('/rest/v1/demo_art') && c.method === 'POST',
      ),
    ).toHaveLength(2);
  });

  it('returns 401 when unauthorized', async () => {
    vi.stubEnv('CRON_SECRET', 'cron-secret');
    const res = await POST(
      new Request('https://www.veteranaiwebsites.com/api/art-pool/sync', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ trade: 'auto' }),
      }),
    );
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ ok: false, error: 'unauthorized' });
  });

  it('returns 400 for a bad trade', async () => {
    vi.stubEnv('CRON_SECRET', 'cron-secret');
    const res = await POST(
      new Request('https://www.veteranaiwebsites.com/api/art-pool/sync', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ trade: 'Auto Repair' }),
      }),
    );
    expect(res.status).toBe(400);
  });

  it('returns 400 when the manifest trade mismatches', async () => {
    vi.stubEnv('CRON_SECRET', 'cron-secret');
    vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role');
    globalThis.fetch = (async (input) => {
      const url = String(input);
      if (url.includes('manifest.json')) {
        return new Response(
          JSON.stringify({ trade: 'towing', shots: [] }),
          { status: 200 },
        );
      }
      throw new Error(`unexpected fetch ${url}`);
    }) as typeof fetch;

    const res = await POST(
      new Request('https://www.veteranaiwebsites.com/api/art-pool/sync', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ trade: 'auto' }),
      }),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      ok: false,
      error: 'manifest trade mismatch',
    });
  });
});
