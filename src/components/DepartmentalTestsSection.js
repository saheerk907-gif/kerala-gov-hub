'use client';
import { useState } from 'react';
import Link from 'next/link';
import { DEPTS, TESTS } from '@/lib/testsData';

const ACCENT = '#2997ff'; // blue
const VISIBLE = 8;

const F1 = '#161e2e';
const F2 = '#111828';
const D  = '#0d1320';

function DeptTestIllustration() {
  return (
    <svg viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">

      {/* Second exam sheet — behind, tilted */}
      <g transform="translate(528,158) rotate(18)">
        <rect x="-65" y="-110" width="130" height="200" rx="8" fill={F2}/>
        <rect x="-52" y="-90" width="104" height="7" rx="3" fill={D}/>
        <rect x="-52" y="-76" width="80"  height="7" rx="3" fill={D}/>
        <rect x="-52" y="-62" width="96"  height="7" rx="3" fill={D}/>
        <rect x="-52" y="-48" width="68"  height="7" rx="3" fill={D}/>
        <rect x="-52" y="-34" width="88"  height="7" rx="3" fill={D}/>
        <rect x="-52" y="-20" width="60"  height="7" rx="3" fill={D}/>
        <rect x="-52" y="-6"  width="76"  height="7" rx="3" fill={D}/>
        <rect x="-52" y="8"   width="50"  height="7" rx="3" fill={D}/>
      </g>

      {/* Main clipboard — dominant, right-center */}
      <g transform="translate(445,192)">
        <rect x="-85" y="-132" width="170" height="244" rx="10" fill={F1}/>
        {/* Clip */}
        <rect x="-32" y="-146" width="64" height="26" rx="9" fill={F2}/>
        <rect x="-22" y="-152" width="44" height="20" rx="7" fill={D}/>
        {/* Paper */}
        <rect x="-73" y="-112" width="146" height="214" rx="6" fill={F2}/>
        {/* Question rows */}
        {[-90,-72,-54,-36,-18,0,18,36,54,72,90].map((y,i)=>(
          <rect key={i} x="-56" y={y} width={i%5===4?85:118} height="7" rx="3" fill={D}/>
        ))}
        {/* Checkbox + tick — left margin */}
        {[-90,-36,18,72].map((y,i)=>(
          <g key={i}>
            <rect x="-70" y={y-1} width="10" height="10" rx="2" fill={D}/>
            {i < 3 && (
              <polyline
                points={`${-68},${y+4} ${-65},${y+7} ${-60},${y+1}`}
                fill="none" stroke={F1} strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round"/>
            )}
          </g>
        ))}
      </g>

      {/* Graduation cap — top area */}
      <g transform="translate(368,84)">
        <polygon points="0,-24 52,0 0,24 -52,0" fill={F1}/>
        <rect x="-52" y="-4" width="104" height="8" rx="4" fill={F2}/>
        <rect x="-6"  y="0"  width="12"  height="32" rx="3" fill={F2}/>
        {/* Tassel */}
        <line x1="52" y1="0" x2="52" y2="30" stroke={F2} strokeWidth="3.5" strokeLinecap="round"/>
        <circle cx="52" cy="32" r="7" fill={F2}/>
      </g>

      {/* Badge / medal — bottom-left of cluster */}
      <g transform="translate(356,295)">
        <circle r="24" fill={F2}/>
        <circle r="17" fill={D}/>
        <polygon points="0,-11 3.2,-3.6 11,-3.6 5.2,2.2 7.4,9.8 0,5.6 -7.4,9.8 -5.2,2.2 -11,-3.6 -3.2,-3.6"
          fill={F1}/>
      </g>

      {/* Pencil — small diagonal */}
      <g transform="translate(338,188) rotate(-42)">
        <rect x="-4" y="-46" width="8" height="72" rx="3" fill={F2}/>
        <polygon points="-4,26 4,26 0,44" fill="#fbbf24" opacity="0.32"/>
        <rect x="-4" y="-46" width="8" height="11" rx="3" fill="#3a4f75"/>
        <rect x="-4" y="-18" width="8" height="5" fill={D}/>
      </g>

      {/* Accent dots */}
      <circle cx="326" cy="142" r="4"   fill={F1}/>
      <circle cx="338" cy="158" r="2.5" fill={F2}/>
      <circle cx="574" cy="320" r="5"   fill={F1}/>
      <circle cx="562" cy="338" r="3"   fill={F2}/>
    </svg>
  );
}

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
          {/* SVG illustrated card */}
          <div className="relative overflow-hidden" style={{
            background: '#080c14',
            borderRadius: 26,
            minHeight: 380,
          }}>
            {/* SVG illustration — behind everything */}
            <DeptTestIllustration />
            {/* Fade content area */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 1,
              background: 'linear-gradient(to right, rgba(8,12,20,0.97) 0%, rgba(8,12,20,0.88) 44%, rgba(8,12,20,0.50) 68%, transparent 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, zIndex: 1,
              background: 'linear-gradient(to bottom, rgba(8,12,20,0.55) 0%, transparent 30%, rgba(8,12,20,0.75) 100%)' }} />
            {/* Blue accent glow bottom-left */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '50%', height: '40%', zIndex: 1,
              background: 'radial-gradient(ellipse at bottom left, rgba(41,151,255,0.13) 0%, transparent 70%)' }} />

            {/* Content */}
            <div className="relative p-5 md:p-7 flex flex-col" style={{ zIndex: 2, minHeight: 380 }}>

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
