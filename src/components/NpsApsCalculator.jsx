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
      cA, cN, cAP, cNP, adv: cA - cN,
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
  const inp = 'w-full px-3 py-2.5 rounded-xl text-white text-sm font-semibold outline-none appearance-none';
  const bg = { background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.1)', colorScheme: 'dark' };
  const optStyle = { background: '#1c1c1e', color: '#fff' };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold uppercase tracking-widest text-white/60">{label}</label>
      <div className="grid grid-cols-3 gap-1.5">
        <select value={mo} onChange={sel(setMo, 'mo')} className={inp} style={bg}>
          {['01','02','03','04','05','06','07','08','09','10','11','12'].map((m,i) => <option key={m} value={m} style={optStyle}>{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}</option>)}
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
function GlassInput({ label, value, onChange, min, max, step = 1, suffix, help, icon }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold uppercase tracking-widest text-white/55 flex items-center gap-1.5">
        {icon && <span>{icon}</span>}{label}
      </label>
      <div className="relative">
        <input
          type="number" value={value === 0 ? '' : value} placeholder="0"
          min={min} max={max} step={step}
          onChange={e => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
          className="w-full rounded-xl px-3 py-3 text-white text-[15px] font-bold outline-none transition-all focus:ring-2 focus:ring-white/20"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', paddingRight: suffix ? '2.5rem' : '0.75rem' }}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 text-[12px] font-bold">{suffix}</span>}
      </div>
      {help && <div className="text-[10px] text-white/40 leading-relaxed">{help}</div>}
    </div>
  );
}

// ─── Slider Input ─────────────────────────────────────────────────────────────
function SliderInput({ label, value, onChange, min, max, step = 1, suffix, help, icon, color = '#30d158' }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold uppercase tracking-widest text-white/55 flex items-center gap-1.5">
        {icon && <span>{icon}</span>}{label}
        <span className="ml-auto font-black text-[13px]" style={{ color }}>{value}{suffix}</span>
      </label>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, ${color} ${pct}%, rgba(255,255,255,0.1) ${pct}%)`, outline: 'none' }}
      />
      {help && <div className="text-[10px] text-white/40">{help}</div>}
    </div>
  );
}

// ─── Join year selector ───────────────────────────────────────────────────────
function JoinYearSelector({ value, onChange, label }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold uppercase tracking-widest text-white/60">{label}</label>
      <select value={value} onChange={e => onChange(Number(e.target.value))}
        className="w-full px-3 py-2.5 rounded-xl text-white text-sm font-semibold outline-none appearance-none"
        style={{ background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.1)', colorScheme: 'dark' }}>
        {Array.from({ length: 42 }, (_, i) => 2004 + i).map(y => (
          <option key={y} value={y} style={{ background: '#1c1c1e', color: '#fff' }}>{y}</option>
        ))}
      </select>
      <div className="text-[10px] text-white/45">NPS applicable from 2004</div>
    </div>
  );
}

const CARD = { background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' };

const PRESETS = [
  { label: 'New Joiner', labelMl: 'പുതിയ ജോയിൻ', emoji: '🌱', dob: '1998-06-15', joinYear: 2022, basic: 18000, currentDA: 35 },
  { label: 'Mid-career',  labelMl: 'മധ്യ കരിയർ',  emoji: '📊', dob: '1985-06-15', joinYear: 2015, basic: 46000, currentDA: 35 },
  { label: 'Senior',      labelMl: 'സീനിയർ',      emoji: '🏛️', dob: '1975-06-15', joinYear: 2013, basic: 78000, currentDA: 35 },
];
const TT_STYLE = { background: 'var(--nav-dropdown-bg)', border: '1px solid var(--nav-dropdown-border)', borderRadius: 12, color: 'var(--text-primary)', fontSize: 12 };

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
    const winner = R.apsP > R.npsP ? 'APS' : 'NPS';
    const msg = ml
      ? `🏛️ എന്റെ പെൻഷൻ കണക്ക്\n\n📊 സേവനം: ${R.serviceYears} വർഷം\n🗓️ വിരമിക്കൽ: ${retMonthName} ${R.retYear}\n\n🛡️ APS: ${fmtF(R.apsP)}/മാസം\n📈 NPS: ${fmtF(R.npsP)}/മാസം\n🏦 Corpus: ${fmt(R.fC)}\n\n✅ ${winner} ബെസ്റ്റ്\nkeralaemployees.in`
      : `🏛️ My Pension Comparison\n\n📊 Service: ${R.serviceYears} yrs · Retire: ${retMonthName} ${R.retYear}\n\n🛡️ APS: ${fmtF(R.apsP)}/mo\n📈 NPS: ${fmtF(R.npsP)}/mo (+ ${fmt(R.lump)} lump)\n🏦 NPS Corpus: ${fmt(R.fC)}\n\n✅ ${winner} wins\nkeralaemployees.in`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const TABS = [
    { id: 'compare',  label: ml ? 'താരതമ്യം' : 'Compare',    icon: '⚖️' },
    { id: 'growth',   label: ml ? 'വളർച്ച'   : 'Growth',     icon: '📈' },
    { id: 'pension',  label: ml ? 'ശേഷം'     : 'Post-Retire', icon: '🏖️' },
    { id: 'table',    label: ml ? 'പട്ടിക'   : 'Table',      icon: '📋' },
  ];

  return (
    <div>
      {/* Controls bar */}
      <div className="flex justify-between items-center gap-2 flex-wrap mb-5">
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map(pr => (
            <button key={pr.label} onClick={() => applyPreset(pr)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all hover:scale-105 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.65)', cursor: 'pointer' }}>
              {pr.emoji} {ml ? pr.labelMl : pr.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setLang(ml ? 'en' : 'ml')}
            className="px-3 py-2 rounded-xl text-[11px] font-bold transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.55)' }}>
            {ml ? 'EN' : 'മല'}
          </button>
          {R && (
            <button onClick={shareWhatsApp}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold"
              style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)', color: '#25d366' }}>
              <WaIcon /> {ml ? 'ഷെയർ' : 'Share'}
            </button>
          )}
        </div>
      </div>

      {/* ── Inputs ─────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden mb-6" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>

        {/* Section 1 — Profile */}
        <div className="px-6 pt-6 pb-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-black" style={{ background: '#30d158' }}>1</div>
            <div className="text-[13px] font-black text-white/80">{ml ? 'നിങ്ങളുടെ പ്രൊഫൈൽ' : 'Your Profile'}</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DOBSelector value={dob} onChange={setDob} label={ml ? 'ജനന തീയതി' : 'Date of Birth'} />
            <JoinYearSelector value={joinYear} onChange={setJoinYear} label={ml ? 'ചേർന്ന വർഷം' : 'Year of Joining'} />
            <GlassInput label={ml ? 'വിരമിക്കൽ പ്രായം' : 'Retirement Age'} value={retAge} onChange={setRetAge} min={56} max={62} icon="🎯" help="Kerala CPS: 60 yrs" />
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

        {/* Section 2 — Pay Details */}
        <div className="px-6 pt-5 pb-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-black" style={{ background: '#2997ff' }}>2</div>
            <div className="text-[13px] font-black text-white/80">{ml ? 'ശമ്പള വിവരങ്ങൾ' : 'Pay Details'}</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <GlassInput label={ml ? 'Basic Pay' : 'Current Basic Pay'} value={basic} onChange={setBasic} min={0} max={500000} suffix="₹" icon="💰" help={ml ? 'നിലവിലെ Basic Pay' : 'Your current basic pay'} />
            <SliderInput label={ml ? 'DA %' : 'Current DA %'} value={currentDA} onChange={setCurrentDA} min={0} max={100} suffix="%" icon="📊" help="~35% as of 2026" color="#2997ff" />
            <SliderInput label={ml ? 'വാർഷിക DA' : 'Annual DA Increase'} value={annualDA} onChange={setAnnualDA} min={0} max={12} suffix="%/yr" icon="📈" help="~6%/yr (3%×2)" color="#2997ff" />
            <GlassInput label={ml ? 'ഇൻക്രിമെന്റ്' : 'Annual Increment'} value={incRate} onChange={setIncRate} min={0} max={10} step={0.5} suffix="%/yr" icon="⬆️" />
            <GlassInput label={ml ? 'Govt NPS %' : 'Govt NPS %'} value={govPct} onChange={setGovPct} min={0} max={14} suffix="%" icon="🏛️" help="Default 10%, max 14%" />
            <GlassInput label={ml ? 'നിലവിലെ Corpus' : 'Existing NPS Corpus'} value={existingCorpus} onChange={setExistingCorpus} min={0} suffix="₹" icon="🏦" help={ml ? 'ഇല്ലെങ്കിൽ 0' : 'Current NPS balance (0 if none)'} />
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

        {/* Advanced toggle */}
        <div className="px-6 py-3">
          <button onClick={() => setShowAdv(v => !v)}
            className="flex items-center gap-2 text-[11px] font-bold transition-all w-full"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: showAdv ? '#ff9f0a' : 'rgba(255,255,255,0.4)' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 2a4 4 0 100 8A4 4 0 006 2zm0 1.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm0 1a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/>
            </svg>
            {ml ? 'വിപുലമായ ക്രമീകരണങ്ങൾ' : 'Advanced Settings'}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ transition: 'transform 0.2s', transform: showAdv ? 'rotate(180deg)' : 'none', marginLeft: 'auto' }}>
              <path d="M2 3.5l3 3 3-3"/>
            </svg>
          </button>
        </div>

        {showAdv && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col gap-2">
                <SliderInput label={ml ? 'NPS Return' : 'NPS Return'} value={npsRet} onChange={setNpsRet} min={4} max={16} step={0.5} suffix="%" color="#ff9f0a" help="Historical: 9–12%" />
                <div className="flex gap-1.5 flex-wrap">
                  {[6, 8, 10, 12].map(v => (
                    <button key={v} onClick={() => setNpsRet(v)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-black transition-all"
                      style={{ background: npsRet === v ? 'rgba(255,159,10,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${npsRet === v ? '#ff9f0a' : 'rgba(255,255,255,0.1)'}`, color: npsRet === v ? '#ff9f0a' : 'rgba(255,255,255,0.45)', cursor: 'pointer' }}>
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
        <div className="rounded-2xl p-8" style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
          <div className="text-center mb-8">
            <div className="text-3xl mb-3">🔍</div>
            <div className="text-[15px] font-black text-white/70 mb-1">
              {ml ? 'Basic Pay നൽകി ഫലം കാണുക' : 'Enter your Basic Pay to see results'}
            </div>
            <div className="text-[12px] text-white/40">
              {ml ? 'മുകളിൽ ഉദാഹരണ profile ക്ലിക്ക് ചെയ്യാം' : 'Or click a quick profile above to try instantly'}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '🛡️', title: 'APS Pension', desc: ml ? 'അവസാന Basic-ന്റെ 50% ഉറപ്പ്' : 'Guaranteed 50% of last basic pay', color: '#30d158' },
              { icon: '📈', title: 'NPS Corpus', desc: ml ? 'Market-linked corpus + 60% lump sum' : 'Market-linked corpus + 60% tax-free lump', color: '#2997ff' },
              { icon: '⚖️', title: ml ? 'താരതമ്യം' : 'Comparison', desc: ml ? 'ഏത് scheme നിങ്ങൾക്ക് നല്ലത്?' : 'Which scheme wins for your profile?', color: '#ff9f0a' },
            ].map((c, i) => (
              <div key={i} className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-2xl mb-2">{c.icon}</div>
                <div className="text-[12px] font-black mb-1" style={{ color: c.color }}>{c.title}</div>
                <div className="text-[11px] text-white/45 leading-relaxed">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {R && (<>

        {/* ── Face-off ──────────────────────────────────────────────────────── */}
        <div className="mb-6">
          {/* Header row */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-0.5">{ml ? 'മാസ പെൻഷൻ' : 'Monthly Pension Face-Off'}</div>
              <div className="text-[12px] text-white/60 flex items-center gap-2 flex-wrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-pulse inline-block" />
                <strong className="text-white">{retMonthName} {R.retYear}</strong>
                <span className="text-white/35">·</span>
                <span>{R.serviceYears} {ml ? 'വർഷം' : 'yrs'}</span>
                <span className="text-white/35">·</span>
                <span>{ml ? 'Last Basic' : 'Last Basic'}: <strong className="text-white">{fmtF(R.lB)}</strong></span>
              </div>
            </div>
            <button onClick={() => setPvOn(v => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
              style={{ background: pvOn ? 'rgba(48,209,88,0.12)' : 'rgba(255,255,255,0.05)', border: `1px solid ${pvOn ? 'rgba(48,209,88,0.3)' : 'rgba(255,255,255,0.1)'}`, color: pvOn ? '#30d158' : 'rgba(255,255,255,0.45)', cursor: 'pointer' }}>
              <span className="w-7 h-3.5 rounded-full relative flex-shrink-0" style={{ background: pvOn ? 'rgba(48,209,88,0.4)' : 'rgba(255,255,255,0.1)' }}>
                <span className="absolute top-0.5 w-2.5 h-2.5 rounded-full transition-all" style={{ background: pvOn ? '#30d158' : 'rgba(255,255,255,0.4)', left: pvOn ? '15px' : '2px' }} />
              </span>
              📉 {pvOn ? (ml ? 'ഇന്നത്തെ ₹' : "Today's ₹") : (ml ? 'Present Value' : 'Present Value')}
            </button>
          </div>

          {/* APS vs NPS cards */}
          {(() => {
            const apsWins = R.apsP >= R.npsP;
            const winnerStyle = { boxShadow: apsWins ? '0 0 40px rgba(48,209,88,0.12)' : '0 0 40px rgba(41,151,255,0.12)' };
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* APS card */}
                <div className="rounded-2xl p-6 relative overflow-hidden transition-all"
                  style={{ background: apsWins ? 'rgba(48,209,88,0.07)' : 'rgba(255,255,255,0.03)', border: `2px solid ${apsWins ? 'rgba(48,209,88,0.4)' : 'rgba(255,255,255,0.07)'}`, ...(apsWins ? winnerStyle : {}) }}>
                  {apsWins && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-black" style={{ background: '#30d158', color: '#000' }}>
                      ✓ {ml ? 'ജേതാവ്' : 'WINNER'}
                    </div>
                  )}
                  <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: apsWins ? '#30d158' : 'rgba(255,255,255,0.35)' }}>
                    🛡️ {ml ? 'APS — ഉറപ്പ് പെൻഷൻ' : 'APS — Assured Pension'}
                  </div>
                  <div className={`font-black leading-none mb-1 ${apsWins ? 'text-[44px]' : 'text-[36px]'}`} style={{ color: apsWins ? '#30d158' : 'rgba(255,255,255,0.6)' }}>
                    <AnimatedNumber value={pvOn ? R.apsPV : R.apsP} animKey={animKey} />
                  </div>
                  <div className="text-[11px] text-white/45 mb-4">{(R.apsFac * 100).toFixed(0)}% of {fmtF(R.lB)} · /month</div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black" style={{ background: 'rgba(48,209,88,0.12)', color: '#30d158' }}>✓ Guaranteed</span>
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black" style={{ background: 'rgba(48,209,88,0.12)', color: '#30d158' }}>✓ DR Indexed</span>
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black" style={{ background: 'rgba(48,209,88,0.12)', color: '#30d158' }}>✓ No Market Risk</span>
                  </div>
                </div>

                {/* NPS card */}
                <div className="rounded-2xl p-6 relative overflow-hidden transition-all"
                  style={{ background: !apsWins ? 'rgba(41,151,255,0.07)' : 'rgba(255,255,255,0.03)', border: `2px solid ${!apsWins ? 'rgba(41,151,255,0.4)' : 'rgba(255,255,255,0.07)'}`, ...(!apsWins ? winnerStyle : {}) }}>
                  {!apsWins && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-black" style={{ background: '#2997ff', color: '#fff' }}>
                      ✓ {ml ? 'ജേതാവ്' : 'WINNER'}
                    </div>
                  )}
                  <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: !apsWins ? '#2997ff' : 'rgba(255,255,255,0.35)' }}>
                    📈 {ml ? 'NPS — ദേശീയ പെൻഷൻ' : 'NPS — National Pension'}
                  </div>
                  <div className={`font-black leading-none mb-1 ${!apsWins ? 'text-[44px]' : 'text-[36px]'}`} style={{ color: !apsWins ? '#2997ff' : 'rgba(255,255,255,0.6)' }}>
                    <AnimatedNumber value={pvOn ? R.npsPV : R.npsP} animKey={animKey} />
                  </div>
                  <div className="text-[11px] text-white/45 mb-1">40% corpus @ {annRate}% · /month</div>
                  <div className="text-[13px] font-black mb-3" style={{ color: !apsWins ? '#2997ff' : 'rgba(255,255,255,0.55)' }}>
                    + {fmt(pvOn ? R.lumpPV : R.lump)} <span className="text-[10px] font-semibold text-white/40">{ml ? 'lump sum (60%)' : 'lump sum (60%)'}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black" style={{ background: 'rgba(41,151,255,0.12)', color: '#2997ff' }}>60% Tax-Free Lump</span>
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black" style={{ background: 'rgba(255,69,58,0.1)', color: '#ff6b6b' }}>⚠ No DR Growth</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Pension bars */}
          {(() => {
            const maxP = Math.max(R.apsP, R.npsP, 1);
            const apsWins = R.apsP >= R.npsP;
            return (
              <div className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-black w-10 text-right" style={{ color: '#30d158' }}>APS</span>
                  <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div style={{ width: `${(R.apsP / maxP) * 100}%`, background: apsWins ? '#30d158' : 'rgba(48,209,88,0.5)', transition: 'width 0.8s cubic-bezier(.4,0,.2,1)', height: '100%', borderRadius: 9999 }} />
                  </div>
                  <span className="text-[11px] font-bold w-24 text-right" style={{ color: apsWins ? '#30d158' : 'rgba(255,255,255,0.55)' }}>{fmtF(pvOn ? R.apsPV : R.apsP)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black w-10 text-right" style={{ color: '#2997ff' }}>NPS</span>
                  <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div style={{ width: `${(R.npsP / maxP) * 100}%`, background: !apsWins ? '#2997ff' : 'rgba(41,151,255,0.5)', transition: 'width 0.8s cubic-bezier(.4,0,.2,1)', height: '100%', borderRadius: 9999 }} />
                  </div>
                  <span className="text-[11px] font-bold w-24 text-right" style={{ color: !apsWins ? '#2997ff' : 'rgba(255,255,255,0.55)' }}>{fmtF(pvOn ? R.npsPV : R.npsP)}</span>
                </div>
                {R.brk && R.apsP > R.npsP && (
                  <div className="mt-3 pt-3 text-[11px] text-white/50 flex items-center gap-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    ⏳ APS {ml ? 'ഏകദേശം' : 'recovers'} {fmt(R.lump)} NPS lump {ml ? 'ഏകദേശം' : 'in ~'}<strong className="text-white">{R.brk} {ml ? 'വർഷം' : 'yrs'}</strong>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* ── Quick stats ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: ml ? 'NPS കോർപ്പസ്' : 'NPS Corpus',    value: pvOn ? Math.round(R.fC * R.rIA) : R.fC,    sub: `${fmt(R.totC)} contrib`,    color: 'rgba(255,255,255,0.88)' },
            { label: ml ? 'ഒറ്റത്തവണ (60%)' : 'Lump Sum (60%)', value: pvOn ? R.lumpPV : R.lump,            sub: ml ? 'വിരമിക്കലിൽ'  : 'At retirement', color: 'rgba(255,255,255,0.88)' },
            { label: ml ? 'അവസാന ഗ്രോസ്' : 'Last Gross Pay', value: R.lG,                                   sub: `Basic ${fmtF(R.lB)}`,                color: '#30d158' },
            { label: ml ? 'സേവനം' : 'Service',                value: null, text: `${R.serviceYears} yrs`,    sub: `→ ${retMonthName} ${R.retYear}`, color: 'rgba(255,255,255,0.88)' },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-4" style={CARD}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">{s.label}</div>
              <div className="text-[20px] font-black leading-none mb-1" style={{ color: s.color }}>
                {s.text ? s.text : <AnimatedNumber value={s.value} animKey={animKey} />}
              </div>
              {s.sub && <div className="text-[10px] text-white/50">{s.sub}</div>}
            </div>
          ))}
        </div>

        {/* Verdict card */}
        {(() => {
          const apsBetter = R.apsP > R.npsP;
          const lumpYears = R.brk;
          const diff = Math.abs(R.apsP - R.npsP);
          let verdictLines = [];
          if (apsBetter) {
            verdictLines = ml ? [
              `✅ APS ${fmtF(diff)}/മാസം കൂടുതൽ നൽകുന്നു — ഉറപ്പ്, DR-indexed.`,
              lumpYears ? `⏳ NPS-ന്റെ ${fmt(R.lump)} lump sum ഏകദേശം ${lumpYears} വർഷത്തിൽ APS-ൽ തിരിച്ചടക്കാം.` : null,
              `🛡️ APS ഉറപ്പ് ആണ്; market risk ഇല്ല.`,
            ] : [
              `✅ APS pays ${fmtF(diff)}/month more — guaranteed & DR-indexed. It grows every year.`,
              lumpYears ? `⏳ APS recovers the NPS lump sum (${fmt(R.lump)}) through higher pension in ~${lumpYears} years.` : null,
              `🛡️ If you prefer certainty over market risk, APS is the safer choice here.`,
            ];
          } else {
            const npsAdv = diff;
            verdictLines = ml ? [
              `📈 NPS ${fmtF(npsAdv)}/മാസം കൂടുതൽ + ${fmt(R.lump)} tax-free lump sum.`,
              `⚠️ NPS annuity fixed; APS DR-indexed ആയതിനാൽ വർഷങ്ങൾ കഴിഞ്ഞ് APS മുന്നിലാകാം.`,
              `💡 NPS return ${npsRet}%+ ആണെങ്കിൽ NPS നല്ലതാണ്. Return കുറഞ്ഞാൽ APS ഭദ്രം.`,
            ] : [
              `📈 NPS gives ${fmtF(npsAdv)}/month more + a ${fmt(R.lump)} tax-free lump sum at retirement.`,
              `⚠️ NPS annuity is fixed; APS grows with DR — the gap may close or reverse over time.`,
              `💡 NPS makes sense if you expect ${npsRet}%+ returns. Try lower return scenarios to see your risk.`,
            ];
          }
          return (
            <div className="rounded-2xl p-5 mb-6" style={{ background: apsBetter ? 'rgba(48,209,88,0.05)' : 'rgba(41,151,255,0.05)', border: `1px solid ${apsBetter ? 'rgba(48,209,88,0.18)' : 'rgba(41,151,255,0.18)'}` }}>
              <div className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: apsBetter ? '#30d158' : '#2997ff' }}>
                {ml ? 'ഇതിന്റെ അർത്ഥം' : 'What this means for you'}
              </div>
              <div className="flex flex-col gap-2">
                {verdictLines.filter(Boolean).map((line, i) => (
                  <div key={i} className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)', fontFamily: ml ? 'var(--font-noto-malayalam), sans-serif' : 'inherit' }}>{line}</div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Notices */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="rounded-xl px-4 py-3 text-[11px] leading-relaxed flex gap-2" style={{ background: 'rgba(255,69,58,0.07)', border: '1px solid rgba(255,69,58,0.2)', color: '#ff9f9f' }}>
            🚫 <span><strong>{ml ? 'DCRG ഇല്ല:' : 'No DCRG:'}</strong> {ml ? 'APS അല്ലെങ്കിൽ NPS-ൽ കേരള സർക്കാർ ജീവനക്കാർക്ക് DCRG ലഭിക്കില്ല.' : 'Kerala government employees do NOT receive DCRG under APS or NPS.'}</span>
          </div>
          <div className="rounded-xl px-4 py-3 text-[11px] leading-relaxed flex gap-2" style={{ background: 'rgba(255,69,58,0.07)', border: '1px solid rgba(255,69,58,0.2)', color: '#ff9f9f' }}>
            ⚠️ <span><strong>G.O.(P) No.33/2026/F.N (28.02.2026):</strong> {ml ? 'APS-ൽ ഒറ്റത്തവണ തുക ഉണ്ടാകില്ലെന്ന് G.O. സൂചിപ്പിക്കുന്നു.' : 'Latest G.O. on APS does not mention any lump sum.'}</span>
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────────────────────────── */}
        <div className="rounded-xl p-1 flex gap-1 mb-5 overflow-x-auto" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-bold whitespace-nowrap transition-all flex-1 justify-center"
              style={{
                background: tab === t.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: tab === t.id ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
                color: tab === t.id ? '#fff' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
              }}>
              <span>{t.icon}</span> <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── Compare tab ───────────────────────────────────────────────────── */}
        {tab === 'compare' && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="rounded-2xl p-5" style={CARD}>
                <div className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-4">🍩 NPS Corpus Sources</div>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={[
                      { name: ml ? 'നിങ്ങൾ 10%' : 'Your 10%',     value: R.empC },
                      { name: ml ? `സർക്കാർ ${govPct}%` : `Govt ${govPct}%`, value: R.govC },
                      { name: ml ? 'Returns'    : 'Returns',        value: R.totR },
                    ]} cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={4} dataKey="value">
                      {['rgba(255,255,255,0.55)','#30d158','rgba(255,255,255,0.25)'].map((c, i) => <Cell key={i} fill={c} />)}
                    </Pie>
                    <Tooltip formatter={v => fmtF(v)} contentStyle={TT_STYLE} />
                    <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-faint)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl p-5" style={CARD}>
                <div className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-4">💰 {ml ? 'വിരമിക്കൽ ഭാഗം' : 'Retirement Split'}</div>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={[
                      { name: ml ? 'ഒറ്റത്തവണ 60%' : 'Lump 60%',    value: R.lump },
                      { name: ml ? 'Annuity 40%' : 'Annuity 40%', value: R.annCorp },
                    ]} cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={4} dataKey="value">
                      {['#30d158','rgba(255,255,255,0.35)'].map((c, i) => <Cell key={i} fill={c} />)}
                    </Pie>
                    <Tooltip formatter={v => fmtF(v)} contentStyle={TT_STYLE} />
                    <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-faint)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl p-5" style={CARD}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-4">🕐 {ml ? 'പേ റിവിഷൻ ടൈംലൈൻ' : 'Pay Revision Timeline'}</div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {R.data.filter(d => d.isRev).map(d => (
                  <div key={d.year} className="rounded-xl p-3 flex-shrink-0 min-w-[150px]"
                    style={{ background: 'var(--surface-xs)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="text-[10px] font-black text-white/55 mb-1">{d.revLabel}</div>
                    <div className="text-[11px] text-white/50">Basic: {fmtF(d.basic)}</div>
                    <div className="text-[11px] text-white/55">DA: {d.daPct}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-5" style={CARD}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-4">📝 {ml ? 'പ്രധാന വസ്തുതകൾ' : 'Key Facts'}</div>
              <div className="grid gap-2.5">
                {[
                  { type: 'ok',   text: ml ? 'APS: 30+ വർഷം സേവനത്തിന് Last Basic-ന്റെ 50%. കുറഞ്ഞ സേവനം: (വർഷം÷60)×Basic.' : 'APS: 50% of last Basic for 30+ yrs service. Less service: (Yrs÷60)×Basic.' },
                  { type: 'info', text: ml ? `NPS: ജീവനക്കാരൻ 10% + സർക്കാർ ${govPct}% of (Basic+DA). DA, increment, revision-ൊടൊപ്പം വളരുന്നു.` : `NPS: Emp 10% + Govt ${govPct}% of (Basic+DA) monthly. Grows with DA, increments & revisions.` },
                  { type: 'warn', text: ml ? `APS ${postDR}%/yr DR-ൊടൊപ്പം വളരുന്നു. NPS annuity ഉറച്ചതാണ് — വർഷങ്ങൾ പോകുംതോറും വ്യത്യാസം കൂടും.` : `APS pension grows with DR (${postDR}%/yr) after retirement. NPS annuity is fixed — gap widens over time.` },
                  { type: 'info', text: ml ? '12th Pay Rev (ജൂൺ 2026): Basic×1.38, DA resets to 4%. അടുത്ത revisions ഓരോ 5 വർഷവും.' : '12th Pay Rev (Jun 2026): Basic×1.38, DA resets to 4%. Next revisions every 5 years.' },
                ].map((n, i) => {
                  const cols = { ok: ['rgba(48,209,88,0.07)','rgba(48,209,88,0.2)','#86efac'], info: ['rgba(255,255,255,0.04)','rgba(255,255,255,0.12)','rgba(255,255,255,0.65)'], warn: ['rgba(255,69,58,0.07)','rgba(255,69,58,0.2)','#ff9f9f'] }[n.type];
                  const icons = { ok: '✅', info: 'ℹ️', warn: '⚠️' };
                  return (
                    <div key={i} className="rounded-xl px-4 py-3 text-[11px] leading-relaxed flex gap-2"
                      style={{ background: cols[0], border: `1px solid ${cols[1]}`, color: cols[2] }}>
                      <span>{icons[n.type]}</span><span>{n.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Growth tab ────────────────────────────────────────────────────── */}
        {tab === 'growth' && (
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl p-5" style={CARD}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-4">
                📈 {ml ? 'ശമ്പള വളർച്ച' : 'Salary Growth'} {pvOn && <span className="text-[#30d158] ml-2">— Today&apos;s ₹</span>}
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={R.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-xs)" />
                  <XAxis dataKey="year" tick={{ fill: 'var(--text-ghost)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={fmt} tick={{ fill: 'var(--text-ghost)', fontSize: 11 }} axisLine={false} tickLine={false} width={55} />
                  <Tooltip contentStyle={TT_STYLE} formatter={v => fmtF(v)} />
                  <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-faint)' }} />
                  <Area type="monotone" dataKey={pvOn ? 'annSalPV' : 'annSal'} name={ml ? 'വാർഷിക ശമ്പളം' : 'Annual Salary'} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
                  <Line type="monotone" dataKey="basic" name={ml ? 'Basic Pay' : 'Basic Pay'} stroke="#30d158" strokeWidth={1.5} dot={false} />
                  {R.data.filter(d => d.isRev).map(d => <ReferenceLine key={d.year} x={d.year} stroke="var(--surface-sm)" strokeDasharray="3 3" />)}
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-5" style={CARD}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-4">
                🏦 NPS Corpus Growth ({ml ? 'Return:' : 'Return:'} {npsRet}%)
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={R.data}>
                  <defs>
                    <linearGradient id="corpG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="rgba(255,255,255,0.5)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="rgba(255,255,255,0.5)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-xs)" />
                  <XAxis dataKey="year" tick={{ fill: 'var(--text-ghost)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={fmt} tick={{ fill: 'var(--text-ghost)', fontSize: 11 }} axisLine={false} tickLine={false} width={55} />
                  <Tooltip contentStyle={TT_STYLE} formatter={v => fmtF(v)} />
                  <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-faint)' }} />
                  <Area type="monotone" dataKey={pvOn ? 'corpusPV' : 'corpus'} name="NPS Corpus" fill="url(#corpG)" stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
                  <Area type="monotone" dataKey="totC" name={ml ? 'സംഭാവനകൾ' : 'Contributions'} fill="rgba(48,209,88,0.06)" stroke="#30d158" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── Post-retire tab ───────────────────────────────────────────────── */}
        {tab === 'pension' && (
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl p-5" style={CARD}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-4">
                📊 {ml ? 'മാസ പെൻഷൻ' : 'Monthly Pension'} · APS +{postDR}%/yr · NPS Fixed
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={R.post}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-xs)" />
                  <XAxis dataKey="label" tick={{ fill: 'var(--text-ghost)', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                  <YAxis tickFormatter={fmt} tick={{ fill: 'var(--text-ghost)', fontSize: 11 }} axisLine={false} tickLine={false} width={55} />
                  <Tooltip contentStyle={TT_STYLE} formatter={v => fmtF(v)} />
                  <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-faint)' }} />
                  <Line type="monotone" dataKey={pvOn ? 'apsPV' : 'apsP'} name="APS" stroke="#30d158" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey={pvOn ? 'npsPV' : 'npsP'} name="NPS" stroke="rgba(255,255,255,0.55)" strokeWidth={2.5} dot={false} strokeDasharray="6 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-5" style={CARD}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-4">
                💰 {ml ? 'മൊത്തം പെൻഷൻ' : 'Cumulative Pension'}
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={R.post}>
                  <defs>
                    <linearGradient id="apsG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#30d158" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#30d158" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="npsG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="rgba(255,255,255,0.5)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="rgba(255,255,255,0.5)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-xs)" />
                  <XAxis dataKey="label" tick={{ fill: 'var(--text-ghost)', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                  <YAxis tickFormatter={fmt} tick={{ fill: 'var(--text-ghost)', fontSize: 11 }} axisLine={false} tickLine={false} width={55} />
                  <Tooltip contentStyle={TT_STYLE} formatter={v => fmtF(v)} />
                  <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-faint)' }} />
                  <Area type="monotone" dataKey={pvOn ? 'cAP' : 'cA'} name="APS Total" fill="url(#apsG)" stroke="#30d158" strokeWidth={2} />
                  <Area type="monotone" dataKey={pvOn ? 'cNP' : 'cN'} name="NPS Total" fill="url(#npsG)" stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-5" style={CARD}>
              <div className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-4">
                📐 {ml ? 'APS മേൽക്കൈ' : 'APS Advantage vs NPS'}
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={R.post}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-xs)" />
                  <XAxis dataKey="label" tick={{ fill: 'var(--text-ghost)', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                  <YAxis tickFormatter={fmt} tick={{ fill: 'var(--text-ghost)', fontSize: 11 }} axisLine={false} tickLine={false} width={55} />
                  <Tooltip contentStyle={TT_STYLE} formatter={v => fmtF(v)} />
                  <Bar dataKey={pvOn ? 'advPV' : 'adv'} name="APS Advantage" radius={[4,4,0,0]}>
                    {R.post.map((e, i) => <Cell key={i} fill={(pvOn ? e.advPV : e.adv) >= 0 ? '#30d158' : '#ff453a'} fillOpacity={0.6} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {R.brk && R.apsP > R.npsP && (
                <div className="mt-3 rounded-xl px-4 py-2.5 text-[11px] flex gap-2" style={{ background: 'rgba(48,209,88,0.07)', border: '1px solid rgba(48,209,88,0.2)', color: '#86efac' }}>
                  ✅ <span><strong>Insight:</strong> APS {ml ? 'ഏകദേശം' : 'recovers'} {fmt(R.lump)} NPS lump sum {ml ? 'ഏകദേശം' : 'in ~'}<strong> {R.brk} {ml ? 'വർഷം' : 'years'}</strong>.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Table tab ─────────────────────────────────────────────────────── */}
        {tab === 'table' && (
          <div className="rounded-2xl overflow-hidden" style={CARD}>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]" style={{ minWidth: 640 }}>
                <thead>
                  <tr style={{ background: 'var(--surface-xs)', borderBottom: '1px solid var(--surface-xs)' }}>
                    {['Year','Basic','DA%','Gross','Emp','Govt','Monthly','Corpus',...(pvOn?['PV Corpus']:[])].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-black uppercase tracking-widest text-white/45 whitespace-nowrap text-[9px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {R.data.map((r, i) => (
                    <tr key={i} className="border-b transition-colors hover:bg-white/[0.02]"
                      style={{ borderColor: 'var(--surface-xs)', background: r.isRev ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                      <td className="px-4 py-2.5 font-bold text-white/70">
                        {r.year}{r.isRev && <span className="ml-1.5 text-[8px] text-white/40 font-black">REV</span>}
                      </td>
                      <td className="px-4 py-2.5 text-white/60">{fmtF(r.basic)}</td>
                      <td className="px-4 py-2.5 text-white/50">{r.daPct}%</td>
                      <td className="px-4 py-2.5 text-white/70 font-semibold">{fmtF(r.gross)}</td>
                      <td className="px-4 py-2.5 text-[#ff453a]/70">{fmtF(r.nE)}</td>
                      <td className="px-4 py-2.5 text-white/50">{fmtF(r.nG)}</td>
                      <td className="px-4 py-2.5 text-[#30d158]/80 font-semibold">{fmtF(r.mC)}</td>
                      <td className="px-4 py-2.5 text-white/70 font-bold">{fmt(r.corpus)}</td>
                      {pvOn && <td className="px-4 py-2.5 text-white/55">{fmt(r.corpusPV)}</td>}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: '2px solid var(--surface-sm)' }}>
                    <td colSpan={4} className="px-4 py-3 font-bold text-white/60 text-[10px]">TOTALS →</td>
                    <td className="px-4 py-3 font-bold text-[#ff453a]">{fmt(R.empC)}</td>
                    <td className="px-4 py-3 font-bold text-white/60">{fmt(R.govC)}</td>
                    <td className="px-4 py-3 font-black text-[#30d158]">{fmt(R.totC)}</td>
                    <td className="px-4 py-3 font-black text-[#30d158]">{fmt(R.fC)}</td>
                    {pvOn && <td className="px-4 py-3 font-bold text-white/55">{fmt(Math.round(R.fC * R.rIA))}</td>}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

      </>)}

      {/* Disclaimer */}
      <div className="mt-8 text-[11px] text-white/40 text-center leading-relaxed">
        ⚠️ Illustrative only. Actual amounts depend on pay scales, promotions, DA rates &amp; NPS performance. Consult your pension section for official figures.
      </div>
    </div>
  );
}
