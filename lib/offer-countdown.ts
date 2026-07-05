export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

/** Next Sunday at 11:59:59.999 PM local time; rolls forward weekly after expiry. */
export function getNextSundayDeadline(from: Date = new Date()): Date {
  const deadline = new Date(from);
  const day = from.getDay();
  const daysUntilSunday = day === 0 ? 0 : 7 - day;

  deadline.setDate(from.getDate() + daysUntilSunday);
  deadline.setHours(23, 59, 59, 999);

  if (deadline.getTime() <= from.getTime()) {
    deadline.setDate(deadline.getDate() + 7);
  }

  return deadline;
}

export function getTimeRemaining(from: Date = new Date()): TimeRemaining {
  const deadline = getNextSundayDeadline(from);
  const totalMs = Math.max(0, deadline.getTime() - from.getTime());
  const totalSec = Math.floor(totalMs / 1000);

  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
    totalMs,
  };
}

export function padCountdownUnit(value: number): string {
  return value.toString().padStart(2, '0');
}