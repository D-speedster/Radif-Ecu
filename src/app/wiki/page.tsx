import { Metadata } from 'next';
import WikiList from '@/components/wiki/WikiList';
import { business } from '@/config/business';

export const metadata: Metadata = {
  title: 'دانشنامه ECU | آموزش و مقالات تخصصی',
  description: 'آموزش‌های تخصصی، نکات کاربردی و راهنمای کامل تعمیرات ECU، ریمپ، مالتی‌پلکس و دیاگ خودرو. مقالات رایگان ردیف ایسیو.',
  keywords: ['دانشنامه ECU', 'آموزش تعمیر ECU', 'مقالات خودرو', 'ریمپ ECU', 'دیاگ خودرو', 'آموزش ریمپ'],
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: `${business.url}/wiki`,
    siteName: 'ردیف ایسیو',
    title: 'دانشنامه ECU | آموزش و مقالات تخصصی',
    description: 'آموزش‌های تخصصی و مقالات کاربردی تعمیرات ECU.',
  },
  alternates: {
    canonical: '/wiki',
  },
};

export default function WikiPage() {
  return <WikiList />;
}
