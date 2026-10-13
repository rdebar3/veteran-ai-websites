import type { Metadata } from 'next';
import Link from 'next/link';
import Reviews from '@/components/Reviews';

export const metadata: Metadata = {
  title: 'Leave a review | Veteran AI Websites',
  description: 'Leave a review of Veteran AI Websites.',
  robots: { index: false, follow: false },
};

/** Client review form. Linked for clients. The homepage section stays hidden until a review is approved. */
export default function ReviewPage() {
  return (
    <main id="main-content" className="relative flex-1">
      <Reviews
        formOnly
        afterHeading={
          <p className="rv__sub">
            This page is for Veteran AI Websites clients. Thinking about a site? The{' '}
            <Link href="/">home page</Link> is the place to start.
          </p>
        }
      />
    </main>
  );
}
