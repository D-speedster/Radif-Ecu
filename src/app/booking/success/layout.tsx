import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ثبت نوبت',
  alternates: { canonical: null },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
