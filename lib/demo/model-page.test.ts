import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEMO_X_ROBOTS_TAG } from './copy';
import { DEMO_NOINDEX_HEADERS } from './headers';
import {
  demoModelCsp,
  isModelPagePath,
  MODEL_PAGE_SHOT_STYLE,
  modelPageHeaders,
  modelPageOutcome,
  shouldServeModelPage,
} from './model-page';
import { getDemoModelHtml, getDemoSiteBySlug, supabaseOrigin } from './supabase';

const APP = 'https://app.veteranaiwebsites.com';
const PEXELS = 'https://images.pexels.com';
const SUPABASE = 'https://sqgnyrlegbjhpebtbybd.supabase.co';
const PAGE = '<!doctype html><html><body>Acme</body></html>';

const WITH_ORIGIN = [
  "default-src 'none'",
  `img-src 'self' ${APP} ${SUPABASE} ${PEXELS}`,
  "style-src 'unsafe-inline' https://fonts.googleapis.com",
  'font-src https://fonts.gstatic.com',
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
].join('; ');

const WITHOUT_ORIGIN = [
  "default-src 'none'",
  `img-src 'self' ${APP} ${PEXELS}`,
  "style-src 'unsafe-inline' https://fonts.googleapis.com",
  'font-src https://fonts.gstatic.com',
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
].join('; ');

describe('shouldServeModelPage', () => {
  it('is true only for render + ready', () => {
    expect(shouldServeModelPage('render', 'ready')).toBe(true);
    expect(shouldServeModelPage('render', 'queued')).toBe(false);
    expect(shouldServeModelPage('render', 'building')).toBe(false);
    expect(shouldServeModelPage('render', 'failed')).toBe(false);
    expect(shouldServeModelPage('render', 'off')).toBe(false);
    expect(shouldServeModelPage('render', null)).toBe(false);
    expect(shouldServeModelPage('render', '')).toBe(false);
    expect(shouldServeModelPage('expired', 'ready')).toBe(false);
    expect(shouldServeModelPage('not_found', 'ready')).toBe(false);
  });
});

describe('model page outcome', () => {
  it('not_found → 404 Not found', () => {
    expect(
      modelPageOutcome({
        kind: 'not_found',
        modelStatus: 'ready',
        html: PAGE,
        slug: 'acme-hvac',
        preview: true,
      }),
    ).toEqual({ status: 404, body: 'Not found' });
  });

  it('expired → redirect /d without the preview query', () => {
    expect(
      modelPageOutcome({
        kind: 'expired',
        modelStatus: 'ready',
        html: PAGE,
        slug: 'acme-hvac',
        preview: true,
      }),
    ).toEqual({ status: 307, location: '/d/acme-hvac' });
  });

  it('render + not ready → redirect /d and keep ?preview=1', () => {
    expect(
      modelPageOutcome({
        kind: 'render',
        modelStatus: 'building',
        html: PAGE,
        slug: 'acme-hvac',
        preview: true,
      }),
    ).toEqual({ status: 307, location: '/d/acme-hvac?preview=1' });
    expect(
      modelPageOutcome({
        kind: 'render',
        modelStatus: null,
        html: null,
        slug: 'acme-hvac',
        preview: false,
      }),
    ).toEqual({ status: 307, location: '/d/acme-hvac' });
  });

  it('render + ready with empty html → redirect /d and keep ?preview=1', () => {
    expect(
      modelPageOutcome({
        kind: 'render',
        modelStatus: 'ready',
        html: '   ',
        slug: 'acme-hvac',
        preview: true,
      }),
    ).toEqual({ status: 307, location: '/d/acme-hvac?preview=1' });
    expect(
      modelPageOutcome({
        kind: 'render',
        modelStatus: 'ready',
        html: null,
        slug: 'acme-hvac',
        preview: false,
      }),
    ).toEqual({ status: 307, location: '/d/acme-hvac' });
  });

  it('render + ready → 200', () => {
    expect(
      modelPageOutcome({
        kind: 'render',
        modelStatus: 'ready',
        html: PAGE,
        slug: 'acme-hvac',
        preview: false,
      }),
    ).toEqual({ status: 200 });
    expect(
      modelPageOutcome({
        kind: 'render',
        modelStatus: 'ready',
        html: PAGE,
        slug: 'acme-hvac',
        preview: true,
      }),
    ).toEqual({ status: 200 });
  });
});

describe('demoModelCsp', () => {
  it('includes the Supabase origin when it is present', () => {
    expect(demoModelCsp(SUPABASE)).toBe(WITH_ORIGIN);
    expect(demoModelCsp(`${SUPABASE}/`)).toBe(WITH_ORIGIN);
  });

  it('leaves the Supabase origin out when it is missing', () => {
    expect(demoModelCsp(null)).toBe(WITHOUT_ORIGIN);
    expect(demoModelCsp(undefined)).toBe(WITHOUT_ORIGIN);
    expect(demoModelCsp('')).toBe(WITHOUT_ORIGIN);
    expect(demoModelCsp('   ')).toBe(WITHOUT_ORIGIN);
  });
});

describe('model page response headers', () => {
  it('serves the stored html with the locked headers', () => {
    expect(modelPageHeaders('csp-value')).toEqual({
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': 'csp-value',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Robots-Tag': DEMO_X_ROBOTS_TAG,
      'Cache-Control': 'private, no-store',
    });
  });
});

describe('isModelPagePath', () => {
  it("is true for '/s/x' and false for '/d/x'", () => {
    expect(isModelPagePath('/s/x')).toBe(true);
    expect(isModelPagePath('/d/x')).toBe(false);
    expect(isModelPagePath('/s/acme-hvac')).toBe(true);
    expect(isModelPagePath('/shot/acme-hvac')).toBe(false);
  });
});

describe('DEMO_NOINDEX_HEADERS', () => {
  it("includes '/s/:path*'", () => {
    const sources = DEMO_NOINDEX_HEADERS.map((entry) => entry.source);
    expect(sources).toContain('/s/:path*');
    expect(DEMO_NOINDEX_HEADERS[0]?.source).toBe('/d/:path*');
    const model = DEMO_NOINDEX_HEADERS.find((entry) => entry.source === '/s/:path*');
    expect(model?.headers).toEqual([
      { key: 'X-Robots-Tag', value: DEMO_X_ROBOTS_TAG },
    ]);
  });
});

describe('MODEL_PAGE_SHOT_STYLE', () => {
  it('freezes entrance and scroll-reveal animations', () => {
    expect(MODEL_PAGE_SHOT_STYLE).toBe(
      '*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;animation-iteration-count:1!important;animation-timeline:auto!important;transition:none!important}',
    );
  });
});

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.unstubAllEnvs();
});

describe('model html is a separate read', () => {
  it('getDemoSiteBySlug selects model_status and leaves model_html out', async () => {
    vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role');
    let url = '';
    globalThis.fetch = (async (input) => {
      url = String(input);
      return new Response(
        JSON.stringify([
          {
            slug: 'acme-hvac',
            template_key: 'v0',
            facts: {},
            hero_line: null,
            blurbs: null,
            status: 'live',
            expires_at: null,
            screenshot_path: null,
            model_status: 'ready',
          },
        ]),
      );
    }) as typeof fetch;

    const row = await getDemoSiteBySlug('acme-hvac');
    expect(row?.model_status).toBe('ready');
    expect(url).toContain(
      'select=slug,template_key,facts,hero_line,blurbs,status,expires_at,screenshot_path,model_status',
    );
    expect(url).not.toContain('model_html');
  });

  it('getDemoModelHtml returns model_html or null', async () => {
    vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co/rest/v1');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role');
    const urls: string[] = [];
    globalThis.fetch = (async (input) => {
      urls.push(String(input));
      return new Response(JSON.stringify([{ model_html: PAGE }]));
    }) as typeof fetch;

    expect(await getDemoModelHtml('acme-hvac')).toBe(PAGE);
    expect(urls[0]).toContain('/rest/v1/demo_sites?');
    expect(urls[0]).toContain('select=model_html');
    expect(urls[0]).not.toContain('model_status');

    globalThis.fetch = (async () => {
      return new Response(JSON.stringify([{ model_html: null }]));
    }) as typeof fetch;
    expect(await getDemoModelHtml('acme-hvac')).toBeNull();
    expect(await getDemoModelHtml('not a slug')).toBeNull();
  });

  it('supabaseOrigin is the origin of the Supabase URL, or null', () => {
    vi.stubEnv('SUPABASE_URL', `${SUPABASE}/rest/v1`);
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
    expect(supabaseOrigin()).toBe(SUPABASE);

    vi.stubEnv('SUPABASE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
    expect(supabaseOrigin()).toBeNull();
  });
});
