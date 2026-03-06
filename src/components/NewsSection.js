'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const CATEGORY_LABELS = {
  pay: { label: 'ശമ്പളം', color: '#2997ff' },
  da: { label: 'ക്ഷാമബത്ത', color: '#ff9f0a' },
  medisep: { label: 'മെഡിസെപ്', color: '#ff453a' },
  gpf: { label: 'GPF', color: '#30d158' },
  nps: { label: 'NPS', color: '#bf5af2' },
  pension: { label: 'പെൻഷൻ', color: '#ff9f0a' },
  general: { label: 'പൊതുവായത്', color: '#6e6e73' },
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)} മിനിറ്റ് മുൻപ്`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} മണിക്കൂർ മുൻപ്`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ദിവസം മുൻപ്`;
  return new Date(dateStr).toLocaleDateString('ml-IN');
}

function NewsCard({ news, index, featured }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const cat = CATEGORY_LABELS[news.category] || CATEGORY_LABELS.general;

  if (featured) {
    return (
      <Link href={`/news/${news.id}`} ref={ref}
        className="no-underline block group col-span-2 relative rounded-2xl overflow-hidden transition-all duration-700"
        style={{
          background: 'linear-gradient(135deg, rgba(41,151,255,0.08) 0%, rgba(0,0,0,0) 100%)',
          border: '1px solid rgba(41,151,255,0.15)',
          boxShadow: '0 0 40px rgba(41,151,255,0.05)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(32px)',
          filter: visible ? 'blur(0)' : 'blur(6px)',
          transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
          transitionDelay: `${index * 100}ms`,
        }}>
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(41,151,255,0.4), transparent)' }} />
        <div className="p-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ background: `${cat.color}20`, color: cat.color, border: `1px solid ${cat.color}30` }}>
              {cat.label}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-pulse" />
              <span className="text-[10px] text-[#30d158] font-semibold">Featured</span>
            </span>
            <span className="text-[10px] text-[#6e6e73] ml-auto">{timeAgo(news.published_at)}</span>
          </div>
          <h3 className="text-xl font-black text-white leading-snug mb-3 group-hover:text-[#2997ff] transition-colors"
            style={{ fontFamily: "'Noto Sans Malayalam', serif" }}>
            {news.title_ml}
          </h3>
          {news.summary_ml && (
            <p className="text-sm text-[#86868b] leading-relaxed line-clamp-2"
              style={{ fontFamily: "'Noto Sans Malayalam', sans-serif" }}>
              {news.summary_ml}
            </p>
          )}
          <div className="mt-5 flex items-center gap-2 text-[#2997ff] text-xs font-bold">
            കൂടുതൽ വായിക്കുക
            <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/news/${news.id}`} ref={ref}
      className="no-underline block group relative rounded-2xl overflow-hidden transition-all duration-700"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        filter: visible ? 'blur(0)' : 'blur(6px)',
        transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
        transitionDelay: `${index * 100}ms`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.borderColor = `${cat.color}30`;
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}>
      {/* Color accent bar */}
      <div className="h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-t-full"
        style={{ background: cat.color }} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: `${cat.color}15`, color: cat.color }}>
            {cat.label}
          </span>
          <span className="text-[10px] text-[#6e6e73]">{timeAgo(news.published_at)}</span>
        </div>
        <h3 className="text-sm font-bold text-white leading-snug mb-2 group-hover:text-[#e5e5e7] transition-colors"
          style={{ fontFamily: "'Noto Sans Malayalam', serif" }}>
          {news.title_ml}
        </h3>
        {news.summary_ml && (
          <p className="text-xs text-[#6e6e73] leading-relaxed line-clamp-2"
            style={{ fontFamily: "'Noto Sans Malayalam', sans-serif" }}>
            {news.summary_ml}
          </p>
        )}
        <div className="mt-3 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: cat.color }}>
          വായിക്കുക →
        </div>
      </div>
    </Link>
  );
}

export default function NewsSection({ news = [] }) {
  if (!news.length) return null;

  const featured = news.filter(n => n.is_featured).slice(0, 2);
  const rest = news.filter(n => !n.is_featured).slice(0, 4);

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#ff453a] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff453a]">Live Updates</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              ഏറ്റവും പുതിയ വാർത്തകൾ
            </h2>
            <p className="text-sm text-[#6e6e73] mt-1">Kerala Government Employee News</p>
          </div>
          <Link href="/news"
            className="no-underline px-5 py-2.5 rounded-xl text-xs font-bold text-[#86868b] hover:text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            എല്ലാം കാണുക →
          </Link>
        </div>

        {/* Featured row */}
        {featured.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {featured.map((n, i) => (
              <NewsCard key={n.id} news={n} index={i} featured={true} />
            ))}
          </div>
        )}

        {/* Regular grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rest.map((n, i) => (
              <NewsCard key={n.id} news={n} index={i + featured.length} featured={false} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
