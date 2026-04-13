'use client';
import Link from 'next/link';

// ─── SVG fill palette — visible but subtle against dark bg ───────────────────
const F1 = '#1e2d48';   // base fill
const F2 = '#172340';   // slightly deeper fill
const DK = '#0f1a2e';   // inner detail / shadow

// ─── Large category illustrations ────────────────────────────────────────────

function PdfIllustration() {
  return (
    <svg viewBox="0 0 300 185" xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice" aria-hidden="true"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
      <g transform="translate(200,65) rotate(-22)">
        <rect x="-42" y="-58" width="84" height="116" rx="8" fill={F1}/>
        <polygon points="24,-58 42,-58 42,-38" fill={DK}/>
        <line x1="-28" y1="-32" x2="20" y2="-32" stroke={DK} strokeWidth="5" strokeLinecap="round"/>
        <line x1="-28" y1="-14" x2="20" y2="-14" stroke={DK} strokeWidth="5" strokeLinecap="round"/>
        <line x1="-28" y1="4"   x2="8"  y2="4"   stroke={DK} strokeWidth="5" strokeLinecap="round"/>
        <line x1="-28" y1="22"  x2="14" y2="22"  stroke={DK} strokeWidth="5" strokeLinecap="round"/>
      </g>
      <g transform="translate(262,82) rotate(16)">
        <rect x="-36" y="-50" width="72" height="100" rx="7" fill={F2}/>
        <polygon points="20,-50 36,-50 36,-34" fill={DK}/>
        <line x1="-24" y1="-25" x2="17" y2="-25" stroke={DK} strokeWidth="4" strokeLinecap="round"/>
        <line x1="-24" y1="-8"  x2="17" y2="-8"  stroke={DK} strokeWidth="4" strokeLinecap="round"/>
        <line x1="-24" y1="9"   x2="6"  y2="9"   stroke={DK} strokeWidth="4" strokeLinecap="round"/>
      </g>
      <g transform="translate(178,150) rotate(-7)">
        <rect x="-36" y="-48" width="72" height="96" rx="7" fill="#273550"/>
        <polygon points="19,-48 36,-48 36,-31" fill={DK}/>
        <line x1="-24" y1="-24" x2="15" y2="-24" stroke={DK} strokeWidth="4" strokeLinecap="round"/>
        <line x1="-24" y1="-7"  x2="15" y2="-7"  stroke={DK} strokeWidth="4" strokeLinecap="round"/>
        <line x1="-24" y1="10"  x2="4"  y2="10"  stroke={DK} strokeWidth="4" strokeLinecap="round"/>
      </g>
      <g transform="translate(262,158)">
        <path d="M-58,0 Q-29,-20 0,0 L0,54 Q-29,36 -58,54 Z" fill={F2}/>
        <path d="M0,0  Q29,-20 58,0 L58,54 Q29,36 0,54 Z"   fill={F1}/>
        <line x1="0" y1="0" x2="0" y2="54" stroke={DK} strokeWidth="3"/>
        <line x1="-46" y1="13" x2="-8"  y2="8"  stroke={DK} strokeWidth="3" strokeLinecap="round"/>
        <line x1="-46" y1="26" x2="-8"  y2="21" stroke={DK} strokeWidth="3" strokeLinecap="round"/>
        <line x1="-46" y1="39" x2="-20" y2="35" stroke={DK} strokeWidth="3" strokeLinecap="round"/>
        <line x1="8"   y1="8"  x2="46" y2="13"  stroke={DK} strokeWidth="3" strokeLinecap="round"/>
        <line x1="8"   y1="21" x2="46" y2="26"  stroke={DK} strokeWidth="3" strokeLinecap="round"/>
        <line x1="8"   y1="35" x2="32" y2="39"  stroke={DK} strokeWidth="3" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

function GearIllustration() {
  const teeth = [0,40,80,120,160,200,240,280,320];
  return (
    <svg viewBox="0 0 300 185" xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice" aria-hidden="true"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
      <g transform="translate(178,95)">
        {teeth.map(a => (
          <rect key={a} x="-13" y="-93" width="26" height="34" rx="7" fill={F1}
            transform={`rotate(${a})`}/>
        ))}
        <circle r="75" fill={F1}/>
        <circle r="59" fill="none" stroke={DK} strokeWidth="8"/>
        <circle r="34" fill="#0d1117"/>
        <circle r="22" fill={F1}/>
        <circle r="12" fill="#0d1117"/>
      </g>
    </svg>
  );
}

function CalcIllustration() {
  const rods   = [178,210,242,274];
  const beadY  = [118,133,150,165];
  const bColors = [
    ['#1f6070','#1f6070','#1f6070','#1f6070'],
    ['#5a3a28','#5a3a28','#5a3a28','#5a3a28'],
    ['#4a5828','#4a5828','#4a5828','#4a5828'],
    ['#1f6070','#1f6070','#5a3a28','#4a5828'],
  ];
  return (
    <svg viewBox="0 0 300 185" xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice" aria-hidden="true"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
      <g opacity="0.55">
        {[118,152,186,220,255].map(x => (
          <line key={x} x1={x} y1="6" x2={x} y2="108" stroke="#263248" strokeWidth="1.5"/>
        ))}
        {[22,46,70,94].map(y => (
          <line key={y} x1="102" y1={y} x2="265" y2={y} stroke="#263248" strokeWidth="1.5"/>
        ))}
        <line x1="118" y1="3"   x2="118" y2="108" stroke="#34405e" strokeWidth="2.2"/>
        <polygon points="118,3 112,20 124,20" fill="#34405e"/>
        <line x1="118" y1="94" x2="268" y2="94" stroke="#34405e" strokeWidth="2.2"/>
        <polygon points="268,94 252,88 252,100" fill="#34405e"/>
        <line x1="123" y1="90" x2="258" y2="20" stroke="#405070" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      <rect x="162" y="100" width="132" height="82" rx="8" fill="none" stroke="#3a2a1a" strokeWidth="4"/>
      <line x1="162" y1="117" x2="294" y2="117" stroke="#3a2a1a" strokeWidth="5"/>
      <line x1="162" y1="178" x2="294" y2="178" stroke="#3a2a1a" strokeWidth="5"/>
      {rods.map((x, ri) => (
        <g key={x}>
          <line x1={x} y1="100" x2={x} y2="182" stroke="#3a2a1a" strokeWidth="4"/>
          {beadY.map((y, bi) => (
            <ellipse key={bi} cx={x} cy={y} rx="13" ry="9" fill={bColors[ri][bi]}/>
          ))}
        </g>
      ))}
    </svg>
  );
}

// ─── Categories ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    icon: '📄',
    title: 'PDF Tools',
    desc: 'Edit, merge, split, convert PDFs — browser-based, files never leave your device',
    href: '/tools',
    color: '#22d3ee',
    colorRgb: '34,211,238',
    count: 5,
    Illustration: PdfIllustration,
  },
  {
    icon: '⚙️',
    title: 'Utilities',
    desc: 'QR code generator, holiday list, and more useful everyday tools',
    href: '/tools',
    color: '#34d399',
    colorRgb: '52,211,153',
    count: 2,
    Illustration: GearIllustration,
  },
  {
    icon: '🧮',
    title: 'Calculators & Guides',
    desc: 'Pension, DA arrear, income tax, leave, retirement and more calculators',
    href: '/calculators',
    color: '#fbbf24',
    colorRgb: '251,191,36',
    count: 12,
    Illustration: CalcIllustration,
  },
];

// ─── Trending items ───────────────────────────────────────────────────────────

const TRENDING = [
  { label:'PDF Editor',    sub:'Edit & Annotate', href:'/tools/pdf-editor',        color:'#f5a623', rgb:'245,166,35'  },
  { label:'PDF Merger',    sub:'Combine Files',   href:'/tools/pdf-merger',         color:'#22d3ee', rgb:'34,211,238'  },
  { label:'PDF Splitter',  sub:'Extract Pages',   href:'/tools/pdf-splitter',       color:'#a78bfa', rgb:'167,139,250' },
  { label:'NPS vs APS',    sub:'Compare Plans',   href:'/nps-aps',                  color:'#60a5fa', rgb:'96,165,250'  },
  { label:'DA Arrear',     sub:'Calculate',       href:'/da-arrear',                color:'#34d399', rgb:'52,211,153'  },
  { label:'Leave Calc',    sub:'Track Leave',     href:'/leave',                    color:'#fb7185', rgb:'251,113,133' },
  { label:'Holiday List',  sub:'2026 Holidays',   href:'/tools/holiday-list-2026',  color:'#fbbf24', rgb:'251,191,36'  },
];

const titleGrad = 'linear-gradient(135deg,#c8960c 0%,#f5d060 38%,#fce38a 52%,#f5d060 68%,#c8960c 100%)';

export default function ToolsSection() {
  return (
    <section id="tools" className="relative py-3 md:py-4 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Section header */}
        <div className="mb-5">
          <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/55 mb-1">
            Tools &amp; Calculators
          </div>
          <h2
            className="font-bold leading-tight bg-clip-text text-transparent"
            style={{
              fontSize: 'clamp(20px,2.5vw,34px)',
              backgroundImage: titleGrad,
              filter: 'drop-shadow(0 0 12px rgba(200,150,12,0.30))',
            }}
          >
            ടൂളുകൾ
          </h2>
        </div>

        {/* ── Trending strip ── */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <span style={{ fontSize:14, lineHeight:1 }}>🔥</span>
            <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.80)', letterSpacing:'0.02em' }}>
              Trending Now
            </span>
            <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize:10, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.40)' }}>
              7 tools
            </span>
          </div>

          {/* Scrollable pill row */}
          <div style={{ position:'relative' }}>
            <div
              style={{
                display:'flex', gap:8, overflowX:'auto',
                paddingBottom:4, scrollbarWidth:'none', msOverflowStyle:'none',
                WebkitOverflowScrolling:'touch',
              }}
            >
              {TRENDING.map(({ label, sub, href, color, rgb }) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display:'inline-flex', flexDirection:'column', justifyContent:'center',
                    flexShrink:0, padding:'9px 14px',
                    borderRadius:12, textDecoration:'none',
                    background:'rgba(255,255,255,0.03)',
                    border:'1px solid rgba(255,255,255,0.09)',
                    transition:'border-color 0.18s, background 0.18s, transform 0.18s',
                    minWidth:100,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `rgba(${rgb},0.45)`;
                    e.currentTarget.style.background   = `rgba(${rgb},0.07)`;
                    e.currentTarget.style.transform    = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
                    e.currentTarget.style.background   = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.transform    = 'none';
                  }}
                >
                  <span style={{
                    fontSize:12, fontWeight:700,
                    color, lineHeight:1.2, whiteSpace:'nowrap',
                  }}>
                    {label}
                  </span>
                  <span style={{
                    fontSize:10, fontWeight:500,
                    color:'rgba(255,255,255,0.50)', marginTop:3, whiteSpace:'nowrap',
                  }}>
                    {sub}
                  </span>
                </Link>
              ))}
            </div>
            {/* Right-edge fade hint for mobile */}
            <div
              className="md:hidden"
              style={{
                position:'absolute', top:0, right:0, bottom:4, width:36,
                pointerEvents:'none',
                background:'linear-gradient(to right, transparent, rgba(13,17,23,0.90))',
              }}
            />
          </div>
        </div>

        {/* ── Category cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CATEGORIES.map(({ icon, title, desc, href, color, colorRgb, count, Illustration }) => (
            <Link
              key={title}
              href={href}
              className="group relative flex flex-col gap-2 p-5 no-underline overflow-hidden"
              style={{
                borderRadius:18,
                background:'#0d1117',
                border:`1px solid rgba(${colorRgb},0.20)`,
                minHeight:160,
                transition:'border-color 0.22s, box-shadow 0.22s, transform 0.22s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `rgba(${colorRgb},0.45)`;
                e.currentTarget.style.boxShadow   = `0 8px 32px rgba(${colorRgb},0.12), 0 2px 8px rgba(0,0,0,0.40)`;
                e.currentTarget.style.transform   = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = `rgba(${colorRgb},0.20)`;
                e.currentTarget.style.boxShadow   = 'none';
                e.currentTarget.style.transform   = 'none';
              }}
            >
              {/* SVG illustration — behind content */}
              <Illustration />

              {/* Overlay so text stays readable */}
              <div style={{
                position:'absolute', inset:0, pointerEvents:'none',
                background:'linear-gradient(to right, rgba(13,17,23,0.97) 20%, rgba(13,17,23,0.80) 45%, rgba(13,17,23,0.25) 75%, transparent 100%)',
              }}/>

              {/* Card content */}
              <div className="relative flex flex-col h-full" style={{ zIndex:10 }}>

                {/* Top row: icon chip + count badge */}
                <div className="flex items-center justify-between mb-3">
                  <div style={{
                    width:36, height:36, borderRadius:10, fontSize:18,
                    background:`rgba(${colorRgb},0.14)`,
                    border:`1px solid rgba(${colorRgb},0.28)`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    {icon}
                  </div>
                  <span style={{
                    padding:'3px 10px', borderRadius:20,
                    background:`rgba(${colorRgb},0.12)`,
                    border:`1px solid rgba(${colorRgb},0.30)`,
                    color, fontSize:10, fontWeight:700,
                    letterSpacing:'0.05em', whiteSpace:'nowrap',
                  }}>
                    {count} TOOLS
                  </span>
                </div>

                {/* Title */}
                <h3 style={{
                  color:'rgba(255,255,255,0.95)', fontSize:15,
                  fontWeight:700, margin:0, marginBottom:6,
                }}>
                  {title}
                </h3>

                {/* Description */}
                <p style={{
                  color:'rgba(255,255,255,0.60)', fontSize:12,
                  lineHeight:1.6, margin:0,
                }}>
                  {desc}
                </p>

                {/* Explore CTA */}
                <div
                  className="flex items-center gap-1 mt-auto pt-4"
                  style={{ color, fontSize:12, fontWeight:700 }}
                >
                  Explore
                  <svg width="12" height="12" fill="none" stroke="currentColor"
                    strokeWidth="2.5" viewBox="0 0 24 24"
                    style={{ transition:'transform 0.18s' }}
                    className="group-hover:translate-x-0.5">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
