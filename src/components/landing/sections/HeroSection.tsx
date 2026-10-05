import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';

interface HeroSectionProps {
  data: {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    ctaText?: string;
    ctaLink?: string;
    bgColor?: string;
  };
}

export default function HeroSection({ data }: HeroSectionProps) {
  const {
    title,
    subtitle,
    imageUrl,
    ctaText,
    ctaLink,
    bgColor = '#F5F5F5',
  } = data;

  return (
    <section className="relative py-20 lg:py-32" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-right space-y-6">
            {title && (
              <h1
                className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
                style={{ color: '#252525' }}
              >
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-lg lg:text-xl" style={{ color: '#545454' }}>
                {subtitle}
              </p>
            )}
            {ctaText && ctaLink && (
              <div className="pt-4">
                <Link href={ctaLink}>
                  <Button variant="accent" className="px-8 py-3 text-lg">
                    {ctaText}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Image */}
          {imageUrl && (
            <div className="relative h-64 lg:h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={imageUrl}
                alt={title || 'Hero Image'}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
