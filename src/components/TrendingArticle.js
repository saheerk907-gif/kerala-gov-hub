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

  return (
    <div className="px-4 md:px-6 max-w-[1400px] mx-auto mb-6">
      <Link href={`/articles/${article.id}`} className="no-underline group block">
        <div className="relative rounded-2xl overflow-hidden flex items-center gap-4 px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(255,159,10,0.15)]"
          style={{ background: 'linear-gradient(135deg, rgba(255,159,10,0.08) 0%, rgba(255,69,58,0.05) 100%)', border: '1px solid rgba(255,159,10,0.2)' }}>

          {/* Pulse dot */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff9f0a] animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-[#ff9f0a]">Trending</span>
          </div>

          <div className="w-px h-6 bg-white/10 flex-shrink-0" />

          {/* Image */}
          {article.image_url && (
            <img src={article.image_url} alt={article.title_ml}
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
          )}

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] md:text-sm font-bold text-white/90 truncate group-hover:text-white transition-colors"
              style={{ fontFamily: "'Meera', sans-serif" }}>
              {article.title_ml}
            </p>
            {article.summary_ml && (
              <p className="text-[11px] text-white/35 truncate hidden md:block">
                {article.summary_ml.replace(/<[^>]+>/g, '')}
              </p>
            )}
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0 flex items-center gap-1.5 text-[12px] font-bold text-[#ff9f0a]">
            വായിക്കുക
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
              className="group-hover:translate-x-1 transition-transform">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  );
}
