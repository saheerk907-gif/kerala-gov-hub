'use client';
import Link from 'next/link';

const departments = [
  {
    icon: '💼',
    color: '#2997ff',
    title: 'ശമ്പളം & ബത്ത',
    subtitle: 'Salary & Allowances',
    links: [
      { label: 'Basic Pay Scale', href: '#calculator' },
      { label: 'DA Rates History', href: '#benefits' },
      { label: 'HRA Zone List', href: '#benefits' },
      { label: 'TA / Travelling Allowance', href: '#benefits' },
      { label: 'Overtime Allowance', href: '#benefits' },
      { label: 'Uniform Allowance', href: '#benefits' },
    ],
  },
  {
    icon: '🏦',
    color: '#30d158',
    title: 'പ്രോവിഡന്റ് ഫണ്ട്',
    subtitle: 'GPF / NPS',
    links: [
      { label: 'GPF Calculator', href: '/gpf' },
      { label: 'DA Arrear Calculator', href: '/da-arrear' },
      { label: 'NPS Contribution', href: '/nps' },
      { label: 'NPS vs OPS Comparison', href: '/nps' },
      { label: 'GPF Interest Rates', href: '/gpf' },
      { label: 'Nomination Form', href: '/gpf' },
    ],
  },
  {
    icon: '🏥',
    color: '#ff9f0a',
    title: 'ആരോഗ്യ ഇൻഷുറൻസ്',
    subtitle: 'Medisep & Medical',
    links: [
      { label: 'Medisep Coverage', href: '/medisep' },
      { label: 'Empanelled Hospitals', href: '/medisep' },
      { label: 'Cashless Treatment', href: '/medisep' },
      { label: 'Claim Procedure', href: '/medisep' },
      { label: 'Dependant Coverage', href: '/medisep' },
      { label: 'Premium Rates', href: '/medisep' },
    ],
  },
  {
    icon: '📖',
    color: '#bf5af2',
    title: 'സർവ്വീസ് ചട്ടങ്ങൾ',
    subtitle: 'Kerala Service Rules',
    links: [
      { label: 'KSR Part I — General', href: '/ksr' },
      { label: 'KSR Part II — Leave', href: '/ksr' },
      { label: 'KSR Part III — Pay', href: '/ksr' },
      { label: 'Leave Encashment', href: '/ksr' },
      { label: 'Earned Leave Rules', href: '/ksr' },
      { label: 'Study Leave', href: '/ksr' },
    ],
  },
  {
    icon: '🎖️',
    color: '#ff453a',
    title: 'പെൻഷൻ & വിരമിക്കൽ',
    subtitle: 'Pension & Retirement',
    links: [
      { label: 'Pension Calculation', href: '#benefits' },
      { label: 'Gratuity Rules', href: '#benefits' },
      { label: 'Family Pension', href: '#benefits' },
      { label: 'DCRG', href: '#benefits' },
      { label: 'Commutation of Pension', href: '#benefits' },
      { label: 'Retirement Age', href: '#benefits' },
    ],
  },
  {
    icon: '📋',
    color: '#c8960c',
    title: 'ഉത്തരവുകൾ & ഫോമുകൾ',
    subtitle: 'GOs & Forms',
    links: [
      { label: 'Latest Finance GOs', href: '#orders' },
      { label: 'Pay Revision GOs', href: '#orders' },
      { label: 'Leave Application Form', href: '#orders' },
      { label: 'GPF Withdrawal Form', href: '#orders' },
      { label: 'Service Certificate Form', href: '#orders' },
      { label: 'Pension Application', href: '#orders' },
    ],
  },
];

export default function DepartmentResourcesSection() {
  return (
    <section className="relative py-20 px-4 md:px-6">
      <div className="max-w-[1300px] mx-auto">

        {/* Header */}
        <div className="mb-12">
          <div className="section-label mb-3">Resources by Department</div>
          <h2 className="text-[clamp(26px,4vw,44px)] font-[900] tracking-[-0.03em] text-white leading-tight" style={{ fontFamily: "'Meera', sans-serif" }}>
            വകുപ്പ് അനുസരിച്ചുള്ള{' '}
            <span className="text-white/40">വിവര ശേഖരം</span>
          </h2>
        </div>

        {/* Department grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => (
            <div
              key={dept.title}
              className="glass-card rounded-[22px] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: `1px solid ${dept.color}20` }}>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: dept.color + '18', border: `1px solid ${dept.color}30` }}
                >
                  {dept.icon}
                </div>
                <div>
                  <div className="text-[14px] font-bold text-white/85" style={{ fontFamily: "'Meera', sans-serif" }}>
                    {dept.title}
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: dept.color + 'aa' }}>
                    {dept.subtitle}
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-col gap-1">
                {dept.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="group flex items-center justify-between py-1.5 px-2 rounded-lg no-underline hover:bg-white/[0.05] transition-all duration-150"
                  >
                    <span className="text-[12px] text-white/50 group-hover:text-white/80 transition-colors font-medium" style={{ fontFamily: "'Meera', sans-serif" }}>
                      {link.label}
                    </span>
                    <span className="text-white/15 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all text-[11px]">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
