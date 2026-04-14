'use client';

function openSearch() {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('open-search'));
}

export default function HeroSearchButton() {
  return (
    <button
      onClick={openSearch}
      className="group flex items-center gap-3 w-full rounded-xl px-4 py-3 mb-6 transition-all duration-150 cursor-text"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(245,208,96,0.30)',
        boxShadow: '0 0 18px rgba(200,150,12,0.10), 0 2px 16px rgba(0,0,0,0.30)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.border = '1px solid rgba(245,208,96,0.60)';
        e.currentTarget.style.boxShadow = '0 0 28px rgba(200,150,12,0.22), 0 2px 16px rgba(0,0,0,0.30)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = '1px solid rgba(245,208,96,0.30)';
        e.currentTarget.style.boxShadow = '0 0 18px rgba(200,150,12,0.10), 0 2px 16px rgba(0,0,0,0.30)';
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="rgba(255,255,255,0.30)" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <span className="flex-1 text-left" style={{ fontSize: 13, color: 'rgba(255,255,255,0.28)' }}>
        Search tools, orders, calculators...
      </span>
      <kbd
        className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md flex-shrink-0"
        style={{
          fontSize: 10, fontWeight: 700,
          color: 'rgba(255,255,255,0.28)',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.09)',
        }}
      >
        ⌘K
      </kbd>
    </button>
  );
}
