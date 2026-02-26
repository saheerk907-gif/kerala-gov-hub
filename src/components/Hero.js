export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 overflow-hidden z-[1]">
      <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(41,151,255,0.07) 0%, transparent 70%)' }} />

     <img 
  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Emblem_of_Kerala.svg/120px-Emblem_of_Kerala.svg.png"
  alt="Kerala Government Emblem"
  className="w-16 h-16 object-contain mx-auto"
/>

      <div className="animate-fade-up animate-fade-up-delay-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-[#2997ff] mb-7 font-sans"
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
