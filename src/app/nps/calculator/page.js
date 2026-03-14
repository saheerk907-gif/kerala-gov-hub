import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NpsCorpusCalculator from '@/components/NpsCorpusCalculator';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'NPS Corpus Calculator — Kerala Government Employees',
  description:
    'Calculate your NPS corpus and estimated monthly pension at retirement. Enter your Basic Pay, DA, retirement age, and expected returns.',
  path: '/nps/calculator',
  keywords: [
    'NPS calculator Kerala', 'NPS corpus calculator', 'NPS pension calculator',
    'Kerala NPS retirement calculator', 'NPS lump sum calculator',
  ],
});

const PURPLE = '#bf5af2';

export default function NpsCalculatorPage() {
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
              <span style={{ color: PURPLE }}>Calculator</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
              style={{ color: PURPLE, border: `1px solid ${PURPLE}30`, background: `${PURPLE}10` }}>
              🧮 NPS Corpus Calculator
            </div>

            <h1 className="text-[clamp(30px,5vw,52px)] font-black tracking-tight leading-[1.05] mb-3">
              NPS Corpus Calculator
            </h1>
            <p className="text-base text-white/60 mb-2">
              Estimate your retirement corpus and monthly pension based on your current pay.
            </p>
            <p className="text-sm text-white/40">
              All figures are projections — actual returns depend on market conditions.
            </p>
          </div>
        </div>

        {/* ── CALCULATOR ───────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-6 pb-20">
          <NpsCorpusCalculator />

          {/* NPS vs APS teaser */}
          <Link href="/nps-aps"
            className="group mt-10 flex items-center justify-between gap-4 p-5 rounded-2xl no-underline transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, rgba(191,90,242,0.10), rgba(100,210,255,0.06))', border: '1px solid rgba(191,90,242,0.25)' }}>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: PURPLE }}>
                Must Try ⚡
              </div>
              <div className="font-black text-white text-lg leading-tight mb-1">
                NPS-ൽ നിന്ന് APS-ലേക്ക് മാറണോ? ആദ്യം ഇത് കാണൂ
              </div>
              <div className="text-xs text-white/55">
                Compare your NPS corpus vs guaranteed APS pension — see which gives you more money after retirement.
              </div>
            </div>
            <span className="text-3xl flex-shrink-0 group-hover:translate-x-1 transition-transform">→</span>
          </Link>

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
