'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ThermometerSun, Snowflake, Wind, Shield, Award, Star, Check, Phone } from 'lucide-react';

export default function HvacHome() {
  useEffect(() => {
    document.title = 'Appalachian HVAC Solutions | Ridgeview, WV | Reliable Comfort for Every Season';
  }, []);

  return (
    <div className="bg-white">
      {/* HERO: Technician on outdoor HVAC unit */}
      <section className="relative h-[620px] md:h-[680px] flex items-center bg-slate-950 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/grok-image-11e0d2c5-115b-41ef-8811-2d3f53d43ca2.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 via-[#0f172a]/70 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-6 text-white">
          <div className="max-w-2xl">
            <div className="inline-block rounded-full bg-white/10 px-4 py-1 text-xs tracking-[1.5px] font-medium mb-4">RIDGEVIEW, WEST VIRGINIA</div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tighter leading-[1.05] mb-6">
              Reliable Comfort<br />for Every Season
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-lg">
              Expert heating, cooling, and indoor air quality solutions for homes and businesses in Ridgeview and the surrounding area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/examples/complete-hvac/contact" 
                className="inline-flex items-center justify-center rounded-lg bg-[#0d9488] px-8 py-4 text-base font-semibold text-white hover:bg-[#0f766e] transition"
              >
                Get a Free Quote
              </Link>
              <a 
                href="tel:3045550248" 
                className="inline-flex items-center justify-center rounded-lg border border-white/70 px-8 py-4 text-base font-semibold hover:bg-white/10 transition"
              >
                Call (304) 555-0248
              </a>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-white/70">
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-[#14b8a6]" /> Same-day service available</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-[#14b8a6]" /> Veteran owned</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="border-b border-slate-100 py-5 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-center md:text-left text-slate-600">
          <div className="flex items-center justify-center md:justify-start gap-3"><Shield className="h-5 w-5 text-[#0d9488]" /> <span>Licensed &amp; Insured • WV #HV-48291</span></div>
          <div className="flex items-center justify-center md:justify-start gap-3"><Award className="h-5 w-5 text-[#0d9488]" /> <span>Veteran Owned &amp; Operated</span></div>
          <div className="flex items-center justify-center md:justify-start gap-3"><ThermometerSun className="h-5 w-5 text-[#0d9488]" /> <span>High-Efficiency Systems</span></div>
          <div className="flex items-center justify-center md:justify-start gap-3"><Phone className="h-5 w-5 text-[#0d9488]" /> <span>24/7 Emergency Response</span></div>
        </div>
      </div>

      {/* Services Overview */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <div className="text-[#0d9488] text-xs tracking-[2px] font-semibold mb-2">WHAT WE DELIVER</div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#0f172a]">Comfort Solutions for Ridgeview Homes</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: ThermometerSun, title: "Heating Systems", desc: "High-efficiency furnaces, heat pumps, and boilers tailored for West Virginia winters." },
            { icon: Snowflake, title: "Cooling & AC", desc: "Central air, ductless mini-splits, and smart thermostats that keep you cool and save energy." },
            { icon: Wind, title: "Indoor Air Quality", desc: "Whole-home purification, humidification, and ventilation for healthier air year-round." },
            { icon: Shield, title: "Maintenance Plans", desc: "Seasonal tune-ups that extend equipment life and prevent costly breakdowns." },
            { icon: Wind, title: "Ductwork & Ventilation", desc: "Inspection, sealing, cleaning, and new duct installation for maximum efficiency." },
            { icon: Shield, title: "24/7 Emergency Service", desc: "Fast response for no-heat, no-cool, and system failures when you need us most." },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-8 hover:shadow-md transition group">
                <div className="text-[#0d9488] mb-4"><Icon className="h-7 w-7" /></div>
                <h3 className="font-semibold text-2xl tracking-tight text-[#0f172a] mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                <Link href="/examples/complete-hvac/services" className="mt-4 inline-block text-sm font-medium text-[#0d9488] group-hover:underline">Learn more →</Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us / Comfort Promise */}
      <section className="bg-[#f8fafc] py-16 md:py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-5">
              <div className="text-[#0d9488] text-xs tracking-[2px] font-semibold mb-2">THE APPALACHIAN DIFFERENCE</div>
              <h2 className="text-4xl font-semibold tracking-tight text-[#0f172a] mb-6">Comfort you can count on, from people you trust.</h2>
              <p className="text-lg text-slate-600">We design, install, and maintain systems that deliver consistent temperatures, lower energy bills, and cleaner air — all while treating your home with respect.</p>
            </div>
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
              {[
                "Properly sized equipment for maximum efficiency and comfort",
                "Honest, upfront pricing with no hidden fees or surprises",
                "Local technicians who know Ridgeview homes and our climate",
                "Strong manufacturer warranties backed by our service guarantee",
              ].map((text, i) => (
                <div key={i} className="flex gap-3 rounded-2xl bg-white p-5 border border-slate-100">
                  <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-[#0d9488]" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Teaser with happy family image */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-[#0d9488] text-xs tracking-[2px] font-semibold mb-1">REAL FAMILIES. REAL RESULTS.</div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0f172a]">What Our Neighbors Are Saying</h2>
          </div>
          <Link href="/examples/complete-hvac/reviews" className="hidden md:block text-sm font-medium text-[#0d9488] hover:underline">View all reviews &amp; projects →</Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { quote: "They replaced our old furnace and AC with a new high-efficiency heat pump. Our winter bills are down over 30% and the house is finally comfortable in every room.", name: "The Millers", loc: "Ridgeview" },
            { quote: "Appalachian HVAC has done our maintenance for years. Professional, on time, and they explain everything clearly. We trust them completely with our home.", name: "Sarah &amp; Dave K.", loc: "Oakdale" },
            { quote: "Installed a whole-home air purifier after my son’s asthma flare-ups. Within days the air felt cleaner and his symptoms improved. Excellent work and fair pricing.", name: "Maria T.", loc: "Pine Hollow" },
          ].map((t, i) => (
            <div key={i} className="rounded-2xl bg-white border border-slate-200 p-7">
              <div className="flex text-[#f59e0b] mb-4">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className="h-4 w-4 fill-current" />)}</div>
              <p className="text-slate-600 leading-relaxed mb-5">“{t.quote}”</p>
              <div className="font-semibold text-sm text-[#0f172a]">{t.name} <span className="font-normal text-slate-500">— {t.loc}</span></div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link href="/examples/complete-hvac/reviews" className="text-sm font-medium text-[#0d9488] hover:underline">View all reviews &amp; projects →</Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#0f172a] text-white py-14">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-semibold tracking-tight mb-3">Ready for reliable comfort this season?</h3>
          <p className="text-white/80 mb-6 text-lg">Get a no-obligation quote from our local Ridgeview team. Most quotes provided same day.</p>
          <Link href="/examples/complete-hvac/contact" className="inline-flex items-center rounded-lg bg-[#0d9488] px-8 py-3.5 text-base font-semibold hover:bg-[#0f766e] transition">Schedule Service or Get a Quote</Link>
          <div className="mt-4 text-sm text-white/60">Or call us anytime at (304) 555-0248</div>
        </div>
      </section>
    </div>
  );
}
