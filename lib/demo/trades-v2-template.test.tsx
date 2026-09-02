import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { artStorageOrigin, type ArtRow } from './art';
import { HONEST_STRIP } from './copy';
import { eclipseRow, MINIMAL_FACTS, minimalRow } from './fixtures';
import { DemoSiteView } from './render';
import {
  authorInitials,
  bandCaption,
  TradesV2Template,
} from './trades-v2-template';
import type { DemoFacts } from './types';

afterEach(() => {
  vi.unstubAllEnvs();
});

const WEEKDAY_HOURS = [
  'Monday: 8:00 AM – 5:00 PM',
  'Tuesday: 8:00 AM – 5:00 PM',
  'Wednesday: 8:00 AM – 5:00 PM',
  'Thursday: 8:00 AM – 5:00 PM',
  'Friday: 8:00 AM – 5:00 PM',
  'Saturday: Closed',
  'Sunday: Closed',
];

const POOL: ArtRow[] = [
  {
    trade: 'auto',
    shot_key: '01-lift',
    role: 'hero',
    path: 'auto/01-lift-portrait.jpg',
  },
  {
    trade: 'auto',
    shot_key: '02-align',
    role: 'band',
    path: 'auto/02-alignment-rack-portrait.jpg',
  },
];

const COVE_FACTS: DemoFacts = {
  name: { value: 'Cove Run Customs', source: 'businesses.name' },
  town: { value: 'Clarksburg', source: 'businesses.formatted_address' },
  phone: {
    value: '(304) 566-7482',
    tel: 'tel:+13045667482',
    source: 'businesses.phone',
  },
  rating: { value: 4.5, source: 'businesses.rating' },
  ratings_count: { value: 77, source: 'businesses.ratings_count' },
  category: { value: 'auto_repair', source: 'businesses.category' },
  address: {
    value: '3003 Philippi Pike, Clarksburg, WV 26301',
    source: 'businesses.formatted_address',
  },
  maps_url: {
    value: 'https://maps.google.com/?cid=4542587674435135132',
    source: 'businesses.google_maps_url',
  },
  services: [
    { value: 'Engine Service', source: 'page_facts.service_vocab_hits' },
    { value: 'Tire Service', source: 'page_facts.service_vocab_hits' },
    { value: 'Wheel Alignment', source: 'page_facts.service_vocab_hits' },
    { value: 'Brake Service', source: 'page_facts.service_vocab_hits' },
    { value: 'Vehicle Inspection', source: 'page_facts.service_vocab_hits' },
  ],
  hours: {
    value: WEEKDAY_HOURS,
    source: 'places.regularOpeningHours.weekdayDescriptions',
  },
  reviews: [
    {
      value: {
        author: 'Kathy Bailey',
        rating: 5,
        body: 'They got me in and out quickly.',
      },
      source: 'places.reviews',
    },
  ],
};

function coveRow(overrides: Record<string, unknown> = {}) {
  return eclipseRow({
    slug: 'cove-run-customs',
    template_key: 'trades_v2',
    facts: COVE_FACTS,
    hero_line: 'Auto repair shop in Clarksburg serving custom and standard vehicles',
    blurbs: [
      'First blurb from the listing.',
      {
        value: 'Time taken on lowered cars and aftermarket wheels',
        source: 'places.reviews',
      },
      { value: 'Quick turnaround on brake service', source: 'compiler' },
    ],
    ...overrides,
  });
}

function decode(html: string): string {
  return html
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&');
}

function httpAssetUrls(html: string): string[] {
  const decoded = decode(html);
  const urls: string[] = [];
  for (const match of decoded.matchAll(/url\((['"]?)(.*?)\1\)/g)) {
    const value = match[2];
    if (/^https?:/i.test(value)) urls.push(value);
  }
  for (const match of decoded.matchAll(/<img\b[^>]*src=["']([^"']+)["']/gi)) {
    if (/^https?:/i.test(match[1])) urls.push(match[1]);
  }
  return urls;
}

function stripCells(html: string): number {
  const block = html.match(
    /<div class="strip">[\s\S]*?<div class="wrap"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/,
  );
  if (!block) return 0;
  return (block[1].match(/<div>/g) || []).length;
}

describe('trades_v2 routing', () => {
  it('renders trades_v2 for that key and leaves trades_v1 alone', () => {
    const v2 = renderToStaticMarkup(
      <DemoSiteView site={coveRow()} artPool={[]} />,
    );
    expect(v2).toContain('demo-trades-v2');
    expect(v2).not.toContain('demo-v0');
    expect(v2).not.toContain('class="stickybar"');

    const v1 = renderToStaticMarkup(
      <DemoSiteView site={eclipseRow({ template_key: 'trades_v1' })} />,
    );
    expect(v1).toContain('class="stickybar"');
    expect(v1).not.toContain('demo-trades-v2');
  });
});

describe('trades_v2 art URLs', () => {
  it('emits only our storage origin for photos; missing pool renders around absence', () => {
    vi.stubEnv('SUPABASE_URL', 'https://sqgnyrlegbjhpebtbybd.supabase.co');
    const origin = artStorageOrigin()!;
    const withArt = renderToStaticMarkup(
      <TradesV2Template site={coveRow()} pool={POOL} />,
    );
    expect(withArt).toContain('class="photo"');
    expect(withArt).toContain('has-photo');
    const urls = httpAssetUrls(withArt);
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) {
      expect(url.startsWith(origin)).toBe(true);
    }

    const noArt = renderToStaticMarkup(
      <TradesV2Template site={coveRow()} pool={[]} />,
    );
    expect(noArt).not.toContain('class="photo"');
    expect(noArt).toContain('no-photo');
    expect(noArt).toContain('no-hero-photo');
    expect(httpAssetUrls(noArt)).toEqual([]);
  });
});

describe('trades_v2 hero and proof', () => {
  it('shows the trust badge only when rating and count exist', () => {
    const withTrust = renderToStaticMarkup(
      <TradesV2Template site={coveRow()} pool={[]} />,
    );
    expect(withTrust).toContain('class="trust"');
    expect(withTrust).toContain('77 Google reviews');

    const facts = { ...COVE_FACTS };
    delete (facts as { rating?: unknown }).rating;
    const noRating = renderToStaticMarkup(
      <TradesV2Template
        site={coveRow({ facts })}
        pool={[]}
      />,
    );
    expect(noRating).not.toContain('class="trust"');
    expect(noRating).not.toContain('77 Google reviews');
  });

  it('sizes the proof strip to the facts that are present', () => {
    const full = renderToStaticMarkup(
      <TradesV2Template site={coveRow()} pool={[]} />,
    );
    expect(stripCells(full)).toBe(3);
    expect(full).toContain('Open Mon–Fri');
    expect(full).toContain('3003 Philippi Pike');
    expect(full).toContain('Quick turnaround on brake service');

    const facts: DemoFacts = {
      name: COVE_FACTS.name,
      town: COVE_FACTS.town,
      address: COVE_FACTS.address,
    };
    const one = renderToStaticMarkup(
      <TradesV2Template
        site={coveRow({ facts, blurbs: null })}
        pool={[]}
      />,
    );
    expect(stripCells(one)).toBe(1);
  });
});

describe('trades_v2 hours open-now', () => {
  it('marks Open now on a weekday midday and not on Sunday', () => {
    const open = renderToStaticMarkup(
      <TradesV2Template
        site={coveRow()}
        pool={[]}
        now={new Date('2026-09-02T16:00:00.000Z')}
      />,
    );
    expect(open).toContain('Open now');
    expect(open).toContain('Wednesday');

    const sunday = renderToStaticMarkup(
      <TradesV2Template
        site={coveRow()}
        pool={[]}
        now={new Date('2026-09-06T16:00:00.000Z')}
      />,
    );
    expect(sunday).not.toContain('Open now');
    expect(sunday).toContain('Sunday');
  });
});

describe('authorInitials', () => {
  it('takes 1–2 letters from the author name', () => {
    expect(authorInitials('Kathy Bailey')).toBe('KB');
    expect(authorInitials('Doug')).toBe('D');
    expect(authorInitials('K Stanton')).toBe('KS');
  });
});

describe('trades_v2 camera polish', () => {
  it('uses SVG stars and no glyph stars or arrows; five services set data-n', () => {
    const html = renderToStaticMarkup(
      <TradesV2Template site={coveRow()} pool={[]} />,
    );
    expect(html).toContain('data-n="5"');
    expect(html).not.toContain('★');
    expect(html).not.toContain('↗');
    expect(html).toMatch(/class="trust"[^>]*>[\s\S]*?<svg\b/);
  });

  it('puts blurbs[0] in the hero and blurbs[1] in the band, never the same sentence', () => {
    const html = decode(
      renderToStaticMarkup(<TradesV2Template site={coveRow()} pool={[]} />),
    );
    const sub = html.match(/<p class="sub">([^<]*)<\/p>/)?.[1];
    const quote = html.match(/<q>([^<]*)<small>/)?.[1];
    expect(sub).toBe('First blurb from the listing.');
    expect(quote).toBe('Time taken on lowered cars and aftermarket wheels');
    expect(sub).not.toBe(quote);
  });

  it('shows the hero line in the band when only one blurb exists', () => {
    const html = decode(
      renderToStaticMarkup(
        <TradesV2Template
          site={coveRow({
            blurbs: ['Only one blurb from the listing.'],
          })}
          pool={[]}
        />,
      ),
    );
    expect(html).toContain('Only one blurb from the listing.');
    const quote = html.match(/<q>([^<]*)<small>/)?.[1];
    expect(quote).toBe(
      'Auto repair shop in Clarksburg serving custom and standard vehicles',
    );
  });
});

describe('trades_v2 honest strip and captions', () => {
  it('keeps the honest strip wording', () => {
    const html = renderToStaticMarkup(
      <TradesV2Template site={coveRow()} pool={[]} />,
    );
    expect(html).toContain('Sample homepage built by');
    expect(html).toContain('Veteran AI Websites');
    expect(html).toContain(
      'from your public listing — a preview, nothing published on your behalf.',
    );
    expect(html).toContain('class="honest"');
    expect(HONEST_STRIP).toContain('Veteran AI Websites');
  });

  it('captions the band quote from reviews vs the public listing', () => {
    expect(bandCaption('places.reviews')).toBe("From the shop's own reviews");
    expect(bandCaption('compiler.blurbs')).toBe(
      "From the shop's public listing",
    );
    const fromReviews = decode(
      renderToStaticMarkup(<TradesV2Template site={coveRow()} pool={[]} />),
    );
    expect(fromReviews).toContain("From the shop's own reviews");

    const listing = decode(
      renderToStaticMarkup(
        <TradesV2Template
          site={coveRow({
            blurbs: ['Only one blurb from the listing.'],
          })}
          pool={[]}
        />,
      ),
    );
    expect(listing).toContain("From the shop's public listing");
  });
});

describe('trades_v2 minimal', () => {
  it('renders a name-only row without crashing or blank proof cells', () => {
    const html = renderToStaticMarkup(
      <TradesV2Template
        site={minimalRow({
          template_key: 'trades_v2',
          facts: MINIMAL_FACTS,
          hero_line: null,
          blurbs: null,
        })}
        pool={[]}
      />,
    );
    expect(html).toContain('demo-trades-v2');
    expect(html).toContain('Bare Shop');
    expect(html).not.toContain('class="trust"');
    expect(html).not.toContain('class="strip"');
  });
});
