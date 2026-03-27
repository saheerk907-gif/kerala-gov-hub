'use client';
export default function Footer() {
  return (
    <footer className="relative py-8 md:py-14 px-4 md:px-6 border-t border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 pb-8 md:pb-10 border-b border-white/[0.06]">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <picture>
                <source srcSet="/logo.webp" type="image/webp" />
                <img src="/logo.png" alt="Kerala Gov Logo"
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-[#c8960c]/30" />
              </picture>
              <div>
                <div className="text-[13px] font-bold text-white/85 leading-tight" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                  കേരള ജീവനക്കാര്യ ഹബ്
                </div>
                <div className="text-[9px] text-white/50 font-sans uppercase tracking-widest">
                  Kerala Gov Employee Hub
                </div>
              </div>
            </div>
            <p className="text-[12px] text-white/75 leading-relaxed max-w-[280px]" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              കേരള സംസ്ഥാന സർക്കാർ ജീവനക്കാർക്കായുള്ള സമഗ്ര വിവര ശേഖരം.
            </p>
          </div>

          {/* Schemes */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-4">പദ്ധതികൾ</h3>
            {['സർവ്വീസ് ചട്ടങ്ങൾ', 'മെഡിസെപ്', 'ജി.പി.എഫ്', 'എൻ.പി.എസ്', 'എസ്.എൽ.ഐ', 'ജി.ഐ.എസ്'].map(s => (
              <a key={s} href="#services" className="block text-[12px] text-white/72 no-underline py-0.5 hover:text-white/90 transition-colors" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                {s}
              </a>
            ))}
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-4">വിഭവങ്ങൾ</h3>
            {[['#orders', 'ഉത്തരവുകൾ'], ['#benefits', 'ശമ്പളം & ബത്ത'], ['#benefits', 'അവധി ചട്ടങ്ങൾ'], ['#benefits', 'പെൻഷൻ']].map(([h, s]) => (
              <a key={s} href={h} className="block text-[12px] text-white/72 no-underline py-0.5 hover:text-white/90 transition-colors" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                {s}
              </a>
            ))}
          </div>

          {/* Portals */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-4">പോർട്ടലുകൾ</h3>
            {[
              ['https://spark.gov.in', 'SPARK'],
              ['https://treasury.kerala.gov.in', 'ഇ-ട്രഷറി'],
              ['https://www.finance.kerala.gov.in', 'ധനകാര്യ വകുപ്പ്'],
              ['https://www.kerala.gov.in', 'Kerala.gov.in'],
            ].map(([u, s]) => (
              <a key={s} href={u} target="_blank" rel="noopener noreferrer" className="block text-[12px] text-white/72 no-underline py-0.5 hover:text-white/90 transition-colors">
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 px-4 py-3 rounded-xl text-[11px] text-red-400/80 leading-relaxed"
          style={{ background: 'rgba(255,69,58,0.06)', border: '1px solid rgba(255,69,58,0.12)' }}>
          ⚠️ ഇത് ഔദ്യോഗിക സർക്കാർ വെബ്സൈറ്റ് അല്ല. വിവരങ്ങൾ ഔദ്യോഗിക ഉറവിടങ്ങളിൽ നിന്ന് സ്ഥിരീകരിക്കുക — finance.kerala.gov.in
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-5 md:pt-6 text-[11px] text-white/45 gap-2 sm:gap-3">
          <span>© 2026 Kerala Gov Employee Hub</span>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a href="/about" className="hover:text-white/55 transition-colors no-underline">About</a>
            <a href="/contact" className="hover:text-white/55 transition-colors no-underline">Contact</a>
            <a href="/privacy-policy" className="hover:text-white/55 transition-colors no-underline">Privacy Policy</a>
            <a href="/disclaimer" className="hover:text-white/55 transition-colors no-underline">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
