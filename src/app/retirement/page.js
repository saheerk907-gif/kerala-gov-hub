import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RetirementCalculator from '@/components/RetirementCalculator';

const RETIREMENT_FAQS = [
  {
    q: 'What is the retirement age for Kerala government employees?',
    a: 'കേരള സർക്കാർ ജീവനക്കാർക്ക് Retirement Age 56 വർഷം ആണ്. Superannuation Retirement-ൽ (Teachers etc.) 56 വർഷം തികയുന്നതിന് ശേഷമുള്ള Academic Term-ന്റെ അവസാനം (March 31 or May 31) ആണ് Retirement Date. മറ്റ് ജീവനക്കാർ ജനന മാസത്തിന്റെ അവസാന ദിവസം Retire ആകും.',
  },
  {
    q: 'What is LPR (Leave Preparatory to Retirement)?',
    a: 'Leave Preparatory to Retirement (LPR) എന്നത് Retirement-ന് തൊട്ടുമുൻപ് Earned Leave ആയി വാങ്ങുന്ന അവകാശ അവധിയാണ്. Maximum 300 ദിവസം LPR ആയി എടുക്കാം. LPR Start Date = Retirement Date − Earned Leave Balance Days.',
  },
  {
    q: 'How is the retirement date calculated when born on the 1st of a month?',
    a: 'ജനനം മാസത്തിന്റെ 1-ആം തീയ്യതിയാണെങ്കിൽ, Retirement Date അതിന് ഒരു മാസം മുൻപുള്ള മാസത്തിന്റെ അവസാന ദിവസം ആണ് കണക്കാക്കും. ഉദാഹരണം: 01/06/1968 ജനിച്ചവർ 31/05/2024-ൽ Retire ആകും.',
  },
  {
    q: 'What benefits does a Kerala government employee get on retirement?',
    a: 'Retirement-ൽ ലഭിക്കുന്ന ആനുകൂല്യങ്ങൾ: (1) Monthly Pension — Basic Pension + DA, (2) DCRG — Lump sum, maximum ₹14,00,000, (3) Leave Encashment — Surrendered Earned Leave-ന്റെ Salary, (4) Commutation — Pension-ന്റെ 40% വരെ Lump Sum ആയി, (5) Group Insurance maturity.',
  },
  {
    q: 'What is the difference between traditional pension and NPS at retirement?',
    a: '2013 January 1-ന് മുൻപ് Join ചെയ്തവർ Traditional Pension Scheme-ൽ ആണ്: Fixed Monthly Pension, DCRG, Family Pension ഉണ്ട്. 2013-ന് ശേഷം Join ചെയ്തവർ NPS-ൽ ആണ്: Retirement-ൽ Corpus-ന്റെ 60% Tax-free ആയി withdraw ചെയ്യാം; 40% Annuity ആയി Monthly Income ലഭിക്കും.',
  },
];

export default function RetirementPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-aurora text-white pt-[100px]">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 text-xs text-white/60 mb-8">
            <a href="/" className="hover:text-white transition-colors no-underline text-white/60">Home</a>
            <span>›</span>
            <span className="text-[#30d158]">Retirement Calculator</span>
          </div>

          {/* H1 + intro */}
          <h1 className="text-[clamp(20px,3.5vw,34px)] font-[900] tracking-[-0.03em] text-white leading-tight mb-3"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            Retirement Calculator — Kerala Government Employees
          </h1>
          <p className="text-[13px] text-white/60 leading-relaxed mb-8"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            കേരള സർക്കാർ ജീവനക്കാരുടെ Retirement Date, Leave Preparatory to Retirement (LPR) Start Date, Monthly Pension, DCRG തുക എന്നിവ ഈ Calculator ഉപയോഗിച്ച് കണക്കാക്കാം. KSR Part III-ന് അനുസൃതമായി Retirement Age 56 വർഷം ആണ്. ജനന മാസത്തിന്റെ അവസാന ദിവസം ആണ് Retirement Date; ജനനം 1-ആം തീയ്യതിയാണെങ്കിൽ ഒരു മാസം മുൻപ് Retire ആകും. Superannuation Retirement-ൽ (Teachers) 56 വർഷം ശേഷം Academic Term-ന്റെ അവസാനം (March 31 / May 31) ആണ് തീയ്യതി. Traditional Pension (pre-2013) ഉം NPS (2013-ന് ശേഷം) ഉം ഈ Calculator-ൽ Support ചെയ്യുന്നു.
          </p>

          <RetirementCalculator />

          {/* Benefits summary grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Retirement Date', sub: 'ജനന തീയ്യതി അനുസരിച്ച് KSR Rule പ്രകാരം' },
              { label: 'LPR Start Date', sub: 'Earned Leave Balance-ന് അനുസൃതമായ Duty Exemption' },
              { label: 'Monthly Pension', sub: 'Basic Pension (Traditional) / NPS Corpus Estimate' },
              { label: 'DCRG Amount', sub: 'Lump Sum Gratuity, Maximum ₹14,00,000' },
            ].map(({ label, sub }) => (
              <div key={label} className="rounded-2xl p-4"
                style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}>
                <p className="text-[13px] font-bold text-white mb-1">{label}</p>
                <p className="text-[12px] text-white/50 leading-relaxed"
                  style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Link card → pension calculator */}
          <div className="mt-6">
            <a href="/pension" className="no-underline">
              <div className="rounded-2xl p-5 flex flex-col gap-2 transition-all hover:scale-[1.01]"
                style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}>
                <p className="text-[13px] font-bold text-white">Pension Calculator</p>
                <p className="text-[12px] text-white/50 leading-relaxed">
                  Calculate Basic Pension, DCRG, commutation value and family pension based on KSR Part III rules.
                </p>
                <span className="text-[12px] font-bold mt-1" style={{ color: '#2997ff' }}>
                  Open Calculator <span aria-hidden="true">→</span>
                </span>
              </div>
            </a>
          </div>

          {/* Static FAQ — server-rendered for SEO */}
          <section className="mt-10">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/45 mb-2">FAQ</div>
            <h2 className="text-[clamp(18px,2.5vw,26px)] font-[900] tracking-[-0.02em] text-white mb-6"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              Frequently Asked Questions
            </h2>
            <div className="flex flex-col gap-2">
              {RETIREMENT_FAQS.map((faq, i) => (
                <details key={i} className="rounded-2xl overflow-hidden"
                  style={{ border: '1px solid var(--surface-xs)', background: 'var(--surface-xs)' }}>
                  <summary className="px-5 py-4 cursor-pointer list-none flex items-center justify-between gap-4"
                    style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                    <span className="text-[14px] font-bold text-white/80 leading-snug">{faq.q}</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" className="flex-shrink-0" style={{ color: '#30d158' }}>
                      <path d="M2 5l5 5 5-5"/>
                    </svg>
                  </summary>
                  <p className="px-5 pb-5 text-[13px] text-white/78 leading-relaxed"
                    style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
