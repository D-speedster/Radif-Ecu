'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  Mail,
  BookOpen,
  LogOut,
  Loader2,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/admin', label: 'داشبورد', icon: LayoutDashboard },
  { href: '/admin/appointments', label: 'نوبت‌ها', icon: Calendar },
  { href: '/admin/messages', label: 'پیام‌ها', icon: Mail },
  { href: '/admin/wiki', label: 'دانشنامه', icon: BookOpen },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Guard: اگر لاگین نکرده، به صفحه ورود هدایت شود
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  // نمایش Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#252525' }} />
      </div>
    );
  }

  // اگر لاگین نکرده، چیزی نمایش ندهیم
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Sidebar Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow border-l" style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0' }}>
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b" style={{ borderColor: '#E0E0E0' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EBF5FF' }}>
              <LayoutDashboard className="w-6 h-6" style={{ color: '#3B82F6' }} />
            </div>
            <div>
              <h1 className="font-bold" style={{ color: '#252525' }}>پنل مدیریت</h1>
              <p className="text-xs" style={{ color: '#7D7D7D' }}>ردیف ایسیو</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'font-medium'
                      : ''
                  }`}
                  style={{
                    backgroundColor: isActive ? '#EBF5FF' : 'transparent',
                    color: isActive ? '#3B82F6' : '#545454'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#F5F5F5';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info + Logout */}
          <div className="p-4 border-t" style={{ borderColor: '#E0E0E0' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EBF5FF' }}>
                <span className="font-bold" style={{ color: '#3B82F6' }}>
                  {user.identifier?.[0]?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: '#252525' }}>{user.identifier}</p>
                <p className="text-xs" style={{ color: '#7D7D7D' }}>مدیر سیستم</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all"
              style={{ backgroundColor: '#FEE', color: '#C53030' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FDD'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FEE'}
            >
              <LogOut className="w-4 h-4" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 border-b" style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0' }}>
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2"
            style={{ color: '#545454' }}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-bold" style={{ color: '#252525' }}>پنل مدیریت</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setSidebarOpen(false)}>
          <aside
            className="fixed inset-y-0 right-0 w-64 border-l"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#E0E0E0' }}>
                <h1 className="font-bold" style={{ color: '#252525' }}>پنل مدیریت</h1>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2"
                  style={{ color: '#545454' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive ? 'font-medium' : ''
                      }`}
                      style={{
                        backgroundColor: isActive ? '#EBF5FF' : 'transparent',
                        color: isActive ? '#3B82F6' : '#545454'
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* User + Logout */}
              <div className="p-4 border-t" style={{ borderColor: '#E0E0E0' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EBF5FF' }}>
                    <span className="font-bold" style={{ color: '#3B82F6' }}>
                      {user.identifier?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#252525' }}>{user.identifier}</p>
                    <p className="text-xs" style={{ color: '#7D7D7D' }}>مدیر سیستم</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all"
                  style={{ backgroundColor: '#FEE', color: '#C53030' }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>خروج</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:pr-64 min-h-screen">
        <div className="pt-16 lg:pt-0 p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
