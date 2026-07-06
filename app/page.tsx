'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Check,
  CheckCircle,
} from 'lucide-react';

import HeroCinematic from '@/components/HeroCinematic';
import CinematicSection from '@/components/CinematicSection';
import BaseRoom from '@/components/BaseRoom';
import Reveal from '@/components/Reveal';
import PricingCard from '@/components/PricingCard';
import FAQAccordion, { type FAQ } from '@/components/FAQAccordion';
import OfferCountdown from '@/components/OfferCountdown';

import HorizontalShowcase from '@/components/HorizontalShowcase';
import { InViewItem, InViewStagger } from '@/components/InViewStagger';
import { showcaseDemos } from '@/lib/cinematic';
import { baseRooms } from '@/lib/base-rooms';
import {
  pricingTiers,
  addOnsList,
  howItWorksSteps,
  allPackagesInclude,
  getDisplayPrice,
} from '@/lib/data';
import { testimonials } from '@/lib/testimonials';
import { scrollToElement } from '@/lib/scroll-driver';
import MagneticButton from '@/components/MagneticButton';

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
          const success = document.getElementById('order-success');
          if (success) scrollToElement(success, { offset: -48 });
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
      <HeroCinematic onClaimOffer={() => setSelectedBuilderPackage('Starter')} />

      <CinematicSection
        video="/cinematic/command-base.mp4"
        poster="/cinematic/command-base-poster.jpg"
        side="left"
        eyebrow="Inside the command base"
        title={<>Built from the woods.<br /><span className="cine-sec__grad">Engineered like a mission.</span></>}
        body="Starlink overhead, AI on the desk, the flag on the wall — your website deployed with the discipline of an operation, not the chaos of an agency."
        ctaHref="#build"
        ctaLabel="Start your build"
      />

      <BaseRoom
        room={baseRooms.armoury}
        eyebrow="Build"
        className="base-room--functional"
        title="Build Your Website"
        subtitle="Pick your package, add upgrades, and submit. Fast delivery, clear pricing, full ownership."
        wide
      >
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
                          <OfferCountdown compact className="mt-2" />
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
                          className="mt-1 accent-[var(--cyan)] h-4 w-4"
                        />
                        <div>
                          <div className="text-[var(--text-cream)] font-medium">{addon.name}</div>
                          <div className="text-sm text-[var(--amber)] font-semibold mt-1">
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
                <div className="card card--flat p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div className="order-promo-block">
                      <OfferCountdown compact />
                      <p className="order-promo-note">
                        Limited Time Offer — $397 Starter (was $497). Final amount confirmed at checkout.
                      </p>
                    </div>
                  )}
                  <p className="order-trust-line">
                    No payment required today. Pay only after you review and approve the final design.
                  </p>
                  <MagneticButton
                    type="submit"
                    disabled={isBuilderSubmitting}
                    magnetic={!isBuilderSubmitting}
                    className="btn btn--primary btn--lg btn--glow"
                  >
                    {isBuilderSubmitting ? 'Submitting...' : 'Submit Order Request'}
                  </MagneticButton>
                  {submitError && <p className="order-error">{submitError}</p>}
                  <p className="order-trust-line">
                    We&apos;ll contact you within 24 hours to schedule your consultation.
                  </p>
                </div>
              </Reveal>
            </form>
          ) : (
            <Reveal variant="scale">
              <div id="order-success" ref={successRef} className="card card--flat success-card">
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
                  <MagneticButton type="button" onClick={resetBuilder} className="btn btn--primary btn--lg btn--glow">
                    Start Another Order
                  </MagneticButton>
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

      <CinematicSection
        video="/cinematic/veteran.mp4"
        poster="/cinematic/veteran-poster.jpg"
        side="right"
        eyebrow="One veteran · One mission"
        title={<>You work with the<br /><span className="cine-sec__grad">person doing the work.</span></>}
        body="No offshore ticket queue, no account managers. Just direct communication with a U.S. veteran who treats your site like a deployment — planned, executed, delivered on time."
      />

      <BaseRoom
        room={baseRooms['command-center']}
        eyebrow="Pricing"
        className="base-room--functional"
        title="Clear Prices. No Hidden Costs."
        subtitle="Mobile-first sites built in one day. You own everything."
        wide
      >
          <InViewStagger className="grid-3" stagger={0.1}>
            {pricingTiers.map((tier) => (
              <InViewItem key={tier.name} variant="card" className="h-full">
                <PricingCard
                  tier={tier}
                  onSelect={(name) => {
                    setSelectedBuilderPackage(name);
                    scrollToElement('build');
                  }}
                />
              </InViewItem>
            ))}
          </InViewStagger>
          <Reveal variant="up" delay="2">
            <div className="card card--flat includes-card max-w-3xl mx-auto mt-10 p-8">
              <p className="text-center includes-card__label mb-6">
                Every package includes
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allPackagesInclude.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                    <Check className="h-4 w-4 text-[var(--cyan)] shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
      </BaseRoom>

      <BaseRoom
        room={baseRooms['mission-planning']}
        eyebrow="Process"
        className="base-room--functional"
        title="How It Works"
        subtitle="Six simple steps from order to launch."
        wide
      >
          <InViewStagger className="grid-2" stagger={0.09}>
            {howItWorksSteps.map((step) => {
              const Icon = step.icon;
              return (
                <InViewItem key={step.number} variant="card" className="h-full">
                  <div className="card step h-full">
                    <div className="step__num">{step.number}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4 text-[var(--cyan)]" />
                        <h3 className="step__title">{step.title}</h3>
                      </div>
                      <p className="step__desc">{step.desc}</p>
                    </div>
                  </div>
                </InViewItem>
              );
            })}
          </InViewStagger>
          <Reveal variant="up" delay="1">
            <div className="section-cta">
              <MagneticButton href="#build" className="btn btn--primary btn--lg btn--glow">
                Start Your Order
              </MagneticButton>
            </div>
          </Reveal>
      </BaseRoom>

      <BaseRoom
        room={baseRooms['observation-deck']}
        eyebrow="Examples"
        title="Live Examples"
        subtitle="Explore live demos for each package tier. Each card links to a working site built for a real business type."
        wide
        className="base-room--functional"
      >
        <HorizontalShowcase demos={showcaseDemos} />
      </BaseRoom>

      <BaseRoom
        room={baseRooms['after-action-lounge']}
        eyebrow="Testimonials"
        className="base-room--functional"
        title="Trusted by Local Businesses"
        subtitle="Real results from West Virginia business owners."
        wide
      >
          <InViewStagger className="grid-3" stagger={0.1}>
            {testimonials.map((t) => (
              <InViewItem key={t.author} variant="card" className="h-full">
                <div className="card quote-card h-full">
                  <p className="quote-card__text">&ldquo;{t.quote}&rdquo;</p>
                  <p className="quote-card__author">{t.author}</p>
                  <p className="quote-card__meta">{t.business} · {t.location}</p>
                </div>
              </InViewItem>
            ))}
          </InViewStagger>
      </BaseRoom>

      <CinematicSection
        video="/cinematic/night.mp4"
        poster="/cinematic/night-poster.jpg"
        side="center"
        eyebrow="The lights stay on"
        title={<>Let&apos;s build <span className="cine-sec__grad">yours.</span></>}
        ctaHref="#build"
        ctaLabel="Claim my $397 site"
      />

      <BaseRoom
        room={baseRooms.debrief}
        eyebrow="Contact"
        className="base-room--functional"
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
              className="card card--flat p-8 space-y-6"
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
              <MagneticButton type="submit" block className="btn btn--primary btn--lg btn--glow w-full">
                Send Message
              </MagneticButton>
              <p className="text-center text-xs text-[var(--text-dim)]">
                I&apos;ll personally review your request within 24 hours. No spam, ever.
              </p>
            </form>
          </Reveal>

          <div className="section-cta">
            <MagneticButton href="#build" className="btn btn--primary btn--lg btn--glow">
              Start Your Order
            </MagneticButton>
          </div>
          </div>
      </BaseRoom>
    </main>
  );
}
