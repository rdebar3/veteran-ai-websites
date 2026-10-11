import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import DemoShell from '@/components/ridge-bistro/DemoShell';
import './ridge-bistro.css';

export const metadata: Metadata = {
  title: 'The Ridge Bistro | Ridgeview, WV',
  description: 'Sample restaurant website for The Ridge Bistro of Ridgeview, West Virginia.',
  robots: { index: false, follow: false },
};

export default function PremiumRestaurantLayout({ children }: { children: ReactNode }) {
  return <DemoShell>{children}</DemoShell>;
}
