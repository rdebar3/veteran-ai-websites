export const navLinks = [
  { label: 'Build', href: '#build' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Process', href: '#how-it-works' },
  { label: 'Examples', href: '#examples' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
] as const;

export function scrollToSection(id: string) {
  const el = document.getElementById(id.replace('#', ''));
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}