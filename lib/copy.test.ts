import { describe, expect, it } from 'vitest';
import { DEMO_NOINDEX_HEADERS } from './demo/headers';
import { bookHref } from '../components/ScheduleCall';
import { BUSINESS_LEGAL_NAME, CONTACT_EMAIL, CONTACT_EMAIL_HREF } from './contact';
import { PAY_ONCE_LINE, SOFTWARE_REVIEW_TOPIC, allPackagesInclude } from './data';
import { heroScenes } from './hero-scenes';
import {
  hero as hvacHero,
  line as hvacLine,
  name as hvacName,
  phone as hvacPhone,
  phoneHref as hvacPhoneHref,
  rating as hvacRating,
  todayHoursLine as hvacToday,
  town as hvacTown,
} from './complete-hvac-data';
import {
  dinnerLine,
  hero as bistroHero,
  name as bistroName,
  phone as bistroPhone,
  phoneHref as bistroPhoneHref,
  town as bistroTown,
} from './ridge-bistro-data';
import {
  line as plumbingLine,
  name as plumbingName,
  ownerLine,
  phone as plumbingPhone,
  phoneHref as plumbingPhoneHref,
  todayHoursLine as plumbingToday,
  town as plumbingTown,
} from './starter-plumbing-data';

describe('public copy', () => {
  it('points pay-once at the call', () => {
    expect(PAY_ONCE_LINE).toBe('Want to own it outright? Ask me on the call.');
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

  it('names the software review', () => {
    expect(SOFTWARE_REVIEW_TOPIC).toBe('software-review');
  });

  it('names the business and points contact at the note form until there is an email', () => {
    expect(BUSINESS_LEGAL_NAME).toContain('LLC');
    expect(CONTACT_EMAIL).toBe('');
    expect(CONTACT_EMAIL_HREF).toBe('/#contact');
  });

  it('puts the reason for the call in the booking link', () => {
    expect(bookHref('plan=Complete').endsWith('/book?plan=Complete')).toBe(true);
    const bare = bookHref();
    expect(bare.endsWith('/book')).toBe(true);
    expect(bare.includes('?')).toBe(false);
  });
});

describe('demo first screens', () => {
  const friday = new Date('2026-10-16T15:00:00.000Z');
  const sunday = new Date('2026-10-18T15:00:00.000Z');

  it('puts Summit Plumbing name, town, work, phone digits, and today hours on the first screen', () => {
    expect(plumbingName).toBe('Summit Plumbing');
    expect(plumbingTown).toBe('Ridgeview, WV');
    expect(plumbingLine).toBe('Leaks, water heaters, and drains.');
    expect(plumbingPhone).toBe('(304) 555-0192');
    expect(plumbingPhoneHref).toBe('tel:+13045550192');
    expect(plumbingToday(friday)).toBe('Friday · 7:00am – 6:00pm');
    expect(plumbingToday(sunday)).toBe('Sunday · Emergency calls');
    expect(ownerLine).toBe('Upfront pricing.');
  });

  it('puts Appalachian HVAC name, town, work, phone digits, and today hours on the first screen', () => {
    expect(hvacName).toBe('Appalachian HVAC');
    expect(hvacTown).toBe('Ridgeview, WV');
    expect(hvacLine).toBe('Heating and cooling for mountain homes.');
    expect(hvacPhone).toBe('(304) 555-0148');
    expect(hvacPhoneHref).toBe('tel:+13045550148');
    expect(hvacToday(friday)).toBe('Friday · 7:30am – 5:30pm');
    expect(hvacToday(sunday)).toBe('Sunday · Emergency calls');
    expect(hvacHero.photo.src).toBe('/demos/complete-hvac/hero-job.webp');
    expect(hvacHero.photo.alt).toContain('technician');
    expect(hvacRating.note).toBe('sample');
  });

  it('puts the Ridge Bistro town, dinner line, and phone on the hero', () => {
    expect(bistroName).toBe('The Ridge Bistro');
    expect(bistroTown).toBe('Ridgeview, WV');
    expect(bistroHero.headline).toBe('Dinner, slowly.');
    expect(dinnerLine).toBe('Dinner, Tuesday to Sunday from 5');
    expect(bistroPhone).toBe('(304) 555-0381');
    expect(bistroPhoneHref).toBe('tel:+13045550381');
  });
});
