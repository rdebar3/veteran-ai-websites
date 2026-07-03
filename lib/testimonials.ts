export interface Testimonial {
  quote: string;
  author: string;
  business: string;
  location: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'I had a site live before dinner. Clean, professional, and exactly what my customers needed. No runaround — just results.',
    author: 'Mike Reynolds',
    business: 'Reynolds Plumbing',
    location: 'Huntington, WV',
  },
  {
    quote:
      'The design feels like a $10k agency build. My bakery gets more online orders every week since launch.',
    author: 'Sarah Whitfield',
    business: 'Whitfield Family Bakery',
    location: 'Morgantown, WV',
  },
  {
    quote:
      'Veteran-owned means something. Clear scope, fair price, full ownership. I recommend this to every local business owner I know.',
    author: 'James Carter',
    business: 'Carter HVAC Services',
    location: 'Charleston, WV',
  },
];