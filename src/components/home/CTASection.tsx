'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, CalendarCheck } from 'lucide-react';
import { telHref } from '@/config/business';

/* استایل مشترک هر دو دکمه */
const BTN_BASE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  height: '50px',
  minWidth: '190px',
  padding: '0 28px',
  borderRadius: '10px',
  fontSize: '0.9375rem',
  fontWeight: 700,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  transition: 'background-color 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.15s',
};

export default function CTASection() {
  return (
    <section
      style={{
        /* بالا: 0 — بدون فاصله از بخش قبلی */
        padding: '0 0 64px',
        fontFamily: 'YekanBakh, sans-serif',
        backgroundColor: '#F0F2F5',
      }}
    >
      <div className="container mx-auto" style={{ padding: '0 20px' }}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0F172A 0%, #16213E 45%, #1E3A5F 100%)',
            padding: 'clamp(36px, 6vw, 64px) clamp(24px, 5vw, 56px)',
            textAlign: 'center',
          }}
        >
          {/* ── افکت نوری پس‌زمینه ── */}
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <div style={{
              position: 'absolute', top: '-60px', left: '10%',
              width: '300px', height: '300px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 65%)',
            }} />
            <div style={{
              position: 'absolute', bottom: '-40px', right: '8%',
              width: '240px', height: '240px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 65%)',
            }} />
            <div style={{
              position: 'absolute', top: 0, left: '10%', right: '10%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.4), transparent)',
            }} />
          </div>

          {/* badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 14px',
              borderRadius: '20px',
              backgroundColor: 'rgba(37,99,235,0.15)',
              border: '1px solid rgba(37,99,235,0.3)',
              color: '#93C5FD',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '20px',
              position: 'relative',
            }}
          >
            <CalendarCheck style={{ width: '12px', height: '12px' }} />
            رزرو آنلاین — سریع و آسان
          </div>

          {/* عنوان */}
          <h2
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.25rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: '1.25',
              marginBottom: '14px',
              position: 'relative',
            }}
          >
            آماده شروع هستید؟
          </h2>

          {/* زیرعنوان */}
          <p
            style={{
              fontSize: '0.9375rem',
              fontWeight: 400,
              color: '#94A3B8',
              lineHeight: '1.7',
              maxWidth: '32rem',
              margin: '0 auto 32px',
              position: 'relative',
            }}
          >
            نوبت خود را همین امروز رزرو کنید و از خدمات تخصصی ECU ما بهره‌مند شوید
          </p>

          {/* ── دکمه‌ها ── */}
          <div
            className="flex flex-col sm:flex-row justify-center items-center"
            style={{ gap: '12px', position: 'relative' }}
          >
            {/* دکمه اصلی — آبی */}
            <Link
              href="/booking"
              style={{
                ...BTN_BASE,
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                boxShadow: '0 4px 20px rgba(37,99,235,0.4)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1D4ED8';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(37,99,235,0.5)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2563EB';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,99,235,0.4)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              رزرو نوبت آنلاین
              <ArrowLeft style={{ width: '17px', height: '17px', flexShrink: 0 }} />
            </Link>

            {/* دکمه ثانوی — شیشه‌ای، دقیقاً هم‌اندازه */}
            <a
              href={telHref}
              style={{
                ...BTN_BASE,
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#E2E8F0',
                border: '1.5px solid rgba(255,255,255,0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.14)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Phone style={{ width: '17px', height: '17px', flexShrink: 0 }} />
              تماس تلفنی
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
