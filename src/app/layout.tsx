import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";

// استفاده از فونت Vazirmatn از CDN
// در production بهتر است فونت‌ها را لوکال هاست کنید

export const metadata: Metadata = {
  title: "ردیف ایسیو | تعمیرات تخصصی ECU خودرو",
  description: "تعمیرات تخصصی ECU، ریمپ، مالتی‌پلکس و دیاگ خودرو در تهران",
  keywords: "تعمیرات ECU، ریمپ خودرو، مالتی‌پلکس، دیاگ خودرو، تعمیرگاه تخصصی ECU",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Schema Markup برای LocalBusiness
  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'ردیف ایسیو',
    description: 'تعمیرات تخصصی ECU، ریمپ، مالتی‌پلکس و دیاگ خودرو',
    url: 'https://radif-ecu.ir',
    telephone: '+98-21-12345678',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'خیابان ولیعصر',
      addressLocality: 'تهران',
      addressRegion: 'تهران',
      addressCountry: 'IR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 35.6892,
      longitude: 51.3890,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    priceRange: '$$',
    image: 'https://radif-ecu.ir/logo.png',
  };

  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
          rel="stylesheet"
        />
        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-bg text-text antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
