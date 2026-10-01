import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'رزرو نوبت',
  alternates: { canonical: '/booking' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
