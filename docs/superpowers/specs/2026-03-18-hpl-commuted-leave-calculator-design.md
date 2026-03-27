# HPL & Commuted Leave Balance Estimator — Design Spec

**Date:** 2026-03-18
**Status:** Approved by user

---

## Overview

A new interactive calculator component for Kerala government employees to estimate their Half-Pay Leave (HPL) and Commuted Leave balances, and check whether they can take a desired number of leave days. Added to the existing `/leave` page below the current Earned Leave calculator.

---

## Scope

- **New file:** `src/components/HPLCalculator.js` (client component)
- **Modified file:** `src/app/leave/page.js` — render `<HPLCalculator />` below `<LeaveCalculator />`
- No new route needed; fits naturally in the existing leave page

---

## Leave Rules Encoded

### Half-Pay Leave (HPL)
- **Earning rate:** 20 days per completed year of service
- **Completed year** = continuous service under Kerala Govt, including duty + all leave including LWA, **except** LWA taken for employment abroad or within the country (strictly excluded)
- **HPL Due** = Total HPL earned − HPL already taken
- **HPL accrual:** All employees (permanent and non-permanent) earn HPL from day 1 of service
- **Commuted Leave eligibility:** Permanent employees always; non-permanent employees only after 3 years continuous service

### Commuted Leave
- **Eligibility:** Permanent employees always; non-permanent after 3 years continuous service
- **Max grant** = HPL Due ÷ 2
- **Debit rule:** 2 days HPL debited per 1 day Commuted Leave taken
- **HPL Due** after commuted = Total HPL Earned − HPL taken − (Commuted Leave taken × 2)
- **Combined limit:** Commuted Leave + Earned Leave + Vacation must not exceed 240 days at a stretch

### Casual Leave (CL)
- **Limit:** 20 days per calendar year
- **CL remaining** = 20 − CL taken this year

---

## Inputs

| Field | Type | Notes |
|---|---|---|
| Employment Type | Toggle: Permanent / Non-Permanent | Affects Commuted Leave eligibility |
| Date of Joining | Date picker | Required |
| LWA Exclusion Periods | Add/remove date ranges | Each range has from+to date; multiple allowed |
| HPL already taken | Number (days) | Cumulative over career |
| Commuted Leave already taken | Number (days) | Cumulative over career |
| CL taken this year | Number (days, 0–20) | Calendar year |

---

## Calculations

```
// Completed years: anniversary-based (not /365) to handle leap years correctly
// Count full anniversaries between (joiningDate + excludedLWA offset) and today
effectiveJoiningDate = joiningDate + sum of excluded LWA days (shift forward)
completedYears = countFullAnniversaries(effectiveJoiningDate, today)
// countFullAnniversaries compares month+day of each anniversary year against today

totalHPLEarned = completedYears × 20

// Clamp hplDue to 0 — display a validation warning if inputs exceed totalHPLEarned
hplDue = Math.max(0, totalHPLEarned − hplTaken − (commutedTaken × 2))
showOverflowWarning = (hplTaken + commutedTaken × 2) > totalHPLEarned

commutedEligible = isPermanent || (completedYears >= 3)
// Boundary: the anniversary day itself counts as a completed year (>= comparison, not >)
// e.g. exactly 3 years today → completedYears = 3 → commutedEligible = true for non-permanent
maxCommutedAvailable = commutedEligible ? Math.floor(hplDue / 2) : 0

clRemaining = Math.max(0, 20 − clTakenThisYear)
```

### LWA Exclusion Rules
- `to` date is **inclusive** (both `from` and `to` days are excluded from service)
- If `to` date is in the future, cap it at today (employee currently on LWA)
- If `from` date precedes Date of Joining, clamp `from` to Date of Joining with a validation warning
- If two LWA ranges overlap, merge them before summing excluded days
- Minimum LWA period: 1 day (from = to is valid)

### Input Validation Bounds
| Field | Min | Max | Overflow behaviour |
|---|---|---|---|
| HPL already taken | 0 | — | Show warning if `hplTaken + commutedTaken×2 > totalHPLEarned` |
| Commuted Leave taken | 0 | — | Same combined check |
| CL taken this year | 0 | 20 | Cap display at 20; warn if > 20 entered |

---

## Output Panel

1. **Completed Years of Service** — animated counter
2. **Total HPL Earned** — animated counter
3. **HPL Balance Remaining** — animated counter with progress bar (used vs. total)
4. **Commuted Leave Eligibility** — colored badge (Eligible / Not Yet Eligible + reason)
5. **Max Commuted Leave Available** — animated counter
6. **CL Remaining this year** — animated counter with progress bar (used / 20)

---

## "Can I Take X Days?" Checker

A sub-section below the results panel:

- **Input:** Desired days (number) + Leave Type selector (HPL / Commuted Leave / CL)
- **Output:** Colored Yes/No badge + one-line reason

**Logic:**
| Leave Type | Check |
|---|---|
| HPL | desired ≤ hplDue; also show "this reduces your Commuted Leave ceiling by N days" where N = Math.floor(desired / 2) |
| Commuted Leave | commutedEligible AND desired ≤ maxCommutedAvailable; show HPL balance after debit |
| CL | desired ≤ clRemaining |

**240-day combined limit:** No EL input is collected, so an exact check is not possible. Show a standing advisory note on the Commuted Leave result: *"Note: KSR requires that Commuted Leave combined with Earned Leave and Vacation must not exceed 240 days at a stretch. Verify with your office."*

**Example outputs:**
- ✅ "Yes — you can take 15 days Commuted Leave. HPL balance after debit: 70 days."
- ✅ "Yes — you can take 20 days HPL. This reduces your Commuted Leave ceiling by 10 days."
- ❌ "No — only 8 days of Commuted Leave available."
- ❌ "Not eligible — Non-permanent employees need 3 years of service for Commuted Leave."

---

## Animations & Visual Design

- **Accent color:** `#64d2ff` (blue — distinct from EL's orange `#ff9f0a`)
- **Number counters:** Count up from 0 to final value on first render (using `useEffect` + `requestAnimationFrame`). Match the duration and easing of the existing `LeaveCalculator.js` — if no counter exists there, use 800ms linear easing. Re-trigger animation when inputs change and a new result is computed.
- **Progress bars:** HPL used/total and CL used/20 shown as animated fill bars
- **LWA date ranges:** Smooth expand/collapse with transition
- **Eligibility badge:** Pulse ring animation on first appearance
- **Yes/No checker result:** Slide-in transition when answer appears
- **Glass-card layout:** Matches existing `glass-card rounded-2xl p-6` pattern throughout
- **SectionHeader component:** Used for each card section title (same as LeaveCalculator)
- **inputCls / labelCls:** Same class strings as existing LeaveCalculator
- **Font:** `var(--font-noto-malayalam), sans-serif` for headings

---

## Component Structure

```
HPLCalculator
├── Header card (icon 📋, title "HPL & Commuted Leave Calculator", subtitle "KSR Part I")
├── Employment Type card (Permanent / Non-Permanent toggle)
├── Service Details card
│   ├── Date of Joining
│   ├── LWA Exclusion Periods (add/remove)
│   ├── HPL already taken
│   ├── Commuted Leave already taken
│   └── CL taken this year
├── Results card (animated counters + progress bars)
├── "Can I take X days?" checker card
└── KSR HPL/Commuted Leave Rules quick-reference table
```

---

## KSR Reference Table (bottom of component)

| Rule | Detail |
|---|---|
| HPL earning rate | 20 days per completed year |
| LWA exclusion | Employment abroad/within country excluded |
| Commuted Leave max | Half of HPL due |
| HPL debit | 2 days per 1 day commuted |
| Commuted eligibility | Permanent always; Non-permanent after 3 years |
| CL limit | 20 days per calendar year |
| Combined limit | Commuted Leave + Earned Leave + Vacation ≤ 240 days at a stretch (KSR Rule 86) |

---

## Out of Scope

- Leave salary / monetary calculations (half-pay amounts, allowances) — display-only note referencing KSR
- Integration with Supabase — purely client-side calculation, no data persistence
- Maternity / Paternity / Study Leave — separate feature if needed
