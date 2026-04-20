import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import LoanPrepaymentCalculator from '@/components/LoanPrepaymentCalculator';

export const metadata = buildMetadata({
  title: 'Loan Prepayment Calculator 2026 – Interest Saved, Amortization',
  description: 'Calculate how much interest you save with loan prepayments. Compare scenarios, view monthly amortization schedule, and see your outstanding balance reduce with lump-sum or extra monthly payments.',
  path: '/loan-prepayment',
  keywords: [
    'loan prepayment calculator',
    'home loan prepayment calculator India',
    'interest saved prepayment',
    'loan amortization schedule India',
    'EMI prepayment benefit',
    'extra EMI calculator',
    'lump sum prepayment home loan',
    'loan tenure reduction calculator',
    'Kerala home loan calculator',
    'housing loan prepayment',
  ],
});

const FAQS = [
  {
    q: 'Does prepaying a loan actually save money?',
    a: 'Yes — significantly. Home loans use reducing-balance interest, meaning the outstanding principal earns interest every month. Paying extra principal early reduces this base, so every subsequent month charges less interest. On a ₹30 lakh, 20-year loan at 8.5%, a one-time ₹2 lakh prepayment in month 12 can save over ₹4–5 lakh in total interest.',
  },
  {
    q: 'When is the best time to make a prepayment?',
    a: 'The earlier in the loan tenure, the better. In the early months, most of your EMI goes toward interest rather than principal. Prepaying reduces the outstanding principal, which in turn reduces future interest charges. A prepayment in year 1 saves significantly more than the same amount paid in year 15.',
  },
  {
    q: 'Should I reduce EMI or reduce tenure when prepaying?',
    a: 'Reducing tenure (keeping EMI the same) saves more interest overall. When you reduce EMI, you still pay interest over the original period — just a bit less each month. When you reduce tenure, the loan closes sooner so the remaining months of interest are completely eliminated. Most financial planners recommend reducing tenure unless you need cash flow relief.',
  },
  {
    q: 'Is there a penalty for prepaying a home loan in India?',
    a: 'As per RBI guidelines (circular DBOD.No.Dir.BC.107/13.03.00/2011-12), banks and NBFCs cannot charge foreclosure or prepayment penalties on floating-rate home loans to individual borrowers. Fixed-rate loans may carry a prepayment penalty of 1–3% — check your loan agreement. Most current home loans in India are floating-rate, so prepayment is penalty-free.',
  },
  {
    q: 'How does extra monthly EMI differ from a lump-sum prepayment?',
    a: 'An extra monthly payment reduces your principal by a small amount every month — the effect compounds gradually over years. A lump-sum prepayment (e.g., using your annual bonus) delivers a large one-time reduction. Both work well; the best approach depends on your cash flow. If you receive irregular windfalls, lump-sum prepayments are better. If you can sustain a higher monthly outgo, extra monthly payments are more disciplined.',
  },
  {
    q: 'What should I consider before prepaying — loan or invest?',
    a: 'Compare your effective loan interest rate vs post-tax investment returns. If your home loan is at 8.5% and your FD/PPF returns 7%, prepaying gives an effective guaranteed 8.5% "return" (interest saved). However if you can earn 12%+ in equity with a long horizon, investing may be better. Tax benefit under Sec 24(b) (₹2L deduction on home loan interest) also reduces the effective loan cost for taxpayers in the 30% slab.',
  },
];

export default function LoanPrepaymentPage() {
  return (
    <div className="min-h-screen bg-aurora text-white overflow-x-hidden">
      <div className="relative max-w-[1180px] mx-auto px-4 pt-[100px] pb-20">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-white/55 mb-8 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors no-underline text-white/55">Home</Link>
          <span>›</span>
          <Link href="/calculators" className="hover:text-white transition-colors no-underline text-white/55">Calculators</Link>
          <span>›</span>
          <span style={{ color: '#ff9f0a' }}>Loan Prepayment</span>
        </div>

        {/* Page heading */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-5"
          style={{ color: '#ff9f0a', border: '1px solid rgba(255,159,10,0.25)', background: 'rgba(255,159,10,0.08)' }}>
          🏦 Loan Calculator
        </div>

        <h1 className="text-[clamp(22px,4vw,42px)] font-[900] tracking-[-0.03em] text-white leading-tight mb-4"
          style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
          Loan Prepayment Calculator — Interest Saved &amp; Amortization Schedule
        </h1>

        <p className="text-[14px] text-white/65 leading-relaxed mb-3 max-w-3xl">
          See exactly how much interest you save by prepaying your home, car, or personal loan. Add lump-sum prepayments (bonus, maturity proceeds), set a recurring extra monthly payment, view the full month-by-month amortization schedule, and compare multiple scenarios side by side.
        </p>
        <p className="text-[13px] text-white/50 leading-relaxed mb-10 max-w-3xl"
          style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
          ലോൺ മുൻകൂർ അടയ്ക്കുന്നതിലൂടെ എത്ര പലിശ ലാഭിക്കാം? Extra EMI, Lump-sum prepayment, Scenario comparison — ഇവ എല്ലാം ഈ calculator-ൽ കണക്കാക്കാം.
        </p>

        {/* Calculator */}
        <LoanPrepaymentCalculator />

        {/* How to use */}
        <div className="mt-12 rounded-2xl p-6"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 className="text-[13px] font-black uppercase tracking-widest mb-5" style={{ color: '#ff9f0a' }}>
            How to Use This Calculator
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { n: '1', title: 'Enter Loan Details', desc: 'Set your loan amount, annual interest rate, and original tenure using the sliders or by typing directly into the gold chip.' },
              { n: '2', title: 'Add Prepayments', desc: 'Drag the "Extra Monthly Payment" slider to simulate paying more each month. Click "+ Add" to enter one-time lump-sum prepayments at any month.' },
              { n: '3', title: 'Read the Results', desc: 'The stat cards show your interest saved and how many months early your loan closes. Switch between Charts, Amortization, and Summary tabs.' },
              { n: '4', title: 'Compare Scenarios', desc: 'Name and save up to 4 different prepayment strategies. The comparison table at the bottom shows them side by side.' },
            ].map(step => (
              <div key={step.n} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                  style={{ background: 'rgba(255,159,10,0.15)', color: '#ff9f0a', border: '1px solid rgba(255,159,10,0.3)' }}>
                  {step.n}
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-1">{step.title}</div>
                  <div className="text-[12px] text-white/55 leading-relaxed">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Tools */}
        <div className="mt-8">
          <p className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-4">Related Tools</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: '/income-tax',  color: '#ff9f0a', label: 'Income Tax Calculator',   desc: 'Compute IT liability under New & Old Regime for FY 2025-26' },
              { href: '/pension-calculation', color: '#30d158', label: 'Pension Calculator', desc: 'KSR pension, DCRG, commutation & family pension for retiring employees' },
              { href: '/nps-aps',     color: '#2997ff', label: 'NPS vs APS Calculator',   desc: 'Compare NPS corpus vs Assured Pension Scheme retirement income' },
            ].map(link => (
              <Link key={link.href} href={link.href} className="no-underline group">
                <div className="rounded-2xl p-5 h-full flex flex-col gap-2 transition-all hover:scale-[1.01]"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-[13px] font-bold text-white leading-snug">{link.label}</p>
                  <p className="text-[12px] text-white/50 leading-relaxed flex-1">{link.desc}</p>
                  <span className="text-[12px] font-bold mt-1" style={{ color: link.color }}>Open →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <section className="mt-12">
          <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">FAQ</div>
          <h2 className="text-[clamp(18px,2.5vw,28px)] font-[900] tracking-[-0.02em] text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-2">
            {FAQS.map((faq, i) => (
              <details key={i} className="rounded-2xl overflow-hidden group"
                style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
                <summary className="px-5 py-4 cursor-pointer list-none flex items-center justify-between gap-4">
                  <span className="text-[14px] font-bold text-white/80 leading-snug">{faq.q}</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" className="shrink-0 transition-transform group-open:rotate-180"
                    style={{ color: '#ff9f0a' }}>
                    <path d="M2 5l5 5 5-5" />
                  </svg>
                </summary>
                <p className="px-5 pb-5 text-[13px] text-white/65 leading-relaxed">
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
