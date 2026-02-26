'use client';
import { useState } from 'react';

const ITEMS_PER_PAGE = 10;

export default function OrdersSection({ orders }) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!orders?.length) return null;

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  };

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(page);
    document.getElementById('orders')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="orders" className="relative z-[1] py-24 px-6 max-w-[1200px] mx-auto">
      <div className="text-xs font-bold uppercase tracking-widest text-[#ff9f0a] mb-2.5 font-sans">LATEST UPDATES</div>
      <h2 className="text-[clamp(32px,5vw,52px)] font-extrabold tracking-tight leading-[1.15] mb-4">
        പ്രധാന<br />സർക്കാർ ഉത്തരവുകൾ
      </h2>
      <p className="text-base text-[#86868b] leading-relaxed max-w-[640px] mb-6">
        കേരള സർക്കാർ ജീവനക്കാർ അറിഞ്ഞിരിക്കേണ്ട പ്രധാന ഉത്തരവുകൾ — യഥാർത്ഥ GO നമ്പറുകളും തീയതികളും സഹിതം.
      </p>

      {/* Results count */}
      <div className="text-xs text-[#6e6e73] font-sans mb-4">
        ആകെ {orders.length} ഉത്തരവുകൾ — പേജ് {currentPage} / {totalPages}
      </div>

      <div className="flex flex-col gap-2.5">
        {currentOrders.map(o => (
          <a
            key={o.id}
            href={o.pdf_url || o.source_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-5 py-4 bg-[#111] border border-white/[0.08] rounded-2xl transition-all duration-400 cursor-pointer no-underline text-inherit hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-[#1a1a1a] group"
          >
            <div
              className="w-[42px] h-[42px] min-w-[42px] rounded-xl flex items-center justify-center text-[17px]"
              style={{ background: 'rgba(255,159,10,0.1)', color: '#ff9f0a' }}
            >
              {o.is_pinned ? '📌' : '📄'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold mb-0.5 truncate">{o.title_ml}</div>
              <div className="text-xs text-[#6e6e73] font-sans">{o.go_number}</div>
            </div>
            <div className="text-[11px] text-[#ff9f0a] font-sans font-semibold whitespace-nowrap hidden sm:block">
              {formatDate(o.go_date)}
            </div>
            <div className="text-[#6e6e73] transition-all duration-300 group-hover:text-white group-hover:translate-x-1 text-sm">→</div>
          </a>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
          {/* Previous button */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-full text-sm font-semibold border border-white/[0.08] bg-[#111] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1a1a1a] hover:border-white/20 transition-all"
          >
            ← മുമ്പ്
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
            // Show first, last, current, and neighbors
            const show =
              page === 1 ||
              page === totalPages ||
              Math.abs(page - currentPage) <= 1;

            // Show ellipsis
            const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
            const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

            if (showEllipsisBefore || showEllipsisAfter) {
              return (
                <span key={`ellipsis-${page}`} className="text-[#6e6e73] px-1">…</span>
              );
            }

            if (!show) return null;

            return (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-9 h-9 rounded-full text-sm font-semibold transition-all ${
                  currentPage === page
                    ? 'bg-[#ff9f0a] text-black'
                    : 'border border-white/[0.08] bg-[#111] text-white hover:bg-[#1a1a1a] hover:border-white/20'
                }`}
              >
                {page}
              </button>
            );
          })}

          {/* Next button */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-full text-sm font-semibold border border-white/[0.08] bg-[#111] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1a1a1a] hover:border-white/20 transition-all"
          >
            അടുത്തത് →
          </button>
        </div>
      )}

      <div className="text-center mt-10">
        <a
          href="https://www.finance.kerala.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3.5 bg-[#2997ff] text-white rounded-full text-sm font-semibold no-underline hover:bg-[#0077ed] transition-all"
        >
          എല്ലാ ഉത്തരവുകളും കാണുക — finance.kerala.gov.in →
        </a>
      </div>
    </section>
  );
}
