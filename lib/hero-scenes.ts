export type HeroScene = {
  title: string;
  sub?: string;
  cta?: boolean;
};

/** Two-scene homepage hero. Scroll length lives on .vh-root in VideoHero. */
export const heroScenes: HeroScene[] = [
  {
    title: 'More calls for your business. Built in a day.',
    sub: 'West Virginia veteran-owned. Nothing down, $49 a month.',
  },
  {
    title: 'Pick a time. I’ll call you.',
    cta: true,
  },
];
