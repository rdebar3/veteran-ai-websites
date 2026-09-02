import type { DemoFacts, DemoReviewValue, Provenanced } from './types';

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function provenancedString(value: unknown): Provenanced<string> | undefined {
  const rec = asRecord(value);
  if (!rec) return undefined;
  if (typeof rec.value !== 'string') return undefined;
  const text = rec.value.trim();
  if (!text) return undefined;
  return {
    value: text,
    source: typeof rec.source === 'string' ? rec.source : '',
  };
}

function provenancedNumber(value: unknown): Provenanced<number> | undefined {
  const rec = asRecord(value);
  if (!rec) return undefined;
  if (typeof rec.value !== 'number' || !Number.isFinite(rec.value)) {
    return undefined;
  }
  return {
    value: rec.value,
    source: typeof rec.source === 'string' ? rec.source : '',
  };
}

function provenancedStringList(value: unknown): Provenanced<string>[] | undefined {
  if (!Array.isArray(value) || value.length === 0) return undefined;
  const out: Provenanced<string>[] = [];
  for (const item of value) {
    const parsed = provenancedString(item);
    if (parsed) out.push(parsed);
  }
  return out.length ? out : undefined;
}

function provenancedHours(value: unknown): Provenanced<string[]> | undefined {
  const rec = asRecord(value);
  if (!rec || !Array.isArray(rec.value)) return undefined;
  const out: string[] = [];
  for (const item of rec.value) {
    if (typeof item !== 'string') continue;
    const text = item.trim();
    if (text) out.push(text);
  }
  if (!out.length) return undefined;
  return {
    value: out,
    source: typeof rec.source === 'string' ? rec.source : '',
  };
}

function provenancedReviews(
  value: unknown,
): Provenanced<DemoReviewValue>[] | undefined {
  if (!Array.isArray(value) || value.length === 0) return undefined;
  const out: Provenanced<DemoReviewValue>[] = [];
  for (const item of value) {
    const rec = asRecord(item);
    if (!rec) continue;
    const inner = asRecord(rec.value);
    if (!inner) continue;
    if (typeof inner.author !== 'string' || typeof inner.body !== 'string') {
      continue;
    }
    const author = inner.author.trim();
    const body = inner.body;
    if (!author || !body.trim()) continue;
    if (typeof inner.rating !== 'number' || !Number.isFinite(inner.rating)) {
      continue;
    }
    out.push({
      value: { author, rating: inner.rating, body },
      source: typeof rec.source === 'string' ? rec.source : '',
    });
  }
  return out.length ? out : undefined;
}

export function parseDemoFacts(raw: unknown): DemoFacts {
  const rec = asRecord(raw);
  const name = provenancedString(rec?.name) ?? { value: '', source: '' };
  const facts: DemoFacts = { name };

  const town = provenancedString(rec?.town);
  if (town) facts.town = town;

  const phone = provenancedString(rec?.phone);
  if (phone) {
    const telRaw = rec?.phone;
    const telRec = asRecord(telRaw);
    const tel =
      typeof telRec?.tel === 'string' && telRec.tel.trim()
        ? telRec.tel.trim()
        : `tel:${phone.value}`;
    facts.phone = { ...phone, tel };
  }

  const rating = provenancedNumber(rec?.rating);
  if (rating) facts.rating = rating;

  const ratingsCount = provenancedNumber(rec?.ratings_count);
  if (ratingsCount) facts.ratings_count = ratingsCount;

  const category = provenancedString(rec?.category);
  if (category) facts.category = category;

  const services = provenancedStringList(rec?.services);
  if (services) facts.services = services;

  const hours = provenancedString(rec?.hours_text);
  if (hours) facts.hours_text = hours;

  const townHits = provenancedStringList(rec?.town_hits);
  if (townHits) facts.town_hits = townHits;

  const mapsUrl = provenancedString(rec?.maps_url);
  if (mapsUrl) facts.maps_url = mapsUrl;

  const address = provenancedString(rec?.address);
  if (address) facts.address = address;

  const badges = provenancedStringList(rec?.badges);
  if (badges) facts.badges = badges;

  const reviews = provenancedReviews(rec?.reviews);
  if (reviews) facts.reviews = reviews;

  const weekdayHours = provenancedHours(rec?.hours);
  if (weekdayHours) facts.hours = weekdayHours;

  return facts;
}

export function parseHeroLine(raw: string | null | undefined): string | null {
  if (typeof raw !== 'string') return null;
  const text = raw.trim();
  return text || null;
}

export function parseBlurbItems(raw: unknown): Provenanced<string>[] {
  if (!Array.isArray(raw)) return [];
  const out: Provenanced<string>[] = [];
  for (const item of raw) {
    if (typeof item === 'string') {
      const text = item.trim();
      if (text) out.push({ value: text, source: '' });
    } else {
      const parsed = provenancedString(item);
      if (parsed) out.push(parsed);
    }
    if (out.length >= 3) break;
  }
  return out;
}

export function parseBlurbs(raw: unknown): string[] {
  return parseBlurbItems(raw).map((item) => item.value);
}
