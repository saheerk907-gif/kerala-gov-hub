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

// ─── Minimal animated SVG ─────────────────────────────────────────────────────
function HeroIllustration() {
  const HX = 808, HY = 258;
  const R_OUTER = 168;
  const R_MID   = 116;
  const R_INNER =  58;

  function polar(deg, r) {
    const rad = deg * Math.PI / 180;
    return [+(HX + r * Math.cos(rad)).toFixed(2), +(HY + r * Math.sin(rad)).toFixed(2)];
  }

  // 5 visible nodes on the left arc (from top to bottom)
  const nodeAngles = [270, 222, 180, 138, 90];

  function bezier(x2, y2, bend = 24) {
    const mx = (HX + x2) / 2, my = (HY + y2) / 2;
    const dx = x2 - HX, dy = y2 - HY;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    return `M${HX},${HY} Q${(mx - (dy / len) * bend).toFixed(2)},${(my + (dx / len) * bend).toFixed(2)} ${x2},${y2}`;
  }

  return (
    <svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice" aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>

      <defs>
        <radialGradient id="centreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#c8960c" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="#c8960c" stopOpacity="0"/>
        </radialGradient>
        <filter id="blur4" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4"/>
        </filter>
        <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── Sparse dot grid ────────────────────────────────────────────────── */}
      {Array.from({ length: 8 }).flatMap((_, r) =>
        Array.from({ length: 14 }).map((_, c) => (
          <circle key={`g${r}-${c}`}
            cx={c * 68 + 10} cy={r * 68 + 10}
            r="1.1" fill="rgba(255,255,255,0.038)"/>
        ))
      )}

      {/* ── Wide orbit (static, very faint) ────────────────────────────────── */}
      <circle cx={HX} cy={HY} r="225"
        fill="none" stroke="rgba(200,150,12,0.05)" strokeWidth="1"/>

      {/* ── Outer ring — CLOCKWISE ROTATION ────────────────────────────────── */}
      <g>
        <animateTransform attributeName="transform" type="rotate"
          from={`0 ${HX} ${HY}`} to={`360 ${HX} ${HY}`}
          dur="55s" repeatCount="indefinite"/>
        {/* Dashed outer ring */}
        <circle cx={HX} cy={HY} r={R_OUTER}
          fill="none" stroke="rgba(200,150,12,0.18)" strokeWidth="1.5"
          strokeDasharray="6,10"/>
        {/* Calibration ticks — 12 positions */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = i * 30 * Math.PI / 180;
          const isMaj = i % 3 === 0;
          const len = isMaj ? 11 : 5;
          return (
            <line key={i}
              x1={(HX + R_OUTER * Math.cos(a)).toFixed(2)}
              y1={(HY + R_OUTER * Math.sin(a)).toFixed(2)}
              x2={(HX + (R_OUTER + len) * Math.cos(a)).toFixed(2)}
              y2={(HY + (R_OUTER + len) * Math.sin(a)).toFixed(2)}
              stroke="rgba(200,150,12,0.28)"
              strokeWidth={isMaj ? 2 : 1} strokeLinecap="round"/>
          );
        })}
        {/* 4 accent dots on outer ring at 90° intervals */}
        {[0, 90, 180, 270].map(deg => {
          const [x, y] = polar(deg, R_OUTER);
          return <circle key={deg} cx={x} cy={y} r="3.5"
            fill="rgba(200,150,12,0.45)"/>;
        })}
      </g>

      {/* ── Mid ring — COUNTER-CLOCKWISE ROTATION ──────────────────────────── */}
      <g>
        <animateTransform attributeName="transform" type="rotate"
          from={`0 ${HX} ${HY}`} to={`-360 ${HX} ${HY}`}
          dur="38s" repeatCount="indefinite"/>
        <circle cx={HX} cy={HY} r={R_MID}
          fill="none" stroke="rgba(96,165,250,0.12)" strokeWidth="1"
          strokeDasharray="3,16"/>
        {/* 4 small accent dots */}
        {[45, 135, 225, 315].map(deg => {
          const [x, y] = polar(deg, R_MID);
          return <circle key={deg} cx={x} cy={y} r="2.5"
            fill="rgba(96,165,250,0.35)"/>;
        })}
      </g>

      {/* ── Inner ring (static) ────────────────────────────────────────────── */}
      <circle cx={HX} cy={HY} r={R_INNER}
        fill="none" stroke="rgba(200,150,12,0.10)" strokeWidth="0.75"
        strokeDasharray="2,10"/>

      {/* ── Spokes ─────────────────────────────────────────────────────────── */}
      {nodeAngles.map(a => {
        const [x2, y2] = polar(a, R_OUTER);
        return (
          <line key={`sp${a}`} x1={HX} y1={HY} x2={x2} y2={y2}
            stroke="rgba(200,150,12,0.06)" strokeWidth="1"/>
        );
      })}

      {/* ── Flowing connection lines ────────────────────────────────────────── */}
      {nodeAngles.map((a, i) => {
        const [x2, y2] = polar(a, R_OUTER);
        return (
          <path key={`fl${a}`} d={bezier(x2, y2, 18)} fill="none"
            stroke="rgba(200,150,12,0.22)" strokeWidth="1.2"
            strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset"
              from="0" to="-30"
              dur={`${2.2 + i * 0.35}s`} repeatCount="indefinite"/>
          </path>
        );
      })}

      {/* ── Node dots ──────────────────────────────────────────────────────── */}
      {nodeAngles.map((a, i) => {
        const [cx, cy] = polar(a, R_OUTER);
        const isKey = a === 270 || a === 180 || a === 90;
        return (
          <g key={`nd${a}`}>
            {/* Pulsing halo */}
            <circle cx={cx} cy={cy} r="16" fill={`rgba(200,150,12,0.05)`}>
              <animate attributeName="r"      values="12;20;12"
                dur={`${3 + i * 0.5}s`} begin={`${i * 0.4}s`} repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.04;0.12;0.04"
                dur={`${3 + i * 0.5}s`} begin={`${i * 0.4}s`} repeatCount="indefinite"/>
            </circle>
            {/* Node ring */}
            <circle cx={cx} cy={cy} r={isKey ? 9 : 6}
              fill={isKey ? 'rgba(200,150,12,0.12)' : 'rgba(255,255,255,0.04)'}
              stroke={isKey ? 'rgba(200,150,12,0.50)' : 'rgba(255,255,255,0.14)'}
              strokeWidth={isKey ? 1.5 : 1}>
              <animate attributeName="opacity" values="0.5;1;0.5"
                dur={`${2.4 + i * 0.3}s`} begin={`${i * 0.35}s`} repeatCount="indefinite"/>
            </circle>
            {/* Key dot centre */}
            {isKey && (
              <circle cx={cx} cy={cy} r="3" fill="#f5d060" opacity="0.85"/>
            )}
          </g>
        );
      })}

      {/* ── Centre pulsing orb ─────────────────────────────────────────────── */}
      {/* Glow layer */}
      <circle cx={HX} cy={HY} r="50" fill="url(#centreGlow)">
        <animate attributeName="r"       values="44;58;44" dur="5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.7;1;0.7" dur="5s" repeatCount="indefinite"/>
      </circle>
      {/* Breathing ring */}
      <circle cx={HX} cy={HY} r="28"
        fill="none" stroke="rgba(200,150,12,0.22)" strokeWidth="1.5">
        <animate attributeName="r"       values="26;32;26" dur="4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.18;0.30;0.18" dur="4s" repeatCount="indefinite"/>
      </circle>
      {/* Core */}
      <circle cx={HX} cy={HY} r="13"
        fill="rgba(200,150,12,0.55)" filter="url(#glow)">
        <animate attributeName="opacity" values="0.45;0.75;0.45" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx={HX} cy={HY} r="6" fill="#f5d060"/>
      <circle cx={HX} cy={HY} r="2.5" fill="rgba(255,255,255,0.9)"/>

      {/* ── Left-side vertical accent line ─────────────────────────────────── */}
      <g transform="translate(36,120)" opacity="0.10">
        <line x1="0" y1="0" x2="0" y2="280"
          stroke="rgba(200,150,12,0.40)" strokeWidth="1"
          strokeDasharray="1,6"/>
        {[0, 70, 140, 210, 280].map((y, i) => (
          <circle key={y} cx="0" cy={y} r={i === 2 ? 3.5 : 2}
            fill={i === 2 ? '#f5d060' : 'rgba(200,150,12,0.55)'}>
            <animate attributeName="opacity" values="0.3;0.9;0.3"
              dur={`${2.5 + i * 0.5}s`} begin={`${i * 0.5}s`} repeatCount="indefinite"/>
          </circle>
        ))}
      </g>

      {/* ── Accent particles ───────────────────────────────────────────────── */}
      {[
        [198, 72,  '#c8960c', 3.5, 4],
        [152, 448, '#2997ff', 2.5, 5],
        [558, 38,  '#c8960c', 2,   3],
        [496, 488, '#2997ff', 3,   6],
        [326, 48,  '#c8960c', 2,   4],
        [722, 490, '#2997ff', 2,   5],
      ].map(([x, y, c, r, dur], i) => (
        <circle key={`p${i}`} cx={x} cy={y} r={r} fill={c} opacity="0.10">
          <animate attributeName="opacity" values="0.05;0.18;0.05"
            dur={`${dur}s`} begin={`${i * 0.6}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Hero() {
  function openSearch() {
    window.dispatchEvent(new CustomEvent('open-search'));
  }

  return (
    <section
      className="relative flex flex-col items-center justify-center text-center overflow-hidden bg-aurora
                 min-h-[60vh] md:min-h-[68vh] px-4 md:px-8
                 pt-[72px] md:pt-[88px] pb-10 md:pb-14">

      {/* SVG background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <HeroIllustration />
      </div>

      {/* Subtle centre glow */}
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 60% 45% at 50% 40%, rgba(200,150,12,0.08) 0%, transparent 70%)',
        }}/>

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center">

        {/* Logo */}
        <div className="relative mb-5">
          {/* Gold halo behind logo */}
          <div className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse,rgba(200,150,12,0.25) 0%,transparent 70%)',
              filter: 'blur(14px)', transform: 'scale(1.6) translateY(4px)',
            }}/>
          <div className="relative rounded-full p-[2px]"
            style={{ background: 'linear-gradient(145deg,rgba(200,150,12,0.55),rgba(245,208,96,0.20),rgba(200,150,12,0.55))' }}>
            <Image
              src="/logo.webp" alt="Kerala Employees Portal"
              width={80} height={80} priority
              className="relative z-10 rounded-full object-cover w-[56px] h-[56px] md:w-[72px] md:h-[72px] lg:w-[80px] lg:h-[80px]"
              style={{ boxShadow: '0 8px 28px rgba(0,0,0,0.45)' }}
            />
          </div>
        </div>

        {/* Eyebrow */}
        <p className="mb-3 text-[10px] md:text-[11px] font-black uppercase tracking-[0.26em]"
          style={{ color: 'rgba(245,208,96,0.55)', letterSpacing: '0.24em' }}>
          Kerala Government Employees Portal
        </p>

        {/* Headings */}
        <h1 className="font-malayalam font-bold leading-[1.18] tracking-tight bg-clip-text text-transparent mb-1"
          style={{
            fontSize: 'clamp(30px,5.5vw,68px)',
            backgroundImage: 'linear-gradient(160deg,#c8960c 0%,#f5d060 40%,#fce38a 54%,#f5d060 70%,#c8960c 100%)',
            filter: 'drop-shadow(0 0 14px rgba(200,150,12,0.22))',
          }}>
          കേരള സർക്കാർ
        </h1>
        <h2 className="font-malayalam font-semibold leading-[1.28] tracking-tight bg-clip-text text-transparent mb-6 md:mb-8"
          style={{
            fontSize: 'clamp(17px,3vw,38px)',
            backgroundImage: 'linear-gradient(160deg,#9c720a,#e8c247,#fce38a,#e8c247,#9c720a)',
            filter: 'drop-shadow(0 0 6px rgba(200,150,12,0.16))',
          }}>
          ജീവനക്കാരുടെ വിജ്ഞാനകോശം
        </h2>

        {/* Search bar */}
        <button onClick={openSearch}
          className="flex items-center gap-3 w-full max-w-[460px] rounded-2xl px-4 py-3 md:py-3.5 mb-7 transition-all duration-300 cursor-text hover:scale-[1.01] hover:brightness-110"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(245,208,96,0.18)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset, 0 4px 20px rgba(0,0,0,0.22)',
          }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="rgba(245,208,96,0.55)" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span className="flex-1 text-left text-[13px]"
            style={{ color: 'rgba(255,255,255,0.30)' }}>
            Search tools, orders, schemes…
          </span>
          <kbd className="hidden md:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-md"
            style={{ background: 'rgba(245,208,96,0.08)', color: 'rgba(245,208,96,0.50)', border: '1px solid rgba(245,208,96,0.16)' }}>
            ⌘ K
          </kbd>
        </button>

        {/* Stats */}
        <div className="glass-card flex items-stretch rounded-2xl overflow-hidden mb-5"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
          {STATS.map((s, i) => (
            <div key={i}
              className="flex flex-col items-center justify-center px-5 py-3 md:px-6 md:py-3.5"
              style={{ borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <span className="font-black leading-none"
                style={{ fontSize: 'clamp(14px,1.6vw,19px)', color: '#f5d060', textShadow: '0 0 10px rgba(200,150,12,0.35)' }}>
                {s.value}
              </span>
              <span className="text-[8px] md:text-[9px] font-semibold uppercase tracking-widest mt-1"
                style={{ color: 'rgba(255,255,255,0.38)' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap justify-center gap-1.5">
          {QUICK_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              className="px-3 py-1.5 rounded-full text-[11px] font-medium no-underline transition-all duration-200 hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.48)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
              {link.label}
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
