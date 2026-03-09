'use client';

const dates = [
  {
    month: 'MAR', day: '31',
    title: 'Income Tax Return',
    desc: 'AY 2025-26 — Income Tax filing deadline',
    color: '#ff453a', urgent: true,
  },
  {
    month: 'MAR', day: '31',
    title: 'Property Statement',
    desc: 'Annual property return submission deadline',
    color: '#ff9f0a', urgent: true,
  },
  {
    month: 'MAR', day: '31',
    title: 'GPF Nomination Update',
    desc: 'GPF nomination & address verification',
    color: '#30d158', urgent: false,
  },
  {
    month: 'APR', day: '15',
    title: 'Medisep Renewal',
    desc: 'Premium payment for 2025-26 coverage',
    color: '#2997ff', urgent: false,
  },
  {
    month: 'APR', day: '30',
    title: 'Service Book Verification',
    desc: 'Annual service book entry & verification',
    color: '#bf5af2', urgent: false,
  },
  {
    month: 'JUL', day: '01',
    title: 'DA Revision',
    desc: 'Dearness Allowance revision effective date',
    color: '#c8960c', urgent: false,
  },
  {
    month: 'JUL', day: '01',
    title: 'Annual Increment',
    desc: 'Increment for eligible employees',
    color: '#64d2ff', urgent: false,
  },
  {
    month: 'JAN', day: '01',
    title: 'DA Revision',
    desc: 'Half-yearly DA revision — January edition',
    color: '#ff375f', urgent: false,
  },
];

export default function ImportantDatesSection() {
  return (
    <section className="relative py-20 px-4 md:px-6">
      <div className="max-w-[1300px] mx-auto">

        {/* Header */}
        <div className="mb-12">
          <div className="section-label mb-3">Calendar</div>
          <h2 className="text-[clamp(26px,4vw,44px)] font-[900] tracking-[-0.03em] text-white leading-tight" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            പ്രധാന തീയതികളും{' '}
            <span className="text-white/60">സമയ പരിധികളും</span>
          </h2>
        </div>

        {/* Date grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {dates.map((d, i) => (
            <div
              key={i}
              className="glass-card relative rounded-[18px] p-4 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              {d.urgent && (
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: d.color }} />
              )}

              {/* Date block */}
              <div
                className="w-full rounded-xl py-3 mb-3 flex flex-col items-center"
                style={{ background: d.color + '15', border: `1px solid ${d.color}25` }}
              >
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: d.color + 'aa' }}>{d.month}</span>
                <span className="text-[28px] font-[900] leading-none" style={{ color: d.color }}>{d.day}</span>
              </div>

              <h4 className="text-[11px] font-bold text-white/80 leading-tight mb-1.5" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                {d.title}
              </h4>
              <p className="text-[9px] text-white/55 leading-relaxed">
                {d.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-[11px] text-white/45 mt-6 text-center">
          * Dates are indicative. Verify from official circulars — finance.kerala.gov.in
        </p>
      </div>
    </section>
  );
}
