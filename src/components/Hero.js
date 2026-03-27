'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const STATS = [
  { value: '1,200+', label: 'Govt Orders' },
  { value: '15+',    label: 'Calculators' },
  { value: '100%',   label: 'Free Always' },
];

export default function Hero() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsLight(document.documentElement.getAttribute('data-theme') === 'light');
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const gold      = isLight ? '#b45309'               : '#f5d060';
  const goldDim   = isLight ? 'rgba(180,83,9,0.65)'   : 'rgba(245,208,96,0.60)';
  const textPri   = isLight ? 'rgba(15,23,42,0.92)'   : 'rgba(255,255,255,0.92)';
  const textSub   = isLight ? 'rgba(15,23,42,0.68)'   : 'rgba(255,255,255,0.72)';
  const border    = isLight ? 'rgba(0,0,0,0.08)'      : 'rgba(255,255,255,0.08)';
  const surface   = isLight ? 'rgba(0,0,0,0.04)'      : 'rgba(255,255,255,0.04)';
  const titleGrad = isLight
    ? 'linear-gradient(135deg,#1e3a5f,#1d4ed8)'
    : 'linear-gradient(135deg,#c8960c 0%,#f5d060 38%,#fce38a 52%,#f5d060 68%,#c8960c 100%)';

  return (
    <section
      className="relative flex flex-col items-center justify-center text-center overflow-hidden
                 min-h-[60vh] md:min-h-[70vh]
                 px-4 md:px-8
                 pt-[56px] md:pt-[72px]
                 pb-10 md:pb-14"
      style={isLight ? {
        background: 'radial-gradient(ellipse 80% 55% at 50% 0%,rgba(200,150,12,0.10) 0%,transparent 60%),#f5f0e8',
      } : undefined}
    >

      {/* ── Background: Secretariat (dark only) ── */}
      {!isLight && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/kerala-secretariat.jpg"
            alt=""
            fill
            priority
            fetchPriority="high"
            className="object-cover object-[center_65%] opacity-[0.32]"
            style={{ filter: 'grayscale(20%) brightness(0.75) contrast(1.1)' }}
            sizes="100vw"
          />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to right,rgba(18,20,22,0.85) 0%,rgba(18,20,22,0.25) 50%,rgba(18,20,22,0.85) 100%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom,rgba(18,20,22,0.60) 0%,transparent 40%,rgba(18,20,22,1) 100%)' }} />
        </div>
      )}

      {/* ── Ambient glow ── */}
      {!isLight && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[340px] rounded-full blur-[130px] pointer-events-none opacity-60"
          style={{ background: 'radial-gradient(ellipse,rgba(200,150,12,0.18) 0%,transparent 70%)' }} />
      )}

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center">

        {/* Logo */}
        <div className="relative mb-4 md:mb-5">
          {!isLight && (
            <div className="absolute inset-0 rounded-full bg-black/40 blur-[24px] scale-110 translate-y-2 pointer-events-none" />
          )}
          <Image
            src="/logo.webp"
            alt="Kerala Employees Portal"
            width={100}
            height={100}
            priority
            className="relative z-10 w-[64px] h-[64px] md:w-[88px] md:h-[88px] lg:w-[100px] lg:h-[100px] rounded-full object-cover"
            style={isLight
              ? { boxShadow: '0 2px 16px rgba(0,0,0,0.12)' }
              : {
                  boxShadow:
                    '0 0 0 2px rgba(200,150,12,0.50),' +
                    '0 0 24px 6px rgba(200,150,12,0.16),' +
                    '0 16px 40px rgba(0,0,0,0.55)',
                }}
          />
        </div>

        {/* Eyebrow */}
        <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.28em] mb-3 md:mb-4"
          style={{ color: goldDim }}>
          Kerala Government Employees Portal
        </p>

        {/* Headings */}
        <div className="flex flex-col items-center gap-2 md:gap-3 mb-4 md:mb-5">
          <h1
            className="font-malayalam font-bold leading-[1.05] tracking-tight"
            style={{
              fontSize: 'clamp(36px, 7vw, 84px)',
              background: titleGrad,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: isLight ? 'none' : 'drop-shadow(0 0 12px rgba(200,150,12,0.35))',
            }}
          >
            കേരള സർക്കാർ
          </h1>
          <h2
            className="font-malayalam font-bold leading-[1.15] tracking-tight animate-shimmer bg-[length:200%_auto] bg-clip-text text-transparent"
            style={{
              fontSize: 'clamp(22px, 4vw, 52px)',
              backgroundImage: isLight
                ? 'linear-gradient(135deg,#1e40af,#3b82f6,#1e40af)'
                : 'linear-gradient(135deg,#b8860b,#f5d060,#fce38a,#f5d060,#b8860b)',
              filter: isLight ? 'none' : 'drop-shadow(0 0 6px rgba(200,150,12,0.30))',
            }}
          >
            ജീവനക്കാരുടെ വിജ്ഞാനകോശം
          </h2>
        </div>

        {/* English label */}
        <p className="text-[11px] md:text-[12px] font-semibold tracking-widest uppercase mb-2"
          style={{ color: textSub }}>
          Your complete resource hub
        </p>

        {/* Description */}
        <p className="leading-relaxed mb-6 md:mb-8 max-w-[480px] px-2"
          style={{ fontSize: 'clamp(12px, 1.4vw, 14px)', color: textSub }}>
          Salary calculators, pension tools, MEDISEP, service rules, pay scales
          and government orders — all in one place, always free.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6 md:mb-8">
          <Link
            href="#tools"
            className="inline-flex items-center gap-2 rounded-full font-bold no-underline transition-all duration-200 hover:opacity-90 active:scale-95
                       px-5 py-2 text-[12px] md:px-7 md:py-3 md:text-[14px]"
            style={{ background: '#2997ff', color: '#fff', boxShadow: '0 4px 24px rgba(41,151,255,0.30)' }}
          >
            Explore Tools
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1.5 6h9M7 2.5l3.5 3.5L7 9.5" />
            </svg>
          </Link>
          <Link
            href="#orders"
            className="inline-flex items-center gap-2 rounded-full font-bold no-underline transition-all duration-200 hover:bg-white/10 active:scale-95
                       px-5 py-2 text-[12px] md:px-7 md:py-3 md:text-[14px]"
            style={{ background: surface, color: textPri, border: `1px solid ${border}` }}
          >
            Latest Orders
          </Link>
        </div>

        {/* Stats bar */}
        <div className="flex items-stretch rounded-2xl overflow-hidden"
          style={{ background: surface, border: `1px solid ${border}` }}>
          {STATS.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center px-4 py-3 md:px-7 md:py-4"
              style={{ borderRight: i < STATS.length - 1 ? `1px solid ${border}` : 'none' }}
            >
              <span className="font-black tracking-tight leading-none"
                style={{ fontSize: 'clamp(15px, 2vw, 20px)', color: gold }}>
                {s.value}
              </span>
              <span className="text-[9px] md:text-[10px] font-medium uppercase tracking-wider mt-1"
                style={{ color: textSub }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
