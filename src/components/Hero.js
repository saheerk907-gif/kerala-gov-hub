'use client';

import React from 'react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="hero-section relative min-h-[55vh] flex flex-col items-center justify-center text-center px-4 pt-[56px] lg:pt-[88px] pb-12 overflow-hidden">

      {/* ── Background: Secretariat building ─────────────── */}
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
        {/* Side vignettes — softer so building feels present */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#121416]/80 via-transparent to-[#121416]/80" />
        {/* Top fade — clean entry */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#121416]/70 via-transparent to-transparent" />
        {/* Bottom — building roofline visible, fades into page */}
        <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-[#121416] via-[#121416]/60 to-transparent" />
      </div>

      {/* ── Gold ambient glow centered behind logo ────────── */}
      <div
        className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[360px] h-[360px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(200,150,12,0.10) 0%, transparent 70%)' }}
      />

      {/* ── Content ──────────────────────────────────────── */}
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-0">

        {/* Logo with badge overlaid */}
        <div className="relative mb-5 group cursor-pointer">
          {/* Drop shadow */}
          <div className="absolute inset-0 rounded-full bg-black/50 blur-[28px] scale-[1.05] translate-y-3 pointer-events-none" />

          <Image
            src="/logo.webp"
            alt="Kerala Gov Employee Hub Logo"
            width={120}
            height={120}
            priority
            fetchPriority="high"
            className="relative z-10 w-[96px] h-[96px] md:w-[112px] md:h-[112px] rounded-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{
              boxShadow:
                '0 0 0 2px rgba(200,150,12,0.55), ' +
                '0 0 18px 4px rgba(200,150,12,0.22), ' +
                '0 0 50px 12px rgba(200,150,12,0.10), ' +
                '0 20px 50px rgba(0,0,0,0.55)',
            }}
          />

        </div>

        {/* Kicker — SEO label above the main title */}
        <p className="text-[10px] font-black uppercase tracking-[0.28em] mb-3" style={{ color: 'rgba(245,208,96,0.70)' }}>
          Kerala Government Employees Portal
        </p>

        {/* Titles — tight single typographic block */}
        <div className="flex flex-col items-center gap-1.5 mb-4">
          <h1 className="text-[clamp(38px,7vw,80px)] font-bold leading-[1] tracking-tight">
            <span className="bg-clip-text text-transparent" style={{
              backgroundImage: 'linear-gradient(135deg, #c8960c 0%, #f5d060 35%, #fce38a 52%, #f5d060 68%, #c8960c 100%)',
              filter: 'drop-shadow(0 0 8px rgba(200,150,12,0.50))',
            }}>
              കേരള സർക്കാർ
            </span>
          </h1>
          {/* Thin gold rule connecting both lines */}
          <div className="w-12 h-[1.5px] rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,150,12,0.8), transparent)' }} />
          <h2 className="text-[clamp(22px,4vw,52px)] font-bold leading-[1.15] tracking-tight">
            <span className="bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]" style={{
              backgroundImage: 'linear-gradient(135deg, #b8860b, #f5d060, #fce38a, #f5d060, #b8860b)',
              filter: 'drop-shadow(0 0 6px rgba(200,150,12,0.40))',
            }}>
              ജീവനക്കാരുടെ വിജ്ഞാനകോശം
            </span>
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-[clamp(12px,1.6vw,15px)] max-w-[520px] leading-relaxed font-medium px-2 mb-5" style={{ color: 'rgba(252,227,138,0.80)' }}>
          സേവന ചട്ടങ്ങൾ മുതൽ ശമ്പള പരിഷ്കരണം വരെ. സർവീസിലുള്ളവർക്കും
          വിരമിച്ചവർക്കും ആവശ്യമായ എല്ലാ വിവരങ്ങളും ഇപ്പോൾ വിരൽത്തുമ്പിൽ.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
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
              className="px-4 py-2 inline-flex items-center rounded-full text-[11px] font-bold no-underline transition-all hover:bg-white/10"
              style={{ background: 'rgba(255,255,255,0.10)', color: 'rgba(245,208,96,0.88)', border: '1px solid rgba(255,255,255,0.28)' }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Scroll down button */}
        <button
          onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="group flex flex-col items-center gap-2 bg-transparent border-none cursor-pointer mt-2"
          aria-label="Scroll to explore"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] transition-colors" style={{ color: 'rgba(245,208,96,0.55)' }}>
            Explore
          </span>
          <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-y-1" style={{ border: '1px solid rgba(200,150,12,0.30)' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ color: 'rgba(245,208,96,0.55)' }}>
              <path d="M2 4l4 4 4-4"/>
            </svg>
          </div>
        </button>

      </div>


    </section>
  );
}
