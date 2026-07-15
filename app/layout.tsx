import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const SITE = "https://veteranaiwebsites.com";

const businessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE}/#business`,
  name: "Veteran AI Websites",
  url: SITE,
  image: `${SITE}/logo-mark.svg`,
  logo: `${SITE}/logo-mark.svg`,
  description:
    "Veteran-owned web design in West Virginia. Professional, mobile-first small-business websites built in a day — you keep 100% ownership. Starter $397, Complete $697, Premium $997.",
  slogan: "Fast, professional websites, built in a day.",
  priceRange: "$397–$997",
  areaServed: { "@type": "State", name: "West Virginia" },
  address: { "@type": "PostalAddress", addressRegion: "WV", addressCountry: "US" },
  founder: { "@type": "Person", name: "Rich", description: "U.S. Army veteran" },
  knowsAbout: ["Web design", "Small business websites", "Local SEO", "One-day websites"],
  sameAs: ["https://www.facebook.com/profile.php?id=61590561850536"],
  makesOffer: [
    { "@type": "Offer", name: "Starter Website", price: "397", priceCurrency: "USD" },
    { "@type": "Offer", name: "Complete Website", price: "697", priceCurrency: "USD" },
    { "@type": "Offer", name: "Premium Website", price: "997", priceCurrency: "USD" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Veteran AI Websites | One-Day Websites by a West Virginia Veteran",
  description: "Professional one-day websites for West Virginia small businesses. Starter $397 • Complete $697 • Premium $997. Add-ons: Shoppable Store & Monthly Care. Veteran-owned — you keep full ownership.",
  keywords: [
    "West Virginia web design",
    "veteran owned web designer",
    "one day website",
    "small business website West Virginia",
    "affordable website designer WV",
  ],
  applicationName: "Veteran AI Websites",
  authors: [{ name: "Veteran AI Websites" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Veteran AI Websites",
    title: "Veteran AI Websites | One-Day Websites by a West Virginia Veteran",
    description:
      "Veteran-owned, mobile-first websites for West Virginia small businesses — built in a day, you own everything. From $397.",
    images: [{ url: "/hero/hero-gorge-poster.jpg", width: 1440, height: 942, alt: "Veteran AI Websites — West Virginia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Veteran AI Websites | One-Day Websites by a West Virginia Veteran",
    description:
      "Veteran-owned, mobile-first websites for West Virginia small businesses — built in a day. From $397.",
    images: ["/hero/hero-gorge-poster.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
        <SmoothScroll>
          <Navbar />
          {children}
          <Footer />
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}