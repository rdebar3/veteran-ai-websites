'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ReservationsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', date: '', time: '', guests: '2', notes: ''
  });

  useEffect(() => {
    document.title = 'Reservations & Hours | Mountain View Grill & Tavern';
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.date || !form.time) {
      alert('Please fill out name, date, and time.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="bg-[#fdf6e3]">
      <div className="max-w-5xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12">
        {/* Reservation Form */}
        <div>
          <h1 className="font-serif text-4xl tracking-tight text-[#3e2723] mb-2">Make a Reservation</h1>
          <p className="text-[#5c4033] mb-6">We recommend reserving ahead, especially for weekend evenings and large groups.</p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#5c4033] mb-1">Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="w-full bg-white border border-[#8b7355]/30 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8b4513]" placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5c4033] mb-1">Phone *</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} required className="w-full bg-white border border-[#8b7355]/30 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8b4513]" placeholder="(304) 555-0123" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5c4033] mb-1">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full bg-white border border-[#8b7355]/30 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8b4513]" placeholder="you@email.com" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#5c4033] mb-1">Date *</label>
                  <input name="date" type="date" value={form.date} onChange={handleChange} required className="w-full bg-white border border-[#8b7355]/30 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8b4513]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5c4033] mb-1">Time *</label>
                  <select name="time" value={form.time} onChange={handleChange} required className="w-full bg-white border border-[#8b7355]/30 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8b4513]">
                    <option value="">Select time</option>
                    <option>11:00 AM</option><option>12:00 PM</option><option>1:00 PM</option>
                    <option>5:00 PM</option><option>5:30 PM</option><option>6:00 PM</option>
                    <option>6:30 PM</option><option>7:00 PM</option><option>7:30 PM</option>
                    <option>8:00 PM</option><option>8:30 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5c4033] mb-1"># of Guests *</label>
                  <select name="guests" value={form.guests} onChange={handleChange} className="w-full bg-white border border-[#8b7355]/30 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8b4513]">
                    {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                    <option value="10+">10+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5c4033] mb-1">Special Requests / Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="w-full bg-white border border-[#8b7355]/30 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8b4513]" placeholder="High chair, dietary needs, celebration, etc." />
              </div>

              <button type="submit" className="w-full mt-2 bg-[#8b4513] hover:bg-[#5c4033] text-[#fdf6e3] font-semibold py-3 rounded-lg">Request Reservation</button>
              <p className="text-xs text-center text-[#8b7355]">We will confirm by phone or email within 24 hours.</p>
            </form>
          ) : (
            <div className="bg-white border border-[#8b7355]/20 rounded-2xl p-10 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-[#f5d9b8] flex items-center justify-center mb-4">
                ✓
              </div>
              <h3 className="text-2xl font-semibold text-[#3e2723] mb-2">Thank you, {form.name.split(' ')[0]}!</h3>
              <p className="text-[#5c4033]">Your reservation request for {form.date} at {form.time} for {form.guests} guests has been received.</p>
              <p className="mt-2 text-sm">We will contact you shortly to confirm. If you need to adjust, please call us.</p>
              <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', date: '', time: '', guests: '2', notes: '' }); }} className="mt-6 text-sm text-[#8b4513] hover:underline">Submit another request</button>
            </div>
          )}
        </div>

        {/* Hours & Info */}
        <div>
          <h2 className="font-serif text-3xl tracking-tight text-[#3e2723] mb-4">Hours &amp; Location</h2>
          
          <div className="bg-white rounded-2xl p-7 border border-[#8b7355]/10 mb-6">
            <div className="space-y-1 text-[#3e2723]">
              <div><span className="font-medium w-24 inline-block">Tuesday–Thursday</span> 11:00am – 9:00pm</div>
              <div><span className="font-medium w-24 inline-block">Friday–Saturday</span> 11:00am – 10:00pm</div>
              <div><span className="font-medium w-24 inline-block">Sunday</span> 11:00am – 8:00pm</div>
              <div className="pt-1 text-[#8b7355]">Closed Mondays</div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#8b7355]/10 text-sm">
              <div className="font-medium">123 Mountain View Lane</div>
              <div>Ridgeview, WV 26501</div>
              <a href="tel:3045550381" className="mt-1 block text-[#8b4513] hover:underline">(304) 555-0381</a>
            </div>
          </div>

          <div className="text-sm text-[#5c4033]">
            We accept reservations up to 8 guests online. For larger parties or private events, please call us directly.
          </div>
        </div>
      </div>
    </div>
  );
}
