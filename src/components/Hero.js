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
  const textSub   = isLight ? 'rgba(15,23,42,0.68)'   : 'rgba(255,255,255,0.72)';
  const textMuted = isLight ? 'rgba(15,23,42,0.45)'   : 'rgba(255,255,255,0.40)';
  const border    = isLight ? 'rgba(0,0,0,0.08)'      : 'rgba(255,255,255,0.08)';
  const surface   = isLight ? 'rgba(0,0,0,0.04)'      : 'rgba(255,255,255,0.04)';
  const surfaceMd = isLight ? 'rgba(0,0,0,0.06)'      : 'rgba(255,255,255,0.06)';
  const titleGrad = isLight
    ? 'linear-gradient(135deg,#78350f 0%,#b45309 50%,#78350f 100%)'
    : 'linear-gradient(135deg,#c8960c 0%,#f5d060 38%,#fce38a 52%,#f5d060 68%,#c8960c 100%)';

  function openSearch() {
    window.dispatchEvent(new CustomEvent('open-search'));
  }

  return (
    <section
      className="hero-section relative flex flex-col items-center justify-center text-center overflow-hidden
                 min-h-[58vh] md:min-h-[65vh]
                 px-4 md:px-8
                 pt-[56px] md:pt-[72px]
                 pb-6 md:pb-10"
      style={isLight ? {
        background: 'radial-gradient(ellipse 80% 55% at 50% 0%,rgba(200,150,12,0.10) 0%,transparent 60%),#f5f0e8',
      } : undefined}
    >

      {/* Background: Secretariat (dark only) */}
      {!isLight && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/kerala-secretariat.webp"
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

      {/* Ambient glow */}
      {!isLight && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[340px] rounded-full blur-[130px] pointer-events-none opacity-60"
          style={{ background: 'radial-gradient(ellipse,rgba(200,150,12,0.18) 0%,transparent 70%)' }} />
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center">

        {/* Logo */}
        <div className="relative mb-3 md:mb-4">
          {!isLight && (
            <div className="absolute inset-0 rounded-full bg-black/40 blur-[24px] scale-110 translate-y-2 pointer-events-none" />
          )}
          <Image
            src="/logo.webp"
            alt="Kerala Employees Portal"
            width={100}
            height={100}
            priority
            className="relative z-10 w-[56px] h-[56px] md:w-[76px] md:h-[76px] lg:w-[88px] lg:h-[88px] rounded-full object-cover"
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
        <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.28em] mb-2 md:mb-3"
          style={{ color: goldDim }}>
          Kerala Government Employees Portal
        </p>

        {/* Headings */}
        <div className="flex flex-col items-center gap-1 md:gap-2 mb-3 md:mb-4">
          <h1
            className="font-malayalam font-bold leading-[1.35] tracking-tight bg-clip-text text-transparent bg-[length:200%_auto]"
            style={{
              fontSize: 'clamp(32px, 6vw, 72px)',
              backgroundImage: titleGrad,
              filter: isLight ? 'none' : 'drop-shadow(0 0 12px rgba(200,150,12,0.35))',
            }}
          >
            കേരള സർക്കാർ
          </h1>
          <h2
            className="font-malayalam font-bold leading-[1.4] tracking-tight bg-[length:200%_auto] bg-clip-text text-transparent"
            style={{
              fontSize: 'clamp(20px, 3.5vw, 46px)',
              backgroundImage: isLight
                ? 'linear-gradient(135deg,#92400e,#c2410c,#92400e)'
                : 'linear-gradient(135deg,#b8860b,#f5d060,#fce38a,#f5d060,#b8860b)',
              filter: isLight ? 'none' : 'drop-shadow(0 0 6px rgba(200,150,12,0.30))',
            }}
          >
            ജീവനക്കാരുടെ വിജ്ഞാനകോശം
          </h2>
        </div>

        {/* Search bar */}
        <button
          onClick={openSearch}
          className="group flex items-center gap-3 w-full max-w-[480px] rounded-2xl px-4 py-3 md:py-3.5 mb-6 md:mb-8 transition-all duration-300 cursor-text hover:scale-[1.01]"
          style={{
            background: isLight ? 'rgba(255,255,255,0.80)' : 'rgba(255,255,255,0.06)',
            border: `1.5px solid ${isLight ? goldDim : gold + '40'}`,
            backdropFilter: 'blur(16px)',
            boxShadow: isLight
              ? `0 2px 12px rgba(0,0,0,0.06), inset 0 0 24px ${gold}15`
              : `0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 24px ${gold}20`,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="flex-1 text-left text-[13px] md:text-[14px]" style={{ color: textMuted }}>
            Search tools, orders, schemes...
          </span>
          <kbd
            className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg"
            style={{ background: `${gold}15`, color: gold, border: `1px solid ${gold}40` }}
          >
            Ctrl K
          </kbd>
        </button>

        {/* Stats bar */}
        <div className="flex items-stretch rounded-2xl overflow-hidden"
          style={{ background: surface, border: `1px solid ${border}` }}>
          {STATS.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center px-4 py-2.5 md:px-6 md:py-3"
              style={{ borderRight: i < STATS.length - 1 ? `1px solid ${border}` : 'none' }}
            >
              <span className="font-black tracking-tight leading-none"
                style={{ fontSize: 'clamp(13px, 1.8vw, 18px)', color: gold }}>
                {s.value}
              </span>
              <span className="text-[8px] md:text-[9px] font-medium uppercase tracking-wider mt-0.5"
                style={{ color: textSub }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Quick-access links */}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {[
            { label: 'Pension',      href: '/pension'    },
            { label: 'Pay Revision', href: '/prc'        },
            { label: 'Leave',        href: '/leave'      },
            { label: 'Forms',        href: '/forms'      },
            { label: 'Govt Orders',  href: '/orders'     },
            { label: 'Income Tax',   href: '/income-tax' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-full text-[11px] font-semibold no-underline transition-all duration-200 hover:scale-105 hover:brightness-110"
              style={{
                background: surfaceMd,
                color: textSub,
                border: `1px solid ${border}`,
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
