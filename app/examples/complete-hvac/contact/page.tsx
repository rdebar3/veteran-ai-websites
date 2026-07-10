'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Phone, MapPin, Clock, Mail, CheckCircle } from 'lucide-react';
import {
  HVAC_PHONE, HVAC_PHONE_HREF, HVAC_EMAIL,
  HVAC_ADDRESS1, HVAC_ADDRESS2, HVAC_HOURS, HVAC_EMERGENCY,
  HVAC_NAME, serviceAreas,
} from '@/lib/complete-hvac-data';

const serviceOptions = [
  'Heating', 'Cooling / Air Conditioning', 'Maintenance Plan or Tune-Up',
  'Indoor Air Quality', 'Emergency Service', 'Other / Not sure',
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', service: '', message: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Please add your name and phone number so we can reach you.');
      return;
    }
    setError('');
    setDone(true);
  };

  return (
    <>
      <section className="hv__phero">
        <div className="hv__phero-bg" aria-hidden="true">
          <Image src="/demos/complete-hvac/entrance-fall-mountains.jpg?v=2" alt="" fill sizes="100vw" quality={85} priority />
        </div>
        <div className="hv__phero-veil" aria-hidden="true" />
        <div className="hv__wrap hv__phero-in">
          <span className="hv__eyebrow">We’re here when you need us</span>
          <h1>Let’s get your home comfortable.</h1>
          <p>Call for the fastest response, or send us a note below and a local technician will get right back to you.</p>
        </div>
      </section>

      <section className="hv__sec">
        <div className="hv__wrap">
          <div className="hv__contact">
            <div className="hv__form">
              {done ? (
                <div className="hv__thanks">
                  <span className="hv__thanks-ic"><CheckCircle size={30} /></span>
                  <h3>Thank you, {form.name.split(' ')[0] || 'friend'}!</h3>
                  <p>We got your request and a technician will call you at {form.phone} very soon.</p>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <div className="hv__frow">
                    <div className="hv__field hv__field--row">
                      <label className="hv__label">Full name *</label>
                      <input className="hv__input" value={form.name} onChange={set('name')} placeholder="Taylor Brooks" required />
                    </div>
                    <div className="hv__field hv__field--row">
                      <label className="hv__label">Phone *</label>
                      <input className="hv__input" type="tel" value={form.phone} onChange={set('phone')} placeholder={HVAC_PHONE} required />
                    </div>
                  </div>
                  <div className="hv__frow">
                    <div className="hv__field hv__field--row">
                      <label className="hv__label">Email</label>
                      <input className="hv__input" type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" />
                    </div>
                    <div className="hv__field hv__field--row">
                      <label className="hv__label">Service address</label>
                      <input className="hv__input" value={form.address} onChange={set('address')} placeholder="124 Mountain View Rd, Ridgeview" />
                    </div>
                  </div>
                  <div className="hv__field">
                    <label className="hv__label">What do you need?</label>
                    <select className="hv__select" value={form.service} onChange={set('service')}>
                      <option value="">Select a service</option>
                      {serviceOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="hv__field">
                    <label className="hv__label">Tell us more</label>
                    <textarea className="hv__textarea" value={form.message} onChange={set('message')} placeholder="Our heat pump isn’t keeping the house warm on cold nights…" />
                  </div>
                  <button type="submit" className="hv__btn hv__btn--primary">Send my request</button>
                  {error && <p className="hv__form-note" style={{ color: '#b4462a' }}>{error}</p>}
                  <p className="hv__form-note">We typically respond within 30 minutes during business hours.</p>
                </form>
              )}
            </div>

            <div>
              <div className="hv__info">
                <h3>{HVAC_NAME}</h3>
                <a href={HVAC_PHONE_HREF} className="hv__info-row">
                  <Phone size={19} />
                  <span><b>{HVAC_PHONE}</b>{HVAC_EMERGENCY}</span>
                </a>
                <a href={`mailto:${HVAC_EMAIL}`} className="hv__info-row">
                  <Mail size={19} />
                  <span><b>Email us</b>{HVAC_EMAIL}</span>
                </a>
                <div className="hv__info-row">
                  <MapPin size={19} />
                  <span><b>Visit / mail</b>{HVAC_ADDRESS1}<br />{HVAC_ADDRESS2}</span>
                </div>
                <div className="hv__info-row">
                  <Clock size={19} />
                  <span><b>Hours</b>{HVAC_HOURS}<br />{HVAC_EMERGENCY}</span>
                </div>
              </div>
              <div className="hv__info" style={{ background: 'var(--cream)', color: 'var(--ink)', border: '1px solid var(--line)' }}>
                <h3 style={{ color: 'var(--espresso)' }}>Service area</h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--muted)', margin: 0 }}>
                  {serviceAreas.join(', ')}, and surrounding communities.
                </p>
                <p style={{ fontSize: 13.5, color: 'var(--muted)', opacity: 0.8, margin: '12px 0 0' }}>
                  Not sure if we cover your address? Just call — we’re happy to help.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
