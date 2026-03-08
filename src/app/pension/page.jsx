'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// ─── Retirement date helpers ───────────────────────────────────────────────────
function lastDayOfMonth(year, month) {          // month: 1-based
  return new Date(year, month, 0).getDate();
}

function getRetirementDate(dob, retirementType) {
  if (!dob.day || !dob.month || !dob.year) return null;
  const d = parseInt(dob.day), m = parseInt(dob.month), y = parseInt(dob.year);

  if (retirementType === 'S') {
    // Superannuation: end of academic term after turning 56
    const yr56 = y + 56;
    const yr57 = y + 57;
    if (m > 5)       return { day: 31, month: 3,  year: yr57 };
    else if (m > 3)  return { day: 31, month: 5,  year: yr56 };
    else             return { day: 31, month: 3,  year: yr56 };
  }

  // Pension / Invalid / Voluntary: last day of birth-month at age 56
  const retYear  = y + 56;
  let   retDay   = lastDayOfMonth(retYear, m);
  let   retMonth = m;
  // If born on 1st, retire on last day of previous month
  if (d === 1) {
    retMonth = m === 1 ? 12 : m - 1;
    const retYearAdj = m === 1 ? retYear - 1 : retYear;
    retDay = lastDayOfMonth(retYearAdj, retMonth);
    return { day: retDay, month: retMonth, year: retYearAdj };
  }
  return { day: retDay, month: retMonth, year: retYear };
}

function getRestoreDate(retDate) {
  if (!retDate) return null;
  return { day: retDate.day, month: retDate.month, year: retDate.year + 12 };
}

function fmtDate(d) {
  if (!d) return '';
  return `${String(d.day).padStart(2,'0')}/${String(d.month).padStart(2,'0')}/${d.year}`;
}

// ─── Pension formulas (matches PRISM / KSR Part III) ─────────────────────────
// Basic Pension   = (50% × AE / 30) × QS   [QS in years]
//                 = (AE × QS) / 60
// Family Pension  = 30% of last emoluments  [min ₹4,500 / max ₹17,960]
// DCRG            = (lastEmoluments / 2) × QS  [max ₹14,00,000]
// Commuted amount = (commutePct% × pension)  [monthly, max 40%]
// Commuted value  = commuted × 11.10 × 12   [lump sum, factor for age 56]
// Reduced pension = pension − commuted amount
const COMMUTATION_FACTOR = 11.10;

function calculate({ avgEmoluments, lastEmoluments, qualifyingService, commutePct }) {
  if (!avgEmoluments || !qualifyingService) return null;

  const qs      = parseFloat(qualifyingService) || 0;
  const ae      = parseFloat(avgEmoluments)     || 0;
  const le      = parseFloat(lastEmoluments)    || ae;
  const cpct    = Math.min(parseFloat(commutePct) || 0, 40);

  const pension = Math.round((0.5 * ae / 30) * qs);

  let familyPension = Math.round(0.30 * le);
  if (familyPension > 17960) familyPension = 17960;
  if (familyPension < 4500)  familyPension = 4500;

  let dcrg = Math.round((le / 2) * qs);
  if (dcrg > 1400000) dcrg = 1400000;

  const commutedAmt   = cpct > 0 ? Math.round((cpct / 100) * pension) : 0;
  const commutedValue = cpct > 0 ? Math.round(commutedAmt * COMMUTATION_FACTOR * 12) : 0;
  const reducedPension = pension - commutedAmt;

  return { pension, familyPension, dcrg, commutedAmt, commutedValue, reducedPension };
}

// ─── UI atoms ─────────────────────────────────────────────────────────────────
const GLASS = {
  input:    { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' },
  output:   { background: 'rgba(41,151,255,0.07)',  border: '1px solid rgba(41,151,255,0.18)',  color: '#fff' },
  disabled: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)' },
};

const inputClass = 'w-full rounded-xl px-4 py-2.5 text-[14px] font-semibold outline-none focus:ring-1 focus:ring-white/20 transition-all';

function Label({ children, sub }) {
  return (
    <label className="block text-[13px] font-bold text-white/70 mb-1.5" style={{ fontFamily: "'Meera', sans-serif" }}>
      {children}
      {sub && <span className="text-[10px] text-white/30 font-normal ml-1">{sub}</span>}
    </label>
  );
}

function Field({ label, sub, children }) {
  return (
    <div>
      <Label sub={sub}>{label}</Label>
      {children}
    </div>
  );
}

function OutputField({ label, value, highlight }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className={`${inputClass} font-black text-[15px]`}
        style={highlight ? GLASS.output : GLASS.disabled}>
        {value || '—'}
      </div>
    </div>
  );
}

const fmt = n => n != null ? Math.round(n).toLocaleString('en-IN') : '';

// ─── Main component ────────────────────────────────────────────────────────────
const DAYS   = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const YEARS  = Array.from({ length: 70  }, (_, i) => 1941 + i);

export default function PensionPage() {
  const [retType,   setRetType]   = useState('P');
  const [dob,       setDob]       = useState({ day: '', month: '', year: '' });
  const [qs,        setQs]        = useState('');
  const [avgEmol,   setAvgEmol]   = useState('');
  const [lastEmol,  setLastEmol]  = useState('');
  const [commutePct, setCommutePct] = useState('');

  const [retDate,   setRetDate]   = useState(null);
  const [restDate,  setRestDate]  = useState(null);
  const [result,    setResult]    = useState(null);

  const recalc = useCallback(() => {
    const rd = getRetirementDate(dob, retType);
    setRetDate(rd);
    setRestDate(getRestoreDate(rd));
    setResult(calculate({ avgEmoluments: avgEmol, lastEmoluments: lastEmol, qualifyingService: qs, commutePct }));
  }, [dob, retType, qs, avgEmol, lastEmol, commutePct]);

  useEffect(() => { recalc(); }, [recalc]);

  const clear = () => {
    setRetType('P');
    setDob({ day: '', month: '', year: '' });
    setQs(''); setAvgEmol(''); setLastEmol(''); setCommutePct('');
  };

  const dobSet = f => v => setDob(p => ({ ...p, [f]: v }));

  const numInput = (value, setter, max) => (
    <input type="number" value={value} min={0} max={max}
      onChange={e => setter(e.target.value)}
      className={inputClass} style={GLASS.input} />
  );

  return (
    <div className="relative min-h-screen bg-aurora overflow-x-hidden">
      <div className="max-w-[960px] mx-auto px-4 pt-[100px] pb-16">

        {/* Header */}
        <div className="mb-8">
          <Link href="/"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/30 hover:text-white/60 no-underline transition-colors mb-3">
            ← Back to Home
          </Link>
          <div className="text-[10px] font-black uppercase tracking-widest text-white/25 mb-2">Kerala Service Rules — Part III</div>
          <h1 className="text-[clamp(22px,4vw,40px)] font-[900] tracking-[-0.03em] text-white leading-tight"
            style={{ fontFamily: "'Meera', sans-serif" }}>
            പെൻഷൻ Calculator
          </h1>
          <p className="text-[12px] text-white/30 mt-1">
            Basic Pension · Family Pension · DCRG · Commutation Value
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-6 md:p-8"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">

            {/* ── LEFT COLUMN: Inputs ──────────────────────────────────── */}
            <div className="flex flex-col gap-5">

              {/* Type of Retirement */}
              <Field label="Type of Retirement">
                <select value={retType} onChange={e => setRetType(e.target.value)}
                  className={inputClass} style={GLASS.input}>
                  <option value="P">Pension</option>
                  <option value="S">Superannuation</option>
                  <option value="I">Invalid</option>
                  <option value="V">Voluntary</option>
                </select>
              </Field>

              {/* Date of Birth */}
              <Field label="Date of Birth">
                <div className="grid grid-cols-3 gap-2">
                  <select value={dob.day} onChange={e => dobSet('day')(e.target.value)}
                    className={inputClass} style={GLASS.input}>
                    <option value="">Day</option>
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select value={dob.month} onChange={e => dobSet('month')(e.target.value)}
                    className={inputClass} style={GLASS.input}>
                    <option value="">Month</option>
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select value={dob.year} onChange={e => dobSet('year')(e.target.value)}
                    className={inputClass} style={GLASS.input}>
                    <option value="">Year</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </Field>

              {/* Total Qualifying Service */}
              <Field label="Total Qualifying Service" sub="(Years)">
                {numInput(qs, setQs, 33)}
              </Field>

              {/* Average Emoluments */}
              <Field label="Average Emoluments" sub="( Last Ten Months Salary Divided By Ten )">
                {numInput(avgEmol, setAvgEmol, 999999)}
              </Field>

              {/* Last Month Emoluments */}
              <Field label="Last Month Emoluments" sub="(Pay + DA)">
                {numInput(lastEmol, setLastEmol, 999999)}
              </Field>

              {/* Commutation % */}
              <Field label="Percentage of Pension to be Commuted" sub="(e.g. 20 , Maximum 40%)">
                {numInput(commutePct, setCommutePct, 40)}
              </Field>
            </div>

            {/* ── RIGHT COLUMN: Outputs ────────────────────────────────── */}
            <div className="flex flex-col gap-5">

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <OutputField label="Date of Retirement" value={fmtDate(retDate)} />
                <OutputField label="Date of Restore"    value={fmtDate(restDate)} />
              </div>

              {/* Basic + Reduced */}
              <div className="grid grid-cols-2 gap-4">
                <OutputField label="Basic Pension (Rs.)"   value={fmt(result?.pension)}        highlight={!!result?.pension} />
                <OutputField label="Reduced Pension (Rs.)" value={fmt(result?.reducedPension)}  highlight={!!result?.reducedPension} />
              </div>

              {/* Family Pension */}
              <OutputField label="Normal Family Pension (Rs.)" value={fmt(result?.familyPension)} highlight={!!result?.familyPension} />

              {/* DCRG */}
              <OutputField label="DCRG (Rs.)" value={fmt(result?.dcrg)} highlight={!!result?.dcrg} />

              {/* Commuted + Commuted Value */}
              <div className="grid grid-cols-2 gap-4">
                <OutputField label="Pension Commuted (Rs.)" value={fmt(result?.commutedAmt)}   highlight={!!result?.commutedAmt} />
                <OutputField label="Commuted Value (Rs.)"   value={fmt(result?.commutedValue)} highlight={!!result?.commutedValue} />
              </div>

              {/* Formula reference */}
              <div className="rounded-2xl p-4 mt-1" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">Formulas Used</div>
                {[
                  ['Basic Pension',   '(50% × AE ÷ 30) × QS'],
                  ['Family Pension',  '30% of Last Emoluments  [₹4,500 – ₹17,960]'],
                  ['DCRG',            '(Last Emoluments ÷ 2) × QS  [max ₹14L]'],
                  ['Commuted Value',  'Commuted Amt × 11.10 × 12'],
                  ['Date of Restore', 'Retirement Date + 12 years'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-[10px] py-0.5 gap-4">
                    <span className="text-white/28 flex-shrink-0">{k}</span>
                    <span className="text-white/40 text-right">{v}</span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-white/30 italic text-right" style={{ fontFamily: "'Meera', serif" }}>
                * Results are only indicators. Refer official codes for authenticity.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/"
              className="flex-1 sm:flex-none sm:min-w-[180px] text-center px-8 py-3.5 rounded-2xl text-[14px] font-black no-underline tracking-wide transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #2997ff, #0a84ff)', color: '#fff', boxShadow: '0 6px 24px rgba(41,151,255,0.3)' }}>
              HOME
            </Link>
            <button onClick={clear}
              className="flex-1 sm:flex-none sm:min-w-[180px] px-8 py-3.5 rounded-2xl text-[14px] font-black tracking-wide transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #ff9f0a, #ff6b00)', color: '#fff', boxShadow: '0 6px 24px rgba(255,159,10,0.3)' }}>
              CLEAR
            </button>
          </div>
        </div>

        {/* Guide link */}
        <div className="mt-6 text-center">
          <Link href="/pension-calculation"
            className="text-[12px] font-bold no-underline transition-colors"
            style={{ color: '#2997ff' }}>
            How is pension calculated? Step-by-step guide →
          </Link>
        </div>

      </div>
    </div>
  );
}
