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

import Hero from '@/components/Hero';
import BaseRoom from '@/components/BaseRoom';
import Reveal from '@/components/Reveal';
import PricingCard from '@/components/PricingCard';
import FAQAccordion, { type FAQ } from '@/components/FAQAccordion';
import CinematicScroll from '@/components/CinematicScroll';
import VisualInterlude from '@/components/VisualInterlude';
import MarqueeBand from '@/components/MarqueeBand';
import HorizontalShowcase from '@/components/HorizontalShowcase';
import ScrollLift from '@/components/ScrollLift';
import { storyChapters, processChapters, showcaseDemos } from '@/lib/cinematic';
import { baseRooms } from '@/lib/base-rooms';
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
    <main className="relative flex-1">
      <Hero onClaimOffer={() => setSelectedBuilderPackage('Starter')} />

      <MarqueeBand />

      <CinematicScroll id="story" chapters={storyChapters} />

      <VisualInterlude
        image="/mountains/foothills.jpg"
        imageAlt="Rolling foothills of the Appalachian Mountains in West Virginia"
        landmark="Appalachian Foothills"
        outpost="Promo Transit Corridor"
        eyebrow="Limited Time · Transit Corridor"
        title="$397 Starter Website"
        subtitle="Professional one-page site — delivered in one day. Veteran-owned. Full ownership. Ends July 4th."
        ctaHref="#build"
        ctaLabel="Claim My $397 Website"
      />

      <div className="trust">
        <div className="trust__inner">
          {[
            { icon: Award, text: 'U.S. Veteran Owned & Operated' },
            { icon: MapPin, text: 'Based in West Virginia' },
            { icon: Clock, text: 'Delivered in 1 Day — Guaranteed' },
            { icon: ClipboardList, text: 'Clear Scopes & Pricing' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="trust__item">
              <Icon className="trust__icon h-4 w-4" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <BaseRoom
        room={baseRooms.armoury}
        index="01"
        eyebrow="Build"
        title="Build Your Website"
        subtitle="Pick your package, add upgrades, and submit. Fast delivery, clear pricing, full ownership."
        wide
      >
          <Reveal variant="scale">
            <div className="grid-stats">
              {[
                { label: 'One-Day Delivery', icon: Clock },
                { label: 'Mobile-First', icon: Check },
                { label: '100% Ownership', icon: Award },
                { label: 'Veteran Built', icon: MapPin },
              ].map(({ label, icon: Icon }, i) => (
                <ScrollLift key={label} delay={i * 0.06} className="stat-pill">
                  <Icon className="stat-pill__icon h-4 w-4" />
                  {label}
                </ScrollLift>
              ))}
            </div>
          </Reveal>
          {!isBuilderSubmitted ? (
            <form
              action="https://formspree.io/f/mwvjoklj"
              method="POST"
              onSubmit={handleBuilderSubmit}
              className="order-block"
            >
              <Reveal variant="up">
                <div className="order-step-header">
                  <span className="order-step-label">Step 1 — Choose Package</span>
                  <a href="#pricing" className="text-link">Compare →</a>
                </div>
                <div className="grid-3">
                  {pricingTiers.map((tier) => {
                    const isSelected = selectedBuilderPackage === tier.name;
                    const hasPromo = tier.promoActive && tier.promoPrice != null;
                    const displayPrice = getDisplayPrice(tier);
                    return (
                      <button
                        type="button"
                        key={tier.name}
                        onClick={() => handleBuilderPackageSelect(tier.name)}
                        className={`card order-package text-left p-6 ${isSelected ? 'card--selected' : ''}`}
                      >
                        <div className="order-package__name">
                          {tier.name}
                        </div>
                        <div className="order-package__price-row">
                          {hasPromo && (
                            <span className="order-package__strike">
                              ${tier.price}
                            </span>
                          )}
                          <span className="order-package__price">${displayPrice}</span>
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
              </Reveal>

              <Reveal variant="left" delay="1">
                <span className="order-step-label block mb-6">Step 2 — Optional Upgrades</span>
                <div className="grid-2 max-w-3xl mx-auto">
                  {addOnsList.map((addon) => {
                    const isSelected = selectedAddOnIds.includes(addon.id);
                    return (
                      <label
                        key={addon.id}
                        className={`card flex cursor-pointer items-start gap-4 p-6 ${
                          isSelected ? 'card--selected' : ''
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
              </Reveal>

              <Reveal variant="right" delay="2">
                <span className="order-step-label block mb-6">Step 3 — Your Details</span>
                <div className="card p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="businessName" className="field-label">Business Name *</label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={builderForm.businessName}
                      onChange={handleBuilderInputChange}
                      className="field-input"
                      placeholder="Smith Family Bakery"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="field-label">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={builderForm.email}
                      onChange={handleBuilderInputChange}
                      className="field-input"
                      placeholder="you@yourbusiness.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="field-label">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={builderForm.phone}
                      onChange={handleBuilderInputChange}
                      className="field-input"
                      placeholder="(304) 555-0123"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="field-label">About Your Business</label>
                    <textarea
                      id="description"
                      name="description"
                      value={builderForm.description}
                      onChange={handleBuilderInputChange}
                      className="field-textarea"
                      placeholder="Family-owned bakery in West Virginia. Need a clean site with menu, hours, and contact form."
                      rows={3}
                    />
                  </div>
                </div>
              </Reveal>

              <Reveal variant="scale" delay="3">
                <div className="order-submit">
                  <span className="order-step-label">Step 4 — Review & Submit</span>
                  <div className="order-total-pill">
                    <span className="order-total-pill__label">Estimated total</span>
                    <span className="order-total-pill__amount">${estimatedTotal}</span>
                    <span className="order-total-pill__note">one-time + recurring</span>
                  </div>
                  {selectedBuilderPackage === 'Starter' && (
                    <p className="order-promo-note">
                      Limited Time Offer — $397 until July 4th. Final amount confirmed at checkout.
                    </p>
                  )}
                  <p className="order-trust-line">
                    No payment required today. Pay only after you review and approve the final design.
                  </p>
                  <button
                    type="submit"
                    disabled={isBuilderSubmitting}
                    className="btn btn--primary btn--lg btn--glow"
                  >
                    {isBuilderSubmitting ? 'Submitting...' : 'Submit Order Request'}
                  </button>
                  {submitError && <p className="order-error">{submitError}</p>}
                  <p className="order-trust-line">
                    We&apos;ll contact you within 24 hours to schedule your consultation.
                  </p>
                </div>
              </Reveal>
            </form>
          ) : (
            <Reveal variant="scale">
              <div id="order-success" ref={successRef} className="card success-card">
                <div className="success-card__icon">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="success-card__title">Order Request Received</h3>
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
                <div className="success-card__actions">
                  <button type="button" onClick={resetBuilder} className="btn btn--primary btn--lg btn--glow">
                    Start Another Order
                  </button>
                  {!paymentSuccess && (
                    <button type="button" onClick={handlePayNow} disabled={isPaying} className="btn btn--ghost btn--lg">
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
            </Reveal>
          )}
      </BaseRoom>

      <BaseRoom
        room={baseRooms['command-center']}
        index="02"
        eyebrow="Pricing"
        title="Clear Prices. No Hidden Costs."
        subtitle="Mobile-first sites built in one day. You own everything."
        wide
      >
          <div className="grid-3">
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
          <Reveal variant="up" delay="2">
            <div className="card includes-card max-w-3xl mx-auto mt-10 p-8">
              <p className="text-center includes-card__label mb-6">
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
          </Reveal>
      </BaseRoom>

      <CinematicScroll id="process-cinema" chapters={processChapters} />

      <BaseRoom
        room={baseRooms['mission-planning']}
        index="03"
        eyebrow="Process"
        title="How It Works"
        subtitle="Six simple steps from order to launch."
        wide
      >
          <div className="grid-2">
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <ScrollLift key={index} delay={index * 0.07} className="card step h-full">
                  <div className="step__num">{step.number}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4 text-[var(--cyan)]" />
                      <h3 className="step__title">{step.title}</h3>
                    </div>
                    <p className="step__desc">{step.desc}</p>
                  </div>
                </ScrollLift>
              );
            })}
          </div>
          <div className="section-cta">
            <a href="#build" className="btn btn--primary btn--lg btn--glow">Start Your Order</a>
          </div>
      </BaseRoom>

      <BaseRoom
        room={baseRooms['observation-deck']}
        index="04"
        eyebrow="Examples"
        title="Live Examples"
        subtitle="Explore live demos for each package tier."
        wide
        hideHeader={false}
      >
        <Reveal variant="up">
          <HorizontalShowcase demos={showcaseDemos} />
        </Reveal>
      </BaseRoom>

      <VisualInterlude
        image="/natural-beauty-in-west-virginia.webp"
        imageAlt="Natural beauty across the mountains of West Virginia"
        landmark="West Virginia Highlands"
        outpost="Patriot Observation Wing"
        eyebrow="West Virginia Proud · Patriot Wing"
        title="Built for Local Business"
        subtitle="Real demos. Real results. Websites you will be proud to show customers — and post on Facebook."
        ctaHref="#build"
        ctaLabel="Start Your Order"
        align="left"
      />

      <BaseRoom
        room={baseRooms['after-action-lounge']}
        index="05"
        eyebrow="Testimonials"
        title="Trusted by Local Businesses"
        subtitle="Real results from West Virginia business owners."
        wide
      >
          <div className="grid-3">
            {testimonials.map((t, i) => (
              <ScrollLift key={t.author} delay={i * 0.08} className="card quote-card h-full">
                <p className="quote-card__text">&ldquo;{t.quote}&rdquo;</p>
                <p className="quote-card__author">{t.author}</p>
                <p className="quote-card__meta">{t.business} · {t.location}</p>
              </ScrollLift>
            ))}
          </div>
      </BaseRoom>

      <BaseRoom
        room={baseRooms.debrief}
        index="06"
        eyebrow="Contact"
        title="Let's Build Your Website"
        subtitle="FAQ, upgrades, and direct contact — everything you need to launch."
        wide
      >
          <div className="stack stack-lg">
          <Reveal variant="left">
            <span className="field-label block mb-4">FAQ</span>
            <FAQAccordion faqs={faqs} />
          </Reveal>

          <Reveal variant="right" delay="1">
            <span className="field-label block mb-4">Add-Ons</span>
            <div className="grid-2">
              {addOnsList.map((addon) => (
                <div key={addon.id} className="card p-6">
                  <div className="flex justify-between items-baseline gap-4">
                    <h3 className="text-lg font-semibold">{addon.name}</h3>
                    <span className="text-[var(--cyan)] font-medium text-sm whitespace-nowrap">
                      +${addon.price}
                      <span className="text-[var(--text-dim)]">{addon.period}</span>
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">{addon.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <a href="#build" className="btn btn--ghost btn--lg">Add to Your Order</a>
            </div>
          </Reveal>

          <Reveal variant="scale" delay="2">
            <span className="field-label block mb-4">Get In Touch</span>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                alert('Thank you! Your message has been received. We will contact you soon.');
                form.reset();
              }}
              className="card p-8 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="field-label">Your Name *</label>
                  <input type="text" id="name" name="name" className="field-input" placeholder="Jane Smith" required />
                </div>
                <div>
                  <label htmlFor="business" className="field-label">Business Name *</label>
                  <input type="text" id="business" name="business" className="field-input" placeholder="Smith Family Bakery" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-email" className="field-label">Email *</label>
                  <input type="email" id="contact-email" name="email" className="field-input" placeholder="you@yourbusiness.com" required />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="field-label">Phone</label>
                  <input type="tel" id="contact-phone" name="phone" className="field-input" placeholder="(304) 555-0123" />
                </div>
              </div>
              <div>
                <label htmlFor="package" className="field-label">Interested Package</label>
                <select id="package" name="package" className="field-input">
                  {pricingTiers.map((tier) => (
                    <option key={tier.name} value={tier.name}>
                      {tier.name} — ${tier.price}
                    </option>
                  ))}
                  <option value="Not sure yet">Not sure yet</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="field-label">Tell us about your project</label>
                <textarea
                  id="message"
                  name="message"
                  className="field-textarea"
                  placeholder="We're a family-owned plumbing company in West Virginia..."
                />
              </div>
              <button type="submit" className="btn btn--primary btn--lg btn--glow w-full">
                Send Message
              </button>
              <p className="text-center text-xs text-[var(--text-dim)]">
                I&apos;ll personally review your request within 24 hours. No spam, ever.
              </p>
            </form>
          </Reveal>

          <div className="section-cta">
            <a href="#build" className="btn btn--primary btn--lg btn--glow">Start Your Order</a>
          </div>
          </div>
      </BaseRoom>
    </main>
  );
}