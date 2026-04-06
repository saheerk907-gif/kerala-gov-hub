'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ACCENT = '#2997ff';

const CAT_COLORS = {
  news: '#2997ff', medisep: '#ff9f0a', pension: '#30d158',
  ksr: '#5ac8fa', gpf: '#64d2ff', da: '#ff453a',
  nps: '#ff9f0a', benefits: '#30d158', general: '#aeaeb2',
};

function formatDate(str) {
  return new Date(str).toLocaleDateString('ml-IN', { year: 'numeric', month: 'short', day: 'numeric' });
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
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchArticles();
  }, []);

  if (!loading && articles.length === 0) return null;

  const featured = articles[0];
  const secondary = articles.slice(1, 3);

  return (
    <section className="py-3 md:py-4 px-4 md:px-6 max-w-[1200px] mx-auto">
      {/* Gradient border wrapper */}
      <div style={{
        background: 'linear-gradient(135deg,rgba(140,80,240,0.55),rgba(60,130,255,0.55))',
        padding: '1.5px', borderRadius: 28,
      }}>
        {/* Cinematic photo card */}
        <div className="relative overflow-hidden" style={{
          backgroundImage: "url('/images/govtoffic.jpg')",
          backgroundSize: 'auto 110%',
          backgroundPosition: 'right 15%',
          borderRadius: 26,
          minHeight: 380,
        }}>
          {/* Overlays */}
          <div style={{ position:'absolute', inset:0, background:'rgba(5,7,14,0.68)', zIndex:1 }}/>
          <div style={{ position:'absolute', inset:0, zIndex:2,
            background:'linear-gradient(to right, rgba(5,7,14,0.97) 0%, rgba(5,7,14,0.80) 42%, rgba(5,7,14,0.40) 68%, transparent 100%)' }}/>
          <div style={{ position:'absolute', inset:0, zIndex:2,
            background:'linear-gradient(to bottom, rgba(5,7,14,0.82) 0%, transparent 32%, rgba(5,7,14,0.90) 100%)' }}/>
          {/* Blue accent glow */}
          <div style={{ position:'absolute', bottom:0, left:0, width:'45%', height:'35%', zIndex:2,
            background:'radial-gradient(ellipse at bottom left, rgba(41,151,255,0.14) 0%, transparent 70%)' }}/>

          {/* Content */}
          <div className="relative p-5 md:p-7 flex flex-col" style={{ zIndex:3, minHeight:380 }}>

            {/* Header */}
            <div className="mb-5">
              <div className="section-label mb-1" style={{ color:ACCENT, opacity:1, fontWeight:800 }}>Articles</div>
              <h2 className="text-[clamp(26px,4vw,38px)] font-[900] tracking-[-0.03em] text-white leading-tight"
                style={{ fontFamily:"var(--font-noto-malayalam), sans-serif", textShadow:'0 2px 20px rgba(0,0,0,0.9)' }}>
                ലേഖനങ്ങൾ
              </h2>
              <div className="h-[3px] w-12 mt-2 rounded-full"
                style={{ background:`linear-gradient(to right, ${ACCENT}, transparent)` }}/>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                  style={{ background:'rgba(41,151,255,0.15)', border:'1px solid rgba(41,151,255,0.35)', color:ACCENT }}>
                  📰 Latest Reads
                </div>
              </div>
            </div>

            {/* Main grid */}
            <div className="flex-grow">
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i=>(
                    <div key={i} className="h-16 rounded-xl skeleton-shimmer" style={{ background:'rgba(255,255,255,0.08)' }}/>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {/* Featured article */}
                  {featured && (
                    <Link href={`/articles/${featured.id}`} className="no-underline group block mb-1">
                      <div className="p-4 rounded-[16px] transition-all hover:bg-white/[0.07]"
                        style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', backdropFilter:'blur(10px)' }}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest"
                            style={{ background:`${CAT_COLORS[featured.category]||ACCENT}25`, color:CAT_COLORS[featured.category]||ACCENT, border:`1px solid ${CAT_COLORS[featured.category]||ACCENT}40` }}>
                            ✦ Featured · {featured.category || 'general'}
                          </span>
                          <span className="text-[10px]" style={{ color:'rgba(255,255,255,0.4)' }}>{formatDate(featured.created_at)}</span>
                        </div>
                        <h3 className="text-[clamp(15px,2vw,20px)] font-[900] text-white leading-snug mb-1.5 group-hover:text-white/90"
                          style={{ fontFamily:"var(--font-noto-malayalam), sans-serif", textShadow:'0 1px 10px rgba(0,0,0,0.8)' }}>
                          {featured.title_ml}
                        </h3>
                        {featured.summary_ml && (
                          <p className="text-[12px] line-clamp-2" style={{ color:'rgba(255,255,255,0.60)', fontFamily:"var(--font-noto-malayalam), sans-serif" }}>
                            {featured.summary_ml.replace(/<[^>]+>/g,'')}
                          </p>
                        )}
                        <div className="flex items-center gap-1 mt-2 text-[12px] font-bold group-hover:gap-2 transition-all" style={{ color:ACCENT }}>
                          വായിക്കുക
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="group-hover:translate-x-0.5 transition-transform">
                            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </Link>
                  )}
                  {/* Secondary articles */}
                  {secondary.map(article => {
                    const color = CAT_COLORS[article.category]||ACCENT;
                    return (
                      <Link key={article.id} href={`/articles/${article.id}`} className="no-underline group flex items-center gap-3 px-4 py-3 rounded-[14px] transition-all hover:bg-white/[0.06]"
                        style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(8px)' }}>
                        <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                          style={{ background:`${color}20`, border:`1px solid ${color}40` }}>
                          📄
                        </div>
                        <div className="min-w-0 flex-grow">
                          <div className="text-[12px] font-bold text-white/90 group-hover:text-white line-clamp-1 transition-colors"
                            style={{ fontFamily:"var(--font-noto-malayalam), sans-serif" }}>
                            {article.title_ml}
                          </div>
                          <div className="text-[10px] mt-0.5" style={{ color:'rgba(255,255,255,0.4)' }}>
                            {article.category} · {formatDate(article.created_at)}
                          </div>
                        </div>
                        <svg className="flex-shrink-0 w-3 h-3 text-white/30 group-hover:text-white/60 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="mt-5">
              <Link href="/articles"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[13px] font-bold no-underline transition-all hover:bg-white/[0.1]"
                style={{ background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.9)', border:'1px solid rgba(255,255,255,0.15)', backdropFilter:'blur(10px)' }}>
                എല്ലാ ലേഖനങ്ങളും വായിക്കുക
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
