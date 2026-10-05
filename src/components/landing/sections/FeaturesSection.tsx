import React from 'react';
import { CheckCircle, Star, Zap, Shield, Clock, Award } from 'lucide-react';

interface Feature {
  icon?: string;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  data?: {
    title?: string;
    subtitle?: string;
    features?: Feature[];
    bgColor?: string;
  };
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  check: CheckCircle,
  star: Star,
  zap: Zap,
  shield: Shield,
  clock: Clock,
  award: Award,
};

export default function FeaturesSection({ data }: FeaturesSectionProps) {
  const { title, subtitle, features = [], bgColor = '#FFFFFF' } = data || {};

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

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon ? iconMap[feature.icon] : CheckCircle;
            
            return (
              <div
                key={index}
                className="p-6 rounded-xl border-2 transition-all hover:shadow-lg"
                style={{ borderColor: '#E5E5E5', backgroundColor: '#FFFFFF' }}
              >
                <div className="mb-4">
                  <IconComponent className="w-12 h-12" style={{ color: '#252525' }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#252525' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#545454' }}>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
