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
        <ThreadList category={activeCategory} />

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
