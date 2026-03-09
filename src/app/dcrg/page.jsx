'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import FAQSection from '@/components/FAQSection';

const DCRG_FAQS = [
  {
    q: 'What is DCRG for Kerala government employees?',
    a: 'DCRG (Death-cum-Retirement Gratuity) is a lump sum payment made to a government employee on retirement, or to the family in case of death during service. It is governed by Rule 77 of Kerala Service Rules (KSR).',
  },
  {
    q: 'How is DCRG calculated in Kerala?',
    a: 'DCRG = (Last Month Emoluments ÷ 2) × Qualifying Service (in years). Last Month Emoluments includes Basic Pay + DA. Maximum DCRG payable is ₹14,00,000.',
  },
  {
    q: 'What is the maximum DCRG amount in Kerala?',
    a: 'The maximum DCRG payable to a Kerala government employee is ₹14,00,000 (Fourteen Lakh Rupees) as per the current rules.',
  },
  {
    q: 'Is DCRG different from Death Gratuity?',
    a: 'Yes. DCRG is paid on retirement after completing qualifying service. Death Gratuity is paid to the family when an employee dies in service. The calculation formula is similar but the conditions differ.',
  },
  {
    q: 'What is the minimum qualifying service for DCRG?',
    a: 'A minimum of 5 years of qualifying service is required to be eligible for DCRG on retirement. For Death Gratuity (death in service), there is no minimum service requirement.',
  },
  {
    q: 'Is DCRG taxable in Kerala?',
    a: 'Gratuity received by government employees is fully exempt from income tax under Section 10(10)(i) of the Income Tax Act. There is no tax liability on DCRG.',
  },
];

// ─── DA Rate lookup by retirement date (11th PRC, effective from 01-07-2019) ──
// Source: Kerala Finance Dept G.O.s
const DA_TABLE_11TH = [
  { from: '2019-07', rate: 2  },
  { from: '2020-01', rate: 5  },
  { from: '2020-07', rate: 8  },
  { from: '2021-01', rate: 9  },
  { from: '2021-07', rate: 12 },
  { from: '2022-01', rate: 15 },
  { from: '2022-07', rate: 18 },
  { from: '2023-01', rate: 22 },
  { from: '2023-07', rate: 25 },
  { from: '2024-01', rate: 28 },
  { from: '2024-07', rate: 31 },
  { from: '2025-01', rate: 33 },
  { from: '2025-07', rate: 35 },
];

// 10th PRC DA rates (effective from 01-07-2014)
const DA_TABLE_10TH = [
  { from: '2014-07', rate: 0  },
  { from: '2015-01', rate: 2  },
  { from: '2015-07', rate: 5  },
  { from: '2016-01', rate: 8  },
  { from: '2016-07', rate: 12 },
  { from: '2017-01', rate: 15 },
  { from: '2017-07', rate: 20 },
  { from: '2018-01', rate: 26 },
  { from: '2018-07', rate: 32 },
  { from: '2019-01', rate: 38 },
  { from: '2019-07', rate: 45 },
];

function getDARate(retireDate, prc) {
  const ym = retireDate.slice(0, 7); // "YYYY-MM"
  const table = prc === '10th' ? DA_TABLE_10TH : DA_TABLE_11TH;
  let rate = table[0].rate;
  for (const row of table) {
    if (ym >= row.from) rate = row.rate;
    else break;
  }
  return rate;
}

const MAX_DCRG = 2000000; // ₹20 lakhs current ceiling

// ─── Core DCRG calculation ────────────────────────────────────────────────────
function calcDCRG({ basic, daRate, serviceYears, serviceMonths, retireType }) {
  const daAmt = Math.round(basic * daRate / 100);
  const le    = basic + daAmt;                         // Last Emoluments (monthly)

  // Qualifying service rounding:
  // If remaining months > 6 (i.e., 6 months + 1 day or more), round up to next full year
  const qualifyingYears = Math.min(serviceYears + (serviceMonths > 6 ? 1 : 0), 33);
  const totalMonths     = serviceYears * 12 + serviceMonths;
  const totalYears      = serviceYears + serviceMonths / 12;

  // Eligible for retirement DCRG only if qualifying service >= 5 years
  const eligible = totalYears >= 5;

  // Retirement DCRG = LE × qualifying_years / 2, capped at ₹20L
  const retireDCRGRaw = Math.ceil(le * qualifyingYears / 2);
  const retireDCRG    = eligible ? Math.min(retireDCRGRaw, MAX_DCRG) : 0;

  // Death Gratuity (KSR Rule 77) — no minimum service requirement
  let deathDCRGRaw;
  if (totalYears < 1) {
    deathDCRGRaw = le * 2;                        // < 1 year  → 2 months' LE
  } else if (totalYears < 5) {
    deathDCRGRaw = le * 6;                        // 1–5 yrs   → 6 months' LE
  } else if (totalYears < 20) {
    deathDCRGRaw = le * 12;                       // 5–20 yrs  → 12 months' LE
  } else {
    // 20+ yrs: ½ month per year (min 12×, max 16.5×)
    const formula = le * qualifyingYears / 2;
    deathDCRGRaw  = Math.max(le * 12, Math.min(formula, le * 16.5));
  }
  const deathDCRG = Math.min(Math.ceil(deathDCRGRaw), MAX_DCRG);

  const dcrg = retireType === 'death' ? deathDCRG : retireDCRG;

  return {
    daAmt, le, qualifyingYears, totalMonths, eligible,
    retireDCRG, deathDCRG, dcrg,
    cappedAt20L: retireType === 'death'
      ? Math.ceil(deathDCRGRaw) > MAX_DCRG
      : retireDCRGRaw > MAX_DCRG,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = v => '₹' + v.toLocaleString('en-IN');

function GlassInput({ label, value, onChange, type = 'number', min, max, step = 1, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold uppercase tracking-widest text-white/60">{label}</label>
      {children ?? (
        <input
          type={type}
          value={value}
          onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          min={min} max={max} step={step}
          className="w-full rounded-xl px-3 py-2.5 text-white text-sm font-semibold outline-none focus:ring-1 focus:ring-white/20"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
        />
      )}
    </div>
  );
}

function ResultRow({ label, value, color, big, sub }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/[0.05] last:border-0">
      <div>
        <div className="text-[13px] text-white/60">{label}</div>
        {sub && <div className="text-[11px] text-white/50 mt-0.5">{sub}</div>}
      </div>
      <div className={`font-black whitespace-nowrap ${big ? 'text-[22px]' : 'text-[16px]'}`} style={{ color: color ?? '#fff' }}>
        {value}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DCRGPage() {
  const [basic,         setBasic]         = useState(30000);
  const [prc,           setPrc]           = useState('11th');
  const [manualDA,      setManualDA]      = useState(false);
  const [daRate,        setDaRate]        = useState(35);
  const [retireDate,    setRetireDate]    = useState('2025-07-31');
  const [serviceYears,  setServiceYears]  = useState(30);
  const [serviceMonths, setServiceMonths] = useState(0);
  const [retireType,    setRetireType]    = useState('retirement');

  // Auto DA from date
  const autoDA = useMemo(() => {
    if (!retireDate) return 35;
    return getDARate(retireDate, prc);
  }, [retireDate, prc]);

  const effectiveDA = manualDA ? daRate : autoDA;

  const result = useMemo(() => calcDCRG({
    basic, daRate: effectiveDA, serviceYears, serviceMonths, retireType,
  }), [basic, effectiveDA, serviceYears, serviceMonths, retireType]);

  const qualifyingDisplay = `${result.qualifyingYears} yrs${serviceMonths > 6 ? ` (rounded up from ${serviceYears}y ${serviceMonths}m)` : serviceMonths === 6 ? ` + 6m (not rounded)` : serviceMonths > 0 ? ` + ${serviceMonths}m` : ''}`;

  return (
    <div className="relative min-h-screen bg-aurora overflow-x-hidden">

      <div className="max-w-[900px] mx-auto px-4 pt-[100px] pb-16">

        {/* Page title */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/55 hover:text-white/70 no-underline transition-colors mb-3">
            ← Back to Home
          </Link>
          <div className="section-label mb-2">Retirement Benefits</div>
          <h1 className="text-[clamp(22px,4vw,42px)] font-[900] tracking-[-0.03em] text-white leading-tight" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            DCRG <span className="text-white/60">Calculator</span>
          </h1>
          <p className="text-[13px] text-white/60 mt-1">Death-cum-Retirement Gratuity — Kerala Service Rules (KSR Rule 77)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Left: Inputs ───────────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Type toggle */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-4">Gratuity Type</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'retirement', label: 'Retirement DCRG', icon: '🎖️' },
                  { id: 'death',      label: 'Death Gratuity',   icon: '🕊️' },
                ].map(t => (
                  <button key={t.id} onClick={() => setRetireType(t.id)}
                    className="flex flex-col items-center gap-1.5 p-3.5 rounded-xl text-[12px] font-bold transition-all"
                    style={{
                      background: retireType === t.id ? 'rgba(200,150,12,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${retireType === t.id ? 'rgba(200,150,12,0.4)' : 'rgba(255,255,255,0.08)'}`,
                      color: retireType === t.id ? '#c8960c' : 'rgba(255,255,255,0.4)',
                    }}>
                    <span className="text-xl">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pay details */}
            <div className="rounded-2xl p-5 flex flex-col gap-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/50">Pay Details</div>

              <GlassInput label="Last Basic Pay (₹)" value={basic} onChange={setBasic} min={10000} max={300000} step={500} />

              {/* PRC selector */}
              <GlassInput label="Pay Commission">
                <div className="grid grid-cols-2 gap-2">
                  {['11th', '10th'].map(p => (
                    <button key={p} onClick={() => setPrc(p)}
                      className="py-2.5 rounded-xl text-[12px] font-bold transition-all"
                      style={{
                        background: prc === p ? 'rgba(41,151,255,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${prc === p ? 'rgba(41,151,255,0.35)' : 'rgba(255,255,255,0.08)'}`,
                        color: prc === p ? '#2997ff' : 'rgba(255,255,255,0.4)',
                      }}>
                      {p} PRC
                    </button>
                  ))}
                </div>
              </GlassInput>

              {/* Date of retirement */}
              <GlassInput label={retireType === 'death' ? 'Date of Death' : 'Date of Retirement'} value={retireDate} onChange={setRetireDate} type="date">
                <input
                  type="date"
                  value={retireDate}
                  onChange={e => setRetireDate(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-white text-sm font-semibold outline-none focus:ring-1 focus:ring-white/20"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', colorScheme: 'dark' }}
                />
              </GlassInput>

              {/* DA display + override */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-white/60">DA Rate (%)</label>
                  <button
                    onClick={() => setManualDA(v => !v)}
                    className="text-[10px] font-bold transition-colors"
                    style={{ color: manualDA ? '#ff9f0a' : 'rgba(255,255,255,0.3)' }}>
                    {manualDA ? 'Manual ✓' : 'Auto (edit?)'}
                  </button>
                </div>
                {manualDA ? (
                  <input
                    type="number" value={daRate} onChange={e => setDaRate(Number(e.target.value))}
                    min={0} max={100}
                    className="w-full rounded-xl px-3 py-2.5 text-white text-sm font-semibold outline-none focus:ring-1 focus:ring-white/20"
                    style={{ background: 'rgba(255,150,0,0.08)', border: '1px solid rgba(255,150,0,0.25)' }}
                  />
                ) : (
                  <div className="rounded-xl px-3 py-2.5 text-sm font-bold flex items-center justify-between"
                    style={{ background: 'rgba(41,151,255,0.08)', border: '1px solid rgba(41,151,255,0.2)' }}>
                    <span style={{ color: '#2997ff' }}>{autoDA}%</span>
                    <span className="text-[10px] text-white/50">auto from date</span>
                  </div>
                )}
              </div>
            </div>

            {/* Service details */}
            <div className="rounded-2xl p-5 flex flex-col gap-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/50">Qualifying Service</div>
              <div className="grid grid-cols-2 gap-3">
                <GlassInput label="Years" value={serviceYears} onChange={setServiceYears} min={0} max={40} />
                <GlassInput label="Months" value={serviceMonths} onChange={setServiceMonths} min={0} max={11} />
              </div>
              <div className="text-[11px] text-white/50 leading-relaxed">
                Maximum qualifying service for DCRG: <strong className="text-white/50">33 years (66 half-years)</strong>.
                Months ≥ 3 in any half-year period are counted as a full half-year.
              </div>
            </div>
          </div>

          {/* ── Right: Results ──────────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Main result */}
            <div className="rounded-2xl p-6"
              style={{ background: 'rgba(200,150,12,0.08)', border: '1px solid rgba(200,150,12,0.25)' }}>
              <div className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: '#c8960c' }}>
                {retireType === 'death' ? 'Death Gratuity' : 'DCRG Amount'}
              </div>

              {retireType === 'retirement' && !result.eligible ? (
                <div className="text-[16px] font-bold text-red-400 mt-2">
                  Not eligible — minimum 5 years qualifying service required
                </div>
              ) : (
                <>
                  <div className="text-[42px] font-[900] leading-none tracking-tight text-white mb-1">
                    {fmt(result.dcrg)}
                  </div>
                  {result.cappedAt20L && (
                    <div className="text-[11px] font-bold mt-1" style={{ color: '#ff9f0a' }}>
                      ⚠ Capped at ₹20,00,000 (maximum limit)
                    </div>
                  )}
                  <div className="text-[12px] text-white/60 mt-2">
                    {retireType === 'death'
                      ? result.totalMonths < 12
                        ? '< 1 year service → 2 months\' emoluments'
                        : result.totalMonths < 60
                          ? '1–5 yrs service → 6 months\' emoluments'
                          : result.totalMonths < 240
                            ? '5–20 yrs service → 12 months\' emoluments'
                            : '20+ yrs — ½ month/year (min 12×, max 16.5×)'
                      : `LE × ${result.qualifyingYears} yrs ÷ 2`
                    }
                  </div>
                </>
              )}
            </div>

            {/* Breakdown */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-4">Calculation Breakdown</div>

              <ResultRow label="Last Basic Pay"  value={fmt(basic)} />
              <ResultRow label={`DA @ ${effectiveDA}%`} value={fmt(result.daAmt)} color="#2997ff" />
              <ResultRow label="Last Emoluments (LE)" value={fmt(result.le)} color="#64d2ff"
                sub="Basic Pay + DA" />
              <ResultRow label="Qualifying Service" value={qualifyingDisplay}
                sub={`6m+1day rule applies${result.qualifyingYears === 33 ? ' · capped at 33 yrs' : ''}`} />
              <ResultRow label="Formula" value={`LE × ${result.qualifyingYears} ÷ 2`}
                sub={`= ${fmt(result.le)} × ${result.qualifyingYears} ÷ 2`} />
              <ResultRow label="Retirement DCRG" value={fmt(result.retireDCRG)} color="#30d158" />
              {retireType === 'death' && (
                <ResultRow label="Death Gratuity (applied)" value={fmt(result.deathDCRG)} color="#c8960c" big />
              )}
            </div>

            {/* KSR Note */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/45 mb-3">KSR Rule 77 — DCRG Rules</div>
              <div className="flex flex-col gap-2 mb-4">
                <div className="text-[11px] font-bold text-white/60 mb-1">Death Gratuity (no min service required)</div>
                {[
                  { range: '< 1 year service',   amount: '2 × monthly LE'  },
                  { range: '1 – 5 years',         amount: '6 × monthly LE'  },
                  { range: '5 – 20 years',         amount: '12 × monthly LE' },
                  { range: '20+ years',            amount: 'LE × yrs ÷ 2 (min 12×, max 16.5×)' },
                ].map(row => (
                  <div key={row.range} className="flex justify-between text-[11px]">
                    <span className="text-white/55">{row.range}</span>
                    <span className="text-white/55 font-semibold">{row.amount}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-white/[0.06] flex flex-col gap-1.5">
                <div className="text-[11px] font-bold text-white/60 mb-1">Retirement DCRG</div>
                {[
                  { label: 'Formula',            value: 'LE × qualifying years ÷ 2' },
                  { label: 'Min qualifying svc', value: '5 years' },
                  { label: 'Max qualifying svc', value: '33 years' },
                  { label: 'Max DCRG amount',    value: '₹20,00,000' },
                  { label: 'Service rounding',   value: '6 months + 1 day → full year' },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-[11px]">
                    <span className="text-white/50">{r.label}</span>
                    <span className="text-white/55 font-semibold">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DA reference table */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/45 mb-3">
                {prc} PRC — DA Rate Reference
              </div>
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
                {(prc === '11th' ? DA_TABLE_11TH : DA_TABLE_10TH).map(row => (
                  <div key={row.from} className="flex justify-between text-[11px] py-0.5"
                    style={{ color: row.rate === effectiveDA ? '#c8960c' : 'rgba(255,255,255,0.3)' }}>
                    <span>From {row.from}</span>
                    <span className="font-bold">{row.rate}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <FAQSection faqs={DCRG_FAQS} accentColor="#c8960c" />

      </div>
    </div>
  );
}
