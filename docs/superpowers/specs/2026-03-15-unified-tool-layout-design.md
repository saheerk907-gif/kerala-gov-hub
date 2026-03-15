# Unified Tool Layout — All Calculators

**Date:** 2026-03-15
**Status:** Approved (v4 — final)

## Goal

Apply the Income Tax Calculator's card-based layout to 5 interactive tool pages. Universal accent: `#ff9f0a`.

---

## Shared Patterns

### New file: `src/components/SectionHeader.js`

```jsx
export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-bold text-[#ff9f0a] uppercase tracking-wider">{title}</h3>
      {subtitle && <p className="text-xs text-white/60 mt-0.5">{subtitle}</p>}
    </div>
  );
}
```

All tool components: `import SectionHeader from '@/components/SectionHeader'`

### Universal `inputCls` (wholesale-replace any local `inputCls` definition)

```js
const inputCls = 'bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#ff9f0a]/50 focus:bg-white/[0.09] transition-all w-full';
```

### Toggle button states

```
Active:   bg-[#ff9f0a]/15  border-[#ff9f0a]/50  text-white
Inactive: bg-white/[0.04]  border-white/10       text-white/50  hover:border-white/20
```

### Sliding pill/switch active background: `bg-[#ff9f0a]` (solid, no opacity)

### Labels

```jsx
<label className="text-xs text-white/60 font-medium mb-2 block">Label</label>
```

### Page shell

```jsx
<main className="min-h-screen bg-aurora text-white pt-[100px]">
  <div className="{maxW} mx-auto px-6 py-10">
    {/* breadcrumb */}
    <ToolComponent />
  </div>
</main>
```

Keep all existing `<Navbar />` and `<Footer />` calls.

### Component root: `<div className="space-y-6">`

### Card patterns

| Card | className |
|------|-----------|
| Header | `glass-card rounded-2xl p-6 border border-[#ff9f0a]/20` |
| Section | `glass-card rounded-2xl p-6` |
| Results | `glass-card rounded-2xl p-6 border border-[#ff9f0a]/20` |

### Accent color rule — SIMPLE: replace ALL non-gold accents in each tool file

Within the 5 tool files (pages + components), replace every occurrence of the following with `#ff9f0a` and its rgba equivalents maintaining the same alpha:

| Old | Replace hex with | Replace rgba base with |
|-----|-----------------|----------------------|
| `#64d2ff` (cyan) | `#ff9f0a` | `rgba(255,159,10,...)` |
| `#bf5af2` (purple) | `#ff9f0a` | `rgba(255,159,10,...)` |
| `#c8960c` (amber) | `#ff9f0a` | `rgba(255,159,10,...)` |
| `#2997ff` (blue) | `#ff9f0a` | `rgba(255,159,10,...)` — **everywhere** in the tool file |
| `rgba(100,210,255,...)` | `rgba(255,159,10,...)` | |
| `rgba(191,90,242,...)` | `rgba(255,159,10,...)` | |
| `rgba(200,150,12,...)` | `rgba(255,159,10,...)` | |
| `rgba(41,151,255,...)` | `rgba(255,159,10,...)` | |

**Exception:** The blue "Calculate" button in `da-arrear/page.jsx` (linear-gradient with `#1a6abf, #2997ff`) and the `ratehdr` table row highlight in the same file — leave those unchanged (they are data-table and CTA styling, not layout structure).

---

## Per-Tool Specification

### Tool 1 — Leave Calculator

**Files:** `src/app/leave/page.js` + `src/components/LeaveCalculator.js`
**Container:** `max-w-4xl`

**Page (`leave/page.js`):**
- Outer: `min-h-screen bg-aurora text-white pt-[100px]`
- Container: `max-w-4xl mx-auto px-6 py-10`
- Breadcrumb (3-level, preserve existing middle crumb):
  ```jsx
  Home › Kerala Service Rules › Leave Calculator
  ```
  `Home` and `Kerala Service Rules` = `text-white/60`, `Leave Calculator` = `text-[#ff9f0a]`

**Component (`LeaveCalculator.js`):**
- Root: `<div className="space-y-6">`
- Header card: title "Leave Calculator", subtitle "KSR Part I — Earned Leave"
- Wrap input groups in `glass-card rounded-2xl p-6` + `SectionHeader`
- Suggested sections: "Service Type", "Leave Period", "Results"
- Replace `inputCls` with universal string
- Replace all `#64d2ff` / `rgba(100,210,255,...)` including KSR reference table cell colors
- For the LPR sliding-pill toggle: change pill active background from `bg-[#64d2ff]` to `bg-[#ff9f0a]`

---

### Tool 2 — NPS Corpus Calculator

**Files:** `src/app/nps/calculator/page.js` + `src/components/NpsCorpusCalculator.js`
**Container:** `max-w-4xl`

**Page (`nps/calculator/page.js`):**
- Remove the existing purple hero/header block (the div with purple radial gradients at the top of the page)
- Replace with: `min-h-screen bg-aurora text-white pt-[100px]`
- Container: `max-w-4xl mx-auto px-6 py-10`
- Breadcrumb: `Home › NPS Corpus Calculator`
- Keep `<Navbar />`, `<Footer />`
- The "← Back to NPS" link below the calculator: replace its inline purple styling with gold (`#ff9f0a`)
- The NPS-vs-APS teaser/comparison block: **leave entirely unchanged**

**Component (`NpsCorpusCalculator.js`):**
- Root: `<div className="space-y-6">`
- Header card: title "NPS Corpus Calculator", subtitle "Estimate your retirement corpus & pension"
- Wrap input groups in `glass-card rounded-2xl p-6` + `SectionHeader`
- Suggested sections: "Employee Details", "Contribution & Growth", "Results"
- Replace `inputCls` with universal string
- Replace all `#bf5af2` / `rgba(191,90,242,...)` with gold

---

### Tool 3 — DCRG Calculator

**File:** `src/app/dcrg/page.jsx` (inline)
**Container:** `max-w-4xl`

**Page changes:**
- Outer: `min-h-screen bg-aurora text-white pt-[100px]`
- Container: `max-w-4xl mx-auto px-6 py-10`
- Breadcrumb: `Home › DCRG Calculator`
- Keep `<Navbar />`, `<Footer />`
- Import `SectionHeader from '@/components/SectionHeader'`
- Wrap input groups in `glass-card rounded-2xl p-6` + `SectionHeader`
- Suggested sections: "Retirement Details", "Salary Details", "Results"
- Replace `inputCls` with universal string
- Replace ALL `#c8960c` / `rgba(200,150,12,...)` with gold — including result panel border/background, DA table row highlight, and `<FAQSection accentColor="...">` prop
- Replace ALL `#2997ff` / `rgba(41,151,255,...)` occurrences (PRC toggle buttons, any blue row) with gold

---

### Tool 4 — DA Arrear Calculator

**File:** `src/app/da-arrear/page.jsx` (inline)
**Container:** `max-w-4xl`

**Page changes:**
- Ensure outer: `min-h-screen bg-aurora text-white pt-[100px]`
- Container: `max-w-4xl mx-auto px-6 py-10`
- Breadcrumb: `Home › DA Arrear Calculator`
- Keep `<Navbar />`, `<Footer />`
- Import `SectionHeader from '@/components/SectionHeader'`
- Wrap input groups in `glass-card rounded-2xl p-6` + `SectionHeader`
- Suggested sections: "Pay Details", "Arrear Period", "Results"
- Wholesale-replace local `inputCls` string with universal string
- Replace `#2997ff` / `rgba(41,151,255,...)` in section headers and toggle active states with gold
- **Exceptions — leave unchanged:**
  - Blue "Calculate" button (`linear-gradient(135deg, #1a6abf, #2997ff)`)
  - `ratehdr` table row (`rgba(41,151,255,...)` background)

---

### Tool 5 — Pay Revision Calculator

**Files:** `src/app/pay-scales/page.js` + `src/components/PayCalculator.js`
**Container:** `max-w-6xl` ← keep existing width (table is wide, do not narrow)

**Page (`pay-scales/page.js`):**
- Outer: `min-h-screen bg-aurora text-white pt-[100px]`
- Container: `max-w-6xl mx-auto px-6 py-10` (same as existing)
- Breadcrumb: `Home › Pay Revision Calculator`
- Keep `<Navbar />`, `<Footer />`
- Static pay-scales reference table below the calculator: **leave unchanged**

**Component (`PayCalculator.js`):**
- Root: `<div className="space-y-6">`
- Header card: title "Pay Revision Calculator", subtitle "12th PRC — Pay Fixation"
- Wrap input groups in `glass-card rounded-2xl p-6` + `SectionHeader`
- Suggested sections: "Current Pay Details", "Fitment Options", "Results"
- Replace `inputCls` with universal string
- Replace any cyan/blue accent with gold

---

## Out of Scope

- `src/app/pension-calculation/page.jsx` — editorial guide, no inputs, excluded
- Admin pages, non-tool pages, news, articles, orders, schemes
- All calculation logic
- Navbar, Footer
- NPS-vs-APS teaser block in `nps/calculator/page.js`
- Blue "Calculate" button + `ratehdr` row in `da-arrear/page.jsx`
- Static pay scales reference table in `pay-scales/page.js`

---

## Implementation Order

1. Create `src/components/SectionHeader.js`
2. Leave Calculator (`leave/page.js` + `LeaveCalculator.js`)
3. NPS Corpus Calculator (`nps/calculator/page.js` + `NpsCorpusCalculator.js`)
4. DCRG Calculator (`dcrg/page.jsx`)
5. DA Arrear Calculator (`da-arrear/page.jsx`)
6. Pay Revision Calculator (`pay-scales/page.js` + `PayCalculator.js`)
7. Commit and push

## Success Criteria

- All 5 tools: breadcrumb + `bg-aurora` + correct `max-w` container + `space-y-6` root
- Every input section: `glass-card rounded-2xl p-6` + `SectionHeader`
- All inputs: universal `inputCls` with `focus:border-[#ff9f0a]/50`
- All toggle active states: `bg-[#ff9f0a]/15 border-[#ff9f0a]/50`
- Sliding pill active: `bg-[#ff9f0a]`
- No old accent colors (cyan/purple/amber/blue) in section headers, active toggles, or reference table cells — except the explicitly out-of-scope exceptions
- Zero calculation logic changes
