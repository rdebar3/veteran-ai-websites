/* DRAFT — review with counsel before treating as final terms of service. */
import type { Metadata } from 'next';
import LegalShell from '@/components/LegalShell';
import { MAILING_ADDRESS, PHONE, PHONE_HREF } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Terms of Service | Veteran AI Websites',
  description:
    'Plain-language terms for Veteran AI Websites projects, ownership, revisions, and monthly plans.',
  robots: { index: true, follow: true },
};

const UPDATED = 'August 11, 2026';

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated={UPDATED}>
      <h2>Agreement</h2>
      <p>
        These terms apply when you hire Veteran AI Websites (Richard E. Debar III, Horner, WV) for a
        website build or monthly plan. By paying an invoice or completing checkout, you agree to
        them. Project-specific details in writing (email, proposal, or checkout line items) control
        if they differ from this general page.
      </p>

      <h2>Scope of work</h2>
      <p>
        Scope is defined per project in writing: package tier (Essential, Standard, or Advanced),
        optional Online Store add-on, and care plan (Keys, Hosted, or Growth). Pro is available only
        by consultation and is not sold through self-serve checkout. Anything outside the agreed
        scope is a change request billed separately.
      </p>

      <h2>Payment</h2>
      <p>
        One-time build fees and add-ons are charged as stated at checkout or on your invoice.
        Growth includes a $500 credit off the one-time build when that plan is selected at purchase.
        Monthly Hosted and Growth fees bill on a recurring subscription through Stripe. Failed
        payments may pause monthly services until resolved.
      </p>

      <h2>Revisions</h2>
      <p>
        Revision rounds included in each package are listed on the pricing section of the website
        (Essential: 1 round; Standard and Advanced: 2 rounds). A “round” means one consolidated set
        of feedback on the delivered preview. Extra rounds or out-of-scope redesigns are billed at
        the hourly rate below.
      </p>

      <h2>What ownership transfer includes</h2>
      <p>On every plan, when the site is delivered you get:</p>
      <ul>
        <li>All your site files, delivered as a download you keep</li>
        <li>Your domain in an account with your name on it — not mine</li>
        <li>
          A written handoff document listing where everything lives: domain, hosting, DNS, and
          where form submissions go
        </li>
        <li>A short recorded walkthrough for basic edits</li>
      </ul>
      <p>
        If you are on a monthly plan and you cancel, you keep the site. No license, no lock-in, no
        clause that takes it back.
      </p>

      <h2>Keys plan — support window</h2>
      <p>
        Keys includes 30 days of support after launch for bugs and handoff questions. Hosting,
        backups, and renewals become yours to manage after handoff.
      </p>

      <h2>Content changes and hourly rate</h2>
      <p>
        Extra content changes beyond a plan’s monthly allowance (or after the Keys support window)
        are billed at <strong>$95 per hour</strong>, with a 30-minute minimum.
      </p>

      <h2>Monthly plans (Hosted and Growth)</h2>
      <p>
        Monthly plans are <strong>month-to-month from day one</strong>. There is no 90-day or other
        minimum commitment. You may cancel with <strong>30 days’ written notice</strong> (email is
        fine). On cancellation, a keys handoff is included so you keep the site, files, and domain
        access as described above. Pro, when engaged by consultation, will follow the same
        month-to-month cancellation principle unless we agree otherwise in writing.
      </p>

      <h2>No ranking guarantee</h2>
      <p>
        I do not guarantee search engine rankings, map pack position, lead volume, or revenue.
        Local SEO and listing work are performed in good faith; results depend on competition,
        your market, reviews, and factors outside my control.
      </p>

      <h2>Your responsibilities</h2>
      <p>
        You confirm you have rights to content and images you provide, and that your business
        information is accurate. You are responsible for responding to customers and for
        compliance with laws that apply to your trade.
      </p>

      <h2>Limitation</h2>
      <p>
        To the fullest extent allowed by West Virginia law, liability for any claim related to a
        project is limited to the fees you paid for that project in the prior three months. I am
        not liable for indirect or consequential damages (lost profits, lost data from your own
        systems, third-party outages).
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms:{' '}
        <a href={PHONE_HREF}>{PHONE}</a>
        <br />
        {MAILING_ADDRESS}
      </p>
    </LegalShell>
  );
}
