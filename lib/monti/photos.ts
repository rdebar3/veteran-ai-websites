/**
 * Curated Trades photo library v2 — multi-variant heroes + support per trade.
 * Unsplash commercial-free. Variant [0] heroes match v1 for continuity.
 * Agent still sends hero.image_id as trade key; client picks variants.
 */

import type { TradeKey } from './types';
import { TRADE_KEYS } from './types';

export const UNSPLASH_BASE = 'https://images.unsplash.com/photo-';

export const PRESET = {
  hero: 'w=3840&h=2160&fit=crop&crop=entropy&q=80&fm=jpg',
  feature: 'w=2000&h=1500&fit=crop&crop=entropy&q=80&fm=jpg',
  band: 'w=3840&h=1400&fit=crop&crop=entropy&q=80&fm=jpg',
} as const;

export type PhotoPreset = keyof typeof PRESET;

export type TradePhotoSet = {
  hero: string[];
  support: string[];
};

export type PhotoVariants = {
  hero: number;
  support: number;
};

/** Per-trade curated ids (hero[0] = former single-photo library). */
export const TRADE_PHOTOS: Record<TradeKey, TradePhotoSet> = {
  landscaping: {
    hero: [
      '1689728318937-17d24bc0a65c',
      '1734303023491-db8037a21f09',
      '1605117882932-f9e32b03fea9',
      '1690068023694-053da714f95f',
      '1590820292118-e256c3ac2676',
      '1597201278257-3687be27d954',
    ],
    support: ['1558904541-efa843a96f01', '1629575063988-881596e38d31'],
  },
  plumbing: {
    hero: [
      '1676210133055-eab6ef033ce3',
      '1676210134188-4c05dd172f89',
      '1676210134190-3f2c0d5cf58d',
      '1748442001865-5583ec02ae22',
      '1613839397604-65fffe7fc3d4',
      '1615749721143-3a38368d3d05',
    ],
    support: ['1771122453274-d3270e73cf94', '1750749761538-3aea36066a4f'],
  },
  towing: {
    hero: [
      '1742069029207-0aacf8fa4401',
      '1730514784243-f0e7f09c9f50',
      '1698998882426-39a6609ab10a',
      '1686966933735-305bd8fe0a77',
      '1730514785075-b065c757b653',
      '1738101996177-13110d20a973',
    ],
    support: ['1601508836900-ee2aa7840a7b', '1562146748-5cbf9bd1030e'],
  },
  hvac: {
    hero: [
      '1660330589693-99889d60181e',
      '1660330590022-9f4ff56b63f6',
      '1660330589827-da8ab7dd3c02',
      '1705579604902-eb832f58bf85',
      '1705579605238-24a90c8799c5',
      '1615774925655-a0e97fc85c14',
    ],
    support: ['1748027869634-fc2e545cfb0c', '1732660513320-a6b489f3fece'],
  },
  electrical: {
    // Dropped 404: 1758101755915-01ec03d9ef57 (verified HEAD)
    hero: [
      '1621905251189-08b45d6a269e',
      '1621905251918-48416bd8575a',
      '1595856619767-ab739fa7daae',
      '1646640381839-02748ae8ddf0',
      '1595831708961-1b13c0dd2422',
    ],
    support: ['1618090584126-129cd1f3fbae', '1597502310092-31cdaa35b46d'],
  },
  roofing: {
    hero: [
      '1632759145351-1d592919f522',
      '1726589004565-bedfba94d3a2',
      '1635424824849-1b09bdcc55b1',
      '1681049400158-0ff6249ac315',
      '1633759593085-1eaeb724fc88',
      '1634750009079-6bf7bede038b',
    ],
    support: ['1590365876016-da05ac533e83', '1635424709870-cdc6e64f0e20'],
  },
  auto: {
    hero: [
      '1631720040176-0d789a643a78',
      '1643701079732-3b1c7a797e3d',
      '1676018366904-c083ed678e60',
      '1636761358783-209512dccd98',
      '1702146715426-2380c6ad54c5',
      '1618783129985-dd97dbe4ad99',
    ],
    support: ['1698382318239-2b134ca8fa4c', '1637640125496-31852f042a60'],
  },
  cleaning: {
    hero: [
      '1758273705627-937374bfa978',
      '1758273238415-01ec03d9ef27',
      '1758272421995-e993f97fae22',
      '1740657254989-42fe9c3b8cce',
      '1647381518264-97ff1835026f',
      '1758272421751-963195322eaa',
    ],
    support: ['1713110824336-f78c320dcf8e', '1758523670739-0d26a3ee976d'],
  },
};

/** Non-trade fixed images. */
export const EXTRA_PHOTOS: Record<string, string> = {
  wv_hero: '1661823331212-28e241c85291',
  wv_band: '1698787273825-90bd24e90eb0',
  work_truck: '1564355172839-be57081c219f',
};

/** v1-compatible map: trade → hero[0], plus extras. */
export const IMG: Record<string, string> = {
  ...Object.fromEntries(
    (TRADE_KEYS as readonly TradeKey[]).map((k) => [
      k,
      TRADE_PHOTOS[k].hero[0]!,
    ]),
  ),
  ...EXTRA_PHOTOS,
};

function isTradeKey(name: string): name is TradeKey {
  return (TRADE_KEYS as readonly string[]).includes(name);
}

function resolveId(
  name: string | null | undefined,
  preset: PhotoPreset,
  variantIndex: number,
  fallback: string,
): string {
  const key = name && hasPhoto(name) ? name : fallback;

  if (isTradeKey(key)) {
    const set = TRADE_PHOTOS[key];
    const list =
      preset === 'feature' && set.support.length > 0 ? set.support : set.hero;
    const i =
      list.length > 0
        ? ((variantIndex % list.length) + list.length) % list.length
        : 0;
    return list[i] || EXTRA_PHOTOS.wv_hero!;
  }

  return EXTRA_PHOTOS[key] || EXTRA_PHOTOS[fallback] || EXTRA_PHOTOS.wv_hero!;
}

/**
 * Build Unsplash URL. Optional variantIndex selects among trade variants
 * (default 0 = v1 single-photo continuity).
 */
export function photoUrl(
  name: string | null | undefined,
  preset: PhotoPreset,
  variantIndex = 0,
  fallback = 'wv_hero',
): string {
  const id = resolveId(name, preset, variantIndex, fallback);
  return `${UNSPLASH_BASE}${id}?${PRESET[preset]}`;
}

export function hasPhoto(name: string | null | undefined): boolean {
  if (!name) return false;
  if (isTradeKey(name)) return true;
  return !!EXTRA_PHOTOS[name];
}

/** Random indices for a session — call once when trade is first known. */
export function pickTradePhotoVariants(
  trade: string | null | undefined,
): PhotoVariants {
  if (!trade || !isTradeKey(trade)) {
    return { hero: 0, support: 0 };
  }
  const set = TRADE_PHOTOS[trade];
  const heroLen = Math.max(1, set.hero.length);
  const supportLen = Math.max(1, set.support.length);
  return {
    hero: Math.floor(Math.random() * heroLen),
    support: Math.floor(Math.random() * supportLen),
  };
}

/** Warm the browser cache so skeleton → photo does not flash empty. */
export function preloadPhotoUrl(url: string): void {
  if (typeof window === 'undefined' || !url) return;
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
  } catch {
    /* ignore */
  }
  try {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  } catch {
    /* ignore */
  }
}
