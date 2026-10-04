'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Loader2, Plus, Trash2, Save, ArrowRight, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

interface Section {
  type: string;
  data: string;
}

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
}

const sectionTypes = [
  { value: 'hero', label: 'Hero (هیرو)' },
  { value: 'features', label: 'Features (ویژگی‌ها)' },
  { value: 'steps', label: 'Steps (مراحل)' },
  { value: 'faq', label: 'FAQ (سوالات متداول)' },
  { value: 'pricing', label: 'Pricing (قیمت‌گذاری)' },
  { value: 'cta', label: 'CTA (فراخوان)' },
  { value: 'text', label: 'Text (متن)' },
  { value: 'contact', label: 'Contact (تماس)' },
];

export default function EditLandingPagePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    published: false,
    schema: '',
  });

  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    if (id) {
      fetchLandingPage();
    }
  }, [id]);

  const fetchLandingPage = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch all landing pages and find by ID
      const response = await api.get('/landing-pages');
      const data = Array.isArray(response.data)
        ? response.data
        : (response.data.landingPages || []);
      
      const landingPage = data.find((lp: LandingPage) => lp._id === id);

      if (!landingPage) {
        setError('لندینگ پیج یافت نشد');
        return;
      }

      // Set form data
      setFormData({
        title: landingPage.title,
        slug: landingPage.slug,
        category: landingPage.category || '',
        metaTitle: landingPage.metaTitle || '',
        metaDescription: landingPage.metaDescription || '',
        keywords: landingPage.keywords?.join(', ') || '',
        published: landingPage.published,
        schema: landingPage.schema ? JSON.stringify(landingPage.schema, null, 2) : '',
      });

      // Set sections
      const sectionsData = landingPage.sections.map((section: { type: string; data: any }) => ({
        type: section.type,
        data: JSON.stringify(section.data, null, 2),
      }));
      setSections(sectionsData);

    } catch (err: any) {
      console.error('خطا در دریافت لندینگ پیج:', err);
      setError('خطا در بارگذاری لندینگ پیج');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const addSection = () => {
    setSections((prev) => [...prev, { type: 'text', data: '{}' }]);
  };

  const removeSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, field: 'type' | 'data', value: string) => {
    setSections((prev) =>
      prev.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Parse sections data
      const parsedSections = sections.map((section) => {
        try {
          return {
            type: section.type,
            data: JSON.parse(section.data),
          };
        } catch {
          throw new Error(`خطا در پارس JSON بخش ${section.type}`);
        }
      });

      // Parse schema
      let parsedSchema = undefined;
      if (formData.schema.trim()) {
        try {
          parsedSchema = JSON.parse(formData.schema);
        } catch {
          throw new Error('خطا در پارس JSON Schema');
        }
      }

      // Parse keywords
      const keywordsArray = formData.keywords
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k);

      const payload = {
        title: formData.title,
        slug: formData.slug,
        category: formData.category,
        metaTitle: formData.metaTitle || formData.title,
        metaDescription: formData.metaDescription,
        keywords: keywordsArray,
        sections: parsedSections,
        schema: parsedSchema,
        published: formData.published,
      };

      await api.put(`/landing-pages/${id}`, payload);
      setSuccess('لندینگ پیج با موفقیت به‌روزرسانی شد');
      
      setTimeout(() => {
        router.push('/admin/landing-pages');
      }, 1500);
    } catch (err: any) {
      console.error('خطا در به‌روزرسانی لندینگ پیج:', err);
      setError(err.message || 'خطا در به‌روزرسانی لندینگ پیج. لطفا دوباره تلاش کنید.');
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
        <Link href="/admin/landing-pages">
          <Button variant="primary">بازگشت به لیست</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#252525' }}>ویرایش لندینگ پیج</h1>
          <p style={{ color: '#545454' }}>{formData.title}</p>
        </div>
        <Link href="/admin/landing-pages">
          <Button variant="secondary">
            <ArrowRight className="w-4 h-4 ml-2" />
            بازگشت
          </Button>
        </Link>
      </div>

      {/* Alerts */}
      {error && (
        <Card className="p-4" style={{ backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }}>
          <p style={{ color: '#C53030' }}>{error}</p>
        </Card>
      )}

      {success && (
        <Card className="p-4" style={{ backgroundColor: '#D1FAE5', borderColor: '#6EE7B7' }}>
          <p style={{ color: '#059669' }}>{success}</p>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#252525' }}>اطلاعات پایه</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#545454' }}>
                عنوان *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
                style={{ borderColor: '#E0E0E0' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#545454' }}>
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg font-mono"
                style={{ borderColor: '#E0E0E0' }}
                placeholder="remap یا repair-ecu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#545454' }}>
                دسته‌بندی
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                style={{ borderColor: '#E0E0E0' }}
                placeholder="خدمات، محصولات، ..."
              />
            </div>
          </div>
        </Card>

        {/* Metadata */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#252525' }}>متادیتا (SEO)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#545454' }}>
                Meta Title
              </label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                style={{ borderColor: '#E0E0E0' }}
                placeholder="اگر خالی بماند، از عنوان اصلی استفاده می‌شود"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#545454' }}>
                Meta Description
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg"
                style={{ borderColor: '#E0E0E0' }}
                placeholder="توضیح مختصر برای نمایش در نتایج جستجو"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#545454' }}>
                کلمات کلیدی (Keywords)
              </label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                style={{ borderColor: '#E0E0E0' }}
                placeholder="ریمپ، ECU، تیونینگ، ... (با کاما جدا کنید)"
              />
            </div>
          </div>
        </Card>

        {/* Sections */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ color: '#252525' }}>بخش‌ها (Sections)</h2>
            <Button type="button" onClick={addSection} variant="secondary" size="sm">
              <Plus className="w-4 h-4 ml-2" />
              افزودن بخش
            </Button>
          </div>

          <div className="space-y-4">
            {sections.map((section, index) => (
              <div key={index} className="p-4 border rounded-lg" style={{ borderColor: '#E0E0E0', backgroundColor: '#F9FAFB' }}>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium" style={{ color: '#545454' }}>
                    بخش {index + 1}
                  </label>
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      className="p-1 hover:bg-red-100 rounded"
                      style={{ color: '#C53030' }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#7D7D7D' }}>
                      نوع بخش
                    </label>
                    <select
                      value={section.type}
                      onChange={(e) => updateSection(index, 'type', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      style={{ borderColor: '#E0E0E0', backgroundColor: '#FFFFFF' }}
                    >
                      {sectionTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#7D7D7D' }}>
                      داده (JSON)
                    </label>
                    <textarea
                      value={section.data}
                      onChange={(e) => updateSection(index, 'data', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                      style={{ borderColor: '#E0E0E0', backgroundColor: '#FFFFFF' }}
                      placeholder='{"title": "عنوان", "description": "توضیحات"}'
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Schema Markup */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#252525' }}>Schema Markup</h2>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#545454' }}>
              Schema.org JSON-LD
            </label>
            <textarea
              name="schema"
              value={formData.schema}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
              style={{ borderColor: '#E0E0E0' }}
              placeholder='{"@context": "https://schema.org", "@type": "Service", ...}'
            />
            <p className="text-xs mt-1" style={{ color: '#7D7D7D' }}>
              اختیاری - Schema markup برای بهبود SEO
            </p>
          </div>
        </Card>

        {/* Publish */}
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              name="published"
              checked={formData.published}
              onChange={handleCheckboxChange}
              className="w-5 h-5"
            />
            <label htmlFor="published" className="text-sm font-medium cursor-pointer" style={{ color: '#252525' }}>
              انتشار این لندینگ پیج
            </label>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex gap-3">
          <Button type="submit" variant="accent" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 ml-2" />
                ذخیره تغییرات
              </>
            )}
          </Button>
          <Link href="/admin/landing-pages">
            <Button type="button" variant="secondary">
              لغو
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
