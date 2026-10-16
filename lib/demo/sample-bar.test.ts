import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('next/server', async () => {
  const actual = await vi.importActual<typeof import('next/server')>('next/server');
  return { ...actual, after: () => {} };
});

import { GET } from '@/app/s/[slug]/route';
import { SAMPLE_BAR_TEXT, SAMPLE_BOOK_LABEL } from './copy';
import { demoModelCsp } from './model-page';
import {
  injectSampleBar,
  SAMPLE_BAR_SCRIPT,
  sampleBarMarkup,
  sampleBarScriptSource,
  sampleBookHref,
} from './sample-bar';

const STORED = '<!doctype html><html><head></head><body><p>Shop page</p></body></html>';
const ID = '11111111-2222-4333-8444-555555555555';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('sample bar markup', () => {
  it('is absent from the stored html and present after injection', () => {
    expect(STORED).not.toContain(SAMPLE_BAR_TEXT);
    expect(STORED).not.toContain('vai-sample-bar');
    expect(STORED).not.toContain('data-sample');
    const served = injectSampleBar(STORED, ID);
    expect(served).toContain(SAMPLE_BAR_TEXT);
    expect(served).toContain(SAMPLE_BOOK_LABEL);
    expect(served).toContain(sampleBookHref(ID));
    expect(served).toContain(SAMPLE_BAR_SCRIPT);
    expect(served).toContain('id="vai-sample-sentinel"');
    expect(served).toContain('top:100vh');
    expect(STORED).not.toContain('vai-sample-bar');
  });

  it('still adds the bar when the stored html has no data-sample attribute', () => {
    const plain = '<html><body><h1>No marker</h1></body></html>';
    expect(plain).not.toContain('data-sample');
    expect(injectSampleBar(plain, ID)).toContain('id="vai-sample-bar"');
  });

  it('does not put an unsafe id into the booking link', () => {
    expect(sampleBookHref('not an id')).toBeNull();
    const unsafe = sampleBarMarkup('"><img src=x>');
    expect(unsafe).not.toContain('"><img');
    expect(unsafe).not.toContain('/book/');
    expect(sampleBarMarkup(null)).toContain(SAMPLE_BAR_TEXT);
    expect(sampleBarMarkup(null)).not.toContain('/book/');
  });

  it('allows the inline script by sha256 hash', () => {
    expect(demoModelCsp(null)).toContain(`script-src ${sampleBarScriptSource()}`);
    expect(demoModelCsp(null)).not.toContain('unsafe-eval');
    expect(sampleBarScriptSource()).toMatch(/^'sha256-[A-Za-z0-9+/]+=*'$/);
  });
});

describe('GET /s/[slug]', () => {
  it('serves the bar in the response and not in the stored html', async () => {
    vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role');
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes('select=model_html')) {
          return new Response(JSON.stringify([{ model_html: STORED }]));
        }
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
              screenshot_path: null,
              model_status: 'ready',
              business_id: ID,
            },
          ]),
        );
      }),
    );

    const response = await GET(
      new NextRequest('https://www.veteranaiwebsites.com/s/acme-hvac'),
      { params: Promise.resolve({ slug: 'acme-hvac' }) },
    );
    const body = await response.text();
    expect(response.status).toBe(200);
    expect(body).toContain(SAMPLE_BAR_TEXT);
    expect(body).toContain(`https://app.veteranaiwebsites.com/book/${ID}?src=sample`);
    expect(STORED).not.toContain(SAMPLE_BAR_TEXT);
    expect(response.headers.get('Content-Security-Policy')).toContain(
      `script-src ${sampleBarScriptSource()}`,
    );
  });
});

