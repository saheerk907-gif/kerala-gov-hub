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
  { label: 'Pension',     href: '/pension' },
  { label: 'Pay Revision',href: '/prc' },
  { label: 'Leave',       href: '/leave' },
  { label: 'Forms',       href: '/forms' },
  { label: 'Govt Orders', href: '/orders' },
  { label: 'Income Tax',  href: '/income-tax' },
];

// ─── Background SVG — Kerala-themed abstract illustration ─────────────────────
function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 900 520"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      {/* ── Floating stats / calculator card — right side ── */}
      <g transform="translate(700,180)" opacity="0.16">
        {/* card shadow */}
        <rect x="4" y="6" width="164" height="200" rx="14" fill="rgba(0,0,0,0.4)"/>
        {/* card body */}
        <rect x="0" y="0" width="164" height="200" rx="14" fill="#1a2236"/>
        <rect x="0" y="0" width="164" height="200" rx="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        {/* header strip */}
        <rect x="0" y="0" width="164" height="36" rx="14" fill="#202c44"/>
        <rect x="0" y="22" width="164" height="14" fill="#202c44"/>
        <circle cx="18" cy="18" r="5" fill="#ff453a" opacity="0.7"/>
        <circle cx="34" cy="18" r="5" fill="#f5d060" opacity="0.7"/>
        <circle cx="50" cy="18" r="5" fill="#30d158" opacity="0.7"/>
        <rect x="68" y="13" width="72" height="10" rx="5" fill="rgba(255,255,255,0.08)"/>
        {/* bar chart */}
        <rect x="16" y="142" width="18" height="42" rx="3" fill="#2997ff" opacity="0.6"/>
        <rect x="42" y="122" width="18" height="62" rx="3" fill="#2997ff" opacity="0.7"/>
        <rect x="68" y="108" width="18" height="76" rx="3" fill="#c8960c" opacity="0.8"/>
        <rect x="94" y="118" width="18" height="66" rx="3" fill="#2997ff" opacity="0.6"/>
        <rect x="120"y="98"  width="18" height="86" rx="3" fill="#c8960c" opacity="0.9"/>
        {/* label row */}
        <rect x="16" y="50" width="60" height="8" rx="4" fill="#c8960c" opacity="0.6"/>
        <rect x="16" y="66" width="132" height="6" rx="3" fill="#2e3c5c"/>
        <rect x="16" y="80" width="110" height="6" rx="3" fill="#2e3c5c"/>
        <rect x="16" y="94" width="120" height="6" rx="3" fill="#2e3c5c"/>
      </g>
      {/* second smaller card behind */}
      <g transform="translate(840,240) rotate(10)" opacity="0.10">
        <rect x="0" y="0" width="120" height="150" rx="12" fill="#162038"/>
        <rect x="0" y="0" width="120" height="150" rx="12" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <rect x="12" y="16" width="50" height="7" rx="3" fill="#c8960c" opacity="0.5"/>
        <rect x="12" y="32" width="96" height="5" rx="2" fill="#2e3c5c"/>
        <rect x="12" y="46" width="80" height="5" rx="2" fill="#2e3c5c"/>
        <rect x="12" y="60" width="88" height="5" rx="2" fill="#2e3c5c"/>
        <rect x="12" y="90" width="20" height="44" rx="3" fill="#2997ff" opacity="0.5"/>
        <rect x="40" y="76" width="20" height="58" rx="3" fill="#c8960c" opacity="0.5"/>
        <rect x="68" y="84" width="20" height="50" rx="3" fill="#2997ff" opacity="0.4"/>
        <rect x="96" y="70" width="20" height="64" rx="3" fill="#c8960c" opacity="0.5"/>
      </g>

      {/* ── Geometric lotus — top left ── */}
      <g transform="translate(110,100)" opacity="0.10">
        {[0,45,90,135,180,225,270,315].map((angle, i) => (
          <path key={i}
            transform={`rotate(${angle})`}
            d="M0,0 C-14,-30 -6,-56 0,-64 C6,-56 14,-30 0,0Z"
            fill="#c8960c"
          />
        ))}
        <circle cx="0" cy="0" r="16" fill="#c8960c" opacity="0.6"/>
        <circle cx="0" cy="0" r="8" fill="#f5d060" opacity="0.7"/>
      </g>

      {/* ── Floating document cards — left ── */}
      <g transform="translate(72,230)" opacity="0.13">
        <rect x="0" y="0" width="130" height="170" rx="10" fill="#2a3552"/>
        <rect x="12" y="16" width="76" height="8"  rx="4" fill="#c8960c" opacity="0.7"/>
        <rect x="12" y="34" width="106" height="6" rx="3" fill="#3e4a6a"/>
        <rect x="12" y="48" width="90"  height="6" rx="3" fill="#3e4a6a"/>
        <rect x="12" y="62" width="100" height="6" rx="3" fill="#3e4a6a"/>
        <rect x="12" y="76" width="80"  height="6" rx="3" fill="#3e4a6a"/>
        <rect x="12" y="96" width="106" height="6" rx="3" fill="#3e4a6a"/>
        <rect x="12" y="110" width="60" height="6" rx="3" fill="#3e4a6a"/>
        <rect x="12" y="136" width="48" height="18" rx="5" fill="#c8960c" opacity="0.4"/>
      </g>
      <g transform="translate(34,200) rotate(-12)" opacity="0.09">
        <rect x="0" y="0" width="110" height="148" rx="9" fill="#1e2a44"/>
        <rect x="10" y="14" width="60" height="7"  rx="3" fill="#c8960c" opacity="0.5"/>
        <rect x="10" y="30" width="90" height="5"  rx="2" fill="#2e3c5c"/>
        <rect x="10" y="44" width="76" height="5"  rx="2" fill="#2e3c5c"/>
        <rect x="10" y="58" width="84" height="5"  rx="2" fill="#2e3c5c"/>
      </g>

      {/* ── Floating document cards — right ── */}
      <g transform="translate(828,80) rotate(14)" opacity="0.11">
        <rect x="-90" y="0" width="110" height="148" rx="9" fill="#1e2a44"/>
        <rect x="-80" y="14" width="64" height="7"  rx="3" fill="#2997ff" opacity="0.4"/>
        <rect x="-80" y="30" width="88" height="5"  rx="2" fill="#2e3c5c"/>
        <rect x="-80" y="44" width="74" height="5"  rx="2" fill="#2e3c5c"/>
        <rect x="-80" y="58" width="82" height="5"  rx="2" fill="#2e3c5c"/>
      </g>

      {/* ── Decorative rings / orbits ── */}
      <circle cx="450" cy="260" r="220" fill="none" stroke="rgba(200,150,12,0.06)" strokeWidth="1.5"/>
      <circle cx="450" cy="260" r="310" fill="none" stroke="rgba(41,151,255,0.04)"  strokeWidth="1"/>
      <circle cx="450" cy="260" r="380" fill="none" stroke="rgba(200,150,12,0.03)" strokeWidth="1"/>

      {/* ── Dot grid pattern — subtle ── */}
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 14 }).map((_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={col * 68 + 20}
            cy={row * 68 + 20}
            r="1.5"
            fill="rgba(255,255,255,0.06)"
          />
        ))
      )}

      {/* ── Small accent dots ── */}
      <circle cx="200" cy="440" r="5" fill="#c8960c" opacity="0.18"/>
      <circle cx="680" cy="68"  r="4" fill="#2997ff" opacity="0.20"/>
      <circle cx="820" cy="390" r="6" fill="#c8960c" opacity="0.12"/>
      <circle cx="130" cy="390" r="3" fill="#2997ff" opacity="0.15"/>
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

      {/* SVG background illustration */}
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
      {/* Blue ambient glow */}
      <div className="absolute pointer-events-none z-0"
        style={{
          bottom: '5%', right: '10%',
          width: 320, height: 220, borderRadius: '50%',
          background: 'radial-gradient(ellipse,rgba(41,151,255,0.08) 0%,transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">

        {/* Logo with golden ring */}
        <div className="relative mb-4 md:mb-5">
          <div className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse,rgba(200,150,12,0.28) 0%,transparent 70%)',
              filter: 'blur(18px)', transform: 'scale(1.5) translateY(6px)',
            }}
          />
          <div className="relative rounded-full p-[2.5px]"
            style={{ background: 'linear-gradient(135deg,rgba(200,150,12,0.6),rgba(245,208,96,0.3),rgba(200,150,12,0.6))' }}>
            <Image
              src="/logo.webp"
              alt="Kerala Employees Portal"
              width={88}
              height={88}
              priority
              className="relative z-10 rounded-full object-cover w-[60px] h-[60px] md:w-[76px] md:h-[76px] lg:w-[88px] lg:h-[88px]"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
            />
          </div>
        </div>

        {/* Eyebrow badge */}
        <div className="mb-3 px-3 py-1 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-[0.22em]"
          style={{
            background: 'rgba(200,150,12,0.10)',
            border: '1px solid rgba(200,150,12,0.22)',
            color: 'rgba(245,208,96,0.70)',
          }}>
          Kerala Government Employees Portal
        </div>

        {/* Headings */}
        <h1
          className="font-malayalam font-bold leading-[1.2] tracking-tight bg-clip-text text-transparent mb-1"
          style={{
            fontSize: 'clamp(32px,6vw,72px)',
            backgroundImage: 'linear-gradient(135deg,#c8960c 0%,#f5d060 38%,#fce38a 52%,#f5d060 68%,#c8960c 100%)',
            filter: 'drop-shadow(0 0 16px rgba(200,150,12,0.30))',
          }}
        >
          കേരള സർക്കാർ
        </h1>
        <h2
          className="font-malayalam font-bold leading-[1.25] tracking-tight bg-clip-text text-transparent mb-5 md:mb-7"
          style={{
            fontSize: 'clamp(18px,3.2vw,42px)',
            backgroundImage: 'linear-gradient(135deg,#b8860b,#f5d060,#fce38a,#f5d060,#b8860b)',
            filter: 'drop-shadow(0 0 8px rgba(200,150,12,0.22))',
          }}
        >
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
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f5d060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span className="flex-1 text-left text-[13px] md:text-[14px]" style={{ color: 'rgba(255,255,255,0.38)' }}>
            Search tools, orders, schemes...
          </span>
          <kbd className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg"
            style={{ background: 'rgba(245,208,96,0.10)', color: '#f5d060', border: '1px solid rgba(245,208,96,0.22)' }}>
            Ctrl K
          </kbd>
        </button>

        {/* Stats bar — glass card */}
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
            <Link
              key={link.href}
              href={link.href}
              className="px-3.5 py-1.5 rounded-full text-[11px] font-semibold no-underline transition-all duration-200 hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.60)',
                border: '1px solid rgba(255,255,255,0.09)',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
