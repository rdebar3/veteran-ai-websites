/**
 * Honest stroke icons for Monti service cards.
 * Prefer no icon over a wrong one — never the old ◆ diamond.
 */
import type { ReactNode } from 'react';
import type { TradeKey } from '@/lib/monti/types';
import { TRADE_KEYS } from '@/lib/monti/types';

export type IconId =
  | 'wrench'
  | 'droplet'
  | 'flame'
  | 'zap'
  | 'home'
  | 'truck'
  | 'spray'
  | 'leaf'
  | 'shield'
  | 'clock'
  | 'mappin'
  | 'phone'
  | 'paw'
  | 'scissors'
  | 'sparkle';

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function Svg({
  children,
  label,
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      {children}
    </svg>
  );
}

const ICONS: Record<IconId, ReactNode> = {
  wrench: (
    <Svg>
      <path
        {...STROKE}
        d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-2.5 2.5-2.5z"
      />
    </Svg>
  ),
  droplet: (
    <Svg>
      <path {...STROKE} d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11z" />
    </Svg>
  ),
  flame: (
    <Svg>
      <path
        {...STROKE}
        d="M12 3c2 3 1 5 1 7 0 1.5-1 2.5-1 2.5S10 11 10 9.5C10 7 12 3 12 3z"
      />
      <path {...STROKE} d="M12 22a6 6 0 0 0 6-6c0-3-2.5-5-4-7-1.5 2-4 4-4 7a4 4 0 0 0 2 6z" />
    </Svg>
  ),
  zap: (
    <Svg>
      <path {...STROKE} d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
    </Svg>
  ),
  home: (
    <Svg>
      <path {...STROKE} d="M3 11.5 12 4l9 7.5" />
      <path {...STROKE} d="M6 10.5V20h12v-9.5" />
      <path {...STROKE} d="M10 20v-5h4v5" />
    </Svg>
  ),
  truck: (
    <Svg>
      <path {...STROKE} d="M1 16V8h11v8" />
      <path {...STROKE} d="M12 10h4l4 3v3h-8" />
      <circle {...STROKE} cx="6" cy="17" r="2" />
      <circle {...STROKE} cx="17" cy="17" r="2" />
      <path {...STROKE} d="M3 12h6" />
    </Svg>
  ),
  spray: (
    <Svg>
      <path {...STROKE} d="M8 10h5v10H8z" />
      <path {...STROKE} d="M10 10V6h2l2 2" />
      <path {...STROKE} d="M16 5l1.5-1.5M18 8h2M16 11l1.5 1.5" />
    </Svg>
  ),
  leaf: (
    <Svg>
      <path {...STROKE} d="M5 19c8 0 12-6 12-14-6 0-12 4-12 12z" />
      <path {...STROKE} d="M5 19c2-4 6-7 11-8" />
    </Svg>
  ),
  shield: (
    <Svg>
      <path {...STROKE} d="M12 3 5 6v5c0 5 3.5 8 7 10 3.5-2 7-5 7-10V6l-7-3z" />
    </Svg>
  ),
  clock: (
    <Svg>
      <circle {...STROKE} cx="12" cy="12" r="8" />
      <path {...STROKE} d="M12 8v5l3 2" />
    </Svg>
  ),
  mappin: (
    <Svg>
      <path
        {...STROKE}
        d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"
      />
      <circle {...STROKE} cx="12" cy="10" r="2.5" />
    </Svg>
  ),
  phone: (
    <Svg>
      <path
        {...STROKE}
        d="M6 3h3l2 5-2 1.5a12 12 0 0 0 5.5 5.5L16 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z"
      />
    </Svg>
  ),
  paw: (
    <Svg>
      <circle {...STROKE} cx="8" cy="9" r="1.75" />
      <circle {...STROKE} cx="16" cy="9" r="1.75" />
      <circle {...STROKE} cx="6.5" cy="13.5" r="1.5" />
      <circle {...STROKE} cx="17.5" cy="13.5" r="1.5" />
      <path
        {...STROKE}
        d="M9.5 17.5c0-1.5 1.2-2.5 2.5-2.5s2.5 1 2.5 2.5c0 1.8-1.2 3-2.5 3s-2.5-1.2-2.5-3z"
      />
    </Svg>
  ),
  scissors: (
    <Svg>
      <circle {...STROKE} cx="6" cy="6" r="2.5" />
      <circle {...STROKE} cx="6" cy="18" r="2.5" />
      <path {...STROKE} d="M8.2 7.5 20 18M8.2 16.5 20 6" />
    </Svg>
  ),
  sparkle: (
    <Svg>
      <path {...STROKE} d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path {...STROKE} d="M6.5 6.5 9 9M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5" />
    </Svg>
  ),
};

const TRADE_DEFAULT: Record<TradeKey, IconId | null> = {
  landscaping: 'leaf',
  plumbing: 'droplet',
  towing: 'truck',
  hvac: 'flame',
  electrical: 'zap',
  roofing: 'home',
  auto: 'wrench',
  cleaning: 'spray',
  /** General: never a trade glyph — prefer none. */
  general: null,
  pet_care: 'paw',
};

/** Icons allowed on general (unknown vertical) sites. */
const GENERAL_SAFE_ICONS = new Set<IconId>(['mappin', 'clock', 'shield', 'phone']);

const KEYWORDS: { re: RegExp; id: IconId }[] = [
  { re: /\b(tow|wrecker|hook|winch|roadside)\b/i, id: 'truck' },
  { re: /\b(drain|leak|pipe|plumb|water heater|sewer|faucet)\b/i, id: 'droplet' },
  { re: /\b(heat|furnace|boiler|flame)\b/i, id: 'flame' },
  { re: /\b(cool|ac\b|air condition|hvac)\b/i, id: 'flame' },
  { re: /\b(electr|wiring|panel|outlet|breaker)\b/i, id: 'zap' },
  { re: /\b(roof|shingle|gutter)\b/i, id: 'home' },
  { re: /\b(lawn|mow|landscap|garden|tree|mulch)\b/i, id: 'leaf' },
  { re: /\b(clean|maid|janitor|sanitize|carpet)\b/i, id: 'spray' },
  { re: /\b(brake|oil|engine|mechanic|auto|tire)\b/i, id: 'wrench' },
  { re: /\b(groom|nail|bath|brush|haircut|trim)\b/i, id: 'scissors' },
  { re: /\b(dog|cat|pet|board|kennel|sitter|walker|puppy)\b/i, id: 'paw' },
  { re: /\b(24\/7|emergency|after.?hours)\b/i, id: 'clock' },
  { re: /\b(warrant|insured|protect)\b/i, id: 'shield' },
  { re: /\b(special|spa|luxury|premium)\b/i, id: 'sparkle' },
];

function isTradeKey(name: string): name is TradeKey {
  return (TRADE_KEYS as readonly string[]).includes(name);
}

/** Resolve an icon for a service row. Returns null if no confident match. */
export function resolveServiceIcon(
  trade: string | null | undefined,
  title: string,
  description = '',
): IconId | null {
  const text = `${title} ${description}`.trim();
  const isGeneral = trade === 'general';

  for (const { re, id } of KEYWORDS) {
    if (!re.test(text)) continue;
    // General sites: only map-pin / clock / shield / phone — never a trade glyph.
    if (isGeneral) return GENERAL_SAFE_ICONS.has(id) ? id : null;
    return id;
  }
  if (trade && isTradeKey(trade)) return TRADE_DEFAULT[trade];
  // No diamond fallback — clean text card
  return null;
}

export function ServiceIcon({
  id,
  className,
}: {
  id: IconId;
  className?: string;
}) {
  return <span className={className ?? 'svc-ic'}>{ICONS[id]}</span>;
}
