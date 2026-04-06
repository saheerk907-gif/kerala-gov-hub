'use client';
import { useState } from 'react';
import Link from 'next/link';
import { DEPTS, TESTS } from '@/lib/testsData';

const ACCENT = '#2997ff'; // blue
const VISIBLE = 8;

export default function DepartmentalTestsSection() {
  const [expanded, setExpanded] = useState(false);
  const countByDept = {};
  TESTS.forEach(t => { countByDept[t.dept] = (countByDept[t.dept] || 0) + 1; });
  const visibleDepts = expanded ? DEPTS : DEPTS.slice(0, VISIBLE);

  return (
    <section id="departmental-tests" className="relative py-3 md:py-4 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Purple-blue glow border wrapper */}
        <div style={{
          background: 'linear-gradient(135deg,rgba(140,80,240,0.55),rgba(60,130,255,0.55))',
          padding: '1.5px', borderRadius: 28,
        }}>
          {/* Cinematic photo card */}
          <div className="relative overflow-hidden" style={{
            backgroundImage: "url('/images/govtoffic.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 60%',
            borderRadius: 26,
            minHeight: 380,
          }}>
            {/* ── Cinematic overlays ── */}
            {/* Base dark tint */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,7,15,0.7)', zIndex: 1 }} />
            {/* Left-to-right: strong dark left for content */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 2,
              background: 'linear-gradient(to right, rgba(5,7,15,0.98) 0%, rgba(5,7,15,0.82) 38%, rgba(5,7,15,0.5) 65%, rgba(5,7,15,0.2) 100%)' }} />
            {/* Top-to-bottom */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 2,
              background: 'linear-gradient(to bottom, rgba(5,7,15,0.8) 0%, transparent 35%, rgba(5,7,15,0.9) 100%)' }} />
            {/* Blue accent glow bottom-left */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '50%', height: '40%', zIndex: 2,
              background: 'radial-gradient(ellipse at bottom left, rgba(41,151,255,0.13) 0%, transparent 70%)' }} />

            {/* ── Content ── */}
            <div className="relative p-5 md:p-7 flex flex-col" style={{ zIndex: 3, minHeight: 380 }}>

              {/* Header row */}
              <div className="flex items-start justify-between mb-5 gap-4">
                <div>
                  <div className="section-label mb-1" style={{ color: ACCENT, opacity: 1, fontWeight: 800 }}>Exam Prep</div>
                  <h2 className="text-[clamp(26px,4vw,38px)] font-[900] tracking-[-0.03em] text-white leading-tight"
                    style={{ fontFamily: "var(--font-noto-malayalam), sans-serif", textShadow: '0 2px 20px rgba(0,0,0,0.9)' }}>
                    ഡിപ്പാർട്ട്‌മെന്റൽ ടെസ്റ്റുകൾ
                  </h2>
                  <div className="h-[3px] w-12 mt-2 rounded-full"
                    style={{ background: `linear-gradient(to right, ${ACCENT}, transparent)` }} />

                  {/* Stats badges */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                      style={{ background: 'rgba(41,151,255,0.15)', border: '1px solid rgba(41,151,255,0.35)', color: ACCENT }}>
                      📋 {DEPTS.length} Departments
                    </div>
                    <div className="px-2.5 py-1 rounded-full text-[10px] font-semibold"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.65)' }}>
                      📝 {TESTS.length} Tests
                    </div>
                  </div>
                </div>

                {/* See all link */}
                <Link href="/departmental-tests"
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold no-underline transition-all hover:bg-white/[0.1]"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)', color: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', marginTop: 4 }}>
                  എല്ലാം
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Department grid — frosted glass cards on the photo */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 flex-grow">
                {visibleDepts.map((d) => {
                  const count = countByDept[d.id] || 0;
                  return (
                    <Link key={d.id}
                      href={`/departmental-tests?dept=${d.id}`}
                      className="group relative flex items-center gap-2.5 px-3 py-2.5 rounded-[14px] no-underline transition-all duration-200 hover:-translate-y-0.5 overflow-hidden"
                      style={{
                        background: 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(10px)',
                      }}>
                      {/* Colour glow on hover */}
                      <div className="absolute -top-4 -left-4 w-14 h-14 rounded-full blur-[24px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        style={{ background: d.color + '40' }} />
                      {/* Hover border accent */}
                      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ background: `linear-gradient(90deg, transparent, ${d.color}80, transparent)` }} />

                      <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-transform duration-200 group-hover:scale-110"
                        style={{ background: d.color + '22', border: `1px solid ${d.color}45` }}>
                        {d.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] md:text-[12px] font-bold text-white/90 group-hover:text-white transition-colors leading-tight truncate"
                          style={{ fontFamily: "var(--font-noto-malayalam), sans-serif", textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                          {d.label}
                        </div>
                        <div className="text-[9px] font-medium mt-0.5" style={{ color: d.color + 'bb' }}>
                          {count} tests
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Expand button */}
              {DEPTS.length > VISIBLE && (
                <button
                  onClick={() => setExpanded(v => !v)}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-[12px] font-bold transition-all cursor-pointer border-none"
                  style={{
                    background: 'rgba(41,151,255,0.1)',
                    color: ACCENT,
                    border: '1px solid rgba(41,151,255,0.25)',
                    backdropFilter: 'blur(8px)',
                  }}>
                  {expanded ? 'Show Less ↑' : `Show All ${DEPTS.length} Departments ↓`}
                </button>
              )}

            </div>{/* /content */}
          </div>{/* /photo card */}
        </div>{/* /gradient border */}

      </div>
    </section>
  );
}
