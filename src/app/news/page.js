'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const PAGE_SIZE = 20;

function formatDate(str) {
  return new Date(str).toLocaleDateString('ml-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function AllNewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  async function fetchNews(from, replace = false) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/news?select=id,title_ml,category,created_at&order=created_at.desc&limit=${PAGE_SIZE}&offset=${from}`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      );
      const data = await res.json();
      if (!Array.isArray(data)) return;
      if (replace) setNews(data);
      else setNews(prev => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
      setOffset(from + data.length);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    fetchNews(0, true).finally(() => setLoading(false));
  }, []);

  async function loadMore() {
    setLoadingMore(true);
    await fetchNews(offset);
    setLoadingMore(false);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-aurora text-white pt-24 pb-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <Link href="/" className="text-[12px] text-white/70 hover:text-white no-underline transition-colors">
              ← keralagovhub.in
            </Link>
            <h1 className="text-[clamp(26px,4vw,40px)] font-[900] tracking-[-0.03em] text-white mt-4 mb-2"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              എല്ലാ വാർത്തകളും
            </h1>
            <p className="text-[13px] text-white/72">Kerala government employee news — latest first</p>
          </div>

          {/* News list */}
          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="glass-card h-[72px] rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : news.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center text-white/55">
              വാർത്തകൾ ലഭ്യമല്ല
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {news.map((item, i) => (
                <Link key={item.id} href={`/news/${item.id}`}
                  className="glass-card group flex items-center gap-4 px-5 py-4 rounded-2xl no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
                  style={i === 0 ? { border: '1px solid rgba(41,151,255,0.2)', background: 'rgba(41,151,255,0.05)' } : {}}>

                  {/* Index */}
                  <div className="text-[11px] font-black text-white/55 w-6 flex-shrink-0 text-right">{i + 1}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {i === 0 && (
                        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#2997ff]/20 text-[#2997ff]">
                          Latest
                        </span>
                      )}
                      <span className="text-[10px] text-white/65">{formatDate(item.created_at)}</span>
                    </div>
                    <div className="text-[14px] font-semibold text-white/90 group-hover:text-white transition-colors leading-snug truncate"
                      style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                      {item.title_ml}
                    </div>
                  </div>

                  <svg className="w-4 h-4 text-white/55 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all flex-shrink-0"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          )}

          {/* Load more */}
          {hasMore && !loading && (
            <button onClick={loadMore} disabled={loadingMore}
              className="w-full mt-6 py-4 rounded-2xl text-sm font-bold border-none cursor-pointer transition-all disabled:opacity-50"
              style={{ background: 'var(--surface-xs)', color: 'var(--text-primary)' }}>
              {loadingMore ? 'Loading...' : 'കൂടുതൽ വാർത്തകൾ കാണുക'}
            </button>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
