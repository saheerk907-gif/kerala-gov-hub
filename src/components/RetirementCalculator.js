'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';

// ─── Constants ───────────────────────────────────────────────────────────────

const NPS_CUTOFF  = '2013-04-01';
const MIN_PENSION = 11500;
const MAX_DCRG    = 1700000;
const MAX_EL      = 300;
const ACCENT      = '#30d158';

// Commutation factor — fixed at 11.10 (matches /pension calculator)
const COMMUTATION_FACTOR = 11.10;
const MAX_COMMUTE_PCT    = 40;

// ─── Date helpers ─────────────────────────────────────────────────────────────

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function lastDayOfMonth(year, month) {
  return new Date(year, month + 1, 0);
}

function fmtDate(date) {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ─── Core calculations ────────────────────────────────────────────────────────

function calcRetirementDate(dobStr, retirementAge) {
  const dob = new Date(dobStr);
  return lastDayOfMonth(dob.getFullYear() + retirementAge, dob.getMonth());
}

function calcCountdown(retirementDate) {
  const today    = new Date(todayStr());
  const daysLeft = Math.round((retirementDate - today) / 86400000);
  if (daysLeft < 0) {
    return { daysLeft: 0, yearsLeft: 0, monthsLeft: 0, daysRemainder: 0, alreadyRetired: true };
  }
  return {
    daysLeft,
    yearsLeft:     Math.floor(daysLeft / 365.25),
    monthsLeft:    Math.floor((daysLeft % 365.25) / 30.44),
    daysRemainder: Math.round(daysLeft % 30.44),
    alreadyRetired: false,
  };
}

function calcQualifyingService(dojStr, retirementDate) {
  const totalDays     = Math.round((retirementDate - new Date(dojStr)) / 86400000);
  const serviceYears  = Math.floor(totalDays / 365.25);
  const serviceMonths = Math.floor((totalDays % 365.25) / 30.44);
  const qualifyingYears = Math.min(serviceYears + (serviceMonths >= 6 ? 1 : 0), 33);
  return { serviceYears, serviceMonths, qualifyingYears };
}

function calcLPRDate(retirementDate, elDays) {
  if (elDays <= 0) return null;
  const lpr = new Date(retirementDate);
  lpr.setDate(lpr.getDate() - elDays + 1);
  return lpr;
}

function calcFinancials({ basicPay, daPercent, elDays, qualifyingYears }) {
  const basic      = Number(basicPay)  || 0;
  const da         = Number(daPercent) || 0;
  const el         = Math.min(Number(elDays) || 0, MAX_EL);
  const daAmount   = Math.round(basic * da / 100);
  const emoluments = basic + daAmount;
  const pensionRaw     = Math.round(emoluments / 2);
  const monthlyPension = Math.max(MIN_PENSION, pensionRaw);
  const pensionFloored = pensionRaw < MIN_PENSION;
  const dcrgRaw      = emoluments * qualifyingYears;
  const dcrg         = qualifyingYears >= 5 ? Math.min(dcrgRaw, MAX_DCRG) : 0;
  const dcrgCapped   = dcrgRaw > MAX_DCRG && qualifyingYears >= 5;
  const dcrgEligible = qualifyingYears >= 5;
  const leaveEncashment = Math.round(emoluments / 30 * el);
  return { emoluments, monthlyPension, pensionFloored, dcrg, dcrgRaw, dcrgCapped, dcrgEligible, leaveEncashment };
}

/**
 * Pension commutation estimate — matches /pension calculator (KSR Part III).
 * commutePct — percentage to commute (0–40)
 * lump sum   = commuted_monthly × 11.10 × 12
 * Restored 12 years after retirement date.
 */
function calcCommutation(monthlyPension, retirementDate, commutePct) {
  const pct             = Math.min(commutePct, MAX_COMMUTE_PCT);
  const commutedMonthly = Math.round((pct / 100) * monthlyPension);
  const lumpSum         = Math.round(commutedMonthly * COMMUTATION_FACTOR * 12);
  const reducedPension  = monthlyPension - commutedMonthly;
  const restorationDate = new Date(retirementDate);
  restorationDate.setFullYear(restorationDate.getFullYear() + 12);
  return { commutedMonthly, lumpSum, reducedPension, restorationDate };
}

// ─── Animated counter hook ────────────────────────────────────────────────────

function useAnimatedCounter(target, duration = 800) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (target === 0) { setDisplay(0); return; }
    const start = performance.now();
    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(target * progress));
      if (progress < 1) rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);
  return display;
}

// ─── Style constants ──────────────────────────────────────────────────────────

const inputCls = 'bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#30d158]/50 focus:bg-white/[0.09] transition-all w-full';
const labelCls = 'text-xs text-white/60 font-medium mb-2 block';

// ─── Sub-components ───────────────────────────────────────────────────────────

function CountUnit({ value, label }) {
  const display = useAnimatedCounter(value);
  return (
    <div className="flex flex-col items-center">
      <span className="text-[clamp(36px,6vw,56px)] font-[900] tabular-nums leading-none" style={{ color: ACCENT }}>
        {String(display).padStart(2, '0')}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-white/50 font-semibold mt-1">{label}</span>
    </div>
  );
}

function DateRow({ label, value, sub, accent }) {
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-white/[0.06] last:border-0 gap-4">
      <span className="text-xs text-white/60">{label}</span>
      <div className="text-right">
        <span className={`text-sm font-bold ${accent ? '' : 'text-white'}`} style={accent ? { color: ACCENT } : {}}>
          {value}
        </span>
        {sub && <div className="text-[10px] text-white/45 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function MoneyCard({ label, amount, accent, note, ineligible }) {
  const display = useAnimatedCounter(amount);
  const fmt = (v) => '₹' + v.toLocaleString('en-IN');
  return (
    <div className="flex flex-col gap-1.5 rounded-xl p-3 bg-white/[0.04] border border-white/[0.07]">
      <span className="text-[10px] uppercase tracking-wider text-white/55 font-semibold">{label}</span>
      {ineligible ? (
        <span className="text-xs text-amber-400 font-semibold leading-snug">{ineligible}</span>
      ) : (
        <span className="text-xl font-[900] tabular-nums leading-none" style={{ color: accent ? ACCENT : 'white' }}>
          {fmt(display)}
        </span>
      )}
      {note && <span className="text-[10px] text-white/45 leading-relaxed">{note}</span>}
    </div>
  );
}

/** Career progress ring — replaces flat timeline */
const CAREER_MILESTONES = [
  { years: 5,  label: 'DCRG Eligible',            color: '#ff9f0a' },
  { years: 10, label: '10 Years Service',          color: '#64d2ff' },
  { years: 20, label: '20 Years Service',          color: '#bf5af2' },
  { years: 33, label: 'Maximum Qualifying Service', color: '#30d158' },
];

function CareerProgressRing({ dojStr, retirementDate, todayDate, serviceYears, serviceMonths }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(t);
  }, [dojStr]);

  const totalMs   = retirementDate - new Date(dojStr);
  const elapsedMs = Math.max(0, todayDate - new Date(dojStr));
  const pct       = Math.min(100, (elapsedMs / totalMs) * 100);
  const totalYears = totalMs / (365.25 * 86400000);

  const cx = 90, cy = 90, TRACK_R = 65;
  const circ      = 2 * Math.PI * TRACK_R;
  const dashOffset = circ * (1 - (animated ? pct : 0) / 100);

  function polar(angleDeg, r) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  const visibleMilestones = CAREER_MILESTONES.filter(m => m.years <= totalYears + 0.5);

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      {/* Ring */}
      <div className="relative flex-shrink-0">
        <svg width="180" height="180" className="overflow-visible">
          {/* Background track */}
          <circle cx={cx} cy={cy} r={TRACK_R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />

          {/* Progress arc */}
          <circle
            cx={cx} cy={cy} r={TRACK_R}
            fill="none"
            stroke={ACCENT}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{
              transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)',
              filter: `drop-shadow(0 0 8px ${ACCENT}70)`,
            }}
          />

          {/* Milestone dots on ring */}
          {visibleMilestones.map(m => {
            const angle = -90 + (m.years / totalYears) * 360;
            const dot   = polar(angle, TRACK_R);
            const reached = serviceYears >= m.years;
            return (
              <circle
                key={m.years}
                cx={dot.x} cy={dot.y} r={6}
                fill={reached ? m.color : 'rgba(255,255,255,0.12)'}
                stroke="#0a0f1e"
                strokeWidth="2"
                style={{ filter: reached ? `drop-shadow(0 0 4px ${m.color}90)` : 'none' }}
              />
            );
          })}

          {/* Center: % complete */}
          <text x={cx} y={cy - 10} textAnchor="middle" fill="white" fontSize="26" fontWeight="900">
            {Math.round(animated ? pct : 0)}%
          </text>
          <text x={cx} y={cy + 6} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9" fontWeight="600" letterSpacing="2">
            COMPLETE
          </text>
          <text x={cx} y={cy + 20} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8">
            {serviceYears}y {serviceMonths}m served
          </text>
        </svg>
      </div>

      {/* Milestone list */}
      <div className="flex-1 space-y-2 w-full">
        {visibleMilestones.map(m => {
          const reached   = serviceYears >= m.years;
          const yearsLeft = m.years - serviceYears;
          return (
            <div
              key={m.years}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-all ${reached ? 'bg-white/[0.07]' : 'bg-white/[0.02]'}`}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0"
                style={{
                  background: reached ? m.color + '25' : 'rgba(255,255,255,0.05)',
                  color:      reached ? m.color        : 'rgba(255,255,255,0.25)',
                  border:     `1px solid ${reached ? m.color + '40' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {reached ? '✓' : m.years}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold" style={{ color: reached ? 'white' : 'rgba(255,255,255,0.35)' }}>
                  {m.label}
                </div>
                <div className="text-[9px]" style={{ color: reached ? m.color : 'rgba(255,255,255,0.22)' }}>
                  {reached
                    ? 'Milestone reached'
                    : `${yearsLeft} more year${yearsLeft !== 1 ? 's' : ''} to go`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function RetirementCalculator() {
  const today    = todayStr();
  const todayObj = new Date(today);

  const [dob,       setDob]       = useState('');
  const [doj,       setDoj]       = useState('');
  const [basicPay,  setBasicPay]  = useState('');
  const [daPercent, setDaPercent] = useState('');
  const [elBalance, setElBalance] = useState('');
  const [commutePct, setCommutePct] = useState(33);

  const ready = dob && doj;

  const calc = useMemo(() => {
    if (!ready) return null;
    const isNPS          = doj >= NPS_CUTOFF;
    const retirementAge  = isNPS ? 60 : 56;
    const retirementDate = calcRetirementDate(dob, retirementAge);
    const countdown      = calcCountdown(retirementDate);
    const { serviceYears, serviceMonths, qualifyingYears } = calcQualifyingService(doj, retirementDate);
    const elDays  = Math.min(Number(elBalance) || 0, MAX_EL);
    const lprDate = !isNPS && elDays > 0 ? calcLPRDate(retirementDate, elDays) : null;
    const financials = basicPay
      ? calcFinancials({ basicPay, daPercent, elDays, qualifyingYears })
      : null;
    return { isNPS, retirementAge, retirementDate, countdown, serviceYears, serviceMonths, qualifyingYears, elDays, lprDate, financials };
  }, [dob, doj, basicPay, daPercent, elBalance, ready]);

  const commutation = useMemo(() => {
    if (!calc || calc.isNPS || !calc.financials) return null;
    return calcCommutation(calc.financials.monthlyPension, calc.retirementDate, commutePct);
  }, [calc, commutePct]);

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="glass-card rounded-2xl p-6" style={{ borderColor: `${ACCENT}25`, borderWidth: 1 }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${ACCENT}20`, border: `1px solid ${ACCENT}35` }}>
            🎯
          </div>
          <div>
            <h1 className="text-lg font-[900] text-white leading-tight" style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}>
              റിട്ടയർമെന്റ് കാൽക്കുലേറ്റർ
            </h1>
            <p className="text-xs text-white/60">Retirement Countdown &amp; Benefits Summary</p>
          </div>
        </div>
      </div>

      {/* ── Inputs ── */}
      <div className="glass-card rounded-2xl p-6">
        <SectionHeader title="Your Details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Date of Birth</label>
            <input type="date" max={today} value={dob} onChange={e => setDob(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Date of Joining</label>
            <input type="date" max={today} value={doj} onChange={e => setDoj(e.target.value)} className={inputCls} />
            {doj && (
              <p className="mt-1 text-[10px]" style={{ color: doj >= NPS_CUTOFF ? '#64d2ff' : '#ff9f0a' }}>
                {doj >= NPS_CUTOFF ? '🔵 NPS Subscriber — retires at 60' : '🟠 Traditional Pension — retires at 56'}
              </p>
            )}
          </div>
          <div>
            <label className={labelCls}>Current Basic Pay (₹)</label>
            <input type="number" min="0" placeholder="e.g. 45000" value={basicPay} onChange={e => setBasicPay(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>DA % (Current Dearness Allowance)</label>
            <input type="number" min="0" max="100" placeholder="e.g. 35" value={daPercent} onChange={e => setDaPercent(e.target.value)} className={inputCls} />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>EL Balance (days, max 300)</label>
            <input type="number" min="0" max="300" placeholder="e.g. 180" value={elBalance} onChange={e => setElBalance(e.target.value)} className={inputCls} />
            <p className="mt-1 text-[10px] text-white/45">Used to calculate LPR (Leave Preparatory to Retirement) start date</p>
          </div>
          {!ready && (
            <div className="md:col-span-2 text-center py-8 rounded-[16px] border border-dashed border-white/10">
              <p className="text-sm text-white/50">Enter Date of Birth and Date of Joining to calculate</p>
            </div>
          )}
        </div>
      </div>

      {calc && (
        <>
          {/* ── Section 1: Countdown ── */}
          <div className="glass-card rounded-2xl p-6" style={{ borderColor: `${ACCENT}25`, borderWidth: 1 }}>
            <div className="flex items-center justify-between mb-4">
              <SectionHeader title={calc.countdown.alreadyRetired ? 'Retirement' : 'Countdown to Retirement'} />
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                style={calc.isNPS
                  ? { background: '#64d2ff18', color: '#64d2ff', border: '1px solid #64d2ff30' }
                  : { background: '#ff9f0a18', color: '#ff9f0a', border: '1px solid #ff9f0a30' }}
              >
                {calc.isNPS ? 'NPS Subscriber' : 'Traditional Pension'}
              </span>
            </div>
            {calc.countdown.alreadyRetired ? (
              <div className="text-center py-4">
                <p className="text-2xl font-[900] text-white">You have retired</p>
                <p className="text-sm text-white/60 mt-1">on {fmtDate(calc.retirementDate)}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-6 md:gap-10 py-4">
                  <CountUnit value={calc.countdown.yearsLeft}     label="Years" />
                  <span className="text-3xl text-white/20 font-thin pb-4">:</span>
                  <CountUnit value={calc.countdown.monthsLeft}    label="Months" />
                  <span className="text-3xl text-white/20 font-thin pb-4">:</span>
                  <CountUnit value={calc.countdown.daysRemainder} label="Days" />
                </div>
                <p className="text-center text-xs text-white/50 mt-2">
                  Retirement on <span className="font-bold text-white/80">{fmtDate(calc.retirementDate)}</span>
                  <span className="ml-2 text-white/35">({calc.countdown.daysLeft.toLocaleString('en-IN')} days remaining)</span>
                </p>
              </>
            )}
          </div>

          {/* ── Section 2: Key Dates ── */}
          <div className="glass-card rounded-2xl p-6">
            <SectionHeader title="Key Dates &amp; Service Summary" />
            <DateRow label="Retirement Date"                      value={fmtDate(calc.retirementDate)} accent />
            <DateRow label="Total Service at Retirement"          value={`${calc.serviceYears} yr${calc.serviceYears !== 1 ? 's' : ''} ${calc.serviceMonths} mo`} />
            <DateRow label="Qualifying Service (for pension/DCRG)" value={`${calc.qualifyingYears} year${calc.qualifyingYears !== 1 ? 's' : ''}`} sub="Months ≥ 6 rounded up, max 33 years" />
            {calc.lprDate && (
              <DateRow
                label="LPR Start Date"
                value={fmtDate(calc.lprDate)}
                sub={`${calc.elDays} days EL — start leave ${calc.elDays} days before retirement`}
                accent
              />
            )}
            <p className="mt-3 text-[11px] text-white/35 leading-relaxed">
              Note: Doctors (Medical Education Service) retire at 60. Teaching staff may retire at the end of the academic year&apos;s month. If this applies to you, your retirement date will differ.
            </p>
            <p className="mt-1 text-[11px] text-white/35 leading-relaxed">
              If you have a break in service or were re-appointed, please verify your qualifying service manually.
            </p>
          </div>

          {/* ── Section 3: Career Progress Ring ── */}
          {!calc.countdown.alreadyRetired && (
            <div className="glass-card rounded-2xl p-6">
              <SectionHeader title="Career Progress" />
              <p className="text-[11px] text-white/40 mb-5">How far along your career journey — milestones light up as you reach them</p>
              <CareerProgressRing
                dojStr={doj}
                retirementDate={calc.retirementDate}
                todayDate={todayObj}
                serviceYears={calc.serviceYears}
                serviceMonths={calc.serviceMonths}
              />
            </div>
          )}

          {/* ── Section 4: Financial Estimates ── */}
          {calc.financials ? (
            <div className="glass-card rounded-2xl p-6">
              <SectionHeader title="Financial Estimates at Retirement" />

              {calc.isNPS ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <MoneyCard label="Leave Encashment (estimate)" amount={calc.financials.leaveEncashment} accent />
                  </div>
                  <div className="rounded-xl px-4 py-3 bg-[#64d2ff]/10 border border-[#64d2ff]/20">
                    <p className="text-xs text-[#64d2ff] font-semibold mb-1">NPS Subscriber — Pension &amp; DCRG not applicable</p>
                    <p className="text-[11px] text-white/55 leading-relaxed">
                      As an NPS subscriber (joined on/after 01.04.2013), pension and DCRG under KSR are not applicable.{' '}
                      <Link href="/nps/calculator" className="text-[#64d2ff] underline">Use the NPS Calculator</Link> to estimate your corpus.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <MoneyCard
                      label="Monthly Pension (estimate)"
                      amount={calc.financials.monthlyPension}
                      accent
                      note={calc.financials.pensionFloored ? 'Minimum pension applies (₹11,500)' : '50% of last month emoluments'}
                    />
                    <MoneyCard
                      label="DCRG (estimate)"
                      amount={calc.financials.dcrg}
                      ineligible={!calc.financials.dcrgEligible ? 'Not eligible — minimum 5 years qualifying service required' : null}
                      note={calc.financials.dcrgCapped ? 'Capped at ₹17,00,000' : `${calc.qualifyingYears} qualifying years × emoluments`}
                    />
                    <MoneyCard
                      label="Leave Encashment (estimate)"
                      amount={calc.financials.leaveEncashment}
                      note={`${calc.elDays} EL days × (emoluments ÷ 30)`}
                    />
                  </div>

                  {/* ── Pension Commutation ── */}
                  <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-[900] text-white">Pension Commutation</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#30d158]/15 text-[#30d158] border border-[#30d158]/20 uppercase tracking-wider">Optional</span>
                    </div>
                    <p className="text-[11px] text-white/45 leading-relaxed mb-4">
                      You may commute up to <strong className="text-white/70">40%</strong> of your monthly pension for a lump sum. The commuted portion is deducted from your monthly pension and restored after <strong className="text-white/70">12 years</strong>.
                    </p>

                    {/* Slider */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] text-white/60 font-medium">Commutation %</label>
                        <span className="text-sm font-[900]" style={{ color: ACCENT }}>{commutePct}%</span>
                      </div>
                      <input
                        type="range" min="0" max="40" step="1"
                        value={commutePct}
                        onChange={e => setCommutePct(Number(e.target.value))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{ accentColor: ACCENT }}
                      />
                      <div className="flex justify-between text-[9px] text-white/30 mt-1">
                        <span>0% (no commutation)</span>
                        <span>40% (maximum)</span>
                      </div>
                    </div>

                    {commutation && commutePct > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="flex flex-col gap-1 rounded-xl p-3 bg-white/[0.04] border border-white/[0.07]">
                          <span className="text-[9px] uppercase tracking-wider text-white/50 font-semibold">Commuted Monthly</span>
                          <span className="text-base font-[900] tabular-nums" style={{ color: '#ff9f0a' }}>
                            ₹{commutation.commutedMonthly.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[9px] text-white/35">deducted from pension</span>
                        </div>
                        <div className="flex flex-col gap-1 rounded-xl p-3 bg-white/[0.04] border border-white/[0.07]">
                          <span className="text-[9px] uppercase tracking-wider text-white/50 font-semibold">Lump Sum Received</span>
                          <span className="text-base font-[900] tabular-nums" style={{ color: ACCENT }}>
                            ₹{commutation.lumpSum.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[9px] text-white/35">commuted × 11.10 × 12</span>
                        </div>
                        <div className="flex flex-col gap-1 rounded-xl p-3 bg-white/[0.04] border border-white/[0.07]">
                          <span className="text-[9px] uppercase tracking-wider text-white/50 font-semibold">Reduced Pension</span>
                          <span className="text-base font-[900] tabular-nums text-white">
                            ₹{commutation.reducedPension.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[9px] text-white/35">per month after commutation</span>
                        </div>
                        <div className="flex flex-col gap-1 rounded-xl p-3 bg-white/[0.04] border border-white/[0.07]">
                          <span className="text-[9px] uppercase tracking-wider text-white/50 font-semibold">Full Pension Restored</span>
                          <span className="text-[13px] font-[900] text-white leading-snug">
                            {fmtDate(commutation.restorationDate)}
                          </span>
                          <span className="text-[9px] text-white/35">12 years after retirement</span>
                        </div>
                      </div>
                    ) : commutePct === 0 ? (
                      <p className="text-[11px] text-white/35 text-center py-2">Move the slider to see commutation estimates</p>
                    ) : null}
                  </div>
                </>
              )}

              <p className="mt-4 text-[11px] text-white/35 leading-relaxed">
                Estimates only. Pension is based on last month&apos;s pay; actual pension uses 10-month average emoluments. Commutation lump sum = commuted amount × 11.10 × 12 (KSR Part III). Amounts depend on final pay, DA revision, and qualifying service at retirement.
              </p>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6 border border-dashed border-white/10">
              <p className="text-sm text-white/40 text-center py-4">
                Enter Basic Pay and DA % above to see financial estimates
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
