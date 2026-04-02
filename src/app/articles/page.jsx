import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getArticles } from '@/lib/supabase';
import ArticlesClient from './ArticlesClient';

export const revalidate = 1800;

export default async function ArticlesPage() {
  const initialArticles = await getArticles('all', 13, 0).catch(() => []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen page-bg-dark pt-24 pb-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <Link href="/" className="text-[12px] text-white/50 hover:text-white no-underline transition-colors">
              ← keralaemployees.in
            </Link>
            <h1 className="text-[clamp(28px,4vw,48px)] font-[900] tracking-tight text-white mt-4 mb-2"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              ലേഖനങ്ങൾ
            </h1>
            <p className="text-[13px] text-white/55">Kerala government employees — articles, news, and guides</p>
          </div>

          {/* SEO intro — always visible to crawlers */}
          <div className="mb-10 rounded-2xl p-5 md:p-6"
            style={{ background: 'rgba(41,151,255,0.04)', border: '1px solid rgba(41,151,255,0.10)' }}>
            <p className="text-[13px] text-white/65 leading-relaxed mb-3">
              കേരള സർക്കാർ ജീവനക്കാർക്കുള്ള ഏറ്റവും പുതിയ വാർത്തകൾ, ലേഖനങ്ങൾ, ഗൈഡുകൾ — Pension, GPF, NPS, MEDISEP, DA, Leave, KSR, GIS, SLI, HBA, KFC, Service Book വിഷയങ്ങളിൽ.
            </p>
            <p className="text-[13px] text-white/55 leading-relaxed">
              Articles cover topics including <strong className="text-white/75">Pension</strong> rules and calculation, <strong className="text-white/75">GPF</strong> advances and withdrawals, <strong className="text-white/75">NPS vs APS</strong> comparison, <strong className="text-white/75">MEDISEP</strong> health insurance, <strong className="text-white/75">DA</strong> revision announcements, <strong className="text-white/75">Leave</strong> rules under KSR, and <strong className="text-white/75">Service Rules</strong> guides for Kerala State Government employees.
            </p>
          </div>

          {/* Server-rendered article list for initial load */}
          <ArticlesClient initialArticles={initialArticles} />

        </div>
      </main>
      <Footer />
    </>
  );
}
