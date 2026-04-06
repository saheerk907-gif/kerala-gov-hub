'use client';
import { useState } from 'react';
import Link from 'next/link';

const F  = '#3a4258';   // fill
const F2 = '#2e3a50';   // fill2
const D  = '#252e42';   // dark detail
const BG = '#0d1117';   // card bg

// ─── Government Seal + Scroll illustration ────────────────────────────────────
function OrdersIllustration() {
  return (
    <svg viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">
      {/* Official circular seal – top right */}
      <circle cx="225" cy="52" r="52" fill="none" stroke={F} strokeWidth="5" strokeDasharray="14 6"/>
      <circle cx="225" cy="52" r="40" fill={F2} stroke={F} strokeWidth="2"/>
      <circle cx="225" cy="52" r="27" fill="none" stroke={F} strokeWidth="1.5"/>
      {/* 8-point star in seal */}
      <path d="M225,36 L228,46 L238,43 L231,52 L238,61 L228,58 L225,68 L222,58 L212,61 L219,52 L212,43 L222,46 Z" fill={F}/>
      {/* Scroll – bottom right */}
      <g transform="translate(145,138)">
        <ellipse cx="10" cy="0" rx="10" ry="40" fill="#323c52" stroke={F} strokeWidth="1.5"/>
        <rect x="10" y="-40" width="95" height="80" fill={F2} stroke={F} strokeWidth="1.5"/>
        <ellipse cx="105" cy="0" rx="10" ry="40" fill="#323c52" stroke={F} strokeWidth="1.5"/>
        <line x1="22" y1="-24" x2="93" y2="-24" stroke={D} strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="22" y1="-8"  x2="93" y2="-8"  stroke={D} strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="22" y1="8"   x2="75" y2="8"   stroke={D} strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="22" y1="24"  x2="85" y2="24"  stroke={D} strokeWidth="3.5" strokeLinecap="round"/>
      </g>
      {/* Background document – lower left, very subtle */}
      <rect x="18" y="100" width="58" height="78" rx="6" fill="#252e42" stroke={D} strokeWidth="1"/>
      <line x1="28" y1="120" x2="66" y2="120" stroke={D} strokeWidth="2" strokeLinecap="round"/>
      <line x1="28" y1="134" x2="66" y2="134" stroke={D} strokeWidth="2" strokeLinecap="round"/>
      <line x1="28" y1="148" x2="52" y2="148" stroke={D} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function OrdersSection({ orders }) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);

  if (!orders?.length) return null;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

  const filtered = query.trim()
    ? orders.filter(o =>
        o.title_ml?.toLowerCase().includes(query.toLowerCase()) ||
        o.go_number?.toLowerCase().includes(query.toLowerCase())
      )
    : orders;

  const currentOrders = expanded ? filtered : filtered.slice(0, 3);

  const handleSearch = (val) => setQuery(val);

  return (
    <section id="orders" className="relative py-2 md:py-3 flex flex-col h-full">
      {/* Gradient border wrapper */}
      <div style={{
        background: 'linear-gradient(135deg,rgba(140,80,240,0.5),rgba(60,130,255,0.5))',
        padding: '1.5px', borderRadius: 28, display: 'flex', flexDirection: 'column', flex: 1,
      }}>
        {/* Dark card */}
        <div className="relative overflow-hidden flex flex-col"
          style={{ background: BG, borderRadius: 26, padding: '16px 20px', flex: 1 }}>

          {/* SVG illustration layer */}
          <OrdersIllustration />
          {/* Left-to-right fade (keeps content readable) */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1,
            background: 'linear-gradient(to right, rgba(13,17,23,0.98) 28%, rgba(13,17,23,0.78) 55%, rgba(13,17,23,0.35) 80%, transparent 100%)' }}/>
          {/* Top-to-bottom fade (list area becomes fully dark) */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1,
            background: 'linear-gradient(to bottom, transparent 22%, rgba(13,17,23,0.55) 40%, rgba(13,17,23,0.97) 58%)' }}/>

          {/* All existing content */}
          <div className="relative flex flex-col h-full" style={{ zIndex: 2 }}>

            {/* Header */}
            <div className="mb-3">
              <div className="section-label mb-1">Latest Updates</div>
              <h2 className="text-[clamp(22px,3vw,32px)] font-[900] tracking-[-0.02em] text-white"
                style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                സർക്കാർ ഉത്തരവുകൾ
              </h2>
              <div className="h-[2px] w-10 bg-gradient-to-r from-[#ff9f0a] to-transparent mt-2 rounded-full" />
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none"
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input type="text" value={query} onChange={e => handleSearch(e.target.value)}
                placeholder="ഉത്തരവ് തിരയുക..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[13px] text-white placeholder-white/30 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: "var(--font-noto-malayalam), sans-serif" }}
                onFocus={e => e.target.style.borderColor = 'rgba(255,159,10,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              {query && (
                <button onClick={() => handleSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors bg-transparent border-0 cursor-pointer text-lg leading-none">
                  ×
                </button>
              )}
            </div>

            {/* Orders list */}
            <div className="flex-grow">
              {currentOrders.length === 0 ? (
                <div className="text-center py-10 text-white/70 text-[13px]"
                  style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                  "{query}" എന്നതിന് ഫലങ്ങൾ ഒന്നും കിട്ടിയില്ല.
                </div>
              ) : currentOrders.map((o) => {
                const isDirectPdf = o.pdf_url && !o.pdf_url.includes('finance.kerala.gov.in');
                const accentColor = o.is_pinned ? '#ff9f0a' : '#2997ff';
                return isDirectPdf ? (
                  <a key={o.id} href={o.pdf_url} target="_blank" rel="noopener noreferrer" download className="block no-underline group">
                    <div className={`relative flex items-center gap-3 px-4 py-3 rounded-[14px] transition-all duration-200 hover:bg-white/[0.06] mb-1.5 overflow-hidden ${o.is_pinned ? 'bg-[#ff9f0a]/[0.04]' : ''}`}>
                      <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        style={{ background: accentColor + '30' }} />
                      <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                        style={o.is_pinned
                          ? { background: 'rgba(255,159,10,0.20)', border: '1px solid rgba(255,159,10,0.35)' }
                          : { background: 'rgba(41,151,255,0.12)', border: '1px solid rgba(41,151,255,0.22)' }}>
                        {o.is_pinned ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff9f0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L8 8H3l4 4-1.5 7L12 16l6.5 3L17 12l4-4h-5L12 2z"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2997ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                          </svg>
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${o.is_pinned ? 'bg-[#ff9f0a]/30 text-[#ff9f0a]' : 'bg-[#2997ff]/20 text-[#2997ff]'}`}>
                            {o.is_pinned ? 'PINNED' : (o.go_number?.split('/')[0] || 'GO')}
                          </span>
                          <span className="text-[10px] text-white/50">{formatDate(o.go_date)}</span>
                        </div>
                        <h3 className="text-[12px] md:text-[13px] font-bold leading-snug text-white/90 group-hover:text-white transition-colors line-clamp-2"
                          style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                          {o.title_ml}
                        </h3>
                      </div>
                      <svg className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all flex-shrink-0"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}70, transparent)` }} />
                    </div>
                  </a>
                ) : (
                  <div key={o.id} className="relative flex items-center gap-3 px-4 py-3 rounded-[14px] mb-1.5 opacity-40 cursor-not-allowed overflow-hidden">
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.08] text-white/65">
                          {o.go_number?.split('/')[0] || 'GO'}
                        </span>
                        <span className="text-[10px] text-white/50">{formatDate(o.go_date)}</span>
                      </div>
                      <h3 className="text-[13px] font-bold leading-snug text-white/60 line-clamp-2"
                        style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>{o.title_ml}</h3>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-white/[0.07] my-3" />

            {/* Read More */}
            {filtered.length > 3 && (
              <div className="mb-2">
                <button onClick={() => setExpanded(v => !v)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-[12px] font-bold transition-all cursor-pointer border-none"
                  style={{ background: 'rgba(255,159,10,0.08)', color: '#ff9f0a', border: '1px solid rgba(255,159,10,0.22)' }}>
                  {expanded ? 'Show Less ↑' : 'Read More ↓'}
                </button>
              </div>
            )}

            {/* CTA */}
            <Link href="/orders"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[13px] font-bold no-underline transition-all hover:bg-white/[0.06]"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.08)' }}>
              എല്ലാ ഉത്തരവുകളും കാണുക
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                <path d="M9 5l7 7" />
              </svg>
            </Link>

          </div>{/* /content */}
        </div>{/* /dark card */}
      </div>{/* /gradient border */}
    </section>
  );
}
