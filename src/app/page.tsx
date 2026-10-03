import { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import ServicesGrid from '@/components/home/ServicesGrid';
import WhyUsSection from '@/components/home/WhyUsSection';
import LatestArticlesSection from '@/components/home/LatestArticlesSection';
import CTASection from '@/components/home/CTASection';
import { business } from '@/config/business';

export const metadata: Metadata = {
  title: 'ردیف ایسیو - تعمیر و ریمپ تخصصی ECU در تهران',
  description: 'تعمیر، ریمپ و برنامه‌نویسی تخصصی ایسیوهای خودرو در تهران. خدمات: تعمیر سخت‌افزاری ECU، ریمپ و تیونینگ، رفع خطای شبکه CAN. رزرو نوبت آنلاین و مشاوره رایگان.',
  keywords: ['ECU', 'ریمپ', 'تعمیر ECU', 'تیونینگ', 'ایسیو', 'تعمیرات خودرو', 'تهران', 'ردیف ایسیو', 'مالتی‌پلکس', 'دیاگ خودرو', 'برنامه‌نویسی ECU', 'شبکه CAN'],
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: business.url,
    siteName: 'ردیف ایسیو',
    title: 'ردیف ایسیو - تعمیر و ریمپ تخصصی ECU در تهران',
    description: 'تعمیر، ریمپ و برنامه‌نویسی تخصصی ایسیوهای خودرو در تهران. رزرو نوبت آنلاین و مشاوره رایگان.',
    images: [
      {
        url: `${business.url}/images/hero.jpg`,
        width: 1200,
        height: 630,
        alt: 'ردیف ایسیو - تعمیرات تخصصی ECU',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ردیف ایسیو - تعمیر و ریمپ تخصصی ECU در تهران',
    description: 'تعمیر، ریمپ و برنامه‌نویسی تخصصی ایسیوهای خودرو در تهران',
  },
  alternates: {
    canonical: business.url,
  },
};

export default function HomePage() {
  // LocalBusiness JSON-LD Schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: business.name,
    description: 'تعمیر، ریمپ و برنامه‌نویسی تخصصی ایسیوهای خودرو',
    url: business.url,
    telephone: `+98${business.phone.slice(1).replace(/-/g, '')}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.street,
      addressLocality: business.city,
      addressRegion: business.city,
      addressCountry: 'IR',
    },
    areaServed: {
      '@type': 'City',
      name: business.city,
    },
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: business.opens,
        closes: business.closes,
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'خدمات ردیف ایسیو',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'تعمیر سخت‌افزاری ECU',
            description: 'تعمیر قطعات الکترونیکی و سخت‌افزاری ایسیو خودرو',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'ریمپ و تیونینگ',
            description: 'بهینه‌سازی نرم‌افزار ECU برای افزایش قدرت و کاهش مصرف سوخت',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'رفع خطای شبکه CAN',
            description: 'عیب‌یابی و رفع مشکلات شبکه ارتباطی خودرو',
          },
        },
      ],
    },
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      
      <HeroSection />
      <ServicesGrid />
      <WhyUsSection />
      <LatestArticlesSection />
      <CTASection />
    </>
  );
}