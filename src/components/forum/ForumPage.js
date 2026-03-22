// src/components/forum/ForumPage.js
'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ThreadList from './ThreadList';
import NewThreadModal from './NewThreadModal';

const CATEGORIES = [
  { key: 'service_matters', label: 'സേവന കാര്യങ്ങൾ', en: 'Service Matters' },
  { key: 'pension',         label: 'പെൻഷൻ',           en: 'Pension' },
  { key: 'nps_aps',         label: 'NPS / APS',         en: 'NPS / APS' },
  { key: 'leave',           label: 'അവധി',              en: 'Leave' },
  { key: 'general',         label: 'പൊതു ചർച്ച',       en: 'General' },
];

export default function ForumPage() {
  const searchParams = useSearchParams();
  const initialCategory = CATEGORIES.find(c => c.key === searchParams.get('category'))?.key || 'service_matters';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [showNewThread, setShowNewThread] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest'); // 'newest' | 'popular'

  return (
    <main className="min-h-screen bg-aurora text-white pt-24 pb-16 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <a href="/" className="text-[12px] text-white/70 hover:text-white no-underline transition-colors">
            ← keralaemployees.in
          </a>
          <div className="flex items-end justify-between mt-4 gap-4">
            <div>
              <h1 className="text-[clamp(24px,4vw,38px)] font-[900] tracking-[-0.03em] text-white"
                style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                ചർച്ചാ വേദി
              </h1>
              <p className="text-[13px] text-white/60 mt-1">Kerala government employees discussion forum</p>
            </div>
            <button
              onClick={() => setShowNewThread(true)}
              className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold text-white border-none cursor-pointer transition-all hover:brightness-110"
              style={{ background: '#2997ff' }}>
              + പുതിയ ചർച്ച
            </button>
          </div>
        </div>

        {/* Search + Sort */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ചർച്ചകൾ തിരയുക..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white outline-none transition-all"
              style={{
                background: 'var(--surface-xs)',
                border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: "var(--font-noto-malayalam), sans-serif",
              }}
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white bg-transparent border-none cursor-pointer text-sm">
                ✕
              </button>
            )}
          </div>
          <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              { key: 'newest',  label: 'പുതിയത്' },
              { key: 'popular', label: 'പ്രശസ്തം' },
            ].map(s => (
              <button key={s.key} onClick={() => setSort(s.key)}
                className="px-3 py-2.5 text-[12px] font-semibold border-none cursor-pointer transition-all"
                style={{
                  fontFamily: "var(--font-noto-malayalam), sans-serif",
                  background: sort === s.key ? 'rgba(41,151,255,0.2)' : 'var(--surface-xs)',
                  color: sort === s.key ? '#2997ff' : 'var(--text-muted)',
                }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold border-none cursor-pointer transition-all"
              style={{
                fontFamily: "var(--font-noto-malayalam), sans-serif",
                background: activeCategory === cat.key ? 'rgba(41,151,255,0.15)' : 'var(--surface-xs)',
                color: activeCategory === cat.key ? '#2997ff' : 'var(--text-muted)',
                border: activeCategory === cat.key ? '1px solid rgba(41,151,255,0.3)' : '1px solid transparent',
              }}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Thread list */}
        <ThreadList category={activeCategory} search={search} sort={sort} />

      </div>

      {showNewThread && (
        <NewThreadModal
          defaultCategory={activeCategory}
          onClose={() => setShowNewThread(false)}
        />
      )}
    </main>
  );
}
