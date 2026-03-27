# Calculator Count-Up Animation — Design Spec
**Date:** 2026-03-24

## Goal
Add a count-up number animation to the result sections of all 10 calculator components. Numbers animate from 0 to their final value (900ms, ease-in-out-cubic) when results first appear. Subsequent input changes update instantly with no re-animation.

## Scope
All 10 calculator components:
- `src/components/PayCalculator.js`
- `src/components/PensionCalculator.jsx`
- `src/components/HPLCalculator.js`
- `src/components/RetirementCalculator.js`
- `src/components/LeaveCalculator.js`
- `src/components/IncomeTaxCalculator.js`
- `src/components/NpsCorpusCalculator.js`
- `src/components/NpsApsCalculator.jsx`
- `src/components/DArrearCalculator.jsx`
- `src/components/DcrgCalculator.jsx`

---

## New Component: `src/components/AnimatedNumber.jsx`

A self-contained component that animates a numeric value using `requestAnimationFrame`.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | required | Target numeric value (may be negative) |
| `animKey` | `number` | required | When this increments, triggers a count-up from 0 → `value` |
| `prefix` | `string` | `'₹'` | Prepended before the formatted number. Pass `''` for count values (days, years) |
| `suffix` | `string` | `''` | Appended after the formatted number |
| `format` | `function` | `n => Math.abs(Math.round(n)).toLocaleString('en-IN')` | Formats the animated number |
| `duration` | `number` | `900` | Animation duration in ms |
| `className` | `string` | `''` | Passed through to the wrapping `span` |

### Negative value handling
When `value < 0`, the component prepends `-` before `prefix`. Example: `value=-12345, prefix='₹'` → `-₹12,345`. Animation counts up `Math.abs(value)` from 0; the sign is applied only in the display string.

### Behaviour
- When first mounted with `animKey >= 1`, immediately starts a count-up from 0 → `Math.abs(value)`. Animation fires on mount — this is intentional.
- When mounted with `animKey === 0`, displays `value` immediately with no animation (this is the pre-trigger sentinel state used by always-return calculators).
- When `animKey` increments (subsequent re-triggers), cancels any in-progress animation and starts fresh.
- When `value` changes but `animKey` stays the same, updates instantly with no animation.
- Uses ease-in-out-cubic: `t < 0.5 ? 4t³ : 1 − (−2t+2)³/2`
- Cleans up `requestAnimationFrame` on unmount.

---

## Calculator Groups

### Group 1 — Null-safe with conditional render (6 calculators)

**PayCalculator, HPLCalculator, LeaveCalculator, RetirementCalculator, NpsApsCalculator, DArrearCalculator**

These calculators use either `useState(null)` or `useMemo` that returns `null` when inputs are incomplete. The result section is guarded with a conditional block (`{result && ...}` or `{!result ? ... : ...}`), so `AnimatedNumber` is only mounted when a result exists.

**Trigger pattern (add to each):**
```js
const [animKey, setAnimKey] = useState(0);
const prevResultNull = useRef(true);
useEffect(() => {
  const wasNull = prevResultNull.current;
  prevResultNull.current = result === null;  // use calc for RetirementCalculator
  if (wasNull && result !== null) setAnimKey(k => k + 1);
}, [result]);  // use [calc] for RetirementCalculator
```

**`AnimatedNumber` placement:** Replace raw number displays inside the existing conditional block:
```jsx
// before
{fmt(result.net)}
// after
<AnimatedNumber value={result.net} animKey={animKey} />
```

For day/year count values (HPLCalculator, LeaveCalculator), pass `prefix=""`:
```jsx
<AnimatedNumber value={result.hplDue} animKey={animKey} prefix="" />
```

**DArrearCalculator note:** `result` is set imperatively when the user presses "Calculate" and reset to `null` when the user presses "Reset". The trigger fires each time `result` appears after being `null` — re-animation after a reset+recalculate is intentional.

**RetirementCalculator special handling:**
- Watch `calc` (the primary `useMemo`), not `result` — use `[calc]` in the dependency array.
- `MoneyCard` sub-component currently uses `useAnimatedCounter` internally. Add `animKey` prop to `MoneyCard` and replace the `useAnimatedCounter` call inside it with `<AnimatedNumber value={amount} animKey={animKey} />`.
- `CountUnit` sub-component (countdown display — years/months/days until retirement): **do not change**. It uses `useAnimatedCounter` which animates on every change — this is correct for a live countdown.
- Commutation section values (`commutation.commutedMonthly`, `commutation.lumpSum`, `commutation.reducedPension`): wrap each with `<AnimatedNumber value={commutation.X} animKey={animKey} />` using the same parent `animKey`. They animate on first result load; slider adjustments after that update instantly.
- Do **not** remove `useAnimatedCounter` from the file — `CountUnit` still depends on it.
- Duration mismatch: `useAnimatedCounter` uses 800ms; `AnimatedNumber` uses 900ms. This slight difference between countdown and result values is acceptable.

---

### Group 2 — Null-safe with optional chaining (1 calculator)

**PensionCalculator**

`result` is `useState(null)` and set via `useCallback`. The result section uses optional chaining (`result?.pension`) rather than a conditional block, so fields are always in the DOM (showing `undefined` or `'—'` when null).

**Trigger pattern:** Same as Group 1 (watch `result`).

**`AnimatedNumber` placement:** Must add an explicit null guard since the JSX has no surrounding conditional:
```jsx
// before
{result?.pension}
// after
{result && <AnimatedNumber value={result.pension} animKey={animKey} />}
```

Apply this pattern for each monetary/count output field (`pension`, `familyPension`, `dcrg`, `commutedAmt`, `commutedValue`, `reducedPension`).

---

### Group 3 — Always-return (never null) (3 calculators)

**IncomeTaxCalculator, NpsCorpusCalculator, DcrgCalculator**

These use `useMemo` that always returns a valid object (even with empty inputs, producing zero values). The result section has no null guard. `AnimatedNumber` is in the DOM from page load with `animKey=0`, displaying zero values immediately — no animation fires until the user enters valid data.

**Trigger pattern:** Track when the primary input first becomes valid:

- **IncomeTaxCalculator** — use the existing `canPrint` variable (`n(basic1) > 0 && R !== null`):
  ```js
  const [animKey, setAnimKey] = useState(0);
  const prevCanPrint = useRef(false);
  useEffect(() => {
    const was = prevCanPrint.current;
    prevCanPrint.current = canPrint;
    if (!was && canPrint) setAnimKey(k => k + 1);
  }, [canPrint]);
  ```

- **NpsCorpusCalculator** — the primary input (`basicPay`) starts at a non-zero default (25000), so a `> 0` trigger would fire on mount — not on first user entry. Instead, fire on mount using an empty-dependency `useEffect`:
  ```js
  const [animKey, setAnimKey] = useState(0);
  useEffect(() => { setAnimKey(1); }, []);
  ```
  This plays a single entrance animation when the user first opens the calculator page. Subsequent input changes update instantly.

- **DcrgCalculator** — same situation (`basic` starts at 30000). Apply the same mount-trigger pattern:
  ```js
  const [animKey, setAnimKey] = useState(0);
  useEffect(() => { setAnimKey(1); }, []);
  ```

For these two calculators, `animKey=0` on initial JS execution → immediately becomes 1 on mount → `AnimatedNumber` counts up from 0 to the default result values as a page entrance animation.

---

## What Gets Animated

**Animate all numeric outputs in result sections** — both monetary (₹) and count values (days, years, months). Use `prefix="₹"` for monetary, `prefix=""` for count values.

**Do NOT animate:**
- Input fields
- Labels and headings
- Date strings (retirement date, restore date, restoration date)
- Percentage displays (e.g. "DA: 35%")
- Fitment factor (e.g. `1.38×`) — a coefficient, not a result value
- Countdown display in RetirementCalculator (years/months/days until retirement) — `CountUnit` handles this already

---

## Animation Details
- **Duration:** 900ms
- **Easing:** ease-in-out-cubic
- **From:** 0 (always; negative values animate absolute value and apply sign in display)
- **To:** target value
- **Re-trigger:** only on null → non-null (or invalid → valid) transition; also re-triggers after explicit reset+recalculate in DArrearCalculator

## No New Dependencies
Uses only React built-ins (`useState`, `useEffect`, `useRef`) and `requestAnimationFrame`. No animation libraries.
