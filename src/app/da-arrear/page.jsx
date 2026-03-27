import Link from 'next/link';
import DArrearCalculator from '@/components/DArrearCalculator';
import RelatedLinks from '@/components/RelatedLinks';

const DA_FAQS = [
  {
    q: 'What is DA arrear for Kerala government employees?',
    a: 'DA (Dearness Allowance) arrear is the difference between DA that was due to an employee and the DA that was actually paid during a period. Under 11th PRC, DA revisions were announced with a delay — so the difference between the due rate and the paid rate for each month is the arrear amount. Formula: DA Arrear = (DA Due% − DA Paid%) × Basic Pay × Number of months.',
  },
  {
    q: 'Why does the arrear period start from March 2021?',
    a: 'The 11th Pay Revision Commission (PRC) was implemented with effect from July 2019. DA arrears for the period July 2019 to February 2021 were fully settled via G.O.(P)No.27/2021. The remaining DA arrears — from March 2021 onwards — are what this calculator computes, in accordance with subsequent G.O.s issued by the Kerala Finance Department.',
  },
  {
    q: 'How many installments is the 2026 DA arrear paid in?',
    a: 'As per G.O.(P)No.27/2026/Fin dated 20/02/2026, Kerala government sanctioned DA arrear for three DA slabs effective January 2024, July 2024, and January 2025. The arrear is credited to the employee\'s GPF/PF account. Pensioners receive the corresponding DR (Dearness Relief) arrear as per the same G.O.',
  },
  {
    q: 'Is DA arrear credited to PF or paid in cash?',
    a: 'DA arrears sanctioned under the Kerala 11th PRC are credited to the employee\'s General Provident Fund (GPF) or PF account, not paid as cash. The GPF credit is subject to a lock-in period. Pensioners receive DR arrears as a separate payment as per the Finance Department G.O.',
  },
  {
    q: 'Is DA arrear taxable for Kerala government employees?',
    a: 'Yes, DA arrear received by Kerala government employees is taxable as salary income in the year of receipt under the Income Tax Act. However, employees can claim relief under Section 89(1) by filing Form 10E, which spreads the tax liability across the years to which the arrear relates, reducing the effective tax burden.',
  },
];

export default function DArrearPage() {
  return (
    <div className="min-h-screen bg-aurora text-white pt-[100px]">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-white/60 mb-8">
          <a href="/" className="hover:text-white transition-colors no-underline text-white/60">Home</a>
          <span>›</span>
          <span className="text-[#ff9f0a]">DA Arrear Calculator</span>
        </div>

        {/* H1 */}
        <h1 className="text-[clamp(20px,3.5vw,34px)] font-[900] tracking-[-0.03em] text-white leading-tight mb-3"
          style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
          Kerala DA Arrear Calculator 2021–2026 – Calculate Salary Arrears with Latest G.O.
        </h1>

        {/* Bilingual intro */}
        <div className="mb-8 flex flex-col gap-3">
          <p className="text-[14px] text-white/70 leading-relaxed text-justify">
            Kerala government employees can use this calculator to compute their Dearness Allowance (DA) arrears month-by-month from March 2021 to 2026, based on the official G.O.s issued by the Kerala Finance Department under the 11th Pay Revision Commission (11th PRC). Enter your basic pay, arrear period, and any increments or promotions to get a complete month-wise breakdown. The latest G.O.(P)No.27/2026 dated 20/02/2026 covers DA revisions up to January 2025 (35% DA). Supports all employee categories including those with mid-period increments, promotions, and TBHG.
          </p>
          <p className="text-[13px] text-white/60 leading-relaxed text-justify"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            കേരള സർക്കാർ ജീവനക്കാർക്ക് 11th PRC പ്രകാരം ലഭിക്കേണ്ട DA-യും യഥാർത്ഥത്തിൽ നൽകിയ DA-യും തമ്മിലുള്ള വ്യത്യാസമാണ് DA Arrear. ഓരോ മാസവും (DA Due% − DA Paid%) × Basic Pay എന്ന ഫോർമുല ഉപയോഗിച്ച് Arrear കണക്കാക്കുന്നു. July 2019 മുതൽ February 2021 വരെയുള്ള DA Arrear G.O.(P)No.27/2021 പ്രകാരം മുൻപ് settle ആയതിനാൽ, ഈ Calculator March 2021 മുതൽ ആരംഭിക്കുന്നു. ഏറ്റവും പുതിയ G.O.(P)No.27/2026/Fin dated 20/02/2026 പ്രകാരം January 2024, July 2024, January 2025 എന്നീ DA Slabs-ന്റെ Arrear GPF/PF Account-ൽ Credit ചെയ്യുന്നു. Increment, Promotion, TBHG എന്നിവ ഉള്ള ജീവനക്കാർക്കും ഈ Calculator ഉപയോഗിക്കാം.
          </p>
        </div>

        {/* Calculator */}
        <DArrearCalculator />

        {/* Why March 2021 */}
        <div className="mt-8 rounded-2xl p-6"
          style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}>
          <h2 className="text-[13px] font-black uppercase tracking-widest mb-3"
            style={{ color: '#ff9f0a', fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            Why Does the Arrear Start from March 2021?
          </h2>
          <p className="text-[13px] text-white/60 leading-relaxed text-justify mb-2">
            The 11th Pay Revision Commission was implemented with effect from <strong className="text-white/80">1st July 2019</strong>. DA arrears for the period <strong className="text-white/80">July 2019 to February 2021</strong> were fully settled as part of the initial 11th PRC arrear payment via <strong className="text-white/80">G.O.(P)No.27/2021</strong>. The remaining DA revisions — from March 2021 onwards — were delayed and sanctioned in installments through subsequent Finance Department G.O.s up to 2026.
          </p>
          <p className="text-[13px] text-white/60 leading-relaxed text-justify"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            ജീവനക്കാർ July 2019-ന് ശേഷം Join ചെയ്തിട്ടുണ്ടെങ്കിൽ Arrear Start Date യാന്ത്രികമായി Joining Month ആയി adjust ആകും.
          </p>
        </div>

        {/* 2026 G.O. section */}
        <div className="mt-6 rounded-2xl p-6"
          style={{ background: 'var(--surface-xs)', border: '1px solid rgba(41,151,255,0.2)' }}>
          <h2 className="text-[13px] font-black uppercase tracking-widest mb-4"
            style={{ color: '#2997ff', fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            Latest DA Arrear Order 2026 — G.O.(P)No.27/2026
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {[
              { label: 'G.O. Date', value: '20 February 2026' },
              { label: 'DA Slabs Covered', value: 'Jan 2024, Jul 2024, Jan 2025' },
              { label: 'DA Rate (Jan 2025)', value: '33% → 35%' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl p-3" style={{ background: 'rgba(41,151,255,0.07)', border: '1px solid rgba(41,151,255,0.15)' }}>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/45 mb-1">{label}</p>
                <p className="text-[13px] font-bold text-white/80">{value}</p>
              </div>
            ))}
          </div>
          <ul className="text-[13px] text-white/60 leading-relaxed space-y-1.5 list-none">
            <li className="flex gap-2"><span style={{ color: '#2997ff' }}>→</span> DA arrear is <strong className="text-white/75">credited to GPF/PF account</strong>, not paid as cash</li>
            <li className="flex gap-2"><span style={{ color: '#2997ff' }}>→</span> Pensioners receive <strong className="text-white/75">DR arrear</strong> as per the same G.O.</li>
            <li className="flex gap-2"><span style={{ color: '#2997ff' }}>→</span> Income Tax relief available under <strong className="text-white/75">Section 89(1) — Form 10E</strong></li>
          </ul>
        </div>

        {/* Example calculation */}
        <div className="mt-6 rounded-2xl p-6"
          style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}>
          <h2 className="text-[13px] font-black uppercase tracking-widest mb-4"
            style={{ color: '#ff9f0a', fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            ഉദാഹരണം — Example DA Arrear Calculation
          </h2>
          <p className="text-[12px] text-white/50 mb-4">Basic Pay: ₹40,000 · DA Due: 28% · DA Paid: 18% · Period: Jan 2024</p>
          <div className="font-mono text-[13px] space-y-2">
            <div className="flex items-center gap-2">
              <span style={{ color: '#ff9f0a' }}>→</span>
              <span className="text-white/60">DA Due:</span>
              <span className="text-white font-bold">28% × ₹40,000 = ₹11,200</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: '#ff453a' }}>→</span>
              <span className="text-white/60">DA Paid:</span>
              <span className="text-white font-bold">18% × ₹40,000 = ₹7,200</span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
              <span style={{ color: '#30d158' }}>✔</span>
              <span className="text-white/60">Arrear (Jan 2024):</span>
              <span className="font-bold" style={{ color: '#30d158' }}>₹11,200 − ₹7,200 = ₹4,000/month</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: '#30d158' }}>✔</span>
              <span className="text-white/60">For 12 months (Jan–Dec 2024):</span>
              <span className="font-bold" style={{ color: '#30d158' }}>₹48,000 total arrear</span>
            </div>
          </div>
        </div>

        {/* Internal links */}
        <div className="mt-8">
          <p className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-4">Related Calculators</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/pension" className="no-underline group">
              <div className="rounded-2xl p-5 h-full flex flex-col gap-2 transition-all hover:scale-[1.01]"
                style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}>
                <p className="text-[13px] font-bold text-white leading-snug">Pension Calculator</p>
                <p className="text-[12px] text-white/50 leading-relaxed flex-1">
                  Calculate basic pension, DCRG, commutation value and family pension based on KSR Part III rules
                </p>
                <span className="text-[12px] font-bold mt-1" style={{ color: '#ff9f0a' }}>
                  Open Calculator <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
            <Link href="/retirement" className="no-underline group">
              <div className="rounded-2xl p-5 h-full flex flex-col gap-2 transition-all hover:scale-[1.01]"
                style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}>
                <p className="text-[13px] font-bold text-white leading-snug">Retirement Calculator</p>
                <p className="text-[12px] text-white/50 leading-relaxed flex-1">
                  Find your retirement date, LPR start date, and pension estimate based on date of birth
                </p>
                <span className="text-[12px] font-bold mt-1" style={{ color: '#30d158' }}>
                  Open Calculator <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Static FAQ */}
        <section className="mt-10">
          <div className="text-[10px] font-black uppercase tracking-widest text-white/45 mb-2">FAQ</div>
          <h2 className="text-[clamp(18px,2.5vw,26px)] font-[900] tracking-[-0.02em] text-white mb-6"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-2">
            {DA_FAQS.map((faq, i) => (
              <details key={i} className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid var(--surface-xs)', background: 'var(--surface-xs)' }}>
                <summary className="px-5 py-4 cursor-pointer list-none flex items-center justify-between gap-4"
                  style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                  <span className="text-[14px] font-bold text-white/80 leading-snug">{faq.q}</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" className="flex-shrink-0" style={{ color: '#ff9f0a' }}>
                    <path d="M2 5l5 5 5-5"/>
                  </svg>
                </summary>
                <p className="px-5 pb-5 text-[13px] text-white/70 leading-relaxed text-justify"
                  style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <RelatedLinks
          heading="Related Calculators"
          links={[
            { href: '/pension', label: 'Kerala pension calculator' },
            { href: '/income-tax', label: 'Income tax relief — Section 89(1)' },
            { href: '/retirement', label: 'Retirement date calculator' },
          ]}
        />

      </div>
    </div>
  );
}
