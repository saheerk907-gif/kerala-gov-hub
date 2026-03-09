'use client';
import Link from 'next/link';

const tools = [
  {
    icon: '💰',
    title: '12th PRC കാൽക്കുലേറ്റർ',
    subtitle: 'Pay Revision Calculator',
    desc: 'ഇപ്പോഴത്തെയും പരിഷ്കരിച്ചതുമായ ശമ്പളം ഒരിടത്ത് കണക്കാക്കൂ',
    href: '/prc',
    color: '#2997ff',
    badge: 'NEW',
    tags: ['Fitment', 'DA', 'HRA', 'Net Pay'],
  },
  {
    icon: '📊',
    title: 'NPS vs APS Comparison Calculator',
    subtitle: 'Pension Comparison Tool',
    desc: 'NPS-ഉം APS-ഉം തമ്മിലുള്ള വ്യത്യാസം — corpus growth, post-retirement charts',
    href: '/nps-aps',
    color: '#ff453a',
    badge: 'NEW',
    tags: ['NPS', 'APS', 'Corpus', 'Pension'],
  },
  {
    icon: '🏦',
    title: 'GPF കാൽക്കുലേറ്റർ',
    subtitle: 'Provident Fund Tool',
    desc: 'General Provident Fund balance, interest, final payment കണക്കാക്കൂ',
    href: '/gpf',
    color: '#30d158',
    badge: null,
    tags: ['Balance', 'Interest', 'Withdrawal', 'Nomination'],
  },
  {
    icon: '📖',
    title: 'Kerala Service Rules',
    subtitle: 'KSR Parts I–III',
    desc: 'Leave rules, service conditions, pay rules — all KSR chapters',
    href: '/ksr',
    color: '#bf5af2',
    badge: null,
    tags: ['Leave', 'Pay', 'Service', 'Conduct'],
  },
  {
    icon: '💰',
    title: 'Pension Calculator',
    subtitle: 'KSR Part III — Monthly Pension',
    desc: 'Average Emoluments, half-year units, family pension — KSR Part III അനുസരിച്ച് പെൻഷൻ കണക്കാക്കൂ',
    href: '/pension',
    color: '#2997ff',
    badge: 'NEW',
    tags: ['Pension', 'AE', 'Family Pension', 'DA'],
  },
  {
    icon: '🎖️',
    title: 'DCRG Calculator',
    subtitle: 'Death-cum-Retirement Gratuity',
    desc: 'KSR Rule 77 അനുസരിച്ച് DCRG / Death Gratuity കണക്കാക്കൂ — retirement & death cases',
    href: '/dcrg',
    color: '#c8960c',
    badge: 'NEW',
    tags: ['DCRG', 'Gratuity', 'KSR', 'Death'],
  },
  {
    icon: '💸',
    title: 'Income Tax Calculator',
    subtitle: 'FY 2025–26 (AY 2026–27)',
    desc: 'New & Old Regime tax — HRA, 80C, GPF, SLI, NPS, Medisep, all deductions',
    href: '/income-tax',
    color: '#ff9f0a',
    badge: 'NEW',
    tags: ['New Regime', 'Old Regime', '80C', 'HRA'],
  },
  {
    icon: '📅',
    title: 'Leave Calculator',
    subtitle: 'ലീവ് കണക്കുകൂട്ടൽ',
    desc: 'EL, CL, ML, Study Leave balance and encashment estimate',
    href: '/leave',
    color: '#64d2ff',
    badge: 'NEW',
    tags: ['EL', 'CL', 'ML', 'Encashment'],
  },
  {
    icon: '📊',
    title: 'DA Arrear Calculator',
    subtitle: '11th PRC · Mar 2021 onwards',
    desc: 'Month-wise DA arrear with increment & promotion support. All G.O.s included.',
    href: '/da-arrear',
    color: '#ff9f0a',
    badge: 'NEW',
    tags: ['DA Arrear', 'G.O.', 'Month-wise', 'Print'],
  },
  {
    icon: '📋',
    title: 'Pay Scales / ശമ്പള സ്കെയിൽ',
    subtitle: '11th PRC · S1–S27',
    desc: 'Kerala Govt pay scales — 11th, 10th, 9th PRC. Master scale & all revised scales.',
    href: '/pay-scales',
    color: '#2997ff',
    badge: null,
    tags: ['11th PRC', '10th PRC', 'Master Scale', 'S1-S27'],
  },
  {
    icon: '⚖️',
    title: 'Acts & Rules / നിയമങ്ങൾ',
    subtitle: 'Kerala Government Laws',
    desc: 'Land Assignment Act, Labour Laws, Forest Act, KER — PDF & summary of all major Kerala acts.',
    href: '/acts-rules',
    color: '#bf5af2',
    badge: 'NEW',
    tags: ['Land Act', 'Labour', 'Forest', 'PDF'],
  },
];

export default function ToolsSection() {
  return (
    <section id="tools" className="relative py-8 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="section-label mb-1">Tools & Calculators</div>
            <h2 className="text-[clamp(20px,3vw,30px)] font-[900] tracking-[-0.02em] text-white leading-tight" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              ടൂളുകൾ
            </h2>
          </div>
        </div>

        {/* 2-col on mobile, 4-col on desktop — 8 items = 4+4 clean */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tools.map((t) => (
            <Link
              key={t.title}
              href={t.href}
              className="glass-card group relative flex flex-col items-start text-left rounded-[16px] p-3.5 no-underline transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              {/* Badge */}
              {t.badge && t.badge !== 'SOON' && (
                <span
                  className="absolute top-2 right-2 text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(41,151,255,0.2)', color: '#2997ff', border: '1px solid rgba(41,151,255,0.3)' }}
                >
                  NEW
                </span>
              )}
              {t.badge === 'SOON' && (
                <span className="absolute top-2 right-2 text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/30 border border-white/[0.08]">
                  SOON
                </span>
              )}

              {/* Glow blob */}
              <div
                className="absolute -top-4 -left-4 w-16 h-16 rounded-full blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ background: t.color + '25' }}
              />

              {/* Icon */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-xl mb-2.5 transition-transform duration-200 group-hover:scale-105"
                style={{ background: t.color + '18', border: `1px solid ${t.color}30` }}
              >
                {t.icon}
              </div>

              {/* Title */}
              <h3 className="text-[13px] md:text-[14px] font-bold text-white/90 leading-snug mb-0.5 group-hover:text-white transition-colors line-clamp-2" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                {t.title}
              </h3>
              <div className="text-[8px] font-semibold uppercase tracking-wider leading-tight text-white/35">
                {t.subtitle}
              </div>

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: `linear-gradient(90deg, transparent, ${t.color}70, transparent)` }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
