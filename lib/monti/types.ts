/** Monti §2 turn contract + §3 data contract (Phase 1 — Trades only). */

export const TRADE_KEYS = [
  'landscaping',
  'plumbing',
  'towing',
  'hvac',
  'electrical',
  'roofing',
  'auto',
  'cleaning',
] as const;

export type TradeKey = (typeof TRADE_KEYS)[number];

export type FillSection = 'hero' | 'trust' | 'services' | 'about' | 'contact';

/** Safe layout set — agent picks; unknown coerces to classic. */
export type SiteLayout = 'classic' | 'bold' | 'split';

/** Safe palette presets — CSS tokens only; timber aliases to pine at the gate. */
export type Palette = 'ember' | 'slate' | 'pine' | 'river' | 'sand';

/** Density / type treatment on top of palette. */
export type ThemeMood = 'clean' | 'rugged';

export type CopyTone = 'grounded' | 'warm' | 'adventurous';

export interface MontiService {
  title: string;
  description: string;
}

export interface MontiReview {
  quote: string;
  name: string;
  detail: string;
}

export interface MontiRecord {
  template_id: 'trades' | null;
  /** Structural layout variant (classic = today's Trades frame). */
  layout: SiteLayout;
  palette: Palette;
  /** clean = default airy; rugged = tighter / heavier type. */
  theme_mood: ThemeMood;
  copy_tone: CopyTone;
  /** Closest trade key (for lead category + hero photo). */
  trade_key: TradeKey | null;
  business: {
    name: string;
    phone: string;
    service_area: string;
    established: number | null;
    hours: string | null;
  };
  hero: {
    headline: string;
    subhead: string;
    cta_text: string;
    image_id: string;
  };
  about: { body: string };
  services: MontiService[];
  trust: {
    badges: string[];
    reviews: MontiReview[];
  };
  contact: {
    cta_text: string;
    phone_prompt: string;
    emergency: boolean;
  };
}

/** Partial §3 fields the model may patch each turn. */
export type MontiPatch = {
  template_id?: 'trades' | null;
  layout?: SiteLayout;
  palette?: Palette;
  theme_mood?: ThemeMood;
  copy_tone?: CopyTone;
  trade_key?: TradeKey | null;
  business?: Partial<MontiRecord['business']>;
  hero?: Partial<MontiRecord['hero']>;
  about?: Partial<MontiRecord['about']>;
  services?: MontiService[];
  trust?: {
    badges?: string[];
    reviews?: MontiReview[];
  };
  contact?: Partial<MontiRecord['contact']>;
};

export interface TurnResponse {
  say: string;
  expect: 'text' | 'choice' | 'done';
  choices: string[];
  input_hint: string;
  template_id: 'trades' | null;
  hero_image_id: TradeKey | null;
  patch: MontiPatch;
  fill: FillSection[];
  done: boolean;
  /** Server-merged working record after this turn. */
  record: MontiRecord;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
