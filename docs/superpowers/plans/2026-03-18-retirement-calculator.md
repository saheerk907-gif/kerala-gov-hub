# Retirement Countdown & Benefits Summary Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Retirement Countdown & Benefits Summary calculator at `/retirement` for Kerala government employees, auto-detecting NPS vs traditional pension category from Date of Joining.

**Architecture:** A single new client component `RetirementCalculator.js` with pure helper functions at the top. The page wrapper is a minimal server component. No Supabase — fully client-side. Reuses `useAnimatedCounter` pattern from `HPLCalculator.js`.

**Tech Stack:** Next.js 14 App Router, React 18 (`useState`, `useMemo`, `useEffect`, `useRef`), Tailwind CSS, `glass-card` utility, `SectionHeader` component.

**Spec:** `docs/superpowers/specs/2026-03-18-retirement-calculator-design.md`

---

## Chunk 1: RetirementCalculator Component

### Task 1: Pure calculation helpers + animated counter hook

**Files:**
- Create: `src/components/RetirementCalculator.js`

- [ ] **Step 1: Create the file with helpers and hook**

Create `src/components/RetirementCalculator.js` with this exact content:

```js
'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';

// ─── Constants ───────────────────────────────────────────────────────────────

const NPS_CUTOFF   = '2013-04-01'; // employees joining on/after this date are NPS
const MIN_PENSION  = 11500;        // ₹11,500/month minimum pension (current order)
const MAX_DCRG     = 1400000;      // ₹14,00,000 cap (KSR Rule 77 / Kerala Finance Dept)
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

/** Format a Date as ISO string YYYY-MM-DD. */
function toISO(date) {
  return date.toISOString().slice(0, 10);
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

  const pensionRaw    = Math.round(emoluments / 2);
  const monthlyPension = Math.max(MIN_PENSION, pensionRaw);
  const pensionFloored = pensionRaw < MIN_PENSION;

  const dcrgRaw    = emoluments * qualifyingYears;
  const dcrg       = qualifyingYears >= 5 ? Math.min(dcrgRaw, MAX_DCRG) : 0;
  const dcrgCapped = dcrgRaw > MAX_DCRG && qualifyingYears >= 5;
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
```

- [ ] **Step 2: Verify file exists and has correct structure**

Open `src/components/RetirementCalculator.js` and confirm:
- `calcRetirementDate` uses `lastDayOfMonth(birthYear + retirementAge, birthMonth)`
- `calcQualifyingService` uses `serviceMonths >= 6` (not `> 6`) for rounding
- `calcLPRDate` returns `retirementDate - elDays + 1` (inclusive)
- `calcFinancials` uses `dcrgRaw = emoluments * qualifyingYears` (no ÷2), cap `1400000`
- `monthlyPension = Math.max(11500, ...)`

---

### Task 2: Sub-components and style constants

**Files:**
- Modify: `src/components/RetirementCalculator.js` — append after the hook

- [ ] **Step 1: Append style constants and sub-components**

Add this block after the `useAnimatedCounter` hook:

```js
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
```

- [ ] **Step 2: Verify sub-components are appended correctly**

Confirm the file now contains `CountUnit`, `DateRow`, `MoneyCard`, `Timeline`, `Milestone` between the hook and where the main component export will go.

---

### Task 3: Main component

**Files:**
- Modify: `src/components/RetirementCalculator.js` — append main export

- [ ] **Step 1: Append the main component**

Add this at the end of the file:

```js
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

    const financials = (basicPay)
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
              <SectionHeader title={calc.alreadyRetired ? 'Retirement' : 'Countdown to Retirement'} />
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
                    note={calc.financials.dcrgCapped ? 'Capped at ₹14,00,000' : `${calc.qualifyingYears} qualifying years × emoluments`}
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
```

- [ ] **Step 2: Verify the complete file structure**

The file should contain in order:
1. `'use client'` + imports
2. Constants (`NPS_CUTOFF`, `MIN_PENSION`, `MAX_DCRG`, `MAX_EL`, `ACCENT`)
3. Date helpers (`todayStr`, `lastDayOfMonth`, `fmtDate`, `toISO`)
4. Calc functions (`calcRetirementDate`, `calcCountdown`, `calcQualifyingService`, `calcLPRDate`, `calcFinancials`)
5. `useAnimatedCounter` hook
6. Style constants + sub-components (`CountUnit`, `DateRow`, `MoneyCard`, `Timeline`, `Milestone`)
7. `export default function RetirementCalculator`

---

## Chunk 2: Page, ToolsSection, Build

### Task 4: Create /retirement page

**Files:**
- Create: `src/app/retirement/page.js`

- [ ] **Step 1: Create the page**

```bash
mkdir -p "/home/saheer-anas-k/kerala-gov-hub-main /src/app/retirement"
```

Create `src/app/retirement/page.js`:

```js
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RetirementCalculator from '@/components/RetirementCalculator';

export const metadata = {
  title: 'Retirement Calculator — Kerala Government Employees | Countdown, Pension, DCRG',
  description:
    'Calculate your retirement date, countdown, LPR start date, monthly pension, DCRG and leave encashment. Supports both traditional pension (pre-2013) and NPS subscribers.',
  alternates: { canonical: 'https://keralaemployees.in/retirement' },
  keywords:
    'retirement calculator Kerala, Kerala government retirement date, pension calculator Kerala, DCRG calculator, LPR leave preparatory to retirement, NPS retirement Kerala',
};

export default function RetirementPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-aurora text-white pt-[100px]">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 text-xs text-white/60 mb-8">
            <a href="/" className="hover:text-white transition-colors no-underline text-white/60">Home</a>
            <span>›</span>
            <span className="text-[#30d158]">Retirement Calculator</span>
          </div>
          <RetirementCalculator />
        </div>
      </main>
      <Footer />
    </>
  );
}
```

---

### Task 5: Add to ToolsSection

**Files:**
- Modify: `src/components/ToolsSection.js`

- [ ] **Step 1: Add the Retirement Calculator card**

In `src/components/ToolsSection.js`, find the `const tools = [` array and add this entry (insert after the Leave Calculator entry):

```js
  {
    icon: '🎯',
    title: 'Retirement Calculator',
    subtitle: 'റിട്ടയർമെന്റ് കാൽക്കുലേറ്റർ',
    desc: 'Retirement date, countdown, LPR date, pension, DCRG and leave encashment estimate — for pre-NPS and NPS employees.',
    href: '/retirement',
    color: '#30d158',
    badge: 'NEW',
    tags: ['Retirement', 'Pension', 'DCRG', 'LPR'],
  },
```

---

### Task 6: Build, smoke test, commit and push

- [ ] **Step 1: Build**

```bash
cd "/home/saheer-anas-k/kerala-gov-hub-main " && npm run build 2>&1 | grep -E "(error|Error|✓ Compiled|retirement)" | head -10
```

Expected: `✓ Compiled successfully` and `/retirement` in the routes list.

- [ ] **Step 2: Manual smoke test checklist**

Start dev server and navigate to `http://localhost:3000/retirement`:

1. Page loads with no console errors
2. Inputs render: DOB, DOJ, Basic Pay, DA%, EL Balance
3. DOJ before 2013-04-01 → shows "🟠 Traditional Pension — retires at 56"
4. DOJ on/after 2013-04-01 → shows "🔵 NPS Subscriber — retires at 60"
5. Enter DOB + DOJ → countdown card appears with animated numbers
6. Retirement date = last day of the month employee turns 56/60
7. Key Dates shows retirement date, service, qualifying years
8. EL > 0 + pre-NPS → LPR start date shown correctly (retirementDate − EL + 1)
9. Timeline renders with Today and Retirement dots; LPR dot appears when EL > 0
10. Basic Pay + DA% entered → financial cards appear with animated ₹ counters
11. Pre-NPS: Pension, DCRG, Leave Encashment cards shown
12. NPS: only Leave Encashment + advisory with link to /nps/calculator
13. DCRG < 5 qualifying years → "Not eligible" shown
14. Pension below ₹11,500 → shows ₹11,500 with "Minimum pension applies" note
15. Already-retired employee (DOB makes retirement date in past) → "You have retired on [date]"
16. ToolsSection on home page shows new Retirement Calculator card

- [ ] **Step 3: Commit and push**

```bash
cd "/home/saheer-anas-k/kerala-gov-hub-main " && git add src/components/RetirementCalculator.js src/app/retirement/page.js src/components/ToolsSection.js && git commit -m "$(cat <<'EOF'
feat: add Retirement Countdown & Benefits Summary calculator

- New /retirement page with countdown, key dates, timeline, financial estimates
- Auto-detects NPS vs traditional pension category from Date of Joining
- DCRG formula: emoluments × qualifyingYears, capped ₹14L (KSR Rule 77)
- Qualifying service: >= 6 months rounds up, max 33 years
- Monthly pension: 50% of emoluments, floor ₹11,500
- LPR start date: retirementDate - EL + 1 (inclusive)
- Animated countdown, ₹ counters, timeline milestone bar
- NPS subscribers see leave encashment only + link to NPS calculator
- Added to ToolsSection

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)" && git push origin main
```
