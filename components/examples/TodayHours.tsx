'use client';

import { todayHoursLine as hvacToday } from '@/lib/complete-hvac-data';
import { todayHoursLine as plumbingToday } from '@/lib/starter-plumbing-data';

const lines = {
  hvac: hvacToday,
  plumbing: plumbingToday,
} as const;

export function TodayHours({
  demo,
  className,
}: {
  demo: keyof typeof lines;
  className?: string;
}) {
  return (
    <p className={className} suppressHydrationWarning>
      {lines[demo](new Date())}
    </p>
  );
}
