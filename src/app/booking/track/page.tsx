'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { Search, Calendar, Clock, Car, Wrench, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toJalali } from '@/lib/utils';
import { business, telHref } from '@/config/business';

interface Appointment {
  _id: string;
  name: string;
  phone: string;
  carModel: string;
  serviceType: string;
  date: string;
  timeSlot: string;
  notes?: string;
  trackingCode: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: string;
}

const statusConfig = {
  Pending: { label: 'در انتظار تأیید', color: 'bg-yellow-500', icon: AlertCircle },
  'In Progress': { label: 'در حال انجام', color: 'bg-blue-500', icon: Loader2 },
  Completed: { label: 'انجام شده', color: 'bg-green-500', icon: CheckCircle },
};

const serviceTypeLabels: Record<string, string> = {
  hardware: 'تعمیرات سخت‌افزار ECU',
  remap: 'ریمپ و تیونینگ',
  network: 'مالتی‌پلکس، دیاگ و عیب‌یابی',
};

function TrackAppointmentContent() {
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get('code') || '';

  const [trackingCode, setTrackingCode] = useState(codeFromUrl);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // اگر کد در URL بود، خودکار جستجو کن
  useEffect(() => {
    if (codeFromUrl) {
      handleSearch(codeFromUrl);
    }
  }, [codeFromUrl]);

  const handleSearch = async (code?: string) => {
    const searchCode = code || trackingCode;
    
    if (!searchCode.trim()) {
      setError('لطفا کد پیگیری را وارد کنید');
      return;
    }

    setLoading(true);
    setError('');
    setAppointment(null);

    try {
      const response = await api.get(`/appointments/track/${searchCode}`);
      setAppointment(response.data.appointment || response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'نوبتی با این کد پیگیری یافت نشد');
    } finally {
      setLoading(false);
    }
  };

  const StatusIcon = appointment ? statusConfig[appointment.status].icon : AlertCircle;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* هدر */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
            پیگیری نوبت
          </h1>
          <p className="text-gray-400 text-lg">
            با وارد کردن کد پیگیری، وضعیت نوبت خود را مشاهده کنید
          </p>
        </div>

        {/* فرم جستجو */}
        <div className="max-w-2xl mx-auto mb-8">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="کد پیگیری را وارد کنید"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="text-center font-mono text-lg"
                />
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleSearch()}
                disabled={loading}
                className="sm:w-auto"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5 ml-2" />
                    جستجو
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* خطا */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* نمایش اطلاعات نوبت */}
        {appointment && (
          <div className="max-w-3xl mx-auto">
            <Card className="p-6 md:p-8">
              {/* وضعیت */}
              <div className="text-center mb-8">
                <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${statusConfig[appointment.status].color} bg-opacity-20 border-2 border-current mb-4`}>
                  <StatusIcon className={`w-6 h-6 ${statusConfig[appointment.status].color.replace('bg-', 'text-')}`} />
                  <span className={`font-bold text-lg ${statusConfig[appointment.status].color.replace('bg-', 'text-')}`}>
                    {statusConfig[appointment.status].label}
                  </span>
                </div>
                <p className="text-gray-400">کد پیگیری: <span className="text-[var(--color-text)] font-mono">{appointment.trackingCode}</span></p>
              </div>

              {/* جزئیات */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[var(--color-bg)] rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Car className="w-5 h-5" />
                    <span className="text-sm">اطلاعات خودرو</span>
                  </div>
                  <p className="text-[var(--color-text)] font-medium">{appointment.carModel}</p>
                </div>

                <div className="bg-[var(--color-bg)] rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Wrench className="w-5 h-5" />
                    <span className="text-sm">نوع خدمت</span>
                  </div>
                  <p className="text-[var(--color-text)] font-medium">
                    {serviceTypeLabels[appointment.serviceType] || appointment.serviceType}
                  </p>
                </div>

                <div className="bg-[var(--color-bg)] rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm">تاریخ</span>
                  </div>
                  <p className="text-[var(--color-text)] font-medium">{toJalali(appointment.date)}</p>
                </div>

                <div className="bg-[var(--color-bg)] rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm">ساعت</span>
                  </div>
                  <p className="text-[var(--color-text)] font-medium">{appointment.timeSlot}</p>
                </div>
              </div>

              {/* توضیحات */}
              {appointment.notes && (
                <div className="mt-6 bg-[var(--color-bg)] rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2">توضیحات:</p>
                  <p className="text-[var(--color-text)]">{appointment.notes}</p>
                </div>
              )}

              {/* اطلاعات تماس */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-center text-gray-400 mb-4">
                  برای تغییر یا لغو نوبت، با ما تماس بگیرید:
                </p>
                <div className="text-center">
                  <a href={telHref}>
                    <Button variant="secondary" size="lg">
                      {business.phoneDisplay}
                    </Button>
                  </a>
                </div>
              </div>
            </Card>

            {/* دکمه بازگشت */}
            <div className="text-center mt-6">
              <Link href="/">
                <Button variant="secondary" size="md">
                  بازگشت به صفحه اصلی
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export default function TrackAppointmentPage() {
  return (
    <Suspense fallback={null}>
      <TrackAppointmentContent />
    </Suspense>
  );
}
