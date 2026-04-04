'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const FEATURE_CARDS = [
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: 'GOVERNMENT ORDERS',
    desc: 'Browse and search published Kerala Government Orders, circulars and notifications.',
    cta: 'Browse Orders',
    href: '/orders',
    color: '#1a6fc4',
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <path d="M7 8h2m2 0h2m2 0h2M7 12h2m4 0h2" />
      </svg>
    ),
    title: 'CALCULATORS',
    desc: 'Pension, pay revision, income tax, GPF, DA arrear and more government calculators.',
    cta: 'Calculate Now',
    href: '/tools',
    color: '#1a6fc4',
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      </svg>
    ),
    title: 'SCHEMES',
    desc: 'Discover government welfare schemes and benefits available for Kerala employees.',
    cta: 'Discover Schemes',
    href: '/tools',
    color: '#1a6fc4',
  },
];

export default function Hero() {
  function openSearch() {
    window.dispatchEvent(new CustomEvent('open-search'));
  }

  return (
    <section className="relative overflow-hidden" style={{ background: '#fff' }}>

      {/* Hero image area */}
      <div className="relative w-full" style={{ minHeight: '480px' }}>
        {/* Secretariat background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/kerala-secretariat.jpg"
            alt="Kerala Secretariat"
            fill
            priority
            fetchPriority="high"
            className="object-cover object-[center_65%]"
            style={{ filter: 'brightness(0.72) contrast(1.05)' }}
            sizes="100vw"
          />
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(10,20,40,0.55) 0%, rgba(10,20,40,0.30) 55%, rgba(10,20,40,0.70) 100%)' }} />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-[80px] pb-[160px] md:pb-[180px]"
          style={{ minHeight: '480px' }}>

          {/* Malayalam title */}
          <h1
            className="font-malayalam font-bold leading-[1.2] text-white mb-2"
            style={{ fontSize: 'clamp(28px, 5.5vw, 68px)', textShadow: '0 2px 16px rgba(0,0,0,0.5)' }}
          >
            കേരള സർക്കാർ ജീവനക്കാരുടെ
          </h1>
          <h2
            className="font-malayalam font-bold leading-[1.25] text-white mb-6"
            style={{ fontSize: 'clamp(18px, 3.2vw, 44px)', textShadow: '0 2px 12px rgba(0,0,0,0.4)', opacity: 0.92 }}
          >
            വിജ്ഞാനകോശം: നിങ്ങളുടെ വഴികാട്ടി
          </h2>

          {/* Search bar */}
          <div className="flex items-center w-full max-w-[520px] rounded-2xl overflow-hidden shadow-lg"
            style={{ background: 'rgba(255,255,255,0.97)', border: '1.5px solid rgba(255,255,255,0.6)' }}>
            <button
              onClick={openSearch}
              className="flex items-center gap-3 flex-1 px-4 py-3 md:py-3.5 cursor-text text-left bg-transparent border-none"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="text-[13px] md:text-[14px]" style={{ color: '#aaa' }}>
                Search tools, orders, schemes...
              </span>
            </button>
            <button
              onClick={openSearch}
              className="flex-shrink-0 h-full px-5 py-3 md:py-3.5 font-bold text-[13px] text-white cursor-pointer border-none"
              style={{ background: '#1a6fc4', borderRadius: '0 14px 14px 0' }}
            >
              Explore
            </button>
          </div>

        </div>
      </div>

      {/* Feature cards — overlapping hero bottom */}
      <div className="relative z-20 max-w-[1100px] mx-auto px-4 md:px-6"
        style={{ marginTop: '-120px' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {FEATURE_CARDS.map((card, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 flex flex-col gap-3 shadow-xl"
              style={{ background: 'rgba(255,255,255,0.97)', border: '1px solid rgba(0,0,0,0.08)' }}
            >
              <div style={{ color: card.color }}>{card.icon}</div>
              <h3 className="font-black text-[13px] tracking-wide" style={{ color: '#1a1a2e' }}>
                {card.title}
              </h3>
              <p className="text-[12px] leading-relaxed flex-1" style={{ color: '#555' }}>
                {card.desc}
              </p>
              <Link
                href={card.href}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-[12px] font-bold text-white no-underline transition-opacity hover:opacity-90"
                style={{ background: card.color, alignSelf: 'flex-start' }}
              >
                {card.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom white padding */}
      <div className="h-8 md:h-10" style={{ background: '#fff' }} />

    </section>
  );
}
