'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Hero() {
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const check = () => setIsLight(document.documentElement.getAttribute('data-theme') === 'light');
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Trigger entrance animations after first paint
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Shared entrance animation style — each element gets a different delay
  const fadeUp = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(22px)',
    transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  });

  return (
    <section
      className="hero-section relative min-h-[50vh] md:min-h-[55vh] flex flex-col items-center justify-center text-center px-4 pt-[48px] md:pt-[56px] lg:pt-[88px] pb-8 md:pb-12 overflow-hidden"
      style={isLight ? {
        background: 'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(200,150,12,0.13) 0%, transparent 65%), radial-gradient(ellipse 60% 40% at 15% 100%, rgba(200,150,12,0.07) 0%, transparent 55%), #f5f0e8',
      } : undefined}
    >

      {/* ── Top accent light bar ── */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] z-20 pointer-events-none"
        style={{
          background: isLight
            ? 'linear-gradient(90deg, transparent 0%, rgba(29,78,216,0.5) 30%, rgba(200,150,12,0.7) 50%, rgba(29,78,216,0.5) 70%, transparent 100%)'
            : 'linear-gradient(90deg, transparent 0%, rgba(200,150,12,0.3) 20%, rgba(245,208,96,0.9) 50%, rgba(200,150,12,0.3) 80%, transparent 100%)',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 1.2s ease 200ms',
        }}
      />

      {/* ── Background: Secretariat building (dark mode only) ── */}
      {!isLight && (
        <div className="absolute inset-0 z-0">
          <Image
            src="/kerala-secretariat.jpg"
            alt=""
            fill
            priority
            fetchPriority="high"
            className="object-cover object-[center_65%] opacity-[0.32]"
            style={{ filter: 'grayscale(25%) brightness(0.8) contrast(1.1)' }}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#121416]/80 via-transparent to-[#121416]/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#121416]/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-[#121416] via-[#121416]/60 to-transparent" />
        </div>
      )}

      {/* ── Light mode: subtle Kerala emblem watermark ──────── */}
      {isLight && (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="w-[420px] h-[420px] rounded-full opacity-[0.06]"
            style={{ background: 'radial-gradient(circle, rgba(200,150,12,1) 0%, transparent 70%)' }} />
        </div>
      )}

      {/* ── Animated film grain (dark only) ── */}
      {!isLight && (
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '180px 180px',
            opacity: 0.035,
            animation: 'grainDrift 8s steps(1) infinite',
          }}
        />
      )}

      {/* ── Gold ambient glow — wider and deeper (dark only) ── */}
      {!isLight && (
        <>
          <div
            className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(200,150,12,0.12) 0%, transparent 70%)' }}
          />
          <div
            className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full blur-[60px] pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(245,208,96,0.10) 0%, transparent 70%)' }}
          />
        </>
      )}

      {/* ── Content ──────────────────────────────────────── */}
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-0">

        {/* Logo — with ripple ring */}
        <div className="relative mb-4 md:mb-5 group cursor-pointer" style={fadeUp(0)}>

          {/* Ripple ring (dark only) */}
          {!isLight && (
            <>
              <div className="absolute inset-0 rounded-full pointer-events-none" style={{ animation: 'ripple 2.8s ease-out infinite', border: '1px solid rgba(200,150,12,0.5)' }} />
              <div className="absolute inset-0 rounded-full pointer-events-none" style={{ animation: 'ripple 2.8s ease-out infinite 1.4s', border: '1px solid rgba(200,150,12,0.3)' }} />
            </>
          )}

          {/* Drop shadow (dark only) */}
          {!isLight && <div className="absolute inset-0 rounded-full bg-black/50 blur-[28px] scale-[1.05] translate-y-3 pointer-events-none" />}

          <Image
            src="/logo.webp"
            alt="Kerala Gov Employee Hub Logo"
            width={120}
            height={120}
            priority
            fetchPriority="high"
            className="relative z-10 w-[80px] h-[80px] md:w-[96px] md:h-[96px] lg:w-[112px] lg:h-[112px] rounded-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={isLight ? {
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            } : {
              boxShadow:
                '0 0 0 2px rgba(200,150,12,0.55), ' +
                '0 0 18px 4px rgba(200,150,12,0.22), ' +
                '0 0 50px 12px rgba(200,150,12,0.10), ' +
                '0 20px 50px rgba(0,0,0,0.55)',
            }}
          />
        </div>

        {/* Kicker */}
        <p
          className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.28em] mb-2 md:mb-3"
          style={{ ...fadeUp(120), color: isLight ? 'rgba(30,58,95,0.60)' : 'rgba(245,208,96,0.70)' }}
        >
          Kerala Government Employees Portal
        </p>

        {/* Titles */}
        <div className="flex flex-col items-center gap-1.5 md:gap-1.5 mb-3 md:mb-4" style={fadeUp(220)}>
          <h1 className="text-[clamp(32px,7vw,80px)] font-bold leading-[1] tracking-tight">
            <span className="bg-clip-text text-transparent" style={isLight ? {
              backgroundImage: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 45%, #1e3a5f 100%)',
              filter: 'none',
            } : {
              backgroundImage: 'linear-gradient(135deg, #c8960c 0%, #f5d060 35%, #fce38a 52%, #f5d060 68%, #c8960c 100%)',
              filter: 'drop-shadow(0 0 8px rgba(200,150,12,0.50))',
            }}>
              കേരള സർക്കാർ
            </span>
          </h1>
          <div className="h-[1.5px] rounded-full" style={{
            width: mounted ? '48px' : '0px',
            transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1) 500ms',
            background: isLight
              ? 'linear-gradient(90deg, transparent, rgba(29,78,216,0.50), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(200,150,12,0.8), transparent)',
          }} />
          <h2 className="text-[clamp(19px,4vw,52px)] font-bold leading-[1.15] tracking-tight">
            <span className={`bg-clip-text text-transparent bg-[length:200%_auto] ${isLight ? '' : 'animate-shimmer'}`} style={isLight ? {
              backgroundImage: 'linear-gradient(135deg, #1e40af, #3b82f6, #1e40af)',
              filter: 'none',
            } : {
              backgroundImage: 'linear-gradient(135deg, #b8860b, #f5d060, #fce38a, #f5d060, #b8860b)',
              filter: 'drop-shadow(0 0 6px rgba(200,150,12,0.40))',
            }}>
              ജീവനക്കാരുടെ വിജ്ഞാനകോശം
            </span>
          </h2>
        </div>

        {/* Subtitle */}
        <p
          className="text-[clamp(11px,1.6vw,15px)] max-w-[520px] leading-relaxed font-medium px-2 mb-4 md:mb-5"
          style={{ ...fadeUp(340), color: isLight ? 'rgba(30,58,95,0.70)' : 'rgba(252,227,138,0.80)' }}
        >
          സേവന ചട്ടങ്ങൾ മുതൽ ശമ്പള പരിഷ്കരണം വരെ. സർവീസിലുള്ളവർക്കും
          വിരമിച്ചവർക്കും ആവശ്യമായ എല്ലാ വിവരങ്ങളും ഇപ്പോൾ വിരൽത്തുമ്പിൽ.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 mb-4 md:mb-6" style={fadeUp(460)}>
          {[
            { label: 'MEDISEP', href: '/medisep' },
            { label: 'Pension', href: '/pension' },
            { label: 'Service Rules', href: '/ksr' },
            { label: 'Calculators', href: '#tools' },
            { label: 'Govt Orders', href: '#orders' },
            { label: 'Dept Tests', href: '/departmental-tests' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="px-3 py-1 md:px-4 md:py-2 inline-flex items-center rounded-full text-[10px] md:text-[11px] font-bold no-underline transition-all duration-300 hover:scale-105"
              style={isLight
                ? { background: 'rgba(29,78,216,0.07)', color: '#1d4ed8', border: '1px solid rgba(29,78,216,0.22)' }
                : {
                    background: 'rgba(255,255,255,0.08)',
                    color: 'rgba(245,208,96,0.88)',
                    border: '1px solid rgba(200,150,12,0.30)',
                    boxShadow: '0 0 0 0 rgba(200,150,12,0)',
                  }}
              onMouseEnter={e => { if (!isLight) e.currentTarget.style.boxShadow = '0 0 12px 2px rgba(200,150,12,0.20)'; }}
              onMouseLeave={e => { if (!isLight) e.currentTarget.style.boxShadow = '0 0 0 0 rgba(200,150,12,0)'; }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Scroll down button — desktop only */}
        <div style={fadeUp(580)}>
          <button
            onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="hidden md:flex flex-col items-center gap-2 bg-transparent border-none cursor-pointer mt-2 group"
            aria-label="Scroll to explore"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] transition-colors" style={{ color: isLight ? 'rgba(29,78,216,0.50)' : 'rgba(245,208,96,0.55)' }}>
              Explore
            </span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-y-1"
              style={{ border: `1px solid ${isLight ? 'rgba(29,78,216,0.25)' : 'rgba(200,150,12,0.30)'}` }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ color: isLight ? 'rgba(29,78,216,0.50)' : 'rgba(245,208,96,0.55)' }}>
                <path d="M2 4l4 4 4-4"/>
              </svg>
            </div>
          </button>
        </div>

      </div>

    </section>
  );
}
