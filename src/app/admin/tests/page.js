'use client';
import { useEffect, useState, useRef } from 'react';
import { DEPTS, TESTS } from '@/lib/testsData';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const EMPTY_Q = { question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'a', explanation: '', sort_order: 0 };

async function api(path, method = 'GET', body = null) {
  const token = sessionStorage.getItem('admin_token');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token || SUPABASE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: body ? JSON.stringify(body) : null,
  });
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

function parseCSV(text) {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return { rows: [], error: 'CSV ഫയലിൽ ഡേറ്റ ഇല്ല' };

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
  const required = ['question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer'];
  const missing = required.filter(r => !headers.includes(r));
  if (missing.length) return { rows: [], error: `കോളം കാണുന്നില്ല: ${missing.join(', ')}` };

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    // Handle quoted commas
    const cols = [];
    let cur = '', inQ = false;
    for (const ch of lines[i]) {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { cols.push(cur.trim()); cur = ''; }
      else { cur += ch; }
    }
    cols.push(cur.trim());

    const row = {};
    headers.forEach((h, idx) => { row[h] = cols[idx] || ''; });

    if (!row.question || !row.option_a || !row.option_b || !row.option_c || !row.option_d) continue;
    const ans = (row.correct_answer || '').toLowerCase().replace(/^option\s*/i, '').trim();
    if (!['a', 'b', 'c', 'd'].includes(ans)) continue;

    rows.push({
      question: row.question,
      option_a: row.option_a,
      option_b: row.option_b,
      option_c: row.option_c,
      option_d: row.option_d,
      correct_answer: ans,
      explanation: row.explanation || '',
      sort_order: Number(row.sort_order) || (i - 1),
    });
  }

  if (!rows.length) return { rows: [], error: 'Valid ആയ ചോദ്യങ്ങൾ ഒന്നും കണ്ടില്ല. correct_answer a/b/c/d ആയിരിക്കണം.' };
  return { rows, error: null };
}

function downloadTemplate() {
  const csv = `question,option_a,option_b,option_c,option_d,correct_answer,explanation
"What does KSR stand for?","Kerala Service Rules","Kerala State Rules","Kerala Salary Rules","Kerala Staff Rules",a,"KSR = Kerala Service Rules"
"Under KSR which part deals with leave?","Part I","Part II","Part III","Part IV",b,""
`;
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'quiz_template.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function AdminTests() {
  const [activeDept, setActiveDept] = useState('common');
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_Q);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [qCounts, setQCounts] = useState({});

  // CSV import state
  const [showImport, setShowImport] = useState(false);
  const [csvPreview, setCsvPreview] = useState([]);
  const [csvError, setCsvError] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    api('quiz_questions?select=test_id,paper_number').then(data => {
      if (!Array.isArray(data)) return;
      const map = {};
      data.forEach(q => {
        const key = `${q.test_id}_${q.paper_number}`;
        map[key] = (map[key] || 0) + 1;
      });
      setQCounts(map);
    });
  }, []);

  async function loadQuestions(testId, paper) {
    setLoading(true);
    const data = await api(`quiz_questions?test_id=eq.${testId}&paper_number=eq.${paper}&order=sort_order.asc`);
    setQuestions(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  function selectTest(test, paper) {
    setSelectedTest(test);
    setSelectedPaper(paper);
    setShowForm(false);
    setShowImport(false);
    setCsvPreview([]);
    setCsvError('');
    setImportResult(null);
    setForm(EMPTY_Q);
    setEditId(null);
    loadQuestions(test.id, paper);
  }

  async function refreshCounts() {
    const data = await api('quiz_questions?select=test_id,paper_number');
    if (!Array.isArray(data)) return;
    const map = {};
    data.forEach(q => { const key = `${q.test_id}_${q.paper_number}`; map[key] = (map[key] || 0) + 1; });
    setQCounts(map);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, test_id: selectedTest.id, paper_number: selectedPaper };
    if (editId) {
      await api(`quiz_questions?id=eq.${editId}`, 'PATCH', payload);
    } else {
      await api('quiz_questions', 'POST', payload);
    }
    setSaving(false);
    setShowForm(false);
    setForm(EMPTY_Q);
    setEditId(null);
    loadQuestions(selectedTest.id, selectedPaper);
    refreshCounts();
  }

  async function handleDelete(id) {
    if (!confirm('ഈ ചോദ്യം ഡിലീറ്റ് ചെയ്യണോ?')) return;
    await api(`quiz_questions?id=eq.${id}`, 'DELETE');
    loadQuestions(selectedTest.id, selectedPaper);
    refreshCounts();
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setCsvError('');
    setCsvPreview([]);
    setImportResult(null);
    const reader = new FileReader();
    reader.onload = ev => {
      const { rows, error } = parseCSV(ev.target.result);
      if (error) { setCsvError(error); return; }
      setCsvPreview(rows);
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    if (!csvPreview.length) return;
    setImporting(true);
    setImportResult(null);
    const payload = csvPreview.map((q, i) => ({
      ...q,
      test_id: selectedTest.id,
      paper_number: selectedPaper,
      sort_order: q.sort_order || i + 1,
    }));

    // Insert in batches of 50
    let inserted = 0;
    let failed = 0;
    for (let i = 0; i < payload.length; i += 50) {
      const batch = payload.slice(i, i + 50);
      const result = await api('quiz_questions', 'POST', batch);
      if (Array.isArray(result)) inserted += result.length;
      else failed += batch.length;
    }

    setImporting(false);
    setImportResult({ inserted, failed });
    setCsvPreview([]);
    if (fileRef.current) fileRef.current.value = '';
    loadQuestions(selectedTest.id, selectedPaper);
    refreshCounts();
  }

  const deptTests = TESTS.filter(t => t.dept === activeDept);
  const inp = 'w-full px-3 py-2.5 bg-[#1c1c1e] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors';

  return (
    <div className="flex gap-6 h-full">

      {/* Left panel */}
      <div className="w-64 flex-shrink-0">
        <h1 className="text-xl font-bold mb-4">Quiz Questions</h1>

        <div className="flex flex-col gap-1 mb-4">
          {DEPTS.map(d => (
            <button key={d.id}
              onClick={() => { setActiveDept(d.id); setSelectedTest(null); }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left border-none cursor-pointer transition-all"
              style={{ background: activeDept === d.id ? d.color + '20' : 'transparent', color: activeDept === d.id ? d.color : 'rgba(255,255,255,0.5)' }}>
              <span>{d.icon}</span>
              <span style={{ fontFamily: "'Meera', sans-serif" }}>{d.label}</span>
            </button>
          ))}
        </div>

        <div className="text-[9px] uppercase tracking-widest text-[#6e6e73] mb-2 ml-1">Tests</div>
        <div className="flex flex-col gap-1">
          {deptTests.map(test => {
            const papers = Array.from({ length: test.papers }, (_, i) => i + 1);
            const dept = DEPTS.find(d => d.id === test.dept);
            const color = dept?.color || '#2997ff';
            return (
              <div key={test.id}>
                <div className="text-[12px] text-white/60 px-2 py-1.5 font-semibold leading-tight" style={{ fontFamily: "'Meera', sans-serif" }}>
                  {test.name_ml}
                </div>
                <div className="flex flex-wrap gap-1 px-2 mb-1">
                  {papers.map(p => {
                    const count = qCounts[`${test.id}_${p}`] || 0;
                    const active = selectedTest?.id === test.id && selectedPaper === p;
                    return (
                      <button key={p}
                        onClick={() => selectTest(test, p)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold border-none cursor-pointer transition-all"
                        style={{
                          background: active ? color + '30' : 'rgba(255,255,255,0.06)',
                          color: active ? color : count > 0 ? '#30d158' : 'rgba(255,255,255,0.35)',
                          outline: active ? `1px solid ${color}40` : 'none',
                        }}>
                        P{p} {count > 0 ? `(${count})` : ''}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 min-w-0">
        {!selectedTest ? (
          <div className="flex items-center justify-center h-64 text-[#6e6e73] text-sm">
            ← ഒരു ടെസ്റ്റ് paper തിരഞ്ഞെടുക്കുക
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-5">
              <div className="text-lg font-bold leading-tight" style={{ fontFamily: "'Meera', sans-serif" }}>{selectedTest.name_ml}</div>
              <div className="text-xs text-[#6e6e73]">Paper {selectedPaper} — {questions.length} questions</div>
            </div>

            {/* CSV Import Panel */}
            {showImport && (
              <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-5 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base">CSV Bulk Import</h3>
                  <button onClick={downloadTemplate}
                    className="text-[11px] px-3 py-1.5 bg-white/5 text-[#2997ff] rounded-lg border-none cursor-pointer hover:bg-white/10 transition-all">
                    ⬇ Template Download
                  </button>
                </div>

                <div className="text-[11px] text-[#6e6e73] mb-3">
                  CSV columns: <span className="text-white/50">question, option_a, option_b, option_c, option_d, correct_answer (a/b/c/d), explanation (optional)</span>
                </div>

                <input
                  ref={fileRef}
                  type="file" accept=".csv"
                  onChange={handleFileChange}
                  className="w-full text-sm text-white/60 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#2997ff] file:text-white file:cursor-pointer cursor-pointer mb-3"
                />

                {csvError && (
                  <div className="text-[12px] text-[#ff453a] bg-[#ff453a]/10 px-3 py-2 rounded-lg mb-3">{csvError}</div>
                )}

                {importResult && (
                  <div className="text-[12px] px-3 py-2 rounded-lg mb-3"
                    style={{ background: importResult.failed ? '#ff9f0a20' : '#30d15820', color: importResult.failed ? '#ff9f0a' : '#30d158' }}>
                    {importResult.inserted} ചോദ്യങ്ങൾ import ചെയ്തു{importResult.failed ? `, ${importResult.failed} failed` : ' ✓'}
                  </div>
                )}

                {csvPreview.length > 0 && (
                  <>
                    <div className="text-[11px] font-black uppercase tracking-widest text-[#6e6e73] mb-2">
                      Preview — {csvPreview.length} questions
                    </div>
                    <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto mb-4">
                      {csvPreview.map((q, i) => (
                        <div key={i} className="bg-white/[0.04] rounded-xl px-4 py-2.5">
                          <div className="text-[12px] font-semibold text-white/80 mb-1">{i + 1}. {q.question}</div>
                          <div className="flex gap-3 text-[10px] text-white/40">
                            {['a', 'b', 'c', 'd'].map(opt => (
                              <span key={opt} style={{ color: q.correct_answer === opt ? '#30d158' : undefined }}>
                                {opt.toUpperCase()}. {q[`option_${opt}`]}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={handleImport} disabled={importing}
                      className="w-full py-3 bg-[#30d158] text-white rounded-xl text-sm font-bold border-none cursor-pointer hover:bg-[#28b34a] disabled:opacity-50 transition-all">
                      {importing ? 'Import ചെയ്യുന്നു...' : `${csvPreview.length} ചോദ്യങ്ങൾ Import ചെയ്യുക`}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Manual add/edit form */}
            {showForm && (
              <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-5 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base">{editId ? 'ചോദ്യം എഡിറ്റ്' : 'പുതിയ ചോദ്യം'}</h3>
                  <button onClick={() => setShowForm(false)} className="text-[#6e6e73] hover:text-white border-none bg-transparent cursor-pointer text-xl">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#6e6e73] mb-1">Question *</label>
                    <textarea required rows={2} value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                      placeholder="ചോദ്യം ഇവിടെ ടൈപ്പ് ചെയ്യുക..." className={inp + ' resize-y'} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['a', 'b', 'c', 'd'].map(opt => (
                      <div key={opt}>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#6e6e73] mb-1">Option {opt.toUpperCase()} *</label>
                        <input required value={form[`option_${opt}`]} onChange={e => setForm(f => ({ ...f, [`option_${opt}`]: e.target.value }))}
                          placeholder={`Option ${opt.toUpperCase()}`} className={inp} />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[#6e6e73] mb-1">Correct Answer *</label>
                      <select value={form.correct_answer} onChange={e => setForm(f => ({ ...f, correct_answer: e.target.value }))} className={inp}>
                        {['a', 'b', 'c', 'd'].map(o => <option key={o} value={o}>Option {o.toUpperCase()}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[#6e6e73] mb-1">Sort Order</label>
                      <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} className={inp} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#6e6e73] mb-1">Explanation (optional)</label>
                    <textarea rows={2} value={form.explanation} onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))}
                      placeholder="ഉത്തരത്തിന്റെ വിശദീകരണം..." className={inp + ' resize-y'} />
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button type="submit" disabled={saving}
                      className="flex-1 py-2.5 bg-[#2997ff] text-white rounded-xl text-sm font-bold hover:bg-[#0077ed] disabled:opacity-50 border-none cursor-pointer transition-all">
                      {saving ? 'Saving...' : editId ? 'Update' : 'Add Question'}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)}
                      className="px-5 py-2.5 bg-white/5 text-[#86868b] rounded-xl text-sm font-bold hover:text-white border-none cursor-pointer transition-all">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Questions list */}
            {loading ? (
              <div className="text-center text-[#6e6e73] py-12">Loading...</div>
            ) : questions.length === 0 ? (
              <div className="text-center text-[#6e6e73] py-12 bg-[#111] rounded-2xl border border-white/[0.08]">
                <div className="text-4xl mb-2">📭</div>
                <div>ഇതുവരെ ചോദ്യങ്ങൾ ഇല്ല</div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {questions.map((q, i) => (
                  <div key={q.id} className="bg-[#111] border border-white/[0.08] rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-[#6e6e73] text-sm font-black w-6 flex-shrink-0">{i + 1}.</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white/80 mb-2">{q.question}</div>
                        <div className="grid grid-cols-2 gap-1.5 mb-2">
                          {['a', 'b', 'c', 'd'].map(opt => (
                            <div key={opt} className="text-[11px] px-2 py-1 rounded-lg"
                              style={q.correct_answer === opt
                                ? { background: 'rgba(48,209,88,0.12)', color: '#30d158' }
                                : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)' }
                              }>
                              <span className="font-black">{opt.toUpperCase()}.</span> {q[`option_${opt}`]}
                            </div>
                          ))}
                        </div>
                        {q.explanation && <div className="text-[11px] text-[#6e6e73] italic">💡 {q.explanation}</div>}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => { setForm({ question: q.question, option_a: q.option_a, option_b: q.option_b, option_c: q.option_c, option_d: q.option_d, correct_answer: q.correct_answer, explanation: q.explanation || '', sort_order: q.sort_order || 0 }); setEditId(q.id); setShowForm(true); setShowImport(false); }}
                          className="px-2.5 py-1.5 bg-white/5 rounded-lg text-xs text-[#86868b] hover:text-white border-none cursor-pointer transition-all">Edit</button>
                        <button onClick={() => handleDelete(q.id)}
                          className="px-2.5 py-1.5 bg-[#ff453a]/10 rounded-lg text-xs text-[#ff453a] hover:bg-[#ff453a]/20 border-none cursor-pointer transition-all">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Buttons at bottom */}
            {!showForm && (
              <div className="mt-6 flex flex-col gap-3">
                <button onClick={() => { setForm(EMPTY_Q); setEditId(null); setShowForm(true); setShowImport(false); }}
                  className="w-full py-4 bg-[#2997ff] text-white rounded-2xl text-sm font-bold hover:bg-[#0077ed] transition-all border-none cursor-pointer">
                  + ചോദ്യം ചേർക്കുക
                </button>
                <button
                  onClick={() => { setShowImport(v => !v); setShowForm(false); setCsvPreview([]); setCsvError(''); setImportResult(null); }}
                  className="w-full py-4 rounded-2xl text-sm font-bold border-none cursor-pointer transition-all"
                  style={{ background: showImport ? '#30d15825' : 'rgba(255,255,255,0.06)', color: showImport ? '#30d158' : 'rgba(255,255,255,0.6)' }}>
                  📥 CSV Bulk Import
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
