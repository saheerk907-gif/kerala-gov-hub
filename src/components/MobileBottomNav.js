'use client';
import { useState, useEffect } from 'react';

const TABS = [
  {
    id: 'tools',
    label: 'Tools',
    href: '#tools',
    color: '#2997ff',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    id: 'orders',
    label: 'G.O.',
    href: '#orders',
    color: '#ff9f0a',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    id: 'community',
    label: 'Community',
    href: '#community',
    color: '#30d158',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: 'departmental-tests',
    label: 'Dept Test',
    href: '#departmental-tests',
    color: '#bf5af2',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
  },
  {
    id: 'audio-classes',
    label: 'Audio',
    href: '#audio-classes',
    color: '#ff453a',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="18" cy="16" r="3"/>
      </svg>
    ),
  },
];

export default function MobileBottomNav() {
  const [active, setActive] = useState('tools');
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsLight(document.documentElement.getAttribute('data-theme') === 'light');
    check();
    const mo = new MutationObserver(check);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    const ids = TABS.map(t => t.id);
    const observers = [];

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '-30% 0px -60% 0px' }
      );
      io.observe(el);
      observers.push(io);
    });

    return () => observers.forEach(io => io.disconnect());
  }, []);

  const bg  = isLight ? 'rgba(255,252,248,0.98)' : 'rgba(14,16,18,0.98)';
  const bdr = isLight ? 'rgba(0,0,0,0.12)'        : 'rgba(255,255,255,0.10)';
  const dim = isLight ? 'rgba(15,23,42,0.38)'     : 'rgba(255,255,255,0.36)';

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: bg,
        borderTop: `1.5px solid ${bdr}`,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: isLight
          ? '0 -4px 24px rgba(0,0,0,0.08)'
          : '0 -4px 24px rgba(0,0,0,0.40)',
      }}
    >
      <div className="flex items-stretch h-[58px]">
        {TABS.map(tab => {
          const isActive = active === tab.id;
          return (
            <a
              key={tab.id}
              href={tab.href}
              onClick={() => setActive(tab.id)}
              className="flex-1 flex flex-col items-center justify-center gap-[3px] no-underline transition-all duration-150 active:scale-90"
              style={{ color: isActive ? tab.color : dim }}
            >
              {/* Icon container — pill bg when active */}
              <span
                className="flex items-center justify-center w-8 h-7 rounded-xl transition-all duration-200"
                style={isActive ? { background: tab.color + '20' } : {}}
              >
                {tab.icon}
              </span>
              <span
                className="text-[9px] font-bold tracking-wide leading-none"
                style={{ color: isActive ? tab.color : dim }}
              >
                {tab.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
