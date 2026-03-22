# Retirement Countdown & Benefits Summary — Design Spec

**Date:** 2026-03-18
**Status:** Approved by user

---

## Overview

A personal retirement calculator for Kerala government employees. Detects NPS vs traditional pension category automatically from Date of Joining. Shows countdown, key dates, retirement timeline, and financial estimates.

---

## Scope

- **New file:** `src/components/RetirementCalculator.js` (client component)
- **New file:** `src/app/retirement/page.js` (page wrapper)
- **Modified file:** `src/components/ToolsSection.js` — add card entry

---

## Employee Categories

| Category | DOJ | Retirement Age | Pension | DCRG |
|---|---|---|---|---|
| Traditional (Pre-NPS) | Before 01.04.2013 | 56 | ✓ 50% of emoluments | ✓ |
| NPS Subscriber | On or after 01.04.2013 | 60 | ✗ | ✗ |

Detection: `isNPS = joiningDate >= '2013-04-01'`

Both categories get: countdown, key dates, timeline, leave encashment estimate.
NPS subscribers see a note linking to `/nps/calculator` instead of pension/DCRG cards.

---

## Inputs

| Field | Type | Notes |
|---|---|---|
| Date of Birth | Date picker | Required; must be in the past |
| Date of Joining | Date picker | Required; must be after DOB |
| Current Basic Pay (₹) | Number | Required |
| DA % | Number (0–100) | Current dearness allowance rate |
| EL Balance (days) | Number (0–300) | Current earned leave balance |

---

## Calculations

### Retirement Date
```
retirementAge = isNPS ? 60 : 56

// Last day of the month in which employee turns retirementAge
birthday56or60 = new Date(DOB.year + retirementAge, DOB.month, DOB.date)
retirementDate = last day of birthday56or60's month
// e.g. DOB = 1970-03-15, age 56 → birthday = 2026-03-15 → retirement = 2026-03-31
// Edge case: if birthday is already the last day of the month, retirement = that day
```

### Countdown
```
daysLeft = retirementDate - today (inclusive of retirement date)
yearsLeft = Math.floor(daysLeft / 365.25)
monthsLeft = Math.floor((daysLeft % 365.25) / 30.44)
daysRemainder = daysLeft % 30 (approx)
```

### Qualifying Service (at retirement)
```
totalServiceDays = retirementDate - DOJ
serviceYears = Math.floor(totalServiceDays / 365.25)
serviceMonths = Math.floor((totalServiceDays % 365.25) / 30.44)
qualifyingYears = Math.min(serviceYears + (serviceMonths > 6 ? 1 : 0), 33)
```

### LPR Start Date (Pre-NPS only)
```
elDays = Math.min(Number(elBalance), 300)
// LPR: leave runs from lprStartDate up to and including retirementDate (both inclusive)
lprStartDate = retirementDate - elDays + 1 day
// e.g. retirement 31 Mar, EL 10 days → LPR starts 22 Mar (22–31 = 10 days inclusive)
// Only shown if elDays > 0
```

### Financial Estimates (Pre-NPS only)
```
daAmount = Math.round(basicPay * daPercent / 100)
emoluments = basicPay + daAmount           // last month emoluments proxy

// Pension = 50% of average emoluments (last 10 months). Using last month pay as proxy — acceptable approximation.
monthlyPension = Math.max(9000, Math.round(emoluments / 2))
// Floor of ₹9,000/month per 11th PRC minimum pension order
// If formula result < ₹9,000, display ₹9,000 with note "Minimum pension applies"

// qualifyingYears rounding: serviceMonths > 6 rounds up (exactly 6 months does NOT round up)
// Max qualifying years = 33; matches existing DCRG calculator at /dcrg
dcrgRaw = Math.ceil(emoluments * qualifyingYears / 2)
dcrg = qualifyingYears >= 5 ? Math.min(dcrgRaw, 2000000) : 0
// Cap = ₹20,00,000 — matches MAX_DCRG constant in existing /dcrg calculator
// Note: FAQ text in /dcrg says ₹14L; code uses ₹20L. Code is authoritative here.
dcrgEligible = qualifyingYears >= 5   // minimum 5 years qualifying service required

leaveEncashment = Math.round(emoluments / 30 * elDays)
```

---

## Output Layout

### Section 1 — Countdown Card (full width)
Large animated flip-style display:
- **X years Y months Z days** until retirement
- Subtitle: retirement date formatted as "31 March 2026"
- Employee category badge: "Traditional Pension" (orange) or "NPS Subscriber" (blue)

### Section 2 — Key Dates (2-col grid)
- Retirement Date — exact date
- Total Service at Retirement — "X years Y months"
- LPR Start Date — date + "X days before retirement" *(Pre-NPS, EL > 0 only)*
- Qualifying Service — years used for DCRG/pension calculation

### Section 3 — Retirement Timeline (horizontal bar)
Visual milestone bar left-to-right:
- **Today** (leftmost)
- **LPR Eligible** — if EL > 0 and Pre-NPS *(positioned proportionally)*
- **Retirement Date** (rightmost)

Each milestone: dot + label + date below. Active segment fills in accent colour.

### Section 4 — Financial Estimates

**Pre-NPS employees — 3 stat cards:**
- Monthly Pension (₹) — `emoluments ÷ 2`
- DCRG (₹) — `emoluments × qualifyingYears ÷ 2`, capped ₹20L; show "Not eligible" if < 5 years
- Leave Encashment (₹) — `emoluments ÷ 30 × EL days`

**NPS employees — 1 info card:**
- Leave Encashment (₹)
- Advisory: "As an NPS subscriber (joined on/after 01.04.2013), pension and DCRG under KSR are not applicable. Use the NPS Calculator to estimate your corpus." with link to `/nps/calculator`

All financial cards carry disclaimer: *"Estimate only. Pension is based on last month's pay; actual pension uses 10-month average emoluments. Amounts depend on final pay, DA revision, and qualifying service at retirement."*

**Teaching staff / doctors note:** Display a standing advisory for pre-NPS employees: *"Note: Doctors (Medical Education Service) retire at 60. Teaching staff may retire at the end of the academic year's month. If this applies to you, your retirement date will differ."*

---

## Animations & Visual Design

- **Accent colour:** `#30d158` (green — "finish line" tone)
- **Countdown numbers:** Large animated counters (same `useAnimatedCounter` hook as HPLCalculator)
- **Timeline bar:** CSS width transition on mount from 0% to computed position
- **Financial cards:** Animated ₹ counters on first render
- **Glass-card layout:** Matches existing `glass-card rounded-2xl p-6` pattern
- **Font:** `var(--font-noto-malayalam), sans-serif` for headings

---

## Component Structure

```
RetirementCalculator
├── Header card (icon 🎯, title, subtitle)
├── Inputs card (DOB, DOJ, Basic Pay, DA%, EL Balance)
├── [results — only when DOB + DOJ entered]
│   ├── Countdown card (animated years/months/days + category badge)
│   ├── Key Dates card (2-col grid)
│   ├── Timeline card (horizontal milestone bar)
│   └── Financial Estimates card (3 cards Pre-NPS / 1 card + advisory NPS)
```

---

## ToolsSection Entry

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
}
```

---

## Edge Cases

| Case | Behaviour |
|---|---|
| `retirementDate <= today` | Replace countdown with "You have retired on [date]" message; still show financial estimates for reference |
| `elDays = 0` | Hide LPR Start Date from Key Dates and Timeline |
| `qualifyingYears < 5` | DCRG card shows "Not eligible — minimum 5 years qualifying service required" |
| `monthlyPension < 9000` | Show ₹9,000 with "Minimum pension applies (11th PRC)" note |
| Re-appointed employee | Out of scope — add note in UI: "If you have a break in service or were re-appointed, please verify your qualifying service manually" |

---

## Out of Scope

- Actual NPS corpus projection — link to `/nps/calculator`
- Doctors (MES) / teaching staff retirement extensions — covered by advisory note only
- Death gratuity calculation — covered by `/dcrg`
- Supabase persistence — purely client-side
- Re-appointment / break-in-service qualifying service adjustment
