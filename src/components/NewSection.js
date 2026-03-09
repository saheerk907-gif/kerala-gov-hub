'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const NewsRow = ({ date, title, category, link = '/news', index, isFirst }) => (
  <Link href={link} className="block no-underline group">
    <div
      className={`glass-card glow-top relative flex items-center gap-4 p-4 md:p-5 rounded-[20px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] mb-3 ${
        isFirst ? 'border-[#2997ff]/30 bg-[#2997ff]/[0.08]' : ''
      }`}
    >
      {/* Icon */}
      <div
        className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-lg ${
          isFirst ? 'bg-[#2997ff]/20 text-blue-400' : 'bg-white/[0.06] text-white/50'
        }`}
      >
        {isFirst ? '⭐' : '📄'}
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
              isFirst
                ? 'bg-[#2997ff]/30 text-blue-300'
                : 'bg-white/[0.08] text-white/50'
            }`}
          >
            {isFirst ? 'BREAKING' : category}
          </span>
          <span className="text-[10px] text-white/30">{date}</span>
        </div>
        <h3 className="text-[15px] md:text-base font-bold leading-snug text-white/90 group-hover:text-white transition-colors truncate" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
          {title}
        </h3>
      </div>

      {/* Arrow */}
      <svg className="w-4 h-4 text-white/25 group-hover:text-white/70 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </Link>
);

export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/news?select=*&category=eq.news&order=created_at.desc&limit=6`,
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
    <div className="h-full py-8">
      {/* Header */}
      <div className="mb-7">
        <div className="section-label mb-2">Latest</div>
        <h2 className="text-[clamp(22px,3vw,32px)] font-[900] tracking-[-0.02em] text-white" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
          പുതിയ വാർത്തകൾ
        </h2>
        <div className="h-[2px] w-10 bg-gradient-to-r from-[#2997ff] to-transparent mt-2 rounded-full" />
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card h-[72px] rounded-[20px] animate-pulse" />
          ))}
        </div>
      ) : news.length > 0 ? (
        <div>
          {news.map((item, index) => (
            <NewsRow
              key={item.id}
              index={index}
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
          <p className="text-white/40">വാർത്തകൾ ലഭ്യമല്ല.</p>
        </div>
      )}

      {!loading && news.length > 0 && (
        <div className="mt-4">
          <Link href="/news"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[13px] font-bold no-underline transition-all hover:bg-white/[0.08]"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)' }}>
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
