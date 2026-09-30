'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import StatCard from '@/components/admin/StatCard';
import RecentAppointments from '@/components/admin/RecentAppointments';
import { Calendar, Clock, BookOpen, Mail, Loader2, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

interface DashboardStats {
  todayAppointments: number;
  pendingAppointments: number;
  totalArticles: number;
  newMessages: number;
}

interface Appointment {
  _id: string;
  name: string;
  phone: string;
  carModel: string;
  date: string;
  time: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  trackingCode: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    todayAppointments: 0,
    pendingAppointments: 0,
    totalArticles: 0,
    newMessages: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch appointments
      const appointmentsRes = await api.get('/appointments');
      const appointments = Array.isArray(appointmentsRes.data) 
        ? appointmentsRes.data 
        : (appointmentsRes.data.appointments || []);

      // محاسبه آمار
      const today = new Date().toISOString().split('T')[0];
      const todayCount = appointments.filter((a: Appointment) => a.date === today).length;
      const pendingCount = appointments.filter((a: Appointment) => a.status === 'pending').length;

      // Fetch articles count
      const articlesRes = await api.get('/articles');
      const articles = Array.isArray(articlesRes.data)
        ? articlesRes.data
        : (articlesRes.data.articles || []);
      const articlesCount = articles.length;

      // Fetch messages (فرض: API برای messages موجود است)
      let messagesCount = 0;
      try {
        const messagesRes = await api.get('/messages');
        const messages = Array.isArray(messagesRes.data)
          ? messagesRes.data
          : (messagesRes.data.messages || []);
        messagesCount = messages.filter((m: any) => m.status === 'new').length;
      } catch {
        // اگر API نباشد، 0 نشان بده
      }

      setStats({
        todayAppointments: todayCount,
        pendingAppointments: pendingCount,
        totalArticles: articlesCount,
        newMessages: messagesCount,
      });

      // آخرین 5 نوبت
      const recent = appointments
        .sort((a: Appointment, b: Appointment) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, 5);
      
      setRecentAppointments(recent);
    } catch (err: any) {
      console.error('خطا در دریافت داده‌ها:', err);
      setError('خطا در بارگذاری اطلاعات داشبورد');
    } finally {
      setLoading(false);
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
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#252525' }}>داشبورد</h1>
        <p style={{ color: '#545454' }}>
          خوش آمدید، {user?.identifier} 👋
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="نوبت امروز"
          value={stats.todayAppointments}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="در انتظار تأیید"
          value={stats.pendingAppointments}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="مقالات منتشر شده"
          value={stats.totalArticles}
          icon={BookOpen}
          color="purple"
        />
        <StatCard
          title="پیام‌های جدید"
          value={stats.newMessages}
          icon={Mail}
          color="green"
        />
      </div>

      {/* Recent Appointments */}
      <div>
        <RecentAppointments appointments={recentAppointments} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/admin/appointments"
          className="p-6 border rounded-xl transition-all group"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0' }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#252525'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E0E0E0'}
        >
          <Calendar className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" style={{ color: '#3B82F6' }} />
          <h3 className="text-lg font-bold mb-1" style={{ color: '#252525' }}>مدیریت نوبت‌ها</h3>
          <p className="text-sm" style={{ color: '#545454' }}>مشاهده و مدیریت نوبت‌های رزرو شده</p>
        </a>

        <a
          href="/admin/wiki"
          className="p-6 border rounded-xl transition-all group"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0' }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#252525'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E0E0E0'}
        >
          <BookOpen className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" style={{ color: '#A855F7' }} />
          <h3 className="text-lg font-bold mb-1" style={{ color: '#252525' }}>مدیریت دانشنامه</h3>
          <p className="text-sm" style={{ color: '#545454' }}>افزودن و ویرایش مقالات</p>
        </a>

        <a
          href="/admin/messages"
          className="p-6 border rounded-xl transition-all group"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0' }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#252525'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E0E0E0'}
        >
          <Mail className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" style={{ color: '#10B981' }} />
          <h3 className="text-lg font-bold mb-1" style={{ color: '#252525' }}>پیام‌های تماس</h3>
          <p className="text-sm" style={{ color: '#545454' }}>مشاهده پیام‌های دریافتی</p>
        </a>
      </div>
    </div>
  );
}
