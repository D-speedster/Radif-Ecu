import { Metadata } from 'next';
import BookingSuccess from '@/components/booking/BookingSuccess';

export const metadata: Metadata = {
  title: 'ثبت موفق نوبت | ردیف ایسیو',
  robots: {
    index: false,
    follow: false,
  },
};

export default function BookingSuccessPage() {
  return <BookingSuccess />;
}
