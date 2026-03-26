'use client';
import { useState, useMemo, useEffect } from 'react';
import SectionHeader from '@/components/SectionHeader';
import AnimatedNumber from '@/components/AnimatedNumber';

// ─── DA Rate lookup by retirement date ───────────────────────────────────────
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
  const ym = retireDate.slice(0, 7);
  const table = prc === '10th' ? DA_TABLE_10TH : DA_TABLE_11TH;
  let rate = table[0].rate;
  for (const row of table) {
    if (ym >= row.from) rate = row.rate;
    else break;
  }
  return rate;
}

const MAX_DCRG = 2000000;

function calcDCRG({ basic, daRate, serviceYears, serviceMonths, retireType }) {
  const daAmt = Math.round(basic * daRate / 100);
  const le    = basic + daAmt;

  const qualifyingYears = Math.min(serviceYears + (serviceMonths > 6 ? 1 : 0), 33);
  const totalMonths     = serviceYears * 12 + serviceMonths;
  const totalYears      = serviceYears + serviceMonths / 12;

  const eligible = totalYears >= 5;

  const retireDCRGRaw = Math.ceil(le * qualifyingYears / 2);
  const retireDCRG    = eligible ? Math.min(retireDCRGRaw, MAX_DCRG) : 0;

  let deathDCRGRaw;
  if (totalYears < 1) {
    deathDCRGRaw = le * 2;
  } else if (totalYears < 5) {
    deathDCRGRaw = le * 6;
  } else if (totalYears < 20) {
    deathDCRGRaw = le * 12;
  } else {
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

const fmt = v => '₹' + v.toLocaleString('en-IN');

const inputCls = 'bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#ff9f0a]/50 focus:bg-white/[0.09] transition-all w-full';

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

export default function DcrgCalculator() {
  const [basic,         setBasic]         = useState(30000);
  const [prc,           setPrc]           = useState('11th');
  const [manualDA,      setManualDA]      = useState(false);
  const [daRate,        setDaRate]        = useState(35);
  const [retireDate,    setRetireDate]    = useState('2025-07-31');
  const [serviceYears,  setServiceYears]  = useState(30);
  const [serviceMonths, setServiceMonths] = useState(0);
  const [retireType,    setRetireType]    = useState('retirement');
  const [animKey, setAnimKey] = useState(0);
  useEffect(() => { setAnimKey(1); }, []);

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
    <div className="space-y-6">

      {/* ── Retirement Details ── */}
      <div className="glass-card rounded-2xl p-6">
        <SectionHeader title="Retirement Details" />

        <div className="mb-5">
          <label className="text-xs text-white/60 font-medium mb-2 block">Gratuity Type</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'retirement', label: 'Retirement DCRG', icon: '🎖️' },
              { id: 'death',      label: 'Death Gratuity',   icon: '🕊️' },
            ].map(t => (
              <button key={t.id} onClick={() => setRetireType(t.id)}
                className={`flex items-center gap-2 p-3.5 rounded-xl text-[12px] font-bold transition-all border ${
                  retireType === t.id
                    ? 'bg-[#ff9f0a]/15 border-[#ff9f0a]/50 text-white'
                    : 'bg-white/[0.04] border-white/10 text-white/50 hover:border-white/20'
                }`}>
                <span className="text-xl">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-white/60 font-medium mb-2 block">
            {retireType === 'death' ? 'Date of Death' : 'Date of Retirement'}
          </label>
          <input
            type="date"
            value={retireDate}
            onChange={e => setRetireDate(e.target.value)}
            className={inputCls}
            style={{ colorScheme: 'dark' }}
          />
        </div>
      </div>

      {/* ── Salary Details ── */}
      <div className="glass-card rounded-2xl p-6">
        <SectionHeader title="Salary Details" />
        <div className="flex flex-col gap-4">

          <div>
            <label className="text-xs text-white/60 font-medium mb-2 block">Last Basic Pay (₹)</label>
            <input
              type="number"
              value={basic}
              onChange={e => setBasic(Number(e.target.value))}
              min={10000} max={300000} step={500}
              className={inputCls}
            />
          </div>

          <div>
            <label className="text-xs text-white/60 font-medium mb-2 block">Pay Commission</label>
            <div className="grid grid-cols-2 gap-2">
              {['11th', '10th'].map(p => (
                <button key={p} onClick={() => setPrc(p)}
                  className={`py-2.5 rounded-xl text-[12px] font-bold transition-all border ${
                    prc === p
                      ? 'bg-[#ff9f0a]/15 border-[#ff9f0a]/50 text-white'
                      : 'bg-white/[0.04] border-white/10 text-white/50 hover:border-white/20'
                  }`}>
                  {p} PRC
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-white/60 font-medium">DA Rate (%)</label>
              <button
                onClick={() => setManualDA(v => !v)}
                className="text-[10px] font-bold transition-colors"
                style={{ color: manualDA ? '#ff9f0a' : 'var(--text-ghost)' }}>
                {manualDA ? 'Manual ✓' : 'Auto (edit?)'}
              </button>
            </div>
            {manualDA ? (
              <input
                type="number" value={daRate} onChange={e => setDaRate(Number(e.target.value))}
                min={0} max={100}
                className={inputCls}
                style={{ background: 'rgba(255,150,0,0.08)', border: '1px solid rgba(255,150,0,0.25)' }}
              />
            ) : (
              <div className="rounded-xl px-3 py-2.5 text-sm font-bold flex items-center justify-between"
                style={{ background: 'rgba(255,159,10,0.08)', border: '1px solid rgba(255,159,10,0.2)' }}>
                <span style={{ color: '#ff9f0a' }}>{autoDA}%</span>
                <span className="text-[10px] text-white/50">auto from date</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs text-white/60 font-medium mb-2 block">Qualifying Service</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-white/50 mb-1 block">Years</label>
                <input type="number" value={serviceYears} onChange={e => setServiceYears(Number(e.target.value))}
                  min={0} max={40} className={inputCls} />
              </div>
              <div>
                <label className="text-[11px] text-white/50 mb-1 block">Months</label>
                <input type="number" value={serviceMonths} onChange={e => setServiceMonths(Number(e.target.value))}
                  min={0} max={11} className={inputCls} />
              </div>
            </div>
            <p className="mt-2 text-[11px] text-white/50 leading-relaxed">
              Maximum qualifying service for DCRG: <strong className="text-white/50">33 years (66 half-years)</strong>.
              Months ≥ 3 in any half-year period are counted as a full half-year.
            </p>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="glass-card rounded-2xl p-6 border border-[#ff9f0a]/20">
        <SectionHeader title="Results" />

        <div className="rounded-2xl p-5 mb-4"
          style={{ background: 'rgba(255,159,10,0.08)', border: '1px solid rgba(255,159,10,0.25)' }}>
          <div className="text-[11px] font-black uppercase tracking-widest mb-2 text-[#ff9f0a]">
            {retireType === 'death' ? 'Death Gratuity' : 'DCRG Amount'}
          </div>
          {retireType === 'retirement' && !result.eligible ? (
            <div className="text-[16px] font-bold text-red-400 mt-2">
              Not eligible — minimum 5 years qualifying service required
            </div>
          ) : (
            <>
              <div className="text-[42px] font-[900] leading-none tracking-tight text-white mb-1">
                <AnimatedNumber value={result.dcrg} animKey={animKey} />
              </div>
              {result.cappedAt20L && (
                <div className="text-[11px] font-bold mt-1 text-[#ff9f0a]">
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

        <div className="mb-4">
          <div className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-3">Calculation Breakdown</div>
          <ResultRow label="Last Basic Pay"  value={fmt(basic)} />
          <ResultRow label={`DA @ ${effectiveDA}%`} value={<AnimatedNumber value={result.daAmt} animKey={animKey} />} color="#ff9f0a" />
          <ResultRow label="Last Emoluments (LE)" value={<AnimatedNumber value={result.le} animKey={animKey} />} color="#ff9f0a"
            sub="Basic Pay + DA" />
          <ResultRow label="Qualifying Service" value={qualifyingDisplay}
            sub={`6m+1day rule applies${result.qualifyingYears === 33 ? ' · capped at 33 yrs' : ''}`} />
          <ResultRow label="Formula" value={`LE × ${result.qualifyingYears} ÷ 2`}
            sub={`= ${fmt(result.le)} × ${result.qualifyingYears} ÷ 2`} />
          <ResultRow label="Retirement DCRG" value={<AnimatedNumber value={result.retireDCRG} animKey={animKey} />} color="#30d158" />
          {retireType === 'death' && (
            <ResultRow label="Death Gratuity (applied)" value={<AnimatedNumber value={result.deathDCRG} animKey={animKey} />} color="#ff9f0a" big />
          )}
        </div>

        {/* KSR Rules quick ref */}
        <div className="rounded-2xl p-4 mb-4" style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-xs)' }}>
          <div className="text-[11px] font-black uppercase tracking-widest text-white/45 mb-3">KSR Rule 77 — Death Gratuity</div>
          {[
            { range: '< 1 year service',   amount: '2 × monthly LE'  },
            { range: '1 – 5 years',         amount: '6 × monthly LE'  },
            { range: '5 – 20 years',         amount: '12 × monthly LE' },
            { range: '20+ years',            amount: 'LE × yrs ÷ 2 (min 12×, max 16.5×)' },
          ].map(row => (
            <div key={row.range} className="flex justify-between text-[11px] py-0.5">
              <span className="text-white/55">{row.range}</span>
              <span className="text-white/55 font-semibold">{row.amount}</span>
            </div>
          ))}
          <div className="pt-3 mt-3 border-t border-white/[0.06]">
            <div className="text-[11px] font-bold text-white/60 mb-2">Retirement DCRG</div>
            {[
              { label: 'Formula',            value: 'LE × qualifying years ÷ 2' },
              { label: 'Min qualifying svc', value: '5 years' },
              { label: 'Max qualifying svc', value: '33 years' },
              { label: 'Max DCRG amount',    value: '₹20,00,000' },
              { label: 'Service rounding',   value: '6 months + 1 day → full year' },
            ].map(r => (
              <div key={r.label} className="flex justify-between text-[11px] py-0.5">
                <span className="text-white/50">{r.label}</span>
                <span className="text-white/55 font-semibold">{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DA reference table */}
        <div className="rounded-2xl p-4" style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-xs)' }}>
          <div className="text-[11px] font-black uppercase tracking-widest text-white/45 mb-3">
            {prc} PRC — DA Rate Reference
          </div>
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
            {(prc === '11th' ? DA_TABLE_11TH : DA_TABLE_10TH).map(row => (
              <div key={row.from} className="flex justify-between text-[11px] py-0.5"
                style={{ color: row.rate === effectiveDA ? '#ff9f0a' : 'var(--text-ghost)' }}>
                <span>From {row.from}</span>
                <span className="font-bold">{row.rate}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
