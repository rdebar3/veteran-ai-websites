export const demoNote =
  'Demo site by Veteran AI Websites. Business, reviews and photos are samples.';

export const thanks = 'Got it — we’ll call you back within the hour.';

export const name = 'Summit Plumbing';
export const town = 'Ridgeview, WV';
export const line = 'Leaks, water heaters, and drains.';
export const phone = '(304) 555-0192';
export const phoneHref = 'tel:+13045550192';
export const ownerLine = 'Upfront pricing.';

const HOURS_BY_DAY: Record<string, string> = {
  Sunday: 'Emergency calls',
  Monday: '7:00am – 6:00pm',
  Tuesday: '7:00am – 6:00pm',
  Wednesday: '7:00am – 6:00pm',
  Thursday: '7:00am – 6:00pm',
  Friday: '7:00am – 6:00pm',
  Saturday: '8:00am – 2:00pm',
};

export function todayHoursLine(now = new Date()): string {
  const day = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long',
  }).format(now);
  return `${day} · ${HOURS_BY_DAY[day] ?? HOURS_BY_DAY.Monday}`;
}

export const nav = [{ href: '/examples/starter-plumbing', label: 'Home' }];

export const callLabel = 'Call';
export const quoteLabel = 'Get a quote';
export const quoteHref = '#quote';

export const hero = {
  town,
  line,
  photo: {
    src: '/demos/starter-plumbing/hero-tech.jpg',
    alt: 'A plumber repairing the lines under a kitchen sink, mountains outside the window',
  },
};

export const services = [
  {
    id: 'leak',
    title: 'Leak detection',
    text: 'Find the leak and stop it before it reaches the floor or the ceiling below.',
  },
  {
    id: 'heaters',
    title: 'Water heaters',
    text: 'Repair, replacement, and tankless installs, scheduled around your day.',
  },
  {
    id: 'drain',
    title: 'Drain & sewer',
    text: 'Clogs, slow drains, and camera inspections, handled cleanly.',
  },
  {
    id: 'repipe',
    title: 'Repiping',
    text: 'Whole-home repipes when the old lines have had enough.',
  },
  {
    id: 'fixtures',
    title: 'Fixtures & faucets',
    text: 'Sinks, toilets, showers, and faucets set so they stay put.',
  },
  {
    id: 'emergency',
    title: 'Emergency calls',
    text: 'Sunday is for emergency calls. The phone is answered.',
  },
];

export const about = {
  title: 'A real local pro — not a call center.',
  photo: {
    src: '/demos/starter-plumbing/summit-pro.jpg',
    alt: 'Summit Plumbing technician at a kitchen sink',
  },
  lead: 'Summit Plumbing is a one-crew shop in Ridgeview. The person who answers is the person who shows up.',
  bullets: [
    'A price you approve before the tools come out.',
    'The work area left as clean as we found it.',
  ],
};

export const work = [
  {
    src: '/demos/starter-plumbing/kitchen-faucet.jpg',
    alt: 'A kitchen faucet installed at a sink',
    caption: 'A kitchen faucet, set and sealed.',
  },
  {
    src: '/demos/starter-plumbing/hero-bathroom.jpg',
    alt: 'A finished bathroom with a new fixture',
    caption: 'A bathroom put back into everyday use.',
  },
  {
    src: '/demos/starter-plumbing/entrance-leak.jpg',
    alt: 'Plumbing repair at a home entrance',
    caption: 'A leak caught before it spread.',
  },
];

export const reviews = [
  {
    quote:
      'Fast, friendly, and honest. Had our water heater replaced the same day I called. Fair price, no upsell.',
    name: 'Karen M.',
    town: 'Ridgeview, WV',
  },
  {
    quote:
      'Showed up on time, explained everything, and left the place cleaner than they found it. Our new go-to.',
    name: 'Dwayne P.',
    town: 'Elkview, WV',
  },
  {
    quote:
      'Burst pipe on a Sunday night — they answered and had it handled in an hour. Absolute lifesavers.',
    name: 'Sara L.',
    town: 'Clendenin, WV',
  },
];

export const hours = [
  { days: 'Monday – Friday', time: '7:00am – 6:00pm' },
  { days: 'Saturday', time: '8:00am – 2:00pm' },
  { days: 'Sunday', time: 'Emergency calls' },
];

export const serviceArea = {
  title: 'Serving Ridgeview and the surrounding counties',
  towns: ['Ridgeview', 'Elkview', 'Clendenin', 'Sissonville', 'Pinch', 'Big Chimney'],
};

export const quote = {
  title: 'Tell me what is going on.',
  lead: 'A few details are enough. I will call you back with a straight answer.',
};
