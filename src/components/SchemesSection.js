'use client';
import Link from 'next/link';

const COLORS = {
  blue:   { text: '#2997ff', bg: 'rgba(41,151,255,0.12)',  border: 'rgba(41,151,255,0.22)' },
  green:  { text: '#30d158', bg: 'rgba(48,209,88,0.12)',   border: 'rgba(48,209,88,0.22)'  },
  orange: { text: '#ff9f0a', bg: 'rgba(255,159,10,0.12)',  border: 'rgba(255,159,10,0.22)' },
  purple: { text: '#bf5af2', bg: 'rgba(191,90,242,0.12)',  border: 'rgba(191,90,242,0.22)' },
  pink:   { text: '#ff375f', bg: 'rgba(255,55,95,0.12)',   border: 'rgba(255,55,95,0.22)'  },
  teal:   { text: '#64d2ff', bg: 'rgba(100,210,255,0.12)', border: 'rgba(100,210,255,0.22)'},
};

export default function SchemesSection({ schemes }) {
  if (!schemes?.length) return null;

  // KSR sub-rules belong inside /ksr — exclude from homepage Resources
  const KSR_KEYWORDS = ['ksr', 'rule', ' sr ', 'joining time', 'maternity', 'paternity', 'study leave', 'transfer ta', 'family pension', 'disciplinary', 'earned leave', 'dcrg', 'gratuity'];
  const filtered = schemes.filter(s => {
    const combined = [s.subtitle_en, s.title_en, s.title_ml].join(' ').toLowerCase();
    return !KSR_KEYWORDS.some(kw => combined.includes(kw));
  });

  if (!filtered.length) return null;

  return (
    <section id="services" className="relative py-7 md:py-10 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="mb-6">
          <div className="section-label mb-2">Resources</div>
          <h2
            className="text-[clamp(22px,3vw,32px)] font-[900] tracking-[-0.02em] text-white leading-tight"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
          >
            സേവന ചട്ടങ്ങളും ജീവനക്കാര്യ പദ്ധതികളും
          </h2>
          <div className="h-[2px] w-10 bg-gradient-to-r from-[#ff9f0a] to-transparent mt-2 rounded-full" />
        </div>

        {/* Compact 2-col grid of rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {filtered.map(scheme => {
            const c = COLORS[scheme.color] || COLORS.blue;
            const pageUrl = `/${scheme.title_en ? scheme.title_en.toLowerCase().replace(/\s+/g, '-') : 'details'}`;

            return (
              <Link
                key={scheme.id}
                href={pageUrl}
                className="group flex items-center gap-3 px-4 py-3 rounded-2xl no-underline transition-all duration-200 hover:bg-white/[0.05]"
                style={{ border: '1px solid var(--surface-xs)' }}
              >
                {/* Icon */}
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-base"
                  style={{ background: c.bg, border: `1px solid ${c.border}` }}
                >
                  {scheme.icon}
                </div>

                {/* Text */}
                <div className="flex-grow min-w-0">
                  <div
                    className="text-[13px] font-bold text-white/90 group-hover:text-white transition-colors leading-snug truncate"
                    style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
                  >
                    {scheme.title_ml}
                  </div>
                  <div className="text-[10px] text-white/55 font-medium mt-0.5 truncate">
                    {scheme.subtitle_en || scheme.title_en}
                  </div>
                </div>

                {/* Arrow */}
                <svg
                  className="flex-shrink-0 w-3.5 h-3.5 text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all"
                  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
