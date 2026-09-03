import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  artStorageOrigin,
  artTradeFor,
  loadArtPool,
  pickArt,
  publicArtUrl,
  type ArtRow,
} from './art';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.unstubAllEnvs();
});

const HEROES: ArtRow[] = [
  { trade: 'auto', shot_key: '01-lift', role: 'hero', path: 'auto/01-lift-portrait.jpg' },
  { trade: 'auto', shot_key: '06-bay', role: 'hero', path: 'auto/06-bay-at-closing-portrait.jpg' },
  { trade: 'auto', shot_key: '08-car', role: 'hero', path: 'auto/08-lowered-car-portrait.jpg' },
  { trade: 'auto', shot_key: '09-blue', role: 'hero', path: 'auto/09-blue-hour-portrait.jpg' },
];

const BANDS: ArtRow[] = [
  { trade: 'auto', shot_key: '02-align', role: 'band', path: 'auto/02-alignment-rack-portrait.jpg' },
  { trade: 'auto', shot_key: '03-drawer', role: 'band', path: 'auto/03-drawer-portrait.jpg' },
  { trade: 'auto', shot_key: '05-engine', role: 'band', path: 'auto/05-engine-bay-portrait.jpg' },
];

const POOL = [...HEROES, ...BANDS];

describe('pickArt', () => {
  it('is deterministic across calls for the same slug', () => {
    const a = pickArt('auto', 'cove-run-customs', POOL);
    const b = pickArt('auto', 'cove-run-customs', POOL);
    expect(a).toEqual(b);
    expect(a.hero?.shot_key).toBeTruthy();
    expect(a.band?.shot_key).toBeTruthy();
  });

  it('spreads distinct slugs across heroes', () => {
    const slugs = [
      'cove-run-customs',
      'ridge-auto',
      'mountain-motors',
      'elk-river-repair',
      'new-river-garage',
      'kanawha-cars',
      'tygart-auto',
      'mon-valley-motors',
    ];
    const keys = new Set(
      slugs.map((slug) => pickArt('auto', slug, POOL).hero?.shot_key),
    );
    expect(keys.size).toBeGreaterThan(1);
  });

  it('returns null roles when the pool is empty', () => {
    expect(pickArt('auto', 'cove-run-customs', [])).toEqual({
      hero: null,
      band: null,
    });
  });
});

describe('publicArtUrl', () => {
  it('builds URLs on our storage origin and rejects external paths', () => {
    vi.stubEnv('SUPABASE_URL', 'https://sqgnyrlegbjhpebtbybd.supabase.co');
    const origin = artStorageOrigin();
    expect(origin).toBe(
      'https://sqgnyrlegbjhpebtbybd.supabase.co/storage/v1/object/public/demo-art',
    );
    const url = publicArtUrl('auto/01-lift-portrait.jpg');
    expect(url).toBe(`${origin}/auto/01-lift-portrait.jpg`);
    expect(url?.startsWith(origin!)).toBe(true);
    expect(publicArtUrl('https://evil.example/x.jpg')).toBeNull();
    expect(publicArtUrl('http://other.host/auto/01-lift-portrait.jpg')).toBeNull();
    expect(publicArtUrl('//cdn.example/x.jpg')).toBeNull();
  });
});

describe('artTradeFor', () => {
  it('lets a heating name win on a generic contractor, not on auto_repair', () => {
    expect(artTradeFor('general_contractor', 'B & G Heating & Cooling')).toBe(
      'hvac',
    );
    expect(artTradeFor('auto_repair', "Rick's Towing")).toBe('auto');
  });

  it('matches name hints on word boundaries, not substrings', () => {
    expect(
      artTradeFor('general_contractor', 'Morgantown Handyman WV Professionals'),
    ).toBe('general_contractor');
    expect(artTradeFor('general_contractor', 'Appalachian Air LLC')).toBe(
      'hvac',
    );
    expect(
      artTradeFor('general_contractor', "Pifer's Towing and Recovery"),
    ).toBe('towing');
  });
});

describe('loadArtPool', () => {
  it('requests approved rows ordered by shot_key.asc', async () => {
    vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role');
    let url = '';
    globalThis.fetch = (async (input) => {
      url = String(input);
      return new Response('[]', { status: 200 });
    }) as typeof fetch;
    await loadArtPool('auto');
    expect(url).toContain('order=shot_key.asc');
  });
});
