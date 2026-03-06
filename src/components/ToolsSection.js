'use client';
import Link from 'next/link';

const tools = [
  {
    icon: '💰',
    title: '12th PRC കാൽക്കുലേറ്റർ',
    subtitle: 'Pay Revision Calculator',
    desc: 'ഇപ്പോഴത്തെയും പരിഷ്കരിച്ചതുമായ ശമ്പളം ഒരിടത്ത് കണക്കാക്കൂ',
    href: '#calculator',
    color: '#2997ff',
    badge: 'NEW',
    tags: ['Fitment', 'DA', 'HRA', 'Net Pay'],
  },
  {
    icon: '📊',
    title: 'NPS vs APS',
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
    icon: '🏥',
    title: 'Medisep',
    subtitle: 'Health Insurance Scheme',
    desc: 'Medisep coverage, hospitals, cashless treatment details',
    href: '/medisep',
    color: '#ff9f0a',
    badge: null,
    tags: ['Coverage', 'Hospitals', 'Claims', 'Dependants'],
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
    icon: '📋',
    title: 'സർക്കാർ ഉത്തരവുകൾ',
    subtitle: 'Government Orders',
    desc: 'Finance department GOs, circulars, notifications — latest first',
    href: '#orders',
    color: '#c8960c',
    badge: null,
    tags: ['G.O.(P)', 'G.O.(Ms)', 'Circular', 'Finance'],
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
    icon: '📅',
    title: 'Leave Calculator',
    subtitle: 'ലീവ് കണക്കുകൂട്ടൽ',
    desc: 'EL, CL, ML, Study Leave balance and encashment estimate',
    href: '#calculator',
    color: '#64d2ff',
    badge: 'SOON',
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
];

export default function ToolsSection() {
  return (
    <section id="tools" className="relative py-20 px-4 md:px-6">
      <div className="max-w-[1300px] mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="section-label mb-3">Tools & Calculators</div>
            <h2 className="text-[clamp(26px,4vw,44px)] font-[900] tracking-[-0.03em] text-white leading-tight" style={{ fontFamily: "'Meera', sans-serif" }}>
              ജീവനക്കാർക്ക് ഉപകാരപ്രദമായ{' '}
              <span className="text-white/40">ടൂളുകൾ</span>
            </h2>
          </div>
          <p className="text-[13px] text-white/40 max-w-[320px] md:text-right leading-relaxed">
            Pay revision, pension, GPF, leave — എല്ലാ കണക്കുകൂട്ടൽ ഒരിടത്ത്
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((t) => (
            <Link
              key={t.title}
              href={t.href}
              className="glass-card glow-top group relative flex flex-col rounded-[22px] p-5 no-underline transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_50px_rgba(0,0,0,0.35)] overflow-hidden"
            >
              {/* Badge */}
              {t.badge && (
                <span
                  className="absolute top-3.5 right-3.5 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{
                    background: t.badge === 'NEW' ? 'rgba(41,151,255,0.25)' : 'rgba(255,255,255,0.08)',
                    color: t.badge === 'NEW' ? '#2997ff' : 'rgba(255,255,255,0.4)',
                    border: `1px solid ${t.badge === 'NEW' ? 'rgba(41,151,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  }}
                >
                  {t.badge}
                </span>
              )}

              {/* Glow blob */}
              <div
                className="absolute -top-6 -left-6 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: t.color + '20' }}
              />

              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ background: t.color + '18', border: `1px solid ${t.color}30` }}
              >
                {t.icon}
              </div>

              {/* Title */}
              <h3 className="text-[15px] font-bold text-white/90 leading-snug mb-0.5 group-hover:text-white transition-colors" style={{ fontFamily: "'Meera', sans-serif" }}>
                {t.title}
              </h3>
              <div className="text-[9px] font-black uppercase tracking-widest mb-2.5" style={{ color: t.color + 'cc' }}>
                {t.subtitle}
              </div>
              <p className="text-[12px] text-white/45 leading-relaxed mb-4 flex-1" style={{ fontFamily: "'Meera', sans-serif" }}>
                {t.desc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {t.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white/30 bg-white/[0.05] border border-white/[0.07]">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${t.color}80, transparent)` }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
