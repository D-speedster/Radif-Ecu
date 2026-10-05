import type { Metadata } from 'next';
import { repairEcuContent } from '@/content/repair-ecu';
import { business } from '@/config/business';
import ServicePage from '@/components/ServicePage';

export const metadata: Metadata = {
  title: 'تعمیر ECU خودرو در تهران | تعمیرات تخصصی کامپیوتر خودرو',
  description: 'تعمیر تخصصی ECU خودروهای ایرانی و خارجی در تهران. رفع خرابی سخت‌افزاری و نرم‌افزاری، تعویض قطعات، برنامه‌نویسی ECU. ضمانت 3 ماهه، مشاوره رایگان.',
  keywords: [
    'تعمیر ECU',
    'تعمیر کامپیوتر خودرو',
    'تعمیر ایسیو',
    'تعمیر ECU پژو',
    'تعمیر ECU سمند',
    'تعمیر ECU پراید',
    'برنامه نویسی ECU',
    'تعویض ECU',
    'خرابی ECU',
    'چراغ چک',
    'تعمیر ECU در تهران',
    'ECU repair Tehran',
    'تعمیرگاه ECU',
    'بازیابی ECU',
  ],
  openGraph: {
    title: 'تعمیر ECU خودرو در تهران | ردیف ایسیو',
    description: 'تعمیر تخصصی ECU با ضمانت 3 ماهه. رفع خرابی سخت‌افزاری و نرم‌افزاری، تعویض قطعات معیوب.',
    url: `${business.url}/repair-ecu`,
    siteName: 'ردیف ایسیو',
    locale: 'fa_IR',
    type: 'website',
    images: [
      {
        url: `${business.url}/images/ecu-repair-service.jpg`,
        width: 1200,
        height: 630,
        alt: 'تعمیر ECU خودرو - ردیف ایسیو تهران',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'تعمیر ECU خودرو در تهران | ردیف ایسیو',
    description: 'تعمیر تخصصی ECU با ضمانت 3 ماهه',
  },
  alternates: { 
    canonical: '/repair-ecu',
  },
};

export default async function RepairEcuPage() {
  // Schema Markup برای سرویس تعمیر ECU
  const repairServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'تعمیر ECU خودرو',
    serviceType: 'Automotive ECU Repair and Programming',
    description: 'تعمیر سخت‌افزاری و نرم‌افزاری ECU خودروهای ایرانی و خارجی. رفع خرابی مدارات الکترونیکی، تعویض قطعات معیوب، برنامه‌نویسی و بازیابی ECU.',
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
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'خدمات تعمیر ECU',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'تعمیر سخت‌افزاری ECU',
            description: 'تعویض قطعات الکترونیکی معیوب و ترمیم مدارات',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'بازیابی و برنامه‌نویسی ECU',
            description: 'بازنویسی فایل نرم‌افزاری و رفع خطاهای نرم‌افزاری',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'تست و عیب‌یابی ECU',
            description: 'دیاگ و تست ECU با دستگاه‌های تخصصی',
          },
        },
      ],
    },
    url: `${business.url}/repair-ecu`,
  };

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'چطور بفهمم ECU خودرو من خراب است؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'علائم معمول خرابی ECU شامل روشن نشدن خودرو، چراغ چک روشن، قطع ناگهانی موتور، عملکرد نامنظم و عدم پاسخ پدال گاز است.',
        },
      },
      {
        '@type': 'Question',
        name: 'آیا بهتر است ECU تعمیر شود یا تعویض شود؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'اگر هزینه تعمیر کمتر از 50 درصد قیمت ECU نو باشد و خرابی قابل حل باشد، تعمیر بهتر است.',
        },
      },
      {
        '@type': 'Question',
        name: 'چرا ECU خراب می‌شود؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'علل رایج: نفوذ رطوبت، ولتاژ نامناسب باتری، اتصالی در سیستم برق، گرمای بیش از حد و عمر مفید قطعات.',
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
        name: 'تعمیر ECU',
        item: `${business.url}/repair-ecu`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(repairServiceSchema) }}
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
        h1="تعمیر ECU خودرو در تهران - تعمیرات تخصصی کامپیوتر خودرو"
        intro="ECU (واحد کنترل الکترونیکی) مغز خودروی شماست که تمامی عملکرد موتور را کنترل می‌کند. خرابی ECU می‌تواند باعث روشن نشدن خودرو، چراغ چک روشن، عملکرد نامنظم موتور یا قطع ناگهانی شود. ما با تجربه چندین ساله و تجهیزات تخصصی، ECU خودروی شما را تعمیر و به حالت اولیه برمی‌گردانیم."
        schemaName="تعمیر ECU خودرو"
        schemaType="Automotive ECU repair and programming"
        whatsappText="سلام، برای تعمیر ECU سؤال دارم. خودرو: "
        leadService="تعمیر ECU"
        leadTitle="درخواست بررسی و تعمیر ECU"
        notRecommendedTitle="چه مواردی قابل تعمیر نیست؟"
        content={repairEcuContent}
      />
    </>
  );
}
