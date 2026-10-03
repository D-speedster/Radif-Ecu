import type { Metadata } from 'next';
import { remapContent } from '@/content/remap';
import { business } from '@/config/business';
import ServicePage from '@/components/ServicePage';

export const metadata: Metadata = {
  title: 'ریمپ ECU خودرو در تهران',
  description: `ریمپ ECU خودرو در ${business.city}، ${business.street}. مشاوره تلفنی و واتساپ، ${business.hoursShort}.`,
  alternates: { canonical: '/remap' },
};

export default async function RemapPage() {
  const remapServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'ریمپ ECU خودرو',
    serviceType: 'ECU remapping',
    description: 'بهینه‌سازی نرم‌افزار ECU خودرو برای افزایش عملکرد و کاهش مصرف سوخت در تهران',
    provider: {
      '@type': 'AutoRepair',
      name: business.name,
      url: business.url,
      telephone: `+98${business.phone.slice(1).replace(/-/g, '')}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.street,
        addressLocality: business.city,
        addressCountry: 'IR',
      },
    },
    areaServed: {
      '@type': 'City',
      name: business.city,
    },
    url: `${business.url}/remap`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(remapServiceSchema) }}
      />
      <ServicePage
        h1={`ریمپ ECU خودرو در ${business.city}`}
        intro="ریمپ یعنی اصلاح نقشه‌های نرم‌افزاری ECU (کامپیوتر خودرو) تا رفتار موتور مثل تزریق سوخت و زمان‌بندی جرقه تغییر کند. نتیجه به مدل خودرو، ECU و وضعیت فنی موتور بستگی دارد، پس قبل از هر اقدام با شما مشورت می‌کنیم."
        schemaName="ریمپ ECU خودرو"
        schemaType="ECU remapping"
        whatsappText="سلام، برای ریمپ سؤال دارم. خودرو: "
        leadService="ریمپ ECU"
        leadTitle="درخواست مشاوره ریمپ"
        notRecommendedTitle="چه زمانی ریمپ توصیه نمی‌شود؟"
        content={remapContent}
      />
    </>
  );
}
