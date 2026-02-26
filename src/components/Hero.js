const KeralaEmblem = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="64" height="64" style={{flexShrink:0, margin:'0 auto', display:'block'}}>
    <circle cx="50" cy="50" r="48" fill="#c8960c" />
    <circle cx="50" cy="50" r="44" fill="#1a1a1a" />
    <circle cx="50" cy="50" r="40" fill="#c8960c" />
    <circle cx="50" cy="50" r="36" fill="#0a2240" />
    <ellipse cx="50" cy="52" rx="18" ry="16" fill="#c8960c" />
    <ellipse cx="34" cy="50" rx="8" ry="10" fill="#c8960c" />
    <ellipse cx="66" cy="50" rx="8" ry="10" fill="#c8960c" />
    <ellipse cx="50" cy="44" rx="12" ry="9" fill="#c8960c" />
    <circle cx="44" cy="46" r="2" fill="#0a2240" />
    <circle cx="56" cy="46" r="2" fill="#0a2240" />
    <path d="M 44 58 Q 36 65 40 72 Q 44 78 50 74" stroke="#c8960c" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M 42 56 Q 32 60 30 68" stroke="#f5f5f0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <text x="50" y="22" textAnchor="middle" fontSize="8" fill="#c8960c">&#9733; &#9733; &#9733;</text>
    <path id="heroBottomArc" d="M 18 65 A 35 35 0 0 0 82 65" fill="none" />
    <text fontSize="7" fill="#f5f5f0" fontWeight="bold" fontFamily="serif">
      <textPath href="#heroBottomArc" startOffset="15%">KERALA</textPath>
    </text>
  </svg>
);

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 overflow-hidden z-[1]">
      <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(41,151,255,0.07) 0%, transparent 70%)' }} />

      <KeralaEmblem />

      <div className="animate-fade-up animate-fade-up-delay-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-[#2997ff] mb-7 mt-6 font-sans"
        style={{ background: 'rgba(41,151,255,0.1)', border: '1px solid rgba(41,151,255,0.2)' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" style={{ animation: 'pulse 2s infinite' }} />
        2025-26 അപ്ഡേറ്റ് ചെയ്തത്
      </div>
      <h1 className="animate-fade-up animate-fade-up-delay-2 text-[clamp(36px,7vw,72px)] font-extrabold leading-[1.15] tracking-tight mb-5">
        കേരള സർക്കാർ<br />
        <span className="bg-gradient-to-r from-[#2997ff] via-[#64d2ff] to-[#30d158] bg-clip-text text-transparent">
          ജീവനക്കാരുടെ encyclopaedia
        </span>
      </h1>
      <p className="animate-fade-up animate-fade-up-delay-3 text-[clamp(15px,2vw,19px)] text-[#86868b] max-w-[640px] leading-relaxed mb-10">
        സേവന ചട്ടങ്ങൾ, മെഡിസെപ്, ജി.പി.എഫ്, എൻ.പി.എസ്, എസ്.എൽ.ഐ, ജി.ഐ.എസ്, പ്രധാന സർക്കാർ ഉത്തരവുകൾ — എല്ലാം ഒരിടത്ത്.
      </p>
      <div className="animate-fade-up animate-fade-up-delay-4 flex flex-col sm:flex-row gap-4 items-center">
        <a href="#services" className="px-8 py-3.5 bg-[#2997ff] text-white rounded-full text-sm font-semibold no-underline hover:bg-[#0077ed] transition-all hover:scale-[1.02]">
          വിഭവങ്ങൾ കാണുക
        </a>
        <a href="#orders" className="px-8 py-3.5 text-[#2997ff] rounded-full text-sm font-semibold no-underline hover:text-[#0077ed] transition-colors">
          പുതിയ ഉത്തരവുകൾ →
        </a>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-up" style={{ animationDelay: '0.6s' }}>
        <div className="w-6 h-10 border-2 border-[#6e6e73] rounded-xl relative">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[3px] h-[7px] bg-[#6e6e73] rounded-sm"
            style={{ animation: 'scrollDown 1.5s infinite' }} />
        </div>
      </div>
    </section>
  );
}
