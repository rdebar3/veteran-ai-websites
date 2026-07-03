import FacebookIcon from '@/components/FacebookIcon';
import { FACEBOOK_URL } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="footer-premium">
      <div className="footer-premium__inner">
        <div>
          <div className="footer-premium__brand">Veteran AI Websites</div>
          <p className="footer-premium__tagline">West Virginia · U.S. Veteran Owned</p>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm text-[var(--text-dim)] hover:text-[var(--text-cream)] transition-colors"
          >
            <FacebookIcon className="h-4 w-4" />
            Follow on Facebook
          </a>
        </div>

        <div className="text-sm text-[var(--text-dim)]">
          © {new Date().getFullYear()} Veteran AI Websites
          <br />
          One-day professional websites for local businesses.
        </div>

        <div className="text-xs text-[var(--text-dim)] max-w-[220px] md:text-right leading-relaxed">
          Fast websites. Fair prices. Full ownership.
          <br />
          Built with pride in West Virginia.
        </div>
      </div>
      <p className="footer-premium__motto">
        Proudly built in West Virginia · Honoring America 250 · Long Live the Republic
      </p>
    </footer>
  );
}