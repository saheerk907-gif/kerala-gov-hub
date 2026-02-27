import { getSchemes, getGovernmentOrders, getQuickLinks, getSiteStats, getHighlights } from ‘@/lib/supabase’;
import Navbar from ‘@/components/Navbar’;
import PayCalculator from ‘@/components/PayCalculator’;
import Hero from ‘@/components/Hero’;
import StatsBar from ‘@/components/StatsBar’;
import SchemesSection from ‘@/components/SchemesSection’;
import HighlightsSection from ‘@/components/HighlightsSection’;
import OrdersSection from ‘@/components/OrdersSection’;
import QuickLinksSection from ‘@/components/QuickLinksSection’;
import Footer from ‘@/components/Footer’;
import Particles from ‘@/components/Particles’;
import ScrollReveal from ‘@/components/ScrollReveal’;
import NewsSection from ‘@/components/NewsSection’;

export const revalidate = 60;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function getNews() {
try {
const res = await fetch(
`${SUPABASE_URL}/rest/v1/news?is_published=eq.true&select=*&order=published_at.desc&limit=6`,
{ headers: { ‘apikey’: SUPABASE_KEY, ‘Authorization’: `Bearer ${SUPABASE_KEY}` }, next: { revalidate: 60 } }
);
const data = await res.json();
return Array.isArray(data) ? data : [];
} catch { return []; }
}

export default async function HomePage() {
const [schemes, orders, quickLinks, stats, highlights, news] = await Promise.all([
getSchemes(),
getGovernmentOrders(15),
getQuickLinks(),
getSiteStats(),
getHighlights(),
getNews(),
]);

return (
<>
<Particles />
<Navbar />
<Hero />

```
  <ScrollReveal direction="up">
    <StatsBar stats={stats} />
  </ScrollReveal>

  <ScrollReveal direction="up">
    <SchemesSection schemes={schemes} />
  </ScrollReveal>

  <ScrollReveal direction="up">
    <NewsSection news={news} />
  </ScrollReveal>

  <ScrollReveal direction="up">
    <HighlightsSection highlights={highlights} />
  </ScrollReveal>

  <ScrollReveal direction="up">
    <OrdersSection orders={orders} />
  </ScrollReveal>

  <ScrollReveal direction="scale">
    <PayCalculator />
  </ScrollReveal>

  <ScrollReveal direction="up">
    <QuickLinksSection links={quickLinks} />
  </ScrollReveal>

  <ScrollReveal direction="fade">
    <Footer />
  </ScrollReveal>
</>
```

);
}