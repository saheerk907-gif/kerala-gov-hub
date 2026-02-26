'use client';
import { useState } from 'react';

const COLORS = {
  blue: { bg: 'rgba(41,151,255,0.12)', text: '#2997ff', glow: '#2997ff' },
  green: { bg: 'rgba(48,209,88,0.12)', text: '#30d158', glow: '#30d158' },
  orange: { bg: 'rgba(255,159,10,0.12)', text: '#ff9f0a', glow: '#ff9f0a' },
  purple: { bg: 'rgba(191,90,242,0.12)', text: '#bf5af2', glow: '#bf5af2' },
  teal: { bg: 'rgba(100,210,255,0.12)', text: '#64d2ff', glow: '#64d2ff' },
  pink: { bg: 'rgba(255,55,95,0.12)', text: '#ff375f', glow: '#ff375f' },
};

export default function SchemesSection({ schemes }) {
  const [expanded, setExpanded] = useState(null);

  if (!schemes?.length) return null;

  return (
    <section id="services" className="relative z-[1] py-24 px-6 max-w-[1200px] mx-auto">
      <div className="text-xs font-bold uppercase tracking-widest text-[#2997ff] mb-2.5 font-sans">CORE RESOURCES</div>
      <h2 className="text-[clamp(32px,5vw,52px)] font-extrabold tracking-tight leading-[1.15] mb-4">
        സേവന ചട്ടങ്ങളും<br />ജീവനക്കാര്യ പദ്ധതികളും
      </h2>
      <p className="text-base text-[#86868b] leading-relaxed max-w-[640px] mb-14">
        കേരള സർവ്വീസ് ചട്ടങ്ങൾ, ആരോഗ്യ ഇൻഷുറൻസ്, പ്രോവിഡന്റ് ഫണ്ട്, പെൻഷൻ, ഇൻഷുറൻസ് പദ്ധതികൾ — എല്ലാത്തിന്റെയും വിശദാംശങ്ങൾ.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schemes.map(scheme => {
          const c = COLORS[scheme.color] || COLORS.blue;
          const isOpen = expanded === scheme.id;
          return (
            <div
              key={scheme.id}
              onClick={() => setExpanded(isOpen ? null : scheme.id)}
              className={`relative overflow-hidden bg-[#111] rounded-[20px] p-8 border border-white/[0.08] cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.12] hover:bg-[#1a1a1a] glow-line ${isOpen ? 'card-expanded' : ''}`}
              style={{ '--glow-color': c.glow }}
            >
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-[22px] mb-5"
                style={{ background: c.bg, color: c.text }}>
                {scheme.icon}
              </div>
              <h3 className="text-xl font-bold mb-1">{scheme.title_ml}</h3>
              <div className="text-[11px] font-semibold text-[#6e6e73] font-sans uppercase tracking-wider mb-2.5">
                {scheme.subtitle_en || scheme.title_en}
              </div>
              <p className="text-[13px] text-[#86868b] leading-relaxed mb-5">{scheme.description_ml}</p>

              {scheme.scheme_tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {scheme.scheme_tags.sort((a, b) => a.sort_order - b.sort_order).map(t => (
                    <span key={t.id} className="px-2.5 py-1 bg-white/5 rounded-full text-[11px] text-[#6e6e73] font-medium">
                      {t.tag_ml}
                    </span>
                  ))}
                </div>
              )}

              <div className="card-details">
                {scheme.scheme_details?.length > 0 && (
                  <div className="pt-5 border-t border-white/[0.08] mt-5 flex flex-col gap-2">
                    {scheme.scheme_details.sort((a, b) => a.sort_order - b.sort_order).map(d => (
                      <div key={d.id} className="text-[12.5px] text-[#86868b] pl-3.5 relative leading-relaxed">
                        <span className="absolute left-0 top-[8px] w-1 h-1 rounded-full" style={{ background: c.text }} />
                        <strong className="text-[#f5f5f7]">{d.label}</strong> — {d.content_ml}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold mt-3" style={{ color: c.text }}>
                {isOpen ? 'ചുരുക്കുക ↑' : 'വിശദമായി കാണുക ↓'}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
