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

export default function NpsCalculatorPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-aurora text-white pt-[100px]">
        <div className="max-w-4xl mx-auto px-6 py-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/60 mb-8">
            <a href="/" className="hover:text-white transition-colors no-underline text-white/60">Home</a>
            <span>›</span>
            <span className="text-[#ff9f0a]">NPS Corpus Calculator</span>
          </div>

          <div className="mb-8">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#ff9f0a] mb-2">National Pension System · Kerala Government</div>
            <h1 className="text-[clamp(24px,4vw,40px)] font-[900] tracking-[-0.03em] leading-tight mb-3 text-white">
              NPS Corpus Calculator — Kerala Government Employees
            </h1>
            <p className="text-[14px] text-white/65 leading-relaxed mb-2">
              Estimate your National Pension System (NPS) retirement corpus and projected monthly pension. Kerala government employees under NPS contribute 10% of Basic Pay + DA per month, with an equal government contribution of 14%. Enter your current pay, age, and expected annual returns to project your total corpus at age 60. At retirement, 60% can be withdrawn as lump sum (tax-free) and 40% must be used to buy an annuity for monthly pension.
            </p>
            <p className="text-[13px] text-white/50 leading-relaxed" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              NPS-ൽ നിങ്ങളുടെ വിരമിക്കൽ Corpus, Lump Sum തുക, പ്രതിമാസ പെൻഷൻ എന്നിവ കണക്കാക്കുക. PFRDA മാർഗനിർദ്ദേശങ്ങൾ അനുസരിച്ചുള്ള കണക്കുകൂട്ടൽ.
            </p>
          </div>

          <NpsCorpusCalculator />

          {/* NPS vs APS teaser */}
          <Link href="/nps-aps"
            className="group mt-10 flex items-center justify-between gap-4 p-5 rounded-2xl no-underline transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, rgba(191,90,242,0.10), rgba(100,210,255,0.06))', border: '1px solid rgba(191,90,242,0.25)' }}>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#bf5af2' }}>
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
              style={{ background: 'rgba(255,159,10,0.10)', color: '#ff9f0a', border: '1px solid rgba(255,159,10,0.25)' }}>
              ← Back to NPS
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
