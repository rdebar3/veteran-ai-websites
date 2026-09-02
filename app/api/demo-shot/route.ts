import { NextRequest, NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { screenshotStoragePath } from '@/lib/demo/copy';
import { cronAuthorized } from '@/lib/demo/cron-auth';
import {
  DEMO_SHOT_SETTLE_SCRIPT,
  DEMO_SHOT_VIEWPORT_WIDTH,
  demoShotPageUrl,
  demoShotRowPatch,
  parseShotSlug,
} from '@/lib/demo/shot';
import {
  getDemoSiteBySlug,
  supabaseBaseUrl,
  supabaseServiceKey,
} from '@/lib/demo/supabase';

export const runtime = 'nodejs';
export const maxDuration = 60;

function unauthorized(): NextResponse {
  return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
}

async function handle(req: NextRequest): Promise<NextResponse> {
  if (
    !cronAuthorized(
      req.headers.get('x-cron-secret'),
      req.headers.get('authorization'),
      process.env.CRON_SECRET,
    )
  ) {
    return unauthorized();
  }

  let bodySlug: unknown;
  if (req.method === 'POST') {
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = (await req.json().catch(() => null)) as { slug?: unknown } | null;
      bodySlug = body?.slug;
    }
  }

  const slug = parseShotSlug({
    searchParams: req.nextUrl.searchParams,
    bodySlug,
  });
  if (!slug) {
    return NextResponse.json({ ok: false, error: 'slug is required' }, { status: 400 });
  }

  const site = await getDemoSiteBySlug(slug);
  if (!site) {
    return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 });
  }

  const base = supabaseBaseUrl();
  const key = supabaseServiceKey();
  if (!base || !key) {
    return NextResponse.json(
      { ok: false, error: 'screenshot service is not configured' },
      { status: 503 },
    );
  }

  let png: Uint8Array;
  try {
    png = await renderDemoPng(demoShotPageUrl(slug));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (isChromiumBundleError(message)) {
      console.error('[demo-shot] chromium bundle limit:', message);
      return NextResponse.json(
        {
          ok: false,
          error: 'chromium_bundle_limit',
          message:
            '@sparticuz/chromium exceeded the serverless bundle limit. No renderer substitution. Report this constraint.',
        },
        { status: 501 },
      );
    }
    console.error('[demo-shot] render failed:', message);
    return NextResponse.json(
      { ok: false, error: 'render_failed', message },
      { status: 502 },
    );
  }

  const objectPath = screenshotStoragePath(slug);
  const upload = await fetch(`${base}/storage/v1/object/${objectPath}`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'image/png',
      'x-upsert': 'true',
    },
    body: Buffer.from(png),
  });

  if (!upload.ok) {
    const errText = await upload.text().catch(() => '');
    console.error('[demo-shot] storage upload failed:', upload.status, errText);
    return NextResponse.json(
      { ok: false, error: 'storage_upload_failed', status: upload.status },
      { status: 502 },
    );
  }

  // Spec §6: the only demo_sites write from this app is screenshot_path.
  const patch = demoShotRowPatch(slug);
  const write = await fetch(
    `${base}/rest/v1/demo_sites?slug=eq.${encodeURIComponent(slug)}`,
    {
      method: 'PATCH',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(patch),
    },
  );

  if (!write.ok) {
    const errText = await write.text().catch(() => '');
    console.error('[demo-shot] screenshot_path write failed:', write.status, errText);
    return NextResponse.json(
      {
        ok: false,
        error: 'screenshot_path_write_failed',
        screenshot_path: objectPath,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    slug,
    screenshot_path: objectPath,
  });
}

function isChromiumBundleError(message: string): boolean {
  return /FUNCTION_PAYLOAD_TOO_LARGE|exceeded the maximum size|uncompressed maximum|Cannot find module ['"]@sparticuz\/chromium['"]/i.test(
    message,
  );
}

async function renderDemoPng(url: string): Promise<Uint8Array> {
  chromium.setGraphicsMode = false;
  const executablePath = await chromium.executablePath();
  if (!executablePath) {
    throw new Error(
      'Cannot find module @sparticuz/chromium: executablePath() returned empty',
    );
  }

  const browser = await puppeteer.launch({
    args: await puppeteer.defaultArgs({
      args: chromium.args,
      headless: 'shell',
    }),
    defaultViewport: {
      width: DEMO_SHOT_VIEWPORT_WIDTH,
      height: 768,
      deviceScaleFactor: 1,
    },
    executablePath,
    headless: 'shell',
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: DEMO_SHOT_VIEWPORT_WIDTH,
      height: 768,
      deviceScaleFactor: 1,
    });
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ]);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 20000 });
    await page.evaluate(async () => {
      const images = Array.from(document.images);
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise<void>((resolve) => {
            img.addEventListener('load', () => resolve(), { once: true });
            img.addEventListener('error', () => resolve(), { once: true });
          });
        }),
      );
    });
    await page.evaluate(DEMO_SHOT_SETTLE_SCRIPT);
    await new Promise((r) => setTimeout(r, 250));
    const buf = await page.screenshot({ type: 'png', fullPage: true });
    return buf;
  } finally {
    await browser.close().catch(() => undefined);
  }
}

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}
