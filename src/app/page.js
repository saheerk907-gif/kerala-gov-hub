import { getSchemes, getGovernmentOrders, getQuickLinks, getSiteStats, getHighlights, getNews } from '@/lib/supabase';
import Hero from '@/components/Hero';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import QuickInfoBar from '@/components/QuickInfoBar';
import ToolsSection from '@/components/ToolsSection';
import NewSection from '@/components/NewSection';
import SchemesSection from '@/components/SchemesSection';
import ImportantDatesSection from '@/components/ImportantDatesSection';
import HighlightsSection from '@/components/HighlightsSection';
import OrdersSection from '@/components/OrdersSection';
import DepartmentResourcesSection from '@/components/DepartmentResourcesSection';
import DepartmentalTestsSection from '@/components/DepartmentalTestsSection';
import QuickLinksSection from '@/components/QuickLinksSection';
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

      {/* 1. Hero */}
      <Hero />

      {/* 2. Announcement scrolling banner */}
      <AnnouncementBanner />

      {/* 3. Quick Reference — current rates & rules */}
      <ScrollReveal direction="up" delay={0}>
        <QuickInfoBar />
      </ScrollReveal>

      {/* 4. Tools & Calculators grid — most important, above the fold */}
      <ScrollReveal direction="up" delay={0}>
        <ToolsSection />
      </ScrollReveal>

      {/* 5. News — full width */}
      <section className="py-16 px-4 md:px-6 max-w-[1400px] mx-auto">
        <ScrollReveal direction="up" delay={0.1}>
          <NewSection news={news} />
        </ScrollReveal>
      </section>

      {/* 6. Schemes */}
      <ScrollReveal direction="up" delay={0}>
        <SchemesSection schemes={schemes} />
      </ScrollReveal>

      {/* 7. Important dates */}
      <ScrollReveal direction="up" delay={0}>
        <ImportantDatesSection />
      </ScrollReveal>

      {/* 8. Highlights */}
      <ScrollReveal direction="up" delay={0}>
        <HighlightsSection highlights={highlights} />
      </ScrollReveal>

      {/* 9. Government Orders */}
      <ScrollReveal direction="up" delay={0}>
        <OrdersSection orders={orders} />
      </ScrollReveal>

      {/* 10. Departmental Tests */}
      <ScrollReveal direction="up" delay={0}>
        <DepartmentalTestsSection />
      </ScrollReveal>

      {/* 11. Department-wise resources */}
      <ScrollReveal direction="up" delay={0}>
        <DepartmentResourcesSection />
      </ScrollReveal>

      {/* 11. Quick Links portals */}
      <ScrollReveal direction="up" delay={0}>
        <QuickLinksSection links={quickLinks} />
      </ScrollReveal>

      {/* 12. Footer */}
      <ScrollReveal direction="fade" delay={0}>
        <Footer />
      </ScrollReveal>
    </div>
  );
}
