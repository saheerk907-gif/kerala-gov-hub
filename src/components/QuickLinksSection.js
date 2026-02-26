const COLOR_MAP = {
  blue: { bg: 'rgba(41,151,255,0.12)', text: '#2997ff' },
  green: { bg: 'rgba(48,209,88,0.12)', text: '#30d158' },
  orange: { bg: 'rgba(255,159,10,0.12)', text: '#ff9f0a' },
  purple: { bg: 'rgba(191,90,242,0.12)', text: '#bf5af2' },
  teal: { bg: 'rgba(100,210,255,0.12)', text: '#64d2ff' },
  pink: { bg: 'rgba(255,55,95,0.12)', text: '#ff375f' },
  gold: { bg: 'rgba(255,214,10,0.12)', text: '#ffd60a' },
};

export default function QuickLinksSection({ links }) {
  if (!links?.length) return null;
  return (
    <section id="links" className="relative z-[1] py-24 px-6 border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto mb-14">
        <div className="text-xs font-bold uppercase tracking-widest text-[#64d2ff] mb-2.5 font-sans">QUICK ACCESS</div>
        <h2 className="text-[clamp(32px,5vw,52px)] font-extrabold tracking-tight leading-[1.15] mb-4">ഔദ്യോഗിക പോർട്ടലുകൾ</h2>
        <p className="text-base text-[#86868b] leading-relaxed max-w-[640px]">
          കേരള സർക്കാർ ജീവനക്കാർക്ക് ആവശ്യമായ എല്ലാ ഔദ്യോഗിക വെബ്സൈറ്റുകളിലേക്കുള്ള ലിങ്കുകൾ.
        </p>
      </div>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {links.map(l => {
          const c = COLOR_MAP[l.color] || COLOR_MAP.blue;
          return (
            <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center text-center py-7 px-5 bg-[#111] border border-white/[0.08] rounded-[20px] no-underline transition-all duration-400 hover:-translate-y-1 hover:border-white/[0.15] hover:bg-[#1a1a1a]">
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-[22px] mb-3.5"
                style={{ background: c.bg, color: c.text }}>
                {l.icon}
              </div>
              <div className="text-sm font-bold text-[#f5f5f7] mb-1">{l.title_ml}</div>
              <div className="text-[11px] text-[#6e6e73] font-sans">{l.description || l.url}</div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
