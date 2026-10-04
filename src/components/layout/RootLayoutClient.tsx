'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/AuthContext';
import Analytics from '@/components/analytics/Analytics';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyContactBar from '@/components/layout/StickyContactBar';

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // بررسی اینکه آیا در صفحات ادمین یا auth هستیم
  const isAdminRoute = pathname?.startsWith('/admin');
  const isAuthRoute = pathname?.startsWith('/auth');
  
  // صفحاتی که نباید Navbar/Footer داشته باشند
  const hideLayout = isAdminRoute || isAuthRoute;

  return (
    <AuthProvider>
      <Analytics />
      {!hideLayout && <Navbar />}
      <main className={hideLayout ? '' : 'flex-1 pb-16 md:pb-0'}>
        {children}
      </main>
      {!hideLayout && <Footer />}
      {!hideLayout && <StickyContactBar />}
    </AuthProvider>
  );
}
