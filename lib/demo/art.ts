/**
 * Images render ONLY from the approved art pool. Never generated per demo.
 * Never external. Never anything that could pass as the business's own
 * building or signage. If the pool has no approved image for a role, the
 * template renders around the absence — never a broken image, never a
 * placeholder from anywhere else.
 */
import { cache } from 'react';
import { supabaseBaseUrl } from './supabase';

export const DEMO_ART_BUCKET = 'demo-art';

export type ArtRole = 'hero' | 'band';

export type ArtRow = {
  trade: string;
  shot_key: string;
  role: ArtRole;
  path: string;
  width?: number | null;
  height?: number | null;
};

const ART_SELECT = 'trade,shot_key,role,path,width,height';

function anonOrServiceKey(): string | null {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    null
  );
}

function isArtRole(value: unknown): value is ArtRole {
  return value === 'hero' || value === 'band';
}

function tradeFromName(name: string): string | null {
  const nm = name.toLowerCase();
  if (/\b(heat\w*|cool\w*|hvac|furnace|air)\b/.test(nm)) return 'hvac';
  if (/\b(tow|towing|recovery|wrecker)\b/.test(nm)) return 'towing';
  if (/\broof\w*/.test(nm)) return 'roofing';
  if (/\b(plumb\w*|drain\w*|sewer)\b/.test(nm)) return 'plumbing';
  if (/\belectric\w*/.test(nm)) return 'electrical';
  return null;
}

export function artTradeFor(category?: string, name?: string): string {
  const n = (category || '').toLowerCase().trim();
  let trade = '';
  if (n.includes('auto')) trade = 'auto';
  else if (n.includes('roof')) trade = 'roofing';
  else if (n.includes('plumb')) trade = 'plumbing';
  else if (n.includes('hvac') || n.includes('heat') || n.includes('cool')) {
    trade = 'hvac';
  } else if (n.includes('electric')) trade = 'electrical';
  else if (n.includes('tow')) trade = 'towing';
  else if (
    n.includes('general_contractor') ||
    n === 'contractor' ||
    n.includes('construction')
  ) {
    trade = 'general_contractor';
  } else if (n) {
    trade = n.replace(/[\s-]+/g, '_');
  }

  const generic = !n || trade === 'general_contractor';
  if (generic && name) {
    const fromName = tradeFromName(name);
    if (fromName) return fromName;
  }
  return trade || 'auto';
}

/** Public URL for a pool path. Rejects anything that is not a relative storage key. */
export function publicArtUrl(path: string): string | null {
  const trimmed = (path || '').trim();
  if (!trimmed) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return null;
  if (trimmed.startsWith('//')) return null;
  if (trimmed.includes('..') || trimmed.includes('\\') || trimmed.includes(':')) {
    return null;
  }
  if (trimmed.startsWith('/')) return null;
  if (!/^[a-z0-9][a-z0-9._/-]*$/i.test(trimmed)) return null;
  const base = supabaseBaseUrl();
  if (!base) return null;
  const encoded = trimmed
    .split('/')
    .filter(Boolean)
    .map(encodeURIComponent)
    .join('/');
  if (!encoded) return null;
  return `${base}/storage/v1/object/public/${DEMO_ART_BUCKET}/${encoded}`;
}

export function artStorageOrigin(): string | null {
  const base = supabaseBaseUrl();
  if (!base) return null;
  return `${base}/storage/v1/object/public/${DEMO_ART_BUCKET}`;
}

/** 32-bit FNV-1a. Unsigned so modulo is stable. */
export function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function pickArt(
  _trade: string,
  slug: string,
  pool: ArtRow[],
): { hero: ArtRow | null; band: ArtRow | null } {
  const heroes = pool.filter((row) => row.role === 'hero');
  const bands = pool.filter((row) => row.role === 'band');
  if (heroes.length === 0 && bands.length === 0) {
    return { hero: null, band: null };
  }
  const h = fnv1a32(slug);
  const hero = heroes.length ? heroes[h % heroes.length] : null;
  const band = bands.length ? bands[(h >>> 8) % bands.length] : null;
  return { hero, band };
}

async function loadArtPoolUncached(trade: string): Promise<ArtRow[]> {
  const base = supabaseBaseUrl();
  const key = anonOrServiceKey();
  if (!base || !key || !trade) return [];

  const url =
    `${base}/rest/v1/demo_art?trade=eq.${encodeURIComponent(trade)}` +
    `&approved=eq.true&select=${ART_SELECT}&order=shot_key.asc`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('[demo-art] pool lookup failed', res.status);
    return [];
  }

  const rows = (await res.json()) as unknown;
  if (!Array.isArray(rows)) return [];

  const out: ArtRow[] = [];
  for (const item of rows) {
    if (!item || typeof item !== 'object') continue;
    const rec = item as Record<string, unknown>;
    if (typeof rec.trade !== 'string' || typeof rec.shot_key !== 'string') {
      continue;
    }
    if (!isArtRole(rec.role) || typeof rec.path !== 'string') continue;
    if (!rec.path.trim()) continue;
    out.push({
      trade: rec.trade,
      shot_key: rec.shot_key,
      role: rec.role,
      path: rec.path,
      width: typeof rec.width === 'number' ? rec.width : null,
      height: typeof rec.height === 'number' ? rec.height : null,
    });
  }
  return out;
}

/** Approved rows for the trade. Public read. Cached per request. */
export const loadArtPool = cache(loadArtPoolUncached);
