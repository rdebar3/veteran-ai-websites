export interface MountainLayer {
  id: string;
  src: string;
  alt: string;
  label: string;
  elevation: string;
  /** Scroll progress 0–1 where layer peaks in opacity */
  peak: number;
}

export const mountainLayers: MountainLayer[] = [
  {
    id: 'hero-vista',
    src: '/mountains/hero-vista.jpg',
    alt: 'Golden hour vista over West Virginia Appalachian mountains',
    label: 'Summit Vista',
    elevation: '4,100 ft',
    peak: 0,
  },
  {
    id: 'foothills',
    src: '/mountains/foothills.jpg',
    alt: 'Misty foothills of the Appalachian range at dawn',
    label: 'Foothills',
    elevation: '1,800 ft',
    peak: 0.22,
  },
  {
    id: 'misty-ridges',
    src: '/mountains/misty-ridges.jpg',
    alt: 'Misty blue-hour ridges through West Virginia forest',
    label: 'Misty Ridge',
    elevation: '2,600 ft',
    peak: 0.42,
  },
  {
    id: 'golden-overlook',
    src: '/mountains/golden-overlook.jpg',
    alt: 'Golden hour overlook across layered mountain ridges',
    label: 'Golden Overlook',
    elevation: '3,200 ft',
    peak: 0.62,
  },
  {
    id: 'summit',
    src: '/mountains/summit.jpg',
    alt: 'Summit view from the highest Appalachian peak at sunset',
    label: 'Summit',
    elevation: '4,863 ft',
    peak: 0.85,
  },
];

export interface JourneySection {
  id: string;
  location: string;
  elevation: string;
  layerIndex: number;
}

export const journeySections: JourneySection[] = [
  { id: 'hero', location: 'Summit Vista', elevation: '4,100 ft', layerIndex: 0 },
  { id: 'build', location: 'Foothills', elevation: '1,800 ft', layerIndex: 1 },
  { id: 'pricing', location: 'Misty Ridge', elevation: '2,600 ft', layerIndex: 2 },
  { id: 'how-it-works', location: 'Golden Overlook', elevation: '3,200 ft', layerIndex: 3 },
  { id: 'examples', location: 'High Vista', elevation: '3,800 ft', layerIndex: 3 },
  { id: 'testimonials', location: 'Ridgeline', elevation: '3,400 ft', layerIndex: 3 },
  { id: 'addons', location: 'Upper Slopes', elevation: '4,000 ft', layerIndex: 4 },
  { id: 'faq', location: 'Summit Approach', elevation: '4,500 ft', layerIndex: 4 },
  { id: 'contact', location: 'Summit', elevation: '4,863 ft', layerIndex: 4 },
];