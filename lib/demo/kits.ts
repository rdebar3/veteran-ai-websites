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
  displayFont:
    '"Barlow Condensed","Oswald","Roboto Condensed","Arial Narrow","DejaVu Sans Condensed",sans-serif',
  bodyFont: '"Barlow","Segoe UI",system-ui,sans-serif',
  kickerWord: 'AUTO',
};

const KITS: Record<string, IdentityKit> = {
  auto: AUTO_KIT,
};

export function kitFor(_trade: string): IdentityKit {
  return KITS[_trade] ?? AUTO_KIT;
}
