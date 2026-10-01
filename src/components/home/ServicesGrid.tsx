'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, Zap, Search, GitBranch, Wrench } from 'lucide-react';

const SERVICES = [
  {
    icon: Cpu,
    title: 'تعمیر ECU',
    href: '/repair-ecu',
    description: 'تعمیر برد و سخت‌افزار ECU خودرو',
    accent: '#2563EB',
  },
  {
    icon: Zap,
    title: 'ریمپ ECU',
    href: '/remap',
    description: 'افزایش قدرت و بهینه‌سازی نرم‌افزار',
    accent: '#0EA5E9',
  },
  {
    icon: Search,
    title: 'دیاگ تخصصی',
    href: '/booking',
    description: 'عیب‌یابی دقیق با تجهیزات پیشرفته',
    accent: '#6366F1',
  },
  {
    icon: GitBranch,
    title: 'مالتی‌پلکس',
    href: '/booking',
    description: 'تعمیر سیستم‌های الکترونیکی خودرو',
    accent: '#0284C7',
  },
];

/* ── Header pattern مشترک ── */
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

export default function ServicesGrid() {
  return (
    <section
      id="services"
      style={{
        /* bg سفید — تضاد با Hero و WhyUs که #F8FAFC دارن */
        backgroundColor: '#FFFFFF',
        padding: '72px 0',
        fontFamily: 'YekanBakh, sans-serif',
      }}
    >
      <div className="container mx-auto" style={{ padding: '0 20px' }}>
        <SectionHeader
          badge="خدمات تخصصی ما"
          title="خدمات اصلی"
          subtitle="تعمیر ECU، ریمپ، دیاگ و مالتی‌پلکس خودرو؛ برای مشاوره تماس بگیرید یا در واتساپ پیام بدهید."
        />

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ gap: '16px' }}
        >
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                href={service.href}
                key={index}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '24px 20px',
                  transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = service.accent;
                  e.currentTarget.style.boxShadow = `0 4px 20px ${service.accent}1A`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* آیکون با رنگ accent هر خدمت */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: `${service.accent}15`,
                    marginBottom: '14px',
                  }}
                >
                  <Icon style={{ width: '20px', height: '20px', color: service.accent }} />
                </div>

                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#0F172A',
                    marginBottom: '6px',
                    lineHeight: '1.4',
                  }}
                >
                  {service.title}
                </h3>

                <p
                  style={{
                    fontSize: '13.5px',
                    color: '#64748B',
                    lineHeight: '1.65',
                    margin: 0,
                  }}
                >
                  {service.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
