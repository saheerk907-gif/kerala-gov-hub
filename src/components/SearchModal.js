'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const STATIC_INDEX = [
  { label: '12th PRC Calculator',       sub: 'Pay Revision 2024',               href: '/prc',                              category: 'Tools'       },
  { label: 'NPS vs APS',               sub: 'Pension Comparison',               href: '/nps-aps',                          category: 'Tools'       },
  { label: 'Pension Calculator',        sub: 'Monthly Pension',                  href: '/pension',                          category: 'Tools'       },
  { label: 'DCRG Calculator',           sub: 'Retirement Gratuity',              href: '/dcrg',                             category: 'Tools'       },
  { label: 'DA Arrear Calculator',      sub: '11th PRC · Mar 2021',              href: '/da-arrear',                        category: 'Tools'       },
  { label: 'GPF Calculator',            sub: 'Provident Fund',                   href: '/gpf',                              category: 'Tools'       },
  { label: 'Income Tax Calculator',     sub: 'FY 2025-26 New/Old Regime',        href: '/income-tax',                       category: 'Tools'       },
  { label: 'Leave Calculator',          sub: 'Earned Leave · KSR Part I',        href: '/leave',                            category: 'Tools'       },
  { label: 'Medisep',                   sub: 'Health Insurance Info',            href: '/medisep',                          category: 'Tools'       },
  { label: 'All Govt Orders',           sub: 'All Government Orders',            href: '#orders',                           category: 'Govt Orders' },
  { label: 'DA Orders',                 sub: 'Dearness Allowance',               href: '#orders',                           category: 'Govt Orders' },
  { label: 'Bonus / Festival',          sub: 'Bonus & Festival Allowance',       href: '#orders',                           category: 'Govt Orders' },
  { label: 'MEDISEP Orders',            sub: 'Medical Insurance Orders',         href: '#orders',                           category: 'Govt Orders' },
  { label: 'Pension Orders',            sub: 'Pension Orders',                   href: '#orders',                           category: 'Govt Orders' },
  { label: 'Pay Revision Orders',       sub: 'Pay Revision Orders',              href: '#orders',                           category: 'Govt Orders' },
  { label: 'GPF / NPS Orders',          sub: 'Provident Fund Orders',            href: '#orders',                           category: 'Govt Orders' },
  { label: 'Leave Orders',              sub: 'Leave Rule Orders',                href: '#orders',                           category: 'Govt Orders' },
  { label: 'Kerala Service Rules',      sub: 'KSR Parts I, II, III',             href: '/ksr',                              category: 'Schemes'     },
  { label: 'MEDISEP Scheme',            sub: 'Medical Insurance Scheme',         href: '/medisep',                          category: 'Schemes'     },
  { label: 'GPF',                       sub: 'General Provident Fund',           href: '/gpf',                              category: 'Schemes'     },
  { label: 'NPS',                       sub: 'National Pension System',          href: '/nps-aps',                          category: 'Schemes'     },
  { label: 'SLI',                       sub: 'State Life Insurance',             href: '#services',                         category: 'Schemes'     },
  { label: 'GIS',                       sub: 'Group Insurance Scheme',           href: '#services',                         category: 'Schemes'     },
  { label: 'Common Tests',              sub: 'MOP, KSR, KFC, KTC…',             href: '/departmental-tests?dept=common',   category: 'Dept Tests'  },
  { label: 'Revenue Department Tests',  sub: 'Revenue Test Papers I–IV',         href: '/departmental-tests?dept=revenue',  category: 'Dept Tests'  },
  { label: 'Panchayat Tests',           sub: 'Panchayat Test Papers',            href: '/departmental-tests?dept=panchayat',category: 'Dept Tests'  },
  { label: 'Judiciary Tests',           sub: 'Civil & Criminal Tests',           href: '/departmental-tests?dept=judiciary',category: 'Dept Tests'  },
  { label: 'Police Tests',              sub: 'Police Manual Test',               href: '/departmental-tests?dept=police',   category: 'Dept Tests'  },
  { label: 'Education Tests',           sub: 'Kerala Education Rules',           href: '/departmental-tests?dept=education',category: 'Dept Tests'  },
  { label: 'All Departmental Tests',    sub: 'Browse all 64 departments',        href: '/departmental-tests',               category: 'Dept Tests'  },
  { label: 'All Forms',                 sub: 'All 65+ Government Forms',         href: '/forms',                            category: 'Forms'       },
  { label: 'Pension Forms (PRISM)',      sub: 'Form 2, 4B, 5, 6, 8, 11…',        href: '/pension-forms',                    category: 'Forms'       },
  { label: 'GPF Forms',                 sub: 'PF Form A, B, B1, D, J',           href: '/forms?cat=GPF',                    category: 'Forms'       },
  { label: 'Leave Forms',               sub: 'Form 13 · Medical Certificate',    href: '/forms?cat=Leave',                  category: 'Forms'       },
  { label: 'HBA Forms',                 sub: 'House Building Advance',           href: '/forms?cat=HBA',                    category: 'Forms'       },
  { label: 'KFC Forms',                 sub: 'KFC Form 1A–40',                   href: '/forms?cat=KFC',                    category: 'Forms'       },
  { label: 'Treasury / TR Forms',       sub: 'TR 46, 47, 59C, 83B, 103, 104',   href: '/forms?cat=Treasury',               category: 'Forms'       },
  { label: 'NPS / GIS / SLI Forms',     sub: 'PRAN, Option, Revival Forms',      href: '/forms?cat=NPS',                    category: 'Forms'       },
  { label: 'All Articles',              sub: 'All published articles',           href: '/articles',                         category: 'Articles'    },
  { label: 'MEDISEP Articles',          sub: 'Claim, complaint, FAQ',            href: '/articles?cat=medisep',             category: 'Articles'    },
  { label: 'Pension Articles',          sub: 'Calculation, rules',               href: '/articles?cat=pension',             category: 'Articles'    },
  { label: 'KSR Articles',              sub: 'Service rule updates',             href: '/articles?cat=ksr',                 category: 'Articles'    },
  { label: 'DA / Pay Articles',         sub: 'Dearness allowance updates',       href: '/articles?cat=da',                  category: 'Articles'    },
  { label: 'Latest News',               sub: 'Government news feed',             href: '/news',                             category: 'Articles'    },
  { label: 'SPARK Portal',              sub: 'spark.gov.in',                     href: 'https://spark.gov.in',              category: 'Portals',    external: true },
  { label: 'e-Treasury',                sub: 'treasury.kerala.gov.in',           href: 'https://treasury.kerala.gov.in',    category: 'Portals',    external: true },
  { label: 'MEDISEP Portal',            sub: 'medisep.kerala.gov.in',            href: 'https://medisep.kerala.gov.in',     category: 'Portals',    external: true },
  { label: 'NPS / CRA',                 sub: 'npscra.nsdl.co.in',               href: 'https://www.npscra.nsdl.co.in',     category: 'Portals',    external: true },
  { label: 'Finance Department',        sub: 'finance.kerala.gov.in',            href: 'https://www.finance.kerala.gov.in', category: 'Portals',    external: true },
  { label: 'Pension Portal',            sub: 'pension.treasury.kerala.gov.in',   href: 'https://pension.treasury.kerala.gov.in', category: 'Portals', external: true },
  { label: 'Kerala.gov.in',             sub: 'Official Government Portal',       href: 'https://www.kerala.gov.in',         category: 'Portals',    external: true },
];

/* Category display order + icons */
const CATEGORY_ORDER = [
  { key: 'Tools',       icon: '🧮', desc: 'Calculators & utilities' },
  { key: 'Govt Orders', icon: '📄', desc: 'Government orders' },
  { key: 'Schemes',     icon: '📋', desc: 'Schemes & rules' },
  { key: 'Dept Tests',  icon: '🧠', desc: 'Departmental exams' },
  { key: 'Forms',       icon: '📝', desc: 'Downloadable forms' },
  { key: 'Articles',    icon: '📰', desc: 'Guides & news' },
  { key: 'Portals',     icon: '🔗', desc: 'External portals' },
];

/* Group static index by category in display order */
const GROUPED_INDEX = CATEGORY_ORDER.map(cat => ({
  ...cat,
  items: STATIC_INDEX.filter(i => i.category === cat.key),
})).filter(g => g.items.length > 0);

const CATEGORY_COLORS = {
  'Tools':       '#2997ff',
  'Govt Orders': '#ff9f0a',
  'Schemes':     '#30d158',
  'Dept Tests':  '#bf5af2',
  'Forms':       '#ff6b6b',
  'Articles':    '#64d2ff',
  'Portals':     '#c8960c',
  'News':        '#ff453a',
  'Orders':      '#ff9f0a',
  'Quick Links': '#5e5ce6',
  'Resources':   '#c8960c',
};

async function searchSupabase(q) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  const enc = encodeURIComponent(`%${q}%`);
  const h = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };

  const results = await Promise.allSettled([
    // News
    fetch(`${SUPABASE_URL}/rest/v1/news?or=(title_ml.ilike.${enc},title_en.ilike.${enc})&select=id,title_ml,title_en&limit=4`, { headers: h })
      .then(r => r.json()).then(d => (Array.isArray(d) ? d : []).map(x => ({
        label: x.title_ml || x.title_en || 'News', sub: x.title_en || '', href: '/news', category: 'News',
      }))).catch(() => []),
    // Government orders
    fetch(`${SUPABASE_URL}/rest/v1/government_orders?title=ilike.${enc}&select=id,title,order_number&order=date.desc&limit=4`, { headers: h })
      .then(r => r.json()).then(d => (Array.isArray(d) ? d : []).map(x => ({
        label: x.title, sub: x.order_number || '', href: '#orders', category: 'Orders',
      }))).catch(() => []),
    // Schemes
    fetch(`${SUPABASE_URL}/rest/v1/schemes?or=(title_ml.ilike.${enc},title_en.ilike.${enc})&select=id,title_ml,title_en,slug&limit=4`, { headers: h })
      .then(r => r.json()).then(d => (Array.isArray(d) ? d : []).map(x => ({
        label: x.title_ml || x.title_en || '', sub: x.title_en || '', href: `/${x.slug || '#services'}`, category: 'Schemes',
      }))).catch(() => []),
    // Quick links
    fetch(`${SUPABASE_URL}/rest/v1/quick_links?or=(label.ilike.${enc},url.ilike.${enc})&select=id,label,url&limit=4`, { headers: h })
      .then(r => r.json()).then(d => (Array.isArray(d) ? d : []).map(x => ({
        label: x.label, sub: x.url || '', href: x.url || '#', category: 'Quick Links', external: /^https?:\/\//.test(x.url || ''),
      }))).catch(() => []),
    // Resource links
    fetch(`${SUPABASE_URL}/rest/v1/resource_links?label=ilike.${enc}&is_active=eq.true&select=id,label,href&limit=4`, { headers: h })
      .then(r => r.json()).then(d => (Array.isArray(d) ? d : []).map(x => ({
        label: x.label, sub: '', href: x.href || '#', category: 'Resources', external: /^https?:\/\//.test(x.href || ''),
      }))).catch(() => []),
  ]);

  return results.flatMap(r => r.status === 'fulfilled' ? r.value : []);
}

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [staticResults, setStaticResults] = useState([]);
  const [liveResults, setLiveResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const debounceRef = useRef(null);

  const allResults = [...staticResults, ...liveResults];
  const hasQuery = query.trim().length > 0;

  // Static filter
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setStaticResults([]); setLiveResults([]); return; }
    setStaticResults(
      STATIC_INDEX.filter(i =>
        i.label.toLowerCase().includes(q) ||
        i.sub.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
      ).slice(0, 20)
    );
  }, [query]);

  // Debounced Supabase search
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) { setLiveResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const r = await searchSupabase(q);
      setLiveResults(r);
      setLoading(false);
    }, 320);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setStaticResults([]);
      setLiveResults([]);
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => { setActiveIdx(0); }, [query]);

  // Scroll active into view
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  /* Flat list for keyboard nav: either search results or all static items */
  const flatItems = hasQuery ? allResults : STATIC_INDEX;

  const handleKey = useCallback((e) => {
    if (!open) return;
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, flatItems.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter') { e.preventDefault(); const item = flatItems[activeIdx]; if (item) navigate(item); }
  }, [open, flatItems, activeIdx, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  function navigate(item) {
    onClose();
    if (item.external) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    } else if (item.href.startsWith('#')) {
      const id = item.href.slice(1);
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } else {
      window.location.href = item.href;
    }
  }

  if (!open) return null;

  /* ── Build grouped data for search results ── */
  const searchGroups = hasQuery
    ? allResults.reduce((acc, item, idx) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push({ ...item, _idx: idx });
        return acc;
      }, {})
    : {};

  /* ── Flat index counter for browse mode keyboard nav ── */
  let browseIdx = 0;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-start justify-center pt-[6vh] px-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-[620px] rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.8)]"
        style={{ background: 'var(--nav-dropdown-bg)', border: '1px solid var(--nav-dropdown-border)' }}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.07]">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" className="text-white/50 flex-shrink-0">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tools, forms, orders, schemes, portals, news…"
            className="flex-1 bg-transparent border-none outline-none text-[14px] text-white/80 placeholder-white/25"
            spellCheck={false}
          />
          {loading && (
            <div className="w-4 h-4 rounded-full border-2 border-white/10 border-t-[#2997ff] animate-spin flex-shrink-0" />
          )}
          {query && !loading && (
            <button onClick={() => setQuery('')}
              className="text-white/45 hover:text-white/55 transition-colors border-none bg-transparent cursor-pointer text-lg leading-none p-2 min-w-[48px] min-h-[48px] flex items-center justify-center">
              ×
            </button>
          )}
          <kbd className="hidden sm:flex items-center text-[10px] text-white/40 border border-white/10 rounded px-1.5 py-0.5 font-mono">ESC</kbd>
        </div>

        {/* Results / Browse */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto overscroll-contain">

          {/* ══════ BROWSE MODE: Show ALL items grouped by category ══════ */}
          {!hasQuery && (
            <>
              <div className="px-4 pt-3 pb-1.5">
                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-white/40">
                  Browse everything · {STATIC_INDEX.length} items
                </span>
              </div>
              {GROUPED_INDEX.map(group => {
                const color = CATEGORY_COLORS[group.key] || '#ffffff';
                return (
                  <div key={group.key} className="mb-1">
                    {/* Category header */}
                    <div className="flex items-center gap-2 px-4 pt-2.5 pb-1">
                      <span className="text-[13px]">{group.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color }}>
                        {group.key}
                      </span>
                      <span className="text-[9px] text-white/30 ml-0.5">{group.desc}</span>
                      <div className="flex-1 h-px" style={{ background: color + '15' }} />
                      <span className="text-[9px] text-white/25">{group.items.length}</span>
                    </div>
                    {/* Items */}
                    <div className="px-1.5 pb-0.5">
                      {group.items.map(item => {
                        const thisIdx = browseIdx++;
                        const isActive = thisIdx === activeIdx;
                        return (
                          <button
                            key={`${item.category}-${item.label}`}
                            data-active={isActive}
                            onMouseEnter={() => setActiveIdx(thisIdx)}
                            onClick={() => navigate(item)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left cursor-pointer border-none transition-all duration-100"
                            style={{ background: isActive ? 'var(--surface-xs)' : 'transparent' }}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[13px] font-semibold text-white/80 truncate">{item.label}</span>
                                {item.external && (
                                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor"
                                    strokeWidth="1.5" strokeLinecap="round" className="opacity-25 flex-shrink-0">
                                    <path d="M1 9L9 1M9 1H4M9 1V6" />
                                  </svg>
                                )}
                              </div>
                              {item.sub && <div className="text-[11px] text-white/45 truncate mt-0.5">{item.sub}</div>}
                            </div>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                              className="flex-shrink-0 opacity-20">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* ══════ SEARCH MODE: Filtered results ══════ */}
          {hasQuery && allResults.length === 0 && !loading && (
            <div className="py-12 text-center text-white/45 text-sm">
              <div className="text-3xl mb-3">🔍</div>
              No results for &ldquo;{query}&rdquo;
            </div>
          )}

          {hasQuery && Object.entries(searchGroups).map(([category, items]) => {
            const color = CATEGORY_COLORS[category] || '#ffffff';
            return (
              <div key={category}>
                <div className="flex items-center gap-2 px-4 py-1.5">
                  <span className="text-[9px] font-black uppercase tracking-[0.18em]" style={{ color: color + '90' }}>{category}</span>
                  <div className="flex-1 h-px" style={{ background: color + '15' }} />
                </div>
                <div className="px-1.5 pb-1">
                  {items.map((item) => {
                    const isActive = item._idx === activeIdx;
                    return (
                      <button
                        key={`${item.category}-${item.label}-${item.href}`}
                        data-active={isActive}
                        onMouseEnter={() => setActiveIdx(item._idx)}
                        onClick={() => navigate(item)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer border-none transition-all duration-100"
                        style={{ background: isActive ? 'var(--surface-xs)' : 'transparent' }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-semibold text-white/80 truncate">{item.label}</span>
                            {item.external && (
                              <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor"
                                strokeWidth="1.5" strokeLinecap="round" className="opacity-25 flex-shrink-0">
                                <path d="M1 9L9 1M9 1H4M9 1V6" />
                              </svg>
                            )}
                          </div>
                          {item.sub && <div className="text-[11px] text-white/50 truncate mt-0.5">{item.sub}</div>}
                        </div>
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0"
                          style={{ background: `${color}18`, color }}
                        >
                          {category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer hints */}
        <div className="px-4 py-2.5 border-t border-white/[0.05] flex items-center gap-4 text-[10px] text-white/40">
          <span className="flex items-center gap-1">
            <kbd className="border border-white/10 rounded px-1 py-0.5 font-mono">↑↓</kbd> navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="border border-white/10 rounded px-1 py-0.5 font-mono">↵</kbd> open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="border border-white/10 rounded px-1 py-0.5 font-mono">Esc</kbd> close
          </span>
          {hasQuery && allResults.length > 0 && (
            <span className="ml-auto">{allResults.length} results</span>
          )}
          {!hasQuery && (
            <span className="ml-auto">Type to filter</span>
          )}
        </div>
      </div>
    </div>
  );
}
