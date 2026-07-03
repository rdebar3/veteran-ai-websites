'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Award, Users, MapPin, Heart, Shield, Check } from 'lucide-react';

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About Appalachian HVAC Solutions | Ridgeview, WV';
  }, []);

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-[#f8fafc] border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-16">
          <div className="max-w-2xl">
            <div className="text-[#0d9488] text-xs tracking-[2px] font-semibold mb-2">OUR STORY</div>
            <h1 className="text-5xl font-semibold tracking-tighter text-[#0f172a] mb-5">Built right here in Ridgeview. Here for the long run.</h1>
            <p className="text-xl text-slate-600">We’re a local, veteran-owned company that believes every home deserves dependable heating, cooling, and clean air — delivered with honesty and care.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        {/* Story + Image - professional team */}
        <div className="grid lg:grid-cols-12 gap-x-12 gap-y-10 mb-16 items-center">
          <div className="lg:col-span-6">
            <h2 className="text-3xl font-semibold tracking-tight text-[#0f172a] mb-6">How Appalachian HVAC began</h2>
            <div className="space-y-5 text-[15px] leading-relaxed text-slate-600">
              <p>Appalachian HVAC Solutions was founded in 2011 by a U.S. Army veteran who grew up in the mountains around Ridgeview. After years working for larger companies, he saw the need for a local team that would treat every customer like a neighbor and every home with respect.</p>
              <p>We started small — one truck and a commitment to doing the job right the first time. Today we serve families and businesses across Ridgeview, Oakdale, Pine Hollow, and the surrounding communities with the same values we started with.</p>
            </div>
            <div className="mt-6 flex items-center gap-3 text-sm font-medium text-[#0d9488]">
              <Award className="h-5 w-5" /> U.S. Army Veteran Owned &amp; Operated
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden border border-slate-200">
              <img 
                src="/grok-image-420ebc9c-ae44-49c4-b403-9866b81fa03a.jpg" 
                alt="Professional HVAC technician inspecting and servicing an indoor furnace or air handler unit in a utility space" 
                className="w-full h-auto" 
              />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <div className="text-[#0d9488] text-xs tracking-[2px] font-semibold mb-2">WHAT GUIDES US</div>
            <h2 className="text-4xl font-semibold tracking-tight text-[#0f172a]">Our Values</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Do It Right the First Time", desc: "We diagnose thoroughly and only recommend what’s truly needed. No shortcuts, no upselling." },
              { icon: MapPin, title: "Proudly Local", desc: "We live and work in Ridgeview. When we install a system, we stand behind it because our reputation is on the line." },
              { icon: Heart, title: "Respect Your Home & Budget", desc: "We treat every house with care and explain costs clearly before any work begins." },
              { icon: Award, title: "Veteran-Owned Integrity", desc: "Discipline, clear communication, and pride in workmanship define how we operate every day." },
            ].map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-8">
                  <div className="text-[#0d9488] mb-5"><Icon className="h-7 w-7" /></div>
                  <h3 className="font-semibold text-xl tracking-tight text-[#0f172a] mb-3">{v.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Local Commitment */}
        <div className="rounded-3xl bg-[#f8fafc] p-10 md:p-14 border border-slate-100">
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            <div>
              <h3 className="font-semibold text-3xl tracking-tight text-[#0f172a] mb-4">Deeply rooted in Ridgeview</h3>
              <p className="text-slate-600 leading-relaxed">Many of our customers are families we’ve known for years. We know the homes here — the older farmhouses, the newer builds, and everything in between — and we know how our mountain climate affects heating and cooling systems.</p>
            </div>
            <div className="text-sm space-y-3 text-slate-700">
              <div className="flex gap-3"><Check className="h-4 w-4 mt-1 text-[#0d9488]" /> We stock common parts on every truck for faster repairs</div>
              <div className="flex gap-3"><Check className="h-4 w-4 mt-1 text-[#0d9488]" /> No overtime charges for evenings or weekends on emergencies</div>
              <div className="flex gap-3"><Check className="h-4 w-4 mt-1 text-[#0d9488]" /> Written estimates and clear communication before we start</div>
              <div className="flex gap-3"><Check className="h-4 w-4 mt-1 text-[#0d9488]" /> Many customers have been with us for over a decade</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
