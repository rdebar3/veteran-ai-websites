import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Veteran AI Websites | One-Day Websites by a West Virginia Veteran",
  description: "Professional websites for small businesses across West Virginia — built fast by a U.S. veteran (1 day for Starter & Complete, priority 1-2 days for Premium). Starter $297 • Complete $497 (Most Popular) • Premium $797. Add-Ons available: Google Boost, Shoppable Store, Monthly Care & more. Fast, mobile-first, full ownership.",
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
      <body className="min-h-full flex flex-col bg-[#0F172A] text-[#E2E8F0]">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
