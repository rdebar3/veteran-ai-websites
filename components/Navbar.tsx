'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Pricing', href: '#pricing' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Add-Ons', href: '#addons' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0F172A]/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo (clean text for now) */}
          <a href="#hero" className="flex items-center">
            <span className="font-semibold tracking-[-0.3px] text-xl md:text-2xl text-white">
              Veteran AI Websites
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white/90 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#build"
              className="ml-2 btn-primary text-sm px-6 py-2.5 shadow-sm"
            >
              Start Your Order
            </a>
          </div>

          {/* Mobile: CTA + Menu Button (always visible CTA) */}
          <div className="md:hidden flex items-center gap-2">
            <a
              href="#build"
              className="btn-primary text-sm px-4 py-2 shadow-sm"
            >
              Start Your Order
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 text-white/90"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0F172A]/95 backdrop-blur-md">
          <div className="px-6 py-8 flex flex-col gap-2 text-lg font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="py-2.5 text-white/90 active:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#build"
              onClick={handleLinkClick}
              className="mt-4 btn-primary w-full text-base py-3 shadow-sm"
            >
              Start Your Order
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
