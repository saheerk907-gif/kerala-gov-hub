'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const CATEGORIES = [
  { value: 'all',      label: 'എല്ലാം',       en: 'All' },
  { value: 'news',     label: 'വാർത്ത',        en: 'News' },
  { value: 'medisep',  label: 'മെഡിസെപ്',     en: 'MEDISEP' },
  { value: 'pension',  label: 'പെൻഷൻ',        en: 'Pension' },
  { value: 'ksr',      label: 'KSR',           en: 'Service Rules' },
  { value: 'gpf',      label: 'GPF',           en: 'GPF' },
  { value: 'da',       label: 'DA',            en: 'DA' },
  { value: 'nps',      label: 'NPS / APS',     en: 'NPS' },
  { value: 'benefits', label: 'ആനുകൂല്യങ്ങൾ', en: 'Benefits' },
  { value: 'general',  label: 'പൊതുവായത്',    en: 'General' },
];

const CAT_COLORS = {
  news:     '#2997ff',
  medisep:  '#ff9f0a',
  pension:  '#30d158',
  ksr:      '#5ac8fa',
  gpf:      '#64d2ff',
  da:       '#ff453a',
  nps:      '#ff9f0a',
  benefits: '#30d158',
  general:  '#aeaeb2',
};

function formatDate(str) {
  return new Date(str).toLocaleDateString('ml-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function FeaturedCard({ article }) {
  const color = CAT_COLORS[article.category] || '#2997ff';
  const cat = CATEGORIES.find(c => c.value === article.category);
  return (
    <Link href={`/articles/${article.id}`} className="no-underline group block" style={{ gridColumn: '1 / -1' }}>
      <div className="article-card relative rounded-3xl overflow-hidden"
        style={{ minHeight: '380px', background: '#0a0a0a', border: `1px solid ${color}25` }}>
        {article.image_url ? (
          <>
            <img src={article.image_url} alt={article.title_ml}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              style={{ opacity: 0.35 }} />
            <div className="article-card-overlay absolute inset-0" style={{ background: 'linear-gradient(to top, #000 40%, transparent 100%)' }} />
          </>
        ) : (
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 60% at 30% 50%, ${color}12, transparent)` }} />
        )}
        <div className="relative z-10 flex flex-col justify-end h-full p-8 md:p-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
              style={{ background: `${color}25`, color, border: `1px solid ${color}40` }}>
              {cat?.en || article.category}
            </span>
            <span className="text-[11px] text-white/55">{formatDate(article.created_at)}</span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
              Featured
            </span>
          </div>
          <h2 className="text-[clamp(22px,3.5vw,38px)] font-black text-white leading-tight mb-3 group-hover:text-white/90 transition-colors"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            {article.title_ml}
          </h2>
          {article.title_en && (
            <p className="text-[15px] text-white/50 mb-3 font-medium">{article.title_en}</p>
          )}
          {article.summary_ml && (
            <p className="text-[14px] text-white/45 leading-relaxed max-w-2xl line-clamp-2"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              {article.summary_ml.replace(/<[^>]+>/g, '')}
            </p>
          )}
          <div className="mt-5 flex items-center gap-2 text-sm font-bold" style={{ color }}>
            വായിക്കുക
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="group-hover:translate-x-1 transition-transform">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ article }) {
  const color = CAT_COLORS[article.category] || '#2997ff';
  const cat = CATEGORIES.find(c => c.value === article.category);
  return (
    <Link href={`/articles/${article.id}`} className="no-underline group block">
      <div className="article-card relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
        style={{ minHeight: '280px', background: '#0a0a0a', border: `1px solid ${color}25` }}>

        {article.image_url ? (
          <>
            <img src={article.image_url} alt={article.title_ml}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              style={{ opacity: 0.35 }} />
            <div className="article-card-overlay absolute inset-0" style={{ background: 'linear-gradient(to top, #000 45%, transparent 100%)' }} />
          </>
        ) : (
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 60% at 30% 50%, ${color}12, transparent)` }} />
        )}

        <div className="relative z-10 flex flex-col justify-end h-full p-5" style={{ minHeight: '280px' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest"
              style={{ background: `${color}25`, color, border: `1px solid ${color}40` }}>
              {cat?.en || article.category}
            </span>
            <span className="text-[10px] text-white/50">{formatDate(article.created_at)}</span>
          </div>
          <h3 className="text-[15px] font-bold text-white leading-snug mb-1.5 group-hover:text-white/90 transition-colors line-clamp-2"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            {article.title_ml}
          </h3>
          {article.title_en && (
            <p className="text-[11px] text-white/60 mb-2 line-clamp-1">{article.title_en}</p>
          )}
          <div className="flex items-center gap-1.5 text-[12px] font-bold" style={{ color }}>
            വായിക്കുക
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="group-hover:translate-x-0.5 transition-transform">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('all');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const PAGE_SIZE = 13; // 1 featured + 12 grid

  async function fetchArticles(cat, offset, replace = false) {
    const catFilter = cat !== 'all' ? `&category=eq.${cat}` : '';
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/articles?select=id,title_ml,title_en,summary_ml,image_url,category,created_at${catFilter}&order=created_at.desc&limit=${PAGE_SIZE}&offset=${offset}`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const data = await res.json();
    if (!Array.isArray(data)) return;
    if (replace) setArticles(data);
    else setArticles(prev => [...prev, ...data]);
    setHasMore(data.length === PAGE_SIZE);
  }

  useEffect(() => {
    setLoading(true);
    setPage(0);
    fetchArticles(activeCat, 0, true).finally(() => setLoading(false));
  }, [activeCat]);

  async function loadMore() {
    setLoadingMore(true);
    const next = page + PAGE_SIZE;
    await fetchArticles(activeCat, next);
    setPage(next);
    setLoadingMore(false);
  }

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <>
      <Navbar />
      <main className="min-h-screen page-bg-dark pt-24 pb-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <Link href="/" className="text-[12px] text-white/50 hover:text-white no-underline transition-colors">
              ← keralaemployees.in
            </Link>
            <h1 className="text-[clamp(28px,4vw,48px)] font-[900] tracking-tight text-white mt-4 mb-2"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              ലേഖനങ്ങൾ
            </h1>
            <p className="text-[13px] text-white/55">Kerala government employees — articles, news, and guides</p>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap mb-10">
            {CATEGORIES.map(cat => (
              <button key={cat.value} onClick={() => setActiveCat(cat.value)}
                className={`px-4 py-2 rounded-xl text-[12px] font-bold border-none cursor-pointer transition-all ${activeCat !== cat.value ? 'cat-tab-inactive' : ''}`}
                style={activeCat === cat.value
                  ? { background: '#2997ff', color: 'white' }
                  : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.08)' }
                }>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3 h-[380px] rounded-3xl animate-pulse bg-white/[0.04]" />
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[320px] rounded-2xl animate-pulse bg-white/[0.04]" />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-24 text-white/50">
              <div className="text-5xl mb-4">📭</div>
              <p>ഈ category-ൽ ലേഖനങ്ങൾ ഒന്നും ഇല്ല.</p>
            </div>
          ) : (
            <>
              {/* Magazine grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Featured article — full width */}
                {featured && <FeaturedCard article={featured} />}

                {/* Grid cards */}
                {rest.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div className="mt-10 text-center">
                  <button onClick={loadMore} disabled={loadingMore}
                    className="cat-tab-more px-8 py-4 rounded-2xl text-sm font-bold border-none cursor-pointer transition-all disabled:opacity-50 hover:bg-white/10"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>
                    {loadingMore ? 'Loading...' : 'കൂടുതൽ ലേഖനങ്ങൾ'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
