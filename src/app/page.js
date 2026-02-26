
import { getSchemes, getGovernmentOrders, getQuickLinks, getSiteStats, getHighlights } from '@/lib/supabase';
import Navbar from '@/components/Navbar';import PayCalculator from '@/components/PayCalculator';
import Hero from '@/components/Hero';
import StatsBar from '@/components/StatsBar';
import SchemesSection from '@/components/SchemesSection';
import HighlightsSection from '@/components/HighlightsSection';
import OrdersSection from '@/components/OrdersSection';
import QuickLinksSection from '@/components/QuickLinksSection';
import Footer from '@/components/Footer';
import Particles from '@/components/Particles';

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function HomePage() {
  const [schemes, orders, quickLinks, stats, highlights] = await Promise.all([
    getSchemes(),
    getGovernmentOrders(15),
    getQuickLinks(),
    getSiteStats(),
    getHighlights(),
  ]);

  return (
    <>
      <Particles />
      <Navbar />
      <Hero />
      <StatsBar stats={stats} />
      <SchemesSection schemes={schemes} />
      <HighlightsSection highlights={highlights} />
      <OrdersSection orders={orders} />
      <QuickLinksSection links={quickLinks} />
      <Footer />
    </>
  );
}
