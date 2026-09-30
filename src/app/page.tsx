import HeroSection from '@/components/home/HeroSection';
import ServicesGrid from '@/components/home/ServicesGrid';
import WhyUsSection from '@/components/home/WhyUsSection';
import LatestArticlesSection from '@/components/home/LatestArticlesSection';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesGrid />
      <WhyUsSection />
      <LatestArticlesSection />
      <CTASection />
    </>
  );
}
