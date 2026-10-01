'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { track } from '@/lib/track';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function Analytics() {
  // ردیابی کلیک تماس و واتساپ روی هر لینک سایت (بدون دست‌زدن به تک‌تک لینک‌ها)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      if (href.startsWith('tel:')) {
        track('phone_click', { link_url: href });
      } else if (/wa\.me|whatsapp\.com/.test(href)) {
        track('whatsapp_click', { link_url: href });
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  if (!GTM_ID) return null;

  return (
    <Script id="gtm" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}
