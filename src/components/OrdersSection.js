'use client';
import { useState } from 'react';

export default function OrdersSection({ orders }) {
  const [query, setQuery] = useState('');

  if (!orders?.length) return null;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

  const filtered = query.trim()
    ? orders.filter(o =>
        o.title_ml?.toLowerCase().includes(query.toLowerCase()) ||
        o.go_number?.toLowerCase().includes(query.toLowerCase())
      )
    : orders;

  const currentOrders = filtered.slice(0, 5);

  const handleSearch = (val) => {
    setQuery(val);
  };

  return (
    <section id="orders" className="relative py-5 md:py-8 flex flex-col h-full">

      {/* Header */}
      <div className="mb-5">
        <div className="section-label mb-2">Latest Updates</div>
        <h2 className="text-[clamp(22px,3vw,32px)] font-[900] tracking-[-0.02em] text-white" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
          സർക്കാർ ഉത്തരവുകൾ
        </h2>
        <div className="h-[2px] w-10 bg-gradient-to-r from-[#ff9f0a] to-transparent mt-2 rounded-full" />
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          placeholder="ഉത്തരവ് തിരയുക..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[13px] text-white placeholder-white/30 outline-none transition-all"
          style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)', fontFamily: "var(--font-noto-malayalam), sans-serif" }}
          onFocus={e => e.target.style.borderColor = 'rgba(255,159,10,0.4)'}
          onBlur={e => e.target.style.borderColor = 'var(--surface-sm)'}
        />
        {query && (
          <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors bg-transparent border-0 cursor-pointer text-lg leading-none">
            ×
          </button>
        )}
      </div>

      {/* Orders list — grows to fill available space */}
      <div className="flex-grow">
        {currentOrders.length === 0 ? (
          <div className="text-center py-10 text-white/70 text-[13px]" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            "{query}" എന്നതിന് ഫലങ്ങൾ ഒന്നും കിട്ടിയില്ല.
          </div>
        ) : currentOrders.map((o) => {
          // Only link when pdf_url is a direct hosted file (not Finance Dept redirect)
          const isDirectPdf = o.pdf_url && !o.pdf_url.includes('finance.kerala.gov.in');
          return isDirectPdf ? (
          <a key={o.id} href={o.pdf_url} target="_blank" rel="noopener noreferrer" download className="block no-underline group">
            <div className={`glass-card glow-top relative flex items-center gap-3 p-3 md:p-5 rounded-[16px] md:rounded-[20px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] mb-2 md:mb-3 ${o.is_pinned ? 'border-[#ff9f0a]/30 bg-[#ff9f0a]/[0.06]' : ''}`}>
              <div className="flex-shrink-0 w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl flex items-center justify-center" style={o.is_pinned ? { background: 'rgba(255,159,10,0.20)', border: '1px solid rgba(255,159,10,0.35)' } : { background: 'var(--surface-sm)', border: '1px solid var(--surface-sm)' }}>
                {o.is_pinned ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff9f0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L8 8H3l4 4-1.5 7L12 16l6.5 3L17 12l4-4h-5L12 2z"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                )}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${o.is_pinned ? 'bg-[#ff9f0a]/30 text-[#ff9f0a]' : 'bg-white/[0.08] text-white/65'}`}>
                    {o.is_pinned ? 'PINNED' : (o.go_number?.split('/')[0] || 'GO')}
                  </span>
                  <span className="text-[10px] text-white/70">{formatDate(o.go_date)}</span>
                </div>
                <h3 className="text-[12px] md:text-base font-bold leading-snug text-white/90 group-hover:text-white transition-colors line-clamp-2" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                  {o.title_ml}
                </h3>
              </div>
              <svg className="w-4 h-4 text-white/45 group-hover:text-white/70 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        ) : (
          <div key={o.id} className="glass-card relative flex items-center gap-3 p-3 md:p-5 rounded-[16px] md:rounded-[20px] mb-2 md:mb-3 opacity-50 cursor-not-allowed">
            <div className="flex-shrink-0 w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl flex items-center justify-center" style={{ background: 'var(--surface-sm)', border: '1px solid var(--surface-md)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.08] text-white/65">
                  {o.go_number?.split('/')[0] || 'GO'}
                </span>
                <span className="text-[10px] text-white/65">{formatDate(o.go_date)}</span>
              </div>
              <h3 className="text-[15px] font-bold leading-snug text-white/60 line-clamp-2" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                {o.title_ml}
              </h3>
            </div>
          </div>
        );
        })}
      </div>


      {/* CTA — pinned to bottom */}
      <div className="mt-4">
        <a href="https://www.finance.kerala.gov.in" target="_blank" rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[13px] font-bold no-underline transition-all hover:bg-white/[0.08]"
          style={{ background: 'var(--surface-xs)', color: 'var(--text-primary)' }}>
          എല്ലാ ഉത്തരവുകളും കാണുക
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
