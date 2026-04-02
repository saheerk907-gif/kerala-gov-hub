'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const FEATURES = [
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="8" y="4" width="24" height="32" rx="3" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
        <line x1="13" y1="13" x2="27" y2="13" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="13" y1="18" x2="27" y2="18" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="13" y1="23" x2="21" y2="23" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="7" y="3" width="4" height="34" rx="2" fill="rgba(255,255,255,0.25)"/>
      </svg>
    ),
    title: 'GOVERNMENT ORDERS',
    description: 'Browse and download official Kerala government orders and circulars.',
    cta: 'Browse Orders',
    href: '/orders',
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="5" y="5" width="30" height="30" rx="4" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
        <line x1="5" y1="14" x2="35" y2="14" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
        <rect x="10" y="18" width="6" height="5" rx="1" fill="rgba(255,255,255,0.6)"/>
        <rect x="18" y="18" width="6" height="5" rx="1" fill="rgba(255,255,255,0.6)"/>
        <rect x="26" y="18" width="4" height="5" rx="1" fill="rgba(255,255,255,0.6)"/>
        <rect x="10" y="25" width="6" height="5" rx="1" fill="rgba(255,255,255,0.4)"/>
        <rect x="18" y="25" width="6" height="5" rx="1" fill="rgba(255,255,255,0.4)"/>
        <rect x="26" y="25" width="4" height="5" rx="1" fill="rgba(255,255,255,0.7)"/>
      </svg>
    ),
    title: 'CALCULATORS',
    description: 'Access pension, pay revision, income tax and other government calculators.',
    cta: 'Calculate Now',
    href: '/tools',
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="15" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
        <path d="M14 20 C14 16 17 13 20 13 C23 13 26 16 26 20" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <circle cx="20" cy="22" r="3" fill="rgba(255,255,255,0.8)"/>
        <path d="M12 26 Q20 30 28 26" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </svg>
    ),
    title: 'SCHEMES',
    description: 'Discover welfare schemes and benefits available for government employees.',
    cta: 'Discover Schemes',
    href: '/schemes',
  },
];

export default function FeatureCarousel() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + FEATURES.length) % FEATURES.length);
  const next = () => setCurrent((c) => (c + 1) % FEATURES.length);

  // Compute indices for the 3 visible cards
  const indices = [
    (current) % FEATURES.length,
    (current + 1) % FEATURES.length,
    (current + 2) % FEATURES.length,
  ];

  return (
    <div className="relative z-10 -mt-16 md:-mt-20 pb-6 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto flex items-center gap-3">
        {/* Prev button */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.18)',
            backdropFilter: 'blur(8px)',
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3 L5 8 L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Cards */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {indices.map((idx, pos) => {
            const f = FEATURES[idx];
            return (
              <div
                key={idx}
                className="rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300"
                style={{
                  background: 'rgba(20,22,28,0.72)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.40)',
                  opacity: pos === 0 || pos === 1 || pos === 2 ? 1 : 0,
                  display: pos <= 2 ? 'flex' : 'none',
                }}
              >
                <div>{f.icon}</div>
                <h3 className="text-white font-bold text-[13px] tracking-wider">{f.title}</h3>
                <p className="text-[rgba(255,255,255,0.60)] text-[12px] leading-relaxed flex-1">{f.description}</p>
                <Link
                  href={f.href}
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-4 py-2 rounded-lg no-underline transition-all duration-200 hover:brightness-110 hover:scale-105 self-start"
                  style={{
                    background: 'rgba(200,150,12,0.20)',
                    color: '#f5d060',
                    border: '1px solid rgba(200,150,12,0.35)',
                  }}
                >
                  {f.cta}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Next button */}
        <button
          onClick={next}
          aria-label="Next"
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.18)',
            backdropFilter: 'blur(8px)',
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3 L11 8 L6 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
