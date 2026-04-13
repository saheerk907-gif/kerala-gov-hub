'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
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
    <div className="py-2 md:py-3 flex flex-col h-full">
      {/* Gradient border wrapper */}
      <div style={{
        background: 'linear-gradient(135deg,rgba(140,80,240,0.5),rgba(60,130,255,0.5))',
        padding: '1.5px', borderRadius: 28, display: 'flex', flexDirection: 'column', flex: 1,
      }}>
      <div className="relative overflow-hidden flex flex-col"
        style={{ background: '#0d1117', borderRadius: 26, padding: '16px 20px', flex: 1 }}>
        {/* Optimised background image — lazy loaded, served as WebP */}
        <Image
          src="/images/news-bg.webp"
          alt=""
          fill
          className="object-cover opacity-[0.30]"
          style={{ objectPosition: 'center top' }}
          sizes="(max-width: 768px) 100vw, 600px"
          loading="lazy"
          quality={65}
        />

        {/* Left-to-right fade */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to right, rgba(13,17,23,0.99) 30%, rgba(13,17,23,0.90) 60%, rgba(13,17,23,0.75) 100%)' }}/>
        {/* Top-to-bottom fade */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(13,17,23,0.40) 0%, rgba(13,17,23,0.70) 50%, rgba(13,17,23,0.99) 70%)' }}/>

        <div className="relative flex flex-col h-full" style={{ zIndex: 2 }}>

        {/* Header */}
        <div className="mb-3">
          <div className="section-label mb-1">Latest</div>
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
              {(expanded ? news : news.slice(0, 3)).map((item, index) => (
                <Link key={item.id} href={`/news/${item.id}`} className="block no-underline group">
                  <div className={`relative flex items-center gap-3 p-3 md:p-4 rounded-[14px] transition-all duration-200 hover:bg-white/[0.06] mb-1.5 md:mb-2 overflow-hidden ${index === 0 ? 'bg-[#2997ff]/[0.06]' : ''}`}>
                    {/* Glow blob */}
                    <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{ background: 'rgba(41,151,255,0.3)' }} />
                    <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105" style={index === 0 ? { background: 'rgba(41,151,255,0.20)', border: '1px solid rgba(41,151,255,0.35)' } : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
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
                        <span className={`text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${index === 0 ? 'bg-[#2997ff]/30 text-[#2997ff]' : 'bg-white/[0.08] text-white/75'}`}>
                          {index === 0 ? 'LATEST' : (item.category === 'news' ? 'വാർത്ത' : item.category)}
                        </span>
                        <span className="text-[11px] text-white/72">{new Date(item.created_at).toLocaleDateString('en-GB')}</span>
                      </div>
                      <h3 className="text-[12px] md:text-[13px] font-bold leading-snug text-white/90 group-hover:text-white transition-colors line-clamp-2" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                        {item.title_ml}
                      </h3>
                    </div>
                    <svg className="w-4 h-4 text-white/35 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(41,151,255,0.7), transparent)' }} />
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
        {!loading && news.length > 3 && (
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

        </div>{/* /content zIndex wrapper */}
      </div>{/* /dark card */}
      </div>{/* /gradient border */}
    </div>
  );
}
