'use client';

import React, { useState } from 'react';
import {
  Check,
  Award,
  MapPin,
  Clock,
  ClipboardList,
  CheckCircle,
  Send,
  Phone,
  Zap,
  Eye,
  CreditCard,
  Globe,
} from 'lucide-react';
import PricingCard from '@/components/PricingCard';

// Exact packages
const pricingTiers = [
  {
    name: 'Starter',
    price: 297,
    popular: false,
    delivery: 'Delivered in 1 day',
    revisions: '1 revision included',
    features: [
      '1-page website',
      'Up to 5 sections',
      'Basic contact form',
      'Google Business embed',
      '1 revision',
      'Delivered in 1 day',
    ],
  },
  {
    name: 'Complete',
    price: 497,
    popular: true,
    delivery: 'Delivered in 1 day',
    revisions: '1 revision included',
    features: [
      'Up to 5 pages',
      'Professional multi-section design',
      'Contact + inquiry forms',
      'Google Business integration',
      'Basic SEO',
      'Social links',
      'Delivered in 1 day',
    ],
  },
  {
    name: 'Premium',
    price: 797,
    popular: false,
    delivery: 'Delivered in 1-2 days (priority)',
    revisions: '1 revision round',
    features: [
      'Up to 8 pages',
      'Advanced design & branding',
      'Blog or news section ready',
      'Stronger SEO foundation',
      '1 revision round',
      '30 days of support',
      'Delivered in 1-2 days (priority)',
    ],
  },
];

const allPackagesInclude = [
  'Fully mobile responsive design',
  'Fast, secure hosting setup',
  '100% ownership of your website and files',
  'No long-term contracts or hidden fees',
];

// Simplified 4 add-ons
const addOnsList = [
  {
    id: 'google-business-boost',
    name: 'Google Business Boost',
    price: 97,
    period: 'one-time',
    desc: 'Professional Google Business Profile optimization including photos, posts, categories, and review generation prompts.',
  },
  {
    id: 'shoppable-store',
    name: 'Shoppable Store (Clerk + Stripe)',
    price: 350,
    period: 'one-time',
    desc: 'Add a simple product catalog with secure checkout. Includes Clerk authentication and Stripe payments integration.',
  },
  {
    id: 'monthly-website-care',
    name: 'Monthly Website Care',
    price: 97,
    period: '/month',
    desc: 'Monthly updates, security checks, backups, minor content changes, and priority support.',
  },
  {
    id: 'launch-content-pack',
    name: 'Launch Content Pack',
    price: 147,
    period: 'one-time',
    desc: 'Ready-to-post social media announcements and captions to promote your new website on launch day.',
  },
];

// 6-step process
const howItWorksSteps = [
  {
    number: '1',
    icon: Send,
    title: 'Submit Your Order',
    desc: 'Choose your package and add-ons on this website and submit your request with basic business info.',
  },
  {
    number: '2',
    icon: Phone,
    title: 'Consultation Call',
    desc: 'We’ll schedule a quick 15-minute call to discuss your goals and details.',
  },
  {
    number: '3',
    icon: Zap,
    title: 'We Build Your Site',
    desc: 'I build your professional website the same day (or 1-2 days with priority for Premium).',
  },
  {
    number: '4',
    icon: Eye,
    title: 'Review & Feedback',
    desc: 'You review the preview and request any included revisions.',
  },
  {
    number: '5',
    icon: CreditCard,
    title: 'Approve & Pay',
    desc: 'Once you’re happy, complete payment securely on our site.',
  },
  {
    number: '6',
    icon: Globe,
    title: 'Launch & Handoff',
    desc: 'We deploy your live site, do a final check, and hand over full ownership.',
  },
];

interface BuilderForm {
  businessName: string;
  email: string;
  phone: string;
  description: string;
}

export default function Home() {
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [selectedBuilderPackage, setSelectedBuilderPackage] = useState<string>('Complete');
  const [builderForm, setBuilderForm] = useState<BuilderForm>({
    businessName: '',
    email: '',
    phone: '',
    description: '',
  });
  const [isBuilderSubmitting, setIsBuilderSubmitting] = useState(false);
  const [isBuilderSubmitted, setIsBuilderSubmitted] = useState(false);

  const selectedAddOns = addOnsList.filter((addon) => selectedAddOnIds.includes(addon.id));

  const handleToggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBuilderPackageSelect = (packageName: string) => {
    setSelectedBuilderPackage(packageName);
  };

  const handleBuilderInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBuilderForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBuilderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!builderForm.businessName || !builderForm.email) {
      alert('Please provide your business name and email.');
      return;
    }

    setIsBuilderSubmitting(true);

    const selectedAddOnsDetails = addOnsList.filter((a) => selectedAddOnIds.includes(a.id));

    const order = {
      package: selectedBuilderPackage,
      addOns: selectedAddOnsDetails,
      ...builderForm,
      timestamp: new Date().toISOString(),
    };

    await new Promise((resolve) => setTimeout(resolve, 700));

    console.log('Order request submitted from Build Your Website:', order);

    setIsBuilderSubmitting(false);
    setIsBuilderSubmitted(true);
  };

  const resetBuilder = () => {
    setIsBuilderSubmitted(false);
    setBuilderForm({
      businessName: '',
      email: '',
      phone: '',
      description: '',
    });
  };

  return (
    <main className="flex-1">
      {/* HERO */}
      <section 
        id="hero" 
        className="relative min-h-[90vh] flex items-center border-b border-[#334155] pt-12 pb-16 md:pt-16 md:pb-20"
        style={{
          backgroundImage: "url('/natural-beauty-in-west-virginia.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Strong dark overlay for readability */}
        <div className="absolute inset-0 bg-[#0F172A]/75 z-[1]"></div>
        {/* Subtle patriotic texture */}
        <div className="absolute inset-0 hero-patriotic z-[2]"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="eyebrow mb-4 tracking-[2px]">West Virginia Veteran Owned</div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tighter text-[#E2E8F0] leading-none">
            Professional Websites.<br />Built in One Day.
          </h1>

          <p className="mt-3 text-base md:text-lg font-medium tracking-[1.5px] text-[#CBD5E1]">
            God Bless America • One-Day Websites by a West Virginia Veteran
          </p>

          <p className="mt-4 text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto">
            Fast, clean, mobile-first websites for small businesses across West Virginia.
            No long waits. No huge bills. Full ownership.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#build" className="btn-primary w-full sm:w-auto text-lg px-10">
              Start Your Order
            </a>
            <a href="#pricing" className="inline-flex items-center justify-center rounded-lg bg-[#B91C1C] px-10 py-3.5 text-lg font-semibold text-white transition-all hover:bg-[#991B1B] active:bg-[#7F1D1D] focus:outline-none focus:ring-2 focus:ring-[#B91C1C] focus:ring-offset-2 w-full sm:w-auto">
              See Pricing
            </a>
          </div>

          <div className="mt-6 text-sm text-[#94A3B8]">
            Most sites delivered the same day you reach out
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="trust-bar">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-[#CBD5E1]">
            <div className="flex items-center gap-2.5">
              <Award className="h-5 w-5 text-[#B91C1C]" />
              <span>U.S. Veteran Owned &amp; Operated</span>
            </div>
            <div className="hidden md:block h-3 w-px bg-[#334155]" />
            <div className="flex items-center gap-2.5">
              <MapPin className="h-5 w-5 text-[#B91C1C]" />
              <span>Based in West Virginia</span>
            </div>
            <div className="hidden md:block h-3 w-px bg-[#334155]" />
            <div className="flex items-center gap-2.5">
              <Clock className="h-5 w-5 text-[#B91C1C]" />
              <span>Delivered in 1 Day — Guaranteed</span>
            </div>
            <div className="hidden md:block h-3 w-px bg-[#334155]" />
            <div className="flex items-center gap-2.5">
              <ClipboardList className="h-5 w-5 text-[#B91C1C]" />
              <span>Clear Scopes &amp; Pricing</span>
            </div>
          </div>
        </div>
      </div>

      {/* BUILD YOUR WEBSITE - Prominent Order Builder */}
      <section id="build" className="max-w-5xl mx-auto px-6 py-16 md:py-20 border-b border-[#334155] bg-transparent">
        <div className="text-center mb-8">
          <div className="eyebrow mb-3">Get Started Today</div>
          <h2 className="section-title">Build Your Website</h2>
          <p className="section-subtitle max-w-2xl">
            Select your package and add-ons, then submit your request. We'll start your professional website fast.
          </p>
        </div>

        {!isBuilderSubmitted ? (
          <form onSubmit={handleBuilderSubmit} className="space-y-8">
            {/* Package Selection */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <label className="text-lg font-semibold text-[#E2E8F0]">1. Choose Your Package</label>
                <a href="#pricing" className="text-sm text-[#B91C1C] hover:underline">Compare full details →</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pricingTiers.map((tier) => {
                  const isSelected = selectedBuilderPackage === tier.name;
                  return (
                    <button
                      type="button"
                      key={tier.name}
                      onClick={() => handleBuilderPackageSelect(tier.name)}
                      className={`text-left rounded-2xl border p-6 transition-all focus:outline-none focus:ring-2 focus:ring-[#B91C1C] focus:ring-offset-2 ${
                        isSelected
                          ? 'border-[#B91C1C] bg-[#1E2937]/30 backdrop-blur-md shadow-lg ring-1 ring-[#B91C1C]'
                          : 'border-[#475569] bg-[#0F172A]/30 backdrop-blur-sm hover:border-[#64748B] hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-xl tracking-tight text-[#E2E8F0]">{tier.name}</div>
                          <div className="mt-1 text-3xl font-semibold tracking-tighter">${tier.price}</div>
                        </div>
                        {tier.popular && (
                          <span className="rounded-full bg-[#B91C1C] px-3 py-0.5 text-xs font-semibold text-white">MOST POPULAR</span>
                        )}
                      </div>
                      <div className="mt-3 text-sm text-[#94A3B8]">{tier.delivery}</div>
                      <ul className="mt-4 space-y-1 text-sm text-[#CBD5E1]">
                        {tier.features.slice(0, 4).map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#B91C1C]" /> {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add-Ons Selection */}
            <div>
              <label className="mb-4 block text-lg font-semibold text-[#E2E8F0]">2. Add Optional Upgrades</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {addOnsList.map((addon) => {
                  const isSelected = selectedAddOnIds.includes(addon.id);
                  return (
                    <label
                      key={addon.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                        isSelected ? 'border-[#B91C1C] bg-[#1E2937]/30 backdrop-blur-md' : 'border-[#475569] bg-[#0F172A]/30 backdrop-blur-sm hover:border-[#64748B]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleAddOn(addon.id)}
                        className="mt-1 accent-[#B91C1C] h-5 w-5"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-[#E2E8F0]">{addon.name}</div>
                        <div className="text-sm text-[#B91C1C] font-semibold">+${addon.price}{addon.period}</div>
                        <div className="mt-1 text-xs text-[#CBD5E1] leading-snug">{addon.desc}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
              {selectedAddOnIds.length > 0 && (
                <p className="mt-3 text-center text-sm text-[#94A3B8]">
                  {selectedAddOnIds.length} add-on{selectedAddOnIds.length > 1 ? 's' : ''} selected. These will be included in your order.
                </p>
              )}
            </div>

            {/* Short Order Form */}
            <div>
              <label className="mb-4 block text-lg font-semibold text-[#E2E8F0]">3. Your Business Details</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 rounded-2xl border border-[#475569] bg-[#1E2937]/30 backdrop-blur-md p-8">
                <div>
                  <label htmlFor="businessName" className="form-label">Business Name *</label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={builderForm.businessName}
                    onChange={handleBuilderInputChange}
                    className="form-input"
                    placeholder="Smith Family Bakery"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="form-label">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={builderForm.email}
                    onChange={handleBuilderInputChange}
                    className="form-input"
                    placeholder="you@yourbusiness.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={builderForm.phone}
                    onChange={handleBuilderInputChange}
                    className="form-input"
                    placeholder="(304) 555-0123"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="description" className="form-label">Brief Description of Your Business or Goals</label>
                  <textarea
                    id="description"
                    name="description"
                    value={builderForm.description}
                    onChange={handleBuilderInputChange}
                    className="form-textarea"
                    placeholder="Family-owned bakery in West Virginia. Need a clean site with menu, hours, and easy contact form."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="text-center">
              {/* Live cost summary */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#1E2937]/30 backdrop-blur-md border border-[#475569] px-5 py-2 text-sm">
                <span className="text-[#94A3B8]">Estimated total:</span>
                <span className="font-semibold text-[#E2E8F0] text-lg">
                  ${(pricingTiers.find(p => p.name === selectedBuilderPackage)?.price || 0) + 
                    selectedAddOnIds.reduce((sum, id) => {
                      const addon = addOnsList.find(a => a.id === id);
                      return sum + (addon ? addon.price : 0);
                    }, 0)}
                </span>
                <span className="text-[#64748B] text-xs">(one-time + any recurring)</span>
              </div>

              <button
                type="submit"
                disabled={isBuilderSubmitting}
                className="btn-primary w-full max-w-md text-xl py-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isBuilderSubmitting ? 'Submitting Your Order Request...' : 'Submit My Order Request'}
              </button>
              <p className="mt-3 text-xs text-[#94A3B8]">
                We'll contact you within 24 hours to schedule the consultation call and confirm details.
              </p>
            </div>
          </form>
        ) : (
          /* Builder Success State */
          <div className="mx-auto max-w-2xl rounded-3xl border border-[#475569] bg-[#1E2937]/30 backdrop-blur-md p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
              <CheckCircle className="h-9 w-9" />
            </div>
            <h3 className="text-3xl font-semibold tracking-tight text-[#E2E8F0]">Order Request Received!</h3>
            <p className="mt-4 text-lg text-[#CBD5E1]">
              Thank you, {builderForm.businessName.split(' ')[0] || 'friend'}. We have your order for the <span className="font-semibold text-[#E2E8F0]">{selectedBuilderPackage}</span> package
              {selectedAddOnIds.length > 0 && ` plus ${selectedAddOnIds.length} add-on${selectedAddOnIds.length > 1 ? 's' : ''}`}.
            </p>
            <p className="mt-2 text-[#CBD5E1]">
              I'll personally review your request and contact you within 24 hours. No spam, ever.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={resetBuilder} className="inline-flex items-center justify-center rounded-lg bg-[#B91C1C] px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-[#991B1B] active:bg-[#7F1D1D] focus:outline-none focus:ring-2 focus:ring-[#B91C1C] focus:ring-offset-2">
                Start Another Order
              </button>
              <a href="#how-it-works" className="btn-primary">
                See the 6-Step Process
              </a>
            </div>
          </div>
        )}
      </section>

      {/* PRICING */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-16 md:py-20 bg-[#0F172A]/60 backdrop-blur-sm">
        <div className="section-header mb-8 md:mb-12">
          <div className="eyebrow mb-3">Transparent Pricing</div>
          <h2 className="section-title">One-day websites. Clear prices. No hidden costs.</h2>
          <p className="section-subtitle">
            Choose the package that fits your business. All sites are mobile-first, fast, and you own everything.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier) => (
            <PricingCard key={tier.name} tier={tier} onSelect={(name) => {
              setSelectedBuilderPackage(name);
              const buildEl = document.getElementById('build');
              if (buildEl) buildEl.scrollIntoView({ behavior: 'smooth' });
            }} />
          ))}
        </div>

        <div className="mt-8 max-w-3xl mx-auto">
          <div className="rounded-2xl border border-[#475569] bg-[#1E2937]/30 backdrop-blur-md p-8">
            <div className="font-semibold text-[#E2E8F0] mb-4 text-center">Every package includes</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
              {allPackagesInclude.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[#CBD5E1]">
                  <Check className="h-4 w-4 text-[#B91C1C] shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-[#94A3B8]">
          Need something custom? <a href="#contact" className="text-[#B91C1C] hover:underline font-medium">Reach out</a> — we’ll build the right solution.
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-[#0F172A]/60 backdrop-blur-sm py-16 md:py-20 border-y border-[#334155]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-header mb-8 md:mb-12">
            <div className="eyebrow mb-3">Clear &amp; Simple</div>
            <h2 className="section-title">How It Works – Our Simple 6-Step Process</h2>
            <p className="section-subtitle max-w-3xl">
              From order to launch — transparent, fast, and built for West Virginia small businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex gap-5 rounded-2xl border border-[#475569] bg-[#1E2937]/30 backdrop-blur-md p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#B91C1C] text-white text-xl font-semibold">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-5 w-5 text-[#B91C1C]" />
                      <h3 className="font-semibold text-xl tracking-tight text-[#E2E8F0]">{step.title}</h3>
                    </div>
                    <p className="text-[#CBD5E1] leading-relaxed text-[15px]">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <a href="#build" className="btn-primary text-lg px-10">Start Your Order</a>
          </div>
        </div>
      </section>

      {/* ADD-ONS */}
      <section id="addons" className="bg-[#0F172A]/60 backdrop-blur-sm py-16 md:py-20 border-t border-[#334155]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="section-header mb-8 md:mb-12">
            <div className="eyebrow mb-3">Optional Upgrades</div>
            <h2 className="section-title">Add-Ons</h2>
            <p className="section-subtitle">
              Focused options to enhance your website.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addOnsList.map((addon) => (
              <div key={addon.id} className="rounded-xl border border-[#475569] bg-[#1E2937]/30 backdrop-blur-md p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="font-semibold text-[#E2E8F0]">{addon.name}</div>
                  <div className="font-semibold text-[#E2E8F0] whitespace-nowrap">
                    +${addon.price}<span className="font-normal text-[#94A3B8] text-sm">{addon.period}</span>
                  </div>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">{addon.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <a href="#build" className="btn-primary">Add to Your Order</a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="max-w-5xl mx-auto px-6 py-16 md:py-20 bg-[#0F172A]/60 backdrop-blur-sm">
        <div className="text-center">
          <div className="eyebrow mb-3">The Founder</div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#E2E8F0] mb-4">Built by a West Virginia veteran who understands local business.</h2>
          <p className="max-w-3xl mx-auto text-[15px] leading-relaxed text-[#CBD5E1]">
            I’m Tom Caldwell, a U.S. Army veteran and proud resident of West Virginia. After seeing too many local businesses struggle without professional websites, I started Veteran AI Websites to deliver fast, clean, high-quality sites at fair prices—usually the same day—with full ownership and no markups. No middlemen, just a veteran helping West Virginia businesses succeed online.
          </p>
          <p className="mt-3 text-xs tracking-wide text-[#94A3B8] opacity-80">
            Built with pride for American small businesses. God Bless America.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="max-w-3xl mx-auto px-6 py-16 md:py-20 bg-[#0F172A]/60 backdrop-blur-sm">
        <div className="text-center mb-10">
          <div className="eyebrow mb-3">Have Questions?</div>
          <h2 className="text-4xl font-semibold tracking-tight text-[#E2E8F0]">Let’s talk about your project.</h2>
          <p className="mt-3 text-lg text-[#CBD5E1]">
            Or use the <a href="#build" className="text-[#B91C1C] font-medium hover:underline">Build Your Website</a> tool above to submit your full order request.
          </p>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget as HTMLFormElement;
            const data = new FormData(form);
            console.log('Contact form submitted:', Object.fromEntries(data));
            alert('Thank you! Your message has been received. We will contact you soon.');
            form.reset();
          }}
          className="space-y-6 bg-[#1E2937]/30 backdrop-blur-md border border-[#475569]/40 rounded-2xl p-8 md:p-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="form-label">Your Name *</label>
              <input type="text" id="name" name="name" className="form-input" placeholder="Jane Smith" required />
            </div>
            <div>
              <label htmlFor="business" className="form-label">Business Name *</label>
              <input type="text" id="business" name="business" className="form-input" placeholder="Smith Family Bakery" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="form-label">Email Address *</label>
              <input type="email" id="email" name="email" className="form-input" placeholder="you@yourbusiness.com" required />
            </div>
            <div>
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input type="tel" id="phone" name="phone" className="form-input" placeholder="(304) 555-0123" />
            </div>
          </div>

          <div>
            <label htmlFor="package" className="form-label">Interested Package</label>
            <select id="package" name="package" className="form-input">
              {pricingTiers.map((tier) => (
                <option key={tier.name} value={tier.name}>
                  {tier.name} — ${tier.price}
                </option>
              ))}
              <option value="Not sure yet">Not sure yet — let’s discuss</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="form-label">Tell me about your business or what you need</label>
            <textarea id="message" name="message" className="form-textarea" placeholder="We’re a family-owned plumbing company in West Virginia. Need a site with services list, service area map, and easy contact form." />
          </div>

          <button type="submit" className="btn-primary w-full text-lg py-4">
            Send Message
          </button>

          <p className="text-center text-xs text-[#94A3B8]">
            I'll personally review your request and contact you within 24 hours. No spam, ever.
          </p>
        </form>
      </section>
    </main>
  );
}
