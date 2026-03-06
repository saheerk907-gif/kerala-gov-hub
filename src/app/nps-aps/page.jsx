'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ComposedChart, AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';

// ─── Kerala Pay Revision schedule ────────────────────────────────────────────
const REVISIONS = [
  { year: 2026, month: 6,  label: '12th Pay Rev (Jun 2026)', fitment: 1.38, balanceDA: 4 },
  { year: 2031, month: 6,  label: '13th Pay Rev (Jun 2031)', fitment: 1.36, balanceDA: 6 },
  { year: 2036, month: 6,  label: '14th Pay Rev (Jun 2036)', fitment: 1.34, balanceDA: 8 },
  { year: 2041, month: 6,  label: '15th Pay Rev (Jun 2041)', fitment: 1.32, balanceDA: 10 },
  { year: 2046, month: 6,  label: '16th Pay Rev (Jun 2046)', fitment: 1.30, balanceDA: 12 },
  { year: 2051, month: 6,  label: '17th Pay Rev (Jun 2051)', fitment: 1.28, balanceDA: 14 },
  { year: 2056, month: 6,  label: '18th Pay Rev (Jun 2056)', fitment: 1.26, balanceDA: 16 },
  { year: 2061, month: 6,  label: '19th Pay Rev (Jun 2061)', fitment: 1.24, balanceDA: 18 },
];

const DA_RATE_PER_YEAR = 4; // % per year increment in DA between revisions
const NPS_RETURN = 10;      // % annual return on NPS corpus

// ─── Core simulation ─────────────────────────────────────────────────────────
function simulate(p) {
  const {
    currentBasic, currentDA, joinYear, joinMonth,
    retireYear, govtNPS, inflation,
  } = p;

  const rows = [];
  let basic      = currentBasic;
  let daRate     = currentDA;
  let npsCorpus  = 0;
  let serviceYears = 0;

  const nowYear  = new Date().getFullYear();
  const nowMonth = new Date().getMonth() + 1;

  for (let yr = nowYear; yr <= retireYear; yr++) {
    // Apply pay revision if this year matches
    const rev = REVISIONS.find(r => r.year === yr);
    if (rev) {
      basic   = Math.round(basic * rev.fitment);
      daRate  = rev.balanceDA;
    } else {
      daRate += DA_RATE_PER_YEAR;
    }

    const gross       = basic + Math.round(basic * daRate / 100);
    const empNPS      = Math.round(gross * 0.10);
    const govNPS      = Math.round(gross * govtNPS / 100);
    const totalNPS    = empNPS + govNPS;

    // Compound existing corpus + add this year's contribution
    npsCorpus = Math.round(npsCorpus * (1 + NPS_RETURN / 100) + totalNPS * 12);

    serviceYears = yr - joinYear + (joinMonth <= 6 ? 1 : 0);

    // PV discount factor from retirement
    const yearsToRetire = retireYear - yr;
    const pvFactor      = 1 / Math.pow(1 + inflation / 100, yearsToRetire);

    rows.push({
      year:        yr,
      basic,
      daRate,
      gross,
      empNPS,
      govNPS,
      totalNPS,
      npsCorpus,
      serviceYears,
      pvFactor,
    });
  }

  // ── Retirement figures ────────────────────────────────────────────────────
  if (rows.length === 0) {
    return {
      rows: [], apsPension: 0, apsDCRG: 0, npsLumpsum: 0,
      npsAnnuity: 0, npsPension: 0, totalService: 0,
      lastBasic: 0, lastGross: 0, npsCorpusFinal: 0, postRetire: [],
    };
  }
  const last         = rows[rows.length - 1];
  const totalService = retireYear - joinYear;

  // APS: 50% of last basic (min 30 yrs service, else proportional)
  const apsFactor    = Math.min(totalService / 30, 1) * 0.50;
  const apsPension   = Math.round(last.basic * apsFactor);
  const apsDCRG      = Math.round(last.gross * Math.min(totalService, 33) / 4);

  // NPS: 60% lump sum, 40% annuity at 6% annuity rate
  const npsLumpsum   = Math.round(last.npsCorpus * 0.60);
  const npsAnnuity   = Math.round(last.npsCorpus * 0.40);
  const npsPension   = Math.round(npsAnnuity * 0.06 / 12);

  // Post-retirement monthly comparison (40 years)
  const postRetire = [];
  let apsCumul = 0, npsCumul = 0;
  let curAPS = apsPension, curNPS = npsPension;

  for (let i = 1; i <= 40; i++) {
    // APS gets DA increments (simplified: 4%/yr increase)
    curAPS = Math.round(curAPS * 1.04);
    // NPS pension stays flat (annuity)
    const yr = retireYear + i;
    apsCumul += curAPS * 12;
    npsCumul += curNPS * 12;
    postRetire.push({
      year:    yr,
      age:     60 + i,
      apsMo:  curAPS,
      npsMo:  curNPS,
      apsCum: Math.round(apsCumul / 1e5) / 10,
      npsCum: Math.round((npsCumul + npsLumpsum) / 1e5) / 10,
    });
  }

  return {
    rows,
    apsPension,
    apsDCRG,
    npsLumpsum,
    npsAnnuity,
    npsPension,
    totalService,
    lastBasic: last.basic,
    lastGross: last.gross,
    npsCorpusFinal: last.npsCorpus,
    postRetire,
  };
}

// ─── Animated number ──────────────────────────────────────────────────────────
function Anim({ value, decimals = 0, prefix = '', suffix = '' }) {
  const ref   = useRef(null);
  const prev  = useRef(0);

  useEffect(() => {
    const start = prev.current;
    const end   = value;
    const dur   = 700;
    const t0    = performance.now();
    const raf   = requestAnimationFrame;

    function tick(now) {
      const frac = Math.min((now - t0) / dur, 1);
      const cur  = start + (end - start) * frac;
      if (ref.current) ref.current.textContent = prefix + cur.toFixed(decimals) + suffix;
      if (frac < 1) raf(tick);
      else prev.current = end;
    }
    raf(tick);
  }, [value, decimals, prefix, suffix]);

  return <span ref={ref}>{prefix}{value.toFixed(decimals)}{suffix}</span>;
}

// ─── Reusable glass components ────────────────────────────────────────────────
function GlassStat({ label, value, sub, color, big }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-1"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="text-[11px] font-bold uppercase tracking-widest text-white/40">{label}</div>
      <div className={`font-black text-white ${big ? 'text-[28px]' : 'text-[22px]'}`} style={{ color }}>
        <Anim value={value} prefix="₹" />
      </div>
      {sub && <div className="text-[11px] text-white/35">{sub}</div>}
    </div>
  );
}

function GlassInput({ label, value, onChange, min, max, step = 1, prefix }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold uppercase tracking-widest text-white/40">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm font-bold">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="w-full rounded-xl px-3 py-2.5 text-white text-sm font-semibold outline-none focus:ring-1 focus:ring-white/20"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            paddingLeft: prefix ? '2rem' : '0.75rem',
          }}
        />
      </div>
    </div>
  );
}

const fmt = v => '₹' + (v >= 1e7 ? (v / 1e7).toFixed(2) + 'Cr' : v >= 1e5 ? (v / 1e5).toFixed(2) + 'L' : v.toLocaleString('en-IN'));

const TOOLTIP_STYLE = {
  background: 'rgba(18,20,22,0.95)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: '#fff',
  fontSize: 12,
};

// ─── Main page ────────────────────────────────────────────────────────────────
export default function NPSvsAPSPage() {
  const nowYear = new Date().getFullYear();

  const [currentBasic, setCurrentBasic] = useState(30000);
  const [currentDA,    setCurrentDA]    = useState(35);
  const [joinYear,     setJoinYear]     = useState(2018);
  const [joinMonth,    setJoinMonth]    = useState(6);
  const [retireYear,   setRetireYear]   = useState(Math.max(nowYear + 5, 2050));
  const [govtNPS,      setGovtNPS]      = useState(14);
  const [inflation,    setInflation]    = useState(6);
  const [showPV,       setShowPV]       = useState(false);
  const [tab,          setTab]          = useState('compare');

  const result = useMemo(() => simulate({
    currentBasic, currentDA, joinYear, joinMonth,
    retireYear, govtNPS, inflation,
  }), [currentBasic, currentDA, joinYear, joinMonth, retireYear, govtNPS, inflation]);

  // Chart data — every 5 years
  const chartData = result.rows
    .filter(r => r.year % 5 === 0 || r.year === nowYear || r.year === retireYear)
    .map(r => ({
      year:    r.year,
      basic:   r.basic,
      gross:   r.gross,
      corpus:  Math.round(r.npsCorpus / 1000),
      empNPS:  r.empNPS,
      govNPS:  r.govNPS,
      pvCorpus: showPV ? Math.round(r.npsCorpus * r.pvFactor / 1000) : Math.round(r.npsCorpus / 1000),
    }));

  const TABS = [
    { id: 'compare',   label: 'Compare' },
    { id: 'growth',    label: 'Corpus Growth' },
    { id: 'postretire',label: 'Post-Retire' },
    { id: 'table',     label: 'Year Table' },
  ];

  const apsBetter = result.apsPension > result.npsPension;

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: '#0a0c0e' }}>
      {/* Background glow blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.07]"
          style={{ background: '#30d158' }} />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.07]"
          style={{ background: '#ff453a' }} />
      </div>

      <div className="max-w-[1300px] mx-auto px-4 pt-[100px] pb-12">

        {/* Page title */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/35 hover:text-white/70 no-underline transition-colors mb-3">
              ← Back to Home
            </Link>
            <div className="section-label mb-2">Pension Comparison Tool</div>
            <h1 className="text-[clamp(22px,3.5vw,40px)] font-[900] tracking-[-0.03em] text-white leading-tight" style={{ fontFamily: "'Meera', sans-serif" }}>
              NPS vs <span className="text-white/40">APS Calculator</span>
            </h1>
            <p className="text-[13px] text-white/40 mt-1">Kerala Government Employees — Pension Projection with Pay Revision Schedule</p>
          </div>
        </div>

        {/* ── Input panel ─────────────────────────────────────────────────── */}
        <div className="rounded-2xl p-6 mb-8"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-5">Your Details</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            <GlassInput label="Basic Pay (₹)" value={currentBasic} onChange={setCurrentBasic} min={15000} max={200000} step={1000} />
            <GlassInput label="Current DA %" value={currentDA}    onChange={setCurrentDA}    min={0}     max={100}    />
            <GlassInput label="Join Year"    value={joinYear}     onChange={setJoinYear}     min={1990}  max={nowYear} />
            <GlassInput label="Join Month"   value={joinMonth}    onChange={setJoinMonth}    min={1}     max={12}      />
            <GlassInput label="Retire Year"  value={retireYear}   onChange={v => setRetireYear(Math.max(v, nowYear + 1))}   min={nowYear+1} max={2065} />
            <GlassInput label="Govt NPS %" value={govtNPS}    onChange={setGovtNPS}    min={10} max={20}     />
            <GlassInput label="Inflation %" value={inflation}  onChange={setInflation}  min={1}  max={15}     />
          </div>

          {/* PV toggle */}
          <button
            onClick={() => setShowPV(v => !v)}
            className="mt-5 flex items-center gap-2 text-[12px] font-semibold transition-colors"
            style={{ color: showPV ? '#30d158' : 'rgba(255,255,255,0.35)' }}
          >
            <span className="w-8 h-4 rounded-full flex items-center transition-colors"
              style={{ background: showPV ? '#30d15840' : 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <span className="w-3 h-3 rounded-full ml-[2px] transition-transform"
                style={{ background: showPV ? '#30d158' : 'rgba(255,255,255,0.3)', transform: showPV ? 'translateX(16px)' : 'none' }} />
            </span>
            Show inflation-adjusted (present value) figures
          </button>
        </div>

        {/* ── Summary cards ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <GlassStat label="APS Monthly Pension" value={result.apsPension} color="#30d158"
            sub={`${result.totalService} yrs service · 50% of basic`} big />
          <GlassStat label="APS Gratuity (DCRG)" value={result.apsDCRG}   color="#64d2ff"
            sub="Based on last gross pay" />
          <GlassStat label="NPS Monthly Pension"  value={result.npsPension} color="#ff453a"
            sub="40% annuity at 6% p.a." big />
          <GlassStat label="NPS Lump Sum (60%)"   value={result.npsLumpsum} color="#ff9f0a"
            sub={`Total corpus: ${fmt(result.npsCorpusFinal)}`} />
        </div>

        {/* Winner banner */}
        <div className="rounded-2xl px-6 py-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            background: apsBetter ? 'rgba(48,209,88,0.08)' : 'rgba(255,69,58,0.08)',
            border: `1px solid ${apsBetter ? 'rgba(48,209,88,0.25)' : 'rgba(255,69,58,0.25)'}`,
          }}>
          <div>
            <div className="text-[12px] font-black uppercase tracking-widest mb-1"
              style={{ color: apsBetter ? '#30d158' : '#ff453a' }}>
              {apsBetter ? 'APS gives higher monthly pension' : 'NPS gives higher monthly pension'}
            </div>
            <div className="text-[13px] text-white/60">
              Difference: <strong className="text-white">{fmt(Math.abs(result.apsPension - result.npsPension))}/month</strong>
              {' '}· NPS also gives <strong className="text-white">{fmt(result.npsLumpsum)}</strong> lump sum at retirement
            </div>
          </div>
          <div className="text-[11px] text-white/30 max-w-[280px] text-center sm:text-right leading-relaxed">
            APS total service: {result.totalService} yrs · Last basic: {fmt(result.lastBasic)}
            · Last gross: {fmt(result.lastGross)}
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-1 mb-6 p-1 rounded-xl w-full sm:w-fit overflow-x-auto"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-[12px] font-bold transition-all whitespace-nowrap"
              style={{
                background: tab === t.id ? 'rgba(255,255,255,0.10)' : 'transparent',
                color: tab === t.id ? '#fff' : 'rgba(255,255,255,0.40)',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Compare tab ───────────────────────────────────────────────────── */}
        {tab === 'compare' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Bar comparison */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-4">Monthly Pension Comparison</div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={[
                  { name: 'APS',  pension: result.apsPension },
                  { name: 'NPS',  pension: result.npsPension },
                ]} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v => '₹' + (v/1000).toFixed(0) + 'K'} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => ['₹' + v.toLocaleString('en-IN'), 'Monthly Pension']} />
                  <Bar dataKey="pension" radius={[8,8,0,0]} fill="#30d158"
                    label={{ position: 'top', fill: '#fff', fontSize: 12, formatter: v => '₹' + (v/1000).toFixed(1) + 'K' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Retirement corpus pie-like bar */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-4">NPS Corpus Breakdown at Retirement</div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={[
                    { name: 'NPS Lump Sum',   value: result.npsLumpsum },
                    { name: 'NPS Annuity',    value: result.npsAnnuity },
                    { name: 'APS DCRG',       value: result.apsDCRG    },
                  ]}
                  layout="vertical"
                  margin={{ top: 10, right: 60, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" tickFormatter={v => fmt(v)} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => [fmt(v), 'Amount']} />
                  <Bar dataKey="value" radius={[0,8,8,0]}
                    fill="#ff9f0a"
                    label={{ position: 'right', fill: '#fff', fontSize: 11, formatter: v => fmt(v) }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── Corpus Growth tab ─────────────────────────────────────────────── */}
        {tab === 'growth' && (
          <div className="rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-[11px] font-black uppercase tracking-widest text-white/30">NPS Corpus Growth (₹ Thousands)</div>
              {showPV && <span className="text-[10px] font-bold text-[#30d158] px-2 py-0.5 rounded-full" style={{ background: 'rgba(48,209,88,0.12)' }}>PV Adjusted</span>}
            </div>
            <ResponsiveContainer width="100%" height={380}>
              <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2997ff" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2997ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="corpus" tickFormatter={v => '₹' + v + 'K'} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="pay" orientation="right" tickFormatter={v => '₹' + v.toLocaleString('en-IN')} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE}
                  formatter={(v, name) => {
                    if (name === 'corpus' || name === 'pvCorpus') return ['₹' + (v * 1000).toLocaleString('en-IN'), 'NPS Corpus'];
                    return ['₹' + v.toLocaleString('en-IN'), name === 'basic' ? 'Basic Pay' : 'Gross Pay'];
                  }} />
                <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                <Area yAxisId="corpus" type="monotone" dataKey={showPV ? 'pvCorpus' : 'corpus'} name="corpus"
                  stroke="#2997ff" fill="url(#corpusGrad)" strokeWidth={2} dot={false} />
                <Line yAxisId="pay" type="monotone" dataKey="basic" name="basic"
                  stroke="#30d158" strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
                <Line yAxisId="pay" type="monotone" dataKey="gross" name="gross"
                  stroke="#ff9f0a" strokeWidth={1.5} dot={false} />
                {REVISIONS.map(r => (
                  <ReferenceLine key={r.year} yAxisId="pay" x={r.year}
                    stroke="rgba(255,255,255,0.12)" strokeDasharray="3 3"
                    label={{ value: r.label.replace(' Pay Rev', ''), fill: 'rgba(255,255,255,0.25)', fontSize: 9, position: 'insideTopRight' }} />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ── Post-retirement tab ───────────────────────────────────────────── */}
        {tab === 'postretire' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-4">Monthly Pension (Post Retirement)</div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={result.postRetire} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false}
                    tickFormatter={v => `${v}`} interval={4} />
                  <YAxis tickFormatter={v => '₹' + (v/1000).toFixed(0) + 'K'} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE}
                    formatter={(v, name) => ['₹' + v.toLocaleString('en-IN'), name === 'apsMo' ? 'APS Pension' : 'NPS Pension']} />
                  <Legend formatter={v => v === 'apsMo' ? 'APS (with DA)' : 'NPS (fixed)'} wrapperStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                  <Line type="monotone" dataKey="apsMo" stroke="#30d158" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="npsMo" stroke="#ff453a" strokeWidth={2} dot={false} strokeDasharray="4 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-4">Cumulative Lifetime Receipts (₹ Lakh)</div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={result.postRetire} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="apsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#30d158" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#30d158" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="npsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#ff9f0a" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ff9f0a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} interval={4} />
                  <YAxis tickFormatter={v => v + 'L'} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE}
                    formatter={(v, name) => ['₹' + v.toFixed(1) + ' Lakh', name === 'apsCum' ? 'APS Cumulative' : 'NPS Cumulative (incl. lump sum)']} />
                  <Legend formatter={v => v === 'apsCum' ? 'APS Total' : 'NPS Total (lump sum+pension)'} wrapperStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                  <Area type="monotone" dataKey="apsCum" stroke="#30d158" fill="url(#apsGrad)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="npsCum" stroke="#ff9f0a" fill="url(#npsGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-3 text-[11px] text-white/30 leading-relaxed">
                NPS cumulative includes ₹{fmt(result.npsLumpsum)} lump sum from day 1.
                APS cumulative is pension-only (DCRG not included here).
              </div>
            </div>
          </div>
        )}

        {/* ── Year table tab ────────────────────────────────────────────────── */}
        {tab === 'table' && (
          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['Year','Basic','DA%','Gross','Emp NPS','Govt NPS','NPS Corpus'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-black uppercase tracking-widest text-white/30 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((r, i) => {
                    const isRev = REVISIONS.some(rev => rev.year === r.year);
                    return (
                      <tr key={r.year}
                        className="border-b transition-colors hover:bg-white/[0.03]"
                        style={{
                          borderColor: 'rgba(255,255,255,0.04)',
                          background: isRev ? 'rgba(41,151,255,0.06)' : 'transparent',
                        }}>
                        <td className="px-4 py-2.5 font-bold text-white/70">
                          {r.year}
                          {isRev && <span className="ml-1.5 text-[9px] text-[#2997ff] font-black">REV</span>}
                        </td>
                        <td className="px-4 py-2.5 text-white/60">{fmt(r.basic)}</td>
                        <td className="px-4 py-2.5 text-white/50">{r.daRate}%</td>
                        <td className="px-4 py-2.5 text-white/70 font-semibold">{fmt(r.gross)}</td>
                        <td className="px-4 py-2.5 text-[#ff453a]">{fmt(r.empNPS)}</td>
                        <td className="px-4 py-2.5 text-[#ff9f0a]">{fmt(r.govNPS)}</td>
                        <td className="px-4 py-2.5 text-[#2997ff] font-bold">{fmt(r.npsCorpus)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 text-[11px] text-white/20 text-center leading-relaxed">
          Estimates based on projected pay revisions every 5 years. Actual figures depend on GOK orders.
          NPS return assumed at {NPS_RETURN}% p.a. APS pension = 50% of last basic (30+ yrs service).
        </div>
      </div>
    </div>
  );
}
