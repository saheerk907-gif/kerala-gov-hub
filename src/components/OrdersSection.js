'use client';
import { useState } from 'react';

const ITEMS_PER_PAGE = 10;

export default function OrdersSection({ orders }) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!orders?.length) return null;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(page);
    document.getElementById('orders')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="orders" className="relative py-8 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="section-label mb-1">Latest Updates</div>
            <h2 className="text-[clamp(20px,3vw,30px)] font-[900] tracking-[-0.02em] text-white leading-tight" style={{ fontFamily: "'Meera', sans-serif" }}>
              സർക്കാർ ഉത്തരവുകൾ
            </h2>
          </div>
          <span className="text-[11px] text-white/25 font-sans">
            {orders.length} ഉത്തരവുകൾ · {currentPage}/{totalPages}
          </span>
        </div>

        {/* Orders list — single container with dividers */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {currentOrders.map((o, i) => (
            o.pdf_url ? (
              <a
                key={o.id}
                href={o.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-4 py-3 no-underline transition-colors duration-150 hover:bg-white/[0.04]"
                style={{ borderTop: i !== 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
              >
                <span className="text-[#ff9f0a]/60 text-sm min-w-[16px]">
                  {o.is_pinned ? '📌' : '📄'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-white/80 truncate group-hover:text-white transition-colors" style={{ fontFamily: "'Meera', sans-serif" }}>
                    {o.title_ml}
                  </div>
                  <div className="text-[10px] text-white/30 font-mono mt-0.5">{o.go_number}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-white/30 hidden sm:block">{formatDate(o.go_date)}</span>
                  <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,159,10,0.12)', color: '#ff9f0a' }}>PDF</span>
                  <span className="text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all text-sm">→</span>
                </div>
              </a>
            ) : (
              <div
                key={o.id}
                className="flex items-center gap-3 px-4 py-3 opacity-40 cursor-not-allowed"
                style={{ borderTop: i !== 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
              >
                <span className="text-sm min-w-[16px]">📄</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-white/60 truncate" style={{ fontFamily: "'Meera', sans-serif" }}>
                    {o.title_ml}
                  </div>
                  <div className="text-[10px] text-white/25 font-mono mt-0.5">{o.go_number}</div>
                </div>
                <span className="text-[10px] text-white/25 hidden sm:block">{formatDate(o.go_date)}</span>
              </div>
            )
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-5 flex-wrap">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white/50 disabled:opacity-20 disabled:cursor-not-allowed hover:text-white hover:bg-white/[0.06] transition-all border-0 bg-transparent cursor-pointer"
            >
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
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className="w-8 h-8 rounded-lg text-[12px] font-bold transition-all border-0 cursor-pointer"
                  style={currentPage === page
                    ? { background: '#ff9f0a', color: 'white' }
                    : { background: 'transparent', color: 'rgba(255,255,255,0.4)' }}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white/50 disabled:opacity-20 disabled:cursor-not-allowed hover:text-white hover:bg-white/[0.06] transition-all border-0 bg-transparent cursor-pointer"
            >
              അടുത്തത് →
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-5">
          <a
            href="https://www.finance.kerala.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-white/30 no-underline hover:text-white/60 transition-colors"
          >
            എല്ലാ ഉത്തരവുകളും കാണുക — finance.kerala.gov.in →
          </a>
        </div>
      </div>
    </section>
  );
}
