'use client';

import React, { useState, useEffect } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  useEffect(() => {
    document.title = 'Contact | Mountain View Grill & Tavern | Ridgeview, WV';
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      alert('Please fill out your name and a message.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="bg-[#fdf6e3]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-serif text-5xl tracking-tight text-[#3e2723] mb-6 text-center">Get in Touch</h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-2xl border border-[#8b7355]/10">
                <div>
                  <label className="block text-sm font-medium mb-1 text-[#5c4033]">Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="w-full border border-[#8b7355]/30 rounded-lg px-4 py-2.5 bg-[#fdf6e3]" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-[#5c4033]">Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border border-[#8b7355]/30 rounded-lg px-4 py-2.5 bg-[#fdf6e3]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-[#5c4033]">Phone</label>
                    <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="w-full border border-[#8b7355]/30 rounded-lg px-4 py-2.5 bg-[#fdf6e3]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-[#5c4033]">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={5} required className="w-full border border-[#8b7355]/30 rounded-lg px-4 py-2.5 bg-[#fdf6e3] resize-y" placeholder="Private event inquiry, feedback, catering questions..." />
                </div>
                <button type="submit" className="w-full bg-[#8b4513] text-[#fdf6e3] py-3 rounded-lg font-semibold">Send Message</button>
              </form>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-[#8b7355]/10 text-center">
                <h3 className="text-2xl font-semibold text-[#3e2723] mb-3">Thank you!</h3>
                <p className="text-[#5c4033]">We’ve received your message and will get back to you within 24 hours.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }); }} className="mt-6 text-sm text-[#8b4513] hover:underline">Send another message</button>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-8 text-[#3e2723]">
            <div>
              <div className="font-semibold text-lg mb-1">Mountain View Grill &amp; Tavern</div>
              <div>123 Mountain View Lane<br />Ridgeview, WV 26501</div>
            </div>

            <div>
              <a href="tel:3045550381" className="block font-semibold text-xl text-[#8b4513] hover:underline">(304) 555-0381</a>
              <a href="mailto:info@mountainviewgrillwv.com" className="text-[#8b4513] hover:underline">info@mountainviewgrillwv.com</a>
            </div>

            <div>
              <div className="font-semibold mb-1">Hours</div>
              <div className="text-sm text-[#5c4033]">Tue–Thu 11am–9pm<br />Fri–Sat 11am–10pm<br />Sun 11am–8pm<br />Closed Mondays</div>
            </div>

            <div className="text-sm text-[#5c4033]">
              For large parties, private events, or catering, please call us directly. We love hosting celebrations with a view!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
