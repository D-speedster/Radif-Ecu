import type { Metadata } from 'next';
import { remapContent } from '@/content/remap';
import { business } from '@/config/business';
import ServicePage from '@/components/ServicePage';

export const metadata: Metadata = {
  title: 'ریمپ ECU خودرو در تهران | افزایش قدرت و کاهش مصرف سوخت',
  description: 'ریمپ تخصصی ECU خودروهای ایرانی و خارجی در تهران. افزایش قدرت تا 40%، کاهش مصرف سوخت، تیونینگ Stage 1 و Stage 2. ضمانت 6 ماهه، مشاوره رایگان.',
  keywords: [
    'ریمپ ECU',
    'ریمپ خودرو',
    'چیپ تیونینگ',
    'افزایش قدرت موتور',
    'کاهش مصرف سوخت',
    'ریمپ پژو',
    'ریمپ سمند',
    'ریمپ تیبا',
    'ریمپ در تهران',
    'تیونینگ خودرو',
    'Stage 1 remap',
    'Stage 2 remap',
    'ECU tuning Tehran',
    'بهینه سازی ECU',
    'ریمپ حرفه ای',
  ],
  openGraph: {
    title: 'ریمپ ECU خودرو در تهران | ردیف ایسیو',
    description: 'ریمپ تخصصی ECU با افزایش قدرت و کاهش مصرف سوخت. ضمانت 6 ماهه. مشاوره رایگان.',
    url: `${business.url}/remap`,
    siteName: 'ردیف ایسیو',
    locale: 'fa_IR',
    type: 'website',
    images: [
      {
        url: `${business.url}/images/remap-ecu-service.jpg`,
        width: 1200,
        height: 630,
        alt: 'ریمپ ECU خودرو - ردیف ایسیو تهران',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ریمپ ECU خودرو در تهران | ردیف ایسیو',
    description: 'ریمپ تخصصی ECU با افزایش قدرت و کاهش مصرف سوخت',
  },
  alternates: { 
    canonical: '/remap',
  },
};

export default async function RemapPage() {
  // Schema Markup برای سرویس ریمپ
  const remapServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'ریمپ ECU خودرو',
    serviceType: 'ECU Remapping and Chip Tuning',
    description: 'ریمپ و تیونینگ تخصصی ECU خودروهای ایرانی و خارجی با استفاده از دستگاه‌های KESS و KTAG. افزایش قدرت تا 40 درصد، بهینه‌سازی مصرف سوخت و بهبود عملکرد موتور.',
    provider: {
      '@type': 'AutoRepair',
      name: business.name,
      url: business.url,
      telephone: `+98${business.phone.slice(1).replace(/-/g, '')}`,
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.street,
        addressLocality: business.city,
        addressCountry: 'IR',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          opens: business.opens,
          closes: business.closes,
        },
      ],
    },
    areaServed: {
      '@type': 'City',
      name: business.city,
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'IRR',
      },
    },
    additionalType: 'https://en.wikipedia.org/wiki/Engine_control_unit',
    category: 'Automotive ECU Programming and Tuning',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'سرویس‌های ریمپ ECU',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'ریمپ Stage 1',
            description: 'بهینه‌سازی نرم‌افزار ECU بدون تغییر قطعات فیزیکی',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'ریمپ Stage 2',
            description: 'ریمپ پیشرفته با ارتقای سیستم اگزوز و هوارسانی',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'ریمپ کاهش مصرف سوخت',
            description: 'تنظیم ECU برای بهینه‌سازی مصرف سوخت',
          },
        },
      ],
    },
    url: `${business.url}/remap`,
  };

  // FAQ Schema برای سوالات متداول
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ریمپ ECU چیست؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ریمپ یعنی تغییر نرم‌افزار اصلی ECU خودرو به صورت مستقیم. در این روش، فایل نرم‌افزاری اصلی خوانده شده، ویرایش می‌شود و دوباره به ECU نوشته می‌شود تا عملکرد موتور بهینه شود.',
        },
      },
      {
        '@type': 'Question',
        name: 'آیا ریمپ به موتور آسیب می‌رساند؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'خیر، ریمپ حرفه‌ای که با رعایت محدودیت‌های فنی موتور انجام شود، نه تنها آسیبی نمی‌رساند بلکه می‌تواند با بهینه‌سازی احتراق، عمر موتور را افزایش دهد.',
        },
      },
      {
        '@type': 'Question',
        name: 'چقدر قدرت موتور افزایش پیدا می‌کند؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'در خودروهای اتمسفریک حدود 5 تا 15 درصد و در خودروهای توربوشارژ 20 تا 40 درصد افزایش قدرت قابل حصول است.',
        },
      },
      {
        '@type': 'Question',
        name: 'آیا ریمپ قابل بازگشت است؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'بله، کاملاً قابل بازگشت است. فایل اورجینال پشتیبان‌گیری می‌شود و در صورت نیاز می‌توانید به حالت اولیه برگردید.',
        },
      },
    ],
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'خانه',
        item: business.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'ریمپ ECU',
        item: `${business.url}/remap`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(remapServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ServicePage
        h1="ریمپ ECU خودرو در تهران - افزایش قدرت و کاهش مصرف"
        intro="ریمپ ECU یعنی بهینه‌سازی نرم‌افزار کامپیوتر خودرو برای افزایش قدرت موتور، کاهش مصرف سوخت و بهبود عملکرد کلی. ما با استفاده از جدیدترین دستگاه‌ها و نرم‌افزارهای تخصصی، نقشه‌های ECU شما را به صورت ایمن و حرفه‌ای تنظیم می‌کنیم. تمامی ریمپ‌ها با پشتیبان‌گیری فایل اورجینال و ضمانت ۶ ماهه انجام می‌شود."
        schemaName="ریمپ ECU خودرو"
        schemaType="ECU remapping and chip tuning"
        whatsappText="سلام، برای ریمپ سؤال دارم. خودرو: "
        leadService="ریمپ ECU"
        leadTitle="درخواست مشاوره رایگان ریمپ"
        notRecommendedTitle="چه زمانی ریمپ توصیه نمی‌شود؟"
        content={remapContent}
      />
    </>
  );
}
