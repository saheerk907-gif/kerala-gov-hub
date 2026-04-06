'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const F  = '#3a4258';
const F2 = '#2e3a50';
const D  = '#252e42';
const BG = '#0d1117';

const CATEGORY_LABELS = {
  pay:     { label: 'ശമ്പളം',     color: '#2997ff' },
  da:      { label: 'ക്ഷാമബത്ത', color: '#ff9f0a' },
  medisep: { label: 'മെഡിസെപ്', color: '#ff453a' },
  gpf:     { label: 'GPF',         color: '#30d158' },
  nps:     { label: 'NPS',         color: '#bf5af2' },
  pension: { label: 'പെൻഷൻ',     color: '#ff9f0a' },
  general: { label: 'പൊതുവായത്', color: '#6e6e73' },
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 3600)   return `${Math.floor(diff / 60)} മിനിറ്റ് മുൻപ്`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)} മണിക്കൂർ മുൻപ്`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ദിവസം മുൻപ്`;
  return new Date(dateStr).toLocaleDateString('ml-IN');
}

// ─── Featured card illustration — newspaper columns ────────────────────────────
function FeaturedIllustration() {
  return (
    <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">
      {/* Headline bar */}
      <rect x="170" y="18" width="220" height="18" rx="5" fill={F}/>
      <line x1="170" y1="44" x2="395" y2="44" stroke={F} strokeWidth="1.5"/>
      {/* Column 1 */}
      {[58,72,86,100,114,128,142].map(y => (
        <line key={y} x1="170" y1={y} x2="276" y2={y} stroke={F2} strokeWidth="4.5" strokeLinecap="round"/>
      ))}
      {/* Column 2 */}
      {[58,72,86,100,114,128,142].map(y => (
        <line key={y} x1="286" y1={y} x2="392" y2={y} stroke={F2} strokeWidth="4.5" strokeLinecap="round"/>
      ))}
      {/* Bottom image placeholder */}
      <rect x="170" y="154" width="220" height="22" rx="5" fill={F2}/>
      {/* Fold line hint */}
      <line x1="280" y1="18" x2="280" y2="176" stroke={D} strokeWidth="1" strokeDasharray="6 4"/>
    </svg>
  );
}

// ─── Regular card illustration — broadcast waves ───────────────────────────────
function RegularIllustration({ color = '#2997ff' }) {
  const c = color;
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet"
      style={{ position: 'absolute', right: '-8px', top: '50%', transform: 'translateY(-50%)', width: '52%', height: '100%' }} aria-hidden="true">
      <circle cx="85" cy="60" r="52" fill="none" stroke={F} strokeWidth="1.5" strokeDasharray="8 5" opacity="0.55"/>
      <circle cx="85" cy="60" r="37" fill="none" stroke={F} strokeWidth="2"   opacity="0.65"/>
      <circle cx="85" cy="60" r="23" fill="none" stroke={F} strokeWidth="2.5" opacity="0.75"/>
      <circle cx="85" cy="60" r="11" fill={F}/>
      <circle cx="85" cy="60" r="5"  fill={D}/>
    </svg>
  );
}

// ─── NewsCard ─────────────────────────────────────────────────────────────────
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

  const fadeStyle = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(32px)',
    filter: visible ? 'blur(0)' : 'blur(6px)',
    transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
    transitionDelay: `${index * 100}ms`,
  };

  if (featured) {
    return (
      /* Gradient border wrapper — col-span-2 lives here */
      <div ref={ref} className="col-span-2" style={{
        background: 'linear-gradient(135deg,rgba(140,80,240,0.5),rgba(60,130,255,0.5))',
        padding: '1.5px', borderRadius: 20, ...fadeStyle,
      }}>
        <Link href={`/news/${news.id}`}
          className="no-underline block group relative rounded-[18px] overflow-hidden transition-all duration-300 hover:brightness-105"
          style={{ background: BG }}>
          {/* Newspaper illustration */}
          <FeaturedIllustration />
          {/* Left gradient overlay */}
          <div style={{ position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(13,17,23,0.98) 30%, rgba(13,17,23,0.78) 55%, rgba(13,17,23,0.25) 80%, transparent 100%)' }}/>
          {/* Content */}
          <div className="relative p-7" style={{ zIndex: 10 }}>
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
      </div>
    );
  }

  return (
    /* Gradient border wrapper */
    <div ref={ref} style={{
      background: 'linear-gradient(135deg,rgba(140,80,240,0.5),rgba(60,130,255,0.5))',
      padding: '1.5px', borderRadius: 18, ...fadeStyle,
    }}>
      <Link href={`/news/${news.id}`}
        className="no-underline block group relative rounded-[16px] overflow-hidden transition-all duration-300 hover:brightness-105"
        style={{ background: BG }}>
        {/* Broadcast illustration */}
        <RegularIllustration color={cat.color} />
        {/* Left gradient overlay */}
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(13,17,23,0.97) 40%, rgba(13,17,23,0.7) 65%, rgba(13,17,23,0.2) 85%, transparent 100%)' }}/>
        {/* Color accent bar on hover */}
        <div className="h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-t-full absolute top-0 left-0"
          style={{ background: cat.color }} />
        {/* Content */}
        <div className="relative p-5" style={{ zIndex: 10 }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ background: `${cat.color}18`, color: cat.color, border: `1px solid ${cat.color}28` }}>
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
    </div>
  );
}

// ─── NewsSection ──────────────────────────────────────────────────────────────
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
            style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}>
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
