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
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  // Mark component as mounted on client side
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
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
                <span dir="ltr">{business.phoneDisplay}</span>
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
        </div>
      </nav>

      {/* Overlay - Only render on client after mount */}
      {isMounted && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          style={{ zIndex: 999 }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Offcanvas Menu - Only render on client after mount */}
      {isMounted && (
        <div
          className={`fixed top-0 right-0 h-full w-80 md:hidden transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ background: 'var(--ink)', borderLeft: '1px solid rgba(255,255,255,0.08)', zIndex: 1000 }}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span
                  className="inline-flex items-center justify-center w-9 h-9 rounded-md font-black text-sm"
                  style={{ background: 'var(--amber)', color: 'var(--on-amber)' }}
                >
                  ECU
                </span>
                <span className="text-lg font-extrabold text-white">ردیف ایسیو</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-white hover:bg-white/10"
                aria-label="بستن منو"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col p-4">
                {[...NAV_LINKS, { href: '/booking', label: 'رزرو نوبت' }].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 text-base font-medium rounded-lg mb-1 transition-colors"
                    style={{
                      color: pathname === link.href ? 'var(--amber)' : 'rgba(255,255,255,0.8)',
                      background: pathname === link.href ? 'rgba(255,193,7,0.1)' : 'transparent',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer with Phone */}
            <div className="p-4 border-t border-white/10">
              <a
                href={telHref}
                className="w-full inline-flex items-center justify-center gap-2 px-4 h-12 rounded-lg text-base font-bold"
                style={{ background: 'var(--amber)', color: 'var(--on-amber)' }}
              >
                <Phone className="w-5 h-5" />
                <span dir="ltr">{business.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
