import Link from 'next/link';
import NpsApsCalculator from '@/components/NpsApsCalculator';

const NPS_APS_FAQS = [
  {
    q: 'What is the difference between NPS and APS for Kerala government employees?',
    a: 'NPS (National Pension System) is a market-linked pension scheme where the retirement corpus depends on investment returns. APS (Assured Pension Scheme) guarantees 50% of last drawn basic salary as pension, similar to the old traditional pension scheme. APS provides certainty regardless of market conditions, while NPS can yield higher returns if markets perform well but comes with uncertainty.',
  },
  {
    q: 'Who is eligible for APS in Kerala?',
    a: 'Kerala government employees who joined service on or after 01-04-2013 (covered under NPS) are eligible to opt for the Assured Pension Scheme (APS) as per G.O.(P) No.33/2026/F.N dated 28.02.2026. Employees must formally opt in — it is not automatic.',
  },
  {
    q: 'Which is better — NPS or APS for Kerala government employees?',
    a: 'APS is generally safer as it guarantees 50% of last basic salary as pension, and the pension grows annually with Dearness Relief (DR). NPS can provide a higher monthly income if NPS fund returns are strong (historically 9–12%), plus a 60% tax-free lump sum at retirement. Employees with long service and preference for certainty benefit from APS; those comfortable with market risk may find NPS corpus more valuable.',
  },
  {
    q: 'What is the employer contribution in NPS for Kerala?',
    a: 'In NPS, the employee contributes 10% of (Basic Pay + DA), and the government (employer) contributes 10% of (Basic Pay + DA) to the NPS corpus. Both amounts are invested monthly in the NPS fund. The total monthly contribution grows as Basic Pay increases through increments, DA revisions, and pay revision commissions.',
  },
  {
    q: 'Can I switch from NPS to APS in Kerala?',
    a: 'Yes, eligible NPS-covered employees in Kerala can opt for APS as per G.O.(P) No.33/2026/F.N (28.02.2026). Note: the G.O. does not mention a lump sum under APS. Once opted, the accumulated NPS corpus is handled as per scheme rules. Check the latest Finance Department circular for the current opt-in window and procedure.',
  },
  {
    q: 'What happens to NPS corpus after retirement in Kerala?',
    a: 'On retirement under NPS, the employee must use at least 40% of the accumulated corpus to purchase an annuity plan from an empanelled insurer, which pays a monthly pension. The remaining 60% can be withdrawn as a lump sum, which is fully tax-free. The monthly pension from the annuity is fixed and does not increase with inflation unlike APS which grows with Dearness Relief.',
  },
];

export default function NpsApsPage() {
  return (
    <div className="min-h-screen bg-aurora text-white overflow-x-hidden relative">
      <div className="relative max-w-[1100px] mx-auto px-4 pt-[100px] pb-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-white/60 mb-8 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors no-underline text-white/60">Home</Link>
          <span>›</span>
          <span className="text-[#ff9f0a]">NPS vs APS Calculator</span>
        </div>

        {/* H1 */}
        <h1 className="text-[clamp(20px,3.5vw,36px)] font-[900] tracking-[-0.03em] text-white leading-tight mb-3"
          style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
          NPS vs APS Calculator 2026 — Kerala Government Employees Pension Comparison
        </h1>

        {/* Bilingual intro */}
        <div className="mb-8 flex flex-col gap-3">
          <p className="text-[14px] text-white/70 leading-relaxed text-justify">
            Kerala government employees covered under NPS (joined on or after 01-04-2013) can now choose between the National Pension System and the new Assured Pension Scheme (APS) introduced via G.O.(P) No.33/2026/F.N. This calculator projects your retirement corpus, monthly pension under both schemes, NPS lump sum, and post-retirement income over 25 years — based on actual Kerala Pay Revision Commission schedules (12th PRC onwards), DA growth, and configurable NPS return assumptions. Enter your date of birth, joining year, basic pay, and DA to see which scheme suits you.
          </p>
          <p className="text-[13px] text-white/60 leading-relaxed text-justify"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            01-04-2013-ന് ശേഷം Kerala സർക്കാർ സർവ്വീസിൽ ചേർന്ന ജീവനക്കാർ NPS-ൽ ഉൾപ്പെടുന്നു. G.O.(P) No.33/2026/F.N (28.02.2026) പ്രകാരം ഇവർക്ക് Assured Pension Scheme (APS) തിരഞ്ഞെടുക്കാൻ അവസരം ഉണ്ട്. APS-ൽ അവസാന Basic Pay-ന്റെ 50% Pension ആയി ലഭിക്കും — 30+ വർഷം സർവ്വീസ് ഉള്ളവർക്ക്. NPS-ൽ Corpus-ന്റെ 60% Tax-free Lump Sum ആയും 40% Annuity ആയും ലഭിക്കും. ഈ Calculator 12th PRC (2026), 13th PRC (2031) തുടങ്ങി ഭാവി Pay Revision-കളും DA വർദ്ധനയും കണക്കിലെടുത്ത് രണ്ട് Scheme-കളും താരതമ്യം ചെയ്യുന്നു.
          </p>
        </div>

        {/* Calculator */}
        <NpsApsCalculator />

        {/* Comparison table */}
        <div className="mt-8 rounded-2xl p-6"
          style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}>
          <h2 className="text-[13px] font-black uppercase tracking-widest mb-5"
            style={{ color: '#ff9f0a', fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            NPS vs APS — Key Differences
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]" style={{ minWidth: 480 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th className="py-2 px-4 text-left text-[10px] font-black uppercase tracking-widest text-white/45">Feature</th>
                  <th className="py-2 px-4 text-left text-[10px] font-black uppercase tracking-widest" style={{ color: '#30d158' }}>APS</th>
                  <th className="py-2 px-4 text-left text-[10px] font-black uppercase tracking-widest" style={{ color: '#2997ff' }}>NPS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Monthly Pension', '50% of last basic (30+ yrs)', 'Depends on corpus & annuity rate'],
                  ['Pension Growth', 'Grows with Dearness Relief annually', 'Fixed annuity — no DR'],
                  ['Lump Sum', 'Not mentioned in G.O.', '60% of corpus tax-free'],
                  ['DCRG', 'Not applicable', 'Not applicable'],
                  ['Market Risk', 'None — guaranteed', 'Yes — depends on NPS returns'],
                  ['Family Pension', 'Yes — as per rules', 'Annuity scheme dependent'],
                  ['Eligibility', 'NPS employees (post 2013)', 'All NPS employees'],
                ].map(([feature, aps, nps], i) => (
                  <tr key={i} className="border-b border-white/[0.04]">
                    <td className="py-2.5 px-4 text-white/60 font-semibold">{feature}</td>
                    <td className="py-2.5 px-4 text-white/75">{aps}</td>
                    <td className="py-2.5 px-4 text-white/75">{nps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Internal links */}
        <div className="mt-8">
          <p className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-4">Related Tools</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/pension" className="no-underline group">
              <div className="rounded-2xl p-5 h-full flex flex-col gap-2 transition-all hover:scale-[1.01]"
                style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}>
                <p className="text-[13px] font-bold text-white leading-snug">Pension Calculator (Traditional)</p>
                <p className="text-[12px] text-white/50 leading-relaxed flex-1">
                  For pre-2013 employees — calculate basic pension, DCRG, commutation and family pension under KSR Part III
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
                  Find your retirement date, LPR start date and pension estimate based on date of birth
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
            {NPS_APS_FAQS.map((faq, i) => (
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
