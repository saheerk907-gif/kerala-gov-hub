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

// ─── SVG background ───────────────────────────────────────────────────────────
function HeroIllustration() {
  // Sonar ping rings: 5 rings staggered 1.8s apart, 9s total
  const pings   = [0, 1.8, 3.6, 5.4, 7.2];

  // Horizontal data-packet lanes: (y, delay, duration, direction)
  const lanes = [
    { y: 112, delay: '0s',   dur: '7s',  dir:  1 },
    { y: 192, delay: '2.5s', dur: '9s',  dir: -1 },
    { y: 308, delay: '1.2s', dur: '8s',  dir:  1 },
    { y: 388, delay: '3.8s', dur: '6.5s',dir: -1 },
    { y: 460, delay: '0.6s', dur: '10s', dir:  1 },
  ];

  // Scattered small accent nodes (static)
  const nodes = [
    { x: 68,  y: 132 }, { x: 840, y: 108 },
    { x: 56,  y: 388 }, { x: 856, y: 404 },
    { x: 112, y: 264 }, { x: 790, y: 264 },
    { x: 200, y: 80  }, { x: 700, y: 448 },
  ];

  return (
    <svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice" aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>

      <style>{`
        @keyframes ping {
          0%   { r: 8;   opacity: 0.40; stroke-width: 1.5; }
          70%  { opacity: 0.12; }
          100% { r: 320; opacity: 0;    stroke-width: 0.5; }
        }
        @keyframes packetLTR {
          0%   { transform: translateX(-20px); opacity: 0;    }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { transform: translateX(920px);  opacity: 0;    }
        }
        @keyframes packetRTL {
          0%   { transform: translateX(920px);  opacity: 0;    }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { transform: translateX(-20px); opacity: 0;    }
        }
        @keyframes nodePulse {
          0%, 100% { opacity: 0.15; r: 3;   }
          50%       { opacity: 0.55; r: 4.5; }
        }
        @keyframes gridWave {
          0%, 100% { opacity: 0.032; }
          50%       { opacity: 0.072; }
        }
      `}</style>

      {/* ── Dot grid with wave pulse ───────────────────────────────────────── */}
      {Array.from({ length: 8 }).flatMap((_, row) =>
        Array.from({ length: 14 }).map((_, col) => (
          <circle key={`g${row}-${col}`}
            cx={col * 68 + 10} cy={row * 68 + 10}
            r="1.2" fill="rgba(255,255,255,1)"
            style={{
              animation: `gridWave ${3 + (row + col) * 0.18}s ease-in-out ${(row * 0.12 + col * 0.08)}s infinite`,
            }}/>
        ))
      )}

      {/* ── Horizontal lane lines (very faint) ────────────────────────────── */}
      {lanes.map(({ y }, i) => (
        <line key={`ln${i}`} x1="0" y1={y} x2="900" y2={y}
          stroke="rgba(200,150,12,0.04)" strokeWidth="1"/>
      ))}

      {/* ── Traveling data packets on each lane ───────────────────────────── */}
      {lanes.map(({ y, delay, dur, dir }, i) => (
        <g key={`pk${i}`}>
          {/* Lane glow trail */}
          <circle cy={y} r="3.5" fill="rgba(200,150,12,0.55)"
            style={{
              animation: `${dir === 1 ? 'packetLTR' : 'packetRTL'} ${dur} linear ${delay} infinite`,
            }}/>
          {/* Leading dot */}
          <circle cy={y} r="1.8" fill="#f5d060"
            style={{
              animation: `${dir === 1 ? 'packetLTR' : 'packetRTL'} ${dur} linear ${delay} infinite`,
              animationDelay: `calc(${delay} + 0.05s)`,
            }}/>
        </g>
      ))}

      {/* ── Sonar ping rings from centre ──────────────────────────────────── */}
      {pings.map((delay, i) => (
        <circle key={`ping${i}`} cx="450" cy="262" r="8"
          fill="none" stroke="rgba(200,150,12,0.38)" strokeWidth="1.5"
          style={{ animation: `ping 9s cubic-bezier(0.2,0.6,0.4,1) ${delay}s infinite` }}/>
      ))}

      {/* ── Accent: second smaller sonar (right side) ─────────────────────── */}
      {[0, 2.4, 4.8].map((delay, i) => (
        <circle key={`ping2${i}`} cx="750" cy="200" r="6"
          fill="none" stroke="rgba(41,151,255,0.20)" strokeWidth="1"
          style={{ animation: `ping 7s cubic-bezier(0.2,0.6,0.4,1) ${delay}s infinite` }}/>
      ))}

      {/* ── Static accent nodes (endpoints of the signal) ─────────────────── */}
      {nodes.map(({ x, y }, i) => (
        <g key={`nd${i}`}>
          <circle cx={x} cy={y} r="6"
            fill="rgba(200,150,12,0.04)"
            stroke="rgba(200,150,12,0.18)" strokeWidth="1"
            style={{ animation: `nodePulse ${3 + i * 0.4}s ease-in-out ${i * 0.5}s infinite` }}/>
          <circle cx={x} cy={y} r="2.5"
            fill="rgba(200,150,12,0.50)"
            style={{ animation: `nodePulse ${3 + i * 0.4}s ease-in-out ${i * 0.5}s infinite` }}/>
        </g>
      ))}

      {/* ── Vertical faint column lines ────────────────────────────────────── */}
      {[225, 450, 675].map((x, i) => (
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

      <div className="absolute inset-0 z-0 pointer-events-none">
        <HeroIllustration />
      </div>

      {/* Centre glow */}
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 60% 45% at 50% 38%, rgba(200,150,12,0.08) 0%, transparent 70%)',
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

        {/* Heading — single line */}
        <h1 className="font-malayalam font-bold bg-clip-text text-transparent mb-2 whitespace-nowrap"
          style={{
            fontSize: 'clamp(22px,5vw,64px)',
            lineHeight: 1.2,
            backgroundImage: 'linear-gradient(160deg,#c8960c 0%,#f5d060 38%,#fce38a 52%,#f5d060 70%,#c8960c 100%)',
            filter: 'drop-shadow(0 0 14px rgba(200,150,12,0.22))',
          }}>
          കേരള സർക്കാർ
        </h1>
        <h2 className="font-malayalam font-semibold bg-clip-text text-transparent mb-7"
          style={{
            fontSize: 'clamp(14px,2.6vw,34px)',
            lineHeight: 1.3,
            backgroundImage: 'linear-gradient(160deg,#9c720a,#e8c247,#f5d060,#e8c247,#9c720a)',
            filter: 'drop-shadow(0 0 6px rgba(200,150,12,0.14))',
          }}>
          ജീവനക്കാരുടെ വിജ്ഞാനകോശം
        </h2>

        {/* Search */}
        <button onClick={openSearch}
          className="flex items-center gap-3 w-full max-w-[460px] rounded-2xl px-4 py-3 md:py-3.5 mb-7 transition-all duration-300 cursor-text hover:scale-[1.01]"
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
          <span className="flex-1 text-left text-[13px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
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
