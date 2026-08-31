import { DEMO_STORAGE_BUCKET } from './copy';
import { recordDemoShotLoad } from './shot-loads';
import {
  getDemoSiteBySlug,
  supabaseBaseUrl,
  supabaseServiceKey,
} from './supabase';
import type { DemoSiteRow } from './types';

export const DEMO_SHOT_CACHE_CONTROL = 'public, max-age=600';
export const DEMO_SHOT_CONTENT_TYPE = 'image/png';

export type DemoShotKind = 'serve' | 'gone';

export function resolveDemoShot(
  site: Pick<DemoSiteRow, 'status' | 'screenshot_path'> | null,
  opts: { preview: boolean },
): DemoShotKind {
  if (!site) return 'gone';
  const status = site.status;
  if (status === 'killed' || status === 'expired') return 'gone';
  if (status === 'draft') {
    if (!opts.preview) return 'gone';
  } else if (status !== 'live') {
    return 'gone';
  }
  if (!isSafeScreenshotPath(site.screenshot_path)) return 'gone';
  return 'serve';
}

export function isSafeScreenshotPath(
  path: string | null | undefined,
): path is string {
  if (!path) return false;
  if (path.length > 200) return false;
  if (path.includes('..') || path.includes('\\') || path.includes(':')) {
    return false;
  }
  const prefix = `${DEMO_STORAGE_BUCKET}/`;
  if (!path.startsWith(prefix) || !path.endsWith('.png')) return false;
  const rest = path.slice(prefix.length);
  return rest.length > 0 && !rest.includes('/');
}

export function demoShotGone(): Response {
  return new Response(null, { status: 410 });
}

export function demoShotPng(body: ArrayBuffer): Response {
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': DEMO_SHOT_CONTENT_TYPE,
      'Cache-Control': DEMO_SHOT_CACHE_CONTROL,
    },
  });
}

async function fetchDemoShotPng(
  screenshotPath: string,
): Promise<ArrayBuffer | null> {
  const base = supabaseBaseUrl();
  const key = supabaseServiceKey();
  if (!base || !key) return null;
  if (!isSafeScreenshotPath(screenshotPath)) return null;

  const objectPath = screenshotPath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  const res = await fetch(`${base}/storage/v1/object/${objectPath}`, {
    method: 'GET',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: 'image/png',
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    console.error('[demo] screenshot download failed', res.status);
    return null;
  }
  return res.arrayBuffer();
}

/**
 * Public PNG serve. Status: live → serve; draft only with ?preview=1;
 * killed / expired / missing → 410 empty. Sensor is fire-and-forget.
 */
export async function handleDemoShotRequest(input: {
  slug: string;
  preview: boolean;
  userAgent?: string | null;
  defer?: (work: () => Promise<void>) => void;
}): Promise<Response> {
  const site = await getDemoSiteBySlug(input.slug);
  if (resolveDemoShot(site, { preview: input.preview }) !== 'serve' || !site) {
    return demoShotGone();
  }

  const screenshotPath = site.screenshot_path;
  if (!isSafeScreenshotPath(screenshotPath)) return demoShotGone();

  const png = await fetchDemoShotPng(screenshotPath);
  if (!png) return demoShotGone();

  const defer =
    input.defer ||
    ((work: () => Promise<void>) => {
      void work();
    });
  defer(() =>
    recordDemoShotLoad({
      slug: site.slug,
      userAgent: input.userAgent,
    }),
  );

  return demoShotPng(png);
}
