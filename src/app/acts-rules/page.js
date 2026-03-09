import { supabase } from '@/lib/supabase';
import ActsClient from './ActsClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const revalidate = 3600;

export default async function ActsRulesPage() {
  const { data: acts } = await supabase
    .from('acts_rules')
    .select('id, title, title_ml, slug, category, summary, pdf_url, official_url, act_number, year, tags, is_published')
    .eq('is_published', true)
    .order('year', { ascending: false });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-[100px]">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#6e6e73] mb-8">
            <a href="/" className="hover:text-white transition-colors no-underline text-[#6e6e73]">Home</a>
            <span>›</span>
            <span className="text-[#2997ff]">Acts & Rules</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="text-[10px] font-bold uppercase tracking-[3px] text-[#2997ff] mb-3">Kerala Government</div>
            <h1 className="text-[clamp(28px,4.5vw,48px)] font-[900] tracking-[-0.03em] leading-tight mb-3 text-white" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              നിയമങ്ങളും{' '}
              <span className="bg-gradient-to-r from-[#2997ff] to-[#bf5af2] bg-clip-text text-transparent">
                ചട്ടങ്ങളും
              </span>
            </h1>
            <p className="text-[15px] text-white/50 leading-relaxed max-w-[620px]">
              കേരള സർക്കാർ ജീവനക്കാർക്ക് ആവശ്യമായ പ്രധാന നിയമങ്ങളും ചട്ടങ്ങളും — PDF, സംക്ഷേപം, പ്രധാന വ്യവസ്ഥകൾ.
            </p>
          </div>

          <ActsClient acts={acts || []} />
        </div>
      </main>
      <Footer />
    </>
  );
}
