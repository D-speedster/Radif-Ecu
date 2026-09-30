'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CheckCircle, Copy, ArrowLeft, Phone } from 'lucide-react';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const trackingCode = searchParams.get('code');

  useEffect(() => {
    if (!trackingCode) {
      router.push('/booking');
    }
  }, [trackingCode, router]);

  const handleCopy = () => {
    if (trackingCode) {
      navigator.clipboard.writeText(trackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!trackingCode) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <Card className="p-8 md:p-12 text-center">
          {/* آیکون موفقیت */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-500/20 p-4 rounded-full">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
          </div>

          {/* عنوان */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            نوبت شما با موفقیت ثبت شد!
          </h1>

          {/* پیام */}
          <p className="text-gray-300 text-lg mb-8">
            کد پیگیری شما ثبت گردید. لطفا این کد را یادداشت کنید.
          </p>

          {/* کد پیگیری */}
          <div className="bg-[var(--color-bg)] border-2 border-blue-500 rounded-xl p-6 mb-8">
            <p className="text-gray-400 text-sm mb-2">کد پیگیری:</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-3xl md:text-4xl font-bold text-blue-400 tracking-wider font-mono">
                {trackingCode}
              </p>
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
                title="کپی کد"
              >
                {copied ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <Copy className="w-6 h-6 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* اطلاعات اضافی */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-8 text-right">
            <h3 className="text-lg font-bold text-white mb-3">مراحل بعدی:</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">✓</span>
                <span>کد پیگیری خود را ذخیره کنید</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">✓</span>
                <span>یک روز قبل از نوبت، با شما تماس گرفته می‌شود</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">✓</span>
                <span>در صورت نیاز به تغییر یا لغو، با ما تماس بگیرید</span>
              </li>
            </ul>
          </div>

          {/* دکمه‌ها */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/booking/track?code=${trackingCode}`} className="flex-1">
              <Button variant="primary" size="lg" className="w-full">
                مشاهده وضعیت نوبت
              </Button>
            </Link>
            <a href="tel:02112345678" className="flex-1">
              <Button variant="secondary" size="lg" className="w-full">
                <Phone className="w-5 h-5 ml-2" />
                تماس با ما
              </Button>
            </a>
          </div>

          <div className="mt-6">
            <Link href="/">
              <Button variant="secondary" size="md" className="w-full sm:w-auto">
                <ArrowLeft className="w-5 h-5 ml-2" />
                بازگشت به صفحه اصلی
              </Button>
            </Link>
          </div>
        </Card>

        {/* پیام تشکر */}
        <p className="text-center text-gray-400 mt-6">
          از اعتماد شما سپاسگزاریم. منتظر دیدار شما هستیم! 🚗
        </p>
      </div>
    </div>
  );
}


export default function BookingSuccessPage() {
  return (
    <Suspense fallback={null}>
      <BookingSuccessContent />
    </Suspense>
  );
}
