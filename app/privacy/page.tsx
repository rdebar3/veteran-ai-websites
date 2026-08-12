/* DRAFT — review with counsel before treating as final legal policy. */
import type { Metadata } from 'next';
import LegalShell from '@/components/LegalShell';
import { MAILING_ADDRESS, PHONE, PHONE_HREF } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Privacy Policy | Veteran AI Websites',
  description:
    'How Veteran AI Websites collects and uses contact and review form information. Plain language.',
  robots: { index: true, follow: true },
};

const UPDATED = 'August 11, 2026';

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated={UPDATED}>
      <h2>Who I am</h2>
      <p>
        Veteran AI Websites is a sole-proprietor web design business operated by Richard E. Debar
        III in Horner, West Virginia. This page explains how I handle information you send me
        through this website.
      </p>

      <h2>What the forms collect</h2>
      <p>The contact form and the review form may collect:</p>
      <ul>
        <li>Name</li>
        <li>Business name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Message or review text (and a star rating on the review form)</li>
      </ul>
      <p>
        I only ask for what I need to respond to your inquiry or to publish a review you chose to
        submit.
      </p>

      <h2>How it is used</h2>
      <p>
        Contact and project inquiries are used only to respond to you about a possible website
        project or related service. Review submissions are used to moderate and, if approved,
        display your review on this site. I do not sell your information. I do not share it with
        third parties for their marketing.
      </p>

      <h2>Who processes it</h2>
      <p>
        Form data is stored in a secure database used to run this business (currently Supabase).
        Payment checkout, if you use it, is handled by Stripe — I do not store full card numbers on
        this site. Hosting is on Vercel. Those providers process data under their own terms as
        needed to run the service.
      </p>

      <h2>How long it is kept</h2>
      <p>
        Inquiries are kept as long as they are useful to serve you or to maintain ordinary business
        records (typically up to two years, or longer if we have an active project or legal need).
        Approved reviews may remain published until you ask for removal. Unapproved or withdrawn
        reviews are deleted or left unpublished.
      </p>

      <h2>Your choices</h2>
      <p>
        You can request a copy of what I hold about you, ask for a correction, or ask me to delete
        your inquiry or review. Email or call using the contact details below. For marketing email
        opt-out, use the{' '}
        <a href="/unsubscribe">unsubscribe page</a>.
      </p>

      <h2>How to reach me</h2>
      <p>
        <a href={PHONE_HREF}>{PHONE}</a>
        <br />
        {MAILING_ADDRESS}
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes in a material way, I will update the “Last updated” date at the top
        of this page.
      </p>
    </LegalShell>
  );
}
