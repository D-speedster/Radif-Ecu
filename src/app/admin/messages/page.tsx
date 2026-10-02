'use client';

import React, { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
  Mail,
  Phone,
  User,
  Loader2,
  AlertCircle,
  RefreshCw,
  Trash2,
  Calendar,
} from 'lucide-react';
import { toJalali } from '@/lib/utils';
import api from '@/lib/api';

interface Message {
  _id: string;
  name: string;
  phone: string;
  subject: string;
  message: string;
  status: 'New' | 'Read' | 'Replied';
  createdAt: string;
}

const statusConfig = {
  New: { label: 'جدید', color: 'yellow' as const },
  Read: { label: 'خوانده شده', color: 'blue' as const },
  Replied: { label: 'پاسخ داده شده', color: 'green' as const },
};

type StatusFilter = 'all' | 'New' | 'Read' | 'Replied';

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredMessages(messages);
    } else {
      setFilteredMessages(messages.filter((m) => m.status === statusFilter));
    }
  }, [statusFilter, messages]);

  const fetchMessages = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/contact');
      const data = Array.isArray(response.data)
        ? response.data
        : (response.data.messages || []);
      
      const sorted = data.sort(
        (a: Message, b: Message) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setMessages(sorted);
      setFilteredMessages(sorted);
    } catch (err: any) {
      console.error('خطا در دریافت پیام‌ها:', err);
      setError('خطا در بارگذاری پیام‌ها');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: Message['status']) => {
    setUpdatingId(id);

    try {
      await api.patch(`/contact/${id}/status`, { status: newStatus });

      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status: newStatus } : m))
      );
    } catch (err: any) {
      console.error('خطا در تغییر وضعیت:', err);
      alert('خطا در تغییر وضعیت. لطفا دوباره تلاش کنید.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این پیام اطمینان دارید؟')) {
      return;
    }

    try {
      await api.delete(`/contact/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err: any) {
      console.error('خطا در حذف پیام:', err);
      alert('خطا در حذف پیام. لطفا دوباره تلاش کنید.');
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
        <Button onClick={fetchMessages} variant="primary">
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
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#252525' }}>پیام‌های تماس</h1>
          <p style={{ color: '#545454' }}>تعداد کل: {messages.length} پیام</p>
        </div>
        <Button onClick={fetchMessages} variant="secondary">
          <RefreshCw className="w-4 h-4 ml-2" />
          به‌روزرسانی
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              statusFilter === 'all'
                ? 'text-white'
                : 'text-gray-700 hover:text-black'
            }`}
            style={{
              backgroundColor: statusFilter === 'all' ? '#252525' : '#F5F5F5'
            }}
          >
            همه ({messages.length})
          </button>
          {Object.entries(statusConfig).map(([key, config]) => {
            const count = messages.filter((m) => m.status === key).length;
            return (
              <button
                key={key}
                onClick={() => setStatusFilter(key as StatusFilter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === key
                    ? 'text-white'
                    : 'text-gray-700 hover:text-black'
                }`}
                style={{
                  backgroundColor: statusFilter === key ? '#252525' : '#F5F5F5'
                }}
              >
                {config.label} ({count})
              </button>
            );
          })}
        </div>
      </Card>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <Card className="p-12 text-center">
          <Mail className="w-12 h-12 mx-auto mb-4" style={{ color: '#7D7D7D' }} />
          <p style={{ color: '#545454' }}>هیچ پیامی یافت نشد</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <Card key={message._id} className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* محتوای پیام */}
                <div className="flex-1 space-y-4">
                  {/* هدر */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold" style={{ color: '#252525' }}>
                          {message.name}
                        </h3>
                        <Badge color={statusConfig[message.status].color}>
                          {statusConfig[message.status].label}
                        </Badge>
                      </div>
                      {message.subject && (
                        <div className="mb-2 text-sm font-medium" style={{ color: '#7D7D7D' }}>
                          موضوع: {message.subject}
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row gap-4 text-sm" style={{ color: '#545454' }}>
                        <span className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          {message.phone}
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {toJalali(message.createdAt.split('T')[0])}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* متن پیام */}
                  <div className="rounded-lg p-4" style={{ backgroundColor: '#F5F5F5' }}>
                    <p className="leading-relaxed whitespace-pre-wrap" style={{ color: '#252525' }}>
                      {message.message}
                    </p>
                  </div>
                </div>

                {/* اکشن‌ها */}
                <div className="lg:w-48 flex lg:flex-col gap-2">
                  <select
                    value={message.status}
                    onChange={(e) =>
                      handleStatusChange(
                        message._id,
                        e.target.value as Message['status']
                      )
                    }
                    disabled={updatingId === message._id}
                    className="flex-1 lg:flex-none px-3 py-2 border rounded-lg text-sm focus:outline-none disabled:opacity-50"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E0E0E0',
                      color: '#252525'
                    }}
                  >
                    <option value="New">جدید</option>
                    <option value="Read">خوانده شده</option>
                    <option value="Replied">پاسخ داده شده</option>
                  </select>

                  <a
                    href={`tel:${message.phone}`}
                    className="px-4 py-2 border rounded-lg transition-all text-sm font-medium text-center"
                    style={{
                      backgroundColor: '#EBF5FF',
                      color: '#3B82F6',
                      borderColor: '#BFDBFE'
                    }}
                  >
                    تماس تلفنی
                  </a>

                  <button
                    onClick={() => handleDelete(message._id)}
                    className="px-4 py-2 border rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: '#FEE',
                      color: '#C53030',
                      borderColor: '#FCC'
                    }}
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
