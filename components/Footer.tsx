import ScheduleCall from '@/components/ScheduleCall';
import {
  BUSINESS_LEGAL_NAME,
  BUSINESS_REGION,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  GOOGLE_LISTING_URL,
  MAILING_ADDRESS,
  SERVICE_AREA,
  publicContactLines,
} from '@/lib/contact';

/** Phone, email, then mailing address. An empty constant renders nothing. */
function FooterContact() {
  const lines = publicContactLines({
    phone: CONTACT_PHONE,
    email: CONTACT_EMAIL,
    address: MAILING_ADDRESS,
  });
  if (lines.length === 0) return null;
  return (
    <p className="footer__phone">
      {lines.map((line, index) => (
        <span key={line.kind}>
          {index > 0 ? ' · ' : null}
          {line.kind === 'address' ? line.text : <a href={line.href}>{line.text}</a>}
        </span>
      ))}
    </p>
  );
}

/** Server Component — no "use client". Safe for crawlable contact + service area. */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <div className="footer__brand">
            Veteran <span className="footer__accent">AI</span> Websites
          </div>
          <p className="footer__tagline">West Virginia · U.S. Veteran Owned</p>
          <ScheduleCall note className="footer__book" />
          <p className="footer__service-area">Serving {SERVICE_AREA}.</p>
          <p className="footer__phone">
            <a href={GOOGLE_LISTING_URL} rel="noopener" target="_blank">
              Find us on Google
            </a>
          </p>
          <FooterContact />
          <nav className="footer__legal" aria-label="Legal">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/unsubscribe">Unsubscribe</a>
          </nav>
        </div>
        <div className="text-sm text-[var(--text-dim)]">
          © {new Date().getFullYear()} {BUSINESS_LEGAL_NAME}
          <br />
          One-day professional websites.
          <br />
          Veteran-owned · {BUSINESS_REGION}
        </div>
        <div className="text-xs text-[var(--text-dim)] max-w-[220px] md:text-right leading-relaxed">
          No contract. Cancel anytime.
          <br />
          After 12 payments the site is yours.
          <br />
          Built in West Virginia.
        </div>
      </div>
      <p className="footer__motto">
        WV Proud · America 250 · Veteran Built
      </p>
    </footer>
  );
}
