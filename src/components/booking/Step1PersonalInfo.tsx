import React from 'react';
import Input from '@/components/ui/Input';
import { User, Phone, Car, Wrench } from 'lucide-react';

interface Step1Props {
  formData: {
    name: string;
    phone: string;
    carModel: string;
    serviceType: string;
  };
  errors: {
    name?: string;
    phone?: string;
    carModel?: string;
    serviceType?: string;
  };
  onChange: (field: string, value: string) => void;
}

const serviceTypes = [
  { value: 'hardware', label: 'تعمیرات سخت‌افزار ECU', icon: '🔧' },
  { value: 'remap', label: 'ریمپ و تیونینگ', icon: '⚡' },
  { value: 'multiplex', label: 'مالتی‌پلکس و دیاگ', icon: '🔌' },
  { value: 'dump', label: 'خواندن و نوشتن فایل دامپ', icon: '💾' },
];

export default function Step1PersonalInfo({ formData, errors, onChange }: Step1Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#252525' }}>
          اطلاعات شخصی
        </h2>
        <p style={{ color: '#545454' }}>
          لطفا اطلاعات خود و نوع خدمت مورد نیاز را وارد کنید
        </p>
      </div>

      {/* نام و نام خانوادگی */}
      <div>
        <Input
          label="نام و نام خانوادگی"
          name="name"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="محمد احمدی"
          error={errors.name}
          className="text-right"
        />
        <div className="flex items-center gap-2 mt-2 text-sm" style={{ color: '#7D7D7D' }}>
          <User className="w-4 h-4" />
          <span>نام کامل خود را وارد کنید</span>
        </div>
      </div>

      {/* شماره تماس */}
      <div>
        <Input
          label="شماره تماس"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="۰۹۱۲-۳۴۵-۶۷۸۹"
          error={errors.phone}
          className="text-left"
          dir="ltr"
        />
        <div className="flex items-center gap-2 mt-2 text-sm" style={{ color: '#7D7D7D' }}>
          <Phone className="w-4 h-4" />
          <span>شماره تماس جهت هماهنگی</span>
        </div>
      </div>

      {/* مدل خودرو */}
      <div>
        <Input
          label="مدل خودرو"
          name="carModel"
          value={formData.carModel}
          onChange={(e) => onChange('carModel', e.target.value)}
          placeholder="پژو ۲۰۶"
          error={errors.carModel}
          className="text-right"
        />
        <div className="flex items-center gap-2 mt-2 text-sm" style={{ color: '#7D7D7D' }}>
          <Car className="w-4 h-4" />
          <span>مثال: پژو ۲۰۶، پراید، سمند</span>
        </div>
      </div>

      {/* نوع خدمت */}
      <div>
        <label className="block text-sm font-medium mb-3" style={{ color: '#252525' }}>
          نوع خدمت مورد نیاز
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {serviceTypes.map((service) => (
            <button
              key={service.value}
              type="button"
              onClick={() => onChange('serviceType', service.value)}
              className="flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-right"
              style={{
                backgroundColor: formData.serviceType === service.value ? '#F5F5F5' : '#FFFFFF',
                borderColor: formData.serviceType === service.value ? '#252525' : '#E0E0E0',
                color: '#252525'
              }}
              onMouseEnter={(e) => {
                if (formData.serviceType !== service.value) {
                  e.currentTarget.style.borderColor = '#CFCFCF';
                }
              }}
              onMouseLeave={(e) => {
                if (formData.serviceType !== service.value) {
                  e.currentTarget.style.borderColor = '#E0E0E0';
                }
              }}
            >
              <span className="text-2xl">{service.icon}</span>
              <span className="font-medium">{service.label}</span>
            </button>
          ))}
        </div>
        {errors.serviceType && (
          <p className="mt-2 text-sm text-red-500">{errors.serviceType}</p>
        )}
        <div className="flex items-center gap-2 mt-3 text-sm" style={{ color: '#7D7D7D' }}>
          <Wrench className="w-4 h-4" />
          <span>یک خدمت انتخاب کنید</span>
        </div>
      </div>
    </div>
  );
}
