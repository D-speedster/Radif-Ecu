import type { Metadata } from "next";
import "./globals.css";
import { business } from "@/config/business";
import RootLayoutClient from "@/components/layout/RootLayoutClient";


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || business.url),
  title: {
    default: 'ردیف ایسیو - تعمیرات تخصصی ECU',
    template: '%s | ردیف ایسیو',
  },
  description: 'تعمیر، ریمپ و برنامه‌نویسی تخصصی ایسیوهای خودرو در تهران. خدمات: تعمیر سخت‌افزاری ECU، ریمپ و تیونینگ، رفع خطای شبکه CAN.',
  keywords: ['ECU', 'ریمپ', 'تعمیر ECU', 'تیونینگ', 'ایسیو', 'تعمیرات خودرو', 'تهران', 'ردیف ایسیو', 'مالتی‌پلکس', 'دیاگ', 'شبکه CAN'],
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: business.url,
    siteName: 'ردیف ایسیو',
    title: 'ردیف ایسیو - تعمیرات تخصصی ECU',
    description: 'تعمیر، ریمپ و برنامه‌نویسی تخصصی ایسیوهای خودرو در تهران. خدمات: تعمیر سخت‌افزاری ECU، ریمپ و تیونینگ، رفع خطای شبکه CAN.',
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
    title: 'ردیف ایسیو - تعمیرات تخصصی ECU',
    description: 'تعمیر، ریمپ و برنامه‌نویسی تخصصی ایسیوهای خودرو در تهران',
  },
  alternates: {
    canonical: business.url,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Schema Markup برای LocalBusiness
  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: business.name,
    description: 'تعمیرات تخصصی ECU، ریمپ، مالتی‌پلکس و دیاگ خودرو',
    url: business.url,
    telephone: `+98${business.phone.replace(/-/g, '')}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.street,
      addressLocality: business.city,
      addressRegion: business.city,
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
    priceRange: '$$',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'خدمات ردیف ایسیو',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'تعمیر سخت‌افزاری ECU',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'ریمپ و تیونینگ',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'رفع خطای شبکه CAN',
          },
        },
      ],
    },
  };

  return (
    <html lang="fa" dir="rtl">
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/YekanBakhFaNum-Bold-CMNT45Oa.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/YekanBakhFaNum-ExtraBold-CdMhak6a.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Preconnect to backend API */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'} />
        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-bg text-text antialiased">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
