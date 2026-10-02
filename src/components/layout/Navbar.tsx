'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';
import { business, telHref } from '@/config/business';

const NAV_LINKS = [
  { href: '/', label: 'صفحه اصلی' },
  { href: '/remap', label: 'ریمپ ECU' },
  { href: '/repair-ecu', label: 'تعمیر ECU' },
  { href: '/wiki', label: 'دانشنامه' },
  { href: '/contact', label: 'تماس با ما' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-50"
      style={{ background: 'var(--ink)', borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: 'YekanBakh, sans-serif' }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <span
              className="inline-flex items-center justify-center w-9 h-9 rounded-md font-black text-sm"
              style={{ background: 'var(--amber)', color: 'var(--on-amber)' }}
              aria-hidden="true"
            >
              ECU
            </span>
            <span className="text-lg font-extrabold text-white">ردیف ایسیو</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium"
                  style={{
                    color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                    borderBottom: `2px solid ${active ? 'var(--amber)' : 'transparent'}`,
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href={telHref}
              className="mr-3 inline-flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-bold"
              style={{ background: 'var(--amber)', color: 'var(--on-amber)' }}
            >
              <Phone className="w-4 h-4" />
              {business.phoneDisplay}
            </a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-white"
            aria-label="باز و بسته کردن منو"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex flex-col pt-2">
              {[...NAV_LINKS, { href: '/booking', label: 'رزرو نوبت' }].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-2 py-3 text-base font-medium"
                  style={{
                    color: pathname === link.href ? 'var(--amber)' : 'rgba(255,255,255,0.8)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
