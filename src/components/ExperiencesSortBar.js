'use client';

const SORT_OPTIONS = [
  { value: 'trending', label: '🔥 Trending' },
  { value: 'top',      label: '⭐ Top Rated' },
  { value: 'new',      label: '🕐 പുതിയത്' },
];

export default function ExperiencesSortBar({ sortBy, setSortBy, anonOnly, setAnonOnly }) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
      {/* Sort tabs */}
      <div className="flex items-center gap-1">
        {SORT_OPTIONS.map((opt) => {
          const active = sortBy === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className="px-3 py-2 text-[12px] font-semibold transition-all cursor-pointer rounded-xl"
              style={{
                background: active ? 'rgba(48,209,88,0.1)' : 'transparent',
                color: active ? 'var(--accent-green)' : 'var(--text-secondary)',
                border: active ? '1px solid rgba(48,209,88,0.25)' : '1px solid transparent',
                borderBottom: active ? '2px solid var(--accent-green)' : '2px solid transparent',
                borderRadius: active ? '10px 10px 0 0' : '10px',
                fontFamily: opt.value === 'new' ? 'var(--font-noto-malayalam), sans-serif' : undefined,
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Anonymous filter toggle */}
      <button
        onClick={() => setAnonOnly((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all cursor-pointer"
        style={{
          background: anonOnly ? 'var(--surface-md)' : 'transparent',
          color: anonOnly ? 'var(--text-primary)' : 'var(--text-faint)',
          border: anonOnly ? '1px solid var(--border-md)' : '1px solid var(--border-sm)',
        }}
      >
        👤 അജ്ഞാതം മാത്രം
      </button>
    </div>
  );
}
