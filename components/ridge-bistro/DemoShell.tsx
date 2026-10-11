'use client';

import { useEffect, type ReactNode } from 'react';

export default function DemoShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.classList.add('rb-demo-body');
    return () => {
      document.body.classList.remove('rb-demo-body');
    };
  }, []);

  return <>{children}</>;
}
