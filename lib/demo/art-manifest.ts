export const ART_POOL_TRADE_RE = /^[a-z][a-z0-9_]{1,30}$/;
export const ART_POOL_FILE_RE = /^[a-z0-9][a-z0-9._-]*\.(jpg|jpeg|png)$/i;
export const ART_POOL_MAX_SHOTS = 24;
export const ART_POOL_MAX_BYTES = 8 * 1024 * 1024;

export type ArtManifestShot = {
  key: string;
  file: string;
  role: 'hero' | 'band';
  approved: boolean;
};

export type ArtManifest = {
  trade: string;
  shots: ArtManifestShot[];
};

export function jpegSize(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i < buf.length - 8) {
    if (buf[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = buf[i + 1];
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      return {
        height: buf.readUInt16BE(i + 5),
        width: buf.readUInt16BE(i + 7),
      };
    }
    const size = buf.readUInt16BE(i + 2);
    if (size < 2) break;
    i += 2 + size;
  }
  return null;
}

export function pngSize(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 24) return null;
  if (buf.toString('ascii', 1, 4) !== 'PNG') return null;
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
}

export function imageSize(buf: Buffer): { width: number; height: number } | null {
  return jpegSize(buf) || pngSize(buf);
}

export function validateManifest(
  raw: unknown,
  trade: string,
): { ok: true; manifest: ArtManifest } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, error: 'manifest is invalid' };
  }
  const rec = raw as Record<string, unknown>;
  if (rec.trade !== trade) {
    return { ok: false, error: 'manifest trade mismatch' };
  }
  if (!Array.isArray(rec.shots)) {
    return { ok: false, error: 'manifest shots is invalid' };
  }
  if (rec.shots.length > ART_POOL_MAX_SHOTS) {
    return { ok: false, error: 'manifest has too many shots' };
  }

  const shots: ArtManifestShot[] = [];
  const keys = new Set<string>();
  for (const item of rec.shots) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return { ok: false, error: 'manifest shot is invalid' };
    }
    const shot = item as Record<string, unknown>;
    if (typeof shot.key !== 'string' || !shot.key.trim()) {
      return { ok: false, error: 'manifest shot key is invalid' };
    }
    if (keys.has(shot.key)) {
      return { ok: false, error: 'manifest shot keys are not unique' };
    }
    if (typeof shot.file !== 'string' || !ART_POOL_FILE_RE.test(shot.file)) {
      return { ok: false, error: 'manifest shot file is invalid' };
    }
    if (shot.file.includes('/') || shot.file.includes('\\')) {
      return { ok: false, error: 'manifest shot file is invalid' };
    }
    if (shot.role !== 'hero' && shot.role !== 'band') {
      return { ok: false, error: 'manifest shot role is invalid' };
    }
    if (typeof shot.approved !== 'boolean') {
      return { ok: false, error: 'manifest shot approved is invalid' };
    }
    keys.add(shot.key);
    shots.push({
      key: shot.key,
      file: shot.file,
      role: shot.role,
      approved: shot.approved,
    });
  }

  return { ok: true, manifest: { trade, shots } };
}
