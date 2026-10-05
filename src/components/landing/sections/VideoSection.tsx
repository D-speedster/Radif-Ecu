import React from 'react';

interface VideoSectionProps {
  data: {
    videoUrl: string;
    title?: string;
    subtitle?: string;
    bgColor?: string;
  };
}

export default function VideoSection({ data }: VideoSectionProps) {
  const { videoUrl, title, subtitle, bgColor = '#FFFFFF' } = data;

  return (
    <section className="py-20" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          {(title || subtitle) && (
            <div className="text-center space-y-4">
              {title && (
                <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: '#252525' }}>
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-lg" style={{ color: '#545454' }}>
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Video */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
            <iframe
              src={videoUrl}
              title={title || 'Video'}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
