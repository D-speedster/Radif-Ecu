'use client';

import React, { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
  Calendar,
  Clock,
  Car,
  Phone,
  Loader2,
  AlertCircle,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { toJalali } from '@/lib/utils';
import api from '@/lib/api';

interface Appointment {
  _id: string;
  name: string;
  phone: string;
  carModel: string;
  serviceType: string;
  date: string;
  timeSlot: string;
  description?: string;
  trackingCode: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: string;
}

const statusConfig = {
  Pending: { label: 'در انتظار', color: 'yellow' as const },
  'In Progress': { label: 'در حال انجام', color: 'blue' as const },
  Completed: { label: 'انجام شده', color: 'green' as const },
};

const serviceTypeLabels: Record<string, string> = {
  hardware: 'تعمیرات سخت‌افزار',
  remap: 'ریمپ و تیونینگ',
  multiplex: 'مالتی‌پلکس و دیاگ',
  dump: 'خواندن/نوشتن دامپ',
};

type StatusFilter = 'all' | 'Pending' | 'In Progress' | 'Completed';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(
        appointments.filter((a) => a.status === statusFilter)
      );
    }
  }, [statusFilter, appointments]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/appointments');
      const data = Array.isArray(response.data) 
        ? response.data 
        : (response.data.appointments || []);
      
      const sorted = data.sort(
        (a: Appointment, b: Appointment) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setAppointments(sorted);
      setFilteredAppointments(sorted);
    } catch (err: any) {
      console.error('خطا در دریافت نوبت‌ها:', err);
      setError('خطا در بارگذاری نوبت‌ها');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: Appointment['status']
  ) => {
    setUpdatingId(id);

    try {
      await api.patch(`/appointments/${id}/status`, { status: newStatus });
      
      // به‌روزرسانی لوکال
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
      );
    } catch (err: any) {
      console.error('خطا در تغییر وضعیت:', err);
      alert('خطا در تغییر وضعیت. لطفا دوباره تلاش کنید.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این نوبت اطمینان دارید؟')) {
      return;
    }

    try {
      await api.delete(`/appointments/${id}`);
      setAppointments((prev) => prev.filter((a) => a._id !== id));
    } catch (err: any) {
      console.error('خطا در حذف نوبت:', err);
      alert('خطا در حذف نوبت. لطفا دوباره تلاش کنید.');
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
        <Button onClick={fetchAppointments} variant="primary">
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
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#252525' }}>مدیریت نوبت‌ها</h1>
          <p style={{ color: '#545454' }}>
            تعداد کل: {appointments.length} نوبت
          </p>
        </div>
        <Button onClick={fetchAppointments} variant="secondary">
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
            همه ({appointments.length})
          </button>
          {Object.entries(statusConfig).map(([key, config]) => {
            const count = appointments.filter((a) => a.status === key).length;
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

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <Card className="p-12 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#7D7D7D' }} />
          <p style={{ color: '#545454' }}>هیچ نوبتی یافت نشد</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment._id} className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* اطلاعات اصلی */}
                <div className="flex-1 space-y-4">
                  {/* سطر اول: نام + وضعیت */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold mb-1" style={{ color: '#252525' }}>
                        {appointment.name}
                      </h3>
                      <p className="text-sm flex items-center gap-2" style={{ color: '#545454' }}>
                        <Phone className="w-3 h-3" />
                        {appointment.phone}
                      </p>
                    </div>
                    <Badge color={statusConfig[appointment.status].color}>
                      {statusConfig[appointment.status].label}
                    </Badge>
                  </div>

                  {/* جزئیات */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm" style={{ color: '#252525' }}>
                      <Car className="w-4 h-4" style={{ color: '#7D7D7D' }} />
                      <span>{appointment.carModel}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: '#252525' }}>
                      <span style={{ color: '#7D7D7D' }}>خدمت:</span>
                      <span>
                        {serviceTypeLabels[appointment.serviceType] ||
                          appointment.serviceType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: '#252525' }}>
                      <Calendar className="w-4 h-4" style={{ color: '#7D7D7D' }} />
                      <span>{toJalali(appointment.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: '#252525' }}>
                      <Clock className="w-4 h-4" style={{ color: '#7D7D7D' }} />
                      <span>{appointment.timeSlot}</span>
                    </div>
                  </div>

                  {/* توضیحات */}
                  {appointment.description && (
                    <div className="rounded-lg p-3" style={{ backgroundColor: '#F5F5F5' }}>
                      <p className="text-xs mb-1" style={{ color: '#7D7D7D' }}>توضیحات:</p>
                      <p className="text-sm" style={{ color: '#252525' }}>
                        {appointment.description}
                      </p>
                    </div>
                  )}

                  {/* کد پیگیری */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: '#7D7D7D' }}>کد پیگیری:</span>
                    <span className="text-sm font-mono" style={{ color: '#3B82F6' }}>
                      {appointment.trackingCode}
                    </span>
                  </div>
                </div>

                {/* اکشن‌ها */}
                <div className="lg:w-48 flex lg:flex-col gap-2">
                  <select
                    value={appointment.status}
                    onChange={(e) =>
                      handleStatusChange(
                        appointment._id,
                        e.target.value as Appointment['status']
                      )
                    }
                    disabled={updatingId === appointment._id}
                    className="flex-1 lg:flex-none px-3 py-2 border rounded-lg text-sm focus:outline-none disabled:opacity-50"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E0E0E0',
                      color: '#252525'
                    }}
                  >
                    <option value="Pending">در انتظار</option>
                    <option value="In Progress">در حال انجام</option>
                    <option value="Completed">انجام شده</option>
                  </select>

                  <button
                    onClick={() => handleDelete(appointment._id)}
                    className="px-4 py-2 border rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: '#FEE',
                      color: '#C53030',
                      borderColor: '#FCC'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FDD'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FEE'}
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
