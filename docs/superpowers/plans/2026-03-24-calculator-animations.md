# Calculator Count-Up Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add count-up animations to all 10 calculator result sections — numbers animate from 0 to their final value (900ms, ease-in-out-cubic) when results first appear; subsequent input changes update instantly.

**Architecture:** A single `AnimatedNumber` component drives all animation via a `requestAnimationFrame` loop. Each calculator detects when its result first becomes available and increments an `animKey` counter; `AnimatedNumber` animates whenever `animKey` changes. Three trigger patterns cover the different result derivation styles across the 10 calculators.

**Tech Stack:** React 18 (`useState`, `useEffect`, `useRef`, `requestAnimationFrame`), Next.js 14 App Router, Tailwind CSS. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-03-24-calculator-animations-design.md`

---

## File Structure

| Action | File | Purpose |
|--------|------|---------|
| **Create** | `src/components/AnimatedNumber.jsx` | Reusable animated number component |
| **Modify** | `src/components/PayCalculator.js` | Group 1 — useState(null), conditional render |
| **Modify** | `src/components/HPLCalculator.js` | Group 1 — useMemo(null if !ready), day counts |
| **Modify** | `src/components/LeaveCalculator.js` | Group 1 — useMemo(null if !ready), day counts |
| **Modify** | `src/components/NpsApsCalculator.jsx` | Group 1 — useMemo(null if invalid) |
| **Modify** | `src/components/DArrearCalculator.jsx` | Group 1 variant — button-triggered useState(null) |
| **Modify** | `src/components/PensionCalculator.jsx` | Group 2 — optional chaining, explicit guard needed |
| **Modify** | `src/components/RetirementCalculator.js` | Group 2 special — existing useAnimatedCounter + MoneyCard |
| **Modify** | `src/components/IncomeTaxCalculator.js` | Group 3 — useMemo never null, canPrint trigger |
| **Modify** | `src/components/NpsCorpusCalculator.js` | Group 3 — useMemo never null, mount trigger |
| **Modify** | `src/components/DcrgCalculator.jsx` | Group 3 — useMemo never null, mount trigger |

---

## Task 1: Create AnimatedNumber component

**Files:**
- Create: `src/components/AnimatedNumber.jsx`

- [ ] **Step 1: Write the component**

Create `src/components/AnimatedNumber.jsx` with the following content:

```jsx
'use client';
import { useState, useEffect, useRef } from 'react';

/**
 * Animates a number from 0 to `value` over `duration` ms using ease-in-out-cubic.
 * Animation triggers when `animKey` increments.
 * When `value` changes without `animKey` changing, updates instantly (no animation).
 */
export default function AnimatedNumber({
  value,
  animKey,
  prefix = '₹',
  suffix = '',
  format = n => Math.abs(Math.round(n)).toLocaleString('en-IN'),
  duration = 900,
  className = '',
}) {
  const [displayed, setDisplayed] = useState(Math.abs(value ?? 0));
  const rafRef      = useRef(null);
  const hasMounted  = useRef(false);
  const prevAnimKey = useRef(animKey);

  useEffect(() => {
    const target = Math.abs(value ?? 0);

    const animate = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const start = performance.now();
      function tick(now) {
        const t    = Math.min((now - start) / duration, 1);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        setDisplayed(Math.round(ease * target));
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    if (!hasMounted.current) {
      // First mount
      hasMounted.current = true;
      if (animKey >= 1) {
        animate();              // Mounted after trigger already fired — animate
      } else {
        setDisplayed(target);  // animKey=0 sentinel — show instantly (no animation yet)
      }
    } else if (animKey !== prevAnimKey.current) {
      // animKey changed — re-trigger animation
      prevAnimKey.current = animKey;
      animate();
    } else {
      // Only value changed — update instantly
      setDisplayed(target);
    }

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [animKey, value, duration]); // eslint-disable-line react-hooks/exhaustive-deps

  const sign = (value ?? 0) < 0 ? '-' : '';
  return (
    <span className={className}>
      {sign}{prefix}{format(displayed)}{suffix}
    </span>
  );
}
```

- [ ] **Step 2: Start the dev server and verify the component file exists**

```bash
ls src/components/AnimatedNumber.jsx
```
Expected: file listed.

- [ ] **Step 3: Commit**

```bash
git add src/components/AnimatedNumber.jsx
git commit -m "feat: add AnimatedNumber component for count-up animations"
```

---

## Task 2: Update PayCalculator (Group 1 reference implementation)

**Files:**
- Modify: `src/components/PayCalculator.js`

PayCalculator uses `useState(null)` for `result` and has a `{!result ? ... : ...}` conditional. The result section renders monetary values via a local `fmt()` function. This is the reference implementation for all Group 1 calculators.

- [ ] **Step 1: Read the file to understand current structure**

Read `src/components/PayCalculator.js`. Identify:
- The `result` state declaration
- All `fmt(result.X)` calls inside the result JSX section (the `{result && ...}` or `{!result ? ... : ...}` block)
- The existing imports at the top

- [ ] **Step 2: Add imports and animKey trigger**

Add to the imports at the top of the file:
```js
import AnimatedNumber from '@/components/AnimatedNumber';
```

Add `useRef` and `useEffect` to the existing React imports if not already present.

Inside the component function, after the existing state declarations, add:
```js
const [animKey, setAnimKey] = useState(0);
const prevResultNull = useRef(true);
useEffect(() => {
  const wasNull = prevResultNull.current;
  prevResultNull.current = result === null;
  if (wasNull && result !== null) setAnimKey(k => k + 1);
}, [result]);
```

- [ ] **Step 3: Replace monetary result displays**

**Always pass the raw number** to `AnimatedNumber value` — never pre-format through the existing `fmt()` function. `AnimatedNumber` does its own formatting.

There are three distinct patterns in PayCalculator's result section:

**a) Direct references** — replace straightforwardly:
```jsx
// Before
{fmt(result.cur.net)}
// After
<AnimatedNumber value={result.cur.net} animKey={animKey} />
```

**b) Derived values** — `netHike` and `netHike * 12` are computed from `result` at the top of the component. Replace:
```jsx
// Before
{fmt(netHike)}
{fmt(netHike * 12)}
// After
<AnimatedNumber value={netHike} animKey={animKey} />
<AnimatedNumber value={netHike * 12} animKey={animKey} />
```

**c) Values from `.map()`** — the pay breakdown section maps over an array of `[label, value]` pairs and renders `{fmt(v)}`. Replace the `fmt(v)` call inside the map:
```jsx
// Before
{[['Gross', s.data.gross], ['Deductions', -s.data.totalDed], ['Net Pay', s.data.net]].map(([l, v]) => (
  <div key={l} ...>
    <span ...>{fmt(v)}</span>
  </div>
))}
// After
{[['Gross', s.data.gross], ['Deductions', -s.data.totalDed], ['Net Pay', s.data.net]].map(([l, v]) => (
  <div key={l} ...>
    <span ...><AnimatedNumber value={v} animKey={animKey} /></span>
  </div>
))}
```
Apply the same replacement in the comparison table `.map()` for `fmt(c)` and `fmt(r)`.

**Important:** Do NOT replace:
- Percentage displays (e.g. `{result.newDAP}%`)
- Fitment factor (e.g. `{result.fitment}×`)
- Any text that is not a ₹ amount

- [ ] **Step 4: Visual verification**

Start the dev server (`npm run dev`) and open the PayCalculator page in the browser. Enter a basic pay value. Observe: all monetary result values should count up from ₹0 over ~900ms. Change any input (DA%, HRA zone, etc.) — values should update instantly with no re-animation. Confirm both current-pay and revised-pay columns animate correctly.

- [ ] **Step 5: Commit**

```bash
git add src/components/PayCalculator.js
git commit -m "feat: add count-up animation to PayCalculator results"
```

---

## Task 3: Update HPLCalculator and LeaveCalculator (Group 1 — day counts)

**Files:**
- Modify: `src/components/HPLCalculator.js`
- Modify: `src/components/LeaveCalculator.js`

Both use `useMemo` returning `null` when `!ready`, guarded with `{result && ...}`. Their outputs are **day/year counts**, not monetary values — use `prefix=""`.

- [ ] **Step 1: Read both files**

Read `src/components/HPLCalculator.js` and `src/components/LeaveCalculator.js`. Identify:
- The `result` useMemo variable name (it may be `result` or another name)
- How the result section is guarded in JSX
- All numeric outputs in the result section (days, years, counts)

- [ ] **Step 2: Update HPLCalculator**

Add import: `import AnimatedNumber from '@/components/AnimatedNumber';`

Add `useRef` and `useEffect` to React imports if missing.

Add trigger after the `result` useMemo:
```js
const [animKey, setAnimKey] = useState(0);
const prevResultNull = useRef(true);
useEffect(() => {
  const wasNull = prevResultNull.current;
  prevResultNull.current = result === null;
  if (wasNull && result !== null) setAnimKey(k => k + 1);
}, [result]);
```

HPLCalculator's numeric outputs are passed as `value` props to a `StatCard` sub-component. `StatCard` has its own internal `useAnimatedCounter` (re-animates on every change). **Modify `StatCard`** the same way `MoneyCard` is modified in Task 6:

Add `animKey` to `StatCard`'s props. Replace the internal `useAnimatedCounter(value)` with `<AnimatedNumber value={value} animKey={animKey} prefix="" />`. Preserve all wrapping `<span>` elements with their existing `className` and `style` props — just replace the inner display value.

Pass `animKey={animKey}` to every `<StatCard>` call in the result section.

- [ ] **Step 3: Update LeaveCalculator**

Add import, add `useRef` and `useEffect` to React imports, add the same trigger code.

LeaveCalculator's `ResultRow` sub-component takes a `value` prop rendered as `{value}` (accepts any React node). Its values are currently string templates like `` `${result.earned} days` ``. Replace with `<AnimatedNumber>` passed as the value:

```jsx
// Before
<ResultRow label="EL Earned this period" value={`${result.earned} days`} accent />
// After
<ResultRow label="EL Earned this period" value={<AnimatedNumber value={result.earned} animKey={animKey} prefix="" suffix=" days" />} accent />
```

Apply this pattern to all numeric result rows — pass the raw number to `value`, use `suffix=" days"` (or `" years"` as appropriate).

- [ ] **Step 4: Visual verification**

Open each calculator page. Enter valid inputs. Confirm numeric result values count up from 0. Change inputs — confirm instant updates.

- [ ] **Step 5: Commit**

```bash
git add src/components/HPLCalculator.js src/components/LeaveCalculator.js
git commit -m "feat: add count-up animation to HPL and Leave calculator results"
```

---

## Task 4: Update NpsApsCalculator and DArrearCalculator (Group 1 remainder)

**Files:**
- Modify: `src/components/NpsApsCalculator.jsx`
- Modify: `src/components/DArrearCalculator.jsx`

Both use null-returning result patterns with conditional JSX. Monetary outputs (₹), use default `prefix="₹"`.

- [ ] **Step 1: Read both files**

Read `src/components/NpsApsCalculator.jsx` and `src/components/DArrearCalculator.jsx`. Note:
- NpsApsCalculator: result variable may be named `R` or `result`; guarded with `{result ? ... : ...}`
- DArrearCalculator: result set by "Calculate" button, reset by "Reset" button; after reset → recalculate, animation re-plays (intentional)

- [ ] **Step 2: Update NpsApsCalculator**

Add import, add trigger (watch the `useMemo` variable name — use it in the `useEffect` dep array), replace monetary result displays with `<AnimatedNumber>`.

- [ ] **Step 3: Update DArrearCalculator**

Same pattern. The trigger fires each time result appears after being null (including after a reset → recalculate cycle).

- [ ] **Step 4: Visual verification**

Open each calculator. Enter valid inputs. Confirm animation plays. For DArrearCalculator: reset and recalculate — confirm animation re-plays on the new result.

- [ ] **Step 5: Commit**

```bash
git add src/components/NpsApsCalculator.jsx src/components/DArrearCalculator.jsx
git commit -m "feat: add count-up animation to NPS/APS and DA arrear calculator results"
```

---

## Task 5: Update PensionCalculator (Group 2 — optional chaining)

**Files:**
- Modify: `src/components/PensionCalculator.jsx`

PensionCalculator uses `useState(null)` but the result section uses **optional chaining** (`result?.pension`) rather than a conditional block — the output fields are always in the DOM showing `undefined` or `'—'` when null. Must add an explicit null guard around each `AnimatedNumber`.

- [ ] **Step 1: Read the file**

Read `src/components/PensionCalculator.jsx`. Find:
- All `result?.X` or `fmt(result?.X)` calls in the JSX
- The six numeric outputs: `pension`, `familyPension`, `dcrg`, `commutedAmt`, `commutedValue`, `reducedPension`
- The `OutputField` component definition (it renders `{value || '—'}`)

- [ ] **Step 2: Add import and trigger**

Add `import AnimatedNumber from '@/components/AnimatedNumber';`

Add `useRef` to React imports if missing.

Add trigger (same as Group 1, watching `result`):
```js
const [animKey, setAnimKey] = useState(0);
const prevResultNull = useRef(true);
useEffect(() => {
  const wasNull = prevResultNull.current;
  prevResultNull.current = result === null;
  if (wasNull && result !== null) setAnimKey(k => k + 1);
}, [result]);
```

- [ ] **Step 3: Replace result displays with guarded AnimatedNumber**

For each output field, replace the formatted string with an explicit null guard:

```jsx
// Before (example):
<OutputField label="Basic Pension" value={fmt(result?.pension)} highlight />

// After:
<OutputField
  label="Basic Pension"
  value={result ? <AnimatedNumber value={result.pension} animKey={animKey} /> : '—'}
  highlight
/>
```

Apply to all six monetary outputs. The `OutputField` component renders `{value || '—'}` — passing a React element as `value` works correctly in React (a React element is truthy, so `'—'` never shows when `AnimatedNumber` is passed).

- [ ] **Step 4: Visual verification**

Open the pension calculator. Enter qualifying service, average emoluments, last emoluments. Confirm all 6 outputs animate. Adjust commute percentage — outputs update instantly.

- [ ] **Step 5: Commit**

```bash
git add src/components/PensionCalculator.jsx
git commit -m "feat: add count-up animation to Pension calculator results"
```

---

## Task 6: Update RetirementCalculator (Group 2 special)

**Files:**
- Modify: `src/components/RetirementCalculator.js`

This calculator has:
1. `calc` useMemo (returns null when !ready), guarded with `{calc && ...}`
2. `commutation` useMemo (returns null when calc null or commutePct=0)
3. Existing `useAnimatedCounter` hook — keep it (used by `CountUnit` for countdown display)
4. `MoneyCard` sub-component — update to accept `animKey` prop

- [ ] **Step 1: Read the file thoroughly**

Read `src/components/RetirementCalculator.js`. Find:
- `useAnimatedCounter` hook definition (keep as-is)
- `CountUnit` component (do not change)
- `MoneyCard` component — current props and where `useAnimatedCounter` is called inside it
- All `<MoneyCard>` usages in JSX
- Commutation section: the three inline monetary displays (`commutation.commutedMonthly`, `commutation.lumpSum`, `commutation.reducedPension`)

- [ ] **Step 2: Add import and animKey trigger**

Add `import AnimatedNumber from '@/components/AnimatedNumber';`

Add trigger after the `calc` useMemo:
```js
const [animKey, setAnimKey] = useState(0);
const prevCalcNull = useRef(true);
useEffect(() => {
  const wasNull = prevCalcNull.current;
  prevCalcNull.current = calc === null;
  if (wasNull && calc !== null) setAnimKey(k => k + 1);
}, [calc]);
```

- [ ] **Step 3: Update MoneyCard sub-component**

Add `animKey` to `MoneyCard`'s props. Remove the `const display = useAnimatedCounter(amount)` line and the local `fmt` function. Replace `{fmt(display)}` with `<AnimatedNumber>` **inside the existing styled `<span>`** — the span carries the font/colour styling and must be preserved:

```jsx
// Before
function MoneyCard({ label, amount, accent, note, ineligible }) {
  const display = useAnimatedCounter(amount);
  const fmt = (v) => '₹' + v.toLocaleString('en-IN');
  return (
    <div ...>
      ...
      {ineligible ? (
        <span className="...">{ineligible}</span>
      ) : (
        <span className="text-xl font-[900] tabular-nums leading-none" style={{ color: accent ? ACCENT : 'white' }}>
          {fmt(display)}
        </span>
      )}
      ...
    </div>
  );
}

// After
function MoneyCard({ label, amount, animKey, accent, note, ineligible }) {
  return (
    <div ...>
      ...
      {ineligible ? (
        <span className="...">{ineligible}</span>
      ) : (
        <span className="text-xl font-[900] tabular-nums leading-none" style={{ color: accent ? ACCENT : 'white' }}>
          <AnimatedNumber value={amount} animKey={animKey} />
        </span>
      )}
      ...
    </div>
  );
}
```

Do **not** remove `useAnimatedCounter` — `CountUnit` still uses it.

- [ ] **Step 4: Pass animKey to all MoneyCard usages**

Find every `<MoneyCard ... />` in the JSX and add `animKey={animKey}` prop.

- [ ] **Step 5: Wrap commutation section monetary values**

Find the commutation inline display section (rendered when `commutation && commutePct > 0`). Replace the three raw displays:

```jsx
// Before
₹{commutation.commutedMonthly.toLocaleString('en-IN')}
₹{commutation.lumpSum.toLocaleString('en-IN')}
₹{commutation.reducedPension.toLocaleString('en-IN')}

// After
<AnimatedNumber value={commutation.commutedMonthly} animKey={animKey} />
<AnimatedNumber value={commutation.lumpSum} animKey={animKey} />
<AnimatedNumber value={commutation.reducedPension} animKey={animKey} />
```

- [ ] **Step 6: Visual verification**

Open the retirement calculator. Enter DOB and DOJ. Confirm pension, DCRG, and leave encashment animate on first result. Move the commutation slider — commutation values show instantly (no re-animation). Confirm countdown display (years/months/days) still animates as before.

- [ ] **Step 7: Commit**

```bash
git add src/components/RetirementCalculator.js
git commit -m "feat: add count-up animation to Retirement calculator results"
```

---

## Task 7: Update IncomeTaxCalculator (Group 3 — canPrint trigger)

**Files:**
- Modify: `src/components/IncomeTaxCalculator.js`

`R` (the useMemo result) never returns null. The result section is gated on `{R && ...}`. Use `canPrint` (`n(basic1) > 0 && R !== null`) as the animation trigger — already defined in the file.

- [ ] **Step 1: Read the file**

Read `src/components/IncomeTaxCalculator.js`. Find:
- `canPrint` variable definition (line ~856: `const canPrint = n(basic1) > 0 && R !== null`)
- The existing React imports — add `useRef` and `useEffect` if missing (current imports are `{ useState, useMemo }`)
- All monetary result displays in the result section (tax totals, monthly deductions, net income figures)
- The result section's conditional guard (`{R && ...}`)

- [ ] **Step 2: Add import and canPrint-based trigger**

Add `import AnimatedNumber from '@/components/AnimatedNumber';`

Add `useRef` to React imports if missing.

Add after the `canPrint` declaration:
```js
const [animKey, setAnimKey] = useState(0);
const prevCanPrint = useRef(false);
useEffect(() => {
  const was = prevCanPrint.current;
  prevCanPrint.current = canPrint;
  if (!was && canPrint) setAnimKey(k => k + 1);
}, [canPrint]);
```

- [ ] **Step 3: Replace monetary result displays**

Inside the result section, replace monetary number displays with `<AnimatedNumber value={R.X} animKey={animKey} />`. Common targets: annual tax, monthly tax, total tax payable, surcharge, health & education cess, etc.

- [ ] **Step 4: Visual verification**

Open the income tax calculator. Enter a basic pay value (`basic1`). Confirm all tax result values animate. Change any input — values update instantly. Delete the basic pay → re-enter it: animation re-plays (canPrint goes false → true again).

- [ ] **Step 5: Commit**

```bash
git add src/components/IncomeTaxCalculator.js
git commit -m "feat: add count-up animation to Income Tax calculator results"
```

---

## Task 8: Update NpsCorpusCalculator and DcrgCalculator (Group 3 — mount trigger)

**Files:**
- Modify: `src/components/NpsCorpusCalculator.js`
- Modify: `src/components/DcrgCalculator.jsx`

Both use `useMemo` that never returns null. Their primary inputs have non-zero defaults (`basicPay=25000`, `basic=30000`), so a `> 0` guard would fire immediately. Instead: trigger on component mount — plays one entrance animation when the user first loads the page, then all subsequent changes are instant.

- [ ] **Step 1: Read both files**

Read `src/components/NpsCorpusCalculator.js` and `src/components/DcrgCalculator.jsx`. Find:
- The result variable name and shape
- All numeric outputs in the result section (monetary ₹ amounts and count values like years)
- Whether there are any sub-components wrapping result displays

- [ ] **Step 2: Update NpsCorpusCalculator**

Add `import AnimatedNumber from '@/components/AnimatedNumber';`

Add `useEffect` to React imports if missing (the mount trigger does **not** need `useRef`; current imports are `{ useState, useMemo }`).

Add mount trigger (these two lines replace the complex null-tracking pattern):
```js
const [animKey, setAnimKey] = useState(0);
useEffect(() => { setAnimKey(1); }, []);
```

Replace monetary result displays with `<AnimatedNumber value={result.X} animKey={animKey} />`.
For count values (e.g. years of service), use `prefix=""`.

- [ ] **Step 3: Update DcrgCalculator**

Add import, add `useEffect` to React imports (no `useRef` needed for mount trigger). Same mount trigger pattern as Step 2 — replace result displays.

- [ ] **Step 4: Visual verification**

Open each calculator page. On first load, confirm all result values count up from 0 (entrance animation). Adjust any input — values update instantly with no re-animation.

- [ ] **Step 5: Commit**

```bash
git add src/components/NpsCorpusCalculator.js src/components/DcrgCalculator.jsx
git commit -m "feat: add count-up animation to NPS Corpus and DCRG calculator results"
```

---

## Final Verification

- [ ] Run `npm run build` and confirm no TypeScript/lint errors
- [ ] Open every calculator page in the browser and verify:
  - Animation plays on first result appearance (or on page load for NpsCorpus/DCRG)
  - Subsequent input changes update instantly
  - No number display is broken or missing
  - Countdown in RetirementCalculator still animates (unchanged)
- [ ] Commit any final fixes
