'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_PENSION       = 83400;   // 11th PRC ceiling
const MIN_PENSION       = 9000;    // Kerala minimum pension
const FAMILY_PENSION_PC = 30;      // Normal family pension = 30% of basic pension
const CURRENT_DA        = 35;      // Current DR % on pension

// ─── Core pension calculation (KSR Part III) ─────────────────────────────────
// Formula: Monthly Pension = (Average Emoluments × Half-year Units) ÷ 120
// Half-year rounding rules:
//   < 3 months  → 0 extra units (ignored)
//   3–8 months  → 1 unit
//   ≥ 9 months  → 2 units (counts as 1 full year)
// Maximum: 60 units (30 years)
function calcPension({ avgEmoluments, serviceYears, serviceMonths }) {
  const totalMonths = serviceYears * 12 + serviceMonths;
  const eligible    = totalMonths >= 120; // 10 years

  // Step 1 — Half-year units from full years
  const baseUnits = serviceYears * 2;

  // Step 2 — Rounding the remaining months
  let extraUnits   = 0;
  let roundingNote = '';
  if (serviceMonths < 3) {
    extraUnits   = 0;
    roundingNote = `${serviceMonths} month(s) — 3-ൽ താഴെ, Ignored`;
  } else if (serviceMonths < 9) {
    extraUnits   = 1;
    roundingNote = `${serviceMonths} months → 1 unit (½ year)`;
  } else {
    extraUnits   = 2;
    roundingNote = `${serviceMonths} months ≥ 9 → 2 units (1 full year)`;
  }

  const rawUnits  = baseUnits + extraUnits;
  const halfYears = Math.min(rawUnits, 60);
  const capped    = rawUnits > 60;

  // Step 3 — Pension formula
  const pensionRaw    = Math.round((avgEmoluments * halfYears) / 120);
  const pensionCapped = Math.min(pensionRaw, MAX_PENSION);
  const isCapped      = pensionRaw > MAX_PENSION;
  const pension       = Math.max(pensionCapped, MIN_PENSION);
  const isMinimum     = pensionCapped < MIN_PENSION;

  // Derived
  const familyPension = Math.round(pension * FAMILY_PENSION_PC / 100);
  const daOnPension   = Math.round(pension * CURRENT_DA / 100);
  const grossPension  = pension + daOnPension;
  const pensionPct    = ((halfYears / 120) * 100).toFixed(1);
  const effectiveYrs  = (halfYears / 2).toFixed(1);

  return {
    eligible, halfYears, rawUnits, baseUnits, extraUnits,
    roundingNote, capped,
    pensionRaw, pension, isCapped, isMinimum,
    familyPension, daOnPension, grossPension,
    pensionPct, effectiveYrs,
    maxReached: halfYears === 60,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt  = v => '₹' + Math.round(v).toLocaleString('en-IN');
const fmtL = v => '₹' + (v / 100000).toFixed(2) + 'L';

function Input({ label, sub, value, onChange, min = 0, max, step = 1 }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-black uppercase tracking-widest text-white/35">{label}</label>
      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        min={min} max={max} step={step}
        className="w-full rounded-xl px-3 py-2.5 text-white text-sm font-semibold outline-none focus:ring-1 focus:ring-white/20"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
      />
      {sub && <div className="text-[10px] text-white/25 leading-snug" style={{ fontFamily: "'Meera', serif" }}>{sub}</div>}
    </div>
  );
}

function ResultRow({ label, value, color, sub, bold, malayalam }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5 border-b border-white/[0.05] last:border-0">
      <div>
        <div className={`text-[13px] ${bold ? 'font-bold text-white/80' : 'text-white/50'}`}
          style={malayalam ? { fontFamily: "'Meera', sans-serif" } : {}}>
          {label}
        </div>
        {sub && <div className="text-[10px] text-white/25 mt-0.5">{sub}</div>}
      </div>
      <div className={`font-black whitespace-nowrap ${bold ? 'text-[17px]' : 'text-[14px]'} text-white`}
        style={color ? { color } : {}}>
        {value}
      </div>
    </div>
  );
}

function StepBadge({ n, label }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0"
        style={{ background: 'rgba(41,151,255,0.15)', color: '#2997ff', border: '1px solid rgba(41,151,255,0.3)' }}>
        {n}
      </div>
      <div className="text-[10px] font-black uppercase tracking-widest text-white/30">{label}</div>
    </div>
  );
}

function ServiceBar({ halfYears }) {
  const pct = (halfYears / 60) * 100;
  return (
    <div>
      <div className="flex justify-between text-[10px] text-white/30 mb-1.5">
        <span>0 yrs</span>
        <span className="text-white/45 font-bold">{(halfYears / 2).toFixed(1)} yrs — {pct.toFixed(0)}% of max</span>
        <span>30 yrs</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: pct >= 100 ? '#30d158' : 'linear-gradient(90deg, #2997ff, #30d158)',
          }}
        />
      </div>
    </div>
  );
}

// ─── AE Scenarios reference ────────────────────────────────────────────────────
const AE_SCENARIOS = [
  { label: 'Full Pay', ml: 'ഡ്യൂട്ടി കാലം', note: 'Basic Pay fully counted' },
  { label: 'Increment', ml: 'ഇൻക്രിമെന്റ്', note: 'New pay from increment date' },
  { label: 'Promotion', ml: 'സ്ഥാനക്കയറ്റം', note: 'Higher pay from promotion date' },
  { label: 'LWA / Suspension', ml: 'LWA / സസ്പെൻഷൻ', note: 'Month excluded — extend backwards' },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PensionPage() {
  // Step 1 — Average Emoluments
  const [aeMode,      setAeMode]      = useState('basic');   // 'basic' | 'manual'
  const [basicPay,    setBasicPay]    = useState(50000);
  const [manualAE,    setManualAE]    = useState(50000);

  // Step 2 — Qualifying Service
  const [years,       setYears]       = useState(25);
  const [months,      setMonths]      = useState(0);

  const avgEmoluments = aeMode === 'manual' ? manualAE : basicPay;
  const result        = useMemo(
    () => calcPension({ avgEmoluments, serviceYears: years, serviceMonths: months }),
    [avgEmoluments, years, months],
  );

  return (
    <div className="relative min-h-screen bg-aurora overflow-x-hidden">
      <div className="max-w-[1040px] mx-auto px-4 pt-[100px] pb-16">

        {/* Title */}
        <div className="mb-8">
          <Link href="/"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/30 hover:text-white/60 no-underline transition-colors mb-3">
            ← Back to Home
          </Link>
          <div className="text-[10px] font-black uppercase tracking-widest text-white/25 mb-2">
            Kerala Service Rules — Part III
          </div>
          <h1 className="text-[clamp(22px,4vw,40px)] font-[900] tracking-[-0.03em] text-white leading-tight"
            style={{ fontFamily: "'Meera', sans-serif" }}>
            പെൻഷൻ <span className="text-white/35">Calculator</span>
          </h1>
          <p className="text-[13px] text-white/35 mt-1">
            Formula: (Average Emoluments × Half-year Units) ÷ 120
          </p>
          <Link href="/pension-calculation"
            className="inline-flex items-center gap-1 text-[11px] font-bold no-underline mt-2 transition-colors"
            style={{ color: '#2997ff' }}>
            Step-by-Step Guide വായിക്കുക →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">

          {/* ── LEFT: Inputs ──────────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Step 1 — Average Emoluments */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <StepBadge n="1" label="ശരാശരി വേതനം — Average Emoluments" />

              {/* Mode toggle */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { id: 'basic',  label: 'Basic Pay നൽകുക',    sub: 'Last month basic pay as AE' },
                  { id: 'manual', label: '10-Month Average',    sub: 'Calculate & enter manually' },
                ].map(t => (
                  <button key={t.id} onClick={() => setAeMode(t.id)}
                    className="flex flex-col items-start gap-0.5 p-3 rounded-xl transition-all text-left"
                    style={{
                      background: aeMode === t.id ? 'rgba(41,151,255,0.10)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${aeMode === t.id ? 'rgba(41,151,255,0.35)' : 'rgba(255,255,255,0.07)'}`,
                    }}>
                    <span className="text-[12px] font-bold"
                      style={{ color: aeMode === t.id ? '#2997ff' : 'rgba(255,255,255,0.45)', fontFamily: "'Meera', sans-serif" }}>
                      {t.label}
                    </span>
                    <span className="text-[10px] text-white/22">{t.sub}</span>
                  </button>
                ))}
              </div>

              {aeMode === 'manual' ? (
                <Input
                  label="10 മാസത്തെ ശരാശരി Basic Pay (₹)"
                  sub="(Sum of last 10 months Basic Pay) ÷ 10"
                  value={manualAE} onChange={setManualAE} min={5000} max={500000} step={100}
                />
              ) : (
                <Input
                  label="Last Month Basic Pay (₹)"
                  sub="Average Emoluments ആയി ഉപയോഗിക്കും"
                  value={basicPay} onChange={setBasicPay} min={5000} max={500000} step={500}
                />
              )}

              {/* AE scenarios reference */}
              <div className="mt-4 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">
                  Average Emoluments — 10 Month Rule
                </div>
                {AE_SCENARIOS.map(s => (
                  <div key={s.label} className="flex items-center justify-between py-1 text-[10px]">
                    <span className="text-white/45 font-semibold" style={{ fontFamily: "'Meera', sans-serif" }}>
                      {s.ml}
                    </span>
                    <span className="text-white/25">{s.note}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-white/[0.06] flex justify-between text-[12px]">
                <span className="text-white/40">Average Emoluments (AE)</span>
                <span className="font-black text-white">{fmt(avgEmoluments)}</span>
              </div>
            </div>

            {/* Step 2 — Qualifying Service */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <StepBadge n="2" label="യോഗ്യമായ സേവനം — Qualifying Service" />

              <div className="grid grid-cols-2 gap-3 mb-4">
                <Input label="Years (വർഷം)" value={years}  onChange={setYears}  min={0} max={40} />
                <Input label="Months (മാസം)" value={months} onChange={setMonths} min={0} max={11} />
              </div>

              {/* Rounding breakdown */}
              <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">
                  KSR Half-Year Rounding Applied
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/30">Full years</span>
                    <span className="text-white/55 font-semibold">{years} × 2 = {result.baseUnits} units</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/30">ബാക്കി {months} month(s)</span>
                    <span className="font-semibold" style={{ color: '#ff9f0a' }}>{result.roundingNote}</span>
                  </div>
                  <div className="flex justify-between text-[11px] pt-1.5 border-t border-white/[0.05] mt-1">
                    <span className="text-white/40 font-bold">Total Units Used</span>
                    <span className="font-black text-white">
                      {result.halfYears}{result.capped ? ` (60-ൽ Cap)` : ''}
                    </span>
                  </div>
                </div>
              </div>

              <ServiceBar halfYears={result.halfYears} />

              {/* Rounding rule reference */}
              <div className="mt-3 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">
                  Rounding Rules (KSR)
                </div>
                {[
                  { months: '< 3 months',  result: '0 units — Ignored' },
                  { months: '3–8 months',  result: '1 unit (½ year)' },
                  { months: '≥ 9 months',  result: '2 units (1 full year)' },
                  { months: 'Maximum',     result: '60 units = 30 years' },
                ].map(r => (
                  <div key={r.months} className="flex justify-between text-[10px] py-0.5">
                    <span className="text-white/25">{r.months}</span>
                    <span className="text-white/45 font-semibold">{r.result}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Results ────────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Eligibility warning */}
            {!result.eligible && (
              <div className="rounded-2xl px-5 py-4"
                style={{ background: 'rgba(255,69,58,0.07)', border: '1px solid rgba(255,69,58,0.22)' }}>
                <div className="text-[13px] font-bold text-red-400" style={{ fontFamily: "'Meera', sans-serif" }}>
                  പെൻഷൻ യോഗ്യതയില്ല — Minimum 10 years qualifying service ആവശ്യമാണ്
                </div>
                <div className="text-[11px] text-white/35 mt-1">
                  Current: {years}y {months}m — Need {Math.max(0, 10 - years)}y{months > 0 ? ` ${12 - months}m more` : ' more'}
                </div>
              </div>
            )}

            {/* Step 3 — Result */}
            <div className="rounded-2xl p-6"
              style={{ background: 'rgba(41,151,255,0.07)', border: '1px solid rgba(41,151,255,0.22)' }}>
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                    style={{ background: 'rgba(41,151,255,0.2)', color: '#2997ff' }}>3</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#2997ff]">
                    പ്രതിമാസ പെൻഷൻ — Basic Pension
                  </div>
                </div>
              </div>

              <div className="text-[52px] font-[900] leading-none tracking-tight text-white mt-3">
                {fmt(result.pension)}
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-[12px] text-white/35">
                  {result.pensionPct}% of AE
                  {result.maxReached && <span className="ml-1 font-bold" style={{ color: '#30d158' }}> — Maximum 50%</span>}
                </span>
                {result.isCapped && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,150,0,0.12)', color: '#ff9f0a' }}>
                    ⚠ ₹83,400 Ceiling Applied
                  </span>
                )}
                {result.isMinimum && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(48,209,88,0.12)', color: '#30d158' }}>
                    ↑ Minimum ₹9,000 Applied
                  </span>
                )}
              </div>

              {/* Formula trace */}
              <div className="mt-4 rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <div className="text-[10px] text-white/25 font-mono space-y-0.5">
                  <div>AE = {fmt(avgEmoluments)}</div>
                  <div>Units = {result.halfYears} ({result.effectiveYrs} yrs)</div>
                  <div className="text-white/40 pt-1 border-t border-white/[0.06] mt-1">
                    ({fmt(avgEmoluments)} × {result.halfYears}) ÷ 120 = {fmt(result.pensionRaw)}
                  </div>
                </div>
              </div>
            </div>

            {/* Full breakdown */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/25 mb-1">
                Complete Breakdown
              </div>

              <ResultRow label="ശരാശരി വേതനം (AE)"          value={fmt(avgEmoluments)}
                sub="Average of last 10 months Basic Pay" malayalam />
              <ResultRow label="Half-year Units"              value={`${result.halfYears} units (${result.effectiveYrs} yrs)`}
                sub={result.capped ? 'Capped at 60 (max 30 yrs)' : `${years} × 2 + ${result.extraUnits} extra`} />
              <ResultRow label="Pension (formula result)"     value={fmt(result.pensionRaw)}
                sub={`(AE × ${result.halfYears}) ÷ 120`} />
              <ResultRow label="Basic Monthly Pension"        value={fmt(result.pension)} color="#2997ff" bold />

              <div className="mt-2 pt-2 border-t border-white/[0.06]">
                <ResultRow label={`Dearness Relief @ ${CURRENT_DA}%`} value={fmt(result.daOnPension)} color="#64d2ff"
                  sub="DR on pension (current rate)" />
                <ResultRow label="Gross Monthly Pension"      value={fmt(result.grossPension)} color="#30d158" bold
                  sub="Basic Pension + DR" />
              </div>

              <div className="mt-2 pt-2 border-t border-white/[0.06]">
                <ResultRow label="Normal Family Pension (30%)" value={fmt(result.familyPension)} color="#ff9f0a"
                  sub="Spouse/dependant — after death" />
              </div>
            </div>

            {/* Annual cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Annual Basic',  value: fmtL(result.pension * 12),       color: '#2997ff' },
                { label: 'Annual Gross',  value: fmtL(result.grossPension * 12),   color: '#30d158' },
                { label: 'Annual Family', value: fmtL(result.familyPension * 12),  color: '#ff9f0a' },
              ].map(c => (
                <div key={c.label} className="rounded-2xl p-4 flex flex-col gap-1"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="text-[9px] font-black uppercase tracking-widest text-white/25">{c.label}</div>
                  <div className="text-[18px] font-black" style={{ color: c.color }}>{c.value}</div>
                </div>
              ))}
            </div>

            {/* KSR Rules reference */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3">
                KSR Part III — Key Rules
              </div>
              {[
                { label: 'Minimum qualifying service',  value: '10 years' },
                { label: 'Maximum qualifying service',  value: '30 years (60 units)' },
                { label: 'Pension formula',             value: '(AE × Units) ÷ 120' },
                { label: 'Maximum pension',             value: '50% of AE or ₹83,400' },
                { label: 'Minimum pension',             value: '₹9,000 / month' },
                { label: 'Normal family pension',       value: '30% of basic pension' },
                { label: 'Average Emoluments',          value: 'Last 10 months Basic Pay avg' },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-[11px] py-1">
                  <span className="text-white/28">{r.label}</span>
                  <span className="text-white/50 font-semibold">{r.value}</span>
                </div>
              ))}
              <div className="mt-3 pt-3 border-t border-white/[0.05]">
                <Link href="/pension-calculation"
                  className="text-[11px] font-bold no-underline transition-colors"
                  style={{ color: '#2997ff' }}>
                  Step-by-step guide with examples →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
