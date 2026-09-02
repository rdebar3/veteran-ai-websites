import { describe, expect, it } from 'vitest';
import { AUTO_KIT, buttonInkFor, kitFor } from './kits';

describe('kitFor', () => {
  it('returns the towing accent and falls back to AUTO', () => {
    expect(kitFor('towing').accent).toBe('#ef4444');
    expect(kitFor('nonsense')).toBe(AUTO_KIT);
  });
});

describe('buttonInkFor', () => {
  it('uses dark ink on light accents and white on dark ones', () => {
    expect(buttonInkFor('#ffd22e')).toBe('#141008');
    expect(buttonInkFor('#4f8bff')).toBe('#ffffff');
  });
});
