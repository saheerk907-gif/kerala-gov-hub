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

  /* ── token shortcuts ─────────────────────────────────── */
  const gold     = isLight ? '#b45309'                  : '#f5d060';
  const goldDim  = isLight ? 'rgba(180,83,9,0.65)'      : 'rgba(245,208,96,0.60)';
  const textPri  = isLight ? 'rgba(15,23,42,0.92)'      : 'rgba(255,255,255,0.92)';
  const textSub  = isLight ? 'rgba(15,23,42,0.52)'      : 'rgba(255,255,255,0.46)';
  const border   = isLight ? 'rgba(0,0,0,0.08)'         : 'rgba(255,255,255,0.08)';
  const surface  = isLight ? 'rgba(0,0,0,0.04)'         : 'rgba(255,255,255,0.04)';
  const titleGrad = isLight
    ? 'linear-gradient(135deg,#1e3a5f,#1d4ed8)'
    : 'linear-gradient(135deg,#c8960c 0%,#f5d060 38%,#fce38a 52%,#f5d060 68%,#c8960c 100%)';

  return (
    <section
      className="relative min-h-[52vh] md:min-h-[58vh] flex flex-col items-center justify-center text-center px-5 pt-[56px] md:pt-[72px] lg:pt-[96px] pb-12 overflow-hidden"
      style={isLight ? {
        background: 'radial-gradient(ellipse 80% 55% at 50% 0%,rgba(200,150,12,0.10) 0%,transparent 60%),#f5f0e8',
      } : undefined}
    >

      {/* ── Background (dark only) ─────────────────────── */}
      {!isLight && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/kerala-secretariat.jpg"
            alt=""
            fill
            priority
            fetchPriority="high"
            className="object-cover object-[center_65%] opacity-[0.13]"
            style={{ filter: 'grayscale(45%) brightness(0.70) contrast(1.1)' }}
            sizes="100vw"
          />
          {/* horizontal vignette */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to right,rgba(18,20,22,0.88) 0%,rgba(18,20,22,0.30) 50%,rgba(18,20,22,0.88) 100%)' }} />
          {/* vertical vignette */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom,rgba(18,20,22,0.65) 0%,transparent 35%,rgba(18,20,22,1) 100%)' }} />
        </div>
      )}

      {/* ── Ambient gold glow (dark only) ──────────────── */}
      {!isLight && (
        <div
          className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[480px] h-[280px] rounded-full blur-[110px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,rgba(200,150,12,0.15) 0%,transparent 70%)' }}
        />
      )}

      {/* ── Content ──────────────────────────────────────── */}
      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">

        {/* Logo */}
        <div className="relative mb-5">
          {!isLight && (
            <div className="absolute inset-0 rounded-full bg-black/40 blur-[22px] scale-110 translate-y-2 pointer-events-none" />
          )}
          <Image
            src="/logo.webp"
            alt="Kerala Employees Portal"
            width={88}
            height={88}
            priority
            className="relative z-10 w-[68px] h-[68px] md:w-[84px] md:h-[84px] rounded-full object-cover"
            style={isLight
              ? { boxShadow: '0 2px 16px rgba(0,0,0,0.12)' }
              : {
                boxShadow:
                  '0 0 0 1.5px rgba(200,150,12,0.48),' +
                  '0 0 22px 5px rgba(200,150,12,0.14),' +
                  '0 14px 36px rgba(0,0,0,0.50)',
              }}
          />
        </div>

        {/* Eyebrow */}
        <p
          className="text-[9px] font-black uppercase tracking-[0.28em] mb-3"
          style={{ color: goldDim }}
        >
          Kerala Government Employees Portal
        </p>

        {/* Malayalam H1 */}
        <h1
          className="font-malayalam text-[clamp(28px,6.5vw,68px)] font-bold leading-[1.05] tracking-tight mb-2"
          style={{
            background: titleGrad,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: isLight ? 'none' : 'drop-shadow(0 0 10px rgba(200,150,12,0.32))',
          }}
        >
          കേരള ജീവനക്കാർ
        </h1>

        {/* English H2 */}
        <h2
          className="text-[clamp(13px,2vw,20px)] font-semibold tracking-tight mb-3"
          style={{ color: textPri }}
        >
          Your complete resource hub
        </h2>

        {/* Description */}
        <p
          className="text-[clamp(11.5px,1.4vw,13.5px)] leading-relaxed mb-7 max-w-[440px]"
          style={{ color: textSub }}
        >
          Salary calculators, pension tools, MEDISEP, service rules, pay scales
          and government orders — all in one place, always free.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <Link
            href="#tools"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-bold no-underline transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              background: '#2997ff',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(41,151,255,0.28)',
            }}
          >
            Explore Tools
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1.5 5.5h8M6.5 2.5l3 3-3 3" />
            </svg>
          </Link>

          <Link
            href="#orders"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-bold no-underline transition-all duration-200 hover:bg-white/10 active:scale-95"
            style={{ background: surface, color: textPri, border: `1px solid ${border}` }}
          >
            Latest Orders
          </Link>
        </div>

        {/* Stats bar */}
        <div
          className="flex items-stretch rounded-2xl overflow-hidden"
          style={{ background: surface, border: `1px solid ${border}` }}
        >
          {STATS.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center px-5 py-3"
              style={{ borderRight: i < STATS.length - 1 ? `1px solid ${border}` : 'none' }}
            >
              <span
                className="text-[17px] md:text-[19px] font-black tracking-tight leading-none"
                style={{ color: gold }}
              >
                {s.value}
              </span>
              <span
                className="text-[9px] font-medium uppercase tracking-wider mt-1"
                style={{ color: textSub }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
