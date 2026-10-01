import { MetadataRoute } from 'next';
import { business } from '@/config/business';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || business.url;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /auth و /booking/success|track اینجا نیامده‌اند تا گوگل تگ noindex را ببیند
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
