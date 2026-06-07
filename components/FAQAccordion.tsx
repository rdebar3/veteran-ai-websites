'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQ {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index}>
            <button
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-gray-50 focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="pr-8 text-base font-medium text-[#111827]">{faq.question}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-[#6B7280] transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-6 text-[15px] leading-relaxed text-[#4B5563]">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
