export default function OrdersSection({ orders }) {
  if (!orders?.length) return null;

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  };

  return (
    <section id="orders" className="relative z-[1] py-24 px-6 max-w-[1200px] mx-auto">
      <div className="text-xs font-bold uppercase tracking-widest text-[#ff9f0a] mb-2.5 font-sans">LATEST UPDATES</div>
      <h2 className="text-[clamp(32px,5vw,52px)] font-extrabold tracking-tight leading-[1.15] mb-4">
        പ്രധാന<br />സർക്കാർ ഉത്തരവുകൾ
      </h2>
      <p className="text-base text-[#86868b] leading-relaxed max-w-[640px] mb-14">
        കേരള സർക്കാർ ജീവനക്കാർ അറിഞ്ഞിരിക്കേണ്ട പ്രധാന ഉത്തരവുകൾ — യഥാർത്ഥ GO നമ്പറുകളും തീയതികളും സഹിതം.
      </p>

      <div className="flex flex-col gap-2.5">
        {orders.map(o => (
          <a
            key={o.id}
            href={o.pdf_url || o.source_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-5 py-4 bg-[#111] border border-white/[0.08] rounded-2xl transition-all duration-400 cursor-pointer no-underline text-inherit hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-[#1a1a1a] group"
          >
            <div className="w-[42px] h-[42px] min-w-[42px] rounded-xl flex items-center justify-center text-[17px]"
              style={{ background: 'rgba(255,159,10,0.1)', color: '#ff9f0a' }}>
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

      <div className="text-center mt-10">
        <a href="https://www.finance.kerala.gov.in" target="_blank" rel="noopener noreferrer"
          className="inline-block px-8 py-3.5 bg-[#2997ff] text-white rounded-full text-sm font-semibold no-underline hover:bg-[#0077ed] transition-all">
          എല്ലാ ഉത്തരവുകളും കാണുക — finance.kerala.gov.in →
        </a>
      </div>
    </section>
  );
}
