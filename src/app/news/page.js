'use client'
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';

export const revalidate = 60;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const CATEGORY_LABELS = {
  pay: { label: 'ശമ്പളം', color: '#2997ff' },
  da: { label: 'ക്ഷാമബത്ത', color: '#ff9f0a' },
  medisep: { label: 'മെഡിസെപ്', color: '#ff453a' },
  gpf: { label: 'GPF', color: '#30d158' },
  nps: { label: 'NPS', color: '#bf5af2' },
  pension: { label: 'പെൻഷൻ', color: '#ff9f0a' },
  general: { label: 'പൊതുവായത്', color: '#6e6e73' },
};

async function getNews(id) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/news?id=eq.${id}&select=*`,
    { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }, next: { revalidate: 60 } }
  );
  const data = await res.json();
  return data?.[0] || null;
}

export default async function NewsDetailPage({ params }) {
  const news = await getNews(params.id);
  if (!news) notFound();

  const cat = CATEGORY_LABELS[news.category] || CATEGORY_LABELS.general;
  const date = new Date(news.published_at).toLocaleDateString('ml-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white">
        {/* Hero */}
        <div className="relative pt-32 pb-16 px-6 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${cat.color}08 0%, #000 60%)` }}>
          <div className="absolute inset-0 opacity-20"
            style={{ background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${cat.color}25, transparent)` }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${cat.color}50, transparent)` }} />

          <div className="relative max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-[#6e6e73] mb-8">
              <a href="/" className="hover:text-white transition-colors no-underline text-[#6e6e73]">Home</a>
              <span>›</span>
              <a href="/news" className="hover:text-white transition-colors no-underline text-[#6e6e73]">വാർത്തകൾ</a>
              <span>›</span>
              <span style={{ color: cat.color }}>{cat.label}</span>
            </div>

            {/* Category + date */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full"
                style={{ color: cat.color, border: `1px solid ${cat.color}30`, background: `${cat.color}10` }}>
                {cat.label}
              </span>
              <span className="text-xs text-[#6e6e73]">{date}</span>
              {news.is_featured && (
                <span className="flex items-center gap-1.5 ml-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-pulse" />
                  <span className="text-[10px] text-[#30d158] font-semibold">Featured</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-[clamp(28px,5vw,52px)] font-black tracking-tight leading-[1.1] mb-6"
              style={{ fontFamily: "'Noto Sans Malayalam', serif" }}>
              {news.title_ml}
            </h1>

            {/* Summary */}
            {news.summary_ml && (
              <p className="text-lg text-[#86868b] leading-relaxed"
                style={{ fontFamily: "'Noto Sans Malayalam', sans-serif" }}>
                {news.summary_ml}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-12">
          {news.content_ml ? (
            <div className="news-content" dangerouslySetInnerHTML={{ __html: news.content_ml }} />
          ) : (
            <div className="text-[#6e6e73] text-sm py-8 text-center">
              Full content coming soon.
            </div>
          )}

          {news.source_url && (
            <div className="mt-10 pt-6 border-t border-white/[0.06]">
              <a href={news.source_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold no-underline transition-all"
                style={{ color: cat.color }}>
                🔗 ഔദ്യോഗിക ഉറവിടം കാണുക →
              </a>
            </div>
          )}

          <div className="mt-6">
            <a href="/news" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold no-underline transition-all"
              style={{ background: `${cat.color}10`, color: cat.color, border: `1px solid ${cat.color}25` }}>
              ← എല്ലാ വാർത്തകളും
            </a>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .news-content { font-family: 'Noto Sans Malayalam', Georgia, serif; line-height: 1.9; color: #e5e5e7; }
          .news-content h3 { font-size: 1.15rem; font-weight: 700; color: ${cat.color}; margin: 2rem 0 0.75rem; padding-left: 12px; border-left: 3px solid ${cat.color}; }
          .news-content p { margin-bottom: 1.25rem; color: #aeaeb2; font-size: 0.95rem; }
          .news-content b, .news-content strong { color: white; font-weight: 700; }
          .news-content ul { list-style: none; padding: 0; margin: 1rem 0 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
          .news-content ul li { padding: 0.85rem 1.1rem 0.85rem 2rem; background: ${cat.color}08; border: 1px solid ${cat.color}15; border-radius: 12px; font-size: 0.9rem; color: #aeaeb2; position: relative; }
          .news-content ul li::before { content: '✦'; color: ${cat.color}; font-size: 0.6rem; position: absolute; left: 0.85rem; top: 1rem; }
        ` }} />
      </main>
      <Footer />
    </>
  );
}
