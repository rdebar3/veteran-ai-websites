'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

/** Hides the marketing nav and footer on the sample-site routes. */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/examples')) return null;
  return children;
}
