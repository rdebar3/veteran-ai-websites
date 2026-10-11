import { describe, expect, it } from 'vitest';
import { DEMO_NOINDEX_HEADERS } from './demo/headers';
import { bookHref } from '../components/ScheduleCall';
import { PAY_ONCE_LINE, SOFTWARE_REVIEW_TOPIC, STORE_LINE, allPackagesInclude } from './data';
import { heroScenes } from './hero-scenes';

describe('public copy', () => {
  it('keeps the pay-once prices on the plan line', () => {
    expect(PAY_ONCE_LINE).toContain('$497');
    expect(PAY_ONCE_LINE).toContain('$797');
    expect(PAY_ONCE_LINE).toContain('$997');
  });

  it('says nothing is charged until the site is approved', () => {
    expect(allPackagesInclude[0]).toContain('nothing is charged');
  });

  it('shows the hero call to action on the first scene', () => {
    expect(heroScenes[0]?.cta).toBe(true);
  });

  it('noindexes the example demos', () => {
    expect(DEMO_NOINDEX_HEADERS.some((entry) => entry.source === '/examples/:path*')).toBe(true);
  });

  it('names the software review and the store line', () => {
    expect(SOFTWARE_REVIEW_TOPIC).toBe('software-review');
    expect(STORE_LINE).toContain('$497');
  });

  it('puts the reason for the call in the booking link', () => {
    expect(bookHref('plan=Complete').endsWith('/book?plan=Complete')).toBe(true);
    const bare = bookHref();
    expect(bare.endsWith('/book')).toBe(true);
    expect(bare.includes('?')).toBe(false);
  });
});
