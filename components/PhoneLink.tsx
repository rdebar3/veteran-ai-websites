import { PHONE, PHONE_HREF } from '@/lib/contact';

type PhoneLinkProps = {
  className?: string;
  /** When true, show only the number (no extra label text). */
  numberOnly?: boolean;
  children?: React.ReactNode;
};

/** Tappable tel: link — use beside CTAs and in chrome. */
export default function PhoneLink({ className, numberOnly, children }: PhoneLinkProps) {
  return (
    <a href={PHONE_HREF} className={className}>
      {children ?? (numberOnly ? PHONE : PHONE)}
    </a>
  );
}
