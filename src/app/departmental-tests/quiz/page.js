'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { TESTS, DEPTS } from '@/lib/testsData';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function fetchQuestions(testId, paper) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/quiz_questions?test_id=eq.${testId}&paper_number=eq.${paper}&order=sort_order.asc`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  return res.json();
}

function QuizInner() {
  const params = useSearchParams();
  const testId = Number(params.get('test'));
  const paper = Number(params.get('paper') || 1);

  const test = TESTS.find(t => t.id === testId);
  const dept = DEPTS.find(d => d.id === test?.dept);
  const color = dept?.color || '#2997ff';

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!testId) return;
    fetchQuestions(testId, paper).then(data => {
      setQuestions(Array.isArray(data) ? data : []);
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
      <div className="text-white/40 text-sm">Loading questions...</div>
    </div>
  );

  if (!questions.length) return (
    <div className="min-h-screen bg-aurora flex items-center justify-center text-white px-4">
      <div className="text-center">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-white/60 mb-2" style={{ fontFamily: "'Meera', sans-serif" }}>ഇതുവരെ ചോദ്യങ്ങൾ ചേർത്തിട്ടില്ല</p>
        <p className="text-white/30 text-sm mb-6">Questions not added yet for this paper</p>
        <Link href="/departmental-tests" className="text-[#2997ff] no-underline text-sm">← Back to Tests</Link>
      </div>
    </div>
  );

  const q = questions[current];
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
    if (isCorrect) setScore(s => s + 1);
    setResults(r => [...r, { question: q.question, selected: key, correct: q.correct_answer, isCorrect }]);
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  }

  function handleRestart() {
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
    setResults([]);
  }

  const pct = Math.round((score / questions.length) * 100);

  // Results screen
  if (finished) {
    return (
      <div className="min-h-screen bg-aurora text-white px-4 py-12">
        <div className="max-w-[600px] mx-auto">
          <div className="glass-card rounded-3xl p-8 text-center mb-6">
            <div className="text-5xl mb-4">{pct >= 60 ? '🎉' : '📚'}</div>
            <h2 className="text-2xl font-black mb-1" style={{ fontFamily: "'Meera', sans-serif" }}>
              {pct >= 80 ? 'മികച്ച പ്രകടനം!' : pct >= 60 ? 'നല്ലത്!' : 'കൂടുതൽ പഠിക്കണം'}
            </h2>
            <p className="text-white/50 text-sm mb-6">{test.name_ml} — Paper {paper}</p>
            <div className="text-[56px] font-black leading-none mb-2" style={{ color }}>{score}<span className="text-[28px] text-white/30">/{questions.length}</span></div>
            <div className="text-white/40 text-sm mb-6">{pct}% correct</div>

            {/* Score bar */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-8">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: color }} />
            </div>

            <div className="flex gap-3 justify-center">
              <button onClick={handleRestart}
                className="px-6 py-3 rounded-xl text-sm font-bold border-none cursor-pointer text-white transition-all"
                style={{ background: color + '33', outline: `1px solid ${color}44` }}>
                വീണ്ടും ശ്രമിക്കുക
              </button>
              <Link href="/departmental-tests"
                className="px-6 py-3 rounded-xl text-sm font-bold no-underline text-white/60 hover:text-white transition-all bg-white/5">
                ← Tests
              </Link>
            </div>
          </div>

          {/* Answer review */}
          <div className="flex flex-col gap-2">
            {results.map((r, i) => (
              <div key={i} className="glass-card rounded-xl p-4 flex items-start gap-3">
                <div className="text-base flex-shrink-0">{r.isCorrect ? '✅' : '❌'}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] text-white/70 mb-1">{r.question}</div>
                  {!r.isCorrect && (
                    <div className="text-[11px]">
                      <span className="text-[#ff453a]">Your answer: {r.selected.toUpperCase()}</span>
                      <span className="text-white/30 mx-2">|</span>
                      <span className="text-[#30d158]">Correct: {r.correct.toUpperCase()}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Quiz screen
  return (
    <div className="min-h-screen bg-aurora text-white px-4 py-12">
      <div className="max-w-[640px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/departmental-tests" className="text-[12px] text-white/40 hover:text-white no-underline transition-colors">← Back</Link>
          <div className="text-[12px] text-white/40">{current + 1} / {questions.length}</div>
        </div>

        {/* Test name */}
        <div className="mb-6">
          <div className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color }}>{dept?.icon} {dept?.en} — Paper {paper}</div>
          <div className="text-[15px] font-semibold text-white/70" style={{ fontFamily: "'Meera', sans-serif" }}>{test.name_ml}</div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-8">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((current) / questions.length) * 100}%`, background: color }} />
        </div>

        {/* Score */}
        <div className="flex items-center gap-2 mb-6 text-[12px] text-white/40">
          <span>Score:</span>
          <span className="font-black" style={{ color }}>{score}</span>
          <span>/ {current}</span>
        </div>

        {/* Question card */}
        <div className="glass-card rounded-3xl p-6 mb-4">
          <div className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-4">Question {current + 1}</div>
          <div className="text-[16px] font-semibold text-white leading-relaxed mb-6">{q.question}</div>

          <div className="flex flex-col gap-2.5">
            {options.map(opt => {
              let style = { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', outline: '1px solid rgba(255,255,255,0.08)' };
              if (answered) {
                if (opt.key === q.correct_answer) style = { background: 'rgba(48,209,88,0.15)', color: '#30d158', outline: '1px solid rgba(48,209,88,0.4)' };
                else if (opt.key === selected) style = { background: 'rgba(255,69,58,0.15)', color: '#ff453a', outline: '1px solid rgba(255,69,58,0.4)' };
              } else if (selected === opt.key) {
                style = { background: color + '22', color, outline: `1px solid ${color}44` };
              }

              return (
                <button key={opt.key}
                  onClick={() => handleSelect(opt.key)}
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

        {/* Explanation */}
        {answered && q.explanation && (
          <div className="glass-card rounded-2xl p-4 mb-4 flex items-start gap-2 text-[13px] text-white/60">
            <span className="flex-shrink-0">💡</span>
            <span>{q.explanation}</span>
          </div>
        )}

        {answered && (
          <button onClick={handleNext}
            className="w-full py-4 rounded-2xl text-[14px] font-bold border-none cursor-pointer text-white transition-all"
            style={{ background: color }}>
            {current + 1 >= questions.length ? 'Result കാണുക →' : 'അടുത്ത ചോദ്യം →'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function QuizPage() {
  return <Suspense><QuizInner /></Suspense>;
}
