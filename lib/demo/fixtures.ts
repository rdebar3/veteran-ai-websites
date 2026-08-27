import type { DemoFacts, DemoSiteRow } from './types';

export const NOW = new Date('2026-08-24T12:00:00.000Z');

export const ACME_FACTS: DemoFacts = {
  name: { value: 'Acme HVAC', source: 'businesses.name' },
  town: { value: 'Weston', source: 'businesses.formatted_address' },
  phone: {
    value: '(304) 269-1234',
    tel: 'tel:+13042691234',
    source: 'businesses.phone',
  },
  rating: { value: 4.8, source: 'businesses.rating' },
  ratings_count: { value: 42, source: 'businesses.ratings_count' },
  hours_text: {
    value: 'Mon–Fri 8am–5pm',
    source: 'page_facts.hours_text',
  },
};

/** Eclipse Construction — locked trades_v1 mock, every optional slot filled. */
export const ECLIPSE_FACTS: DemoFacts = {
  name: { value: 'Eclipse Construction', source: 'businesses.name' },
  town: { value: 'Morgantown', source: 'businesses.formatted_address' },
  phone: {
    value: '(304) 244-3334',
    tel: 'tel:+13042443334',
    source: 'businesses.phone',
  },
  rating: { value: 5, source: 'businesses.rating' },
  ratings_count: { value: 83, source: 'businesses.ratings_count' },
  category: { value: 'roofing', source: 'businesses.category' },
  services: [
    { value: 'roofing', source: 'page_facts.service_vocab_hits' },
    { value: 'asphalt', source: 'page_facts.service_vocab_hits' },
    { value: 'storm', source: 'page_facts.service_vocab_hits' },
    { value: 'consultation', source: 'page_facts.service_vocab_hits' },
  ],
  town_hits: [
    { value: 'Morgantown', source: 'page_facts.town_hits' },
    { value: 'Bridgeport', source: 'page_facts.town_hits' },
    { value: 'Clarksburg', source: 'page_facts.town_hits' },
    { value: 'Fairmont', source: 'page_facts.town_hits' },
    { value: 'Weston', source: 'page_facts.town_hits' },
    { value: 'Buckhannon', source: 'page_facts.town_hits' },
    { value: 'Grafton', source: 'page_facts.town_hits' },
    { value: 'Kingwood', source: 'page_facts.town_hits' },
    { value: 'Parkersburg', source: 'page_facts.town_hits' },
  ],
  maps_url: {
    value: 'https://maps.google.com/?cid=8348910066556641243',
    source: 'businesses.google_maps_url',
  },
  address: {
    value: '355 Brockway Ave, Morgantown, WV 26501',
    source: 'businesses.formatted_address',
  },
  badges: [
    { value: 'Licensed & Insured', source: 'compiler.badges' },
    { value: 'Free Estimates', source: 'compiler.badges' },
  ],
};

/** Name + phone only — optional sections must omit cleanly. */
export const MINIMAL_FACTS: DemoFacts = {
  name: { value: 'Bare Shop', source: 'businesses.name' },
  phone: {
    value: '(304) 269-1234',
    tel: 'tel:+13042691234',
    source: 'businesses.phone',
  },
};

export function demoRow(
  overrides: Partial<DemoSiteRow> = {},
): DemoSiteRow {
  return {
    slug: 'acme-hvac',
    template_key: 'v0',
    facts: ACME_FACTS,
    hero_line: 'Acme HVAC in Weston — 4.8 from neighbors who already called.',
    blurbs: [
      'Furnace work in Weston, named the way the page names it.',
      'Rated 4.8 from 42 reviews on the listing we stored.',
    ],
    status: 'live',
    expires_at: '2026-09-23T12:00:00.000Z',
    ...overrides,
  };
}

export function eclipseRow(
  overrides: Partial<DemoSiteRow> = {},
): DemoSiteRow {
  return demoRow({
    slug: 'eclipse-construction',
    template_key: 'trades_v1',
    facts: ECLIPSE_FACTS,
    hero_line: 'Expert Roofing Services in West Virginia',
    blurbs: ['Roof repair and full replacements — free estimates.'],
    ...overrides,
  });
}

export function minimalRow(
  overrides: Partial<DemoSiteRow> = {},
): DemoSiteRow {
  return demoRow({
    slug: 'bare-shop',
    template_key: 'trades_v1',
    facts: MINIMAL_FACTS,
    hero_line: null,
    blurbs: null,
    ...overrides,
  });
}
