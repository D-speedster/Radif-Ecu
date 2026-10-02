import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Download, ArrowRight, BookOpen } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Article } from '@/types';
import { toJalali } from '@/lib/utils';
import { notFound } from 'next/navigation';

// URL API
const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ⭐ دریافت مقاله از API (Server Side)
async function getArticle(slug: string): Promise<Article | null> {
  try {
    // اول سعی می‌کنیم با slug دریافت کنیم
    const response = await fetch(`${API_URL}/articles/${slug}`, {
      next: { revalidate: 3600 }, // revalidate هر ساعت
    });

    if (response.ok) {
      const data = await response.json();
      return (data.article || data) as Article;
    }

    // اگر slug کار نکرد، با _id تلاش می‌کنیم (fallback)
    const allResponse = await fetch(`${API_URL}/articles`, {
      next: { revalidate: 3600 },
    });

    if (allResponse.ok) {
      const data = await allResponse.json();
      const articles = data.articles || data;
      return articles.find((a: Article) => a._id === slug || a.slug === slug) || null;
    }

    return null;
  } catch (error) {
    console.error('خطا در دریافت مقاله:', error);
    return null;
  }
}

// ⭐ تولید metadata برای SEO (این خیلی مهمه!)
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticle(params.slug);

  if (!article) {
    return {
      title: 'مقاله یافت نشد | ردیف ایسیو',
    };
  }

  const excerpt = article.excerpt || 
    article.content.replace(/<[^>]*>/g, '').substring(0, 160);

  return {
    title: `${article.title} | ردیف ایسیو`,
    description: excerpt,
    keywords: `${article.category}, ECU, تعمیرات خودرو, ${article.title}`,
    openGraph: {
      title: article.title,
      description: excerpt,
      url: `https://radif-ecu.ir/wiki/${article.slug || article._id}`,
      siteName: 'ردیف ایسیو',
      locale: 'fa_IR',
      type: 'article',
      publishedTime: article.createdAt,
      modifiedTime: article.updatedAt,
      authors: ['ردیف ایسیو'],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: excerpt,
    },
    alternates: {
      canonical: `https://radif-ecu.ir/wiki/${article.slug || article._id}`,
    },
  };
}

// ⭐ کامپوننت صفحه مقاله
export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);

  // اگر مقاله پیدا نشد، صفحه 404
  if (!article) {
    notFound();
  }

  // ⭐ Schema Markup برای گوگل (JSON-LD)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || article.content.replace(/<[^>]*>/g, '').substring(0, 160),
    author: {
      '@type': 'Organization',
      name: 'ردیف ایسیو',
      url: 'https://radif-ecu.ir',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ردیف ایسیو',
      logo: {
        '@type': 'ImageObject',
        url: 'https://radif-ecu.ir/logo.png',
      },
    },
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://radif-ecu.ir/wiki/${article.slug || article._id}`,
    },
  };

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="min-h-screen bg-[var(--color-bg)]">
        <div className="container mx-auto px-4 py-12 md:py-16">
          {/* برگشت به لیست */}
          <div className="mb-8">
            <Link
              href="/wiki"
              className="inline-flex items-center gap-2 text-[var(--color-primary-light)] hover:text-[var(--color-primary)] transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              <span>بازگشت به دانشنامه</span>
            </Link>
          </div>

          {/* محتوای اصلی */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* محتوای مقاله - ۲ ستون */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                {/* دسته‌بندی */}
                <div className="mb-6">
                  <Badge variant="primary" className="text-base px-4 py-2">
                    {article.category}
                  </Badge>
                </div>

                {/* عنوان */}
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-6 leading-tight">
                  {article.title}
                </h1>

                {/* تاریخ */}
                <div className="flex items-center gap-4 text-[var(--color-muted)] mb-8 pb-6 border-b border-[var(--color-border)]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>تاریخ انتشار: {toJalali(article.createdAt)}</span>
                  </div>
                </div>

                {/* محتوای مقاله */}
                <div
                  className="prose prose-invert max-w-none
                    prose-headings:text-[var(--color-text)] prose-headings:font-bold
                    prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                    prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                    prose-p:text-[var(--color-text)] prose-p:leading-relaxed prose-p:mb-4
                    prose-a:text-[var(--color-primary-light)] prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-[var(--color-text)] prose-strong:font-bold
                    prose-ul:text-[var(--color-text)] prose-ul:list-disc prose-ul:mr-6
                    prose-ol:text-[var(--color-text)] prose-ol:list-decimal prose-ol:mr-6
                    prose-li:mb-2
                    prose-code:text-[var(--color-primary-light)] prose-code:bg-[var(--color-surface)] prose-code:px-2 prose-code:py-1 prose-code:rounded
                    prose-pre:bg-[var(--color-surface)] prose-pre:border prose-pre:border-[var(--color-border)]
                    prose-img:rounded-lg prose-img:border prose-img:border-[var(--color-border)]"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* دانلود فایل */}
                {article.downloadUrl && (
                  <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
                    <a
                      href={article.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="primary" size="lg">
                        <Download className="w-5 h-5 ml-2" />
                        دانلود فایل ضمیمه
                      </Button>
                    </a>
                  </div>
                )}
              </Card>
            </div>

            {/* ستون کناری - ۱ ستون */}
            <div className="lg:col-span-1">
              {/* کارت اطلاعات */}
              <Card className="p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-6 h-6 text-[var(--color-primary-light)]" />
                  <h3 className="text-lg font-bold text-[var(--color-text)]">اطلاعات مقاله</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[var(--color-muted)] mb-1">دسته‌بندی:</p>
                    <p className="text-[var(--color-text)] font-medium">{article.category}</p>
                  </div>

                  <div>
                    <p className="text-sm text-[var(--color-muted)] mb-1">تاریخ انتشار:</p>
                    <p className="text-[var(--color-text)] font-medium">{toJalali(article.createdAt)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-[var(--color-muted)] mb-1">آخرین بروزرسانی:</p>
                    <p className="text-[var(--color-text)] font-medium">{toJalali(article.updatedAt)}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
                  <Link href="/wiki">
                    <Button variant="secondary" size="md" className="w-full">
                      مشاهده همه مقالات
                    </Button>
                  </Link>
                </div>

                <div className="mt-4">
                  <Link href="/booking">
                    <Button variant="accent" size="md" className="w-full">
                      رزرو نوبت
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
