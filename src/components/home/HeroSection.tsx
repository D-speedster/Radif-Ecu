'use client';

import React from 'react';
import Link from 'next/link';
import { business } from '@/config/business';
import { ArrowLeft, CheckCircle2, Cpu } from 'lucide-react';
import Image from 'next/image';

const TRUST_ITEMS = [
  { text: 'پاسخ‌گویی در تلفن و واتساپ', short: 'تلفن و واتساپ' },
  { text: 'رزرو آنلاین نوبت', short: 'رزرو آنلاین' },
  ...(business.experience ? [{ text: business.experience, short: business.experience }] : []),
  ...(business.warranty ? [{ text: business.warranty, short: business.warranty }] : []),
];

export default function HeroSection() {
  return (
    <section
      style={{
        fontFamily: 'YekanBakh, sans-serif',
        /* گرادیان ظریف: از charcoal خیلی کم‌رنگ به bg خاکستری */
        background: 'linear-gradient(160deg, #E8EDF5 0%, #F0F2F5 55%, #EDF0F6 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── دکوراسیون پس‌زمینه: دایره‌های محو ── */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
        }}
      >
        {/* دایره آبی گوشه چپ بالا */}
        <div style={{
          position: 'absolute', top: '-80px', left: '-80px',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)',
        }} />
        {/* دایره charcoal گوشه راست پایین */}
        <div style={{
          position: 'absolute', bottom: '-60px', right: '-60px',
          width: '280px', height: '280px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(22,33,62,0.05) 0%, transparent 70%)',
        }} />
      </div>

      <div className="container mx-auto" style={{ padding: '28px 16px 36px', position: 'relative' }}>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* ── ستون راست: محتوا ── */}
          <div className="text-center lg:text-right">

            {/* تگ دسته‌بندی بالای عنوان */}
            <div
              className="inline-flex items-center gap-1.5 mb-4"
              style={{
                padding: '5px 12px',
                borderRadius: '20px',
                backgroundColor: 'rgba(37,99,235,0.1)',
                border: '1px solid rgba(37,99,235,0.2)',
                color: '#2563EB',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <Cpu style={{ width: '13px', height: '13px' }} />
              ریمپ و تعمیر ECU در تهران
            </div>

            {/* عنوان اصلی */}
            <h1
              style={{
                fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
                color: '#16213E',
                lineHeight: '1.28',
                letterSpacing: '-0.025em',
                marginBottom: '0.85rem',
              }}
            >
              <span style={{ fontWeight: 700 }}>ریمپ و تعمیر </span>
              <span style={{
                fontWeight: 900,
                fontSize: '1.1em',
                color: '#2563EB',      /* ← ECU با آبی برقی */
              }}>ECU</span>
              <br />
              <span style={{ fontWeight: 500, fontSize: '0.82em', color: '#4A5568' }}>
                خودرو در تهران
              </span>
            </h1>

            {/* توضیح — وزن Regular */}
            <p
              className="lg:mx-0"
              style={{
                fontSize: '0.9375rem',
                fontWeight: 400,
                color: '#4A5568',
                lineHeight: '1.75',
                marginBottom: '1.5rem',
                maxWidth: '30rem',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              <span className="md:hidden" style={{ fontSize: '14px' }}>
                ریمپ، دیاگ و تعمیرات تخصصی ECU
              </span>
              <span className="hidden md:inline">
                ریمپ، تعمیر برد، پروگرام، مالتی‌پلکس و عیب‌یابی ECU خودرو
              </span>
            </p>

            {/* ── دکمه‌ها ── */}
            {/* دسکتاپ: کنار هم | موبایل: compact در یک ردیف */}
            <div
              className="flex justify-center lg:justify-start"
              style={{ gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}
            >
              {/* دکمه اصلی — آبی */}
              <Link
                href="/remap"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  height: '48px',
                  padding: '0 24px',
                  borderRadius: '8px',
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  border: 'none',
                  boxShadow: '0 2px 12px rgba(37,99,235,0.3)',
                  transition: 'background-color 0.2s, box-shadow 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1D4ED8';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(37,99,235,0.3)';
                }}
              >
                درخواست مشاوره ریمپ
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
              </Link>

              {/* دکمه ثانوی — charcoal outline */}
              <Link
                href="#services"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  height: '48px',
                  padding: '0 24px',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  color: '#16213E',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  border: '1.5px solid #C8CDD6',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s, background-color 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#16213E';
                  e.currentTarget.style.backgroundColor = '#F5F7FA';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#C8CDD6';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                مشاهده خدمات
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
              </Link>
            </div>

            {/* ── Trust Badges ── */}
            <div className="trust-badges">
              {TRUST_ITEMS.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 13px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    /* آبی خیلی کم‌رنگ — رنگ برند ECU */
                    backgroundColor: 'rgba(37,99,235,0.08)',
                    border: '1px solid rgba(37,99,235,0.18)',
                    color: '#1E3A6E',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <CheckCircle2 style={{ width: '13px', height: '13px', color: '#2563EB', flexShrink: 0 }} />
                  <span className="md:hidden">{item.short}</span>
                  <span className="hidden md:inline">{item.text}</span>
                </div>
              ))}
            </div>

          </div>

          {/* ── ستون چپ: تصویر (دسکتاپ) ── */}
          <div className="relative hidden lg:block">
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4 / 3',
                borderRadius: '14px',
                overflow: 'hidden',
                border: '1px solid #D8DCE3',
                backgroundColor: '#E8EBF0',
                boxShadow: '0 8px 32px rgba(22,33,62,0.12)',
              }}
            >
              <Image
                src="/images/hero.jpg"
                alt="تعمیر تخصصی ECU و برق خودرو"
                fill
                style={{ objectFit: 'cover' }}
                priority
                sizes="(max-width: 1200px) 50vw, 600px"
              />
              {/* Badge زنده */}
              <div
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(255,255,255,0.96)',
                  backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(216,220,227,0.9)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  className="pulse-dot"
                  style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22C55E' }}
                />
                <span style={{ fontSize: '11px', color: '#16213E', fontWeight: 700, letterSpacing: '-0.01em' }}>
                  آماده خدمت‌رسانی
                </span>
              </div>

              {/* overlay گرادیان پایین تصویر */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: '60px',
                background: 'linear-gradient(to top, rgba(22,33,62,0.15), transparent)',
              }} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
