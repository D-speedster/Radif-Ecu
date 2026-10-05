import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

interface CTASectionProps {
  data?: {
    title?: string;
    subtitle?: string;
    primaryCtaText?: string;
    primaryCtaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    bgColor?: string;
  };
}

export default function CTASection({ data }: CTASectionProps) {
  const {
    title,
    subtitle,
    primaryCtaText,
    primaryCtaLink,
    secondaryCtaText,
    secondaryCtaLink,
    bgColor = '#252525',
  } = data || {};

  return (
    <section className="py-20" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Text */}
          {title && (
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg lg:text-xl" style={{ color: '#E5E5E5' }}>
              {subtitle}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {primaryCtaText && primaryCtaLink && (
              <Link href={primaryCtaLink}>
                <Button variant="accent" className="px-8 py-3 text-lg w-full sm:w-auto">
                  {primaryCtaText}
                </Button>
              </Link>
            )}
            {secondaryCtaText && secondaryCtaLink && (
              <Link href={secondaryCtaLink}>
                <Button variant="secondary" className="px-8 py-3 text-lg w-full sm:w-auto">
                  {secondaryCtaText}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
