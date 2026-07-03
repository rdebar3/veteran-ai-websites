'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import BistroShell from '@/components/ridge-bistro/BistroShell';
import {
  BISTRO_PHONE,
  BISTRO_PHONE_HREF,
  BISTRO_EMAIL,
  BISTRO_ADDRESS,
  hours,
} from '@/lib/ridge-bistro-data';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  useEffect(() => {
    document.title = 'Contact | The Ridge Bistro | Ridgeview, WV';
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      alert('Please complete your name, email, and message.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <BistroShell>
      <section className="rb-hero rb-hero--page">
        <div className="rb-hero__bg">
          <Image
            src="/demos/ridge-bistro/interior.jpg"
            alt=""
            fill
            sizes="100vw"
            quality={88}
            className="rb-hero__img"
          />
          <div className="rb-hero__veil" />
        </div>
        <div className="rb-hero__content">
          <p className="rb-hero__eyebrow">Contact</p>
          <h1 className="rb-hero__title">We&apos;d love to hear from you</h1>
          <p className="rb-hero__lead">
            For reservations, private dining inquiries, or general questions.
          </p>
        </div>
      </section>

      <section className="rb-section">
        <div className="rb-section__inner">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 rb-reveal">
              <div className="rb-form">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="rb-label">Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="rb-input"
                        />
                      </div>
                      <div>
                        <label className="rb-label">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="rb-input"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="rb-label">Subject</label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="rb-select"
                      >
                        <option value="">Select a topic</option>
                        <option value="Reservation">Reservation</option>
                        <option value="Private Dining">Private Dining</option>
                        <option value="General">General Inquiry</option>
                        <option value="Event">Special Event</option>
                      </select>
                    </div>
                    <div>
                      <label className="rb-label">Message *</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="rb-textarea"
                      />
                    </div>
                    <button type="submit" className="rb-btn rb-btn--gold w-full">
                      Send Message
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-10">
                    <p className="rb-section__eyebrow">Received</p>
                    <h2 className="rb-section__title" style={{ fontSize: '1.75rem' }}>
                      Thank you, {form.name.split(' ')[0]}
                    </h2>
                    <p className="text-[var(--rb-muted)] mt-4">
                      We will respond to your message at {form.email} within one business day.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5 rb-reveal">
              <div className="rb-form">
                <p className="rb-section__eyebrow">Visit</p>
                <p className="text-[var(--rb-cream)] mb-2">{BISTRO_ADDRESS}</p>
                <a href={BISTRO_PHONE_HREF} className="rb-footer__link">{BISTRO_PHONE}</a>
                <a href={`mailto:${BISTRO_EMAIL}`} className="rb-footer__link">{BISTRO_EMAIL}</a>
              </div>
              <div className="rb-form">
                <p className="rb-section__eyebrow">Hours</p>
                {hours.map((h) => (
                  <p key={h.days} className="rb-footer__text">
                    <span className="text-[var(--rb-cream)]">{h.days}</span> · {h.time}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </BistroShell>
  );
}