# NPS-APS Calculator Color Cleanup — Design Spec
**Date:** 2026-03-26

## Goal

Reduce the NPS-APS calculator palette to **two accent colors only**:
- `#30d158` — green: APS, positive values, primary highlights, active UI
- `#ff453a` — red: warnings, errors, negative values, costs

Everything else uses neutral white (`rgba(255,255,255,0.88)` for values, `rgba(255,255,255,0.50)` for secondary text).

**Colors being removed:**
- `#2997ff` (blue) — NPS accent color throughout
- `#ff9f0a` (amber) — lump sum, tabs, table highlights
- `#ffcc66` (amber-light) — amber warning notice text color
- `#93c5fd` (light blue) — key-facts info notice text
- `#bf5af2` (purple) — Service stat card

**Colors untouched:**
- `#25d366` — WhatsApp share button icon (brand color, not a UI accent)
- `#86efac` — green-family text inside the APS insight notice (keep)
- `#ff9f9f` — red-family text in the existing red warning notice (kept as-is); also used as the replacement color for the amber notice in Section 4

---

## File

`src/components/NpsApsCalculator.jsx`

---

## Changes by Section

### 1. NPS Face-Off Card (~lines 358–372)

```jsx
// Card container — before:
style={{ background: 'rgba(41,151,255,0.05)', border: '1px solid rgba(41,151,255,0.15)' }}
// after:
style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)' }}

// Label — before:
className="... text-[#2997ff]/60 ..."
// after:
className="... text-white/40 ..."

// Value — before:
className="text-[38px] font-black text-[#2997ff] ..."
// after:
className="text-[38px] font-black text-white/90 ..."

// "60% Lump Sum" badge — before:
style={{ background: 'rgba(41,151,255,0.12)', border: '1px solid rgba(41,151,255,0.2)' }}
className="... text-[#2997ff]"
// after:
style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
className="... text-white/55"
```

### 2. Winner Banner (~lines 376–386)

When NPS wins (currently blue), change to neutral white. APS banner already green — no change.

Both background/border and the text color are controlled by ternary expressions on `R.apsP > R.npsP`. Only the NPS branch values (the `false` branches) are being changed:

```jsx
// Line 377 — container style — before (NPS branch values):
background: 'rgba(41,151,255,0.07)'
border: `1px solid rgba(41,151,255,0.2)`
// after:
background: 'rgba(255,255,255,0.04)'
border: `1px solid rgba(255,255,255,0.12)`

// Line 378 — text color — before (NPS branch value):
color: R.apsP > R.npsP ? '#30d158' : '#2997ff'
// after:
color: R.apsP > R.npsP ? '#30d158' : 'rgba(255,255,255,0.88)'
```

### 3. Quick Stat Cards (~lines 406–409)

```js
// NPS Corpus — before: color: '#2997ff'
{ label: 'NPS Corpus', ..., color: 'rgba(255,255,255,0.88)' }

// Lump Sum — before: color: '#ff9f0a'
{ label: 'Lump Sum (60%)', ..., color: 'rgba(255,255,255,0.88)' }

// Last Gross Pay — before: color: '#30d158' — NO CHANGE ✓

// Service — before: color: '#bf5af2'
{ label: 'Service', ..., color: 'rgba(255,255,255,0.88)' }
```

### 4. Warning Notices (~lines 423–428)

```jsx
// Red notice — NO CHANGE ✓

// Amber notice — before:
style={{ background: 'rgba(255,159,10,0.07)', border: '1px solid rgba(255,159,10,0.2)', color: '#ffcc66' }}
// after (use red):
style={{ background: 'rgba(255,69,58,0.07)', border: '1px solid rgba(255,69,58,0.2)', color: '#ff9f9f' }}
```

### 5. Tabs (~lines 436–439)

```jsx
// Active tab — before:
background: tab === t.id ? '#ff9f0a' : ...
border: tab === t.id ? '1px solid #ff9f0a' : ...
color: tab === t.id ? '#000' : ...
// after:
background: tab === t.id ? '#30d158' : ...
border: tab === t.id ? '1px solid #30d158' : ...
color: tab === t.id ? '#000' : ...
```

### 6. NPS Corpus Sources Pie Chart (~line 460)

Three segments: Your 10%, Govt X%, Returns.

```jsx
// before:
{['#2997ff','#30d158','#ff9f0a'].map((c, i) => <Cell key={i} fill={c} />)}
// after:
{['rgba(255,255,255,0.55)','#30d158','rgba(255,255,255,0.25)'].map((c, i) => <Cell key={i} fill={c} />)}
```

### 7. Retirement Split Pie Chart (~line 476)

Two segments: Lump 60%, Annuity 40%.

```jsx
// before:
{['#ff9f0a','#2997ff'].map((c, i) => <Cell key={i} fill={c} />)}
// after (lump = green as positive payout, annuity = neutral):
{['#30d158','rgba(255,255,255,0.35)'].map((c, i) => <Cell key={i} fill={c} />)}
```

### 8. Pay Revision Timeline Cards (~lines 490–494)

```jsx
// Card border — before:
border: '1px solid rgba(255,159,10,0.2)'
// after:
border: '1px solid rgba(255,255,255,0.08)'

// Year label — before:
className="text-[10px] font-black text-[#ff9f0a] mb-1"
// after:
className="text-[10px] font-black text-white/55 mb-1"
```

### 9. Key Facts notices (~line 508)

```js
// before:
{ ok:   ['rgba(48,209,88,0.07)',  'rgba(48,209,88,0.2)',   '#86efac'] }  // NO CHANGE ✓
{ info: ['rgba(41,151,255,0.07)', 'rgba(41,151,255,0.2)',  '#93c5fd'] }  // blue → neutral
{ warn: ['rgba(255,159,10,0.07)', 'rgba(255,159,10,0.2)',  '#fcd34d'] }  // amber → red

// after:
{ info: ['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.12)', 'rgba(255,255,255,0.65)'] }
{ warn: ['rgba(255,69,58,0.07)',   'rgba(255,69,58,0.2)',    '#ff9f9f'] }
```

### 10. Salary Growth Chart (~line 536)

```jsx
// Annual Salary area — before:
fill="rgba(41,151,255,0.08)" stroke="#2997ff"
// after:
fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.5)"

// Basic Pay line — NO CHANGE ✓ (green)
```

### 11. NPS Corpus Growth Chart (~lines 550–560)

```jsx
// Gradient — before: stopColor="#2997ff" — after: stopColor="rgba(255,255,255,0.5)"
// Area stroke — before: stroke="#2997ff" — after: stroke="rgba(255,255,255,0.5)"
// Contributions area — NO CHANGE ✓ (green)
```

### 12. Post-Retire Monthly Pension Chart (~line 583)

```jsx
// NPS line — before:
stroke="#2997ff" strokeDasharray="6 3"
// after (keep dashed to still distinguish from APS):
stroke="rgba(255,255,255,0.55)" strokeDasharray="6 3"

// APS line — NO CHANGE ✓ (green)
```

### 13. Cumulative Pension Chart (~lines 600–610)

```jsx
// npsG gradient — before: stopColor="#2997ff" — after: stopColor="rgba(255,255,255,0.5)"
// NPS Total area — before: stroke="#2997ff" — after: stroke="rgba(255,255,255,0.5)"
// APS Total — NO CHANGE ✓ (green)
```

### 14. APS Advantage Bar Chart (~line 626)

```jsx
// NO CHANGE — green for positive, red for negative ✓
```

### 15. Year-by-Year Table (~lines 654–676)

```jsx
// Revision row highlight — before:
background: r.isRev ? 'rgba(255,159,10,0.05)' : 'transparent'
// after:
background: r.isRev ? 'rgba(255,255,255,0.02)' : 'transparent'

// REV badge — before: text-[#ff9f0a] — after: text-white/40

// DA% column — before: text-[#ff9f0a]/70 — after: text-white/50
// Emp NPS column — NO CHANGE ✓ (red/cost)
// Govt NPS column — before: text-[#ff9f0a]/70 — after: text-white/50
// Monthly contrib — NO CHANGE ✓ (green)
// Corpus column — before: text-[#ff9f0a] — after: text-white/70

// Totals row:
// Emp total — NO CHANGE ✓ (red/cost)
// Govt total — before: text-[#ff9f0a] — after: text-white/60
// Monthly total — NO CHANGE ✓ (green)
// Final corpus — before: text-[#ff9f0a] — after: text-[#30d158] (main positive outcome)
```

---

## Summary of Rules

| Color | Keep | Replace with |
|-------|------|-------------|
| `#30d158` green | ✓ everywhere | — |
| `#ff453a` red | ✓ warnings, costs, negatives | — |
| `#2997ff` blue | ✗ | neutral white or green |
| `#ff9f0a` amber | ✗ | neutral white, red, or green |
| `#bf5af2` purple | ✗ | neutral white |
| `#25d366` WhatsApp | ✓ icon only | — |
