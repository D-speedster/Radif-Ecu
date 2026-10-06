import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LandingPage as LandingPageType } from '@/types';
import LandingPageView from '@/components/landing/LandingPageView';

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const response = await fetch(
      `${process.env.INTERNAL_API_URL || 'http://localhost:5000/api'}/landing-pages/${params.slug}`,
      { next: { revalidate: 10 } }
    );

    if (!response.ok) {
      return {
        title: 'صفحه یافت نشد',
        description: 'صفحه مورد نظر یافت نشد',
      };
    }

    const data = await response.json();
    const landingPage: LandingPageType = data.landingPage || data;

    return {
      title: landingPage.metaTitle || landingPage.title || 'رادیف ECU',
      description: landingPage.metaDescription || 'سرویس تخصصی رادیف ECU',
      keywords: landingPage.keywords || [],
      openGraph: {
        title: landingPage.metaTitle || landingPage.title,
        description: landingPage.metaDescription || '',
        type: 'website',
      },
      alternates: {
        canonical: `/page/${params.slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'رادیف ECU',
      description: 'سرویس تخصصی رادیف ECU',
    };
  }
}

// Fetch landing page data
async function getLandingPage(slug: string): Promise<LandingPageType | null> {
  try {
    const response = await fetch(
      `${process.env.INTERNAL_API_URL || 'http://localhost:5000/api'}/landing-pages/${slug}`,
      { next: { revalidate: 10 } }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.landingPage || data;
  } catch (error) {
    console.error('Error fetching landing page:', error);
    return null;
  }
}

export default async function CustomPage({ params }: PageProps) {
  const landingPage = await getLandingPage(params.slug);

  if (!landingPage || !landingPage.published) {
    notFound();
  }

  return <LandingPageView landingPage={landingPage} />;
}
