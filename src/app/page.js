import { getSchemes, getGovernmentOrders, getQuickLinks, getSiteStats, getHighlights } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import PayCalculator from '@/components/PayCalculator';
import Hero from '@/components/Hero';
import StatsBar from '@/components/StatsBar';
import SchemesSection from '@/components/SchemesSection';
import HighlightsSection from '@/components/HighlightsSection';
import OrdersSection from '@/components/OrdersSection';
import QuickLinksSection from '@/components/QuickLinksSection';
import Footer from '@/components/Footer';
import Particles from '@/components/Particles';
import ScrollReveal from '@/components/ScrollReveal';

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

      <ScrollReveal direction="up" delay={0}>
        <StatsBar stats={stats} />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0}>
        <SchemesSection schemes={schemes} />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0}>
        <HighlightsSection highlights={highlights} />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0}>
        <OrdersSection orders={orders} />
      </ScrollReveal>

      <ScrollReveal direction="scale" delay={0}>
        <PayCalculator />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0}>
        <QuickLinksSection links={quickLinks} />
      </ScrollReveal>

      <ScrollReveal direction="fade" delay={0}>
        <Footer />
      </ScrollReveal>
    </>
  );
}
