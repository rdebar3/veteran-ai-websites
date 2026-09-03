import { describe, expect, it } from 'vitest';
import {
  DEMO_SHOT_SETTLE_SCRIPT,
  demoShotPageUrl,
  demoShotTopClip,
  parseShotSlug,
} from './shot';

describe('DEMO_SHOT_SETTLE_SCRIPT', () => {
  it("mentions '.rv', adds 'in', and awaits document.fonts.ready", () => {
    expect(DEMO_SHOT_SETTLE_SCRIPT).toContain('.rv');
    expect(DEMO_SHOT_SETTLE_SCRIPT).toContain("classList.add('in')");
    expect(DEMO_SHOT_SETTLE_SCRIPT).toContain('document.fonts.ready');
    expect(DEMO_SHOT_SETTLE_SCRIPT).toContain('await document.fonts.ready');
  });

  it("adds 'demo-shot' to the documentElement", () => {
    expect(DEMO_SHOT_SETTLE_SCRIPT).toContain(
      "document.documentElement.classList.add('demo-shot')",
    );
  });
});

describe('demoShotPageUrl', () => {
  it("ends with '/d/cove-run-customs?preview=1'", () => {
    expect(demoShotPageUrl('cove-run-customs').endsWith('/d/cove-run-customs?preview=1')).toBe(
      true,
    );
  });
});

describe('demoShotTopClip', () => {
  it('clips from the top to the strip bottom, else 820', () => {
    expect(demoShotTopClip(0)).toEqual({ x: 0, y: 0, width: 1024, height: 820 });
    expect(demoShotTopClip(400)).toEqual({
      x: 0,
      y: 0,
      width: 1024,
      height: 820,
    });
    expect(demoShotTopClip(512)).toEqual({
      x: 0,
      y: 0,
      width: 1024,
      height: 512,
    });
  });
});

describe('parseShotSlug', () => {
  it("rejects 'Cove Run' and accepts ' COVE-RUN-CUSTOMS ' as 'cove-run-customs'", () => {
    expect(
      parseShotSlug({
        searchParams: new URLSearchParams({ slug: 'Cove Run' }),
      }),
    ).toBeNull();
    expect(
      parseShotSlug({
        searchParams: new URLSearchParams(),
        bodySlug: 'Cove Run',
      }),
    ).toBeNull();
    expect(
      parseShotSlug({
        searchParams: new URLSearchParams({ slug: ' COVE-RUN-CUSTOMS ' }),
      }),
    ).toBe('cove-run-customs');
  });
});
