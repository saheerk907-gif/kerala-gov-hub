import Footer from '@/components/Footer';
import { getGovernmentOrders } from '@/lib/supabase';
import OrdersClient from './OrdersClient';

export const revalidate = 3600;

export default async function OrdersPage() {
  const orders = await getGovernmentOrders().catch(() => []);

  return (
    <div className="relative min-h-screen bg-aurora overflow-x-hidden">
      <main className="max-w-[900px] mx-auto px-4 md:px-6 pt-24 pb-16">

        {/* Header */}
        <div className="mb-8">
          <div className="section-label mb-2">Latest Updates</div>
          <h1 className="text-[clamp(26px,4vw,40px)] font-[900] tracking-[-0.02em] text-white leading-tight"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            സർക്കാർ ഉത്തരവുകൾ — Government Orders
          </h1>
          <div className="h-[2px] w-10 bg-gradient-to-r from-[#ff9f0a] to-transparent mt-2 rounded-full" />
          <p className="text-white/50 text-[13px] mt-2">Government Orders · G.O.(P) · G.O.(Ms) · Circulars</p>
          <p className="text-white/60 text-[13px] mt-3 leading-relaxed max-w-[680px]">
            This page lists the latest Government Orders (G.O.s) issued by the Government of Kerala relevant to state employees.
            These include orders on Dearness Allowance (DA), Pay Revision, Bonus, Pension, MEDISEP, GPF, NPS, and Leave rules.
            Each order is listed with its GO number and date. Orders with a PDF attachment can be downloaded directly.
          </p>
          <p className="text-white/50 text-[13px] mt-2 leading-relaxed max-w-[680px]"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            കേരള സർക്കാർ ജീവനക്കാർക്ക് ബാധകമായ ഏറ്റവും പുതിയ സർക്കാർ ഉത്തരവുകൾ ഇവിടെ ലഭ്യമാണ്. DA, ബോണസ്, പെൻഷൻ, MEDISEP, GPF, NPS, ലീവ് എന്നിവ സംബന്ധിച്ച ഉത്തരവുകൾ ഉൾപ്പെടുന്നു.
          </p>
        </div>

        {/* Interactive search/filter + list (client component) */}
        <OrdersClient orders={orders} />

      </main>
      <Footer />
    </div>
  );
}
