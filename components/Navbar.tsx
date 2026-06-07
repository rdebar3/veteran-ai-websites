'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Pricing', href: '#pricing' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Add-Ons', href: '#addons' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0F172A] border-b border-[#334155]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#hero" className="flex items-center">
            <img 
              src="/veteran-ai-logo.jpg" 
              alt="Veteran AI Websites" 
              className="h-14 w-auto md:h-20 drop-shadow-lg" 
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-9 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[#CBD5E1] hover:text-[#E2E8F0] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#build"
              className="ml-2 inline-flex items-center justify-center rounded-md bg-[#B91C1C] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#991B1B]"
            >
              Start Your Order
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#CBD5E1]"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-[#334155] bg-[#0F172A]">
          <div className="px-6 py-6 flex flex-col gap-4 text-base font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="py-1 text-[#CBD5E1] active:text-[#E2E8F0]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#build"
              onClick={handleLinkClick}
              className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-[#B91C1C] px-5 py-3 text-base font-semibold text-white transition active:bg-[#991B1B]"
            >
              Start Your Order
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
