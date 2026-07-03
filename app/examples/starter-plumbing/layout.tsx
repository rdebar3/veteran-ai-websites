'use client';

import { useEffect } from 'react';
import './starter-plumbing.css';

export default function StarterPlumbingLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const mainNav = document.querySelector('nav');
    if (mainNav?.textContent?.includes('Veteran AI Websites')) {
      (mainNav as HTMLElement).style.display = 'none';
    }
    const mainFooter = document.querySelector('footer');
    if (mainFooter?.textContent?.includes('Veteran AI Websites')) {
      (mainFooter as HTMLElement).style.display = 'none';
    }

    document.title = 'Summit Plumbing LLC | Ridgeview, WV | (304) 555-0192';
    document.body.classList.add('sp-demo-body');

    return () => {
      if (mainNav) (mainNav as HTMLElement).style.display = '';
      if (mainFooter) (mainFooter as HTMLElement).style.display = '';
      document.body.classList.remove('sp-demo-body');
    };
  }, []);

  return <>{children}</>;
}