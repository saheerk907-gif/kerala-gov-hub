'use client';
import { useState, useEffect } from 'react';

const TABS = [
  {
    id: 'top',
    label: 'Home',
    href: '#',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: 'tools',
    label: 'Tools',
    href: '#tools',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    id: 'orders',
    label: 'Orders',
    href: '#orders',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    id: 'news',
    label: 'News',
    href: '#news',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2V9c0-1.1.9-2 2-2h2"/>
        <path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/>
      </svg>
    ),
  },
  {
    id: 'links',
    label: 'Portals',
    href: '#links',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
];

export default function MobileBottomNav() {
  const [active, setActive] = useState('top');
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const checkTheme = () =>
      setIsLight(document.documentElement.getAttribute('data-theme') === 'light');
    checkTheme();
    const mo = new MutationObserver(checkTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    const sections = ['tools', 'orders', 'news', 'links'];
    const observers = [];

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '-40% 0px -55% 0px' }
      );
      io.observe(el);
      observers.push(io);
    });

    const onScroll = () => {
      if (window.scrollY < 200) setActive('top');
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observers.forEach(io => io.disconnect());
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const bg    = isLight ? 'rgba(248,244,238,0.96)' : 'rgba(16,18,20,0.96)';
  const bdr   = isLight ? 'rgba(0,0,0,0.09)'       : 'rgba(255,255,255,0.07)';
  const dim   = isLight ? 'rgba(15,23,42,0.40)'    : 'rgba(255,255,255,0.38)';

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: bg,
        borderTop: `1px solid ${bdr}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-stretch h-14">
        {TABS.map(tab => {
          const isActive = active === tab.id;
          const accent = '#2997ff';
          return (
            <a
              key={tab.id}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 no-underline transition-all duration-200 active:scale-95"
              style={{ color: isActive ? accent : dim }}
              onClick={() => setActive(tab.id)}
            >
              <span
                className="relative flex items-center justify-center"
                style={{
                  color: isActive ? accent : dim,
                }}
              >
                {/* active dot */}
                {isActive && (
                  <span
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: accent }}
                  />
                )}
                {tab.icon}
              </span>
              <span
                className="text-[9px] font-bold uppercase tracking-wide leading-none"
                style={{ color: isActive ? accent : dim }}
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
