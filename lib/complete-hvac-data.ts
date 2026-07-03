import {
  Flame,
  Snowflake,
  Wind,
  Calendar,
  Shield,
  Cpu,
  type LucideIcon,
} from 'lucide-react';

export const HVAC_PHONE = '(304) 555-0248';
export const HVAC_PHONE_HREF = 'tel:3045550248';
export const HVAC_EMAIL = 'service@appalachianhvacsolutions.com';

export const navLinks = [
  { href: '/examples/complete-hvac', label: 'Home' },
  { href: '/examples/complete-hvac/services', label: 'Services' },
  { href: '/examples/complete-hvac/about', label: 'About' },
  { href: '/examples/complete-hvac/reviews', label: 'Projects / Reviews' },
  { href: '/examples/complete-hvac/contact', label: 'Contact' },
];

export interface HvacService {
  icon: LucideIcon;
  title: string;
  desc: string;
  image: string;
  features: string[];
}

export const services: HvacService[] = [
  {
    icon: Flame,
    title: 'Smart Heating Systems',
    desc: 'High-efficiency furnaces, heat pumps, and boilers with AI-assisted zoning sized for Appalachian winters.',
    image: '/demos/complete-hvac/service-heating.jpg',
    features: [
      'Heat pump & furnace installation',
      'Ducted and ductless zoning',
      'Smart thermostat integration',
      'Radiant & boiler systems',
      'Annual safety inspections',
    ],
  },
  {
    icon: Snowflake,
    title: 'Cooling & Climate Control',
    desc: 'Central AC and mini-splits with humidity-aware controls built for West Virginia summers.',
    image: '/demos/complete-hvac/service-cooling.jpg',
    features: [
      'High-SEER central AC units',
      'Ductless mini-split systems',
      'Whole-home dehumidification',
      'Predictive cooling schedules',
      'New construction & retrofits',
    ],
  },
  {
    icon: Wind,
    title: 'Indoor Air Quality',
    desc: 'Whole-home purification, humidification, and ventilation monitored through smart-home dashboards.',
    image: '/demos/complete-hvac/service-air-quality.jpg',
    features: [
      'HEPA & UV air purification',
      'Whole-home humidifiers',
      'Energy recovery ventilators',
      'Duct cleaning & sanitizing',
      'Allergy & asthma support',
    ],
  },
  {
    icon: Calendar,
    title: 'Maintenance & Tune-Ups',
    desc: 'Preventive care that keeps equipment efficient, with priority service for plan members.',
    image: '/demos/complete-hvac/entrance-hvac.jpg',
    features: [
      'Twice-yearly precision tune-ups',
      'Filter replacement program',
      'Priority scheduling',
      '10% discount on repairs',
      'Extended equipment life',
    ],
  },
  {
    icon: Cpu,
    title: 'Smart Home Integration',
    desc: 'Connect HVAC, air quality, and energy monitoring into one seamless climate command center.',
    image: '/demos/complete-hvac/hero-tech.jpg',
    features: [
      'Whole-home climate dashboards',
      'Remote temperature control',
      'Energy usage analytics',
      'Leak & fault alerts',
      'Voice assistant compatibility',
    ],
  },
  {
    icon: Shield,
    title: '24/7 Emergency Service',
    desc: 'Fast response for no-heat, no-cool, and urgent system failures — trucks stocked for same-day fixes.',
    image: '/demos/complete-hvac/project-heat-pump.jpg',
    features: [
      '24/7 availability year-round',
      'No-heat & no-cool emergencies',
      'Refrigerant & compressor issues',
      'Thermostat & control failures',
      'Priority for maintenance members',
    ],
  },
];

export const homeServices = services.slice(0, 6).map(({ icon, title, desc }) => ({
  icon,
  title,
  desc,
}));

export const testimonials = [
  {
    quote:
      'They replaced our 18-year-old furnace and central AC with a new high-efficiency heat pump system. Our energy bills dropped over 30% this winter and the house finally feels comfortable in every room.',
    name: 'The Millers',
    location: 'Ridgeview, WV',
    project: 'Full System Replacement – Heat Pump',
  },
  {
    quote:
      'Appalachian HVAC has handled our seasonal maintenance for six years. They\'re always on time, professional, and explain everything clearly. We trust them completely with our home.',
    name: 'Sarah & Dave Kline',
    location: 'Oakdale, WV',
    project: 'Annual Maintenance Plan',
  },
  {
    quote:
      'After my son\'s asthma flare-ups, they installed a whole-home air purifier and sealed some leaky ducts. Within a week the air felt noticeably cleaner and his symptoms improved.',
    name: 'Maria Torres',
    location: 'Pine Hollow, WV',
    project: 'Indoor Air Quality & Duct Sealing',
  },
  {
    quote:
      'Our AC stopped working on the hottest day of the summer. They arrived the same afternoon, had the part on the truck, and got us back up and running before dinner.',
    name: 'Patricia Langley',
    location: 'Ridgeview, WV',
    project: 'Emergency AC Repair',
  },
];

export const projects = [
  {
    image: '/demos/complete-hvac/project-heat-pump.jpg',
    title: 'High-Efficiency Heat Pump Installation',
    location: 'Ridgeview Residence',
    result:
      'Replaced aging oil furnace. Family reports 32% lower heating costs and consistent temperatures throughout the home.',
  },
  {
    image: '/demos/complete-hvac/service-cooling.jpg',
    title: 'Central AC & Air Purifier Upgrade',
    location: 'Oakdale Home',
    result:
      'New 16-SEER system with whole-home purification. Noticeably cleaner air and reduced humidity during summer months.',
  },
  {
    image: '/demos/complete-hvac/hero-tech.jpg',
    title: 'Duct Sealing & Mini-Split Installation',
    location: 'Pine Hollow Addition',
    result:
      'Sealed existing ductwork and installed ductless mini-split for new addition. Balanced comfort and lower energy use.',
  },
  {
    image: '/demos/complete-hvac/service-air-quality.jpg',
    title: 'Furnace & Humidifier Install',
    location: 'Maple Fork Farmhouse',
    result:
      'Replaced 22-year-old furnace with high-efficiency model plus whole-home humidifier. Much better comfort in dry winters.',
  },
];

export const values = [
  {
    title: 'Do It Right the First Time',
    desc: 'We diagnose thoroughly and only recommend what\'s truly needed. No shortcuts, no upselling.',
  },
  {
    title: 'Proudly Local',
    desc: 'We live and work in Ridgeview. When we install a system, our reputation is on the line.',
  },
  {
    title: 'Respect Your Home & Budget',
    desc: 'We treat every house with care and explain costs clearly before any work begins.',
  },
  {
    title: 'Veteran-Owned Integrity',
    desc: 'Discipline, clear communication, and pride in workmanship define how we operate every day.',
  },
];

export const serviceAreas = [
  'Ridgeview',
  'Oakdale',
  'Pine Hollow',
  'Clear Springs',
  'Maple Fork',
  'River Bend',
  'And surrounding communities',
];