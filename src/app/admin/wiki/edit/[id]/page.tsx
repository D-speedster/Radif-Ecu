'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Save, Eye, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

// Dynamic import for TipTap editor to reduce initial bundle size
const TipTapEditor = dynamic(() => import('@/components/admin/TipTapEditor'), {
  ssr: false,
  loading: () => (
    <div className="border-2 border-gray-700 rounded-lg p-8 text-center text-gray-medium">
      در حال بارگذاری ویرایشگر...
    </div>
  ),
});

const generateSlug = (title: string): string => {
  return title
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\u0600-\u06FF\-]/g, '')
    .toLowerCase();
};

// مطابق با enum مدل بک‌اند
const CATEGORIES = [
  { value: 'ecu',       label: 'ایسیوها' },
  { value: 'multiplex', label: 'مالتی‌پلکس' },
  { value: 'dtc',       label: 'کدهای خطا' },
  { value: 'dump',      label: 'فایل‌های دامپ' },
];

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [formData, setFormData] = useState({
    title:       '',
    slug:        '',
    category:    'ecu',
    content:     '',
    downloadUrl: '',    // ← نام صحیح در مدل
    isPrivate:   false,
    published:   false, // ← نام صحیح در مدل
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArticle();
  }, [articleId]);

  const fetchArticle = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/articles/${articleId}`);
      // بک‌اند ممکنه داخل { article: {...} } بفرسته یا مستقیم
      const article = response.data.article || response.data;

      // نگاشت فیلدهای بک‌اند به فرم
      setFormData({
        title:       article.title       || '',
        slug:        article.slug        || generateSlug(article.title || ''),
        category:    article.category    || 'ecu',
        content:     article.content     || '',
        downloadUrl: article.downloadUrl || '',
        isPrivate:   article.isPrivate   ?? false,
        published:   article.published   ?? false,
      });
    } catch (err: any) {
      console.error('خطا در بارگذاری مقاله:', err);
      setError('خطا در بارگذاری مقاله');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (value: string) => {
    setFormData({ ...formData, title: value, slug: generateSlug(value) });
  };

  const handleSubmit = async (publish: boolean) => {
    setError('');

    // Validation
    if (!formData.title.trim()) { 
      setError('عنوان مقاله الزامی است'); 
      return; 
    }
    
    if (!formData.slug.trim()) { 
      setError('Slug الزامی است'); 
      return; 
    }
    
    // بررسی فرمت slug
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugPattern.test(formData.slug)) {
      setError('Slug فقط می‌تواند شامل حروف کوچک انگلیسی، اعداد و خط تیره باشد');
      return;
    }
    
    if (!formData.content.trim() || formData.content === '<p></p>') {
      setError('محتوای مقاله الزامی است'); 
      return;
    }

    // بررسی فرمت downloadUrl
    if (formData.downloadUrl && formData.downloadUrl.trim()) {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(formData.downloadUrl.trim())) {
        setError('فرمت لینک دانلود نامعتبر است. مثال: https://example.com/file.zip');
        return;
      }
    }

    setSaving(true);
    try {
      await api.patch(`/articles/${articleId}`, { ...formData, published: publish });
      router.push('/admin/wiki');
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطا در ذخیره مقاله. لطفا دوباره تلاش کنید.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#252525' }} />
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12" style={{ color: '#E53E3E' }} />
        <p style={{ color: '#C53030' }}>{error}</p>
        <Button onClick={() => router.back()} variant="secondary">بازگشت</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg transition-colors"
          style={{ color: '#545454' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#252525'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#545454'}
        >
          <ArrowRight className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#252525' }}>ویرایش مقاله</h1>
          <p style={{ color: '#545454' }}>ویرایش و به‌روزرسانی مقاله موجود</p>
        </div>
      </div>

      {/* راهنمای SEO */}
      <Card className="p-4" style={{ backgroundColor: '#EBF5FF', border: '1px solid #BFDBFE' }}>
        <h3 className="text-sm font-bold mb-2" style={{ color: '#3B82F6' }}>💡 راهنمای SEO:</h3>
        <ul className="space-y-1 text-xs" style={{ color: '#545454' }}>
          <li>✓ عنوان بین ۵۰ تا ۶۰ کاراکتر باشد</li>
          <li>✓ slug حاوی کلمه کلیدی اصلی باشد</li>
          <li>✓ محتوا حداقل ۳۰۰ کلمه باشد</li>
          <li>✓ از عناوین H2 و H3 استفاده شود</li>
        </ul>
      </Card>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">

          {/* عنوان */}
          <div>
            <Input
              label="عنوان مقاله *"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="مثال: آموزش خواندن ECU با BDM100"
              disabled={saving}
            />
            <p className="text-xs mt-1" style={{ color: '#7D7D7D' }}>
              تعداد کاراکتر: {formData.title.length}
              {formData.title.length > 0 && (
                <span
                  className="mr-2"
                  style={{
                    color: formData.title.length >= 50 && formData.title.length <= 60
                      ? '#10B981' : '#F59E0B'
                  }}
                >
                  {formData.title.length >= 50 && formData.title.length <= 60
                    ? '✓ طول مناسب'
                    : formData.title.length < 50 ? '⚠ کوتاه است' : '⚠ بلند است'}
                </span>
              )}
            </p>
          </div>

          {/* دسته‌بندی + Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#252525' }}>
                دسته‌بندی *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={saving}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none disabled:opacity-50"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E0E0E0',
                  color: '#252525'
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <Input
                label="Slug (URL) *"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="amozesh-ecu-bdm100"
                disabled={saving}
                dir="ltr"
                className="font-mono"
              />
              <p className="text-xs mt-1" style={{ color: '#7D7D7D' }}>
                URL: /wiki/{formData.slug || '...'}
              </p>
            </div>
          </div>

          {/* محتوا */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#252525' }}>
              محتوای مقاله *
            </label>
            <TipTapEditor
              content={formData.content}
              onChange={(html) => setFormData({ ...formData, content: html })}
            />
            <p className="text-xs mt-2" style={{ color: '#7D7D7D' }}>
              تعداد کلمات تقریبی:{' '}
              {formData.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length}
            </p>
          </div>

          {/* لینک دانلود */}
          <div>
            <Input
              label="لینک دانلود فایل (اختیاری)"
              value={formData.downloadUrl}
              onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
              placeholder="https://example.com/file.zip"
              disabled={saving}
              dir="ltr"
            />
            <p className="text-xs mt-1" style={{ color: '#7D7D7D' }}>
              اگر فایلی برای دانلود دارید، لینک آن را وارد کنید
            </p>
          </div>

          {/* چک‌باکس خصوصی */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPrivate}
                onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                disabled={saving}
                className="w-5 h-5 rounded"
                style={{ accentColor: '#3B82F6' }}
              />
              <div>
                <span className="font-medium" style={{ color: '#252525' }}>مقاله خصوصی</span>
                <p className="text-xs" style={{ color: '#7D7D7D' }}>
                  فقط کاربران وارد شده می‌توانند ببینند
                </p>
              </div>
            </label>
          </div>

          {/* Error */}
          {error && formData.title && (
            <div className="border rounded-lg p-4 flex items-start gap-3"
              style={{ backgroundColor: '#FEE', borderColor: '#FCC' }}>
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C53030' }} />
              <p className="text-sm" style={{ color: '#C53030' }}>{error}</p>
            </div>
          )}

          {/* دکمه‌ها */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t" style={{ borderColor: '#E0E0E0' }}>
            <Button
              type="button"
              onClick={() => handleSubmit(false)}
              variant="secondary"
              size="lg"
              disabled={saving}
              className="flex-1"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <><Save className="w-5 h-5 ml-2" />ذخیره پیش‌نویس</>
              )}
            </Button>
            <Button
              type="button"
              onClick={() => {
                const message = formData.published 
                  ? 'آیا از به‌روزرسانی و انتشار این مقاله اطمینان دارید؟'
                  : 'آیا از انتشار این مقاله اطمینان دارید؟ مقاله برای همه کاربران قابل مشاهده خواهد بود.';
                if (confirm(message)) {
                  handleSubmit(true);
                }
              }}
              variant="accent"
              size="lg"
              disabled={saving}
              className="flex-1"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <><Eye className="w-5 h-5 ml-2" />{formData.published ? 'به‌روزرسانی و انتشار' : 'انتشار مقاله'}</>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
