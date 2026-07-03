'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Phone, Menu, X, ThermometerSun } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { href: '/examples/complete-hvac', label: 'Home' },
  { href: '/examples/complete-hvac/services', label: 'Services' },
  { href: '/examples/complete-hvac/about', label: 'About Us' },
  { href: '/examples/complete-hvac/reviews', label: 'Reviews' },
  { href: '/examples/complete-hvac/contact', label: 'Contact' },
];

export default function CompleteHvacLayout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide main site nav/footer for standalone demo
  useEffect(() => {
    const mainNav = document.querySelector('nav');
    if (mainNav && mainNav.textContent?.includes('Veteran AI Websites')) {
      (mainNav as HTMLElement).style.display = 'none';
    }
    const mainFooter = document.querySelector('footer');
    if (mainFooter && mainFooter.textContent?.includes('Veteran AI Websites')) {
      (mainFooter as HTMLElement).style.display = 'none';
    }
    document.body.style.backgroundColor = '#ffffff';

    return () => {
      if (mainNav) (mainNav as HTMLElement).style.display = '';
      if (mainFooter) (mainFooter as HTMLElement).style.display = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  const isActive = (href: string) => {
    const current = pathname || '';
    if (href === '/examples/complete-hvac') {
      return current === href || current === '/examples/complete-hvac/';
    }
    return current.startsWith(href);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-[#1f2937] font-sans antialiased">
      {/* Top bar with phone and veteran note */}
      <div className="bg-[#0f172a] text-white/90 text-sm">
        <div className="max-w-7xl mx-auto px-6 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <Phone className="h-4 w-4" />
            <a href="tel:3045550248" className="hover:text-white transition">(304) 555-0248</a>
            <span className="hidden sm:inline text-white/60">• 24/7 Emergency Service</span>
          </div>
          <div className="text-xs tracking-wide text-white/70">Veteran Owned • Ridgeview, WV</div>
        </div>
      </div>

      {/* Main Navigation - professional HVAC style */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/examples/complete-hvac" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0f172a] text-white">
                <ThermometerSun className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-xl tracking-[-0.5px] text-[#0f172a]">Appalachian HVAC</div>
                <div className="text-[10px] text-slate-500 -mt-1 tracking-[1px]">SOLUTIONS</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors hover:text-[#0d9488] ${isActive(link.href) ? 'text-[#0d9488] font-semibold' : 'text-slate-600'}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Link
                href="/examples/complete-hvac/contact"
                className="inline-flex items-center rounded-lg bg-[#0d9488] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0f766e] transition-all shadow-sm"
              >
                Get a Quote
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white px-6 py-4">
            <div className="flex flex-col gap-3 text-base font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`py-1.5 ${isActive(link.href) ? 'text-[#0d9488] font-semibold' : 'text-slate-600'}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/examples/complete-hvac/contact"
                onClick={handleLinkClick}
                className="mt-2 inline-flex items-center justify-center rounded-lg bg-[#0d9488] px-6 py-3 text-sm font-semibold text-white"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main>{children}</main>

      {/* Footer with demo note on every page */}
      <footer className="bg-[#0f172a] text-white/80 pt-12 pb-8 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-y-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-white/10">
                <ThermometerSun className="h-4 w-4" />
              </div>
              <span className="font-semibold text-white tracking-tight">Appalachian HVAC Solutions</span>
            </div>
            <div className="text-xs text-white/60">Ridgeview, West Virginia</div>
          </div>

          <div>
            <div className="font-medium text-white mb-3 tracking-wider text-xs">COMPANY</div>
            <div className="space-y-1.5 text-white/70">
              <Link href="/examples/complete-hvac/about" className="block hover:text-white">About Us</Link>
              <Link href="/examples/complete-hvac/reviews" className="block hover:text-white">Reviews &amp; Projects</Link>
              <a href="tel:3045550248" className="block hover:text-white">24/7: (304) 555-0248</a>
            </div>
          </div>

          <div>
            <div className="font-medium text-white mb-3 tracking-wider text-xs">SERVICES</div>
            <div className="space-y-1.5 text-white/70">
              <Link href="/examples/complete-hvac/services" className="block hover:text-white">Heating &amp; Cooling</Link>
              <Link href="/examples/complete-hvac/services" className="block hover:text-white">Maintenance Plans</Link>
              <Link href="/examples/complete-hvac/services" className="block hover:text-white">Indoor Air Quality</Link>
            </div>
          </div>

          <div className="text-xs text-white/60">
            <div className="font-medium text-white mb-3 tracking-wider text-xs">RIDGEVIEW, WV</div>
            <div>124 Mountain View Road<br />Ridgeview, WV 26501</div>
            <div className="mt-2">Mon–Fri 7:30am–5:30pm<br />24/7 Emergency Response</div>
            <div className="mt-2 text-white/50">Veteran Owned &amp; Operated</div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-[10px] text-white/50 tracking-wide">
          This is a demonstration site showing the quality of a Complete package website.
        </div>
      </footer>
    </div>
  );
}
