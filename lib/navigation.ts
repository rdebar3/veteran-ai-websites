import { scrollToElement } from '@/lib/scroll-driver';

export const navLinks = [
  { label: 'Story', href: '#story' },
  { label: 'Build', href: '#build' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Process', href: '#how-it-works' },
  { label: 'Examples', href: '#examples' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
] as const;

export function scrollToSection(id: string) {
  scrollToElement(id);
}