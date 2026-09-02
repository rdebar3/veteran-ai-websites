import { describe, expect, it } from 'vitest';
import { isOpenNow, summarizeOpenHours } from './hours';

const WEEKDAY_HOURS = [
  'Monday: 8:00 AM – 5:00 PM',
  'Tuesday: 8:00 AM – 5:00 PM',
  'Wednesday: 8:00 AM – 5:00 PM',
  'Thursday: 8:00 AM – 5:00 PM',
  'Friday: 8:00 AM – 5:00 PM',
  'Saturday: Closed',
  'Sunday: Closed',
];

describe('summarizeOpenHours', () => {
  it('collapses Mon–Fri into the proof-strip line', () => {
    expect(summarizeOpenHours(WEEKDAY_HOURS)).toBe(
      'Open Mon–Fri 8:00 AM – 5:00 PM',
    );
  });
});

describe('isOpenNow', () => {
  it('is open on a weekday midday, closed after hours, closed Sunday', () => {
    const weekdayOpen = new Date('2026-09-02T16:00:00.000Z');
    const weekdayClosed = new Date('2026-09-03T00:00:00.000Z');
    const sunday = new Date('2026-09-06T16:00:00.000Z');
    expect(isOpenNow(WEEKDAY_HOURS, weekdayOpen)).toBe(true);
    expect(isOpenNow(WEEKDAY_HOURS, weekdayClosed)).toBe(false);
    expect(isOpenNow(WEEKDAY_HOURS, sunday)).toBe(false);
  });
});
