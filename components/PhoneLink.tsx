import { PHONE_HREF } from '@/lib/contact';

type PhoneLinkProps = {
  className?: string;
  /** Visible label. Defaults to "Call". Never shows the raw number. */
  children?: React.ReactNode;
};

/** Tappable tel: link — label only, no visible phone number. */
export default function PhoneLink({ className, children = 'Call' }: PhoneLinkProps) {
  return (
    <a href={PHONE_HREF} className={className}>
      {children}
    </a>
  );
}
