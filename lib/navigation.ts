import { scrollToElement } from '@/lib/scroll-driver';

/** Nav targets for the current homepage sections. */
export const navLinks = [
  { label: 'Demos', href: '#examples' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Veterans', href: '#veterans' },
  { label: 'Reviews', href: '#reviews' },
] as const;

export function scrollToSection(id: string) {
  scrollToElement(id);
}
