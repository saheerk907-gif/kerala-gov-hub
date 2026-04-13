'use client';

function openSearch() {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('open-search'));
}

export default function HeroSearchButton() {
  return (
    <button
      onClick={openSearch}
      className="group flex items-center gap-3 w-full rounded-2xl px-4 py-3.5 mb-5 transition-all duration-200 cursor-text hover:brightness-110"
      style={{
        background: 'rgba(255,255,255,0.08)',
        border: '1.5px solid rgba(245,208,96,0.28)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      {/* Search icon */}
      <svg
        width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke="rgba(245,208,96,0.70)" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        className="flex-shrink-0"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      {/* Placeholder */}
      <span className="flex-1 text-left text-[13px] md:text-[14px]"
        style={{ color: 'rgba(255,255,255,0.38)' }}>
        Search orders, calculators, schemes...
      </span>

      {/* Keyboard hint */}
      <kbd
        className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0"
        style={{
          background: 'rgba(245,208,96,0.10)',
          color: 'rgba(245,208,96,0.65)',
          border: '1px solid rgba(245,208,96,0.22)',
        }}
      >
        ⌘ K
      </kbd>
    </button>
  );
}
