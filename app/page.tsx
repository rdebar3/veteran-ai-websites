'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Check,
  Award,
  MapPin,
  Clock,
  ClipboardList,
  CheckCircle,
} from 'lucide-react';
import PricingCard from '@/components/PricingCard';
import FAQAccordion, { type FAQ } from '@/components/FAQAccordion';
import { 
  pricingTiers, 
  addOnsList, 
  howItWorksSteps, 
  allPackagesInclude 
} from '@/lib/data';

interface BuilderForm {
  businessName: string;
  email: string;
  phone: string;
  description: string;
}

const faqs: FAQ[] = [
  {
    question: "How quickly can I really get my website?",
    answer: "Most Starter and Complete sites are delivered the same day you approve the design with premium quality and craftsmanship. Premium sites with priority are usually ready in 1-2 business days. We move fast because we keep scopes clear and focused, delivering exceptional speed, quality, and full ownership at these investment levels.",
  },
  {
    question: "Do I own the website and files?",
    answer: "Yes — 100% ownership. You receive all files, login credentials, and we hand everything over. No lock-in, no hidden fees, and no middlemen.",
  },
  {
    question: "What if I need changes after launch?",
    answer: "Starter and Complete include 1 round of revisions for your peace of mind. Premium includes 2 rounds of revisions plus 30 days of support after launch. After that, we offer affordable Monthly Website Care to maintain your premium site and protect your investment.",
  },
  {
    question: "Is this only for businesses in West Virginia?",
    answer: "We are proudly based in West Virginia and love serving local businesses, but we work with clients across the U.S. The mountain roots and veteran-owned values stay the same no matter where you are.",
  },
  {
    question: "Do you offer ongoing maintenance or updates?",
    answer: "Yes. Our Monthly Website Care plan includes up to 2 hours of minor content updates per month, security checks, backups, plugin updates, and priority support for a low monthly fee.",
  },
  {
    question: "Why work with a veteran-owned service?",
    answer: "We bring discipline, clear communication, and pride in our work. No upselling, no fluff — just fast, fair, high-quality websites with full transparency and ownership for you.",
  },
];

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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment_success') === 'true') {
      const saved = sessionStorage.getItem('pendingOrder');
      if (saved) {
        const details = JSON.parse(saved);
        setSelectedBuilderPackage(details.selectedBuilderPackage);
        setSelectedAddOnIds(details.selectedAddOnIds);
        setBuilderForm(details.builderForm);
        setIsBuilderSubmitted(true);
        setPaymentSuccess(true);
        sessionStorage.removeItem('pendingOrder');
        // Clear query params
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const selectedAddOns = addOnsList.filter((addon) => selectedAddOnIds.includes(addon.id));

  const handleToggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    setSubmitError(null);
  };

  const handleBuilderPackageSelect = (packageName: string) => {
    setSelectedBuilderPackage(packageName);
    setSubmitError(null);
  };

  const handleBuilderInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBuilderForm((prev) => ({ ...prev, [name]: value }));
    setSubmitError(null);
  };

  const handleBuilderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submission started');

    if (!builderForm.businessName || !builderForm.email) {
      alert('Please provide your business name and email.');
      return;
    }

    setIsBuilderSubmitting(true);
    setSubmitError(null);

    const selectedAddOnsDetails = addOnsList.filter((a) => selectedAddOnIds.includes(a.id));

    const estimatedTotal = (pricingTiers.find(p => p.name === selectedBuilderPackage)?.price || 0) + 
      selectedAddOnIds.reduce((sum, id) => {
        const addon = addOnsList.find(a => a.id === id);
        return sum + (addon ? addon.price : 0);
      }, 0);

    const orderParams = {
      package: selectedBuilderPackage,
      addOns: selectedAddOnsDetails.length > 0 
        ? selectedAddOnsDetails.map(a => `${a.name} (+$${a.price})`).join(', ') 
        : 'None',
      businessName: builderForm.businessName,
      email: builderForm.email,
      phone: builderForm.phone || 'Not provided',
      description: builderForm.description || 'Not provided',
      estimatedTotal: `$${estimatedTotal} (one-time + any recurring)`,
      timestamp: new Date().toISOString(),
    };

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      formData.append('package', orderParams.package);
      formData.append('addOns', orderParams.addOns);
      formData.append('estimatedTotal', orderParams.estimatedTotal);

      const response = await fetch('https://formspree.io/f/mwvjoklj', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Formspree submission successful, showing success screen');
        setIsBuilderSubmitted(true);
        setIsBuilderSubmitting(false);

        // Smoothly scroll to the success screen
        setTimeout(() => {
          document.getElementById('order-success')?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }, 100);
      } else {
        throw new Error('Formspree submission failed');
      }
    } catch (error) {
      console.error('Failed to send order via Formspree:', error);
      console.log('Formspree submission failed, showing error');
      setIsBuilderSubmitting(false);
      setSubmitError('Failed to send your order. Please try again later or contact us directly.');
    }
  };

  const resetBuilder = () => {
    setIsBuilderSubmitted(false);
    setSubmitError(null);
    setIsPaying(false);
    setPaymentSuccess(false);
    setBuilderForm({
      businessName: '',
      email: '',
      phone: '',
      description: '',
    });
  };

  const handlePayNow = async () => {
    setIsPaying(true);
    try {
      const selectedAddOnNames = selectedAddOnIds
        .map((id) => addOnsList.find((a) => a.id === id)?.name)
        .filter(Boolean) as string[];

      const orderDetails = {
        selectedBuilderPackage,
        selectedAddOnIds,
        builderForm,
      };
      sessionStorage.setItem('pendingOrder', JSON.stringify(orderDetails));

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package: selectedBuilderPackage,
          addOns: selectedAddOnNames,
        }),
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error(err);
      setIsPaying(false);
      sessionStorage.removeItem('pendingOrder');
    }
  };

  return (
    <main className="flex-1">
      {/* HERO */}
      <section 
        id="hero" 
        className="relative min-h-[85vh] flex items-center border-b border-[#334155] pt-10 pb-12 md:pt-12 md:pb-16"
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

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#build" className="btn-primary w-full sm:w-auto text-lg px-10">
              Start Your Order
            </a>
            <a 
              href="#pricing" 
              className="inline-flex items-center justify-center rounded-lg border border-[#B91C1C]/70 text-[#E2E8F0] hover:bg-[#B91C1C] hover:text-white hover:border-[#B91C1C] text-lg px-10 w-full sm:w-auto py-3.5 font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#B91C1C] focus:ring-offset-2"
            >
              See Pricing
            </a>
          </div>

          <div className="mt-4 text-sm text-[#94A3B8]">
            Most sites delivered the same day you reach out with premium quality and full ownership
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="trust-bar">
        <div className="max-w-7xl mx-auto px-6 py-6 md:py-8">
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
      <section id="build" className="max-w-5xl mx-auto px-6 py-12 md:py-16 border-b border-[#334155] bg-transparent">
        <div className="text-center mb-8 md:mb-6">
          <div className="eyebrow mb-3">Get Started Today</div>
          <h2 className="section-title">Build Your Website</h2>
          <p className="section-subtitle max-w-2xl">
            Select your package and add-ons, then submit your request. We'll deliver your premium website fast with exceptional quality and full ownership.
          </p>
        </div>

        {!isBuilderSubmitted ? (
          <form action="https://formspree.io/f/mwvjoklj" method="POST" onSubmit={handleBuilderSubmit} className="space-y-6">
            {/* Package Selection */}
            <div>
              <div className="mb-5 md:mb-4 flex items-center justify-between">
                <label className="text-lg font-semibold text-[#E2E8F0]">1. Choose Your Package</label>
                <a href="#pricing" className="text-sm text-[#B91C1C] hover:underline">Compare full details →</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
                {pricingTiers.map((tier) => {
                  const isSelected = selectedBuilderPackage === tier.name;
                  return (
                    <button
                      type="button"
                      key={tier.name}
                      onClick={() => handleBuilderPackageSelect(tier.name)}
                      className={`text-left rounded-2xl border p-6 md:p-8 transition-all focus:outline-none focus:ring-2 focus:ring-[#B91C1C] focus:ring-offset-2 ${
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
              <label className="mb-5 md:mb-4 block text-lg font-semibold text-[#E2E8F0]">2. Add Optional Upgrades</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3">
                {addOnsList.map((addon) => {
                  const isSelected = selectedAddOnIds.includes(addon.id);
                  return (
                    <label
                      key={addon.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-6 md:p-8 transition ${
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
              <label className="mb-5 md:mb-4 block text-lg font-semibold text-[#E2E8F0]">3. Your Business Details</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-5 rounded-2xl border border-[#475569] bg-[#1E2937]/30 backdrop-blur-md p-6 md:p-8">
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

            <div className="mt-6 md:mt-0 text-center">
              {/* Live cost summary */}
              <div className="flex flex-col items-center gap-6 md:gap-4">
                <div className="inline-flex items-center gap-1 rounded-full bg-[#1E2937]/30 backdrop-blur-md border border-[#475569] px-3 py-1 text-sm">
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

                <div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed text-center max-w-[260px] mb-2">
                    No payment is required today.<br />
                    We will only process payment after we build your website and you have reviewed and approved the final design.
                  </p>

                  <button
                    type="submit"
                    disabled={isBuilderSubmitting}
                    className="btn-primary text-xl py-4 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isBuilderSubmitting ? 'Submitting Your Order Request...' : 'Submit My Order Request'}
                  </button>
                </div>
              </div>
              {submitError && (
                <p className="mt-2 text-red-400 text-sm text-center">{submitError}</p>
              )}
              <p className="mt-3 text-xs text-[#94A3B8]">
                We'll contact you within 24 hours to schedule the consultation call and confirm details.
              </p>
            </div>
          </form>
        ) : (
          /* Builder Success State */
          <div id="order-success" ref={successRef} className="mx-auto max-w-2xl rounded-2xl border border-[#475569] bg-[#1E2937]/30 backdrop-blur-md p-8 md:p-10 text-center">
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

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <button onClick={resetBuilder} className="btn-primary">
                Start Another Order
              </button>
              {!paymentSuccess && (
                <button 
                  onClick={handlePayNow} 
                  disabled={isPaying}
                  className="btn-primary"
                >
                  {isPaying ? 'Processing...' : 'Pay Now'}
                </button>
              )}
              <a href="#how-it-works" className="text-[#B91C1C] hover:underline font-medium inline-flex items-center justify-center py-2">
                See the 6-Step Process →
              </a>
            </div>
            {paymentSuccess && (
              <p className="mt-4 text-emerald-400 font-semibold">Payment successful! Thank you. We'll proceed with your order.</p>
            )}
          </div>
        )}
      </section>

      {/* PRICING */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-12 md:py-16 bg-transparent">
        <div className="section-header mb-10 md:mb-12">
          <div className="eyebrow mb-3">Transparent Pricing</div>
          <h2 className="section-title">Premium one-day websites. Clear prices. No hidden costs.</h2>
          <p className="section-subtitle">
            Choose the package that fits your business. All sites are mobile-first, fast, premium quality, and you own everything — built to last at these investment levels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 max-w-6xl mx-auto">
          {pricingTiers.map((tier) => (
            <PricingCard key={tier.name} tier={tier} onSelect={(name) => {
              setSelectedBuilderPackage(name);
              const buildEl = document.getElementById('build');
              if (buildEl) buildEl.scrollIntoView({ behavior: 'smooth' });
            }} />
          ))}
        </div>

        <div className="mt-8 md:mt-6 max-w-3xl mx-auto">
          <div className="rounded-2xl border border-[#475569] bg-[#1E2937]/30 backdrop-blur-md p-6 md:p-8">
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

        <div className="mt-6 md:mt-4 text-center text-sm text-[#94A3B8]">
          Need something custom? <a href="#contact" className="text-[#B91C1C] hover:underline font-medium">Reach out</a> — we’ll build the right solution.
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-transparent py-12 md:py-16 border-y border-[#334155]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-header mb-8 md:mb-10">
            <div className="eyebrow mb-3">Clear &amp; Simple</div>
            <h2 className="section-title">How It Works – Our Simple 6-Step Process</h2>
            <p className="section-subtitle max-w-3xl">
              From order to launch — transparent, fast, premium quality, and built for West Virginia small businesses with full ownership and lasting value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex gap-5 rounded-2xl border border-[#475569] bg-[#1E2937]/30 backdrop-blur-md p-6 md:p-8">
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

          <div className="mt-8 md:mt-6 text-center">
            <a href="#build" className="btn-primary text-lg px-10">Start Your Order</a>
          </div>
        </div>
      </section>

      {/* ADD-ONS */}
      <section id="addons" className="bg-transparent py-12 md:py-16 border-t border-[#334155]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="section-header mb-8 md:mb-10">
            <div className="eyebrow mb-3">Optional Upgrades</div>
            <h2 className="section-title">Add-Ons</h2>
            <p className="section-subtitle">
              Focused options to enhance your website.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4">
            {addOnsList.map((addon) => (
              <div key={addon.id} className="rounded-xl border border-[#475569] bg-[#1E2937]/30 backdrop-blur-md p-6 md:p-8">
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

          <div className="mt-6 md:mt-4 text-center">
            <a href="#build" className="btn-primary">Add to Your Order</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-transparent py-12 md:py-16 border-y border-[#334155]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="section-header mb-8 md:mb-10">
            <div className="eyebrow mb-3">Common Questions</div>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle max-w-2xl">
              Straight answers about pricing, timelines, ownership, and working with a veteran-owned web studio.
            </p>
          </div>

          <FAQAccordion faqs={faqs} />

          <div className="mt-8 md:mt-6 text-center">
            <a href="#build" className="btn-primary">Start Your Order</a>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="max-w-3xl mx-auto px-6 py-12 md:py-16 bg-transparent">
        <div className="text-center mb-8 md:mb-10">
          <div className="eyebrow mb-3">Have Questions?</div>
          <h2 className="text-4xl font-semibold tracking-tight text-[#E2E8F0]">Let’s talk about your project.</h2>
          <p className="mt-3 text-lg text-[#CBD5E1]">
            Or use the <a href="#build" className="text-[#B91C1C] font-medium hover:underline">Build Your Website</a> tool above to submit your full order request for premium results and exceptional value.
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
          className="space-y-6 bg-[#1E2937]/30 backdrop-blur-md border border-[#475569]/40 rounded-2xl p-6 md:p-8"
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
