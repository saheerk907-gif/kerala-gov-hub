'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_PENSION       = 83400;   // Current Kerala maximum pension ceiling (11th PRC)
const FAMILY_PENSION_PC = 30;      // Family pension = 30% of basic pension
const CURRENT_DA        = 35;      // Current DA % on pension (as of 2025-07)

// ─── Core pension calculation (KSR Part III) ─────────────────────────────────
function calcPension({ basicPay, personalPay, specialPay, serviceYears, serviceMonths }) {
  // Average Emoluments = Basic + Personal Pay + Special Pay
  const avgEmoluments = basicPay + personalPay + specialPay;

  // ── Qualifying Service in half-year units ────────────────────────────────
  // Rounding rules (KSR):
  //   < 3 months   → ignored (0 extra units)
  //   3–8 months   → 1 half-year unit
  //   ≥ 9 months   → 2 half-year units (counts as full year)
  const baseUnits = serviceYears * 2;
  let extraUnits  = 0;
  let roundingNote = '';
  if (serviceMonths < 3) {
    extraUnits   = 0;
    roundingNote = `${serviceMonths} month(s) < 3 — ignored`;
  } else if (serviceMonths < 9) {
    extraUnits   = 1;
    roundingNote = `${serviceMonths} months → 1 half-year unit`;
  } else {
    extraUnits   = 2;
    roundingNote = `${serviceMonths} months ≥ 9 → rounded to 1 full year`;
  }

  const rawUnits     = baseUnits + extraUnits;
  const halfYears    = Math.min(rawUnits, 60);   // capped at 60 (30 years)
  const cappedNote   = rawUnits > 60 ? `Capped from ${rawUnits} to 60 (max 30 years)` : '';

  // ── Pension formula ───────────────────────────────────────────────────────
  // Monthly Pension = (Average Emoluments × Half-year units) ÷ 120
  const pensionRaw     = Math.round((avgEmoluments * halfYears) / 120);
  const pensionCapped  = Math.min(pensionRaw, MAX_PENSION);
  const isCapped       = pensionRaw > MAX_PENSION;

  // Minimum pension = ₹9,000/month (Kerala minimum)
  const pension        = Math.max(pensionCapped, 9000);
  const isMinimum      = pensionCapped < 9000;

  // ── Family pension ────────────────────────────────────────────────────────
  const familyPension  = Math.round(pension * FAMILY_PENSION_PC / 100);

  // ── DA on pension ─────────────────────────────────────────────────────────
  const daOnPension    = Math.round(pension * CURRENT_DA / 100);
  const grossPension   = pension + daOnPension;

  // ── Qualifying years display ──────────────────────────────────────────────
  const effectiveYears = (halfYears / 2).toFixed(1);

  // ── Eligibility ───────────────────────────────────────────────────────────
  const totalYears     = serviceYears + serviceMonths / 12;
  const eligible       = totalYears >= 10;

  return {
    avgEmoluments, halfYears, rawUnits, roundingNote, cappedNote,
    pensionRaw, pension, isCapped, isMinimum,
    familyPension, daOnPension, grossPension,
    effectiveYears, eligible, totalYears,
    maxPcAchieved: halfYears === 60,
    pensionPercent: ((halfYears / 120) * 100).toFixed(1),
  };
}

const fmt  = v => '₹' + Math.round(v).toLocaleString('en-IN');
const fmtL = v => '₹' + (v / 100000).toFixed(2) + 'L';

function GlassInput({ label, value, onChange, min = 0, max, step = 1, note }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold uppercase tracking-widest text-white/40">{label}</label>
      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        min={min} max={max} step={step}
        className="w-full rounded-xl px-3 py-2.5 text-white text-sm font-semibold outline-none focus:ring-1 focus:ring-white/20"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
      />
      {note && <div className="text-[10px] text-white/25 leading-snug">{note}</div>}
    </div>
  );
}

function Row({ label, value, color, sub, bold }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5 border-b border-white/[0.05] last:border-0">
      <div>
        <div className={`text-[13px] ${bold ? 'font-bold text-white/80' : 'text-white/55'}`}>{label}</div>
        {sub && <div className="text-[10px] text-white/30 mt-0.5">{sub}</div>}
      </div>
      <div className={`font-black whitespace-nowrap ${bold ? 'text-[18px]' : 'text-[15px]'} text-white`} style={color ? { color } : {}}>
        {value}
      </div>
    </div>
  );
}

// ─── Pension breakdown bar ────────────────────────────────────────────────────
function ServiceBar({ halfYears }) {
  const pct = (halfYears / 60) * 100;
  return (
    <div>
      <div className="flex justify-between text-[10px] text-white/30 mb-1.5">
        <span>0 yrs</span>
        <span className="text-white/50 font-bold">{(halfYears / 2).toFixed(1)} yrs ({pct.toFixed(0)}% of max)</span>
        <span>30 yrs (max)</span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: pct >= 100 ? '#30d158' : 'linear-gradient(90deg, #2997ff, #30d158)' }}
        />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PensionPage() {
  const [basicPay,      setBasicPay]      = useState(50000);
  const [personalPay,   setPersonalPay]   = useState(0);
  const [specialPay,    setSpecialPay]    = useState(0);
  const [serviceYears,  setServiceYears]  = useState(25);
  const [serviceMonths, setServiceMonths] = useState(0);
  const [useAvgMode,    setUseAvgMode]    = useState(false); // toggle: direct basic vs 10-month avg entry
  const [avgEntry,      setAvgEntry]      = useState(50000);

  const effectiveBasic = useAvgMode ? avgEntry : basicPay;

  const result = useMemo(() => calcPension({
    basicPay:    effectiveBasic,
    personalPay, specialPay,
    serviceYears, serviceMonths,
  }), [effectiveBasic, personalPay, specialPay, serviceYears, serviceMonths]);

  return (
    <div className="relative min-h-screen bg-aurora overflow-x-hidden">
      <div className="max-w-[1000px] mx-auto px-4 pt-[100px] pb-16">

        {/* Title */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/35 hover:text-white/70 no-underline transition-colors mb-3">
            ← Back to Home
          </Link>
          <div className="section-label mb-2">Retirement Benefits</div>
          <h1 className="text-[clamp(22px,4vw,42px)] font-[900] tracking-[-0.03em] text-white leading-tight" style={{ fontFamily: "'Meera', sans-serif" }}>
            പെൻഷൻ <span className="text-white/40">Calculator</span>
          </h1>
          <p className="text-[13px] text-white/40 mt-1">Kerala Service Rules Part III — Monthly Pension Calculation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Inputs (left 2 cols) ──────────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Emoluments mode toggle */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-4">Average Emoluments</div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { id: false, label: 'Enter Basic Pay',      sub: 'Auto-use as AE' },
                  { id: true,  label: '10-Month Average',     sub: 'Enter manually' },
                ].map(t => (
                  <button key={String(t.id)} onClick={() => setUseAvgMode(t.id)}
                    className="flex flex-col items-start gap-0.5 p-3 rounded-xl transition-all text-left"
                    style={{
                      background: useAvgMode === t.id ? 'rgba(41,151,255,0.12)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${useAvgMode === t.id ? 'rgba(41,151,255,0.35)' : 'rgba(255,255,255,0.08)'}`,
                    }}>
                    <span className="text-[12px] font-bold" style={{ color: useAvgMode === t.id ? '#2997ff' : 'rgba(255,255,255,0.5)' }}>{t.label}</span>
                    <span className="text-[10px] text-white/25">{t.sub}</span>
                  </button>
                ))}
              </div>

              {useAvgMode ? (
                <GlassInput
                  label="10-Month Average Basic Pay (₹)"
                  value={avgEntry} onChange={setAvgEntry} min={5000} max={300000} step={100}
                  note="Sum of last 10 months' basic pay ÷ 10"
                />
              ) : (
                <>
                  <GlassInput
                    label="Last Basic Pay (₹)"
                    value={basicPay} onChange={setBasicPay} min={5000} max={300000} step={500}
                    note="Used as Average Emoluments (simplified)"
                  />
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <GlassInput label="Personal Pay (₹)" value={personalPay} onChange={setPersonalPay} min={0} max={50000} step={100} />
                    <GlassInput label="Special Pay (₹)"  value={specialPay}  onChange={setSpecialPay}  min={0} max={50000} step={100} />
                  </div>
                </>
              )}

              <div className="mt-4 pt-3 border-t border-white/[0.06]">
                <div className="flex justify-between text-[12px]">
                  <span className="text-white/40">Average Emoluments (AE)</span>
                  <span className="font-black text-white">{fmt(result.avgEmoluments)}</span>
                </div>
              </div>
            </div>

            {/* Qualifying Service */}
            <div className="rounded-2xl p-5 flex flex-col gap-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/30">Qualifying Service</div>

              <div className="grid grid-cols-2 gap-3">
                <GlassInput label="Years" value={serviceYears} onChange={setServiceYears} min={0} max={40} />
                <GlassInput label="Months" value={serviceMonths} onChange={setServiceMonths} min={0} max={11} />
              </div>

              {/* Rounding display */}
              <div className="rounded-xl p-3 flex flex-col gap-1" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-1">KSR Rounding Applied</div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-white/35">Full years</span>
                  <span className="text-white/60 font-semibold">{serviceYears} × 2 = {serviceYears * 2} units</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-white/35">Remaining months</span>
                  <span className="font-semibold" style={{ color: '#ff9f0a' }}>{result.roundingNote}</span>
                </div>
                <div className="flex justify-between text-[11px] pt-1 border-t border-white/[0.06] mt-1">
                  <span className="text-white/40 font-bold">Total half-year units</span>
                  <span className="font-black text-white">{result.halfYears}{result.rawUnits > 60 ? ` (capped)` : ''}</span>
                </div>
              </div>

              <ServiceBar halfYears={result.halfYears} />

              {/* Rounding reference */}
              <div className="rounded-xl p-3 text-[10px] flex flex-col gap-1.5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="font-black uppercase tracking-widest text-white/20 mb-1">KSR Half-Year Rounding Rules</div>
                {[
                  { rule: '< 3 months',    result: 'Ignored (0 units)' },
                  { rule: '3–8 months',    result: '→ 1 unit (½ year)' },
                  { rule: '≥ 9 months',    result: '→ 2 units (1 year)' },
                  { rule: 'Max service',   result: '30 yrs = 60 units' },
                ].map(r => (
                  <div key={r.rule} className="flex justify-between">
                    <span className="text-white/30">{r.rule}</span>
                    <span className="text-white/50 font-semibold">{r.result}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Results (right 3 cols) ────────────────────────────────────── */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Eligibility check */}
            {!result.eligible && (
              <div className="rounded-2xl px-5 py-4"
                style={{ background: 'rgba(255,69,58,0.08)', border: '1px solid rgba(255,69,58,0.25)' }}>
                <div className="text-[13px] font-bold text-red-400">
                  Not eligible — minimum 10 years qualifying service required
                </div>
                <div className="text-[11px] text-white/40 mt-1">
                  Current service: {result.totalYears.toFixed(1)} years
                </div>
              </div>
            )}

            {/* Main pension result */}
            <div className="rounded-2xl p-6"
              style={{ background: 'rgba(41,151,255,0.08)', border: '1px solid rgba(41,151,255,0.25)' }}>
              <div className="text-[11px] font-black uppercase tracking-widest text-[#2997ff] mb-2">Monthly Basic Pension</div>
              <div className="text-[48px] font-[900] leading-none tracking-tight text-white">
                {fmt(result.pension)}
              </div>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="text-[12px] text-white/40">
                  {result.pensionPercent}% of AE
                  {result.maxPcAchieved && <span className="ml-1 text-[#30d158] font-bold"> (Maximum 50%)</span>}
                </span>
                {result.isCapped && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,150,0,0.15)', color: '#ff9f0a' }}>
                    ⚠ Capped at {fmt(MAX_PENSION)}
                  </span>
                )}
                {result.isMinimum && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(48,209,88,0.15)', color: '#30d158' }}>
                    ↑ Minimum pension applied
                  </span>
                )}
              </div>
              <div className="text-[12px] text-white/30 mt-1">
                Formula: AE × {result.halfYears} units ÷ 120 = {fmt(result.pensionRaw)}
              </div>
            </div>

            {/* All figures */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-1">Complete Breakdown</div>

              <Row label="Average Emoluments (AE)"   value={fmt(result.avgEmoluments)} sub="Basic + Personal + Special Pay" />
              <Row label="Qualifying Half-Year Units" value={`${result.halfYears} units (${result.effectiveYears} yrs)`}
                sub={result.cappedNote || `${serviceYears} yrs × 2 + ${result.halfYears - serviceYears * 2} extra`} />
              <Row label="Pension (formula)"          value={fmt(result.pensionRaw)}
                sub={`AE × ${result.halfYears} ÷ 120`} />
              <Row label="Basic Monthly Pension"      value={fmt(result.pension)} color="#2997ff" bold />

              <div className="mt-2 pt-2 border-t border-white/[0.06]">
                <Row label={`DA on Pension @ ${CURRENT_DA}%`} value={fmt(result.daOnPension)} color="#64d2ff"
                  sub="Current DA rate" />
                <Row label="Gross Monthly Pension"   value={fmt(result.grossPension)} color="#30d158" bold
                  sub="Basic Pension + DA" />
              </div>

              <div className="mt-2 pt-2 border-t border-white/[0.06]">
                <Row label="Family Pension (30%)"    value={fmt(result.familyPension)} color="#ff9f0a"
                  sub="Payable to spouse/dependant after death" />
              </div>
            </div>

            {/* Annual figures */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Annual Basic Pension', value: fmtL(result.pension * 12),      color: '#2997ff' },
                { label: 'Annual Gross Pension', value: fmtL(result.grossPension * 12), color: '#30d158' },
                { label: 'Annual Family Pension', value: fmtL(result.familyPension * 12), color: '#ff9f0a' },
              ].map(c => (
                <div key={c.label} className="rounded-2xl p-4 flex flex-col gap-1"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">{c.label}</div>
                  <div className="text-[20px] font-black" style={{ color: c.color }}>{c.value}</div>
                </div>
              ))}
            </div>

            {/* Pension ceiling info */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/25 mb-3">KSR Part III — Key Rules</div>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Minimum qualifying service', value: '10 years' },
                  { label: 'Maximum qualifying service', value: '30 years (60 units)' },
                  { label: 'Pension formula',            value: 'AE × half-year units ÷ 120' },
                  { label: 'Maximum pension',            value: '50% of AE or ₹83,400' },
                  { label: 'Minimum pension',            value: '₹9,000/month' },
                  { label: 'Family pension',             value: '30% of basic pension' },
                  { label: 'Emoluments for pension',     value: 'Basic + Personal + Special Pay' },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-[11px]">
                    <span className="text-white/30">{r.label}</span>
                    <span className="text-white/55 font-semibold">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
