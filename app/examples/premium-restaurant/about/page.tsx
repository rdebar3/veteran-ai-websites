'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About Us | Mountain View Grill & Tavern | Ridgeview, WV';
  }, []);

  return (
    <div className="bg-[#fdf6e3]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="text-[#8b4513] text-xs tracking-[2px] font-semibold mb-2">EST. 2013</div>
          <h1 className="font-serif text-5xl tracking-tight text-[#3e2723]">Our Story</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-5 text-lg leading-relaxed text-[#5c4033]">
              <p>Mountain View Grill &amp; Tavern was founded in 2013 by a local U.S. Army veteran who returned home to Ridgeview after his service and wanted to create a place where good friends could gather over great food with one of the best views in the county.</p>
              
              <p>What started as a small 40-seat tavern has grown into a beloved community spot. We focus on classic American comfort food done right — using fresh, local ingredients from West Virginia farms and producers whenever possible.</p>

              <p>Our team takes pride in warm hospitality, generous portions, and making sure every guest — whether it's a family celebrating a birthday or a couple enjoying date night — feels right at home.</p>
            </div>

            <div className="mt-8 p-6 bg-white rounded-2xl border border-[#8b7355]/20">
              <div className="font-semibold text-[#3e2723] mb-2">Veteran Owned &amp; Operated</div>
              <p className="text-sm text-[#5c4033]">We proudly offer a 10% military discount every day as a small thank you to those who have served.</p>
            </div>
          </div>

          <div>
            <img 
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Warm interior of Mountain View Grill & Tavern with wooden tables and mountain views" 
              className="rounded-3xl shadow-md w-full" 
            />
            <p className="text-xs text-center text-[#8b7355] mt-3">Our dining room with views of the Appalachian mountains</p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link href="/examples/premium-restaurant/reservations" className="inline-flex rounded-lg bg-[#8b4513] text-[#fdf6e3] px-8 py-3 font-semibold">Join us for dinner — reserve your table today</Link>
        </div>
      </div>
    </div>
  );
}
