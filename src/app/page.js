import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { getSchemes, getGovernmentOrders, getQuickLinks, getSiteStats, getNews } from '@/lib/supabase';

// ── ABOVE FOLD: Server-rendered, zero JS cost ────────────────────────────────
import Hero from '@/components/Hero';
import ToolsSection from '@/components/ToolsSection';

// ── NEAR FOLD: SSR but code-split JS chunks ──────────────────────────────────
// AnnouncementBanner fetches its own data client-side (Supabase) anyway —
// no SSR content to lose. Deferring removes it from hydration critical path.
const AnnouncementBanner = dynamic(
  () => import('@/components/AnnouncementBanner'),
  { ssr: false, loading: () => null }
);

const MobileBottomNav = dynamic(
  () => import('@/components/MobileBottomNav'),
  { ssr: false, loading: () => null }
);

// ── BELOW FOLD: Full lazy, with skeleton placeholders ───────────────────────
const OrdersSection               = dynamic(() => import('@/components/OrdersSection'));
const NewSection                  = dynamic(() => import('@/components/NewSection'));
const TrendingArticle             = dynamic(() => import('@/components/TrendingArticle'));
const ArticlesSection             = dynamic(() => import('@/components/ArticlesSection'));
const ExperiencesSection          = dynamic(() => import('@/components/ExperiencesSection'),          { ssr: false });
const ForumSection                = dynamic(() => import('@/components/ForumSection'),                { ssr: false });
const AudioClassesSection         = dynamic(() => import('@/components/AudioClassesSection'),         { ssr: false });
const DepartmentalTestsSection    = dynamic(() => import('@/components/DepartmentalTestsSection'));
const SchemesSection              = dynamic(() => import('@/components/SchemesSection'));
const DepartmentResourcesSection  = dynamic(() => import('@/components/DepartmentResourcesSection'));
const QuickLinksSection           = dynamic(() => import('@/components/QuickLinksSection'));
const Footer                      = dynamic(() => import('@/components/Footer'));

export const revalidate = 3600;

// Skeleton shown while JS chunks load
function CardSkeleton({ height = 360 }) {
  return (
    <div
      className="rounded-[28px] skeleton-shimmer"
      style={{ minHeight: height, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
      aria-hidden="true"
    />
  );
}

function SectionDivider({ label, icon }) {
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 mt-6 md:mt-8 mb-3">
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
    <div className="relative min-h-screen bg-aurora overflow-x-hidden pb-14 md:pb-0">

      {/* ── ABOVE FOLD: painted on first frame, zero client JS ── */}
      <Hero />
      <AnnouncementBanner />
      <ToolsSection />

      {/* ━━ GROUP: Latest Updates ━━ */}
      <SectionDivider label="Latest Updates" icon="📢" />

      <div className="px-4 md:px-6 max-w-[1200px] mx-auto py-3 md:py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
          <Suspense fallback={<CardSkeleton />}>
            <OrdersSection orders={orders} />
          </Suspense>
          <section id="news">
            <Suspense fallback={<CardSkeleton />}>
              <NewSection news={news} />
            </Suspense>
          </section>
        </div>
      </div>

      <Suspense fallback={null}>
        <TrendingArticle />
      </Suspense>

      <Suspense fallback={<CardSkeleton height={320} />}>
        <ArticlesSection />
      </Suspense>

      {/* ━━ GROUP: Community ━━ */}
      <SectionDivider label="Community" icon="👥" />

      <Suspense fallback={<CardSkeleton height={400} />}>
        <ExperiencesSection />
      </Suspense>

      <Suspense fallback={<CardSkeleton />}>
        <ForumSection />
      </Suspense>

      {/* ━━ GROUP: Learning ━━ */}
      <SectionDivider label="Learning" icon="📚" />

      <Suspense fallback={<CardSkeleton />}>
        <AudioClassesSection />
      </Suspense>

      <Suspense fallback={<CardSkeleton />}>
        <DepartmentalTestsSection />
      </Suspense>

      {/* ━━ GROUP: Reference ━━ */}
      <SectionDivider label="Reference" icon="📎" />

      <Suspense fallback={<CardSkeleton />}>
        <SchemesSection schemes={schemes} />
      </Suspense>

      <Suspense fallback={<CardSkeleton />}>
        <DepartmentResourcesSection />
      </Suspense>

      <Suspense fallback={<CardSkeleton height={300} />}>
        <QuickLinksSection links={quickLinks} />
      </Suspense>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      {/* Mobile sticky bottom nav — deferred, no SSR needed */}
      <MobileBottomNav />
    </div>
  );
}
