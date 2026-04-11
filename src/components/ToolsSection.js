'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const FILL  = '#3a4258';   // illustration fill (dark slate-blue)
const FILL2 = '#323a52';   // slightly darker fill variant
const DARK  = '#252e42';   // inner detail / shadow color
const BG    = '#0d1117';   // card background

// ─── Illustration components ──────────────────────────────────────────────────

function PdfIllustration() {
  return (
    <svg viewBox="0 0 300 185" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">
      {/* Scattered doc pages */}
      <g transform="translate(200,65) rotate(-22)">
        <rect x="-42" y="-58" width="84" height="116" rx="8" fill={FILL}/>
        <polygon points="24,-58 42,-58 42,-38" fill={DARK}/>
        <line x1="-28" y1="-32" x2="20" y2="-32" stroke={DARK} strokeWidth="5" strokeLinecap="round"/>
        <line x1="-28" y1="-14" x2="20" y2="-14" stroke={DARK} strokeWidth="5" strokeLinecap="round"/>
        <line x1="-28" y1="4"   x2="8"  y2="4"   stroke={DARK} strokeWidth="5" strokeLinecap="round"/>
        <line x1="-28" y1="22"  x2="14" y2="22"  stroke={DARK} strokeWidth="5" strokeLinecap="round"/>
      </g>
      <g transform="translate(262,82) rotate(16)">
        <rect x="-36" y="-50" width="72" height="100" rx="7" fill={FILL2}/>
        <polygon points="20,-50 36,-50 36,-34" fill={DARK}/>
        <line x1="-24" y1="-25" x2="17" y2="-25" stroke={DARK} strokeWidth="4" strokeLinecap="round"/>
        <line x1="-24" y1="-8"  x2="17" y2="-8"  stroke={DARK} strokeWidth="4" strokeLinecap="round"/>
        <line x1="-24" y1="9"   x2="6"  y2="9"   stroke={DARK} strokeWidth="4" strokeLinecap="round"/>
      </g>
      <g transform="translate(178,150) rotate(-7)">
        <rect x="-36" y="-48" width="72" height="96" rx="7" fill="#3e4660"/>
        <polygon points="19,-48 36,-48 36,-31" fill={DARK}/>
        <line x1="-24" y1="-24" x2="15" y2="-24" stroke={DARK} strokeWidth="4" strokeLinecap="round"/>
        <line x1="-24" y1="-7"  x2="15" y2="-7"  stroke={DARK} strokeWidth="4" strokeLinecap="round"/>
        <line x1="-24" y1="10"  x2="4"  y2="10"  stroke={DARK} strokeWidth="4" strokeLinecap="round"/>
      </g>
      {/* Open book – bottom right */}
      <g transform="translate(262,158)">
        <path d="M-58,0 Q-29,-20 0,0 L0,54 Q-29,36 -58,54 Z" fill={FILL2}/>
        <path d="M0,0  Q29,-20 58,0 L58,54 Q29,36 0,54 Z"   fill={FILL}/>
        <line x1="0" y1="0" x2="0" y2="54" stroke={DARK} strokeWidth="3"/>
        <line x1="-46" y1="13" x2="-8"  y2="8"  stroke={DARK} strokeWidth="3" strokeLinecap="round"/>
        <line x1="-46" y1="26" x2="-8"  y2="21" stroke={DARK} strokeWidth="3" strokeLinecap="round"/>
        <line x1="-46" y1="39" x2="-20" y2="35" stroke={DARK} strokeWidth="3" strokeLinecap="round"/>
        <line x1="8"  y1="8"  x2="46" y2="13" stroke={DARK} strokeWidth="3" strokeLinecap="round"/>
        <line x1="8"  y1="21" x2="46" y2="26" stroke={DARK} strokeWidth="3" strokeLinecap="round"/>
        <line x1="8"  y1="35" x2="32" y2="39" stroke={DARK} strokeWidth="3" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

function GearIllustration() {
  const teeth = [0, 40, 80, 120, 160, 200, 240, 280, 320];
  return (
    <svg viewBox="0 0 300 185" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">
      {/* Large gear centered-right */}
      <g transform="translate(178,95)">
        {teeth.map(a => (
          <rect key={a} x="-13" y="-93" width="26" height="34" rx="7" fill={FILL}
            transform={`rotate(${a})`}/>
        ))}
        <circle r="75" fill={FILL}/>
        <circle r="59" fill="none" stroke={DARK} strokeWidth="8"/>
        <circle r="34" fill={BG}/>
        <circle r="22" fill={FILL}/>
        <circle r="12" fill={BG}/>
      </g>
    </svg>
  );
}

function CalcIllustration() {
  const rods   = [178, 210, 242, 274];
  const beadY  = [118, 133, 150, 165];
  const bColors = [
    ['#28788a','#28788a','#28788a','#28788a'],
    ['#7a5535','#7a5535','#7a5535','#7a5535'],
    ['#6a7835','#6a7835','#6a7835','#6a7835'],
    ['#28788a','#28788a','#7a5535','#6a7835'],
  ];
  return (
    <svg viewBox="0 0 300 185" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">
      {/* Coordinate grid */}
      <g opacity="0.90">
        {[118,152,186,220,255].map(x => (
          <line key={x} x1={x} y1="6" x2={x} y2="108" stroke="#3a4258" strokeWidth="1.5"/>
        ))}
        {[22,46,70,94].map(y => (
          <line key={y} x1="102" y1={y} x2="265" y2={y} stroke="#3a4258" strokeWidth="1.5"/>
        ))}
        {/* Y axis + arrow */}
        <line x1="118" y1="3"   x2="118" y2="108" stroke="#4a5268" strokeWidth="2.2"/>
        <polygon points="118,3 112,20 124,20" fill="#4a5268"/>
        {/* X axis + arrow */}
        <line x1="118" y1="94" x2="268" y2="94" stroke="#4a5268" strokeWidth="2.2"/>
        <polygon points="268,94 252,88 252,100" fill="#4a5268"/>
        {/* Growth diagonal */}
        <line x1="123" y1="90" x2="258" y2="20" stroke="#5a6278" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      {/* Abacus frame */}
      <rect x="162" y="100" width="132" height="82" rx="8" fill="none" stroke="#5a3a2a" strokeWidth="4"/>
      <line x1="162" y1="117" x2="294" y2="117" stroke="#5a3a2a" strokeWidth="5"/>
      <line x1="162" y1="178" x2="294" y2="178" stroke="#5a3a2a" strokeWidth="5"/>
      {/* Rods + beads */}
      {rods.map((x, ri) => (
        <g key={x}>
          <line x1={x} y1="100" x2={x} y2="182" stroke="#5a3a2a" strokeWidth="4"/>
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
    desc: 'Edit, merge, split, convert PDFs — all browser-based, files never leave your device',
    href: '/tools',
    color: '#22d3ee',
    colorRgb: '34,211,238',
    count: 5,
    Illustration: PdfIllustration,
  },
  {
    icon: '⚙️',
    title: 'Utilities',
    desc: 'QR code generator, holiday list, and more useful tools',
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

// ─── Trending mini illustrations (same geometric style, vibrant accent colors) ─

function TrendDocSVG({ color }) {
  return (
    <svg viewBox="0 0 100 75" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
      style={{ position:'absolute', right:-6, bottom:-4, width:'62%', height:'112%', pointerEvents:'none' }}>
      {/* Back page (tilted) */}
      <g transform="translate(70,52) rotate(-16)">
        <rect x="-28" y="-38" width="56" height="76" rx="7" fill={color} opacity={0.28}/>
        <polygon points="18,-38 28,-38 28,-26" fill={color} opacity={0.46}/>
      </g>
      {/* Front page */}
      <g transform="translate(57,46) rotate(9)">
        <rect x="-26" y="-36" width="52" height="72" rx="6" fill={color} opacity={0.42}/>
        <polygon points="16,-36 26,-36 26,-24" fill={color} opacity={0.60}/>
        <line x1="-18" y1="-20" x2="14" y2="-20" stroke={color} strokeWidth="4"   strokeLinecap="round" opacity={0.75}/>
        <line x1="-18" y1="-7"  x2="14" y2="-7"  stroke={color} strokeWidth="3.5" strokeLinecap="round" opacity={0.62}/>
        <line x1="-18" y1="6"   x2="6"  y2="6"   stroke={color} strokeWidth="3.5" strokeLinecap="round" opacity={0.52}/>
        <line x1="-18" y1="19"  x2="11" y2="19"  stroke={color} strokeWidth="3.5" strokeLinecap="round" opacity={0.42}/>
      </g>
    </svg>
  );
}

function TrendMergeSVG({ color }) {
  return (
    <svg viewBox="0 0 100 75" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
      style={{ position:'absolute', right:-6, bottom:-4, width:'62%', height:'112%', pointerEvents:'none' }}>
      {/* Left doc */}
      <g transform="translate(44,44) rotate(-20)">
        <rect x="-20" y="-28" width="40" height="56" rx="5" fill={color} opacity={0.35}/>
        <polygon points="12,-28 20,-28 20,-18" fill={color} opacity={0.55}/>
        <line x1="-13" y1="-15" x2="10" y2="-15" stroke={color} strokeWidth="3"   strokeLinecap="round" opacity={0.70}/>
        <line x1="-13" y1="-4"  x2="10" y2="-4"  stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity={0.58}/>
        <line x1="-13" y1="7"   x2="4"  y2="7"   stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity={0.46}/>
      </g>
      {/* Right doc */}
      <g transform="translate(76,38) rotate(16)">
        <rect x="-20" y="-28" width="40" height="56" rx="5" fill={color} opacity={0.35}/>
        <polygon points="12,-28 20,-28 20,-18" fill={color} opacity={0.55}/>
        <line x1="-13" y1="-15" x2="10" y2="-15" stroke={color} strokeWidth="3"   strokeLinecap="round" opacity={0.70}/>
        <line x1="-13" y1="-4"  x2="10" y2="-4"  stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity={0.58}/>
      </g>
      {/* Merge arrow */}
      <line x1="46" y1="25" x2="60" y2="25" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity={0.72}/>
      <polygon points="62,21 70,25 62,29" fill={color} opacity={0.72}/>
    </svg>
  );
}

function TrendSplitSVG({ color }) {
  return (
    <svg viewBox="0 0 100 75" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
      style={{ position:'absolute', right:-6, bottom:-4, width:'62%', height:'112%', pointerEvents:'none' }}>
      <g transform="translate(60,38)">
        {/* Top half */}
        <rect x="-26" y="-36" width="52" height="32" rx="6" fill={color} opacity={0.42}/>
        <polygon points="16,-36 26,-36 26,-24" fill={color} opacity={0.60}/>
        <line x1="-18" y1="-23" x2="13" y2="-23" stroke={color} strokeWidth="3.5" strokeLinecap="round" opacity={0.72}/>
        <line x1="-18" y1="-11" x2="13" y2="-11" stroke={color} strokeWidth="3"   strokeLinecap="round" opacity={0.60}/>
        {/* Dashed cut line */}
        <line x1="-30" y1="0" x2="30" y2="0" stroke={color} strokeWidth="2.5" strokeDasharray="4,3" strokeLinecap="round" opacity={0.88}/>
        {/* Bottom half */}
        <rect x="-26" y="2"  width="52" height="28" rx="6" fill={color} opacity={0.34}/>
        <line x1="-18" y1="12" x2="13" y2="12" stroke={color} strokeWidth="3"   strokeLinecap="round" opacity={0.55}/>
        <line x1="-18" y1="22" x2="4"  y2="22" stroke={color} strokeWidth="3"   strokeLinecap="round" opacity={0.44}/>
      </g>
    </svg>
  );
}

function TrendChartSVG({ color }) {
  return (
    <svg viewBox="0 0 100 75" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
      style={{ position:'absolute', right:-6, bottom:-4, width:'62%', height:'112%', pointerEvents:'none' }}>
      {/* Axes */}
      <line x1="32" y1="10" x2="32" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" opacity={0.55}/>
      <line x1="32" y1="62" x2="93" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" opacity={0.55}/>
      {/* Bars */}
      <rect x="37" y="38" width="10" height="24" rx="3" fill={color} opacity={0.48}/>
      <rect x="51" y="24" width="10" height="38" rx="3" fill={color} opacity={0.58}/>
      <rect x="65" y="44" width="10" height="18" rx="3" fill={color} opacity={0.44}/>
      <rect x="79" y="30" width="10" height="32" rx="3" fill={color} opacity={0.52}/>
      {/* Trend line */}
      <polyline points="42,38 56,24 70,44 84,30"
        fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity={0.85}/>
      <circle cx="84" cy="30" r="4" fill={color} opacity={0.95}/>
    </svg>
  );
}

function TrendCalSVG({ color }) {
  return (
    <svg viewBox="0 0 100 75" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
      style={{ position:'absolute', right:-6, bottom:-4, width:'62%', height:'112%', pointerEvents:'none' }}>
      <g transform="translate(60,38)">
        {/* Body */}
        <rect x="-28" y="-24" width="56" height="48" rx="7" fill={color} opacity={0.38}/>
        {/* Header band */}
        <rect x="-28" y="-24" width="56" height="13" rx="7" fill={color} opacity={0.58}/>
        <rect x="-28" y="-17" width="56" height="6"        fill={color} opacity={0.58}/>
        {/* Peg handles */}
        <rect x="-16" y="-30" width="5" height="9" rx="2.5" fill={color} opacity={0.75}/>
        <rect x="11"  y="-30" width="5" height="9" rx="2.5" fill={color} opacity={0.75}/>
        {/* Day-grid dots */}
        {[-16,-4,8].flatMap((x, xi) =>
          [-6,6,18].map((y, yi) => (
            <circle key={`${xi}${yi}`} cx={x} cy={y} r="2.8" fill={color} opacity={0.45 + yi * 0.08}/>
          ))
        )}
        {/* Highlighted day */}
        <rect x="4" y="12" width="17" height="13" rx="4" fill={color} opacity={0.75}/>
      </g>
    </svg>
  );
}

// ─── Trending items data ──────────────────────────────────────────────────────

const TRENDING = [
  { label:'PDF Editor',   sub:'Edit & Annotate', href:'/tools/pdf-editor',        color:'#f5a623', rgb:'245,166,35',  tier:'primary',   SVG:TrendDocSVG   },
  { label:'PDF Merger',   sub:'Combine Files',   href:'/tools/pdf-merger',        color:'#22d3ee', rgb:'34,211,238',  tier:'secondary', SVG:TrendMergeSVG },
  { label:'PDF Splitter', sub:'Extract Pages',   href:'/tools/pdf-splitter',      color:'#a78bfa', rgb:'167,139,250', tier:'secondary', SVG:TrendSplitSVG },
  { label:'NPS vs APS',   sub:'Compare Plans',   href:'/nps-aps',                 color:'#60a5fa', rgb:'96,165,250',  tier:'tertiary',  SVG:TrendChartSVG },
  { label:'DA Arrear',    sub:'Calculate',       href:'/da-arrear',               color:'#34d399', rgb:'52,211,153',  tier:'tertiary',  SVG:TrendChartSVG },
  { label:'Leave Calc',   sub:'Track Leave',     href:'/leave',                   color:'#fb7185', rgb:'251,113,133', tier:'tertiary',  SVG:TrendCalSVG   },
  { label:'Holiday List', sub:'2026 Holidays',   href:'/tools/holiday-list-2026', color:'#fbbf24', rgb:'251,191,36',  tier:'tertiary',  SVG:TrendCalSVG   },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ToolsSection() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsLight(document.documentElement.getAttribute('data-theme') === 'light');
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const titleGrad = isLight
    ? 'linear-gradient(135deg,#78350f 0%,#b45309 50%,#78350f 100%)'
    : 'linear-gradient(135deg,#c8960c 0%,#f5d060 38%,#fce38a 52%,#f5d060 68%,#c8960c 100%)';

  return (
    <section id="tools" className="relative py-3 md:py-4 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Section header */}
        <div className="mb-4">
          <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/65 mb-1">Tools & Calculators</div>
          <h2
            className="font-malayalam font-bold leading-[1.2] tracking-tight bg-clip-text text-transparent bg-[length:200%_auto]"
            style={{
              fontSize: 'clamp(20px,2.5vw,34px)',
              backgroundImage: titleGrad,
              filter: isLight ? 'none' : 'drop-shadow(0 0 12px rgba(200,150,12,0.35))',
            }}
          >
            ടൂളുകൾ
          </h2>
        </div>

        {/* Trending Now — illustrated mini-cards (same SVG style as cards below) */}
        <style>{`
          .tc {
            position: relative; display: flex; flex-direction: column;
            justify-content: center; border-radius: 14px; overflow: hidden;
            text-decoration: none; flex-shrink: 0; background: #0d1117; cursor: pointer;
            transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          }
          .tc:hover { transform: translateY(-3px); }

          .tc-primary {
            min-width: 152px; height: 80px; padding: 0 15px;
            border: 1.5px solid rgba(245,166,35,0.42);
            box-shadow: 0 0 22px rgba(245,166,35,0.20), 0 4px 16px rgba(0,0,0,0.40);
            animation: tcPulse 3.8s ease-in-out infinite;
          }
          .tc-primary:hover {
            border-color: rgba(245,166,35,0.70);
            box-shadow: 0 0 36px rgba(245,166,35,0.34), 0 8px 28px rgba(0,0,0,0.46);
            transform: translateY(-3px) scale(1.02);
            animation: none;
          }
          .tc-secondary {
            min-width: 130px; height: 70px; padding: 0 13px;
            border: 1px solid rgba(255,255,255,0.09);
          }
          .tc-tertiary {
            min-width: 116px; height: 62px; padding: 0 12px;
            border: 1px solid rgba(255,255,255,0.06);
            opacity: 0.80;
          }
          .tc-tertiary:hover { opacity: 1; }

          @keyframes tcPulse {
            0%,100% { box-shadow: 0 0 22px rgba(245,166,35,0.20), 0 4px 16px rgba(0,0,0,0.40); }
            50%      { box-shadow: 0 0 36px rgba(245,166,35,0.34), 0 4px 16px rgba(0,0,0,0.40); }
          }
          @keyframes trendFadeUp {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .trend-container { animation: trendFadeUp 0.38s ease-out 0.08s both; }
          @media (prefers-reduced-motion: reduce) {
            .trend-container { animation: none !important; opacity: 1 !important; }
            .tc-primary      { animation: none !important; }
          }
        `}</style>

        <div className="trend-container" style={{ marginBottom: 20 }}>

          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:13 }}>
            <span style={{ fontSize:15, lineHeight:1 }}>🔥</span>
            <span style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,0.92)', letterSpacing:'0.01em' }}>
              Trending Now
            </span>
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize:11, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.52)' }}>
              7 tools
            </span>
          </div>

          {/* Mini-card strip — scrollable, right-fade hints at more content */}
          <div style={{ position:'relative' }}>
          <div style={{
            display:'flex', alignItems:'stretch', gap:8,
            overflowX:'auto', paddingBottom:4,
            scrollbarWidth:'none', msOverflowStyle:'none',
            WebkitOverflowScrolling:'touch',
          }}>
            {TRENDING.map(({ label, sub, href, color, rgb, tier, SVG }, i) => (
              <Link
                key={href}
                href={href}
                className={`tc tc-${tier}`}
                style={{ marginLeft: (i === 1 || i === 3) ? 6 : 0 }}
                onMouseEnter={tier !== 'primary' ? e => {
                  e.currentTarget.style.borderColor = `rgba(${rgb},0.38)`;
                  e.currentTarget.style.boxShadow   = `0 6px 22px rgba(${rgb},0.16), 0 3px 12px rgba(0,0,0,0.36)`;
                  if (tier === 'tertiary') e.currentTarget.style.opacity = '1';
                } : undefined}
                onMouseLeave={tier !== 'primary' ? e => {
                  e.currentTarget.style.borderColor = tier === 'secondary' ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.boxShadow   = 'none';
                  if (tier === 'tertiary') e.currentTarget.style.opacity = '0.80';
                } : undefined}
              >
                {/* SVG illustration — source order: renders first (behind) */}
                <SVG color={color} />

                {/* Gradient — solid dark over full text area, fades right to reveal SVG */}
                <div style={{
                  position:'absolute', inset:0, pointerEvents:'none',
                  background:`linear-gradient(to right,
                    #0d1117 0%,
                    #0d1117 38%,
                    rgba(13,17,23,0.92) 52%,
                    rgba(13,17,23,0.45) 68%,
                    transparent 100%)`,
                }} />

                {/* Label — always on top */}
                <div style={{ position:'relative', zIndex:2 }}>
                  <div style={{
                    fontSize:   tier === 'primary' ? 13 : tier === 'secondary' ? 12.5 : 12,
                    fontWeight: tier === 'primary' ? 800 : tier === 'secondary' ? 700  : 600,
                    color:      tier === 'primary' ? color : '#fff',
                    lineHeight: 1.3, whiteSpace:'nowrap',
                    textShadow: '0 1px 6px rgba(0,0,0,0.90)',
                  }}>{label}</div>
                  <div style={{
                    fontSize:  tier === 'primary' ? 11 : 10.5,
                    color:     tier === 'primary' ? `rgba(${rgb},0.88)` : 'rgba(255,255,255,0.70)',
                    marginTop: 3, whiteSpace:'nowrap',
                    textShadow: '0 1px 4px rgba(0,0,0,0.80)',
                  }}>{sub}</div>
                </div>
              </Link>
            ))}
          </div>
          {/* Right-edge fade — signals horizontal scroll on mobile */}
          <div className="md:hidden" style={{
            position:'absolute', top:0, right:0, bottom:4,
            width:40, pointerEvents:'none',
            background:'linear-gradient(to right, transparent, rgba(6,10,18,0.85))',
          }} />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CATEGORIES.map(({ icon, title, desc, href, color, colorRgb, count, Illustration }) => (
            /* Gradient-border wrapper */
            <div key={title} style={{
              background: 'linear-gradient(135deg,rgba(110,60,200,0.38),rgba(45,105,220,0.38))',
              padding: '1.5px',
              borderRadius: 22,
            }}>
              <Link href={href}
                className="group relative flex flex-col gap-2 p-5 rounded-[20px] no-underline overflow-hidden transition-all duration-300 hover:brightness-110"
                style={{ background: BG, minHeight: 185 }}>

                {/* SVG illustration — behind everything */}
                <Illustration />

                {/* Left-to-right fade so content stays readable */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(to right, rgba(13,17,23,0.96) 18%, rgba(13,17,23,0.7) 42%, rgba(13,17,23,0.15) 72%, transparent 100%)`,
                }}/>

                {/* Content */}
                <div className="relative flex flex-col h-full gap-2" style={{ zIndex: 10 }}>

                  {/* Icon + badge row */}
                  <div className="flex items-start justify-between">
                    <div style={{
                      width: 40, height: 40, borderRadius: 12, fontSize: 20,
                      background: `rgba(${colorRgb},0.18)`,
                      border: `1px solid rgba(${colorRgb},0.35)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {icon}
                    </div>
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '5px 12px', borderRadius: 20,
                      background: `rgba(${colorRgb},0.13)`,
                      border: `1.5px solid rgba(${colorRgb},0.4)`,
                      color, fontSize: 11, fontWeight: 800, letterSpacing: '0.06em',
                      whiteSpace: 'nowrap',
                    }}>
                      {icon} {count} TOOLS
                    </span>
                  </div>

                  {/* Title + desc */}
                  <div style={{ marginTop: 10 }}>
                    <h3 style={{ color: 'rgba(255,255,255,0.95)', fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
                      {title}
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 12, lineHeight: 1.65 }}>
                      {desc}
                    </p>
                  </div>

                  {/* Explore CTA */}
                  <div className="flex items-center gap-1 mt-auto"
                    style={{ color, fontSize: 12, fontWeight: 700 }}>
                    Explore
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                      className="group-hover:translate-x-0.5 transition-transform">
                      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
