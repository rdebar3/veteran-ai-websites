/** Spec §5 honest strip — exact wording. */
export const HONEST_STRIP =
  'Sample homepage built by Veteran AI Websites from your public listing — a preview, nothing published on your behalf.';

export const HONEST_STRIP_LINK_TEXT = 'Veteran AI Websites';

export const EXPIRED_HEADING = 'This sample has expired';
export const EXPIRED_BODY =
  'This preview is no longer available. If you still want a homepage, get in touch — nothing was published on your behalf.';
export const EXPIRED_CTA_LABEL = 'Get in touch';

export const DEMO_X_ROBOTS_TAG = 'noindex, nofollow';
export const DEMO_ROBOTS_DISALLOW = '/d/';
export const DEMO_STORAGE_BUCKET = 'demo-screenshots';
export const DEMO_TEMPLATE_V0 = 'v0';
export const DEMO_TEMPLATE_TRADES_V1 = 'trades_v1';
export const DEMO_SITE_PUBLIC_ORIGIN = 'https://veteranaiwebsites.com';

export function screenshotStoragePath(slug: string): string {
  return `${DEMO_STORAGE_BUCKET}/${slug}.png`;
}

export type DemoSkin = 'ember' | 'summit' | 'storm';

export type SkinTokens = {
  bg: string;
  panel: string;
  a1: string;
  a2: string;
  glow: string;
  btnInk: string;
};

/** Ember = current trades_v1 tokens. Storm buttons use dark ink on gold. */
export const SKIN_TOKENS: Record<DemoSkin, SkinTokens> = {
  ember: {
    bg: '#10151d',
    panel: '#1a222e',
    a1: '#ff9a3d',
    a2: '#f0641e',
    glow: 'rgba(240,100,30,.45)',
    btnInk: '#fff',
  },
  summit: {
    bg: '#0b131e',
    panel: '#13202e',
    a1: '#4db5ff',
    a2: '#1273e6',
    glow: 'rgba(18,115,230,.45)',
    btnInk: '#fff',
  },
  storm: {
    bg: '#0f1216',
    panel: '#181d24',
    a1: '#ffd23d',
    a2: '#f0a500',
    glow: 'rgba(240,165,0,.45)',
    btnInk: '#10151d',
  },
};

const EMBER_CATEGORIES = new Set([
  'roofing',
  'roofing_contractor',
  'general_contractor',
  'excavation',
]);
const SUMMIT_CATEGORIES = new Set([
  'hvac',
  'hvac_contractor',
  'plumber',
  'plumbing',
]);
const STORM_CATEGORIES = new Set([
  'electrician',
  'electrical',
  'auto_repair',
  'towing',
  'towing_service',
]);

export function skinFor(category?: string): DemoSkin {
  const n = (category || '').toLowerCase().trim();
  if (!n) return 'ember';
  if (SUMMIT_CATEGORIES.has(n)) return 'summit';
  if (STORM_CATEGORIES.has(n)) return 'storm';
  if (EMBER_CATEGORIES.has(n)) return 'ember';
  return 'ember';
}

export type KickerFamily =
  | 'roofing'
  | 'gc'
  | 'hvac'
  | 'plumbing'
  | 'electric'
  | 'auto'
  | 'towing';

const KICKER_FORMULAS: Record<KickerFamily, readonly string[]> = {
  roofing: [
    'Over your head. Under control.',
    'Weather-ready roofs.',
    'Roofing for {town} weather.',
  ],
  gc: [
    'Built right the first time.',
    'From plans to done.',
    '{town} built.',
  ],
  hvac: [
    'Comfort, year-round.',
    'Heating and cooling, handled.',
    '{town} comfort, done right.',
  ],
  plumbing: [
    'Water where it belongs.',
    'Drains, lines, done.',
    '{town} plumbing, handled.',
  ],
  electric: ['Wired right.', 'Power, handled.', 'Lights on in {town}.'],
  auto: [
    'Back on the road.',
    'Fixed right the first time.',
    '{town} keeps rolling.',
  ],
  towing: ['On our way.', 'Stuck? Solved.', '{town} roads, covered.'],
};

export function kickerFamilyFor(category?: string): KickerFamily {
  const n = (category || '').toLowerCase().trim();
  if (n === 'roofing' || n === 'roofing_contractor') return 'roofing';
  if (n === 'general_contractor' || n === 'excavation') return 'gc';
  if (n === 'hvac' || n === 'hvac_contractor') return 'hvac';
  if (n === 'plumber' || n === 'plumbing') return 'plumbing';
  if (n === 'electrician' || n === 'electrical') return 'electric';
  if (n === 'auto_repair') return 'auto';
  if (n === 'towing' || n === 'towing_service') return 'towing';
  return 'gc';
}

export function kickerFormulasFor(category?: string): readonly string[] {
  return KICKER_FORMULAS[kickerFamilyFor(category)];
}

export function eligibleKickerFormulas(
  formulas: readonly string[],
  town?: string,
): string[] {
  const hasTown = Boolean((town || '').trim());
  const eligible = formulas.filter((f) => !f.includes('{town}') || hasTown);
  return eligible.length
    ? eligible
    : formulas.filter((f) => !f.includes('{town}'));
}

export function pickKicker(args: {
  category?: string;
  town?: string;
  seed: number;
}): string {
  const formulas = eligibleKickerFormulas(
    kickerFormulasFor(args.category),
    args.town,
  );
  const i = ((args.seed % formulas.length) + formulas.length) % formulas.length;
  const picked = formulas[i] || formulas[0] || '';
  const town = (args.town || '').trim();
  return picked.split('{town}').join(town);
}

export function slugSeed(slug: string): number {
  let n = 0;
  for (let i = 0; i < slug.length; i++) n += slug.charCodeAt(i);
  return n;
}

export type LayoutVariant = {
  heroAlign: 'left' | 'center';
  watermark: 'shown' | 'hidden';
  gridStyle: 'feature-first' | 'uniform';
};

export function layoutVariantFor(slug: string): LayoutVariant {
  const seed = slugSeed(slug);
  return {
    heroAlign: seed % 2 ? 'left' : 'center',
    watermark: (seed >> 1) % 2 ? 'shown' : 'hidden',
    gridStyle: (seed >> 2) % 2 ? 'feature-first' : 'uniform',
  };
}

export function proofCardVisible(rating: unknown): boolean {
  if (rating == null || rating === '') return false;
  const n = parseFloat(String(rating));
  return Number.isFinite(n) && n >= 4.0;
}
