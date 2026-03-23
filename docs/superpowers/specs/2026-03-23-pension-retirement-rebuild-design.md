# Phase 1 — Pension & Retirement Page Rebuild

**Date:** 2026-03-23
**Goal:** Improve SEO by adding server-rendered content and schema markup to the two highest-value tool pages.

---

## Problem

Both pages are content-sparse. The pension page (`/pension`) is entirely `'use client'`, meaning Google sees a blank shell. The retirement page (`/retirement`) is a server component but has zero surrounding content. `FAQSection` is also `'use client'` (uses `useState` for accordion), so it cannot simply be dropped into a server component and have its text indexed.

---

## Pension Page (`/pension`)

### Structural Change

Extract all calculator logic into `src/components/PensionCalculator.jsx` (client component, verbatim copy of current page.jsx logic). Rewrite `src/app/pension/page.jsx` as a server component.

Because `<FAQSection />` is `'use client'`, **do not use it** in the server page. Instead render the FAQ answers directly as a static `<dl>` or `<details>` list in the server component. This ensures Google receives the FAQ text as plain HTML. The existing `<FAQSection />` component is not changed.

**File changes:**
- `src/app/pension/page.jsx` → rewritten as server component (no `'use client'`)
- `src/components/PensionCalculator.jsx` → new file, exact copy of current calculator logic + UI
- `src/app/pension/layout.js` → modified (add `SoftwareApplication` JSON-LD; keep existing `FAQPage` schema and `buildMetadata` call)

### New `page.jsx` Structure (top to bottom)

1. **Breadcrumb** — replaces the existing `← Back to Home` link:
   `Home › Pension Calculator`
   Styled as: `<a href="/">Home</a> › <span>Pension Calculator</span>`

2. **H1** — `"Kerala Govt Pension Calculator 2026 — Calculate Basic Pension, DCRG & Commutation"`

3. **Intro — bilingual, two paragraphs:**

   **English paragraph (80–100 words, SEO keyword capture):**
   > Kerala government employees retiring under the traditional pension scheme can use this calculator to estimate their monthly pension, Death-cum-Retirement Gratuity (DCRG), commutation value, and family pension — all calculated as per Kerala Service Rules (KSR) Part III. Enter your date of birth, total qualifying service, average emoluments, and commutation percentage to get instant results. This tool supports all retirement types: Pension, Superannuation, Invalid, and Voluntary. Applicable for employees who joined service before January 1, 2013.

   **Malayalam paragraph (120–150 words, local relevance):**
   > കേരള സർക്കാർ ജീവനക്കാർക്ക് Retirement-ൽ ലഭിക്കുന്ന പെൻഷൻ Kerala Service Rules (KSR) Part III-ന് അനുസൃതമായി കണക്കാക്കുന്നു. Basic Pension = (Average Emoluments × Qualifying Service Years) ÷ 60 എന്ന ഫോർമുല ഉപയോഗിക്കുന്നു. Average Emoluments എന്നത് Retirement-ന് മുൻപുള്ള അവസാന 10 മാസത്തെ Basic Pay + DA-ന്റെ ശരാശരിയാണ്. Maximum Qualifying Service 30 വർഷമാണ്; അതിൽ കൂടുതൽ സർവ്വീസ് Pension Amount വർദ്ധിപ്പിക്കില്ല. ഈ Calculator ഉപയോഗിച്ച് Basic Pension, Normal Family Pension, Death-cum-Retirement Gratuity (DCRG), Commutation Value എന്നിവ ഒരേ സമയം കണക്കാക്കാം. Pension-ന്റെ Maximum 40% വരെ Commute ചെയ്ത് Lump Sum ആയി സ്വീകരിക്കാം; Commuted Pension Retirement Date മുതൽ 12 വർഷം കഴിഞ്ഞ് Restore ആകും. Retirement Age 56 വർഷം ആണ്. 2013 January 1-ന് ശേഷം Join ചെയ്ത ജീവനക്കാർ NPS-ൽ ഉൾപ്പെടുന്നതിനാൽ ഈ Calculator Traditional Pension ആനുകൂല്യങ്ങൾ കണക്കാക്കാൻ ഉദ്ദേശിച്ചതാണ്.

4. **`<PensionCalculator />`** — client component, identical behaviour and UI to current

5. **Example output block** — static server-rendered block showing a sample calculation with realistic values. Render before the "ഇനിയും വായിക്കുക" section:
   ```
   ഉദാഹരണം (Example)
   Last Pay (Average Emoluments): ₹70,000
   Qualifying Service: 30 years
   ─────────────────────────────
   ✔ Basic Pension:    ₹35,000 / month
   ✔ DCRG:            ₹10,50,000
   ✔ Family Pension:  ₹21,000 / month
   ✔ Commutation (40%): ₹16,80,000 lump sum → Reduced Pension ₹21,000/month
   ```
   Style: dark glass card (`var(--surface-xs)` background), monospace values, green checkmarks (`#30d158`), amber heading (`#ff9f0a`).

6. **"ഇനിയും വായിക്കുക" section** — replace the existing plain text links (lines 323–334 of current page) with 2 rich link cards matching the dark glass theme. Each card has: **Title**, **one-line description**, and **CTA label**. Layout: side-by-side on desktop, stacked on mobile.
   - Card 1:
     - Title: "പെൻഷൻ കണക്കുകൂട്ടൽ — ഘട്ടം ഘട്ടമായുള്ള മാർഗ്ഗനിർദ്ദേശം"
     - Desc: "KSR Part III pension formula, half-year units, and worked examples explained step by step"
     - CTA: "Read Guide"
     - Link: `/pension-calculation`
   - Card 2:
     - Title: "Pension Forms Download"
     - Desc: "All 24 official pension forms — Form 1 to Form 24 — ready to download"
     - CTA: "Download Forms"
     - Link: `/pension-forms`
   - The `→` arrow (if used) is a decorative `aria-hidden="true"` span, not part of the link text

8. **Static FAQ section** — server-rendered `<section>` with `<h2>പതിവ് ചോദ്യങ്ങൾ</h2>` and the 6 existing FAQ questions/answers rendered as static HTML (not the `FAQSection` client component). Use `<details>/<summary>` or plain `<div>` per item with the same amber accent color (`#ff9f0a`) styling.

### Schema Updates (`layout.js`)

**Important:** Also update the existing `FAQPage` JSON-LD in `layout.js` to include all 6 FAQs (the current schema only has 5 — it is missing the "Normal Family Pension" question). The 6th entry to add:
```json
{ "@type": "Question", "name": "What is Normal Family Pension in Kerala?", "acceptedAnswer": { "@type": "Answer", "text": "Normal Family Pension = 30% of last emoluments (Basic Pay + DA). Minimum is ₹4,500/month and maximum is ₹17,960/month as per current rules." } }
```

Modify the existing `layout.js` to inject a second JSON-LD script for `SoftwareApplication`:

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Kerala Pension Calculator",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "url": "https://keralaemployees.in/pension",
  "description": "Calculate Kerala government employee Basic Pension, DCRG, Commutation Value and Family Pension based on KSR Part III rules.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
}
```

Keep the existing `FAQPage` JSON-LD and `buildMetadata` call unchanged.

### Metadata Title Update (in `layout.js` `buildMetadata` call)

Change title to: `"Kerala Govt Pension Calculator 2026 – Calculate Basic Pension, DCRG & Commutation"`

---

## Retirement Page (`/retirement`)

### Structural Change

`page.js` is already a server component. `<Navbar />` and `<Footer />` stay in `page.js`. A new `layout.js` is created only to inject JSON-LD scripts (same pattern as pension layout — wraps `{children}` in a fragment with script tags). The `metadata` export moves from `page.js` to `layout.js` as-is (same raw object, no conversion to `buildMetadata`, no addition of `openGraph` or `twitter` fields — keep it exactly as it currently is).

**File changes:**
- `src/app/retirement/page.js` → add content sections (additive only)
- `src/app/retirement/layout.js` → new file: `metadata` export + 2 JSON-LD scripts

### New `page.js` Structure (top to bottom)

1. **Existing breadcrumb** — unchanged

2. **H1 + Malayalam intro** (add above `<RetirementCalculator />`):
   - H1: `"Retirement Calculator — Kerala Government Employees"`
   - Intro paragraph in Malayalam:
     > കേരള സർക്കാർ ജീവനക്കാരുടെ Retirement Date, Leave Preparatory to Retirement (LPR) Start Date, Monthly Pension, DCRG തുക എന്നിവ ഈ Calculator ഉപയോഗിച്ച് കണക്കാക്കാം. KSR Part III-ന് അനുസൃതമായി Retirement Age 56 വർഷം ആണ്. ജനന മാസത്തിന്റെ അവസാന ദിവസം ആണ് Retirement Date; ജനനം 1-ആം തീയ്യതിയാണെങ്കിൽ ഒരു മാസം മുൻപ് Retire ആകും. Superannuation Retirement-ൽ (Teachers) 56 വർഷം ശേഷം Academic Term-ന്റെ അവസാനം (March 31 / May 31) ആണ് തീയ്യതി. Traditional Pension (pre-2013) ഉം NPS (2013-ന് ശേഷം) ഉം ഈ Calculator-ൽ Support ചെയ്യുന്നു.

3. **`<RetirementCalculator />`** — unchanged

4. **Benefits summary grid** (add below calculator) — 4-item grid using glass card styling:
   | Label | Subtitle |
   |---|---|
   | Retirement Date | ജനന തീയ്യതി അനുസരിച്ച് KSR Rule പ്രകാരം |
   | LPR Start Date | Earned Leave Balance-ന് അനുസൃതമായ Duty Exemption |
   | Monthly Pension | Basic Pension (Traditional) / NPS Corpus Estimate |
   | DCRG Amount | Lump Sum Gratuity, Maximum ₹14,00,000 |

5. **Link card** → `/pension` — "Pension Calculator →" with pension-specific description

6. **Static FAQ section** — 5 questions server-rendered as static HTML (same `<details>/<summary>` or plain div approach as pension page):

   **Q1:** What is the retirement age for Kerala government employees?
   **A1:** കേരള സർക്കാർ ജീവനക്കാർക്ക് Retirement Age 56 വർഷം ആണ്. Superannuation Retirement-ൽ (Teachers etc.) 56 വർഷം തികയുന്നതിന് ശേഷമുള്ള Academic Term-ന്റെ അവസാനം (March 31 or May 31) ആണ് Retirement Date. മറ്റ് ജീവനക്കാർ ജനന മാസത്തിന്റെ അവസാന ദിവസം Retire ആകും.

   **Q2:** What is LPR (Leave Preparatory to Retirement)?
   **A2:** Leave Preparatory to Retirement (LPR) എന്നത് Retirement-ന് തൊട്ടുമുൻപ് Earned Leave ആയി വാങ്ങുന്ന അവകാശ അവധിയാണ്. Maximum 300 ദിവസം LPR ആയി എടുക്കാം. LPR Start Date = Retirement Date − Earned Leave Balance Days.

   **Q3:** How is the retirement date calculated when born on the 1st of a month?
   **A3:** ജനനം മാസത്തിന്റെ 1-ആം തീയ്യതിയാണെങ്കിൽ, Retirement Date അതിന് ഒരു മാസം മുൻപുള്ള മാസത്തിന്റെ അവസാന ദിവസം ആയി കണക്കാക്കും. ഉദാഹരണം: 01/06/1968 ജനിച്ചവർ 31/05/2024-ൽ Retire ആകും.

   **Q4:** What benefits does a Kerala government employee get on retirement?
   **A4:** Retirement-ൽ ലഭിക്കുന്ന ആനുകൂല്യങ്ങൾ: (1) Monthly Pension — Basic Pension + DA, (2) DCRG — Lump sum, maximum ₹14,00,000, (3) Leave Encashment — Surrendered Earned Leave-ന്റെ Salary, (4) Commutation — Pension-ന്റെ 40% വരെ Lump Sum ആയി, (5) Group Insurance maturity.

   **Q5:** What is the difference between traditional pension and NPS at retirement?
   **A5:** 2013 January 1-ന് മുൻപ് Join ചെയ്തവർ Traditional Pension Scheme-ൽ ആണ്: Fixed Monthly Pension, DCRG, Family Pension ഉണ്ട്. 2013-ന് ശേഷം Join ചെയ്തവർ NPS-ൽ ആണ്: Retirement-ൽ Corpus-ന്റെ 60% Tax-free ആയി withdraw ചെയ്യാം; 40% Annuity ആയി Monthly Income ലഭിക്കും.

### Schema (new `layout.js`)

```json
// SoftwareApplication
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Kerala Retirement Calculator",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "url": "https://keralaemployees.in/retirement",
  "description": "Calculate retirement date, LPR start date, monthly pension and DCRG for Kerala government employees. Supports traditional pension and NPS.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
}

// FAQPage
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [ /* 5 Q&A pairs from FAQ section above */ ]
}
```

---

## What Is NOT Changing

- Calculator logic and UI in both pages — zero functional changes
- `FAQSection` client component — untouched (not used in server pages)
- `/pension-calculation` guide page — untouched
- `/pension-forms` page — untouched
- Any other pages

---

## Success Criteria

- `curl https://keralaemployees.in/pension` returns H1, intro text, and FAQ text in raw HTML
- `curl https://keralaemployees.in/retirement` returns H1, intro text, and FAQ text in raw HTML
- Both pages pass Google's Rich Results Test for FAQPage + SoftwareApplication
- No regression in calculator behaviour on either page
