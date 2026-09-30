'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StepIndicator from '@/components/booking/StepIndicator';
import Step1PersonalInfo from '@/components/booking/Step1PersonalInfo';
import Step2DateTime from '@/components/booking/Step2DateTime';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface FormData {
  name: string;
  phone: string;
  carModel: string;
  serviceType: string;
  date: string;
  time: string;
  description: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  carModel?: string;
  serviceType?: string;
  date?: string;
  time?: string;
}

const steps = [
  { title: 'اطلاعات شخصی', description: 'نام، تلفن و نوع خدمت' },
  { title: 'تاریخ و ساعت', description: 'انتخاب زمان مراجعه' },
];

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    carModel: '',
    serviceType: '',
    date: '',
    time: '',
    description: '',
  });

  // پر کردن خودکار شماره تماس از URL
  useEffect(() => {
    const phoneFromUrl = searchParams.get('phone');
    if (phoneFromUrl) {
      setFormData(prev => ({ ...prev, phone: phoneFromUrl }));
    }
  }, [searchParams]);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // پاک کردن خطا وقتی کاربر تایپ می‌کنه
    if (errors[field as keyof FormErrors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  // Validation مرحله ۱
  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'نام و نام خانوادگی الزامی است';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'شماره تماس الزامی است';
    } else if (!/^09\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'شماره تماس معتبر نیست';
    }

    if (!formData.carModel.trim()) {
      newErrors.carModel = 'مدل خودرو الزامی است';
    }

    if (!formData.serviceType) {
      newErrors.serviceType = 'انتخاب نوع خدمت الزامی است';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validation مرحله ۲
  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.date) {
      newErrors.date = 'انتخاب تاریخ الزامی است';
    }

    if (!formData.time) {
      newErrors.time = 'انتخاب ساعت الزامی است';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // رفتن به مرحله بعد
  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      handleSubmit();
    }
  };

  // برگشت به مرحله قبل
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // ارسال فرم
  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const response = await api.post('/appointments', formData);
      const trackingCode = response.data.trackingCode || response.data.appointment?.trackingCode;
      
      // هدایت به صفحه نمایش کد پیگیری
      router.push(`/booking/success?code=${trackingCode}`);
    } catch (error: any) {
      console.error('خطا در ثبت نوبت:', error);
      alert(error.response?.data?.message || 'خطا در ثبت نوبت. لطفا دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 md:py-16" style={{ fontFamily: 'YekanBakh, sans-serif' }}>
      <div className="container mx-auto px-4">
        {/* هدر */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#252525' }}>
            رزرو نوبت آنلاین
          </h1>
          <p className="text-lg" style={{ color: '#545454' }}>
            فرم زیر را تکمیل کنید تا نوبت شما ثبت شود
          </p>
        </div>

        {/* فرم */}
        <div className="max-w-3xl mx-auto">
          <Card className="p-6 md:p-8">
            {/* Step Indicator */}
            <StepIndicator
              currentStep={currentStep}
              totalSteps={steps.length}
              steps={steps}
            />

            {/* محتوای هر مرحله */}
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
              {currentStep === 1 && (
                <Step1PersonalInfo
                  formData={formData}
                  errors={errors}
                  onChange={handleChange}
                />
              )}

              {currentStep === 2 && (
                <Step2DateTime
                  formData={formData}
                  errors={errors}
                  onChange={handleChange}
                />
              )}

              {/* دکمه‌ها */}
              <div className="flex gap-4 mt-8 pt-6" style={{ borderTop: '1px solid #E0E0E0' }}>
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={handleBack}
                    disabled={loading}
                    className="flex-1"
                  >
                    <ArrowRight className="w-5 h-5 ml-2" />
                    مرحله قبل
                  </Button>
                )}

                <Button
                  type="submit"
                  variant={currentStep === steps.length ? 'accent' : 'primary'}
                  size="lg"
                  disabled={loading}
                  className={currentStep === 1 ? 'flex-1 mr-auto' : 'flex-1'}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      در حال ثبت...
                    </>
                  ) : currentStep === steps.length ? (
                    'ثبت نوبت'
                  ) : (
                    <>
                      مرحله بعد
                      <ArrowLeft className="w-5 h-5 mr-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
