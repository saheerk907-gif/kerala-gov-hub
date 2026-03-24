'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import SectionHeader from '@/components/SectionHeader';
import AnimatedNumber from '@/components/AnimatedNumber';

// ─── DA G.O. Data ───────────────────────────────────────────────
const GO_ORDERS = [
  { effectiveYM: '2021-01', totalDA: 9,  paidFromYM: '2024-04', go: 'G.O.(P)No.17/2024 dt.12/03/2024' },
  { effectiveYM: '2021-07', totalDA: 12, paidFromYM: '2024-10', go: 'G.O.(P)No.91/2024 dt.26/10/2024' },
  { effectiveYM: '2022-01', totalDA: 15, paidFromYM: '2025-04', go: 'G.O.(P)No.29/2025 dt.20/03/2025' },
  { effectiveYM: '2022-07', totalDA: 18, paidFromYM: '2025-08', go: 'G.O.(P)No.105/2025 dt.25/08/2025' },
  { effectiveYM: '2023-01', totalDA: 22, paidFromYM: '2025-10', go: 'G.O.(P)No.135/2025 dt.30/10/2025' },
  { effectiveYM: '2023-07', totalDA: 25, paidFromYM: '2026-02', go: 'G.O.(P)No.15/2026 dt.04/02/2026'  },
  { effectiveYM: '2024-01', totalDA: 28, paidFromYM: '2026-03', go: 'G.O.(P)No.27/2026 dt.20/02/2026'  },
  { effectiveYM: '2024-07', totalDA: 31, paidFromYM: '2026-03', go: 'G.O.(P)No.27/2026 dt.20/02/2026'  },
  { effectiveYM: '2025-01', totalDA: 33, paidFromYM: '2026-03', go: 'G.O.(P)No.27/2026 dt.20/02/2026'  },
  { effectiveYM: '2025-07', totalDA: 35, paidFromYM: '2026-03', go: 'G.O.(P)No.27/2026 dt.20/02/2026'  },
];

function getDaDue(ym) {
  let rate = 7;
  for (const o of GO_ORDERS) { if (ym >= o.effectiveYM) rate = o.totalDA; }
  return rate;
}
function getDaPaid(ym) {
  if (ym < '2021-03') return 0;
  if (ym < '2024-04') return 7;
  if (ym < '2024-10') return 9;
  if (ym < '2025-04') return 12;
  if (ym < '2025-08') return 15;
  if (ym < '2025-10') return 18;
  if (ym < '2026-02') return 22;
  if (ym < '2026-03') return 25;
  return 35;
}
function monthRange(from, to) {
  const [fy, fm] = from.split('-').map(Number);
  const [ty, tm] = to.split('-').map(Number);
  const list = []; let y = fy, m = fm;
  while (y < ty || (y === ty && m <= tm)) {
    list.push(`${y}-${String(m).padStart(2, '0')}`);
    if (++m > 12) { m = 1; y++; }
  }
  return list;
}
function mLabel(ym) {
  const [y, m] = ym.split('-');
  return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m - 1] + ' ' + y;
}
function inr(n) { return '₹' + Math.round(n).toLocaleString('en-IN'); }

const EMPTY_EMP = { name: '', desig: '', dept: '', pen: '', doj: '' };
const EMPTY_PAY = { from: '2021-03', to: '2026-03', basic: '' };

const inputCls = 'bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#ff9f0a]/50 focus:bg-white/[0.09] transition-all w-full';
const labelCls = 'block text-[9px] font-black uppercase tracking-[0.18em] text-white/55 mb-1.5';

export default function DArrearCalculator() {
  const [emp, setEmp]         = useState(EMPTY_EMP);
  const [pay, setPay]         = useState(EMPTY_PAY);
  const [dojHint, setDojHint] = useState('Arrear starts from March 2021 (default)');
  const [payRows, setPayRows] = useState([]);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState('');
  const [animKey, setAnimKey] = useState(0);
  const prevResultNull = useRef(true);
  useEffect(() => {
    const wasNull = prevResultNull.current;
    prevResultNull.current = result === null;
    if (wasNull && result !== null) setAnimKey(k => k + 1);
  }, [result]);

  const handleDOJ = (doj) => {
    const newEmp = { ...emp, doj };
    setEmp(newEmp);
    if (!doj) {
      setPay(p => ({ ...p, from: '2021-03' }));
      setDojHint('Arrear starts from March 2021 (default)');
      return;
    }
    const joiningYM = doj.substring(0, 7);
    if (joiningYM > '2021-03') {
      setPay(p => ({ ...p, from: joiningYM }));
      setDojHint(`Arrear starts from ${mLabel(joiningYM)} (joining month)`);
    } else {
      setPay(p => ({ ...p, from: '2021-03' }));
      setDojHint('Arrear starts from March 2021 (joined before Mar 2021)');
    }
  };

  const addPayRow = () =>
    setPayRows(r => [...r, { id: Date.now(), type: 'increment', month: '', basic: '' }]);
  const delPayRow = (id) => setPayRows(r => r.filter(x => x.id !== id));
  const updateRow = (id, field, val) =>
    setPayRows(r => r.map(x => x.id === id ? { ...x, [field]: val } : x));

  const buildGetBasic = useCallback((initialBasic, from) => {
    const changes = payRows
      .filter(r => r.month && parseFloat(r.basic) > 0 && r.month >= from)
      .map(r => ({ ym: r.month, basic: parseFloat(r.basic) }))
      .sort((a, b) => a.ym.localeCompare(b.ym));
    const schedule = [{ ym: from, basic: initialBasic }, ...changes];
    return (ym) => {
      let cur = initialBasic;
      for (const s of schedule) { if (ym >= s.ym) cur = s.basic; else break; }
      return cur;
    };
  }, [payRows]);

  const calculate = () => {
    setError('');
    const initialBasic = parseFloat(pay.basic);
    if (!initialBasic || initialBasic <= 0) { setError('Please enter a valid initial Basic Pay.'); return; }
    if (!pay.from || !pay.to) { setError('Please select From and To months.'); return; }
    if (pay.from > pay.to) { setError('"From" must be on or before "To".'); return; }

    const getBasic = buildGetBasic(initialBasic, pay.from);
    const months   = monthRange(pay.from, pay.to);

    const payChangeMap = {};
    payRows.forEach(r => { if (r.month && r.basic) payChangeMap[r.month] = { basic: parseFloat(r.basic), type: r.type }; });

    const rows = [];
    let totalDue = 0, totalPaid = 0, totalArrear = 0;
    let prevDuePct = null, prevPaidPct = null, prevBasic = null;

    months.forEach(ym => {
      const basic   = getBasic(ym);
      const duePct  = getDaDue(ym);
      const paidPct = getDaPaid(ym);
      const daDue   = basic * duePct  / 100;
      const daPaid  = basic * paidPct / 100;
      const arrear  = daDue - daPaid;

      if (basic !== prevBasic && prevBasic !== null) {
        const info = payChangeMap[ym];
        const tl = info ? ({ increment:'Annual Increment', promotion:'Promotion', tbhg:'TBHG', other:'Pay Change' }[info.type] || 'Pay Change') : 'Pay Change';
        rows.push({ type: 'paychange', label: `${tl} — New Basic: ${inr(basic)} (effective ${mLabel(ym)})` });
      }
      if (duePct !== prevDuePct || paidPct !== prevPaidPct) {
        rows.push({ type: 'ratehdr', duePct, paidPct, basic });
        prevDuePct = duePct; prevPaidPct = paidPct;
      }
      prevBasic = basic;
      totalDue    += daDue;
      totalPaid   += daPaid;
      totalArrear += arrear;
      rows.push({ type: 'data', ym, basic, duePct, paidPct, daDue, daPaid, arrear });
    });

    setResult({
      rows, totalDue, totalPaid, totalArrear,
      months: months.length, from: pay.from, to: pay.to,
      initialBasic, emp: { ...emp },
    });
  };

  const reset = () => {
    setEmp(EMPTY_EMP); setPay(EMPTY_PAY);
    setPayRows([]); setResult(null); setError('');
    setDojHint('Arrear starts from March 2021 (default)');
  };

  const copyText = () => {
    if (!result) return;
    const text =
      `DA Arrear Statement — Kerala 11th PRC\n` +
      `${'─'.repeat(40)}\n` +
      (result.emp.name  ? `Name      : ${result.emp.name}\n`  : '') +
      (result.emp.pen   ? `PEN       : ${result.emp.pen}\n`   : '') +
      `Basic Pay : ${inr(result.initialBasic)}\n` +
      `Period    : ${mLabel(result.from)} → ${mLabel(result.to)} (${result.months} months)\n` +
      `${'─'.repeat(40)}\n` +
      `DA Due    : ${inr(result.totalDue)}\n` +
      `DA Paid   : ${inr(result.totalPaid)}\n` +
      `NET ARREAR: ${inr(result.totalArrear)}\n` +
      `${'─'.repeat(40)}\n` +
      `Kerala Finance Dept G.O.s · 11th PRC`;
    navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!')).catch(() => {});
  };

  const shareWhatsApp = () => {
    if (!result) return;
    const msg =
      `*DA Arrear Statement — Kerala 11th PRC*\n\n` +
      (result.emp.name ? `👤 ${result.emp.name}\n` : '') +
      (result.emp.pen  ? `🔢 PEN: ${result.emp.pen}\n` : '') +
      `💰 Basic Pay: ${inr(result.initialBasic)}\n` +
      `📅 ${mLabel(result.from)} → ${mLabel(result.to)} (${result.months} months)\n\n` +
      `DA Due: ${inr(result.totalDue)}\nDA Paid: ${inr(result.totalPaid)}\n` +
      `*Net Arrear: ${inr(result.totalArrear)}*\n\n` +
      `_Kerala 11th PRC · finance.kerala.gov.in_`;
    if (navigator.share) { navigator.share({ text: msg }).catch(() => {}); return; }
    window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* G.O. tags strip */}
      <div className="flex flex-wrap gap-2">
        {GO_ORDERS.slice(-4).map(o => (
          <span key={o.go} className="text-[9px] font-bold px-2.5 py-1 rounded-full text-white/55 bg-white/[0.05] border border-white/[0.08]">
            {o.go}
          </span>
        ))}
      </div>

      {!result ? (
        /* ══════════════ INPUT FORM ══════════════ */
        <div className="space-y-6">

          {/* Pay Details */}
          <div className="glass-card rounded-2xl p-6">
            <SectionHeader title="Pay Details" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Initial Basic Pay (₹)</label>
                <input type="number" className={inputCls} value={pay.basic} onChange={e => setPay(x => ({ ...x, basic: e.target.value }))} placeholder="e.g. 35700" min="0" />
                <p className="text-[10px] text-white/50 mt-1">Basic pay at arrear start (11th PRC)</p>
              </div>
              <div>
                <label className={labelCls}>Arrear From</label>
                <input type="month" className={inputCls} value={pay.from} onChange={e => setPay(x => ({ ...x, from: e.target.value }))} />
                <p className="text-[10px] text-white/50 mt-1">Default: Mar 2021</p>
              </div>
              <div>
                <label className={labelCls}>Arrear To</label>
                <input type="month" className={inputCls} value={pay.to} onChange={e => setPay(x => ({ ...x, to: e.target.value }))} />
                <p className="text-[10px] text-white/50 mt-1">Up to and including this month</p>
              </div>
            </div>
          </div>

          {/* Employee Details */}
          <div className="glass-card rounded-2xl p-6">
            <SectionHeader title="Employee Details" subtitle="Optional — for the arrear statement header" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className={labelCls}>Employee Name</label>
                <input className={inputCls} value={emp.name} onChange={e => setEmp(x => ({ ...x, name: e.target.value }))} placeholder="e.g. Rajan K.P." /></div>
              <div><label className={labelCls}>Designation</label>
                <input className={inputCls} value={emp.desig} onChange={e => setEmp(x => ({ ...x, desig: e.target.value }))} placeholder="e.g. Senior Clerk" /></div>
              <div><label className={labelCls}>Department / Office</label>
                <input className={inputCls} value={emp.dept} onChange={e => setEmp(x => ({ ...x, dept: e.target.value }))} placeholder="e.g. District Collectorate" /></div>
              <div><label className={labelCls}>PEN / Employee Code</label>
                <input className={inputCls} value={emp.pen} onChange={e => setEmp(x => ({ ...x, pen: e.target.value }))} placeholder="e.g. 123456" /></div>
              <div>
                <label className={labelCls}>Date of Joining</label>
                <input type="date" className={inputCls} value={emp.doj} onChange={e => handleDOJ(e.target.value)} />
                <p className="text-[10px] text-white/50 mt-1">Arrear start adjusts automatically</p>
              </div>
              <div className="flex items-end">
                <div className="w-full px-4 py-3 rounded-xl text-[12px] font-semibold leading-snug"
                  style={{ background: 'rgba(48,209,88,0.08)', border: '1px solid rgba(48,209,88,0.2)', color: 'rgba(48,209,88,0.9)' }}>
                  📅 {dojHint}
                </div>
              </div>
            </div>
          </div>

          {/* Increments & Promotions */}
          <div className="glass-card rounded-2xl p-6">
            <SectionHeader title="Increments & Promotions" subtitle="Optional — leave blank if basic never changed" />
            {payRows.length > 0 && (
              <div className="space-y-3 mb-4">
                {payRows.map(row => (
                  <div key={row.id} className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
                    <div>
                      <label className={labelCls}>Type</label>
                      <select className={inputCls} value={row.type} onChange={e => updateRow(row.id, 'type', e.target.value)}>
                        <option value="increment">Annual Increment</option>
                        <option value="promotion">Promotion</option>
                        <option value="tbhg">TBHG</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Effective Month</label>
                      <input type="month" className={inputCls} value={row.month} onChange={e => updateRow(row.id, 'month', e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>New Basic Pay (₹)</label>
                      <input type="number" className={inputCls} value={row.basic} onChange={e => updateRow(row.id, 'basic', e.target.value)} placeholder="e.g. 36800" />
                    </div>
                    <button onClick={() => delPayRow(row.id)} className="mb-0.5 w-9 h-10 flex items-center justify-center rounded-xl text-white/50 hover:text-[#ff453a] hover:bg-[#ff453a]/10 transition-all text-lg border border-white/[0.07]">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button onClick={addPayRow}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold text-white/50 hover:text-white/80 transition-all border border-dashed border-white/[0.12] hover:border-white/25 hover:bg-white/[0.04]">
              + Add Increment / Promotion
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl text-[12px] text-[#ff453a] font-semibold" style={{ background: 'rgba(255,69,58,0.08)', border: '1px solid rgba(255,69,58,0.2)' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <button onClick={calculate}
              className="px-8 py-3.5 rounded-full text-[14px] font-black uppercase tracking-wide text-white transition-all hover:scale-105 hover:shadow-[0_8px_30px_rgba(41,151,255,0.3)]"
              style={{ background: 'linear-gradient(135deg, #1a6abf, #2997ff)' }}>
              Calculate DA Arrear →
            </button>
            <button onClick={reset}
              className="px-6 py-3.5 glass-pill rounded-full text-[13px] font-bold text-white/50 hover:text-white/80 transition-all">
              ↺ Reset
            </button>
          </div>
        </div>
      ) : (
        /* ══════════════ RESULTS ══════════════ */
        <div className="space-y-5">

          {/* Banner */}
          <div className="rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center"
            style={{ background: 'linear-gradient(135deg, rgba(26,92,42,0.5), rgba(31,112,52,0.4))', border: '1px solid rgba(48,209,88,0.3)' }}>
            <div className="sm:col-span-2">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-2">Total DA Arrear Payable</div>
              <div className="text-[clamp(32px,6vw,52px)] font-[900] text-[#30d158] leading-none tracking-tight font-sans">
                <AnimatedNumber value={result.totalArrear} animKey={animKey} />
              </div>
              <div className="text-[12px] text-white/60 mt-2">{mLabel(result.from)} → {mLabel(result.to)}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Period</div>
              <div className="text-5xl font-[900] text-white/80 font-sans">{result.months}</div>
              <div className="text-[11px] text-white/55">months</div>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Initial Basic',   num: result.initialBasic, color: '#ff9f0a' },
              { label: 'Total DA Due',    num: result.totalDue,     color: '#30d158' },
              { label: 'DA Already Paid', num: result.totalPaid,    color: '#ff453a' },
              { label: 'Net Arrear',      num: result.totalArrear,  color: '#ff9f0a' },
            ].map(s => (
              <div key={s.label} className="glass-card rounded-xl p-4">
                <div className="text-[9px] font-black uppercase tracking-[0.15em] text-white/50 mb-2">{s.label}</div>
                <div className="text-[15px] font-[900] font-sans" style={{ color: s.color }}>
                  <AnimatedNumber value={s.num} animKey={animKey} />
                </div>
              </div>
            ))}
          </div>

          {/* Employee info */}
          {(result.emp.name || result.emp.pen || result.emp.dept) && (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-2"><span>👤</span><span className="text-[12px] font-bold text-white/60">Employee Information</span></div>
              <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3 text-[12px]">
                {[
                  ['Name', result.emp.name], ['Designation', result.emp.desig],
                  ['Department', result.emp.dept], ['PEN', result.emp.pen],
                  ['Date of Joining', result.emp.doj], ['Arrear Period', `${mLabel(result.from)} → ${mLabel(result.to)}`],
                ].map(([l, v]) => v ? (
                  <div key={l}><span className="text-white/50 text-[10px] uppercase tracking-wider">{l}</span><div className="text-white/75 font-semibold mt-0.5">{v}</div></div>
                ) : null)}
              </div>
            </div>
          )}

          {/* Month-wise table */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center gap-2">
              <span>📊</span>
              <span className="text-[13px] font-bold text-white/75">Month-wise DA Arrear Breakup</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px] min-w-[640px]">
                <thead>
                  <tr style={{ background: 'var(--surface-xs)', borderBottom: '1px solid var(--surface-sm)' }}>
                    {['Month','Basic Pay','DA Due %','DA Due (₹)','DA Paid %','DA Paid (₹)','Arrear (₹)'].map(h => (
                      <th key={h} className={`py-3 px-4 text-[9px] font-black uppercase tracking-widest text-white/55 ${h === 'Month' ? 'text-left' : 'text-right'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, i) => {
                    if (row.type === 'paychange') return (
                      <tr key={i} style={{ background: 'rgba(255,159,10,0.08)', borderTop: '1px dashed rgba(255,159,10,0.25)' }}>
                        <td colSpan={7} className="py-2.5 px-4 text-[11px] font-bold text-[#ff9f0a]">⬆ {row.label}</td>
                      </tr>
                    );
                    if (row.type === 'ratehdr') return (
                      <tr key={i} style={{ background: 'rgba(41,151,255,0.07)', borderTop: '1px solid rgba(41,151,255,0.2)' }}>
                        <td colSpan={7} className="py-2 px-4 text-[11px] font-bold text-white/50">
                          DA Due: <span className="text-[#2997ff]">{row.duePct}%</span>
                          &ensp;|&ensp;Paid: <span className="text-white/60">{row.paidPct}%</span>
                          &ensp;|&ensp;Arrear Rate: <span className="text-[#30d158]">{row.duePct - row.paidPct}%</span>
                          <span className="text-white/50"> = {inr(row.basic * (row.duePct - row.paidPct) / 100)}/month</span>
                        </td>
                      </tr>
                    );
                    const arr = row.arrear;
                    return (
                      <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                        <td className="py-2.5 px-4 text-white/70 font-medium">{mLabel(row.ym)}</td>
                        <td className="py-2.5 px-4 text-right text-white/60 font-sans">{Math.round(row.basic).toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-4 text-right text-white/60">{row.duePct}%</td>
                        <td className="py-2.5 px-4 text-right text-[#30d158]/80 font-sans">{Math.round(row.daDue).toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-4 text-right text-white/60">{row.paidPct}%</td>
                        <td className="py-2.5 px-4 text-right text-[#ff453a]/70 font-sans">{Math.round(row.daPaid).toLocaleString('en-IN')}</td>
                        <td className={`py-2.5 px-4 text-right font-black font-sans ${arr > 0 ? 'text-[#30d158]' : arr < 0 ? 'text-[#ff453a]' : 'text-white/45'}`}>
                          {Math.round(arr).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Grand total */}
                  <tr style={{ background: 'rgba(255,159,10,0.08)', borderTop: '2px solid rgba(255,159,10,0.3)' }}>
                    <td className="py-3 px-4 text-[12px] font-black text-white/80">TOTAL ({result.months} months)</td>
                    <td colSpan={2} className="py-3 px-4 text-right text-white/45">—</td>
                    <td className="py-3 px-4 text-right font-black text-[#30d158] font-sans">{Math.round(result.totalDue).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-right text-white/45">—</td>
                    <td className="py-3 px-4 text-right font-black text-[#ff453a] font-sans">{Math.round(result.totalPaid).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-right font-black text-[#ff9f0a] text-[14px] font-sans">{Math.round(result.totalArrear).toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-white/[0.05]">
              <p className="text-[10px] text-white/45 leading-relaxed">
                * DA rates as per Kerala Finance Dept G.O.s — 11th Pay Revision (w.e.f 01/07/2019). Jul 2019–Feb 2021 DA fully settled via G.O.(P)No.27/2021. Latest: G.O.(P)No.27/2026/Fin dt.20/02/2026. Verify before official disbursement. Income Tax not included.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button onClick={shareWhatsApp}
              className="flex items-center gap-2 px-5 py-3 rounded-full text-[13px] font-bold text-white transition-all hover:scale-105"
              style={{ background: 'rgba(37,211,102,0.2)', border: '1px solid rgba(37,211,102,0.3)' }}>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Share on WhatsApp
            </button>
            <button onClick={copyText}
              className="flex items-center gap-2 px-5 py-3 rounded-full text-[13px] font-bold text-white/70 hover:text-white transition-all glass-pill hover:border-white/25">
              📋 Copy Summary
            </button>
            <button onClick={() => setResult(null)}
              className="flex items-center gap-2 px-5 py-3 rounded-full text-[13px] font-bold text-white/50 hover:text-white/80 transition-all glass-pill">
              ← Edit Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
