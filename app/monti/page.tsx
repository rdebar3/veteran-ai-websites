import { permanentRedirect } from 'next/navigation';

/** Typed-only Monti retired — single experience at /monti/live. */
export default function MontiPage() {
  permanentRedirect('/monti/live');
}
