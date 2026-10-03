import { Metadata } from 'next';
import BookingPage from '@/components/booking/BookingForm';
import { business } from '@/config/business';

export const metadata: Metadata = {
  title: 'رزرو نوبت آنلاین | تعمیر و ریمپ ECU',
  description: 'رزرو نوبت آنلاین برای تعمیر ECU، ریمپ و دیاگ خودرو در تهران. انتخاب تاریخ و ساعت دلخواه. دریافت کد پیگیری.',
  keywords: ['رزرو نوبت', 'نوبت آنلاین', 'تعمیر ECU', 'ریمپ خودرو', 'دیاگ خودرو', 'کد پیگیری'],
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: `${business.url}/booking`,
    siteName: 'ردیف ایسیو',
    title: 'رزرو نوبت آنلاین | تعمیر و ریمپ ECU',
    description: 'رزرو نوبت آنلاین برای تعمیر ECU، ریمپ و دیاگ خودرو.',
  },
  alternates: {
    canonical: '/booking',
  },
};

export default BookingPage;
