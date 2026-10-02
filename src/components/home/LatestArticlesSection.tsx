'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ArrowLeft, Calendar, BookOpen, BookMarked } from 'lucide-react';
import api from '@/lib/api';
import { Article } from '@/types';
import { toJalali, truncateText } from '@/lib/utils';

/* ── Skeleton یک کارت ── */
function ArticleSkeleton() {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '24px',
        overflow: 'hidden',
      }}
    >
      {/* badge */}
      <div
        style={{
          width: '72px', height: '22px', borderRadius: '6px',
          backgroundColor: '#EEF2F7', marginBottom: '16px',
          animation: 'skeleton-pulse 1.5s ease-in-out infinite',
        }}
      />
      {/* عنوان خط ۱ */}
      <div
        style={{
          width: '100%', height: '18px', borderRadius: '6px',
          backgroundColor: '#EEF2F7', marginBottom: '8px',
          animation: 'skeleton-pulse 1.5s ease-in-out infinite 0.1s',
        }}
      />
      {/* عنوان خط ۲ */}
      <div
        style={{
          width: '70%', height: '18px', borderRadius: '6px',
          backgroundColor: '#EEF2F7', marginBottom: '16px',
          animation: 'skeleton-pulse 1.5s ease-in-out infinite 0.15s',
        }}
      />
      {/* متن خط ۱ */}
      <div
        style={{
          width: '100%', height: '14px', borderRadius: '4px',
          backgroundColor: '#F4F6FA', marginBottom: '6px',
          animation: 'skeleton-pulse 1.5s ease-in-out infinite 0.2s',
        }}
      />
      <div
        style={{
          width: '90%', height: '14px', borderRadius: '4px',
          backgroundColor: '#F4F6FA', marginBottom: '6px',
          animation: 'skeleton-pulse 1.5s ease-in-out infinite 0.25s',
        }}
      />
      <div
        style={{
          width: '60%', height: '14px', borderRadius: '4px',
          backgroundColor: '#F4F6FA', marginBottom: '20px',
          animation: 'skeleton-pulse 1.5s ease-in-out infinite 0.3s',
        }}
      />
      {/* footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{
            width: '80px', height: '14px', borderRadius: '4px',
            backgroundColor: '#EEF2F7',
            animation: 'skeleton-pulse 1.5s ease-in-out infinite 0.35s',
          }}
        />
        <div
          style={{
            width: '90px', height: '32px', borderRadius: '8px',
            backgroundColor: '#EEF2F7',
            animation: 'skeleton-pulse 1.5s ease-in-out infinite 0.4s',
          }}
        />
      </div>
    </div>
  );
}

/* ── Empty State ── */
function EmptyState() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        borderRadius: '12px',
        border: '1.5px dashed #CBD5E1',
        backgroundColor: '#F8FAFC',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '56px', height: '56px', borderRadius: '12px',
          backgroundColor: 'rgba(37,99,235,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <BookMarked style={{ width: '26px', height: '26px', color: '#B45309' }} />
      </div>
      <p style={{ fontSize: '15px', fontWeight: 600, color: '#0E1621', margin: 0 }}>
        هنوز مقاله‌ای منتشر نشده
      </p>
      <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0, textAlign: 'center', maxWidth: '260px' }}>
        به زودی مقالات تخصصی ECU و برق خودرو اضافه می‌شود.
      </p>
      <Link href="/wiki" style={{ marginTop: '4px' }}>
        <Button variant="primary" size="sm">
          مشاهده دانشنامه
        </Button>
      </Link>
    </div>
  );
}

/* ── کامپوننت اصلی ── */
export default function LatestArticlesSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get('/articles?limit=3');
        setArticles(response.data.articles || response.data);
      } catch {
        // silent — empty state نشان داده می‌شود
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <section
      style={{
        backgroundColor: '#F0F2F5',
        padding: '64px 0',
        fontFamily: 'YekanBakh, sans-serif',
      }}
    >
      <div className="container mx-auto" style={{ padding: '0 20px' }}>

        {/* هدر */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 14px',
              borderRadius: '20px',
              backgroundColor: 'rgba(37,99,235,0.08)',
              border: '1px solid rgba(37,99,235,0.18)',
              color: '#B45309',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '14px',
            }}
          >
            <BookOpen style={{ width: '12px', height: '12px' }} />
            دانشنامه تخصصی
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 700,
              color: '#0E1621',
              marginBottom: '0.75rem',
            }}
          >
            آخرین مقالات دانشنامه
          </h2>
          <p
            style={{
              fontSize: '0.9375rem',
              fontWeight: 400,
              color: '#4A5568',
              lineHeight: '1.7',
              maxWidth: '36rem',
              margin: '0 auto',
            }}
          >
            جدیدترین آموزش‌ها و نکات تخصصی ECU و سیستم‌های الکترونیکی خودرو
          </p>
        </div>

        {/* محتوا */}
        {loading ? (
          /* Skeleton — ۳ کارت */
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '16px' }}>
            <ArticleSkeleton />
            <ArticleSkeleton />
            <ArticleSkeleton />
          </div>
        ) : articles.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '16px', marginBottom: '28px' }}>
              {articles.map((article) => (
                <Card key={article._id} hover>
                  {/* category badge */}
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      backgroundColor: 'rgba(37,99,235,0.08)',
                      color: '#B45309',
                      marginBottom: '12px',
                    }}
                  >
                    {article.category}
                  </span>

                  <h3
                    className="line-clamp-2"
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#0E1621',
                      marginBottom: '10px',
                      lineHeight: '1.5',
                    }}
                  >
                    {article.title}
                  </h3>

                  <p
                    className="line-clamp-3"
                    style={{
                      fontSize: '13.5px',
                      color: '#64748B',
                      lineHeight: '1.7',
                      marginBottom: '16px',
                    }}
                  >
                    {article.excerpt || truncateText(article.content.replace(/<[^>]*>/g, ''), 120)}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#94A3B8' }}>
                      <Calendar style={{ width: '14px', height: '14px' }} />
                      <span>{toJalali(article.createdAt)}</span>
                    </div>
                    <Link href={`/wiki/${article.slug}`}>
                      <Button variant="secondary" size="sm">
                        بیشتر بخوانید
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link href="/wiki">
                <Button variant="primary" size="lg">
                  مشاهده همه مقالات
                  <ArrowLeft style={{ width: '17px', height: '17px', marginRight: '6px' }} />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
