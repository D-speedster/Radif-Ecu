'use client';

import React from 'react';
import { LandingPage } from '@/types';

interface LandingPageViewProps {
  landingPage: LandingPage;
}

export default function LandingPageView({ landingPage }: LandingPageViewProps) {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-right" style={{ color: '#252525' }}>
              {landingPage.title}
            </h1>
            
            {landingPage.content && (
              <div 
                className="prose prose-lg max-w-none text-right"
                style={{ color: '#545454', direction: 'rtl' }}
                dangerouslySetInnerHTML={{ __html: landingPage.content }}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
