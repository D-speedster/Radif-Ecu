import React from 'react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { Calendar, Clock, MessageSquare } from 'lucide-react';

interface Step2Props {
  formData: {
    date: string;
    time: string;
    description: string;
  };
  errors: {
    date?: string;
    time?: string;
  };
  onChange: (field: string, value: string) => void;
}

// ساعت کاری: ۱۲ تا ۲۰ (آخرین نوبت ۱۹:۳۰)
const timeSlots = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
];

export default function Step2DateTime({ formData, errors, onChange }: Step2Props) {
  // تولید تاریخ‌های ۷ روز آینده (به شمسی تبدیل می‌شود)
  const getNextDays = (count: number) => {
    const days = [];
    const today = new Date();
    
    // جمعه تعطیل است؛ تاریخ با ساعت محلی ساخته می‌شود (نه UTC)
    let offset = 1;
    while (days.length < count) {
      const date = new Date(today);
      date.setDate(today.getDate() + offset);
      offset++;
      if (date.getDay() === 5) continue;
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      days.push(`${y}-${m}-${d}`);
    }
    
    return days;
  };

  const availableDates = getNextDays(7);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#252525' }}>
          انتخاب تاریخ و ساعت
        </h2>
        <p style={{ color: '#545454' }}>
          تاریخ و ساعت مورد نظر خود را انتخاب کنید
        </p>
      </div>

      {/* انتخاب تاریخ */}
      <div>
        <label className="block text-sm font-medium mb-3" style={{ color: '#252525' }}>
          <Calendar className="w-4 h-4 inline ml-2" />
          تاریخ مراجعه
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {availableDates.map((date) => {
            const dateObj = new Date(date);
            const dayName = dateObj.toLocaleDateString('fa-IR', { weekday: 'long' });
            const dayNumber = dateObj.toLocaleDateString('fa-IR', { day: 'numeric', month: 'long' });
            
            return (
              <button
                key={date}
                type="button"
                onClick={() => onChange('date', date)}
                className="p-3 rounded-lg border-2 transition-all"
                style={{
                  backgroundColor: formData.date === date ? '#F5F5F5' : '#FFFFFF',
                  borderColor: formData.date === date ? '#252525' : '#E0E0E0'
                }}
                onMouseEnter={(e) => {
                  if (formData.date !== date) {
                    e.currentTarget.style.borderColor = '#CFCFCF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.date !== date) {
                    e.currentTarget.style.borderColor = '#E0E0E0';
                  }
                }}
              >
                <p className="text-xs" style={{ color: '#7D7D7D' }}>{dayName}</p>
                <p className="text-sm font-medium mt-1" style={{ color: '#252525' }}>{dayNumber}</p>
              </button>
            );
          })}
        </div>
        {errors.date && (
          <p className="mt-2 text-sm text-red-500">{errors.date}</p>
        )}
      </div>

      {/* انتخاب ساعت */}
      <div>
        <label className="block text-sm font-medium mb-3" style={{ color: '#252525' }}>
          <Clock className="w-4 h-4 inline ml-2" />
          ساعت مراجعه
        </label>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {timeSlots.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => onChange('time', time)}
              className="p-3 rounded-lg border-2 transition-all text-center"
              style={{
                backgroundColor: formData.time === time ? '#F5F5F5' : '#FFFFFF',
                borderColor: formData.time === time ? '#252525' : '#E0E0E0'
              }}
              onMouseEnter={(e) => {
                if (formData.time !== time) {
                  e.currentTarget.style.borderColor = '#CFCFCF';
                }
              }}
              onMouseLeave={(e) => {
                if (formData.time !== time) {
                  e.currentTarget.style.borderColor = '#E0E0E0';
                }
              }}
            >
              <span className="text-sm font-medium" style={{ color: '#252525' }}>{time}</span>
            </button>
          ))}
        </div>
        {errors.time && (
          <p className="mt-2 text-sm text-red-500">{errors.time}</p>
        )}
        <p className="mt-3 text-xs" style={{ color: '#7D7D7D' }}>
          ساعات کاری: شنبه تا پنج‌شنبه، ۹ صبح تا ۶ عصر
        </p>
      </div>

      {/* توضیحات اختیاری */}
      <div>
        <Textarea
          label="توضیحات (اختیاری)"
          name="description"
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="توضیحات تکمیلی در مورد مشکل خودرو یا درخواست خاص..."
          rows={4}
        />
        <div className="flex items-center gap-2 mt-2 text-sm" style={{ color: '#7D7D7D' }}>
          <MessageSquare className="w-4 h-4" />
          <span>هر توضیح اضافی که لازم است</span>
        </div>
      </div>
    </div>
  );
}
