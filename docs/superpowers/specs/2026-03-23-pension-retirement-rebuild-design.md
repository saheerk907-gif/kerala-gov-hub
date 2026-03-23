# Phase 1 — Pension & Retirement Page Rebuild

**Date:** 2026-03-23
**Goal:** Improve SEO by adding server-rendered content and schema markup to the two highest-value tool pages.

---

## Problem

Both pages are content-sparse. The pension page (`/pension`) is entirely `'use client'`, meaning Google sees a blank shell — the FAQ text and all content are invisible to crawlers. The retirement page (`/retirement`) is already a server component but has zero surrounding content.

---

## Pension Page (`/pension`)

### Structural Change

Extract the calculator logic into `src/components/PensionCalculator.jsx` (client component). The current `page.jsx` becomes a server component.

**File changes:**
- `src/app/pension/page.jsx` → rewritten as server component
- `src/components/PensionCalculator.jsx` → new file, contains all current calculator logic verbatim

### New Page Structure

1. **Breadcrumb** — Home › Pension Calculator
2. **H1** — "Kerala Pension Calculator 2026 — Basic Pension, DCRG & Commutation"
3. **Intro paragraph** — ~150 words in Malayalam, keyword-rich: pension calculation Kerala, KSR Part III, qualifying service, average emoluments, DCRG, commutation, family pension
4. **`<PensionCalculator />`** — client component, identical behaviour to current
5. **"ഇനിയും വായിക്കുക" section** — 2 prominent link cards:
   - → `/pension-calculation` (step-by-step formula guide)
   - → `/pension-forms` (download 24 forms)
6. **`<FAQSection />`** — existing 6 FAQs, now server-rendered so Google can index them

### Schema (layout.js)

Add `SoftwareApplication` JSON-LD alongside existing `FAQPage` schema:

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Kerala Pension Calculator",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "url": "https://keralaemployees.in/pension",
  "description": "Calculate Kerala government employee pension, DCRG, commutation value and family pension based on KSR Part III rules.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
}
```

### Metadata Title Update

`"Kerala Pension Calculator 2026 – Govt Employee Pension, DCRG & Commutation"`

---

## Retirement Page (`/retirement`)

### Structural Change

Already a server component — no split needed. All changes are additive.

**File changes:**
- `src/app/retirement/page.js` → add content sections around existing `<RetirementCalculator />`
- `src/app/retirement/layout.js` → new file, moves metadata + adds JSON-LD schemas

### New Page Structure

1. **Existing breadcrumb** (unchanged)
2. **H1 + Malayalam intro** — retirement date calculation, LPR (Leave Preparatory to Retirement), pension entitlements on retirement
3. **`<RetirementCalculator />`** (unchanged)
4. **Benefits summary grid** — 4-item grid explaining what the tool calculates:
   - Retirement Date
   - LPR Start Date
   - Monthly Pension
   - DCRG Amount
5. **Link card** → `/pension` pension calculator
6. **FAQ section** — 5 retirement-specific FAQs, server-rendered

### Retirement FAQs (5 questions)

1. What is the retirement age for Kerala government employees?
2. What is LPR (Leave Preparatory to Retirement)?
3. How is the retirement date calculated when born on the 1st of a month?
4. What benefits does a Kerala government employee get on retirement?
5. What is the difference between traditional pension and NPS at retirement?

### Schema (new layout.js)

Move existing `metadata` export to `layout.js`. Add two JSON-LD blocks:

- `SoftwareApplication` (same structure as pension, adapted for retirement calculator)
- `FAQPage` (5 retirement FAQs)

---

## What Is NOT Changing

- Calculator logic and UI in both pages — zero functional changes
- `/pension-calculation` guide page — untouched
- `/pension-forms` page — untouched
- Any other pages

---

## Success Criteria

- `curl https://keralaemployees.in/pension` returns H1 and FAQ text in HTML (not blank)
- Both pages score 100 on structured data testing tool for FAQPage + SoftwareApplication
- No regression in calculator behaviour
