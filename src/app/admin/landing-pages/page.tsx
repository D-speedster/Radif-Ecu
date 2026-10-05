'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
  Globe,
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  ExternalLink,
} from 'lucide-react';
import api from '@/lib/api';

interface LandingPage {
  _id: string;
  title: string;
  slug: string;
  category: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  sections: Array<{
    type: string;
    data: any;
  }>;
  schema?: any;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminLandingPagesPage() {
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchLandingPages();
  }, []);

  const fetchLandingPages = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/landing-pages');
      const data = Array.isArray(response.data)
        ? response.data
        : (response.data.landingPages || []);
      
      const sorted = data.sort(
        (a: LandingPage, b: LandingPage) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setLandingPages(sorted);
    } catch (err: any) {
      console.error('خطا در دریافت لندینگ پیج‌ها:', err);
      setError('خطا در بارگذاری لندینگ پیج‌ها');
    } finally {
      setLoading(false);
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id);
    try {
      await api.put(`/landing-pages/${id}`, { published: !currentStatus });
      setLandingPages((prev) =>
        prev.map((lp) => (lp._id === id ? { ...lp, published: !currentStatus } : lp))
      );
    } catch (err: any) {
      console.error('خطا در تغییر وضعیت:', err);
      alert('خطا در تغییر وضعیت. لطفا دوباره تلاش کنید.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این لندینگ پیج اطمینان دارید؟')) {
      return;
    }

    try {
      await api.delete(`/landing-pages/${id}`);
      setLandingPages((prev) => prev.filter((lp) => lp._id !== id));
    } catch (err: any) {
      console.error('خطا در حذف لندینگ پیج:', err);
      alert('خطا در حذف لندینگ پیج. لطفا دوباره تلاش کنید.');
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
        <Button onClick={fetchLandingPages} variant="primary">
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
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#252525' }}>مدیریت لندینگ پیج‌ها</h1>
          <p style={{ color: '#545454' }}>تعداد کل: {landingPages.length} صفحه</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={fetchLandingPages} variant="secondary">
            <RefreshCw className="w-4 h-4 ml-2" />
            به‌روزرسانی
          </Button>
          <Link href="/admin/landing-pages/new">
            <Button variant="accent">
              <Plus className="w-4 h-4 ml-2" />
              لندینگ پیج جدید
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm mb-1" style={{ color: '#545454' }}>منتشر شده</p>
          <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
            {landingPages.filter((lp) => lp.published).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm mb-1" style={{ color: '#545454' }}>پیش‌نویس</p>
          <p className="text-2xl font-bold" style={{ color: '#F59E0B' }}>
            {landingPages.filter((lp) => !lp.published).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm mb-1" style={{ color: '#545454' }}>تعداد بخش‌ها</p>
          <p className="text-2xl font-bold" style={{ color: '#3B82F6' }}>
            {landingPages.reduce((sum, lp) => sum + (lp.sections?.length || 0), 0)}
          </p>
        </Card>
      </div>

      {/* Landing Pages List */}
      {landingPages.length === 0 ? (
        <Card className="p-12 text-center">
          <Globe className="w-12 h-12 mx-auto mb-4" style={{ color: '#7D7D7D' }} />
          <p className="mb-4" style={{ color: '#545454' }}>هیچ لندینگ پیجی یافت نشد</p>
          <Link href="/admin/landing-pages/new">
            <Button variant="primary">
              <Plus className="w-4 h-4 ml-2" />
              اولین لندینگ پیج را بسازید
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {landingPages.map((landingPage) => (
            <Card key={landingPage._id} className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* محتوای لندینگ پیج */}
                <div className="flex-1 space-y-3">
                  {/* عنوان + وضعیت */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2" style={{ color: '#252525' }}>
                        {landingPage.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge color={landingPage.published ? 'green' : 'yellow'}>
                          {landingPage.published ? 'منتشر شده' : 'پیش‌نویس'}
                        </Badge>
                        {landingPage.category && (
                          <Badge color="blue">{landingPage.category}</Badge>
                        )}
                        <Badge color="purple">
                          {landingPage.sections?.length || 0} بخش
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* جزئیات */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm" style={{ color: '#545454' }}>
                    <div>
                      <span style={{ color: '#7D7D7D' }}>Slug: </span>
                      <span className="font-mono" style={{ color: '#252525' }}>
                        /{landingPage.slug}
                      </span>
                    </div>
                    {landingPage.metaTitle && (
                      <div>
                        <span style={{ color: '#7D7D7D' }}>Meta Title: </span>
                        <span className="truncate">{landingPage.metaTitle}</span>
                      </div>
                    )}
                  </div>

                  {/* Meta Description */}
                  {landingPage.metaDescription && (
                    <div className="rounded-lg p-3" style={{ backgroundColor: '#F5F5F5' }}>
                      <p className="text-sm line-clamp-2" style={{ color: '#545454' }}>
                        {landingPage.metaDescription}
                      </p>
                    </div>
                  )}
                </div>

                {/* اکشن‌ها */}
                <div className="lg:w-48 flex lg:flex-col gap-2">
                  <button
                    onClick={() => togglePublished(landingPage._id, landingPage.published)}
                    disabled={updatingId === landingPage._id}
                    className={`flex-1 lg:flex-none px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50`}
                    style={{
                      backgroundColor: landingPage.published ? '#ECFDF5' : '#FFFBEB',
                      color: landingPage.published ? '#059669' : '#D97706',
                      borderColor: landingPage.published ? '#6EE7B7' : '#FCD34D',
                    }}
                  >
                    {landingPage.published ? (
                      <><Eye className="w-4 h-4" /><span className="hidden sm:inline">منتشر شده</span></>
                    ) : (
                      <><EyeOff className="w-4 h-4" /><span className="hidden sm:inline">پیش‌نویس</span></>
                    )}
                  </button>

                  {/* ویرایش */}
                  <Link href={`/admin/landing-pages/edit/${landingPage._id}`} className="flex-1 lg:flex-none">
                    <button className="w-full px-4 py-2 border rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#EBF5FF', color: '#3B82F6', borderColor: '#BFDBFE' }}>
                      <Edit className="w-4 h-4" />
                      <span className="hidden sm:inline">ویرایش</span>
                    </button>
                  </Link>

                  {/* مشاهده */}
                  <a href={`/page/${landingPage.slug}`} target="_blank" rel="noopener noreferrer" className="flex-1 lg:flex-none">
                    <button className="w-full px-4 py-2 border rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#F5F3FF', color: '#7C3AED', borderColor: '#DDD6FE' }}>
                      <ExternalLink className="w-4 h-4" />
                      <span className="hidden sm:inline">مشاهده</span>
                    </button>
                  </a>

                  {/* حذف */}
                  <button
                    onClick={() => handleDelete(landingPage._id)}
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
