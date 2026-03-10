'use client';
import { useState } from 'react';
import Link from 'next/link';

const COLORS = {
  blue:   { glow: 'rgba(41,151,255,0.15)',  text: '#2997ff',  border: 'rgba(41,151,255,0.25)' },
  green:  { glow: 'rgba(48,209,88,0.12)',   text: '#30d158',  border: 'rgba(48,209,88,0.22)' },
  orange: { glow: 'rgba(255,159,10,0.12)',  text: '#ff9f0a',  border: 'rgba(255,159,10,0.22)' },
  purple: { glow: 'rgba(191,90,242,0.12)',  text: '#bf5af2',  border: 'rgba(191,90,242,0.22)' },
  pink:   { glow: 'rgba(255,55,95,0.12)',   text: '#ff375f',  border: 'rgba(255,55,95,0.22)' },
  teal:   { glow: 'rgba(100,210,255,0.12)', text: '#64d2ff',  border: 'rgba(100,210,255,0.22)' },
};

export default function SchemesSection({ schemes }) {
  const [expanded, setExpanded] = useState(null);

  if (!schemes?.length) return null;

  return (
    <section id="services" className="relative py-14 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Header — left-aligned, consistent with other sections */}
        <div className="mb-10">
          <div className="section-label mb-2">Resources</div>
          <h2
            className="text-[clamp(22px,3vw,32px)] font-[900] tracking-[-0.02em] text-white leading-tight"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
          >
            സേവന ചട്ടങ്ങളും ജീവനക്കാര്യ പദ്ധതികളും
          </h2>
          <div className="h-[2px] w-10 bg-gradient-to-r from-[#bf5af2] to-transparent mt-2 rounded-full" />
          <p className="text-[14px] text-white/72 leading-relaxed max-w-[560px] mt-3 font-medium"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            കേരള സർവ്വീസ് ചട്ടങ്ങൾ, ആരോഗ്യ ഇൻഷുറൻസ്, പ്രോവിഡന്റ് ഫണ്ട് തുടങ്ങി എല്ലാ വിവരങ്ങളും.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {schemes.map(scheme => {
            const c = COLORS[scheme.color] || COLORS.blue;
            const isOpen = expanded === scheme.id;
            const pageUrl = `/${scheme.title_en ? scheme.title_en.toLowerCase().replace(/\s+/g, '-') : 'details'}`;

            return (
              <div
                key={scheme.id}
                onClick={() => setExpanded(isOpen ? null : scheme.id)}
                className={`glass-card glow-top relative overflow-hidden rounded-[24px] p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.3)] ${
                  isOpen ? 'ring-1' : ''
                }`}
                style={isOpen ? { ringColor: c.border } : {}}
              >
                {/* Glow blob */}
                <div
                  className="absolute -top-6 -right-6 w-28 h-28 rounded-full blur-[50px] opacity-60 pointer-events-none"
                  style={{ background: c.glow }}
                />

                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-[14px] flex items-center justify-center text-xl mb-4"
                  style={{ background: c.glow, border: `1px solid ${c.border}`, color: c.text }}
                >
                  {scheme.icon}
                </div>

                {/* Title */}
                <h3
                  className="text-[16px] font-bold mb-0.5 text-white leading-snug"
                  style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
                >
                  {scheme.title_ml}
                </h3>
                <div className="text-[9px] font-black text-white/65 uppercase tracking-[0.2em] mb-2.5">
                  {scheme.subtitle_en || scheme.title_en}
                </div>
                <p
                  className="text-[13px] text-white/75 leading-relaxed mb-4"
                  style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
                >
                  {scheme.description_ml}
                </p>

                {/* Tags */}
                {scheme.scheme_tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {scheme.scheme_tags.map(t => (
                      <span
                        key={t.id}
                        className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white/75 bg-white/[0.06] border border-white/[0.12]"
                      >
                        {t.tag_ml}
                      </span>
                    ))}
                  </div>
                )}

                {/* Expanded details */}
                <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[400px] opacity-100 mt-4 pt-4 border-t border-white/[0.08]' : 'max-h-0 opacity-0'}`}>
                  {scheme.scheme_details?.length > 0 && (
                    <div className="flex flex-col gap-3">
                      {scheme.scheme_details.map(d => (
                        <div key={d.id} className="text-[12px] text-white/75 pl-4 relative leading-relaxed"
                          style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                          <span className="absolute left-0 top-[7px] w-1.5 h-1.5 rounded-full" style={{ background: c.text }} />
                          <strong className="text-white/90 font-bold">{d.label}</strong>: {d.content_ml}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/[0.06]">
                  <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: c.text }}>
                    {isOpen ? '← Close' : 'Details →'}
                  </span>
                  <Link
                    href={pageUrl}
                    onClick={e => e.stopPropagation()}
                    className="glass-pill px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tight text-white/80 hover:text-white transition-all no-underline hover:border-white/30"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
