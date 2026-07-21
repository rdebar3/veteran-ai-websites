import type { MontiRecord } from './types';

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
  return {
    template_id: null,
    layout: 'classic',
    palette: 'ember',
    theme_mood: 'clean',
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
