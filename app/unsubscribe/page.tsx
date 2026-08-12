/* DRAFT — review with counsel; operational unsubscribe endpoint is live. */
import type { Metadata } from 'next';
import LegalShell from '@/components/LegalShell';
import UnsubscribeForm from './UnsubscribeForm';
import { MAILING_ADDRESS, PHONE, PHONE_HREF } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Unsubscribe | Veteran AI Websites',
  description: 'Opt out of marketing emails from Veteran AI Websites.',
  robots: { index: true, follow: true },
};

const UPDATED = 'August 11, 2026';

export default function UnsubscribePage() {
  return (
    <LegalShell title="Unsubscribe" eyebrow="Email preferences" updated={UPDATED}>
      <p>
        Enter the email address you want removed from Veteran AI Websites marketing lists. This does
        not cancel a paid Hosted or Growth subscription — call or email me for billing changes.
      </p>
      <UnsubscribeForm />
      <h2>Mailing address</h2>
      <p>
        {MAILING_ADDRESS}
        <br />
        Phone: <a href={PHONE_HREF}>{PHONE}</a>
      </p>
    </LegalShell>
  );
}
