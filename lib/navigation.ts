import { scrollToElement } from '@/lib/scroll-driver';

/** Nav targets for the current homepage sections. */
export const BASE_NAV = [
  { label: 'Demos', href: '#examples' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Veterans', href: '#veterans' },
] as const;

export const REVIEWS_LINK = { label: 'Reviews', href: '#reviews' } as const;
export const TALK_LINK = { label: "Let's talk", href: '#contact' } as const;

const talkNav = [...BASE_NAV, TALK_LINK] as const;

/** Pure. Reviews appears only when at least one approved review exists; Let's talk is always last. */
export function navLinksFor(hasReviews: boolean): readonly { label: string; href: string }[] {
  return hasReviews ? [...BASE_NAV, REVIEWS_LINK, TALK_LINK] : talkNav;
}

/** No approved review yet, so the nav ends on Let's talk. */
export const navLinks = navLinksFor(false);

export function scrollToSection(id: string) {
  scrollToElement(id);
}
