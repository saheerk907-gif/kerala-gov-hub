'use client';

const COLOR_MAP = {
  green:  { glow: 'rgba(48,209,88,0.12)',   text: '#30d158',  border: 'rgba(48,209,88,0.22)' },
  purple: { glow: 'rgba(191,90,242,0.12)',  text: '#bf5af2',  border: 'rgba(191,90,242,0.22)' },
  teal:   { glow: 'rgba(100,210,255,0.12)', text: '#64d2ff',  border: 'rgba(100,210,255,0.22)' },
  blue:   { glow: 'rgba(41,151,255,0.12)',  text: '#2997ff',  border: 'rgba(41,151,255,0.22)' },
  orange: { glow: 'rgba(255,159,10,0.12)',  text: '#ff9f0a',  border: 'rgba(255,159,10,0.22)' },
};

export default function HighlightsSection({ highlights }) {
  if (!highlights?.length) return null;

  return (
    <section id="benefits" className="relative py-14 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="mb-14">
          <div className="section-label mb-3">Key Benefits</div>
          <h2 className="text-[clamp(28px,4.5vw,50px)] font-[900] tracking-[-0.03em] text-white leading-tight" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            ശമ്പളം, അവധി,{' '}
            <span>പെൻഷൻ വിവരങ്ങൾ</span>
          </h2>
          <p className="text-[15px] text-white/75 leading-relaxed max-w-[580px] mt-4">
            കേരള സർക്കാർ ജീവനക്കാരുടെ സാമ്പത്തിക സുരക്ഷയും ക്ഷേമവും ഉറപ്പാക്കുന്ന സമഗ്ര ആനുകൂല്യങ്ങൾ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {highlights.map(h => {
            const c = COLOR_MAP[h.color] || COLOR_MAP.green;
            return (
              <div
                key={h.id}
                className={`glass-card glow-top relative overflow-hidden rounded-[28px] p-8 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] ${
                  h.is_full_width ? 'md:col-span-2' : ''
                }`}
              >
                {/* Background glow */}
                <div
                  className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] opacity-30 pointer-events-none"
                  style={{ background: c.glow }}
                />

                {/* Icon */}
                <div
                  className="w-13 h-13 w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-2xl mb-7"
                  style={{ background: c.glow, border: `1px solid ${c.border}`, color: c.text }}
                >
                  {h.icon}
                </div>

                <h3 className="text-[20px] font-bold mb-2.5 text-white" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                  {h.title_ml}
                </h3>
                <p className="text-[13px] text-white/75 leading-relaxed max-w-[500px]">
                  {h.description_ml}
                </p>

                {h.highlight_tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {h.highlight_tags
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map(t => (
                        <span
                          key={t.id}
                          className="px-3 py-1 rounded-full text-[10px] font-bold text-white/75 bg-white/[0.06] border border-white/[0.12]"
                        >
                          {t.tag_ml}
                        </span>
                      ))}
                  </div>
                )}

                {/* Bottom accent */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[1px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${c.text}40, transparent)` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
