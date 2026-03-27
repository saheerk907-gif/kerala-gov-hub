# SEO On-Page & Ranking Design — keralaemployees.in
Date: 2026-03-27
Audit source: SEOptimer — overall grade D+

---

## Context

SEOptimer audit flagged 25 recommendations. This spec covers two phases:
- **Phase 1** — Technical On-Page SEO (meta, canonical, favicon, alt tags)
- **Phase 2** — Ranking SEO (keyword mapping, internal linking, schema)

The codebase is Next.js 14 App Router with a shared `buildMetadata()` helper (`src/lib/seo.js`).

---

## Phase 1 — Technical On-Page SEO

### 1. Meta Description & Title (root layout)

**Problem:** `src/app/layout.js` default description is 227 chars (limit: 160). Title is 65 chars (target: ≤60). Neither is CTR-optimised.

**Fix:**
```js
// src/app/layout.js
title: {
  default: 'Kerala Employees Portal – Salary, DA, Pension Updates',  // 54 chars
  template: '%s | Kerala Employees',
},
description: 'Latest Kerala govt employee updates: DA arrears, pension rules, MEDISEP, salary tools & calculators. Simple, accurate, updated.',
// Keep under 160 chars — do not exceed this limit
```

English-first description is intentional: helps search CTR. Malayalam content lives in the page body and OG fields where relevant.

**Rule for all pages:** Description must be 120–160 chars, title 50–60 chars. Add inline comment `// Keep meta description under 160 chars` in `seo.js` as convention guard.

---

### 2. Canonical Tags — Standardise ALL pages via buildMetadata

**Problem:** Root `layout.js` has no canonical. Several page files (forum, pay-scales, dcrg, nps-aps, experiences, etc.) export raw `metadata` objects without canonical.

**Strategy:** Do NOT patch pages individually. Standardise everything through `buildMetadata`.

**Fix `src/lib/seo.js`:**
- Ensure `buildMetadata` is the only canonical-setting pattern
- Add `path` as a required convention (already present but not enforced)

**Fix `src/app/layout.js`:**
```js
alternates: { canonical: 'https://keralaemployees.in' },
```

**Pages to migrate to buildMetadata (currently using raw metadata):**
- `src/app/pay-scales/layout.js`
- `src/app/forum/page.js`
- `src/app/dcrg/page.jsx` (layout already uses buildMetadata — check if page overrides)
- `src/app/contact/layout.js`
- `src/app/nps-aps/layout.js`
- `src/app/income-tax/page.js`
- `src/app/articles/layout.js`
- `src/app/pension-forms/layout.js`
- `src/app/forms/layout.js`
- `src/app/audio-classes/layout.js`
- `src/app/da-arrear/layout.js` (already uses buildMetadata — verify canonical output)
- Any remaining page files that export raw metadata without canonical

Goal: every public-facing URL has exactly one canonical tag, set by `buildMetadata`.

---

### 3. Favicon

**Problem:** No favicon in `/public`. Audit flags this as a usability failure.

**Fix:**
1. Use existing `public/logo.webp` directly — Next.js `icons` accepts `.webp`, no conversion needed
2. Add to `src/app/layout.js`:
```js
icons: {
  icon: '/logo.webp',
  apple: '/logo.webp',
},
```

---

### 4. Alt Attributes on Images

**Problem:** Some `<img>` tags and Next.js `<Image>` components likely lack descriptive alt text.

**Rule:**
- Every image must have a descriptive, keyword-relevant alt
- Good: `alt="Kerala DA arrear calculation chart 2026"`
- Bad: `alt="image"` or `alt=""`
- Decorative images: `alt=""` (empty string, intentional)

**Scope:** Scan all components in `src/components/` and page files for `<img>` and `<Image>` without alt or with generic alt.

---

## Phase 2 — Ranking SEO

### 5. Keyword Mapping per Page

Each page must have a primary keyword that appears in:
- H1 tag (one H1 only per page, must include primary keyword)
- First 100 words of body content
- Meta description
- Title tag

| Page | Primary Keyword |
|------|----------------|
| / (homepage) | Kerala government employees portal |
| /da-arrear | DA arrear Kerala 2026 |
| /pension | Kerala pension rules calculator |
| /medisep | MEDISEP scheme Kerala |
| /retirement | Kerala government retirement calculator |
| /income-tax | Kerala government employee income tax |
| /nps | NPS Kerala government employees |
| /nps-aps | APS pension Kerala |
| /ksr | Kerala Service Rules KSR |
| /dcrg | DCRG calculator Kerala |
| /orders | Kerala government orders |
| /departmental-tests | Kerala departmental tests |
| /gpf | GPF Kerala government employees |
| /forms | Kerala government service forms |

**H1 rule:** One H1 per page. Must contain primary keyword. No decorative or generic H1s.

---

### 6. Internal Linking

**Problem:** Pages are siloed. No cross-links between related tools and content.

**Strategy:** Add contextual internal links within page content, not just navigation.

**Priority link pairs:**
- DA Arrear page → link to Pension page ("calculate your pension")
- Pension page → link to Retirement Calculator, DCRG Calculator
- Retirement page → link to Pension, NPS pages
- Homepage tools section → each calculator page
- News/orders sections → relevant calculator or rule pages

**Implementation:** Add a `RelatedLinks` component or inline anchor tags in page body content near the bottom of each tool page.

---

### 7. Schema Markup

**Pages already with schema** (no action needed):
- `/da-arrear` — FAQPage + SoftwareApplication ✓
- `/pension` — FAQPage + SoftwareApplication ✓
- `/retirement` — FAQPage + SoftwareApplication ✓

**Pages needing FAQPage schema:**
- `/medisep` — add FAQ schema (scheme eligibility, coverage, claim process)
- `/nps` — add FAQ schema (NPS vs pension, corpus withdrawal)
- `/income-tax` — add FAQ schema (Section 89(1), Form 10E)
- `/ksr` — add FAQ schema (service rules, eligibility)
- `/dcrg` — add FAQ schema (DCRG formula, maximum limit)

**Homepage:** Add `WebSite` + `Organization` JSON-LD (already present in layout.js — verify it renders correctly).

---

## Success Criteria

- [ ] Root meta description ≤ 160 chars, CTR-focused
- [ ] Root title ≤ 60 chars
- [ ] Every public page has exactly one canonical URL
- [ ] Favicon visible in browser tab
- [ ] All images have descriptive alt text
- [ ] Each key page's H1 contains primary keyword
- [ ] Contextual internal links added to at least 5 key pages
- [ ] FAQPage schema added to at least 5 key pages not already covered

---

## Out of Scope

- Link building (external — not code-fixable)
- Core Web Vitals / PageSpeed optimisation (separate performance task)
- Social profile creation (X, Facebook, Instagram, LinkedIn)
- DMARC / SPF mail records (DNS-level)
- HTTP/2 (server/CDN configuration)
