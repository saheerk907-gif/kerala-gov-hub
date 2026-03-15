'use client';
import { useState } from 'react';

const MOBILE_VISIBLE = 5;

const COLOR_MAP = {
  blue:   { text: '#2997ff', bg: 'rgba(41,151,255,0.12)',  border: 'rgba(41,151,255,0.22)' },
  green:  { text: '#30d158', bg: 'rgba(48,209,88,0.12)',   border: 'rgba(48,209,88,0.22)'  },
  orange: { text: '#ff9f0a', bg: 'rgba(255,159,10,0.12)',  border: 'rgba(255,159,10,0.22)' },
  purple: { text: '#bf5af2', bg: 'rgba(191,90,242,0.12)',  border: 'rgba(191,90,242,0.22)' },
  teal:   { text: '#64d2ff', bg: 'rgba(100,210,255,0.12)', border: 'rgba(100,210,255,0.22)'},
  pink:   { text: '#ff375f', bg: 'rgba(255,55,95,0.12)',   border: 'rgba(255,55,95,0.22)'  },
  gold:   { text: '#c8960c', bg: 'rgba(200,150,12,0.12)',  border: 'rgba(200,150,12,0.22)' },
};

export default function QuickLinksSection({ links }) {
  const [expanded, setExpanded] = useState(false);
  if (!links?.length) return null;

  return (
    <section id="links" className="relative py-7 md:py-10 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto border-t border-white/[0.06] pt-7 md:pt-10">

        {/* Header */}
        <div className="mb-6">
          <div className="section-label mb-2">Quick Access</div>
          <h2
            className="text-[clamp(22px,3vw,32px)] font-[900] tracking-[-0.02em] text-white leading-tight"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
          >
            ഔദ്യോഗിക പോർട്ടലുകൾ
          </h2>
          <div className="h-[2px] w-10 bg-gradient-to-r from-[#2997ff] to-transparent mt-2 rounded-full" />
        </div>

        {/* Compact grid — mobile shows MOBILE_VISIBLE items by default */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {links.map((l, idx) => {
            const c = COLOR_MAP[l.color] || COLOR_MAP.blue;
            return (
              <div key={l.id} className={idx >= MOBILE_VISIBLE && !expanded ? 'sm:block hidden' : 'block'}>
              <a
                key={l.id}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-4 py-3 rounded-2xl no-underline transition-all duration-200 hover:bg-white/[0.05]"
                style={{ border: '1px solid var(--surface-xs)' }}
              >
                {/* Icon */}
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-base"
                  style={{ background: c.bg, border: `1px solid ${c.border}` }}
                >
                  {l.icon}
                </div>

                {/* Text */}
                <div className="flex-grow min-w-0">
                  <div
                    className="text-[13px] font-bold text-white/90 group-hover:text-white transition-colors leading-snug truncate"
                    style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
                  >
                    {l.title_ml}
                  </div>
                  {l.subtitle && (
                    <div className="text-[10px] text-white/55 font-medium mt-0.5 truncate">
                      {l.subtitle}
                    </div>
                  )}
                </div>

                {/* External link icon */}
                <svg
                  className="flex-shrink-0 w-3 h-3 text-white/30 group-hover:text-white/60 transition-colors"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
              </div>
            );
          })}
        </div>

        {/* Expand / collapse — mobile only */}
        {links.length > MOBILE_VISIBLE && (
          <div className="sm:hidden mt-3 flex justify-center">
            <button
              onClick={() => setExpanded(v => !v)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-bold transition-all"
              style={{ background: 'rgba(41,151,255,0.08)', color: '#2997ff', border: '1px solid rgba(41,151,255,0.22)' }}
            >
              {expanded ? 'Show less ↑' : `Show all ${links.length} portals ↓`}
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
