'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function MenuPage() {
  useEffect(() => {
    document.title = 'Menu | Mountain View Grill & Tavern | Ridgeview, WV';
  }, []);

  const menuSections = [
    {
      title: "Appetizers",
      items: [
        { name: "Mountain Nachos", desc: "Tortilla chips, cheddar, jalapeños, black beans, pico, sour cream, guac", price: "13" },
        { name: "Crispy Fried Pickles", desc: "House dill pickles, buttermilk ranch", price: "10" },
        { name: "Smoked Wings", desc: "Choice of buffalo, BBQ, or garlic parm (6pc / 12pc)", price: "14 / 25" },
        { name: "Tavern Pretzel", desc: "Warm soft pretzel, beer cheese & whole grain mustard", price: "12" },
      ],
    },
    {
      title: "Entrees & Sandwiches",
      items: [
        { name: "Classic Tavern Burger", desc: "Two 4oz patties, American, lettuce, tomato, onion, special sauce, fries", price: "17" },
        { name: "Black & Bleu Burger", desc: "Cajun seasoned, bleu cheese crumbles, caramelized onions, fries", price: "19" },
        { name: "Grilled Ribeye", desc: "14oz choice cut, garlic mashed potatoes, roasted asparagus, herb butter", price: "32" },
        { name: "BBQ Baby Back Ribs", desc: "Half rack, house BBQ, coleslaw, cornbread, fries", price: "24" },
        { name: "Pan-Seared Salmon", desc: "Lemon caper sauce, wild rice, grilled zucchini", price: "26" },
        { name: "Chicken Fried Chicken", desc: "Crispy chicken, country gravy, mashed potatoes, green beans", price: "20" },
      ],
    },
    {
      title: "Desserts",
      items: [
        { name: "Warm Apple Crisp", desc: "Cinnamon apples, oat crumble, vanilla bean ice cream", price: "9" },
        { name: "Chocolate Bourbon Pecan Pie", desc: "House-made, whipped cream", price: "9" },
        { name: "New York Cheesecake", desc: "Fresh berries, graham cracker crust", price: "8" },
      ],
    },
    {
      title: "Drinks",
      items: [
        { name: "Local Craft Beer", desc: "Rotating taps from WV breweries (16oz)", price: "7" },
        { name: "Mountain Mule", desc: "Ginger beer, lime, choice of whiskey or vodka", price: "10" },
        { name: "House Wine", desc: "Red or white by the glass", price: "8" },
        { name: "Fresh Lemonade / Iced Tea", desc: "Classic or flavored (strawberry, peach)", price: "4" },
        { name: "Milkshakes", desc: "Vanilla, chocolate, or strawberry", price: "6" },
      ],
    },
  ];

  return (
    <div className="bg-[#fdf6e3]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="text-[#8b4513] text-xs tracking-[2px] font-semibold mb-2">FRESH • LOCAL • DELICIOUS</div>
          <h1 className="font-serif text-5xl tracking-tight text-[#3e2723]">Our Menu</h1>
          <p className="mt-2 text-[#5c4033]">All items made fresh daily with ingredients from local farms and purveyors.</p>
        </div>

        <div className="space-y-12">
          {menuSections.map((section, idx) => (
            <div key={idx}>
              <h2 className="font-serif text-3xl tracking-tight text-[#3e2723] mb-6 pb-2 border-b border-[#8b7355]/30">{section.title}</h2>
              <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
                {section.items.map((item, i) => (
                  <div key={i} className="flex justify-between gap-4 border-b border-[#8b7355]/10 pb-4">
                    <div>
                      <div className="font-semibold text-lg text-[#3e2723]">{item.name}</div>
                      <div className="text-sm text-[#5c4033] leading-snug pr-2">{item.desc}</div>
                    </div>
                    <div className="font-mono text-lg text-[#8b4513] whitespace-nowrap pt-1">${item.price}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-[#5c4033]">
          Ask your server about gluten-free options, daily specials, and kids' menu.
          <br />Prices subject to change. 18% gratuity added to parties of 8 or more.
        </div>
      </div>
    </div>
  );
}
