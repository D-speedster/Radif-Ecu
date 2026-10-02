import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'صفحه پیدا نشد',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-[var(--color-text)] mb-3">صفحه‌ای که دنبالش بودید پیدا نشد</h1>
      <p className="text-[var(--color-muted)] mb-8">ممکن است آدرس اشتباه باشد یا صفحه جابه‌جا شده باشد.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className="px-5 py-2.5 rounded-lg bg-[var(--color-btn-primary)] text-[var(--color-btn-text)] font-medium">
          صفحهٔ اصلی
        </Link>
        <Link href="/remap" className="px-5 py-2.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] font-medium">
          ریمپ ECU
        </Link>
        <Link href="/contact" className="px-5 py-2.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] font-medium">
          تماس با ما
        </Link>
      </div>
    </div>
  );
}
