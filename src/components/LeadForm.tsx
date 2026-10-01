'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import { track } from '@/lib/track';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface LeadFormProps {
  service: string; // مثلاً «ریمپ ECU»
  title?: string;
}

const toEn = (v: string) =>
  v
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));

export default function LeadForm({ service, title = 'درخواست مشاوره' }: LeadFormProps) {
  const [form, setForm] = useState({ name: '', phone: '', car: '', website: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError('');
    const phone = toEn(form.phone).replace(/[\s-]/g, '');
    if (form.name.trim().length < 2) return setError('نام را وارد کنید');
    if (!/^09\d{9}$/.test(phone)) return setError('شمارهٔ موبایل معتبر نیست (مثال: ۰۹۱۲۱۲۳۴۵۶۷)');
    if (form.car.trim().length < 2) return setError('نام یا مدل خودرو را وارد کنید');

    // پارامترهای تبلیغ برای ردیابی منبع Lead
    const p = new URLSearchParams(window.location.search);
    const src = ['gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term']
      .map((k) => (p.get(k) ? `${k}=${p.get(k)}` : ''))
      .filter(Boolean)
      .join(' | ');

    setStatus('loading');
    try {
      await api.post('/contact', {
        name: form.name.trim(),
        phone,
        subject: `درخواست ${service}`,
        message: [`خودرو: ${form.car.trim()}`, `صفحه: ${window.location.pathname}`, src && `منبع: ${src}`]
          .filter(Boolean)
          .join('\n'),
        website: form.website, // honeypot
      });
      track('generate_lead', { lead_type: 'lead_form', service });
      setStatus('done');
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'ارسال انجام نشد. لطفاً تماس بگیرید یا در واتساپ پیام بدهید.');
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-white p-6 text-center">
        <p className="text-lg font-bold text-[var(--color-text)] mb-1">درخواست شما ثبت شد</p>
        <p className="text-[var(--color-muted)]">در اولین فرصت با شما تماس می‌گیریم.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-6">
      <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">{title}</h2>
      <div className="space-y-4">
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={set('website')}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
        />
        <Input label="نام" value={form.name} onChange={set('name')} autoComplete="name" />
        <Input
          label="شمارهٔ موبایل"
          value={form.phone}
          onChange={set('phone')}
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          placeholder="09xxxxxxxxx"
        />
        <Input label="خودرو (مدل و سال)" value={form.car} onChange={set('car')} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button onClick={submit} disabled={status === 'loading'} className="w-full">
          {status === 'loading' ? 'در حال ارسال...' : 'ثبت درخواست'}
        </Button>
      </div>
    </div>
  );
}
