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
import MobileBottomNav from '@/components/MobileBottomNav';

export const revalidate = 3600;

function SectionDivider({ label, icon }) {
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 mt-12 md:mt-16 mb-4 md:mb-5">
      <div className="flex items-center gap-3">
        <span className="text-[13px] md:text-[14px]">{icon}</span>
        <span className="section-group-label text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em]">
          {label}
        </span>
        <div className="flex-1 h-px section-group-line" />
      </div>
    </div>
  );
}

export default async function HomePage() {
  const [schemes, orders, quickLinks, stats, news] = await Promise.all([
    getSchemes(),
    getGovernmentOrders(),
    getQuickLinks(),
    getSiteStats(),
    getNews(),
  ]);

  return (
    <div className="relative min-h-screen overflow-x-hidden pb-14 md:pb-0" style={{ background: '#fff' }}>

      {/* Hero with search + quick access */}
      <Hero />

      {/* Live breaking news ticker */}
      <AnnouncementBanner />

      {/* ━━ GROUP: Tools & Calculators ━━ */}
      <ScrollReveal direction="up" delay={0}>
        <ToolsSection />
      </ScrollReveal>

      {/* ━━ GROUP: Latest Updates ━━ */}
      <SectionDivider label="Latest Updates" icon="📢" />

      <div className="px-4 md:px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch">
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

      <TrendingArticle />

      <ScrollReveal direction="up" delay={100}>
        <ArticlesSection />
      </ScrollReveal>

      {/* ━━ GROUP: Community ━━ */}
      <SectionDivider label="Community" icon="👥" />

      <ScrollReveal direction="up" delay={100}>
        <ExperiencesSection />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={100}>
        <ForumSection />
      </ScrollReveal>

      {/* ━━ GROUP: Learning ━━ */}
      <SectionDivider label="Learning" icon="📚" />

      <ScrollReveal direction="up" delay={100}>
        <AudioClassesSection />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={100}>
        <DepartmentalTestsSection />
      </ScrollReveal>

      {/* ━━ GROUP: Reference ━━ */}
      <SectionDivider label="Reference" icon="📎" />

      <ScrollReveal direction="up" delay={100}>
        <SchemesSection schemes={schemes} />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={100}>
        <QuickLinksSection links={quickLinks} />
      </ScrollReveal>

      {/* Footer */}
      <ScrollReveal direction="fade" delay={0}>
        <Footer />
      </ScrollReveal>

      {/* Mobile sticky bottom nav */}
      <MobileBottomNav />
    </div>
  );
}
