'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import BistroShell from '@/components/ridge-bistro/BistroShell';
import { BISTRO_PHONE, BISTRO_PHONE_HREF } from '@/lib/ridge-bistro-data';

export default function ReservationsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    notes: '',
  });

  useEffect(() => {
    document.title = 'Reservations | The Ridge Bistro | Ridgeview, WV';
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.date || !form.time) {
      alert('Please complete your name, phone, date, and time.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <BistroShell>
      <section className="rb-hero rb-hero--page">
        <div className="rb-hero__bg">
          <Image
            src="/demos/ridge-bistro/hero.jpg"
            alt=""
            fill
            sizes="100vw"
            quality={88}
            className="rb-hero__img"
          />
          <div className="rb-hero__veil" />
        </div>
        <div className="rb-hero__content">
          <p className="rb-hero__eyebrow">Reservations</p>
          <h1 className="rb-hero__title">Reserve your evening</h1>
          <p className="rb-hero__lead">
            Tables are released thirty days in advance. For parties larger than six,
            please call us directly.
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
                        <label className="rb-label">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="rb-input"
                          placeholder="Jordan Ellis"
                        />
                      </div>
                      <div>
                        <label className="rb-label">Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          required
                          className="rb-input"
                          placeholder="(304) 555-0381"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="rb-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="rb-input"
                        placeholder="you@email.com"
                      />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-5">
                      <div>
                        <label className="rb-label">Date *</label>
                        <input
                          type="date"
                          name="date"
                          value={form.date}
                          onChange={handleChange}
                          required
                          className="rb-input"
                        />
                      </div>
                      <div>
                        <label className="rb-label">Time *</label>
                        <select
                          name="time"
                          value={form.time}
                          onChange={handleChange}
                          required
                          className="rb-select"
                        >
                          <option value="">Select</option>
                          <option value="5:00 PM">5:00 PM</option>
                          <option value="5:30 PM">5:30 PM</option>
                          <option value="6:00 PM">6:00 PM</option>
                          <option value="6:30 PM">6:30 PM</option>
                          <option value="7:00 PM">7:00 PM</option>
                          <option value="7:30 PM">7:30 PM</option>
                          <option value="8:00 PM">8:00 PM</option>
                          <option value="8:30 PM">8:30 PM</option>
                          <option value="9:00 PM">9:00 PM</option>
                        </select>
                      </div>
                      <div>
                        <label className="rb-label">Guests</label>
                        <select
                          name="guests"
                          value={form.guests}
                          onChange={handleChange}
                          className="rb-select"
                        >
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <option key={n} value={String(n)}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="rb-label">Special Requests</label>
                      <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        rows={3}
                        className="rb-textarea"
                        placeholder="Celebration, dietary needs, seating preference..."
                      />
                    </div>

                    <button type="submit" className="rb-btn rb-btn--gold w-full">
                      Request Reservation
                    </button>
                    <p className="text-center text-xs text-[var(--rb-muted)]">
                      We will confirm your reservation by phone or email within a few hours.
                    </p>
                  </form>
                ) : (
                  <div className="text-center py-10">
                    <p className="rb-section__eyebrow">Confirmed</p>
                    <h2 className="rb-section__title" style={{ fontSize: '1.75rem' }}>
                      Thank you, {form.name.split(' ')[0]}
                    </h2>
                    <p className="text-[var(--rb-muted)] mt-4 leading-relaxed">
                      Your request for {form.guests} guests on {form.date} at {form.time} has been received.
                      We will contact you at {form.phone} shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-6 text-sm text-[var(--rb-gold)] hover:underline"
                    >
                      Submit another request
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 rb-reveal">
              <div className="rb-form" style={{ marginBottom: '1.25rem' }}>
                <p className="rb-section__eyebrow">Prefer to call?</p>
                <p className="text-[var(--rb-muted)] text-sm leading-relaxed mb-4">
                  Our host stand is available Tuesday through Sunday from 4:00pm.
                </p>
                <a href={BISTRO_PHONE_HREF} className="rb-btn rb-btn--outline">
                  {BISTRO_PHONE}
                </a>
              </div>
              <Image
                src="/demos/ridge-bistro/interior.jpg"
                alt="The Ridge Bistro dining room"
                width={600}
                height={400}
                className="rb-split__img"
              />
            </div>
          </div>
        </div>
      </section>
    </BistroShell>
  );
}