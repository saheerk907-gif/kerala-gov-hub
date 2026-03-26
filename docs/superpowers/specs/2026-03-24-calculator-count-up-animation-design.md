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

2. Add `animKey` prop to `MoneyCard`; replace `useAnimatedCounter` inside it with `<AnimatedNumber value={amount} animKey={animKey} />`.

3. Wrap commutation section values:
```jsx
// before
₹{commutation.commutedMonthly.toLocaleString('en-IN')}
// after
<AnimatedNumber value={commutation.commutedMonthly} animKey={animKey} />
```
Same for `commutation.lumpSum` and `commutation.reducedPension`.

4. Do **not** remove `useAnimatedCounter` — `CountUnit` still uses it.

5. Do **not** animate `CountUnit` (years/months/days countdown) or date strings (restoration date).

---

### Group 3 — Always-return calculators (remaining — 3 calculators)

These use `useMemo` that always returns a valid object. No null guard exists. `animKey` starts at 0 (instant display), then each calculator picks its trigger.

#### IncomeTaxCalculator.js

Trigger via existing `canPrint` variable (`n(basic1) > 0 && R !== null`):
```js
const [animKey, setAnimKey] = useState(0);
const prevCanPrint = useRef(false);
useEffect(() => {
  const was = prevCanPrint.current;
  prevCanPrint.current = canPrint;
  if (!was && canPrint) setAnimKey(k => k + 1);
}, [canPrint]);
```

Replace monetary result displays with `<AnimatedNumber value={x} animKey={animKey} />`.

#### NpsCorpusCalculator.js

`basicPay` starts at 25000 (non-zero default), so a `> 0` trigger would fire on mount. Use mount trigger instead:
```js
const [animKey, setAnimKey] = useState(0);
useEffect(() => { setAnimKey(1); }, []);
```
Plays entrance animation once when calculator loads. Subsequent input changes update instantly.

#### DcrgCalculator.jsx

Same situation (`basic` starts at 30000). Same mount-trigger pattern:
```js
const [animKey, setAnimKey] = useState(0);
useEffect(() => { setAnimKey(1); }, []);
```

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
1. `src/components/RetirementCalculator.js` — add animKey trigger, update MoneyCard, wrap commutation values
2. `src/components/IncomeTaxCalculator.js` — add animKey trigger via canPrint, wrap result values
3. `src/components/NpsCorpusCalculator.js` — add mount-trigger animKey, wrap result values
4. `src/components/DcrgCalculator.jsx` — add mount-trigger animKey, wrap result values
