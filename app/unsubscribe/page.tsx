/* DRAFT — review with counsel; operational unsubscribe endpoint is live. */
import type { Metadata } from 'next';
import LegalShell from '@/components/LegalShell';
import UnsubscribeForm from './UnsubscribeForm';
import {
  BUSINESS_LEGAL_NAME,
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  MAILING_ADDRESS,
} from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Unsubscribe | Veteran AI Websites',
  description: 'Opt out of marketing emails from Veteran AI Websites LLC.',
  robots: { index: true, follow: true },
};

const UPDATED = 'August 13, 2026';

export default function UnsubscribePage() {
  return (
    <LegalShell title="Unsubscribe" eyebrow="Email preferences" updated={UPDATED}>
      <p>
        Enter the email address you want removed from {BUSINESS_LEGAL_NAME} marketing lists. This
        does not cancel a paid Managed subscription — contact {BUSINESS_LEGAL_NAME} for billing
        changes.
      </p>
      <UnsubscribeForm />
      <h2>Contacting party</h2>
      <p>
        {BUSINESS_LEGAL_NAME}
        <br />
        {MAILING_ADDRESS}
        <br />
        <a href={CONTACT_EMAIL_HREF}>{CONTACT_EMAIL}</a>
      </p>
    </LegalShell>
  );
}
