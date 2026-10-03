import { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';
import { business } from '@/config/business';

export const metadata: Metadata = {
  title: 'تماس با ما | مشاوره رایگان تعمیر و ریمپ ECU',
  description: `با ردیف ایسیو تماس بگیرید. آدرس: ${business.address}، تلفن: ${business.phoneDisplay}. ساعت کاری: ${business.hours}. مشاوره رایگان.`,
  keywords: ['تماس با ما', 'مشاوره ECU', 'آدرس ردیف ایسیو', 'تلفن تعمیر ECU', 'تماس تعمیرگاه ECU'],
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: `${business.url}/contact`,
    siteName: 'ردیف ایسیو',
    title: 'تماس با ما | مشاوره رایگان تعمیر و ریمپ ECU',
    description: 'با ردیف ایسیو تماس بگیرید. مشاوره رایگان برای تعمیر و ریمپ ECU.',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
