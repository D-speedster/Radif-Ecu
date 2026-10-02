'use client';

import Link from 'next/link';
import { telHref, business } from '@/config/business';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-[var(--color-text)] mb-3">مشکلی پیش آمد</h1>
      <p className="text-[var(--color-muted)] mb-8">
        لطفاً دوباره تلاش کنید. اگر مشکل ادامه داشت با ما تماس بگیرید: {business.phoneDisplay}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={reset} className="px-5 py-2.5 rounded-lg bg-[var(--color-btn-primary)] text-[var(--color-btn-text)] font-medium">
          تلاش دوباره
        </button>
        <a href={telHref} className="px-5 py-2.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] font-medium">
          تماس تلفنی
        </a>
        <Link href="/" className="px-5 py-2.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] font-medium">
          صفحهٔ اصلی
        </Link>
      </div>
    </div>
  );
}
