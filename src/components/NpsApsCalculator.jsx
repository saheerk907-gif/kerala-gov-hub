'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import AnimatedNumber from '@/components/AnimatedNumber';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
  ComposedChart, ReferenceLine,
} from 'recharts';

// ─── Pay Revision Schedule ────────────────────────────────────────────────────
const REVISIONS = [
  { year: 2026, label: '12th PRC (Jun 2026)', fitment: 1.38, balanceDA: 4,  type: 'basic_only' },
  { year: 2031, label: '13th PRC (Jun 2031)', fitment: 1.07, balanceDA: 4,  type: 'merge' },
  { year: 2036, label: '14th PRC (Jun 2036)', fitment: 1.07, balanceDA: 4,  type: 'merge' },
  { year: 2041, label: '15th PRC (Jun 2041)', fitment: 1.07, balanceDA: 3,  type: 'merge' },
  { year: 2046, label: '16th PRC (Jun 2046)', fitment: 1.06, balanceDA: 3,  type: 'merge' },
  { year: 2051, label: '17th PRC (Jun 2051)', fitment: 1.06, balanceDA: 3,  type: 'merge' },
  { year: 2056, label: '18th PRC (Jun 2056)', fitment: 1.06, balanceDA: 3,  type: 'merge' },
  { year: 2061, label: '19th PRC (Jun 2061)', fitment: 1.06, balanceDA: 3,  type: 'merge' },
];

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const fmt  = v => { if (v>=1e7) return `₹${(v/1e7).toFixed(2)} Cr`; if (v>=1e5) return `₹${(v/1e5).toFixed(2)} L`; if (v>=1e3) return `₹${(v/1e3).toFixed(1)}K`; return `₹${Math.round(v)}`; };
const fmtF = v => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(v);
const pv   = (fv, r, y) => y <= 0 ? fv : fv / Math.pow(1 + r / 100, y);

// ─── Colors ──────────────────────────────────────────────────────────────────
const APS_COLOR = '#f59e0b';  // amber
const NPS_COLOR = '#3b82f6';  // blue
const FONT = `'Inter', system-ui, -apple-system, sans-serif`;

// ─── Core simulation ──────────────────────────────────────────────────────────
function simulate(p) {
  const birthYear  = parseInt(p.dob.split('-')[0]);
  const birthMonth = parseInt(p.dob.split('-')[1]);
  const retYear    = birthYear + p.retAge;
  const retMonth   = birthMonth;
  const serviceYears = retYear - p.joinYear;
  if (serviceYears <= 0 || p.basic <= 0) return null;

  const CUR = 2026;
  const data = [];
  let basic  = p.basic;
  let daPct  = p.currentDA;
  let corpus = p.existingCorpus || 0;
  let empC = 0, govC = 0;

  for (let yr = CUR; yr < retYear; yr++) {
    const rev = REVISIONS.find(r => r.year === yr);
    if (rev) {
      if (rev.type === 'merge') {
        basic = Math.ceil(((basic + Math.round(basic * daPct / 100)) * rev.fitment) / 100) * 100;
      } else {
        basic = Math.ceil((basic * rev.fitment) / 100) * 100;
      }
      daPct = rev.balanceDA;
    }
    const da  = Math.round(basic * daPct / 100);
    const gross = basic + da;
    const nE  = Math.round(gross * 0.10);
    const nG  = Math.round(gross * p.govPct / 100);
    const mC  = nE + nG;
    empC += nE * 12; govC += nG * 12;
    corpus = corpus * (1 + p.npsRet / 100) + mC * 12 * (1 + p.npsRet / 200);

    const yFN = yr - CUR;
    const iA  = pv(1, p.inf, Math.max(0, yFN));
    data.push({
      year: yr, basic, daPct, da, gross,
      annSal: gross * 12, annSalPV: Math.round(gross * 12 * iA),
      nE, nG, mC,
      corpus: Math.round(corpus), corpusPV: Math.round(corpus * iA),
      totC: empC + govC,
      isRev: !!rev, revLabel: rev ? rev.label : null,
    });
    basic  = Math.round(basic * (1 + p.incRate / 100));
    daPct  = Math.round(daPct + p.annualDA);
  }

  const last = data[data.length - 1];
  if (!last) return null;

  const rYFN   = retYear - CUR;
  const rIA    = pv(1, p.inf, Math.max(0, rYFN));
  const qs     = Math.min(serviceYears, 33);
  const apsFac = qs >= 30 ? 0.50 : qs / 60;
  const apsP   = Math.round(last.basic * apsFac);
  const fC     = Math.round(corpus);
  const lump   = Math.round(fC * 0.60);
  const annCorp = Math.round(fC * 0.40);
  const npsP   = Math.round(annCorp * (p.annRate / 100) / 12);
  const totC   = empC + govC;

  const post = [];
  let cA = 0, cN = 0, cAP = 0, cNP = 0, curA = apsP, curN = npsP;
  for (let y = 0; y <= 25; y++) {
    if (y > 0) curA = Math.round(curA * (1 + p.postDR / 100));
    const pIA = pv(1, p.inf, Math.max(0, rYFN + y));
    cA += curA * 12; cN += curN * 12;
    cAP += Math.round(curA * 12 * pIA); cNP += Math.round(curN * 12 * pIA);
    post.push({
      year: y, label: y === 0 ? 'Retire' : `+${y}yr`,
      apsP: curA, npsP: curN,
      apsPV: Math.round(curA * pIA), npsPV: Math.round(curN * pIA),
      cA, cN, cAP, cNP, diff: cA - cN,
    });
  }

  let brk = null;
  if (apsP > npsP) {
    const d = apsP - npsP;
    if (d > 0) brk = Math.ceil(lump / (d * 12));
  }

  return {
    data, lB: last.basic, lD: last.da, lG: last.gross, lDP: last.daPct,
    serviceYears, qs, retYear, retMonth, apsP, apsPV: Math.round(apsP * rIA),
    apsFac, fC, lump, lumpPV: Math.round(lump * rIA),
    annCorp, npsP, npsPV: Math.round(npsP * rIA),
    empC, govC, totC, totR: Math.max(0, fC - totC),
    post, brk, rIA,
  };
}

// ─── DOB Selector ─────────────────────────────────────────────────────────────
function DOBSelector({ value, onChange, label }) {
  const parts = value ? value.split('-') : ['1990', '06', '15'];
  const [yr, setYr] = useState(parts[0]);
  const [mo, setMo] = useState(parts[1]);
  const [dy, setDy] = useState(parts[2]);

  const emit = (y, m, d) => {
    const sd = Math.min(Number(d), new Date(Number(y), Number(m), 0).getDate());
    onChange(`${y}-${m}-${String(sd).padStart(2, '0')}`);
  };

  const sel = (setter, field) => e => {
    const v = e.target.value;
    setter(v);
    if (field === 'yr') emit(v, mo, dy);
    else if (field === 'mo') emit(yr, v, dy);
    else emit(yr, mo, v);
  };

  const daysInMonth = new Date(Number(yr), Number(mo), 0).getDate();
  const inp = 'w-full px-3 py-3 rounded-xl text-white text-[14px] font-medium outline-none appearance-none';
  const bg = { background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.12)', colorScheme: 'dark', fontFamily: FONT };
  const optStyle = { background: '#1c1c1e', color: '#fff' };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[12px] font-semibold tracking-wide text-white/70" style={{ fontFamily: FONT }}>{label}</label>
      <div className="grid grid-cols-3 gap-1.5">
        <select value={mo} onChange={sel(setMo, 'mo')} className={inp} style={bg}>
          {['01','02','03','04','05','06','07','08','09','10','11','12'].map((m,i) => <option key={m} value={m} style={optStyle}>{MONTH_NAMES[i]}</option>)}
        </select>
        <select value={dy} onChange={sel(setDy, 'dy')} className={inp} style={bg}>
          {Array.from({length: daysInMonth},(_,i)=>String(i+1).padStart(2,'0')).map(d=><option key={d} value={d} style={optStyle}>{d}</option>)}
        </select>
        <select value={yr} onChange={sel(setYr, 'yr')} className={inp} style={bg}>
          {Array.from({length:46},(_,i)=>String(1960+i)).map(y=><option key={y} value={y} style={optStyle}>{y}</option>)}
        </select>
      </div>
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
function GlassInput({ label, value, onChange, min, max, step = 1, suffix, help }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[12px] font-semibold tracking-wide text-white/70" style={{ fontFamily: FONT }}>{label}</label>
      <div className="relative">
        <input
          type="number" value={value === 0 ? '' : value} placeholder="0"
          min={min} max={max} step={step}
          onChange={e => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
          className="w-full rounded-xl px-3 py-3 text-white text-[14px] font-medium outline-none transition-all focus:ring-2 focus:ring-white/20"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', paddingRight: suffix ? '2.5rem' : '0.75rem', fontFamily: FONT }}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-[13px] font-medium">{suffix}</span>}
      </div>
      {help && <div className="text-[11px] text-white/45 leading-relaxed" style={{ fontFamily: FONT }}>{help}</div>}
    </div>
  );
}

// ─── Slider Input ─────────────────────────────────────────────────────────────
function SliderInput({ label, value, onChange, min, max, step = 1, suffix, help, color = '#f59e0b' }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[12px] font-semibold tracking-wide text-white/70 flex items-center gap-1.5" style={{ fontFamily: FONT }}>
        {label}
        <span className="ml-auto font-bold text-[14px]" style={{ color }}>{value}{suffix}</span>
      </label>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, ${color} ${pct}%, rgba(255,255,255,0.1) ${pct}%)`, outline: 'none' }}
      />
      {help && <div className="text-[11px] text-white/45" style={{ fontFamily: FONT }}>{help}</div>}
    </div>
  );
}

// ─── Join year selector ───────────────────────────────────────────────────────
function JoinYearSelector({ value, onChange, label }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[12px] font-semibold tracking-wide text-white/70" style={{ fontFamily: FONT }}>{label}</label>
      <select value={value} onChange={e => onChange(Number(e.target.value))}
        className="w-full px-3 py-3 rounded-xl text-white text-[14px] font-medium outline-none appearance-none"
        style={{ background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.12)', colorScheme: 'dark', fontFamily: FONT }}>
        {Array.from({ length: 42 }, (_, i) => 2004 + i).map(y => (
          <option key={y} value={y} style={{ background: '#1c1c1e', color: '#fff' }}>{y}</option>
        ))}
      </select>
      <div className="text-[11px] text-white/45" style={{ fontFamily: FONT }}>NPS applicable from 2004</div>
    </div>
  );
}

const CARD = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' };

const PRESETS = [
  { label: 'New Joiner', labelMl: 'പുതിയ ജോയിൻ', dob: '1998-06-15', joinYear: 2022, basic: 18000, currentDA: 35 },
  { label: 'Mid-career',  labelMl: 'മധ്യ കരിയർ',  dob: '1985-06-15', joinYear: 2015, basic: 46000, currentDA: 35 },
  { label: 'Senior',      labelMl: 'സീനിയർ',      dob: '1975-06-15', joinYear: 2013, basic: 78000, currentDA: 35 },
];
const TT_STYLE = { background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: '#fff', fontSize: 12, fontFamily: FONT };

const WaIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#25d366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ─── Main calculator ──────────────────────────────────────────────────────────
export default function NpsApsCalculator() {
  const [dob,            setDob]            = useState('1990-06-15');
  const [joinYear,       setJoinYear]       = useState(2021);
  const [retAge,         setRetAge]         = useState(60);
  const [basic,          setBasic]          = useState(0);
  const [currentDA,      setCurrentDA]      = useState(35);
  const [annualDA,       setAnnualDA]       = useState(6);
  const [incRate,        setIncRate]        = useState(2);
  const [govPct,         setGovPct]         = useState(10);
  const [existingCorpus, setExistingCorpus] = useState(0);
  const [npsRet,         setNpsRet]         = useState(8);
  const [annRate,        setAnnRate]        = useState(6.5);
  const [postDR,         setPostDR]         = useState(4);
  const [inf,            setInf]            = useState(6);
  const [tab,            setTab]            = useState('compare');
  const [pvOn,           setPvOn]           = useState(false);
  const [lang,           setLang]           = useState('en');
  const [showAdv,        setShowAdv]        = useState(false);

  const ml = lang === 'ml';

  const applyPreset = (pr) => {
    setDob(pr.dob);
    setJoinYear(pr.joinYear);
    setBasic(pr.basic);
    setCurrentDA(pr.currentDA);
  };

  const R = useMemo(() => simulate({
    dob, joinYear, retAge, basic, currentDA, annualDA, incRate,
    govPct, existingCorpus, npsRet, annRate, postDR, inf,
  }), [dob, joinYear, retAge, basic, currentDA, annualDA, incRate, govPct, existingCorpus, npsRet, annRate, postDR, inf]);

  const [animKey, setAnimKey] = useState(0);
  const prevResultNull = useRef(true);
  useEffect(() => {
    const wasNull = prevResultNull.current;
    prevResultNull.current = R === null;
    if (wasNull && R !== null) setAnimKey(k => k + 1);
  }, [R]);

  const retMonthName = MONTH_NAMES[parseInt(dob.split('-')[1]) - 1];

  const shareWhatsApp = () => {
    if (!R) return;
    const msg = ml
      ? `🏛️ എന്റെ പെൻഷൻ കണക്ക്\n\n📊 സേവനം: ${R.serviceYears} വർഷം\n🗓️ വിരമിക്കൽ: ${retMonthName} ${R.retYear}\n\nAPS: ${fmtF(R.apsP)}/മാസം\nNPS: ${fmtF(R.npsP)}/മാസം\n🏦 Corpus: ${fmt(R.fC)}\n\nkeralaemployees.in`
      : `🏛️ My Pension Comparison\n\n📊 Service: ${R.serviceYears} yrs · Retire: ${retMonthName} ${R.retYear}\n\nAPS: ${fmtF(R.apsP)}/mo\nNPS: ${fmtF(R.npsP)}/mo (+ ${fmt(R.lump)} lump)\n🏦 NPS Corpus: ${fmt(R.fC)}\n\nkeralaemployees.in`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const TABS = [
    { id: 'compare',  label: ml ? 'താരതമ്യം' : 'Compare' },
    { id: 'growth',   label: ml ? 'വളർച്ച'   : 'Growth' },
    { id: 'table',    label: ml ? 'പട്ടിക'   : 'Table' },
  ];

  return (
    <div style={{ fontFamily: FONT }}>
      {/* Controls bar */}
      <div className="flex justify-between items-center gap-2 flex-wrap mb-5">
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map(pr => (
            <button key={pr.label} onClick={() => applyPreset(pr)}
              className="px-3.5 py-2 rounded-lg text-[12px] font-medium transition-all hover:bg-white/10 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontFamily: FONT }}>
              {ml ? pr.labelMl : pr.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setLang(ml ? 'en' : 'ml')}
            className="px-3 py-2 rounded-lg text-[12px] font-medium transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontFamily: FONT }}>
            {ml ? 'EN' : 'മല'}
          </button>
          {R && (
            <button onClick={shareWhatsApp}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium"
              style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)', color: '#25d366', fontFamily: FONT }}>
              <WaIcon /> {ml ? 'Share' : 'Share'}
            </button>
          )}
        </div>
      </div>

      {/* ── Inputs ─────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden mb-6" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>

        {/* Section 1 — Profile */}
        <div className="px-6 pt-6 pb-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>1</div>
            <div className="text-[14px] font-semibold text-white/85">{ml ? 'നിങ്ങളുടെ പ്രൊഫൈൽ' : 'Your Profile'}</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <DOBSelector value={dob} onChange={setDob} label={ml ? 'ജനന തീയതി' : 'Date of Birth'} />
            <JoinYearSelector value={joinYear} onChange={setJoinYear} label={ml ? 'ചേർന്ന വർഷം' : 'Year of Joining'} />
            <GlassInput label={ml ? 'വിരമിക്കൽ പ്രായം' : 'Retirement Age'} value={retAge} onChange={setRetAge} min={56} max={62} help="Kerala CPS: 60 yrs" />
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

        {/* Section 2 — Pay Details */}
        <div className="px-6 pt-5 pb-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>2</div>
            <div className="text-[14px] font-semibold text-white/85">{ml ? 'ശമ്പള വിവരങ്ങൾ' : 'Pay Details'}</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <GlassInput label={ml ? 'Basic Pay' : 'Current Basic Pay'} value={basic} onChange={setBasic} min={0} max={500000} suffix="₹" help={ml ? 'നിലവിലെ Basic Pay' : 'Your current basic pay'} />
            <SliderInput label={ml ? 'DA %' : 'Current DA %'} value={currentDA} onChange={setCurrentDA} min={0} max={100} suffix="%" help="~35% as of 2026" color="rgba(255,255,255,0.6)" />
            <SliderInput label={ml ? 'വാർഷിക DA' : 'Annual DA Increase'} value={annualDA} onChange={setAnnualDA} min={0} max={12} suffix="%/yr" help="~6%/yr (3%x2)" color="rgba(255,255,255,0.6)" />
            <GlassInput label={ml ? 'ഇൻക്രിമെന്റ്' : 'Annual Increment'} value={incRate} onChange={setIncRate} min={0} max={10} step={0.5} suffix="%/yr" />
            <GlassInput label={ml ? 'Govt NPS %' : 'Govt NPS %'} value={govPct} onChange={setGovPct} min={0} max={14} suffix="%" help="Default 10%, max 14%" />
            <GlassInput label={ml ? 'നിലവിലെ Corpus' : 'Existing NPS Corpus'} value={existingCorpus} onChange={setExistingCorpus} min={0} suffix="₹" help={ml ? 'ഇല്ലെങ്കിൽ 0' : 'Current NPS balance (0 if none)'} />
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

        {/* Advanced toggle */}
        <div className="px-6 py-3">
          <button onClick={() => setShowAdv(v => !v)}
            className="flex items-center gap-2 text-[12px] font-medium transition-all w-full"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: showAdv ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)', fontFamily: FONT }}>
            Advanced Settings
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ transition: 'transform 0.2s', transform: showAdv ? 'rotate(180deg)' : 'none', marginLeft: 'auto' }}>
              <path d="M2 3.5l3 3 3-3"/>
            </svg>
          </button>
        </div>

        {showAdv && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              <div className="flex flex-col gap-2">
                <SliderInput label={ml ? 'NPS Return' : 'NPS Return'} value={npsRet} onChange={setNpsRet} min={4} max={16} step={0.5} suffix="%" color={NPS_COLOR} help="Historical: 9-12%" />
                <div className="flex gap-1.5 flex-wrap">
                  {[6, 8, 10, 12].map(v => (
                    <button key={v} onClick={() => setNpsRet(v)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all"
                      style={{ background: npsRet === v ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${npsRet === v ? NPS_COLOR : 'rgba(255,255,255,0.1)'}`, color: npsRet === v ? NPS_COLOR : 'rgba(255,255,255,0.45)', cursor: 'pointer', fontFamily: FONT }}>
                      {v}%
                    </button>
                  ))}
                </div>
              </div>
              <GlassInput label={ml ? 'Annuity Rate' : 'Annuity Rate'} value={annRate} onChange={setAnnRate} min={0} max={10} step={0.5} suffix="%" />
              <GlassInput label={ml ? 'Post-Retire DR' : 'Post-Retire DR'} value={postDR} onChange={setPostDR} min={0} max={10} step={0.5} suffix="%" help="APS grows yearly" />
              <GlassInput label={ml ? 'Inflation' : 'Inflation'} value={inf} onChange={setInf} min={0} max={15} step={0.5} suffix="%" help="For present value" />
            </div>
          </div>
        )}
      </div>

      {/* Empty state */}
      {!R && (
        <div className="rounded-2xl p-8" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
          <div className="text-center mb-8">
            <div className="text-[16px] font-semibold text-white/70 mb-2">
              {ml ? 'Basic Pay നൽകി ഫലം കാണുക' : 'Enter your Basic Pay to see results'}
            </div>
            <div className="text-[13px] text-white/45">
              {ml ? 'മുകളിൽ ഉദാഹരണ profile ക്ലിക്ക് ചെയ്യാം' : 'Or click a quick profile above to try instantly'}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl p-5" style={{ background: `rgba(245,158,11,0.06)`, border: `1px solid rgba(245,158,11,0.15)` }}>
              <div className="text-[14px] font-semibold mb-1" style={{ color: APS_COLOR }}>APS - Assured Pension</div>
              <div className="text-[13px] text-white/55 leading-relaxed">{ml ? 'അവസാന Basic-ന്റെ 50% ഉറപ്പ് പെൻഷൻ. DR-indexed.' : 'Guaranteed 50% of last basic pay as pension. Grows with Dearness Relief.'}</div>
            </div>
            <div className="rounded-xl p-5" style={{ background: `rgba(59,130,246,0.06)`, border: `1px solid rgba(59,130,246,0.15)` }}>
              <div className="text-[14px] font-semibold mb-1" style={{ color: NPS_COLOR }}>NPS - National Pension</div>
              <div className="text-[13px] text-white/55 leading-relaxed">{ml ? 'Market-linked corpus. 60% tax-free lump sum + annuity pension.' : 'Market-linked corpus. 60% tax-free lump sum at retirement + monthly annuity.'}</div>
            </div>
          </div>
        </div>
      )}

      {R && (<>

        {/* ── Face-off — neutral, equal treatment ──────────────────────────── */}
        <div className="mb-6">
          {/* Header row */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <div className="text-[13px] font-semibold text-white/50 mb-0.5">{ml ? 'മാസ പെൻഷൻ താരതമ്യം' : 'Monthly Pension Comparison'}</div>
              <div className="text-[13px] text-white/70 flex items-center gap-2 flex-wrap">
                <span>{ml ? 'വിരമിക്കൽ' : 'Retire'}: <strong className="text-white">{retMonthName} {R.retYear}</strong></span>
                <span className="text-white/30">|</span>
                <span>{R.serviceYears} {ml ? 'വർഷം' : 'yrs service'}</span>
                <span className="text-white/30">|</span>
                <span>Last Basic: <strong className="text-white">{fmtF(R.lB)}</strong></span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <button onClick={() => setPvOn(v => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all"
                style={{
                  background: pvOn ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.06)',
                  border: pvOn ? '1px solid rgba(59,130,246,0.35)' : '1px solid rgba(255,255,255,0.15)',
                  color: pvOn ? '#60a5fa' : 'rgba(255,255,255,0.7)',
                  cursor: 'pointer', fontFamily: FONT,
                  boxShadow: pvOn ? '0 0 12px rgba(59,130,246,0.15)' : 'none',
                }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
                {pvOn ? `Today's ₹ (${inf}% inflation adjusted)` : `Show in Today's ₹`}
              </button>
              {!pvOn && <span className="text-[10px] text-white/35 italic">See what future amounts are worth today</span>}
            </div>
          </div>

          {/* APS and NPS cards — equal styling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* APS card */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)' }}>
              <div className="text-[12px] font-semibold uppercase tracking-wide mb-2" style={{ color: APS_COLOR }}>
                APS — Assured Pension
              </div>
              <div className="text-[40px] font-bold leading-none mb-2" style={{ color: APS_COLOR }}>
                <AnimatedNumber value={pvOn ? R.apsPV : R.apsP} animKey={animKey} />
              </div>
              <div className="text-[13px] text-white/50 mb-4">{(R.apsFac * 100).toFixed(0)}% of {fmtF(R.lB)} per month</div>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-medium" style={{ background: 'rgba(245,158,11,0.1)', color: APS_COLOR }}>Guaranteed</span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-medium" style={{ background: 'rgba(245,158,11,0.1)', color: APS_COLOR }}>DR Indexed</span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-medium" style={{ background: 'rgba(245,158,11,0.1)', color: APS_COLOR }}>No Market Risk</span>
              </div>
            </div>

            {/* NPS card */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.18)' }}>
              <div className="text-[12px] font-semibold uppercase tracking-wide mb-2" style={{ color: NPS_COLOR }}>
                NPS — National Pension
              </div>
              <div className="text-[40px] font-bold leading-none mb-2" style={{ color: NPS_COLOR }}>
                <AnimatedNumber value={pvOn ? R.npsPV : R.npsP} animKey={animKey} />
              </div>
              <div className="text-[13px] text-white/50 mb-1">40% corpus @ {annRate}% annuity per month</div>
              <div className="text-[14px] font-semibold mb-3" style={{ color: NPS_COLOR }}>
                + {fmt(pvOn ? R.lumpPV : R.lump)} <span className="text-[11px] font-medium text-white/45">lump sum (60%)</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-medium" style={{ background: 'rgba(59,130,246,0.1)', color: NPS_COLOR }}>60% Tax-Free Lump</span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-medium" style={{ background: 'rgba(59,130,246,0.1)', color: NPS_COLOR }}>Market-Linked</span>
              </div>
            </div>
          </div>

          {/* Pension bars — equal treatment */}
          {(() => {
            const maxP = Math.max(R.apsP, R.npsP, 1);
            const diff = Math.abs(R.apsP - R.npsP);
            return (
              <div className="rounded-2xl p-5" style={CARD}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[11px] font-semibold w-10 text-right" style={{ color: APS_COLOR }}>APS</span>
                  <div className="flex-1 h-3.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div style={{ width: `${(R.apsP / maxP) * 100}%`, background: APS_COLOR, transition: 'width 0.8s cubic-bezier(.4,0,.2,1)', height: '100%', borderRadius: 9999 }} />
                  </div>
                  <span className="text-[12px] font-semibold w-28 text-right" style={{ color: APS_COLOR }}>{fmtF(pvOn ? R.apsPV : R.apsP)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold w-10 text-right" style={{ color: NPS_COLOR }}>NPS</span>
                  <div className="flex-1 h-3.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div style={{ width: `${(R.npsP / maxP) * 100}%`, background: NPS_COLOR, transition: 'width 0.8s cubic-bezier(.4,0,.2,1)', height: '100%', borderRadius: 9999 }} />
                  </div>
                  <span className="text-[12px] font-semibold w-28 text-right" style={{ color: NPS_COLOR }}>{fmtF(pvOn ? R.npsPV : R.npsP)}</span>
                </div>
                <div className="mt-3 pt-3 text-[12px] text-white/60" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {ml ? 'വ്യത്യാസം' : 'Difference'}: <strong className="text-white">{fmtF(diff)}</strong>/{ml ? 'മാസം' : 'month'}
                  {R.brk && R.apsP > R.npsP && (
                    <span className="ml-3 text-white/45">
                      | APS {ml ? 'ഏകദേശം' : 'recovers lump sum in ~'}<strong className="text-white">{R.brk} {ml ? 'വർഷം' : 'yrs'}</strong>
                    </span>
                  )}
                </div>
              </div>
            );
          })()}
        </div>

        {/* ── Quick stats ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: ml ? 'NPS Corpus' : 'NPS Corpus',    value: pvOn ? Math.round(R.fC * R.rIA) : R.fC, sub: `${fmt(R.totC)} contrib` },
            { label: ml ? 'Lump Sum (60%)' : 'Lump Sum (60%)', value: pvOn ? R.lumpPV : R.lump, sub: ml ? 'At retirement' : 'At retirement' },
            { label: ml ? 'Last Gross' : 'Last Gross Pay', value: R.lG, sub: `Basic ${fmtF(R.lB)}` },
            { label: ml ? 'Service' : 'Service', value: null, text: `${R.serviceYears} yrs`, sub: `${retMonthName} ${R.retYear}` },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-4" style={CARD}>
              <div className="text-[11px] font-medium text-white/50 mb-2">{s.label}</div>
              <div className="text-[20px] font-bold leading-none mb-1 text-white/90">
                {s.text ? s.text : <AnimatedNumber value={s.value} animKey={animKey} />}
              </div>
              {s.sub && <div className="text-[11px] text-white/45">{s.sub}</div>}
            </div>
          ))}
        </div>

        {/* Key notes — neutral */}
        <div className="rounded-2xl p-5 mb-6" style={CARD}>
          <div className="text-[12px] font-semibold text-white/55 mb-3">{ml ? 'പ്രധാന വിവരങ്ങൾ' : 'Key Notes'}</div>
          <div className="flex flex-col gap-2.5">
            <div className="text-[13px] text-white/65 leading-relaxed flex gap-2">
              <span style={{ color: APS_COLOR }}>APS:</span>
              <span>{ml ? `${(R.apsFac * 100).toFixed(0)}% of last basic. Guaranteed pension with DR growth (${postDR}%/yr).` : `${(R.apsFac * 100).toFixed(0)}% of last basic. Guaranteed pension with DR growth (${postDR}%/yr after retirement).`}</span>
            </div>
            <div className="text-[13px] text-white/65 leading-relaxed flex gap-2">
              <span style={{ color: NPS_COLOR }}>NPS:</span>
              <span>{ml ? `${fmt(R.lump)} lump sum (tax-free) + ${fmtF(R.npsP)}/mo annuity. Annuity is fixed — no DR.` : `${fmt(R.lump)} lump sum (tax-free) + ${fmtF(R.npsP)}/mo annuity. Annuity is fixed — no DR.`}</span>
            </div>
            <div className="text-[13px] text-white/50 leading-relaxed" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
              {ml ? 'G.O.(P) No.33/2026/F.N: APS-ൽ lump sum ഇല്ല. NPS-ൽ DCRG ഇല്ല.' : 'G.O.(P) No.33/2026/F.N: APS does not include a lump sum. Neither scheme provides DCRG.'}
            </div>
          </div>
        </div>

        {/* ── Tabs — underline style ───────────────────────────────────────── */}
        <div className="flex gap-0 mb-5 overflow-x-auto" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-5 py-3 text-[13px] font-semibold whitespace-nowrap transition-all relative"
              style={{
                background: 'none',
                border: 'none',
                borderBottom: tab === t.id ? '2px solid rgba(255,255,255,0.8)' : '2px solid transparent',
                color: tab === t.id ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                fontFamily: FONT,
                marginBottom: -1,
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Compare tab ───────────────────────────────────────────────────── */}
        {tab === 'compare' && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="rounded-2xl p-5" style={CARD}>
                <div className="text-[12px] font-semibold text-white/55 mb-4">NPS Corpus Sources</div>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={[
                      { name: ml ? 'Your 10%' : 'Your 10%',     value: R.empC },
                      { name: ml ? `Govt ${govPct}%` : `Govt ${govPct}%`, value: R.govC },
                      { name: ml ? 'Returns'    : 'Returns',        value: R.totR },
                    ]} cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={4} dataKey="value">
                      {[NPS_COLOR, APS_COLOR, 'rgba(255,255,255,0.25)'].map((c, i) => <Cell key={i} fill={c} />)}
                    </Pie>
                    <Tooltip formatter={v => fmtF(v)} contentStyle={TT_STYLE} />
                    <Legend wrapperStyle={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: FONT }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl p-5" style={CARD}>
                <div className="text-[12px] font-semibold text-white/55 mb-4">{ml ? 'Retirement Split' : 'Retirement Split'}</div>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={[
                      { name: 'Lump 60%',    value: R.lump },
                      { name: 'Annuity 40%', value: R.annCorp },
                    ]} cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={4} dataKey="value">
                      {[NPS_COLOR, 'rgba(255,255,255,0.3)'].map((c, i) => <Cell key={i} fill={c} />)}
                    </Pie>
                    <Tooltip formatter={v => fmtF(v)} contentStyle={TT_STYLE} />
                    <Legend wrapperStyle={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: FONT }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl p-5" style={CARD}>
              <div className="text-[12px] font-semibold text-white/55 mb-4">{ml ? 'Pay Revision Timeline' : 'Pay Revision Timeline'}</div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {R.data.filter(d => d.isRev).map(d => (
                  <div key={d.year} className="rounded-xl p-4 flex-shrink-0 min-w-[160px]"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="text-[11px] font-semibold text-white/60 mb-1">{d.revLabel}</div>
                    <div className="text-[13px] text-white/70 font-medium">Basic: {fmtF(d.basic)}</div>
                    <div className="text-[12px] text-white/50">DA: {d.daPct}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Growth tab ────────────────────────────────────────────────────── */}
        {tab === 'growth' && (
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl p-5" style={CARD}>
              <div className="text-[12px] font-semibold text-white/55 mb-4">
                {ml ? 'Salary Growth' : 'Salary Growth'} {pvOn && <span className="text-white/40 ml-2">— Present Value</span>}
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={R.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 12, fontFamily: FONT }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={fmt} tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 12, fontFamily: FONT }} axisLine={false} tickLine={false} width={55} />
                  <Tooltip contentStyle={TT_STYLE} formatter={v => fmtF(v)} />
                  <Legend wrapperStyle={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: FONT }} />
                  <Area type="monotone" dataKey={pvOn ? 'annSalPV' : 'annSal'} name="Annual Salary" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
                  <Line type="monotone" dataKey="basic" name="Basic Pay" stroke={APS_COLOR} strokeWidth={1.5} dot={false} />
                  {R.data.filter(d => d.isRev).map(d => <ReferenceLine key={d.year} x={d.year} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />)}
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-5" style={CARD}>
              <div className="text-[12px] font-semibold text-white/55 mb-4">
                NPS Corpus Growth (Return: {npsRet}%)
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={R.data}>
                  <defs>
                    <linearGradient id="corpG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={NPS_COLOR} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={NPS_COLOR} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 12, fontFamily: FONT }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={fmt} tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 12, fontFamily: FONT }} axisLine={false} tickLine={false} width={55} />
                  <Tooltip contentStyle={TT_STYLE} formatter={v => fmtF(v)} />
                  <Legend wrapperStyle={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: FONT }} />
                  <Area type="monotone" dataKey={pvOn ? 'corpusPV' : 'corpus'} name="NPS Corpus" fill="url(#corpG)" stroke={NPS_COLOR} strokeWidth={2} />
                  <Area type="monotone" dataKey="totC" name="Contributions" fill={`rgba(245,158,11,0.06)`} stroke={APS_COLOR} strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── Table tab ─────────────────────────────────────────────────────── */}
        {tab === 'table' && (
          <div className="rounded-2xl overflow-hidden" style={CARD}>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]" style={{ minWidth: 640, fontFamily: FONT }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['Year','Basic','DA%','Gross','Emp NPS','Govt NPS','Total/mo','Corpus',...(pvOn?['PV Corpus']:[])].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-white/50 whitespace-nowrap text-[11px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {R.data.map((r, i) => (
                    <tr key={i} className="border-b transition-colors hover:bg-white/[0.03]"
                      style={{ borderColor: 'rgba(255,255,255,0.06)', background: r.isRev ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                      <td className="px-4 py-3 font-semibold text-white/75">
                        {r.year}{r.isRev && <span className="ml-1.5 text-[9px] text-white/40 font-semibold">REV</span>}
                      </td>
                      <td className="px-4 py-3 text-white/65">{fmtF(r.basic)}</td>
                      <td className="px-4 py-3 text-white/55">{r.daPct}%</td>
                      <td className="px-4 py-3 text-white/75 font-medium">{fmtF(r.gross)}</td>
                      <td className="px-4 py-3 text-white/55">{fmtF(r.nE)}</td>
                      <td className="px-4 py-3 text-white/55">{fmtF(r.nG)}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: NPS_COLOR }}>{fmtF(r.mC)}</td>
                      <td className="px-4 py-3 text-white/75 font-medium">{fmt(r.corpus)}</td>
                      {pvOn && <td className="px-4 py-3 text-white/55">{fmt(r.corpusPV)}</td>}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: '2px solid rgba(255,255,255,0.1)' }}>
                    <td colSpan={4} className="px-4 py-3 font-semibold text-white/55 text-[11px]">TOTALS</td>
                    <td className="px-4 py-3 font-semibold text-white/65">{fmt(R.empC)}</td>
                    <td className="px-4 py-3 font-semibold text-white/65">{fmt(R.govC)}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: NPS_COLOR }}>{fmt(R.totC)}</td>
                    <td className="px-4 py-3 font-bold text-white/85">{fmt(R.fC)}</td>
                    {pvOn && <td className="px-4 py-3 font-medium text-white/55">{fmt(Math.round(R.fC * R.rIA))}</td>}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

      {/* ── Post-Retirement Growth (always visible) ──────────────────────── */}
      {R && (
        <div className="mt-8">
          <div className="text-[11px] font-bold uppercase tracking-widest mb-5" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: FONT }}>
            {ml ? 'വിരമിക്കൽ ശേഷം വളർച്ച' : 'Post-Retirement Growth — 25 Year Projection'}
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-2xl p-5" style={CARD}>
              <div className="text-[12px] font-semibold text-white/55 mb-4">
                Monthly Pension After Retirement — APS +{postDR}%/yr vs NPS Fixed
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={R.post}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: FONT }} axisLine={false} tickLine={false} interval={4} />
                  <YAxis tickFormatter={fmt} tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 12, fontFamily: FONT }} axisLine={false} tickLine={false} width={55} />
                  <Tooltip contentStyle={TT_STYLE} formatter={v => fmtF(v)} />
                  <Legend wrapperStyle={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: FONT }} />
                  <Line type="monotone" dataKey={pvOn ? 'apsPV' : 'apsP'} name="APS" stroke={APS_COLOR} strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey={pvOn ? 'npsPV' : 'npsP'} name="NPS" stroke={NPS_COLOR} strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-5" style={CARD}>
              <div className="text-[12px] font-semibold text-white/55 mb-4">
                Cumulative Pension Received
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={R.post}>
                  <defs>
                    <linearGradient id="apsG2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={APS_COLOR} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={APS_COLOR} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="npsG2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={NPS_COLOR} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={NPS_COLOR} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: FONT }} axisLine={false} tickLine={false} interval={4} />
                  <YAxis tickFormatter={fmt} tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 12, fontFamily: FONT }} axisLine={false} tickLine={false} width={55} />
                  <Tooltip contentStyle={TT_STYLE} formatter={v => fmtF(v)} />
                  <Legend wrapperStyle={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: FONT }} />
                  <Area type="monotone" dataKey={pvOn ? 'cAP' : 'cA'} name="APS Total" fill="url(#apsG2)" stroke={APS_COLOR} strokeWidth={2} />
                  <Area type="monotone" dataKey={pvOn ? 'cNP' : 'cN'} name="NPS Total" fill="url(#npsG2)" stroke={NPS_COLOR} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-5" style={CARD}>
              <div className="text-[12px] font-semibold text-white/55 mb-4">
                Pension Difference (APS - NPS cumulative)
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={R.post}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: FONT }} axisLine={false} tickLine={false} interval={4} />
                  <YAxis tickFormatter={fmt} tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 12, fontFamily: FONT }} axisLine={false} tickLine={false} width={55} />
                  <Tooltip contentStyle={TT_STYLE} formatter={v => fmtF(v)} />
                  <Bar dataKey={pvOn ? 'advPV' : 'diff'} name="APS - NPS" radius={[4,4,0,0]}>
                    {R.post.map((e, i) => <Cell key={i} fill={(pvOn ? e.advPV : e.diff) >= 0 ? APS_COLOR : NPS_COLOR} fillOpacity={0.6} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      </>)}

      {/* Disclaimer */}
      <div className="mt-8 text-[12px] text-white/40 text-center leading-relaxed" style={{ fontFamily: FONT }}>
        Illustrative only. Actual amounts depend on pay scales, promotions, DA rates &amp; NPS performance. Consult your pension section for official figures.
      </div>
    </div>
  );
}
