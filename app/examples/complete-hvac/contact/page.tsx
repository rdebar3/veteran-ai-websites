'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Phone, MapPin, Clock, Mail, CheckCircle } from 'lucide-react';
import HvacShell from '@/components/complete-hvac/HvacShell';
import {
  HVAC_PHONE,
  HVAC_PHONE_HREF,
  HVAC_EMAIL,
  serviceAreas,
} from '@/lib/complete-hvac-data';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    service: '',
    message: '',
  });

  useEffect(() => {
    document.title = 'Contact Appalachian HVAC Solutions | Ridgeview, WV';
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
      alert('Please provide your name and phone number so we can reach you.');
      return;
    }
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({ name: '', phone: '', email: '', address: '', service: '', message: '' });
  };

  return (
    <HvacShell>
      <section className="hv-hero hv-hero--page">
        <div className="hv-hero__bg">
          <Image
            src="/demos/complete-hvac/entrance-fall-mountains.jpg"
            alt=""
            fill
            sizes="100vw"
            quality={85}
            className="hv-hero__bg-img hv-hero__bg-img--mountains"
          />
          <div className="hv-hero__veil" />
        </div>

        <div className="hv-hero__content">
          <p className="hv-section__eyebrow">We&apos;re Here When You Need Us</p>
          <h1 className="hv-hero__title" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)' }}>
            Contact
            <span className="hv-hero__title-accent">Appalachian HVAC</span>
          </h1>
          <p className="hv-hero__lead">
            Call for fastest response or submit the form below. A technician will contact you shortly.
          </p>
        </div>
      </section>

      <section className="hv-section hv-section--warm">
        <div className="hv-section__inner hv-reveal">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <div className="hv-form-panel">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="hv-form-label">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="hv-form-input"
                          placeholder="Taylor Brooks"
                        />
                      </div>
                      <div>
                        <label className="hv-form-label">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="hv-form-input"
                          placeholder="(304) 555-0248"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="hv-form-label">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="hv-form-input"
                          placeholder="you@email.com"
                        />
                      </div>
                      <div>
                        <label className="hv-form-label">Service Address</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="hv-form-input"
                          placeholder="124 Mountain View Rd, Ridgeview"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="hv-form-label">Service Needed</label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="hv-form-select"
                      >
                        <option value="">Select a service</option>
                        <option value="Heating">Heating System</option>
                        <option value="Cooling">Cooling / Air Conditioning</option>
                        <option value="Maintenance">Maintenance Plan or Tune-Up</option>
                        <option value="Air Quality">Indoor Air Quality</option>
                        <option value="Emergency">Emergency Service</option>
                        <option value="Other">Other / Not Sure</option>
                      </select>
                    </div>

                    <div>
                      <label className="hv-form-label">Tell us more about what you need</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="hv-form-textarea"
                        placeholder="Our heat pump isn't keeping the house warm on cold nights..."
                      />
                    </div>

                    <button type="submit" className="hv-btn hv-btn--primary w-full">
                      Submit Request
                    </button>
                    <p className="text-center text-xs text-[var(--hv-muted)]">
                      We typically respond within 30 minutes during business hours.
                    </p>
                  </form>
                ) : (
                  <div className="text-center py-10">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(217,119,6,0.12)]">
                      <CheckCircle className="h-9 w-9 text-[var(--hv-orange)]" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-[var(--hv-brown-deep)]">
                      Thank you, {formData.name.split(' ')[0] || 'friend'}!
                    </h3>
                    <p className="mt-3 text-[var(--hv-muted)] max-w-sm mx-auto">
                      We received your request. A technician will call you at{' '}
                      <span className="font-semibold text-[var(--hv-text)]">{formData.phone}</span>{' '}
                      very soon.
                    </p>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="mt-6 text-sm font-medium text-[var(--hv-orange)] hover:underline"
                    >
                      Submit another request
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5">
              <div className="hv-info-panel">
                <div className="font-bold text-lg mb-5 text-[var(--hv-brown-deep)]">
                  Appalachian HVAC Solutions
                </div>

                <div className="space-y-5 text-sm">
                  <a href={HVAC_PHONE_HREF} className="flex items-start gap-3 group">
                    <Phone className="h-5 w-5 mt-0.5 text-[var(--hv-orange)] shrink-0" />
                    <div>
                      <div className="font-semibold text-[var(--hv-brown-deep)] group-hover:underline">
                        {HVAC_PHONE}
                      </div>
                      <div className="text-[var(--hv-muted)]">24/7 Emergency Line</div>
                    </div>
                  </a>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-0.5 text-[var(--hv-orange)] shrink-0" />
                    <div className="text-[var(--hv-muted)]">
                      <div>124 Mountain View Road</div>
                      <div>Ridgeview, WV 26501</div>
                    </div>
                  </div>

                  <a href={`mailto:${HVAC_EMAIL}`} className="flex items-start gap-3 group">
                    <Mail className="h-5 w-5 mt-0.5 text-[var(--hv-orange)] shrink-0" />
                    <span className="group-hover:underline">{HVAC_EMAIL}</span>
                  </a>

                  <div className="flex items-start gap-3 pt-3 border-t border-[var(--hv-border)]">
                    <Clock className="h-5 w-5 mt-0.5 text-[var(--hv-orange)] shrink-0" />
                    <div className="text-[var(--hv-muted)] leading-relaxed">
                      <div className="font-medium text-[var(--hv-brown-deep)]">Office Hours</div>
                      Monday – Friday: 7:30am – 5:30pm
                      <br />
                      <span className="text-[var(--hv-orange)] font-medium">24/7 Emergency Response</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hv-info-panel">
                <div className="font-semibold mb-3 text-[var(--hv-brown-deep)]">Service Area</div>
                <p className="text-sm text-[var(--hv-muted)] leading-relaxed">
                  {serviceAreas.join(', ')}.
                </p>
                <p className="mt-3 text-xs text-[var(--hv-muted)] opacity-70">
                  If you&apos;re unsure whether we cover your address, just call — we&apos;re happy to help.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </HvacShell>
  );
}