'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { CATEGORIES, getCatInfo } from '@/lib/actsData';

export default function ActsClient({ acts }) {
  const [activecat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = acts;
    if (activecat !== 'all') list = list.filter(a => a.category === activecat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        (a.title_ml || '').includes(q) ||
        (a.summary || '').toLowerCase().includes(q) ||
        (a.tags || '').toLowerCase().includes(q) ||
        String(a.year || '').includes(q)
      );
    }
    return list;
  }, [acts, activecat, search]);

  const countByCat = useMemo(() => {
    const m = {};
    acts.forEach(a => { m[a.category] = (m[a.category] || 0) + 1; });
    return m;
  }, [acts]);

  return (
    <>
      {/* Search */}
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none text-sm">🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setActiveCat('all'); }}
          placeholder="Search acts... (e.g. Land Assignment Act, Labour Act, KSR)"
          className="w-full pl-10 pr-10 py-3.5 bg-white/[0.05] border border-white/10 rounded-2xl text-[14px] text-white placeholder-white/25 outline-none focus:border-[#2997ff] transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-transparent border-none cursor-pointer">✕</button>
        )}
      </div>

      {/* Category Tabs */}
      {!search && (
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(cat => {
            const count = cat.id === 'all' ? acts.length : (countByCat[cat.id] || 0);
            const active = activecat === cat.id;
            return (
              <button key={cat.id} onClick={() => setActiveCat(cat.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold border-none cursor-pointer transition-all"
                style={{
                  background: active ? cat.color + '20' : 'rgba(255,255,255,0.04)',
                  color: active ? cat.color : 'rgba(255,255,255,0.4)',
                  outline: active ? `1px solid ${cat.color}40` : 'none',
                }}>
                {cat.icon} <span style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>{cat.label}</span>
                <span className="opacity-50">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="text-[11px] text-white/45 mb-5">{filtered.length} നിയമങ്ങൾ</div>

      {/* Acts Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-white/50">
          <div className="text-4xl mb-3">📭</div>
          <div style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>ഒന്നും കണ്ടെത്തിയില്ല</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(act => {
            const cat = getCatInfo(act.category);
            const tags = act.tags ? act.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
            return (
              <Link key={act.id} href={`/acts-rules/${act.slug}`}
                className="glass-card rounded-2xl p-5 no-underline group hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
                style={{ outline: `1px solid ${cat.color}18` }}>

                {/* Category badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg"
                    style={{ background: cat.color + '18', color: cat.color }}>
                    {cat.icon} {cat.en}
                  </span>
                  {act.year && (
                    <span className="text-[10px] text-white/50 font-semibold">{act.year}</span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-[15px] font-bold text-white/90 group-hover:text-white leading-snug mb-1 transition-colors">
                  {act.title}
                </h2>
                {act.title_ml && (
                  <div className="text-[12px] text-white/60 mb-3" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                    {act.title_ml}
                  </div>
                )}

                {/* Summary excerpt */}
                {act.summary && (
                  <p className="text-[12px] text-white/50 leading-relaxed mb-4 line-clamp-3 flex-1">
                    {act.summary}
                  </p>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tags.slice(0, 4).map((tag, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-lg bg-white/[0.05] text-white/60">{tag}</span>
                    ))}
                  </div>
                )}

                {/* Footer row */}
                <div className="flex items-center gap-3 mt-auto pt-3 border-t border-white/[0.06]">
                  <span className="text-[11px] font-bold text-[#2997ff] group-hover:underline">
                    Summary & Details →
                  </span>
                  {act.pdf_url && (
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-lg"
                      style={{ background: 'rgba(48,209,88,0.12)', color: '#30d158' }}>
                      📄 PDF
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
