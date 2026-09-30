'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Phone, Calendar, ArrowLeft, Loader2 } from 'lucide-react';

export default function QuickBookingForm() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuickBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation ساده
    if (!phone.trim()) {
      setError('لطفا شماره تماس را وارد کنید');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!/^09\d{9}$/.test(cleanPhone)) {
      setError('شماره تماس معتبر نیست');
      return;
    }

    // هدایت به صفحه رزرو کامل با شماره تماس
    router.push(`/booking?phone=${encodeURIComponent(phone)}`);
  };

  return (
    <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-md border border-blue-500/30 rounded-2xl p-6 md:p-8 shadow-2xl">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full mb-4">
          <Calendar className="w-5 h-5 text-blue-400" />
          <span className="text-blue-300 font-medium">رزرو سریع</span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#252525' }}>
          نوبت خود را رزرو کنید
        </h3>
        <p className="text-sm" style={{ color: '#545454' }}>
          فقط با یک شماره تماس، رزرو آنلاین انجام دهید
        </p>
      </div>

      <form onSubmit={handleQuickBooking} className="space-y-4">
        <div>
          <Input
            type="tel"
            placeholder="۰۹۱۲-۳۴۵-۶۷۸۹"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError('');
            }}
            error={error}
            className="text-center text-lg"
            dir="ltr"
          />
          <div className="flex items-center justify-center gap-2 mt-2 text-sm" style={{ color: '#7D7D7D' }}>
            <Phone className="w-4 h-4" />
            <span>شماره تماس خود را وارد کنید</span>
          </div>
        </div>

        <Button
          type="submit"
          variant="accent"
          size="lg"
          disabled={loading}
          className="w-full shadow-lg shadow-red-900/30"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 ml-2 animate-spin" />
              در حال بارگذاری...
            </>
          ) : (
            <>
              ادامه رزرو
              <ArrowLeft className="w-5 h-5 mr-2" />
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-xs mt-4" style={{ color: '#7D7D7D' }}>
        با کلیک روی دکمه، به صفحه رزرو کامل منتقل می‌شوید
      </p>
    </div>
  );
}
