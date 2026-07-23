/**
 * Per-trade layout × palette fit sets for Monti client variety.
 * Agent layout/theme is honored only when it lands inside the trade's set;
 * otherwise the client picks randomly once per session (stable for the build).
 */
import type { Palette, SiteLayout, TradeKey } from './types';
import { TRADE_KEYS } from './types';

export type StylePick = { layout: SiteLayout; palette: Palette };

/** Combos that look good for each trade — every pair is intentional. */
export const TRADE_FIT_SETS: Record<TradeKey, StylePick[]> = {
  landscaping: [
    { layout: 'classic', palette: 'pine' },
    { layout: 'split', palette: 'sand' },
    { layout: 'bold', palette: 'pine' },
    { layout: 'classic', palette: 'sand' },
    { layout: 'split', palette: 'pine' },
  ],
  plumbing: [
    { layout: 'split', palette: 'river' },
    { layout: 'classic', palette: 'slate' },
    { layout: 'bold', palette: 'river' },
    { layout: 'classic', palette: 'river' },
    { layout: 'split', palette: 'slate' },
  ],
  towing: [
    { layout: 'bold', palette: 'ember' },
    { layout: 'bold', palette: 'slate' },
    { layout: 'classic', palette: 'ember' },
    { layout: 'split', palette: 'ember' },
  ],
  hvac: [
    { layout: 'classic', palette: 'slate' },
    { layout: 'bold', palette: 'river' },
    { layout: 'split', palette: 'slate' },
    { layout: 'classic', palette: 'river' },
  ],
  electrical: [
    { layout: 'bold', palette: 'slate' },
    { layout: 'classic', palette: 'river' },
    { layout: 'split', palette: 'slate' },
    { layout: 'classic', palette: 'slate' },
  ],
  roofing: [
    { layout: 'classic', palette: 'sand' },
    { layout: 'bold', palette: 'ember' },
    { layout: 'split', palette: 'sand' },
    { layout: 'classic', palette: 'ember' },
  ],
  auto: [
    { layout: 'bold', palette: 'slate' },
    { layout: 'classic', palette: 'ember' },
    { layout: 'split', palette: 'slate' },
    { layout: 'bold', palette: 'ember' },
  ],
  cleaning: [
    { layout: 'classic', palette: 'river' },
    { layout: 'split', palette: 'sand' },
    { layout: 'classic', palette: 'pine' },
    { layout: 'split', palette: 'river' },
    { layout: 'bold', palette: 'river' },
  ],
};

function isTradeKey(name: string): name is TradeKey {
  return (TRADE_KEYS as readonly string[]).includes(name);
}

export function getTradeFitSet(trade: string | null | undefined): StylePick[] {
  if (!trade || !isTradeKey(trade)) {
    return [
      { layout: 'classic', palette: 'ember' },
      { layout: 'bold', palette: 'slate' },
      { layout: 'split', palette: 'river' },
    ];
  }
  return TRADE_FIT_SETS[trade];
}

export function isStyleInFitSet(
  trade: string | null | undefined,
  layout: SiteLayout | null | undefined,
  palette: Palette | null | undefined,
): boolean {
  if (!layout || !palette) return false;
  return getTradeFitSet(trade).some(
    (p) => p.layout === layout && p.palette === palette,
  );
}

/** Random pick for a session — call once when trade is first known. */
export function pickTradeStyleFit(
  trade: string | null | undefined,
): StylePick {
  const set = getTradeFitSet(trade);
  const i = Math.floor(Math.random() * set.length);
  return set[i] ?? { layout: 'classic', palette: 'ember' };
}

/** Prefer agent combo when in-set; else random client pick. */
export function resolveSessionStyle(
  trade: string | null | undefined,
  agentLayout: SiteLayout | null | undefined,
  agentPalette: Palette | null | undefined,
): StylePick {
  if (isStyleInFitSet(trade, agentLayout, agentPalette)) {
    return { layout: agentLayout!, palette: agentPalette! };
  }
  return pickTradeStyleFit(trade);
}
