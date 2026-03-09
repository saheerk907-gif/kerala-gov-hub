'use client';

const COLOR_MAP = {
  blue:   { glow: 'rgba(41,151,255,0.15)',  text: '#2997ff',  border: 'rgba(41,151,255,0.25)' },
  green:  { glow: 'rgba(48,209,88,0.12)',   text: '#30d158',  border: 'rgba(48,209,88,0.22)' },
  orange: { glow: 'rgba(255,159,10,0.12)',  text: '#ff9f0a',  border: 'rgba(255,159,10,0.22)' },
  purple: { glow: 'rgba(191,90,242,0.12)',  text: '#bf5af2',  border: 'rgba(191,90,242,0.22)' },
  teal:   { glow: 'rgba(100,210,255,0.12)', text: '#64d2ff',  border: 'rgba(100,210,255,0.22)' },
  pink:   { glow: 'rgba(255,55,95,0.12)',   text: '#ff375f',  border: 'rgba(255,55,95,0.22)' },
  gold:   { glow: 'rgba(200,150,12,0.12)',  text: '#c8960c',  border: 'rgba(200,150,12,0.22)' },
};

export default function QuickLinksSection({ links }) {
  if (!links?.length) return null;

  return (
    <section id="links" className="relative py-14 px-4 md:px-6">
      {/* Divider line */}
      <div className="max-w-[1200px] mx-auto mb-8">
        <div className="border-t border-white/[0.06]" />
      </div>

      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="section-label mb-2">Quick Access</div>
            <h2 className="text-[clamp(24px,3.5vw,40px)] font-[900] tracking-[-0.03em] text-white" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              ഔദ്യോഗിക പോർട്ടലുകൾ
            </h2>
          </div>
          <p className="text-[13px] text-white/40 max-w-[340px] md:text-right font-medium">
            ജീവനക്കാർക്ക് നിത്യേന ആവശ്യമുള്ള പ്രധാന വെബ്സൈറ്റുകൾ.
          </p>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {links.map(l => {
            const c = COLOR_MAP[l.color] || COLOR_MAP.blue;
            return (
              <a
                key={l.id}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card group flex items-center gap-3 p-4 rounded-2xl no-underline transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]"
                style={{ '--hover-border': c.border }}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-110"
                  style={{ background: c.glow, border: `1px solid ${c.border}`, color: c.text }}
                >
                  {l.icon}
                </div>

                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-white/80 truncate group-hover:text-white transition-colors" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                    {l.title_ml}
                  </div>
                  <div className="text-[9px] font-bold text-white/25 uppercase tracking-wider">
                    Explore →
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
