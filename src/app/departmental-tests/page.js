'use client';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DEPTS, TESTS, getDeptColor } from '@/lib/testsData';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function fetchQuizCounts() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/quiz_questions?select=test_id,paper_number`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const data = await res.json();
    if (!Array.isArray(data)) return {};
    const map = {};
    data.forEach(q => {
      const key = `${q.test_id}_${q.paper_number}`;
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  } catch { return {}; }
}

function TestsPageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [activeDept, setActiveDept] = useState(params.get('dept') || 'all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(params.get('test') ? Number(params.get('test')) : null);
  const [quizCounts, setQuizCounts] = useState({});

  useEffect(() => {
    fetchQuizCounts().then(setQuizCounts);
  }, []);

  const filtered = useMemo(() => {
    let list = TESTS;
    if (activeDept !== 'all') list = list.filter(t => t.dept === activeDept);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.name_en.toLowerCase().includes(q) ||
        t.name_ml.includes(q) ||
        t.topics.some(tp => tp.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeDept, search]);

  const countByDept = useMemo(() => {
    const m = {};
    TESTS.forEach(t => { m[t.dept] = (m[t.dept] || 0) + 1; });
    return m;
  }, []);

  function hasQuiz(testId, paper) {
    return (quizCounts[`${testId}_${paper}`] || 0) > 0;
  }

  return (
    <div className="min-h-screen bg-aurora text-white">
      <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-12">

        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-[12px] text-white/40 hover:text-white no-underline mb-8 transition-colors">
          ← keralagovhub.in
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[clamp(28px,4vw,44px)] font-[900] tracking-[-0.03em] text-white leading-tight mb-2" style={{ fontFamily: "'Meera', sans-serif" }}>
            ഡിപ്പാർട്ട്‌മെന്റൽ ടെസ്റ്റുകൾ
          </h1>
          <p className="text-[14px] text-white/45">Kerala PSC — 30 departments, 64+ tests, syllabus & quiz</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setActiveDept('all'); setExpanded(null); }}
            placeholder="Search tests, topics... (e.g. KSR, Revenue, MOP)"
            className="w-full pl-10 pr-10 py-3.5 bg-white/[0.05] border border-white/10 rounded-2xl text-[14px] text-white placeholder-white/25 outline-none focus:border-white/25 transition-colors"
          />
          {search && (
            <button onClick={() => { setSearch(''); setExpanded(null); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white border-none bg-transparent cursor-pointer">✕</button>
          )}
        </div>

        {/* Dept Tabs */}
        {!search && (
          <div className="flex gap-2 flex-wrap mb-6">
            <button
              onClick={() => { setActiveDept('all'); setExpanded(null); }}
              className="px-3.5 py-2 rounded-xl text-[12px] font-bold border-none cursor-pointer transition-all"
              style={{ background: activeDept === 'all' ? '#ffffff20' : 'rgba(255,255,255,0.04)', color: activeDept === 'all' ? '#fff' : 'rgba(255,255,255,0.4)', outline: activeDept === 'all' ? '1px solid #ffffff30' : 'none' }}>
              🗂️ <span style={{ fontFamily: "'Meera', sans-serif" }}>എല്ലാം</span> ({TESTS.length})
            </button>
            {DEPTS.map(d => {
              const count = countByDept[d.id] || 0;
              const active = activeDept === d.id;
              return (
                <button key={d.id}
                  onClick={() => { setActiveDept(d.id); setExpanded(null); }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold border-none cursor-pointer transition-all"
                  style={{ background: active ? d.color + '20' : 'rgba(255,255,255,0.04)', color: active ? d.color : 'rgba(255,255,255,0.4)', outline: active ? `1px solid ${d.color}40` : 'none' }}>
                  {d.icon} <span style={{ fontFamily: "'Meera', sans-serif" }}>{d.label}</span> <span className="opacity-50">({count})</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="text-[11px] text-white/25 mb-4">{filtered.length} ടെസ്റ്റുകൾ</div>

        {/* Test List */}
        <div className="flex flex-col gap-2">
          {filtered.map(test => {
            const dept = DEPTS.find(d => d.id === test.dept);
            const color = dept?.color || '#86868b';
            const isOpen = expanded === test.id;
            const papers = Array.from({ length: test.papers }, (_, i) => i + 1);

            return (
              <div key={test.id} className="glass-card rounded-2xl overflow-hidden transition-all duration-200"
                style={isOpen ? { outline: `1px solid ${color}30` } : {}}>

                {/* Row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : test.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left border-none bg-transparent cursor-pointer group">
                  <div className="w-10 h-10 min-w-[40px] rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: color + '18', border: `1px solid ${color}28`, color }}>
                    {dept?.icon || '📋'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14px] font-semibold text-white/85 group-hover:text-white transition-colors" style={{ fontFamily: "'Meera', sans-serif" }}>
                        {test.name_ml}
                      </span>
                      {test.popular && <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded hidden sm:inline" style={{ background: color + '22', color }}>Popular</span>}
                    </div>
                    <div className="text-[11px] text-white/30 font-sans mt-0.5 truncate">{test.name_en}</div>
                  </div>
                  <div className="text-[10px] font-bold whitespace-nowrap hidden sm:block flex-shrink-0" style={{ color }}>
                    {test.papers} Paper{test.papers > 1 ? 's' : ''}
                  </div>
                  <div className="text-[9px] font-black uppercase px-2 py-1 rounded-lg hidden md:block flex-shrink-0"
                    style={{ background: color + '15', color }}>{dept?.en}</div>
                  <div className="text-white/20 group-hover:text-white/50 flex-shrink-0 transition-all"
                    style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}>→</div>
                </button>

                {/* Expanded */}
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-white/[0.06]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      <div className="bg-white/[0.03] rounded-xl p-4">
                        <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color }}>ആർക്ക് ആവശ്യം</div>
                        <div className="text-[13px] text-white/70 leading-relaxed" style={{ fontFamily: "'Meera', sans-serif" }}>{test.for_ml}</div>
                      </div>
                      <div className="bg-white/[0.03] rounded-xl p-4">
                        <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color }}>പ്രധാന വിഷയങ്ങൾ</div>
                        <div className="flex flex-wrap gap-1.5">
                          {test.topics.map((topic, i) => (
                            <span key={i} className="text-[11px] px-2 py-0.5 rounded-lg text-white/55 bg-white/[0.05]">{topic}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {test.note && (
                      <div className="mt-3 flex items-start gap-2 text-[12px] text-white/50 bg-white/[0.03] rounded-xl px-4 py-3">
                        <span>💡</span>
                        <span style={{ fontFamily: "'Meera', sans-serif" }}>{test.note}</span>
                      </div>
                    )}

                    {/* Paper Quiz Buttons */}
                    <div className="mt-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Quiz എടുക്കുക</div>
                      <div className="flex gap-2 flex-wrap">
                        {papers.map(p => {
                          const hasQ = hasQuiz(test.id, p);
                          return (
                            <Link
                              key={p}
                              href={hasQ ? `/departmental-tests/quiz?test=${test.id}&paper=${p}` : '#'}
                              onClick={e => !hasQ && e.preventDefault()}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold no-underline transition-all"
                              style={hasQ
                                ? { background: color + '22', color, border: `1px solid ${color}33` }
                                : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.2)', cursor: 'not-allowed' }
                              }
                              title={hasQ ? `Paper ${p} Quiz` : 'Questions not added yet'}>
                              {hasQ ? '▶' : '🔒'} Paper {p} {hasQ ? 'Quiz' : '(Coming Soon)'}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/30">
            <div className="text-4xl mb-3">🔍</div>
            <div style={{ fontFamily: "'Meera', sans-serif" }}>ഒരു ടെസ്റ്റും കണ്ടെത്തിയില്ല</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DepartmentalTestsPage() {
  return (
    <Suspense>
      <TestsPageInner />
    </Suspense>
  );
}
