import { cronAuthorized } from '@/lib/demo/cron-auth';
import {
  ART_POOL_MAX_BYTES,
  ART_POOL_TRADE_RE,
  imageSize,
  validateManifest,
} from '@/lib/demo/art-manifest';
import { DEMO_ART_BUCKET } from '@/lib/demo/art';
import { supabaseBaseUrl, supabaseServiceKey } from '@/lib/demo/supabase';

export const runtime = 'nodejs';
export const maxDuration = 60;

const RAW_BASE =
  'https://raw.githubusercontent.com/rdebar3/veteran-ai-websites/main/docs/art-pool';

function githubHeaders(accept: string): HeadersInit {
  const headers: Record<string, string> = { Accept: accept };
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function jsonError(status: number, error: string): Response {
  return Response.json({ ok: false, error }, { status });
}

export async function POST(request: Request): Promise<Response> {
  if (
    !cronAuthorized(
      request.headers.get('x-cron-secret'),
      request.headers.get('authorization'),
      process.env.CRON_SECRET,
    )
  ) {
    return jsonError(401, 'unauthorized');
  }

  let body: { trade?: unknown };
  try {
    body = (await request.json()) as { trade?: unknown };
  } catch {
    return jsonError(400, 'invalid body');
  }

  const trade = typeof body.trade === 'string' ? body.trade.trim() : '';
  if (!ART_POOL_TRADE_RE.test(trade)) {
    return jsonError(400, 'invalid trade');
  }

  const base = supabaseBaseUrl();
  const serviceKey = supabaseServiceKey();
  if (!base || !serviceKey) {
    return jsonError(502, 'art pool is not configured');
  }

  let manifestRes: Response;
  try {
    manifestRes = await fetch(`${RAW_BASE}/${trade}/manifest.json`, {
      headers: githubHeaders('application/json'),
      cache: 'no-store',
    });
  } catch {
    return jsonError(502, 'manifest fetch failed');
  }
  if (!manifestRes.ok) {
    return jsonError(502, 'manifest fetch failed');
  }

  let rawManifest: unknown;
  try {
    rawManifest = await manifestRes.json();
  } catch {
    return jsonError(400, 'manifest is invalid');
  }

  const parsed = validateManifest(rawManifest, trade);
  if (!parsed.ok) {
    return jsonError(400, parsed.error);
  }

  const uploaded: Array<{
    key: string;
    file: string;
    bytes: number;
    width: number;
    height: number;
    approved: boolean;
  }> = [];

  for (const shot of parsed.manifest.shots) {
    let fileRes: Response;
    try {
      fileRes = await fetch(`${RAW_BASE}/${trade}/${shot.file}`, {
        headers: githubHeaders('*/*'),
        cache: 'no-store',
      });
    } catch {
      return jsonError(502, 'file fetch failed');
    }
    if (!fileRes.ok) {
      return jsonError(502, 'file fetch failed');
    }

    const buf = Buffer.from(await fileRes.arrayBuffer());
    if (buf.length > ART_POOL_MAX_BYTES) {
      return jsonError(400, 'file too large');
    }
    const size = imageSize(buf);
    if (!size) {
      return jsonError(400, 'file is not a jpeg or png');
    }

    const objectPath = `${trade}/${shot.file}`;
    const contentType = shot.file.toLowerCase().endsWith('.png')
      ? 'image/png'
      : 'image/jpeg';

    const upload = await fetch(
      `${base}/storage/v1/object/${DEMO_ART_BUCKET}/${objectPath}`,
      {
        method: 'POST',
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': contentType,
          'x-upsert': 'true',
          'Cache-Control': 'public, max-age=31536000',
        },
        body: buf,
      },
    );
    if (!upload.ok) {
      return jsonError(502, 'storage upload failed');
    }

    const upsert = await fetch(
      `${base}/rest/v1/demo_art?on_conflict=trade,shot_key`,
      {
        method: 'POST',
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify({
          trade,
          shot_key: shot.key,
          role: shot.role,
          path: objectPath,
          width: size.width,
          height: size.height,
          approved: shot.approved === true,
        }),
      },
    );
    if (!upsert.ok) {
      return jsonError(502, 'demo_art upsert failed');
    }

    uploaded.push({
      key: shot.key,
      file: shot.file,
      bytes: buf.length,
      width: size.width,
      height: size.height,
      approved: shot.approved === true,
    });
  }

  const existingRes = await fetch(
    `${base}/rest/v1/demo_art?trade=eq.${encodeURIComponent(trade)}&select=shot_key`,
    {
      method: 'GET',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    },
  );
  if (!existingRes.ok) {
    return jsonError(502, 'demo_art lookup failed');
  }

  const existing = (await existingRes.json()) as Array<{ shot_key?: string }>;
  const keep = new Set(parsed.manifest.shots.map((s) => s.key));
  const retired: string[] = [];
  for (const row of existing) {
    if (typeof row.shot_key !== 'string' || keep.has(row.shot_key)) continue;
    const patch = await fetch(
      `${base}/rest/v1/demo_art?trade=eq.${encodeURIComponent(trade)}` +
        `&shot_key=eq.${encodeURIComponent(row.shot_key)}`,
      {
        method: 'PATCH',
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ approved: false }),
      },
    );
    if (!patch.ok) {
      return jsonError(502, 'demo_art retire failed');
    }
    retired.push(row.shot_key);
  }

  return Response.json({
    ok: true,
    trade,
    uploaded,
    retired,
  });
}
