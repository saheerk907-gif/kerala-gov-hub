'use client';
import Link from 'next/link';
import { DEPTS, TESTS } from '@/lib/testsData';

export default function DepartmentalTestsSection() {
  const countByDept = {};
  TESTS.forEach(t => { countByDept[t.dept] = (countByDept[t.dept] || 0) + 1; });

  return (
    <section id="departmental-tests" className="relative py-10 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-6 gap-4">
          <div>
            <div className="section-label mb-2">Exam Prep</div>
            <h2
              className="text-[clamp(22px,3vw,32px)] font-[900] tracking-[-0.02em] text-white leading-tight"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
            >
              ഡിപ്പാർട്ട്‌മെന്റൽ ടെസ്റ്റുകൾ
            </h2>
            <div className="h-[2px] w-10 bg-gradient-to-r from-[#30d158] to-transparent mt-2 rounded-full" />
          </div>
          <Link
            href="/departmental-tests"
            className="flex-shrink-0 flex items-center gap-1.5 text-[12px] font-bold text-white/65 no-underline hover:text-white transition-colors"
          >
            എല്ലാം കാണുക
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Compact department grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {DEPTS.map(d => {
            const count = countByDept[d.id] || 0;
            return (
              <Link
                key={d.id}
                href={`/departmental-tests?dept=${d.id}`}
                className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl no-underline transition-all duration-200 hover:bg-white/[0.05]"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                  style={{ background: d.color + '20', border: `1px solid ${d.color}35` }}
                >
                  {d.icon}
                </div>
                <div className="min-w-0">
                  <div
                    className="text-[12px] font-bold text-white/85 group-hover:text-white transition-colors leading-tight truncate"
                    style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
                  >
                    {d.label}
                  </div>
                  <div className="text-[9px] text-white/55 font-medium mt-0.5">
                    {count} tests
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
