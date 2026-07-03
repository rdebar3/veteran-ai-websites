export interface WVLandmark {
  id: string;
  name: string;
  location: string;
  image: string;
  imageAlt: string;
  outpost: string;
  /** Optional command-room interior accent blended at the edges */
  roomAccent?: string;
}

export const landmarks: Record<string, WVLandmark> = {
  newRiverGorge: {
    id: 'new-river-gorge',
    name: 'New River Gorge Bridge',
    location: 'Fayetteville, WV',
    image: '/landmarks/new-river-gorge-bridge.jpg',
    imageAlt: 'New River Gorge Bridge spanning the gorge near Fayetteville, West Virginia',
    outpost: 'Gorge Overlook Station',
    roomAccent: '/rooms/observation-deck.jpg',
  },
  senecaRocks: {
    id: 'seneca-rocks',
    name: 'Seneca Rocks',
    location: 'Monongahela National Forest',
    image: '/landmarks/seneca-rocks.jpg',
    imageAlt: 'Seneca Rocks formation in Pendleton County, West Virginia',
    outpost: 'Ridge Command Outpost',
    roomAccent: '/rooms/command-center.jpg',
  },
  spruceKnob: {
    id: 'spruce-knob',
    name: 'Spruce Knob',
    location: 'Highest Point in WV — 4,863 ft',
    image: '/landmarks/spruce-knob.jpg',
    imageAlt: 'Spruce Knob summit in the Allegheny Mountains, West Virginia',
    outpost: 'Summit Watch Tower',
    roomAccent: '/rooms/mission-planning.jpg',
  },
  wvCapitol: {
    id: 'wv-capitol',
    name: 'West Virginia State Capitol',
    location: 'Charleston, WV',
    image: '/landmarks/wv-state-capitol.jpg',
    imageAlt: 'West Virginia State Capitol building reflected on the Kanawha River in Charleston',
    outpost: 'Capitol Sector HQ',
    roomAccent: '/rooms/debrief.jpg',
  },
  appalachianRidges: {
    id: 'appalachian-ridges',
    name: 'Appalachian Ridges',
    location: 'Allegheny Highlands',
    image: '/landmarks/appalachian-ridges.jpg',
    imageAlt: 'Misty Appalachian mountain ridges of West Virginia',
    outpost: 'Highland Perimeter Base',
    roomAccent: '/rooms/after-action-lounge.jpg',
  },
};

export const landmarkCredits =
  'Cinematic West Virginia landscapes — veteran-owned AI web studio.';