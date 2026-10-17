export const demoNote =
  'Demo site by Veteran AI Websites. Business, reviews and photos are samples.';

export const thanks = 'Got it — we’ll call you back within the hour.';

export const name = 'The Ridge Bistro';
export const town = 'Ridgeview, WV';
export const dinnerLine = 'Dinner, Tuesday to Sunday from 5';
export const phone = '(304) 555-0381';
export const phoneHref = 'tel:+13045550381';
export const addressLine = '214 Summit Ridge Road, Ridgeview, WV';
export const parking = 'The lot is behind the building. Street parking on Summit Ridge Road after 5.';

export const callLabel = 'Call';
export const reserveLabel = 'Reserve';
export const reserveHref = '/examples/premium-restaurant/reservations';

export const nav = [
  { href: '/examples/premium-restaurant', label: 'Home' },
  { href: '/examples/premium-restaurant/menu', label: 'Menu' },
  { href: '/examples/premium-restaurant/gallery', label: 'Gallery' },
  { href: '/examples/premium-restaurant/private-dining', label: 'Private Dining' },
  { href: '/examples/premium-restaurant/reservations', label: 'Reservations' },
  { href: '/examples/premium-restaurant/about', label: 'About' },
  { href: '/examples/premium-restaurant/contact', label: 'Contact' },
];

export const hero = {
  headline: 'Dinner, slowly.',
  deck: 'A small room, a short menu, and the evening left unhurried.',
  primary: 'Reserve a table',
  primaryHref: '/examples/premium-restaurant/reservations',
  secondary: 'View the menu',
  secondaryHref: '/examples/premium-restaurant/menu',
  photo: {
    src: '/demos/ridge-bistro/hero.webp',
    alt: 'A plated fish supper with mushrooms and herbs',
  },
};

export const hours = [
  { days: 'Tuesday – Thursday', time: '5:00pm – 9:30pm' },
  { days: 'Friday – Saturday', time: '5:00pm – 10:30pm' },
  { days: 'Sunday', time: '5:00pm – 9:00pm' },
  { days: 'Monday', time: 'Closed' },
];

export const dishes = [
  {
    src: '/demos/ridge-bistro/dish-steak.webp',
    alt: 'A sliced ribeye on a plate',
    name: 'Dry-aged ribeye',
    text: 'Herb butter and the roots that are in this week.',
  },
  {
    src: '/demos/ridge-bistro/dish-trout.webp',
    alt: 'Pan-seared trout with mushrooms',
    name: 'Appalachian trout',
    text: 'Brown butter, lemon, and what the stream gave up.',
  },
  {
    src: '/demos/ridge-bistro/dish-duck.webp',
    alt: 'Seared duck breast with a dark sauce',
    name: 'Duck breast',
    text: 'Crisped skin, cherry, and roasted beets.',
  },
];

export const menuNote =
  'The menu moves with the season. Ask your server what came in this week. Tell us about allergies when you reserve.';

export const menu = [
  {
    id: 'starters',
    title: 'Starters',
    items: [
      { name: 'Ridge charcuterie', desc: 'Aged cheese, cured meat, local honeycomb', price: '$28' },
      { name: 'Ramp and potato velouté', desc: 'Smoked trout roe, chive oil', price: '$16' },
      { name: 'Beet and goat cheese tart', desc: 'Walnut crust, aged balsamic', price: '$18', mark: 'vegetarian' },
      { name: 'Seared scallops', desc: 'Cauliflower, brown butter, sage', price: '$22' },
    ],
  },
  {
    id: 'mains',
    title: 'Mains',
    items: [
      { name: 'Dry-aged ribeye', desc: 'Herb butter, roasted roots, red wine jus', price: '$58' },
      { name: 'Appalachian trout', desc: 'Brown butter, foraged mushrooms, lemon', price: '$42' },
      { name: 'Duck breast', desc: 'Cherry, roasted beets, crisped skin', price: '$46' },
      {
        name: 'Wild mushroom risotto',
        desc: 'Parmesan, aged balsamic',
        price: '$36',
        mark: 'vegetarian',
      },
    ],
  },
  {
    id: 'dessert',
    title: 'Dessert',
    items: [
      { name: 'Dark chocolate tart', desc: 'Bourbon caramel, smoked salt', price: '$14' },
      { name: 'Apple tarte tatin', desc: 'Vanilla ice cream', price: '$13' },
      { name: 'Lemon posset', desc: 'Berry compote, oat crumble', price: '$12', mark: 'vegetarian' },
    ],
  },
];

export const gallery = [
  { src: '/demos/ridge-bistro/hero.webp', alt: 'A plated fish supper', caption: 'Supper, plated.' },
  { src: '/demos/ridge-bistro/interior.webp', alt: 'The Ridge Bistro dining room', caption: 'The dining room.' },
  { src: '/demos/ridge-bistro/private-dining.webp', alt: 'The private dining room', caption: 'The private room.' },
  { src: '/demos/ridge-bistro/dish-steak.webp', alt: 'Dry-aged ribeye', caption: 'Dry-aged ribeye.' },
  { src: '/demos/ridge-bistro/dish-trout.webp', alt: 'Pan-seared trout', caption: 'Trout.' },
  { src: '/demos/ridge-bistro/dish-charcuterie.webp', alt: 'A charcuterie board', caption: 'To start.' },
  { src: '/demos/ridge-bistro/dish-duck.webp', alt: 'Duck breast', caption: 'Duck.' },
  { src: '/demos/ridge-bistro/dish-dessert.webp', alt: 'Dark chocolate tart', caption: 'Chocolate tart.' },
];

export const privateDining = {
  photo: {
    src: '/demos/ridge-bistro/private-dining.webp',
    alt: 'A private dining table set for the evening',
  },
  title: 'The room down the hall.',
  lead: 'One table, a fireplace, and the kitchen’s attention for the night. The room seats 8 to 14.',
  menus: [
    { name: 'Family table', detail: 'Four courses for the room, $78 a guest.' },
    { name: 'Long dinner', detail: 'Seven courses, $135 a guest. Wine pairing $60.' },
  ],
};

export const about = {
  photo: {
    src: '/demos/ridge-bistro/interior.webp',
    alt: 'Tables set in the Ridge Bistro dining room',
  },
  title: 'A room Elena Marsh cooks for.',
  paragraphs: [
    'The Ridge Bistro is a small dining room on Summit Ridge Road. Executive Chef Elena Marsh writes the menu in the morning from what the farms and the streams brought in.',
    'There is no second seating rush and no loud room next door. Dinner is the whole point of the place.',
  ],
};

export const navLinks = nav;
export const BISTRO_PHONE = phone;
export const BISTRO_PHONE_HREF = phoneHref;
export const BISTRO_ADDRESS = addressLine;
export const BISTRO_EMAIL = 'reservations@theridgebistro.example';
export const galleryImages = gallery.map(({ src, alt }) => ({ src, alt }));
export const featuredDishes = dishes.map((dish) => ({
  image: dish.src,
  name: dish.name,
  desc: dish.text,
}));
export const menuSections = menu.map((group) => ({
  id: group.id,
  title: group.title,
  subtitle: group.title,
  items: group.items.map((item) => ({
    name: item.name,
    desc: item.desc,
    price: item.price,
    note: item.mark,
  })),
}));
export const privateDiningFeatures = [
  privateDining.lead,
  ...privateDining.menus.map((item) => `${item.name}: ${item.detail}`),
];

export const reviews = [
  {
    quote:
      'The finest meal we have had in West Virginia. Every course felt like it belonged to these mountains.',
    name: 'Margaret & Tom Whitfield',
    town: 'Anniversary dinner',
  },
  {
    quote: 'Elegant without a trace of pretense. The tasting menu was worth the drive from Charleston.',
    name: 'David Reyes',
    town: 'Charleston, WV',
  },
  {
    quote: 'From the first pour to the last bite of chocolate tart, the evening stayed quiet and exact.',
    name: 'Katherine Boone',
    town: 'Private dining',
  },
  {
    quote: 'We came for a weeknight supper and stayed through the whole list. Nothing was rushed.',
    name: 'Helen Price',
    town: 'Ridgeview, WV',
  },
];
