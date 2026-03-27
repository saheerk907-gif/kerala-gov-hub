import Link from 'next/link';
import PensionCalculator from '@/components/PensionCalculator';
import RelatedLinks from '@/components/RelatedLinks';

const PENSION_FAQS = [
  {
    q: 'How is pension calculated for Kerala government employees?',
    a: "Basic Pension = (50% × Average Emoluments ÷ 30) × Qualifying Service (in years). Average Emoluments is the average of the last 10 months' salary. Maximum qualifying service counted is 30 years.",
  },
  {
    q: 'What is Average Emoluments (AE) in pension calculation?',
    a: 'Average Emoluments is the average of the Basic Pay + DA drawn during the last 10 months before retirement. If there was an increment or promotion in the last 10 months, a weighted average is calculated.',
  },
  {
    q: 'What is the maximum qualifying service for pension?',
    a: 'Maximum qualifying service counted for pension calculation is 30 years under KSR Part III. Service beyond 30 years does not increase the pension amount.',
  },
  {
    q: 'What is pension commutation and when can it be restored?',
    a: 'Commutation allows you to take a lump sum by surrendering a portion (maximum 40%) of your monthly pension. The commuted pension is restored after 12 years from the date of retirement. Commutation value = Commuted amount × 11.10 × 12.',
  },
  {
    q: 'What is Normal Family Pension in Kerala?',
    a: 'Normal Family Pension = 30% of last emoluments (Basic Pay + DA). Minimum is ₹4,500/month and maximum is ₹17,960/month as per current rules.',
  },
  {
    q: 'What is the retirement age for Kerala government employees?',
    a: 'The retirement age is 56 years for most Kerala government employees. For teachers under superannuation, retirement is at the end of the academic term (31st March or 31st May) after turning 56.',
  },
];

export default function PensionPage() {
  return (
    <div className="relative min-h-screen bg-aurora overflow-x-hidden">
      <div className="max-w-[960px] mx-auto px-4 pt-[100px] pb-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-white/50 mb-6">
          <Link href="/" className="hover:text-white/70 transition-colors no-underline text-white/50">Home</Link>
          <span className="text-white/30">›</span>
          <span className="text-white/70">Pension Calculator</span>
        </div>

        {/* H1 */}
        <h1 className="text-[clamp(20px,3.5vw,36px)] font-[900] tracking-[-0.03em] text-white leading-tight mb-3"
          style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
          Kerala Govt Pension Calculator 2026 — Calculate Basic Pension &amp; Commutation
        </h1>

        {/* Bilingual intro */}
        <div className="mb-8 flex flex-col gap-3">
          <p className="text-[14px] text-white/70 leading-relaxed text-justify">
            Kerala government employees retiring under the traditional pension scheme can use this calculator to estimate their monthly pension, Death-cum-Retirement Gratuity (DCRG), commutation value, and family pension — all calculated as per Kerala Service Rules (KSR) Part III. Enter your date of birth, total qualifying service, average emoluments, and commutation percentage to get instant results. This tool supports all retirement types: Pension, Superannuation, Invalid, and Voluntary. Applicable for employees who joined service before January 1, 2013.
          </p>
          <p className="text-[13px] text-white/60 leading-relaxed text-justify"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            കേരള സർക്കാർ ജീവനക്കാർക്ക് Retirement-ൽ ലഭിക്കുന്ന പെൻഷൻ Kerala Service Rules (KSR) Part III-ന് അനുസൃതമായി കണക്കാക്കുന്നു. Basic Pension = (Average Emoluments × Qualifying Service Years) ÷ 60 എന്ന ഫോർമുല ഉപയോഗിക്കുന്നു. Average Emoluments എന്നത് Retirement-ന് മുൻപുള്ള അവസാന 10 മാസത്തെ Basic Pay + DA-ന്റെ ശരാശരിയാണ്. Maximum Qualifying Service 30 വർഷമാണ്; അതിൽ കൂടുതൽ സർവ്വീസ് Pension Amount വർദ്ധിപ്പിക്കില്ല. ഈ Calculator ഉപയോഗിച്ച് Basic Pension, Normal Family Pension, DCRG, Commutation Value എന്നിവ ഒരേ സമയം കണക്കാക്കാം. Pension-ന്റെ Maximum 40% വരെ Commute ചെയ്ത് Lump Sum ആയി സ്വീകരിക്കാം; Commuted Pension 12 വർഷം കഴിഞ്ഞ് Restore ആകും. 2013 January 1-ന് ശേഷം Join ചെയ്ത ജീവനക്കാർ NPS-ൽ ഉൾപ്പെടുന്നതിനാൽ ഈ Calculator Traditional Pension ആനുകൂല്യങ്ങൾ കണക്കാക്കാൻ ഉദ്ദേശിച്ചതാണ്.
          </p>
        </div>

        {/* Calculator */}
        <PensionCalculator />

        {/* Example output block */}
        <div className="mt-8 rounded-2xl p-6"
          style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}>
          <h2 className="text-[13px] font-black uppercase tracking-widest mb-4"
            style={{ color: '#ff9f0a', fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            ഉദാഹരണം — Example Calculation
          </h2>
          <p className="text-[12px] text-white/50 mb-4">Average Emoluments: ₹70,000 · Qualifying Service: 30 years · Commutation: 40%</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[13px]">
            {[
              { label: 'Basic Pension', value: '₹35,000 / month' },
              { label: 'DCRG', value: '₹10,50,000' },
              { label: 'Family Pension', value: '₹21,000 / month' },
              { label: 'Commuted Value (40%)', value: '₹16,80,000 lump sum' },
              { label: 'Reduced Pension', value: '₹21,000 / month' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <span style={{ color: '#30d158' }}>✔</span>
                <span className="text-white/60">{label}:</span>
                <span className="text-white font-bold">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rich link cards section */}
        <div className="mt-8">
          <p className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-4">ഇനിയും വായിക്കുക</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/pension-calculation" className="no-underline group">
              <div className="rounded-2xl p-5 h-full flex flex-col gap-2 transition-all hover:scale-[1.01]"
                style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}>
                <p className="text-[13px] font-bold text-white leading-snug"
                  style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                  പെൻഷൻ കണക്കുകൂട്ടൽ — ഘട്ടം ഘട്ടമായുള്ള മാർഗ്ഗനിർദ്ദേശം
                </p>
                <p className="text-[12px] text-white/50 leading-relaxed flex-1">
                  KSR Part III pension formula, half-year units, and worked examples explained step by step
                </p>
                <span className="text-[12px] font-bold mt-1" style={{ color: '#2997ff' }}>
                  Read Guide <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
            <Link href="/pension-forms" className="no-underline group">
              <div className="rounded-2xl p-5 h-full flex flex-col gap-2 transition-all hover:scale-[1.01]"
                style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}>
                <p className="text-[13px] font-bold text-white leading-snug">
                  Pension Forms Download
                </p>
                <p className="text-[12px] text-white/50 leading-relaxed flex-1">
                  All 24 official pension forms — Form 1 to Form 24 — ready to download
                </p>
                <span className="text-[12px] font-bold mt-1" style={{ color: '#30d158' }}>
                  Download Forms <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Static FAQ section */}
        <section className="mt-10 max-w-[960px]">
          <div className="text-[10px] font-black uppercase tracking-widest text-white/45 mb-2">FAQ</div>
          <h2 className="text-[clamp(18px,2.5vw,26px)] font-[900] tracking-[-0.02em] text-white mb-6"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            പതിവ് ചോദ്യങ്ങൾ
          </h2>
          <div className="flex flex-col gap-2">
            {PENSION_FAQS.map((faq, i) => (
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
                <p className="px-5 pb-5 text-[13px] text-white/78 leading-relaxed text-justify"
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
            { href: '/retirement', label: 'Retirement date & countdown' },
            { href: '/dcrg', label: 'DCRG gratuity calculator' },
            { href: '/da-arrear', label: 'DA arrear calculator' },
          ]}
        />

      </div>
    </div>
  );
}
