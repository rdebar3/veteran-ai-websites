export type RoomId =
  | 'main-gate'
  | 'armoury'
  | 'command-center'
  | 'mission-planning'
  | 'observation-deck'
  | 'after-action-lounge'
  | 'debrief';

export interface BaseRoomConfig {
  id: RoomId;
  sectionId: string;
  codename: string;
  title: string;
  subtitle: string;
  image: string;
  accent: string;
  glow: string;
  navLabel: string;
}

export const baseRooms: Record<RoomId, BaseRoomConfig> = {
  'main-gate': {
    id: 'main-gate',
    sectionId: 'hero',
    codename: 'Sector Alpha — Main Gate',
    title: 'Main Gate Overlook',
    subtitle: 'Secure mountain command base · West Virginia',
    image: '/mountains/hero-vista.webp',
    accent: '#c9a227',
    glow: 'rgba(201, 162, 39, 0.18)',
    navLabel: 'Gate',
  },
  armoury: {
    id: 'armoury',
    sectionId: 'build',
    codename: 'Sector Bravo — The Armoury',
    title: 'The Armoury',
    subtitle: 'Select your package and equip your business for launch.',
    image: '/rooms/armoury.jpg',
    accent: '#c42a3f',
    glow: 'rgba(196, 42, 63, 0.22)',
    navLabel: 'Armoury',
  },
  'command-center': {
    id: 'command-center',
    sectionId: 'pricing',
    codename: 'Sector Charlie — Command Center',
    title: 'Command Center',
    subtitle: 'Transparent pricing. Clear scopes. Full ownership.',
    image: '/rooms/command-center.jpg',
    accent: '#22d3ee',
    glow: 'rgba(34, 211, 238, 0.2)',
    navLabel: 'Command',
  },
  'mission-planning': {
    id: 'mission-planning',
    sectionId: 'how-it-works',
    codename: 'Sector Delta — Mission Planning',
    title: 'Mission Planning Room',
    subtitle: 'Six precise steps from order to live deployment.',
    image: '/rooms/mission-planning.jpg',
    accent: '#c9a227',
    glow: 'rgba(201, 162, 39, 0.16)',
    navLabel: 'Mission',
  },
  'observation-deck': {
    id: 'observation-deck',
    sectionId: 'examples',
    codename: 'Sector Echo — Observation Deck',
    title: 'Live Intel · Observation Deck',
    subtitle: 'Survey live demos across every deployment tier.',
    image: '/rooms/observation-deck.jpg',
    accent: '#34d399',
    glow: 'rgba(52, 211, 153, 0.15)',
    navLabel: 'Intel',
  },
  'after-action-lounge': {
    id: 'after-action-lounge',
    sectionId: 'testimonials',
    codename: 'Sector Foxtrot — After Action Lounge',
    title: 'After Action Lounge',
    subtitle: 'Field reports from West Virginia business owners.',
    image: '/rooms/after-action-lounge.jpg',
    accent: '#c9a227',
    glow: 'rgba(201, 162, 39, 0.14)',
    navLabel: 'Lounge',
  },
  debrief: {
    id: 'debrief',
    sectionId: 'debrief',
    codename: 'Sector Zulu — Debrief & Extraction',
    title: 'Debrief · Extraction Point',
    subtitle: 'Final questions, upgrades, and mission contact.',
    image: '/rooms/debrief.jpg',
    accent: '#c42a3f',
    glow: 'rgba(196, 42, 63, 0.2)',
    navLabel: 'Debrief',
  },
};

export const navRooms: BaseRoomConfig[] = [
  baseRooms.armoury,
  baseRooms['command-center'],
  baseRooms['mission-planning'],
  baseRooms['observation-deck'],
  baseRooms['after-action-lounge'],
  baseRooms.debrief,
];

export function scrollToRoom(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}