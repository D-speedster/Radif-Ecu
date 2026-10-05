import React from 'react';

interface TextSectionProps {
  data?: {
    title?: string;
    content?: string;
    align?: 'left' | 'center' | 'right';
    bgColor?: string;
  };
}

export default function TextSection({ data }: TextSectionProps) {
  const { title, content, align = 'right', bgColor = '#FFFFFF' } = data || {};

  if (!content) return null;

  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  return (
    <section className="py-20" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto px-4">
        <div className={`max-w-4xl mx-auto space-y-6 ${alignClass}`}>
          {title && (
            <h2 className="text-3xl lg:text-4xl font-bold mb-8" style={{ color: '#252525' }}>
              {title}
            </h2>
          )}
          <div
            className="prose prose-lg max-w-none"
            style={{ color: '#545454' }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </section>
  );
}
