export const BISTRO_PHONE = '(304) 555-0381';
export const BISTRO_PHONE_HREF = 'tel:3045550381';
export const BISTRO_EMAIL = 'reservations@theridgebistro.com';
export const BISTRO_ADDRESS = '214 Summit Ridge Road, Ridgeview, WV 26501';

export const navLinks = [
  { href: '/examples/premium-restaurant', label: 'Home' },
  { href: '/examples/premium-restaurant/menu', label: 'Menu' },
  { href: '/examples/premium-restaurant/about', label: 'About' },
  { href: '/examples/premium-restaurant/reservations', label: 'Reservations' },
  { href: '/examples/premium-restaurant/private-dining', label: 'Private Dining' },
  { href: '/examples/premium-restaurant/gallery', label: 'Gallery' },
  { href: '/examples/premium-restaurant/contact', label: 'Contact' },
];

export const hours = [
  { days: 'Tuesday – Thursday', time: '5:00pm – 9:30pm' },
  { days: 'Friday – Saturday', time: '5:00pm – 10:30pm' },
  { days: 'Sunday', time: '5:00pm – 9:00pm' },
  { days: 'Monday', time: 'Closed' },
];

export interface MenuItem {
  name: string;
  desc: string;
  price: string;
  note?: string;
}

export interface MenuSection {
  id: string;
  title: string;
  subtitle: string;
  items: MenuItem[];
}

export const menuSections: MenuSection[] = [
  {
    id: 'amuse',
    title: 'Amuse & Charcuterie',
    subtitle: 'A quiet beginning',
    items: [
      { name: 'Chef\'s Amuse-Bouche', desc: 'Seasonal bite from the kitchen', price: 'Complimentary' },
      { name: 'Ridge Charcuterie', desc: 'Aged cheeses, cured meats, local honeycomb, pickled vegetables', price: '28' },
      { name: 'Oysters on the Half Shell', desc: 'Mignonette, horseradish, lemon', price: '24', note: 'half dozen' },
      { name: 'Ramp & Potato Velouté', desc: 'Smoked trout roe, chive oil', price: '16' },
    ],
  },
  {
    id: 'hearth',
    title: 'From the Hearth',
    subtitle: 'Warm starters',
    items: [
      { name: 'Seared Scallops', desc: 'Cauliflower purée, brown butter, crispy sage', price: '22' },
      { name: 'Beet & Goat Cheese Tart', desc: 'Walnut crust, aged balsamic, micro arugula', price: '18' },
      { name: 'Crispy Duck Confit Croquette', desc: 'Cherry mostarda, herb salad', price: '19' },
      { name: 'Wood-Fired Bone Marrow', desc: 'Parsley gremolata, grilled sourdough', price: '17' },
    ],
  },
  {
    id: 'mountain',
    title: 'Mountain & Stream',
    subtitle: 'Signature mains',
    items: [
      { name: 'Dry-Aged Ribeye', desc: 'Herb butter, roasted root vegetables, red wine jus', price: '58', note: '14 oz' },
      { name: 'Pan-Seared Appalachian Trout', desc: 'Brown butter, foraged mushrooms, lemon', price: '42' },
      { name: 'Duck Breast', desc: 'Cherry-port reduction, roasted beets, crispy skin', price: '46' },
      { name: 'Braised Short Rib', desc: 'Parsnip purée, glazed carrots, natural jus', price: '44' },
      { name: 'Wild Mushroom Risotto', desc: 'Parmesan, truffle oil, aged balsamic', price: '36', note: 'vegetarian' },
    ],
  },
  {
    id: 'field',
    title: 'Field & Forest',
    subtitle: 'Sides & accompaniments',
    items: [
      { name: 'Roasted Brussels Sprouts', desc: 'Bacon lardon, maple, sherry vinegar', price: '12' },
      { name: 'Duck Fat Fingerlings', desc: 'Rosemary, sea salt', price: '11' },
      { name: 'Seasonal Greens', desc: 'Local lettuces, stone fruit vinaigrette', price: '13' },
      { name: 'Grilled Asparagus', desc: 'Hollandaise, lemon zest', price: '14' },
    ],
  },
  {
    id: 'dessert',
    title: 'Desserts',
    subtitle: 'A graceful finish',
    items: [
      { name: 'Dark Chocolate Tart', desc: 'Bourbon caramel, gold leaf, smoked sea salt', price: '14' },
      { name: 'Apple Tarte Tatin', desc: 'Vanilla bean ice cream, calvados caramel', price: '13' },
      { name: 'Lemon Posset', desc: 'Berry compote, oat crumble', price: '12' },
      { name: 'Artisan Cheese Selection', desc: 'Local honey, seeded crackers, quince paste', price: '18' },
    ],
  },
];

export const featuredDishes = [
  {
    image: '/demos/ridge-bistro/dish-steak.jpg',
    name: 'Dry-Aged Ribeye',
    desc: 'Fourteen ounces of prime beef, finished with herb butter and seasonal roots.',
  },
  {
    image: '/demos/ridge-bistro/dish-trout.jpg',
    name: 'Appalachian Trout',
    desc: 'Line-caught trout from nearby streams, pan-seared in brown butter.',
  },
  {
    image: '/demos/ridge-bistro/dish-duck.jpg',
    name: 'Duck Breast',
    desc: 'Cherry-port reduction with roasted beets and perfectly crisped skin.',
  },
  {
    image: '/demos/ridge-bistro/dish-dessert.jpg',
    name: 'Dark Chocolate Tart',
    desc: 'Bourbon caramel, gold leaf, and a whisper of smoked sea salt.',
  },
];

export const galleryImages = [
  { src: '/demos/ridge-bistro/hero.jpg', alt: 'The Ridge Bistro main dining room' },
  { src: '/demos/ridge-bistro/interior.jpg', alt: 'Reclaimed wood bar and stone backdrop' },
  { src: '/demos/ridge-bistro/private-dining.jpg', alt: 'Private dining room with fireplace' },
  { src: '/demos/ridge-bistro/dish-steak.jpg', alt: 'Dry-aged ribeye' },
  { src: '/demos/ridge-bistro/dish-trout.jpg', alt: 'Pan-seared trout' },
  { src: '/demos/ridge-bistro/dish-charcuterie.jpg', alt: 'Artisan charcuterie board' },
  { src: '/demos/ridge-bistro/dish-duck.jpg', alt: 'Seared duck breast' },
  { src: '/demos/ridge-bistro/dish-dessert.jpg', alt: 'Dark chocolate tart' },
];

export const privateDiningFeatures = [
  'Intimate room for 8–14 guests',
  'Custom tasting menus from our executive chef',
  'Dedicated service team for the evening',
  'Reclaimed wood table with stone fireplace views',
  'Wine pairings curated by our sommelier',
  'Ideal for celebrations, proposals, and corporate gatherings',
];
export const accolades = [
  'Wine Spectator · Award of Excellence',
  'James Beard Foundation · Semifinalist 2025',
  'Forbes Travel Guide · Recommended',
  '4.9 ★ · 600+ Guest Reviews',
];

export interface TastingCourse {
  name: string;
  desc: string;
}

export const tastingMenu = {
  title: "Chef's Tasting Menu",
  courses: '7 courses',
  price: '135',
  pairingPrice: '195',
  blurb:
    'An evening in the hands of Executive Chef Elena Marsh — seven seasonal courses drawn from the mountains, streams, and farms around Ridgeview, composed the morning of your visit.',
  highlights: [
    'Amuse-bouche & fresh-baked sourdough',
    'Ramp & potato velouté, smoked trout roe',
    'Seared scallop, cauliflower, brown butter',
    'Foraged mushroom risotto, aged parmesan',
    'Dry-aged beef or Appalachian trout',
    'Local cheese & honeycomb',
    'Dark chocolate tart, bourbon caramel',
  ],
};

export interface Testimonial {
  quote: string;
  name: string;
  detail: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'The finest meal we have had in West Virginia — full stop. Every course felt like a love letter to these mountains.',
    name: 'Margaret & Tom Whitfield',
    detail: 'Anniversary dinner',
  },
  {
    quote:
      'Elegant without a trace of pretense. The tasting menu with pairings was worth the drive from Charleston and then some.',
    name: 'David Reyes',
    detail: 'Wine Spectator subscriber',
  },
  {
    quote:
      'From the reclaimed-oak room to the last bite of chocolate tart, the whole evening was flawless. Service you rarely find outside a major city.',
    name: 'Katherine Boone',
    detail: 'Private dining guest',
  },
];

export const pressQuotes = [
  { outlet: 'WV Living', line: '“A destination worth planning a weekend around.”' },
  { outlet: 'Southern Kitchen', line: '“Appalachian fine dining, done with real restraint.”' },
  { outlet: 'Gazette-Mail', line: '“Ridgeview’s quiet culinary landmark.”' },
];
