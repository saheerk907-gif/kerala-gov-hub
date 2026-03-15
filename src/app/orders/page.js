'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const CATEGORIES = ['All', 'DA', 'Bonus', 'MEDISEP', 'Pension', 'Pay Revision', 'GPF', 'NPS', 'Leave'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetch(
      `${SUPABASE_URL}/rest/v1/government_orders?select=*&order=go_date.desc`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    )
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data.sort((a, b) => {
            if (a.pdf_url && !b.pdf_url) return -1;
            if (!a.pdf_url && b.pdf_url) return 1;
            return 0;
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const filtered = orders.filter(o => {
    const matchesQuery = !query.trim() ||
      o.title_ml?.toLowerCase().includes(query.toLowerCase()) ||
      o.go_number?.toLowerCase().includes(query.toLowerCase());
    const matchesCat = category === 'All' ||
      o.category?.toLowerCase().includes(category.toLowerCase()) ||
      o.go_number?.toLowerCase().includes(category.toLowerCase());
    return matchesQuery && matchesCat;
  });

  return (
    <div className="relative min-h-screen bg-aurora overflow-x-hidden">
      <Navbar />

      <main className="max-w-[900px] mx-auto px-4 md:px-6 pt-24 pb-16">

        {/* Header */}
        <div className="mb-8">
          <div className="section-label mb-2">Latest Updates</div>
          <h1 className="text-[clamp(26px,4vw,40px)] font-[900] tracking-[-0.02em] text-white leading-tight"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            സർക്കാർ ഉത്തരവുകൾ
          </h1>
          <div className="h-[2px] w-10 bg-gradient-to-r from-[#ff9f0a] to-transparent mt-2 rounded-full" />
          <p className="text-white/50 text-[13px] mt-2">Government Orders · G.O.(P) · G.O.(Ms) · Circulars</p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none"
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ഉത്തരവ് തിരയുക..."
            className="w-full pl-10 pr-4 py-3 rounded-xl text-[13px] text-white placeholder-white/30 outline-none transition-all"
            style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)', fontFamily: "var(--font-noto-malayalam), sans-serif" }}
            onFocus={e => e.target.style.borderColor = 'rgba(255,159,10,0.4)'}
            onBlur={e => e.target.style.borderColor = 'var(--surface-sm)'}
          />
          {query && (
            <button onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70 bg-transparent border-0 cursor-pointer text-lg leading-none">
              ×
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className="px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border cursor-pointer"
              style={category === cat
                ? { background: 'rgba(255,159,10,0.15)', color: '#ff9f0a', borderColor: 'rgba(255,159,10,0.35)' }
                : { background: 'var(--surface-xs)', color: 'var(--text-dim)', borderColor: 'var(--border-xs)' }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Count */}
        {!loading && (
          <p className="text-white/40 text-[12px] mb-4">{filtered.length} orders found</p>
        )}

        {/* List */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card h-[72px] rounded-[16px] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-[20px]">
            <p className="text-white/50 text-[14px]" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              ഫലങ്ങൾ ഒന്നും കിട്ടിയില്ല.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map(o => {
              const isDirectPdf = o.pdf_url && !o.pdf_url.includes('finance.kerala.gov.in');
              const Wrapper = isDirectPdf ? 'a' : 'div';
              const wrapperProps = isDirectPdf
                ? { href: o.pdf_url, target: '_blank', rel: 'noopener noreferrer', download: true }
                : { style: { opacity: 0.5, cursor: 'not-allowed' } };

              return (
                <Wrapper key={o.id} {...wrapperProps} className="block no-underline group">
                  <div className={`glass-card relative flex items-center gap-3 p-3.5 md:p-4 rounded-[16px] transition-all duration-300 ${isDirectPdf ? 'hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]' : ''} ${o.is_pinned ? 'border-[#ff9f0a]/30' : ''}`}>
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                      style={o.is_pinned
                        ? { background: 'rgba(255,159,10,0.20)', border: '1px solid rgba(255,159,10,0.35)' }
                        : { background: 'var(--surface-sm)', border: '1px solid var(--surface-sm)' }}>
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
                        <span className="text-[10px] text-white/55">{formatDate(o.go_date)}</span>
                        {!isDirectPdf && (
                          <span className="text-[9px] text-white/30 bg-white/[0.05] px-1.5 py-0.5 rounded-full">No PDF</span>
                        )}
                      </div>
                      <h3 className="text-[13px] md:text-[14px] font-bold leading-snug text-white/90 group-hover:text-white transition-colors line-clamp-2"
                        style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                        {o.title_ml}
                      </h3>
                    </div>
                    {isDirectPdf && (
                      <svg className="w-4 h-4 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all flex-shrink-0"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </Wrapper>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
