import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Calendar, Clock, Car, ArrowLeft } from 'lucide-react';
import { toJalali } from '@/lib/utils';

interface Appointment {
  _id: string;
  name: string;
  phone: string;
  carModel: string;
  date: string;
  timeSlot: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  trackingCode: string;
}

interface RecentAppointmentsProps {
  appointments: Appointment[];
}

const statusConfig = {
  Pending: { label: 'در انتظار', color: 'yellow' as const },
  'In Progress': { label: 'در حال انجام', color: 'blue' as const },
  Completed: { label: 'انجام شده', color: 'green' as const },
};

export default function RecentAppointments({ appointments }: RecentAppointmentsProps) {
  if (appointments.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p style={{ color: '#545454' }}>هیچ نوبتی یافت نشد</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold" style={{ color: '#252525' }}>آخرین نوبت‌ها</h3>
        <Link href="/admin/appointments">
          <Button variant="secondary" size="sm">
            مشاهده همه
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment._id}
            className="flex items-center gap-4 p-4 rounded-lg transition-colors"
            style={{ backgroundColor: '#F5F5F5' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFEFEF'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
          >
            {/* آیکون */}
            <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EBF5FF' }}>
              <Car className="w-6 h-6" style={{ color: '#3B82F6' }} />
            </div>

            {/* اطلاعات */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium truncate" style={{ color: '#252525' }}>{appointment.name}</p>
                <Badge color={statusConfig[appointment.status].color}>
                  {statusConfig[appointment.status].label}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm" style={{ color: '#545454' }}>
                <span className="flex items-center gap-1">
                  <Car className="w-3 h-3" />
                  {appointment.carModel}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {toJalali(appointment.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {appointment.timeSlot}
                </span>
              </div>
            </div>

            {/* کد پیگیری */}
            <div className="text-left">
              <p className="text-xs" style={{ color: '#7D7D7D' }}>کد پیگیری</p>
              <p className="text-sm font-mono" style={{ color: '#3B82F6' }}>{appointment.trackingCode}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
