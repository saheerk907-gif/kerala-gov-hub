const COLOR_MAP = {
  green: { bg: 'rgba(48,209,88,0.12)', text: '#30d158' },
  purple: { bg: 'rgba(191,90,242,0.12)', text: '#bf5af2' },
  teal: { bg: 'rgba(100,210,255,0.12)', text: '#64d2ff' },
  blue: { bg: 'rgba(41,151,255,0.12)', text: '#2997ff' },
  orange: { bg: 'rgba(255,159,10,0.12)', text: '#ff9f0a' },
};

export default function HighlightsSection({ highlights }) {
  if (!highlights?.length) return null;
  return (
    <section id="benefits" className="relative z-[1] py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-xs font-bold uppercase tracking-widest text-[#30d158] mb-2.5 font-sans">KEY BENEFITS</div>
        <h2 className="text-[clamp(32px,5vw,52px)] font-extrabold tracking-tight leading-[1.15] mb-4">
          ശമ്പളം, അവധി,<br />പെൻഷൻ വിവരങ്ങൾ
        </h2>
        <p className="text-base text-[#86868b] leading-relaxed max-w-[640px] mb-14">
          കേരള സർക്കാർ ജീവനക്കാരുടെ സാമ്പത്തിക സുരക്ഷയും ക്ഷേമവും ഉറപ്പാക്കുന്ന സമഗ്ര ആനുകൂല്യങ്ങൾ.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {highlights.map(h => {
            const c = COLOR_MAP[h.color] || COLOR_MAP.green;
            return (
              <div key={h.id}
                className={`bg-[#111] border border-white/[0.08] rounded-3xl p-10 transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.12] ${h.is_full_width ? 'md:col-span-2' : ''}`}>
                <div className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-2xl mb-6"
                  style={{ background: c.bg, color: c.text }}>
                  {h.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2.5">{h.title_ml}</h3>
                <p className="text-sm text-[#86868b] leading-relaxed max-w-[520px]">{h.description_ml}</p>
                {h.highlight_tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {h.highlight_tags.sort((a, b) => a.sort_order - b.sort_order).map(t => (
                      <span key={t.id} className="px-2.5 py-1 bg-white/5 rounded-full text-[11px] text-[#6e6e73] font-medium">
                        {t.tag_ml}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
