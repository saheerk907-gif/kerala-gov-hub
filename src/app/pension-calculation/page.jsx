import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Kerala Pension Calculation — How Pension is Calculated',
  description:
    'How pension is calculated for Kerala government employees — qualifying service, average emoluments, basic pension formula, commutation, family pension, DCRG, and gratuity under Kerala Service Rules.',
  keywords:
    'Kerala pension calculation, how pension is calculated Kerala, Kerala government pension formula, qualifying service pension, pension commutation Kerala, family pension Kerala, DCRG calculation',
  alternates: { canonical: 'https://keralaemployees.in/pension-calculation' },
  openGraph: {
    title: 'Kerala Pension Calculation — Complete Guide',
    description: 'How pension is calculated for Kerala government employees — formula, qualifying service, commutation, family pension, DCRG.',
    url: 'https://keralaemployees.in/pension-calculation',
    type: 'article',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Kerala pension-ന് minimum qualifying service എത്ര വർഷം?',
      acceptedAnswer: { '@type': 'Answer', text: 'Pension ലഭിക്കാൻ minimum 10 years qualifying service ആവശ്യമാണ്. 10 years-ൽ കൂടുതൽ service ഉള്ളവർക്ക് proportionate pension ലഭിക്കും.' },
    },
    {
      '@type': 'Question',
      name: 'Kerala pension formula എന്താണ്?',
      acceptedAnswer: { '@type': 'Answer', text: 'Basic Pension = (Average Emoluments × Qualifying Service) ÷ 66. Maximum pension = Last drawn basic pay-ന്റെ 50%. Minimum pension = ₹9,000 per month.' },
    },
    {
      '@type': 'Question',
      name: 'Pension commutation എന്താണ്?',
      acceptedAnswer: { '@type': 'Answer', text: 'Basic pension-ന്റെ maximum 40% lump sum ആയി receive ചെയ്യാം. Commuted amount = Commuted portion × 12 × commutation factor (age based). 15 years ശേഷം full pension restore ആകും.' },
    },
    {
      '@type': 'Question',
      name: 'Family pension ആർക്ക് ലഭിക്കും?',
      acceptedAnswer: { '@type': 'Answer', text: 'Employee service-ൽ/pension കൊണ്ടിരിക്കുമ്പോൾ മരിച്ചാൽ spouse-ന് family pension ലഭിക്കും. Spouse ഇല്ലെങ്കിൽ unmarried/widowed daughters, minor children ഇവർക്ക് ലഭിക്കും.' },
    },
    {
      '@type': 'Question',
      name: 'DCRG (Gratuity) maximum amount എത്ര?',
      acceptedAnswer: { '@type': 'Answer', text: 'DCRG maximum = ₹20 lakh. DCRG = (Last drawn emoluments × qualifying service) ÷ 4. Maximum qualifying service considered: 33 years.' },
    },
  ],
};

const COMPONENTS = [
  { title: 'Basic Pension', color: '#2997ff', desc: 'Monthly pension amount, qualifying service and average emoluments അടിസ്ഥാനമാക്കി calculate ചെയ്യുന്നു.' },
  { title: 'Commuted Pension', color: '#30d158', desc: 'Basic pension-ന്റെ 40% വരെ lump sum ആയി withdraw ചെയ്യാം. 15 years ശേഷം full pension restore.' },
  { title: 'DCRG (Gratuity)', color: '#ff9f0a', desc: 'Retirement-ൽ one-time payment. Maximum ₹20 lakh.' },
  { title: 'Leave Salary', color: '#bf5af2', desc: 'Unutilised earned leave (max 300 days) encashment.' },
  { title: 'Family Pension', color: '#ff453a', desc: 'Employee-ന്റെ മരണശേഷം spouse/children-ന് monthly pension.' },
];

const PENSION_TABLE = [
  { service: '10 years', percent: '15.15%', example: '₹40,000 × 10/66 = ₹6,060' },
  { service: '20 years', percent: '30.30%', example: '₹40,000 × 20/66 = ₹12,121' },
  { service: '30 years', percent: '45.45%', example: '₹40,000 × 30/66 = ₹18,181' },
  { service: '33 years (max)', percent: '50%', example: '₹40,000 × 50% = ₹20,000' },
];

export default function PensionCalculationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navbar />
      <main className="min-h-screen bg-black text-white">

        {/* Hero */}
        <div className="relative pt-32 pb-14 px-6 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #000a1a 0%, #00050d 60%, #000 100%)' }}>
          <div className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, #2997ff20, transparent)' }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #2997ff40, transparent)' }} />
          <div className="relative max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-[#6e6e73] mb-8">
              <a href="/" className="hover:text-white no-underline text-[#6e6e73] transition-colors">Home</a>
              <span>›</span>
              <a href="/pension" className="hover:text-white no-underline text-[#6e6e73] transition-colors">Pension Calculator</a>
              <span>›</span>
              <span className="text-[#2997ff]">Pension Calculation</span>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-5"
              style={{ background: '#2997ff15', color: '#2997ff', border: '1px solid #2997ff30' }}>
              Kerala Service Rules — Pension Guide
            </div>
            <h1 className="text-[clamp(26px,4.5vw,48px)] font-black tracking-tight leading-[1.1] mb-4">
              Kerala Pension Calculation — How Pension is Calculated
            </h1>
            <p className="text-[16px] text-[#86868b] leading-relaxed max-w-2xl" style={{ fontFamily: "'Meera', sans-serif" }}>
              കേരള സർക്കാർ ജീവനക്കാരുടെ pension എങ്ങനെ കണക്കാക്കാം? Qualifying service, average emoluments, basic pension formula, commutation, DCRG — complete guide.
            </p>
            <div className="mt-6">
              <a href="/pension" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold no-underline transition-all hover:scale-[1.02]"
                style={{ background: '#2997ff', color: 'white', boxShadow: '0 4px 20px rgba(41,151,255,0.3)' }}>
                Pension Calculator ഉപയോഗിക്കുക →
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-14 space-y-16">

          {/* What you get */}
          <section>
            <h2 className="text-[22px] font-black text-white mb-4">Kerala Pension-ൽ ഉൾപ്പെടുന്ന Benefits</h2>
            <p className="text-[15px] text-[#aeaeb2] mb-8 leading-relaxed" style={{ fontFamily: "'Meera', serif" }}>
              Retirement-ൽ ഒരു ജീവനക്കാരന് ഇനി പറയുന്ന financial benefits ലഭിക്കും:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMPONENTS.map(c => (
                <div key={c.title} className="p-5 rounded-2xl"
                  style={{ background: `${c.color}08`, border: `1px solid ${c.color}20` }}>
                  <div className="font-black text-sm mb-2" style={{ color: c.color }}>{c.title}</div>
                  <p className="text-[13px] text-[#86868b]" style={{ fontFamily: "'Meera', serif" }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Step 1: Qualifying service */}
          <section>
            <h2 className="text-[22px] font-black text-white mb-4">Step 1: Qualifying Service കണക്കാക്കുക</h2>
            <div className="space-y-4 text-[15px] text-[#aeaeb2] leading-[1.85]" style={{ fontFamily: "'Meera', Georgia, serif" }}>
              <p>Qualifying Service (QS) = Actual service (probation, regular service) + Recognised extraordinary leave. Suspension period, leave without allowance (unauthorised), ഇവ qualify ആകില്ല.</p>
              <div className="p-5 rounded-2xl space-y-3" style={{ background: 'rgba(41,151,255,0.05)', border: '1px solid rgba(41,151,255,0.15)' }}>
                <div className="text-[11px] font-black uppercase tracking-widest text-[#2997ff]">Qualifying Service Rules</div>
                {[
                  'Minimum QS for pension: 10 years',
                  'Maximum QS considered: 33 years (beyond 33 years additional benefit ഇല്ല)',
                  'Periods of suspension — ഒടുവിൽ reinstate ആയാൽ qualifying ആകും',
                  'Child care leave, maternity leave — qualifying ആകും',
                  'EOL on medical grounds — qualifying ആകും',
                ].map((r, i) => (
                  <div key={i} className="flex gap-2 text-[13px] text-[#c7c7cc]">
                    <span className="text-[#2997ff] flex-shrink-0">›</span>
                    <span style={{ fontFamily: "'Meera', serif" }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Step 2: Average emoluments */}
          <section>
            <h2 className="text-[22px] font-black text-white mb-4">Step 2: Average Emoluments കണക്കാക്കുക</h2>
            <div className="space-y-4 text-[15px] text-[#aeaeb2] leading-[1.85]" style={{ fontFamily: "'Meera', Georgia, serif" }}>
              <p>Average Emoluments = Retirement-ന് തൊട്ടുമുൻപുള്ള <strong className="text-white">10 months-ലെ average pay</strong>. ഇതിൽ Basic Pay + Dearness Pay ഉൾപ്പെടും. HRA, TA ഇവ ഉൾപ്പെടില്ല.</p>
              <p>ആ 10 months-ൽ pay revision ഉണ്ടായിട്ടുണ്ടെങ്കിൽ, revised pay ഉം pre-revised pay ഉം proportionately average ചെയ്യും.</p>
              <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-3">Example</div>
                <p className="text-[13px] text-[#c7c7cc]" style={{ fontFamily: "'Meera', serif" }}>
                  ജീവനക്കാരൻ March 31-ന് retire ആകുന്നു. June 1 മുതൽ March 31 വരെ (10 months) basic pay ₹40,000 ആയിരുന്നെങ്കിൽ Average Emoluments = ₹40,000.
                </p>
              </div>
            </div>
          </section>

          {/* Step 3: Pension formula */}
          <section>
            <h2 className="text-[22px] font-black text-white mb-4">Step 3: Basic Pension Calculate ചെയ്യുക</h2>
            <div className="p-6 rounded-2xl text-center mb-8" style={{ background: 'rgba(41,151,255,0.06)', border: '1px solid rgba(41,151,255,0.2)' }}>
              <div className="text-[11px] font-black uppercase tracking-widest text-[#2997ff] mb-4">Pension Formula</div>
              <div className="text-[20px] font-black text-white font-mono">
                Basic Pension = (Average Emoluments × Qualifying Service) ÷ 66
              </div>
              <div className="mt-4 text-[12px] text-[#6e6e73]">Maximum = 50% of Average Emoluments &nbsp;|&nbsp; Minimum = ₹9,000/month</div>
            </div>
            <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <table className="w-full text-[13px]">
                <thead>
                  <tr style={{ background: 'rgba(41,151,255,0.08)' }}>
                    <th className="text-left px-5 py-3 font-black text-white/60 uppercase text-[10px] tracking-widest">Qualifying Service</th>
                    <th className="text-left px-5 py-3 font-black text-white/60 uppercase text-[10px] tracking-widest">% of Pay</th>
                    <th className="text-left px-5 py-3 font-black text-white/60 uppercase text-[10px] tracking-widest">Example (Pay ₹40,000)</th>
                  </tr>
                </thead>
                <tbody>
                  {PENSION_TABLE.map((r, i) => (
                    <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <td className="px-5 py-3 font-bold text-white/80">{r.service}</td>
                      <td className="px-5 py-3 text-[#2997ff] font-bold">{r.percent}</td>
                      <td className="px-5 py-3 text-[#86868b]" style={{ fontFamily: "'Meera', serif" }}>{r.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Commutation */}
          <section>
            <h2 className="text-[22px] font-black text-white mb-4">Pension Commutation</h2>
            <div className="space-y-4 text-[15px] text-[#aeaeb2] leading-[1.85]" style={{ fontFamily: "'Meera', Georgia, serif" }}>
              <p>Retirement-ൽ basic pension-ന്റെ <strong className="text-white">maximum 40%</strong> lump sum ആയി receive ചെയ്യാം. ഇതിനെ commutation എന്ന് പറയുന്നു. Commuted ചെയ്ത ശേഷം monthly pension reduced ആകും, <strong className="text-white">15 years</strong> ശേഷം full pension restore ആകും.</p>
              <div className="p-5 rounded-2xl" style={{ background: 'rgba(48,209,88,0.05)', border: '1px solid rgba(48,209,88,0.15)' }}>
                <div className="text-[11px] font-black uppercase tracking-widest text-[#30d158] mb-4">Commutation Formula</div>
                <div className="space-y-2 text-[13px] text-[#c7c7cc]">
                  <p><strong className="text-white">Commuted Amount</strong> = Commuted Pension × 12 × Commutation Factor</p>
                  <p className="mt-2">Commutation factor — age of retirement അനുസരിച്ച് table-ൽ നിന്ന് ലഭിക്കും.</p>
                  <p className="mt-2 text-[#86868b]">Example: Basic Pension ₹15,000, 40% commute ചെയ്യുന്നു. Commuted Pension = ₹6,000. Age 58-ൽ factor = 9.81. Commuted Amount = 6,000 × 12 × 9.81 = ₹7,06,320 lump sum.</p>
                </div>
              </div>
            </div>
          </section>

          {/* DCRG */}
          <section>
            <h2 className="text-[22px] font-black text-white mb-4">DCRG (Death-cum-Retirement Gratuity)</h2>
            <div className="space-y-4 text-[15px] text-[#aeaeb2] leading-[1.85]" style={{ fontFamily: "'Meera', Georgia, serif" }}>
              <p>DCRG (Gratuity) retirement-ൽ one-time lump sum payment ആണ്. Qualifying service 5 years ഉണ്ടെങ്കിൽ DCRG ലഭ്യമാണ്.</p>
              <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,159,10,0.05)', border: '1px solid rgba(255,159,10,0.15)' }}>
                <div className="text-[11px] font-black uppercase tracking-widest text-[#ff9f0a] mb-4">DCRG Formula</div>
                <div className="space-y-2 text-[13px] text-[#c7c7cc]">
                  <p><strong className="text-white">DCRG</strong> = (Last drawn emoluments × Qualifying Service) ÷ 4</p>
                  <p className="mt-2">Maximum DCRG = <strong className="text-white">₹20 lakh</strong></p>
                  <p>Maximum QS considered = 33 years</p>
                  <p className="mt-2 text-[#86868b]">Example: Last drawn pay ₹50,000, QS 30 years. DCRG = (50,000 × 30) ÷ 4 = ₹3,75,000.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Family pension */}
          <section>
            <h2 className="text-[22px] font-black text-white mb-4">Family Pension</h2>
            <div className="space-y-4 text-[15px] text-[#aeaeb2] leading-[1.85]" style={{ fontFamily: "'Meera', Georgia, serif" }}>
              <p>Service-ൽ ഉള്ളപ്പോഴോ pension receive ചെയ്തുകൊണ്ടിരിക്കുമ്പോഴോ employee മരിച്ചാൽ spouse-ന് family pension ലഭിക്കും.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { period: 'Enhanced Family Pension', amount: 'Basic Pension-ന്റെ 50%', duration: 'മരണ date മുതൽ 7 years, അല്ലെങ്കിൽ spouse-ന് 65 വയസ്സ് ആകുന്നതു വരെ (whichever is earlier)', color: '#2997ff' },
                  { period: 'Normal Family Pension', amount: 'Basic Pension-ന്റെ 30%', duration: 'Enhanced period കഴിഞ്ഞ ശേഷം spouse ജീവിക്കുന്ന കാലം', color: '#30d158' },
                ].map(f => (
                  <div key={f.period} className="p-5 rounded-2xl" style={{ background: `${f.color}06`, border: `1px solid ${f.color}20` }}>
                    <div className="font-black text-sm mb-1" style={{ color: f.color }}>{f.period}</div>
                    <div className="text-[15px] font-bold text-white mb-2">{f.amount}</div>
                    <p className="text-[12px] text-[#86868b]" style={{ fontFamily: "'Meera', serif" }}>{f.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-[22px] font-black text-white mb-6">Pension Calculation — FAQ</h2>
            <div className="space-y-3">
              {faqJsonLd.mainEntity.map((faq, i) => (
                <details key={i} className="rounded-2xl overflow-hidden group"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none">
                    <span className="text-[14px] font-bold text-white/90" style={{ fontFamily: "'Meera', sans-serif" }}>{faq.name}</span>
                    <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black transition-transform group-open:rotate-45"
                      style={{ background: 'rgba(41,151,255,0.12)', color: '#2997ff' }}>+</span>
                  </summary>
                  <div className="px-5 pb-5 pt-1">
                    <p className="text-[13px] text-[#aeaeb2] leading-relaxed" style={{ fontFamily: "'Meera', serif" }}>
                      {faq.acceptedAnswer.text}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* CTA to calculator */}
          <div className="rounded-2xl p-6 text-center" style={{ background: 'rgba(41,151,255,0.05)', border: '1px solid rgba(41,151,255,0.15)' }}>
            <div className="text-[11px] font-black uppercase tracking-widest text-[#2997ff] mb-3">Pension Calculator</div>
            <p className="text-[15px] text-[#86868b] mb-5" style={{ fontFamily: "'Meera', serif" }}>
              നിങ്ങളുടെ exact pension, commutation amount, DCRG ഇവ calculate ചെയ്യാൻ ഞങ്ങളുടെ free calculator ഉപയോഗിക്കൂ.
            </p>
            <a href="/pension" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold no-underline transition-all hover:scale-[1.02]"
              style={{ background: '#2997ff', color: 'white', boxShadow: '0 4px 20px rgba(41,151,255,0.3)' }}>
              Pension Calculator ഉപയോഗിക്കുക →
            </a>
          </div>

          {/* Related */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,159,10,0.04)', border: '1px solid rgba(255,159,10,0.15)' }}>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#ff9f0a] mb-4">Related Tools & Pages</div>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Pension Calculator', href: '/pension' },
                { label: 'DCRG Calculator', href: '/dcrg' },
                { label: 'DA Arrear Calculator', href: '/da-arrear' },
                { label: 'NPS vs APS', href: '/nps-aps' },
                { label: 'GPF Information', href: '/gpf' },
              ].map(l => (
                <a key={l.href} href={l.href}
                  className="px-4 py-2 rounded-xl text-[13px] font-bold no-underline transition-all hover:scale-[1.03]"
                  style={{ background: 'rgba(255,159,10,0.1)', color: '#ff9f0a', border: '1px solid rgba(255,159,10,0.2)' }}>
                  {l.label} →
                </a>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06]">
            <a href="/" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold no-underline"
              style={{ background: '#2997ff15', color: '#2997ff', border: '1px solid #2997ff30' }}>
              ← Home
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
