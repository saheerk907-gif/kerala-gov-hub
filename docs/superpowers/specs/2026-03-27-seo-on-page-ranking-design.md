# SEO On-Page & Ranking Design — keralaemployees.in
Date: 2026-03-27
Audit source: SEOptimer — overall grade D+

---

## Context

SEOptimer audit flagged 25 recommendations. This spec builds a **system** that makes SEO violations impossible, not a checklist of patches.

Two phases:
- **Phase 1** — Technical SEO enforcement (meta, canonical, favicon, alt tags)
- **Phase 2** — Ranking SEO (keyword ownership, internal linking, schema)

The codebase is Next.js 14 App Router with a shared `buildMetadata()` helper (`src/lib/seo.js`).

---

## System Rules (enforced, not suggested)

These rules apply to every page, forever. They exist before implementation starts.

### Rule 1: No raw metadata exports
Every public-facing page must use `buildMetadata()`. Direct `export const metadata = { ... }` objects are forbidden — they bypass canonical, bypass character limits, and create inconsistent signals.

```js
// ❌ Never do this
export const metadata = { title: '...', description: '...' };

// ✅ Always do this
export const metadata = buildMetadata({ title: '...', description: '...', path: '/page' });
```

### Rule 2: One keyword cluster per page
No two pages compete for the same primary keyword. Each page owns one cluster. Overlapping keywords (e.g., two pages targeting "DA arrear Kerala") dilute ranking for both.

### Rule 3: Minimum 2 internal links per tool page
Every calculator/tool page must link to at least 2 related pages contextually (in body content, not just nav). This is the highest-ROI ranking lever in the codebase.

### Rule 4: Description 120–160 chars, title 50–60 chars
CTR-focused copy only. Not keyword-stuffed, not truncated.

---

## Phase 1 — Technical SEO Enforcement

### 1. Meta Description & Title (root layout)

**Problem:** `src/app/layout.js` default description is 227 chars. Title is 65 chars. Neither is CTR-optimised.

**Fix:**
```js
// src/app/layout.js
title: {
  default: 'Kerala Employees Portal – Salary, DA, Pension Updates',  // 54 chars
  template: '%s | Kerala Employees',
},
description: 'Latest Kerala govt employee updates: DA arrears, pension rules, MEDISEP, salary tools & calculators. Simple, accurate, updated.',
// 128 chars — keep under 160, do not exceed
```

English-first description is intentional: improves search CTR. Malayalam lives in page body and OG fields.

Add to `src/lib/seo.js` as a reminder comment at the top:
```js
// RULE: title 50–60 chars | description 120–160 chars | always use buildMetadata()
```

---

### 2. Canonical Tags — System Enforcement (not per-page patching)

**Problem:** Root `layout.js` has no canonical. ~23 pages export raw metadata bypassing `buildMetadata`.

**The fix is not "migrate 23 pages". The fix is enforcing the system so it cannot happen again.**

**Step 1 — Fix root `layout.js`:**
```js
alternates: { canonical: 'https://keralaemployees.in' },
```

**Step 2 — Migrate all raw metadata pages to `buildMetadata`:**

Pages currently bypassing the system:
- `src/app/pay-scales/layout.js`
- `src/app/forum/page.js`
- `src/app/contact/layout.js`
- `src/app/nps-aps/layout.js`
- `src/app/income-tax/page.js`
- `src/app/articles/layout.js`
- `src/app/pension-forms/layout.js`
- `src/app/forms/layout.js`
- `src/app/audio-classes/layout.js`

**Step 3 — Verify complete coverage** by grepping for `export const metadata` and confirming zero results outside of `buildMetadata` calls.

Goal: every public URL produces exactly one canonical tag. No exceptions.

---

### 3. Favicon

**Problem:** No favicon. Audit flags this as a usability failure. Low ranking impact, high perception impact.

**Fix — add to `src/app/layout.js`:**
```js
icons: {
  icon: '/logo.webp',
  apple: '/logo.webp',
},
```

`public/logo.webp` already exists. No asset conversion needed.

---

### 4. Alt Attributes on Images

**Problem:** Images without descriptive alt text lose image SEO signal and fail accessibility audits.

**Rule:**
- Descriptive + keyword-relevant: `alt="Kerala DA arrear calculation chart 2026"` ✓
- Generic: `alt="image"` or missing `alt` ✗
- Intentionally decorative: `alt=""` (explicit empty string) ✓

**Scope:** Grep `src/components/` and all page files for `<img` and `<Image` tags. Fix any missing or generic alt values.

---

## Phase 2 — Ranking SEO

### 5. Keyword Ownership Table

Each page owns exactly one primary keyword cluster. These must not overlap. The primary keyword must appear in: H1 (once), first 100 words of body, meta description, and title.

| Page | Primary Keyword | Notes |
|------|----------------|-------|
| / | Kerala government employees portal | Homepage — broad anchor |
| /da-arrear | DA arrear Kerala 2026 | Money page — highest traffic |
| /pension | Kerala pension rules calculator | Money page |
| /medisep | MEDISEP scheme Kerala | Money page |
| /retirement | Kerala government retirement calculator | Distinct from /pension |
| /income-tax | Kerala govt employee income tax 89(1) | Section 89(1) is high-intent |
| /nps | NPS Kerala government employees | NPS corpus/withdrawal |
| /nps-aps | APS pension Kerala | Distinct from /nps |
| /ksr | Kerala Service Rules KSR | Rule reference page |
| /dcrg | DCRG calculator Kerala | Distinct from /pension |
| /orders | Kerala government orders GO | GO downloads |
| /departmental-tests | Kerala departmental tests | Test prep |
| /gpf | GPF Kerala government employees | GPF rules |
| /forms | Kerala government service forms | Form downloads |

**H1 rule:** One H1 per page. Must contain the primary keyword. Decorative or brand H1s are not acceptable.

**Keyword conflict check:** Before implementation, verify no two pages in the table target overlapping terms. If conflict found, differentiate by intent (e.g., calculator vs rules page).

---

### 6. Internal Linking (highest-ROI ranking lever)

**Rule:** Every tool/calculator page must contain minimum 2 contextual internal links in body content. Nav links do not count.

**Priority link map:**

| Source page | Links to | Anchor text |
|-------------|----------|-------------|
| /da-arrear | /pension, /income-tax | "calculate your pension", "tax relief under Section 89(1)" |
| /pension | /retirement, /dcrg | "retirement date calculator", "calculate your DCRG" |
| /retirement | /pension, /nps | "Kerala pension rules", "NPS corpus calculator" |
| /dcrg | /pension, /retirement | "full pension calculator", "retirement date" |
| /income-tax | /da-arrear, /pension | "DA arrear impact on tax", "pension income tax" |
| /medisep | /orders, /forms | "MEDISEP government orders", "MEDISEP forms" |
| /nps | /nps-aps, /retirement | "APS pension option", "retirement calculator" |
| /ksr | /departmental-tests, /forms | "departmental test eligibility", "KSR forms" |

**Implementation:** Add a `RelatedLinks` component (reusable) that each tool page renders near its bottom. Component accepts an array of `{ href, label }` objects.

---

### 7. Schema Markup — Money Pages First

**Already correct — do not change:**
- `/da-arrear` — FAQPage + SoftwareApplication ✓
- `/pension` — FAQPage + SoftwareApplication ✓
- `/retirement` — FAQPage + SoftwareApplication ✓

**Add FAQPage schema (priority order):**

1. `/medisep` — eligibility, coverage, claim process, network hospitals
2. `/nps` — NPS vs pension, corpus withdrawal, annuity rules
3. `/income-tax` — Section 89(1), Form 10E, taxability of DA arrear
4. `/dcrg` — DCRG formula, maximum gratuity limit, payment rules
5. `/ksr` — service rules, leave eligibility, transfer rules

**Homepage:** `WebSite` + `Organization` JSON-LD already injected in `layout.js`. Verify it renders in page source before marking done.

---

## Success Criteria

**Phase 1 (Technical):**
- [ ] Root meta description 120–160 chars, CTR-focused English copy
- [ ] Root title ≤ 60 chars
- [ ] Zero pages with raw `export const metadata` (grep confirms)
- [ ] Every public URL has exactly one canonical tag from `buildMetadata`
- [ ] Favicon renders in browser tab
- [ ] Zero `<img>` or `<Image>` tags with missing or generic alt text

**Phase 2 (Ranking):**
- [ ] Every page in keyword table has primary keyword in H1 and first 100 words
- [ ] No two pages target overlapping primary keywords
- [ ] Every tool page has ≥ 2 contextual internal links in body content
- [ ] FAQPage schema added to /medisep, /nps, /income-tax, /dcrg, /ksr

---

## Out of Scope

- Link building (external — not code-fixable)
- Core Web Vitals / PageSpeed (separate performance task)
- Social profile creation (X, Facebook, Instagram, LinkedIn)
- DMARC / SPF mail records (DNS-level)
- HTTP/2 (server/CDN configuration)
