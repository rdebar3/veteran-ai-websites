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
