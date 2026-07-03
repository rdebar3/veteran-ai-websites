'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Flame, Snowflake, Wind, Droplet, Shield, CheckCircle, Calendar } from 'lucide-react';

export default function ServicesPage() {
  useEffect(() => {
    document.title = 'HVAC Services | Appalachian HVAC Solutions | Ridgeview, WV';
  }, []);

  const services = [
    {
      icon: Flame,
      title: "Heating Systems",
      image: "/grok-image-57016dc4-4380-4115-b409-da347c40d452.jpg",
      desc: "High-efficiency gas furnaces, electric furnaces, and heat pumps sized perfectly for our region’s cold winters.",
      features: ["Furnace replacement & installation", "Heat pump systems (ducted & ductless)", "Boilers and radiant heating", "Smart thermostats & zoning", "Annual safety inspections"],
    },
    {
      icon: Snowflake,
      title: "Air Conditioning & Cooling",
      image: "/grok-image-11e0d2c5-115b-41ef-8811-2d3f53d43ca2.jpg",
      desc: "Central air conditioning and ductless mini-splits that deliver reliable cooling while controlling humidity in West Virginia summers.",
      features: ["High-SEER central AC units", "Ductless mini-split systems", "Whole-home dehumidification", "Smart controls & scheduling", "New construction & retrofits"],
    },
    {
      icon: Wind,
      title: "Indoor Air Quality Solutions",
      image: "/grok-image-420ebc9c-ae44-49c4-b403-9866b81fa03a.jpg",
      desc: "Whole-home air purifiers, humidifiers, dehumidifiers, and ventilation systems for cleaner, healthier air in every season.",
      features: ["HEPA & UV air purification", "Whole-home humidifiers", "Energy recovery ventilators (ERV)", "Duct cleaning & sanitizing", "Allergy & asthma support"],
    },
    {
      icon: Calendar,
      title: "Maintenance & Tune-Up Plans",
      image: "/grok-image-36c452ca-b5ac-4917-aa9d-98dbbe558a6d.jpg",
      desc: "Preventive maintenance that keeps your system running efficiently, catches small issues early, and often includes priority service.",
      features: ["Twice-yearly precision tune-ups", "Filter replacement program", "Priority scheduling for members", "10% discount on repairs", "Extended equipment life"],
    },
    {
      icon: Wind,
      title: "Ductwork & Ventilation",
      image: "/grok-image-57016dc4-4380-4115-b409-da347c40d452.jpg",
      desc: "Inspection, sealing, cleaning, and new duct installation to improve airflow, efficiency, and indoor air quality.",
      features: ["Duct sealing & insulation", "Camera inspections", "Duct cleaning & sanitization", "New duct design & installation", "Attic & crawl space solutions"],
    },
    {
      icon: Shield,
      title: "24/7 Emergency HVAC Service",
      image: "/grok-image-36c452ca-b5ac-4917-aa9d-98dbbe558a6d.jpg",
      desc: "Fast, reliable response for no-heat, no-cool, and other urgent situations. Our trucks are stocked for same-day resolutions.",
      features: ["24/7 availability year-round", "No-heat & no-cool emergencies", "Refrigerant leaks & compressor issues", "Thermostat & control failures", "Priority for maintenance members"],
    },
  ];

  return (
    <div className="bg-white">
      <div className="bg-[#f8fafc] border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="max-w-3xl">
            <div className="text-[#0d9488] text-xs tracking-[2px] font-semibold mb-2">EXPERTISE YOU CAN RELY ON</div>
            <h1 className="text-5xl font-semibold tracking-tighter text-[#0f172a] mb-4">Professional HVAC Services</h1>
            <p className="text-xl text-slate-600">From high-efficiency installations to ongoing care, we deliver solutions designed for Ridgeview homes and our local climate.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <div key={index} className="grid lg:grid-cols-12 gap-x-12 gap-y-8 items-start">
              <div className="lg:col-span-5">
                <div className="sticky top-20">
                  <div className="inline-flex p-3 rounded-xl bg-[#ecfdf5] text-[#0d9488] mb-5">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h2 className="text-4xl font-semibold tracking-tight text-[#0f172a] mb-4">{service.title}</h2>
                  <p className="text-lg text-slate-600 leading-relaxed mb-4">{service.desc}</p>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                  <img 
                    src={service.image} 
                    alt={`Professional ${service.title.toLowerCase()} installation and service in Ridgeview, West Virginia`} 
                    className="w-full h-[260px] object-cover" 
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-700">
                  {service.features.map((f, fi) => (
                    <div key={fi} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#0d9488]" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#0f172a] text-white py-14">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-semibold mb-3">Protect your system with a Maintenance Plan</h3>
          <p className="text-white/80 mb-6">Twice-yearly visits keep equipment efficient and often include priority service and discounts on repairs.</p>
          <Link href="/examples/complete-hvac/contact" className="inline-flex items-center rounded-lg bg-white text-[#0f172a] font-semibold px-8 py-3 hover:bg-slate-100">Get a Maintenance Plan Quote</Link>
        </div>
      </div>
    </div>
  );
}
