'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { TESTS, DEPTS } from '@/lib/testsData';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BATCH_SIZE = 20;
const PENALTY = 1 / 3; // -0.33 per wrong answer

async function fetchQuestions(testId, paper) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/quiz_questions?test_id=eq.${testId}&paper_number=eq.${paper}&order=sort_order.asc`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  return res.json();
}

function ScoreBadge({ score, color }) {
  const display = score % 1 === 0 ? score : score.toFixed(2);
  return (
    <span className="font-black tabular-nums" style={{ color }}>
      {score >= 0 ? display : display}
    </span>
  );
}

function QuizInner() {
  const params = useSearchParams();
  const testId = Number(params.get('test'));
  const paper  = Number(params.get('paper') || 1);

  const test  = TESTS.find(t => t.id === testId);
  const dept  = DEPTS.find(d => d.id === test?.dept);
  const color = dept?.color || '#2997ff';

  const [loading,      setLoading]      = useState(true);
  const [totalQs,      setTotalQs]      = useState(0);     // original count
  const [mainRemain,   setMainRemain]   = useState([]);    // main batches not yet asked
  const [activeList,   setActiveList]   = useState([]);    // current 20 (or revision) list
  const [activeIdx,    setActiveIdx]    = useState(0);
  const [batchWrong,   setBatchWrong]   = useState([]);    // wrong in current batch
  // phase: 'main' | 'break' | 'revision' | 'done'
  const [phase,        setPhase]        = useState('main');
  const [revRound,     setRevRound]     = useState(0);

  // per-question UI
  const [selected,  setSelected]  = useState(null);
  const [answered,  setAnswered]  = useState(false);

  // score
  const [score,        setScore]        = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalWrong,   setTotalWrong]   = useState(0);
  const [allResults,   setAllResults]   = useState([]);
  const [totalAnswered,setTotalAnswered] = useState(0);

  useEffect(() => {
    if (!testId) return;
    fetchQuestions(testId, paper).then(data => {
      const qs = Array.isArray(data) ? data : [];
      setTotalQs(qs.length);
      setActiveList(qs.slice(0, BATCH_SIZE));
      setMainRemain(qs.slice(BATCH_SIZE));
      setLoading(false);
    });
  }, [testId, paper]);

  if (!test) return (
    <div className="min-h-screen bg-aurora flex items-center justify-center text-white">
      <div className="text-center">
        <div className="text-4xl mb-3">❌</div>
        <p className="text-white/50">Test not found</p>
        <Link href="/departmental-tests" className="text-[#2997ff] no-underline mt-4 inline-block">← Back</Link>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-aurora flex items-center justify-center">
      <div className="text-white/60 text-sm">Loading questions...</div>
    </div>
  );

  if (!totalQs) return (
    <div className="min-h-screen bg-aurora flex items-center justify-center text-white px-4">
      <div className="text-center">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-white/60 mb-2" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>ഇതുവരെ ചോദ്യങ്ങൾ ചേർത്തിട്ടില്ല</p>
        <p className="text-white/50 text-sm mb-6">Questions not added yet for this paper</p>
        <Link href="/departmental-tests" className="text-[#2997ff] no-underline text-sm">← Back to Tests</Link>
      </div>
    </div>
  );

  // ── BATCH BREAK SCREEN ──────────────────────────────────────────────────────
  if (phase === 'break') {
    const hasMoreBatches = mainRemain.length > 0;
    const nextBatchCount = Math.min(mainRemain.length, BATCH_SIZE);

    function skipRevisionAndContinue() {
      const nextBatch = mainRemain.slice(0, BATCH_SIZE);
      setMainRemain(mainRemain.slice(BATCH_SIZE));
      setActiveList(nextBatch);
      setActiveIdx(0);
      setBatchWrong([]);
      setSelected(null);
      setAnswered(false);
      setPhase('main');
    }

    return (
      <div className="min-h-screen bg-aurora text-white flex items-center justify-center px-4">
        <div className="max-w-[480px] w-full glass-card rounded-3xl p-8 text-center">
          <div className="text-5xl mb-4">🔁</div>
          <h2 className="text-[22px] font-black mb-2" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            Revision Round {revRound + 1}
          </h2>
          <p className="text-white/50 text-sm mb-6">
            You got <span className="text-[#ff453a] font-bold">{batchWrong.length}</span> wrong in the last batch.
            {hasMoreBatches && (
              <><br /><span className="text-white/50 text-xs mt-1 inline-block">{mainRemain.length} more question{mainRemain.length > 1 ? 's' : ''} remaining after this.</span></>
            )}
          </p>

          <div className="flex gap-3 justify-center mb-5 text-[13px]">
            <div className="px-4 py-2 rounded-xl" style={{ background: 'rgba(48,209,88,0.1)', color: '#30d158' }}>
              Score so far: <span className="font-black">{score.toFixed(2)}</span>
            </div>
          </div>

          {/* Start Revision */}
          <button
            onClick={() => {
              setActiveList(batchWrong);
              setBatchWrong([]);
              setActiveIdx(0);
              setSelected(null);
              setAnswered(false);
              setRevRound(r => r + 1);
              setPhase('revision');
            }}
            className="w-full py-3.5 rounded-2xl text-[14px] font-bold border-none cursor-pointer text-white mb-2"
            style={{ background: color }}>
            Start Revision ({batchWrong.length} questions) →
          </button>

          {/* Skip Revision — behaviour depends on whether more questions exist */}
          {hasMoreBatches ? (
            <>
              <button
                onClick={skipRevisionAndContinue}
                className="w-full py-3 rounded-2xl text-[13px] font-semibold border-none cursor-pointer mt-1 transition-colors"
                style={{ background: 'var(--quiz-opt-bg)', color: 'var(--quiz-opt-color)', outline: '1px solid var(--quiz-opt-border)' }}>
                Skip Revision — Next {nextBatchCount} Questions →
              </button>
              <button
                onClick={() => setPhase('done')}
                className="w-full py-3 rounded-2xl text-[12px] font-semibold border-none cursor-pointer mt-1 text-white/50 bg-transparent hover:text-white/50 transition-colors">
                End Quiz &amp; See Results
              </button>
            </>
          ) : (
            <button
              onClick={() => setPhase('done')}
              className="w-full py-3 rounded-2xl text-[13px] font-semibold border-none cursor-pointer mt-1 text-white/60 bg-transparent hover:text-white/60 transition-colors">
              Skip &amp; See Results
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── DONE / RESULTS SCREEN ───────────────────────────────────────────────────
  if (phase === 'done') {
    const finalScore   = parseFloat(score.toFixed(2));
    const maxScore     = totalAnswered;
    const pct          = maxScore > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const grade        = pct >= 80 ? { label: 'Excellent', emoji: '🏆', col: '#30d158' }
                       : pct >= 60 ? { label: 'Good',      emoji: '🎉', col: color }
                       : pct >= 40 ? { label: 'Average',   emoji: '📚', col: '#ff9f0a' }
                       :             { label: 'Needs Work', emoji: '💪', col: '#ff453a' };

    return (
      <div className="min-h-screen bg-aurora text-white px-4 py-12">
        <div className="max-w-[600px] mx-auto">

          {/* Result card */}
          <div className="glass-card rounded-3xl p-8 text-center mb-6">
            <div className="text-5xl mb-3">{grade.emoji}</div>
            <h2 className="text-2xl font-black mb-1" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              {grade.label}
            </h2>
            <p className="text-white/60 text-sm mb-6">{test.name_ml} — Paper {paper}</p>

            {/* Big score */}
            <div className="text-[64px] font-black leading-none mb-1" style={{ color: grade.col }}>
              {finalScore < 0 ? finalScore.toFixed(2) : finalScore % 1 === 0 ? finalScore : finalScore.toFixed(2)}
            </div>
            <div className="text-white/50 text-sm mb-6">Final Score</div>

            {/* Score bar */}
            <div className="w-full h-2 rounded-full overflow-hidden mb-6" style={{ background: 'var(--quiz-opt-bg)' }}>
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${Math.max(0, pct)}%`, background: grade.col }} />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { label: 'Attempted',  value: totalAnswered,                     col: 'rgba(255,255,255,0.7)' },
                { label: '✓ Correct',  value: totalCorrect,                      col: '#30d158' },
                { label: '✗ Wrong',    value: totalWrong,                        col: '#ff453a' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl py-4"
                  style={{ background: 'var(--quiz-opt-bg)', border: '1px solid var(--quiz-opt-border)' }}>
                  <div className="text-[22px] font-black" style={{ color: s.col }}>{s.value}</div>
                  <div className="text-[10px] text-white/55 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Marking scheme reminder */}
            <div className="rounded-xl px-4 py-3 mb-6 text-[11px] text-white/55 flex justify-center gap-6"
              style={{ background: 'var(--quiz-opt-bg)', border: '1px solid var(--quiz-opt-border)' }}>
              <span>✓ Correct = <span className="text-[#30d158] font-bold">+1</span></span>
              <span>✗ Wrong = <span className="text-[#ff453a] font-bold">−0.33</span></span>
              <span>Accuracy = <span className="font-bold text-white/50">{pct}%</span></span>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setScore(0); setTotalCorrect(0); setTotalWrong(0);
                  setTotalAnswered(0); setAllResults([]); setBatchWrong([]);
                  setRevRound(0); setActiveIdx(0); setSelected(null);
                  setAnswered(false); setPhase('main');
                  // reload first batch
                  fetchQuestions(testId, paper).then(data => {
                    const qs = Array.isArray(data) ? data : [];
                    setActiveList(qs.slice(0, BATCH_SIZE));
                    setMainRemain(qs.slice(BATCH_SIZE));
                  });
                }}
                className="px-6 py-3 rounded-xl text-sm font-bold border-none cursor-pointer text-white"
                style={{ background: color + '33', outline: `1px solid ${color}44` }}>
                വീണ്ടും ശ്രമിക്കുക
              </button>
              <Link href="/departmental-tests"
                className="px-6 py-3 rounded-xl text-sm font-bold no-underline text-white/60 hover:text-white bg-white/5 transition-all">
                ← Tests
              </Link>
            </div>
          </div>

          {/* Answer review */}
          <div className="text-[11px] font-black uppercase tracking-widest text-white/45 mb-3 px-1">
            Answer Review
          </div>
          <div className="flex flex-col gap-2">
            {allResults.map((r, i) => (
              <div key={i} className="glass-card rounded-xl p-4 flex items-start gap-3">
                <div className="text-base flex-shrink-0 mt-0.5">{r.isCorrect ? '✅' : '❌'}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-white/60 mb-1 leading-snug">{r.question}</div>
                  {!r.isCorrect && (
                    <div className="text-[11px] flex gap-3 flex-wrap">
                      <span style={{ color: '#ff453a' }}>Your: {r.selected?.toUpperCase()}</span>
                      <span style={{ color: '#30d158' }}>Correct: {r.correct?.toUpperCase()}</span>
                    </div>
                  )}
                  {r.explanation && (
                    <div className="text-[11px] text-white/50 mt-1">💡 {r.explanation}</div>
                  )}
                </div>
                <div className="text-[11px] font-black flex-shrink-0"
                  style={{ color: r.isCorrect ? '#30d158' : '#ff453a' }}>
                  {r.isCorrect ? '+1' : '−0.33'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── QUIZ SCREEN ─────────────────────────────────────────────────────────────
  const q = activeList[activeIdx];
  if (!q) return null;

  const options = [
    { key: 'a', text: q.option_a },
    { key: 'b', text: q.option_b },
    { key: 'c', text: q.option_c },
    { key: 'd', text: q.option_d },
  ];

  function handleSelect(key) {
    if (answered) return;
    setSelected(key);
    setAnswered(true);
    const isCorrect = key === q.correct_answer;
    setTotalAnswered(n => n + 1);
    if (isCorrect) {
      setScore(s => s + 1);
      setTotalCorrect(c => c + 1);
    } else {
      setScore(s => s - PENALTY);
      setTotalWrong(w => w + 1);
      setBatchWrong(prev => [...prev, q]);
    }
    setAllResults(r => [...r, {
      question: q.question, selected: key,
      correct: q.correct_answer, isCorrect,
      explanation: q.explanation,
    }]);
  }

  function handleNext() {
    const nextIdx = activeIdx + 1;

    if (nextIdx >= activeList.length) {
      // End of this list
      if (phase === 'revision') {
        // After revision: more main questions or done
        if (mainRemain.length > 0) {
          const nextBatch = mainRemain.slice(0, BATCH_SIZE);
          setMainRemain(mainRemain.slice(BATCH_SIZE));
          setActiveList(nextBatch);
          setActiveIdx(0);
          setBatchWrong([]);
          setPhase('main');
        } else if (batchWrong.length > 0) {
          setPhase('break');
        } else {
          setPhase('done');
        }
      } else {
        // End of main batch — check for wrongs
        if (batchWrong.length > 0) {
          setPhase('break');
        } else if (mainRemain.length > 0) {
          const nextBatch = mainRemain.slice(0, BATCH_SIZE);
          setMainRemain(mainRemain.slice(BATCH_SIZE));
          setActiveList(nextBatch);
          setActiveIdx(0);
          setPhase('main');
        } else {
          setPhase('done');
        }
      }
    } else {
      setActiveIdx(nextIdx);
    }

    setSelected(null);
    setAnswered(false);
  }

  const isRevision   = phase === 'revision';
  const progressPct  = (activeIdx / activeList.length) * 100;
  const questionNum  = allResults.length + 1;

  return (
    <div className="min-h-screen bg-aurora text-white px-4 py-12">
      <div className="max-w-[640px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/departmental-tests" className="text-[12px] text-white/60 hover:text-white no-underline transition-colors">← Back</Link>
          <div className="flex items-center gap-3 text-[12px] text-white/60">
            {isRevision && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black"
                style={{ background: '#ff9f0a22', color: '#ff9f0a', border: '1px solid #ff9f0a33' }}>
                REVISION {revRound}
              </span>
            )}
            <span>{activeIdx + 1} / {activeList.length}</span>
          </div>
        </div>

        {/* Test name */}
        <div className="mb-4">
          <div className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color }}>
            {dept?.icon} {dept?.en} — Paper {paper}
          </div>
          <div className="text-[14px] font-semibold text-white/60" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            {test.name_ml}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full overflow-hidden mb-5" style={{ background: 'var(--quiz-opt-bg)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, background: isRevision ? '#ff9f0a' : color }} />
        </div>

        {/* Live score bar */}
        <div className="flex items-center gap-4 mb-6 px-1 text-[12px]">
          <div className="flex items-center gap-1.5">
            <span className="text-white/50">Score</span>
            <span className="font-black text-[15px]"
              style={{ color: score < 0 ? '#ff453a' : score > 0 ? '#30d158' : 'rgba(255,255,255,0.5)' }}>
              {score < 0 ? score.toFixed(2) : score % 1 === 0 ? score : score.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[#30d158] font-bold">✓ {totalCorrect}</span>
            <span className="text-white/40">|</span>
            <span className="text-[#ff453a] font-bold">✗ {totalWrong}</span>
          </div>
        </div>

        {/* Question card */}
        <div className="glass-card rounded-3xl p-6 mb-4"
          style={isRevision ? { borderColor: 'rgba(255,159,10,0.25)', background: 'rgba(255,159,10,0.04)' } : {}}>
          <div className="text-[10px] font-black uppercase tracking-widest text-white/45 mb-3">
            Question {questionNum} {isRevision ? '· Revision' : ''}
          </div>
          <div className="text-[15px] font-semibold text-white leading-relaxed mb-6">{q.question}</div>

          <div className="flex flex-col gap-2.5">
            {options.map(opt => {
              let style = { background: 'var(--quiz-opt-bg)', color: 'var(--quiz-opt-color)', outline: '1px solid var(--quiz-opt-border)' };
              if (answered) {
                if (opt.key === q.correct_answer)
                  style = { background: 'rgba(48,209,88,0.15)', color: '#30d158', outline: '1px solid rgba(48,209,88,0.4)' };
                else if (opt.key === selected)
                  style = { background: 'rgba(255,69,58,0.15)', color: '#ff453a', outline: '1px solid rgba(255,69,58,0.4)' };
                else
                  style = { background: 'var(--quiz-opt-bg)', color: 'var(--quiz-opt-color)', outline: '1px solid var(--quiz-opt-border)' };
              } else if (selected === opt.key) {
                style = { background: color + '22', color, outline: `1px solid ${color}44` };
              }
              return (
                <button key={opt.key} onClick={() => handleSelect(opt.key)}
                  disabled={answered}
                  className="w-full flex items-start gap-3 px-4 py-3.5 rounded-xl text-left text-[14px] font-medium border-none cursor-pointer transition-all disabled:cursor-default"
                  style={style}>
                  <span className="font-black text-[12px] w-5 flex-shrink-0 mt-0.5">{opt.key.toUpperCase()}.</span>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Score feedback */}
        {answered && (
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="text-[13px] font-black" style={{ color: selected === q.correct_answer ? '#30d158' : '#ff453a' }}>
              {selected === q.correct_answer ? '✓ +1 mark' : '✗ −0.33 mark'}
            </div>
          </div>
        )}

        {/* Explanation */}
        {answered && q.explanation && (
          <div className="glass-card rounded-2xl p-4 mb-4 flex items-start gap-2 text-[13px] text-white/55">
            <span className="flex-shrink-0">💡</span>
            <span>{q.explanation}</span>
          </div>
        )}

        {answered && (
          <button onClick={handleNext}
            className="w-full py-4 rounded-2xl text-[14px] font-bold border-none cursor-pointer text-white transition-all"
            style={{ background: isRevision ? '#ff9f0a' : color }}>
            {activeIdx + 1 >= activeList.length
              ? (batchWrong.length > 0 ? `Revision Round (${batchWrong.length} wrong) →`
                : mainRemain.length > 0 ? 'Next Batch →'
                : 'See Final Result →')
              : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function QuizPage() {
  return <Suspense><QuizInner /></Suspense>;
}
