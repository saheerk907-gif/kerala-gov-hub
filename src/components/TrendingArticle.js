'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function TrendingArticle() {
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetch(
      `${SUPABASE_URL}/rest/v1/articles?select=id,title_ml,summary_ml,image_url,category&order=created_at.desc&limit=1`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    )
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data[0]) setArticle(data[0]); })
      .catch(() => {});
  }, []);

  if (!article) return null;

  const summary = article.summary_ml ? article.summary_ml.replace(/<[^>]+>/g, '').slice(0, 80) : null;

  return (
    <div className="px-4 md:px-6 max-w-[1200px] mx-auto mt-2 mb-3 md:mt-4 md:mb-6">
      <Link href={`/articles/${article.id}`} className="no-underline group block">
        <div className="relative rounded-xl md:rounded-2xl overflow-hidden transition-all duration-300 active:scale-[0.99]"
          style={{ background: 'linear-gradient(135deg, rgba(255,159,10,0.1) 0%, rgba(255,69,58,0.06) 100%)', border: '1px solid rgba(255,159,10,0.25)' }}>

          {/* Mobile layout */}
          <div className="flex md:hidden items-center gap-3 px-3 py-3">
            {/* Left: image */}
            {article.image_url ? (
              <img src={article.image_url} alt={article.title_ml}
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                style={{ background: 'rgba(255,159,10,0.15)' }}>
                <span className="text-base">📰</span>
              </div>
            )}

            {/* Text block */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff9f0a] animate-pulse flex-shrink-0" />
                <span className="text-[8px] font-black uppercase tracking-widest text-[#ff9f0a]">Trending</span>
              </div>
              <p className="text-[13px] font-bold text-white leading-snug line-clamp-2"
                style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                {article.title_ml}
              </p>
            </div>

            <svg width="10" height="10" fill="none" stroke="#ff9f0a" strokeWidth="2.5" viewBox="0 0 24 24" className="flex-shrink-0">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Desktop layout */}
          <div className="hidden md:flex items-center gap-4 px-5 py-4">
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff9f0a] animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#ff9f0a]">Trending</span>
            </div>
            <div className="w-px h-6 bg-white/10 flex-shrink-0" />
            {article.image_url && (
              <img src={article.image_url} alt={article.title_ml}
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white/90 truncate group-hover:text-white transition-colors"
                style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                {article.title_ml}
              </p>
              {summary && (
                <p className="text-[11px] text-white/55 truncate">{summary}</p>
              )}
            </div>
            <div className="flex-shrink-0 flex items-center gap-1.5 text-[12px] font-bold text-[#ff9f0a]">
              വായിക്കുക
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                className="group-hover:translate-x-1 transition-transform">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

        </div>
      </Link>
    </div>
  );
}
