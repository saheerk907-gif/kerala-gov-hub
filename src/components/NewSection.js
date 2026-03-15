'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const NewsRow = ({ date, title, category, link = '/news', isFirst }) => (
  <Link href={link} className="block no-underline group">
    <div className={`glass-card glow-top relative flex items-center gap-3 p-3 md:p-5 rounded-[16px] md:rounded-[20px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] mb-2 md:mb-3 ${
      isFirst ? 'border-[#2997ff]/30 bg-[#2997ff]/[0.08]' : ''
    }`}>
      {/* Icon */}
      <div className="flex-shrink-0 w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl flex items-center justify-center" style={isFirst ? { background: 'rgba(41,151,255,0.20)', border: '1px solid rgba(41,151,255,0.35)' } : { background: 'var(--surface-sm)', border: '1px solid var(--surface-sm)' }}>
        {isFirst ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2997ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
            <path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/>
          </svg>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
            isFirst ? 'bg-[#2997ff]/30 text-[#2997ff]' : 'bg-white/[0.08] text-white/65'
          }`}>
            {isFirst ? 'LATEST' : category}
          </span>
          <span className="text-[10px] text-white/70">{date}</span>
        </div>
        <h3 className="text-[12px] md:text-base font-bold leading-snug text-white/90 group-hover:text-white transition-colors line-clamp-2" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
          {title}
        </h3>
      </div>

      {/* Arrow */}
      <svg className="w-4 h-4 text-white/45 group-hover:text-white/70 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </Link>
);

const VISIBLE = 5;

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

      {/* Header — matches OrdersSection exactly */}
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
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass-card h-[72px] rounded-[20px] animate-pulse" />
            ))}
          </div>
        ) : news.length > 0 ? (
          <div>
            {(expanded ? news : news.slice(0, VISIBLE)).map((item, index) => (
              <NewsRow
                key={item.id}
                isFirst={index === 0}
                date={new Date(item.created_at).toLocaleDateString('en-GB')}
                category={item.category === 'news' ? 'വാർത്ത' : item.category}
                title={item.title_ml}
                link={`/news/${item.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card p-10 text-center rounded-[20px]">
            <p className="text-white/70">വാർത്തകൾ ലഭ്യമല്ല.</p>
          </div>
        )}
      </div>

      {/* Read More / Show Less */}
      {!loading && news.length > VISIBLE && (
        <div className="mt-3 flex justify-center">
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-bold transition-all"
            style={{ background: 'rgba(41,151,255,0.08)', color: '#2997ff', border: '1px solid rgba(41,151,255,0.22)' }}
          >
            {expanded ? 'Show less ↑' : `Read more (${news.length - VISIBLE} more) ↓`}
          </button>
        </div>
      )}

      {/* CTA — pinned to bottom, matches OrdersSection */}
      {!loading && news.length > 0 && (
        <div className="mt-4">
          <Link href="/news"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[13px] font-bold no-underline transition-all hover:bg-white/[0.08]"
            style={{ background: 'var(--surface-xs)', color: 'var(--text-primary)' }}>
            എല്ലാ വാർത്തകളും കാണുക
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}

    </div>
  );
}
