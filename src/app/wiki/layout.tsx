import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'دانشنامه ECU',
  alternates: { canonical: '/wiki' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
