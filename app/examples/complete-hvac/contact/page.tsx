'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, MapPin, Clock, Mail, CheckCircle } from 'lucide-react';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="max-w-2xl mb-10">
          <div className="text-[#0d9488] text-xs tracking-[2px] font-semibold mb-2">WE’RE HERE WHEN YOU NEED US</div>
          <h1 className="text-5xl font-semibold tracking-tight text-[#0f172a] mb-4">Contact Appalachian HVAC Solutions</h1>
          <p className="text-xl text-slate-600">Call for fastest response or submit the form below. A technician will contact you shortly.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-base focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488] outline-none transition" placeholder="Taylor Brooks" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-base focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488] outline-none transition" placeholder="(304) 555-0192" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-base focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488] outline-none transition" placeholder="you@email.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Service Address</label>
                      <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-base focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488] outline-none transition" placeholder="124 Mountain View Rd, Ridgeview" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Service Needed</label>
                    <select name="service" value={formData.service} onChange={handleInputChange} className="w-full rounded-2xl border border-slate-300 px-4 py-3 bg-white text-base focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488]">
                      <option value="">Select a service</option>
                      <option value="Heating">Heating System</option>
                      <option value="Cooling">Cooling / Air Conditioning</option>
                      <option value="Maintenance">Maintenance Plan or Tune-Up</option>
                      <option value="Air Quality">Indoor Air Quality</option>
                      <option value="Ductwork">Ductwork or Ventilation</option>
                      <option value="Emergency">Emergency Service</option>
                      <option value="Other">Other / Not Sure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Tell us more about what you need</label>
                    <textarea name="message" value={formData.message} onChange={handleInputChange} rows={4} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-base focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488] outline-none transition resize-y" placeholder="Our heat pump isn’t keeping the house warm on cold nights and we’re hearing a new noise..." />
                  </div>

                  <button type="submit" className="w-full rounded-2xl bg-[#0d9488] py-4 text-base font-semibold text-white hover:bg-[#0f766e] transition shadow-sm">
                    Submit Request
                  </button>
                  <p className="text-center text-xs text-slate-500">We typically respond within 30 minutes during business hours. For true emergencies, please call.</p>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle className="h-9 w-9 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight text-[#0f172a]">Thank you, {formData.name.split(' ')[0] || 'friend'}!</h3>
                  <p className="mt-3 text-slate-600 max-w-sm mx-auto">We received your request. A technician will call you at <span className="font-semibold text-[#0f172a]">{formData.phone}</span> very soon.</p>
                  <button onClick={resetForm} className="mt-6 text-sm font-medium text-[#0d9488] hover:underline">Submit another request</button>
                </div>
              )}
            </div>
          </div>

          {/* Contact Info & Service Area */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <div className="font-semibold text-xl text-[#0f172a] mb-6">Appalachian HVAC Solutions</div>

              <div className="space-y-6 text-sm">
                <a href="tel:3045550248" className="flex items-start gap-4 group">
                  <Phone className="h-5 w-5 mt-0.5 text-[#0d9488] shrink-0" />
                  <div>
                    <div className="font-semibold text-[#0f172a] group-hover:underline">(304) 555-0248</div>
                    <div className="text-slate-500">24/7 Emergency Line • We answer</div>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 mt-0.5 text-[#0d9488] shrink-0" />
                  <div>
                    <div>124 Mountain View Road</div>
                    <div>Ridgeview, WV 26501</div>
                    <div className="text-xs text-slate-500 mt-1">Serving Ridgeview and the surrounding area</div>
                  </div>
                </div>

                <a href="mailto:service@appalachianhvacsolutions.com" className="flex items-start gap-4 group">
                  <Mail className="h-5 w-5 mt-0.5 text-[#0d9488] shrink-0" />
                  <div className="group-hover:underline text-[#0f172a]">service@appalachianhvacsolutions.com</div>
                </a>

                <div className="flex items-start gap-4 pt-3 border-t border-slate-100">
                  <Clock className="h-5 w-5 mt-0.5 text-[#0d9488] shrink-0" />
                  <div className="text-sm leading-relaxed">
                    <div className="font-medium text-[#0f172a]">Office Hours</div>
                    Monday – Friday: 7:30am – 5:30pm<br />
                    <span className="text-[#0d9488] font-medium">24/7 Emergency Response</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-[#f8fafc] p-8 text-sm border border-slate-100">
              <div className="font-semibold text-[#0f172a] mb-3">Service Area</div>
              <div className="text-slate-600">Ridgeview, Oakdale, Pine Hollow, Clear Springs, Maple Fork, River Bend, and surrounding communities in the area.</div>
              <div className="mt-3 text-xs text-slate-500">If you’re unsure whether we cover your address, just call — we’re happy to help.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
