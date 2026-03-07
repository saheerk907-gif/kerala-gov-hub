import { getSchemes, getGovernmentOrders, getQuickLinks, getSiteStats, getHighlights, getNews } from '@/lib/supabase';
import AudioClassesSection from '@/components/AudioClassesSection';
import Hero from '@/components/Hero';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import SectionNav from '@/components/SectionNav';
import ToolsSection from '@/components/ToolsSection';
import OrdersSection from '@/components/OrdersSection';
import NewSection from '@/components/NewSection';
import ArticlesSection from '@/components/ArticlesSection';
import TrendingArticle from '@/components/TrendingArticle';
import QuickLinksSection from '@/components/QuickLinksSection';
import SchemesSection from '@/components/SchemesSection';
import DepartmentalTestsSection from '@/components/DepartmentalTestsSection';
import HighlightsSection from '@/components/HighlightsSection';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

export const revalidate = 3600;

export default async function HomePage() {
  const [schemes, orders, quickLinks, stats, highlights, news] = await Promise.all([
    getSchemes(),
    getGovernmentOrders(),
    getQuickLinks(),
    getSiteStats(),
    getHighlights(),
    getNews(),
  ]);

  return (
    <div className="relative min-h-screen bg-aurora overflow-x-hidden">

      {/* 1. Hero — compact */}
      <Hero />

      {/* 2. Live breaking news ticker */}
      <AnnouncementBanner />

      {/* 3. Sticky section jump bar (appears after scrolling) */}
      <SectionNav />

      {/* Trending Article */}
      <TrendingArticle />

      {/* 3. Tools & Calculators — first thing users see */}
      <ScrollReveal direction="up" delay={0}>
        <ToolsSection />
      </ScrollReveal>

      {/* 4 & 5. Orders + News — side by side */}
      <div className="px-4 md:px-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <ScrollReveal direction="up" delay={0}>
            <OrdersSection orders={orders} />
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0}>
            <section id="news" className="py-8">
              <NewSection news={news} />
            </section>
          </ScrollReveal>
        </div>
      </div>

      {/* 5b. Articles */}
      <ScrollReveal direction="up" delay={0}>
        <ArticlesSection />
      </ScrollReveal>

      {/* 6. Audio Classes */}
      <ScrollReveal direction="up" delay={0}>
        <AudioClassesSection />
      </ScrollReveal>

      {/* 7. Departmental Tests */}
      <ScrollReveal direction="up" delay={0}>
        <DepartmentalTestsSection />
      </ScrollReveal>

      {/* 7. Schemes */}
      <ScrollReveal direction="up" delay={0}>
        <SchemesSection schemes={schemes} />
      </ScrollReveal>

      {/* 8. Quick Links — portals users need daily */}
      <ScrollReveal direction="up" delay={0}>
        <QuickLinksSection links={quickLinks} />
      </ScrollReveal>

      {/* 9. Highlights */}
      <ScrollReveal direction="up" delay={0}>
        <HighlightsSection highlights={highlights} />
      </ScrollReveal>

      {/* 10. Footer */}
      <ScrollReveal direction="fade" delay={0}>
        <Footer />
      </ScrollReveal>
    </div>
  );
}
