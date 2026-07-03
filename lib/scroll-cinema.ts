/** Progress 0→1 as the user scrolls through a tall track (sticky section). */
export function getTrackProgress(track: HTMLElement): number {
  const rect = track.getBoundingClientRect();
  const scrollable = track.offsetHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  const scrolled = -rect.top;
  return Math.min(1, Math.max(0, scrolled / scrollable));
}

/** Local progress within one panel segment (0→1 while that panel is active). */
export function getPanelLocalProgress(global: number, index: number, total: number): number {
  const segment = 1 / total;
  const local = (global - index * segment) / segment;
  return Math.min(1, Math.max(0, local));
}

/** Smooth crossfade opacity for panel `index` at global progress `p`. */
export function getPanelOpacity(p: number, index: number, total: number): number {
  const segment = 1 / total;
  const start = index * segment;
  const end = (index + 1) * segment;
  const fade = segment * 0.18;

  if (p <= start - fade) return 0;
  if (p <= start + fade) return smoothstep((p - (start - fade)) / (2 * fade));
  if (p <= end - fade) return 1;
  if (p <= end + fade) return 1 - smoothstep((p - (end - fade)) / (2 * fade));
  return 0;
}

/** Eased progress for caption child reveals within a panel. */
export function getCaptionChildProgress(
  local: number,
  delay: number,
  duration = 0.55
): number {
  const start = delay;
  const t = (local - start) / duration;
  return smoothstep(Math.min(1, Math.max(0, t)));
}

/** Element visibility 0→1 as it enters the viewport (for interludes, cards). */
export function getViewProgress(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const start = vh * 0.92;
  const end = vh * 0.25;
  const t = (start - rect.top) / (start - end);
  return smoothstep(Math.min(1, Math.max(0, t)));
}

function smoothstep(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}