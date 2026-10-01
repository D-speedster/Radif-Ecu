import type { Metadata } from 'next';
import { repairEcuContent } from '@/content/repair-ecu';
import { business } from '@/config/business';
import ServicePage from '@/components/ServicePage';

export const metadata: Metadata = {
  title: 'تعمیر ECU خودرو در تهران',
  description: `تعمیر ECU خودرو در ${business.city}، ${business.street}. مشاوره تلفنی و واتساپ، ${business.hoursShort}.`,
  alternates: { canonical: '/repair-ecu' },
};

export default function RepairEcuPage() {
  return (
    <ServicePage
      h1={`تعمیر ECU خودرو در ${business.city}`}
      intro="ECU کامپیوتر مرکزی موتور است و خرابی آن می‌تواند علائمی مثل روشن‌نشدن خودرو، چراغ چک یا عملکرد نامنظم موتور ایجاد کند. برای بررسی مشکل خودرو خود تماس بگیرید یا در واتساپ پیام بدهید."
      schemaName="تعمیر ECU خودرو"
      schemaType="ECU repair"
      whatsappText="سلام، برای تعمیر ECU سؤال دارم. خودرو: "
      leadService="تعمیر ECU"
      leadTitle="درخواست بررسی ECU"
      notRecommendedTitle="چه مواردی قابل تعمیر نیست؟"
      content={repairEcuContent}
    />
  );
}
