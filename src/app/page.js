import { getSchemes, getGovernmentOrders, getQuickLinks, getSiteStats, getNews } from '@/lib/supabase';
import AudioClassesSection from '@/components/AudioClassesSection';
import Hero from '@/components/Hero';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import ToolsSection from '@/components/ToolsSection';
import OrdersSection from '@/components/OrdersSection';
import NewSection from '@/components/NewSection';
import ArticlesSection from '@/components/ArticlesSection';
import ExperiencesSection from '@/components/ExperiencesSection';
import ForumSection from '@/components/ForumSection';
import TrendingArticle from '@/components/TrendingArticle';
import QuickLinksSection from '@/components/QuickLinksSection';
import SchemesSection from '@/components/SchemesSection';
import DepartmentalTestsSection from '@/components/DepartmentalTestsSection';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

export const revalidate = 3600;

export default async function HomePage() {
  const [schemes, orders, quickLinks, stats, news] = await Promise.all([
    getSchemes(),
    getGovernmentOrders(),
    getQuickLinks(),
    getSiteStats(),
    getNews(),
  ]);

  return (
    <div className="relative min-h-screen bg-aurora overflow-x-hidden">

      {/* 1. Hero — compact */}
      <Hero />

      {/* 2. Live breaking news ticker */}
      <AnnouncementBanner />

      {/* 3. Tools & Calculators — first thing users see */}
      <ScrollReveal direction="up" delay={0}>
        <ToolsSection />
      </ScrollReveal>

      {/* 4 & 5. Orders + News — side by side */}
      <div className="px-4 md:px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <ScrollReveal direction="up" delay={100}>
            <OrdersSection orders={orders} />
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <section id="news">
              <NewSection news={news} />
            </section>
          </ScrollReveal>
        </div>
      </div>

      {/* Trending Article */}
      <TrendingArticle />

      {/* 5b. Articles */}
      <ScrollReveal direction="up" delay={100}>
        <ArticlesSection />
      </ScrollReveal>

      {/* Employee Experiences */}
      <ScrollReveal direction="up" delay={100}>
        <ExperiencesSection />
      </ScrollReveal>

      {/* 6. Forum — recent discussions */}
      <ScrollReveal direction="up" delay={100}>
        <ForumSection />
      </ScrollReveal>

      {/* 7. Audio Classes */}
      <ScrollReveal direction="up" delay={100}>
        <AudioClassesSection />
      </ScrollReveal>

      {/* 7. Departmental Tests */}
      <ScrollReveal direction="up" delay={100}>
        <DepartmentalTestsSection />
      </ScrollReveal>

      {/* 7. Schemes */}
      <ScrollReveal direction="up" delay={100}>
        <SchemesSection schemes={schemes} />
      </ScrollReveal>

      {/* 8. Quick Links — portals users need daily */}
      <ScrollReveal direction="up" delay={100}>
        <QuickLinksSection links={quickLinks} />
      </ScrollReveal>

      {/* 9. Footer */}
      <ScrollReveal direction="fade" delay={0}>
        <Footer />
      </ScrollReveal>
    </div>
  );
}
