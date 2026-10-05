import React from 'react';
import { Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  role?: string;
  content: string;
  avatar?: string;
  rating?: number;
}

interface TestimonialsSectionProps {
  data: {
    title?: string;
    subtitle?: string;
    testimonials: Testimonial[];
    bgColor?: string;
  };
}

export default function TestimonialsSection({ data }: TestimonialsSectionProps) {
  const { title, subtitle, testimonials, bgColor = '#F5F5F5' } = data;

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

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border-2 bg-white shadow-md"
              style={{ borderColor: '#E5E5E5' }}
            >
              <Quote className="w-10 h-10 mb-4" style={{ color: '#7D7D7D' }} />
              
              <p className="mb-6 text-lg leading-relaxed" style={{ color: '#545454' }}>
                {testimonial.content}
              </p>

              <div className="flex items-center gap-4">
                {testimonial.avatar && (
                  <div
                    className="w-12 h-12 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${testimonial.avatar})` }}
                  />
                )}
                <div>
                  <p className="font-bold" style={{ color: '#252525' }}>
                    {testimonial.name}
                  </p>
                  {testimonial.role && (
                    <p className="text-sm" style={{ color: '#7D7D7D' }}>
                      {testimonial.role}
                    </p>
                  )}
                </div>
              </div>

              {/* Rating */}
              {testimonial.rating && (
                <div className="flex gap-1 mt-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      style={{ color: i < testimonial.rating! ? '#FCD34D' : '#E5E5E5' }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
