import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NpsGovOrders from '@/components/NpsGovOrders';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'NPS Government Orders & Circulars — Kerala Finance Department',
  description:
    'Complete list of NPS Government Orders, Circulars, Notices and Gazettes from Kerala Finance Department. Search and download official NPS documents.',
  path: '/nps/orders',
  keywords: [
    'NPS GO Kerala', 'NPS circular Kerala', 'NPS government orders Kerala',
    'Kerala Finance Department NPS', 'NPS ഉത്തരവ്',
  ],
});

const PURPLE = '#bf5af2';

export default function NpsOrdersPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#121416] text-white">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <div className="relative pt-32 pb-12 px-6 overflow-hidden bg-[#121416]">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(191,90,242,0.12), transparent)' }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(191,90,242,0.4), transparent)' }} />

          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-8">
              <a href="/" className="hover:text-white transition-colors no-underline text-white/50">Home</a>
              <span>›</span>
              <Link href="/nps" className="hover:text-white transition-colors no-underline text-white/50">NPS</Link>
              <span>›</span>
              <span style={{ color: PURPLE }}>ഉത്തരവുകൾ</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
              style={{ color: PURPLE, border: `1px solid ${PURPLE}30`, background: `${PURPLE}10` }}>
              📄 Government Orders & Circulars
            </div>

            <h1 className="text-[clamp(28px,5vw,48px)] font-black tracking-tight leading-[1.05] mb-3"
              style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}>
              NPS ഉത്തരവുകളും സർക്കുലറുകളും
            </h1>
            <p className="text-base text-white/60 mb-2">
              NPS Government Orders, Circulars, Notices & Gazettes — Kerala Finance Department
            </p>
            <p className="text-sm text-white/40">
              Search by order number or subject. All documents link to the official Kerala Finance Department portal.
            </p>
          </div>
        </div>

        {/* ── FULL ORDERS LIST ─────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-6 pb-20">
          <NpsGovOrders />

          <div className="mt-10 pt-6 border-t border-white/[0.06]">
            <Link href="/nps"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold no-underline transition-all"
              style={{ background: `${PURPLE}10`, color: PURPLE, border: `1px solid ${PURPLE}25` }}>
              ← Back to NPS
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
