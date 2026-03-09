'use client';

import React from 'react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative min-h-[55vh] flex flex-col items-center justify-center text-center px-4 pt-[56px] lg:pt-[88px] pb-8 overflow-hidden">

      {/* ── Background: Secretariat building ─────────────── */}
      <div className="absolute inset-0 z-0">
        {/* Building image — next/image with priority for instant load */}
        <Image
          src="/kerala-secretariat.jpg"
          alt=""
          fill
          priority
          fetchPriority="high"
          className="object-cover object-[center_40%] opacity-[0.18]"
          style={{ filter: 'grayscale(60%) brightness(0.9) contrast(1.05)' }}
          sizes="100vw"
        />
        {/* Vignette — darken edges, keep center clear for logo */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#121416]/90 via-transparent to-[#121416]/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121416] via-transparent to-[#121416]/60" />
        {/* Radial spotlight so the logo area is cleanest */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 70% at 50% 45%, transparent 30%, rgba(18,20,22,0.55) 100%)',
          }}
        />
      </div>

      {/* ── Ambient — very subtle, behind logo only ──────── */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[320px] h-[320px] rounded-full blur-[90px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(200,150,12,0.07) 0%, transparent 70%)' }} />

      {/* ── Content ──────────────────────────────────────── */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">

        {/* Live badge */}
        <div className="glass-pill flex items-center gap-2.5 px-5 py-2 rounded-full mb-6 animate-bounce-slow">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/65">
            Edition 2025–26
          </span>
        </div>

        {/* ── Logo ─────────────────────────────────────────── */}
        <div className="relative mb-6 group cursor-pointer">
          {/* Deep drop shadow for lift */}
          <div className="absolute inset-0 rounded-full bg-black/50 blur-[28px] scale-[1.05] translate-y-3 pointer-events-none" />

          <Image
            src="/logo.webp"
            alt="Kerala Gov Employee Hub Logo"
            width={120}
            height={120}
            priority
            fetchPriority="high"
            className="relative z-10 w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{
              boxShadow:
                '0 0 0 2px rgba(200,150,12,0.55), ' +
                '0 0 18px 4px rgba(200,150,12,0.22), ' +
                '0 0 50px 12px rgba(200,150,12,0.10), ' +
                '0 20px 50px rgba(0,0,0,0.55)',
            }}
          />
        </div>

        {/* English SEO title — immediately tells Google & new visitors what this site is */}
        <p className="text-[11px] font-black uppercase tracking-[0.25em] text-white/55 mb-2">
          Kerala Government Employees Portal
        </p>

        {/* Title */}
        <div className="flex flex-col gap-3">
          <h1 className="text-[clamp(40px,7.5vw,84px)] font-bold leading-[1] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
            കേരള സർക്കാർ
          </h1>
          <h2 className="text-[clamp(24px,4.5vw,56px)] font-bold leading-[1.15] tracking-tight">
            <span className="bg-gradient-to-r from-white/50 via-white to-white/50 bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer">
              ജീവനക്കാരുടെ വിജ്ഞാനകോശം
            </span>
          </h2>
        </div>

        {/* Subtitle */}
        <p
          className="mt-4 text-[clamp(13px,1.8vw,16px)] text-white/70 max-w-[580px] leading-relaxed font-medium px-4"
                 >
          സേവന ചട്ടങ്ങൾ മുതൽ ശമ്പള പരിഷ്കരണം വരെ. സർവീസിലുള്ളവർക്കും
          വിരമിച്ചവർക്കും ആവശ്യമായ എല്ലാ വിവരങ്ങളും ഇപ്പോൾ വിരൽത്തുമ്പിൽ.
        </p>

        {/* Feature pills — topic keywords visible to Google and users */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {[
            { label: 'MEDISEP', href: '/medisep' },
            { label: 'Pension', href: '/pension' },
            { label: 'Service Rules', href: '/ksr' },
            { label: 'Calculators', href: '#tools' },
            { label: 'Govt Orders', href: '#orders' },
            { label: 'Departmental Tests', href: '/departmental-tests' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="px-4 py-2 min-h-[36px] inline-flex items-center rounded-full text-[11px] font-bold no-underline transition-all hover:bg-white/10"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center">
          <a
            href="#services"
            className="px-10 py-4 bg-white text-[#121416] rounded-full text-[14px] font-black uppercase tracking-wider hover:bg-[#c8960c] hover:text-white transition-all duration-300 shadow-[0_8px_32px_rgba(255,255,255,0.12)] hover:shadow-[0_8px_32px_rgba(200,150,12,0.35)] hover:scale-105 no-underline"
          >
            വിഭവങ്ങൾ കാണുക
          </a>
          <a
            href="#orders"
            className="px-10 py-4 text-white/85 border border-white/20 rounded-full text-[14px] font-black uppercase tracking-wider glass-pill hover:border-white/40 hover:text-white transition-all duration-300 hover:scale-105 no-underline"
          >
            പുതിയ ഉത്തരവുകൾ
          </a>
        </div>

      </div>
    </section>
  );
}
