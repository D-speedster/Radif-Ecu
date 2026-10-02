import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle } from 'lucide-react';
import { business, telHref, whatsappHref } from '@/config/business';

export default function CTASection() {
  return (
    <section style={{ background: 'var(--ink-2)', color: '#fff' }}>
      <div className="container mx-auto px-4 py-14 md:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2">مشکل خودرو را بگویید</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)' }}>{business.hours}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={telHref}
            className="inline-flex items-center gap-2 px-6 h-12 rounded-lg font-bold"
            style={{ background: 'var(--amber)', color: 'var(--on-amber)' }}
          >
            <Phone className="w-5 h-5" />
            {business.phoneDisplay}
          </a>
          <a
            href={whatsappHref('سلام، برای ریمپ / تعمیر ایسیو خودرو سؤال دارم.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 h-12 rounded-lg font-bold"
            style={{ border: '1.5px solid rgba(255,255,255,0.35)' }}
          >
            <MessageCircle className="w-5 h-5" />
            واتساپ
          </a>
          <Link
            href="/booking"
            className="inline-flex items-center px-4 h-12 font-medium underline underline-offset-8"
            style={{ color: 'var(--amber)' }}
          >
            رزرو نوبت
          </Link>
        </div>
      </div>
    </section>
  );
}
