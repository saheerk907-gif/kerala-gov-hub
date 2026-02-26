export default function Footer() {
  return (
    <footer className="relative z-[1] border-t border-white/[0.08] py-12 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-9 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Coat_of_arms_of_Kerala.svg/180px-Coat_of_arms_of_Kerala.svg.png"
                alt="Kerala" className="w-8 h-8 rounded-full bg-white p-0.5 object-contain" />
              <div>
                <div className="text-[13px] font-bold leading-tight">കേരള ജീവനക്കാര്യ ഹബ്</div>
                <div className="text-[9px] text-[#6e6e73] font-sans uppercase tracking-wider">Kerala Gov Employee Hub</div>
              </div>
            </div>
            <p className="text-xs text-[#6e6e73] leading-relaxed max-w-[300px]">
              കേരള സംസ്ഥാന സർക്കാർ ജീവനക്കാർക്കായുള്ള സമഗ്ര വിവര ശേഖരം. നിങ്ങളുടെ അവകാശങ്ങളും ആനുകൂല്യങ്ങളും അറിയുക.
            </p>
          </div>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#86868b] mb-3.5">പദ്ധതികൾ</h4>
            {['സർവ്വീസ് ചട്ടങ്ങൾ', 'മെഡിസെപ്', 'ജി.പി.എഫ്', 'എൻ.പി.എസ്', 'എസ്.എൽ.ഐ', 'ജി.ഐ.എസ്'].map(s => (
              <a key={s} href="#services" className="block text-xs text-[#6e6e73] no-underline py-0.5 hover:text-white transition-colors">{s}</a>
            ))}
          </div>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#86868b] mb-3.5">വിഭവങ്ങൾ</h4>
            {[['#orders','ഉത്തരവുകൾ'],['#benefits','ശമ്പളം & ബത്ത'],['#benefits','അവധി ചട്ടങ്ങൾ'],['#benefits','പെൻഷൻ']].map(([h,s]) => (
              <a key={s} href={h} className="block text-xs text-[#6e6e73] no-underline py-0.5 hover:text-white transition-colors">{s}</a>
            ))}
          </div>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#86868b] mb-3.5">പോർട്ടലുകൾ</h4>
            {[['https://spark.gov.in','SPARK'],['https://treasury.kerala.gov.in','ഇ-ട്രഷറി'],['https://www.finance.kerala.gov.in','ധനകാര്യ വകുപ്പ്'],['https://www.kerala.gov.in','Kerala.gov.in']].map(([u,s]) => (
              <a key={s} href={u} target="_blank" rel="noopener noreferrer" className="block text-xs text-[#6e6e73] no-underline py-0.5 hover:text-white transition-colors">{s}</a>
            ))}
          </div>
        </div>
        <div className="mt-4 px-4 py-3 rounded-xl text-[11px] text-[#ff453a] leading-relaxed"
          style={{ background: 'rgba(255,69,58,0.08)', border: '1px solid rgba(255,69,58,0.15)' }}>
          ⚠️ ഇത് ഔദ്യോഗിക സർക്കാർ വെബ്സൈറ്റ് അല്ല. വിവരങ്ങൾ ഔദ്യോഗിക ഉറവിടങ്ങളിൽ നിന്ന് സ്ഥിരീകരിക്കുക — finance.kerala.gov.in
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center pt-5 text-[11px] text-[#6e6e73] gap-2">
          <span>© 2025 Kerala Gov Employee Hub</span>
          <span className="font-sans">Built with Next.js + Supabase</span>
        </div>
      </div>
    </footer>
  );
}
