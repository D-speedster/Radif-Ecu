import { MetadataRoute } from 'next';
import { business } from '@/config/business';

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || business.url;

// ⭐ تولید sitemap دینامیک
// هر بار هنگام درخواست از بکاند خوانده شود (نه یک بار هنگام build که بکاند بالا نیست)
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // صفحات استاتیک
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/remap`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/repair-ecu`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/wiki`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/booking`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // دریافت مقالات از API
  try {
    const articlesResponse = await fetch(`${API_URL}/articles`, {
      next: { revalidate: 86400 }, // revalidate هر 24 ساعت
    });

    // دریافت landing pages از API
    const landingPagesResponse = await fetch(`${API_URL}/landing-pages`, {
      next: { revalidate: 86400 },
    });

    const articlePages: MetadataRoute.Sitemap = [];
    const landingPages: MetadataRoute.Sitemap = [];

    // پردازش مقالات
    if (articlesResponse.ok) {
      const articlesData = await articlesResponse.json();
      const articles = articlesData.articles || articlesData;

      articlePages.push(
        ...articles
          .filter((article: { published?: boolean }) => article.published !== false)
          .map((article: { slug?: string; _id: string; updatedAt?: string; createdAt: string }) => ({
            url: `${SITE_URL}/wiki/${article.slug || article._id}`,
            lastModified: new Date(article.updatedAt || article.createdAt),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          }))
      );
    } else {
      console.error('خطا در دریافت مقالات برای sitemap');
    }

    // پردازش landing pages
    if (landingPagesResponse.ok) {
      const landingPagesData = await landingPagesResponse.json();
      const pages = landingPagesData.landingPages || landingPagesData;

      landingPages.push(
        ...pages
          .filter((page: { published?: boolean }) => page.published !== false)
          .map((page: { slug: string; updatedAt?: string; createdAt: string }) => ({
            url: `${SITE_URL}/page/${page.slug}`,
            lastModified: new Date(page.updatedAt || page.createdAt),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
          }))
      );
    } else {
      console.error('خطا در دریافت landing pages برای sitemap');
    }

    return [...staticPages, ...articlePages, ...landingPages];
  } catch (error) {
    console.error('خطا در تولید sitemap:', error);
    return staticPages;
  }
}
