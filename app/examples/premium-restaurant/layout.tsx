'use client';

import { useEffect } from 'react';
import './ridge-bistro.css';

export default function PremiumRestaurantLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const mainNav = document.querySelector('nav');
    if (mainNav?.textContent?.includes('Veteran AI Websites')) {
      (mainNav as HTMLElement).style.display = 'none';
    }
    const mainFooter = document.querySelector('footer');
    if (mainFooter?.textContent?.includes('Veteran AI Websites')) {
      (mainFooter as HTMLElement).style.display = 'none';
    }
    document.body.classList.add('rb-demo-body');

    return () => {
      if (mainNav) (mainNav as HTMLElement).style.display = '';
      if (mainFooter) (mainFooter as HTMLElement).style.display = '';
      document.body.classList.remove('rb-demo-body');
    };
  }, []);

  return <>{children}</>;
}