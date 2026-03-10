import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LAST_UPDATED = 'March 2026';

const POINTS = [
  {
    title: 'Not an Official Government Website',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    content: 'keralaemployees.in is an independent, privately operated information portal. It is not affiliated with, endorsed by, or operated by the Government of Kerala, any Kerala government department, or any statutory body.',
    ml: 'ഈ വെബ്സൈറ്റ് കേരള സർക്കാരിന്റെ ഔദ്യോഗിക വെബ്സൈറ്റ് അല്ല. ഇത് ഒരു സ്വതന്ത്ര വിവര ശേഖരമാണ്.',
  },
  {
    title: 'For Informational Purposes Only',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    content: 'All content published on this site — including government orders, service rules, pension information, salary calculators, MEDISEP details, and departmental test materials — is provided for general informational and educational purposes only. It does not constitute legal, financial, or professional advice.',
    ml: 'ഇവിടെ നൽകിയ വിവരങ്ങൾ പൊതു അറിവിനും വിദ്യാഭ്യാസ ആവശ്യങ്ങൾക്കും മാത്രമുള്ളതാണ്. ഇത് നിയമ, സാമ്പത്തിക, അല്ലെങ്കിൽ ഔദ്യോഗിക ഉപദേശമായി കണക്കാക്കരുത്.',
  },
  {
    title: 'Accuracy & Completeness',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
    content: 'While we strive to keep all information accurate and up to date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of any information on this site. Government rules and orders change frequently; always verify with official sources before making any decisions.',
    ml: 'വിവരങ്ങൾ കൃത്യമാക്കാൻ ഞങ്ങൾ ശ്രമിക്കുന്നുണ്ടെങ്കിലും, ഔദ്യോഗിക ഉറവിടങ്ങളിൽ നിന്ന് സ്ഥിരീകരിക്കുക.',
  },
  {
    title: 'Calculators & Tools',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="10" x2="8" y2="10"/>
        <line x1="11" y1="14" x2="8" y2="14"/><line x1="11" y1="18" x2="8" y2="18"/>
        <line x1="16" y1="14" x2="14" y2="14"/><line x1="16" y1="18" x2="14" y2="18"/>
      </svg>
    ),
    content: 'The salary, pension, DCRG, GPF, and other calculators on this site are designed as reference tools. Results are estimates based on the parameters you enter and may differ from actual payments processed by SPARK, Treasury, or your Accounts Officer. Use them for planning purposes only and confirm final figures with official pay fixation authorities.',
    ml: 'ഈ കാൽക്കുലേറ്ററുകൾ ഒരു ആശ്രയ ഉപകരണം മാത്രമാണ്. യഥാർഥ ശമ്പളം SPARK, ട്രഷറി അല്ലെങ്കിൽ ഡ്രോയിംഗ് ഓഫീസറുമായി സ്ഥിരീകരിക്കുക.',
  },
  {
    title: 'External Links',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
      </svg>
    ),
    content: 'This site links to official government portals and third-party websites for your convenience. We have no control over these external sites and accept no responsibility for their content, privacy practices, or availability.',
    ml: 'ഔദ്യോഗിക പോർട്ടലുകളിലേക്കുള്ള ലിങ്കുകൾ സൗകര്യത്തിനായി മാത്രം. ആ സൈറ്റുകളുടെ ഉള്ളടക്കത്തിന് ഞങ്ങൾ ഉത്തരവാദികളല്ല.',
  },
  {
    title: 'Limitation of Liability',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    content: 'To the fullest extent permitted by law, Kerala Gov Employee Hub shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to or use of, or reliance on, any information published on this site.',
    ml: 'ഈ വെബ്സൈറ്റിലെ വിവരങ്ങൾ ആശ്രയിച്ചുണ്ടാകുന്ന ഏതൊരു നഷ്ടത്തിനും ഞങ്ങൾ ഉത്തരവാദികളല്ല.',
  },
  {
    title: 'Always Verify with Official Sources',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    content: 'For authoritative and legally binding information, always refer to the official Kerala government websites and your department or pay-drawing officer.',
    links: [
      { label: 'Finance Department', href: 'https://www.finance.kerala.gov.in' },
      { label: 'SPARK Portal', href: 'https://spark.gov.in' },
      { label: 'e-Treasury', href: 'https://treasury.kerala.gov.in' },
      { label: 'MEDISEP Portal', href: 'https://medisep.kerala.gov.in' },
      { label: 'Kerala.gov.in', href: 'https://www.kerala.gov.in' },
    ],
    ml: 'ഔദ്യോഗിക ഉറവിടങ്ങൾ: finance.kerala.gov.in, spark.gov.in, treasury.kerala.gov.in',
  },
];

export default function DisclaimerPage() {
  return (
    <>
    <Navbar />
    <div className="relative min-h-screen bg-aurora overflow-x-hidden">
      <div className="pt-24 pb-8 px-4 md:px-6">
        <div className="max-w-[780px] mx-auto">

          {/* Header */}
          <div className="mb-10">
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-white/65 mb-4">Legal</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Disclaimer</h1>
            <p className="text-[13px] text-white/70">Last updated: {LAST_UPDATED}</p>
          </div>

          {/* Alert banner */}
          <div className="rounded-xl px-5 py-4 mb-8 flex gap-3 items-start"
            style={{ background: 'rgba(255,69,58,0.08)', border: '1px solid rgba(255,69,58,0.18)' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="rgba(255,100,90,0.9)" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div>
              <p className="text-[13px] font-semibold mb-0.5" style={{ color: 'rgba(255,100,90,0.9)' }}>
                This is NOT an official Government of Kerala website.
              </p>
              <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,120,110,0.7)', fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                ഇത് കേരള സർക്കാരിന്റെ ഔദ്യോഗിക വെബ്സൈറ്റ് അല്ല. ഒരു സ്വതന്ത്ര വിവര ശേഖരം മാത്രമാണ്.
              </p>
            </div>
          </div>

          {/* Points */}
          <div className="flex flex-col gap-4">
            {POINTS.map((p) => (
              <div key={p.title} className="glass-card rounded-2xl p-6">
                <div className="flex gap-3 items-start mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(255,159,10,0.12)', color: '#ff9f0a' }}>
                    {p.icon}
                  </div>
                  <h2 className="text-[14px] font-bold text-white/90 leading-snug">{p.title}</h2>
                </div>
                <p className="text-[13px] text-white/75 leading-relaxed mb-2">{p.content}</p>
                {p.links && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {p.links.map(l => (
                      <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                        className="text-[11px] px-2.5 py-1 rounded-lg no-underline transition-colors"
                        style={{ background: 'rgba(41,151,255,0.1)', color: '#2997ff', border: '1px solid rgba(41,151,255,0.2)' }}
                      >
                        {l.label} ↗
                      </a>
                    ))}
                  </div>
                )}
                <p className="text-[11.5px] text-white/65 leading-relaxed" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>{p.ml}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-[12px] text-white/65 text-center">
            Questions?{' '}
            <a href="/contact" className="text-white/80 hover:text-white transition-colors">Contact us</a>
            {' '}·{' '}
            <a href="/privacy-policy" className="text-white/80 hover:text-white transition-colors">Privacy Policy</a>
          </p>

        </div>
      </div>
      <Footer />
    </div>
    </>
  );
}
