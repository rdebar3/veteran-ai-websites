'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  Phone,
  Wrench,
  Clock,
  Shield,
  MapPin,
  Star,
  CheckCircle,
  Menu,
  X,
  Droplet,
  Flame,
  Hammer,
  Home,
  Award,
} from 'lucide-react';
import CinematicEntrance from '@/components/starter-plumbing/CinematicEntrance';
import { scrollToElement } from '@/lib/scroll-driver';

interface ServiceItem {
  icon: React.ElementType;
  title: string;
  desc: string;
}

interface TrustItem {
  icon: React.ElementType;
  title: string;
  desc: string;
}

interface TestimonialItem {
  quote: string;
  name: string;
  location: string;
  rating: number;
}

const services: ServiceItem[] = [
  {
    icon: Phone,
    title: '24/7 Emergency Plumbing',
    desc: 'Burst pipes, major leaks, or no water? We respond quickly for emergencies in Ridgeview and nearby areas, often arriving within the hour.',
  },
  {
    icon: Droplet,
    title: 'Drain Cleaning & Clog Removal',
    desc: 'Kitchen sinks, bathtubs, toilets, or main lines backing up. Camera inspections and hydro-jetting to clear tough clogs for good.',
  },
  {
    icon: Flame,
    title: 'Water Heater Repair & Replacement',
    desc: 'No hot water, leaking tanks, or old units. We repair and install standard, tankless, and high-efficiency water heaters the same day when possible.',
  },
  {
    icon: Hammer,
    title: 'Pipe Repair & Repiping',
    desc: 'Leaking pipes, low water pressure, or outdated galvanized lines. Spot repairs or full repipes with minimal disruption to your home.',
  },
  {
    icon: Wrench,
    title: 'Toilet, Faucet & Fixture Repair',
    desc: 'Running toilets, dripping faucets, shower valves, and new fixture installations. Quality parts and clean, professional work every time.',
  },
  {
    icon: Home,
    title: 'Sump Pumps & Basement Drains',
    desc: 'Sump pump installation, repair, and battery backups. We help keep basements dry during heavy rains common in our area.',
  },
];

const trustItems: TrustItem[] = [
  {
    icon: Shield,
    title: 'Licensed & Fully Insured',
    desc: 'West Virginia licensed plumber. Fully bonded and insured for your protection on every job, big or small.',
  },
  {
    icon: Clock,
    title: 'Fast Local Response',
    desc: 'Most calls answered by a technician. Same-day service available for the majority of jobs in Ridgeview and surrounding towns.',
  },
  {
    icon: MapPin,
    title: 'Proudly Local to Ridgeview',
    desc: 'We live and work right here in the area. We know the homes, the water systems, and the people of Ridgeview and nearby communities.',
  },
  {
    icon: Award,
    title: 'U.S. Veteran Owned',
    desc: 'Owned and operated by a U.S. Army veteran. We bring the same discipline, honesty, and attention to detail to every job.',
  },
];

const testimonials: TestimonialItem[] = [
  {
    quote: "Called on a Sunday night with a burst pipe in the laundry room. They were at the house in under an hour, fixed it fast, and cleaned up completely. Couldn't ask for better service.",
    name: 'Robert J.',
    location: 'Ridgeview, WV',
    rating: 5,
  },
  {
    quote: 'Replaced our 20-year-old water heater the same afternoon. Explained everything clearly and the price was fair with no surprises. The new unit works great.',
    name: 'Karen & Tom H.',
    location: 'Oakdale, WV',
    rating: 5,
  },
  {
    quote: 'Our main drain was clogged for days. They used a camera to find the problem, cleared it properly, and gave us tips to avoid it happening again. Very professional.',
    name: 'Linda M.',
    location: 'Pine Hollow, WV',
    rating: 5,
  },
  {
    quote: 'Installed a new sump pump system before the heavy rains hit. The tech took the time to show me how it works and even checked the old one. Peace of mind for our basement.',
    name: 'David P.',
    location: 'Ridgeview, WV',
    rating: 5,
  },
];

const serviceAreas = [
  'Ridgeview',
  'Oakdale',
  'Pine Hollow',
  'Clear Springs',
  'Maple Fork',
  'River Bend',
  'And surrounding towns in the area',
];

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.sp-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sp-reveal--in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function SummitPlumbingDemo() {
  const [introDone, setIntroDone] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    service: '',
    message: '',
  });
  const navRef = useRef<HTMLElement>(null);

  useScrollReveal();

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleIntroComplete = useCallback(() => setIntroDone(true), []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Please enter your name and phone number.');
      return;
    }
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({ name: '', phone: '', email: '', address: '', service: '', message: '' });
  };

  const goTo = (id: string) => {
    scrollToElement(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={`sp-demo ${introDone ? 'sp-demo--ready' : ''}`}>
      {!introDone && <CinematicEntrance onComplete={handleIntroComplete} />}

      <nav ref={navRef} className={`sp-nav ${navScrolled ? 'sp-nav--scrolled' : ''}`}>
        <div className="sp-nav__inner">
          <a href="#top" className="sp-nav__logo" onClick={(e) => { e.preventDefault(); goTo('top'); }}>
            <span className="sp-nav__logo-icon"><Wrench className="h-4 w-4" /></span>
            <span>
              <div className="sp-nav__logo-text">Summit Plumbing</div>
              <div className="sp-nav__logo-sub">LLC · Ridgeview, WV</div>
            </span>
          </a>

          <div className="sp-nav__links">
            <a href="#services" className="sp-nav__link" onClick={(e) => { e.preventDefault(); goTo('services'); }}>Services</a>
            <a href="#about" className="sp-nav__link" onClick={(e) => { e.preventDefault(); goTo('about'); }}>About</a>
            <a href="#reviews" className="sp-nav__link" onClick={(e) => { e.preventDefault(); goTo('reviews'); }}>Reviews</a>
            <a href="#contact" className="sp-nav__link" onClick={(e) => { e.preventDefault(); goTo('contact'); }}>Contact</a>
            <a href="tel:3045550192" className="sp-nav__cta">
              <Phone className="h-3.5 w-3.5" /> Call Now
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[var(--sp-muted)]"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--sp-border)] px-6 py-4 flex flex-col gap-3">
            {['services', 'about', 'reviews', 'contact'].map((id) => (
              <button key={id} type="button" onClick={() => goTo(id)} className="sp-nav__link text-left capitalize py-1">
                {id}
              </button>
            ))}
            <a href="tel:3045550192" className="sp-nav__cta justify-center mt-2">
              <Phone className="h-3.5 w-3.5" /> (304) 555-0192
            </a>
          </div>
        )}
      </nav>

      <section id="top" className="sp-hero">
        <div className="sp-hero__bg">
          <Image
            src="/demos/starter-plumbing/hero-tech.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={90}
            className="sp-hero__bg-img"
          />
          <div className="sp-hero__veil" />
          <div className="sp-hero__grid" />
          <div className="sp-hero__glow" />
        </div>

        <div className="sp-hero__content">
          <div className="sp-hero__badge">
            <span className="sp-hero__badge-star">★</span>
            Ridgeview, West Virginia · Veteran Owned
          </div>

          <h1 className="sp-hero__title">
            Fast, Reliable
            <span className="sp-hero__title-accent">Plumbing When It Matters</span>
          </h1>

          <p className="sp-hero__lead">
            Serving families and businesses in Ridgeview and the surrounding towns with honest work,
            futuristic precision, and dependable same-day service.
          </p>

          <div className="sp-hero__cta-row">
            <a href="tel:3045550192" className="sp-btn sp-btn--primary">
              <Phone className="h-4 w-4" /> Call (304) 555-0192
            </a>
            <button type="button" className="sp-btn sp-btn--ghost" onClick={() => goTo('contact')}>
              Get a Free Quote
            </button>
          </div>

          <div className="sp-hero__trust">
            <span><CheckCircle className="h-3.5 w-3.5 text-[var(--sp-cyan)]" /> Same-day service often available</span>
            <span><CheckCircle className="h-3.5 w-3.5 text-[var(--sp-cyan)]" /> Licensed · Insured</span>
            <span><CheckCircle className="h-3.5 w-3.5 text-[var(--sp-cyan)]" /> 24/7 emergency response</span>
          </div>
        </div>
      </section>

      <div className="sp-trust-strip">
        <div className="sp-trust-strip__inner">
          <span>Serving Ridgeview &amp; the Area for <strong>12+ Years</strong></span>
          <span>24/7 Emergency Response</span>
          <span>Upfront Pricing · No Surprises</span>
          <span><strong>WV License #P-38471</strong></span>
        </div>
      </div>

      <section
        id="services"
        className="sp-section sp-section--vista"
        style={{ '--sp-vista': "url('/mountains/misty-ridges.jpg')" } as React.CSSProperties}
      >
        <div className="sp-section__inner sp-reveal">
          <p className="sp-section__eyebrow">What We Do Best</p>
          <h2 className="sp-section__title">Professional Plumbing Services</h2>
          <p className="sp-section__lead">
            From everyday fixes to urgent repairs, we deliver quality work you can count on in Ridgeview and the surrounding area.
          </p>

          <div className="sp-grid-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className="sp-card sp-reveal">
                  <div className="sp-card__icon"><Icon className="h-5 w-5" /></div>
                  <h3 className="sp-card__title">{service.title}</h3>
                  <p className="sp-card__text">{service.desc}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <button type="button" className="sp-btn sp-btn--ghost" onClick={() => goTo('contact')}>
              Need help with something specific? Request a quote →
            </button>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="sp-section sp-section--vista"
        style={{ '--sp-vista': "url('/interludes/promo-foothills.jpg')" } as React.CSSProperties}
      >
        <div className="sp-section__inner sp-reveal">
          <div className="sp-grid-2" style={{ alignItems: 'start', gap: '2.5rem' }}>
            <div>
              <p className="sp-section__eyebrow">About Summit Plumbing</p>
              <h2 className="sp-section__title">A local company built on trust and mountain grit.</h2>
              <p className="sp-section__lead" style={{ marginBottom: '1rem' }}>
                Summit Plumbing LLC is based right here in Ridgeview. We were started by a U.S. Army veteran who wanted
                to bring reliable, honest plumbing service to the families and businesses in our small town.
              </p>
              <p className="sp-section__lead" style={{ marginBottom: '1.5rem' }}>
                We show up when we say we will, explain the work in plain language, and stand behind every job. No upsells,
                no hidden fees — just neighbors helping neighbors.
              </p>
              <a href="tel:3045550192" className="sp-btn sp-btn--ghost">
                Call us today at (304) 555-0192 →
              </a>
            </div>

            <div className="sp-grid-2">
              {trustItems.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="sp-card sp-reveal">
                    <div className="sp-card__icon"><Icon className="h-5 w-5" /></div>
                    <h3 className="sp-card__title">{item.title}</h3>
                    <p className="sp-card__text">{item.desc}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="sp-section">
        <div className="sp-section__inner sp-reveal">
          <p className="sp-section__eyebrow">Real Customers, Real Results</p>
          <h2 className="sp-section__title">What Our Neighbors Are Saying</h2>

          <div className="sp-grid-2 mt-8">
            {testimonials.map((t) => (
              <article key={t.name} className="sp-card sp-quote sp-reveal">
                <div className="sp-quote__stars">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="sp-quote__text">&ldquo;{t.quote}&rdquo;</p>
                <p className="sp-quote__author">{t.name}</p>
                <p className="sp-quote__meta">{t.location}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sp-areas">
        <div className="sp-section__inner sp-reveal">
          <div className="sp-grid-2" style={{ alignItems: 'center' }}>
            <div>
              <p className="sp-section__eyebrow">We Serve Our Neighbors</p>
              <h2 className="sp-section__title">Proudly serving Ridgeview and the surrounding towns.</h2>
              <p className="sp-section__lead">
                We know the area and the homes here. From Ridgeview to the nearby towns, we&apos;re just a short drive away when you need us.
              </p>
              <a href="tel:3045550192" className="sp-btn sp-btn--primary">
                <Phone className="h-4 w-4" /> Call for service in your area
              </a>
            </div>
            <div className="sp-areas__list">
              {serviceAreas.map((area) => (
                <div key={area} className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[var(--sp-cyan)] shrink-0" /> {area}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="sp-section">
        <div className="sp-section__inner sp-reveal">
          <p className="sp-section__eyebrow">Get In Touch Today</p>
          <h2 className="sp-section__title">Request Service or a Free Quote</h2>
          <p className="sp-section__lead">Call for the fastest response, or fill out the form and we&apos;ll get back to you quickly.</p>

          <div className="sp-grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
            <div className="sp-card sp-form">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="sp-grid-2" style={{ gap: '1rem' }}>
                    <div className="sp-field">
                      <label htmlFor="name">Full Name *</label>
                      <input id="name" type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Jamie Thompson" />
                    </div>
                    <div className="sp-field">
                      <label htmlFor="phone">Phone Number *</label>
                      <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="(304) 555-1234" />
                    </div>
                  </div>
                  <div className="sp-grid-2" style={{ gap: '1rem' }}>
                    <div className="sp-field">
                      <label htmlFor="email">Email Address</label>
                      <input id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="you@email.com" />
                    </div>
                    <div className="sp-field">
                      <label htmlFor="address">Service Address</label>
                      <input id="address" type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="128 Elm Street, Ridgeview" />
                    </div>
                  </div>
                  <div className="sp-field">
                    <label htmlFor="service">What do you need help with?</label>
                    <select id="service" name="service" value={formData.service} onChange={handleInputChange}>
                      <option value="">Select a service</option>
                      <option value="Emergency Repair">Emergency Plumbing Repair</option>
                      <option value="Drain Cleaning">Drain Cleaning / Clog Removal</option>
                      <option value="Water Heater">Water Heater Repair or Replacement</option>
                      <option value="Pipe Repair">Pipe Repair or Repiping</option>
                      <option value="Fixtures">Toilet, Faucet or Fixture Work</option>
                      <option value="Sump Pump">Sump Pump or Basement Drainage</option>
                      <option value="Other">Other / Not Sure Yet</option>
                    </select>
                  </div>
                  <div className="sp-field">
                    <label htmlFor="message">Tell us about the problem</label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} rows={4} placeholder="Kitchen sink is backing up after the rain last night..." />
                  </div>
                  <button type="submit" className="sp-btn sp-btn--primary w-full">
                    Submit Request — We&apos;ll Call You Soon
                  </button>
                  <p className="text-center text-xs text-[var(--sp-muted)]">
                    We typically respond within 15 minutes during business hours. For true emergencies, please call.
                  </p>
                </form>
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
                    <CheckCircle className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Thank you, {formData.name.split(' ')[0] || 'friend'}!</h3>
                  <p className="text-[var(--sp-muted)]">
                    We received your request. A technician will call you at <strong className="text-[var(--sp-text)]">{formData.phone}</strong> shortly.
                  </p>
                  <button type="button" onClick={resetForm} className="mt-6 text-sm text-[var(--sp-cyan)] underline">
                    Submit another request
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="sp-card">
                <h3 className="font-semibold text-lg mb-4">Summit Plumbing LLC</h3>
                <div className="space-y-4 text-sm text-[var(--sp-muted)]">
                  <a href="tel:3045550192" className="flex items-start gap-3 group">
                    <Phone className="h-4 w-4 text-[var(--sp-cyan)] mt-0.5" />
                    <span>
                      <span className="block font-semibold text-[var(--sp-cyan)] group-hover:underline">(304) 555-0192</span>
                      Available 24/7 for emergencies
                    </span>
                  </a>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-[var(--sp-cyan)] mt-0.5" />
                    <span>128 Elm Street<br />Ridgeview, WV 26501</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 text-[var(--sp-cyan)] mt-0.5" />
                    <span>
                      Mon–Fri: 7:00am – 6:00pm<br />
                      Sat: 8:00am – 4:00pm<br />
                      <strong className="text-[var(--sp-cyan)]">24/7 Emergency Service</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="sp-card text-sm text-[var(--sp-muted)]">
                <p className="font-semibold text-[var(--sp-text)] mb-2">What happens next?</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>We&apos;ll call you within 15 minutes (or immediately for emergencies).</li>
                  <li>A technician will give you an honest upfront price before any work begins.</li>
                  <li>We complete the job cleanly and explain exactly what was done.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="sp-footer">
        <div className="sp-footer__inner">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="sp-nav__logo-icon"><Wrench className="h-4 w-4" /></span>
                <span className="font-bold text-lg">Summit Plumbing LLC</span>
              </div>
              <p className="text-sm text-[var(--sp-muted)] max-w-xs">
                Fast, honest plumbing service for Ridgeview and the surrounding towns in West Virginia.
              </p>
              <p className="mt-2 text-xs text-[var(--sp-muted)]">U.S. Veteran Owned &amp; Operated</p>
            </div>
            <div className="text-sm text-[var(--sp-muted)] space-y-1">
              <a href="tel:3045550192" className="block hover:text-[var(--sp-cyan)]">(304) 555-0192</a>
              <a href="mailto:service@summitplumbingwv.com" className="block hover:text-[var(--sp-cyan)]">service@summitplumbingwv.com</a>
              <span>128 Elm Street, Ridgeview, WV 26501</span>
            </div>
          </div>
          <div className="sp-footer__demo">
            © {new Date().getFullYear()} Summit Plumbing LLC · WV License #P-38471 · This is a demonstration Starter package site by Veteran AI Websites.
          </div>
        </div>
      </footer>
    </div>
  );
}