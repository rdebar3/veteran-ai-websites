/* DRAFT — review with counsel before treating as final terms of service. */
import type { Metadata } from 'next';
import LegalShell, { LegalContact } from '@/components/LegalShell';
import { BUSINESS_LEGAL_NAME } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Terms of Service | Veteran AI Websites',
  description:
    'Plain-language terms for Veteran AI Websites LLC projects, monthly plans, ownership, and revisions.',
  robots: { index: true, follow: true },
};

const UPDATED = 'October 11, 2026';

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated={UPDATED}>
      <h2>Agreement</h2>
      <p>
        These terms apply when you hire {BUSINESS_LEGAL_NAME} for a website on a monthly plan, or
        to pay once and own it today. By approving your site and making your first payment, you
        agree to them. Project-specific details in writing (email, proposal, or checkout line items) control
        if they differ from this general page.
      </p>
      <p>
        Contracting party:
        <br />
        <LegalContact />
      </p>

      <h2>Scope of work</h2>
      <p>
        Scope is defined per project in writing: package tier (Starter $49/month, Complete
        $79/month, or Premium $99/month) and the optional Shoppable Store add-on at $497. Nothing
        down — your first payment is month one. To own it today instead, the pay-once prices are
        Starter $497, Complete $797, and Premium $997. Nothing is charged until you’ve seen your
        site and approved it. Anything outside the agreed scope is a change request billed
        separately.
      </p>

      <h2>Payment</h2>
      <p>
        After you approve the site, I send a secure Stripe payment link. A monthly plan is a Stripe
        subscription at that plan’s monthly price. Pay once is a single payment at the pay-once
        price. The Shoppable Store, if you add it, is a one-time $497 charge with that first
        payment. Failed payments may pause a monthly plan until resolved.
      </p>

      <h2>Revisions</h2>
      <p>
        Revision rounds included in each package are listed on the pricing section of the website
        (Starter and Complete: 1 round; Premium: 2 rounds). A “round” means one consolidated set of
        feedback on the delivered preview. Extra rounds or out-of-scope redesigns are billed at the
        hourly rate below.
      </p>

      <h2>Ownership</h2>
      <p>
        Nothing down, and nothing until you’ve seen it. You approve the site, then your first
        payment is month one.
      </p>
      <p>
        No contract. Cancel anytime. If you cancel before 12 payments, the site comes down, or you
        can pay off the remaining months and keep it.
      </p>
      <p>
        After 12 payments you own the site, the files, and the domain. You can take it anywhere, or
        stay on for $29 a month for hosting and small fixes.
      </p>

      <h2>Veterans</h2>
      <p>
        Veterans get their first three monthly payments waived. Same plan, same rules; the three
        waived months count toward your 12.
      </p>

      <h2>Content changes and hourly rate</h2>
      <p>
        Small text and photo changes are included in every monthly plan. New pages, redesigns, or
        work outside the agreed scope are quoted separately; where billed hourly, the rate is $95
        per hour with a 30-minute minimum.
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
        <LegalContact />
      </p>
    </LegalShell>
  );
}
