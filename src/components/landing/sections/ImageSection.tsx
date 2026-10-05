import React from 'react';
import Image from 'next/image';

interface ImageSectionProps {
  data?: {
    imageUrl?: string;
    alt?: string;
    caption?: string;
    fullWidth?: boolean;
    bgColor?: string;
  };
}

export default function ImageSection({ data }: ImageSectionProps) {
  const { imageUrl, alt, caption, fullWidth = false, bgColor = '#FFFFFF' } = data || {};

  if (!imageUrl) return null;

  return (
    <section className="py-20" style={{ backgroundColor: bgColor }}>
      <div className={fullWidth ? 'w-full' : 'container mx-auto px-4'}>
        <div className={fullWidth ? '' : 'max-w-5xl mx-auto'}>
          <div className="relative w-full h-96 lg:h-[600px] rounded-xl overflow-hidden shadow-lg">
            <Image
              src={imageUrl}
              alt={alt || 'Landing Page Image'}
              fill
              className="object-cover"
            />
          </div>
          {caption && (
            <p className="text-center mt-4 text-sm" style={{ color: '#7D7D7D' }}>
              {caption}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
