'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const STATS = [
  { value: '1,200+', label: 'Govt Orders' },
  { value: '15+',    label: 'Calculators' },
  { value: '100%',   label: 'Free Always' },
];

const QUICK_LINKS = [
  { label: 'Pension',      href: '/pension' },
  { label: 'Pay Revision', href: '/prc' },
  { label: 'Leave',        href: '/leave' },
  { label: 'Forms',        href: '/forms' },
  { label: 'Govt Orders',  href: '/orders' },
  { label: 'Income Tax',   href: '/income-tax' },
];

// ─── SVG helpers ─────────────────────────────────────────────────────────────
function starPath(cx, cy, R, r, n = 8) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const radius = i % 2 === 0 ? R : r;
    const angle  = (i * Math.PI) / n - Math.PI / 2;
    pts.push(`${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`);
  }
  return 'M' + pts.join('L') + 'Z';
}

function pt(cx, cy, deg, r) {
  const rad = (deg * Math.PI) / 180;
  return [+(cx + r * Math.cos(rad)).toFixed(1), +(cy + r * Math.sin(rad)).toFixed(1)];
}

// ─── Hero SVG Illustration ───────────────────────────────────────────────────
function HeroIllustration() {
  // Hub: centered right, partially bleeds off screen for depth
  const HX = 800, HY = 258;
  const SPOKE_R = 148;

  // 5 visible nodes on left arc (270° → 90°, going counter-clockwise through left)
  const nodes = [
    { a: 270, c: '#f5d060', icon: 'doc'    },   // top
    { a: 225, c: '#f5d060', icon: 'calc'   },   // top-left
    { a: 180, c: '#2997ff', icon: 'rupee'  },   // left
    { a: 135, c: '#2997ff', icon: 'cal'    },   // bottom-left
    { a:  90, c: '#f5d060', icon: 'shield' },   // bottom
  ];

  return (
    <svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice" aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>

      {/* ── 1. Dot grid ─────────────────────────────────────────────────── */}
      {Array.from({ length: 9 }).flatMap((_, row) =>
        Array.from({ length: 15 }).map((_, col) => (
          <circle key={`dg${row}-${col}`}
            cx={col * 64 + 8} cy={row * 60 + 10} r="1.4"
            fill="rgba(255,255,255,0.05)" />
        ))
      )}

      {/* ── 2. Wide orbit halos ─────────────────────────────────────────── */}
      <circle cx={HX} cy={HY} r="215" fill="none"
        stroke="rgba(200,150,12,0.07)" strokeWidth="1" strokeDasharray="3,10"/>
      <circle cx={HX} cy={HY} r="282" fill="none"
        stroke="rgba(41,151,255,0.04)" strokeWidth="1"/>

      {/* ── 3. Hub rings ────────────────────────────────────────────────── */}
      {/* Soft glow fill */}
      <circle cx={HX} cy={HY} r="164" fill="rgba(200,150,12,0.025)"/>

      {/* Outer dashed ring */}
      <circle cx={HX} cy={HY} r="164" fill="none"
        stroke="rgba(200,150,12,0.22)" strokeWidth="1.5" strokeDasharray="5,7"/>

      {/* Tick marks on outer ring */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        const isMajor  = i % 6 === 0;
        const isMedium = i % 3 === 0;
        const len = isMajor ? 10 : isMedium ? 6 : 3.5;
        const x1 = HX + 164 * Math.cos(angle);
        const y1 = HY + 164 * Math.sin(angle);
        const x2 = HX + (164 + len) * Math.cos(angle);
        const y2 = HY + (164 + len) * Math.sin(angle);
        return (
          <line key={`tk${i}`}
            x1={x1.toFixed(1)} y1={y1.toFixed(1)}
            x2={x2.toFixed(1)} y2={y2.toFixed(1)}
            stroke="rgba(200,150,12,0.22)"
            strokeWidth={isMajor ? 2 : 1}/>
        );
      })}

      {/* Mid + inner rings */}
      <circle cx={HX} cy={HY} r="140" fill="none"
        stroke="rgba(200,150,12,0.10)" strokeWidth="1"/>
      <circle cx={HX} cy={HY} r="112" fill="none"
        stroke="rgba(200,150,12,0.07)" strokeWidth="0.75"/>

      {/* Inner glow disc */}
      <circle cx={HX} cy={HY} r="52" fill="rgba(200,150,12,0.06)"
        stroke="rgba(200,150,12,0.18)" strokeWidth="1.5"/>

      {/* ── 4. Spokes (all 8) ───────────────────────────────────────────── */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
        const [x2, y2] = pt(HX, HY, a, 165);
        return <line key={`sp${a}`} x1={HX} y1={HY} x2={x2} y2={y2}
          stroke="rgba(200,150,12,0.09)" strokeWidth="1"/>;
      })}

      {/* ── 5. Hub centre ornament ──────────────────────────────────────── */}
      <path d={starPath(HX, HY, 40, 17, 8)} fill="rgba(200,150,12,0.22)"/>
      <path d={starPath(HX, HY, 28, 12, 8)} fill="rgba(200,150,12,0.38)"/>
      <circle cx={HX} cy={HY} r="11" fill="rgba(200,150,12,0.65)"/>
      <circle cx={HX} cy={HY} r="5"  fill="#f5d060"/>

      {/* ── 6. Node connections + circles + icons ───────────────────────── */}
      {nodes.map(({ a, c }) => {
        const [x2, y2] = pt(HX, HY, a, SPOKE_R);
        return <line key={`nc${a}`} x1={HX} y1={HY} x2={x2} y2={y2}
          stroke={`${c}26`} strokeWidth="1.5"/>;
      })}

      {nodes.map(({ a, c, icon }) => {
        const [cx, cy] = pt(HX, HY, a, SPOKE_R);
        return (
          <g key={`node${a}`} opacity="0.78">
            {/* outer glow ring */}
            <circle cx={cx} cy={cy} r="24" fill={`${c}07`}/>
            {/* body */}
            <circle cx={cx} cy={cy} r="17" fill="#141c2e"/>
            <circle cx={cx} cy={cy} r="17" fill="none" stroke={c} strokeWidth="1.5" opacity="0.55"/>

            {/* ── Document icon ── */}
            {icon === 'doc' && (
              <g stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.85">
                <rect x={cx-6} y={cy-7.5} width="12" height="15" rx="1.5"/>
                <polyline points={`${cx-1},${cy-7.5} ${cx-1},${cy-4.5} ${cx+6},${cy-4.5}`} strokeWidth="1"/>
                <line x1={cx-4} y1={cy-2} x2={cx+4} y2={cy-2} strokeWidth="1.2"/>
                <line x1={cx-4} y1={cy+1} x2={cx+4} y2={cy+1} strokeWidth="1.2"/>
                <line x1={cx-4} y1={cy+4} x2={cx+1} y2={cy+4} strokeWidth="1.2"/>
              </g>
            )}

            {/* ── Calculator icon ── */}
            {icon === 'calc' && (
              <g stroke={c} opacity="0.85">
                <rect x={cx-6.5} y={cy-7.5} width="13" height="15" rx="2" fill="none" strokeWidth="1.5"/>
                <rect x={cx-4.5} y={cy-6} width="9" height="4" rx="1" fill={c} opacity="0.30"/>
                {[[-3, 0.5],[1, 0.5],[-3, 4],[1, 4]].map(([dx, dy], i) => (
                  <circle key={i} cx={cx+dx} cy={cy+dy} r="1.3" fill={c} stroke="none"/>
                ))}
              </g>
            )}

            {/* ── Rupee icon ── */}
            {icon === 'rupee' && (
              <text x={cx} y={cy + 5.5} textAnchor="middle"
                fontSize="14" fontWeight="700" fontFamily="sans-serif"
                fill={c} opacity="0.88">₹</text>
            )}

            {/* ── Calendar icon ── */}
            {icon === 'cal' && (
              <g stroke={c} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.85">
                <rect x={cx-6.5} y={cy-5.5} width="13" height="13" rx="2"/>
                <line x1={cx-6.5} y1={cy-1.5} x2={cx+6.5} y2={cy-1.5}/>
                <line x1={cx-2.5} y1={cy-8} x2={cx-2.5} y2={cy-4} strokeWidth="2"/>
                <line x1={cx+2.5} y1={cy-8} x2={cx+2.5} y2={cy-4} strokeWidth="2"/>
                <circle cx={cx-2} cy={cy+3} r="1.3" fill={c} stroke="none"/>
                <circle cx={cx+2} cy={cy+3} r="1.3" fill={c} stroke="none"/>
              </g>
            )}

            {/* ── Shield icon (Pension) ── */}
            {icon === 'shield' && (
              <g stroke={c} strokeWidth="1.5" fill="none" opacity="0.85">
                <path d={`M${cx},${cy-8} L${cx+7},${cy-4} L${cx+7},${cy+1.5} Q${cx+7},${cy+9} ${cx},${cy+10} Q${cx-7},${cy+9} ${cx-7},${cy+1.5} L${cx-7},${cy-4} Z`}/>
                <line x1={cx} y1={cy-3} x2={cx} y2={cy+4} strokeLinecap="round"/>
                <line x1={cx-2.5} y1={cy} x2={cx+2.5} y2={cy} strokeLinecap="round"/>
              </g>
            )}
          </g>
        );
      })}

      {/* ── 7. Government Order document card (left) ────────────────────── */}

      {/* Card behind — rotated */}
      <g transform="translate(44,188) rotate(-10,77,100)" opacity="0.09">
        <rect x="0" y="0" width="154" height="202" rx="9" fill="#1a2236"/>
        <rect x="0" y="0" width="154" height="202" rx="9" fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <rect x="0" y="0" width="154" height="30" rx="9" fill="#1e2c48"/>
        <rect x="0" y="22" width="154" height="8" fill="#1e2c48"/>
        <rect x="10" y="9" width="82" height="7" rx="3" fill="rgba(200,150,12,0.4)"/>
        {[40,54,68,82,96].map(y => (
          <rect key={y} x="10" y={y} width={y===82?96:y===96?76:126} height="5" rx="2"
            fill="#263252"/>
        ))}
      </g>

      {/* Main card — Govt Order */}
      <g transform="translate(62,170)" opacity="0.15">
        {/* Drop shadow */}
        <rect x="4" y="5" width="158" height="215" rx="11" fill="rgba(0,0,0,0.55)"/>
        {/* Card body */}
        <rect x="0" y="0" width="158" height="215" rx="11" fill="#141d30"/>
        <rect x="0" y="0" width="158" height="215" rx="11" fill="none"
          stroke="rgba(255,255,255,0.09)" strokeWidth="1"/>

        {/* Gold header band */}
        <rect x="0" y="0" width="158" height="34" rx="11" fill="rgba(200,150,12,0.20)"/>
        <rect x="0" y="24" width="158" height="10" fill="rgba(200,150,12,0.20)"/>
        <rect x="0" y="34" width="158" height="1" fill="rgba(200,150,12,0.35)"/>

        {/* Header text */}
        <rect x="10" y="9"  width="95" height="7" rx="3" fill="rgba(245,208,96,0.60)"/>
        <rect x="10" y="21" width="60" height="4.5" rx="2" fill="rgba(245,208,96,0.28)"/>

        {/* GO No. / Date row */}
        <rect x="10" y="44" width="64" height="5" rx="2" fill="rgba(255,255,255,0.20)"/>
        <rect x="104" y="44" width="44" height="5" rx="2" fill="rgba(255,255,255,0.13)"/>

        {/* Thin rule */}
        <rect x="10" y="57" width="138" height="0.75" fill="rgba(255,255,255,0.08)"/>

        {/* Subject line (blue accent) */}
        <rect x="10" y="65"  width="118" height="6" rx="2" fill="rgba(41,151,255,0.38)"/>
        <rect x="10" y="76"  width="90"  height="5" rx="2" fill="rgba(41,151,255,0.22)"/>

        {/* Body text lines */}
        {[90,102,114,126,138].map((y, i) => (
          <rect key={y} x="10" y={y} width={[138,128,138,110,130][i]} height="5" rx="2"
            fill="rgba(255,255,255,0.09)"/>
        ))}

        {/* Mini table */}
        <rect x="10"  y="152" width="138" height="0.75" fill="rgba(255,255,255,0.08)"/>
        <rect x="10"  y="152" width="138" height="28"   rx="2" fill="rgba(255,255,255,0.03)"/>
        {/* table header */}
        <rect x="12"  y="155" width="28" height="4" rx="1" fill="rgba(200,150,12,0.28)"/>
        <rect x="60"  y="155" width="44" height="4" rx="1" fill="rgba(200,150,12,0.28)"/>
        <rect x="118" y="155" width="26" height="4" rx="1" fill="rgba(200,150,12,0.28)"/>
        {/* table row */}
        <rect x="12"  y="165" width="24" height="3.5" rx="1" fill="rgba(255,255,255,0.08)"/>
        <rect x="60"  y="165" width="40" height="3.5" rx="1" fill="rgba(255,255,255,0.08)"/>
        <rect x="118" y="165" width="22" height="3.5" rx="1" fill="rgba(255,255,255,0.08)"/>
        {/* table row 2 */}
        <rect x="12"  y="172" width="24" height="3.5" rx="1" fill="rgba(255,255,255,0.06)"/>
        <rect x="60"  y="172" width="40" height="3.5" rx="1" fill="rgba(255,255,255,0.06)"/>
        <rect x="118" y="172" width="22" height="3.5" rx="1" fill="rgba(255,255,255,0.06)"/>

        {/* Signature */}
        <rect x="10"  y="190" width="56" height="4" rx="2" fill="rgba(255,255,255,0.07)"/>
        <rect x="10"  y="198" width="40" height="3.5" rx="2" fill="rgba(255,255,255,0.05)"/>

        {/* Official seal */}
        <circle cx="138" cy="196" r="14" fill="none"
          stroke="rgba(200,150,12,0.28)" strokeWidth="1.5"/>
        <circle cx="138" cy="196" r="9" fill="none"
          stroke="rgba(200,150,12,0.16)" strokeWidth="1"/>
        <path d={starPath(138, 196, 5, 2, 8)} fill="rgba(200,150,12,0.35)"/>
      </g>

      {/* ── 8. Geometric 8-point star accent (top-left) ─────────────────── */}
      <g transform="translate(112,90)" opacity="0.10">
        <path d={starPath(0, 0, 50, 20, 8)} fill="#c8960c"/>
        <circle cx="0" cy="0" r="15" fill="#c8960c" opacity="0.55"/>
        <circle cx="0" cy="0" r="6"  fill="#f5d060" opacity="0.75"/>
      </g>

      {/* ── 9. Dotted connector: node-left to doc card ──────────────────── */}
      {(() => {
        const [nx, ny] = pt(HX, HY, 180, SPOKE_R);
        return (
          <line x1={nx} y1={ny} x2="222" y2="265"
            stroke="rgba(200,150,12,0.09)" strokeWidth="1" strokeDasharray="3,6"/>
        );
      })()}

      {/* ── 10. Scattered accent dots ────────────────────────────────────── */}
      <circle cx="218" cy="454" r="5"   fill="#c8960c" opacity="0.14"/>
      <circle cx="350" cy="58"  r="3"   fill="#2997ff" opacity="0.16"/>
      <circle cx="530" cy="475" r="4"   fill="#c8960c" opacity="0.10"/>
      <circle cx="136" cy="422" r="2.5" fill="#2997ff" opacity="0.12"/>
      <circle cx="560" cy="28"  r="2"   fill="#c8960c" opacity="0.14"/>
      <circle cx="680" cy="490" r="3"   fill="#2997ff" opacity="0.10"/>
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Hero() {
  function openSearch() {
    window.dispatchEvent(new CustomEvent('open-search'));
  }

  return (
    <section className="relative flex flex-col items-center justify-center text-center overflow-hidden bg-aurora
                        min-h-[60vh] md:min-h-[68vh]
                        px-4 md:px-8
                        pt-[72px] md:pt-[88px]
                        pb-10 md:pb-14">

      {/* SVG background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <HeroIllustration />
      </div>

      {/* Gold ambient glow */}
      <div className="absolute pointer-events-none z-0"
        style={{
          top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: 640, height: 320, borderRadius: '50%',
          background: 'radial-gradient(ellipse,rgba(200,150,12,0.14) 0%,transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      {/* Blue ambient glow (right) */}
      <div className="absolute pointer-events-none z-0"
        style={{
          bottom: '8%', right: '8%',
          width: 300, height: 200, borderRadius: '50%',
          background: 'radial-gradient(ellipse,rgba(41,151,255,0.08) 0%,transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">

        {/* Logo with golden gradient ring */}
        <div className="relative mb-4 md:mb-5">
          <div className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse,rgba(200,150,12,0.28) 0%,transparent 70%)',
              filter: 'blur(18px)', transform: 'scale(1.5) translateY(6px)',
            }}
          />
          <div className="relative rounded-full p-[2.5px]"
            style={{ background: 'linear-gradient(135deg,rgba(200,150,12,0.65),rgba(245,208,96,0.30),rgba(200,150,12,0.65))' }}>
            <Image
              src="/logo.webp"
              alt="Kerala Employees Portal"
              width={88} height={88} priority
              className="relative z-10 rounded-full object-cover w-[60px] h-[60px] md:w-[76px] md:h-[76px] lg:w-[88px] lg:h-[88px]"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
            />
          </div>
        </div>

        {/* Eyebrow badge */}
        <div className="mb-3 px-3.5 py-1.5 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-[0.22em]"
          style={{
            background: 'rgba(200,150,12,0.10)',
            border: '1px solid rgba(200,150,12,0.22)',
            color: 'rgba(245,208,96,0.70)',
          }}>
          Kerala Government Employees Portal
        </div>

        {/* Headings */}
        <h1 className="font-malayalam font-bold leading-[1.2] tracking-tight bg-clip-text text-transparent mb-1"
          style={{
            fontSize: 'clamp(32px,6vw,72px)',
            backgroundImage: 'linear-gradient(135deg,#c8960c 0%,#f5d060 38%,#fce38a 52%,#f5d060 68%,#c8960c 100%)',
            filter: 'drop-shadow(0 0 16px rgba(200,150,12,0.30))',
          }}>
          കേരള സർക്കാർ
        </h1>
        <h2 className="font-malayalam font-bold leading-[1.25] tracking-tight bg-clip-text text-transparent mb-5 md:mb-7"
          style={{
            fontSize: 'clamp(18px,3.2vw,42px)',
            backgroundImage: 'linear-gradient(135deg,#b8860b,#f5d060,#fce38a,#f5d060,#b8860b)',
            filter: 'drop-shadow(0 0 8px rgba(200,150,12,0.22))',
          }}>
          ജീവനക്കാരുടെ വിജ്ഞാനകോശം
        </h2>

        {/* Search bar */}
        <button
          onClick={openSearch}
          className="group flex items-center gap-3 w-full max-w-[480px] rounded-2xl px-4 py-3 md:py-3.5 mb-6 md:mb-7 transition-all duration-300 cursor-text hover:scale-[1.01]"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1.5px solid rgba(245,208,96,0.22)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 24px rgba(200,150,12,0.10)',
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#f5d060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span className="flex-1 text-left text-[13px] md:text-[14px]"
            style={{ color: 'rgba(255,255,255,0.38)' }}>
            Search tools, orders, schemes...
          </span>
          <kbd className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg"
            style={{ background: 'rgba(245,208,96,0.10)', color: '#f5d060', border: '1px solid rgba(245,208,96,0.22)' }}>
            Ctrl K
          </kbd>
        </button>

        {/* Stats bar */}
        <div className="glass-card flex items-stretch rounded-2xl overflow-hidden mb-5"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          {STATS.map((s, i) => (
            <div key={i}
              className="flex flex-col items-center justify-center px-5 py-3 md:px-7 md:py-3.5"
              style={{ borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <span className="font-black tracking-tight leading-none"
                style={{ fontSize: 'clamp(14px,1.8vw,20px)', color: '#f5d060', textShadow: '0 0 12px rgba(200,150,12,0.40)' }}>
                {s.value}
              </span>
              <span className="text-[8px] md:text-[10px] font-semibold uppercase tracking-wider mt-0.5"
                style={{ color: 'rgba(255,255,255,0.45)' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Quick-access links */}
        <div className="flex flex-wrap justify-center gap-2">
          {QUICK_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              className="px-3.5 py-1.5 rounded-full text-[11px] font-semibold no-underline transition-all duration-200 hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.58)',
                border: '1px solid rgba(255,255,255,0.09)',
              }}>
              {link.label}
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
