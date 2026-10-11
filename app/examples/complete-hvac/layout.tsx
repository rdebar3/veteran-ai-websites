import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import DemoShell from '@/components/complete-hvac/DemoShell';
import { HVAC_NAME } from '@/lib/complete-hvac-data';
import './complete-hvac.css';

export const metadata: Metadata = {
  title: `${HVAC_NAME} | Ridgeview, WV`,
  description: `Sample multi-page heating and cooling website for ${HVAC_NAME} of Ridgeview, West Virginia.`,
  robots: { index: false, follow: false },
};

export default function CompleteHvacLayout({ children }: { children: ReactNode }) {
  return <DemoShell>{children}</DemoShell>;
}
