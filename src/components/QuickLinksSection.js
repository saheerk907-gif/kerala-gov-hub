'use client';
import { useState } from 'react';

const MOBILE_VISIBLE = 4;
const ACCENT = '#30d158';

const F1 = '#2a3552';
const F2 = '#1e2a44';
const D  = '#162038';

function QuickLinksIllustration() {
  return (
    <svg viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">

      {/* Main browser window — right-center */}
      <g transform="translate(448,178)">
        {/* Frame */}
        <rect x="-105" y="-118" width="210" height="236" rx="14" fill={F1}/>
        {/* Title bar */}
        <rect x="-105" y="-118" width="210" height="32" rx="14" fill={D}/>
        <rect x="-105" y="-100" width="210" height="14" fill={D}/>
        {/* Traffic lights */}
        <circle cx="-84" cy="-102" r="5.5" fill="#3a2a2a"/>
        <circle cx="-68" cy="-102" r="5.5" fill="#3a3a2a"/>
        <circle cx="-52" cy="-102" r="5.5" fill="#2a3a2a"/>
        {/* Address bar */}
        <rect x="-30" y="-110" width="112" height="16" rx="5" fill={F1}/>
        {/* Content rows */}
        <rect x="-90" y="-74" width="180" height="10" rx="4" fill={D}/>
        <rect x="-90" y="-58" width="140" height="10" rx="4" fill={D}/>
        <rect x="-90" y="-42" width="160" height="10" rx="4" fill={D}/>
        {/* Card rows in window */}
        {[[-90,-20,88,30],[-90,18,88,30],[8,-20,82,30],[8,18,82,30]].map(([x,y,w,h],i)=>(
          <rect key={i} x={x} y={y} width={w} height={h} rx="7" fill={D}/>
        ))}
        <rect x="-90" y="56" width="180" height="8" rx="3" fill={D}/>
        <rect x="-90" y="72" width="130" height="8" rx="3" fill={D}/>
        <rect x="-90" y="88" width="155" height="8" rx="3" fill={D}/>
      </g>

      {/* Second window — behind, tilted */}
      <g transform="translate(536,130) rotate(16)">
        <rect x="-72" y="-95" width="144" height="190" rx="10" fill={F2}/>
        <rect x="-72" y="-95" width="144" height="26" rx="10" fill={D}/>
        <circle cx="-56" cy="-82" r="4.5" fill="#2a2a2a"/>
        <circle cx="-44" cy="-82" r="4.5" fill="#2a2a2a"/>
        {[-55,-38,-22,-6,10,26,42,60,76,92].map((y,i)=>(
          <rect key={i} x="-58" y={y} width={i%3===2?80:116} height="7" rx="3" fill={D}/>
        ))}
      </g>

      {/* Chain-link icon — decorative */}
      <g transform="translate(358,96)">
        <rect x="-22" y="-8" width="26" height="16" rx="8" fill="none" stroke={F1} strokeWidth="7"/>
        <rect x="-4"  y="-8" width="26" height="16" rx="8" fill="none" stroke={F2} strokeWidth="7"/>
      </g>

      {/* Globe — bottom cluster */}
      <g transform="translate(366,300)">
        <circle r="36" fill={F2}/>
        <circle r="36" fill="none" stroke={D} strokeWidth="2"/>
        {/* Latitude lines */}
        <ellipse rx="36" ry="14" fill="none" stroke={D} strokeWidth="2"/>
        <ellipse rx="36" ry="26" fill="none" stroke={D} strokeWidth="1.5"/>
        {/* Longitude line */}
        <line x1="0" y1="-36" x2="0" y2="36" stroke={D} strokeWidth="2"/>
        <line x1="-36" y1="0" x2="36" y2="0" stroke={D} strokeWidth="2"/>
      </g>

      {/* Network nodes */}
      <circle cx="334" cy="200" r="6" fill={F1}/>
      <circle cx="326" cy="222" r="4" fill={F2}/>
      <line x1="334" y1="200" x2="366" y2="270" stroke={F2} strokeWidth="1.5" opacity="0.5"/>

      {/* Accent dots */}
      <circle cx="576" cy="312" r="5"   fill={F1}/>
      <circle cx="564" cy="330" r="3"   fill={F2}/>
      <circle cx="576" cy="62"  r="4"   fill={F1}/>
      <circle cx="562" cy="76"  r="2.5" fill={F2}/>
    </svg>
  );
}

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
          {/* SVG illustrated card */}
          <div className="relative overflow-hidden" style={{
            background: '#080c14',
            borderRadius: 26,
            minHeight: 360,
          }}>
            {/* SVG illustration — behind everything */}
            <QuickLinksIllustration />
            {/* Fade content area */}
            <div style={{ position:'absolute', inset:0, zIndex:1,
              background:'linear-gradient(to right, rgba(8,12,20,0.97) 0%, rgba(8,12,20,0.88) 44%, rgba(8,12,20,0.50) 68%, transparent 100%)' }}/>
            <div style={{ position:'absolute', inset:0, zIndex:1,
              background:'linear-gradient(to bottom, rgba(8,12,20,0.55) 0%, transparent 30%, rgba(8,12,20,0.75) 100%)' }}/>
            {/* Green accent glow */}
            <div style={{ position:'absolute', bottom:0, left:0, width:'45%', height:'35%', zIndex:1,
              background:'radial-gradient(ellipse at bottom left, rgba(48,209,88,0.11) 0%, transparent 70%)' }}/>

            {/* Content */}
            <div className="relative p-5 md:p-7 flex flex-col" style={{ zIndex:2, minHeight:360 }}>

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
