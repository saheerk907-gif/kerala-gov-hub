'use client';
import { useState } from 'react';

const MOBILE_VISIBLE = 4;
const ACCENT = '#30d158';

const COLOR_MAP = {
  blue:   { text:'#2997ff', bg:'rgba(41,151,255,0.12)',  border:'rgba(41,151,255,0.22)' },
  green:  { text:'#30d158', bg:'rgba(48,209,88,0.12)',   border:'rgba(48,209,88,0.22)'  },
  orange: { text:'#ff9f0a', bg:'rgba(255,159,10,0.12)',  border:'rgba(255,159,10,0.22)' },
  purple: { text:'#bf5af2', bg:'rgba(191,90,242,0.12)',  border:'rgba(191,90,242,0.22)' },
  teal:   { text:'#64d2ff', bg:'rgba(100,210,255,0.12)', border:'rgba(100,210,255,0.22)'},
  pink:   { text:'#ff375f', bg:'rgba(255,55,95,0.12)',   border:'rgba(255,55,95,0.22)'  },
  gold:   { text:'#c8960c', bg:'rgba(200,150,12,0.12)',  border:'rgba(200,150,12,0.22)' },
};

export default function QuickLinksSection({ links }) {
  const [expanded, setExpanded] = useState(false);
  if (!links?.length) return null;

  return (
    <section id="links" className="relative py-3 md:py-4 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Gradient border wrapper */}
        <div style={{
          background:'linear-gradient(135deg,rgba(140,80,240,0.55),rgba(60,130,255,0.55))',
          padding:'1.5px', borderRadius:28,
        }}>
          {/* Cinematic photo card */}
          <div className="relative overflow-hidden" style={{
            backgroundImage:"url('/images/govtoffic.jpg')",
            backgroundSize:'cover',
            backgroundPosition:'center 85%',
            borderRadius:26,
            minHeight:360,
          }}>
            {/* Overlays */}
            <div style={{ position:'absolute', inset:0, background:'rgba(4,7,14,0.72)', zIndex:1 }}/>
            <div style={{ position:'absolute', inset:0, zIndex:2,
              background:'linear-gradient(to right, rgba(4,7,14,0.98) 0%, rgba(4,7,14,0.83) 38%, rgba(4,7,14,0.45) 66%, transparent 100%)' }}/>
            <div style={{ position:'absolute', inset:0, zIndex:2,
              background:'linear-gradient(to bottom, rgba(4,7,14,0.88) 0%, transparent 30%, rgba(4,7,14,0.93) 100%)' }}/>
            {/* Green accent glow */}
            <div style={{ position:'absolute', bottom:0, left:0, width:'45%', height:'35%', zIndex:2,
              background:'radial-gradient(ellipse at bottom left, rgba(48,209,88,0.12) 0%, transparent 70%)' }}/>

            {/* Content */}
            <div className="relative p-5 md:p-7 flex flex-col" style={{ zIndex:3, minHeight:360 }}>

              {/* Header */}
              <div className="mb-5">
                <div className="section-label mb-1" style={{ color:ACCENT, opacity:1, fontWeight:800 }}>Quick Access</div>
                <h2 className="text-[clamp(26px,4vw,38px)] font-[900] tracking-[-0.03em] text-white leading-tight"
                  style={{ fontFamily:"var(--font-noto-malayalam), sans-serif", textShadow:'0 2px 20px rgba(0,0,0,0.9)' }}>
                  ഔദ്യോഗിക പോർട്ടലുകൾ
                </h2>
                <div className="h-[3px] w-12 mt-2 rounded-full"
                  style={{ background:`linear-gradient(to right, ${ACCENT}, transparent)` }}/>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                    style={{ background:'rgba(48,209,88,0.13)', border:'1px solid rgba(48,209,88,0.32)', color:ACCENT }}>
                    🔗 {links.length} Official Portals
                  </div>
                </div>
              </div>

              {/* Links grid */}
              <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {links.map((l, idx) => {
                  const c = COLOR_MAP[l.color] || COLOR_MAP.blue;
                  return (
                    <div key={l.id} className={idx >= MOBILE_VISIBLE && !expanded ? 'hidden' : 'block'}>
                      <a href={l.url} target="_blank" rel="noopener noreferrer"
                        className="group relative flex items-center gap-3 px-4 py-3 rounded-[14px] no-underline transition-all duration-200 hover:bg-white/[0.07] overflow-hidden"
                        style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.10)', backdropFilter:'blur(10px)' }}>
                        <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                          style={{ background:c.text+'25' }}/>
                        <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-base transition-transform duration-200 group-hover:scale-105"
                          style={{ background:c.bg, border:`1px solid ${c.border}` }}>
                          {l.icon}
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="text-[13px] font-bold text-white/90 group-hover:text-white transition-colors leading-snug truncate"
                            style={{ fontFamily:"var(--font-noto-malayalam), sans-serif", textShadow:'0 1px 6px rgba(0,0,0,0.8)' }}>
                            {l.title_ml}
                          </div>
                          {l.subtitle && (
                            <div className="text-[10px] text-white/50 font-medium mt-0.5 truncate">{l.subtitle}</div>
                          )}
                        </div>
                        <svg className="flex-shrink-0 w-3 h-3 text-white/30 group-hover:text-white/60 transition-colors"
                          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          <polyline points="15 3 21 3 21 9"/>
                          <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        <div className="absolute bottom-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          style={{ background:`linear-gradient(90deg, transparent, ${c.text}70, transparent)` }}/>
                      </a>
                    </div>
                  );
                })}
              </div>

              {/* Expand */}
              {links.length > MOBILE_VISIBLE && (
                <div className="mt-4">
                  <button onClick={()=>setExpanded(v=>!v)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-[12px] font-bold transition-all cursor-pointer border-none"
                    style={{ background:'rgba(48,209,88,0.09)', color:ACCENT, border:'1px solid rgba(48,209,88,0.25)', backdropFilter:'blur(8px)' }}>
                    {expanded ? 'Show Less ↑' : `Show All ${links.length} Portals ↓`}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
