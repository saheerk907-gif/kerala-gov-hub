'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';


export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/news?select=*&category=eq.news&order=created_at.desc&limit=10`,
          {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) setNews(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <div className="py-5 md:py-8 flex flex-col h-full">
      <div className="glass-card glow-top rounded-[24px] md:rounded-[28px] p-5 md:p-7 flex flex-col h-full" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>

        {/* Header */}
        <div className="mb-5">
          <div className="section-label mb-2">Latest</div>
          <h2 className="text-[clamp(22px,3vw,32px)] font-[900] tracking-[-0.02em] text-white" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            പുതിയ വാർത്തകൾ
          </h2>
          <div className="h-[2px] w-10 bg-gradient-to-r from-[#2997ff] to-transparent mt-2 rounded-full" />
        </div>

        {/* List — grows to fill available space */}
        <div className="flex-grow">
          {loading ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-[60px] rounded-[14px] skeleton-shimmer" style={{ background: 'rgba(255,255,255,0.05)' }} />
              ))}
            </div>
          ) : news.length > 0 ? (
            <div>
              {(expanded ? news : news.slice(0, 5)).map((item, index) => (
                <Link key={item.id} href={`/news/${item.id}`} className="block no-underline group">
                  <div className={`relative flex items-center gap-3 p-3 md:p-4 rounded-[14px] transition-all duration-200 hover:bg-white/[0.06] mb-1.5 md:mb-2 ${index === 0 ? 'bg-[#2997ff]/[0.06]' : ''}`}>
                    <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center" style={index === 0 ? { background: 'rgba(41,151,255,0.20)', border: '1px solid rgba(41,151,255,0.35)' } : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {index === 0 ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2997ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
                          <path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${index === 0 ? 'bg-[#2997ff]/30 text-[#2997ff]' : 'bg-white/[0.08] text-white/65'}`}>
                          {index === 0 ? 'LATEST' : (item.category === 'news' ? 'വാർത്ത' : item.category)}
                        </span>
                        <span className="text-[10px] text-white/70">{new Date(item.created_at).toLocaleDateString('en-GB')}</span>
                      </div>
                      <h3 className="text-[12px] md:text-[13px] font-bold leading-snug text-white/90 group-hover:text-white transition-colors line-clamp-2" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                        {item.title_ml}
                      </h3>
                    </div>
                    <svg className="w-4 h-4 text-white/35 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-white/70">വാർത്തകൾ ലഭ്യമല്ല.</p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.07] my-3" />

        {/* Read More */}
        {!loading && news.length > 5 && (
          <div className="mb-2">
            <button
              onClick={() => setExpanded(v => !v)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-[12px] font-bold transition-all cursor-pointer border-none"
              style={{ background: 'rgba(41,151,255,0.08)', color: '#2997ff', border: '1px solid rgba(41,151,255,0.22)' }}
            >
              {expanded ? 'Show Less ↑' : 'Read More ↓'}
            </button>
          </div>
        )}

        {/* CTA */}
        {!loading && news.length > 0 && (
          <Link href="/news"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[13px] font-bold no-underline transition-all hover:bg-white/[0.06]"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.08)' }}>
            എല്ലാ വാർത്തകളും കാണുക
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}

      </div>
    </div>
  );
}
