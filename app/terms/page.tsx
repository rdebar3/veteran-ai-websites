/* DRAFT — review with counsel before treating as final terms of service. */
import type { Metadata } from 'next';
import LegalShell from '@/components/LegalShell';
import {
  BUSINESS_LEGAL_NAME,
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  MAILING_ADDRESS,
} from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Terms of Service | Veteran AI Websites',
  description:
    'Plain-language terms for Veteran AI Websites LLC projects, monthly plans, ownership, and revisions.',
  robots: { index: true, follow: true },
};

const UPDATED = 'October 9, 2026';

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated={UPDATED}>
      <h2>Agreement</h2>
      <p>
        These terms apply when you hire {BUSINESS_LEGAL_NAME} for a website on a monthly plan, or
        to pay once and own it today. By paying an invoice or completing checkout, you agree to
        them. Project-specific details in writing (email, proposal, or checkout line items) control
        if they differ from this general page.
      </p>
      <p>
        Contracting party:
        <br />
        {BUSINESS_LEGAL_NAME}
        <br />
        {MAILING_ADDRESS}
        <br />
        <a href={CONTACT_EMAIL_HREF}>{CONTACT_EMAIL}</a>
      </p>

      <h2>Scope of work</h2>
      <p>
        Scope is defined per project in writing: package tier (Starter $49/month, Complete
        $79/month, or Premium $99/month) and the optional Shoppable Store add-on at $497. Nothing
        down — your first payment is month one. To own it today instead, the pay-once prices are
        Starter $497, Complete $797, and Premium $997. Anything outside the agreed scope is a
        change request billed separately.
      </p>

      <h2>Payment</h2>
      <p>
        A monthly plan is a Stripe subscription at that plan’s monthly price, plus the Shoppable
        Store if you add it. Pay once is a single Stripe payment at the pay-once price, plus the
        store if you add it. Failed payments may pause monthly services until resolved.
      </p>

      <h2>Revisions</h2>
      <p>
        Revision rounds included in each package are listed on the pricing section of the website
        (Starter and Complete: 1 round; Premium: 2 rounds). A “round” means one consolidated set of
        feedback on the delivered preview. Extra rounds or out-of-scope redesigns are billed at the
        hourly rate below.
      </p>

      <h2>Ownership</h2>
      <p>Nothing down. Your first payment is month one.</p>
      <p>
        No contract. Cancel anytime. If you cancel before 12 payments, the site comes down, or you
        can pay off the remaining months and keep it.
      </p>
      <p>
        After 12 payments you own the site, the files, and the domain. You can take it anywhere, or
        stay on for $29 a month for hosting and small fixes.
      </p>

      <h2>Monthly plan</h2>
      <p>Nothing down. Your first payment is month one.</p>
      <p>
        No contract. Cancel anytime. If you cancel before 12 payments, the site comes down, or you
        can pay off the remaining months and keep it.
      </p>
      <p>
        After 12 payments you own the site, the files, and the domain. You can take it anywhere, or
        stay on for $29 a month for hosting and small fixes. That month is optional.
      </p>

      <h2>Content changes and hourly rate</h2>
      <p>
        Extra content changes beyond a plan’s monthly allowance (or after any included support
        window) are billed at <strong>$95 per hour</strong>, with a 30-minute minimum.
      </p>

      <h2>No ranking guarantee</h2>
      <p>
        {BUSINESS_LEGAL_NAME} does not guarantee search engine rankings, map pack position, lead
        volume, or revenue. Local SEO and listing work are performed in good faith; results depend
        on competition, your market, reviews, and factors outside the company’s control.
      </p>

      <h2>Your responsibilities</h2>
      <p>
        You confirm you have rights to content and images you provide, and that your business
        information is accurate. You are responsible for responding to customers and for compliance
        with laws that apply to your trade.
      </p>

      <h2>Limitation</h2>
      <p>
        To the fullest extent allowed by West Virginia law, liability of {BUSINESS_LEGAL_NAME} for
        any claim related to a project is limited to the fees you paid for that project in the prior
        three months. {BUSINESS_LEGAL_NAME} is not liable for indirect or consequential damages
        (lost profits, lost data from your own systems, third-party outages).
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms:
        <br />
        {BUSINESS_LEGAL_NAME}
        <br />
        {MAILING_ADDRESS}
        <br />
        <a href={CONTACT_EMAIL_HREF}>{CONTACT_EMAIL}</a>
      </p>
    </LegalShell>
  );
}
