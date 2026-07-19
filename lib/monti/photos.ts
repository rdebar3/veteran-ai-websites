/**
 * Curated Trades photo library v1 — from monti-trades-template.html.
 * All sources 6000px+, Unsplash commercial-free.
 */

export const UNSPLASH_BASE = 'https://images.unsplash.com/photo-';

export const PRESET = {
  hero: 'w=3840&h=2160&fit=crop&crop=entropy&q=80&fm=jpg',
  feature: 'w=2000&h=1500&fit=crop&crop=entropy&q=80&fm=jpg',
  band: 'w=3840&h=1400&fit=crop&crop=entropy&q=80&fm=jpg',
} as const;

export type PhotoPreset = keyof typeof PRESET;

export const IMG: Record<string, string> = {
  landscaping: '1689728318937-17d24bc0a65c',
  towing: '1742069029207-0aacf8fa4401',
  plumbing: '1676210133055-eab6ef033ce3',
  hvac: '1660330589693-99889d60181e',
  electrical: '1621905251189-08b45d6a269e',
  roofing: '1632759145351-1d592919f522',
  auto: '1631720040176-0d789a643a78',
  cleaning: '1758273705627-937374bfa978',
  wv_hero: '1661823331212-28e241c85291',
  wv_band: '1698787273825-90bd24e90eb0',
  work_truck: '1564355172839-be57081c219f',
};

export function photoUrl(
  name: string | null | undefined,
  preset: PhotoPreset,
  fallback = 'wv_hero',
): string {
  const key = name && IMG[name] ? name : fallback;
  const id = IMG[key] || IMG[fallback];
  return `${UNSPLASH_BASE}${id}?${PRESET[preset]}`;
}

export function hasPhoto(name: string | null | undefined): boolean {
  return !!(name && IMG[name]);
}
