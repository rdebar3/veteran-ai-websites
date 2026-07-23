/**
 * Per-trade site SHAPE presets — multi-page composition, emphasis, copy defaults.
 * Orthogonal to layout×palette (style-fit) and photo variants.
 * Never invents facts; defaults only fill empty CTA/title strings.
 */
import type { TradeKey } from './types';
import { TRADE_KEYS } from './types';

export type NicheShape =
  | 'emergency'
  | 'checklist'
  | 'visual'
  | 'shop'
  | 'general';

export type SitePage = 'home' | 'services' | 'about' | 'contact';

/** Logical content blocks within a page. */
export type NicheBlock =
  | 'hero'
  | 'availability'
  | 'services'
  | 'servicesPreview'
  | 'about'
  | 'aboutTeaser'
  | 'band'
  | 'steps'
  | 'reviews'
  | 'contact'
  | 'cta';

export type ServicesPresentation = 'cards' | 'list' | 'checklist' | 'proof';

export interface NichePreset {
  shape: NicheShape;
  /** Which blocks appear on each of the 4 pages (order matters). */
  pages: Record<SitePage, NicheBlock[]>;
  servicesPresentation: ServicesPresentation;
  heroPhoneDominant: boolean;
  showAvailabilityEarly: boolean;
  stickyCallOnEmergency: boolean;
  defaultHeroCta: string;
  defaultContactCta: string;
  defaultPhonePrompt: string;
  servicesKicker: string;
  servicesTitle: string;
  bandHeadline: string;
  bandBody: string;
}

const EMERGENCY_PAGES: Record<SitePage, NicheBlock[]> = {
  home: ['hero', 'availability', 'servicesPreview', 'cta'],
  services: ['services', 'steps', 'cta'],
  about: ['about', 'availability', 'reviews'],
  contact: ['contact', 'availability'],
};

const CHECKLIST_PAGES: Record<SitePage, NicheBlock[]> = {
  home: ['hero', 'servicesPreview', 'aboutTeaser', 'cta'],
  services: ['services', 'steps', 'cta'],
  about: ['about', 'band', 'reviews'],
  contact: ['contact'],
};

const VISUAL_PAGES: Record<SitePage, NicheBlock[]> = {
  home: ['hero', 'band', 'servicesPreview', 'aboutTeaser', 'cta'],
  services: ['services', 'steps', 'cta'],
  about: ['about', 'band', 'reviews'],
  contact: ['contact'],
};

const SHOP_PAGES: Record<SitePage, NicheBlock[]> = {
  home: ['hero', 'availability', 'servicesPreview', 'cta'],
  services: ['services', 'steps', 'cta'],
  about: ['about', 'band', 'reviews'],
  contact: ['contact', 'availability'],
};

/** About-forward: story carries weight when photos are neutral stand-ins. */
const GENERAL_PAGES: Record<SitePage, NicheBlock[]> = {
  home: ['hero', 'aboutTeaser', 'servicesPreview', 'cta'],
  services: ['services', 'cta'],
  about: ['about', 'band', 'reviews'],
  contact: ['contact'],
};

const DEFAULT_PAGES: Record<SitePage, NicheBlock[]> = {
  home: ['hero', 'availability', 'servicesPreview', 'aboutTeaser', 'cta'],
  services: ['services', 'steps', 'cta'],
  about: ['about', 'band', 'reviews'],
  contact: ['contact'],
};

export const TRADE_NICHES: Record<TradeKey, NichePreset> = {
  towing: {
    shape: 'emergency',
    pages: EMERGENCY_PAGES,
    servicesPresentation: 'list',
    heroPhoneDominant: true,
    showAvailabilityEarly: true,
    stickyCallOnEmergency: true,
    defaultHeroCta: 'CALL NOW',
    defaultContactCta: 'Call now',
    defaultPhonePrompt: 'We pick up — day or night',
    servicesKicker: 'What we handle',
    servicesTitle: 'Fast help when you need it.',
    bandHeadline: 'Local trucks. Real people.',
    bandBody:
      'When you need a pull, you want a neighbor — not a call center three states away.',
  },
  plumbing: {
    shape: 'emergency',
    pages: EMERGENCY_PAGES,
    servicesPresentation: 'list',
    heroPhoneDominant: true,
    showAvailabilityEarly: true,
    stickyCallOnEmergency: true,
    defaultHeroCta: 'Call now',
    defaultContactCta: 'Call now',
    defaultPhonePrompt: 'Talk to a real plumber today',
    servicesKicker: 'Plumbing we fix',
    servicesTitle: 'Leaks, drains, and the hard jobs.',
    bandHeadline: 'On time. Straight answers.',
    bandBody:
      'You get a clear plan and clean work — no runaround when the water will not wait.',
  },
  hvac: {
    shape: 'emergency',
    pages: EMERGENCY_PAGES,
    servicesPresentation: 'list',
    heroPhoneDominant: true,
    showAvailabilityEarly: true,
    stickyCallOnEmergency: true,
    defaultHeroCta: 'Call now',
    defaultContactCta: 'Schedule service',
    defaultPhonePrompt: 'Heat and cool — we answer',
    servicesKicker: 'Comfort services',
    servicesTitle: 'Keep your place warm, cool, and running.',
    bandHeadline: 'Local techs. Honest fixes.',
    bandBody:
      'From no-heat nights to summer AC, you get a real person who knows these hills.',
  },
  electrical: {
    shape: 'emergency',
    pages: EMERGENCY_PAGES,
    servicesPresentation: 'list',
    heroPhoneDominant: true,
    showAvailabilityEarly: true,
    stickyCallOnEmergency: true,
    defaultHeroCta: 'Call now',
    defaultContactCta: 'Call now',
    defaultPhonePrompt: 'Safe work. Clear answers.',
    servicesKicker: 'Electrical work',
    servicesTitle: 'Panels, outlets, and the jobs you cannot ignore.',
    bandHeadline: 'Careful hands. Local crew.',
    bandBody:
      'Power problems need someone who shows up prepared — not a guess over the phone.',
  },
  cleaning: {
    shape: 'checklist',
    pages: CHECKLIST_PAGES,
    servicesPresentation: 'checklist',
    heroPhoneDominant: false,
    showAvailabilityEarly: false,
    stickyCallOnEmergency: true,
    defaultHeroCta: 'Get a quote',
    defaultContactCta: 'Request a quote',
    defaultPhonePrompt: 'Tell us what you need cleaned',
    servicesKicker: "What's included",
    servicesTitle: 'Clear scope. No surprise extras.',
    bandHeadline: 'Your space, done right.',
    bandBody:
      'We leave places looking cared for — the kind of clean you notice when you walk in.',
  },
  landscaping: {
    shape: 'visual',
    pages: VISUAL_PAGES,
    servicesPresentation: 'proof',
    heroPhoneDominant: false,
    showAvailabilityEarly: false,
    stickyCallOnEmergency: false,
    defaultHeroCta: 'Get a free quote',
    defaultContactCta: 'Request a quote',
    defaultPhonePrompt: 'Tell us about your yard',
    servicesKicker: 'What we build outside',
    servicesTitle: 'Work you can see from the road.',
    bandHeadline: 'Yards worth coming home to.',
    bandBody:
      'Local ground, local weather, local pride — landscapes that fit these mountains.',
  },
  roofing: {
    shape: 'visual',
    pages: VISUAL_PAGES,
    servicesPresentation: 'proof',
    heroPhoneDominant: false,
    showAvailabilityEarly: false,
    stickyCallOnEmergency: true,
    defaultHeroCta: 'Free roof quote',
    defaultContactCta: 'Get a quote',
    defaultPhonePrompt: 'Talk roofing with a local crew',
    servicesKicker: 'Roof work',
    servicesTitle: 'Protect the house. Look good doing it.',
    bandHeadline: 'Built for WV weather.',
    bandBody:
      'Steep hills and hard rain need a roof crew that works where you live.',
  },
  auto: {
    shape: 'shop',
    pages: SHOP_PAGES,
    servicesPresentation: 'cards',
    heroPhoneDominant: false,
    showAvailabilityEarly: true,
    stickyCallOnEmergency: false,
    defaultHeroCta: 'Get an estimate',
    defaultContactCta: 'Get an estimate',
    defaultPhonePrompt: 'Call the shop — we answer',
    servicesKicker: 'Shop services',
    servicesTitle: 'Honest work under the hood.',
    bandHeadline: 'Your local bay.',
    bandBody:
      'Drop by or call — real people, real tools, and a clear estimate before we start.',
  },
  general: {
    shape: 'general',
    pages: GENERAL_PAGES,
    servicesPresentation: 'cards',
    heroPhoneDominant: false,
    showAvailabilityEarly: false,
    stickyCallOnEmergency: false,
    defaultHeroCta: 'GET IN TOUCH',
    defaultContactCta: 'Get in touch',
    defaultPhonePrompt: 'We are glad to hear from you',
    servicesKicker: 'WHAT WE DO',
    servicesTitle: 'What we do for people around here.',
    bandHeadline: 'Proud to serve this community.',
    bandBody:
      'Local roots, personal service — a real place for the people who know us.',
  },
};

export const DEFAULT_NICHE: NichePreset = {
  shape: 'shop',
  pages: DEFAULT_PAGES,
  servicesPresentation: 'cards',
  heroPhoneDominant: false,
  showAvailabilityEarly: true,
  stickyCallOnEmergency: true,
  defaultHeroCta: 'Get a quote',
  defaultContactCta: 'Get a quote',
  defaultPhonePrompt: 'Call for a free estimate',
  servicesKicker: 'What we do',
  servicesTitle: 'Every job, done right the first time.',
  bandHeadline: 'Proud to work where we live.',
  bandBody:
    'Born and raised in these mountains — the same hills you call home. When you hire us, you are hiring a neighbor.',
};

function isTradeKey(name: string): name is TradeKey {
  return (TRADE_KEYS as readonly string[]).includes(name);
}

export function getNichePreset(
  trade: string | null | undefined,
): NichePreset {
  if (trade && isTradeKey(trade)) return TRADE_NICHES[trade];
  return DEFAULT_NICHE;
}
