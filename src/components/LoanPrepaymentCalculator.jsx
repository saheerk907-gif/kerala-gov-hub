'use client';
import { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

const GOLD   = '#ff9f0a';
const BLUE   = '#2997ff';
const GREEN  = '#30d158';
const RED    = '#ff453a';
const PURPLE = '#bf5af2';

/* ── Formatting ─────────────────────────────────────────────────────── */
function fmt(n) {
  if (!isFinite(n) || isNaN(n)) return '—';
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(2)} L`;
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

/* ── Core amortization engine ────────────────────────────────────────── */
function calcSchedule(principal, annualRate, tenureMonths, prepayments, extraMonthly) {
  const r = annualRate / 100 / 12;
  const emi = r > 0
    ? principal * r * Math.pow(1 + r, tenureMonths) / (Math.pow(1 + r, tenureMonths) - 1)
    : principal / tenureMonths;

  const prepMap = {};
  prepayments.forEach(p => {
    const m = Number(p.month);
    const a = Number(p.amount);
    if (m > 0 && a > 0) prepMap[m] = (prepMap[m] || 0) + a;
  });

  let balance = principal;
  let totalInterest = 0;
  const schedule = [];

  for (let m = 1; m <= tenureMonths && balance > 0.5; m++) {
    const interest = balance * r;
    const regularPrincipal = Math.min(balance, Math.max(0, emi - interest));
    balance -= regularPrincipal;
    totalInterest += interest;

    const lumpsum = Math.min(prepMap[m] || 0, balance);
    balance -= lumpsum;

    const extra = Math.min(extraMonthly, balance);
    balance -= extra;

    balance = Math.max(0, balance);

    schedule.push({
      month: m,
      emi: Math.round(regularPrincipal + interest),
      interest: Math.round(interest),
      principal: Math.round(regularPrincipal),
      prepayment: Math.round(lumpsum + extra),
      balance: Math.round(balance),
      cumInterest: Math.round(totalInterest),
    });
  }

  return { emi, schedule, totalInterest, months: schedule.length };
}

/* ── Number + slider input ───────────────────────────────────────────── */
function NumSlider({ label, sub, value, min, max, step, onChange, prefix = '', suffix = '' }) {
  const [editing, setEditing] = useState(false);
  const [raw, setRaw]         = useState('');

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white/90 leading-snug">{label}</div>
          {sub && <div className="text-[10px] text-white/40 mt-0.5">{sub}</div>}
        </div>
        <div className="flex items-center rounded-lg px-2.5 py-1 shrink-0"
          style={{ background: 'rgba(255,159,10,0.10)', border: '1px solid rgba(255,159,10,0.25)' }}>
          {prefix && <span className="text-xs text-white/50 mr-1">{prefix}</span>}
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
            className="bg-transparent outline-none text-sm font-black tabular-nums text-right"
            style={{ color: GOLD, width: `${Math.max(String(value).length, 4) + 1}ch` }}
          />
          {suffix && <span className="text-xs text-white/50 ml-1">{suffix}</span>}
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={Math.min(value, max)}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: GOLD }}
      />
      <div className="flex justify-between text-[10px] text-white/25">
        <span>{prefix}{min.toLocaleString('en-IN')}{suffix}</span>
        <span>{prefix}{max.toLocaleString('en-IN')}{suffix}</span>
      </div>
    </div>
  );
}

/* ── Stat card ───────────────────────────────────────────────────────── */
function StatCard({ label, value, sub, color = 'white', accent }) {
  return (
    <div className="rounded-xl p-4 flex flex-col gap-1"
      style={{
        background: accent ? `${accent}10` : 'rgba(255,255,255,0.04)',
        border: `1px solid ${accent ? `${accent}25` : 'rgba(255,255,255,0.08)'}`,
      }}>
      <div className="text-[10px] font-black uppercase tracking-widest text-white/40">{label}</div>
      <div className="text-lg font-black tabular-nums leading-tight" style={{ color }}>{value}</div>
      {sub && <div className="text-[11px] text-white/50 leading-snug">{sub}</div>}
    </div>
  );
}

/* ── Recharts tooltip ────────────────────────────────────────────────── */
function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl p-3 text-xs shadow-2xl"
      style={{ background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.12)' }}>
      <div className="font-bold text-white/50 mb-2">{payload[0]?.payload?.label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-white/60">{p.name}:</span>
          <span className="font-black text-white">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────── */
export default function LoanPrepaymentCalculator() {
  /* Loan inputs */
  const [loanAmount,   setLoanAmount]   = useState(3000000);
  const [rate,         setRate]         = useState(8.5);
  const [tenureYears,  setTenureYears]  = useState(20);
  const [extraEMI,     setExtraEMI]     = useState(0);

  /* Prepayment list */
  const [prepayments, setPrepayments] = useState([]);

  /* UI */
  const [activeTab,    setActiveTab]    = useState('chart');
  const [tablePage,    setTablePage]    = useState(1);
  const [scenarios,    setScenarios]    = useState([]);
  const [scenarioName, setScenarioName] = useState('');

  const tenureMonths = tenureYears * 12;

  /* ── Calculations ────────────────────────────────────────────── */
  const original = useMemo(
    () => calcSchedule(loanAmount, rate, tenureMonths, [], 0),
    [loanAmount, rate, tenureMonths]
  );

  const withPrep = useMemo(
    () => calcSchedule(loanAmount, rate, tenureMonths, prepayments, extraEMI),
    [loanAmount, rate, tenureMonths, prepayments, extraEMI]
  );

  const hasPrep       = prepayments.some(p => Number(p.amount) > 0) || extraEMI > 0;
  const interestSaved = original.totalInterest - withPrep.totalInterest;
  const monthsSaved   = original.months - withPrep.months;
  const yearsMonths   = (m) => `${Math.floor(m / 12)}y ${m % 12}m`;

  /* ── Chart data ──────────────────────────────────────────────── */
  const chartData = useMemo(() => {
    const maxM  = Math.max(original.months, withPrep.months);
    const step  = Math.max(1, Math.floor(maxM / 60));
    const origM = Object.fromEntries(original.schedule.map(r => [r.month, r]));
    const prepM = Object.fromEntries(withPrep.schedule.map(r => [r.month, r]));
    const data  = [];
    for (let m = step; m <= maxM; m += step) {
      const o = origM[m];
      const p = prepM[m];
      data.push({
        month:        m,
        label:        m % 12 === 0 ? `Yr ${m / 12}` : `M${m}`,
        origBalance:  o ? o.balance : 0,
        prepBalance:  p ? p.balance : 0,
        origInterest: o ? o.cumInterest : Math.round(original.totalInterest),
        prepInterest: p ? p.cumInterest : Math.round(withPrep.totalInterest),
      });
    }
    return data;
  }, [original, withPrep]);

  /* ── Table pagination ────────────────────────────────────────── */
  const PAGE_SIZE   = 12;
  const tableRows   = withPrep.schedule;
  const totalPages  = Math.ceil(tableRows.length / PAGE_SIZE);
  const visibleRows = tableRows.slice((tablePage - 1) * PAGE_SIZE, tablePage * PAGE_SIZE);

  /* ── Prepayment CRUD ─────────────────────────────────────────── */
  const addPrepayment = () =>
    setPrepayments(prev => [...prev, { id: Date.now(), month: 12, amount: 100000 }]);

  const updatePrepayment = (id, field, value) =>
    setPrepayments(prev => prev.map(p => (p.id === id ? { ...p, [field]: value } : p)));

  const removePrepayment = (id) =>
    setPrepayments(prev => prev.filter(p => p.id !== id));

  /* ── Save scenario ───────────────────────────────────────────── */
  const saveScenario = () => {
    const name = scenarioName.trim() || `Scenario ${scenarios.length + 1}`;
    setScenarios(prev => [
      ...prev.slice(-3),
      {
        id: Date.now(), name,
        loanAmount, rate, tenureYears, extraEMI,
        prepayments: [...prepayments],
        emi:           withPrep.emi,
        totalInterest: withPrep.totalInterest,
        months:        withPrep.months,
        interestSaved: original.totalInterest - withPrep.totalInterest,
        monthsSaved:   original.months - withPrep.months,
      },
    ]);
    setScenarioName('');
  };

  /* ── Insight line ────────────────────────────────────────────── */
  const interestRatio = ((original.totalInterest / loanAmount) * 100).toFixed(0);

  /* ── Tab helper ──────────────────────────────────────────────── */
  const tabs = [
    { id: 'chart',   label: '📈 Charts'      },
    { id: 'table',   label: '📋 Amortization' },
    { id: 'summary', label: '📊 Summary'      },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* ── Insight banner ─────────────────────────────────────── */}
      <div className="rounded-xl px-4 py-3 flex items-center gap-3 text-sm"
        style={{ background: 'rgba(255,159,10,0.08)', border: '1px solid rgba(255,159,10,0.2)' }}>
        <span className="text-base">💡</span>
        <span className="text-white/70">
          Without prepayment you pay <span className="font-black text-white">{fmt(original.totalInterest)}</span> in
          interest — <span className="font-black" style={{ color: GOLD }}>{interestRatio}%</span> of your loan amount.
          {hasPrep && interestSaved > 0 && (
            <> With your prepayments you save <span className="font-black" style={{ color: GREEN }}>{fmt(interestSaved)}</span> and close <span className="font-black" style={{ color: GREEN }}>{monthsSaved} months</span> early.</>
          )}
        </span>
      </div>

      {/* ── Main grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">

        {/* LEFT: Inputs */}
        <div className="flex flex-col gap-4">

          {/* Loan Details */}
          <div className="rounded-2xl p-5 flex flex-col gap-5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: GOLD }}>
              Loan Details
            </div>
            <NumSlider label="Loan Amount" prefix="₹"
              value={loanAmount} min={100000} max={20000000} step={50000}
              onChange={setLoanAmount} />
            <NumSlider label="Annual Interest Rate" suffix="%"
              value={rate} min={5} max={20} step={0.1}
              onChange={v => setRate(parseFloat(v.toFixed(1)))} />
            <NumSlider label="Loan Tenure" suffix=" yrs"
              value={tenureYears} min={1} max={30} step={1}
              onChange={setTenureYears} />

            {/* Quick summary chips */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { label: 'EMI',      value: fmt(original.emi),           color: GOLD  },
                { label: 'Interest', value: fmt(original.totalInterest), color: RED   },
                { label: 'Total',    value: fmt(loanAmount + original.totalInterest), color: 'white' },
              ].map(c => (
                <div key={c.label} className="rounded-lg p-2.5 text-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="text-[9px] text-white/40 uppercase tracking-widest">{c.label}</div>
                  <div className="text-xs font-black mt-0.5" style={{ color: c.color }}>{c.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Prepayment Options */}
          <div className="rounded-2xl p-5 flex flex-col gap-4"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: GREEN }}>
              Prepayment Options
            </div>

            <NumSlider
              label="Extra Monthly Payment" prefix="₹"
              sub="Added every month on top of EMI to reduce principal faster"
              value={extraEMI} min={0} max={200000} step={1000}
              onChange={setExtraEMI} />

            {/* Lump sum prepayments */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-white/80">Lump Sum Prepayments</span>
                  <div className="text-[10px] text-white/40 mt-0.5">E.g. bonus, maturity proceeds</div>
                </div>
                <button onClick={addPrepayment}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-[1.03]"
                  style={{ color: GREEN, border: `1px solid ${GREEN}40`, background: `${GREEN}10` }}>
                  + Add
                </button>
              </div>

              {prepayments.length === 0 && (
                <div className="text-[11px] text-white/30 text-center py-4 rounded-xl"
                  style={{ border: '1px dashed rgba(255,255,255,0.10)' }}>
                  No lump sum prepayments — click + Add to include one
                </div>
              )}

              <div className="flex flex-col gap-2">
                {prepayments.map(p => (
                  <div key={p.id} className="rounded-xl p-3 flex flex-col gap-2.5"
                    style={{ background: 'rgba(48,209,88,0.05)', border: '1px solid rgba(48,209,88,0.18)' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: GREEN }}>
                        Prepayment
                      </span>
                      <button onClick={() => removePrepayment(p.id)}
                        className="text-[11px] text-white/25 hover:text-red-400 transition-colors px-1">
                        ✕ Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-[10px] text-white/40 mb-1">After Month #</div>
                        <input type="number" min={1} max={tenureMonths}
                          value={p.month}
                          onChange={e => updatePrepayment(p.id, 'month', e.target.value)}
                          className="w-full rounded-lg px-2.5 py-1.5 text-sm text-white outline-none"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} />
                      </div>
                      <div>
                        <div className="text-[10px] text-white/40 mb-1">Amount (₹)</div>
                        <input type="number" min={0}
                          value={p.amount}
                          onChange={e => updatePrepayment(p.id, 'amount', e.target.value)}
                          className="w-full rounded-lg px-2.5 py-1.5 text-sm text-white outline-none"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Save Scenario */}
          <div className="rounded-2xl p-5 flex flex-col gap-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: PURPLE }}>
              Save &amp; Compare Scenario
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Name (e.g. ₹5K extra/month)"
                value={scenarioName}
                onChange={e => setScenarioName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveScenario()}
                className="flex-1 rounded-xl px-3 py-2 text-sm text-white outline-none placeholder:text-white/25"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }} />
              <button onClick={saveScenario}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] shrink-0"
                style={{ background: `${PURPLE}20`, color: PURPLE, border: `1px solid ${PURPLE}40` }}>
                Save
              </button>
            </div>
            {scenarios.length > 0 && (
              <div className="text-[11px] text-white/40">
                {scenarios.length} scenario{scenarios.length > 1 ? 's' : ''} saved — see comparison below ↓
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className="flex flex-col gap-4">

          {/* Stat cards row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Monthly EMI"    value={fmt(original.emi)}            color={GOLD}  accent={GOLD}  />
            <StatCard label="Total Interest" value={fmt(original.totalInterest)}  color={RED}   accent={RED}
              sub="Without prepayment" />
            <StatCard label="Interest Saved" value={hasPrep ? fmt(interestSaved) : '—'} color={GREEN} accent={GREEN}
              sub={hasPrep && monthsSaved > 0 ? `Close ${monthsSaved} mo early` : hasPrep ? 'No time saving yet' : 'Add a prepayment'} />
            <StatCard label="Loan Closes In" value={hasPrep ? yearsMonths(withPrep.months) : yearsMonths(original.months)}
              color={BLUE} accent={BLUE}
              sub={hasPrep && monthsSaved > 0 ? `${monthsSaved} months saved` : `${yearsMonths(original.months)} original`} />
          </div>

          {/* Effective monthly outflow (shown only when extraEMI > 0) */}
          {extraEMI > 0 && (
            <div className="rounded-xl px-4 py-2.5 flex items-center justify-between"
              style={{ background: 'rgba(41,151,255,0.07)', border: '1px solid rgba(41,151,255,0.2)' }}>
              <span className="text-xs text-white/60">Effective monthly outflow with extra payment</span>
              <span className="text-sm font-black" style={{ color: BLUE }}>{fmt(withPrep.emi + extraEMI)}</span>
            </div>
          )}

          {/* Tab bar */}
          <div className="flex gap-1 rounded-xl p-1 self-start"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap"
                style={activeTab === t.id
                  ? { background: GOLD, color: '#000' }
                  : { color: 'rgba(255,255,255,0.45)' }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── CHART TAB ─────────────────────────────────────── */}
          {activeTab === 'chart' && (
            <div className="flex flex-col gap-4">
              {/* Outstanding Balance */}
              <div className="rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-bold text-white/60">Outstanding Loan Balance</div>
                  <div className="flex items-center gap-3 text-[10px] text-white/45">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded inline-block" style={{ background: BLUE }} />Original</span>
                    {hasPrep && <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded inline-block" style={{ background: GREEN }} />With Prepayment</span>}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={210}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 10 }}>
                    <defs>
                      <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={BLUE}  stopOpacity={0.22} />
                        <stop offset="95%" stopColor={BLUE}  stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gGreen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={GREEN} stopOpacity={0.30} />
                        <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="label"
                      tick={{ fill: 'rgba(255,255,255,0.30)', fontSize: 9 }}
                      tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis
                      tick={{ fill: 'rgba(255,255,255,0.30)', fontSize: 9 }}
                      tickLine={false} axisLine={false}
                      tickFormatter={v => fmt(v).replace('₹', '')} width={46} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="origBalance" name="Original"
                      stroke={BLUE}  fill="url(#gBlue)"  strokeWidth={2} dot={false} />
                    {hasPrep && (
                      <Area type="monotone" dataKey="prepBalance" name="With Prepayment"
                        stroke={GREEN} fill="url(#gGreen)" strokeWidth={2} dot={false} />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Cumulative Interest */}
              <div className="rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-bold text-white/60">Cumulative Interest Paid</div>
                  <div className="flex items-center gap-3 text-[10px] text-white/45">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded inline-block" style={{ background: RED }} />Original</span>
                    {hasPrep && <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded inline-block" style={{ background: GOLD }} />With Prepayment</span>}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={190}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 10 }}>
                    <defs>
                      <linearGradient id="gRed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={RED}  stopOpacity={0.22} />
                        <stop offset="95%" stopColor={RED}  stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={GOLD} stopOpacity={0.22} />
                        <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="label"
                      tick={{ fill: 'rgba(255,255,255,0.30)', fontSize: 9 }}
                      tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis
                      tick={{ fill: 'rgba(255,255,255,0.30)', fontSize: 9 }}
                      tickLine={false} axisLine={false}
                      tickFormatter={v => fmt(v).replace('₹', '')} width={46} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="origInterest" name="Original Interest"
                      stroke={RED}  fill="url(#gRed)"  strokeWidth={2} dot={false} />
                    {hasPrep && (
                      <Area type="monotone" dataKey="prepInterest" name="With Prepayment"
                        stroke={GOLD} fill="url(#gGold)" strokeWidth={2} dot={false} />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Payment breakdown donut-style bar */}
              {hasPrep && (
                <div className="rounded-2xl p-5"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="text-xs font-bold text-white/60 mb-4">Total Payment Breakdown</div>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: 'Principal',              amount: loanAmount,                  total: loanAmount + original.totalInterest, color: BLUE  },
                      { label: 'Interest — Original',    amount: original.totalInterest,      total: loanAmount + original.totalInterest, color: RED   },
                      { label: 'Interest — With Prepay', amount: withPrep.totalInterest,      total: loanAmount + original.totalInterest, color: GREEN },
                    ].map(b => (
                      <div key={b.label} className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/55">{b.label}</span>
                          <span className="font-black" style={{ color: b.color }}>{fmt(b.amount)}</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (b.amount / b.total) * 100).toFixed(1)}%`, background: b.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 flex items-center justify-between"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-xs text-white/40">You save</span>
                    <span className="text-base font-black" style={{ color: GREEN }}>{fmt(interestSaved)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── AMORTIZATION TABLE TAB ────────────────────────── */}
          {activeTab === 'table' && (
            <div className="flex flex-col gap-3">
              <div className="text-[11px] text-white/40">
                Showing schedule with prepayments applied. Rows highlighted in green = lump-sum prepayment month.
              </div>
              <div className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs" style={{ minWidth: 520 }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        {[
                          { label: '#',          color: 'rgba(255,255,255,0.40)' },
                          { label: 'EMI',        color: GOLD },
                          { label: 'Principal',  color: BLUE },
                          { label: 'Interest',   color: RED  },
                          { label: 'Prepayment', color: GREEN },
                          { label: 'Balance',    color: 'rgba(255,255,255,0.40)' },
                        ].map(h => (
                          <th key={h.label} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider"
                            style={{ color: h.color }}>
                            {h.label}
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
                                : i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                              borderBottom: '1px solid rgba(255,255,255,0.04)',
                            }}>
                            <td className="px-4 py-2.5 font-bold text-white/55">{row.month}</td>
                            <td className="px-4 py-2.5 tabular-nums" style={{ color: GOLD }}>{fmt(row.emi)}</td>
                            <td className="px-4 py-2.5 tabular-nums" style={{ color: BLUE }}>{fmt(row.principal)}</td>
                            <td className="px-4 py-2.5 tabular-nums" style={{ color: RED  }}>{fmt(row.interest)}</td>
                            <td className="px-4 py-2.5 tabular-nums font-bold"
                              style={{ color: row.prepayment > 0 ? GREEN : 'rgba(255,255,255,0.18)' }}>
                              {row.prepayment > 0 ? fmt(row.prepayment) : '—'}
                            </td>
                            <td className="px-4 py-2.5 tabular-nums font-bold text-white/80">{fmt(row.balance)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    {/* Totals row */}
                    <tfoot>
                      <tr style={{ background: 'rgba(255,255,255,0.04)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <td className="px-4 py-3 text-[10px] font-black uppercase text-white/40" colSpan={1}>Total</td>
                        <td className="px-4 py-3 tabular-nums font-black text-white/70" colSpan={1}>
                          {fmt(loanAmount + withPrep.totalInterest)}
                        </td>
                        <td className="px-4 py-3 tabular-nums font-black" style={{ color: BLUE }}>{fmt(loanAmount)}</td>
                        <td className="px-4 py-3 tabular-nums font-black" style={{ color: RED  }}>{fmt(withPrep.totalInterest)}</td>
                        <td className="px-4 py-3" colSpan={2} />
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                  <span className="text-[11px] text-white/35">
                    Rows {(tablePage - 1) * PAGE_SIZE + 1}–{Math.min(tablePage * PAGE_SIZE, tableRows.length)} of {tableRows.length}
                  </span>
                  <div className="flex gap-2">
                    <button disabled={tablePage === 1} onClick={() => setTablePage(p => p - 1)}
                      className="px-3 py-1 rounded-lg text-xs font-bold disabled:opacity-25 transition-all"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'white' }}>← Prev</button>
                    <span className="px-2 py-1 text-xs text-white/40">{tablePage}/{totalPages}</span>
                    <button disabled={tablePage === totalPages} onClick={() => setTablePage(p => p + 1)}
                      className="px-3 py-1 rounded-lg text-xs font-bold disabled:opacity-25 transition-all"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'white' }}>Next →</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── SUMMARY TAB ───────────────────────────────────── */}
          {activeTab === 'summary' && (
            <div className="flex flex-col gap-4">
              {/* Side-by-side */}
              <div className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-white/35">Metric</th>
                      <th className="px-5 py-3 text-right text-[10px] font-black uppercase tracking-wider text-white/35">Original</th>
                      {hasPrep && <th className="px-5 py-3 text-right text-[10px] font-black uppercase tracking-wider" style={{ color: GREEN }}>With Prepayment</th>}
                      {hasPrep && <th className="px-5 py-3 text-right text-[10px] font-black uppercase tracking-wider" style={{ color: GOLD }}>Savings</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        label: 'Loan Amount',
                        orig: fmt(loanAmount),
                        prep: fmt(loanAmount),
                        diff: '—',
                        diffColor: 'rgba(255,255,255,0.3)',
                      },
                      {
                        label: 'Monthly EMI',
                        orig: fmt(original.emi),
                        prep: fmt(withPrep.emi + extraEMI),
                        diff: extraEMI > 0 ? `+${fmt(extraEMI)}/mo` : '—',
                        diffColor: 'rgba(255,255,255,0.3)',
                      },
                      {
                        label: 'Total Interest',
                        orig: fmt(original.totalInterest),
                        prep: fmt(withPrep.totalInterest),
                        diff: fmt(interestSaved),
                        diffColor: GREEN,
                      },
                      {
                        label: 'Total Payment',
                        orig: fmt(loanAmount + original.totalInterest),
                        prep: fmt(loanAmount + withPrep.totalInterest),
                        diff: fmt(interestSaved),
                        diffColor: GREEN,
                      },
                      {
                        label: 'Loan Duration',
                        orig: `${original.months} mo (${yearsMonths(original.months)})`,
                        prep: `${withPrep.months} mo (${yearsMonths(withPrep.months)})`,
                        diff: monthsSaved > 0 ? `${monthsSaved} mo less` : '—',
                        diffColor: GREEN,
                      },
                      {
                        label: 'Interest % of Principal',
                        orig: `${((original.totalInterest / loanAmount) * 100).toFixed(1)}%`,
                        prep: `${((withPrep.totalInterest / loanAmount) * 100).toFixed(1)}%`,
                        diff: `−${(((original.totalInterest - withPrep.totalInterest) / loanAmount) * 100).toFixed(1)}%`,
                        diffColor: GREEN,
                      },
                    ].map((row, i) => (
                      <tr key={row.label}
                        style={{
                          background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                        }}>
                        <td className="px-5 py-3 text-white/55 font-semibold">{row.label}</td>
                        <td className="px-5 py-3 text-right text-white/70 tabular-nums">{row.orig}</td>
                        {hasPrep && <td className="px-5 py-3 text-right tabular-nums font-bold" style={{ color: GREEN }}>{row.prep}</td>}
                        {hasPrep && <td className="px-5 py-3 text-right tabular-nums font-black" style={{ color: row.diffColor }}>{row.diff}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Key tips */}
              <div className="rounded-2xl p-5 flex flex-col gap-3"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Smart Prepayment Tips</div>
                {[
                  { icon: '📅', tip: 'Prepay in the early years of your loan — interest is front-loaded, so prepayments save more then.' },
                  { icon: '🔄', tip: 'Even a small extra monthly payment (₹2,000–₹5,000) can shave years off a 20-year home loan.' },
                  { icon: '🎯', tip: 'Use annual bonuses, increments, or DA arrears as lump-sum prepayments for maximum impact.' },
                  { icon: '⚠️', tip: 'Check for prepayment penalties with your lender (most Indian banks have zero charges for floating-rate loans).' },
                  { icon: '💡', tip: 'Compare the effective interest rate on your loan with returns from FD/PPF — if loan rate is higher, prepay first.' },
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-3 text-[12px]">
                    <span className="text-base shrink-0 mt-0.5">{t.icon}</span>
                    <span className="text-white/60 leading-relaxed">{t.tip}</span>
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
          style={{ background: 'rgba(191,90,242,0.05)', border: '1px solid rgba(191,90,242,0.20)' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: PURPLE }}>
                Scenario Comparison
              </div>
              <div className="text-[11px] text-white/40 mt-1">
                Compare up to 4 saved scenarios side by side
              </div>
            </div>
            <button onClick={() => setScenarios([])}
              className="text-xs text-white/30 hover:text-white/60 transition-colors px-3 py-1 rounded-lg"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              Clear all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs" style={{ minWidth: 640 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {[
                    { label: 'Scenario',       color: 'rgba(255,255,255,0.40)' },
                    { label: 'Loan',           color: 'rgba(255,255,255,0.40)' },
                    { label: 'Rate',           color: 'rgba(255,255,255,0.40)' },
                    { label: 'EMI',            color: GOLD   },
                    { label: 'Total Interest', color: RED    },
                    { label: 'Saved',          color: GREEN  },
                    { label: 'Duration',       color: BLUE   },
                    { label: 'Mo Saved',       color: GREEN  },
                  ].map(h => (
                    <th key={h.label}
                      className="py-2 px-4 text-left text-[10px] font-black uppercase tracking-wider"
                      style={{ color: h.color }}>
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scenarios.map((s, i) => (
                  <tr key={s.id}
                    style={{
                      background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                    }}>
                    <td className="py-3 px-4 font-bold text-white/80">{s.name}</td>
                    <td className="py-3 px-4 text-white/55 tabular-nums">{fmt(s.loanAmount)}</td>
                    <td className="py-3 px-4 text-white/55 tabular-nums">{s.rate}%</td>
                    <td className="py-3 px-4 tabular-nums font-bold" style={{ color: GOLD  }}>{fmt(s.emi + s.extraEMI)}</td>
                    <td className="py-3 px-4 tabular-nums"          style={{ color: RED   }}>{fmt(s.totalInterest)}</td>
                    <td className="py-3 px-4 tabular-nums font-bold" style={{ color: GREEN }}>
                      {s.interestSaved > 100 ? fmt(s.interestSaved) : '—'}
                    </td>
                    <td className="py-3 px-4 tabular-nums"          style={{ color: BLUE  }}>{s.months} mo</td>
                    <td className="py-3 px-4 tabular-nums font-bold" style={{ color: s.monthsSaved > 0 ? GREEN : 'rgba(255,255,255,0.3)' }}>
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
