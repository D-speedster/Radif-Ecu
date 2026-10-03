import { Metadata } from 'next';
import TrackAppointment from '@/components/booking/TrackAppointment';

export const metadata: Metadata = {
  title: 'پیگیری نوبت | ردیف ایسیو',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TrackAppointmentPage() {
  return <TrackAppointment />;
}
