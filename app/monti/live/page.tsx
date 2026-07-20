import MontiLiveClient from '@/components/monti/MontiLiveClient';

/**
 * Phase A LiveKit voice test route.
 * Hidden (inherits monti layout noindex). Does not replace /monti.
 */
export default function MontiLivePage() {
  return <MontiLiveClient />;
}
