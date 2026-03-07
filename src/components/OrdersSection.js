'use client';
import { useState } from 'react';

const ITEMS_PER_PAGE = 10;

export default function OrdersSection({ orders }) {
  const [currentPage, setCurrentPage] = useState(1);
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

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentOrders = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearch = (val) => {
    setQuery(val);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    document.getElementById('orders')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="orders" className="relative py-8">
      <div>

        {/* Header */}
        <div className="mb-5">
          <div className="section-label mb-2">Latest Updates</div>
          <h2 className="text-[clamp(22px,3vw,32px)] font-[900] tracking-[-0.02em] text-white" style={{ fontFamily: "'Meera', sans-serif" }}>
            സർക്കാർ ഉത്തരവുകൾ
          </h2>
          <div className="h-[2px] w-10 bg-gradient-to-r from-[#ff9f0a] to-transparent mt-2 rounded-full" />
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder="ഉത്തരവ് തിരയുക..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[13px] text-white placeholder-white/30 outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: "'Meera', sans-serif" }}
            onFocus={e => e.target.style.borderColor = 'rgba(255,159,10,0.4)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
          {query && (
            <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors bg-transparent border-0 cursor-pointer text-lg leading-none">
              ×
            </button>
          )}
        </div>

        {/* Orders list */}
        <div>
          {currentOrders.length === 0 ? (
            <div className="text-center py-10 text-white/30 text-[13px]" style={{ fontFamily: "'Meera', sans-serif" }}>
              "{query}" എന്നതിന് ഫലങ്ങൾ ഒന്നും കിട്ടിയില്ല.
            </div>
          ) : currentOrders.map((o, i) => o.pdf_url ? (
              <a
                key={o.id}
                href={o.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block no-underline group"
              >
                <div className={`glass-card glow-top relative flex items-center gap-4 p-4 md:p-5 rounded-[20px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] mb-3 ${i === 0 ? 'border-[#ff9f0a]/30 bg-[#ff9f0a]/[0.06]' : ''}`}>
                  <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-lg ${i === 0 ? 'bg-[#ff9f0a]/20 text-[#ff9f0a]' : 'bg-white/[0.06] text-white/50'}`}>
                    {o.is_pinned ? '📌' : '📄'}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${i === 0 ? 'bg-[#ff9f0a]/30 text-[#ff9f0a]' : 'bg-white/[0.08] text-white/50'}`}>
                        {i === 0 ? 'NEW' : (o.go_number?.split('/')[0] || 'GO')}
                      </span>
                      <span className="text-[10px] text-white/30">{formatDate(o.go_date)}</span>
                    </div>
                    <h3 className="text-[15px] md:text-base font-bold leading-snug text-white/90 group-hover:text-white transition-colors truncate" style={{ fontFamily: "'Meera', sans-serif" }}>
                      {o.title_ml}
                    </h3>
                  </div>
                  <svg className="w-4 h-4 text-white/25 group-hover:text-white/70 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ) : (
              <div key={o.id} className="glass-card relative flex items-center gap-4 p-4 md:p-5 rounded-[20px] mb-3 opacity-40 cursor-not-allowed">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-lg bg-white/[0.06] text-white/30">
                  📄
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.08] text-white/40">
                      {o.go_number?.split('/')[0] || 'GO'}
                    </span>
                    <span className="text-[10px] text-white/25">{formatDate(o.go_date)}</span>
                  </div>
                  <h3 className="text-[15px] font-bold leading-snug text-white/60 truncate" style={{ fontFamily: "'Meera', sans-serif" }}>
                    {o.title_ml}
                  </h3>
                </div>
              </div>
            )
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-4 flex-wrap">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white/50 disabled:opacity-20 disabled:cursor-not-allowed hover:text-white hover:bg-white/[0.06] transition-all border-0 bg-transparent cursor-pointer">
              ← മുമ്പ്
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
              const show = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
              const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
              const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;
              if (showEllipsisBefore || showEllipsisAfter)
                return <span key={`e-${page}`} className="text-white/25 px-1 text-sm">…</span>;
              if (!show) return null;
              return (
                <button key={page} onClick={() => goToPage(page)}
                  className="w-8 h-8 rounded-lg text-[12px] font-bold transition-all border-0 cursor-pointer"
                  style={currentPage === page ? { background: '#ff9f0a', color: 'white' } : { background: 'transparent', color: 'rgba(255,255,255,0.4)' }}>
                  {page}
                </button>
              );
            })}
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white/50 disabled:opacity-20 disabled:cursor-not-allowed hover:text-white hover:bg-white/[0.06] transition-all border-0 bg-transparent cursor-pointer">
              അടുത്തത് →
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-4">
          <a href="https://www.finance.kerala.gov.in" target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[13px] font-bold no-underline transition-all hover:bg-white/[0.08]"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)' }}>
            എല്ലാ ഉത്തരവുകളും കാണുക
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
