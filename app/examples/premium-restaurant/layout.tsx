'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Phone, Menu, X, UtensilsCrossed } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { href: '/examples/premium-restaurant', label: 'Home' },
  { href: '/examples/premium-restaurant/menu', label: 'Menu' },
  { href: '/examples/premium-restaurant/about', label: 'About' },
  { href: '/examples/premium-restaurant/gallery', label: 'Gallery' },
  { href: '/examples/premium-restaurant/reservations', label: 'Reservations' },
  { href: '/examples/premium-restaurant/reviews', label: 'Reviews' },
  { href: '/examples/premium-restaurant/contact', label: 'Contact' },
];

export default function PremiumRestaurantLayout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide main site nav/footer for standalone demo experience
  useEffect(() => {
    const mainNav = document.querySelector('nav');
    if (mainNav && mainNav.textContent?.includes('Veteran AI Websites')) {
      (mainNav as HTMLElement).style.display = 'none';
    }
    const mainFooter = document.querySelector('footer');
    if (mainFooter && mainFooter.textContent?.includes('Veteran AI Websites')) {
      (mainFooter as HTMLElement).style.display = 'none';
    }
    document.body.style.backgroundColor = '#fdf6e3'; // warm cream for restaurant feel

    return () => {
      if (mainNav) (mainNav as HTMLElement).style.display = '';
      if (mainFooter) (mainFooter as HTMLElement).style.display = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  const isActive = (href: string) => {
    const current = pathname || '';
    if (href === '/examples/premium-restaurant') {
      return current === href || current === '/examples/premium-restaurant/';
    }
    return current.startsWith(href);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fdf6e3] text-[#3e2723] font-sans antialiased">
      {/* Top utility bar */}
      <div className="bg-[#3e2723] text-[#fdf6e3] text-sm">
        <div className="max-w-7xl mx-auto px-6 py-2 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium">
            <Phone className="h-4 w-4" />
            <a href="tel:3045550381" className="hover:text-white transition">(304) 555-0381</a>
            <span className="hidden sm:inline">• Open Tue–Sun</span>
          </div>
          <div className="text-xs tracking-widest">VETERAN-OWNED • RIDGEVIEW, WV</div>
        </div>
      </div>

      {/* Main Navigation - warm inviting restaurant style */}
      <nav className="sticky top-0 z-50 bg-[#fdf6e3] border-b border-[#8b7355]/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/examples/premium-restaurant" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#8b4513] text-[#fdf6e3]">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <div>
                <div className="font-serif text-2xl tracking-[-0.5px] text-[#3e2723]">Mountain View</div>
                <div className="text-[10px] text-[#8b7355] -mt-1 tracking-[2px] font-medium">GRILL &amp; TAVERN</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-7 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors hover:text-[#8b4513] ${isActive(link.href) ? 'text-[#8b4513] font-semibold' : 'text-[#3e2723]/80'}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Link
                href="/examples/premium-restaurant/reservations"
                className="inline-flex items-center rounded-lg bg-[#8b4513] px-5 py-2.5 text-sm font-semibold text-[#fdf6e3] hover:bg-[#5c4033] transition-all shadow-sm"
              >
                Make a Reservation
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#3e2723]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#8b7355]/30 bg-[#fdf6e3] px-6 py-5">
            <div className="flex flex-col gap-4 text-base font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`py-1 ${isActive(link.href) ? 'text-[#8b4513] font-semibold' : 'text-[#3e2723]/80'}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/examples/premium-restaurant/reservations"
                onClick={handleLinkClick}
                className="mt-2 inline-flex items-center justify-center rounded-lg bg-[#8b4513] px-6 py-3 text-sm font-semibold text-[#fdf6e3]"
              >
                Make a Reservation
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main>{children}</main>

      {/* Shared Footer with demo note */}
      <footer className="bg-[#3e2723] text-[#f5e6d3] pt-10 pb-8 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-y-8">
          <div>
            <div className="font-serif text-xl tracking-tight text-white mb-2">Mountain View Grill &amp; Tavern</div>
            <div className="text-[#f5e6d3]/70">123 Mountain View Lane<br />Ridgeview, WV 26501</div>
            <a href="tel:3045550381" className="mt-2 block text-[#f5e6d3] hover:text-white">(304) 555-0381</a>
          </div>
          <div>
            <div className="font-medium text-white mb-3 tracking-wider text-xs">HOURS</div>
            <div className="text-[#f5e6d3]/80 space-y-0.5">
              Tue–Thu: 11am–9pm<br />
              Fri–Sat: 11am–10pm<br />
              Sun: 11am–8pm<br />
              Closed Mondays
            </div>
          </div>
          <div>
            <div className="font-medium text-white mb-3 tracking-wider text-xs">CONNECT</div>
            <div className="text-[#f5e6d3]/80 space-y-1">
              <div>Veteran-owned &amp; family operated</div>
              <div>Local ingredients • Mountain views</div>
              <a href="mailto:info@mountainviewgrillwv.com" className="hover:text-white">info@mountainviewgrillwv.com</a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-[#f5e6d3]/20 text-center text-[10px] text-[#f5e6d3]/60 tracking-wide">
          This is a demonstration site showing the quality of a Premium package website.
        </div>
      </footer>
    </div>
  );
}
