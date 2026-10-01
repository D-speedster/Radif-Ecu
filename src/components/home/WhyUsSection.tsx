'use client';

import React from 'react';
import { Award, Shield, Zap, Users, Wrench } from 'lucide-react';

/* ترتیب: مهم‌ترین اول — سمت راست در RTL */
const FEATURES = [
  {
    id: 1,
    icon: Award,
    title: 'تجربه و تخصص',
    description: 'بیش از ۱۰ سال فعالیت تخصصی در حوزه تعمیر و برنامه‌نویسی ECU',
    accent: '#2563EB',
  },
  {
    id: 2,
    icon: Shield,
    title: 'تضمین کیفیت',
    description: 'گارانتی معتبر کتبی برای تمام خدمات ارائه شده',
    accent: '#0284C7',
  },
  {
    id: 3,
    icon: Zap,
    title: 'سرعت در انجام',
    description: 'کمترین زمان انتظار با بالاترین سطح کیفیت ممکن',
    accent: '#0EA5E9',
  },
  {
    id: 4,
    icon: Users,
    title: 'مشاوره رایگان',
    description: 'قبل از هر اقدام، مشکل خودرو را با شما بررسی می‌کنیم. تماس یا پیام در واتساپ بدهید.',
    accent: '#6366F1',
  },
];

/* ── Header pattern مشترک — دقیقاً همان ServicesGrid ── */
function SectionHeader({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 14px',
          borderRadius: '20px',
          backgroundColor: 'rgba(37,99,235,0.08)',
          border: '1px solid rgba(37,99,235,0.2)',
          color: '#2563EB',
          fontSize: '12px',
          fontWeight: 600,
          marginBottom: '14px',
        }}
      >
        <Wrench style={{ width: '12px', height: '12px' }} />
        {badge}
      </div>

      <h2
        style={{
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 700,
          color: '#0F172A',
          marginBottom: '12px',
          lineHeight: '1.3',
          letterSpacing: '-0.02em',
        }}
      >
        {title}
      </h2>

      <p
        style={{
          fontSize: '0.9375rem',
          fontWeight: 400,
          color: '#64748B',
          lineHeight: '1.7',
          maxWidth: '36rem',
          margin: '0 auto',
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}

export default function WhyUsSection() {
  return (
    <section
      style={{
        /* bg خاکستری — تضاد با ServicesGrid که سفید است */
        backgroundColor: '#F8FAFC',
        padding: '72px 0',
        fontFamily: 'YekanBakh, sans-serif',
      }}
    >
      <div className="container mx-auto" style={{ padding: '0 20px' }}>
        <SectionHeader
          badge="چرا ما؟"
          title="چرا ردیف ایسیو؟"
          subtitle="انتخاب هوشمندانه برای تعمیر و نگهداری تخصصی ECU خودروی شما"
        />

        {/* موبایل: ۱ ستون | sm: ۲ ستون | lg: ۴ ستون */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ gap: '16px' }}
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '24px 20px',
                  transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = feature.accent;
                  e.currentTarget.style.boxShadow = `0 4px 20px ${feature.accent}1A`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* آیکون — container charcoal با آیکون سفید */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: '#0F172A',
                    marginBottom: '14px',
                  }}
                >
                  <Icon style={{ width: '20px', height: '20px', color: '#FFFFFF' }} />
                </div>

                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#0F172A',
                    marginBottom: '8px',
                    lineHeight: '1.4',
                  }}
                >
                  {feature.title}
                </h3>

                <p
                  style={{
                    fontSize: '13.5px',
                    color: '#64748B',
                    lineHeight: '1.65',
                    margin: 0,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
