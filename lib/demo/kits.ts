/**
 * Identity kits — data, not code. Colors and fonts the template reads.
 * More kits later are data edits; unknown trades fall through to auto.
 */

export type IdentityKit = {
  ground: string;
  panel: string;
  panel2: string;
  line: string;
  ink: string;
  muted: string;
  dim: string;
  accent: string;
  accent2: string;
  steel: string;
  displayFont: string;
  bodyFont: string;
  kickerWord: string;
};

const DISPLAY_FONT =
  '"Barlow Condensed","Oswald","Roboto Condensed","Arial Narrow","DejaVu Sans Condensed",sans-serif';
const BODY_FONT = '"Barlow","Segoe UI",system-ui,sans-serif';

const FONTS = {
  displayFont: DISPLAY_FONT,
  bodyFont: BODY_FONT,
} as const;

/** AUTO kit — exact :root tokens from docs/trades-v2-auto-mock-v4.html. */
export const AUTO_KIT: IdentityKit = {
  ground: '#0f1216',
  panel: '#171b21',
  panel2: '#1f242c',
  line: '#2a3039',
  ink: '#f2eee6',
  muted: '#aab2bd',
  dim: '#6b7480',
  accent: '#f5a524',
  accent2: '#e08a00',
  steel: '#8fa3b8',
  ...FONTS,
  kickerWord: 'AUTO',
};

const ELECTRICAL_KIT: IdentityKit = {
  ground: '#0f1113',
  panel: '#17191c',
  panel2: '#1e2125',
  line: '#2a2e33',
  ink: '#f4f1ea',
  muted: '#adb3ba',
  dim: '#6d737a',
  accent: '#ffd22e',
  accent2: '#e6b800',
  steel: '#8fa3b8',
  ...FONTS,
  kickerWord: 'ELECTRICAL',
};

const TOWING_KIT: IdentityKit = {
  ground: '#13100f',
  panel: '#1b1716',
  panel2: '#231e1c',
  line: '#2f2825',
  ink: '#f4efe9',
  muted: '#b3aaa4',
  dim: '#75695f',
  accent: '#ef4444',
  accent2: '#c92f2f',
  steel: '#a89f96',
  ...FONTS,
  kickerWord: 'TOWING',
};

const ROOFING_KIT: IdentityKit = {
  ground: '#121110',
  panel: '#1a1917',
  panel2: '#22201d',
  line: '#2e2b27',
  ink: '#f3efe8',
  muted: '#b0aaa1',
  dim: '#726b62',
  accent: '#d9822b',
  accent2: '#b5651d',
  steel: '#9aa3a8',
  ...FONTS,
  kickerWord: 'ROOFING',
};

const PLUMBING_KIT: IdentityKit = {
  ground: '#0e1318',
  panel: '#151b21',
  panel2: '#1c232a',
  line: '#273038',
  ink: '#eef2f5',
  muted: '#a7b2bd',
  dim: '#66737f',
  accent: '#2ec4d6',
  accent2: '#1aa3b4',
  steel: '#8fa3b8',
  ...FONTS,
  kickerWord: 'PLUMBING',
};

const HVAC_KIT: IdentityKit = {
  ground: '#0f1214',
  panel: '#171b1e',
  panel2: '#1e2327',
  line: '#2a3035',
  ink: '#f2f0ea',
  muted: '#abb2b9',
  dim: '#6b737b',
  accent: '#ff8c42',
  accent2: '#e0702a',
  steel: '#62c6d6',
  ...FONTS,
  kickerWord: 'HEATING & COOLING',
};

const GENERAL_CONTRACTOR_KIT: IdentityKit = {
  ground: '#101214',
  panel: '#181b1e',
  panel2: '#1f2327',
  line: '#2b3036',
  ink: '#f2efe8',
  muted: '#acb2b8',
  dim: '#6c737a',
  accent: '#4f8bff',
  accent2: '#2f6fe0',
  steel: '#9bb0c4',
  ...FONTS,
  kickerWord: 'CONTRACTOR',
};

const KITS: Record<string, IdentityKit> = {
  auto: AUTO_KIT,
  electrical: ELECTRICAL_KIT,
  towing: TOWING_KIT,
  roofing: ROOFING_KIT,
  plumbing: PLUMBING_KIT,
  hvac: HVAC_KIT,
  general_contractor: GENERAL_CONTRACTOR_KIT,
};

export function kitFor(trade: string): IdentityKit {
  return KITS[trade] ?? AUTO_KIT;
}

function channelLinear(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Dark ink on light accents, white on dark ones — relative luminance. */
export function buttonInkFor(accent: string): string {
  const hex = accent.trim().replace('#', '');
  if (hex.length !== 6) return '#141008';
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  if (![r, g, b].every((n) => Number.isFinite(n))) return '#141008';
  const lum =
    0.2126 * channelLinear(r) +
    0.7152 * channelLinear(g) +
    0.0722 * channelLinear(b);
  return lum >= 0.35 ? '#141008' : '#ffffff';
}
