import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Pension Calculation Guide — Kerala Government Employees',
  description: 'Step-by-step Kerala pension calculation guide — average emoluments, qualifying service, half-year units, pension formula. KSR Part III explained in Malayalam.',
  path: '/pension-calculation',
  keywords: ['Kerala pension calculation Malayalam', 'KSR pension formula', 'qualifying service Kerala pension', 'pension calculation step by step Kerala', 'Kerala government pension guide'],
  type: 'article',
});

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Kerala pension-ന് minimum qualifying service എത്ര വർഷം?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pension ലഭിക്കാൻ minimum 10 years qualifying service ആവശ്യമാണ്. 10 years-ൽ കൂടുതൽ service ഉള്ളവർക്ക് proportionate pension ലഭിക്കും. Maximum 30 years (60 half-year units) ആണ് pension calculation-ൽ പരിഗണിക്കുക.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kerala KSR pension formula എന്താണ്?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Monthly Pension = (Average Emoluments × Half-year Units) ÷ 120. ഇവിടെ Average Emoluments = last 10 months-ലെ Basic Pay-ന്റെ ശരാശരി. Maximum pension = Average Emoluments-ന്റെ 50%. Minimum pension = ₹9,000/month.',
      },
    },
    {
      '@type': 'Question',
      name: 'Half-year units എന്നാൽ എന്ത്? Rounding rules എന്തൊക്കെ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '1 year service = 2 half-year units. ബാക്കി മാസങ്ങൾ: 3 months-ൽ താഴെ ആണെങ്കിൽ ignore ചെയ്യും; 3–8 months ആണെങ്കിൽ 1 unit; 9 months-ഉം അതിൽ കൂടുതലും ആണെങ്കിൽ 2 units (1 full year). Maximum 60 units (30 years) ആണ് cap.',
      },
    },
    {
      '@type': 'Question',
      name: 'Average Emoluments-ൽ Leave Without Allowance ഉൾപ്പെടുമോ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'LWA (Leave Without Allowance) അല്ലെങ്കിൽ Suspension കാലം last 10 months-ൽ വന്നാൽ, ആ കാലം ഒഴിവാക്കി അതിന് തൊട്ടുമുൻപ് ശമ്പളം ലഭിച്ച മാസങ്ങൾ പകരം ചേർത്ത് 10 months പൂർത്തിയാക്കും.',
      },
    },
    {
      '@type': 'Question',
      name: 'Maximum pension ceiling എത്ര?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Maximum pension = Average Emoluments-ന്റെ 50%. 11th Pay Revision Commission അനുസരിച്ച് ₹83,400/month ആണ് നിലവിലെ ceiling. ഈ ceiling-ൽ കൂടുതൽ pension ഫോർമുല വഴി ലഭിക്കുന്നെങ്കിൽ ceiling amount മാത്രം തരും.',
      },
    },
  ],
};

const AVERAGE_EMOLUMENTS_TABLE = [
  {
    scenario: 'മുഴുവൻ ശമ്പളം (Full Pay)',
    treatment: 'ഡ്യൂട്ടിയിലായിരുന്ന കാലയളവിലെ മുഴുവൻ Basic Pay-ഉം ശരാശരി കണക്കാക്കാൻ പരിഗണിക്കും.',
  },
  {
    scenario: 'ഇൻക്രിമെന്റ് (Increments)',
    treatment: 'അവസാന 10 മാസത്തിനിടെ increment ലഭിച്ചിട്ടുണ്ടെങ്കിൽ, അത് ലഭിച്ച തീയതി മുതൽ ശരാശരിയിൽ ഉൾപ്പെടുത്തും.',
  },
  {
    scenario: 'സ്ഥാനക്കയറ്റം (Promotions)',
    treatment: 'Promotion വഴി ലഭിക്കുന്ന ഉയർന്ന ശമ്പളം, അത് ലഭിച്ച തീയതി മുതൽ ബാക്കി മാസങ്ങളിൽ ശരാശരി കണക്കാക്കാൻ ഉപയോഗിക്കും.',
  },
  {
    scenario: 'LWA / Suspension',
    treatment: 'ശമ്പളമില്ലാത്ത അവധി അല്ലെങ്കിൽ Suspension ഈ 10 മാസത്തിനുള്ളിൽ വന്നാൽ ആ കാലം ഒഴിവാക്കി, തൊട്ടുമുൻപ് ശമ്പളം ലഭിച്ച മാസങ്ങൾ ചേർത്ത് 10 months പൂർത്തിയാക്കും.',
  },
];

const ROUNDING_RULES = [
  { months: '3 months-ൽ താഴെ', units: '0 units', note: 'Ignored — pension-ൽ ചേർക്കില്ല' },
  { months: '3 – 8 months', units: '1 unit', note: '½ year ആയി കണക്കാക്കും' },
  { months: '9 months-ഉം അതിനു മുകളിലും', units: '2 units', note: '1 full year ആയി round up ചെയ്യും' },
  { months: 'Maximum cap', units: '60 units', note: '30 years — ഇതിൽ കൂടുതൽ ഇല്ല' },
];

function Section({ title, children, color = '#2997ff' }) {
  return (
    <section className="space-y-5">
      <h2 className="text-[22px] font-black text-white leading-snug" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Card({ color = '#2997ff', label, children }) {
  return (
    <div className="p-5 rounded-2xl" style={{ background: `${color}08`, border: `1px solid ${color}25` }}>
      {label && (
        <div className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color }}>
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

function Body({ children }) {
  return (
    <div className="text-[15px] text-[#aeaeb2] leading-[1.9]" style={{ fontFamily: "var(--font-noto-malayalam), Georgia, serif" }}>
      {children}
    </div>
  );
}

export default function PensionCalculationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navbar />
      <main className="min-h-screen bg-aurora text-white pt-[100px]">

        <div className="max-w-3xl mx-auto px-6 py-10 space-y-16">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/60 flex-wrap">
            <a href="/" className="hover:text-white no-underline text-white/60 transition-colors">Home</a>
            <span>›</span>
            <a href="/pension" className="hover:text-white no-underline text-white/60 transition-colors">Pension Calculator</a>
            <span>›</span>
            <span className="text-[#ff9f0a]">Pension Calculation Guide</span>
          </div>

          {/* ── 1. Introduction / Eligibility ─────────────────────────────── */}
          <Section title="1. ആമുഖം: പെൻഷൻ യോഗ്യതകൾ">
            <Body>
              <p>
                കേരള സർവീസ് റൂൾസ് (KSR) Part III പ്രകാരം ഒരു സർക്കാർ ജീവനക്കാരന്റെ പെൻഷൻ
                കൃത്യമായി കണക്കാക്കുന്നത് എങ്ങനെയെന്ന് മനസ്സിലാക്കുക എന്നത് ഓരോ ഉദ്യോഗസ്ഥന്റെയും
                സാമ്പത്തിക ആസൂത്രണത്തിന് അത്യന്താപേക്ഷിതമാണ്. വിരമിക്കുന്ന സമയത്ത് ലഭിക്കുന്ന
                പെൻഷൻ തുക പ്രധാനമായും ജീവനക്കാരന്റെ <strong className="text-white">സേവന
                കാലയളവിനെയും</strong> <strong className="text-white">ശമ്പളത്തെയും</strong> അടിസ്ഥാനപ്പെടുത്തിയാണ്
                നിശ്ചയിക്കുന്നത്.
              </p>
            </Body>

            <Card color="#ff9f0a" label="Pension Eligibility — Key Rules">
              <div className="space-y-3">
                {[
                  { label: 'കുറഞ്ഞ സേവന കാലയളവ്', value: '10 വർഷം', desc: 'Pension ലഭിക്കാൻ minimum 10 years qualifying service ആവശ്യം' },
                  { label: 'പരമാവധി സേവന കാലയളവ്', value: '30 വർഷം', desc: 'Pension calculation-ൽ maximum 30 years (60 half-year units) മാത്രം' },
                ].map(r => (
                  <div key={r.label} className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="text-[13px] font-bold text-white/80" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>{r.label}</div>
                      <div className="text-[11px] text-white/55 mt-0.5" style={{ fontFamily: "var(--font-noto-malayalam), serif" }}>{r.desc}</div>
                    </div>
                    <div className="text-[15px] font-black whitespace-nowrap" style={{ color: '#ff9f0a' }}>{r.value}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Body>
              <p>
                പെൻഷൻ യോഗ്യത നേടിക്കഴിഞ്ഞാൽ, അടുത്തതായി നാം കണ്ടെത്തേണ്ടത് പെൻഷൻ തുക
                നിശ്ചയിക്കുന്നതിനുള്ള അടിസ്ഥാന ഘടകമായ <strong className="text-white">ശരാശരി
                വേതനം</strong> (Average Emoluments) ആണ്.
              </p>
            </Body>
          </Section>

          <div className="border-t border-white/[0.06]" />

          {/* ── 2. Average Emoluments ─────────────────────────────────────── */}
          <Section title="2. ശരാശരി വേതനം (Average Emoluments) കണക്കാക്കുന്ന വിധം">
            <Body>
              <p>
                വിരമിക്കുന്ന തീയതിക്ക് തൊട്ടുമുൻപുള്ള <strong className="text-white">10 മാസത്തെ ശമ്പളത്തിന്റെ
                ശരാശരി</strong>യാണ് 'ശരാശരി വേതനം' എന്ന് പറയുന്നത്. ശമ്പളം എന്ന് പറയുമ്പോൾ അത്
                <strong className="text-white"> Basic Pay മാത്രമാണ്</strong> അർത്ഥമാക്കുന്നത് — HRA, TA,
                DA ഇവ ഉൾപ്പെടില്ല. ഈ 10 മാസത്തിനുള്ളിൽ അവധിയോ മറ്റ് തടസ്സങ്ങളോ വന്നാൽ ഈ
                കണക്കുകൂട്ടലിൽ മാറ്റങ്ങൾ വരും.
              </p>
            </Body>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid var(--surface-sm)' }}>
              <table className="w-full text-[13px]">
                <thead>
                  <tr style={{ background: 'rgba(255,159,10,0.06)' }}>
                    <th className="text-left px-5 py-3 font-black text-white/50 uppercase text-[10px] tracking-widest w-[40%]">
                      സാഹചര്യം (Scenario)
                    </th>
                    <th className="text-left px-5 py-3 font-black text-white/50 uppercase text-[10px] tracking-widest">
                      പരിഗണന (Treatment)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {AVERAGE_EMOLUMENTS_TABLE.map((row, i) => (
                    <tr key={i} style={{ borderTop: '1px solid var(--surface-xs)' }}>
                      <td className="px-5 py-3.5 font-bold text-white/80 align-top" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                        {row.scenario}
                      </td>
                      <td className="px-5 py-3.5 text-[#aeaeb2] leading-relaxed" style={{ fontFamily: "var(--font-noto-malayalam), serif" }}>
                        {row.treatment}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Body>
              <p>
                ചുരുക്കത്തിൽ, <strong className="text-white">കൃത്യമായ പത്തു മാസത്തെ ശമ്പളത്തിന്റെ
                ശരാശരി</strong>യാണ് നാം കണ്ടെത്തുന്നത്. ഇപ്പോൾ ശമ്പളത്തിന്റെ കണക്ക് ലഭിച്ചു —
                അടുത്തതായി സേവന കാലയളവ് എങ്ങനെ ക്രമീകരിക്കാം എന്ന് നോക്കാം.
              </p>
            </Body>
          </Section>

          <div className="border-t border-white/[0.06]" />

          {/* ── 3. Qualifying Service ─────────────────────────────────────── */}
          <Section title="3. യോഗ്യമായ സേവനം (Qualifying Service) ക്രമീകരിക്കുന്നത്">
            <Body>
              <p>
                പെൻഷൻ നിർണ്ണയിക്കുമ്പോൾ സേവന കാലയളവിനെ <strong className="text-white">അർദ്ധവർഷങ്ങളായി
                (Half-year units)</strong> ആണ് കണക്കാക്കുന്നത്. ഒരു വർഷത്തെ സേവനം = 2 അർദ്ധവർഷ
                യൂണിറ്റുകൾ.
              </p>
            </Body>

            {/* Steps */}
            <div className="space-y-4">
              {[
                {
                  step: '1',
                  title: 'യൂണിറ്റുകളിലേക്കുള്ള മാറ്റം',
                  body: 'സേവന കാലയളവിലെ വർഷങ്ങളെ 2 കൊണ്ട് ഗുണിക്കുക. ഉദാഹരണം: 28 years × 2 = 56 units.',
                },
                {
                  step: '2',
                  title: 'ബാക്കി മാസങ്ങൾ — Rounding Rules',
                  body: 'ബാക്കി മാസങ്ങൾ താഴെ പറയുന്ന നിയമം അനുസരിച്ച് units ആക്കുന്നു (നോക്കൂ table).',
                },
                {
                  step: '3',
                  title: 'പരമാവധി പരിധി',
                  body: 'ആകെ units എത്രയായാലും, calculation-ന് ഉപയോഗിക്കുന്ന maximum = 60 units (30 years).',
                },
              ].map(s => (
                <div key={s.step} className="flex gap-4 items-start">
                  <div
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black mt-0.5"
                    style={{ background: 'rgba(255,159,10,0.12)', color: '#ff9f0a', border: '1px solid rgba(255,159,10,0.25)' }}
                  >
                    {s.step}
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-white/80 mb-1" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>{s.title}</div>
                    <div className="text-[13px] text-[#aeaeb2]" style={{ fontFamily: "var(--font-noto-malayalam), serif" }}>{s.body}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Rounding rules table */}
            <Card color="#ff9f0a" label="KSR Half-Year Rounding Rules">
              <div className="overflow-x-auto rounded-xl -mx-1">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr>
                      <th className="text-left py-2 px-3 text-white/60 font-black uppercase text-[10px] tracking-widest">ബാക്കി മാസങ്ങൾ</th>
                      <th className="text-left py-2 px-3 text-white/60 font-black uppercase text-[10px] tracking-widest">Units</th>
                      <th className="text-left py-2 px-3 text-white/60 font-black uppercase text-[10px] tracking-widest">കുറിപ്പ്</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ROUNDING_RULES.map((r, i) => (
                      <tr key={i} style={{ borderTop: '1px solid var(--surface-xs)' }}>
                        <td className="py-2.5 px-3 font-bold text-white/70" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>{r.months}</td>
                        <td className="py-2.5 px-3 font-black" style={{ color: '#ff9f0a' }}>{r.units}</td>
                        <td className="py-2.5 px-3 text-[#86868b]" style={{ fontFamily: "var(--font-noto-malayalam), serif" }}>{r.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Body>
              <p>
                ശമ്പളവും (Average Emoluments) സേവനവും (Qualifying Service) ലഭ്യമായ സ്ഥിതിക്ക്,
                ഇവ രണ്ടും ഉപയോഗിച്ച് എങ്ങനെ പെൻഷൻ കണ്ടെത്താം എന്ന് നോക്കാം.
              </p>
            </Body>
          </Section>

          <div className="border-t border-white/[0.06]" />

          {/* ── 4. The Formula ────────────────────────────────────────────── */}
          <Section title="4. പെൻഷൻ സൂത്രവാക്യം (The Pension Formula)">
            <Body>
              <p>
                KSR Part III അനുസരിച്ച് പ്രതിമാസ പെൻഷൻ കണ്ടെത്തുന്നതിനായുള്ള Master Formula:
              </p>
            </Body>

            {/* Big formula card */}
            <div
              className="rounded-2xl p-8 text-center"
              style={{ background: 'rgba(255,159,10,0.06)', border: '1px solid rgba(255,159,10,0.25)' }}
            >
              <div className="text-[11px] font-black uppercase tracking-widest text-[#ff9f0a] mb-5">
                KSR Pension Formula
              </div>
              <div className="text-[clamp(14px,3vw,20px)] font-black text-white font-mono leading-snug">
                പ്രതിമാസ പെൻഷൻ =
                <span className="block mt-2 text-[#ff9f0a]">
                  (ശരാശരി വേതനം × അർദ്ധവർഷ യൂണിറ്റുകൾ) ÷ 120
                </span>
              </div>
              <div className="mt-5 text-[12px] text-[#6e6e73]">
                Monthly Pension = (Average Emoluments × Half-year Units) ÷ 120
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-3 text-[11px]">
                <span className="px-3 py-1 rounded-full font-bold" style={{ background: '#30d15815', color: '#30d158' }}>
                  Maximum: 50% of AE (or ₹83,400)
                </span>
                <span className="px-3 py-1 rounded-full font-bold" style={{ background: 'rgba(255,159,10,0.12)', color: '#ff9f0a' }}>
                  Minimum: ₹9,000/month
                </span>
              </div>
            </div>

            <Card color="#30d158" label="120 എന്തുകൊണ്ട്?">
              <Body>
                <p>
                  ഒരു ജീവനക്കാരന് അദ്ദേഹത്തിന്റെ ശരാശരി വേതനത്തിന്റെ <strong className="text-white">
                  പരമാവധി 50%</strong> ആണ് പെൻഷനായി ലഭിക്കുക. Maximum units = 60. ആ 60 units-ന്
                  50% (= 0.5) pension നൽകാൻ 60 ÷ 120 = 0.5 — അതാണ് 120 ഉപയോഗിക്കുന്നത്.
                  30 years സർവീസ് ഉള്ളൊരാൾക്ക് ശരാശരി ശമ്പളത്തിന്റെ കൃത്യം പകുതി
                  (50%) പെൻഷൻ ഉറപ്പാക്കാനാണ് ഈ divisor.
                </p>
              </Body>
            </Card>
          </Section>

          <div className="border-t border-white/[0.06]" />

          {/* ── 5. Practical Example ──────────────────────────────────────── */}
          <Section title="5. പ്രായോഗിക ഉദാഹരണം (Practical Example)">
            <Body>
              <p>ഒരു ഉദാഹരണത്തിലൂടെ ഈ ഗണിതക്രിയ നോക്കാം:</p>
            </Body>

            {/* Step walkthrough */}
            <div className="space-y-3">
              {[
                {
                  step: 'ഘട്ടം 1 — ശരാശരി വേതനം',
                  value: '₹1,00,000',
                  desc: 'അവസാന 10 മാസത്തെ Basic Pay ശരാശരി ₹1,00,000 ആണ്.',
                  color: '#ff9f0a',
                },
                {
                  step: 'ഘട്ടം 2 — Qualifying Service',
                  value: '30 years = 60 units',
                  desc: '30 years × 2 = 60 half-year units (maximum cap-ൽ ഉൾപ്പെടുന്നു).',
                  color: '#ff9f0a',
                },
                {
                  step: 'ഘട്ടം 3 — Formula',
                  value: '₹1,00,000 × 60 ÷ 120',
                  desc: 'Pension = (1,00,000 × 60) ÷ 120 = 60,00,000 ÷ 120',
                  color: '#30d158',
                },
                {
                  step: 'അന്തിമഫലം — പ്രതിമാസ പെൻഷൻ',
                  value: '₹50,000',
                  desc: 'ശരാശരി വേതനത്തിന്റെ 50% — Maximum pension percentage.',
                  color: '#30d158',
                  bold: true,
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 rounded-2xl px-5 py-4"
                  style={{
                    background: `${s.color}06`,
                    border: `1px solid ${s.color}20`,
                  }}
                >
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: s.color }}>
                      {s.step}
                    </div>
                    <div className="text-[12px] text-white/60" style={{ fontFamily: "var(--font-noto-malayalam), serif" }}>{s.desc}</div>
                  </div>
                  <div className={`font-black whitespace-nowrap ${s.bold ? 'text-[22px]' : 'text-[15px]'}`} style={{ color: s.color }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            <Card color="#ff453a" label="പ്രത്യേകം ശ്രദ്ധിക്കുക — Maximum Ceiling">
              <Body>
                <p>
                  പെൻഷൻ തുക ഫോർമുല വഴി ₹83,400-ൽ (11th PRC ceiling) കൂടുതൽ വന്നാൽ, ceiling amount
                  മാത്രമേ ലഭിക്കൂ. ഉദാഹരണം: ശരാശരി വേതനം ₹2,00,000 ആണെങ്കിൽ ഫോർമുല ₹1,00,000
                  കൊടുക്കും — എന്നാൽ ₹83,400 മാത്രമേ ലഭിക്കൂ.
                </p>
              </Body>
            </Card>
          </Section>

          <div className="border-t border-white/[0.06]" />

          {/* ── 6. Summary ────────────────────────────────────────────────── */}
          <Section title="6. ഉപസംഹാരം — പ്രധാന കാര്യങ്ങൾ">
            <div className="space-y-3">
              {[
                {
                  title: '10 മാസത്തെ ശരാശരി',
                  body: 'വിരമിക്കുന്നതിന് തൊട്ടുമുൻപ് ശമ്പളം ലഭിച്ച 10 മാസത്തെ Basic Pay ശരാശരിയാണ് Average Emoluments. LWA/Suspension ഉണ്ടെങ്കിൽ ആ കാലം ഒഴിവാക്കി തൊട്ടുമുൻപ് ശമ്പളം ലഭിച്ച മാസങ്ങൾ ചേർക്കണം.',
                  color: '#ff9f0a',
                },
                {
                  title: 'Half-year Units-ന്റെ കൃത്യത',
                  body: 'Service-ൽ ബാക്കി വരുന്ന മാസങ്ങൾ rounding rule (< 3 = ignore, 3–8 = 1 unit, ≥ 9 = 2 units) അനുസരിച്ച് convert ചെയ്യണം. Maximum 60 units.',
                  color: '#ff9f0a',
                },
                {
                  title: '50 ശതമാനം നിയമം',
                  body: 'Pension ഒരിക്കലും Average Emoluments-ന്റെ 50%-ൽ കൂടാൻ പാടില്ല. Plus, നിലവിലെ ceiling ₹83,400-ൽ കൂടാൻ പാടില്ല. Minimum pension ₹9,000/month ആണ്.',
                  color: '#30d158',
                },
              ].map(c => (
                <div
                  key={c.title}
                  className="rounded-2xl p-5 flex gap-4"
                  style={{ background: `${c.color}06`, border: `1px solid ${c.color}20` }}
                >
                  <div
                    className="flex-shrink-0 w-2 rounded-full self-stretch"
                    style={{ background: c.color }}
                  />
                  <div>
                    <div className="font-black text-[14px] mb-1" style={{ color: c.color, fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                      {c.title}
                    </div>
                    <div className="text-[13px] text-[#aeaeb2] leading-relaxed" style={{ fontFamily: "var(--font-noto-malayalam), serif" }}>
                      {c.body}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <div className="border-t border-white/[0.06]" />

          {/* ── FAQ ──────────────────────────────────────────────────────── */}
          <Section title="പതിവ് ചോദ്യങ്ങൾ (FAQ)">
            <div className="space-y-3">
              {faqJsonLd.mainEntity.map((faq, i) => (
                <details
                  key={i}
                  className="rounded-2xl overflow-hidden group"
                  style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-xs)' }}
                >
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none">
                    <span className="text-[14px] font-bold text-white/90" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                      {faq.name}
                    </span>
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black transition-transform group-open:rotate-45"
                      style={{ background: 'rgba(255,159,10,0.12)', color: '#ff9f0a' }}
                    >
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-5 pt-1">
                    <p className="text-[13px] text-[#aeaeb2] leading-relaxed" style={{ fontFamily: "var(--font-noto-malayalam), serif" }}>
                      {faq.acceptedAnswer.text}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </Section>

          {/* ── CTA ──────────────────────────────────────────────────────── */}
          <div
            className="rounded-2xl p-7 text-center"
            style={{ background: 'rgba(255,159,10,0.05)', border: '1px solid rgba(255,159,10,0.20)' }}
          >
            <div className="text-[11px] font-black uppercase tracking-widest text-[#ff9f0a] mb-3">
              Pension Calculator
            </div>
            <p className="text-[15px] text-[#86868b] mb-5" style={{ fontFamily: "var(--font-noto-malayalam), serif" }}>
              നിങ്ങളുടെ exact pension — KSR half-year units, Average Emoluments, DA — ഉൾപ്പെടെ
              കണക്കാക്കാൻ ഞങ്ങളുടെ free calculator ഉപയോഗിക്കൂ.
            </p>
            <a
              href="/pension"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold no-underline transition-all hover:scale-[1.02]"
              style={{ background: '#ff9f0a', color: '#000', boxShadow: '0 4px 20px rgba(255,159,10,0.3)' }}
            >
              Pension Calculator ഉപയോഗിക്കുക →
            </a>
          </div>

          {/* ── Related links ─────────────────────────────────────────────── */}
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
                <a
                  key={l.href}
                  href={l.href}
                  className="px-4 py-2 rounded-xl text-[13px] font-bold no-underline transition-all hover:scale-[1.03]"
                  style={{ background: 'rgba(255,159,10,0.10)', color: '#ff9f0a', border: '1px solid rgba(255,159,10,0.2)' }}
                >
                  {l.label} →
                </a>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06]">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold no-underline"
              style={{ background: 'rgba(255,159,10,0.10)', color: '#ff9f0a', border: '1px solid rgba(255,159,10,0.25)' }}
            >
              ← Home
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
