import React from 'react';
import Link from 'next/link';
import { business, telHref } from '@/config/business';

const LINKS = [
  { href: '/remap', label: 'ریمپ ECU' },
  { href: '/repair-ecu', label: 'تعمیر ECU' },
  { href: '/wiki', label: 'دانشنامه ECU' },
  { href: '/booking', label: 'رزرو نوبت' },
  { href: '/contact', label: 'تماس با ما' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'rgba(255,255,255,0.7)', fontFamily: 'YekanBakh, sans-serif' }}>
      <div className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-10">
        <div>
          <p className="text-xl font-extrabold text-white mb-3">{business.name}</p>
          <p className="leading-8">ریمپ، تعمیر و عیب‌یابی ECU خودرو در {business.city}.</p>
        </div>

        <nav aria-label="دسترسی سریع">
          <p className="font-bold text-white mb-3">دسترسی سریع</p>
          <ul className="space-y-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-[var(--amber)] transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-bold text-white mb-3">تماس</p>
          <ul className="space-y-2">
            <li>
              <a href={telHref} className="hover:text-[var(--amber)] transition-colors" style={{ color: 'var(--amber)', fontWeight: 700 }}>
                {business.phoneDisplay}
              </a>
            </li>
            <li>{business.address}</li>
            <li>{business.hoursShort}</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 py-5 text-sm" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}>
        © {new Date().getFullYear()} {business.name}
      </div>
    </footer>
  );
}
