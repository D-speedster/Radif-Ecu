'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import { toJalali } from '@/lib/utils';
import api from '@/lib/api';

interface Article {
  _id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  downloadUrl?: string;
  isPrivate: boolean;
  published: boolean;   // ← نام صحیح در مدل بک‌اند
  createdAt: string;
  updatedAt: string;
}

const categoryLabels: Record<string, string> = {
  ecu:       'ایسیوها',
  multiplex: 'مالتی‌پلکس',
  dtc:       'کدهای خطا',
  dump:      'فایل‌های دامپ',
};

export default function AdminWikiPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/articles/admin/all');
      const data = Array.isArray(response.data)
        ? response.data
        : (response.data.articles || []);
      
      const sorted = data.sort(
        (a: Article, b: Article) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setArticles(sorted);
    } catch (err: any) {
      console.error('خطا در دریافت مقالات:', err);
      setError('خطا در بارگذاری مقالات');
    } finally {
      setLoading(false);
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id);
    try {
      await api.patch(`/articles/${id}`, { published: !currentStatus });
      setArticles((prev) =>
        prev.map((a) => (a._id === id ? { ...a, published: !currentStatus } : a))
      );
    } catch (err: any) {
      console.error('خطا در تغییر وضعیت:', err);
      alert('خطا در تغییر وضعیت. لطفا دوباره تلاش کنید.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این مقاله اطمینان دارید؟')) {
      return;
    }

    try {
      await api.delete(`/articles/${id}`);
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch (err: any) {
      console.error('خطا در حذف مقاله:', err);
      alert('خطا در حذف مقاله. لطفا دوباره تلاش کنید.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#252525' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12" style={{ color: '#E53E3E' }} />
        <p style={{ color: '#C53030' }}>{error}</p>
        <Button onClick={fetchArticles} variant="primary">
          <RefreshCw className="w-4 h-4 ml-2" />
          تلاش مجدد
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#252525' }}>مدیریت دانشنامه</h1>
          <p style={{ color: '#545454' }}>تعداد کل: {articles.length} مقاله</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={fetchArticles} variant="secondary">
            <RefreshCw className="w-4 h-4 ml-2" />
            به‌روزرسانی
          </Button>
          <Link href="/admin/wiki/new">
            <Button variant="accent">
              <Plus className="w-4 h-4 ml-2" />
              مقاله جدید
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm mb-1" style={{ color: '#545454' }}>منتشر شده</p>
          <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
            {articles.filter((a) => a.published).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm mb-1" style={{ color: '#545454' }}>پیش‌نویس</p>
          <p className="text-2xl font-bold" style={{ color: '#F59E0B' }}>
            {articles.filter((a) => !a.published).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm mb-1" style={{ color: '#545454' }}>خصوصی</p>
          <p className="text-2xl font-bold" style={{ color: '#3B82F6' }}>
            {articles.filter((a) => a.isPrivate).length}
          </p>
        </Card>
      </div>

      {/* Articles List */}
      {articles.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: '#7D7D7D' }} />
          <p className="mb-4" style={{ color: '#545454' }}>هیچ مقاله‌ای یافت نشد</p>
          <Link href="/admin/wiki/new">
            <Button variant="primary">
              <Plus className="w-4 h-4 ml-2" />
              اولین مقاله را بنویسید
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <Card key={article._id} className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* محتوای مقاله */}
                <div className="flex-1 space-y-3">
                  {/* عنوان + وضعیت */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2" style={{ color: '#252525' }}>
                        {article.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge color={article.published ? 'green' : 'yellow'}>
                          {article.published ? 'منتشر شده' : 'پیش‌نویس'}
                        </Badge>
                        <Badge color="blue">
                          {categoryLabels[article.category] || article.category}
                        </Badge>
                        {article.isPrivate && (
                          <Badge color="purple">خصوصی</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* جزئیات */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm" style={{ color: '#545454' }}>
                    <div>
                      <span style={{ color: '#7D7D7D' }}>Slug: </span>
                      <span className="font-mono" style={{ color: '#252525' }}>
                        {article.slug}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#7D7D7D' }}>آخرین ویرایش: </span>
                      <span>
                        {article.updatedAt 
                          ? toJalali(article.updatedAt.split('T')[0])
                          : 'نامشخص'}
                      </span>
                    </div>
                  </div>

                  {/* Preview محتوا */}
                  <div className="rounded-lg p-3" style={{ backgroundColor: '#F5F5F5' }}>
                    <p className="text-sm line-clamp-2" style={{ color: '#545454' }}>
                      {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}
                      ...
                    </p>
                  </div>
                </div>

                {/* اکشن‌ها */}
                <div className="lg:w-48 flex lg:flex-col gap-2">
                  <button
                    onClick={() => togglePublished(article._id, article.published)}
                    disabled={updatingId === article._id}
                    className={`flex-1 lg:flex-none px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50`}
                    style={{
                      backgroundColor: article.published ? '#ECFDF5' : '#FFFBEB',
                      color: article.published ? '#059669' : '#D97706',
                      borderColor: article.published ? '#6EE7B7' : '#FCD34D',
                    }}
                  >
                    {article.published ? (
                      <><Eye className="w-4 h-4" /><span className="hidden sm:inline">منتشر شده</span></>
                    ) : (
                      <><EyeOff className="w-4 h-4" /><span className="hidden sm:inline">پیش‌نویس</span></>
                    )}
                  </button>

                  {/* ویرایش */}
                  <Link href={`/admin/wiki/edit/${article._id}`} className="flex-1 lg:flex-none">
                    <button className="w-full px-4 py-2 border rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#EBF5FF', color: '#3B82F6', borderColor: '#BFDBFE' }}>
                      <Edit className="w-4 h-4" />
                      <span className="hidden sm:inline">ویرایش</span>
                    </button>
                  </Link>

                  {/* مشاهده */}
                  <a href={`/wiki/${article.slug}`} target="_blank" rel="noopener noreferrer" className="flex-1 lg:flex-none">
                    <button className="w-full px-4 py-2 border rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#F5F3FF', color: '#7C3AED', borderColor: '#DDD6FE' }}>
                      <BookOpen className="w-4 h-4" />
                      <span className="hidden sm:inline">مشاهده</span>
                    </button>
                  </a>

                  {/* حذف */}
                  <button
                    onClick={() => handleDelete(article._id)}
                    className="px-4 py-2 border rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#FEE', color: '#C53030', borderColor: '#FCC' }}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">حذف</span>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
