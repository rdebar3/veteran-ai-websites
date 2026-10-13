import { describe, expect, it } from 'vitest';
import { navLinks, navLinksFor } from './navigation';

describe('navLinksFor', () => {
  it('starts with Demos, Pricing, and Veterans', () => {
    for (const links of [navLinksFor(false), navLinksFor(true)]) {
      expect(links.slice(0, 3).map((link) => link.label)).toEqual(['Demos', 'Pricing', 'Veterans']);
      expect(links.slice(0, 3).map((link) => link.href)).toEqual(['#examples', '#pricing', '#veterans']);
    }
  });

  it('hides Reviews and ends on Let\'s talk when none are approved', () => {
    const links = navLinksFor(false);
    expect(links.some((link) => link.label === 'Reviews' || link.href === '#reviews')).toBe(false);
    expect(links.at(-1)).toEqual({ label: "Let's talk", href: '#contact' });
  });

  it('puts Reviews immediately before Let\'s talk when one is approved', () => {
    const links = navLinksFor(true);
    expect(links.at(-2)).toEqual({ label: 'Reviews', href: '#reviews' });
    expect(links.at(-1)).toEqual({ label: "Let's talk", href: '#contact' });
  });

  it('keeps navLinks equal to the no-review list', () => {
    expect(navLinks).toBe(navLinksFor(false));
    expect(navLinks).toEqual(navLinksFor(false));
  });
});
