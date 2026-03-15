'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const SECTIONS = [
  { id: 'tools',              label: 'Tools',         labelMl: 'ടൂളുകൾ',          icon: '🧮' },
  { id: 'orders',             label: 'GOs',           labelMl: 'ഉത്തരവുകൾ',        icon: '📄' },
  { id: 'news',               label: 'News',          labelMl: 'വാർത്ത',            icon: '📰' },
  { id: 'services',           label: 'Schemes',       labelMl: 'പദ്ധതികൾ',          icon: '📋' },
  { id: 'departmental-tests', label: 'Tests',         labelMl: 'ടെസ്റ്റ്',           icon: '🧠' },
  { id: 'links',              label: 'Portals',       labelMl: 'പോർട്ടലുകൾ',        icon: '🔗' },
];

export default function SectionNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);

      // Find which section is in view
      for (const s of [...SECTIONS].reverse()) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(s.id);
          return;
        }
      }
      setActive('');
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (!visible) return null;

  return (
    <div
      className="section-nav fixed top-[56px] lg:top-[88px] left-0 right-0 z-[900] transition-all duration-300"
      style={{
        background: 'rgba(18,20,22,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1.5">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`section-nav-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-bold whitespace-nowrap border-none cursor-pointer transition-all flex-shrink-0`}
              style={{
                background: active === s.id ? 'rgba(41,151,255,0.15)' : 'transparent',
                color: active === s.id ? '#2997ff' : 'rgba(255,255,255,0.65)',
              }}
            >
              <span className="text-sm">{s.icon}</span>
              <span className="hidden sm:inline" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>{s.labelMl}</span>
              <span className="sm:hidden font-sans">{s.label}</span>
            </button>
          ))}

          {/* Divider */}
          <div className="section-nav-divider w-px h-4 bg-white/10 mx-1 flex-shrink-0" />

          {/* Quick links to dedicated pages */}
          <Link href="/departmental-tests"
            className="section-nav-quiz flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap no-underline flex-shrink-0 transition-all"
            style={{ color: 'rgba(255,255,255,0.3)', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#2997ff'; e.currentTarget.style.background = 'rgba(41,151,255,0.10)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'transparent'; }}>
            Quiz →
          </Link>
        </div>
      </div>
    </div>
  );
}
