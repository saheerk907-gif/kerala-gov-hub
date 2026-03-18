'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';

// ─── Constants ───────────────────────────────────────────────────────────────

const NPS_CUTOFF   = '2013-04-01'; // employees joining on/after this date are NPS
const MIN_PENSION  = 11500;        // ₹11,500/month minimum pension (current order)
const MAX_DCRG     = 1700000;      // ₹17,00,000 cap (KSR Rule 77 / Kerala Finance Dept)
const MAX_EL       = 300;
const ACCENT       = '#30d158';

// ─── Date helpers ─────────────────────────────────────────────────────────────

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

/** Last day of a given month (year, month are 0-indexed JS month). */
function lastDayOfMonth(year, month) {
  return new Date(year, month + 1, 0);
}

/** Format a Date as "31 March 2026". */
function fmtDate(date) {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ─── Core calculations ────────────────────────────────────────────────────────

/**
 * Compute retirement date = last day of the month the employee turns retirementAge.
 * @param {string} dobStr  ISO date string
 * @param {number} retirementAge  56 or 60
 * @returns {Date}
 */
function calcRetirementDate(dobStr, retirementAge) {
  const dob = new Date(dobStr);
  const birthYear  = dob.getFullYear();
  const birthMonth = dob.getMonth(); // 0-indexed
  return lastDayOfMonth(birthYear + retirementAge, birthMonth);
}

/**
 * Compute countdown from today to retirementDate.
 * Returns { daysLeft, yearsLeft, monthsLeft, daysRemainder, alreadyRetired }
 */
function calcCountdown(retirementDate) {
  const today    = new Date(todayStr());
  const diffMs   = retirementDate - today;
  const daysLeft = Math.round(diffMs / 86400000);

  if (daysLeft < 0) {
    return { daysLeft: 0, yearsLeft: 0, monthsLeft: 0, daysRemainder: 0, alreadyRetired: true };
  }

  const yearsLeft     = Math.floor(daysLeft / 365.25);
  const monthsLeft    = Math.floor((daysLeft % 365.25) / 30.44);
  const daysRemainder = Math.round(daysLeft % 30.44);

  return { daysLeft, yearsLeft, monthsLeft, daysRemainder, alreadyRetired: false };
}

/**
 * Compute qualifying service between DOJ and retirement date.
 * >= 6 months rounds UP to next full year (KSR DCRG rounding rule).
 * Max qualifying years = 33.
 */
function calcQualifyingService(dojStr, retirementDate) {
  const doj           = new Date(dojStr);
  const diffMs        = retirementDate - doj;
  const totalDays     = Math.round(diffMs / 86400000);
  const serviceYears  = Math.floor(totalDays / 365.25);
  const serviceMonths = Math.floor((totalDays % 365.25) / 30.44);
  const qualifyingYears = Math.min(serviceYears + (serviceMonths >= 6 ? 1 : 0), 33);
  return { serviceYears, serviceMonths, qualifyingYears };
}

/**
 * Compute LPR start date: retirement date minus elDays, +1 for inclusive counting.
 * e.g. retirement 31 Mar, EL 10 → LPR starts 22 Mar (22–31 = 10 days inclusive)
 */
function calcLPRDate(retirementDate, elDays) {
  if (elDays <= 0) return null;
  const lpr = new Date(retirementDate);
  lpr.setDate(lpr.getDate() - elDays + 1);
  return lpr;
}

/**
 * Compute all financial estimates (pre-NPS employees only).
 * DCRG formula: (emoluments ÷ 2) × six-month-periods = emoluments × qualifyingYears
 * Cap: ₹14,00,000
 * Pension: 50% of emoluments, floor ₹11,500
 */
function calcFinancials({ basicPay, daPercent, elDays, qualifyingYears }) {
  const basic      = Number(basicPay)    || 0;
  const da         = Number(daPercent)   || 0;
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

  return {
    emoluments,
    monthlyPension,
    pensionFloored,
    dcrg,
    dcrgRaw,
    dcrgCapped,
    dcrgEligible,
    leaveEncashment,
  };
}

// ─── Animated counter hook ────────────────────────────────────────────────────

function useAnimatedCounter(target, duration = 800) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (target === 0) { setDisplay(0); return; }
    const start = performance.now();
    const to    = target;

    function frame(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(Math.round(to * progress));
      if (progress < 1) rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}

// ─── Style constants (mirrors existing calculator pattern) ────────────────────

const inputCls = 'bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#30d158]/50 focus:bg-white/[0.09] transition-all w-full';
const labelCls = 'text-xs text-white/60 font-medium mb-2 block';

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Large animated countdown unit (number + label). */
function CountUnit({ value, label }) {
  const display = useAnimatedCounter(value);
  return (
    <div className="flex flex-col items-center">
      <span
        className="text-[clamp(36px,6vw,56px)] font-[900] tabular-nums leading-none"
        style={{ color: ACCENT }}
      >
        {String(display).padStart(2, '0')}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-white/50 font-semibold mt-1">{label}</span>
    </div>
  );
}

/** Key date row: label on left, value on right. */
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

/** Financial estimate card with animated ₹ counter. */
function MoneyCard({ label, amount, accent, note, ineligible }) {
  const display = useAnimatedCounter(amount);
  const fmt = (v) => '₹' + v.toLocaleString('en-IN');

  return (
    <div className="flex flex-col gap-1.5 rounded-xl p-3 bg-white/[0.04] border border-white/[0.07]">
      <span className="text-[10px] uppercase tracking-wider text-white/55 font-semibold">{label}</span>
      {ineligible ? (
        <span className="text-xs text-amber-400 font-semibold leading-snug">{ineligible}</span>
      ) : (
        <span
          className="text-xl font-[900] tabular-nums leading-none"
          style={{ color: accent ? ACCENT : 'white' }}
        >
          {fmt(display)}
        </span>
      )}
      {note && <span className="text-[10px] text-white/45 leading-relaxed">{note}</span>}
    </div>
  );
}

/** Retirement timeline: Today → [LPR] → Retirement */
function Timeline({ today, lprDate, retirementDate }) {
  const totalMs  = retirementDate - today;
  const lprPct   = lprDate
    ? Math.max(5, Math.min(90, ((lprDate - today) / totalMs) * 100))
    : null;

  return (
    <div className="relative pt-6 pb-2">
      {/* Track */}
      <div className="h-1.5 rounded-full bg-white/[0.08] relative overflow-visible">
        {/* Fill */}
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: '100%', background: `linear-gradient(90deg, ${ACCENT}60, ${ACCENT}20)` }}
        />
      </div>

      {/* Today dot */}
      <Milestone label="Today" date={fmtDate(today)} pct={0} color={ACCENT} />

      {/* LPR dot */}
      {lprDate && lprPct !== null && (
        <Milestone label="LPR Starts" date={fmtDate(lprDate)} pct={lprPct} color="#ff9f0a" />
      )}

      {/* Retirement dot */}
      <Milestone label="Retirement" date={fmtDate(retirementDate)} pct={100} color={ACCENT} right />
    </div>
  );
}

function Milestone({ label, date, pct, color, right }) {
  return (
    <div
      className="absolute top-[-6px] flex flex-col items-center"
      style={{ left: pct === 100 ? 'auto' : `${pct}%`, right: pct === 100 ? 0 : 'auto', transform: pct === 0 ? 'none' : pct === 100 ? 'none' : 'translateX(-50%)' }}
    >
      <div className="w-4 h-4 rounded-full border-2 border-[#0a0f1e]" style={{ background: color }} />
      <span className="text-[9px] font-bold uppercase tracking-wider mt-1.5 whitespace-nowrap" style={{ color }}>
        {label}
      </span>
      <span className="text-[9px] text-white/40 mt-0.5 whitespace-nowrap">{date}</span>
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

  const ready = dob && doj;

  const calc = useMemo(() => {
    if (!ready) return null;

    const isNPS          = doj >= NPS_CUTOFF;
    const retirementAge  = isNPS ? 60 : 56;
    const retirementDate = calcRetirementDate(dob, retirementAge);
    const countdown      = calcCountdown(retirementDate);
    const { serviceYears, serviceMonths, qualifyingYears } = calcQualifyingService(doj, retirementDate);
    const elDays         = Math.min(Number(elBalance) || 0, MAX_EL);
    const lprDate        = !isNPS && elDays > 0 ? calcLPRDate(retirementDate, elDays) : null;

    const financials = basicPay
      ? calcFinancials({ basicPay, daPercent, elDays, qualifyingYears })
      : null;

    return {
      isNPS,
      retirementDate,
      countdown,
      serviceYears,
      serviceMonths,
      qualifyingYears,
      elDays,
      lprDate,
      financials,
    };
  }, [dob, doj, basicPay, daPercent, elBalance, ready]);

  return (
    <div className="space-y-6">

      {/* ── Header card ── */}
      <div className="glass-card rounded-2xl p-6" style={{ borderColor: `${ACCENT}25`, borderWidth: 1 }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: `${ACCENT}20`, border: `1px solid ${ACCENT}35` }}
          >
            🎯
          </div>
          <div>
            <h1
              className="text-lg font-[900] text-white leading-tight"
              style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}
            >
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

      {/* ── Results ── */}
      {calc && (
        <>
          {/* ── Section 1: Countdown ── */}
          <div className="glass-card rounded-2xl p-6" style={{ borderColor: `${ACCENT}25`, borderWidth: 1 }}>

            {/* Category badge */}
            <div className="flex items-center justify-between mb-4">
              <SectionHeader title={calc.countdown.alreadyRetired ? 'Retirement' : 'Countdown to Retirement'} />
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                style={calc.isNPS
                  ? { background: '#64d2ff18', color: '#64d2ff', border: '1px solid #64d2ff30' }
                  : { background: '#ff9f0a18', color: '#ff9f0a', border: '1px solid #ff9f0a30' }
                }
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
            <DateRow label="Retirement Date"        value={fmtDate(calc.retirementDate)} accent />
            <DateRow label="Total Service at Retirement"
              value={`${calc.serviceYears} yr${calc.serviceYears !== 1 ? 's' : ''} ${calc.serviceMonths} mo`}
            />
            <DateRow label="Qualifying Service (for pension/DCRG)"
              value={`${calc.qualifyingYears} year${calc.qualifyingYears !== 1 ? 's' : ''}`}
              sub="Months ≥ 6 rounded up, max 33 years"
            />
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

          {/* ── Section 3: Timeline ── */}
          {!calc.countdown.alreadyRetired && (
            <div className="glass-card rounded-2xl p-6">
              <SectionHeader title="Retirement Timeline" />
              <div className="mt-8 mb-6 mx-2">
                <Timeline
                  today={todayObj}
                  lprDate={calc.lprDate}
                  retirementDate={calc.retirementDate}
                />
              </div>
            </div>
          )}

          {/* ── Section 4: Financial Estimates ── */}
          {calc.financials ? (
            <div className="glass-card rounded-2xl p-6">
              <SectionHeader title="Financial Estimates at Retirement" />

              {calc.isNPS ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <MoneyCard
                      label="Leave Encashment (estimate)"
                      amount={calc.financials.leaveEncashment}
                      accent
                    />
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
              )}

              <p className="mt-4 text-[11px] text-white/35 leading-relaxed">
                Estimates only. Pension is based on last month&apos;s pay; actual pension uses 10-month average emoluments. Amounts depend on final pay, DA revision, and qualifying service at retirement.
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
