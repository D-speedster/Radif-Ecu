import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle } from 'lucide-react';
import { business, telHref, whatsappHref } from '@/config/business';
import EcuMap from './EcuMap';

const TRUST = [
  'پاسخ‌گویی در تلفن و واتساپ',
  'رزرو آنلاین نوبت',
  ...(business.experience ? [business.experience] : []),
  ...(business.warranty ? [business.warranty] : []),
];

export default function HeroSection() {
  return (
    <section style={{ background: 'var(--ink)', color: '#fff' }}>
      <div className="container mx-auto px-4 py-12 md:py-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.25] mb-5">
            ریمپ و تعمیر ECU
            <br />
            خودرو در {business.city}
          </h1>
          <p className="text-lg leading-8 mb-8 max-w-xl" style={{ color: 'rgba(255,255,255,0.72)' }}>
            ریمپ، تعمیر برد، پروگرام، مالتی‌پلکس و عیب‌یابی ECU. قبل از هر اقدام، مشکل خودرو را با شما بررسی می‌کنیم.
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            <a
              href={telHref}
              className="inline-flex items-center gap-2 px-6 h-12 rounded-lg font-bold text-base"
              style={{ background: 'var(--amber)', color: 'var(--on-amber)' }}
            >
              <Phone className="w-5 h-5" />
              تماس: {business.phoneDisplay}
            </a>
            <a
              href={whatsappHref('سلام، برای ریمپ / تعمیر ایسیو خودرو سؤال دارم.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 h-12 rounded-lg font-bold text-base"
              style={{ border: '1.5px solid rgba(255,255,255,0.35)', color: '#fff' }}
            >
              <MessageCircle className="w-5 h-5" />
              واتساپ
            </a>
            <Link
              href="/remap"
              className="inline-flex items-center px-3 h-12 font-medium underline underline-offset-8"
              style={{ color: 'var(--amber)' }}
            >
              درخواست مشاوره ریمپ
            </Link>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--amber)' }} />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden md:block">
          <EcuMap />
          <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {business.address} · {business.hoursShort}
          </p>
        </div>
      </div>
    </section>
  );
}
