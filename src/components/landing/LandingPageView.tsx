'use client';

import React from 'react';
import { LandingPage } from '@/types';
import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSection';
import CTASection from './sections/CTASection';
import TextSection from './sections/TextSection';
import ImageSection from './sections/ImageSection';
import VideoSection from './sections/VideoSection';
import TestimonialsSection from './sections/TestimonialsSection';
import FAQSection from './sections/FAQSection';

interface LandingPageViewProps {
  landingPage: LandingPage;
}

export default function LandingPageView({ landingPage }: LandingPageViewProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* اگر content وجود داشت، نمایش بده */}
      {landingPage.content && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-8 text-right" style={{ color: '#252525' }}>
                {landingPage.title}
              </h1>
              <div 
                className="prose prose-lg max-w-none text-right"
                style={{ color: '#545454', direction: 'rtl' }}
                dangerouslySetInnerHTML={{ __html: landingPage.content }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Render sections dynamically */}
      {landingPage.sections.map((section, index) => {
        const key = `${section.type}-${index}`;

        switch (section.type) {
          case 'hero':
            return <HeroSection key={key} data={section.data} />;
          case 'features':
            return <FeaturesSection key={key} data={section.data} />;
          case 'cta':
            return <CTASection key={key} data={section.data} />;
          case 'text':
            return <TextSection key={key} data={section.data} />;
          case 'image':
            return <ImageSection key={key} data={section.data} />;
          case 'video':
            return <VideoSection key={key} data={section.data} />;
          case 'testimonials':
            return <TestimonialsSection key={key} data={section.data} />;
          case 'faq':
            return <FAQSection key={key} data={section.data} />;
          default:
            console.warn(`Unknown section type: ${section.type}`);
            return null;
        }
      })}
    </div>
  );
}
