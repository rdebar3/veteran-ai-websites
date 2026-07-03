'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  useEffect(() => {
    document.title = 'Mountain View Grill & Tavern | Ridgeview, WV';
  }, []);

  return (
    <div className="bg-[#fdf6e3]">
      {/* HERO - Warm restaurant interior / plated food with inviting feel */}
      <section className="relative h-[620px] md:h-[680px] flex items-center bg-[#3e2723]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#3e2723]/70 via-[#3e2723]/50 to-[#3e2723]/70" />
        
        <div className="relative max-w-5xl mx-auto px-6 text-center text-[#fdf6e3]">
          <div className="text-xs tracking-[3px] font-medium text-[#f5d9b8] mb-3">RIDGEVIEW, WEST VIRGINIA</div>
          <h1 className="text-6xl md:text-7xl font-serif tracking-[-1.5px] mb-4">Mountain View<br />Grill &amp; Tavern</h1>
          <p className="text-2xl md:text-3xl tracking-tight text-[#f5d9b8] mb-3">"Good Food, Good Friends, Mountain Views"</p>
          <p className="max-w-md mx-auto text-[#f5d9b8]/90 mb-8">Family-friendly American classics with a view in the heart of the mountains.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/examples/premium-restaurant/reservations" className="inline-flex items-center justify-center rounded-lg bg-[#8b4513] hover:bg-[#5c4033] px-10 py-4 text-lg font-semibold text-[#fdf6e3] transition">
              Make a Reservation
            </Link>
            <Link href="/examples/premium-restaurant/menu" className="inline-flex items-center justify-center rounded-lg border border-[#f5d9b8]/70 hover:bg-white/10 px-10 py-4 text-lg font-semibold text-[#fdf6e3] transition">
              View Our Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Today's Specials */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="text-[#8b4513] text-xs tracking-[2px] font-semibold mb-2">FRESH FROM THE GRILL</div>
          <h2 className="font-serif text-4xl tracking-tight text-[#3e2723]">Today's Specials</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Smoky Mountain Ribeye", desc: "16oz prime ribeye, garlic mashed, grilled asparagus, house steak sauce", price: "32" },
            { name: "Blackened Salmon", desc: "Atlantic salmon, lemon beurre blanc, wild rice pilaf, seasonal vegetables", price: "26" },
            { name: "Tavern Burger & Fries", desc: "Two beef patties, cheddar, bacon, special sauce, brioche bun", price: "18" },
          ].map((special, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-[#8b7355]/20 shadow-sm">
              <div className="flex justify-between items-baseline mb-3">
                <h3 className="font-semibold text-2xl text-[#3e2723]">{special.name}</h3>
                <span className="font-mono text-xl text-[#8b4513]">${special.price}</span>
              </div>
              <p className="text-[#5c4033] leading-relaxed">{special.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/examples/premium-restaurant/menu" className="text-[#8b4513] font-medium hover:underline">See the full menu →</Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16 border-y border-[#8b7355]/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-[#8b4513] text-xs tracking-[2px] font-semibold mb-2">WHAT OUR GUESTS SAY</div>
            <h2 className="font-serif text-4xl tracking-tight text-[#3e2723]">Loved by Locals &amp; Visitors Alike</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "The best burger I've had in years. The views from the deck are unbeatable and the staff made us feel right at home with the kids.", name: "The Henderson Family", loc: "Ridgeview" },
              { quote: "Came for date night. The ribeye was cooked perfectly and the atmosphere is so cozy. Will definitely be back for the live music nights.", name: "Mike &amp; Laura T.", loc: "Oakdale" },
              { quote: "Fantastic family spot. Our kids loved the mac &amp; cheese and the portions are huge. Great value and the veteran discount is a nice touch.", name: "Sarah P.", loc: "Pine Hollow" },
            ].map((t, i) => (
              <div key={i} className="bg-[#fdf6e3] p-7 rounded-2xl border border-[#8b7355]/10">
                <p className="italic text-[#5c4033] leading-relaxed mb-6">“{t.quote}”</p>
                <div className="font-semibold text-[#3e2723]">{t.name} <span className="font-normal text-[#8b7355]">— {t.loc}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="font-serif text-4xl tracking-tight text-[#3e2723] mb-4">Ready to make some memories?</h2>
        <p className="text-lg text-[#5c4033] mb-8">Join us for dinner with a view. Reservations recommended, especially on weekends.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/examples/premium-restaurant/reservations" className="inline-flex items-center justify-center rounded-lg bg-[#8b4513] px-10 py-4 text-lg font-semibold text-[#fdf6e3] hover:bg-[#5c4033]">Reserve Your Table</Link>
          <a href="tel:3045550381" className="inline-flex items-center justify-center rounded-lg border border-[#8b4513] px-10 py-4 text-lg font-semibold text-[#3e2723] hover:bg-[#8b4513]/5">Call (304) 555-0381</a>
        </div>
      </section>
    </div>
  );
}
