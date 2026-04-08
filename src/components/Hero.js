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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function starPath(cx, cy, R, r, n = 8) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const radius = i % 2 === 0 ? R : r;
    const angle  = (i * Math.PI) / n - Math.PI / 2;
    pts.push(`${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`);
  }
  return 'M' + pts.join('L') + 'Z';
}

function polar(cx, cy, deg, r) {
  const rad = (deg * Math.PI) / 180;
  return [+(cx + r * Math.cos(rad)).toFixed(2), +(cy + r * Math.sin(rad)).toFixed(2)];
}

// Quadratic bezier with perpendicular curve offset
function curvedPath(x1, y1, x2, y2, bend = 28) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const cx = (mx - (dy / len) * bend).toFixed(2);
  const cy = (my + (dx / len) * bend).toFixed(2);
  return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
}

// ─── Illustration ─────────────────────────────────────────────────────────────
function HeroIllustration() {
  const HX = 804, HY = 262;
  const SPOKE_R = 152;

  const nodes = [
    { a: 270, c: '#f5d060', g: 'gold', icon: 'doc'    },
    { a: 225, c: '#f5d060', g: 'gold', icon: 'calc'   },
    { a: 180, c: '#60a5fa', g: 'blue', icon: 'rupee'  },
    { a: 135, c: '#60a5fa', g: 'blue', icon: 'cal'    },
    { a:  90, c: '#f5d060', g: 'gold', icon: 'shield' },
  ];

  return (
    <svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice" aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>

      {/* ══ DEFS ═══════════════════════════════════════════════════════════ */}
      <defs>
        {/* Hub radial glow */}
        <radialGradient id="hg" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#c8960c" stopOpacity="0.20"/>
          <stop offset="100%" stopColor="#c8960c" stopOpacity="0"/>
        </radialGradient>

        {/* Gold card gradient */}
        <linearGradient id="cardGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1e2c48"/>
          <stop offset="100%" stopColor="#0f1624"/>
        </linearGradient>

        {/* Node body gradient */}
        <radialGradient id="nodeBody" cx="40%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#1f2e4a"/>
          <stop offset="100%" stopColor="#0d1520"/>
        </radialGradient>

        {/* Gold connection gradient */}
        <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#c8960c" stopOpacity="0"/>
          <stop offset="50%"  stopColor="#c8960c" stopOpacity="0.30"/>
          <stop offset="100%" stopColor="#c8960c" stopOpacity="0"/>
        </linearGradient>

        {/* Blue connection gradient */}
        <linearGradient id="cb" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#2997ff" stopOpacity="0"/>
          <stop offset="50%"  stopColor="#2997ff" stopOpacity="0.28"/>
          <stop offset="100%" stopColor="#2997ff" stopOpacity="0"/>
        </linearGradient>

        {/* Centre glow filter */}
        <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        {/* Node soft glow */}
        <filter id="nglow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ══ 1. DOT GRID ═════════════════════════════════════════════════════ */}
      {Array.from({ length: 9 }).flatMap((_, row) =>
        Array.from({ length: 15 }).map((_, col) => (
          <circle key={`g${row}-${col}`}
            cx={col * 64 + 8} cy={row * 60 + 10} r="1.3"
            fill="rgba(255,255,255,0.048)"/>
        ))
      )}

      {/* ══ 2. KERALA COASTLINE SILHOUETTE (subtle) ═════════════════════════ */}
      <g transform="translate(26,88)" opacity="0.045">
        <path
          d="M38,0 C42,18 46,42 46,72 C46,102 44,132 42,162
             C40,190 38,218 35,244 C32,268 28,290 23,312
             C18,332 12,350 6,364 C2,374 0,382 2,388
             C6,394 14,396 22,390 C32,380 42,362 50,340
             C58,316 62,290 64,262 C66,234 65,206 63,178
             C61,150 58,122 56,94 C54,66 52,38 48,14 Z"
          fill="none" stroke="#c8960c" strokeWidth="1.5" strokeLinejoin="round"/>
        {/* Western coast highlight strip */}
        <path
          d="M38,0 C34,22 30,50 28,80 C26,110 25,140 24,168
             C23,196 22,222 21,246 C20,268 18,288 15,306
             C12,322 9,336 6,348"
          fill="none" stroke="#c8960c" strokeWidth="0.75" opacity="0.5"/>
      </g>

      {/* ══ 3. OUTER ORBIT HALOS ════════════════════════════════════════════ */}
      <circle cx={HX} cy={HY} r="218"
        fill="none" stroke="rgba(200,150,12,0.07)" strokeWidth="1" strokeDasharray="3,11"/>
      <circle cx={HX} cy={HY} r="285"
        fill="none" stroke="rgba(41,151,255,0.04)" strokeWidth="1"/>

      {/* ══ 4. HUB ══════════════════════════════════════════════════════════ */}

      {/* Radial glow fill */}
      <circle cx={HX} cy={HY} r="168" fill="url(#hg)"/>

      {/* Outer calibrated ring */}
      <circle cx={HX} cy={HY} r="166"
        fill="none" stroke="rgba(200,150,12,0.20)" strokeWidth="1.5" strokeDasharray="6,8"/>

      {/* Tick marks — 36 ticks (every 10°) */}
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = (i * 10 * Math.PI) / 180;
        const isMajor = i % 9 === 0, isMed = i % 3 === 0;
        const r0 = 166, len = isMajor ? 12 : isMed ? 7 : 4;
        const x1 = (HX + r0 * Math.cos(angle)).toFixed(1);
        const y1 = (HY + r0 * Math.sin(angle)).toFixed(1);
        const x2 = (HX + (r0 + len) * Math.cos(angle)).toFixed(1);
        const y2 = (HY + (r0 + len) * Math.sin(angle)).toFixed(1);
        return (
          <line key={`t${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(200,150,12,0.24)"
            strokeWidth={isMajor ? 2.5 : isMed ? 1.5 : 0.8}/>
        );
      })}

      {/* Secondary ring */}
      <circle cx={HX} cy={HY} r="142"
        fill="none" stroke="rgba(200,150,12,0.11)" strokeWidth="1"/>

      {/* Tertiary ring */}
      <circle cx={HX} cy={HY} r="114"
        fill="none" stroke="rgba(200,150,12,0.08)" strokeWidth="0.75"/>

      {/* Inner glow disc */}
      <circle cx={HX} cy={HY} r="56"
        fill="rgba(200,150,12,0.07)"
        stroke="rgba(200,150,12,0.20)" strokeWidth="1.5"/>
      <circle cx={HX} cy={HY} r="42"
        fill="none" stroke="rgba(200,150,12,0.12)" strokeWidth="1"/>

      {/* 8 spokes */}
      {[0,45,90,135,180,225,270,315].map(a => {
        const [x2, y2] = polar(HX, HY, a, 168);
        return (
          <line key={`sp${a}`} x1={HX} y1={HY} x2={x2} y2={y2}
            stroke="rgba(200,150,12,0.09)" strokeWidth="1"/>
        );
      })}

      {/* Diagonal cross inside inner ring */}
      {[45,135].map(a => {
        const [x1, y1] = polar(HX, HY, a,   38);
        const [x2, y2] = polar(HX, HY, a + 180, 38);
        return <line key={`cr${a}`} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(200,150,12,0.15)" strokeWidth="0.75"/>;
      })}

      {/* Centre 8-point star — with glow filter */}
      <g filter="url(#glow)">
        <path d={starPath(HX, HY, 44, 18, 8)} fill="rgba(200,150,12,0.28)"/>
        <path d={starPath(HX, HY, 30, 13, 8)} fill="rgba(200,150,12,0.50)"/>
        <circle cx={HX} cy={HY} r="12" fill="rgba(200,150,12,0.80)"/>
        <circle cx={HX} cy={HY} r="6"  fill="#fce38a"/>
      </g>

      {/* ══ 5. CURVED CONNECTIONS ═══════════════════════════════════════════ */}
      {nodes.map(({ a, g }) => {
        const [nx, ny] = polar(HX, HY, a, SPOKE_R);
        const path = curvedPath(HX, HY, nx, ny, a > 90 && a < 270 ? -30 : 30);
        return (
          <path key={`cc${a}`} d={path} fill="none"
            stroke={g === 'gold' ? 'url(#cg)' : 'url(#cb)'}
            strokeWidth="1.5"/>
        );
      })}

      {/* ══ 6. NODES ════════════════════════════════════════════════════════ */}
      {nodes.map(({ a, c, icon }) => {
        const [cx, cy] = polar(HX, HY, a, SPOKE_R);
        return (
          <g key={`nd${a}`} opacity="0.82">
            {/* Outer glow halo */}
            <circle cx={cx} cy={cy} r="27" fill={`${c}0a`}/>
            {/* Node body with gradient */}
            <circle cx={cx} cy={cy} r="18" fill="url(#nodeBody)"/>
            {/* Border ring */}
            <circle cx={cx} cy={cy} r="18"
              fill="none" stroke={c} strokeWidth="1.5" opacity="0.55"
              filter="url(#nglow)"/>
            {/* Small inner accent ring */}
            <circle cx={cx} cy={cy} r="13"
              fill="none" stroke={`${c}30`} strokeWidth="0.75"/>

            {/* ── Document icon ── */}
            {icon === 'doc' && (
              <g stroke={c} fill="none" strokeLinecap="round" opacity="0.88">
                {/* page with folded corner */}
                <path d={`M${cx-6.5},${cy-8} L${cx+3.5},${cy-8} L${cx+6.5},${cy-4.5} L${cx+6.5},${cy+8} L${cx-6.5},${cy+8} Z`} strokeWidth="1.5"/>
                <polyline points={`${cx+3.5},${cy-8} ${cx+3.5},${cy-4.5} ${cx+6.5},${cy-4.5}`} strokeWidth="1"/>
                <line x1={cx-4.5} y1={cy-1.5} x2={cx+4.5} y2={cy-1.5} strokeWidth="1.2"/>
                <line x1={cx-4.5} y1={cy+1.5} x2={cx+4.5} y2={cy+1.5} strokeWidth="1.2"/>
                <line x1={cx-4.5} y1={cy+4.5} x2={cx+1}   y2={cy+4.5} strokeWidth="1.2"/>
              </g>
            )}

            {/* ── Calculator icon ── */}
            {icon === 'calc' && (
              <g opacity="0.88">
                <rect x={cx-6.5} y={cy-8} width="13" height="16" rx="2"
                  fill="none" stroke={c} strokeWidth="1.5"/>
                <rect x={cx-4.5} y={cy-6.5} width="9" height="4.5" rx="1"
                  fill={c} opacity="0.28"/>
                {[[-3,0.5],[1.5,0.5],[-3,4.5],[1.5,4.5]].map(([dx,dy], i) => (
                  <circle key={i} cx={cx+dx} cy={cy+dy} r="1.4" fill={c} opacity="0.75"/>
                ))}
              </g>
            )}

            {/* ── Rupee icon ── */}
            {icon === 'rupee' && (
              <g opacity="0.88">
                <text x={cx} y={cy+6} textAnchor="middle"
                  fontSize="15" fontWeight="800" fontFamily="system-ui,sans-serif"
                  fill={c}>₹</text>
              </g>
            )}

            {/* ── Calendar icon ── */}
            {icon === 'cal' && (
              <g stroke={c} fill="none" strokeLinecap="round" opacity="0.88">
                <rect x={cx-6.5} y={cy-6} width="13" height="14" rx="2" strokeWidth="1.5"/>
                <line x1={cx-6.5} y1={cy-1.5} x2={cx+6.5} y2={cy-1.5} strokeWidth="1.1"/>
                <line x1={cx-2.5} y1={cy-9} x2={cx-2.5} y2={cy-4.5} strokeWidth="2"/>
                <line x1={cx+2.5} y1={cy-9} x2={cx+2.5} y2={cy-4.5} strokeWidth="2"/>
                <circle cx={cx-2} cy={cy+3} r="1.5" fill={c} stroke="none"/>
                <circle cx={cx+2} cy={cy+3} r="1.5" fill={c} stroke="none"/>
                <circle cx={cx+5} cy={cy+3} r="1.5" fill={c} stroke="none" opacity="0.4"/>
              </g>
            )}

            {/* ── Shield / Pension icon ── */}
            {icon === 'shield' && (
              <g stroke={c} fill="none" opacity="0.88">
                <path d={`M${cx},${cy-8.5} L${cx+7.5},${cy-4} L${cx+7.5},${cy+2} Q${cx+7.5},${cy+10} ${cx},${cy+11} Q${cx-7.5},${cy+10} ${cx-7.5},${cy+2} L${cx-7.5},${cy-4} Z`}
                  strokeWidth="1.5"/>
                {/* tick inside shield */}
                <polyline points={`${cx-3},${cy+1} ${cx},${cy+4.5} ${cx+4.5},${cy-1.5}`}
                  strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
            )}
          </g>
        );
      })}

      {/* ══ 7. KERALA GOVT ORDER CARD (left) ════════════════════════════════ */}

      {/* Shadow card behind — rotated */}
      <g transform="translate(40,180) rotate(-11,80,108)" opacity="0.08">
        <rect width="162" height="218" rx="10" fill="#1a2236"/>
        <rect width="162" height="218" rx="10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <rect width="162" height="34" rx="10" fill="#1e2c48"/>
        <rect y="24" width="162" height="10" fill="#1e2c48"/>
        <rect x="10" y="10" width="88" height="7" rx="3" fill="rgba(200,150,12,0.38)"/>
        {[44,58,72,86,100,116].map((y,i) => (
          <rect key={y} x="10" y={y} width={[138,120,134,108,124,90][i]} height="5" rx="2" fill="#263252"/>
        ))}
      </g>

      {/* Main Govt Order card */}
      <g transform="translate(58,165)" opacity="0.16">
        {/* Drop shadow */}
        <rect x="5" y="6" width="164" height="228" rx="12" fill="rgba(0,0,0,0.6)"/>
        {/* Card */}
        <rect width="164" height="228" rx="12" fill="url(#cardGold)"/>
        <rect width="164" height="228" rx="12" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1"/>

        {/* ── Header band ── */}
        <rect width="164" height="38" rx="12" fill="rgba(200,150,12,0.22)"/>
        <rect y="28" width="164" height="10" fill="rgba(200,150,12,0.22)"/>
        <rect y="38" width="164" height="1" fill="rgba(200,150,12,0.40)"/>

        {/* State emblem area (small circle) */}
        <circle cx="20" cy="19" r="11"
          fill="rgba(200,150,12,0.15)" stroke="rgba(200,150,12,0.35)" strokeWidth="1"/>
        <path d={starPath(20, 19, 7, 3, 8)} fill="rgba(200,150,12,0.50)"/>
        <circle cx="20" cy="19" r="2.5" fill="rgba(245,208,96,0.70)"/>

        {/* Header text */}
        <rect x="36" y="11" width="96" height="7" rx="3" fill="rgba(245,208,96,0.65)"/>
        <rect x="36" y="23" width="68" height="4.5" rx="2" fill="rgba(245,208,96,0.30)"/>

        {/* ── GO No. / Date row ── */}
        <rect x="10" y="48" width="68" height="5.5" rx="2" fill="rgba(255,255,255,0.22)"/>
        <rect x="106" y="48" width="48" height="5.5" rx="2" fill="rgba(255,255,255,0.14)"/>

        {/* ── Thin rule ── */}
        <rect x="10" y="62" width="144" height="0.75" fill="rgba(255,255,255,0.09)"/>

        {/* ── Subject ── */}
        <rect x="10" y="70"  width="126" height="6.5" rx="2" fill="rgba(41,151,255,0.42)"/>
        <rect x="10" y="82"  width="100" height="5" rx="2" fill="rgba(41,151,255,0.24)"/>

        {/* ── Body text ── */}
        {[96,108,120,132,144].map((y, i) => (
          <rect key={y} x="10" y={y} width={[144,132,144,118,136][i]} height="5" rx="2"
            fill="rgba(255,255,255,0.09)"/>
        ))}

        {/* ── Financial table ── */}
        <rect x="10" y="158" width="144" height="1" fill="rgba(255,255,255,0.10)"/>
        {/* Table header */}
        <rect x="10"  y="162" width="144" height="18" rx="2" fill="rgba(200,150,12,0.10)"/>
        <rect x="12"  y="166" width="38" height="4.5" rx="1" fill="rgba(200,150,12,0.40)"/>
        <rect x="68"  y="166" width="48" height="4.5" rx="1" fill="rgba(200,150,12,0.40)"/>
        <rect x="130" y="166" width="22" height="4.5" rx="1" fill="rgba(200,150,12,0.40)"/>
        <rect x="10"  y="180" width="144" height="0.75" fill="rgba(255,255,255,0.07)"/>
        {/* Row 1 */}
        <rect x="12"  y="184" width="30" height="4" rx="1" fill="rgba(255,255,255,0.10)"/>
        <rect x="68"  y="184" width="42" height="4" rx="1" fill="rgba(255,255,255,0.10)"/>
        <rect x="130" y="184" width="20" height="4" rx="1" fill="rgba(41,151,255,0.30)"/>
        {/* Row 2 */}
        <rect x="12"  y="193" width="34" height="4" rx="1" fill="rgba(255,255,255,0.08)"/>
        <rect x="68"  y="193" width="38" height="4" rx="1" fill="rgba(255,255,255,0.08)"/>
        <rect x="130" y="193" width="20" height="4" rx="1" fill="rgba(41,151,255,0.24)"/>

        {/* ── Signature + Seal ── */}
        <rect x="10"  y="210" width="52" height="4" rx="2" fill="rgba(255,255,255,0.08)"/>
        <rect x="10"  y="218" width="38" height="3.5" rx="2" fill="rgba(255,255,255,0.06)"/>
        {/* Official seal */}
        <circle cx="144" cy="213" r="16"
          fill="rgba(200,150,12,0.08)" stroke="rgba(200,150,12,0.32)" strokeWidth="1.5"/>
        <circle cx="144" cy="213" r="11"
          fill="none" stroke="rgba(200,150,12,0.18)" strokeWidth="1"/>
        <path d={starPath(144, 213, 6, 2.5, 8)} fill="rgba(200,150,12,0.45)"/>
      </g>

      {/* ══ 8. PAY SLIP MINI CARD (bottom-left) ════════════════════════════ */}
      <g transform="translate(30,378)" opacity="0.15">
        {/* Shadow */}
        <rect x="3" y="4" width="152" height="120" rx="10" fill="rgba(0,0,0,0.5)"/>
        {/* Body */}
        <rect width="152" height="120" rx="10" fill="#0f1d2e"/>
        <rect width="152" height="120" rx="10" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1"/>

        {/* Green header */}
        <rect width="152" height="28" rx="10" fill="rgba(16,185,129,0.18)"/>
        <rect y="18" width="152" height="10" fill="rgba(16,185,129,0.18)"/>
        <rect y="28" width="152" height="1" fill="rgba(16,185,129,0.28)"/>
        <rect x="10" y="9" width="72" height="6" rx="2.5" fill="rgba(52,211,153,0.55)"/>
        <rect x="10" y="19" width="50" height="4" rx="2" fill="rgba(255,255,255,0.18)"/>

        {/* Pay rows with mini bars */}
        {[
          { label: 0, pct: 0.85, y: 37 },
          { label: 1, pct: 0.52, y: 52 },
          { label: 2, pct: 0.32, y: 67 },
        ].map(({ pct, y }) => (
          <g key={y}>
            <rect x="10" y={y} width="36" height="4.5" rx="1.5" fill="rgba(255,255,255,0.12)"/>
            {/* bar track */}
            <rect x="54" y={y+1} width="88" height="3" rx="1.5" fill="rgba(255,255,255,0.06)"/>
            {/* bar fill */}
            <rect x="54" y={y+1} width={88 * pct} height="3" rx="1.5" fill="rgba(41,151,255,0.45)"/>
          </g>
        ))}

        {/* Divider */}
        <rect x="10" y="84" width="132" height="0.75" fill="rgba(255,255,255,0.09)"/>

        {/* Net Pay row */}
        <rect x="10"  y="92" width="50" height="5" rx="2" fill="rgba(255,255,255,0.13)"/>
        <rect x="92"  y="90" width="52" height="9" rx="4" fill="rgba(200,150,12,0.20)"/>
        <rect x="94"  y="92" width="48" height="5" rx="2" fill="rgba(245,208,96,0.55)"/>

        {/* Credited badge */}
        <rect x="10" y="107" width="66" height="10" rx="5"
          fill="rgba(16,185,129,0.22)" stroke="rgba(52,211,153,0.35)" strokeWidth="1"/>
        <polyline points="18,112 21.5,115.5 28,109" stroke="#34d399" strokeWidth="1.5"
          fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="33" y="110" width="36" height="4" rx="2" fill="rgba(52,211,153,0.50)"/>
      </g>

      {/* ══ 9. ANALYTICS MINI CARD (top-right, behind node) ════════════════ */}
      <g transform="translate(820,55)" opacity="0.11">
        <rect x="3" y="3" width="70" height="70" rx="8" fill="rgba(0,0,0,0.4)"/>
        <rect width="70" height="70" rx="8" fill="#111d32"/>
        <rect width="70" height="70" rx="8" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        <rect x="8" y="9" width="40" height="5" rx="2" fill="rgba(200,150,12,0.40)"/>
        {/* Bar chart */}
        {[[10,42,26],[22,30,24],[34,50,22],[46,22,20],[58,38,18]].map(([x,h,w],i) => (
          <rect key={i} x={x} y={70-10-h} width={w-2} height={h} rx="2"
            fill={i===2 ? 'rgba(200,150,12,0.60)' : 'rgba(41,151,255,0.38)'}/>
        ))}
      </g>

      {/* ══ 10. GEOMETRIC STAR ACCENT (top-left) ════════════════════════════ */}
      <g transform="translate(110,90)" opacity="0.10">
        {/* Outer star ring */}
        <path d={starPath(0, 0, 52, 22, 8)} fill="#c8960c"/>
        {/* Inner star */}
        <path d={starPath(0, 0, 32, 14, 8)} fill="#c8960c" opacity="0.7"/>
        <circle cx="0" cy="0" r="16" fill="#c8960c" opacity="0.5"/>
        <circle cx="0" cy="0" r="7"  fill="#f5d060" opacity="0.8"/>
        {/* Orbit ring */}
        <circle cx="0" cy="0" r="64" fill="none" stroke="rgba(200,150,12,0.25)" strokeWidth="0.75" strokeDasharray="2,8"/>
      </g>

      {/* ══ 11. DOTTED CONNECTOR (hub node → doc card) ══════════════════════ */}
      {(() => {
        const [nx, ny] = polar(HX, HY, 180, SPOKE_R);
        return (
          <path d={curvedPath(nx, ny, 224, 270, -22)}
            fill="none" stroke="rgba(200,150,12,0.10)"
            strokeWidth="1.2" strokeDasharray="3,7"/>
        );
      })()}

      {/* ══ 12. ACCENT DOTS ═════════════════════════════════════════════════ */}
      <circle cx="214" cy="462" r="5.5" fill="#c8960c" opacity="0.13"/>
      <circle cx="358" cy="54"  r="3.5" fill="#2997ff" opacity="0.16"/>
      <circle cx="540" cy="478" r="4"   fill="#c8960c" opacity="0.09"/>
      <circle cx="138" cy="428" r="2.5" fill="#2997ff" opacity="0.12"/>
      <circle cx="565" cy="26"  r="2.5" fill="#c8960c" opacity="0.13"/>
      <circle cx="690" cy="492" r="3"   fill="#2997ff" opacity="0.09"/>
      <circle cx="432" cy="500" r="2"   fill="#c8960c" opacity="0.08"/>
      <circle cx="754" cy="24"  r="2"   fill="#f5d060" opacity="0.12"/>
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
                        min-h-[60vh] md:min-h-[68vh] px-4 md:px-8
                        pt-[72px] md:pt-[88px] pb-10 md:pb-14">

      {/* SVG background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <HeroIllustration />
      </div>

      {/* Gold ambient glow */}
      <div className="absolute pointer-events-none z-0"
        style={{
          top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: 680, height: 340, borderRadius: '50%',
          background: 'radial-gradient(ellipse,rgba(200,150,12,0.13) 0%,transparent 70%)',
          filter: 'blur(40px)',
        }}/>
      {/* Blue ambient glow */}
      <div className="absolute pointer-events-none z-0"
        style={{
          bottom: '6%', right: '6%', width: 320, height: 200, borderRadius: '50%',
          background: 'radial-gradient(ellipse,rgba(41,151,255,0.07) 0%,transparent 70%)',
          filter: 'blur(50px)',
        }}/>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">

        {/* Logo */}
        <div className="relative mb-4 md:mb-5">
          <div className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse,rgba(200,150,12,0.28) 0%,transparent 70%)',
              filter: 'blur(18px)', transform: 'scale(1.5) translateY(6px)',
            }}/>
          <div className="relative rounded-full p-[2.5px]"
            style={{ background: 'linear-gradient(135deg,rgba(200,150,12,0.65),rgba(245,208,96,0.30),rgba(200,150,12,0.65))' }}>
            <Image
              src="/logo.webp" alt="Kerala Employees Portal"
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
        <button onClick={openSearch}
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

        {/* Quick links */}
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
