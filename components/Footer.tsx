import FacebookIcon from '@/components/FacebookIcon';
import { FACEBOOK_URL } from '@/lib/data';
import { landmarkCredits } from '@/lib/landmarks';
import { MAILING_ADDRESS, PHONE, PHONE_HREF } from '@/lib/contact';

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
          <p className="footer__phone">
            <a href={PHONE_HREF}>{PHONE}</a>
            <span className="footer__phone-note"> — call or text</span>
          </p>
          <p className="footer__address">{MAILING_ADDRESS}</p>
          <p className="footer__service-area">
            Serving small businesses in all 55 West Virginia counties.
          </p>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
          >
            <FacebookIcon className="h-4 w-4" aria-hidden="true" />
            Facebook
          </a>
          <nav className="footer__legal" aria-label="Legal">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/unsubscribe">Unsubscribe</a>
          </nav>
        </div>
        <div className="text-sm text-[var(--text-dim)]">
          © {new Date().getFullYear()} Veteran AI Websites
          <br />
          One-day professional websites.
        </div>
        <div className="text-xs text-[var(--text-dim)] max-w-[220px] md:text-right leading-relaxed">
          Fast. Fair. Full ownership.
          <br />
          Built in West Virginia.
        </div>
      </div>
      <p className="footer__motto">
        WV Proud · America 250 · Veteran Built
      </p>
      <p className="footer__credits">{landmarkCredits}</p>
    </footer>
  );
}
