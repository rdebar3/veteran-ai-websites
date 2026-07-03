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
import MountainBackdrop from '@/components/MountainBackdrop';
import Hero from '@/components/Hero';
import SectionShell from '@/components/SectionShell';
import ScrollReveal from '@/components/ScrollReveal';
import PricingCard from '@/components/PricingCard';
import FAQAccordion, { type FAQ } from '@/components/FAQAccordion';
import {
  pricingTiers,
  addOnsList,
  howItWorksSteps,
  allPackagesInclude,
  getDisplayPrice,
} from '@/lib/data';
import { testimonials } from '@/lib/testimonials';

interface BuilderForm {
  businessName: string;
  email: string;
  phone: string;
  description: string;
}

const faqs: FAQ[] = [
  {
    question: 'How quickly can I really get my website?',
    answer:
      'Most Starter and Complete sites are delivered the same day you approve the design with premium quality and craftsmanship. Premium sites with priority are usually ready in 1-2 business days. We move fast because we keep scopes clear and focused, delivering exceptional speed, quality, and full ownership at these investment levels.',
  },
  {
    question: 'Do I own the website and files?',
    answer:
      'Yes — 100% ownership. You receive all files, login credentials, and we hand everything over. No lock-in, no hidden fees, and no middlemen.',
  },
  {
    question: 'What if I need changes after launch?',
    answer:
      'Starter and Complete include 1 round of revisions for your peace of mind. Premium includes 2 rounds of revisions plus 30 days of support after launch. After that, we offer affordable Monthly Website Care to maintain your premium site and protect your investment.',
  },
  {
    question: 'Is this only for businesses in West Virginia?',
    answer:
      'We are proudly based in West Virginia and love serving local businesses, but we work with clients across the U.S. The mountain roots and veteran-owned values stay the same no matter where you are.',
  },
  {
    question: 'Do you offer ongoing maintenance or updates?',
    answer:
      'Yes. Our Monthly Website Care plan includes up to 2 hours of minor content updates per month, security checks, backups, plugin updates, and priority support for a low monthly fee.',
  },
  {
    question: 'Why work with a veteran-owned service?',
    answer:
      'We bring discipline, clear communication, and pride in our work. No upselling, no fluff — just fast, fair, high-quality websites with full transparency and ownership for you.',
  },
];

export default function Home() {
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [selectedBuilderPackage, setSelectedBuilderPackage] = useState<string>('Starter');
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
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

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
    if (!builderForm.businessName || !builderForm.email) {
      alert('Please provide your business name and email.');
      return;
    }
    setIsBuilderSubmitting(true);
    setSubmitError(null);
    const selectedAddOnsDetails = addOnsList.filter((a) => selectedAddOnIds.includes(a.id));
    const selectedTier = pricingTiers.find((p) => p.name === selectedBuilderPackage);
    const estimatedTotal =
      (selectedTier ? getDisplayPrice(selectedTier) : 0) +
      selectedAddOnIds.reduce((sum, id) => {
        const addon = addOnsList.find((a) => a.id === id);
        return sum + (addon ? addon.price : 0);
      }, 0);
    const orderParams = {
      package: selectedBuilderPackage,
      addOns:
        selectedAddOnsDetails.length > 0
          ? selectedAddOnsDetails.map((a) => `${a.name} (+$${a.price})`).join(', ')
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
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        setIsBuilderSubmitted(true);
        setIsBuilderSubmitting(false);
        setTimeout(() => {
          document.getElementById('order-success')?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }, 100);
      } else {
        throw new Error('Formspree submission failed');
      }
    } catch {
      setIsBuilderSubmitting(false);
      setSubmitError('Failed to send your order. Please try again later or contact us directly.');
    }
  };

  const resetBuilder = () => {
    setIsBuilderSubmitted(false);
    setSubmitError(null);
    setIsPaying(false);
    setPaymentSuccess(false);
    setBuilderForm({ businessName: '', email: '', phone: '', description: '' });
  };

  const handlePayNow = async () => {
    setIsPaying(true);
    try {
      const selectedAddOnNames = selectedAddOnIds
        .map((id) => addOnsList.find((a) => a.id === id)?.name)
        .filter(Boolean) as string[];
      sessionStorage.setItem(
        'pendingOrder',
        JSON.stringify({ selectedBuilderPackage, selectedAddOnIds, builderForm })
      );
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package: selectedBuilderPackage, addOns: selectedAddOnNames }),
      });
      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch {
      setIsPaying(false);
      sessionStorage.removeItem('pendingOrder');
    }
  };

  const estimatedTotal = (() => {
    const tier = pricingTiers.find((p) => p.name === selectedBuilderPackage);
    const base = tier ? getDisplayPrice(tier) : 0;
    const addons = selectedAddOnIds.reduce((sum, id) => {
      const addon = addOnsList.find((a) => a.id === id);
      return sum + (addon ? addon.price : 0);
    }, 0);
    return base + addons;
  })();

  return (
    <>
      <MountainBackdrop />
      <main className="relative z-[1] flex-1">
        <Hero onClaimOffer={() => setSelectedBuilderPackage('Starter')} />

        {/* Trust bar */}
        <div className="trust-bar-premium">
          <div className="trust-bar-premium__inner">
            {[
              { icon: Award, text: 'U.S. Veteran Owned & Operated' },
              { icon: MapPin, text: 'Based in West Virginia' },
              { icon: Clock, text: 'Delivered in 1 Day — Guaranteed' },
              { icon: ClipboardList, text: 'Clear Scopes & Pricing' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="trust-bar-premium__item">
                <Icon className="trust-bar-premium__icon h-4 w-4" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Build */}
        <SectionShell
          id="build"
          location="Foothills"
          elevation="1,800 ft"
          eyebrow="Get Started Today"
          title="Build Your Website"
          subtitle="Pick your package, add any upgrades, and submit. Fast delivery, clear pricing, full ownership."
        >
          {!isBuilderSubmitted ? (
            <form
              action="https://formspree.io/f/mwvjoklj"
              method="POST"
              onSubmit={handleBuilderSubmit}
              className="space-y-10"
            >
              <ScrollReveal>
                <div className="flex items-center justify-between mb-6">
                  <label className="premium-eyebrow mb-0">01 — Choose Package</label>
                  <a href="#pricing" className="text-xs tracking-widest uppercase text-[var(--cyan)] hover:text-[var(--text-cream)] transition-colors">
                    Compare →
                  </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pricingTiers.map((tier) => {
                    const isSelected = selectedBuilderPackage === tier.name;
                    const hasPromo = tier.promoActive && tier.promoPrice != null;
                    const displayPrice = getDisplayPrice(tier);
                    return (
                      <button
                        type="button"
                        key={tier.name}
                        onClick={() => handleBuilderPackageSelect(tier.name)}
                        className={`glass-card text-left p-6 transition-all ${
                          isSelected ? 'glass-card--selected' : ''
                        }`}
                      >
                        <div className="font-[family-name:var(--font-display)] text-xl text-[var(--text-cream)]">
                          {tier.name}
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                          {hasPromo && (
                            <span className="text-sm text-[var(--text-dim)] line-through decoration-[var(--crimson)]">
                              ${tier.price}
                            </span>
                          )}
                          <span className="text-2xl text-[var(--text-cream)]">${displayPrice}</span>
                        </div>
                        {hasPromo && (
                          <p className="text-xs text-[var(--crimson-bright)] mt-1 font-medium">
                            $397 until July 4th
                          </p>
                        )}
                        <p className="text-xs text-[var(--text-dim)] mt-2">{tier.delivery}</p>
                      </button>
                    );
                  })}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <label className="premium-eyebrow block mb-6">
                  02 — Optional Upgrades
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  {addOnsList.map((addon) => {
                    const isSelected = selectedAddOnIds.includes(addon.id);
                    return (
                      <label
                        key={addon.id}
                        className={`glass-card flex cursor-pointer items-start gap-4 p-6 ${
                          isSelected ? 'glass-card--selected' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleAddOn(addon.id)}
                          className="mt-1 accent-[var(--crimson)] h-4 w-4"
                        />
                        <div>
                          <div className="text-[var(--text-cream)] font-medium">{addon.name}</div>
                          <div className="text-sm text-[var(--gold)] font-semibold mt-1">
                            +${addon.price}
                            {addon.period}
                          </div>
                          <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">{addon.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <label className="premium-eyebrow block mb-6">03 — Your Details</label>
                <div className="glass-card p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="businessName" className="form-label-premium">Business Name *</label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={builderForm.businessName}
                      onChange={handleBuilderInputChange}
                      className="form-input-premium"
                      placeholder="Smith Family Bakery"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="form-label-premium">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={builderForm.email}
                      onChange={handleBuilderInputChange}
                      className="form-input-premium"
                      placeholder="you@yourbusiness.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="form-label-premium">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={builderForm.phone}
                      onChange={handleBuilderInputChange}
                      className="form-input-premium"
                      placeholder="(304) 555-0123"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="form-label-premium">About Your Business</label>
                    <textarea
                      id="description"
                      name="description"
                      value={builderForm.description}
                      onChange={handleBuilderInputChange}
                      className="form-textarea-premium"
                      placeholder="Family-owned bakery in West Virginia. Need a clean site with menu, hours, and contact form."
                      rows={3}
                    />
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 glass-card text-sm">
                    <span className="text-[var(--text-dim)]">Estimated total:</span>
                    <span className="text-xl text-[var(--text-cream)] font-medium">${estimatedTotal}</span>
                    <span className="text-xs text-[var(--text-dim)]">(one-time + recurring)</span>
                  </div>
                  {selectedBuilderPackage === 'Starter' && (
                    <p className="text-xs text-[var(--crimson-bright)] max-w-sm mx-auto">
                      Limited Time Offer — $397 until July 4th. Final amount confirmed at checkout.
                    </p>
                  )}
                  <p className="text-xs text-[var(--text-dim)] max-w-xs mx-auto leading-relaxed">
                    No payment required today. Pay only after you review and approve the final design.
                  </p>
                  <button
                    type="submit"
                    disabled={isBuilderSubmitting}
                    className="btn-premium disabled:opacity-60"
                  >
                    {isBuilderSubmitting ? 'Submitting...' : 'Submit Order Request'}
                  </button>
                  {submitError && <p className="text-red-400 text-sm">{submitError}</p>}
                  <p className="text-xs text-[var(--text-dim)]">
                    We&apos;ll contact you within 24 hours to schedule your consultation.
                  </p>
                </div>
              </ScrollReveal>
            </form>
          ) : (
            <ScrollReveal>
              <div
                id="order-success"
                ref={successRef}
                className="glass-card max-w-2xl mx-auto p-10 text-center"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--forest)] text-emerald-400">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="premium-title text-3xl">Order Request Received</h3>
                <p className="mt-4 text-[var(--text-muted)] leading-relaxed">
                  Thank you, {builderForm.businessName.split(' ')[0] || 'friend'}. We have your{' '}
                  <span className="text-[var(--text-cream)]">{selectedBuilderPackage}</span> package
                  {selectedAddOnIds.length > 0 &&
                    ` plus ${selectedAddOnIds.length} add-on${selectedAddOnIds.length > 1 ? 's' : ''}`}
                  .
                </p>
                <p className="mt-2 text-sm text-[var(--text-dim)]">
                  I&apos;ll personally review your request and contact you within 24 hours.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                  <button onClick={resetBuilder} className="btn-premium">
                    Start Another Order
                  </button>
                  {!paymentSuccess && (
                    <button onClick={handlePayNow} disabled={isPaying} className="btn-premium btn-premium--outline">
                      {isPaying ? 'Processing...' : 'Pay Now'}
                    </button>
                  )}
                </div>
                {paymentSuccess && (
                  <p className="mt-4 text-emerald-400 text-sm font-medium">
                    Payment successful! Thank you.
                  </p>
                )}
              </div>
            </ScrollReveal>
          )}
        </SectionShell>

        {/* Pricing */}
        <SectionShell
          id="pricing"
          location="Misty Ridge"
          elevation="2,600 ft"
          eyebrow="Transparent Pricing"
          title="Clear prices. No hidden costs."
          subtitle="Mobile-first sites built in one day. You own everything."
          wide
        >
          <div className="grid-pricing">
            {pricingTiers.map((tier, i) => (
              <PricingCard
                key={tier.name}
                tier={tier}
                index={i}
                onSelect={(name) => {
                  setSelectedBuilderPackage(name);
                  document.getElementById('build')?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            ))}
          </div>
          <ScrollReveal delay={0.2}>
            <div className="glass-card max-w-3xl mx-auto mt-10 p-8">
              <p className="text-center text-sm tracking-widest uppercase text-[var(--gold)] mb-6">
                Every package includes
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allPackagesInclude.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                    <Check className="h-4 w-4 text-[var(--gold)] shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </SectionShell>

        {/* How it works */}
        <SectionShell
          id="how-it-works"
          location="Golden Overlook"
          elevation="3,200 ft"
          eyebrow="Clear & Simple"
          title="How It Works"
          subtitle="Six refined steps from order to launch. Built by a West Virginia veteran."
          wide
        >
          <div className="grid-steps">
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <ScrollReveal key={index} delay={index * 0.08}>
                  <div className="glass-card step-card h-full">
                    <div className="step-card__number">{step.number}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4 text-[var(--cyan)]" />
                        <h3 className="step-card__title">{step.title}</h3>
                      </div>
                      <p className="step-card__desc">{step.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
          <div className="section-cta">
            <a href="#build" className="btn-premium">Start Your Order</a>
          </div>
        </SectionShell>

        {/* Examples */}
        <SectionShell
          id="examples"
          location="High Vista"
          elevation="3,800 ft"
          eyebrow="See The Quality"
          title="Live Examples"
          subtitle="Explore live demos for each package tier."
          wide
        >
          <div className="grid-examples">
            {[
              {
                tier: 'Starter',
                pages: '1 Page',
                title: 'Starter Demo',
                desc: 'Clean single-page site with hero, services, testimonials, and contact form.',
                href: '/examples/starter-plumbing',
                features: ['Professional hero', 'Services + about', 'Contact form', 'Mobile-optimized'],
              },
              {
                tier: 'Complete',
                pages: '5 Pages',
                title: 'Complete Demo',
                desc: 'Multi-page website with home, about, services, gallery, and contact.',
                href: '/examples/complete-hvac',
                features: ['5 designed pages', 'Inquiry forms', 'Google Business', 'SEO-ready'],
              },
              {
                tier: 'Premium',
                pages: '7 Pages',
                title: 'Premium Demo',
                desc: 'Advanced 7-page site with portfolio, location details, FAQ, and premium design.',
                href: '/examples/premium-restaurant',
                features: ['7 custom pages', 'Advanced branding', 'Portfolio sections', 'Priority polish'],
              },
            ].map((ex, i) => (
              <ScrollReveal key={ex.tier} delay={i * 0.1}>
                <div className="glass-card example-card">
                  <div>
                    <span className="example-card__tier">{ex.tier}</span>
                    <span className="example-card__pages">{ex.pages}</span>
                  </div>
                  <h3 className="example-card__title">{ex.title}</h3>
                  <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed flex-1">{ex.desc}</p>
                  <ul className="mt-5 mb-8 space-y-2">
                    {ex.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-[var(--text-dim)]">
                        <Check className="h-3 w-3 text-[var(--gold)]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href={ex.href} className="btn-premium btn-premium--outline w-full mt-auto">
                    View Live Demo
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </SectionShell>

        {/* Testimonials */}
        <SectionShell
          id="testimonials"
          location="Ridgeline"
          elevation="3,400 ft"
          eyebrow="Client Voices"
          title="Trusted by Local Businesses"
          subtitle="Real results from West Virginia business owners."
          wide
        >
          <div className="grid-testimonials">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.author} delay={i * 0.1}>
                <div className="glass-card testimonial-card h-full">
                  <p className="testimonial-card__quote">{t.quote}</p>
                  <p className="testimonial-card__author">{t.author}</p>
                  <p className="testimonial-card__meta">
                    {t.business} · {t.location}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </SectionShell>

        {/* Add-ons */}
        <SectionShell
          id="addons"
          location="Upper Slopes"
          elevation="4,000 ft"
          eyebrow="Optional Upgrades"
          title="Two Focused Add-Ons"
          subtitle="No clutter. Just the upgrades that matter."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {addOnsList.map((addon, i) => (
              <ScrollReveal key={addon.id} delay={i * 0.1}>
                <div className="glass-card p-8">
                  <div className="flex justify-between items-baseline gap-4">
                    <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--text-cream)]">
                      {addon.name}
                    </h3>
                    <span className="text-[var(--gold)] font-medium whitespace-nowrap">
                      +${addon.price}
                      <span className="text-[var(--text-dim)] text-sm">{addon.period}</span>
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">{addon.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="section-cta">
            <a href="#build" className="btn-premium">Add to Your Order</a>
          </div>
        </SectionShell>

        {/* FAQ */}
        <SectionShell
          id="faq"
          location="Summit Approach"
          elevation="4,500 ft"
          eyebrow="Common Questions"
          title="Frequently Asked Questions"
          subtitle="Straight answers on pricing, timelines, and ownership."
        >
          <FAQAccordion faqs={faqs} />
          <div className="section-cta">
            <a href="#build" className="btn-premium">Start Your Order</a>
          </div>
        </SectionShell>

        {/* Contact */}
        <SectionShell
          id="contact"
          location="Summit"
          elevation="4,863 ft"
          eyebrow="Have Questions?"
          title="Let's talk about your project."
          subtitle="Or use the Build Your Website tool above to submit your order."
        >
          <ScrollReveal>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                alert('Thank you! Your message has been received. We will contact you soon.');
                form.reset();
              }}
              className="glass-card p-8 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="form-label-premium">Your Name *</label>
                  <input type="text" id="name" name="name" className="form-input-premium" placeholder="Jane Smith" required />
                </div>
                <div>
                  <label htmlFor="business" className="form-label-premium">Business Name *</label>
                  <input type="text" id="business" name="business" className="form-input-premium" placeholder="Smith Family Bakery" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-email" className="form-label-premium">Email *</label>
                  <input type="email" id="contact-email" name="email" className="form-input-premium" placeholder="you@yourbusiness.com" required />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="form-label-premium">Phone</label>
                  <input type="tel" id="contact-phone" name="phone" className="form-input-premium" placeholder="(304) 555-0123" />
                </div>
              </div>
              <div>
                <label htmlFor="package" className="form-label-premium">Interested Package</label>
                <select id="package" name="package" className="form-input-premium">
                  {pricingTiers.map((tier) => (
                    <option key={tier.name} value={tier.name}>
                      {tier.name} — ${tier.price}
                    </option>
                  ))}
                  <option value="Not sure yet">Not sure yet</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="form-label-premium">Tell us about your project</label>
                <textarea
                  id="message"
                  name="message"
                  className="form-textarea-premium"
                  placeholder="We're a family-owned plumbing company in West Virginia..."
                />
              </div>
              <button type="submit" className="btn-premium w-full">
                Send Message
              </button>
              <p className="text-center text-xs text-[var(--text-dim)]">
                I&apos;ll personally review your request within 24 hours. No spam, ever.
              </p>
            </form>
          </ScrollReveal>
        </SectionShell>
      </main>
    </>
  );
}