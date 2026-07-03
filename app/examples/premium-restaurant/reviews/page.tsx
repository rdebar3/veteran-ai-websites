'use client';

import React, { useEffect } from 'react';

export default function ReviewsPage() {
  useEffect(() => {
    document.title = 'Reviews | Mountain View Grill & Tavern | Ridgeview, WV';
  }, []);

  const reviews = [
    { stars: 5, name: "The Carters", date: "June 2026", text: "Took the whole family for my dad’s birthday. The ribs were fall-off-the-bone and the staff went out of their way to make it special. We’ll be back every year.", loc: "Ridgeview" },
    { stars: 5, name: "Jessica R.", date: "May 2026", text: "Date night done right. The steak was cooked exactly how I asked and the view at sunset is something else. Great wine list too.", loc: "Oakdale" },
    { stars: 4, name: "Mike & Lisa T.", date: "April 2026", text: "First time here with our two young kids. They loved the kids menu and the mac & cheese. Portions were huge — we all left happy and full.", loc: "Pine Hollow" },
    { stars: 5, name: "Tom H.", date: "March 2026", text: "Best burger in the county, hands down. The outdoor deck is perfect in the summer. Service was fast even on a busy Saturday night.", loc: "Ridgeview" },
    { stars: 5, name: "The Ramirez Family", date: "February 2026", text: "We come here for almost every special occasion. The food is consistently great and they always remember our usual table. Feels like family.", loc: "Maple Fork" },
  ];

  return (
    <div className="bg-[#fdf6e3]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="font-serif text-5xl tracking-tight text-[#3e2723]">Guest Reviews</h1>
          <p className="mt-2 text-[#5c4033]">Real stories from real guests who keep coming back.</p>
        </div>

        <div className="space-y-6 max-w-3xl mx-auto">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl p-7 border border-[#8b7355]/10">
              <div className="flex text-[#f59e0b] mb-3">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
              <p className="text-lg italic text-[#3e2723]">“{r.text}”</p>
              <div className="mt-4 text-sm font-semibold text-[#5c4033]">{r.name} <span className="font-normal">— {r.loc} • {r.date}</span></div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 text-sm text-[#5c4033]">
          We love hearing from you. Share your experience on Google or Facebook!
        </div>
      </div>
    </div>
  );
}
