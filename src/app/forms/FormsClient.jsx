'use client';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FORMS, FINANCE_BASE } from './formsData';

const CATEGORIES = ['All', ...Array.from(new Set(FORMS.map(f => f.category)))];

const CAT_COLOR = {
  'Pension':      '#2997ff',
  'Service Book': '#30d158',
  'Leave':        '#64d2ff',
  'GPF':          '#ff9f0a',
  'NPS':          '#bf5af2',
  'GIS':          '#ff6b00',
  'SLI':          '#ffd60a',
  'Insurance':    '#ff453a',
  'HBA':          '#30d158',
  'KFC':          '#ac8e68',
  'Treasury':     '#0a84ff',
  'IT / Digital': '#5e5ce6',
  'Training':     '#64d2ff',
  'Planning':     '#ff9f0a',
};

function FormsContent() {
  const searchParams = useSearchParams();
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat && CATEGORIES.includes(cat)) setCategory(cat);
  }, [searchParams]);

  const filtered = useMemo(() => FORMS.filter(f => {
    const matchCat = category === 'All' || f.category === category;
    const q = search.toLowerCase();
    const matchQ = !q ||
      f.title.toLowerCase().includes(q) ||
      f.formNo.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q);
    return matchCat && matchQ;
  }), [search, category]);

  return (
    <>
      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by form name, number or category..."
        className="w-full rounded-xl px-4 py-3 text-[14px] text-white outline-none focus:ring-1 focus:ring-white/20 mb-4"
        style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}
      />

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {CATEGORIES.map(cat => {
          const color = cat === 'All' ? '#2997ff' : (CAT_COLOR[cat] || '#2997ff');
          const active = category === cat;
          return (
            <button key={cat} onClick={() => setCategory(cat)}
              className="px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all"
              style={{
                background: active ? `${color}22` : 'var(--surface-xs)',
                color: active ? color : 'var(--text-dim)',
                border: `1px solid ${active ? color : 'var(--surface-xs)'}`,
              }}>
              {cat}
              <span className="ml-1.5 text-[9px] opacity-60">
                {cat === 'All' ? FORMS.length : FORMS.filter(f => f.category === cat).length}
              </span>
            </button>
          );
        })}
      </div>

      <div className="text-[11px] text-white/45 mb-4">{filtered.length} form{filtered.length !== 1 ? 's' : ''} found</div>

      {/* Forms list */}
      <div className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid var(--surface-sm)' }}>

        {/* Table header */}
        <div className="hidden md:grid grid-cols-[120px_1fr_130px_100px] gap-0 px-5 py-3"
          style={{ background: 'var(--surface-xs)', borderBottom: '1px solid var(--surface-xs)' }}>
          <div className="text-[10px] font-black uppercase tracking-widest text-white/50">Form No.</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-white/50">Title</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-white/50">Category</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-white/50 text-right">Download</div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-white/50 text-[14px]">No forms found</div>
        ) : (
          filtered.map((form, i) => {
            const color = CAT_COLOR[form.category] || '#2997ff';
            const url = `${FINANCE_BASE}${form.id}`;
            return (
              <div key={form.id}
                className="grid grid-cols-1 md:grid-cols-[120px_1fr_130px_100px] gap-3 md:gap-0 px-5 py-4 items-center transition-colors hover:bg-white/[0.02]"
                style={{ borderTop: i > 0 ? '1px solid var(--surface-xs)' : 'none' }}>

                <div>
                  <span className="text-[12px] font-black px-2.5 py-1 rounded-lg"
                    style={{ background: `${color}15`, color }}>
                    {form.formNo}
                  </span>
                </div>

                <div className="md:pr-4">
                  <div className="text-[13px] text-white/75 leading-snug" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                    {form.title}
                  </div>
                  <div className="text-[10px] text-white/45 mt-0.5">{form.date}</div>
                </div>

                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${color}12`, color, border: `1px solid ${color}25` }}>
                    {form.category}
                  </span>
                </div>

                <div className="md:text-right">
                  <a href={url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black transition-all hover:scale-[1.04] no-underline"
                    style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1v7M3 6l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Download
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Source note */}
      <div className="mt-6 flex items-start gap-2 text-[11px] text-white/45">
        <span>ℹ</span>
        <span>
          Forms sourced from{' '}
          <a href="https://finance.kerala.gov.in/forms.jsp" target="_blank" rel="noopener noreferrer"
            className="no-underline hover:text-white/50 transition-colors" style={{ color: '#2997ff' }}>
            finance.kerala.gov.in — Finance Department, Government of Kerala
          </a>.
          Downloads open directly from the official server.
        </span>
      </div>

      {/* Also see pension forms */}
      <div className="mt-6 rounded-2xl p-5"
        style={{ background: 'rgba(41,151,255,0.04)', border: '1px solid rgba(41,151,255,0.12)' }}>
        <div className="text-[10px] font-black uppercase tracking-widest text-[#2997ff] mb-3">Also See</div>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Pension Forms (PRISM — 24 forms)', href: '/pension-forms' },
            { label: 'Pension Calculator', href: '/pension' },
            { label: 'DCRG Calculator', href: '/dcrg' },
            { label: 'GPF Information', href: '/gpf' },
          ].map(l => (
            <Link key={l.href} href={l.href}
              className="px-4 py-2 rounded-xl text-[12px] font-bold no-underline transition-all hover:scale-[1.03]"
              style={{ background: 'rgba(41,151,255,0.10)', color: '#2997ff', border: '1px solid rgba(41,151,255,0.20)' }}>
              {l.label} →
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default function FormsClient() {
  return (
    <Suspense fallback={<div className="text-white/40 text-sm py-4">Loading forms...</div>}>
      <FormsContent />
    </Suspense>
  );
}
