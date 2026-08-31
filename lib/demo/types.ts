export type Provenanced<T> = { value: T; source: string };

/** Google review quote. Body is verbatim — renderer must not trim or rewrite. */
export type DemoReviewValue = {
  author: string;
  rating: number;
  body: string;
};

export type DemoFacts = {
  name: Provenanced<string>;
  town?: Provenanced<string>;
  phone?: Provenanced<string> & { tel: string };
  rating?: Provenanced<number>;
  ratings_count?: Provenanced<number>;
  category?: Provenanced<string>;
  services?: Provenanced<string>[];
  hours_text?: Provenanced<string>;
  town_hits?: Provenanced<string>[];
  /** Optional until the outreach compiler lands them. Absent-safe. */
  maps_url?: Provenanced<string>;
  address?: Provenanced<string>;
  badges?: Provenanced<string>[];
  /** GBP reviews: [{ value: { author, rating, body }, source }]. Absent-safe. */
  reviews?: Provenanced<DemoReviewValue>[];
  /** GBP weekdayDescriptions: { value: [7 strings], source }. Absent-safe. */
  hours?: Provenanced<string[]>;
};

export type DemoStatus = 'draft' | 'live' | 'expired' | 'killed';

export type DemoSiteRow = {
  slug: string;
  template_key: string;
  facts: unknown;
  hero_line: string | null;
  blurbs: unknown;
  status: string;
  expires_at: string | null;
  screenshot_path: string | null;
};

/** Four-state render matrix plus killed (treated as missing). */
export type DemoViewKind = 'render' | 'expired' | 'not_found';
