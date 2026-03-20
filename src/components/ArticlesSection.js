'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const CAT_COLORS = {
  news: '#2997ff', medisep: '#ff9f0a', pension: '#30d158',
  ksr: '#5ac8fa', gpf: '#64d2ff', da: '#ff453a',
  nps: '#ff9f0a', benefits: '#30d158', general: '#aeaeb2',
};

function formatDate(str) {
  return new Date(str).toLocaleDateString('ml-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function FeaturedCard({ article }) {
  const color = CAT_COLORS[article.category] || '#2997ff';
  return (
    <Link href={`/articles/${article.id}`} className="no-underline group block col-span-2">
      <div className="article-card relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 min-h-[200px] md:min-h-[320px]"
        style={{ background: '#0a0a0a', border: `1px solid ${color}25` }}>
        {article.image_url ? (
          <>
            <img src={article.image_url} alt={article.title_ml}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              style={{ opacity: 0.35 }} />
            <div className="article-card-overlay absolute inset-0" style={{ background: 'linear-gradient(to top, #000 50%, transparent 100%)' }} />
          </>
        ) : (
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 60% at 30% 50%, ${color}15, transparent)` }} />
        )}
        <div className="relative z-10 flex flex-col justify-end h-full p-5 md:p-7 min-h-[200px] md:min-h-[320px]">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest"
              style={{ background: `${color}25`, color, border: `1px solid ${color}40` }}>
              {article.category || 'general'}
            </span>
            <span className="text-[10px] text-white/50">{formatDate(article.created_at)}</span>
          </div>
          <h3 className="text-[clamp(18px,2.5vw,26px)] font-black text-white leading-tight mb-2 group-hover:text-white/90"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            {article.title_ml}
          </h3>
          {article.summary_ml && (
            <p className="text-[13px] text-white/60 line-clamp-2 mb-4"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              {article.summary_ml.replace(/<[^>]+>/g, '')}
            </p>
          )}
          <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color }}>
            വായിക്കുക
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
              className="group-hover:translate-x-1 transition-transform">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SmallCard({ article }) {
  const color = CAT_COLORS[article.category] || '#2997ff';
  return (
    <Link href={`/articles/${article.id}`} className="no-underline group block">
      <div className="article-card relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] min-h-[160px] md:min-h-[240px]"
        style={{ background: '#0a0a0a', border: `1px solid ${color}25` }}>
        {article.image_url ? (
          <>
            <img src={article.image_url} alt={article.title_ml}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              style={{ opacity: 0.35 }} />
            <div className="article-card-overlay absolute inset-0" style={{ background: 'linear-gradient(to top, #000 50%, transparent 100%)' }} />
          </>
        ) : (
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 60% at 30% 50%, ${color}15, transparent)` }} />
        )}
        <div className="relative z-10 flex flex-col justify-end h-full p-4 md:p-5 min-h-[160px] md:min-h-[240px]">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest"
              style={{ background: `${color}25`, color, border: `1px solid ${color}40` }}>
              {article.category || 'general'}
            </span>
            <span className="text-[10px] text-white/50">{formatDate(article.created_at)}</span>
          </div>
          <h3 className="text-[14px] font-bold text-white leading-snug mb-3 group-hover:text-white/90 line-clamp-3"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            {article.title_ml}
          </h3>
          <div className="flex items-center gap-1 text-[11px] font-bold" style={{ color }}>
            വായിക്കുക
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
              className="group-hover:translate-x-0.5 transition-transform">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ArticlesSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/articles?select=id,title_ml,summary_ml,image_url,category,created_at&order=created_at.desc&limit=5`,
          { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
        );
        const data = await res.json();
        if (Array.isArray(data)) setArticles(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  if (!loading && articles.length === 0) return null;

  return (
    <section className="py-7 md:py-14 px-4 md:px-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="section-label mb-2">Articles</div>
        <h2 className="text-[clamp(22px,3vw,32px)] font-[900] tracking-[-0.02em] text-white"
          style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
          ലേഖനങ്ങൾ
        </h2>
        <div className="h-[2px] w-10 bg-gradient-to-r from-[#2997ff] to-transparent mt-2 rounded-full" />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="col-span-2 h-[200px] md:h-[320px] rounded-2xl skeleton-shimmer" />
          <div className="h-[160px] md:h-[280px] rounded-2xl skeleton-shimmer" />
          <div className="hidden md:block h-[280px] rounded-2xl skeleton-shimmer" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {articles[0] && <FeaturedCard article={articles[0]} />}
          {articles[1] && <div className="hidden md:block"><SmallCard article={articles[1]} /></div>}
          {articles[2] && <div className="hidden md:block"><SmallCard article={articles[2]} /></div>}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-6 text-center">
        <Link href="/articles"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-[13px] font-bold no-underline transition-all hover:scale-[1.02]"
          style={{ background: 'rgba(41,151,255,0.08)', color: '#2997ff', border: '1px solid rgba(41,151,255,0.2)' }}>
          എല്ലാ ലേഖനങ്ങളും വായിക്കുക
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
