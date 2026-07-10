import {
  Flame,
  Snowflake,
  Wind,
  Calendar,
  Shield,
  Home,
  type LucideIcon,
} from 'lucide-react';

/* ── Single source of truth: business facts (kept consistent across every page) ── */
export const HVAC_NAME = 'Appalachian HVAC';
export const HVAC_TAGLINE = 'Comfort for Every Season';
export const HVAC_PHONE = '(304) 555-0148';
export const HVAC_PHONE_HREF = 'tel:+13045550148';
export const HVAC_EMAIL = 'service@appalachianhvac.com';
export const HVAC_ADDRESS1 = '124 Mountain View Road';
export const HVAC_ADDRESS2 = 'Ridgeview, WV 26501';
export const HVAC_HOURS = 'Mon–Fri 7:30am–5:30pm · Sat 8am–2pm';
export const HVAC_EMERGENCY = '24/7 emergency service';
export const HVAC_FOUNDED = 2009;
export const HVAC_OWNERSHIP = 'Family-owned & veteran-operated';
export const HVAC_LICENSE = 'WV HVAC Lic. #WV055842';

export const navLinks = [
  { href: '/examples/complete-hvac', label: 'Home' },
  { href: '/examples/complete-hvac/services', label: 'Services' },
  { href: '/examples/complete-hvac/maintenance-plans', label: 'Maintenance Plans' },
  { href: '/examples/complete-hvac/about', label: 'About' },
  { href: '/examples/complete-hvac/contact', label: 'Contact' },
];

export const serviceAreas = [
  'Ridgeview',
  'Oakdale',
  'Pine Hollow',
  'Clear Springs',
  'Maple Fork',
  'River Bend',
];

export interface HvacService {
  icon: LucideIcon;
  title: string;
  desc: string;
  features: string[];
}

/* Full services (Services page). Home shows the first four as summary cards. */
export const services: HvacService[] = [
  {
    icon: Flame,
    title: 'Heating',
    desc: 'High-efficiency furnaces, heat pumps, and boilers — sized, installed, and repaired to keep every room warm through the coldest mountain nights.',
    features: [
      'Furnace repair & replacement',
      'Heat pumps (ducted & ductless)',
      'Boilers & radiant heat',
      'Smart thermostats & zoning',
      'Annual safety inspections',
    ],
  },
  {
    icon: Snowflake,
    title: 'Cooling',
    desc: 'Central air and ductless mini-splits that keep the whole house cool and comfortable all through West Virginia summers.',
    features: [
      'High-SEER central AC install',
      'Ductless mini-split systems',
      'AC repair & recharge',
      'Whole-home dehumidification',
      'New construction & retrofits',
    ],
  },
  {
    icon: Wind,
    title: 'Indoor Air Quality',
    desc: 'Filtration, humidity control, and duct care for fresh, healthy air your family can breathe easy in, season after season.',
    features: [
      'HEPA & UV air purification',
      'Whole-home humidifiers',
      'Energy recovery ventilators',
      'Duct cleaning & sealing',
      'Allergy & asthma support',
    ],
  },
  {
    icon: Calendar,
    title: 'Maintenance & Tune-Ups',
    desc: 'Seasonal precision tune-ups and priority service that keep your system efficient and catch small problems before they become big ones.',
    features: [
      'Twice-yearly precision tune-ups',
      'Filter replacement program',
      'Priority scheduling for members',
      'Discounts on any repairs',
      'Longer equipment life',
    ],
  },
  {
    icon: Shield,
    title: '24/7 Emergency Service',
    desc: 'When the heat quits on the coldest night or the AC dies in a heat wave, a real local technician answers and comes running.',
    features: [
      '24/7 availability, year-round',
      'No-heat & no-cool emergencies',
      'Refrigerant & compressor issues',
      'Thermostat & control failures',
      'Priority for plan members',
    ],
  },
  {
    icon: Home,
    title: 'Whole-Home Comfort',
    desc: 'Balanced heating, cooling, and humidity designed around the way your family actually lives — not a one-size-fits-all fix.',
    features: [
      'Whole-home comfort assessments',
      'Zoned temperature control',
      'Humidity balancing',
      'Ductwork optimization',
      'Energy-efficiency upgrades',
    ],
  },
];

export const homeServices = services.slice(0, 4).map(({ icon, title, desc }) => ({
  icon,
  title,
  desc,
}));

/* ── Maintenance plan tiers (Maintenance Plans page) ── */
export interface HvacPlan {
  name: string;
  monthly: number;
  yearly: number;
  blurb: string;
  featured?: boolean;
  features: string[];
}

export const plans: HvacPlan[] = [
  {
    name: 'Comfort Basic',
    monthly: 12,
    yearly: 129,
    blurb: 'Essential seasonal care for a single system.',
    features: [
      'One precision tune-up each year',
      'Standard filter changed at visit',
      '10% discount on any repair',
      'Priority scheduling over non-members',
      'Reminder when your service is due',
    ],
  },
  {
    name: 'Comfort Plus',
    monthly: 19,
    yearly: 199,
    blurb: 'Full heating + cooling coverage. Our most popular plan.',
    featured: true,
    features: [
      'Two precision tune-ups (heating & cooling)',
      'Standard filters included',
      '15% discount on any repair',
      'Priority scheduling, year-round',
      'No overtime fees on service calls',
      'Written record of every visit',
    ],
  },
  {
    name: 'Comfort Complete',
    monthly: 29,
    yearly: 299,
    blurb: 'Total peace of mind, including air quality and emergencies.',
    features: [
      'Everything in Comfort Plus',
      'Annual indoor-air-quality check',
      '20% discount on any repair',
      'Waived diagnostic fee on repairs',
      'One free emergency visit each year',
      'Transfers with you if you move',
    ],
  },
];

export const values = [
  {
    title: 'Do It Right the First Time',
    desc: 'We diagnose thoroughly and recommend only what you truly need — no shortcuts, no upselling.',
  },
  {
    title: 'Proudly Local',
    desc: 'We live and work right here in Ridgeview. When we install a system, our reputation is on the line.',
  },
  {
    title: 'Respect Your Home & Budget',
    desc: 'We treat every house with care and explain costs clearly before any work begins.',
  },
  {
    title: 'Veteran-Operated Integrity',
    desc: 'Discipline, clear communication, and real pride in workmanship guide everything we do.',
  },
];

export const testimonials = [
  {
    quote:
      'Our furnace died on the coldest night of the year. They came out same evening, were so kind about it, and had us warm again within the hour.',
    name: 'The Hollis Family',
    location: 'Ridgeview, WV',
    project: 'Emergency Furnace Repair',
  },
  {
    quote:
      'They replaced our old furnace and AC with a new high-efficiency heat pump. Our energy bills dropped over 30% this winter and every room finally feels comfortable.',
    name: 'Marie & Tom B.',
    location: 'Oakdale, WV',
    project: 'Full System Replacement',
  },
  {
    quote:
      'We’ve used them for years. Same friendly faces every season, always on time, everything explained clearly. Feels like calling a neighbor, not a company.',
    name: 'Greg P.',
    location: 'Pine Hollow, WV',
    project: 'Annual Maintenance Plan',
  },
];

/* Kept for the (unlinked) legacy reviews page so it still compiles. */
export const projects = [
  {
    image: '/demos/complete-hvac/project-fall.jpg',
    title: 'High-Efficiency Heat Pump Installation',
    location: 'Ridgeview Residence',
    result:
      'Replaced an aging oil furnace. Family reports 32% lower heating costs and consistent temperatures throughout the home.',
  },
  {
    image: '/demos/complete-hvac/service-air-fall.jpg',
    title: 'Central AC & Air Purifier Upgrade',
    location: 'Oakdale Home',
    result:
      'New 16-SEER system with whole-home purification. Noticeably cleaner air and lower humidity all summer.',
  },
];
