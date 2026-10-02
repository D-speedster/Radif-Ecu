import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const MAIN = [
  {
    title: 'ریمپ ECU',
    href: '/remap',
    text: 'اصلاح نقشه‌های نرم‌افزاری ECU متناسب با خودرو. قبل از اقدام، با شما مشورت می‌کنیم.',
    dark: true,
  },
  {
    title: 'تعمیر ECU',
    href: '/repair-ecu',
    text: 'بررسی و تعمیر ECU وقتی خودرو روشن نمی‌شود، چراغ چک روشن است یا موتور نامنظم کار می‌کند.',
    dark: false,
  },
];

const MORE = [
  { title: 'دیاگ و عیب‌یابی', href: '/booking', text: 'خواندن خطاها و پیداکردن علت چراغ‌های هشدار.' },
  { title: 'مالتی‌پلکس', href: '/booking', text: 'بررسی مشکل ارتباط بین ماژول‌های برقی خودرو.' },
];

export default function ServicesGrid() {
  return (
    <section id="services" className="py-14 md:py-20" style={{ background: 'var(--color-bg)' }}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8" style={{ color: 'var(--ink)' }}>
          خدمات
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {MAIN.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="group flex flex-col justify-between rounded-2xl p-7 md:p-9 min-h-[220px]"
              style={
                s.dark
                  ? { background: 'var(--ink)', color: '#fff' }
                  : { background: '#fff', color: 'var(--ink)', border: '1px solid var(--steel)' }
              }
            >
              <div>
                <h3 className="text-2xl font-extrabold mb-3">{s.title}</h3>
                <p className="leading-8 max-w-md" style={{ opacity: s.dark ? 0.72 : 0.7 }}>
                  {s.text}
                </p>
              </div>
              <span
                className="mt-6 inline-flex items-center gap-2 font-bold"
                style={{ color: s.dark ? 'var(--amber)' : 'var(--color-accent)' }}
              >
                جزئیات و درخواست مشاوره
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        <div className="rounded-2xl bg-white" style={{ border: '1px solid var(--steel)' }}>
          {MORE.map((s, i) => (
            <Link
              key={s.title}
              href={s.href}
              className="flex items-center justify-between gap-4 px-6 md:px-8 py-5 hover:bg-[var(--color-bg)] transition-colors"
              style={{ borderTop: i ? '1px solid var(--steel)' : 'none', color: 'var(--ink)' }}
            >
              <div>
                <h3 className="text-lg font-bold">{s.title}</h3>
                <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>{s.text}</p>
              </div>
              <span className="shrink-0 font-medium text-sm" style={{ color: 'var(--color-accent)' }}>رزرو نوبت</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
