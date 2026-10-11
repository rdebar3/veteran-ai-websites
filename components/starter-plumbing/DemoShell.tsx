'use client';

import { useEffect, type ReactNode } from 'react';

export default function DemoShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.classList.add('sp-demo-body');
    return () => {
      document.body.classList.remove('sp-demo-body');
    };
  }, []);

  return <>{children}</>;
}
