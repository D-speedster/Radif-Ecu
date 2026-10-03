'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import api from '@/lib/api';
import { track } from '@/lib/track';
import { business, telHref } from '@/config/business';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: '',
    message: '',
    website: '', // honeypot: باید خالی بماند
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.post('/contact', formData);
      track('generate_lead', { lead_type: 'contact' });
      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        subject: '',
        message: '',
        website: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطا در ارسال پیام. لطفا دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'تلفن تماس',
      value: business.phoneDisplay,
      link: telHref,
    },
    ...(business.email ? [{
      icon: Mail,
      title: 'ایمیل',
      value: business.email,
      link: `mailto:${business.email}`,
    }] : []),
    {
      icon: MapPin,
      title: 'آدرس',
      value: business.address,
      link: null,
    },
    {
      icon: Clock,
      title: 'ساعت کاری',
      value: business.hours,
      link: null,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      {/* هدر */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
          تماس با ما
        </h1>
        <p className="text-[var(--color-muted)] text-lg max-w-2xl mx-auto">
          برای دریافت مشاوره رایگان و اطلاعات بیشتر با ما در تماس باشید
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* فرم تماس */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">
              ارسال پیام
            </h2>

            {success && (
              <div className="bg-green-900/20 border border-green-500 text-green-400 rounded-lg p-4 mb-6">
                پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-[var(--color-accent)] text-[var(--color-accent)] rounded-lg p-4 mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="نام و نام خانوادگی"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="نام خود را وارد کنید"
                />
                <Input
                  label="شماره تماس"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="۰۹۱۲-۳۴۵-۶۷۸۹"
                />
              </div>

              <Input
                label="موضوع"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="موضوع پیام خود را وارد کنید"
              />

              <Textarea
                label="پیام"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="متن پیام خود را اینجا بنویسید..."
                rows={6}
              />

              <Button
                type="submit"
                variant="accent"
                size="lg"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'در حال ارسال...' : 'ارسال پیام'}
                <Send className="w-5 h-5 mr-2" />
              </Button>
            </form>
          </Card>
        </div>

        {/* اطلاعات تماس */}
        <div className="space-y-6">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            const content = (
              <Card hover={!!info.link}>
                <div className="flex items-start gap-4">
                  <div className="bg-[var(--color-primary)] p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">
                      {info.title}
                    </h3>
                    <p className="text-[var(--color-muted)] leading-relaxed">
                      {info.value}
                    </p>
                  </div>
                </div>
              </Card>
            );

            return info.link ? (
              <a key={index} href={info.link}>
                {content}
              </a>
            ) : (
              <div key={index}>{content}</div>
            );
          })}

          <Card>
            <h3 className="text-lg font-bold text-[var(--color-text)] mb-3">آدرس و مسیریابی</h3>
            <p className="text-[var(--color-text)] mb-4">{business.address}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium bg-[var(--color-btn-primary)] text-[var(--color-btn-text)]"
            >
              جستجوی آدرس در Google Maps
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
}
