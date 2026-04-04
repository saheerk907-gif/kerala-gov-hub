'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }

  const isLight = theme === 'light';

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      title={isLight ? 'Switch to Dark Mode (Night)' : 'Switch to Light Mode (Day)'}
      className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-md md:rounded-lg transition-all duration-200 cursor-pointer flex-shrink-0 relative group"
      style={isLight ? {
        background: 'rgba(0,0,0,0.07)',
        color: '#374151',
        border: '1px solid rgba(0,0,0,0.15)',
      } : {
        background: 'rgba(255,255,255,0.10)',
        color: 'rgba(245,208,96,0.88)',
        border: '1px solid rgba(255,255,255,0.28)',
      }}
    >
      {isLight ? (
        /* Moon icon */
        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 0010 9.79z" />
        </svg>
      ) : (
        /* Sun icon */
        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}
      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
        <div className="bg-black/80 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-md backdrop-blur-sm">
          {isLight ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black/80 rotate-45" />
      </div>
    </button>
  );
}
