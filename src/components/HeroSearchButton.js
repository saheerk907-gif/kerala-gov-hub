'use client';

const gold      = '#f5d060';
const textMuted = 'rgba(255,255,255,0.40)';

function openSearch() {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('open-search'));
}

export default function HeroSearchButton() {
  return (
    <button
      onClick={openSearch}
      className="group flex items-center gap-3 w-full max-w-[480px] rounded-2xl px-4 py-3 md:py-3.5 mb-6 md:mb-8 transition-all duration-300 cursor-text hover:scale-[1.01]"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: `1.5px solid ${gold}40`,
        backdropFilter: 'blur(16px)',
        boxShadow: `0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 24px ${gold}20`,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <span className="flex-1 text-left text-[13px] md:text-[14px]" style={{ color: textMuted }}>
        Search tools, orders, schemes...
      </span>
      <kbd
        className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg"
        style={{ background: `${gold}15`, color: gold, border: `1px solid ${gold}40` }}
      >
        Ctrl K
      </kbd>
    </button>
  );
}
