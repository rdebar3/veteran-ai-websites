import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST as leadPost } from '@/app/api/monti/lead/route';
import { POST as livekitPost } from '@/app/api/monti/livekit-token/route';
import { emptyRecord, recordForLead } from './contract';
import { clearRateLimitBuckets } from './guard';

vi.mock('livekit-server-sdk', () => ({
  AccessToken: class AccessToken {
    addGrant(): void {}
    toJwt(): Promise<string> {
      return Promise.resolve('test-livekit-jwt');
    }
  },
}));

const originalFetch = globalThis.fetch;
const repoRoot = path.resolve(import.meta.dirname, '../..');

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  clearRateLimitBuckets();
});

function stubLivekitEnv() {
  vi.stubEnv('LIVEKIT_API_KEY', 'key');
  vi.stubEnv('LIVEKIT_API_SECRET', 'secret');
  vi.stubEnv('LIVEKIT_URL', 'wss://monti.livekit.cloud');
}

function stubLeadWrite() {
  vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co');
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role');
  const writes: { url: string; body: unknown }[] = [];
  globalThis.fetch = (async (input, init) => {
    writes.push({
      url: String(input),
      body: init?.body ? JSON.parse(String(init.body)) : null,
    });
    return new Response(
      JSON.stringify([{ id: 'row-1', place_id: 'monti-saved' }]),
      { status: 201 },
    );
  }) as typeof fetch;
  return writes;
}

function post(
  url: string,
  opts: {
    origin?: string;
    ip?: string;
    site?: string;
    body?: unknown;
  } = {},
): Request {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (opts.origin) headers.set('Origin', opts.origin);
  if (opts.ip) headers.set('x-forwarded-for', opts.ip);
  if (opts.site) headers.set('Sec-Fetch-Site', opts.site);
  return new Request(url, {
    method: 'POST',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
}

const SITE = 'https://www.veteranaiwebsites.com';
const LIVEKIT = 'https://www.veteranaiwebsites.com/api/monti/livekit-token';
const LEAD = 'https://www.veteranaiwebsites.com/api/monti/lead';

function leadRecord(extra: Record<string, unknown> = {}) {
  const record = emptyRecord();
  record.business.name = 'Ridge Plumbing';
  return { ...record, website_confirm: '', ...extra };
}

describe('POST /api/monti/livekit-token', () => {
  it('returns 403 for a foreign origin', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const res = await livekitPost(
      post(LIVEKIT, { origin: 'https://evil.example', ip: '203.0.113.10' }),
    );
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: 'Forbidden' });
  });

  it('returns 429 when the IP is over the 5 / 10-minute limit', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    stubLivekitEnv();
    const ip = '203.0.113.11';
    for (let i = 0; i < 5; i++) {
      const res = await livekitPost(post(LIVEKIT, { origin: SITE, ip }));
      expect(res.status).toBe(200);
    }
    const blocked = await livekitPost(post(LIVEKIT, { origin: SITE, ip }));
    expect(blocked.status).toBe(429);
    expect(await blocked.json()).toEqual({ error: 'Too many requests' });
  });

  it('mints a token on a valid same-origin request', async () => {
    stubLivekitEnv();
    const res = await livekitPost(
      post(LIVEKIT, { origin: SITE, ip: '203.0.113.12', site: 'same-origin' }),
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      token: string;
      url: string;
      roomName: string;
    };
    expect(body.token).toBe('test-livekit-jwt');
    expect(body.url).toBe('wss://monti.livekit.cloud');
    expect(body.roomName).toMatch(/^monti-live-/);
  });
});

describe('POST /api/monti/lead', () => {
  it('returns 403 for a foreign origin', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const res = await leadPost(
      post(LEAD, {
        origin: 'https://evil.example',
        ip: '203.0.113.20',
        body: { record: leadRecord() },
      }),
    );
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: 'Forbidden' });
  });

  it('returns 429 when the IP is over the 5 / 10-minute limit', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    stubLeadWrite();
    const ip = '203.0.113.21';
    for (let i = 0; i < 5; i++) {
      const res = await leadPost(
        post(LEAD, { origin: SITE, ip, body: { record: leadRecord() } }),
      );
      expect(res.status).toBe(200);
    }
    const blocked = await leadPost(
      post(LEAD, { origin: SITE, ip, body: { record: leadRecord() } }),
    );
    expect(blocked.status).toBe(429);
    expect(await blocked.json()).toEqual({ error: 'Too many requests' });
  });

  it('writes the lead on a valid same-origin request', async () => {
    const writes = stubLeadWrite();

    const res = await leadPost(
      post(LEAD, {
        origin: SITE,
        ip: '203.0.113.22',
        site: 'same-origin',
        body: { record: leadRecord() },
      }),
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      ok: boolean;
      place_id: string;
      id: string | null;
    };
    expect(json.ok).toBe(true);
    expect(json.place_id).toBe('monti-saved');
    expect(json.id).toBe('row-1');
    expect(writes).toHaveLength(1);
    expect(writes[0].url).toContain('/rest/v1/businesses');
  });

  it('returns 200 and writes nothing when website_confirm is filled', async () => {
    const writes = stubLeadWrite();

    const res = await leadPost(
      post(LEAD, {
        origin: SITE,
        ip: '203.0.113.23',
        body: {
          record: leadRecord({ website_confirm: 'https://spam.example' }),
        },
      }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(writes).toHaveLength(0);
  });
});

describe('recordForLead honeypot', () => {
  it('always sends website_confirm as an empty string', () => {
    expect(recordForLead(emptyRecord()).website_confirm).toBe('');
  });
});

describe('deleted unused monti routes', () => {
  it('the turn and voice-token route files are gone and unreferenced in tracked source', () => {
    expect(
      existsSync(path.join(repoRoot, 'app/api/monti/turn/route.ts')),
    ).toBe(false);
    expect(
      existsSync(path.join(repoRoot, 'app/api/monti/voice-token/route.ts')),
    ).toBe(false);

    let grep = '';
    try {
      grep = execFileSync(
        'git',
        [
          'grep',
          '-n',
          '-E',
          '/api/monti/(turn|voice-token)|app/api/monti/(turn|voice-token)',
          '--',
          '*.ts',
          '*.tsx',
          '*.js',
          '*.jsx',
        ],
        { cwd: repoRoot, encoding: 'utf8' },
      );
    } catch (err) {
      const e = err as { status?: number; stdout?: string };
      if (e.status === 1) grep = e.stdout ?? '';
      else throw err;
    }

    const leftover = grep
      .split('\n')
      .filter(Boolean)
      .filter(
        (line) => !line.includes('.test.ts') && !line.includes('.test.tsx'),
      );
    expect(leftover).toEqual([]);
  });
});
