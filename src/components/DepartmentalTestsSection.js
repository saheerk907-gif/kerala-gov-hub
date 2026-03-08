'use client';
import Link from 'next/link';
import { DEPTS, TESTS } from '@/lib/testsData';

export default function DepartmentalTestsSection() {
  const countByDept = {};
  TESTS.forEach(t => { countByDept[t.dept] = (countByDept[t.dept] || 0) + 1; });

  const popular = TESTS.filter(t => t.popular).slice(0, 6);

  return (
    <section id="departmental-tests" className="relative py-14 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="section-label mb-3">Exam Prep</div>
            <h2 className="text-[clamp(28px,4.5vw,50px)] font-[900] tracking-[-0.03em] text-white leading-tight" style={{ fontFamily: "'Meera', sans-serif" }}>
              ഡിപ്പാർട്ട്‌മെന്റൽ{' '}
              <span>ടെസ്റ്റുകൾ</span>
            </h2>
            <p className="text-[15px] text-white/50 max-w-[560px] mt-3">
              30 വകുപ്പുകളിലെ 64+ ടെസ്റ്റുകൾ — സിലബസ്, ആർക്ക് ആവശ്യം, Quiz സഹിതം.
            </p>
          </div>
          <Link href="/departmental-tests"
            className="inline-flex items-center gap-2 px-6 py-3 glass-pill rounded-full text-[13px] font-bold text-white/70 no-underline hover:text-white transition-all whitespace-nowrap">
            എല്ലാ ടെസ്റ്റുകളും →
          </Link>
        </div>

        {/* Department Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-12">
          {DEPTS.map(d => {
            const count = countByDept[d.id] || 0;
            return (
              <Link
                key={d.id}
                href={`/departmental-tests?dept=${d.id}`}
                className="glass-card group flex items-center gap-3 p-4 rounded-2xl no-underline transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]"
              >
                <div className="w-10 h-10 min-w-[40px] rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: d.color + '18', border: `1px solid ${d.color}28` }}>
                  {d.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-white/80 group-hover:text-white transition-colors leading-tight" style={{ fontFamily: "'Meera', sans-serif" }}>
                    {d.label}
                  </div>
                  <div className="text-[10px] mt-0.5 font-semibold text-white/35">
                    {count} tests
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Popular tests */}
        <div className="mb-4">
          <div className="text-[11px] font-black uppercase tracking-[0.15em] text-white/30 mb-4">Popular Tests</div>
          <div className="flex flex-col gap-2">
            {popular.map(test => {
              const dept = DEPTS.find(d => d.id === test.dept);
              const color = dept?.color || '#86868b';
              return (
                <Link
                  key={test.id}
                  href={`/departmental-tests?dept=${test.dept}&test=${test.id}`}
                  className="glass-card group flex items-center gap-4 px-5 py-3.5 rounded-2xl no-underline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
                >
                  <div className="w-8 h-8 min-w-[32px] rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background: color + '18', border: `1px solid ${color}28`, color }}>
                    {dept?.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-white/80 group-hover:text-white transition-colors truncate" style={{ fontFamily: "'Meera', sans-serif" }}>
                      {test.name_ml}
                    </div>
                    <div className="text-[10px] text-white/30 font-sans mt-0.5">{test.name_en}</div>
                  </div>
                  <div className="text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-lg flex-shrink-0 hidden sm:block text-white/35"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {test.papers} Paper{test.papers > 1 ? 's' : ''}
                  </div>
                  <div className="text-white/20 group-hover:text-white/50 transition-all flex-shrink-0">→</div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/departmental-tests"
            className="inline-flex items-center gap-2 px-7 py-3.5 glass-pill rounded-full text-[13px] font-bold text-white/80 no-underline hover:text-white hover:border-white/30 transition-all">
            എല്ലാ 64 ടെസ്റ്റുകളും + Quiz →
          </Link>
        </div>

      </div>
    </section>
  );
}
