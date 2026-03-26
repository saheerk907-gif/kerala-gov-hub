# Calculator Count-Up Animation — Design Spec
**Date:** 2026-03-24
**Status:** Partially implemented — 6/10 done, 4 remaining

---

## Summary

Add a count-up number animation (0 → final value, 900ms ease-in-out-cubic) to result sections of all 10 calculator components. Animation fires when results first appear; subsequent input changes update instantly with no re-animation.

`AnimatedNumber.jsx` already exists and matches this spec. The implementation work is integrating it into the 4 remaining calculators.

---

## Current State

### Already Implemented (6/10)
- `PayCalculator.js`
- `HPLCalculator.js`
- `LeaveCalculator.js`
- `PensionCalculator.jsx`
- `DArrearCalculator.jsx`
- `NpsApsCalculator.jsx`

### Remaining (4/10)
- `RetirementCalculator.js`
- `IncomeTaxCalculator.js`
- `NpsCorpusCalculator.js`
- `DcrgCalculator.jsx`

---

## `AnimatedNumber` Component (existing — no changes needed)

**File:** `src/components/AnimatedNumber.jsx`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | required | Target numeric value (may be negative) |
| `animKey` | `number` | required | When this increments, triggers count-up from 0 → `value` |
| `prefix` | `string` | `'₹'` | Prepended before the formatted number |
| `suffix` | `string` | `''` | Appended after the formatted number |
| `format` | `function` | `n => Math.abs(Math.round(n)).toLocaleString('en-IN')` | Formats the animated number |
| `duration` | `number` | `900` | Animation duration in ms |
| `className` | `string` | `''` | Passed through to wrapping `span` |

**Behaviour:**
- `animKey === 0` on mount → display instantly, no animation
- `animKey >= 1` on mount → animate from 0
- `animKey` increments → cancel in-progress animation, start fresh
- `value` changes, `animKey` same → update instantly
- Negative values: animate `Math.abs(value)`, prepend `-` before `prefix` in display
- Cleans up `requestAnimationFrame` on unmount

---

## Calculator Groups

### Group 1 — Null-safe, conditional render (already done for 5; pattern documented for reference)

PayCalculator, HPLCalculator, LeaveCalculator, DArrearCalculator, NpsApsCalculator all follow this trigger pattern:

```js
const [animKey, setAnimKey] = useState(0);
const prevResultNull = useRef(true);
useEffect(() => {
  const wasNull = prevResultNull.current;
  prevResultNull.current = result === null;
  if (wasNull && result !== null) setAnimKey(k => k + 1);
}, [result]);
```

PensionCalculator follows the same pattern but guards each field individually:
```jsx
{result && <AnimatedNumber value={result.pension} animKey={animKey} />}
```

---

### Group 2 — RetirementCalculator (remaining)

**File:** `src/components/RetirementCalculator.js`

**Current state:**
- `MoneyCard` sub-component uses `useAnimatedCounter(amount)` internally — animates on every change
- Commutation section values are rendered as raw inline JSX strings
- `CountUnit` sub-component uses `useAnimatedCounter` for live countdown — must not be changed

**Changes required:**

1. Add trigger pattern watching `calc` (the primary `useMemo`), not `result`:
```js
const [animKey, setAnimKey] = useState(0);
const prevCalcNull = useRef(true);
useEffect(() => {
  const wasNull = prevCalcNull.current;
  prevCalcNull.current = calc === null;
  if (wasNull && calc !== null) setAnimKey(k => k + 1);
}, [calc]);
```

2. Add `animKey` prop to `MoneyCard`; replace `useAnimatedCounter` inside it with `<AnimatedNumber>` — but **only in the numeric branch** (the `else` path). The `ineligible` branch renders a string label, not a number — leave it unchanged:
```jsx
// MoneyCard — modified
function MoneyCard({ label, amount, accent, note, ineligible, animKey }) {
  // remove: const display = useAnimatedCounter(amount);
  return (
    ...
    {ineligible ? (
      <span className="text-xs text-amber-400 font-semibold leading-snug">{ineligible}</span>
    ) : (
      <span className="text-xl font-[900] tabular-nums leading-none" style={{ color: accent ? ACCENT : 'white' }}>
        <AnimatedNumber value={amount} animKey={animKey} />
      </span>
    )}
    ...
  );
}
```

3. Wrap the three commutation values. The fourth card shows `fmtDate(commutation.restorationDate)` — a date string — leave it unchanged:
```jsx
// Animate these three:
<AnimatedNumber value={commutation.commutedMonthly} animKey={animKey} />
<AnimatedNumber value={commutation.lumpSum} animKey={animKey} />
<AnimatedNumber value={commutation.reducedPension} animKey={animKey} />
// Leave unchanged (date string):
{fmtDate(commutation.restorationDate)}
```

4. Do **not** remove `useAnimatedCounter` and do **not** animate `CountUnit` (years/months/days countdown) — `CountUnit` depends on `useAnimatedCounter` and animates on every value change, which is correct behaviour for a live countdown. Date strings (restoration date) are also excluded.

---

### Group 3 — Always-return calculators (remaining — 3 calculators)

These use `useMemo` that always returns a valid object. No null guard exists. `animKey` starts at 0 (instant display), then each calculator picks its trigger.

#### IncomeTaxCalculator.js

`R` (the `useMemo` result) is almost never `null` — the result section `{R && (...)}` is visible from page load showing zero values. Use the mount-trigger pattern (same as NpsCorpusCalculator/DcrgCalculator):
```js
const [animKey, setAnimKey] = useState(0);
useEffect(() => { setAnimKey(1); }, []);
```
This plays an entrance animation when the user first opens the calculator. Subsequent input changes update instantly.

**Replacing result values — `ResultRow` accepts React nodes in its `value` prop.** The component renders `{value}` directly in a `<span>` (no stringification):
```jsx
// ResultRow (lines 733–740 in IncomeTaxCalculator.js):
function ResultRow({ label, value, highlight, indent, className = '' }) {
  return (
    <div ...>
      <span ...>{label}</span>
      <span ...>{value}</span>   // ← value rendered as React node
    </div>
  );
}
```
So `<AnimatedNumber>` can be passed as the value.

Replace standard monetary values:
```jsx
// before
<ResultRow label="Annual Basic Pay" value={fmtR(R.annualBasic)} />
// after
<ResultRow label="Annual Basic Pay" value={<AnimatedNumber value={R.annualBasic} animKey={animKey} />} />
```

For deduction rows that display `- ${fmtR(x)}`, use `prefix="-₹"`:
```jsx
// before
<ResultRow label="Standard Deduction u/s 16(ia)" value={`- ${fmtR(R.stdDed)}`} />
// after
<ResultRow label="Standard Deduction u/s 16(ia)" value={<AnimatedNumber value={R.stdDed} animKey={animKey} prefix="-₹" />} />
```

For the summary card array (lines ~1293–1296), the `value` field holds `fmtR(x)` strings — replace each with `<AnimatedNumber value={x} animKey={animKey} />`.

**Inline spans in the Slab Breakdown section — animate these specifically:**
- `R.rawTaxBase` (~line 1363)
- `R.rebate87A` (~line 1368, displayed as `- ${fmtR(R.rebate87A)}` — use `prefix="-₹"`)
- `R.taxAfterRebate` (~line 1376)
- `R.surchargeAmt` (~line 1381)
- `R.cess` (~line 1387)
- `R.totalTax` (~lines 1390 and 1399)
- `R.balanceTax` (~line 1401)
- `R.monthlyTDS` (~line 1405)
- Per-slab `row.tax` values in the slab breakdown table

**Do NOT animate:**
- Slab boundary values (`fmtR(row.from)`, `fmtR(row.to)`) — tax rule constants, not results
- `fmtR(n(tdsPaidAmount))` (~line 1400) — this is a user input value, not a computed result
- `nilOrAmt(v)` hint strings embedded in `<span>` text
- Hint text in input `subtitle` props (lines ~1064, 1097, 1117)
- `monthsAlreadyDeducted` label text ("0 months")
- Slab percentage displays ("@ 10%")

#### NpsCorpusCalculator.js

`basicPay` starts at 25000 (non-zero default), so a `> 0` trigger would fire on mount. Use mount trigger instead:
```js
const [animKey, setAnimKey] = useState(0);
useEffect(() => { setAnimKey(1); }, []);
```
Plays entrance animation once when calculator loads. Subsequent input changes update instantly.

**What to animate:** `ResultCard` accepts React nodes in its `value` prop (renders `{value}` directly in a `<div>`). Animate these standalone values:
- `result.totalCorpus` — the hero number in the full-width card (inline `{fmtINR(result.totalCorpus)}`, not in a `ResultCard`)
- `result.lumpSum` — in "Lump Sum Withdrawal" `ResultCard`
- `result.annuityCorpus` — in "Annuity Corpus" `ResultCard`
- `result.monthlyPension` — in "Estimated Monthly Pension" `ResultCard`

**Do NOT animate:**
- `result.totalInvested` and `result.totalGains` — these appear embedded in the subtitle template literal on line ~328: `After {result.years} years · Invested: {fmtINR(result.totalInvested)} · Gains: {fmtINR(result.totalGains)} ({gainPct}%)`. Cannot extract from a mixed text node without restructuring.
- `gainPct` — percentage string in the same template literal.
- `result.years` — displayed as `${result.years} years` string in "Contribution Period" card.

#### DcrgCalculator.jsx

Same situation (`basic` starts at 30000). Same mount-trigger pattern:
```js
const [animKey, setAnimKey] = useState(0);
useEffect(() => { setAnimKey(1); }, []);
```

**What to animate:** `result.dcrg` (main DCRG amount in the eligibility section), `result.daAmt`, `result.le` (Last Emoluments), `result.retireDCRG`, `result.deathDCRG`.

**Do NOT animate:**
- `basic` (Last Basic Pay input) — this is a user input value, not a computed result. The `ResultRow label="Last Basic Pay"` renders `fmt(basic)` — leave it unchanged.
- `qualifyingDisplay` — a composite string like `"30 yrs (rounded up from 29y 6m)"`. Not a number. Leave the `ResultRow label="Qualifying Service"` unchanged.
- The "Formula" rows (e.g. `LE × 30 ÷ 2`) — template literal strings, not numbers.

---

## What Gets Animated

**Animate:** All numeric outputs in result sections — monetary (use `prefix="₹"`) and count values (use `prefix=""`).

**Do NOT animate:**
- Input fields
- Labels and headings
- Date strings (retirement date, restoration date)
- Percentage displays (e.g. "DA: 35%")
- Fitment factor (e.g. `1.38×`)
- CountUnit countdown in RetirementCalculator (handled by `useAnimatedCounter`)

---

## Animation Parameters
- Duration: 900ms
- Easing: ease-in-out-cubic (`t < 0.5 ? 4t³ : 1 − (−2t+2)³/2`)
- From: always 0 (negatives animate abs value, sign applied in display)
- No new dependencies — React built-ins + `requestAnimationFrame` only

---

## Files Changed
1. `src/components/RetirementCalculator.js` — add animKey trigger (watches `calc`), update MoneyCard, wrap commutation values
2. `src/components/IncomeTaxCalculator.js` — add mount-trigger animKey, wrap result values in ResultRow/inline spans
3. `src/components/NpsCorpusCalculator.js` — add mount-trigger animKey, wrap result values
4. `src/components/DcrgCalculator.jsx` — add mount-trigger animKey, wrap result values
