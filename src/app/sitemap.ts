import { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://radif-ecu.ir';

// ⭐ تولید sitemap دینامیک
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // صفحات استاتیک
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/wiki`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/booking`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // دریافت مقالات از API
  try {
    const response = await fetch(`${API_URL}/articles`, {
      next: { revalidate: 3600 }, // revalidate هر ساعت
    });

    if (!response.ok) {
      console.error('خطا در دریافت مقالات برای sitemap');
      return staticPages;
    }

    const data = await response.json();
    const articles = data.articles || data;

    // صفحات مقالات
    const articlePages: MetadataRoute.Sitemap = articles
      .filter((article: any) => article.isPublished)
      .map((article: any) => ({
        url: `${SITE_URL}/wiki/${article.slug || article._id}`,
        lastModified: new Date(article.updatedAt || article.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));

    return [...staticPages, ...articlePages];
  } catch (error) {
    console.error('خطا در تولید sitemap:', error);
    return staticPages;
  }
}
