'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ACCENT = '#ff9f0a';
const COLORS = {
  blue:   { text:'#2997ff', bg:'rgba(41,151,255,0.12)',  border:'rgba(41,151,255,0.22)' },
  green:  { text:'#30d158', bg:'rgba(48,209,88,0.12)',   border:'rgba(48,209,88,0.22)'  },
  orange: { text:'#ff9f0a', bg:'rgba(255,159,10,0.12)',  border:'rgba(255,159,10,0.22)' },
  purple: { text:'#bf5af2', bg:'rgba(191,90,242,0.12)',  border:'rgba(191,90,242,0.22)' },
  pink:   { text:'#ff375f', bg:'rgba(255,55,95,0.12)',   border:'rgba(255,55,95,0.22)'  },
  teal:   { text:'#64d2ff', bg:'rgba(100,210,255,0.12)', border:'rgba(100,210,255,0.22)'},
};

export default function SchemesSection({ schemes }) {
  const [expanded, setExpanded] = useState(false);
  if (!schemes?.length) return null;

  const KSR_KEYWORDS = ['ksr','rule',' sr ','joining time','maternity','paternity','study leave','transfer ta','family pension','disciplinary','earned leave','dcrg','gratuity'];
  const filtered = schemes.filter(s => {
    const combined = [s.subtitle_en, s.title_en, s.title_ml].join(' ').toLowerCase();
    return !KSR_KEYWORDS.some(kw => combined.includes(kw));
  });
  if (!filtered.length) return null;

  return (
    <section id="services" className="relative py-3 md:py-4 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Gradient border wrapper */}
        <div style={{
          background:'linear-gradient(135deg,rgba(140,80,240,0.55),rgba(60,130,255,0.55))',
          padding:'1.5px', borderRadius:28,
        }}>
          {/* Cinematic photo card */}
          <div className="relative overflow-hidden" style={{ borderRadius:26, minHeight:360 }}>
            {/* Optimised background image — lazy loaded, served as WebP */}
            <Image
              src="/images/orders-bg.webp"
              alt=""
              fill
              className="object-cover opacity-[0.25]"
              style={{ objectPosition: 'center left' }}
              sizes="(max-width: 768px) 100vw, 1200px"
              loading="lazy"
              quality={65}
            />
            {/* Overlays */}
            <div style={{ position:'absolute', inset:0, background:'rgba(6,8,15,0.88)', zIndex:1 }}/>
            <div style={{ position:'absolute', inset:0, zIndex:2,
              background:'linear-gradient(to right, rgba(6,8,15,0.99) 0%, rgba(6,8,15,0.92) 45%, rgba(6,8,15,0.80) 100%)' }}/>
            <div style={{ position:'absolute', inset:0, zIndex:2,
              background:'linear-gradient(to bottom, rgba(6,8,15,0.92) 0%, transparent 35%, rgba(6,8,15,0.96) 100%)' }}/>
            {/* Orange accent glow */}
            <div style={{ position:'absolute', bottom:0, left:0, width:'45%', height:'35%', zIndex:2,
              background:'radial-gradient(ellipse at bottom left, rgba(255,159,10,0.14) 0%, transparent 70%)' }}/>

            {/* Content */}
            <div className="relative p-5 md:p-7 flex flex-col" style={{ zIndex:3, minHeight:360 }}>

              {/* Header */}
              <div className="mb-5">
                <div className="section-label mb-1" style={{ color:ACCENT, opacity:1, fontWeight:800 }}>Resources</div>
                <h2 className="text-[clamp(22px,3.5vw,34px)] font-[900] tracking-[-0.03em] text-white leading-tight"
                  style={{ fontFamily:"var(--font-noto-malayalam), sans-serif", textShadow:'0 2px 20px rgba(0,0,0,0.9)' }}>
                  സേവന ചട്ടങ്ങളും<br className="hidden md:block"/> ജീവനക്കാര്യ പദ്ധതികളും
                </h2>
                <div className="h-[3px] w-12 mt-2 rounded-full"
                  style={{ background:`linear-gradient(to right, ${ACCENT}, transparent)` }}/>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest"
                    style={{ background:'rgba(255,159,10,0.15)', border:'1px solid rgba(255,159,10,0.35)', color:ACCENT }}>
                    📚 {filtered.length} Schemes & Rules
                  </div>
                </div>
              </div>

              {/* Schemes grid */}
              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-2">
                {(expanded ? filtered : filtered.slice(0,4)).map(scheme => {
                  const c = COLORS[scheme.color] || COLORS.blue;
                  const pageUrl = `/${scheme.title_en ? scheme.title_en.toLowerCase().replace(/\s+/g,'-') : 'details'}`;
                  return (
                    <Link key={scheme.id} href={pageUrl}
                      className="group relative flex items-center gap-3 px-4 py-3 rounded-[14px] no-underline transition-all duration-200 hover:bg-white/[0.07] overflow-hidden"
                      style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', backdropFilter:'blur(10px)' }}>
                      <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        style={{ background:c.text+'25' }}/>
                      <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-base transition-transform duration-200 group-hover:scale-105"
                        style={{ background:c.bg, border:`1px solid ${c.border}` }}>
                        {scheme.icon}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="text-[13px] font-bold text-white/90 group-hover:text-white transition-colors leading-snug truncate"
                          style={{ fontFamily:"var(--font-noto-malayalam), sans-serif", textShadow:'0 1px 6px rgba(0,0,0,0.8)' }}>
                          {scheme.title_ml}
                        </div>
                        <div className="text-[10px] text-white/50 font-medium mt-0.5 truncate">
                          {scheme.subtitle_en || scheme.title_en}
                        </div>
                      </div>
                      <svg className="flex-shrink-0 w-3.5 h-3.5 text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all"
                        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                        <path d="M9 5l7 7-7 7"/>
                      </svg>
                      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ background:`linear-gradient(90deg, transparent, ${c.text}70, transparent)` }}/>
                    </Link>
                  );
                })}
              </div>

              {/* Expand + no bottom CTA needed */}
              {filtered.length > 4 && (
                <button onClick={()=>setExpanded(v=>!v)}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-[12px] font-bold transition-all cursor-pointer border-none"
                  style={{ background:'rgba(255,159,10,0.10)', color:ACCENT, border:'1px solid rgba(255,159,10,0.28)', backdropFilter:'blur(8px)' }}>
                  {expanded ? 'Show Less ↑' : 'Read More ↓'}
                </button>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
