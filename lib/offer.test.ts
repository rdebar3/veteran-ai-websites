import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { briefingChapters } from './briefing-deck';
import { showcaseDemos } from './cinematic';
import {
  KEEP_RUNNING_MONTHLY,
  PAY_ONCE_LINE,
  addOnsList,
  allPackagesInclude,
  payOnce,
  pricingTiers,
} from './data';
import { heroScenes } from './hero-scenes';

describe('monthly offer', () => {
  it('prices the three plans at $49, $79, and $99', () => {
    expect(pricingTiers.map((tier) => [tier.name, tier.price, Boolean(tier.popular)])).toEqual([
      ['Starter', 49, false],
      ['Complete', 79, true],
      ['Premium', 99, false],
    ]);
    expect(payOnce).toEqual({ Starter: 497, Complete: 797, Premium: 997 });
    expect(KEEP_RUNNING_MONTHLY).toBe(29);
    expect(PAY_ONCE_LINE).toBe(
      'Rather pay once and own it today? Starter $497 · Complete $797 · Premium $997.'
    );
  });

  it('lists what every plan includes and keeps only the store add-on', () => {
    expect(allPackagesInclude).toEqual([
      'Nothing down — your first payment is month one',
      'Hosting, updates and small changes included',
      'No contract — cancel anytime',
      'After 12 payments the site is yours to keep',
      '100% mobile-first',
    ]);
    expect(addOnsList.map((addon) => [addon.name, addon.price])).toEqual([['Shoppable Store', 497]]);
  });

  it('states the briefing pricing line and names the starter demo Summit Plumbing', () => {
    const pricing = briefingChapters.find((chapter) => chapter.id === 'pricing');
    expect(pricing?.body).toBe(
      'Nothing down. $49 · $79 · $99 a month. No contract. Yours after a year.'
    );
    expect(showcaseDemos[0].landmark).toBe('Summit Plumbing');
    expect(showcaseDemos[0].imageAlt).toBe(
      'Summit Plumbing demo — professional plumber at work'
    );
  });
});

describe('hero scenes', () => {
  it('plays two scenes and a shorter scroll', () => {
    expect(heroScenes).toEqual([
      {
        title: 'More calls for your business. Built in a day.',
        sub: 'West Virginia veteran-owned. Nothing down, $49 a month.',
      },
      {
        title: 'Pick a time. I’ll call you.',
        cta: true,
      },
    ]);

    const source = readFileSync(
      path.join(process.cwd(), 'components', 'VideoHero.tsx'),
      'utf8'
    );
    expect(source).toContain('height:200vh');
    expect(source).toContain('height:160vh');
    expect(source).not.toContain('340vh');
    expect(source).not.toContain('260vh');
    expect(source).toContain('heroScenes');
    expect(source).not.toContain('You own it. Always.');
  });
});
