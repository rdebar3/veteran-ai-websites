import FacebookIcon from '@/components/FacebookIcon';
import { FACEBOOK_URL } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <div className="footer__brand">
            Veteran <span className="footer__accent">AI</span> Websites
          </div>
          <p className="footer__tagline">West Virginia · U.S. Veteran Owned</p>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
          >
            <FacebookIcon className="h-4 w-4" />
            Facebook
          </a>
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
    </footer>
  );
}