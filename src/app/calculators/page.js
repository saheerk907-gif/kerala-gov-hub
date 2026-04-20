import Link from 'next/link';

const calculators = [
  {
    icon: '💰',
    title: 'Know Your Revised Salary',
    subtitle: '12th Pay Revision Commission',
    desc: 'ഇപ്പോഴത്തെയും പരിഷ്കരിച്ചതുമായ ശമ്പളം ഒരിടത്ത് കണക്കാക്കൂ',
    href: '/prc',
    color: '#2997ff',
  },
  {
    icon: '📊',
    title: 'NPS vs APS Comparison',
    subtitle: 'Pension Comparison Tool',
    desc: 'NPS-ഉം APS-ഉം തമ്മിലുള്ള വ്യത്യാസം — corpus growth, post-retirement charts',
    href: '/nps-aps',
    color: '#ff453a',
  },
  {
    icon: '📊',
    title: 'NPS — National Pension System',
    subtitle: 'NPS Guide & Resources',
    desc: 'NPS contribution rules, PRAN, withdrawal, GOs, circulars, calculator',
    href: '/nps',
    color: '#bf5af2',
  },
  {
    icon: '💰',
    title: 'Pension Calculator',
    subtitle: 'KSR Part III — Monthly Pension',
    desc: 'Average Emoluments, half-year units, family pension — KSR Part III അനുസരിച്ച്',
    href: '/pension',
    color: '#2997ff',
  },
  {
    icon: '🎖️',
    title: 'DCRG Calculator',
    subtitle: 'Death-cum-Retirement Gratuity',
    desc: 'KSR Rule 77 അനുസരിച്ച് DCRG / Death Gratuity കണക്കാക്കൂ',
    href: '/dcrg',
    color: '#c8960c',
  },
  {
    icon: '💸',
    title: 'Income Tax Calculator',
    subtitle: 'FY 2025–26 (AY 2026–27)',
    desc: 'New & Old Regime tax — HRA, 80C, GPF, SLI, NPS, Medisep, all deductions',
    href: '/income-tax',
    color: '#ff9f0a',
  },
  {
    icon: '🏦',
    title: 'Loan Prepayment Calculator',
    subtitle: 'Interest Saved · Amortization · Scenarios',
    desc: 'See how much interest you save with extra EMI or lump-sum prepayments. Full amortization schedule & scenario comparison.',
    href: '/loan-prepayment',
    color: '#ff9f0a',
  },
  {
    icon: '📅',
    title: 'Leave Calculator',
    subtitle: 'ലീവ് കണക്കുകൂട്ടൽ',
    desc: 'EL, HPL & Commuted Leave balance — eligibility checker per KSR',
    href: '/leave',
    color: '#64d2ff',
  },
  {
    icon: '🎯',
    title: 'Retirement Calculator',
    subtitle: 'റിട്ടയർമെന്റ് കാൽക്കുലേറ്റർ',
    desc: 'Retirement date, countdown, LPR date, pension, DCRG and leave encashment estimate',
    href: '/retirement',
    color: '#30d158',
  },
  {
    icon: '📊',
    title: 'DA Arrear Calculator',
    subtitle: '11th PRC · Mar 2021 onwards',
    desc: 'Month-wise DA arrear with increment & promotion support. All G.O.s included.',
    href: '/da-arrear',
    color: '#ff9f0a',
  },
  {
    icon: '📋',
    title: 'Pay Scales',
    subtitle: '11th PRC · S1–S27',
    desc: 'Kerala Govt pay scales — 11th, 10th, 9th PRC. Master scale & all revised scales.',
    href: '/pay-scales',
    color: '#2997ff',
  },
  {
    icon: '📖',
    title: 'Kerala Service Rules',
    subtitle: 'KSR Parts I–III',
    desc: 'Leave rules, service conditions, pay rules — all KSR chapters',
    href: '/ksr',
    color: '#bf5af2',
  },
  {
    icon: '⚖️',
    title: 'Acts & Rules',
    subtitle: 'Kerala Government Laws',
    desc: 'Land Assignment Act, Labour Laws, Forest Act, KER — all major Kerala acts.',
    href: '/acts-rules',
    color: '#bf5af2',
  },
];

function CalcCard({ t }) {
  return (
    <Link
      href={t.href}
      className="group relative flex items-center gap-3 px-4 py-3 rounded-[14px] no-underline transition-all duration-200 hover:bg-white/[0.06]"
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-xl"
        style={{ background: t.color + '20', border: `1px solid ${t.color}35` }}>
        {t.icon}
      </div>
      <div className="flex-grow min-w-0">
        <div className="text-[13px] font-bold text-white/90 group-hover:text-white transition-colors leading-snug truncate">
          {t.title}
        </div>
        <div className="text-[10px] text-white/50 mt-0.5 truncate">{t.subtitle}</div>
      </div>
      <svg className="flex-shrink-0 w-3.5 h-3.5 text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all"
        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
        <path d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

export default function CalculatorsPage() {
  return (
    <div className="relative min-h-screen bg-aurora overflow-x-hidden pb-14 md:pb-0 pt-[72px]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6">

        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="text-[11px] text-white/40 hover:text-white/60 no-underline transition-colors">← Back to Home</Link>
          <h1 className="text-[clamp(24px,4vw,40px)] font-[900] tracking-[-0.02em] text-white mt-3 mb-1">
            Calculators & Guides
          </h1>
          <p className="text-[13px] text-white/55">All tools for Kerala government employees</p>
        </div>

        <div className="glass-card glow-top rounded-[24px] p-4 md:p-5" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {calculators.map(t => <CalcCard key={t.href} t={t} />)}
          </div>
        </div>

      </div>
    </div>
  );
}
