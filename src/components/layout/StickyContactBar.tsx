'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Phone, MessageCircle } from 'lucide-react';
import { telHref, whatsappHref } from '@/config/business';

// نوار چسبان پایین صفحه، فقط موبایل
const MESSAGES: Record<string, string> = {
  '/remap': 'سلام، برای ریمپ سؤال دارم. خودرو: ',
  '/repair-ecu': 'سلام، برای تعمیر ECU سؤال دارم. خودرو: ',
};
const DEFAULT_MESSAGE = 'سلام، برای ریمپ / تعمیر ایسیو خودرو سؤال دارم.';

export default function StickyContactBar() {
  const pathname = usePathname();
  const text = MESSAGES[pathname] || DEFAULT_MESSAGE;
  return (
    <div
      className="md:hidden"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        gap: '8px',
        padding: '8px 12px calc(8px + env(safe-area-inset-bottom, 0px))',
        backgroundColor: '#0E1621',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
        fontFamily: 'YekanBakh, sans-serif',
      }}
    >
      <a
        href={telHref}
        aria-label="تماس تلفنی"
        style={{
          flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          height: '46px', borderRadius: '10px', backgroundColor: '#FFB020', color: '#1A1300',
          fontWeight: 700, fontSize: '0.9375rem', textDecoration: 'none',
        }}
      >
        <Phone style={{ width: 18, height: 18 }} />
        تماس
      </a>
      <a
        href={whatsappHref(text)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="پیام در واتساپ"
        style={{
          flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          height: '46px', borderRadius: '10px', backgroundColor: '#16A34A', color: '#FFFFFF',
          fontWeight: 700, fontSize: '0.9375rem', textDecoration: 'none',
        }}
      >
        <MessageCircle style={{ width: 18, height: 18 }} />
        واتساپ
      </a>
    </div>
  );
}
