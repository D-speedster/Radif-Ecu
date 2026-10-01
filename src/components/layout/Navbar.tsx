'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Wrench, Phone } from 'lucide-react';
import { telHref } from '@/config/business';

const NAV_LINKS = [
  { href: '/',        label: 'صفحه اصلی' },
  { href: '/remap',   label: 'ریمپ ECU' },
  { href: '/repair-ecu', label: 'تعمیر ECU' },
  { href: '/wiki',    label: 'دانشنامه' },
  { href: '/booking', label: 'رزرو نوبت' },
  { href: '/contact', label: 'تماس با ما' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        backgroundColor: '#16213E',
        borderBottom: '1px solid #1E2D4F',
        boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
        fontFamily: 'YekanBakh, sans-serif',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-[68px]">

          {/* ── لوگو (راست) ── */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
              style={{ backgroundColor: '#2563EB' }}
            >
              <Wrench className="w-5 h-5" style={{ color: '#FFFFFF' }} />
            </div>
            <span
              className="text-lg md:text-xl font-bold tracking-tight"
              style={{ color: '#FFFFFF', letterSpacing: '-0.01em' }}
            >
              ردیف ایسیو
            </span>
          </Link>

          {/* ── لینک‌های دسکتاپ (چپ) ── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    color:           active ? '#FFFFFF' : '#A8B4CC',
                    backgroundColor: active ? 'rgba(37,99,235,0.18)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.color = '#FFFFFF';
                    if (!active) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.color = '#A8B4CC';
                    if (!active) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* دکمه رزرو */}
            <Link
              href="/booking"
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all mr-2"
              style={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
            >
              رزرو نوبت
            </Link>
          </div>

          {/* ── همبرگر موبایل (چپ) ── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: '#E8ECF4' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* ── منوی موبایل ── */}
        {isOpen && (
          <div
            className="md:hidden py-3 pb-4"
            style={{ borderTop: '1px solid #1E2D4F' }}
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 rounded-lg text-sm font-medium transition-all text-right"
                    style={{
                      color:           active ? '#FFFFFF' : '#A8B4CC',
                      backgroundColor: active ? 'rgba(37,99,235,0.18)' : 'transparent',
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* اطلاعات تماس موبایل */}
              <div
                className="flex items-center justify-between mt-3 px-4 py-3 rounded-lg"
                style={{ backgroundColor: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)' }}
              >
                <a
                  href={telHref}
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: '#93C5FD' }}
                >
                  <Phone className="w-4 h-4" />
                  ۰۲۱-۱۲۳۴۵۶۷۸
                </a>
                <Link
                  href="/booking"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold"
                  style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                >
                  رزرو نوبت
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
