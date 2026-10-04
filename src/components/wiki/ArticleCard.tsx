import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Article } from '@/types';
import { toJalali, truncateText } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  // استفاده از slug اگر موجود باشه، وگرنه از _id استفاده می‌کنیم
  const articleUrl = article.slug 
    ? `/wiki/${article.slug}` 
    : `/wiki/${article._id}`;
  
  // استخراج excerpt از محتوا اگر موجود نباشه
  const excerpt = article.excerpt || 
    truncateText(article.content.replace(/<[^>]*>/g, ''), 150);

  return (
    <Card hover className="h-full flex flex-col min-w-0 overflow-hidden">
      {/* دسته‌بندی */}
      <div className="mb-4">
        <Badge variant="primary">{article.category}</Badge>
      </div>

      {/* عنوان */}
      <Link href={articleUrl}>
        <h3 className="text-xl font-bold mb-3 hover:text-[var(--color-btn-hover)] transition-colors line-clamp-2 break-words" style={{ color: '#252525' }}>
          {article.title}
        </h3>
      </Link>

      {/* خلاصه */}
      <p className="text-[var(--color-muted)] mb-4 flex-1 line-clamp-3 leading-relaxed break-words">
        {excerpt}
      </p>

      {/* تاریخ و دکمه */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)] gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-[var(--color-muted)] flex-shrink-0">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span className="whitespace-nowrap">{toJalali(article.createdAt)}</span>
        </div>
        <Link href={articleUrl}>
          <Button variant="secondary" size="sm">
            مطالعه
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
