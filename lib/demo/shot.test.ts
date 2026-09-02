import { describe, expect, it } from 'vitest';
import {
  DEMO_SHOT_SETTLE_SCRIPT,
  demoShotPageUrl,
  parseShotSlug,
} from './shot';

describe('DEMO_SHOT_SETTLE_SCRIPT', () => {
  it("mentions '.rv', adds 'in', and awaits document.fonts.ready", () => {
    expect(DEMO_SHOT_SETTLE_SCRIPT).toContain('.rv');
    expect(DEMO_SHOT_SETTLE_SCRIPT).toContain("classList.add('in')");
    expect(DEMO_SHOT_SETTLE_SCRIPT).toContain('document.fonts.ready');
    expect(DEMO_SHOT_SETTLE_SCRIPT).toContain('await document.fonts.ready');
  });
});

describe('demoShotPageUrl', () => {
  it("ends with '/d/cove-run-customs?preview=1'", () => {
    expect(demoShotPageUrl('cove-run-customs').endsWith('/d/cove-run-customs?preview=1')).toBe(
      true,
    );
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
