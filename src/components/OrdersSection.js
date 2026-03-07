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
    <section id="orders" className="relative py-14 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="section-label mb-3">Latest Updates</div>
          <h2 className="text-[clamp(28px,4.5vw,50px)] font-[900] tracking-[-0.03em] text-white leading-tight" style={{ fontFamily: "'Meera', sans-serif" }}>
            പ്രധാന{' '}
            <span className="text-white/40">സർക്കാർ ഉത്തരവുകൾ</span>
          </h2>
          <p className="text-[15px] text-white/50 leading-relaxed max-w-[580px] mt-3">
            കേരള സർക്കാർ ജീവനക്കാർ അറിഞ്ഞിരിക്കേണ്ട പ്രധാന ഉത്തരവുകൾ — യഥാർത്ഥ GO നമ്പറുകളും തീയതികളും സഹിതം.
          </p>
          <div className="text-[11px] text-white/25 font-sans mt-3">
            ആകെ {orders.length} ഉത്തരവുകൾ — പേജ് {currentPage}/{totalPages}
          </div>
        </div>

        {/* Orders list */}
        <div className="flex flex-col gap-2">
          {currentOrders.map(o => (
            o.pdf_url ? (
            <a
              key={o.id}
              href={o.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card glow-top group flex items-center gap-4 px-5 py-4 rounded-2xl no-underline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] hover:border-[#ff9f0a]/30"
            >
              {/* Icon */}
              <div className="w-10 h-10 min-w-[40px] rounded-xl flex items-center justify-center text-base bg-[#ff9f0a]/10 border border-[#ff9f0a]/20 text-[#ff9f0a]">
                {o.is_pinned ? '📌' : '📄'}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold text-white/85 truncate group-hover:text-white transition-colors" style={{ fontFamily: "'Meera', sans-serif" }}>
                  {o.title_ml}
                </div>
                <div className="text-[11px] text-white/35 font-sans mt-0.5">
                  {o.go_number}
                </div>
              </div>

              {/* Date + PDF badge */}
              <div className="flex items-center gap-2">
                <div className="text-[11px] text-[#ff9f0a]/70 font-bold whitespace-nowrap hidden sm:block">
                  {formatDate(o.go_date)}
                </div>
                <div className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#ff9f0a]/15 text-[#ff9f0a] hidden sm:block">
                  PDF
                </div>
              </div>

              {/* Arrow */}
              <div className="text-white/25 group-hover:text-white/70 group-hover:translate-x-1 transition-all">
                →
              </div>
            </a>
            ) : (
            <div
              key={o.id}
              className="glass-card flex items-center gap-4 px-5 py-4 rounded-2xl opacity-50 cursor-not-allowed"
            >
              <div className="w-10 h-10 min-w-[40px] rounded-xl flex items-center justify-center text-base bg-white/5 border border-white/10 text-white/30">
                {o.is_pinned ? '📌' : '📄'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold text-white/50 truncate" style={{ fontFamily: "'Meera', sans-serif" }}>
                  {o.title_ml}
                </div>
                <div className="text-[11px] text-white/25 font-sans mt-0.5">
                  {o.go_number}
                </div>
              </div>
              <div className="text-[11px] text-white/25 font-bold whitespace-nowrap hidden sm:block">
                {formatDate(o.go_date)}
              </div>
            </div>
            )
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-full text-[13px] font-semibold glass-card text-white/70 disabled:opacity-20 disabled:cursor-not-allowed hover:text-white transition-all border-0"
            >
              ← മുമ്പ്
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
              const show = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
              const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
              const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

              if (showEllipsisBefore || showEllipsisAfter)
                return <span key={`e-${page}`} className="text-white/25 px-1">…</span>;
              if (!show) return null;

              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-9 h-9 rounded-full text-[13px] font-bold transition-all ${
                    currentPage === page
                      ? 'bg-[#ff9f0a] text-white shadow-[0_0_20px_rgba(255,159,10,0.4)]'
                      : 'glass-card text-white/60 hover:text-white border-0'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-full text-[13px] font-semibold glass-card text-white/70 disabled:opacity-20 disabled:cursor-not-allowed hover:text-white transition-all border-0"
            >
              അടുത്തത് →
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-10">
          <a
            href="https://www.finance.kerala.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 glass-pill rounded-full text-[13px] font-bold text-white/80 no-underline hover:text-white hover:border-white/30 transition-all"
          >
            എല്ലാ ഉത്തരവുകളും കാണുക — finance.kerala.gov.in →
          </a>
        </div>
      </div>
    </section>
  );
}
