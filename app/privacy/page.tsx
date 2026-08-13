/* DRAFT — review with counsel before treating as final legal policy. */
import type { Metadata } from 'next';
import LegalShell from '@/components/LegalShell';
import {
  BUSINESS_LEGAL_NAME,
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  MAILING_ADDRESS,
} from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Privacy Policy | Veteran AI Websites',
  description:
    'How Veteran AI Websites LLC collects and uses contact and review form information. Plain language.',
  robots: { index: true, follow: true },
};

const UPDATED = 'August 13, 2026';

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated={UPDATED}>
      <h2>Who you are dealing with</h2>
      <p>
        {BUSINESS_LEGAL_NAME} is a West Virginia limited liability company. Mailing address:{' '}
        {MAILING_ADDRESS}. Email:{' '}
        <a href={CONTACT_EMAIL_HREF}>{CONTACT_EMAIL}</a>. This page explains how{' '}
        {BUSINESS_LEGAL_NAME} handles information you send through this website.
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
        {BUSINESS_LEGAL_NAME} only asks for what is needed to respond to your inquiry or to publish
        a review you chose to submit.
      </p>

      <h2>How it is used</h2>
      <p>
        Contact and project inquiries are used only to respond to you about a possible website
        project or related service. Review submissions are used to moderate and, if approved,
        display your review on this site. {BUSINESS_LEGAL_NAME} does not sell your information and
        does not share it with third parties for their marketing.
      </p>

      <h2>Who processes it</h2>
      <p>
        Form data is stored in a secure database used to run this business (currently Supabase).
        Payment checkout, if you use it, is handled by Stripe — full card numbers are not stored on
        this site. Hosting is on Vercel. Those providers process data under their own terms as
        needed to run the service.
      </p>

      <h2>How long it is kept</h2>
      <p>
        Inquiries are kept as long as they are useful to serve you or to maintain ordinary business
        records (typically up to two years, or longer if there is an active project or legal need).
        Approved reviews may remain published until you ask for removal. Unapproved or withdrawn
        reviews are deleted or left unpublished.
      </p>

      <h2>Your choices</h2>
      <p>
        You can request a copy of what {BUSINESS_LEGAL_NAME} holds about you, ask for a correction,
        or ask to delete your inquiry or review. Email using the contact details below. For
        marketing email opt-out, use the <a href="/unsubscribe">unsubscribe page</a>.
      </p>

      <h2>How to reach {BUSINESS_LEGAL_NAME}</h2>
      <p>
        {BUSINESS_LEGAL_NAME}
        <br />
        {MAILING_ADDRESS}
        <br />
        <a href={CONTACT_EMAIL_HREF}>{CONTACT_EMAIL}</a>
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes in a material way, the “Last updated” date at the top of this page
        will be updated.
      </p>
    </LegalShell>
  );
}
