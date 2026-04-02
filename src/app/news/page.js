import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAllNews } from '@/lib/supabase';
import NewsClient from './NewsClient';

export const revalidate = 1800;

export default async function AllNewsPage() {
  const initialNews = await getAllNews(20, 0).catch(() => []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-aurora text-white pt-24 pb-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <Link href="/" className="text-[12px] text-white/70 hover:text-white no-underline transition-colors">
              ← keralagovhub.in
            </Link>
            <h1 className="text-[clamp(26px,4vw,40px)] font-[900] tracking-[-0.03em] text-white mt-4 mb-2"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              എല്ലാ വാർത്തകളും
            </h1>
            <p className="text-[13px] text-white/60">Kerala government employee news — latest first</p>
          </div>

          {/* SEO intro */}
          <div className="mb-8 rounded-2xl p-4"
            style={{ background: 'rgba(41,151,255,0.04)', border: '1px solid rgba(41,151,255,0.10)' }}>
            <p className="text-[12px] text-white/55 leading-relaxed">
              Latest news and updates for Kerala State Government employees — covering DA revision, pension orders, pay revision, GPF interest, NPS, MEDISEP, leave rules, and other Finance Department circulars and Government Orders (GO). Updated regularly from official sources.
            </p>
          </div>

          {/* News list — server-rendered initial items */}
          <NewsClient initialNews={initialNews} />

        </div>
      </main>
      <Footer />
    </>
  );
}
