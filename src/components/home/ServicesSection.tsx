import React from 'react';
import Card from '@/components/ui/Card';
import { Cpu, Cable, Search } from 'lucide-react';

export default function ServicesSection() {
  const services = [
    {
      id: 1,
      title: 'تعمیرات سخت‌افزار ECU',
      description: 'تعمیر و بازسازی برد الکترونیکی، تعویض قطعات آسیب‌دیده و رفع مشکلات سخت‌افزاری',
      icon: Cpu,
    },
    {
      id: 2,
      title: 'ریمپ و تیونینگ',
      description: 'افزایش قدرت موتور، کاهش مصرف سوخت و بهینه‌سازی عملکرد خودرو',
      icon: Search,
    },
    {
      id: 3,
      title: 'مالتی‌پلکس و دیاگ',
      description: 'عیب‌یابی تخصصی، خواندن و حذف کدهای خطا، برنامه‌نویسی ECU و کالیبراسیون',
      icon: Cable,
    },
  ];

  return (
    <section className="bg-[var(--color-bg)] py-16 md:py-20">
      <div className="container mx-auto px-4">
        {/* عنوان بخش */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#252525' }}>
            خدمات ما
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#545454' }}>
            تخصصی‌ترین خدمات ECU در یک مجموعه
          </p>
        </div>

        {/* کارت‌های خدمات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.id} hover className="text-center">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#252525' }}>
                  <Icon className="w-8 h-8" style={{ color: '#FFFFFF' }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#252525' }}>
                  {service.title}
                </h3>
                <p className="leading-relaxed" style={{ color: '#545454' }}>
                  {service.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
