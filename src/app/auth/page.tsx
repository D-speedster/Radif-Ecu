'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Lock, User, Loader2, Shield } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { user, loading: authLoading, login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // اگر قبلاً لاگین کرده، به پنل ادمین هدایت شود
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/admin');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password.trim()) {
      setError('لطفا تمام فیلدها را پر کنید');
      return;
    }

    setLoading(true);

    try {
      await login(identifier, password);
    } catch (err: any) {
      setError(err.message || 'خطا در ورود. لطفا دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#252525' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="w-full max-w-md">
        {/* لوگو/هدر */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#F0F0F0' }}>
            <Shield className="w-8 h-8" style={{ color: '#252525' }} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#252525' }}>پنل مدیریت</h1>
          <p style={{ color: '#545454' }}>ردیف ایسیو</p>
        </div>

        {/* فرم لاگین */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* نام کاربری */}
            <div>
              <Input
                label="نام کاربری"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin"
                disabled={loading}
              />
              <div className="flex items-center gap-2 mt-2 text-sm" style={{ color: '#7D7D7D' }}>
                <User className="w-4 h-4" />
                <span>نام کاربری خود را وارد کنید</span>
              </div>
            </div>

            {/* رمز عبور */}
            <div>
              <Input
                label="رمز عبور"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
              />
              <div className="flex items-center gap-2 mt-2 text-sm" style={{ color: '#7D7D7D' }}>
                <Lock className="w-4 h-4" />
                <span>رمز عبور خود را وارد کنید</span>
              </div>
            </div>

            {/* خطا */}
            {error && (
              <div className="border rounded-lg p-3 text-center" style={{ backgroundColor: '#FEE', borderColor: '#F88' }}>
                <p className="text-sm" style={{ color: '#C33' }}>{error}</p>
              </div>
            )}

            {/* دکمه ورود */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  در حال ورود...
                </>
              ) : (
                'ورود به پنل'
              )}
            </Button>
          </form>

          {/* نکته امنیتی */}
          <div className="mt-6 pt-6" style={{ borderTop: '1px solid #E0E0E0' }}>
            <p className="text-xs text-center" style={{ color: '#7D7D7D' }}>
              🔒 این صفحه محافظت شده است. فقط مدیران مجاز می‌توانند وارد شوند.
            </p>
          </div>
        </Card>

        {/* لینک بازگشت */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm transition-colors"
            style={{ color: '#545454' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#252525'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#545454'}
          >
            بازگشت به صفحه اصلی →
          </a>
        </div>
      </div>
    </div>
  );
}
