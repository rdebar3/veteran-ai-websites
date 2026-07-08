'use client';

import HeroCinematic from '@/components/HeroCinematic';
import MissionBriefingDeck from '@/components/MissionBriefingDeck';

/**
 * Immersive homepage only:
 * Hero → 7-chapter Mission Briefing Deck (all content + commerce inside).
 */
export default function Home() {
  return (
    <main className="relative flex-1">
      <HeroCinematic />
      <MissionBriefingDeck />
    </main>
  );
}
