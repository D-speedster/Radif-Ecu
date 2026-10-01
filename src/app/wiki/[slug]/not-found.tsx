import React from 'react';
import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ArticleNotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <FileQuestion className="w-20 h-20 text-[var(--color-muted)] mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-4">مقاله یافت نشد</h1>
        <p className="text-[var(--color-muted)] mb-8 leading-relaxed">
          متأسفانه مقاله مورد نظر شما یافت نشد. ممکن است حذف شده یا منتقل شده باشد.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/wiki">
            <Button variant="primary" size="lg">
              مشاهده همه مقالات
            </Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" size="lg">
              بازگشت به خانه
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
