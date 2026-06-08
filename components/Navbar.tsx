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
        <div className="flex items-center justify-between h-16">
          {/* Logo (clean text for now) */}
          <a href="#hero" className="flex items-center">
            <span className="font-semibold tracking-[-0.3px] text-lg md:text-xl text-white">
              Veteran AI Websites
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white/90 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-3 text-white/90"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0F172A]/95 backdrop-blur-md">
          <div className="px-6 py-6 flex flex-col gap-1 text-lg font-medium">
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
          </div>
        </div>
      )}
    </nav>
  );
}
