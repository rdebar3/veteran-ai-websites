/**
 * Upload docs/art-pool/<trade>/ to the demo-art bucket and upsert demo_art.
 * Runs on the owner's machine — keys never leave it. Idempotent.
 *
 * Usage: npm run art:upload -- auto
 */
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { imageSize, validateManifest } from '../lib/demo/art-manifest';

function env(name: string): string {
  const value = process.env[name]?.trim() || '';
  if (!value) {
    throw new Error(`Missing ${name} in the local environment`);
  }
  return value;
}

function supabaseBase(): string {
  const raw =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  if (!raw) throw new Error('Missing SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL');
  return raw.replace(/\/$/, '').replace(/\/rest\/v1\/?$/, '');
}

function pad(value: string, width: number): string {
  return value.length >= width ? value : value + ' '.repeat(width - value.length);
}

async function main(): Promise<void> {
  const trade = (process.argv[2] || '').trim().toLowerCase();
  if (!trade || trade.startsWith('-')) {
    console.error('Usage: npm run art:upload -- <trade>');
    console.error('Example: npm run art:upload -- auto');
    process.exit(1);
  }

  const base = supabaseBase();
  const key = env('SUPABASE_SERVICE_ROLE_KEY');
  const folder = path.resolve(process.cwd(), 'docs', 'art-pool', trade);
  const manifestPath = path.join(folder, 'manifest.json');
  const raw = await readFile(manifestPath, 'utf8');
  const parsed = validateManifest(JSON.parse(raw) as unknown, trade);
  if (!parsed.ok) {
    throw new Error(parsed.error);
  }
  const manifest = parsed.manifest;
  if (manifest.shots.length === 0) {
    throw new Error('manifest.json has no shots');
  }

  const rows: string[] = [];
  rows.push(
    [
      pad('key', 22),
      pad('role', 6),
      pad('approved', 9),
      pad('bytes', 10),
      pad('size', 12),
      'result',
    ].join(' '),
  );

  for (const shot of manifest.shots) {
    const filePath = path.join(folder, shot.file);
    await stat(filePath);
    const buf = await readFile(filePath);
    const size = imageSize(buf) ?? { width: 0, height: 0 };
    const { width, height } = size;
    const objectPath = `${trade}/${shot.file}`;
    const contentType = shot.file.toLowerCase().endsWith('.png')
      ? 'image/png'
      : 'image/jpeg';

    const upload = await fetch(
      `${base}/storage/v1/object/demo-art/${objectPath}`,
      {
        method: 'POST',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': contentType,
          'x-upsert': 'true',
        },
        body: buf,
      },
    );
    if (!upload.ok) {
      const errText = await upload.text().catch(() => '');
      throw new Error(
        `storage upload failed for ${objectPath}: ${upload.status} ${errText}`,
      );
    }

    const upsert = await fetch(
      `${base}/rest/v1/demo_art?on_conflict=trade,shot_key`,
      {
        method: 'POST',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify({
          trade,
          shot_key: shot.key,
          role: shot.role,
          path: objectPath,
          width,
          height,
          approved: shot.approved === true,
        }),
      },
    );
    if (!upsert.ok) {
      const errText = await upsert.text().catch(() => '');
      throw new Error(
        `demo_art upsert failed for ${shot.key}: ${upsert.status} ${errText}`,
      );
    }

    rows.push(
      [
        pad(shot.key, 22),
        pad(shot.role, 6),
        pad(String(shot.approved === true), 9),
        pad(String(buf.length), 10),
        pad(`${width}x${height}`, 12),
        'uploaded + upserted',
      ].join(' '),
    );
  }

  console.log(`art pool · ${trade} · ${manifest.shots.length} shots`);
  console.log(rows.join('\n'));
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
