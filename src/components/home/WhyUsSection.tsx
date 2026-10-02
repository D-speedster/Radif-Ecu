import React from 'react';
import { business } from '@/config/business';

const ITEMS = [
  { title: 'مشاوره قبل از اقدام', text: 'مشکل خودرو را قبل از هر کاری با شما بررسی می‌کنیم. تماس بگیرید یا در واتساپ پیام بدهید.' },
  { title: 'رزرو آنلاین نوبت', text: 'نوبت را آنلاین رزرو کنید و با کد پیگیری وضعیتش را ببینید.' },
  ...(business.experience ? [{ title: 'تجربه', text: business.experience }] : []),
  ...(business.warranty ? [{ title: 'ضمانت', text: business.warranty }] : []),
];

export default function WhyUsSection() {
  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8" style={{ color: 'var(--ink)' }}>
          چطور کار می‌کنیم
        </h2>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl">
          {ITEMS.map((it) => (
            <div key={it.title} className="pr-5" style={{ borderRight: '3px solid var(--amber)' }}>
              <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ink)' }}>{it.title}</h3>
              <p className="leading-8" style={{ color: 'var(--color-muted)' }}>{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
