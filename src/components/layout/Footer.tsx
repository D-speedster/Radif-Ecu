import React from 'react';
import Link from 'next/link';
import { Wrench, Phone, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { business, telHref } from '@/config/business';

const QUICK_LINKS = [
  { href: '/',         label: 'صفحه اصلی' },
  { href: '#services', label: 'خدمات ما' },
  { href: '/wiki',     label: 'دانشنامه ECU' },
  { href: '/booking',  label: 'رزرو نوبت' },
  { href: '/contact',  label: 'تماس با ما' },
];

const CONTACT_ITEMS = [
  { icon: Phone,  text: business.phoneDisplay,             href: telHref },
  { icon: MapPin, text: business.address,        href: null },
  { icon: Clock,  text: business.hoursShort,   href: null },
];

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#0F172A',
        borderTop: '1px solid #1E293B',
        fontFamily: 'YekanBakh, sans-serif',
      }}
    >
      {/* ── بدنه اصلی ── */}
      <div className="container mx-auto" style={{ padding: '52px 20px 36px' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* ── ستون ۱: برند + شعار ── */}
          <div>
            {/* لوگو */}
            <div className="flex items-center gap-2.5" style={{ marginBottom: '14px' }}>
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '36px', height: '36px', borderRadius: '9px',
                  backgroundColor: '#2563EB',
                  flexShrink: 0,
                }}
              >
                <Wrench style={{ width: '18px', height: '18px', color: '#FFFFFF' }} />
              </div>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                ردیف ایسیو
              </span>
            </div>

            {/* شعار */}
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#2563EB', marginBottom: '10px', lineHeight: 1.4 }}>
              تخصص ما، قدرت خودروی شما
            </p>

            {/* توضیح */}
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.75', marginBottom: '20px' }}>
              تعمیرات ECU، ریمپ، مالتی‌پلکس و دیاگ خودرو در تهران
            </p>

            {/* CTA کوچک */}
            <Link
              href="/booking"
              className="footer-cta-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                borderRadius: '8px',
                backgroundColor: 'rgba(37,99,235,0.12)',
                border: '1px solid rgba(37,99,235,0.25)',
                color: '#93C5FD',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background-color 0.2s',
              }}
            >
              رزرو نوبت آنلاین
              <ArrowLeft style={{ width: '14px', height: '14px' }} />
            </Link>
          </div>

          {/* ── ستون ۲: دسترسی سریع ── */}
          <div>
            <h4
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#475569',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '18px',
              }}
            >
              دسترسی سریع
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="footer-link"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      fontSize: '13.5px',
                      color: '#8A97B0',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                  >
                    <span
                      style={{
                        width: '4px', height: '4px', borderRadius: '50%',
                        backgroundColor: '#2563EB', flexShrink: 0,
                        opacity: 0.7,
                      }}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── ستون ۳: اطلاعات تماس ── */}
          <div>
            <h4
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#475569',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '18px',
              }}
            >
              اطلاعات تماس
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {CONTACT_ITEMS.map((item, i) => {
                const Icon = item.icon;
                const inner = (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '30px', height: '30px', borderRadius: '8px',
                        backgroundColor: 'rgba(37,99,235,0.1)',
                        flexShrink: 0, marginTop: '1px',
                      }}
                    >
                      <Icon style={{ width: '14px', height: '14px', color: '#2563EB' }} />
                    </div>
                    <span style={{ fontSize: '13.5px', color: '#8A97B0', lineHeight: '1.5' }}>
                      {item.text}
                    </span>
                  </div>
                );

                return (
                  <li key={i}>
                    {item.href ? (
                      <a href={item.href} className="footer-link" style={{ textDecoration: 'none' }}>
                        {inner}
                      </a>
                    ) : inner}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* ── خط کپی‌رایت ── */}
      <div
        style={{ borderTop: '1px solid #1E293B' }}
      >
        <div
          className="container mx-auto"
          style={{ padding: '16px 20px' }}
        >
          <div
            className="flex flex-col sm:flex-row items-center justify-between"
            style={{ gap: '8px' }}
          >
            <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
              © {new Date().getFullYear()} ردیف ایسیو — تمامی حقوق محفوظ است.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                className="pulse-dot"
                style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22C55E' }}
              />
              <span style={{ fontSize: '12px', color: '#475569' }}>سرویس آنلاین فعال</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
