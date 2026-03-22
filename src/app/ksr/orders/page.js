import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import KsrGovOrders from '@/components/KsrGovOrders';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'KSR Government Orders & Amendments — Kerala Finance Department',
  description:
    'Complete list of Kerala Service Rules amendments, Government Orders and Circulars from Kerala Finance Department. Search and find the KSR GO you need.',
  path: '/ksr/orders',
  keywords: [
    'KSR amendment Kerala', 'KSR GO Kerala', 'Kerala Service Rules circular',
    'KSR government orders', 'KSR ഭേദഗതി',
  ],
});

const BLUE = '#2997ff';

export default function KsrOrdersPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#121416] text-white">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <div className="relative pt-32 pb-12 px-6 overflow-hidden bg-[#121416]">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(41,151,255,0.12), transparent)' }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(41,151,255,0.4), transparent)' }} />

          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-8">
              <a href="/" className="hover:text-white transition-colors no-underline text-white/50">Home</a>
              <span>›</span>
              <Link href="/ksr" className="hover:text-white transition-colors no-underline text-white/50">KSR</Link>
              <span>›</span>
              <span style={{ color: BLUE }}>ഉത്തരവുകൾ</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
              style={{ color: BLUE, border: `1px solid ${BLUE}30`, background: `${BLUE}10` }}>
              📄 Government Orders & Amendments
            </div>

            <h1 className="text-[clamp(28px,5vw,48px)] font-black tracking-tight leading-[1.05] mb-3"
              style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}>
              KSR ഉത്തരവുകളും ഭേദഗതികളും
            </h1>
            <p className="text-base text-white/60 mb-2">
              KSR Government Orders, Amendments, Circulars & Notices — Kerala Finance Department
            </p>
            <p className="text-sm text-white/40">
              Search by order number or subject. All documents link to the official Kerala Finance Department portal.
            </p>
          </div>
        </div>

        {/* ── FULL ORDERS LIST ─────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-6 pb-20">
          <KsrGovOrders />

          <div className="mt-10 pt-6 border-t border-white/[0.06]">
            <Link href="/ksr"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold no-underline transition-all"
              style={{ background: `${BLUE}10`, color: BLUE, border: `1px solid ${BLUE}25` }}>
              ← Back to KSR
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
