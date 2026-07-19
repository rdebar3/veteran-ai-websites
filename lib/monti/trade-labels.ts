import type { TradeKey } from './types';
import { TRADE_KEYS } from './types';

const LABELS: Record<TradeKey, string> = {
  landscaping: 'Landscaping',
  plumbing: 'Plumbing',
  towing: 'Towing',
  hvac: 'HVAC',
  electrical: 'Electrical',
  roofing: 'Roofing',
  auto: 'Auto',
  cleaning: 'Cleaning',
};

export function tradeLabel(key: string | null | undefined): string {
  if (key && key in LABELS) return LABELS[key as TradeKey];
  return 'Trades';
}

export function isTradeKey(value: unknown): value is TradeKey {
  return typeof value === 'string' && (TRADE_KEYS as readonly string[]).includes(value);
}

/** Chip labels for trade pick (model may also invent its own). */
export const TRADE_CHOICE_LABELS = [
  'Landscaping',
  'Plumbing',
  'Towing',
  'HVAC',
  'Electrical',
  'Roofing',
  'Auto',
  'Cleaning',
] as const;
