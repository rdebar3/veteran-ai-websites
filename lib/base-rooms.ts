import { landmarks } from '@/lib/landmarks';
import { scrollToElement } from '@/lib/scroll-driver';

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
  /** Interior chamber atmosphere */
  image: string;
  /** Panoramic window vista — unique landmark per room */
  vistaImage: string;
  vistaName: string;
  vistaOutpost: string;
  accent: string;
  glow: string;
  navLabel: string;
  /** Chamber lighting mood */
  mood: 'crimson' | 'cyan' | 'gold' | 'emerald' | 'amber';
}

export const baseRooms: Record<RoomId, BaseRoomConfig> = {
  'main-gate': {
    id: 'main-gate',
    sectionId: 'hero',
    codename: 'Sector Alpha — Main Gate',
    title: 'Gorge Overlook Command',
    subtitle: 'Secure mountain AI base · West Virginia',
    image: '/rooms/observation-deck.jpg',
    vistaImage: landmarks.newRiverGorge.image,
    vistaName: landmarks.newRiverGorge.name,
    vistaOutpost: landmarks.newRiverGorge.outpost,
    accent: '#22d3ee',
    glow: 'rgba(34, 211, 238, 0.22)',
    navLabel: 'Gate',
    mood: 'cyan',
  },
  armoury: {
    id: 'armoury',
    sectionId: 'build',
    codename: 'Sector Bravo — The Armoury',
    title: 'The Armoury',
    subtitle: 'Select your package and equip your business for launch.',
    image: '/rooms/armoury.jpg',
    vistaImage: '/mountains/misty-ridges.jpg',
    vistaName: 'Misty Appalachian Ridges',
    vistaOutpost: 'Ridge Observation Wing',
    accent: '#c42a3f',
    glow: 'rgba(196, 42, 63, 0.22)',
    navLabel: 'Armoury',
    mood: 'crimson',
  },
  'command-center': {
    id: 'command-center',
    sectionId: 'pricing',
    codename: 'Sector Charlie — Command Center',
    title: 'Command Center',
    subtitle: 'Transparent pricing. Clear scopes. Full ownership.',
    image: '/rooms/command-center.jpg',
    vistaImage: landmarks.wvCapitol.image,
    vistaName: landmarks.wvCapitol.name,
    vistaOutpost: landmarks.wvCapitol.outpost,
    accent: '#22d3ee',
    glow: 'rgba(34, 211, 238, 0.2)',
    navLabel: 'Command',
    mood: 'cyan',
  },
  'mission-planning': {
    id: 'mission-planning',
    sectionId: 'how-it-works',
    codename: 'Sector Delta — Mission Planning',
    title: 'Mission Planning Room',
    subtitle: 'Six precise steps from order to live deployment.',
    image: '/rooms/mission-planning.jpg',
    vistaImage: landmarks.senecaRocks.image,
    vistaName: landmarks.senecaRocks.name,
    vistaOutpost: landmarks.senecaRocks.outpost,
    accent: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.18)',
    navLabel: 'Mission',
    mood: 'gold',
  },
  'observation-deck': {
    id: 'observation-deck',
    sectionId: 'examples',
    codename: 'Sector Echo — Observation Deck',
    title: 'Live Intel · Observation Deck',
    subtitle: 'Survey live demos across every deployment tier.',
    image: '/rooms/observation-deck.jpg',
    vistaImage: '/mountains/golden-overlook.jpg',
    vistaName: 'Golden Hour Overlook',
    vistaOutpost: 'Sunset Recon Platform',
    accent: '#34d399',
    glow: 'rgba(52, 211, 153, 0.15)',
    navLabel: 'Intel',
    mood: 'emerald',
  },
  'after-action-lounge': {
    id: 'after-action-lounge',
    sectionId: 'testimonials',
    codename: 'Sector Foxtrot — After Action Lounge',
    title: 'After Action Lounge',
    subtitle: 'Field reports from West Virginia business owners.',
    image: '/rooms/after-action-lounge.jpg',
    vistaImage: landmarks.spruceKnob.image,
    vistaName: landmarks.spruceKnob.name,
    vistaOutpost: landmarks.spruceKnob.outpost,
    accent: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.14)',
    navLabel: 'Lounge',
    mood: 'amber',
  },
  debrief: {
    id: 'debrief',
    sectionId: 'contact',
    codename: 'Sector Zulu — Debrief & Extraction',
    title: 'Debrief · Extraction Point',
    subtitle: 'Final questions, upgrades, and mission contact.',
    image: '/rooms/debrief.jpg',
    vistaImage: '/landmarks/monongahela-forest.jpg',
    vistaName: 'Monongahela National Forest',
    vistaOutpost: 'Forest Perimeter Station',
    accent: '#c42a3f',
    glow: 'rgba(196, 42, 63, 0.2)',
    navLabel: 'Debrief',
    mood: 'crimson',
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
  scrollToElement(sectionId);
}