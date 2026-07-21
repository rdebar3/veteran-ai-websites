import type { MontiRecord, Palette, ThemeMood } from './types';

/** Packet §3 max lengths — validation gate uses these. */
export const MAX = {
  say: 220,
  business: {
    name: 40,
    phone: 20,
    service_area: 60,
    hours: 40,
  },
  hero: {
    headline: 64,
    subhead: 150,
    cta_text: 22,
  },
  about: { body: 320 },
  service: { title: 30, description: 120 },
  badge: 24,
  review: { quote: 200, name: 28, detail: 32 },
  contact: { cta_text: 22, phone_prompt: 48 },
  servicesCount: 6,
  badgesCount: 4,
  reviewsCount: 3,
} as const;

export const FILL_SECTIONS = [
  'hero',
  'trust',
  'services',
  'about',
  'contact',
] as const;

export function emptyRecord(): MontiRecord {
  const palette: Palette = 'ember';
  const theme_mood: ThemeMood = 'clean';
  return {
    template_id: null,
    layout: 'classic',
    palette,
    theme_mood,
    theme: { palette, mood: theme_mood },
    copy_tone: 'grounded',
    trade_key: null,
    business: {
      name: '',
      phone: '',
      service_area: '',
      established: null,
      hours: null,
    },
    hero: {
      headline: '',
      subhead: '',
      cta_text: '',
      image_id: '',
    },
    about: { body: '' },
    services: [],
    trust: { badges: [], reviews: [] },
    contact: {
      cta_text: '',
      phone_prompt: '',
      emergency: false,
    },
  };
}

/**
 * Ensure layout + nested theme are always present on lead payloads
 * (monti_draft) so Rich sees exactly what the owner saw.
 */
export function recordForLead(r: MontiRecord): MontiRecord {
  const palette = r.palette || 'ember';
  const mood = r.theme_mood || 'clean';
  return {
    ...r,
    layout: r.layout || 'classic',
    palette,
    theme_mood: mood,
    theme: r.theme?.palette
      ? r.theme
      : { palette, mood },
  };
}
