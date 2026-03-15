import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M9 7H6a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-3M13 3h5v5M10 14L20 4" />
      </svg>
    ),
    title: 'Government Orders',
    ml: 'സർക്കാർ ഉത്തരവുകൾ',
    desc: 'DA orders, pay revision, bonus, pension, MEDISEP and all major GOs in one place.',
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: 'Salary Calculators',
    ml: 'ശമ്പള കണക്കുകൂട്ടൽ',
    desc: '12th PRC, GPF, DCRG, DA arrear, NPS vs APS — accurate pay calculators updated for 2024.',
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'MEDISEP & Schemes',
    ml: 'മെഡിസെപ്പ് & പദ്ധതികൾ',
    desc: 'Complete MEDISEP guide, eligibility, claim process, empanelled hospitals, and all employee welfare schemes.',
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: 'Departmental Tests',
    ml: 'വകുപ്പ് പരീക്ഷകൾ',
    desc: 'Study materials and previous papers for all 64 Kerala government departmental tests.',
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    title: 'Forms & Downloads',
    ml: 'ഫോമുകൾ',
    desc: '65+ government forms — pension (PRISM), GPF, leave, HBA, KFC, treasury, NPS/GIS/SLI.',
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    title: 'Latest News',
    ml: 'ഏറ്റവും പുതിയ വാർത്ത',
    desc: 'Government circulars, announcements, and service rule updates — always current.',
  },
];

export default function AboutPage() {
  return (
    <>
    <Navbar />
    <div className="relative min-h-screen bg-aurora overflow-x-hidden">
      <div className="pt-24 pb-8 px-4 md:px-6">
        <div className="max-w-[860px] mx-auto">

          {/* Hero */}
          <div className="mb-12 text-center">
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-white/65 mb-4">About Us</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
              Kerala Gov Employee Hub
            </h1>
            <p className="text-[14px] text-white/70 max-w-[520px] mx-auto leading-relaxed" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              കേരള സർക്കാർ ജീവനക്കാർക്കായുള്ള സ്വതന്ത്ര വിവര പോർട്ടൽ
            </p>
          </div>

          {/* Who we are */}
          <div className="glass-card rounded-2xl p-6 md:p-8 mb-6">
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-white/65 mb-4">Who We Are</h2>
            <p className="text-[14px] text-white/80 leading-relaxed mb-4">
              Kerala Gov Employee Hub (<strong className="text-white">keralaemployees.in</strong>) is an independent, non-official information portal dedicated to Kerala State Government employees. We aggregate, organise, and present government service-related information so that every employee can easily access what they need — without navigating dozens of official portals.
            </p>
            <p className="text-[14px] text-white/80 leading-relaxed" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              ഈ പോർട്ടൽ കേരള സർക്കാർ ജീവനക്കാർക്ക് KSR ചട്ടങ്ങൾ, MEDISEP, പെൻഷൻ, ശമ്പള കണക്കുകൂട്ടൽ, സർക്കാർ ഉത്തരവുകൾ, ഫോമുകൾ, വകുപ്പ് പരീക്ഷ സഹായം എന്നിവ ഒരിടത്ത് ലഭ്യമാക്കുന്നു.
            </p>
          </div>

          {/* What we offer */}
          <div className="glass-card rounded-2xl p-6 md:p-8 mb-6">
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-white/65 mb-6">What We Offer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex gap-4 p-4 rounded-xl" style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-xs)' }}>
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(200,150,12,0.12)', color: '#c8960c' }}>
                    {f.icon}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-white/90 leading-snug">{f.title}</div>
                    <div className="text-[10.5px] text-white/70 mb-1" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>{f.ml}</div>
                    <div className="text-[11.5px] text-white/65 leading-relaxed">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mission */}
          <div className="glass-card rounded-2xl p-6 md:p-8 mb-6">
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-white/65 mb-4">Our Mission</h2>
            <p className="text-[14px] text-white/80 leading-relaxed mb-3">
              Information related to government service in Kerala is often scattered across circulars, official orders, and lengthy documents. For many employees, finding clear and reliable information about their own service benefits can be difficult.
            </p>
            <p className="text-[14px] text-white/80 leading-relaxed mb-5">
              Our mission is to gather this information in one place and present it in a <strong className="text-white">simple, practical, and accessible</strong> manner. We aim to help every Kerala government employee clearly understand the rules, benefits, and schemes that affect their service and retirement.
            </p>
            <div className="border-t border-white/[0.06] pt-5">
              <div className="text-[11px] font-black uppercase tracking-[0.25em] text-white/65 mb-3">ഞങ്ങളുടെ ദൗത്യം</div>
              <p className="text-[14px] text-white/80 leading-relaxed mb-3" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                കേരള സർക്കാർ സർവീസുമായി ബന്ധപ്പെട്ട വിവരങ്ങൾ പലപ്പോഴും വിവിധ സർക്കുലറുകളിലും ഉത്തരവുകളിലും നീണ്ട ഔദ്യോഗിക രേഖകളിലുമായി ചിതറിക്കിടക്കുന്നതാണ്. അതുകൊണ്ട് തന്നെ ഒരു ജീവനക്കാരന് തന്റെ സേവന ആനുകൂല്യങ്ങളെക്കുറിച്ചുള്ള വ്യക്തമായ വിവരങ്ങൾ കണ്ടെത്തുന്നത് പലപ്പോഴും ബുദ്ധിമുട്ടാകാറുണ്ട്.
              </p>
              <p className="text-[14px] text-white/80 leading-relaxed" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                ഈ വിവരങ്ങൾ എല്ലാം ഒരേ സ്ഥലത്ത് സമാഹരിച്ച് ലളിതമായും വ്യക്തമായും അവതരിപ്പിക്കുകയാണ് ഞങ്ങളുടെ ലക്ഷ്യം. സേവനവുമായി ബന്ധപ്പെട്ട നിയമങ്ങളും ആനുകൂല്യങ്ങളും പദ്ധതികളും ഓരോ കേരള സർക്കാർ ജീവനക്കാരനും എളുപ്പത്തിൽ മനസ്സിലാക്കാൻ സഹായിക്കുകയാണ് ഈ വെബ്സൈറ്റിന്റെ പ്രധാന ഉദ്ദേശ്യം.
              </p>
            </div>
          </div>

          {/* Disclaimer note */}
          <div className="rounded-xl px-5 py-4 text-[12px] leading-relaxed" style={{ background: 'rgba(255,69,58,0.06)', border: '1px solid rgba(255,69,58,0.15)', color: 'rgba(255,120,110,0.9)' }}>
            <strong>Important:</strong> This is <strong>not</strong> an official Government of Kerala website. All content is provided for informational purposes only. Always verify important details at official sources such as{' '}
            <a href="https://www.finance.kerala.gov.in" target="_blank" rel="noopener noreferrer" className="underline opacity-80 hover:opacity-100">finance.kerala.gov.in</a> or your department.
            {' '}<a href="/disclaimer" className="underline opacity-80 hover:opacity-100">Read full disclaimer →</a>
          </div>

        </div>
      </div>
      <Footer />
    </div>
    </>
  );
}
