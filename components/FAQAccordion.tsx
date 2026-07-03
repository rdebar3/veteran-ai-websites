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

  return (
    <div className="faq">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="faq__item">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="faq__trigger"
              aria-expanded={isOpen}
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`faq__chevron h-5 w-5 ${isOpen ? 'faq__chevron--open' : ''}`}
              />
            </button>
            {isOpen && <div className="faq__answer">{faq.answer}</div>}
          </div>
        );
      })}
    </div>
  );
}