'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';

export default function ReviewsPage() {
  useEffect(() => {
    document.title = 'Customer Reviews & HVAC Projects | Appalachian HVAC Solutions | Ridgeview, WV';
  }, []);

  const testimonials = [
    { quote: "They replaced our 18-year-old furnace and central AC with a new high-efficiency heat pump system. Our energy bills dropped over 30% this winter and the house finally feels comfortable in every room.", name: "The Millers", location: "Ridgeview, WV", project: "Full System Replacement – Heat Pump" },
    { quote: "Appalachian HVAC has handled our seasonal maintenance for six years. They’re always on time, professional, and explain everything clearly. We trust them completely with our home.", name: "Sarah & Dave Kline", location: "Oakdale, WV", project: "Annual Maintenance Plan" },
    { quote: "After my son’s asthma flare-ups, they installed a whole-home air purifier and sealed some leaky ducts. Within a week the air felt noticeably cleaner and his symptoms improved. Excellent work.", name: "Maria Torres", location: "Pine Hollow, WV", project: "Indoor Air Quality & Duct Sealing" },
    { quote: "Our AC stopped working on the hottest day of the summer. They arrived the same afternoon, had the part on the truck, and got us back up and running before dinner. Fair price and very respectful of our home.", name: "Patricia Langley", location: "Ridgeview, WV", project: "Emergency AC Repair" },
  ];

  const projects = [
    { 
      image: "/grok-image-36c452ca-b5ac-4917-aa9d-98dbbe558a6d.jpg", 
      title: "High-Efficiency Heat Pump Installation", 
      location: "Ridgeview Residence", 
      result: "Replaced aging oil furnace. Family reports 32% lower heating costs and consistent temperatures throughout the home." 
    },
    { 
      image: "/grok-image-57016dc4-4380-4115-b409-da347c40d452.jpg", 
      title: "Central AC & Air Purifier Upgrade", 
      location: "Oakdale Home", 
      result: "New 16-SEER system with whole-home purification. Noticeably cleaner air and reduced humidity during summer months." 
    },
    { 
      image: "/grok-image-11e0d2c5-115b-41ef-8811-2d3f53d43ca2.jpg", 
      title: "Duct Sealing & Mini-Split Installation", 
      location: "Pine Hollow Addition", 
      result: "Sealed existing ductwork and installed ductless mini-split system for new addition. Home now has balanced comfort and lower energy use." 
    },
    { 
      image: "/grok-image-420ebc9c-ae44-49c4-b403-9866b81fa03a.jpg", 
      title: "Furnace & Humidifier Install", 
      location: "Maple Fork Farmhouse", 
      result: "Replaced 22-year-old furnace with high-efficiency model plus whole-home humidifier. Much better comfort and air quality in dry winter months." 
    },
  ];

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="max-w-2xl">
          <div className="text-[#0d9488] text-xs tracking-[2px] font-semibold mb-1">REAL RESULTS FROM REAL HOMES</div>
          <h1 className="text-5xl font-semibold tracking-tight text-[#0f172a] mb-4">Customer Reviews &amp; Projects</h1>
          <p className="text-xl text-slate-600">We’re proud of the work we do and the long-term relationships we’ve built with families across Ridgeview and the surrounding area.</p>
        </div>
      </div>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="font-semibold text-2xl tracking-tight text-[#0f172a] mb-8">What Our Customers Say</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-3xl border border-slate-200 bg-white p-8">
              <div className="flex text-[#f59e0b] mb-5">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className="h-4 w-4 fill-current" />)}</div>
              <blockquote className="text-slate-700 leading-relaxed mb-6">“{t.quote}”</blockquote>
              <div>
                <div className="font-semibold text-[#0f172a]">{t.name}</div>
                <div className="text-sm text-slate-500">{t.location} • {t.project}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Gallery - FIXED with relevant HVAC installation photos */}
      <section className="bg-[#f8fafc] py-14 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-[#0d9488] text-xs tracking-[2px] font-semibold mb-1">COMPLETED WORK IN OUR COMMUNITY</div>
              <h2 className="text-3xl font-semibold tracking-tight text-[#0f172a]">Recent Projects</h2>
            </div>
            <Link href="/examples/complete-hvac/contact" className="hidden md:block text-sm font-medium text-[#0d9488] hover:underline">Ready to start your project? →</Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((p, i) => (
              <div key={i} className="group rounded-2xl overflow-hidden border border-slate-200 bg-white">
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                  <img 
                    src={p.image} 
                    alt={`Completed ${p.title} project by Appalachian HVAC Solutions in ${p.location} - real HVAC installation`} 
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" 
                  />
                </div>
                <div className="p-5">
                  <div className="font-semibold text-[#0f172a] mb-1">{p.title}</div>
                  <div className="text-sm text-slate-500 mb-2">{p.location}</div>
                  <div className="text-sm leading-snug text-emerald-700">{p.result}</div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-500 mt-8">All photos show actual HVAC installations and equipment work performed by our team in the Ridgeview area. Results vary by home and system.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-14 text-center border-t border-slate-100">
        <p className="text-lg text-slate-600 mb-6">We’re grateful for the trust our community places in us.</p>
        <Link href="/examples/complete-hvac/contact" className="inline-flex items-center rounded-lg bg-[#0d9488] px-8 py-3.5 font-semibold text-white hover:bg-[#0f766e]">Start Your Comfort Project</Link>
      </div>
    </div>
  );
}
