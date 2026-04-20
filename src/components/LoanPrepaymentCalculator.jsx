'use client';
import { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

const GREEN = '#30d158';
const DIM   = 'rgba(255,255,255,0.50)';

function fmt(n) {
  if (!isFinite(n) || isNaN(n)) return '—';
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(2)} L`;
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

function ym(months) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} mo`;
  if (m === 0) return `${y} yr`;
  return `${y} yr ${m} mo`;
}

/* ── Amortization engine ─────────────────────────────────────────────── */
function calcSchedule(principal, annualRate, tenureMonths, elapsedMonths, prepayments, extraMonthly) {
  const r = annualRate / 100 / 12;
  const emi = r > 0
    ? principal * r * Math.pow(1 + r, tenureMonths) / (Math.pow(1 + r, tenureMonths) - 1)
    : principal / tenureMonths;

  // Walk forward to find balance after elapsed months (no prepayments on past)
  let startBalance = principal;
  let paidInterest  = 0;
  for (let m = 1; m <= elapsedMonths; m++) {
    const interest      = startBalance * r;
    const principalPart = Math.min(startBalance, Math.max(0, emi - interest));
    startBalance -= principalPart;
    paidInterest += interest;
  }

  // Build prepayment lookup (months are relative: 1 = next EMI from current)
  const prepMap = {};
  prepayments.forEach(p => {
    const m = Number(p.month);
    const a = Number(p.amount);
    if (m > 0 && a > 0) prepMap[m] = (prepMap[m] || 0) + a;
  });

  let balance      = startBalance;
  let totalInterest = 0;
  const schedule   = [];
  const remaining  = tenureMonths - elapsedMonths;

  for (let m = 1; m <= remaining && balance > 0.5; m++) {
    const interest        = balance * r;
    const regularPrincipal = Math.min(balance, Math.max(0, emi - interest));
    balance -= regularPrincipal;
    totalInterest += interest;

    const lumpsum = Math.min(prepMap[m] || 0, balance);
    balance -= lumpsum;

    const extra = Math.min(extraMonthly, balance);
    balance -= extra;

    balance = Math.max(0, balance);

    schedule.push({
      month:    elapsedMonths + m,
      relMonth: m,
      emi:      Math.round(regularPrincipal + interest),
      interest: Math.round(interest),
      principal: Math.round(regularPrincipal),
      prepayment: Math.round(lumpsum + extra),
      balance:   Math.round(balance),
      cumInterest: Math.round(totalInterest),
    });
  }

  return { emi, schedule, totalInterest, months: schedule.length, startBalance, paidInterest };
}

/* ── Number + slider input ───────────────────────────────────────────── */
function NumSlider({ label, sub, value, min, max, step, onChange, prefix = '', suffix = '' }) {
  const [editing, setEditing] = useState(false);
  const [raw, setRaw]         = useState('');

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white/90 leading-snug">{label}</div>
          {sub && <div className="text-xs text-white/45 mt-0.5">{sub}</div>}
        </div>
        <div className="flex items-center rounded-lg px-3 py-1.5 shrink-0"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)' }}>
          {prefix && <span className="text-sm text-white/50 mr-1">{prefix}</span>}
          <input
            type="text" inputMode="numeric"
            value={editing ? raw : (suffix ? `${value}` : value.toLocaleString('en-IN'))}
            onFocus={() => { setEditing(true); setRaw(String(value)); }}
            onChange={e => setRaw(e.target.value)}
            onBlur={() => {
              setEditing(false);
              const v = parseFloat(String(raw).replace(/,/g, ''));
              if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
              setRaw('');
            }}
            onKeyDown={e => e.key === 'Enter' && e.target.blur()}
            className="bg-transparent outline-none text-sm font-bold tabular-nums text-right text-white"
            style={{ width: `${Math.max(String(value).length, 4) + 1}ch` }}
          />
          {suffix && <span className="text-sm text-white/50 ml-1">{suffix}</span>}
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={Math.min(value, max)}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: 'white' }}
      />
      <div className="flex justify-between text-xs text-white/30">
        <span>{prefix}{min.toLocaleString('en-IN')}{suffix}</span>
        <span>{prefix}{max.toLocaleString('en-IN')}{suffix}</span>
      </div>
    </div>
  );
}

/* ── Stat card ───────────────────────────────────────────────────────── */
function StatCard({ label, value, sub, highlight = false }) {
  return (
    <div className="rounded-xl p-4 flex flex-col gap-1.5"
      style={{
        background: highlight ? 'rgba(48,209,88,0.08)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${highlight ? 'rgba(48,209,88,0.25)' : 'rgba(255,255,255,0.10)'}`,
      }}>
      <div className="text-xs font-semibold uppercase tracking-wider text-white/45">{label}</div>
      <div className="text-xl font-bold tabular-nums leading-tight"
        style={{ color: highlight ? GREEN : 'white' }}>{value}</div>
      {sub && <div className="text-xs text-white/50 leading-snug">{sub}</div>}
    </div>
  );
}

/* ── Chart tooltip ───────────────────────────────────────────────────── */
function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl p-3 shadow-2xl"
      style={{ background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.12)' }}>
      <div className="text-xs text-white/50 mb-2">{payload[0]?.payload?.label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-sm text-white/70">{p.name}:</span>
          <span className="text-sm font-bold text-white">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Main calculator ─────────────────────────────────────────────────── */
export default function LoanPrepaymentCalculator() {
  /* Loan inputs */
  const [loanAmount,    setLoanAmount]    = useState(3000000);
  const [rate,          setRate]          = useState(8.5);
  const [tenureUnit,    setTenureUnit]    = useState('years'); // 'years' | 'months'
  const [tenureYears,   setTenureYears]   = useState(20);
  const [tenureMonthsRaw, setTenureMonthsRaw] = useState(240);
  const [elapsedMonths, setElapsedMonths] = useState(0);
  const [extraEMI,      setExtraEMI]      = useState(0);

  const tenureMonths = tenureUnit === 'years' ? tenureYears * 12 : tenureMonthsRaw;

  /* Prepayments */
  const [prepayments, setPrepayments] = useState([]);

  /* UI */
  const [activeTab,    setActiveTab]    = useState('chart');
  const [tablePage,    setTablePage]    = useState(1);
  const [scenarios,    setScenarios]    = useState([]);
  const [scenarioName, setScenarioName] = useState('');

  /* ── Calculations ────────────────────────────────────────────── */
  const original = useMemo(
    () => calcSchedule(loanAmount, rate, tenureMonths, elapsedMonths, [], 0),
    [loanAmount, rate, tenureMonths, elapsedMonths]
  );

  const withPrep = useMemo(
    () => calcSchedule(loanAmount, rate, tenureMonths, elapsedMonths, prepayments, extraEMI),
    [loanAmount, rate, tenureMonths, elapsedMonths, prepayments, extraEMI]
  );

  const hasPrep       = prepayments.some(p => Number(p.amount) > 0) || extraEMI > 0;
  const interestSaved = original.totalInterest - withPrep.totalInterest;
  const monthsSaved   = original.months - withPrep.months;
  const isMidLoan     = elapsedMonths > 0;

  /* ── Chart data ──────────────────────────────────────────────── */
  const chartData = useMemo(() => {
    const maxM  = Math.max(original.months, withPrep.months);
    const step  = Math.max(1, Math.floor(maxM / 60));
    const origM = Object.fromEntries(original.schedule.map(r => [r.relMonth, r]));
    const prepM = Object.fromEntries(withPrep.schedule.map(r => [r.relMonth, r]));
    const data  = [];
    for (let m = step; m <= maxM; m += step) {
      const o = origM[m];
      const p = prepM[m];
      const label = m % 12 === 0 ? `Yr ${(elapsedMonths + m) / 12}` : `M${elapsedMonths + m}`;
      data.push({
        month:        m,
        label,
        origBalance:  o ? o.balance  : 0,
        prepBalance:  p ? p.balance  : 0,
        origInterest: o ? o.cumInterest : Math.round(original.totalInterest),
        prepInterest: p ? p.cumInterest : Math.round(withPrep.totalInterest),
      });
    }
    return data;
  }, [original, withPrep, elapsedMonths]);

  /* ── Table pagination ────────────────────────────────────────── */
  const PAGE_SIZE   = 12;
  const tableRows   = withPrep.schedule;
  const totalPages  = Math.ceil(tableRows.length / PAGE_SIZE);
  const visibleRows = tableRows.slice((tablePage - 1) * PAGE_SIZE, tablePage * PAGE_SIZE);

  /* ── Prepayment CRUD ─────────────────────────────────────────── */
  const addPrepayment = () =>
    setPrepayments(prev => [...prev, { id: Date.now(), month: 12, amount: 100000 }]);
  const updatePrepayment = (id, field, value) =>
    setPrepayments(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  const removePrepayment = (id) =>
    setPrepayments(prev => prev.filter(p => p.id !== id));

  /* ── Save scenario ───────────────────────────────────────────── */
  const saveScenario = () => {
    const name = scenarioName.trim() || `Scenario ${scenarios.length + 1}`;
    setScenarios(prev => [
      ...prev.slice(-3),
      {
        id: Date.now(), name,
        loanAmount, rate, tenureMonths, elapsedMonths, extraEMI,
        prepayments: [...prepayments],
        emi:           withPrep.emi,
        totalInterest: withPrep.totalInterest,
        months:        withPrep.months,
        interestSaved,
        monthsSaved,
        startBalance:  withPrep.startBalance,
      },
    ]);
    setScenarioName('');
  };

  const tabs = [
    { id: 'chart',   label: 'Charts'       },
    { id: 'table',   label: 'Amortization' },
    { id: 'summary', label: 'Summary'      },
  ];

  const inputCls = "w-full rounded-xl px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
    + " " + "border border-white/12"
    + " " + "bg-white/[0.06]";

  return (
    <div className="flex flex-col gap-6">

      {/* ── Mid-loan banner ────────────────────────────────────── */}
      {isMidLoan && (
        <div className="rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.14)' }}>
          <div>
            <div className="text-sm font-semibold text-white">Mid-loan calculation</div>
            <div className="text-sm text-white/60 mt-0.5">
              You have already paid <strong className="text-white">{elapsedMonths} EMIs</strong>. Showing remaining interest &amp; savings from this point.
            </div>
          </div>
          <div className="flex items-center gap-6 shrink-0">
            <div>
              <div className="text-xs text-white/45 uppercase tracking-wide">Outstanding Balance</div>
              <div className="text-lg font-bold text-white">{fmt(original.startBalance)}</div>
            </div>
            <div>
              <div className="text-xs text-white/45 uppercase tracking-wide">EMIs Remaining</div>
              <div className="text-lg font-bold text-white">{original.months}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Insight banner ─────────────────────────────────────── */}
      <div className="rounded-xl px-5 py-3.5 text-sm text-white/70 leading-relaxed"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
        {isMidLoan
          ? <>Remaining interest on your loan: <strong className="text-white">{fmt(original.totalInterest)}</strong> over <strong className="text-white">{ym(original.months)}</strong>.</>
          : <>Without prepayment you will pay <strong className="text-white">{fmt(original.totalInterest)}</strong> in interest — <strong className="text-white">{((original.totalInterest / loanAmount) * 100).toFixed(0)}%</strong> of your loan amount.</>
        }
        {hasPrep && interestSaved > 0 && (
          <> With your prepayments you save <strong style={{ color: GREEN }}>{fmt(interestSaved)}</strong> and close <strong style={{ color: GREEN }}>{monthsSaved} months</strong> early.</>
        )}
      </div>

      {/* ── Main grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">

        {/* LEFT: Inputs */}
        <div className="flex flex-col gap-4">

          {/* Loan Details */}
          <div className="rounded-2xl p-5 flex flex-col gap-5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <div className="text-xs font-bold uppercase tracking-widest text-white/50">Loan Details</div>

            <NumSlider label="Loan Amount" prefix="₹"
              value={loanAmount} min={100000} max={20000000} step={50000}
              onChange={setLoanAmount} />

            <NumSlider label="Annual Interest Rate" suffix="%"
              value={rate} min={5} max={20} step={0.1}
              onChange={v => setRate(parseFloat(v.toFixed(1)))} />

            {/* Tenure with year/month toggle */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white/90">Loan Tenure</div>
                <div className="flex rounded-lg overflow-hidden"
                  style={{ border: '1px solid rgba(255,255,255,0.14)' }}>
                  {['years', 'months'].map(u => (
                    <button key={u} onClick={() => setTenureUnit(u)}
                      className="px-3 py-1 text-xs font-semibold transition-all capitalize"
                      style={tenureUnit === u
                        ? { background: 'rgba(255,255,255,0.15)', color: 'white' }
                        : { color: 'rgba(255,255,255,0.40)' }}>
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              {tenureUnit === 'years' ? (
                <NumSlider label="" suffix=" yr"
                  value={tenureYears} min={1} max={30} step={1}
                  onChange={v => { setTenureYears(v); setTenureMonthsRaw(v * 12); }} />
              ) : (
                <NumSlider label="" suffix=" mo"
                  value={tenureMonthsRaw} min={12} max={360} step={1}
                  onChange={v => { setTenureMonthsRaw(v); setTenureYears(Math.round(v / 12)); }} />
              )}
              <div className="text-xs text-white/40 text-right -mt-1">
                = {ym(tenureMonths)}
              </div>
            </div>

            {/* Quick summary */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/[0.07]">
              {[
                { label: 'Monthly EMI',    value: fmt(original.emi) },
                { label: 'Total Interest', value: fmt(original.totalInterest) },
                { label: 'Total Payment',  value: fmt(loanAmount + original.totalInterest) },
              ].map(c => (
                <div key={c.label} className="rounded-lg p-3 text-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="text-[11px] text-white/40 uppercase tracking-wide">{c.label}</div>
                  <div className="text-sm font-bold text-white mt-1">{c.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Already Paid */}
          <div className="rounded-2xl p-5 flex flex-col gap-4"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <div className="text-xs font-bold uppercase tracking-widest text-white/50">Already Paid (Optional)</div>
            <NumSlider
              label="EMIs Already Paid" suffix=" mo"
              sub="Enter if you are mid-loan and want to calculate from current balance"
              value={elapsedMonths} min={0} max={Math.max(0, tenureMonths - 1)} step={1}
              onChange={v => setElapsedMonths(v)} />
            {isMidLoan && (
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Outstanding Balance', value: fmt(original.startBalance) },
                  { label: 'Interest Paid So Far', value: fmt(original.paidInterest) },
                ].map(c => (
                  <div key={c.label} className="rounded-lg p-3"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="text-[11px] text-white/40 uppercase tracking-wide">{c.label}</div>
                    <div className="text-sm font-bold text-white mt-1">{c.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Prepayment Options */}
          <div className="rounded-2xl p-5 flex flex-col gap-4"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <div className="text-xs font-bold uppercase tracking-widest text-white/50">Prepayment Options</div>

            <NumSlider
              label="Extra Monthly Payment" prefix="₹"
              sub="Added every month on top of EMI to reduce principal faster"
              value={extraEMI} min={0} max={200000} step={1000}
              onChange={setExtraEMI} />

            {extraEMI > 0 && (
              <div className="text-sm text-white/60">
                Effective monthly outflow: <strong className="text-white">{fmt(withPrep.emi + extraEMI)}</strong>
              </div>
            )}

            {/* Lump sum list */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white/85">Lump Sum Prepayments</div>
                  <div className="text-xs text-white/45 mt-0.5">
                    Month number is relative to {isMidLoan ? 'current position' : 'loan start'}
                  </div>
                </div>
                <button onClick={addPrepayment}
                  className="text-sm font-semibold px-3 py-1.5 rounded-lg transition-all"
                  style={{ color: 'white', border: '1px solid rgba(255,255,255,0.20)', background: 'rgba(255,255,255,0.07)' }}>
                  + Add
                </button>
              </div>

              {prepayments.length === 0 && (
                <div className="text-sm text-white/30 text-center py-4 rounded-xl"
                  style={{ border: '1px dashed rgba(255,255,255,0.12)' }}>
                  No lump sum prepayments — click + Add
                </div>
              )}

              {prepayments.map(p => (
                <div key={p.id} className="rounded-xl p-4 flex flex-col gap-3"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/70">Prepayment</span>
                    <button onClick={() => removePrepayment(p.id)}
                      className="text-sm text-white/30 hover:text-white/70 transition-colors">
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-white/45 mb-1.5 block">
                        After Month # {isMidLoan ? `(from mo ${elapsedMonths + 1})` : ''}
                      </label>
                      <input type="number" min={1} max={tenureMonths - elapsedMonths}
                        value={p.month}
                        onChange={e => updatePrepayment(p.id, 'month', e.target.value)}
                        className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs text-white/45 mb-1.5 block">Amount (₹)</label>
                      <input type="number" min={0}
                        value={p.amount}
                        onChange={e => updatePrepayment(p.id, 'amount', e.target.value)}
                        className={inputCls} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Scenario */}
          <div className="rounded-2xl p-5 flex flex-col gap-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <div className="text-xs font-bold uppercase tracking-widest text-white/50">Save &amp; Compare Scenario</div>
            <div className="flex gap-2">
              <input type="text" placeholder="e.g. ₹5K extra per month"
                value={scenarioName}
                onChange={e => setScenarioName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveScenario()}
                className={inputCls + ' flex-1'} />
              <button onClick={saveScenario}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0"
                style={{ background: 'rgba(255,255,255,0.10)', color: 'white', border: '1px solid rgba(255,255,255,0.20)' }}>
                Save
              </button>
            </div>
            {scenarios.length > 0 && (
              <div className="text-sm text-white/45">
                {scenarios.length} scenario{scenarios.length > 1 ? 's' : ''} saved — see comparison below ↓
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className="flex flex-col gap-4">

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label="Monthly EMI"
              value={fmt(original.emi)}
              sub={isMidLoan ? 'Unchanged' : `For ${ym(tenureMonths)}`} />
            <StatCard
              label={isMidLoan ? 'Remaining Interest' : 'Total Interest'}
              value={fmt(original.totalInterest)}
              sub="Without prepayment" />
            <StatCard
              label="Interest Saved"
              value={hasPrep ? fmt(interestSaved) : '—'}
              sub={hasPrep && monthsSaved > 0 ? `Close ${monthsSaved} mo early` : 'Add a prepayment'}
              highlight={hasPrep && interestSaved > 0} />
            <StatCard
              label="Loan Closes In"
              value={ym(hasPrep ? withPrep.months : original.months)}
              sub={hasPrep && monthsSaved > 0
                ? `${monthsSaved} months saved`
                : isMidLoan ? 'From today' : 'From loan start'} />
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 rounded-xl p-1 self-start"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={activeTab === t.id
                  ? { background: 'rgba(255,255,255,0.15)', color: 'white' }
                  : { color: 'rgba(255,255,255,0.45)' }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── CHART TAB ─────────────────────────────────────── */}
          {activeTab === 'chart' && (
            <div className="flex flex-col gap-4">
              {/* Balance chart */}
              <div className="rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold text-white/70">Outstanding Loan Balance</div>
                  <div className="flex items-center gap-4 text-xs text-white/50">
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block w-6 h-0.5 rounded" style={{ background: DIM }} />
                      Original
                    </span>
                    {hasPrep && (
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block w-6 h-0.5 rounded" style={{ background: GREEN }} />
                        With Prepayment
                      </span>
                    )}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 10 }}>
                    <defs>
                      <linearGradient id="gOrig" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="rgba(255,255,255,0.5)" stopOpacity={0.20} />
                        <stop offset="95%" stopColor="rgba(255,255,255,0)"   stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gPrep" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={GREEN} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="label"
                      tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
                      tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis
                      tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
                      tickLine={false} axisLine={false}
                      tickFormatter={v => fmt(v).replace('₹', '')} width={48} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="origBalance" name="Original"
                      stroke={DIM} fill="url(#gOrig)" strokeWidth={2} dot={false} strokeDasharray="5 3" />
                    {hasPrep && (
                      <Area type="monotone" dataKey="prepBalance" name="With Prepayment"
                        stroke={GREEN} fill="url(#gPrep)" strokeWidth={2} dot={false} />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Interest chart */}
              <div className="rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold text-white/70">Cumulative Interest Paid</div>
                  <div className="flex items-center gap-4 text-xs text-white/50">
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block w-6 h-0.5 rounded" style={{ background: DIM }} />
                      Original
                    </span>
                    {hasPrep && (
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block w-6 h-0.5 rounded" style={{ background: GREEN }} />
                        With Prepayment
                      </span>
                    )}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 10 }}>
                    <defs>
                      <linearGradient id="giOrig" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="rgba(255,255,255,0.5)" stopOpacity={0.20} />
                        <stop offset="95%" stopColor="rgba(255,255,255,0)"   stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="giPrep" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={GREEN} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="label"
                      tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
                      tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis
                      tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
                      tickLine={false} axisLine={false}
                      tickFormatter={v => fmt(v).replace('₹', '')} width={48} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="origInterest" name="Original Interest"
                      stroke={DIM} fill="url(#giOrig)" strokeWidth={2} dot={false} strokeDasharray="5 3" />
                    {hasPrep && (
                      <Area type="monotone" dataKey="prepInterest" name="With Prepayment"
                        stroke={GREEN} fill="url(#giPrep)" strokeWidth={2} dot={false} />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Savings breakdown bars */}
              {hasPrep && (
                <div className="rounded-2xl p-5"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
                  <div className="text-sm font-semibold text-white/70 mb-4">Payment Breakdown</div>
                  {[
                    { label: 'Principal',              amount: isMidLoan ? original.startBalance : loanAmount,  total: (isMidLoan ? original.startBalance : loanAmount) + original.totalInterest },
                    { label: 'Interest — without prepayment', amount: original.totalInterest,  total: (isMidLoan ? original.startBalance : loanAmount) + original.totalInterest },
                    { label: 'Interest — with prepayment',    amount: withPrep.totalInterest,  total: (isMidLoan ? original.startBalance : loanAmount) + original.totalInterest, savings: true },
                  ].map(b => (
                    <div key={b.label} className="flex flex-col gap-1.5 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">{b.label}</span>
                        <span className="font-semibold" style={{ color: b.savings ? GREEN : 'white' }}>{fmt(b.amount)}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (b.amount / b.total) * 100).toFixed(1)}%`,
                            background: b.savings ? GREEN : 'rgba(255,255,255,0.40)',
                          }} />
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 pt-3 flex items-center justify-between"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <span className="text-sm text-white/50">Total interest saved</span>
                    <span className="text-lg font-bold" style={{ color: GREEN }}>{fmt(interestSaved)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── AMORTIZATION TABLE ────────────────────────────── */}
          {activeTab === 'table' && (
            <div className="flex flex-col gap-3">
              <div className="text-sm text-white/50">
                {isMidLoan
                  ? `Showing months ${elapsedMonths + 1} to ${elapsedMonths + withPrep.months} (${withPrep.months} remaining). Highlighted rows = prepayment made.`
                  : 'Full amortization schedule. Highlighted rows = prepayment made.'}
              </div>
              <div className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.10)' }}>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ minWidth: 540 }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
                        {['Month', 'EMI', 'Principal', 'Interest', 'Prepayment', 'Balance'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/45">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visibleRows.map((row, i) => {
                        const isLump = row.prepayment > extraEMI && row.prepayment > 0;
                        return (
                          <tr key={row.month}
                            style={{
                              background: isLump
                                ? 'rgba(48,209,88,0.06)'
                                : i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                              borderBottom: '1px solid rgba(255,255,255,0.05)',
                            }}>
                            <td className="px-4 py-3 text-sm font-medium text-white/60">{row.month}</td>
                            <td className="px-4 py-3 text-sm tabular-nums text-white">{fmt(row.emi)}</td>
                            <td className="px-4 py-3 text-sm tabular-nums text-white/80">{fmt(row.principal)}</td>
                            <td className="px-4 py-3 text-sm tabular-nums text-white/80">{fmt(row.interest)}</td>
                            <td className="px-4 py-3 text-sm tabular-nums font-semibold"
                              style={{ color: row.prepayment > 0 ? GREEN : 'rgba(255,255,255,0.25)' }}>
                              {row.prepayment > 0 ? fmt(row.prepayment) : '—'}
                            </td>
                            <td className="px-4 py-3 text-sm tabular-nums text-white">{fmt(row.balance)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: 'rgba(255,255,255,0.05)', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                        <td className="px-4 py-3 text-xs font-bold uppercase text-white/40">Total</td>
                        <td className="px-4 py-3 text-sm tabular-nums font-semibold text-white">
                          {fmt((isMidLoan ? original.startBalance : loanAmount) + withPrep.totalInterest)}
                        </td>
                        <td className="px-4 py-3 text-sm tabular-nums text-white/70">
                          {fmt(isMidLoan ? original.startBalance : loanAmount)}
                        </td>
                        <td className="px-4 py-3 text-sm tabular-nums text-white/70">{fmt(withPrep.totalInterest)}</td>
                        <td className="px-4 py-3" colSpan={2} />
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="flex items-center justify-between px-4 py-3"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                  <span className="text-sm text-white/40">
                    Rows {(tablePage - 1) * PAGE_SIZE + 1}–{Math.min(tablePage * PAGE_SIZE, tableRows.length)} of {tableRows.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button disabled={tablePage === 1} onClick={() => setTablePage(p => p - 1)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-25 transition-all"
                      style={{ background: 'rgba(255,255,255,0.07)', color: 'white' }}>← Prev</button>
                    <span className="text-sm text-white/40">{tablePage} / {totalPages}</span>
                    <button disabled={tablePage === totalPages} onClick={() => setTablePage(p => p + 1)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-25 transition-all"
                      style={{ background: 'rgba(255,255,255,0.07)', color: 'white' }}>Next →</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── SUMMARY TAB ───────────────────────────────────── */}
          {activeTab === 'summary' && (
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.10)' }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/40">Metric</th>
                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-white/40">Original</th>
                      {hasPrep && <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-white/40">With Prepayment</th>}
                      {hasPrep && <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-white/40">Difference</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        label: isMidLoan ? 'Outstanding Balance' : 'Loan Amount',
                        orig:  fmt(isMidLoan ? original.startBalance : loanAmount),
                        prep:  fmt(isMidLoan ? original.startBalance : loanAmount),
                        diff:  '—', pos: false,
                      },
                      {
                        label: 'Monthly EMI',
                        orig:  fmt(original.emi),
                        prep:  fmt(withPrep.emi + extraEMI),
                        diff:  extraEMI > 0 ? `+${fmt(extraEMI)}/mo` : '—', pos: false,
                      },
                      {
                        label: isMidLoan ? 'Remaining Interest' : 'Total Interest',
                        orig:  fmt(original.totalInterest),
                        prep:  fmt(withPrep.totalInterest),
                        diff:  interestSaved > 0 ? `−${fmt(interestSaved)}` : '—', pos: true,
                      },
                      {
                        label: 'Total Payment',
                        orig:  fmt((isMidLoan ? original.startBalance : loanAmount) + original.totalInterest),
                        prep:  fmt((isMidLoan ? original.startBalance : loanAmount) + withPrep.totalInterest),
                        diff:  interestSaved > 0 ? `−${fmt(interestSaved)}` : '—', pos: true,
                      },
                      {
                        label: 'Loan Duration',
                        orig:  ym(original.months),
                        prep:  ym(withPrep.months),
                        diff:  monthsSaved > 0 ? `−${ym(monthsSaved)}` : '—', pos: true,
                      },
                      {
                        label: 'Interest % of Balance',
                        orig:  `${((original.totalInterest / (isMidLoan ? original.startBalance : loanAmount)) * 100).toFixed(1)}%`,
                        prep:  `${((withPrep.totalInterest / (isMidLoan ? original.startBalance : loanAmount)) * 100).toFixed(1)}%`,
                        diff:  `−${(((original.totalInterest - withPrep.totalInterest) / (isMidLoan ? original.startBalance : loanAmount)) * 100).toFixed(1)}%`,
                        pos:   true,
                      },
                    ].map((row, i) => (
                      <tr key={row.label}
                        style={{
                          background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                        }}>
                        <td className="px-5 py-3 text-sm text-white/65 font-medium">{row.label}</td>
                        <td className="px-5 py-3 text-sm text-right text-white/80 tabular-nums">{row.orig}</td>
                        {hasPrep && <td className="px-5 py-3 text-sm text-right text-white tabular-nums font-medium">{row.prep}</td>}
                        {hasPrep && (
                          <td className="px-5 py-3 text-sm text-right tabular-nums font-semibold"
                            style={{ color: row.pos && row.diff !== '—' ? GREEN : 'rgba(255,255,255,0.45)' }}>
                            {row.diff}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tips */}
              <div className="rounded-2xl p-5 flex flex-col gap-3"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="text-xs font-bold uppercase tracking-widest text-white/45">Prepayment Tips</div>
                {[
                  'Prepay in the early years — interest is front-loaded, so early prepayments save the most.',
                  'Even ₹2,000–₹5,000 extra per month can shave 2–4 years off a 20-year home loan.',
                  'Use annual bonuses, DA arrears, or maturity proceeds as lump-sum prepayments.',
                  'RBI mandates zero prepayment penalty on floating-rate home loans for individuals.',
                  'Compare your loan rate against FD/PPF returns — if loan rate is higher, prepay first.',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-white/30 font-bold text-sm shrink-0 mt-0.5">{i + 1}.</span>
                    <span className="text-sm text-white/60 leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── SCENARIO COMPARISON ────────────────────────────────── */}
      {scenarios.length > 0 && (
        <div className="rounded-2xl p-5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-bold text-white">Scenario Comparison</div>
              <div className="text-sm text-white/45 mt-0.5">Up to 4 saved scenarios side by side</div>
            </div>
            <button onClick={() => setScenarios([])}
              className="text-sm text-white/35 hover:text-white/65 transition-colors px-3 py-1.5 rounded-lg"
              style={{ border: '1px solid rgba(255,255,255,0.10)' }}>
              Clear all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: 640 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
                  {['Scenario', 'Loan', 'Rate', 'EMI', 'Remaining Interest', 'Saved', 'Duration', 'Mo Saved'].map(h => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-white/40">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scenarios.map((s, i) => (
                  <tr key={s.id}
                    style={{
                      background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }}>
                    <td className="py-3 px-4 text-sm font-medium text-white">{s.name}</td>
                    <td className="py-3 px-4 text-sm tabular-nums text-white/65">{fmt(s.loanAmount)}</td>
                    <td className="py-3 px-4 text-sm tabular-nums text-white/65">{s.rate}%</td>
                    <td className="py-3 px-4 text-sm tabular-nums text-white">{fmt(s.emi + (s.extraEMI || 0))}</td>
                    <td className="py-3 px-4 text-sm tabular-nums text-white/80">{fmt(s.totalInterest)}</td>
                    <td className="py-3 px-4 text-sm tabular-nums font-semibold"
                      style={{ color: s.interestSaved > 100 ? GREEN : 'rgba(255,255,255,0.35)' }}>
                      {s.interestSaved > 100 ? fmt(s.interestSaved) : '—'}
                    </td>
                    <td className="py-3 px-4 text-sm tabular-nums text-white/80">{ym(s.months)}</td>
                    <td className="py-3 px-4 text-sm tabular-nums font-semibold"
                      style={{ color: s.monthsSaved > 0 ? GREEN : 'rgba(255,255,255,0.35)' }}>
                      {s.monthsSaved > 0 ? `−${s.monthsSaved}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
