'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  data?: {
    title?: string;
    subtitle?: string;
    faqs?: FAQItem[];
    bgColor?: string;
  };
}

export default function FAQSection({ data }: FAQSectionProps) {
  const { title, subtitle, faqs = [], bgColor = '#FFFFFF' } = data || {};
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-16 space-y-4">
            {title && (
              <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: '#252525' }}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg max-w-2xl mx-auto" style={{ color: '#545454' }}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-2 rounded-xl overflow-hidden transition-all"
              style={{ borderColor: openIndex === index ? '#252525' : '#E5E5E5' }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-right hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-lg flex-1" style={{ color: '#252525' }}>
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 flex-shrink-0 mr-4" style={{ color: '#252525' }} />
                ) : (
                  <ChevronDown className="w-5 h-5 flex-shrink-0 mr-4" style={{ color: '#7D7D7D' }} />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 py-4 border-t-2" style={{ borderColor: '#E5E5E5', backgroundColor: '#F5F5F5' }}>
                  <p className="leading-relaxed" style={{ color: '#545454' }}>
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
