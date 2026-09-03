import { describe, expect, it } from 'vitest';
import {
  eligibleKickerFormulas,
  kickerFormulasFor,
  layoutVariantFor,
  pickKicker,
  proofCardVisible,
  screenshotTopStoragePath,
  skinFor,
  slugSeed,
} from './copy';

describe('skinFor', () => {
  it('maps known categories and falls back to ember', () => {
    expect(skinFor('roofing_contractor')).toBe('ember');
    expect(skinFor('HVAC')).toBe('summit');
    expect(skinFor('hvac_contractor')).toBe('summit');
    expect(skinFor('electrician')).toBe('storm');
    expect(skinFor('towing_service')).toBe('storm');
    expect(skinFor('auto_repair')).toBe('storm');
    expect(skinFor(undefined)).toBe('ember');
    expect(skinFor('weird')).toBe('ember');
  });
});

describe('layout variants', () => {
  it('is deterministic per slug and differs across the sample set', () => {
    const a = layoutVariantFor('mjs-towing');
    const a2 = layoutVariantFor('mjs-towing');
    expect(a).toEqual(a2);

    const b = layoutVariantFor('eclipse-construction');
    const c = layoutVariantFor('tygart-electric');
    const same =
      a.heroAlign === b.heroAlign &&
      a.watermark === b.watermark &&
      a.gridStyle === b.gridStyle &&
      b.heroAlign === c.heroAlign &&
      b.watermark === c.watermark &&
      b.gridStyle === c.gridStyle;
    expect(same).toBe(false);
  });
});

describe('kicker rotation', () => {
  it('is stable per slug and drops {town} formulas when town is absent', () => {
    const seed = slugSeed('eclipse-construction');
    const withTown = pickKicker({
      category: 'roofing',
      town: 'Morgantown',
      seed,
    });
    const again = pickKicker({
      category: 'roofing',
      town: 'Morgantown',
      seed,
    });
    expect(withTown).toBe(again);
    expect(withTown).toBe('Over your head. Under control.');

    const noTownFormulas = eligibleKickerFormulas(
      kickerFormulasFor('roofing'),
      undefined,
    );
    expect(noTownFormulas.every((f) => !f.includes('{town}'))).toBe(true);
    const noTown = pickKicker({ category: 'roofing', seed });
    expect(noTown.includes('{town}')).toBe(false);
    expect(noTown.includes('Roofing for  weather')).toBe(false);
  });
});

describe('proof card threshold', () => {
  it('shows at 4.0, hides at 3.9 and when missing', () => {
    expect(proofCardVisible(3.9)).toBe(false);
    expect(proofCardVisible(4.0)).toBe(true);
    expect(proofCardVisible(undefined)).toBe(false);
    expect(proofCardVisible(null)).toBe(false);
  });
});

describe('screenshotTopStoragePath', () => {
  it("stores the first-screen clip next to the full PNG", () => {
    expect(screenshotTopStoragePath('cove-run-customs')).toBe(
      'demo-screenshots/cove-run-customs-top.png',
    );
  });
});
