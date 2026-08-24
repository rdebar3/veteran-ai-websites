import { afterEach, describe, expect, it, vi } from 'vitest';
import { getDemoSiteBySlug, isDemoSlug } from './supabase';
import { cronAuthorized } from './cron-auth';
import { demoShotPageUrl, demoShotRowPatch, parseShotSlug } from './shot';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.unstubAllEnvs();
});

describe('demo lookup is GET-only', () => {
  it('rejects malformed slugs without fetching', async () => {
    expect(isDemoSlug('acme-hvac')).toBe(true);
    expect(isDemoSlug('../etc')).toBe(false);
    let called = false;
    globalThis.fetch = (async () => {
      called = true;
      return new Response('[]');
    }) as typeof fetch;
    await getDemoSiteBySlug('not a slug');
    expect(called).toBe(false);
  });

  it('looks up demo_sites with GET and never writes', async () => {
    vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role');
    const methods: string[] = [];
    globalThis.fetch = (async (_input, init) => {
      methods.push((init?.method || 'GET').toUpperCase());
      return new Response(
        JSON.stringify([
          {
            slug: 'acme-hvac',
            template_key: 'v0',
            facts: { name: { value: 'Acme HVAC', source: 'x' } },
            hero_line: null,
            blurbs: null,
            status: 'live',
            expires_at: null,
          },
        ]),
      );
    }) as typeof fetch;

    const row = await getDemoSiteBySlug('acme-hvac');
    expect(row?.slug).toBe('acme-hvac');
    expect(methods).toEqual(['GET']);
  });
});

describe('demo-shot helpers', () => {
  it('auth requires x-cron-secret (or Bearer) matching CRON_SECRET', () => {
    expect(cronAuthorized('nope', null, 'secret')).toBe(false);
    expect(cronAuthorized('secret', null, 'secret')).toBe(true);
    expect(cronAuthorized(null, 'Bearer secret', 'secret')).toBe(true);
    expect(cronAuthorized('secret', null, undefined)).toBe(false);
  });

  it('the only row patch is screenshot_path', () => {
    expect(demoShotRowPatch('acme-hvac')).toEqual({
      screenshot_path: 'demo-screenshots/acme-hvac.png',
    });
  });

  it('screenshots the preview URL at a valid slug', () => {
    expect(parseShotSlug({ searchParams: new URLSearchParams('slug=acme-hvac') })).toBe(
      'acme-hvac',
    );
    expect(demoShotPageUrl('acme-hvac', 'https://veteranaiwebsites.com')).toBe(
      'https://veteranaiwebsites.com/d/acme-hvac?preview=1',
    );
  });
});
