'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import FAQSection from '@/components/FAQSection';

const NPS_APS_FAQS = [
  {
    q: 'What is the difference between NPS and APS for Kerala government employees?',
    a: 'NPS (National Pension System) is a market-linked pension scheme where corpus depends on investment returns. APS (Assured Pension Scheme) guarantees 50% of last drawn salary as pension, similar to the old pension scheme. APS provides certainty while NPS depends on market performance.',
  },
  {
    q: 'Who is eligible for APS in Kerala?',
    a: 'Kerala government employees who joined service on or after 01-04-2013 (covered under NPS) are eligible to opt for the Assured Pension Scheme (APS) as per the Kerala government\'s decision to introduce an assured pension option.',
  },
  {
    q: 'Which is better — NPS or APS for Kerala government employees?',
    a: 'APS is generally considered safer as it guarantees 50% of last salary as pension regardless of market conditions. NPS can provide higher returns if markets perform well but comes with uncertainty. Employees with longer service periods tend to benefit more from NPS in a good market, while APS suits those who prefer certainty.',
  },
  {
    q: 'What is the employer contribution in NPS for Kerala?',
    a: 'In NPS, the employee contributes 10% of Basic Pay + DA, and the government (employer) contributes 10% of Basic Pay + DA to the NPS corpus. Both amounts are invested in the NPS fund.',
  },
  {
    q: 'Can I switch from NPS to APS in Kerala?',
    a: 'Yes, eligible NPS employees in Kerala can opt for APS as per the state government\'s notification. Once switched to APS, the accumulated NPS corpus is handled as per the scheme rules. Check the latest GO from Finance Department for current opt-in procedures.',
  },
  {
    q: 'What happens to NPS corpus after retirement in Kerala?',
    a: 'On retirement under NPS, the employee must use at least 40% of the corpus to purchase an annuity (monthly pension from an insurance company). The remaining 60% can be withdrawn as a lump sum, which is tax-free.',
  },
];
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
const MONTHS_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];

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

  // Post-retirement comparison (25 years)
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

  // Breakeven: how many years for APS to recover NPS lump sum advantage
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

// ─── Animated counter ─────────────────────────────────────────────────────────
function Anim({ value }) {
  const [d, setD] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    const start = d;
    const diff  = value - start;
    const t0    = performance.now();
    const run   = now => {
      const prog = Math.min((now - t0) / 700, 1);
      setD(Math.round(start + diff * (1 - Math.pow(1 - prog, 3))));
      if (prog < 1) rafRef.current = requestAnimationFrame(run);
    };
    rafRef.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);
  return <span>{fmtF(d)}</span>;
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
  const bg = { background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold uppercase tracking-widest text-white/60">{label}</label>
      <div className="grid grid-cols-3 gap-1.5">
        <select value={dy} onChange={sel(setDy, 'dy')} className={inp} style={bg}>
          {Array.from({ length: daysInMonth }, (_, i) => (
            <option key={i+1} value={String(i+1).padStart(2,'0')}>{i+1}</option>
          ))}
        </select>
        <select value={mo} onChange={sel(setMo, 'mo')} className={inp} style={bg}>
          {MONTHS_FULL.map((m, i) => (
            <option key={i} value={String(i+1).padStart(2,'0')}>{m}</option>
          ))}
        </select>
        <select value={yr} onChange={sel(setYr, 'yr')} className={inp} style={bg}>
          {Array.from({ length: 45 }, (_, i) => (
            <option key={i} value={String(1960+i)}>{1960+i}</option>
          ))}
        </select>
      </div>
      <div className="text-[10px] text-white/45">Day / Month / Year · Kerala employees retire in birth month</div>
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
function GlassInput({ label, value, onChange, min, max, step = 1, suffix, help }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold uppercase tracking-widest text-white/60">{label}</label>
      <div className="relative">
        <input
          type="number" value={value === 0 ? '' : value} placeholder="0"
          min={min} max={max} step={step}
          onChange={e => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
          className="w-full rounded-xl px-3 py-2.5 text-white text-sm font-semibold outline-none"
          style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)', paddingRight: suffix ? '2.5rem' : '0.75rem' }}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-[11px] font-bold">{suffix}</span>}
      </div>
      {help && <div className="text-[10px] text-white/45">{help}</div>}
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
        style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}>
        {Array.from({ length: 42 }, (_, i) => 2004 + i).map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <div className="text-[10px] text-white/45">NPS applicable from 2004</div>
    </div>
  );
}

const CARD = { background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' };
const TT_STYLE = { background: 'var(--nav-dropdown-bg)', border: '1px solid var(--nav-dropdown-border)', borderRadius: 12, color: 'var(--text-primary)', fontSize: 12 };

const WaIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#25d366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ─── Main page ────────────────────────────────────────────────────────────────
export default function NPSvsAPSPage() {
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

  const ml = lang === 'ml';

  const R = useMemo(() => simulate({
    dob, joinYear, retAge, basic, currentDA, annualDA, incRate,
    govPct, existingCorpus, npsRet, annRate, postDR, inf,
  }), [dob, joinYear, retAge, basic, currentDA, annualDA, incRate, govPct, existingCorpus, npsRet, annRate, postDR, inf]);

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
    <div className="min-h-screen bg-aurora text-white overflow-x-hidden relative">

      <div className="relative max-w-[1100px] mx-auto px-4 pt-[100px] pb-16">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-white/60 mb-3 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors no-underline text-white/60">Home</Link>
              <span>›</span>
              <span className="text-[#ff9f0a]">{ml ? 'NPS vs APS കാൽക്കുലേറ്റർ' : 'NPS vs APS Calculator'}</span>
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#ff9f0a] mb-2">Pension Comparison Tool</div>
            <h1 className="text-[clamp(22px,3.5vw,40px)] font-[900] tracking-[-0.03em] text-white leading-tight" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              NPS vs APS {ml ? 'കാൽക്കുലേറ്റർ' : 'Calculator'}
            </h1>
            <p className="text-[13px] text-white/55 mt-1">
              {ml ? 'കേരള സർക്കാർ ജീവനക്കാർക്കുള്ള പെൻഷൻ കാൽക്കുലേറ്റർ' : 'Kerala Government Employees — Pension Projection with Pay Revision Schedule'}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setLang(ml ? 'en' : 'ml')}
              className="px-4 py-2 rounded-full text-[12px] font-bold transition-all"
              style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-md)', color: 'var(--text-dim)' }}>
              {ml ? 'English' : 'മലയാളം'}
            </button>
            {R && (
              <button onClick={shareWhatsApp}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold transition-all"
                style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)', color: '#25d366' }}>
                <WaIcon /> {ml ? 'ഷെയർ' : 'Share'}
              </button>
            )}
          </div>
        </div>

        {/* ── Inputs ─────────────────────────────────────────────────────────── */}
        <div className="rounded-2xl p-6 mb-6" style={CARD}>
          <div className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-5">
            {ml ? 'നിങ്ങളുടെ വിവരങ്ങൾ' : 'Your Service Details'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
            <DOBSelector value={dob} onChange={setDob} label={ml ? 'ജനന തീയതി' : 'Date of Birth'} />
            <JoinYearSelector value={joinYear} onChange={setJoinYear} label={ml ? 'സർവീസ് ചേർന്ന വർഷം' : 'Year of Joining'} />
            <GlassInput label={ml ? 'വിരമിക്കൽ പ്രായം' : 'Retirement Age'} value={retAge} onChange={setRetAge} min={56} max={62} help="Kerala CPS: 60 yrs" />
            <GlassInput label={ml ? 'അടിസ്ഥാന ശമ്പളം' : 'Current Basic Pay'} value={basic} onChange={setBasic} min={0} max={500000} suffix="₹" help={ml ? 'നിലവിലെ Basic Pay' : 'Your current basic pay'} />
            <GlassInput label={ml ? 'DA %' : 'Current DA %'} value={currentDA} onChange={setCurrentDA} min={0} max={100} suffix="%" help="~35% as of 2026" />
            <GlassInput label={ml ? 'വാർഷിക DA വർദ്ധന' : 'Annual DA Increase'} value={annualDA} onChange={setAnnualDA} min={0} max={12} suffix="%/yr" help="~6%/yr (3%×2)" />
            <GlassInput label={ml ? 'ഇൻക്രിമെന്റ്' : 'Annual Increment'} value={incRate} onChange={setIncRate} min={0} max={10} step={0.5} suffix="%/yr" />
            <GlassInput label={ml ? 'സർക്കാർ NPS %' : 'Govt NPS %'} value={govPct} onChange={setGovPct} min={0} max={14} suffix="%" help="Default 10%, max 14%" />
            <GlassInput label={ml ? 'നിലവിലെ NPS കോർപ്പസ്' : 'Existing NPS Corpus'} value={existingCorpus} onChange={setExistingCorpus} min={0} suffix="₹" help={ml ? 'NPS-ൽ ഉള്ള തുക (ഇല്ലെങ്കിൽ 0)' : 'Current NPS balance (0 if none)'} />
          </div>

          {/* Advanced */}
          <div className="pt-4 border-t border-white/[0.06]">
            <div className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-4">
              {ml ? 'വിപുലമായ ക്രമീകരണങ്ങൾ' : 'Advanced Settings'}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <GlassInput label={ml ? 'NPS റിട്ടേൺ' : 'NPS Return'} value={npsRet} onChange={setNpsRet} min={0} max={18} step={0.5} suffix="%" help="Historical: 9–12%" />
              <GlassInput label={ml ? 'വാർഷിക നിരക്ക്' : 'Annuity Rate'} value={annRate} onChange={setAnnRate} min={0} max={10} step={0.5} suffix="%" />
              <GlassInput label={ml ? 'വിരമിക്കൽ DR' : 'Post-Retire DR'} value={postDR} onChange={setPostDR} min={0} max={10} step={0.5} suffix="%" help="APS grows yearly" />
              <GlassInput label={ml ? 'പണപ്പെരുപ്പം' : 'Inflation'} value={inf} onChange={setInf} min={0} max={15} step={0.5} suffix="%" help="For present value" />
            </div>
          </div>
        </div>

        {/* Empty state */}
        {!R && (
          <div className="rounded-2xl p-12 text-center" style={CARD}>
            <div className="text-4xl mb-4">👆</div>
            <div className="text-[15px] font-bold text-white/60 mb-2">
              {ml ? 'വിവരങ്ങൾ നൽകുക' : 'Fill in your details above'}
            </div>
            <div className="text-[12px] text-white/50">
              {ml ? 'Basic Pay, DA%, ചേർന്ന വർഷം നൽകിയാൽ ഫലം ലഭിക്കും' : 'Enter Basic Pay, DA% and joining year to see your pension comparison'}
            </div>
          </div>
        )}

        {R && (<>

          {/* ── Face-off ──────────────────────────────────────────────────────── */}
          <div className="rounded-2xl p-6 mb-6" style={CARD}>
            <div className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-4">
              {ml ? 'മാസ പെൻഷൻ താരതമ്യം' : 'Monthly Pension Face-Off'}
            </div>

            <div className="text-[12px] text-white/60 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-pulse inline-block" />
              {ml ? 'വിരമിക്കൽ:' : 'Retirement:'} <strong className="text-white">{retMonthName} {R.retYear}</strong>
              &nbsp;·&nbsp;{R.serviceYears} {ml ? 'വർഷം' : 'yrs service'}
              &nbsp;·&nbsp;{ml ? 'Last Basic:' : 'Last Basic:'} <strong className="text-white">{fmtF(R.lB)}</strong>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {/* APS */}
              <div className="rounded-2xl p-5 text-center" style={{ background: 'rgba(48,209,88,0.05)', border: '1px solid rgba(48,209,88,0.15)' }}>
                <div className="text-[9px] font-black uppercase tracking-widest text-[#30d158]/60 mb-3">
                  {ml ? 'APS (ഉറപ്പ് പെൻഷൻ)' : 'APS — Assured Pension'}
                </div>
                <div className="text-[38px] font-black text-[#30d158] leading-none mb-2">
                  <Anim value={pvOn ? R.apsPV : R.apsP} />
                </div>
                <div className="text-[11px] text-white/55 mb-3">
                  {(R.apsFac * 100).toFixed(0)}% of {fmtF(R.lB)} &nbsp;·&nbsp; /month
                </div>
                <div className="flex gap-2 justify-center flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black text-[#30d158]" style={{ background: 'rgba(48,209,88,0.12)', border: '1px solid rgba(48,209,88,0.2)' }}>✓ {ml ? 'ഉറപ്പ്' : 'Guaranteed'}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black text-[#30d158]" style={{ background: 'rgba(48,209,88,0.12)', border: '1px solid rgba(48,209,88,0.2)' }}>✓ DR {ml ? 'ഇൻഡക്സ്ഡ്' : 'Indexed'}</span>
                </div>
              </div>

              {/* NPS */}
              <div className="rounded-2xl p-5 text-center" style={{ background: 'rgba(41,151,255,0.05)', border: '1px solid rgba(41,151,255,0.15)' }}>
                <div className="text-[9px] font-black uppercase tracking-widest text-[#2997ff]/60 mb-3">
                  {ml ? 'NPS (ദേശീയ പെൻഷൻ)' : 'NPS — National Pension'}
                </div>
                <div className="text-[38px] font-black text-[#2997ff] leading-none mb-2">
                  <Anim value={pvOn ? R.npsPV : R.npsP} />
                </div>
                <div className="text-[11px] text-white/55 mb-3">
                  40% @ {annRate}% &nbsp;·&nbsp; + {fmt(pvOn ? R.lumpPV : R.lump)} {ml ? 'ഒറ്റത്തവണ' : 'lump sum'}
                </div>
                <div className="flex gap-2 justify-center flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black text-[#2997ff]" style={{ background: 'rgba(41,151,255,0.12)', border: '1px solid rgba(41,151,255,0.2)' }}>60% {ml ? 'ഒറ്റത്തവണ' : 'Lump Sum'}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black text-[#ff453a]" style={{ background: 'rgba(255,69,58,0.12)', border: '1px solid rgba(255,69,58,0.2)' }}>⚠ {ml ? 'DR ഇല്ല' : 'No DR'}</span>
                </div>
              </div>
            </div>

            {/* Winner banner */}
            <div className="rounded-xl px-5 py-3 text-center mb-4"
              style={{ background: R.apsP > R.npsP ? 'rgba(48,209,88,0.07)' : 'rgba(41,151,255,0.07)', border: `1px solid ${R.apsP > R.npsP ? 'rgba(48,209,88,0.2)' : 'rgba(41,151,255,0.2)'}` }}>
              <div className="text-[14px] font-black" style={{ color: R.apsP > R.npsP ? '#30d158' : '#2997ff' }}>
                {R.apsP > R.npsP ? '🛡️ APS' : '📊 NPS'} {ml ? 'കൂടുതൽ' : 'pays'} {fmtF(Math.abs(R.apsP - R.npsP))}/{ml ? 'മാസം' : 'month'} {ml ? 'നൽകുന്നു' : 'more'}
              </div>
              {R.brk && R.apsP > R.npsP && (
                <div className="text-[11px] text-white/55 mt-1">
                  APS {ml ? 'ഒറ്റത്തവണ തുക' : 'recovers'} {fmt(R.lump)} {ml ? 'ഏകദേശം' : 'lump sum in ~'}<strong className="text-white">{R.brk} {ml ? 'വർഷം' : 'yrs'}</strong>
                </div>
              )}
            </div>

            {/* PV toggle */}
            <button onClick={() => setPvOn(v => !v)}
              className="flex items-center gap-2 text-[12px] font-semibold transition-colors mx-auto"
              style={{ color: pvOn ? '#30d158' : 'var(--text-ghost)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <span className="w-8 h-4 rounded-full flex items-center"
                style={{ background: pvOn ? 'rgba(48,209,88,0.3)' : 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}>
                <span className="w-3 h-3 rounded-full ml-[2px] transition-transform"
                  style={{ background: pvOn ? '#30d158' : 'var(--text-ghost)', transform: pvOn ? 'translateX(16px)' : 'none' }} />
              </span>
              {pvOn
                ? `📉 ${ml ? 'ഇന്നത്തെ മൂല്യം' : "Today's Value"} (${inf}% {ml ? 'inflation' : 'inflation'}) — ON`
                : `📉 ${ml ? 'ഇന്നത്തെ മൂല്യം കാണുക' : "Show in Today's Value"}`}
            </button>
          </div>

          {/* ── Quick stats ───────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              { label: ml ? 'NPS കോർപ്പസ്' : 'NPS Corpus',    value: pvOn ? Math.round(R.fC * R.rIA) : R.fC,    sub: `${fmt(R.totC)} contrib`,    color: '#2997ff' },
              { label: ml ? 'ഒറ്റത്തവണ (60%)' : 'Lump Sum (60%)', value: pvOn ? R.lumpPV : R.lump,            sub: ml ? 'വിരമിക്കലിൽ'  : 'At retirement', color: '#ff9f0a' },
              { label: ml ? 'അവസാന ഗ്രോസ്' : 'Last Gross Pay', value: R.lG,                                   sub: `Basic ${fmtF(R.lB)}`,                color: '#30d158' },
              { label: ml ? 'സേവനം' : 'Service',                value: null, text: `${R.serviceYears} yrs`,    sub: `→ ${retMonthName} ${R.retYear}`, color: '#bf5af2' },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-4" style={CARD}>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">{s.label}</div>
                <div className="text-[20px] font-black leading-none mb-1" style={{ color: s.color }}>
                  {s.text ? s.text : <Anim value={s.value} />}
                </div>
                {s.sub && <div className="text-[10px] text-white/50">{s.sub}</div>}
              </div>
            ))}
          </div>

          {/* Notices */}
          <div className="flex flex-col gap-2 mb-6">
            <div className="rounded-xl px-4 py-3 text-[11px] leading-relaxed flex gap-2" style={{ background: 'rgba(255,69,58,0.07)', border: '1px solid rgba(255,69,58,0.2)', color: '#ff9f9f' }}>
              🚫 <span><strong>{ml ? 'DCRG ഇല്ല:' : 'No DCRG:'}</strong> {ml ? 'APS അല്ലെങ്കിൽ NPS-ൽ കേരള സർക്കാർ ജീവനക്കാർക്ക് DCRG ലഭിക്കില്ല.' : 'Kerala government employees do NOT receive DCRG under APS or NPS.'}</span>
            </div>
            <div className="rounded-xl px-4 py-3 text-[11px] leading-relaxed flex gap-2" style={{ background: 'rgba(255,159,10,0.07)', border: '1px solid rgba(255,159,10,0.2)', color: '#ffcc66' }}>
              ⚠️ <span><strong>G.O.(P) No.33/2026/F.N (28.02.2026):</strong> {ml ? 'APS-ൽ ഒറ്റത്തവണ തുക ഉണ്ടാകില്ലെന്ന് G.O. സൂചിപ്പിക്കുന്നു.' : 'Latest G.O. on APS does not mention any lump sum.'}</span>
            </div>
          </div>

          {/* ── Tabs ─────────────────────────────────────────────────────────── */}
          <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition-all"
                style={{
                  background: tab === t.id ? '#ff9f0a' : 'var(--surface-xs)',
                  border: tab === t.id ? '1px solid #ff9f0a' : '1px solid var(--surface-sm)',
                  color: tab === t.id ? '#000' : 'var(--text-faint)',
                  cursor: 'pointer',
                }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* ── Compare tab ───────────────────────────────────────────────────── */}
          {tab === 'compare' && (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Corpus breakdown pie */}
                <div className="rounded-2xl p-5" style={CARD}>
                  <div className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-4">🍩 NPS Corpus Sources</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={[
                        { name: ml ? 'നിങ്ങൾ 10%' : 'Your 10%',     value: R.empC },
                        { name: ml ? `സർക്കാർ ${govPct}%` : `Govt ${govPct}%`, value: R.govC },
                        { name: ml ? 'Returns'    : 'Returns',        value: R.totR },
                      ]} cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={4} dataKey="value">
                        {['#2997ff','#30d158','#ff9f0a'].map((c, i) => <Cell key={i} fill={c} />)}
                      </Pie>
                      <Tooltip formatter={v => fmtF(v)} contentStyle={TT_STYLE} />
                      <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-faint)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Retirement split */}
                <div className="rounded-2xl p-5" style={CARD}>
                  <div className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-4">💰 {ml ? 'വിരമിക്കൽ ഭാഗം' : 'Retirement Split'}</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={[
                        { name: ml ? 'ഒറ്റത്തവണ 60%' : 'Lump 60%',    value: R.lump },
                        { name: ml ? 'Annuity 40%' : 'Annuity 40%', value: R.annCorp },
                      ]} cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={4} dataKey="value">
                        {['#ff9f0a','#2997ff'].map((c, i) => <Cell key={i} fill={c} />)}
                      </Pie>
                      <Tooltip formatter={v => fmtF(v)} contentStyle={TT_STYLE} />
                      <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-faint)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pay revision timeline */}
              <div className="rounded-2xl p-5" style={CARD}>
                <div className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-4">🕐 {ml ? 'പേ റിവിഷൻ ടൈംലൈൻ' : 'Pay Revision Timeline'}</div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {R.data.filter(d => d.isRev).map(d => (
                    <div key={d.year} className="rounded-xl p-3 flex-shrink-0 min-w-[150px]"
                      style={{ background: 'var(--surface-xs)', border: '1px solid rgba(255,159,10,0.2)' }}>
                      <div className="text-[10px] font-black text-[#ff9f0a] mb-1">{d.revLabel}</div>
                      <div className="text-[11px] text-white/50">Basic: {fmtF(d.basic)}</div>
                      <div className="text-[11px] text-white/55">DA: {d.daPct}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key facts */}
              <div className="rounded-2xl p-5" style={CARD}>
                <div className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-4">📝 {ml ? 'പ്രധാന വസ്തുതകൾ' : 'Key Facts'}</div>
                <div className="grid gap-2.5">
                  {[
                    { type: 'ok',   text: ml ? 'APS: 30+ വർഷം സേവനത്തിന് Last Basic-ന്റെ 50%. കുറഞ്ഞ സേവനം: (വർഷം÷60)×Basic.' : 'APS: 50% of last Basic for 30+ yrs service. Less service: (Yrs÷60)×Basic.' },
                    { type: 'info', text: ml ? `NPS: ജീവനക്കാരൻ 10% + സർക്കാർ ${govPct}% of (Basic+DA). DA, increment, revision-ൊടൊപ്പം വളരുന്നു.` : `NPS: Emp 10% + Govt ${govPct}% of (Basic+DA) monthly. Grows with DA, increments & revisions.` },
                    { type: 'warn', text: ml ? `APS ${postDR}%/yr DR-ൊടൊപ്പം വളരുന്നു. NPS annuity ഉറച്ചതാണ് — വർഷങ്ങൾ പോകുംതോറും വ്യത്യാസം കൂടും.` : `APS pension grows with DR (${postDR}%/yr) after retirement. NPS annuity is fixed — gap widens over time.` },
                    { type: 'info', text: ml ? '12th Pay Rev (ജൂൺ 2026): Basic×1.38, DA resets to 4%. അടുത്ത revisions ഓരോ 5 വർഷവും.' : '12th Pay Rev (Jun 2026): Basic×1.38, DA resets to 4%. Next revisions every 5 years.' },
                  ].map((n, i) => {
                    const cols = { ok: ['rgba(48,209,88,0.07)','rgba(48,209,88,0.2)','#86efac'], info: ['rgba(41,151,255,0.07)','rgba(41,151,255,0.2)','#93c5fd'], warn: ['rgba(255,159,10,0.07)','rgba(255,159,10,0.2)','#fcd34d'] }[n.type];
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
                  📈 {ml ? 'ശമ്പള വളർച്ച' : 'Salary Growth'} {pvOn && <span className="text-[#30d158] ml-2">— Today's ₹</span>}
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={R.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-xs)" />
                    <XAxis dataKey="year" tick={{ fill: 'var(--text-ghost)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={fmt} tick={{ fill: 'var(--text-ghost)', fontSize: 11 }} axisLine={false} tickLine={false} width={55} />
                    <Tooltip contentStyle={TT_STYLE} formatter={v => fmtF(v)} />
                    <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-faint)' }} />
                    <Area type="monotone" dataKey={pvOn ? 'annSalPV' : 'annSal'} name={ml ? 'വാർഷിക ശമ്പളം' : 'Annual Salary'} fill="rgba(41,151,255,0.08)" stroke="#2997ff" strokeWidth={2} />
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
                        <stop offset="5%"  stopColor="#2997ff" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#2997ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-xs)" />
                    <XAxis dataKey="year" tick={{ fill: 'var(--text-ghost)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={fmt} tick={{ fill: 'var(--text-ghost)', fontSize: 11 }} axisLine={false} tickLine={false} width={55} />
                    <Tooltip contentStyle={TT_STYLE} formatter={v => fmtF(v)} />
                    <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-faint)' }} />
                    <Area type="monotone" dataKey={pvOn ? 'corpusPV' : 'corpus'} name="NPS Corpus" fill="url(#corpG)" stroke="#2997ff" strokeWidth={2} />
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
                    <Line type="monotone" dataKey={pvOn ? 'npsPV' : 'npsP'} name="NPS" stroke="#2997ff" strokeWidth={2.5} dot={false} strokeDasharray="6 3" />
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
                        <stop offset="5%"  stopColor="#2997ff" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#2997ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-xs)" />
                    <XAxis dataKey="label" tick={{ fill: 'var(--text-ghost)', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                    <YAxis tickFormatter={fmt} tick={{ fill: 'var(--text-ghost)', fontSize: 11 }} axisLine={false} tickLine={false} width={55} />
                    <Tooltip contentStyle={TT_STYLE} formatter={v => fmtF(v)} />
                    <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-faint)' }} />
                    <Area type="monotone" dataKey={pvOn ? 'cAP' : 'cA'} name="APS Total" fill="url(#apsG)" stroke="#30d158" strokeWidth={2} />
                    <Area type="monotone" dataKey={pvOn ? 'cNP' : 'cN'} name="NPS Total" fill="url(#npsG)" stroke="#2997ff" strokeWidth={2} />
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
                    ✅ <span><strong>{ml ? 'Insight:' : 'Insight:'}</strong> APS {ml ? 'ഏകദേശം' : 'recovers'} {fmt(R.lump)} NPS lump sum {ml ? 'ഏകദേശം' : 'in ~'}<strong> {R.brk} {ml ? 'വർഷം' : 'years'}</strong>.</span>
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
                        style={{ borderColor: 'var(--surface-xs)', background: r.isRev ? 'rgba(255,159,10,0.05)' : 'transparent' }}>
                        <td className="px-4 py-2.5 font-bold text-white/70">
                          {r.year}{r.isRev && <span className="ml-1.5 text-[8px] text-[#ff9f0a] font-black">REV</span>}
                        </td>
                        <td className="px-4 py-2.5 text-white/60">{fmtF(r.basic)}</td>
                        <td className="px-4 py-2.5 text-[#ff9f0a]/70">{r.daPct}%</td>
                        <td className="px-4 py-2.5 text-white/70 font-semibold">{fmtF(r.gross)}</td>
                        <td className="px-4 py-2.5 text-[#ff453a]/70">{fmtF(r.nE)}</td>
                        <td className="px-4 py-2.5 text-[#ff9f0a]/70">{fmtF(r.nG)}</td>
                        <td className="px-4 py-2.5 text-[#30d158]/80 font-semibold">{fmtF(r.mC)}</td>
                        <td className="px-4 py-2.5 text-[#ff9f0a] font-bold">{fmt(r.corpus)}</td>
                        {pvOn && <td className="px-4 py-2.5 text-white/55">{fmt(r.corpusPV)}</td>}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: '2px solid var(--surface-sm)' }}>
                      <td colSpan={4} className="px-4 py-3 font-bold text-white/60 text-[10px]">TOTALS →</td>
                      <td className="px-4 py-3 font-bold text-[#ff453a]">{fmt(R.empC)}</td>
                      <td className="px-4 py-3 font-bold text-[#ff9f0a]">{fmt(R.govC)}</td>
                      <td className="px-4 py-3 font-black text-[#30d158]">{fmt(R.totC)}</td>
                      <td className="px-4 py-3 font-black text-[#ff9f0a]">{fmt(R.fC)}</td>
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
          ⚠️ {ml
            ? 'ഈ കാൽക്കുലേറ്റർ ഒരു ഏകദേശ ചിത്രം മാത്രം. ഔദ്യോഗിക കണക്കുകൾക്ക് പെൻഷൻ വിഭാഗവുമായി ബന്ധപ്പെടുക.'
            : 'Illustrative only. Actual amounts depend on pay scales, promotions, DA rates & NPS performance. Consult your pension section for official figures.'}
        </div>

        <FAQSection faqs={NPS_APS_FAQS} accentColor="#ff9f0a" />

      </div>
    </div>
  );
}
