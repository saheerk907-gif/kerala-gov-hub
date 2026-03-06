'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

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

// ─── Core DCRG calculation ────────────────────────────────────────────────────
function calcDCRG({ basic, daRate, serviceYears, serviceMonths, retireType }) {
  const daAmt = Math.round(basic * daRate / 100);
  const le    = basic + daAmt;                         // Last Emoluments

  // Qualifying service in completed half-year (6-month) periods
  const totalMonths  = serviceYears * 12 + serviceMonths;
  const halfYears    = Math.floor(totalMonths / 6) + (totalMonths % 6 >= 3 ? 1 : 0);
  const cappedHalf   = Math.min(halfYears, 66);        // max 33 years = 66 half-years

  // Retirement DCRG
  const retireDCRG   = Math.ceil(le * cappedHalf / 4);

  // Death gratuity minimums (KSR Rule 77)
  let deathDCRG;
  if (totalMonths < 6) {
    deathDCRG = Math.ceil(le * 2);            // 2 months' LE
  } else if (totalMonths < 60) {              // < 5 years
    deathDCRG = Math.ceil(le * 6);            // 6 months' LE
  } else if (totalMonths < 240) {             // 5–20 years
    deathDCRG = Math.ceil(le * 12);           // 12 months' LE
  } else {
    deathDCRG = retireDCRG;                   // Normal formula
  }

  const dcrg = retireType === 'death' ? deathDCRG : retireDCRG;

  return {
    daAmt, le, halfYears, cappedHalf,
    retireDCRG, deathDCRG, dcrg,
    totalMonths,
    effectiveYears: (cappedHalf / 2).toFixed(1),
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = v => '₹' + v.toLocaleString('en-IN');

function GlassInput({ label, value, onChange, type = 'number', min, max, step = 1, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold uppercase tracking-widest text-white/40">{label}</label>
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
        {sub && <div className="text-[11px] text-white/30 mt-0.5">{sub}</div>}
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

  const halfYearDisplay = `${result.cappedHalf} half-years${result.halfYears > 66 ? ` (capped from ${result.halfYears})` : ''}`;

  return (
    <div className="relative min-h-screen bg-aurora overflow-x-hidden">

      <div className="max-w-[900px] mx-auto px-4 pt-[100px] pb-16">

        {/* Page title */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/35 hover:text-white/70 no-underline transition-colors mb-3">
            ← Back to Home
          </Link>
          <div className="section-label mb-2">Retirement Benefits</div>
          <h1 className="text-[clamp(22px,4vw,42px)] font-[900] tracking-[-0.03em] text-white leading-tight" style={{ fontFamily: "'Meera', sans-serif" }}>
            DCRG <span className="text-white/40">Calculator</span>
          </h1>
          <p className="text-[13px] text-white/40 mt-1">Death-cum-Retirement Gratuity — Kerala Service Rules (KSR Rule 77)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Left: Inputs ───────────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Type toggle */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-4">Gratuity Type</div>
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
              <div className="text-[11px] font-black uppercase tracking-widest text-white/30">Pay Details</div>

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
                  <label className="text-[11px] font-bold uppercase tracking-widest text-white/40">DA Rate (%)</label>
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
                    <span className="text-[10px] text-white/30">auto from date</span>
                  </div>
                )}
              </div>
            </div>

            {/* Service details */}
            <div className="rounded-2xl p-5 flex flex-col gap-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/30">Qualifying Service</div>
              <div className="grid grid-cols-2 gap-3">
                <GlassInput label="Years" value={serviceYears} onChange={setServiceYears} min={0} max={40} />
                <GlassInput label="Months" value={serviceMonths} onChange={setServiceMonths} min={0} max={11} />
              </div>
              <div className="text-[11px] text-white/30 leading-relaxed">
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
              <div className="text-[42px] font-[900] leading-none tracking-tight text-white mb-1">
                {fmt(result.dcrg)}
              </div>
              <div className="text-[12px] text-white/40 mt-2">
                {retireType === 'death'
                  ? result.totalMonths >= 240
                    ? 'Service ≥ 20 yrs — Normal formula applies'
                    : result.totalMonths >= 60
                      ? '5–20 yrs service → 12 months\' emoluments'
                      : result.totalMonths >= 6
                        ? '< 5 yrs service → 6 months\' emoluments'
                        : '< 6 months service → 2 months\' emoluments'
                  : `LE × ${result.cappedHalf} half-years ÷ 4`
                }
              </div>
            </div>

            {/* Breakdown */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-4">Calculation Breakdown</div>

              <ResultRow label="Last Basic Pay"  value={fmt(basic)} />
              <ResultRow label={`DA @ ${effectiveDA}%`} value={fmt(result.daAmt)} color="#2997ff" />
              <ResultRow label="Last Emoluments (LE)" value={fmt(result.le)} color="#64d2ff"
                sub="Basic Pay + DA" />
              <ResultRow label="Qualifying Half-Years (n)" value={halfYearDisplay}
                sub={`${serviceYears} yrs ${serviceMonths} mos → ${result.totalMonths} months`} />
              <ResultRow label="Formula" value={`LE × ${result.cappedHalf} ÷ 4`}
                sub={`= ${fmt(result.le)} × ${result.cappedHalf} ÷ 4`} />
              <ResultRow label="Retirement DCRG" value={fmt(result.retireDCRG)} color="#30d158" />
              {retireType === 'death' && (
                <ResultRow label="Death Gratuity (applied)" value={fmt(result.deathDCRG)} color="#c8960c" big />
              )}
            </div>

            {/* KSR Note */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/25 mb-3">KSR Rule 77 — Death Gratuity Minimums</div>
              <div className="flex flex-col gap-2">
                {[
                  { range: '< 6 months service',   amount: '2 months\' LE'  },
                  { range: '6 months – 5 years',    amount: '6 months\' LE'  },
                  { range: '5 years – 20 years',    amount: '12 months\' LE' },
                  { range: '20+ years',             amount: 'Normal DCRG formula' },
                ].map(row => (
                  <div key={row.range} className="flex justify-between text-[11px]">
                    <span className="text-white/35">{row.range}</span>
                    <span className="text-white/55 font-semibold">{row.amount}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] text-white/25 leading-relaxed">
                Max qualifying service = 33 years. Retirement DCRG = LE × n ÷ 4, where n = completed
                half-year periods (months ≥ 3 in a half-year period are rounded up).
              </div>
            </div>

            {/* DA reference table */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/25 mb-3">
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
      </div>
    </div>
  );
}
