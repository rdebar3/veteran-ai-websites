import { Flame, Siren, Snowflake, Wind } from 'lucide-react';

export const demoNote =
  'Demo site by Veteran AI Websites. Business, reviews and photos are samples.';

export const thanks = 'Got it — we’ll call you back within the hour.';

export const HVAC_NAME = 'Appalachian HVAC';
export const name = HVAC_NAME;
export const tagline = 'Heating and cooling for mountain homes.';
export const phone = '(304) 555-0148';
export const phoneHref = 'tel:+13045550148';
export const founded = 2009;
export const license = 'WV HVAC Lic. #WV055842';
export const ownership = 'Family-owned and veteran-operated';

export const callLabel = 'Call';
export const requestLabel = 'Request service';
export const requestHref = '/examples/complete-hvac/contact';

export const nav = [
  { href: '/examples/complete-hvac', label: 'Home' },
  { href: '/examples/complete-hvac/services', label: 'Services' },
  { href: '/examples/complete-hvac/maintenance-plans', label: 'Maintenance Plans' },
  { href: '/examples/complete-hvac/about', label: 'About' },
  { href: '/examples/complete-hvac/contact', label: 'Contact' },
];

export const rating = { score: '4.9', count: '212 reviews', note: 'sample' };

export const hero = {
  headline: 'Heating and cooling for mountain homes.',
  sub: 'Furnaces, heat pumps, and air conditioning, sized for the way a Ridgeview house actually lives through the year.',
  photo: {
    src: '/demos/complete-hvac/hero-fall.jpg',
    alt: 'A mountain living room in fall light, with a sofa, a fireplace, and steam rising from a mug',
  },
};

const serviceSeeds = [
  {
    id: 'heating',
    title: 'Heating',
    summary: 'Furnaces and heat pumps that keep every room warm on the cold nights.',
    body: 'We size the system to the house, not to a catalog page. Repair when that is the honest answer, replacement when the old unit has given out.',
    image: '/demos/complete-hvac/service-heating.jpg',
    alt: 'A heating system in a mountain home',
    included: [
      'Furnace repair and replacement',
      'Heat pumps, ducted and ductless',
      'Boilers and radiant heat',
      'Thermostats and simple zoning',
    ],
  },
  {
    id: 'cooling',
    title: 'Cooling',
    summary: 'Central air and mini-splits for the humid stretch of a West Virginia summer.',
    body: 'A system that cools the rooms you use, without icing over or short-cycling through August.',
    image: '/demos/complete-hvac/service-cooling.jpg',
    alt: 'Cooling equipment for a home',
    included: [
      'Central air install and repair',
      'Ductless mini-splits',
      'Refrigerant and airflow checks',
      'Retrofits in older houses',
    ],
  },
  {
    id: 'air',
    title: 'Air quality',
    summary: 'Filtration and humidity so the air in the house feels like air, not a closet.',
    body: 'Filters, ventilation, and a straight explanation of what will actually change how the house feels.',
    image: '/demos/complete-hvac/service-air-quality.jpg',
    alt: 'Indoor air equipment beside a home comfort system',
    included: [
      'Better filtration',
      'Whole-home humidity control',
      'Ventilation for tight houses',
      'Duct sealing where it leaks',
    ],
  },
  {
    id: 'emergency',
    title: 'Emergency repair',
    summary: 'No heat or no cooling, answered by someone who can be on the road.',
    body: 'Nights and weekends included. Plan members go to the front of the list.',
    image: '/demos/complete-hvac/project-heat-pump.jpg',
    alt: 'A heat pump installed at a Ridgeview home',
    included: [
      'No-heat and no-cool calls',
      'Thermostat and control failures',
      'A diagnosis before any parts',
      'Priority for plan members',
    ],
  },
];

const serviceIcons = {
  heating: Flame,
  cooling: Snowflake,
  air: Wind,
  emergency: Siren,
} as const;

export const services = serviceSeeds.map((service) => ({
  ...service,
  icon: serviceIcons[service.id as keyof typeof serviceIcons],
  desc: service.summary,
  features: service.included,
}));

export const homeServices = services.map(({ icon, title, desc }) => ({ icon, title, desc }));

export const homeTiles = services.slice(0, 3);

const planSeeds = [
  {
    name: 'Basic',
    price: '$14/mo',
    blurb: 'Seasonal care for one system.',
    rows: ['1 tune-up a year', 'Filter changed at the visit', '10% off repairs', 'Priority over non-members'],
  },
  {
    name: 'Plus',
    price: '$24/mo',
    blurb: 'Heating and cooling, with a place in line when it breaks.',
    rows: ['2 tune-ups a year', 'Filters included', '15% off repairs', 'After-hours diagnostic waived'],
  },
];

export const plans = planSeeds.map((plan) => ({
  ...plan,
  monthly: plan.name === 'Basic' ? 14 : 24,
  yearly: plan.name === 'Basic' ? 149 : 249,
  featured: plan.name === 'Plus',
  features: plan.rows,
}));

export const planTable = [
  { feature: 'Tune-ups each year', basic: '1', plus: '2' },
  { feature: 'Filters', basic: 'Changed at the visit', plus: 'Included' },
  { feature: 'Repair discount', basic: '10%', plus: '15%' },
  { feature: 'Priority scheduling', basic: 'Yes', plus: 'Yes' },
  { feature: 'After-hours diagnostic', basic: 'Standard', plus: 'Waived' },
];

export const whyPlan =
  'A tune-up in the fall and another in the spring keeps a mountain system from quitting on the night you need it. Members get a set price, a place in line, and a note after every visit.';

export const reviews = [
  {
    quote:
      'Our furnace died on the coldest night of the year. They came out the same evening and had us warm again within the hour.',
    name: 'The Hollis Family',
    town: 'Ridgeview, WV',
  },
  {
    quote:
      'They replaced our old furnace and air conditioner with a heat pump. The upstairs finally matches the downstairs.',
    name: 'Marie & Tom B.',
    town: 'Oakdale, WV',
  },
  {
    quote:
      'Same faces every season, on time, and the price explained before anyone opened a toolbox.',
    name: 'Greg P.',
    town: 'Pine Hollow, WV',
  },
  {
    quote:
      'The new heat pump is quiet. They walked the whole house with us and wrote down what they found.',
    name: 'Anita C.',
    town: 'Clear Springs, WV',
  },
];

export const hours = [
  { days: 'Monday – Friday', time: '7:30am – 5:30pm' },
  { days: 'Saturday', time: '8:00am – 2:00pm' },
  { days: 'Sunday', time: 'Emergency calls' },
];

export const serviceArea = {
  title: 'Ridgeview and the hollows around it',
  towns: ['Ridgeview', 'Oakdale', 'Pine Hollow', 'Clear Springs', 'Maple Fork', 'River Bend'],
};

export const about = {
  photo: {
    src: '/demos/complete-hvac/about-team.jpg',
    alt: 'The Appalachian HVAC crew outside a home',
  },
  lead: `Appalachian HVAC has worked on Ridgeview homes since ${founded}. ${ownership}.`,
  license,
};

export const addressLine = 'Ridgeview, WV — exact address on request';

export const testimonials = reviews.map((review) => ({
  quote: review.quote,
  name: review.name,
  location: review.town,
  project: 'Sample review',
}));

/** Names kept so a local audit backup still typechecks. Live pages use the names above. */
export const navLinks = nav;
export const HVAC_PHONE = phone;
export const HVAC_PHONE_HREF = phoneHref;
export const HVAC_TAGLINE = tagline;
export const HVAC_FOUNDED = founded;
export const HVAC_OWNERSHIP = ownership;
export const HVAC_LICENSE = license;
export const HVAC_ADDRESS1 = 'Ridgeview, WV';
export const HVAC_ADDRESS2 = 'Exact address on request';
export const HVAC_HOURS = 'Mon–Fri 7:30am–5:30pm · Sat 8am–2pm';
export const HVAC_EMERGENCY = 'Emergency calls on Sunday';
export const HVAC_EMAIL = 'service@appalachianhvac.example';
