# Calculator Count-Up Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate `AnimatedNumber` into the 4 remaining calculator components so their result numbers animate from 0 on first appearance.

**Architecture:** Each calculator gets a mount-trigger or null→non-null trigger `animKey` state, then each numeric result display is wrapped in `<AnimatedNumber value={x} animKey={animKey} />` replacing the existing formatter calls. `AnimatedNumber.jsx` is unchanged.

**Tech Stack:** Next.js 14 App Router, React 18 (useState/useEffect/useRef), no new dependencies.

---

## Spec

`docs/superpowers/specs/2026-03-24-calculator-count-up-animation-design.md`

---

## Verification command (run after each task)

```bash
cd /home/saheer-anas-k/kerala-gov-hub-main && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully` with no errors.

---

## Task 1: RetirementCalculator.js

**Files:**
- Modify: `src/components/RetirementCalculator.js`

**Context:**
- `AnimatedNumber` is not yet imported.
- `MoneyCard` (line 154) uses `useAnimatedCounter(amount)` — this must be replaced with `<AnimatedNumber>` in the numeric branch only.
- `CountUnit` (line 128) also uses `useAnimatedCounter` — **do not touch it**.
- `calc` (line 311) is the primary `useMemo`, returns `null` when `dob`/`doj` are not set.
- Commutation values at lines 535, 542, 549 are rendered as inline template strings.
- `useEffect` and `useRef` are already imported (line 2).

- [ ] **Step 1: Add `AnimatedNumber` import**

In `src/components/RetirementCalculator.js`, add the import after the existing imports (after line 4):

```js
import AnimatedNumber from '@/components/AnimatedNumber';
```

- [ ] **Step 2: Add `animKey` state and trigger effect**

In the main `RetirementCalculator` function, after the existing `useState` declarations (around line 308), add:

```js
const [animKey, setAnimKey] = useState(0);
const prevCalcNull = useRef(true);
useEffect(() => {
  const wasNull = prevCalcNull.current;
  prevCalcNull.current = calc === null;
  if (wasNull && calc !== null) setAnimKey(k => k + 1);
}, [calc]);
```

- [ ] **Step 3: Update MoneyCard to accept and use animKey**

Replace the entire `MoneyCard` function (lines 154–170) with:

```js
function MoneyCard({ label, amount, accent, note, ineligible, animKey }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl p-3 bg-white/[0.04] border border-white/[0.07]">
      <span className="text-[10px] uppercase tracking-wider text-white/55 font-semibold">{label}</span>
      {ineligible ? (
        <span className="text-xs text-amber-400 font-semibold leading-snug">{ineligible}</span>
      ) : (
        <span className="text-xl font-[900] tabular-nums leading-none" style={{ color: accent ? ACCENT : 'white' }}>
          <AnimatedNumber value={amount} animKey={animKey} />
        </span>
      )}
      {note && <span className="text-[10px] text-white/45 leading-relaxed">{note}</span>}
    </div>
  );
}
```

Note: the `fmt` local variable inside the old MoneyCard is removed (AnimatedNumber handles formatting).

- [ ] **Step 4: Pass animKey to all MoneyCard usages**

There are 4 `<MoneyCard ...>` usages — 1 in the NPS branch (line ~469) and 3 in the non-NPS branch (lines ~482, 488, 494). Add `animKey={animKey}` prop to all four:

```jsx
<MoneyCard label="Leave Encashment (estimate)" amount={calc.financials.leaveEncashment} accent animKey={animKey} />

<MoneyCard
  label="Monthly Pension (estimate)"
  amount={calc.financials.monthlyPension}
  accent
  note={calc.financials.pensionFloored ? 'Minimum pension applies (₹11,500)' : '50% of last month emoluments'}
  animKey={animKey}
/>
<MoneyCard
  label="DCRG (estimate)"
  amount={calc.financials.dcrg}
  ineligible={!calc.financials.dcrgEligible ? 'Not eligible — minimum 5 years qualifying service required' : null}
  note={calc.financials.dcrgCapped ? 'Capped at ₹17,00,000' : `${calc.qualifyingYears} qualifying years × emoluments`}
  animKey={animKey}
/>
<MoneyCard
  label="Leave Encashment (estimate)"
  amount={calc.financials.leaveEncashment}
  note={`${calc.elDays} EL days × (emoluments ÷ 30)`}
  animKey={animKey}
/>
```

- [ ] **Step 5: Wrap commutation values**

In the commutation section (around lines 534–549), replace the three raw amount spans:

```jsx
// Line ~535 — Commuted Monthly
// Before:
₹{commutation.commutedMonthly.toLocaleString('en-IN')}
// After:
<AnimatedNumber value={commutation.commutedMonthly} animKey={animKey} />

// Line ~542 — Lump Sum
// Before:
₹{commutation.lumpSum.toLocaleString('en-IN')}
// After:
<AnimatedNumber value={commutation.lumpSum} animKey={animKey} />

// Line ~549 — Reduced Pension
// Before:
₹{commutation.reducedPension.toLocaleString('en-IN')}
// After:
<AnimatedNumber value={commutation.reducedPension} animKey={animKey} />
```

The fourth card (line ~556, `{fmtDate(commutation.restorationDate)}`) is a date string — leave it unchanged.

- [ ] **Step 6: Verify build passes**

```bash
cd /home/saheer-anas-k/kerala-gov-hub-main && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`

- [ ] **Step 7: Commit**

```bash
cd /home/saheer-anas-k/kerala-gov-hub-main
git add src/components/RetirementCalculator.js
git commit -m "feat: add AnimatedNumber to RetirementCalculator"
```

---

## Task 2: IncomeTaxCalculator.js

**Files:**
- Modify: `src/components/IncomeTaxCalculator.js`

**Context:**
- `AnimatedNumber` is not yet imported.
- Current imports line 2: `import { useState, useMemo } from 'react';` — `useEffect` must be added.
- `R` (the useMemo result) is almost never null, so the result section is visible from page load. Use mount-trigger (`useEffect(() => { setAnimKey(1); }, [])`) — animation plays once on load.
- Result values are either passed to `ResultRow` as the `value` prop (which renders `{value}` directly in a `<span>` — supports React nodes), or as inline `<span>` wrappers in the Slab Breakdown and TDS sections.
- For positive values: `<AnimatedNumber value={R.xxx} animKey={animKey} />` (default `prefix="₹"`).
- For deduction rows that show `- ${fmtR(x)}`: use `prefix="-₹"`.

- [ ] **Step 1: Add import and animKey state**

Change import line 2 from:
```js
import { useState, useMemo } from 'react';
```
to:
```js
import { useState, useMemo, useEffect } from 'react';
```

Add import after the existing imports (around line 3):
```js
import AnimatedNumber from '@/components/AnimatedNumber';
```

After the `canPrint` declaration (around line 856), add:
```js
const [animKey, setAnimKey] = useState(0);
useEffect(() => { setAnimKey(1); }, []);
```

- [ ] **Step 2: Replace Summary Cards array values**

Find the summary cards array (lines ~1293–1296):

```jsx
// Before:
{ label: 'Gross Salary', value: fmtR(R.grossFromEmployer) },
{ label: 'Taxable Income', value: fmtR(R.taxableIncome) },
{ label: 'Total Tax', value: fmtR(R.totalTax), highlight: true },
{ label: 'Monthly TDS', value: fmtR(R.monthlyTDS), highlight: true },

// After:
{ label: 'Gross Salary', value: <AnimatedNumber value={R.grossFromEmployer} animKey={animKey} /> },
{ label: 'Taxable Income', value: <AnimatedNumber value={R.taxableIncome} animKey={animKey} /> },
{ label: 'Total Tax', value: <AnimatedNumber value={R.totalTax} animKey={animKey} />, highlight: true },
{ label: 'Monthly TDS', value: <AnimatedNumber value={R.monthlyTDS} animKey={animKey} />, highlight: true },
```

- [ ] **Step 3: Replace ResultRow values in Detailed Breakdown**

Replace all `fmtR(R.xxx)` values passed to `ResultRow` in the detailed breakdown section (lines ~1310–1344). Standard monetary rows:

```jsx
// Standard rows — replace fmtR(R.xxx) with <AnimatedNumber value={R.xxx} animKey={animKey} />:
<ResultRow label="Annual Basic Pay"             value={<AnimatedNumber value={R.annualBasic}          animKey={animKey} />} />
<ResultRow label="Dearness Allowance"           value={<AnimatedNumber value={R.annualDA}             animKey={animKey} />} />
<ResultRow label="HRA (Annual)"                 value={<AnimatedNumber value={R.annualHRA}            animKey={animKey} />} />
<ResultRow label="Other Allowances"             value={<AnimatedNumber value={R.annualOther}          animKey={animKey} />} />
<ResultRow label="Arrears (Total)"              value={<AnimatedNumber value={R.totalArrears}         animKey={animKey} />} />
<ResultRow label="Leave Surrender"              value={<AnimatedNumber value={R.leaveSurrenderAmt}    animKey={animKey} />} />
<ResultRow label="Festival Allowance"           value={<AnimatedNumber value={R.festivalAllowanceAmt} animKey={animKey} />} />
<ResultRow label="Gross Salary from Employer"   value={<AnimatedNumber value={R.grossFromEmployer}    animKey={animKey} />} highlight />
<ResultRow label="Net Salary Income"            value={<AnimatedNumber value={R.netSalaryIncome}      animKey={animKey} />} highlight />
<ResultRow label="Other Income"                 value={<AnimatedNumber value={R.otherIncomeTotal}     animKey={animKey} />} />
<ResultRow label="Gross Total Income"           value={<AnimatedNumber value={R.grossTotalIncome}     animKey={animKey} />} highlight />
<ResultRow label="NET TAXABLE INCOME"           value={<AnimatedNumber value={R.taxableIncome}        animKey={animKey} />} highlight />
```

Deduction rows (use `prefix="-₹"`):
```jsx
<ResultRow label="Standard Deduction u/s 16(ia)"       value={<AnimatedNumber value={R.stdDed}            animKey={animKey} prefix="-₹" />} />
<ResultRow label="HRA Exemption u/s 10(13A)"           value={<AnimatedNumber value={R.hraExemptAmt}      animKey={animKey} prefix="-₹" />} />
<ResultRow label="Professional Tax u/s 16(iii)"        value={<AnimatedNumber value={R.profTaxDed}        animKey={animKey} prefix="-₹" />} />
<ResultRow label="Sec 24(b) Housing Loan Interest"     value={<AnimatedNumber value={R.hlInterestDed}     animKey={animKey} prefix="-₹" />} />
<ResultRow label="Section 80C (capped)"                value={<AnimatedNumber value={R.c80Total}          animKey={animKey} prefix="-₹" />} />
<ResultRow label="Sec 80CCD(1B) Additional NPS"        value={<AnimatedNumber value={R.npsAddDed}         animKey={animKey} prefix="-₹" />} />
<ResultRow label="Sec 80CCD(2) Employer NPS"           value={<AnimatedNumber value={R.empNPSDed}         animKey={animKey} prefix="-₹" />} />
<ResultRow label="Section 80D Mediclaim"               value={<AnimatedNumber value={R.d80Total}          animKey={animKey} prefix="-₹" />} />
<ResultRow label="Sec 80EEA HL Interest"               value={<AnimatedNumber value={R.hlInterest80EEADed} animKey={animKey} prefix="-₹" />} />
<ResultRow label="Sec 80E Education Loan"              value={<AnimatedNumber value={R.eduLoanDed}        animKey={animKey} prefix="-₹" />} />
<ResultRow label="Sec 80G Donations (50%)"             value={<AnimatedNumber value={R.donationDed}       animKey={animKey} prefix="-₹" />} />
<ResultRow label="Sec 80TTA/TTB Savings Interest"      value={<AnimatedNumber value={R.savingsDed}        animKey={animKey} prefix="-₹" />} />
<ResultRow label="Total Deductions"                    value={<AnimatedNumber value={R.totalChapterVIA}   animKey={animKey} prefix="-₹" />} highlight />
```

- [ ] **Step 4: Replace inline spans in Slab Breakdown and TDS sections**

Slab breakdown (lines ~1351–1390):

```jsx
// Slab rows — per-slab tax (row.tax); leave row.from/row.to unchanged (constants)
{row.tax === 0 ? <span className="text-white/50">NIL</span> : <AnimatedNumber value={row.tax} animKey={animKey} />}

// Tax on Total Income (~line 1363):
<AnimatedNumber value={R.rawTaxBase} animKey={animKey} />

// Rebate (~line 1368) — use prefix="-₹" and remove leading "- ":
<AnimatedNumber value={R.rebate87A} animKey={animKey} prefix="-₹" />

// Tax after Rebate (~line 1376):
<AnimatedNumber value={R.taxAfterRebate} animKey={animKey} />

// Surcharge (~line 1381):
<AnimatedNumber value={R.surchargeAmt} animKey={animKey} />

// Cess (~line 1386):
<AnimatedNumber value={R.cess} animKey={animKey} />

// Total Tax Payable (~line 1390):
<AnimatedNumber value={R.totalTax} animKey={animKey} />
```

TDS Schedule (lines ~1399–1405):
```jsx
// (A) Total Tax Payable:
<ResultRow label="(A) Total Tax Payable" value={<AnimatedNumber value={R.totalTax} animKey={animKey} />} />

// (B) TDS Already Deducted — leave unchanged (tdsPaidAmount is user input, not a result):
<ResultRow label={`(B) TDS Already Deducted (...)`} value={`- ${fmtR(n(tdsPaidAmount))}`} />

// Balance Tax:
<ResultRow label="Balance Tax (A − B)" value={<AnimatedNumber value={R.balanceTax} animKey={animKey} />} highlight />

// Monthly TDS Required (~line 1405):
<AnimatedNumber value={R.monthlyTDS} animKey={animKey} />
```

- [ ] **Step 5: Verify build passes**

```bash
cd /home/saheer-anas-k/kerala-gov-hub-main && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`

- [ ] **Step 6: Commit**

```bash
cd /home/saheer-anas-k/kerala-gov-hub-main
git add src/components/IncomeTaxCalculator.js
git commit -m "feat: add AnimatedNumber to IncomeTaxCalculator"
```

---

## Task 3: NpsCorpusCalculator.js

**Files:**
- Modify: `src/components/NpsCorpusCalculator.js`

**Context:**
- `AnimatedNumber` is not yet imported.
- Current imports line 2: `import { useState, useMemo } from 'react';` — `useEffect` must be added.
- `basicPay` starts at 25000 (non-zero), so use mount trigger.
- `result.totalCorpus` is a standalone `{fmtINR(result.totalCorpus)}` in a hero div (line 325) — replace directly.
- The subtitle line (line 328) has `result.totalInvested` and `result.totalGains` embedded in a template literal — **leave unchanged** (cannot extract from mixed text node).
- The three `ResultCard` components (lines 332–340) take `value` as a prop rendered directly in a `<div>` — supports React nodes.

- [ ] **Step 1: Add import and animKey state**

Change import line 2:
```js
import { useState, useMemo, useEffect } from 'react';
```

Add AnimatedNumber import after the existing imports:
```js
import AnimatedNumber from '@/components/AnimatedNumber';
```

In the main component function, after the existing `useState` declarations (after `annuityRate` at ~line 165), add:
```js
const [animKey, setAnimKey] = useState(0);
useEffect(() => { setAnimKey(1); }, []);
```

- [ ] **Step 2: Replace hero totalCorpus value**

Find line ~325:
```jsx
// Before:
{fmtINR(result.totalCorpus)}
// After:
<AnimatedNumber value={result.totalCorpus} animKey={animKey} />
```

- [ ] **Step 3: Replace ResultCard values**

Find the three `ResultCard` usages (lines ~332–340):

```jsx
// Before:
<ResultCard icon="💰" label="Lump Sum Withdrawal"
  sublabel={`${100 - annuityRatio}% of corpus — tax-free`}
  value={fmtINR(result.lumpSum)} />
<ResultCard icon="📈" label="Annuity Corpus"
  sublabel={`${annuityRatio}% used to buy pension`}
  value={fmtINR(result.annuityCorpus)} />
<ResultCard icon="🏦" label="Estimated Monthly Pension"
  sublabel={`At ${annuityRate}% annuity rate`}
  value={fmtINR(result.monthlyPension)} highlight />

// After:
<ResultCard icon="💰" label="Lump Sum Withdrawal"
  sublabel={`${100 - annuityRatio}% of corpus — tax-free`}
  value={<AnimatedNumber value={result.lumpSum} animKey={animKey} />} />
<ResultCard icon="📈" label="Annuity Corpus"
  sublabel={`${annuityRatio}% used to buy pension`}
  value={<AnimatedNumber value={result.annuityCorpus} animKey={animKey} />} />
<ResultCard icon="🏦" label="Estimated Monthly Pension"
  sublabel={`At ${annuityRate}% annuity rate`}
  value={<AnimatedNumber value={result.monthlyPension} animKey={animKey} />} highlight />
```

The "Contribution Period" card (`value={\`${result.years} years\`}`) is a template string — leave unchanged.

- [ ] **Step 4: Verify build passes**

```bash
cd /home/saheer-anas-k/kerala-gov-hub-main && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`

- [ ] **Step 5: Commit**

```bash
cd /home/saheer-anas-k/kerala-gov-hub-main
git add src/components/NpsCorpusCalculator.js
git commit -m "feat: add AnimatedNumber to NpsCorpusCalculator"
```

---

## Task 4: DcrgCalculator.jsx

**Files:**
- Modify: `src/components/DcrgCalculator.jsx`

**Context:**
- `AnimatedNumber` is not yet imported.
- Current imports line 2: `import { useState, useMemo } from 'react';` — `useEffect` must be added.
- `basic` starts at 30000 (non-zero), so use mount trigger.
- `result.dcrg` is the hero value at line 264 inside a conditional render block (eligible vs ineligible).
- The Calculation Breakdown uses `ResultRow` — check how `ResultRow` is defined in this file (it likely accepts a `value` prop and a `color` prop).
- **Do NOT animate:** `fmt(basic)` (user input), `qualifyingDisplay` (composite string), Formula rows (template strings).

- [ ] **Step 1: Add import and animKey state**

Change import line 2:
```js
import { useState, useMemo, useEffect } from 'react';
```

Add AnimatedNumber import after existing imports:
```js
import AnimatedNumber from '@/components/AnimatedNumber';
```

In the main component function, after the existing `useState` declarations (after `retireType` at ~line 112), add:
```js
const [animKey, setAnimKey] = useState(0);
useEffect(() => { setAnimKey(1); }, []);
```

- [ ] **Step 2: Replace hero dcrg value**

Find line ~264 (inside the eligible branch of the hero card):
```jsx
// Before:
<div className="text-[42px] font-[900] leading-none tracking-tight text-white mb-1">
  {fmt(result.dcrg)}
</div>

// After:
<div className="text-[42px] font-[900] leading-none tracking-tight text-white mb-1">
  <AnimatedNumber value={result.dcrg} animKey={animKey} />
</div>
```

- [ ] **Step 3: Replace ResultRow values in Calculation Breakdown**

Find the Calculation Breakdown section (lines ~289–299). Replace the computed result values but leave `fmt(basic)` and `qualifyingDisplay` unchanged:

```jsx
// Leave unchanged (user input):
<ResultRow label="Last Basic Pay" value={fmt(basic)} />

// Replace with AnimatedNumber:
<ResultRow label={`DA @ ${effectiveDA}%`}        value={<AnimatedNumber value={result.daAmt}      animKey={animKey} />} color="#ff9f0a" />
<ResultRow label="Last Emoluments (LE)"          value={<AnimatedNumber value={result.le}         animKey={animKey} />} color="#ff9f0a"
  sub="Basic Pay + DA" />

// Leave unchanged (composite string):
<ResultRow label="Qualifying Service" value={qualifyingDisplay}
  sub={`6m+1day rule applies${result.qualifyingYears === 33 ? ' · capped at 33 yrs' : ''}`} />

// Leave unchanged (template string formula):
<ResultRow label="Formula" value={`LE × ${result.qualifyingYears} ÷ 2`}
  sub={`= ${fmt(result.le)} × ${result.qualifyingYears} ÷ 2`} />

// Replace with AnimatedNumber:
<ResultRow label="Retirement DCRG" value={<AnimatedNumber value={result.retireDCRG} animKey={animKey} />} color="#30d158" />
{retireType === 'death' && (
  <ResultRow label="Death Gratuity (applied)" value={<AnimatedNumber value={result.deathDCRG} animKey={animKey} />} color="#ff9f0a" big />
)}
```

Note: Before implementing, verify that `ResultRow` in `DcrgCalculator.jsx` renders its `value` prop as a React node (not stringified). If it wraps in a string template, pass the number directly and add a wrapper span instead.

- [ ] **Step 4: Verify build passes**

```bash
cd /home/saheer-anas-k/kerala-gov-hub-main && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`

- [ ] **Step 5: Commit**

```bash
cd /home/saheer-anas-k/kerala-gov-hub-main
git add src/components/DcrgCalculator.jsx
git commit -m "feat: add AnimatedNumber to DcrgCalculator"
```
