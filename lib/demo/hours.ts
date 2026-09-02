const DAY_ABBR: Record<string, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};

export const NY_TZ = 'America/New_York';

export type DayHours = {
  day: string;
  hours: string;
  closed: boolean;
  start?: number;
  end?: number;
};

function abbreviateDay(day: string): string {
  return DAY_ABBR[day.toLowerCase()] || day;
}

function parseClock(text: string): number | null {
  const m = text.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let hour = Number(m[1]);
  const minute = Number(m[2]);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  const ap = m[3].toUpperCase();
  if (ap === 'AM') {
    if (hour === 12) hour = 0;
  } else if (hour !== 12) {
    hour += 12;
  }
  return hour * 60 + minute;
}

export function parseDayHours(line: string): DayHours | null {
  const idx = line.indexOf(':');
  if (idx <= 0) return null;
  const day = line.slice(0, idx).trim();
  const hours = line.slice(idx + 1).trim();
  if (!day || !hours) return null;
  if (/^closed$/i.test(hours)) {
    return { day, hours, closed: true };
  }
  const range = hours.split(/\s*[–—-]\s*/);
  if (range.length < 2) return { day, hours, closed: false };
  const start = parseClock(range[0]);
  const end = parseClock(range[1]);
  if (start == null || end == null) return { day, hours, closed: false };
  return { day, hours, closed: false, start, end };
}

export function nyClock(now: Date): { weekday: string; minutes: number } {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: NY_TZ,
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  });
  const parts: Record<string, string> = {};
  for (const part of fmt.formatToParts(now)) {
    if (part.type !== 'literal') parts[part.type] = part.value;
  }
  const hour = Number(parts.hour);
  const minute = Number(parts.minute);
  return {
    weekday: parts.weekday || '',
    minutes: hour * 60 + minute,
  };
}

/** True when `now` (injected) falls inside today's open window in America/New_York. */
export function isOpenNow(lines: string[], now: Date): boolean {
  const clock = nyClock(now);
  for (const line of lines) {
    const parsed = parseDayHours(line);
    if (!parsed) continue;
    if (parsed.day.toLowerCase() !== clock.weekday.toLowerCase()) continue;
    if (parsed.closed || parsed.start == null || parsed.end == null) {
      return false;
    }
    if (parsed.end > parsed.start) {
      return clock.minutes >= parsed.start && clock.minutes < parsed.end;
    }
    return clock.minutes >= parsed.start || clock.minutes < parsed.end;
  }
  return false;
}

/**
 * Proof-strip summary from weekdayDescriptions.
 * "Open Mon–Fri 8:00 AM – 5:00 PM" — derived in code, never from the model.
 */
export function summarizeOpenHours(lines: string[]): string | null {
  const parsed: DayHours[] = [];
  for (const line of lines) {
    const row = parseDayHours(line);
    if (row) parsed.push(row);
  }
  const open = parsed.filter((row) => !row.closed);
  if (open.length === 0) return null;

  const spans: { start: string; end: string; hours: string }[] = [];
  for (const row of open) {
    const last = spans[spans.length - 1];
    if (last && last.hours === row.hours) last.end = row.day;
    else spans.push({ start: row.day, end: row.day, hours: row.hours });
  }
  const primary = spans[0];
  if (!primary) return null;
  const days =
    primary.start === primary.end
      ? abbreviateDay(primary.start)
      : `${abbreviateDay(primary.start)}–${abbreviateDay(primary.end)}`;
  return `Open ${days} ${primary.hours}`;
}

export function hoursRows(lines: string[]): DayHours[] {
  const out: DayHours[] = [];
  for (const line of lines) {
    const row = parseDayHours(line);
    if (row) out.push(row);
  }
  return out;
}
