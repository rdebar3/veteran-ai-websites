import type { DemoSiteRow, DemoViewKind } from './types';

export function isPreviewFlag(
  preview: string | string[] | undefined,
): boolean {
  const value = Array.isArray(preview) ? preview[0] : preview;
  return value === '1';
}

export function isExpiredAt(
  expiresAt: string | null | undefined,
  now: Date,
): boolean {
  if (!expiresAt) return false;
  const t = Date.parse(expiresAt);
  if (!Number.isFinite(t)) return false;
  return t <= now.getTime();
}

/**
 * Spec §5:
 * live + unexpired → render
 * draft → render only with ?preview=1, else 404
 * expired (status or past expires_at on live) → expired page
 * unknown / killed → 404
 *
 * Draft + preview still renders even if expires_at is past (review card).
 */
export function resolveDemoView(
  site: DemoSiteRow | null,
  opts: { preview: boolean; now: Date },
): DemoViewKind {
  if (!site) return 'not_found';
  const status = site.status;
  if (status === 'killed') return 'not_found';
  if (status === 'expired') return 'expired';
  if (status === 'draft') return opts.preview ? 'render' : 'not_found';
  if (status === 'live') {
    if (isExpiredAt(site.expires_at, opts.now)) return 'expired';
    return 'render';
  }
  return 'not_found';
}

export function demoHttpStatus(kind: DemoViewKind): 200 | 404 {
  return kind === 'not_found' ? 404 : 200;
}
