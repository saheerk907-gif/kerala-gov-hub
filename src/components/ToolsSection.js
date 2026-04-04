'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const CATEGORIES = [
  {
    icon: '📄',
    title: 'PDF Tools',
    title_ml: 'PDF ടൂളുകൾ',
    desc: 'Edit, merge, split, convert PDFs — all browser-based, files never leave your device',
    href: '/tools',
    color: '#2997ff',
    count: 5,
  },
  {
    icon: '⚙️',
    title: 'Utilities',
    title_ml: 'യൂട്ടിലിറ്റികൾ',
    desc: 'QR code generator, holiday list, and more useful tools',
    href: '/tools',
    color: '#10b981',
    count: 2,
  },
  {
    icon: '🧮',
    title: 'Calculators & Guides',
    title_ml: 'കാൽക്കുലേറ്ററുകൾ',
    desc: 'Pension, DA arrear, income tax, leave, retirement and more calculators',
    href: '/calculators',
    color: '#ff9f0a',
    count: 12,
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href + cat.title}
              href={cat.href}
              className="glass-card glow-top group relative flex flex-col gap-3 p-4 rounded-[20px] no-underline transition-all duration-200 hover:bg-white/[0.06]"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Icon + count */}
              <div className="flex items-start justify-between">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: cat.color + '20', border: `1px solid ${cat.color}35` }}
                >
                  {cat.icon}
                </div>
                <span
                  className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: cat.color + '18', color: cat.color, border: `1px solid ${cat.color}30` }}
                >
                  {cat.count} tools
                </span>
              </div>

              {/* Text */}
              <div>
                <h3 className="text-[14px] font-bold text-white/90 group-hover:text-white transition-colors mb-1">
                  {cat.title}
                </h3>
                <p className="text-[11px] text-white/55 leading-relaxed">{cat.desc}</p>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-1 text-[11px] font-bold mt-auto" style={{ color: cat.color }}>
                Explore
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                  className="group-hover:translate-x-0.5 transition-transform">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
