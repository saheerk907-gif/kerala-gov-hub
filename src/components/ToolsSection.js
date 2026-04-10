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
      <g opacity="0.65">
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
          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-1">Tools & Calculators</div>
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

        {/* Trending Now — 3-tier hierarchy */}
        <style>{`
          /* ── Primary: richer gold, inner glow, scale up ── */
          .tb-primary {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 11px 22px; border-radius: 100px;
            border: 1px solid rgba(200,150,12,0.58);
            background: rgba(200,150,12,0.20);
            color: rgba(245,208,96,0.97);
            font-size: 13px; font-weight: 800;
            text-decoration: none; white-space: nowrap; flex-shrink: 0;
            transform: scale(1.02);
            transform-origin: left center;
            box-shadow:
              inset 0 1px 0 rgba(245,208,96,0.20),
              inset 0 0 14px rgba(200,150,12,0.12),
              0 0 22px rgba(200,150,12,0.22),
              0 2px 12px rgba(0,0,0,0.28);
            transition: background 0.22s, border-color 0.22s, transform 0.22s, box-shadow 0.22s;
            animation: tbPulse 3.6s ease-in-out infinite;
          }
          .tb-primary:hover {
            background: rgba(200,150,12,0.30);
            border-color: rgba(200,150,12,0.78);
            transform: scale(1.04) translateY(-2px);
            box-shadow:
              inset 0 1px 0 rgba(245,208,96,0.28),
              inset 0 0 20px rgba(200,150,12,0.18),
              0 0 36px rgba(200,150,12,0.36),
              0 4px 18px rgba(0,0,0,0.32);
            animation: none;
          }

          /* ── Secondary: solid, readable ─────────────────── */
          .tb-secondary {
            display: inline-flex; align-items: center; gap: 7px;
            padding: 9px 17px; border-radius: 100px;
            border: 1px solid rgba(255,255,255,0.14);
            background: rgba(255,255,255,0.08);
            color: rgba(255,255,255,0.84);
            font-size: 12.5px; font-weight: 700;
            text-decoration: none; white-space: nowrap; flex-shrink: 0;
            transition: background 0.22s, border-color 0.22s, color 0.22s, transform 0.22s, box-shadow 0.22s;
          }
          .tb-secondary:hover {
            background: rgba(200,150,12,0.13);
            border-color: rgba(200,150,12,0.42);
            color: rgba(245,208,96,0.90);
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(200,150,12,0.12);
          }

          /* ── Tertiary: muted, recedes ────────────────────── */
          .tb-tertiary {
            display: inline-flex; align-items: center; gap: 6px;
            padding: 8px 14px; border-radius: 100px;
            border: 1px solid rgba(255,255,255,0.07);
            background: transparent;
            color: rgba(255,255,255,0.38);
            font-size: 11.5px; font-weight: 600;
            text-decoration: none; white-space: nowrap; flex-shrink: 0;
            transition: background 0.22s, border-color 0.22s, color 0.22s, transform 0.22s, box-shadow 0.22s;
          }
          .tb-tertiary:hover {
            background: rgba(200,150,12,0.10);
            border-color: rgba(200,150,12,0.30);
            color: rgba(245,208,96,0.78);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(200,150,12,0.09);
          }

          /* ── Pulse: inner + outer glow breathes together ── */
          @keyframes tbPulse {
            0%, 100% {
              box-shadow:
                inset 0 1px 0 rgba(245,208,96,0.20),
                inset 0 0 14px rgba(200,150,12,0.12),
                0 0 22px rgba(200,150,12,0.22),
                0 2px 12px rgba(0,0,0,0.28);
            }
            50% {
              box-shadow:
                inset 0 1px 0 rgba(245,208,96,0.26),
                inset 0 0 20px rgba(200,150,12,0.18),
                0 0 34px rgba(200,150,12,0.34),
                0 2px 12px rgba(0,0,0,0.28);
            }
          }

          /* ── Entry ───────────────────────────────────────── */
          @keyframes trendFadeUp {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .trend-container {
            animation: trendFadeUp 0.38s ease-out 0.08s both;
          }
          @media (prefers-reduced-motion: reduce) {
            .trend-container { animation: none !important; opacity: 1 !important; }
            .tb-primary      { animation: none !important; transform: scale(1.02); }
          }
        `}</style>

        {/* Container — stronger featured-strip presence */}
        <div className="trend-container" style={{
          background: 'rgba(255,255,255,0.038)',
          border: '1px solid rgba(200,150,12,0.30)',
          borderRadius: 16,
          padding: '15px 18px',
          marginBottom: 20,
          boxShadow: '0 0 0 1px rgba(200,150,12,0.10), 0 8px 32px rgba(0,0,0,0.28)',
        }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 13 }}>
            <span style={{ fontSize: 15, lineHeight: 1 }}>🔥</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.92)', letterSpacing: '0.01em' }}>
              Trending Now
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>
              7 tools
            </span>
          </div>

          {/* Pills — spacing gap replaces dividers */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            overflowX: 'auto', paddingBottom: 2,
            scrollbarWidth: 'none', msOverflowStyle: 'none',
          }}>
            {/* Primary */}
            <Link href="/tools/pdf-editor" className="tb-primary">
              <span style={{ fontSize: 14, lineHeight: 1 }}>📝</span>
              PDF Editor
            </Link>

            {/* Secondary — extra left margin creates breathing room without a line */}
            <Link href="/tools/pdf-merger"   className="tb-secondary" style={{ marginLeft: 8 }}>
              <span style={{ fontSize: 13, lineHeight: 1 }}>🗂️</span>PDF Merger
            </Link>
            <Link href="/tools/pdf-splitter" className="tb-secondary">
              <span style={{ fontSize: 13, lineHeight: 1 }}>✂️</span>PDF Splitter
            </Link>

            {/* Tertiary — extra margin fades them into the background visually */}
            <Link href="/nps-aps"                 className="tb-tertiary" style={{ marginLeft: 8 }}>📊 NPS vs APS</Link>
            <Link href="/da-arrear"               className="tb-tertiary">💸 DA Arrear</Link>
            <Link href="/leave"                   className="tb-tertiary">📅 Leave Calc</Link>
            <Link href="/tools/holiday-list-2026" className="tb-tertiary">🗓️ Holiday List</Link>
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
                      color, fontSize: 10, fontWeight: 900, letterSpacing: '0.1em',
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
                    <p style={{ color: 'rgba(255,255,255,0.52)', fontSize: 11, lineHeight: 1.65 }}>
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
