import { getSchemes, getGovernmentOrders, getQuickLinks, getSiteStats, getHighlights, getNews } from '@/lib/supabase';
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

      {/* 4. Latest Government Orders */}
      <ScrollReveal direction="up" delay={0}>
        <OrdersSection orders={orders} />
      </ScrollReveal>

      {/* 5. News */}
      <section id="news" className="py-14 px-4 md:px-6 max-w-[1400px] mx-auto">
        <ScrollReveal direction="up" delay={0}>
          <NewSection news={news} />
        </ScrollReveal>
      </section>

      {/* 5b. Articles */}
      <ScrollReveal direction="up" delay={0}>
        <ArticlesSection />
      </ScrollReveal>

      {/* 6. Quick Links — portals users need daily */}
      <ScrollReveal direction="up" delay={0}>
        <QuickLinksSection links={quickLinks} />
      </ScrollReveal>

      {/* 7. Schemes */}
      <ScrollReveal direction="up" delay={0}>
        <SchemesSection schemes={schemes} />
      </ScrollReveal>

      {/* 8. Departmental Tests */}
      <ScrollReveal direction="up" delay={0}>
        <DepartmentalTestsSection />
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
