import type { Metadata } from 'next';
import { remapContent as c } from '@/content/remap';
import { business, telHref, whatsappHref } from '@/config/business';
import LeadForm from '@/components/LeadForm';

export const metadata: Metadata = {
  title: 'ریمپ ECU خودرو در تهران',
  description: `ریمپ ECU خودرو در ${business.city}، ${business.street}. مشاوره تلفنی و واتساپ، ${business.hoursShort}.`,
  alternates: { canonical: '/remap' },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'ریمپ ECU خودرو',
  serviceType: 'ECU remapping',
  areaServed: { '@type': 'City', name: business.city },
  provider: {
    '@type': 'AutoRepair',
    name: business.name,
    telephone: `+98${business.phone.slice(1)}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.street,
      addressLocality: business.city,
      addressCountry: 'IR',
    },
  },
};

const card = 'rounded-xl border border-[var(--color-border)] bg-white p-6';
const h2 = 'text-xl font-bold text-[var(--color-text)] mb-3';

export default function RemapPage() {
  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <header>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              ریمپ ECU خودرو در {business.city}
            </h1>
            <p className="text-[var(--color-muted)] text-lg leading-8">
              ریمپ یعنی اصلاح نقشه‌های نرم‌افزاری ECU (کامپیوتر خودرو) تا رفتار موتور مثل تزریق سوخت و زمان‌بندی جرقه
              تغییر کند. نتیجهٔ کار به مدل خودرو، ECU و وضعیت فنی موتور بستگی دارد، پس قبل از هر اقدام با شما
              مشورت می‌کنیم.
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <a
                href={telHref}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium bg-[var(--color-btn-primary)] text-[var(--color-btn-text)]"
              >
                تماس: {business.phoneDisplay}
              </a>
              <a
                href={whatsappHref('سلام، برای ریمپ سؤال دارم. خودرو: ')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium bg-green-600 text-white"
              >
                پیام در واتساپ
              </a>
            </div>
          </header>

          {c.vehicles.length > 0 && (
            <section className={card}>
              <h2 className={h2}>خودروهای تحت پوشش</h2>
              <ul className="space-y-2 text-[var(--color-text)]">
                {c.vehicles.map((v) => (
                  <li key={v.name}>
                    <strong>{v.name}</strong>
                    {v.note && <span className="text-[var(--color-muted)]"> — {v.note}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {c.steps.length > 0 && (
            <section className={card}>
              <h2 className={h2}>مراحل کار</h2>
              <ol className="space-y-3 list-decimal pr-5 text-[var(--color-text)]">
                {c.steps.map((s) => (
                  <li key={s.title}>
                    <strong>{s.title}:</strong> {s.text}
                  </li>
                ))}
              </ol>
              {c.duration && <p className="mt-4 text-[var(--color-muted)]">مدت انجام کار: {c.duration}</p>}
            </section>
          )}

          {c.price && (
            <section className={card}>
              <h2 className={h2}>هزینه</h2>
              <p className="text-[var(--color-text)] leading-8">{c.price}</p>
            </section>
          )}

          {c.warranty && (
            <section className={card}>
              <h2 className={h2}>ضمانت</h2>
              <p className="text-[var(--color-text)] leading-8">{c.warranty}</p>
            </section>
          )}

          {c.notRecommended.length > 0 && (
            <section className={card}>
              <h2 className={h2}>چه زمانی ریمپ توصیه نمی‌شود؟</h2>
              <ul className="list-disc pr-5 space-y-1 text-[var(--color-text)]">
                {c.notRecommended.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </section>
          )}

          {c.faq.length > 0 && (
            <section className={card}>
              <h2 className={h2}>پرسش‌های متداول</h2>
              <div className="space-y-4">
                {c.faq.map((f) => (
                  <div key={f.q}>
                    <h3 className="font-bold text-[var(--color-text)] mb-1">{f.q}</h3>
                    <p className="text-[var(--color-muted)] leading-8">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className={card}>
            <h2 className={h2}>آدرس و ساعت کار</h2>
            <p className="text-[var(--color-text)]">{business.address}</p>
            <p className="text-[var(--color-muted)] mt-1">{business.hours}</p>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <LeadForm service="ریمپ ECU" title="درخواست مشاوره ریمپ" />
          </div>
        </aside>
      </div>
    </div>
  );
}
