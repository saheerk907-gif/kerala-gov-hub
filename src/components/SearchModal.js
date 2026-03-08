'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

const SEARCH_INDEX = [
  // Tools
  { label: '12th PRC Calculator',  sub: 'Pay Revision 2024',          href: '/prc',                    category: 'Tools'      },
  { label: 'NPS vs APS',           sub: 'Pension Comparison',          href: '/nps-aps',                category: 'Tools'      },
  { label: 'Pension Calculator',   sub: 'Monthly Pension',             href: '/pension',                category: 'Tools'      },
  { label: 'DCRG Calculator',      sub: 'Retirement Gratuity',         href: '/dcrg',                   category: 'Tools'      },
  { label: 'DA Arrear Calculator', sub: '11th PRC · Mar 2021',         href: '/da-arrear',              category: 'Tools'      },
  { label: 'GPF Calculator',       sub: 'Provident Fund',              href: '/gpf',                    category: 'Tools'      },
  { label: 'Medisep',              sub: 'Health Insurance Info',       href: '/medisep',                category: 'Tools'      },
  // Orders
  { label: 'All Govt Orders',      sub: 'All Government Orders',       href: '#orders',                 category: 'Govt Orders' },
  { label: 'DA Orders',            sub: 'Dearness Allowance',          href: '#orders',                 category: 'Govt Orders' },
  { label: 'Bonus / Festival',     sub: 'Bonus & Festival Allowance',  href: '#orders',                 category: 'Govt Orders' },
  { label: 'MEDISEP Orders',       sub: 'Medical Insurance Orders',    href: '#orders',                 category: 'Govt Orders' },
  { label: 'Pension Orders',       sub: 'Pension Orders',              href: '#orders',                 category: 'Govt Orders' },
  { label: 'Pay Revision Orders',  sub: 'Pay Revision Orders',         href: '#orders',                 category: 'Govt Orders' },
  { label: 'GPF / NPS Orders',     sub: 'Provident Fund Orders',       href: '#orders',                 category: 'Govt Orders' },
  { label: 'Leave Orders',         sub: 'Leave Rule Orders',           href: '#orders',                 category: 'Govt Orders' },
  // Schemes
  { label: 'Kerala Service Rules', sub: 'KSR Parts I, II, III',        href: '/ksr',                    category: 'Schemes'    },
  { label: 'MEDISEP Scheme',       sub: 'Medical Insurance Scheme',    href: '/medisep',                category: 'Schemes'    },
  { label: 'GPF',                  sub: 'General Provident Fund',      href: '/gpf',                    category: 'Schemes'    },
  { label: 'NPS',                  sub: 'National Pension System',     href: '/nps-aps',                category: 'Schemes'    },
  { label: 'SLI',                  sub: 'State Life Insurance',        href: '#services',               category: 'Schemes'    },
  { label: 'GIS',                  sub: 'Group Insurance Scheme',      href: '#services',               category: 'Schemes'    },
  // Dept Tests
  { label: 'Common Tests',         sub: 'MOP, KSR, KFC, KTC…',        href: '/departmental-tests?dept=common',       category: 'Dept Tests' },
  { label: 'Revenue Department',   sub: 'Revenue Test Papers I–IV',    href: '/departmental-tests?dept=revenue',      category: 'Dept Tests' },
  { label: 'Panchayat Tests',      sub: 'Panchayat Test Papers',       href: '/departmental-tests?dept=panchayat',    category: 'Dept Tests' },
  { label: 'Judiciary Tests',      sub: 'Civil & Criminal Tests',      href: '/departmental-tests?dept=judiciary',    category: 'Dept Tests' },
  { label: 'Police Tests',         sub: 'Police Manual Test',          href: '/departmental-tests?dept=police',       category: 'Dept Tests' },
  { label: 'Education Tests',      sub: 'Kerala Education Rules',      href: '/departmental-tests?dept=education',    category: 'Dept Tests' },
  { label: 'All Departmental Tests', sub: 'Browse all 64 departments', href: '/departmental-tests',                   category: 'Dept Tests' },
  // Forms
  { label: 'All Forms',            sub: 'All 65+ Government Forms',    href: '/forms',                  category: 'Forms'      },
  { label: 'Pension Forms (PRISM)',sub: 'Form 2, 4B, 5, 6, 8, 11…',   href: '/pension-forms',          category: 'Forms'      },
  { label: 'GPF Forms',            sub: 'PF Form A, B, B1, D, J',     href: '/forms?cat=GPF',          category: 'Forms'      },
  { label: 'Leave Forms',          sub: 'Form 13 · Medical Certificate', href: '/forms?cat=Leave',      category: 'Forms'      },
  { label: 'HBA Forms',            sub: 'House Building Advance',      href: '/forms?cat=HBA',          category: 'Forms'      },
  { label: 'KFC Forms',            sub: 'KFC Form 1A–40',              href: '/forms?cat=KFC',          category: 'Forms'      },
  { label: 'Treasury / TR Forms',  sub: 'TR 46, 47, 59C, 83B, 103, 104', href: '/forms?cat=Treasury',  category: 'Forms'      },
  { label: 'NPS / GIS / SLI Forms',sub: 'PRAN, Option, Revival Forms', href: '/forms?cat=NPS',         category: 'Forms'      },
  // Articles
  { label: 'All Articles',         sub: 'All published articles',      href: '/articles',               category: 'Articles'   },
  { label: 'MEDISEP Articles',     sub: 'Claim, complaint, FAQ',       href: '/articles?cat=medisep',   category: 'Articles'   },
  { label: 'Pension Articles',     sub: 'Calculation, rules',          href: '/articles?cat=pension',   category: 'Articles'   },
  { label: 'KSR Articles',         sub: 'Service rule updates',        href: '/articles?cat=ksr',       category: 'Articles'   },
  { label: 'DA / Pay Articles',    sub: 'Dearness allowance updates',  href: '/articles?cat=da',        category: 'Articles'   },
  { label: 'Latest News',          sub: 'Government news feed',        href: '/news',                   category: 'Articles'   },
  // Portals
  { label: 'SPARK Portal',         sub: 'spark.gov.in',                href: 'https://spark.gov.in',                    category: 'Portals', external: true },
  { label: 'e-Treasury',           sub: 'treasury.kerala.gov.in',      href: 'https://treasury.kerala.gov.in',          category: 'Portals', external: true },
  { label: 'MEDISEP Portal',       sub: 'medisep.kerala.gov.in',       href: 'https://medisep.kerala.gov.in',           category: 'Portals', external: true },
  { label: 'NPS / CRA',            sub: 'npscra.nsdl.co.in',           href: 'https://www.npscra.nsdl.co.in',          category: 'Portals', external: true },
  { label: 'Finance Department',   sub: 'finance.kerala.gov.in',       href: 'https://www.finance.kerala.gov.in',       category: 'Portals', external: true },
  { label: 'Pension Portal',       sub: 'pension.treasury.kerala.gov.in', href: 'https://pension.treasury.kerala.gov.in', category: 'Portals', external: true },
  { label: 'Kerala.gov.in',        sub: 'Official Government Portal',  href: 'https://www.kerala.gov.in',              category: 'Portals', external: true },
];

const CATEGORY_COLORS = {
  'Tools':       '#2997ff',
  'Govt Orders': '#ff9f0a',
  'Schemes':     '#30d158',
  'Dept Tests':  '#bf5af2',
  'Forms':       '#ff6b6b',
  'Articles':    '#64d2ff',
  'Portals':     '#c8960c',
};

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const results = query.trim().length < 1
    ? []
    : SEARCH_INDEX.filter(item => {
        const q = query.toLowerCase();
        return (
          item.label.toLowerCase().includes(q) ||
          item.sub.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }).slice(0, 8);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Reset active index on new results
  useEffect(() => { setActiveIdx(0); }, [query]);

  // Keyboard navigation
  const handleKey = useCallback((e) => {
    if (!open) return;
    if (e.key === 'Escape') { onClose(); return; }
    if (results.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter') {
      e.preventDefault();
      const item = results[activeIdx];
      if (item) navigate(item);
    }
  }, [open, results, activeIdx, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.children[activeIdx];
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

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

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-start justify-center pt-[10vh] px-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-[560px] rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.8)]"
        style={{ background: 'rgba(20,22,26,0.99)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.07]">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white/30 flex-shrink-0">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tools, orders, forms, schemes…"
            className="flex-1 bg-transparent border-none outline-none text-[14px] text-white/80 placeholder-white/25"
            spellCheck={false}
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-white/25 hover:text-white/50 transition-colors border-none bg-transparent cursor-pointer p-0 leading-none text-[18px]">
              ×
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-1 text-[10px] text-white/20 border border-white/10 rounded px-1.5 py-0.5 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul ref={listRef} className="py-1.5 max-h-[360px] overflow-y-auto list-none m-0 p-0 px-1.5 pb-1.5">
            {results.map((item, i) => (
              <li key={`${item.label}-${i}`}>
                <button
                  onMouseEnter={() => setActiveIdx(i)}
                  onClick={() => navigate(item)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left cursor-pointer border-none transition-all duration-100"
                  style={{
                    background: i === activeIdx ? 'rgba(255,255,255,0.07)' : 'transparent',
                    color: 'inherit',
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-white/80 truncate">{item.label}</span>
                      {item.external && (
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-30 flex-shrink-0">
                          <path d="M1 9L9 1M9 1H4M9 1V6" />
                        </svg>
                      )}
                    </div>
                    <div className="text-[11px] text-white/30 truncate mt-0.5">{item.sub}</div>
                  </div>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0"
                    style={{ background: `${CATEGORY_COLORS[item.category]}18`, color: CATEGORY_COLORS[item.category] }}
                  >
                    {item.category}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Empty state */}
        {query.trim().length >= 1 && results.length === 0 && (
          <div className="py-10 text-center text-white/25 text-[13px]">
            No results for &ldquo;{query}&rdquo;
          </div>
        )}

        {/* Hint */}
        {query.trim().length === 0 && (
          <div className="px-4 py-3 flex items-center gap-4 text-[11px] text-white/20">
            <span className="flex items-center gap-1"><kbd className="border border-white/10 rounded px-1 py-0.5 font-mono text-[10px]">↑↓</kbd> navigate</span>
            <span className="flex items-center gap-1"><kbd className="border border-white/10 rounded px-1 py-0.5 font-mono text-[10px]">↵</kbd> open</span>
            <span className="flex items-center gap-1"><kbd className="border border-white/10 rounded px-1 py-0.5 font-mono text-[10px]">Esc</kbd> close</span>
          </div>
        )}
      </div>
    </div>
  );
}
