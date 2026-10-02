import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import Analytics from "@/components/analytics/Analytics";
import StickyContactBar from "@/components/layout/StickyContactBar";
import { business } from "@/config/business";


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || business.url),
  title: {
    default: 'ریمپ و تعمیر ECU خودرو در تهران | ردیف ایسیو',
    template: '%s | ردیف ایسیو',
  },
  description: 'تعمیرات تخصصی ECU، ریمپ، مالتی‌پلکس و دیاگ خودرو در تهران. تماس و رزرو نوبت آنلاین.',
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    siteName: business.name,
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
    telephone: `+98${business.phone.slice(1)}`,
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
  };

  return (
    <html lang="fa" dir="rtl">
      <head>
        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-bg text-text antialiased pb-16 md:pb-0">
        <AuthProvider>
          <Analytics />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <StickyContactBar />
        </AuthProvider>
      </body>
    </html>
  );
}
