import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import DemoShell from '@/components/starter-plumbing/DemoShell';
import './starter-plumbing.css';

export const metadata: Metadata = {
  title: 'Summit Plumbing | Ridgeview, WV',
  description: 'Sample one-page plumbing website for Summit Plumbing of Ridgeview, West Virginia.',
  robots: { index: false, follow: false },
};

export default function StarterPlumbingLayout({ children }: { children: ReactNode }) {
  return <DemoShell>{children}</DemoShell>;
}
