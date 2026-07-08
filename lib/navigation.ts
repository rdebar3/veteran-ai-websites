import { scrollToElement } from '@/lib/scroll-driver';

/** Briefing-first nav — chapter targets live inside #briefing */
export const navLinks = [
  { label: 'Briefing', href: '#briefing' },
  { label: 'Demos', href: '#demos' },
  { label: 'Reviews', href: '#victory' },
  { label: 'Packages', href: '#pricing' },
  { label: 'Build', href: '#build' },
] as const;

export function scrollToSection(id: string) {
  scrollToElement(id);
}
