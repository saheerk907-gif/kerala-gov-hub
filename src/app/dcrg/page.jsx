import Link from 'next/link';
import DcrgCalculator from '@/components/DcrgCalculator';

const DCRG_FAQS = [
  {
    q: 'What is DCRG for Kerala government employees?',
    a: 'DCRG (Death-cum-Retirement Gratuity) is a lump sum payment made to a government employee on retirement, or to the family in case of death during service. It is governed by Rule 77 of Kerala Service Rules (KSR) Part III. DCRG is distinct from pension — it is a one-time benefit, not a monthly payment.',
  },
  {
    q: 'How is DCRG calculated in Kerala?',
    a: 'DCRG = (Last Month Emoluments ÷ 2) × Qualifying Service (in completed years). Last Month Emoluments = Basic Pay + DA at the time of retirement. Qualifying service is capped at 33 years. Months beyond a half-year (6 months + 1 day) in the final year are rounded up to a full year. Maximum DCRG payable is ₹20,00,000.',
  },
  {
    q: 'What is the maximum DCRG amount in Kerala?',
    a: 'The maximum DCRG payable to a Kerala government employee is ₹20,00,000 (Twenty Lakh Rupees) as per current rules. If the formula (LE × qualifying years ÷ 2) exceeds this limit, the amount is capped at ₹20,00,000.',
  },
  {
    q: 'Is DCRG different from Death Gratuity?',
    a: 'Yes. Retirement DCRG is paid on superannuation or voluntary retirement after completing minimum 5 years of qualifying service. Death Gratuity is paid to the family when an employee dies in service — there is no minimum service requirement for Death Gratuity. The Death Gratuity formula varies by service slab: 2× LE (< 1 yr), 6× LE (1–5 yrs), 12× LE (5–20 yrs), or LE × years ÷ 2 (20+ yrs, min 12×, max 16.5×).',
  },
  {
    q: 'What is the minimum qualifying service for DCRG?',
    a: 'A minimum of 5 years of qualifying service is required to be eligible for Retirement DCRG. For Death Gratuity (death in service), there is no minimum service requirement — the family receives benefit from day one of service.',
  },
  {
    q: 'Is DCRG taxable for Kerala government employees?',
    a: 'No. Gratuity received by central and state government employees is fully exempt from income tax under Section 10(10)(i) of the Income Tax Act. There is no tax liability on DCRG regardless of the amount received.',
  },
];

export default function DCRGPage() {
  return (
    <div className="min-h-screen bg-aurora text-white pt-[100px]">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-white/60 mb-8">
          <a href="/" className="hover:text-white transition-colors no-underline text-white/60">Home</a>
          <span>›</span>
          <span className="text-[#ff9f0a]">DCRG Calculator</span>
        </div>

        {/* H1 */}
        <h1 className="text-[clamp(20px,3.5vw,34px)] font-[900] tracking-[-0.03em] text-white leading-tight mb-3"
          style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
          DCRG Calculator — Death-cum-Retirement Gratuity Kerala Government Employees 2026
        </h1>

        {/* Bilingual intro */}
        <div className="mb-8 flex flex-col gap-3">
          <p className="text-[14px] text-white/70 leading-relaxed text-justify">
            Kerala government employees can use this calculator to compute their Death-cum-Retirement Gratuity (DCRG) as per Rule 77 of Kerala Service Rules (KSR) Part III. Enter your last basic pay, DA rate (auto-filled from retirement date), qualifying service years, and months to instantly calculate your DCRG lump sum. Supports both Retirement DCRG (minimum 5 years service) and Death Gratuity (in-service death, no minimum). DA rates for 10th PRC and 11th PRC are built in — maximum DCRG is ₹20,00,000.
          </p>
          <p className="text-[13px] text-white/60 leading-relaxed text-justify"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            കേരള സർക്കാർ ജീവനക്കാർക്ക് Retirement-ൽ ലഭിക്കുന്ന DCRG (Death-cum-Retirement Gratuity) KSR Rule 77 അനുസരിച്ച് കണക്കാക്കുന്നു. ഫോർമുല: DCRG = (അവസാന ശമ്പളം + DA) ÷ 2 × Qualifying Service Years. Qualifying Service പരമാവധി 33 വർഷമാണ്. കുറഞ്ഞത് 5 വർഷം Service ഉള്ളവർക്കേ Retirement DCRG ലഭിക്കൂ. Service-ൽ മരണം സംഭവിക്കുകയാണെങ്കിൽ Death Gratuity കുടുംബത്തിന് ലഭിക്കും — ഇതിന് Minimum Service ഇല്ല. DCRG-ന് Income Tax ഇല്ല — Section 10(10)(i) പ്രകാരം പൂർണ്ണ Tax Exemption ഉണ്ട്. Maximum DCRG ₹20,00,000 ആണ്.
          </p>
        </div>

        {/* Calculator */}
        <DcrgCalculator />

        {/* Example calculation */}
        <div className="mt-8 rounded-2xl p-6"
          style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}>
          <h2 className="text-[13px] font-black uppercase tracking-widest mb-4"
            style={{ color: '#ff9f0a', fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            ഉദാഹരണം — Example DCRG Calculation
          </h2>
          <p className="text-[12px] text-white/50 mb-4">
            Basic Pay: ₹50,000 · DA: 35% (11th PRC) · Qualifying Service: 30 years
          </p>
          <div className="font-mono text-[13px] space-y-2">
            <div className="flex items-center gap-2">
              <span style={{ color: '#ff9f0a' }}>→</span>
              <span className="text-white/60">Last Emoluments (LE):</span>
              <span className="text-white font-bold">₹50,000 + 35% = ₹67,500</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: '#ff9f0a' }}>→</span>
              <span className="text-white/60">Formula:</span>
              <span className="text-white font-bold">₹67,500 × 30 ÷ 2 = ₹10,12,500</span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
              <span style={{ color: '#30d158' }}>✔</span>
              <span className="text-white/60">DCRG Payable:</span>
              <span className="font-bold" style={{ color: '#30d158' }}>₹10,12,500 (below ₹20L cap — full amount)</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: '#30d158' }}>✔</span>
              <span className="text-white/60">Tax:</span>
              <span className="font-bold" style={{ color: '#30d158' }}>Fully exempt under Section 10(10)(i)</span>
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
                  Calculate basic pension, commutation value and family pension under KSR Part III
                </p>
                <span className="text-[12px] font-bold mt-1" style={{ color: '#ff9f0a' }}>
                  Open Calculator <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
            <Link href="/retirement" className="no-underline group">
              <div className="rounded-2xl p-5 h-full flex flex-col gap-2 transition-all hover:scale-[1.01]"
                style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}>
                <p className="text-[13px] font-bold text-white leading-snug">Retirement Date Calculator</p>
                <p className="text-[12px] text-white/50 leading-relaxed flex-1">
                  Find your exact retirement date and LPR start date based on date of birth
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
            {DCRG_FAQS.map((faq, i) => (
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

      </div>
    </div>
  );
}
