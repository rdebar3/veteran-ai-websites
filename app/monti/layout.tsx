import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './monti-experience.css';

const montiSerif = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-monti-serif',
  display: 'swap',
});

const montiSans = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-monti-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Monti (private)',
  description: 'Private Monti concierge preview — not for public indexing.',
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

export default function MontiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${montiSerif.variable} ${montiSans.variable}`}>
      {children}
    </div>
  );
}
