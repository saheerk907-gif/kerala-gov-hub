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

// ─── Subtle SVG background ────────────────────────────────────────────────────
function HeroSVG() {
  const pings = [0, 1.8, 3.6, 5.4, 7.2];

  return (
    <svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice" aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <style>{`
        @keyframes svgPing {
          0%   { r: 8;   opacity: 0.30; }
          70%  {          opacity: 0.08; }
          100% { r: 310; opacity: 0;    }
        }
@keyframes svgDot {
          0%, 100% { opacity: 0.030; }
          50%       { opacity: 0.065; }
        }
      `}</style>

      {/* Dot grid */}
      {Array.from({ length: 8 }).flatMap((_, r) =>
        Array.from({ length: 14 }).map((_, c) => (
          <circle key={`g${r}-${c}`} cx={c * 68 + 10} cy={r * 68 + 10} r="1.1"
            fill="rgba(255,255,255,1)"
            style={{ animation: `svgDot ${3 + (r + c) * 0.15}s ease-in-out ${r * 0.1 + c * 0.07}s infinite` }}/>
        ))
      )}

      {/* Sonar rings */}
      {pings.map((d, i) => (
        <circle key={i} cx="450" cy="262" r="8" fill="none"
          stroke="rgba(200,150,12,0.30)" strokeWidth="1.2"
          style={{ animation: `svgPing 9s cubic-bezier(0.2,0.6,0.4,1) ${d}s infinite` }}/>
      ))}


      {/* Faint column lines */}
      {[225, 450, 675].map((x, i) => (
        <line key={i} x1={x} y1="0" x2={x} y2="520"
          stroke="rgba(200,150,12,0.022)" strokeWidth="1"/>
      ))}
    </svg>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  function openSearch() {
    window.dispatchEvent(new CustomEvent('open-search'));
  }

  return (
    <section className="relative flex flex-col items-center justify-center text-center overflow-hidden bg-aurora
                        min-h-[60vh] md:min-h-[68vh] px-4 md:px-8
                        pt-[72px] md:pt-[88px] pb-12 md:pb-16">

      {/* ── Entry animation keyframes ──────────────────────────────────────── */}
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes heroScale {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1);    }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-anim { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* ══ BACKGROUND LAYERS (depth & authority) ════════════════════════════ */}

      {/* Layer 0: SVG pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <HeroSVG />
      </div>

      {/* Layer 1: Vignette — darkens edges, draws eye to centre */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 75% 65% at 50% 44%, transparent 35%, rgba(6,10,18,0.82) 100%)' }}/>

      {/* Layer 2: Gold focal glow — offset slightly upper-left (asymmetry) */}
      <div className="absolute z-[1] pointer-events-none"
        style={{
          top: '-8%', left: '10%',
          width: 680, height: 420,
          background: 'radial-gradient(ellipse, rgba(200,150,12,0.13) 0%, transparent 68%)',
          filter: 'blur(56px)',
          transform: 'translateZ(0)',
        }}/>

      {/* Layer 3: Blue accent — lower-right (asymmetry counterweight) */}
      <div className="absolute z-[1] pointer-events-none"
        style={{
          bottom: '-5%', right: '-2%',
          width: 420, height: 300,
          background: 'radial-gradient(ellipse, rgba(41,151,255,0.07) 0%, transparent 70%)',
          filter: 'blur(70px)',
          transform: 'translateZ(0)',
        }}/>

      {/* Layer 4: Purple whisper — top-right */}
      <div className="absolute z-[1] pointer-events-none"
        style={{
          top: '-12%', right: '8%',
          width: 320, height: 240,
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.05) 0%, transparent 70%)',
          filter: 'blur(80px)',
          transform: 'translateZ(0)',
        }}/>

      {/* Layer 5: Noise texture (breaks up flat gradient) */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          opacity: 0.032,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}/>

      {/* ══ CONTENT ══════════════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center">

        {/* ── Logo ── */}
        <div className="relative mb-5 hero-anim"
          style={{ animation: 'heroScale 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.05s both' }}>

          {/* Outer breathing halo */}
          <div className="absolute rounded-full pointer-events-none"
            style={{
              inset: '-14px',
              background: 'radial-gradient(ellipse, rgba(200,150,12,0.18) 0%, transparent 70%)',
              filter: 'blur(12px)',
              animation: 'heroScale 4s ease-in-out infinite alternate',
            }}/>

          {/* Inner glow disc */}
          <div className="absolute rounded-full pointer-events-none"
            style={{
              inset: '-4px',
              background: 'radial-gradient(ellipse, rgba(200,150,12,0.20) 0%, transparent 65%)',
              filter: 'blur(6px)',
            }}/>

          {/* Gold gradient ring */}
          <div className="relative rounded-full"
            style={{
              padding: '2.5px',
              background: 'linear-gradient(140deg, rgba(200,150,12,0.70) 0%, rgba(245,208,96,0.25) 45%, rgba(200,150,12,0.70) 100%)',
              boxShadow: '0 0 0 1px rgba(200,150,12,0.12), 0 8px 32px rgba(0,0,0,0.50)',
            }}>
            <Image
              src="/logo.webp" alt="Kerala Employees Portal"
              width={80} height={80} priority
              className="relative rounded-full object-cover w-[58px] h-[58px] md:w-[74px] md:h-[74px] lg:w-[80px] lg:h-[80px]"
            />
          </div>
        </div>

        {/* ── Eyebrow ── */}
        <p className="mb-3 hero-anim"
          style={{
            animation: 'heroFadeUp 0.55s ease-out 0.14s both',
            fontSize: 10, fontWeight: 800, letterSpacing: '0.28em',
            textTransform: 'uppercase', color: 'rgba(245,208,96,0.42)',
          }}>
          Kerala Government Employees Portal
        </p>

        {/* ── Primary heading — one line ── */}
        <h1 className="font-malayalam font-bold bg-clip-text text-transparent whitespace-nowrap hero-anim"
          style={{
            animation: 'heroFadeUp 0.60s ease-out 0.22s both',
            fontSize: 'clamp(24px, 5.2vw, 66px)',
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
            backgroundImage: 'linear-gradient(158deg, #b8860b 0%, #e8c133 28%, #fce38a 50%, #e8c133 72%, #b8860b 100%)',
            filter: 'drop-shadow(0 2px 18px rgba(200,150,12,0.28))',
            marginBottom: 6,
          }}>
          കേരള സർക്കാർ
        </h1>

        {/* ── Subtitle ── */}
        <h2 className="font-malayalam font-medium bg-clip-text text-transparent hero-anim"
          style={{
            animation: 'heroFadeUp 0.60s ease-out 0.30s both',
            fontSize: 'clamp(14px, 2.5vw, 32px)',
            lineHeight: 1.35,
            letterSpacing: '0.01em',
            backgroundImage: 'linear-gradient(158deg, rgba(200,150,12,0.70) 0%, rgba(232,193,51,0.88) 50%, rgba(200,150,12,0.70) 100%)',
            filter: 'drop-shadow(0 1px 8px rgba(200,150,12,0.14))',
            marginBottom: 28,
          }}>
          ജീവനക്കാരുടെ വിജ്ഞാനകോശം
        </h2>

        {/* ── Search bar (primary CTA) ── */}
        <div className="w-full max-w-[520px] hero-anim"
          style={{ animation: 'heroFadeUp 0.60s ease-out 0.38s both', marginBottom: 24 }}>
          <button onClick={openSearch}
            className="group flex items-center gap-3 w-full rounded-2xl px-5 py-3.5 transition-all duration-250 cursor-text"
            style={{
              background: 'rgba(255,255,255,0.045)',
              border: '1px solid rgba(200,150,12,0.22)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.05) inset, 0 6px 28px rgba(0,0,0,0.28), 0 0 40px rgba(200,150,12,0.06)',
              transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(200,150,12,0.40)';
              e.currentTarget.style.boxShadow   = '0 0 0 1px rgba(255,255,255,0.06) inset, 0 8px 32px rgba(0,0,0,0.32), 0 0 48px rgba(200,150,12,0.12)';
              e.currentTarget.style.transform   = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(200,150,12,0.22)';
              e.currentTarget.style.boxShadow   = '0 0 0 1px rgba(255,255,255,0.05) inset, 0 6px 28px rgba(0,0,0,0.28), 0 0 40px rgba(200,150,12,0.06)';
              e.currentTarget.style.transform   = 'translateY(0)';
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="rgba(200,150,12,0.55)" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span className="flex-1 text-left text-[13.5px] font-normal"
              style={{ color: 'rgba(255,255,255,0.28)' }}>
              Search tools, orders, schemes…
            </span>
            <kbd className="hidden md:inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md"
              style={{
                background: 'rgba(200,150,12,0.08)',
                color: 'rgba(200,150,12,0.55)',
                border: '1px solid rgba(200,150,12,0.18)',
              }}>
              ⌘ K
            </kbd>
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="hero-anim"
          style={{ animation: 'heroFadeUp 0.60s ease-out 0.46s both', marginBottom: 20 }}>
          <div style={{
            display: 'flex', alignItems: 'stretch',
            borderRadius: 18, overflow: 'hidden',
            background: 'rgba(255,255,255,0.028)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 2px 20px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '12px 24px',
                borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}>
                <span style={{
                  fontSize: 'clamp(15px,1.7vw,20px)',
                  fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em',
                  color: '#f5d060',
                  textShadow: '0 0 16px rgba(200,150,12,0.45), 0 0 32px rgba(200,150,12,0.20)',
                }}>
                  {s.value}
                </span>
                <span style={{
                  fontSize: 8.5, fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', marginTop: 5,
                  color: 'rgba(255,255,255,0.32)',
                }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick links ── */}
        <div className="flex flex-wrap justify-center gap-1.5 hero-anim"
          style={{ animation: 'heroFadeUp 0.55s ease-out 0.54s both' }}>
          {QUICK_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              className="no-underline"
              style={{
                padding: '6px 14px',
                borderRadius: 999,
                fontSize: 11, fontWeight: 500,
                color: 'rgba(255,255,255,0.42)',
                background: 'rgba(255,255,255,0.038)',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'color 0.18s, background 0.18s, border-color 0.18s, transform 0.18s, box-shadow 0.18s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color       = 'rgba(245,208,96,0.85)';
                e.currentTarget.style.background  = 'rgba(200,150,12,0.10)';
                e.currentTarget.style.borderColor = 'rgba(200,150,12,0.28)';
                e.currentTarget.style.transform   = 'translateY(-2px)';
                e.currentTarget.style.boxShadow   = '0 4px 12px rgba(0,0,0,0.20)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color       = 'rgba(255,255,255,0.42)';
                e.currentTarget.style.background  = 'rgba(255,255,255,0.038)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.transform   = 'translateY(0)';
                e.currentTarget.style.boxShadow   = 'none';
              }}>
              {link.label}
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
