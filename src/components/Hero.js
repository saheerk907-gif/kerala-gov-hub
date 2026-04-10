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

// ─── Thematic SVG — Kerala Govt Portal ───────────────────────────────────────
function HeroIllustration() {
  // Gold particles rising from bottom (like sparks from a ceremonial lamp)
  const particles = [
    { x: 68,  y: 510, r: 2.0, dur: '9s',  delay: '0s'   },
    { x: 148, y: 500, r: 1.4, dur: '11s', delay: '1.8s' },
    { x: 240, y: 515, r: 1.8, dur: '8s',  delay: '3.2s' },
    { x: 340, y: 505, r: 1.2, dur: '13s', delay: '0.6s' },
    { x: 450, y: 512, r: 2.2, dur: '10s', delay: '2.5s' },
    { x: 560, y: 508, r: 1.5, dur: '12s', delay: '4.0s' },
    { x: 660, y: 502, r: 1.8, dur: '9s',  delay: '1.2s' },
    { x: 750, y: 514, r: 1.3, dur: '11s', delay: '3.8s' },
    { x: 840, y: 506, r: 2.0, dur: '10s', delay: '0.4s' },
    { x: 170, y: 498, r: 1.0, dur: '14s', delay: '5.5s' },
    { x: 490, y: 516, r: 1.6, dur: '8s',  delay: '6.0s' },
    { x: 720, y: 500, r: 1.2, dur: '13s', delay: '2.0s' },
  ];

  return (
    <svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice" aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>

      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0);      opacity: 0;    }
          15%  { opacity: 0.65; }
          75%  { opacity: 0.35; }
          100% { transform: translateY(-310px); opacity: 0;    }
        }
        @keyframes softPulse {
          0%, 100% { opacity: 0.05; }
          50%       { opacity: 0.13; }
        }
        @keyframes fadeDoc {
          0%, 100% { opacity: 0.07; }
          50%       { opacity: 0.13; }
        }
        @keyframes scanLine {
          0%   { transform: translateY(-30px); opacity: 0; }
          10%  { opacity: 0.06; }
          90%  { opacity: 0.06; }
          100% { transform: translateY(560px); opacity: 0; }
        }
      `}</style>

      {/* ── Sparse dot grid ────────────────────────────────────────────────── */}
      {Array.from({ length: 8 }).flatMap((_, row) =>
        Array.from({ length: 14 }).map((_, col) => (
          <circle key={`g${row}-${col}`}
            cx={col * 68 + 10} cy={row * 68 + 10}
            r="1.1" fill="rgba(255,255,255,0.035)"/>
        ))
      )}

      {/* ── Horizontal ruled lines (like a government register) ──────────── */}
      {[100, 175, 250, 325, 400, 475].map((y, i) => (
        <line key={`rl${i}`} x1="0" y1={y} x2="900" y2={y}
          stroke="rgba(200,150,12,0.04)" strokeWidth="1"
          style={{ animation: `softPulse ${5 + i * 0.6}s ease-in-out ${i * 0.4}s infinite` }}/>
      ))}

      {/* ── Slow scan line (top → bottom) ────────────────────────────────── */}
      <line x1="0" y1="0" x2="900" y2="0"
        stroke="rgba(200,150,12,0.06)" strokeWidth="1.5"
        style={{ animation: 'scanLine 14s linear 0s infinite' }}/>
      <line x1="0" y1="0" x2="900" y2="0"
        stroke="rgba(200,150,12,0.04)" strokeWidth="1"
        style={{ animation: 'scanLine 14s linear 7s infinite' }}/>

      {/* ── Radial glow pulse — centre ────────────────────────────────────── */}
      <ellipse cx="450" cy="260" rx="340" ry="210"
        fill="rgba(200,150,12,0.05)"
        style={{ animation: 'softPulse 6s ease-in-out infinite' }}/>
      <ellipse cx="450" cy="260" rx="180" ry="110"
        fill="rgba(200,150,12,0.04)"
        style={{ animation: 'softPulse 4s ease-in-out 1s infinite' }}/>

      {/* ── Document card silhouette — LEFT (govt order) ──────────────────── */}
      <g transform="translate(28,145) rotate(-6,80,110)"
        style={{ animation: 'fadeDoc 8s ease-in-out infinite' }}>
        {/* Card */}
        <rect width="148" height="196" rx="8" fill="rgba(200,150,12,0.06)"
          stroke="rgba(200,150,12,0.15)" strokeWidth="1"/>
        {/* Gold header band */}
        <rect width="148" height="28" rx="8" fill="rgba(200,150,12,0.10)"/>
        <rect y="20" width="148" height="8" fill="rgba(200,150,12,0.10)"/>
        <rect y="28" width="148" height="0.75" fill="rgba(200,150,12,0.20)"/>
        {/* Content lines */}
        <rect x="10" y="9"  width="88" height="6"  rx="2" fill="rgba(200,150,12,0.28)"/>
        <rect x="10" y="38" width="66" height="4.5" rx="2" fill="rgba(255,255,255,0.10)"/>
        <rect x="10" y="50" width="128" height="4" rx="2" fill="rgba(255,255,255,0.07)"/>
        <rect x="10" y="62" width="114" height="4" rx="2" fill="rgba(255,255,255,0.07)"/>
        <rect x="10" y="74" width="122" height="4" rx="2" fill="rgba(255,255,255,0.07)"/>
        <rect x="10" y="86" width="98"  height="4" rx="2" fill="rgba(255,255,255,0.07)"/>
        {/* Table */}
        <rect x="10"  y="104" width="128" height="0.75" fill="rgba(255,255,255,0.08)"/>
        <rect x="10"  y="108" width="36"  height="4"    rx="1" fill="rgba(200,150,12,0.22)"/>
        <rect x="58"  y="108" width="48"  height="4"    rx="1" fill="rgba(200,150,12,0.22)"/>
        <rect x="10"  y="118" width="32"  height="3.5"  rx="1" fill="rgba(255,255,255,0.08)"/>
        <rect x="58"  y="118" width="44"  height="3.5"  rx="1" fill="rgba(255,255,255,0.08)"/>
        <rect x="10"  y="128" width="32"  height="3.5"  rx="1" fill="rgba(255,255,255,0.06)"/>
        <rect x="58"  y="128" width="44"  height="3.5"  rx="1" fill="rgba(255,255,255,0.06)"/>
        {/* Seal */}
        <circle cx="126" cy="170" r="16"
          fill="none" stroke="rgba(200,150,12,0.20)" strokeWidth="1.2"/>
        <circle cx="126" cy="170" r="10"
          fill="none" stroke="rgba(200,150,12,0.12)" strokeWidth="0.75"/>
      </g>

      {/* ── Document card silhouette — RIGHT (pay slip) ───────────────────── */}
      <g transform="translate(738,148) rotate(7,74,100)"
        style={{ animation: 'fadeDoc 10s ease-in-out 2s infinite' }}>
        <rect width="140" height="188" rx="8" fill="rgba(41,151,255,0.04)"
          stroke="rgba(41,151,255,0.12)" strokeWidth="1"/>
        <rect width="140" height="28" rx="8" fill="rgba(41,151,255,0.08)"/>
        <rect y="20" width="140" height="8" fill="rgba(41,151,255,0.08)"/>
        <rect y="28" width="140" height="0.75" fill="rgba(41,151,255,0.16)"/>
        <rect x="10" y="9"  width="78" height="6"  rx="2" fill="rgba(147,197,253,0.30)"/>
        <rect x="10" y="38" width="56" height="4.5" rx="2" fill="rgba(255,255,255,0.10)"/>
        {[50, 62, 74, 86].map((y, i) => [
          <rect key={`la${y}`} x="10" y={y} width={[52,48,54,46][i]} height="4" rx="1.5" fill="rgba(255,255,255,0.07)"/>,
          <rect key={`ba${y}`} x="74" y={y+1} width="56" height="2.5" rx="1.5" fill="rgba(41,151,255,0.08)"/>,
          <rect key={`bf${y}`} x="74" y={y+1} width={56 * [0.85,0.52,0.35,0.68][i]} height="2.5" rx="1.5" fill="rgba(41,151,255,0.32)"/>,
        ])}
        <rect x="10" y="108" width="120" height="0.75" fill="rgba(255,255,255,0.08)"/>
        <rect x="10" y="116" width="56"  height="5"   rx="2" fill="rgba(200,150,12,0.18)"/>
        <rect x="80" y="114" width="50"  height="9"   rx="3" fill="rgba(200,150,12,0.14)"/>
      </g>

      {/* ── Floating gold particles (rising sparks) ───────────────────────── */}
      {particles.map(({ x, y, r, dur, delay }, i) => (
        <circle key={`p${i}`} cx={x} cy={y} r={r}
          fill={i % 3 === 0 ? '#f5d060' : '#c8960c'}
          style={{ animation: `floatUp ${dur} ease-in-out ${delay} infinite` }}/>
      ))}

      {/* ── Subtle vertical divider lines (like column rules in a register) ── */}
      {[220, 450, 680].map((x, i) => (
        <line key={`vl${i}`} x1={x} y1="0" x2={x} y2="520"
          stroke="rgba(200,150,12,0.025)" strokeWidth="1"/>
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

      {/* Warm gold radial glow */}
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 65% 50% at 50% 38%, rgba(200,150,12,0.09) 0%, transparent 70%)',
        }}/>

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center">

        {/* Logo */}
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse,rgba(200,150,12,0.22) 0%,transparent 70%)',
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
        <p className="mb-4 text-[10px] md:text-[11px] font-black uppercase tracking-[0.26em]"
          style={{ color: 'rgba(245,208,96,0.50)' }}>
          Kerala Government Employees Portal
        </p>

        {/* ── HEADING — single line ── */}
        <h1
          className="font-malayalam font-bold bg-clip-text text-transparent mb-2 whitespace-nowrap"
          style={{
            fontSize: 'clamp(22px, 5vw, 64px)',
            lineHeight: 1.2,
            backgroundImage: 'linear-gradient(160deg,#c8960c 0%,#f5d060 38%,#fce38a 52%,#f5d060 70%,#c8960c 100%)',
            filter: 'drop-shadow(0 0 14px rgba(200,150,12,0.22))',
          }}>
          കേരള സർക്കാർ
        </h1>
        <h2
          className="font-malayalam font-semibold bg-clip-text text-transparent mb-7"
          style={{
            fontSize: 'clamp(14px, 2.6vw, 34px)',
            lineHeight: 1.3,
            backgroundImage: 'linear-gradient(160deg,#9c720a,#e8c247,#f5d060,#e8c247,#9c720a)',
            filter: 'drop-shadow(0 0 6px rgba(200,150,12,0.14))',
          }}>
          ജീവനക്കാരുടെ വിജ്ഞാനകോശം
        </h2>

        {/* Search bar */}
        <button onClick={openSearch}
          className="flex items-center gap-3 w-full max-w-[460px] rounded-2xl px-4 py-3 md:py-3.5 mb-7 transition-all duration-300 cursor-text hover:scale-[1.01] hover:brightness-110"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(245,208,96,0.16)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset, 0 4px 20px rgba(0,0,0,0.22)',
          }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="rgba(245,208,96,0.50)" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span className="flex-1 text-left text-[13px]"
            style={{ color: 'rgba(255,255,255,0.28)' }}>
            Search tools, orders, schemes…
          </span>
          <kbd className="hidden md:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-md"
            style={{ background: 'rgba(245,208,96,0.07)', color: 'rgba(245,208,96,0.45)', border: '1px solid rgba(245,208,96,0.14)' }}>
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
                style={{ color: 'rgba(255,255,255,0.35)' }}>
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
                color: 'rgba(255,255,255,0.45)',
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
