'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function GalleryPage() {
  useEffect(() => {
    document.title = 'Gallery & Events | Mountain View Grill & Tavern | Ridgeview, WV';
  }, []);

  const galleryImages = [
    { url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", caption: "Signature Tavern Burger with hand-cut fries" },
    { url: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", caption: "Grilled Ribeye with roasted vegetables" },
    { url: "https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", caption: "Loaded Mountain Nachos — a customer favorite" },
    { url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", caption: "Craft cocktails and local beer selection" },
    { url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", caption: "Our warm dining room with mountain views" },
    { url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", caption: "Chef's seasonal plated special" },
    { url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", caption: "Live music nights on the deck" },
    { url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", caption: "Family-friendly atmosphere" },
  ];

  const events = [
    { day: "Tuesdays", event: "Trivia Night 7pm — Free to play, prizes for winners" },
    { day: "Thursdays", event: "Live Acoustic Music 6:30–9pm on the deck (weather permitting)" },
    { day: "Saturdays", event: "Kids Eat Free with adult entrée (under 12)" },
    { day: "Monthly", event: "Veterans & First Responders Appreciation Night — 15% off" },
  ];

  return (
    <div className="bg-[#fdf6e3]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="font-serif text-5xl tracking-tight text-[#3e2723]">Gallery &amp; Events</h1>
          <p className="mt-2 text-lg text-[#5c4033]">Good times, great food, and even better company.</p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {galleryImages.map((img, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-[#8b7355]/10">
              <img 
                src={img.url} 
                alt={img.caption} 
                className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" 
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm font-medium">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Events */}
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl tracking-tight text-[#3e2723] mb-6 text-center">Weekly &amp; Monthly Events</h2>
          <div className="space-y-4 text-lg">
            {events.map((e, i) => (
              <div key={i} className="flex gap-4 bg-white p-5 rounded-2xl border border-[#8b7355]/10">
                <div className="w-28 shrink-0 font-semibold text-[#8b4513]">{e.day}</div>
                <div className="text-[#3e2723]">{e.event}</div>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-sm text-[#5c4033]">Events are subject to change. Call or check our socials for the latest schedule.</p>
        </div>
      </div>
    </div>
  );
}
