import ScheduleCall from '@/components/ScheduleCall';
import { landmarkCredits } from '@/lib/landmarks';
import { MAILING_ADDRESS, PHONE_HREF } from '@/lib/contact';

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
            <a href={PHONE_HREF}>Call</a>
            <span className="footer__phone-note"> — or text, reaches me directly</span>
          </p>
          <ScheduleCall note className="footer__book" />
          <p className="footer__address">{MAILING_ADDRESS}</p>
          <p className="footer__service-area">
            Serving small businesses in all 55 West Virginia counties.
          </p>
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
          <br />
          Built by Rich Debar · Horner, West Virginia
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
      <p className="footer__credits">{landmarkCredits}</p>
    </footer>
  );
}
