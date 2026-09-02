import { describe, expect, it } from 'vitest';
import { jpegSize, pngSize, validateManifest } from './art-manifest';

const GOOD = {
  trade: 'auto',
  shots: [
    {
      key: '01-lift',
      file: '01-lift-portrait.jpg',
      role: 'hero',
      approved: true,
    },
    {
      key: '02-align',
      file: '02-alignment-rack-portrait.jpg',
      role: 'band',
      approved: false,
    },
  ],
};

describe('validateManifest', () => {
  it('accepts a good manifest', () => {
    const parsed = validateManifest(GOOD, 'auto');
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.manifest.shots).toHaveLength(2);
      expect(parsed.manifest.shots[0].key).toBe('01-lift');
    }
  });

  it('rejects a slashed filename', () => {
    const parsed = validateManifest(
      {
        trade: 'auto',
        shots: [
          {
            key: 'bad',
            file: 'auto/01-lift-portrait.jpg',
            role: 'hero',
            approved: true,
          },
        ],
      },
      'auto',
    );
    expect(parsed.ok).toBe(false);
  });

  it('rejects a mismatched trade', () => {
    const parsed = validateManifest(GOOD, 'towing');
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) expect(parsed.error).toBe('manifest trade mismatch');
  });

  it('rejects a 25th shot', () => {
    const shots = Array.from({ length: 25 }, (_, i) => ({
      key: `shot-${i}`,
      file: `shot-${i}.jpg`,
      role: i % 2 ? 'band' : 'hero',
      approved: true,
    }));
    const parsed = validateManifest({ trade: 'auto', shots }, 'auto');
    expect(parsed.ok).toBe(false);
  });

  it('rejects a bad role', () => {
    const parsed = validateManifest(
      {
        trade: 'auto',
        shots: [
          {
            key: '01-lift',
            file: '01-lift-portrait.jpg',
            role: 'thumb',
            approved: true,
          },
        ],
      },
      'auto',
    );
    expect(parsed.ok).toBe(false);
  });
});

describe('image sniffers', () => {
  it('reads JPEG and PNG dimensions from magic', () => {
    const jpeg = Buffer.from([
      0xff, 0xd8, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x20, 0x00, 0x40, 0x01,
      0x01, 0x11, 0x00,
    ]);
    expect(jpegSize(jpeg)).toEqual({ width: 64, height: 32 });

    const png = Buffer.alloc(24);
    png[0] = 0x89;
    png.write('PNG', 1, 'ascii');
    png.writeUInt32BE(80, 16);
    png.writeUInt32BE(40, 20);
    expect(pngSize(png)).toEqual({ width: 80, height: 40 });
  });
});
