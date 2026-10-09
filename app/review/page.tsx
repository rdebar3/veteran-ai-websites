import type { Metadata } from 'next';
import Reviews from '@/components/Reviews';

export const metadata: Metadata = {
  title: 'Leave a review | Veteran AI Websites',
  description: 'Leave a review of Veteran AI Websites.',
};

/** Client review form. Linked for clients. The homepage section stays hidden until a review is approved. */
export default function ReviewPage() {
  return (
    <main id="main-content" className="relative flex-1">
      <Reviews formOnly />
    </main>
  );
}
