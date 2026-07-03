'use client';

import React, { useState, useEffect } from 'react';
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
    title: "24/7 Emergency Plumbing",
    desc: "Burst pipes, major leaks, or no water? We respond quickly for emergencies in Ridgeview and nearby areas, often arriving within the hour.",
  },
  {
    icon: Droplet,
    title: "Drain Cleaning & Clog Removal",
    desc: "Kitchen sinks, bathtubs, toilets, or main lines backing up. Camera inspections and hydro-jetting to clear tough clogs for good.",
  },
  {
    icon: Flame,
    title: "Water Heater Repair & Replacement",
    desc: "No hot water, leaking tanks, or old units. We repair and install standard, tankless, and high-efficiency water heaters the same day when possible.",
  },
  {
    icon: Hammer,
    title: "Pipe Repair & Repiping",
    desc: "Leaking pipes, low water pressure, or outdated galvanized lines. Spot repairs or full repipes with minimal disruption to your home.",
  },
  {
    icon: Wrench,
    title: "Toilet, Faucet & Fixture Repair",
    desc: "Running toilets, dripping faucets, shower valves, and new fixture installations. Quality parts and clean, professional work every time.",
  },
  {
    icon: Home,
    title: "Sump Pumps & Basement Drains",
    desc: "Sump pump installation, repair, and battery backups. We help keep basements dry during heavy rains common in our area.",
  },
];

const trustItems: TrustItem[] = [
  {
    icon: Shield,
    title: "Licensed & Fully Insured",
    desc: "West Virginia licensed plumber. Fully bonded and insured for your protection on every job, big or small.",
  },
  {
    icon: Clock,
    title: "Fast Local Response",
    desc: "Most calls answered by a technician. Same-day service available for the majority of jobs in Ridgeview and surrounding towns.",
  },
  {
    icon: MapPin,
    title: "Proudly Local to Ridgeview",
    desc: "We live and work right here in the area. We know the homes, the water systems, and the people of Ridgeview and nearby communities.",
  },
  {
    icon: Award,
    title: "U.S. Veteran Owned",
    desc: "Owned and operated by a U.S. Army veteran. We bring the same discipline, honesty, and attention to detail to every job.",
  },
];

const testimonials: TestimonialItem[] = [
  {
    quote: "Called on a Sunday night with a burst pipe in the laundry room. They were at the house in under an hour, fixed it fast, and cleaned up completely. Couldn’t ask for better service.",
    name: "Robert J.",
    location: "Ridgeview, WV",
    rating: 5,
  },
  {
    quote: "Replaced our 20-year-old water heater the same afternoon. Explained everything clearly and the price was fair with no surprises. The new unit works great.",
    name: "Karen & Tom H.",
    location: "Oakdale, WV",
    rating: 5,
  },
  {
    quote: "Our main drain was clogged for days. They used a camera to find the problem, cleared it properly, and gave us tips to avoid it happening again. Very professional.",
    name: "Linda M.",
    location: "Pine Hollow, WV",
    rating: 5,
  },
  {
    quote: "Installed a new sump pump system before the heavy rains hit. The tech took the time to show me how it works and even checked the old one. Peace of mind for our basement.",
    name: "David P.",
    location: "Ridgeview, WV",
    rating: 5,
  },
];

const serviceAreas = [
  "Ridgeview",
  "Oakdale",
  "Pine Hollow",
  "Clear Springs",
  "Maple Fork",
  "River Bend",
  "And surrounding towns in the area",
];

export default function SummitPlumbingDemo() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    service: '',
    message: '',
  });

  // Hide the main site's Navbar and Footer so this renders as a true standalone demo site
  useEffect(() => {
    const mainNav = document.querySelector('nav');
    if (mainNav && mainNav.textContent?.includes('Veteran AI Websites')) {
      (mainNav as HTMLElement).style.display = 'none';
    }

    const mainFooter = document.querySelector('footer');
    if (mainFooter && mainFooter.textContent?.includes('Veteran AI Websites')) {
      (mainFooter as HTMLElement).style.display = 'none';
    }

    document.title = 'Summit Plumbing LLC | Ridgeview, WV | (304) 555-0192';

    return () => {
      if (mainNav) (mainNav as HTMLElement).style.display = '';
      if (mainFooter) (mainFooter as HTMLElement).style.display = '';
    };
  }, []);

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
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      service: '',
      message: '',
    });
  };

  const scrollToContact = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] font-sans">
      {/* STICKY NAVBAR - Clean professional plumbing style */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1e3a8a] text-white">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-2xl tracking-[-0.5px] text-[#1e3a8a]">Summit Plumbing</div>
                <div className="text-[10px] text-slate-500 -mt-1 font-medium tracking-[1px]">LLC</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-9 text-sm font-medium">
              <a href="#top" className="text-slate-600 hover:text-[#1e3a8a] transition-colors">Home</a>
              <a href="#services" className="text-slate-600 hover:text-[#1e3a8a] transition-colors">Services</a>
              <a href="#about" className="text-slate-600 hover:text-[#1e3a8a] transition-colors">About</a>
              <a href="#reviews" className="text-slate-600 hover:text-[#1e3a8a] transition-colors">Reviews</a>
              <a href="#contact" className="text-slate-600 hover:text-[#1e3a8a] transition-colors">Contact</a>
            </div>

            {/* Call Now CTA (prominent) */}
            <div className="flex items-center gap-3">
              <a
                href="tel:3045550192"
                className="hidden sm:flex items-center gap-2.5 rounded-lg bg-[#1e3a8a] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#162d6b] transition-all active:bg-[#0f1f4a]"
              >
                <Phone className="h-4 w-4" />
                <span>Call Now</span>
              </a>
              <a
                href="tel:3045550192"
                className="sm:hidden flex items-center justify-center rounded-lg bg-[#1e3a8a] px-4 py-2 text-sm font-semibold text-white"
              >
                <Phone className="h-4 w-4" />
              </a>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-600"
                aria-label="Toggle navigation"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-6 py-5">
            <div className="flex flex-col gap-y-4 text-base font-medium">
              <a href="#top" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 py-1">Home</a>
              <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 py-1">Services</a>
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 py-1">About</a>
              <a href="#reviews" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 py-1">Reviews</a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 py-1">Contact</a>
              <div className="pt-2 border-t border-slate-200">
                <a
                  href="tel:3045550192"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1e3a8a] py-3 text-sm font-semibold text-white"
                >
                  <Phone className="h-4 w-4" /> (304) 555-0192
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section id="top" className="relative">
        <div className="relative h-[620px] md:h-[680px] flex items-center bg-slate-900">
          {/* Background image - realistic plumber on the job */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1585704032915-c3400ca199e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')" 
            }}
          />
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 via-[#0f172a]/75 to-[#0f172a]/60" />

          <div className="relative max-w-5xl mx-auto px-6 text-white">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium tracking-[0.5px] mb-5">
                RIDGEVIEW, WEST VIRGINIA
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-[-1.5px] leading-[1.05] mb-6">
                Fast, Reliable Plumbing<br />When You Need It Most
              </h1>

              <p className="max-w-lg text-xl text-white/90 mb-9">
                Serving families and businesses in Ridgeview and the surrounding towns with honest work and dependable service.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:3045550192"
                  className="inline-flex items-center justify-center gap-3 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-[#1e3a8a] shadow-lg hover:bg-slate-100 active:bg-white transition-all"
                >
                  <Phone className="h-5 w-5" />
                  Call (304) 555-0192
                </a>
                <button
                  onClick={scrollToContact}
                  className="inline-flex items-center justify-center rounded-xl border-2 border-white/80 px-8 py-4 text-lg font-semibold text-white hover:bg-white/10 active:bg-white/5 transition-all"
                >
                  Get a Free Quote
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" /> Same-day service often available
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" /> Licensed • Insured
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" /> Veteran owned
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div className="border-b border-slate-200 bg-white py-4">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-sm text-slate-600">
            <div className="font-medium">Serving Ridgeview &amp; the Area for 12+ Years</div>
            <div className="hidden sm:block w-px h-3 bg-slate-300" />
            <div>24/7 Emergency Response</div>
            <div className="hidden sm:block w-px h-3 bg-slate-300" />
            <div>Upfront Pricing • No Surprises</div>
            <div className="hidden sm:block w-px h-3 bg-slate-300" />
            <div className="text-[#1e3a8a] font-semibold">WV License #P-38471</div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <div className="uppercase tracking-[2px] text-xs font-semibold text-[#1e3a8a] mb-3">What We Do Best</div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-[-1px] text-[#0f172a]">Professional Plumbing Services</h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            From everyday fixes to urgent repairs, we deliver quality work you can count on in Ridgeview and the surrounding area.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-all">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#1e3a8a]/10 text-[#1e3a8a]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-[#0f172a] tracking-[-0.3px] mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed">{service.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <button 
            onClick={scrollToContact}
            className="inline-flex items-center gap-2 text-[#1e3a8a] font-semibold hover:underline"
          >
            Need help with something specific? Request a quote →
          </button>
        </div>
      </section>

      {/* WHY CHOOSE US / ABOUT / TRUST SECTION */}
      <section id="about" className="bg-slate-50 border-y border-slate-200 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left content - About the company */}
            <div className="lg:col-span-5">
              <div className="uppercase tracking-[2px] text-xs font-semibold text-[#1e3a8a] mb-3">About Summit Plumbing</div>
              <h2 className="text-4xl font-semibold tracking-[-1px] text-[#0f172a] leading-tight mb-6">
                A local company built on trust and hard work.
              </h2>
              <div className="space-y-4 text-[15px] text-slate-600 leading-relaxed">
                <p>
                  Summit Plumbing LLC is based right here in Ridgeview. We were started by a U.S. Army veteran who wanted 
                  to bring reliable, honest plumbing service to the families and businesses in our small town and the nearby communities.
                </p>
                <p>
                  We show up when we say we will, explain the work in plain language, and stand behind every job. No upsells, 
                  no hidden fees, just neighbors helping neighbors.
                </p>
              </div>
              <div className="mt-8">
                <a href="tel:3045550192" className="inline-flex items-center text-sm font-semibold text-[#1e3a8a] hover:underline">
                  Call us today at (304) 555-0192 →
                </a>
              </div>
            </div>

            {/* Trust grid */}
            <div className="lg:col-span-7">
              <div className="grid sm:grid-cols-2 gap-6">
                {trustItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="rounded-2xl bg-white p-7 border border-slate-200">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1e3a8a]/10 text-[#1e3a8a]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-lg text-[#0f172a] mb-1.5">{item.title}</div>
                          <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS / REVIEWS */}
      <section id="reviews" className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <div className="uppercase tracking-[2px] text-xs font-semibold text-[#1e3a8a] mb-3">Real Customers, Real Results</div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-[-1px] text-[#0f172a]">What Our Neighbors Are Saying</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex text-[#f59e0b] mb-5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>

              <blockquote className="text-[15px] leading-relaxed text-slate-700 mb-6">
                “{testimonial.quote}”
              </blockquote>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-medium text-sm">
                  {testimonial.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                </div>
                <div>
                  <div className="font-semibold text-[#0f172a]">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-slate-500">
          Real reviews from real customers in Ridgeview and the surrounding area.
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="bg-[#1e3a8a] text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="uppercase tracking-[2px] text-xs font-semibold text-white/70 mb-3">WE SERVE OUR NEIGHBORS</div>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-[-1px] leading-tight mb-6">
                Proudly serving Ridgeview and the surrounding towns.
              </h2>
              <p className="text-lg text-white/80 max-w-md">
                We know the area and the homes here. From Ridgeview to the nearby towns, we’re just a short drive away when you need us.
              </p>

              <a 
                href="tel:3045550192" 
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white text-[#1e3a8a] font-semibold px-6 py-3 hover:bg-slate-100 transition"
              >
                <Phone className="h-4 w-4" /> Call for service in your area
              </a>
            </div>

            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3 text-sm font-medium">
                {serviceAreas.map((area, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/90">
                    <MapPin className="h-4 w-4 text-white/60 shrink-0" /> {area}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT / GET A QUOTE */}
      <section id="contact" className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <div className="uppercase tracking-[2px] text-xs font-semibold text-[#1e3a8a] mb-3">Get In Touch Today</div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-[-1px] text-[#0f172a]">Request Service or a Free Quote</h2>
          <p className="mt-4 text-lg text-slate-600">Call for the fastest response, or fill out the form and we’ll get back to you quickly.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition"
                      placeholder="Jamie Thompson"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition"
                      placeholder="(304) 555-1234"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition"
                      placeholder="you@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Service Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition"
                      placeholder="128 Elm Street, Ridgeview"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">What do you need help with?</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base bg-white focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition"
                  >
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

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tell us about the problem</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition resize-y"
                    placeholder="Kitchen sink is backing up after the rain last night..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#1e3a8a] py-4 text-base font-semibold text-white shadow-sm hover:bg-[#162d6b] active:bg-[#0f1f4a] transition-all"
                >
                  Submit Request — We’ll Call You Soon
                </button>

                <p className="text-center text-xs text-slate-500">
                  We typically respond within 15 minutes during business hours. For true emergencies, please call.
                </p>
              </form>
            ) : (
              <div className="py-10 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle className="h-9 w-9 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-semibold tracking-tight text-[#0f172a]">Thank you, {formData.name.split(' ')[0] || 'friend'}!</h3>
                <p className="mt-3 text-lg text-slate-600 max-w-sm mx-auto">
                  We received your request. A technician will call you at <span className="font-semibold text-[#0f172a]">{formData.phone}</span> shortly.
                </p>
                <button
                  onClick={resetForm}
                  className="mt-8 text-sm font-medium text-[#1e3a8a] underline hover:no-underline"
                >
                  Submit another request
                </button>
              </div>
            )}
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-9">
              <div className="font-semibold text-xl text-[#0f172a] mb-5">Summit Plumbing LLC</div>
              
              <div className="space-y-5 text-[15px]">
                <a href="tel:3045550192" className="flex items-start gap-4 group">
                  <div className="mt-1 text-[#1e3a8a]"><Phone className="h-5 w-5" /></div>
                  <div>
                    <div className="font-semibold text-[#1e3a8a] group-hover:underline">(304) 555-0192</div>
                    <div className="text-slate-500 text-sm">Available 24/7 for emergencies</div>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="mt-1 text-[#1e3a8a]"><MapPin className="h-5 w-5" /></div>
                  <div>
                    <div className="font-medium">128 Elm Street</div>
                    <div>Ridgeview, WV 26501</div>
                    <div className="text-sm text-slate-500 mt-0.5">Serving Ridgeview and surrounding towns</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-1">
                  <div className="mt-1 text-[#1e3a8a]"><Clock className="h-5 w-5" /></div>
                  <div className="text-sm leading-relaxed">
                    <div className="font-medium text-[#0f172a]">Office Hours</div>
                    Mon–Fri: 7:00am – 6:00pm<br />
                    Sat: 8:00am – 4:00pm<br />
                    <span className="font-semibold text-[#1e3a8a]">24/7 Emergency Service</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 p-8 text-sm border border-slate-100">
              <div className="font-semibold text-[#0f172a] mb-3">What happens next?</div>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-600">
                <li>We’ll call you within 15 minutes (or immediately for emergencies).</li>
                <li>A technician will give you an honest upfront price before any work begins.</li>
                <li>We complete the job cleanly and explain exactly what was done.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0f172a] text-white/90 pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-y-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white">
                  <Wrench className="h-5 w-5" />
                </div>
                <div className="font-semibold text-2xl tracking-[-0.5px] text-white">Summit Plumbing LLC</div>
              </div>
              <div className="text-sm text-white/70 max-w-[260px]">
                Fast, honest plumbing service for Ridgeview and the surrounding towns in West Virginia.
              </div>
              <div className="mt-4 text-xs text-white/50">U.S. Veteran Owned &amp; Operated</div>
            </div>

            <div className="grid grid-cols-2 gap-x-16 gap-y-8 text-sm">
              <div>
                <div className="font-semibold text-white mb-3 tracking-wider text-xs">COMPANY</div>
                <div className="space-y-2 text-white/80">
                  <a href="#about" className="block hover:text-white">About Us</a>
                  <a href="#services" className="block hover:text-white">Our Services</a>
                  <a href="#reviews" className="block hover:text-white">Customer Reviews</a>
                </div>
              </div>
              <div>
                <div className="font-semibold text-white mb-3 tracking-wider text-xs">CONTACT</div>
                <div className="space-y-2 text-white/80">
                  <a href="tel:3045550192" className="block hover:text-white">(304) 555-0192</a>
                  <a href="mailto:service@summitplumbingwv.com" className="block hover:text-white">service@summitplumbingwv.com</a>
                  <div>128 Elm Street, Ridgeview, WV 26501</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-white/15 flex flex-col md:flex-row justify-between gap-4 text-xs text-white/50">
            <div>© {new Date().getFullYear()} Summit Plumbing LLC. All rights reserved. WV License #P-38471</div>
            <div>This is a demonstration site showing the quality of a Starter package website.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
