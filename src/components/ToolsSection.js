'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// ─── Inline SVG illustrations for each card ───────────────────────────────────
const PDF_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='280' height='200' viewBox='0 0 280 200'>
  <rect x='10' y='55' width='115' height='150' rx='9' fill='rgba(255,255,255,0.03)' stroke='rgba(255,255,255,0.1)' stroke-width='1.5'/>
  <rect x='32' y='33' width='115' height='150' rx='9' fill='rgba(255,255,255,0.04)' stroke='rgba(255,255,255,0.13)' stroke-width='1.5'/>
  <rect x='54' y='11' width='115' height='150' rx='9' fill='rgba(255,255,255,0.05)' stroke='rgba(255,255,255,0.2)' stroke-width='1.5'/>
  <line x1='75' y1='40' x2='152' y2='40' stroke='rgba(255,255,255,0.13)' stroke-width='1.2'/>
  <line x1='75' y1='58' x2='152' y2='58' stroke='rgba(255,255,255,0.1)' stroke-width='1.2'/>
  <line x1='75' y1='76' x2='135' y2='76' stroke='rgba(255,255,255,0.09)' stroke-width='1.2'/>
  <line x1='75' y1='94' x2='145' y2='94' stroke='rgba(255,255,255,0.08)' stroke-width='1.2'/>
  <line x1='75' y1='112' x2='125' y2='112' stroke='rgba(255,255,255,0.07)' stroke-width='1.2'/>
  <rect x='185' y='18' width='70' height='90' rx='6' fill='rgba(255,255,255,0.03)' stroke='rgba(255,255,255,0.08)' stroke-width='1'/>
  <line x1='197' y1='38' x2='243' y2='38' stroke='rgba(255,255,255,0.07)' stroke-width='1'/>
  <line x1='197' y1='52' x2='243' y2='52' stroke='rgba(255,255,255,0.07)' stroke-width='1'/>
  <line x1='197' y1='66' x2='228' y2='66' stroke='rgba(255,255,255,0.06)' stroke-width='1'/>
  <rect x='195' y='125' width='55' height='70' rx='5' fill='rgba(255,255,255,0.02)' stroke='rgba(255,255,255,0.06)' stroke-width='1'/>
  <line x1='205' y1='140' x2='240' y2='140' stroke='rgba(255,255,255,0.05)' stroke-width='1'/>
  <line x1='205' y1='154' x2='240' y2='154' stroke='rgba(255,255,255,0.05)' stroke-width='1'/>
</svg>`;

const UTIL_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='280' height='200' viewBox='0 0 280 200'>
  <circle cx='175' cy='115' r='72' fill='none' stroke='rgba(255,255,255,0.07)' stroke-width='1.5' stroke-dasharray='10 5'/>
  <circle cx='175' cy='115' r='54' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='1.5'/>
  <circle cx='175' cy='115' r='24' fill='rgba(255,255,255,0.05)' stroke='rgba(255,255,255,0.16)' stroke-width='1.5'/>
  <rect x='169' y='43' width='12' height='22' rx='5' fill='rgba(255,255,255,0.18)'/>
  <rect x='169' y='165' width='12' height='22' rx='5' fill='rgba(255,255,255,0.18)'/>
  <rect x='101' y='109' width='22' height='12' rx='5' fill='rgba(255,255,255,0.18)'/>
  <rect x='227' y='109' width='22' height='12' rx='5' fill='rgba(255,255,255,0.18)'/>
  <rect x='119' y='63' width='12' height='20' rx='5' fill='rgba(255,255,255,0.13)' transform='rotate(45 125 73)'/>
  <rect x='218' y='63' width='12' height='20' rx='5' fill='rgba(255,255,255,0.13)' transform='rotate(-45 224 73)'/>
  <rect x='119' y='148' width='12' height='20' rx='5' fill='rgba(255,255,255,0.13)' transform='rotate(-45 125 158)'/>
  <rect x='218' y='148' width='12' height='20' rx='5' fill='rgba(255,255,255,0.13)' transform='rotate(45 224 158)'/>
  <circle cx='70' cy='52' r='28' fill='none' stroke='rgba(255,255,255,0.07)' stroke-width='1' stroke-dasharray='6 3'/>
  <circle cx='70' cy='52' r='12' fill='none' stroke='rgba(255,255,255,0.09)' stroke-width='1'/>
  <line x1='70' y1='24' x2='70' y2='32' stroke='rgba(255,255,255,0.1)' stroke-width='2.5' stroke-linecap='round'/>
  <line x1='70' y1='72' x2='70' y2='80' stroke='rgba(255,255,255,0.1)' stroke-width='2.5' stroke-linecap='round'/>
  <line x1='42' y1='52' x2='50' y2='52' stroke='rgba(255,255,255,0.1)' stroke-width='2.5' stroke-linecap='round'/>
  <line x1='90' y1='52' x2='98' y2='52' stroke='rgba(255,255,255,0.1)' stroke-width='2.5' stroke-linecap='round'/>
</svg>`;

const CALC_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='280' height='200' viewBox='0 0 280 200'>
  <line x1='15' y1='38' x2='268' y2='38' stroke='rgba(255,255,255,0.05)' stroke-width='1'/>
  <line x1='15' y1='72' x2='268' y2='72' stroke='rgba(255,255,255,0.05)' stroke-width='1'/>
  <line x1='15' y1='106' x2='268' y2='106' stroke='rgba(255,255,255,0.05)' stroke-width='1'/>
  <line x1='15' y1='140' x2='268' y2='140' stroke='rgba(255,255,255,0.05)' stroke-width='1'/>
  <line x1='15' y1='174' x2='268' y2='174' stroke='rgba(255,255,255,0.05)' stroke-width='1'/>
  <rect x='18' y='108' width='26' height='66' rx='4' fill='rgba(255,255,255,0.1)'/>
  <rect x='56' y='75' width='26' height='99' rx='4' fill='rgba(255,255,255,0.12)'/>
  <rect x='94' y='90' width='26' height='84' rx='4' fill='rgba(255,255,255,0.1)'/>
  <rect x='132' y='55' width='26' height='119' rx='4' fill='rgba(255,255,255,0.13)'/>
  <rect x='170' y='80' width='26' height='94' rx='4' fill='rgba(255,255,255,0.11)'/>
  <rect x='208' y='62' width='26' height='112' rx='4' fill='rgba(255,255,255,0.12)'/>
  <rect x='246' y='44' width='20' height='130' rx='4' fill='rgba(255,255,255,0.09)'/>
  <polyline points='31,108 69,75 107,90 145,55 183,80 221,62 256,44' fill='none' stroke='rgba(255,255,255,0.28)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>
  <circle cx='31' cy='108' r='3.5' fill='rgba(255,255,255,0.5)'/>
  <circle cx='69' cy='75' r='3.5' fill='rgba(255,255,255,0.5)'/>
  <circle cx='107' cy='90' r='3.5' fill='rgba(255,255,255,0.5)'/>
  <circle cx='145' cy='55' r='3.5' fill='rgba(255,255,255,0.5)'/>
  <circle cx='183' cy='80' r='3.5' fill='rgba(255,255,255,0.5)'/>
  <circle cx='221' cy='62' r='3.5' fill='rgba(255,255,255,0.5)'/>
  <circle cx='256' cy='44' r='3.5' fill='rgba(255,255,255,0.5)'/>
</svg>`;

const CATEGORIES = [
  {
    icon: '📄',
    title: 'PDF Tools',
    desc: 'Edit, merge, split, convert PDFs — all browser-based, files never leave your device',
    href: '/tools',
    color: '#10b981',
    colorRgb: '16,185,129',
    count: 5,
    svg: PDF_SVG,
  },
  {
    icon: '⚙️',
    title: 'Utilities',
    desc: 'QR code generator, holiday list, and more useful tools',
    href: '/tools',
    color: '#14b8a6',
    colorRgb: '20,184,166',
    count: 2,
    svg: UTIL_SVG,
  },
  {
    icon: '🧮',
    title: 'Calculators & Guides',
    desc: 'Pension, DA arrear, income tax, leave, retirement and more calculators',
    href: '/calculators',
    color: '#f59e0b',
    colorRgb: '245,158,11',
    count: 12,
    svg: CALC_SVG,
  },
];

export default function ToolsSection() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsLight(document.documentElement.getAttribute('data-theme') === 'light');
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const titleGrad = isLight
    ? 'linear-gradient(135deg,#78350f 0%,#b45309 50%,#78350f 100%)'
    : 'linear-gradient(135deg,#c8960c 0%,#f5d060 38%,#fce38a 52%,#f5d060 68%,#c8960c 100%)';

  return (
    <section id="tools" className="relative py-3 md:py-4 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Section header */}
        <div className="mb-4">
          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-1">Tools & Calculators</div>
          <h2
            className="font-malayalam font-bold leading-[1.2] tracking-tight bg-clip-text text-transparent bg-[length:200%_auto]"
            style={{
              fontSize: 'clamp(20px, 2.5vw, 34px)',
              backgroundImage: titleGrad,
              filter: isLight ? 'none' : 'drop-shadow(0 0 12px rgba(200,150,12,0.35))',
            }}
          >
            ടൂളുകൾ
          </h2>
        </div>

        {/* Trending tools */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-[9px] font-black uppercase tracking-widest text-white/35 self-center mr-1">Trending:</span>
          {[
            { label: 'PDF Editor', href: '/tools/pdf-editor', icon: '📝' },
            { label: 'PDF Merger', href: '/tools/pdf-merger', icon: '🗂️' },
            { label: 'PDF Splitter', href: '/tools/pdf-splitter', icon: '✂️' },
            { label: 'NPS vs APS', href: '/nps-aps', icon: '📊' },
            { label: 'DA Arrear', href: '/da-arrear', icon: '💸' },
            { label: 'Leave Calc', href: '/leave', icon: '📅' },
            { label: 'Holiday List', href: '/tools/holiday-list-2026', icon: '🗓️' },
          ].map(t => (
            <Link
              key={t.href}
              href={t.href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold no-underline transition-all hover:bg-white/[0.10]"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.09)' }}
            >
              <span className="text-[12px]">{t.icon}</span>
              {t.label}
            </Link>
          ))}
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href + cat.title}
              href={cat.href}
              className="group relative flex flex-col gap-3 p-5 rounded-[20px] no-underline overflow-hidden transition-all duration-300 hover:scale-[1.015]"
              style={{
                background: `rgba(${cat.colorRgb},0.07)`,
                border: `1px solid rgba(${cat.colorRgb},0.18)`,
                minHeight: 160,
              }}
            >
              {/* Background illustration */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(cat.svg)}")`,
                  backgroundSize: '72%',
                  backgroundPosition: 'right center',
                  backgroundRepeat: 'no-repeat',
                  opacity: 0.9,
                  transition: 'opacity 0.3s',
                }}
                className="group-hover:opacity-100"
              />
              {/* Left-to-right fade so text stays readable */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(to right, rgba(${cat.colorRgb},0.18) 0%, rgba(8,12,18,0.82) 38%, rgba(8,12,18,0.5) 65%, transparent 100%)`,
                }}
              />

              {/* Content — sits above the illustration */}
              <div className="relative z-10 flex flex-col gap-3 h-full">
                {/* Icon + badge row */}
                <div className="flex items-start justify-between">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: `rgba(${cat.colorRgb},0.18)`, border: `1px solid rgba(${cat.colorRgb},0.3)` }}
                  >
                    {cat.icon}
                  </div>
                  <span
                    className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ background: `rgba(${cat.colorRgb},0.15)`, color: cat.color, border: `1px solid rgba(${cat.colorRgb},0.3)` }}
                  >
                    {cat.count} TOOLS
                  </span>
                </div>

                {/* Title + description */}
                <div className="mt-1">
                  <h3 className="text-[15px] font-bold text-white/95 group-hover:text-white transition-colors mb-1.5">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{cat.desc}</p>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-1 text-[11px] font-bold mt-auto" style={{ color: cat.color }}>
                  Explore
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                    className="group-hover:translate-x-0.5 transition-transform">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
