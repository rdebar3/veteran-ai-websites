import { MAX, FILL_SECTIONS, emptyRecord } from './contract';
import { deepMergeRecord } from './merge';
import { hasPhoto } from './photos';
import { isTradeKey } from './trade-labels';
import type {
  FillSection,
  MontiPatch,
  MontiRecord,
  MontiReview,
  MontiService,
  TradeKey,
  TurnResponse,
} from './types';
import { TRADE_KEYS } from './types';

export function cap(s: unknown, n: number): string {
  const t = s == null ? '' : String(s).trim();
  if (t.length <= n) return t;
  return t.slice(0, Math.max(0, n - 1)).trimEnd() + '…';
}

function asBool(v: unknown): boolean | undefined {
  if (typeof v === 'boolean') return v;
  return undefined;
}

function asEstablished(v: unknown): number | null | undefined {
  if (v === null) return null;
  if (typeof v === 'number' && Number.isFinite(v) && v >= 1800 && v <= 2100) {
    return Math.round(v);
  }
  if (typeof v === 'string' && /^\d{4}$/.test(v.trim())) {
    const n = Number(v.trim());
    if (n >= 1800 && n <= 2100) return n;
  }
  return undefined;
}

function coerceServices(raw: unknown): MontiService[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: MontiService[] = [];
  for (const item of raw.slice(0, MAX.servicesCount)) {
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    const title = cap(o.title, MAX.service.title);
    const description = cap(o.description, MAX.service.description);
    if (!title && !description) continue;
    out.push({ title: title || 'Service', description });
  }
  return out;
}

function coerceReviews(raw: unknown): MontiReview[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: MontiReview[] = [];
  for (const item of raw.slice(0, MAX.reviewsCount)) {
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    const quote = cap(o.quote, MAX.review.quote);
    if (!quote) continue; // never keep empty / fabricated shells
    out.push({
      quote,
      name: cap(o.name, MAX.review.name) || 'Customer',
      detail: cap(o.detail, MAX.review.detail),
    });
  }
  return out;
}

function coerceBadges(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  return raw
    .map((b) => cap(b, MAX.badge))
    .filter(Boolean)
    .slice(0, MAX.badgesCount);
}

function coerceImageId(raw: unknown): string | undefined {
  if (typeof raw !== 'string' || !raw.trim()) return undefined;
  const id = raw.trim().toLowerCase();
  if (isTradeKey(id) || id === 'wv_hero' || hasPhoto(id)) return id;
  // map common aliases
  if (id.includes('lawn') || id.includes('landscape')) return 'landscaping';
  if (id.includes('plumb')) return 'plumbing';
  if (id.includes('tow')) return 'towing';
  if (id.includes('heat') || id.includes('cool') || id.includes('hvac')) return 'hvac';
  if (id.includes('electr')) return 'electrical';
  if (id.includes('roof')) return 'roofing';
  if (id.includes('auto') || id.includes('mechanic')) return 'auto';
  if (id.includes('clean')) return 'cleaning';
  return undefined;
}

/** Coerce a raw model patch into a safe MontiPatch (drop malformed). */
export function coercePatch(raw: unknown): MontiPatch {
  const patch: MontiPatch = {};
  if (!raw || typeof raw !== 'object') return patch;
  const p = raw as Record<string, unknown>;

  if (p.template_id === 'trades' || p.template_id === null) {
    patch.template_id = p.template_id;
  } else if (p.template_id === 'food' || p.template_id === 'tourism') {
    // Phase 1: force trades
    patch.template_id = 'trades';
  }

  if (p.palette === 'ember' || p.palette === 'timber') {
    patch.palette = p.palette;
  }
  if (
    p.copy_tone === 'grounded' ||
    p.copy_tone === 'warm' ||
    p.copy_tone === 'adventurous'
  ) {
    patch.copy_tone = p.copy_tone;
  }

  if (isTradeKey(p.trade_key)) {
    patch.trade_key = p.trade_key;
  } else if (p.trade_key === null) {
    patch.trade_key = null;
  }

  if (p.business && typeof p.business === 'object') {
    const b = p.business as Record<string, unknown>;
    patch.business = {};
    if (b.name != null) patch.business.name = cap(b.name, MAX.business.name);
    if (b.phone != null) patch.business.phone = cap(b.phone, MAX.business.phone);
    if (b.service_area != null) {
      patch.business.service_area = cap(b.service_area, MAX.business.service_area);
    }
    const est = asEstablished(b.established);
    if (est !== undefined) patch.business.established = est;
    if (b.hours === null) patch.business.hours = null;
    else if (b.hours != null) patch.business.hours = cap(b.hours, MAX.business.hours);
  }

  if (p.hero && typeof p.hero === 'object') {
    const h = p.hero as Record<string, unknown>;
    patch.hero = {};
    if (h.headline != null) patch.hero.headline = cap(h.headline, MAX.hero.headline);
    if (h.subhead != null) patch.hero.subhead = cap(h.subhead, MAX.hero.subhead);
    if (h.cta_text != null) patch.hero.cta_text = cap(h.cta_text, MAX.hero.cta_text);
    const img = coerceImageId(h.image_id);
    if (img) patch.hero.image_id = img;
  }

  if (p.about && typeof p.about === 'object') {
    const a = p.about as Record<string, unknown>;
    if (a.body != null) {
      patch.about = { body: cap(a.body, MAX.about.body) };
    }
  }

  const services = coerceServices(p.services);
  if (services) patch.services = services;

  if (p.trust && typeof p.trust === 'object') {
    const t = p.trust as Record<string, unknown>;
    patch.trust = {};
    const badges = coerceBadges(t.badges);
    if (badges) patch.trust.badges = badges;
    const reviews = coerceReviews(t.reviews);
    if (reviews) patch.trust.reviews = reviews;
  }

  if (p.contact && typeof p.contact === 'object') {
    const c = p.contact as Record<string, unknown>;
    patch.contact = {};
    if (c.cta_text != null) patch.contact.cta_text = cap(c.cta_text, MAX.contact.cta_text);
    if (c.phone_prompt != null) {
      patch.contact.phone_prompt = cap(c.phone_prompt, MAX.contact.phone_prompt);
    }
    const em = asBool(c.emergency);
    if (em !== undefined) patch.contact.emergency = em;
  }

  return patch;
}

function coerceFill(raw: unknown): FillSection[] {
  if (!Array.isArray(raw)) return [];
  const allowed = new Set<string>(FILL_SECTIONS);
  const out: FillSection[] = [];
  for (const x of raw) {
    if (typeof x === 'string' && allowed.has(x) && !out.includes(x as FillSection)) {
      out.push(x as FillSection);
    }
  }
  return out;
}

function coerceChoices(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((c) => cap(c, 48))
    .filter(Boolean)
    .slice(0, 12);
}

function coerceHeroImageId(raw: unknown): TradeKey | null {
  if (raw == null) return null;
  const id = coerceImageId(raw);
  if (id && isTradeKey(id)) return id;
  return null;
}

function stripFences(text: string): string {
  let t = text.trim();
  if (t.startsWith('```')) {
    t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  }
  return t.trim();
}

export function parseModelJson(text: string): unknown {
  const cleaned = stripFences(text);
  // Try direct parse; if model wrapped extra text, extract first {...}
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error('Model did not return JSON');
  }
}

/**
 * Validate raw model turn JSON against §2/§3.
 * Always returns a usable TurnResponse (fallback on total failure).
 */
export function validateTurn(
  raw: unknown,
  current: MontiRecord | null | undefined,
): TurnResponse {
  const base = current ? structuredClone(current) : emptyRecord();

  if (!raw || typeof raw !== 'object') {
    return fallbackTurn(base, 'Sorry — hiccup on my end. Mind saying that again?');
  }

  const o = raw as Record<string, unknown>;
  const patch = coercePatch(o.patch);

  // Top-level template / hero image may also set trade
  let heroImageId = coerceHeroImageId(o.hero_image_id);
  if (!heroImageId && patch.hero?.image_id && isTradeKey(patch.hero.image_id)) {
    heroImageId = patch.hero.image_id;
  }

  let templateId: 'trades' | null = null;
  if (o.template_id === 'trades' || patch.template_id === 'trades') {
    templateId = 'trades';
    patch.template_id = 'trades';
  } else if (o.template_id === null) {
    templateId = null;
  }

  if (heroImageId) {
    patch.hero = { ...(patch.hero || {}), image_id: heroImageId };
    patch.trade_key = heroImageId;
    if (!templateId) {
      templateId = 'trades';
      patch.template_id = 'trades';
    }
  }

  // If patch has trade-ish image without top-level
  if (patch.hero?.image_id && isTradeKey(patch.hero.image_id)) {
    patch.trade_key = patch.hero.image_id;
    if (!heroImageId) heroImageId = patch.hero.image_id;
  }

  const record = deepMergeRecord(base, patch);

  // Ensure trade_key sync
  if (heroImageId) {
    record.trade_key = heroImageId;
    record.hero.image_id = heroImageId;
    record.template_id = 'trades';
  } else if (record.hero.image_id && isTradeKey(record.hero.image_id)) {
    record.trade_key = record.hero.image_id;
  }

  let expect: TurnResponse['expect'] = 'text';
  if (o.expect === 'choice' || o.expect === 'done' || o.expect === 'text') {
    expect = o.expect;
  }

  const choices = expect === 'choice' ? coerceChoices(o.choices) : [];
  const fill = coerceFill(o.fill);
  const done = o.done === true || expect === 'done';

  let say = cap(o.say, MAX.say);
  if (!say) say = 'Go on — I\u2019m listening.';

  const input_hint =
    typeof o.input_hint === 'string' ? cap(o.input_hint, 80) : 'Type your answer\u2026';

  return {
    say,
    expect: done ? 'done' : expect,
    choices,
    input_hint,
    template_id: templateId ?? record.template_id,
    hero_image_id: heroImageId,
    patch,
    fill,
    done,
    record,
  };
}

export function fallbackTurn(record: MontiRecord, say: string): TurnResponse {
  return {
    say: cap(say, MAX.say) || 'Go on — I\u2019m listening.',
    expect: 'text',
    choices: [],
    input_hint: 'Type your answer\u2026',
    template_id: record.template_id,
    hero_image_id: record.trade_key,
    patch: {},
    fill: [],
    done: false,
    record,
  };
}

export function isKnownTradeKey(k: string): k is TradeKey {
  return (TRADE_KEYS as readonly string[]).includes(k);
}
