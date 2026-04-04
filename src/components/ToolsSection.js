'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const pdfTools = [
  {
    icon: '📝',
    title: 'PDF Editor',
    subtitle: 'PDF എഡിറ്റർ',
    desc: 'Edit, annotate, sign and whiteout PDFs — all in your browser, files never leave your device',
    href: '/tools/pdf-editor',
    color: '#2997ff',
    badge: 'New',
  },
  {
    icon: '🗂️',
    title: 'PDF Merger',
    subtitle: 'PDF ലയനം',
    desc: 'Combine multiple PDF files into one — browser-only, files never leave your device',
    href: '/tools/pdf-merger',
    color: '#10b981',
    badge: 'NEW',
  },
  {
    icon: '✂️',
    title: 'PDF Splitter',
    subtitle: 'PDF വിഭജനം',
    desc: 'Extract pages or split a PDF by range — browser-only, files never leave your device',
    href: '/tools/pdf-splitter',
    color: '#0284c7',
    badge: 'NEW',
  },
];

const utilityTools = [
  {
    icon: '⬛',
    title: 'QR Code Generator',
    subtitle: 'QR കോഡ് ജനറേറ്റർ',
    desc: 'Generate QR codes for URLs, portal links, text — custom colour & size',
    href: '/tools/qr-generator',
    color: '#0ea5e9',
    badge: 'NEW',
  },
  {
    icon: '📅',
    title: 'Holiday List 2026',
    subtitle: 'അവധി ദിനങ്ങൾ 2026',
    desc: 'Kerala Govt holidays 2026 — next holiday countdown + iCal export',
    href: '/tools/holiday-list-2026',
    color: '#10b981',
    badge: 'NEW',
  },
];

const tools = [
  {
    icon: '📊',
    title: 'NPS vs APS Comparison Calculator',
    subtitle: 'Pension Comparison Tool',
    desc: 'NPS-ഉം APS-ഉം തമ്മിലുള്ള വ്യത്യാസം — corpus growth, post-retirement charts',
    href: '/nps-aps',
    color: '#ff453a',
    badge: 'NEW',
    tags: ['NPS', 'APS', 'Corpus', 'Pension'],
  },
  {
    icon: '📊',
    title: 'DA Arrear Calculator',
    subtitle: '11th PRC · Mar 2021 onwards',
    desc: 'Month-wise DA arrear with increment & promotion support. All G.O.s included.',
    href: '/da-arrear',
    color: '#ff9f0a',
    badge: 'NEW',
    tags: ['DA Arrear', 'G.O.', 'Month-wise', 'Print'],
  },
  {
    icon: '💰',
    title: 'Pension Calculator',
    subtitle: 'KSR Part III — Monthly Pension',
    desc: 'Average Emoluments, half-year units, family pension — KSR Part III അനുസരിച്ച് പെൻഷൻ കണക്കാക്കൂ',
    href: '/pension',
    color: '#2997ff',
    badge: 'NEW',
    tags: ['Pension', 'AE', 'Family Pension', 'DA'],
  },
  {
    icon: '📅',
    title: 'Leave Calculator',
    subtitle: 'ലീവ് കണക്കുകൂട്ടൽ',
    desc: 'EL, HPL & Commuted Leave balance — "Can I take X days?" eligibility checker per KSR',
    href: '/leave',
    color: '#64d2ff',
    badge: 'NEW',
    tags: ['EL', 'HPL', 'Commuted', 'CL'],
  },
];

const MOBILE_VISIBLE = 2;

function ToolCard({ t }) {
  return (
    <Link
      href={t.href}
      className="glass-card group relative flex flex-col items-start text-left rounded-[16px] p-3.5 no-underline transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] overflow-hidden"
    >
      {t.badge && t.badge !== 'SOON' && (
        <span
          className="absolute top-2 right-2 text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full"
          style={{ background: 'rgba(41,151,255,0.2)', color: '#2997ff', border: '1px solid rgba(41,151,255,0.3)' }}
        >
          NEW
        </span>
      )}
      {t.badge === 'SOON' && (
        <span className="absolute top-2 right-2 text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/50 border border-white/[0.08]">
          SOON
        </span>
      )}
      <div
        className="absolute -top-4 -left-4 w-16 h-16 rounded-full blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ background: t.color + '25' }}
      />
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-xl mb-2.5 transition-transform duration-200 group-hover:scale-105"
        style={{ background: t.color + '20', border: `1px solid ${t.color}35` }}
      >
        {t.icon}
      </div>
      <h3 className="text-[13px] md:text-[14px] font-bold text-white/90 leading-snug mb-0.5 group-hover:text-white transition-colors line-clamp-2" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
        {t.title}
      </h3>
      <div className="text-[8px] font-semibold uppercase tracking-wider leading-tight text-white/70 mb-1.5">
        {t.subtitle}
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: `linear-gradient(90deg, transparent, ${t.color}70, transparent)` }}
      />
    </Link>
  );
}

export default function ToolsSection() {
  const [expanded, setExpanded] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsLight(document.documentElement.getAttribute('data-theme') === 'light');
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const gold = isLight ? '#b45309' : '#f5d060';
  const titleGrad = isLight
    ? 'linear-gradient(135deg,#78350f 0%,#b45309 50%,#78350f 100%)'
    : 'linear-gradient(135deg,#c8960c 0%,#f5d060 38%,#fce38a 52%,#f5d060 68%,#c8960c 100%)';

  return (
    <section id="tools" className="relative py-3 md:py-4 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Section header */}
        <div className="mb-5">
          <div className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] text-white/40 mb-2">Tools & Calculators</div>
          <h2
            className="font-malayalam font-bold leading-[1.2] tracking-tight bg-clip-text text-transparent bg-[length:200%_auto]"
            style={{
              fontSize: 'clamp(22px, 3vw, 40px)',
              backgroundImage: titleGrad,
              filter: isLight ? 'none' : 'drop-shadow(0 0 12px rgba(200,150,12,0.35))',
            }}
          >
            ടൂളുകൾ
          </h2>
          <div className="h-[2px] w-10 bg-gradient-to-r from-[#2997ff] to-transparent mt-2 rounded-full" />
        </div>

        <div className="flex flex-col gap-5">

          {/* PDF Tools box */}
          <div className="glass-card glow-top rounded-[24px] md:rounded-[28px] p-4 md:p-5" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="mb-4 flex items-center gap-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-white/50">PDF Tools</span>
              <div className="flex-1 h-px bg-white/[0.07]" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {pdfTools.map((t) => (
                <ToolCard key={t.href} t={t} />
              ))}
            </div>
          </div>

          {/* Utilities box */}
          <div className="glass-card glow-top rounded-[24px] md:rounded-[28px] p-5 md:p-7" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="mb-4 flex items-center gap-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-white/50">Utilities</span>
              <div className="flex-1 h-px bg-white/[0.07]" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {utilityTools.map((t) => (
                <ToolCard key={t.href} t={t} />
              ))}
            </div>
          </div>

          {/* Calculators & Guides box */}
          <div className="glass-card glow-top rounded-[24px] md:rounded-[28px] p-5 md:p-7" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="mb-4 flex items-center gap-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-white/50">Calculators & Guides</span>
              <div className="flex-1 h-px bg-white/[0.07]" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {tools.map((t, idx) => (
                <div key={t.title} className={idx >= MOBILE_VISIBLE && !expanded ? 'md:block hidden' : 'block'}>
                  <ToolCard t={t} />
                </div>
              ))}
            </div>
            {/* Show more / less — mobile only */}
            <div className="md:hidden mt-4 flex justify-center">
              <button
                onClick={() => setExpanded(v => !v)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-bold transition-all"
                style={{ background: 'rgba(41,151,255,0.08)', color: '#2997ff', border: '1px solid rgba(41,151,255,0.20)' }}
              >
                {expanded ? 'Show less ↑' : `Show all ${tools.length} tools ↓`}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
