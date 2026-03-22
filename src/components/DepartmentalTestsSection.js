'use client';
import Link from 'next/link';
import { DEPTS, TESTS } from '@/lib/testsData';

export default function DepartmentalTestsSection() {
  const countByDept = {};
  TESTS.forEach(t => { countByDept[t.dept] = (countByDept[t.dept] || 0) + 1; });

  return (
    <section id="departmental-tests" className="relative py-7 md:py-10 px-4 md:px-6">
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
            <div className="h-[2px] w-10 bg-gradient-to-r from-[#2997ff] to-transparent mt-2 rounded-full" />
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
          {DEPTS.map((d) => {
            const count = countByDept[d.id] || 0;
            return (
              <div key={d.id}>
                <Link
                  href={`/departmental-tests?dept=${d.id}`}
                  className="glass-card group relative flex items-center gap-2.5 px-3 py-2.5 rounded-[16px] no-underline transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] overflow-hidden h-full"
                >
                  {/* Glow blob */}
                  <div
                    className="absolute -top-4 -left-4 w-14 h-14 rounded-full blur-[28px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background: d.color + '30' }}
                  />

                  <div
                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-transform duration-200 group-hover:scale-105"
                    style={{ background: d.color + '20', border: `1px solid ${d.color}35` }}
                  >
                    {d.icon}
                  </div>
                  <div className="min-w-0">
                    <div
                      className="text-[11px] md:text-[12px] font-bold text-white/85 group-hover:text-white transition-colors leading-tight truncate"
                      style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
                    >
                      {d.label}
                    </div>
                    <div className="text-[8px] md:text-[9px] text-white/55 font-medium mt-0.5">
                      {count} tests
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: `linear-gradient(90deg, transparent, ${d.color}70, transparent)` }}
                  />
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
