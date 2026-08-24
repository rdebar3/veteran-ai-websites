import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

/**
 * Demo samples are not the marketing site. Hide nav/footer for /d/* only.
 * Global selectors apply while this layout is mounted.
 */
export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        .skip-link, .nav, .footer { display: none !important; }
      `}</style>
      {children}
    </>
  );
}
