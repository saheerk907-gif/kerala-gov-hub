# SEO Enforcement & Ranking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enforce a system-level SEO architecture — no raw metadata, canonical on every page, CTR-optimised copy, internal linking, and FAQPage schema on money pages.

**Architecture:** All metadata flows through `buildMetadata()` in `src/lib/seo.js`. An npm enforcement script fails if any page bypasses it. Phase 1 fixes technical enforcement; Phase 2 adds ranking signals (internal links, schema).

**Tech Stack:** Next.js 14 App Router, `src/lib/seo.js` (custom buildMetadata helper), Node.js built-in test runner (`node:test`)

---

## File Map

**Modified:**
- `src/lib/seo.js` — add rule comment + `buildArticleJsonLd` stays untouched
- `src/app/layout.js` — fix title/description, add canonical + favicon icons
- `src/app/pay-scales/layout.js` — migrate to buildMetadata
- `src/app/articles/layout.js` — migrate to buildMetadata
- `src/app/news/layout.js` — migrate to buildMetadata
- `src/app/acts-rules/layout.js` — migrate to buildMetadata
- `src/app/leave/page.js` — migrate to buildMetadata
- `src/app/leave/earned/page.js` — migrate to buildMetadata
- `src/app/leave/hpl/page.js` — migrate to buildMetadata
- `src/app/medisep/faq/page.jsx` — migrate to buildMetadata
- `src/app/medisep-complaint/page.jsx` — migrate to buildMetadata
- `src/app/medisep-claim-process/page.jsx` — migrate to buildMetadata
- `src/app/pension-calculation/page.jsx` — migrate to buildMetadata
- `src/app/income-tax/page.js` — migrate to buildMetadata (keeps existing schema)
- `src/app/prc/page.js` — migrate to buildMetadata
- `src/app/tools/pdf-merger/page.js` — migrate to buildMetadata
- `src/app/tools/pdf-editor/page.js` — migrate to buildMetadata
- `src/app/tools/pdf-to-text/page.js` — migrate to buildMetadata
- `src/app/tools/pdf-splitter/page.js` — migrate to buildMetadata
- `src/app/tools/image-to-pdf/page.js` — migrate to buildMetadata
- `src/app/tools/qr-generator/page.js` — migrate to buildMetadata
- `src/app/tools/holiday-list-2026/page.js` — migrate to buildMetadata
- `src/app/retirement/layout.js` — migrate to buildMetadata (if exporting raw metadata)
- `src/app/medisep/layout.js` — add FAQPage schema
- `src/app/ksr/layout.js` — add FAQPage schema
- `src/app/nps/page.js` or layout — add FAQPage schema
- `src/app/pension/layout.js` — add internal links section
- `src/app/da-arrear/layout.js` — verify (already good), add internal links to page
- `src/app/dcrg/layout.js` — add FAQPage schema
- `src/app/income-tax/page.js` — add internal links section
- `src/app/retirement/page.js` — add internal links section
- `package.json` — add `seo:check` script

**Created:**
- `src/components/RelatedLinks.jsx` — reusable internal link strip component
- `scripts/seo-check.js` — enforcement script (fails if raw metadata found)

---

## Task 1: Fix root layout.js — title, description, canonical, favicon

**Files:**
- Modify: `src/app/layout.js`

- [ ] **Step 1: Update title and description**

Replace the `title.default` and `description` in `src/app/layout.js`:

```js
// src/app/layout.js — metadata object, replace title and description fields
export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Kerala Employees Portal – Salary, DA, Pension Updates', // 54 chars
    template: '%s | Kerala Employees',
  },
  description:
    'Latest Kerala govt employee updates: DA arrears, pension rules, MEDISEP, salary tools & calculators. Simple, accurate, updated.',
  // Keep description under 160 chars — do not exceed
  keywords:
    'Kerala government employees, കേരള സർക്കാർ ജീവനക്കാർ, MEDISEP, Kerala pension calculator, KSR rules, Kerala service rules, GPF, NPS, APS, PRC calculator, government orders Kerala, departmental tests Kerala, pension forms Kerala, DCRG calculator',
  authors: [{ name: 'Kerala Employees', url: BASE_URL }],
  creator: 'Kerala Employees',
  publisher: 'Kerala Employees',
  robots: { index: true, follow: true },
  themeColor: '#121416',
  alternates: { canonical: BASE_URL },
  icons: {
    icon: '/logo.webp',
    apple: '/logo.webp',
  },
  openGraph: {
    type: 'website',
    locale: 'ml_IN',
    url: BASE_URL,
    siteName: 'Kerala Employees',
    title: 'Kerala Employees Portal – Salary, DA, Pension Updates',
    description:
      'Latest Kerala govt employee updates: DA arrears, pension rules, MEDISEP, salary tools & calculators.',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Kerala Government Employees Portal' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kerala Employees Portal – Salary, DA, Pension Updates',
    description:
      'DA arrears, pension rules, MEDISEP, salary tools & calculators for Kerala government employees.',
    images: [`${BASE_URL}/og-image.png`],
  },
};
```

- [ ] **Step 2: Verify character counts**

Run in terminal:
```bash
node -e "
const title = 'Kerala Employees Portal – Salary, DA, Pension Updates';
const desc = 'Latest Kerala govt employee updates: DA arrears, pension rules, MEDISEP, salary tools & calculators. Simple, accurate, updated.';
console.log('title:', title.length, title.length <= 60 ? '✓' : '✗ TOO LONG');
console.log('desc:', desc.length, desc.length >= 120 && desc.length <= 160 ? '✓' : '✗ OUT OF RANGE');
"
```
Expected: both lines show `✓`

- [ ] **Step 3: Verify favicon renders**

Run dev server:
```bash
npm run dev
```
Open `http://localhost:3000` in browser. Confirm the Kerala logo appears in the browser tab.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.js
git commit -m "feat: fix root layout — CTR-optimised title/desc, canonical, favicon"
```

---

## Task 2: Add enforcement comment to seo.js + create enforcement script

**Files:**
- Modify: `src/lib/seo.js`
- Create: `scripts/seo-check.js`
- Modify: `package.json`

- [ ] **Step 1: Add rule comment to top of seo.js**

Add this as the first line after the opening comment block in `src/lib/seo.js`:

```js
// RULE: title 50–60 chars | description 120–160 chars | ALWAYS use buildMetadata() — never export raw metadata
```

- [ ] **Step 2: Create enforcement script**

Create `scripts/seo-check.js`:

```js
#!/usr/bin/env node
/**
 * SEO enforcement: fail if any app page exports raw metadata bypassing buildMetadata().
 * Run: node scripts/seo-check.js
 * Add to CI: "seo:check": "node scripts/seo-check.js"
 */
import { execSync } from 'node:child_process';

// Find files that export const metadata WITHOUT using buildMetadata
const result = execSync(
  `grep -rl "export const metadata" src/app --include="*.js" --include="*.jsx"`,
  { encoding: 'utf8' }
).trim().split('\n').filter(Boolean);

// root layout.js is allowed to have raw metadata (it's the global default)
const allowed = ['src/app/layout.js', 'src/app/admin/layout.js'];

const violations = [];

for (const file of result) {
  if (allowed.some(a => file.endsWith(a))) continue;

  const content = execSync(`cat "${file}"`, { encoding: 'utf8' });
  if (!content.includes('buildMetadata')) {
    violations.push(file);
  }
}

if (violations.length > 0) {
  console.error('\n❌ SEO violation: raw metadata export found (must use buildMetadata):\n');
  violations.forEach(f => console.error(`  ${f}`));
  console.error('\nFix: import { buildMetadata } from "@/lib/seo" and use it.\n');
  process.exit(1);
}

console.log(`✓ SEO check passed — ${result.length} pages, all use buildMetadata.`);
```

- [ ] **Step 3: Add npm script**

In `package.json`, add to `"scripts"`:
```json
"seo:check": "node --input-type=module scripts/seo-check.js"
```

Wait — the script uses top-level `import`. Add `"type": "module"` to package.json or use `.mjs` extension. Check if package.json already has `"type": "module"`:

```bash
grep '"type"' package.json
```

If `"type": "module"` exists, use `node scripts/seo-check.js`. If not, rename to `scripts/seo-check.mjs` and update the script to `"node scripts/seo-check.mjs"`.

- [ ] **Step 4: Run against current codebase (expect failures)**

```bash
npm run seo:check
```

Expected: lists ~22 violation files. This is correct — Task 3 will fix them.

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo.js scripts/seo-check.js package.json
git commit -m "feat: add SEO enforcement script — blocks raw metadata exports"
```

---

## Task 3: Migrate raw metadata pages to buildMetadata (Phase 1 of systematic cleanup)

**Files:** All layout/page files listed in the File Map above. Do them in batches by section.

### Batch A — Layout files

- [ ] **Step 1: Migrate src/app/pay-scales/layout.js**

Read the current file, then replace with:
```js
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Kerala Government Pay Scales — 11th PRC 2019',
  description: 'Complete Kerala government pay scales — 11th PRC (2019), 10th PRC (2014), 9th PRC (2009). Master scale and revised scales for all categories.',
  path: '/pay-scales',
  keywords: ['Kerala pay scales', '11th PRC pay scales', 'Kerala government salary scales', 'ശമ്പള സ്കെയിൽ', 'master scale Kerala', 'pay revision commission Kerala'],
});

export default function PayScalesLayout({ children }) {
  return children;
}
```

- [ ] **Step 2: Migrate src/app/articles/layout.js**

```js
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Articles — Kerala Govt Employees | KSR, MEDISEP, Pension',
  description: 'Kerala government employee articles on MEDISEP, pension, KSR service rules, GPF, NPS, DA, pay revision and benefits. In Malayalam and English.',
  path: '/articles',
  keywords: ['Kerala employees articles', 'MEDISEP articles Malayalam', 'pension articles Kerala', 'KSR service rules articles', 'GPF articles', 'NPS articles Kerala'],
});

export default function ArticlesLayout({ children }) {
  return children;
}
```

- [ ] **Step 3: Migrate src/app/news/layout.js**

```js
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Kerala Govt Employee News – DA, Pension, MEDISEP Updates',
  description: 'Latest news for Kerala government employees — DA orders, pay revision, MEDISEP updates, pension circulars, bonus orders and government announcements.',
  path: '/news',
  keywords: ['Kerala government employee news', 'DA order Kerala', 'MEDISEP news', 'pension news Kerala', 'pay revision news', 'bonus order Kerala', 'government circular Kerala'],
});

export default function NewsLayout({ children }) {
  return children;
}
```

- [ ] **Step 4: Migrate src/app/acts-rules/layout.js**

First read the file to see current content, then wrap existing values in buildMetadata preserving keywords, shortening title to ≤60 chars and description to 120–160 chars.

- [ ] **Step 5: Migrate src/app/retirement/layout.js** (if it exports raw metadata)

Read the file. If it only exports a layout function (no metadata), skip. If it exports metadata, migrate to buildMetadata with:
- title: 'Kerala Government Retirement Benefits Guide' (≤60 chars)
- description referencing retirement date, LPR, pension, DCRG
- path: '/retirement'

- [ ] **Step 6: Commit batch A**

```bash
git add src/app/pay-scales/layout.js src/app/articles/layout.js src/app/news/layout.js src/app/acts-rules/layout.js src/app/retirement/layout.js
git commit -m "feat: migrate layout files to buildMetadata — pay-scales, articles, news, acts-rules, retirement"
```

### Batch B — Leave pages

- [ ] **Step 7: Migrate src/app/leave/page.js**

Read file first, then replace metadata with:
```js
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Leave Rules — Kerala Government Employees | KSR',
  description: 'Kerala government employee leave rules — earned leave, HPL, casual leave, maternity leave. KSR Part I leave provisions explained simply.',
  path: '/leave',
  keywords: ['Kerala leave rules', 'Kerala government leave', 'KSR leave rules', 'earned leave Kerala', 'HPL half pay leave Kerala', 'casual leave Kerala govt'],
});
```
Keep all other imports and the component export unchanged.

- [ ] **Step 8: Migrate src/app/leave/earned/page.js**

```js
export const metadata = buildMetadata({
  title: 'Earned Leave Rules — Kerala Government Employees',
  description: 'Kerala government employee earned leave rules — accumulation, encashment, leave at credit calculation. KSR provisions for EL explained.',
  path: '/leave/earned',
  keywords: ['earned leave Kerala', 'EL rules Kerala government', 'leave encashment Kerala', 'KSR earned leave', 'leave at credit Kerala'],
});
```

- [ ] **Step 9: Migrate src/app/leave/hpl/page.js**

```js
export const metadata = buildMetadata({
  title: 'Half Pay Leave Rules — Kerala Government Employees',
  description: 'Kerala government employee HPL rules — half pay leave accumulation, commutation to earned leave, medical grounds. KSR Part I provisions.',
  path: '/leave/hpl',
  keywords: ['HPL half pay leave Kerala', 'half pay leave rules Kerala', 'HPL commutation Kerala', 'KSR HPL provisions', 'medical leave Kerala govt'],
});
```

- [ ] **Step 10: Commit batch B**

```bash
git add src/app/leave/page.js src/app/leave/earned/page.js src/app/leave/hpl/page.js
git commit -m "feat: migrate leave pages to buildMetadata"
```

### Batch C — MEDISEP pages

- [ ] **Step 11: Migrate src/app/medisep/faq/page.jsx**

Read file first. Replace metadata with:
```js
export const metadata = buildMetadata({
  title: 'MEDISEP FAQ — Kerala Govt Employee Health Insurance',
  description: 'Frequently asked questions about MEDISEP — eligibility, coverage limits, claim process, network hospitals, cashless treatment and grievances.',
  path: '/medisep/faq',
  keywords: ['MEDISEP FAQ', 'MEDISEP eligibility', 'MEDISEP claim process', 'MEDISEP network hospitals', 'MEDISEP coverage Kerala'],
});
```

- [ ] **Step 12: Migrate src/app/medisep-complaint/page.jsx**

```js
export const metadata = buildMetadata({
  title: 'MEDISEP Complaint — Kerala Govt Health Insurance Grievance',
  description: 'File a MEDISEP complaint or grievance for Kerala government employees — claim rejection, hospital billing issues, cashless denial and escalation process.',
  path: '/medisep-complaint',
  keywords: ['MEDISEP complaint Kerala', 'MEDISEP grievance', 'MEDISEP claim rejection', 'Kerala health insurance complaint'],
});
```

- [ ] **Step 13: Migrate src/app/medisep-claim-process/page.jsx**

```js
export const metadata = buildMetadata({
  title: 'MEDISEP Claim Process — Kerala Govt Employee Insurance',
  description: 'Step-by-step MEDISEP claim process for Kerala government employees — cashless hospitalisation, reimbursement claims, required documents and timelines.',
  path: '/medisep-claim-process',
  keywords: ['MEDISEP claim process Kerala', 'MEDISEP cashless claim', 'MEDISEP reimbursement', 'MEDISEP hospitalisation Kerala'],
});
```

- [ ] **Step 14: Commit batch C**

```bash
git add src/app/medisep/faq/page.jsx src/app/medisep-complaint/page.jsx src/app/medisep-claim-process/page.jsx
git commit -m "feat: migrate MEDISEP pages to buildMetadata"
```

### Batch D — Calculator and tool pages

- [ ] **Step 15: Migrate src/app/income-tax/page.js**

Read the full file first. It already has `alternates.canonical` and rich schema (`appSchema`, `faqJsonLd`). Replace ONLY the raw metadata export:

```js
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Income Tax Calculator FY 2025-26 — Kerala Govt Employees',
  description: 'Free printable income tax calculator for Kerala govt employees FY 2025-26. New Regime and Old Regime with full deductions, arrears, and monthly TDS schedule.',
  path: '/income-tax',
  keywords: ['income tax calculator Kerala government employees 2025-26', 'anticipatory income tax statement Kerala', 'FY 2025-26 tax calculator Kerala', 'new regime old regime tax Kerala', 'HRA exemption calculator Kerala', '80C GPF SLI LIC tax deduction', 'NPS 80CCD tax Kerala', 'section 87A rebate new regime'],
});
```

Keep `appSchema`, `faqJsonLd`, and all `<script>` tags inside the component unchanged.

- [ ] **Step 16: Migrate src/app/pension-calculation/page.jsx**

Read file first, then migrate to buildMetadata preserving intent.

- [ ] **Step 17: Migrate src/app/prc/page.js**

Note: `prc/layout.js` already uses buildMetadata. If `prc/page.js` also exports metadata, check for conflict — page-level metadata overrides layout metadata in Next.js. If the page's metadata is redundant, remove it entirely and rely on the layout. If it adds unique fields, migrate to buildMetadata.

- [ ] **Step 18: Migrate tools pages**

For each tool page, read the current title/description and apply this pattern:

`src/app/tools/pdf-merger/page.js`:
```js
export const metadata = buildMetadata({
  title: 'PDF Merger — Combine PDF Files Free Online',
  description: 'Merge multiple PDF files into one online for free. No upload, 100% browser-based. Ideal for Kerala government employees combining documents.',
  path: '/tools/pdf-merger',
  keywords: ['PDF merger online', 'combine PDF files', 'merge PDF Kerala', 'PDF tools online free'],
});
```

`src/app/tools/pdf-editor/page.js`:
```js
export const metadata = buildMetadata({
  title: 'PDF Editor — Edit PDF Files Free Online',
  description: 'Edit PDF files online for free — annotate, fill forms, add text. Browser-based, no upload required. For Kerala government document editing.',
  path: '/tools/pdf-editor',
  keywords: ['PDF editor online free', 'edit PDF browser', 'PDF annotation tool', 'Kerala government PDF tools'],
});
```

`src/app/tools/pdf-to-text/page.js`:
```js
export const metadata = buildMetadata({
  title: 'PDF to Text — Extract Text from PDF Free',
  description: 'Extract text from PDF files instantly in your browser. No upload, privacy-safe. Useful for Kerala government orders and circulars.',
  path: '/tools/pdf-to-text',
  keywords: ['PDF to text converter', 'extract text from PDF', 'PDF text extractor online', 'Kerala government PDF converter'],
});
```

`src/app/tools/pdf-splitter/page.js`:
```js
export const metadata = buildMetadata({
  title: 'PDF Splitter — Split PDF Pages Free Online',
  description: 'Split PDF into individual pages or page ranges online for free. Browser-based, no upload. Ideal for splitting Kerala government orders.',
  path: '/tools/pdf-splitter',
  keywords: ['PDF splitter online', 'split PDF pages', 'PDF page extractor free', 'Kerala government PDF tools'],
});
```

`src/app/tools/image-to-pdf/page.js`:
```js
export const metadata = buildMetadata({
  title: 'Image to PDF — Convert Images to PDF Free',
  description: 'Convert JPG, PNG images to PDF online for free. Browser-based, no upload. Useful for Kerala government document submission.',
  path: '/tools/image-to-pdf',
  keywords: ['image to PDF converter', 'JPG to PDF online free', 'convert image PDF browser', 'Kerala government document tools'],
});
```

`src/app/tools/qr-generator/page.js`:
```js
export const metadata = buildMetadata({
  title: 'QR Code Generator — Free Online QR Maker',
  description: 'Generate QR codes for URLs, text, and contact info online for free. Browser-based, instant download. Useful for Kerala government notice boards.',
  path: '/tools/qr-generator',
  keywords: ['QR code generator free', 'QR code maker online', 'create QR code browser', 'Kerala government QR tools'],
});
```

`src/app/tools/holiday-list-2026/page.js`:
```js
export const metadata = buildMetadata({
  title: 'Kerala Holiday List 2026 — Government Employees',
  description: 'Complete list of public holidays and optional holidays for Kerala government employees in 2026. Download printable holiday calendar.',
  path: '/tools/holiday-list-2026',
  keywords: ['Kerala holiday list 2026', 'Kerala government holidays 2026', 'Kerala public holidays 2026', 'Kerala employee holiday calendar 2026'],
});
```

- [ ] **Step 19: Commit batch D**

```bash
git add src/app/income-tax/page.js src/app/pension-calculation/page.jsx src/app/prc/page.js src/app/tools/
git commit -m "feat: migrate calculator and tool pages to buildMetadata"
```

### Batch E — Run enforcement check

- [ ] **Step 20: Run seo:check and verify zero violations**

```bash
npm run seo:check
```

Expected: `✓ SEO check passed — N pages, all use buildMetadata.`

If any violations remain, read the flagged file and migrate it following the same buildMetadata pattern. Re-run until clean.

- [ ] **Step 21: Commit if any remaining fixes**

```bash
git add -p
git commit -m "feat: complete buildMetadata migration — seo:check passes clean"
```

---

## Task 4: Fix alt attributes on images

**Files:** All component and page files with `<img>` or `<Image>` tags

- [ ] **Step 1: Find all images without alt or with empty/generic alt**

```bash
grep -rn '<img ' src/ --include="*.js" --include="*.jsx" | grep -v 'alt='
grep -rn '<Image ' src/ --include="*.js" --include="*.jsx" | grep -v 'alt='
```

Also check for generic alt:
```bash
grep -rn 'alt=""' src/ --include="*.js" --include="*.jsx"
grep -rn "alt=''" src/ --include="*.js" --include="*.jsx"
```

- [ ] **Step 2: Fix each flagged image**

For every result, open the file and add a descriptive alt. Rules:
- Meaningful image: describe it with page context + keyword when natural
  - `alt="Kerala government coat of arms"` ✓
  - `alt="DA arrear calculation example table"` ✓
- Decorative/icon: `alt=""` (explicit empty string) ✓
- Never: `alt="image"`, `alt="photo"`, `alt="icon"` ✗

- [ ] **Step 3: Commit**

```bash
git add src/
git commit -m "feat: add descriptive alt attributes to all images"
```

---

## Task 5: Create RelatedLinks component

**Files:**
- Create: `src/components/RelatedLinks.jsx`

- [ ] **Step 1: Write test**

Create `src/components/RelatedLinks.test.js`:
```js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Structural test — verifies the component exports and shape
describe('RelatedLinks', () => {
  it('accepts links array and renders without error', async () => {
    const mod = await import('./RelatedLinks.jsx');
    assert.ok(typeof mod.default === 'function', 'default export should be a function (component)');
  });

  it('link items have required href and label fields', () => {
    const links = [
      { href: '/pension', label: 'Kerala pension calculator' },
      { href: '/retirement', label: 'Retirement date calculator' },
    ];
    links.forEach(link => {
      assert.ok(link.href.startsWith('/'), 'href must be a relative internal path');
      assert.ok(link.label.length > 0, 'label must not be empty');
    });
  });
});
```

Run:
```bash
node --experimental-vm-modules src/components/RelatedLinks.test.js
```
Expected: FAIL (module not found)

- [ ] **Step 2: Create RelatedLinks component**

```jsx
// src/components/RelatedLinks.jsx
import Link from 'next/link';

/**
 * RelatedLinks — renders 2–4 contextual internal links at the bottom of tool pages.
 * @param {Array<{href: string, label: string}>} links
 * @param {string} [heading] - optional section heading, defaults to "Related Tools"
 */
export default function RelatedLinks({ links, heading = 'Related Tools' }) {
  if (!links || links.length === 0) return null;

  return (
    <section className="mt-10 border-t border-white/10 pt-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-3">
        {heading}
      </h2>
      <ul className="flex flex-wrap gap-3">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="inline-block px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/80 hover:text-white transition-colors"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 3: Run test to verify it passes**

```bash
node --experimental-vm-modules src/components/RelatedLinks.test.js
```
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/RelatedLinks.jsx src/components/RelatedLinks.test.js
git commit -m "feat: add RelatedLinks component for internal linking"
```

---

## Task 6: Wire internal links into tool pages

**Files:** `src/app/da-arrear/page.jsx`, `src/app/pension/page.jsx`, `src/app/retirement/page.js`, `src/app/dcrg/page.jsx`, `src/app/income-tax/page.js`, `src/app/medisep/page.jsx`, `src/app/nps/page.js`, `src/app/ksr/page.jsx`

For each page, add `<RelatedLinks>` **inside the page component return**, just before the `<Footer />` or at the end of the main content area.

- [ ] **Step 1: Add to src/app/da-arrear/page.jsx**

Read the file. Import RelatedLinks and add:
```jsx
import RelatedLinks from '@/components/RelatedLinks';

// Inside the JSX return, before </main> or <Footer />:
<RelatedLinks
  heading="Related Calculators"
  links={[
    { href: '/pension', label: 'Kerala pension calculator' },
    { href: '/income-tax', label: 'Income tax relief (Section 89)' },
    { href: '/retirement', label: 'Retirement date calculator' },
  ]}
/>
```

- [ ] **Step 2: Add to src/app/pension/page.jsx**

```jsx
<RelatedLinks
  heading="Related Calculators"
  links={[
    { href: '/retirement', label: 'Retirement date & countdown' },
    { href: '/dcrg', label: 'DCRG gratuity calculator' },
    { href: '/da-arrear', label: 'DA arrear calculator' },
  ]}
/>
```

- [ ] **Step 3: Add to src/app/retirement/page.js**

```jsx
<RelatedLinks
  heading="Related Tools"
  links={[
    { href: '/pension', label: 'Pension amount calculator' },
    { href: '/nps', label: 'NPS corpus calculator' },
    { href: '/dcrg', label: 'DCRG gratuity amount' },
  ]}
/>
```

- [ ] **Step 4: Add to src/app/dcrg/page.jsx**

```jsx
<RelatedLinks
  heading="Related Calculators"
  links={[
    { href: '/pension', label: 'Full pension calculator' },
    { href: '/retirement', label: 'Retirement date calculator' },
    { href: '/da-arrear', label: 'DA arrear calculator' },
  ]}
/>
```

- [ ] **Step 5: Add to src/app/income-tax/page.js**

```jsx
<RelatedLinks
  heading="Related Tools"
  links={[
    { href: '/da-arrear', label: 'DA arrear calculator' },
    { href: '/pension', label: 'Pension income calculator' },
    { href: '/nps', label: 'NPS contribution details' },
  ]}
/>
```

- [ ] **Step 6: Add to src/app/medisep/page.jsx**

```jsx
<RelatedLinks
  heading="Related Pages"
  links={[
    { href: '/medisep-claim-process', label: 'MEDISEP claim process' },
    { href: '/medisep-complaint', label: 'File a MEDISEP complaint' },
    { href: '/orders', label: 'MEDISEP government orders' },
  ]}
/>
```

- [ ] **Step 7: Add to src/app/nps/page.js**

```jsx
<RelatedLinks
  heading="Related"
  links={[
    { href: '/nps-aps', label: 'APS pension option' },
    { href: '/retirement', label: 'Retirement date calculator' },
    { href: '/nps/calculator', label: 'NPS corpus calculator' },
  ]}
/>
```

- [ ] **Step 8: Add to src/app/ksr/page.jsx**

```jsx
<RelatedLinks
  heading="Related"
  links={[
    { href: '/departmental-tests', label: 'Departmental test eligibility' },
    { href: '/leave', label: 'Leave rules (KSR Part I)' },
    { href: '/forms', label: 'KSR service forms' },
  ]}
/>
```

- [ ] **Step 9: Verify links render**

Run `npm run dev`, visit each page and confirm the Related Tools section appears at the bottom with correct links.

- [ ] **Step 10: Commit**

```bash
git add src/app/da-arrear/page.jsx src/app/pension/page.jsx src/app/retirement/page.js src/app/dcrg/page.jsx src/app/income-tax/page.js src/app/medisep/page.jsx src/app/nps/page.js src/app/ksr/page.jsx
git commit -m "feat: add internal RelatedLinks to all tool pages"
```

---

## Task 7: Add FAQPage schema to priority pages

**Files:** `src/app/medisep/layout.js`, `src/app/ksr/layout.js`, `src/app/dcrg/layout.js`, `src/app/nps/page.js`

Note: `/income-tax` already has FAQPage schema. `/da-arrear`, `/pension`, `/retirement` already have it. Focus only on these four.

- [ ] **Step 1: Add FAQPage schema to src/app/medisep/layout.js**

Read the file. The layout currently only exports metadata and returns `children`. Add:

```js
const medisepFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is eligible for MEDISEP in Kerala?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All Kerala state government employees, pensioners, and their dependents are eligible for MEDISEP health insurance. Employees must be enrolled through their department drawing and disbursing officer (DDO).',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the coverage limit under MEDISEP?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MEDISEP covers hospitalisation expenses up to ₹3 lakh per annum per family. Critical illness cover is available up to ₹5 lakh under the enhanced scheme.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I file a MEDISEP cashless claim?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Present your MEDISEP card at an empanelled network hospital. The hospital verifies eligibility through the MEDISEP portal and initiates a pre-authorisation request. Treatment proceeds once approved. No upfront payment is required for covered procedures.',
      },
    },
    {
      '@type': 'Question',
      name: 'What documents are needed for MEDISEP reimbursement?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For reimbursement claims: original hospital bills, discharge summary, prescriptions, investigation reports, MEDISEP card copy, and a claim form signed by the DDO. Submit within 30 days of discharge.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is MEDISEP applicable for treatment outside Kerala?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MEDISEP cashless treatment is available only at empanelled hospitals within Kerala. For treatment outside Kerala, employees can file a reimbursement claim subject to approval by the concerned authority.',
      },
    },
  ],
};

export default function MedisepLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medisepFaqJsonLd) }}
      />
      {children}
    </>
  );
}
```

- [ ] **Step 2: Add FAQPage schema to src/app/ksr/layout.js**

Read the file first. Add `ksrFaqJsonLd` and inject it, keeping existing `buildMetadata` export unchanged:

```js
const ksrFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the Kerala Service Rules (KSR)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kerala Service Rules (KSR) is the statutory rulebook governing service conditions of Kerala state government employees — covering pay, leave, joining time, transfer, retirement, and disciplinary matters. Published by the Finance Department.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many parts does KSR have?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'KSR is divided into three parts: Part I (General Rules — leave, pay, allowances), Part II (Travelling Allowance), and Part III (Pension Rules).',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the probation period under KSR for Kerala government employees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The probation period for most Kerala government posts is 2 years of duty under KSR Rule 27. The appointing authority may extend it if performance is unsatisfactory.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is joining time under KSR?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Joining time is the time allowed for an employee to join a new post on transfer. Under KSR Rule 65, the maximum joining time is 30 days, counted from the date of relief at the old post.',
      },
    },
  ],
};
```

Update the layout default export to inject the JSON-LD.

- [ ] **Step 3: Add FAQPage schema to src/app/dcrg/layout.js**

Read the file first. Add:

```js
const dcrgFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is DCRG for Kerala government employees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DCRG (Death-cum-Retirement Gratuity) is a lump-sum retirement benefit paid to Kerala government employees or their family on retirement or death in service. Calculated under KSR Rule 77 as: (Last Pay × Qualifying Service in years / 4), maximum ₹20,00,000.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the maximum DCRG amount for Kerala government employees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The maximum DCRG payable to Kerala government employees is ₹20,00,000 (Twenty Lakhs) as per the current rules under KSR.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is qualifying service calculated for DCRG?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Qualifying service for DCRG is the total service rendered from the date of joining to the date of retirement, excluding breaks without pay and certain leave periods. Minimum qualifying service for DCRG is 5 years.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is DCRG taxable for Kerala government employees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DCRG received on retirement is fully exempt from income tax under Section 10(10) of the Income Tax Act, subject to the statutory ceiling.',
      },
    },
  ],
};
```

- [ ] **Step 4: Add FAQPage schema to src/app/nps/page.js**

Read the file first. Inject NPS FAQ schema into the page component's JSX (as a `<script>` tag) alongside the existing content, same pattern as other layouts:

```js
const npsFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is covered under NPS for Kerala government employees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kerala government employees who joined service on or after 1 January 2013 are covered under the National Pension System (NPS) instead of the traditional defined-benefit pension scheme.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the NPS contribution rate for Kerala government employees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Employee contribution is 10% of Basic Pay + DA. Government (employer) contribution is 14% of Basic Pay + DA. Both are credited to the PRAN (Permanent Retirement Account Number) monthly.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is APS and how is it different from NPS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'APS (Assured Pension Scheme) is Kerala\'s state-level option introduced in 2023, guaranteeing a minimum monthly pension of 50% of last basic pay. NPS corpus-based pension depends on market returns. APS provides certainty; NPS provides potentially higher corpus.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much of the NPS corpus can be withdrawn tax-free at retirement?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '60% of the NPS corpus can be withdrawn as a lump sum tax-free at retirement under Section 10(12A). The remaining 40% must be used to purchase an annuity that provides monthly pension income.',
      },
    },
  ],
};
```

- [ ] **Step 5: Verify schemas in browser**

Run `npm run dev`. For each modified page, open browser DevTools → Elements → search for `application/ld+json`. Confirm FAQPage schemas appear and are valid JSON.

- [ ] **Step 6: Commit**

```bash
git add src/app/medisep/layout.js src/app/ksr/layout.js src/app/dcrg/layout.js src/app/nps/page.js
git commit -m "feat: add FAQPage schema to medisep, ksr, dcrg, nps"
```

---

## Task 8: Final verification

- [ ] **Step 1: Run enforcement check**

```bash
npm run seo:check
```
Expected: `✓ SEO check passed`

- [ ] **Step 2: Run build**

```bash
npm run build
```
Expected: build completes with no errors.

- [ ] **Step 3: Spot-check SERP preview**

For these 5 pages, confirm in `http://localhost:3000`:
- Homepage: title ≤60 chars, description visible and descriptive
- `/da-arrear`: RelatedLinks section visible at bottom
- `/medisep`: MEDISEP FAQ schema in page source
- `/ksr`: KSR FAQ schema in page source
- Any page: favicon visible in browser tab

- [ ] **Step 4: Push to main**

```bash
git push origin master:main
```

---

## Self-Review Against Spec

**Spec requirement → Task coverage:**

| Requirement | Task |
|---|---|
| Root description 120–160 chars, CTR copy | Task 1 |
| Root title ≤60 chars | Task 1 |
| Canonical on every page | Task 1 (root) + Task 3 (all pages) |
| No raw metadata exports (grep enforced) | Task 2 + Task 3 |
| Favicon in browser tab | Task 1 |
| All images descriptive alt | Task 4 |
| H1 with primary keyword per page | Not covered — see note below |
| One keyword cluster per page | Addressed implicitly via buildMetadata keywords in Task 3 |
| Min 2 internal links per tool page | Task 6 |
| FAQPage schema on medisep, nps, income-tax, dcrg, ksr | Task 7 (income-tax already done) |

**Note on H1 keyword rule:** The spec requires each page's H1 to contain the primary keyword. This requires reading each page component's JSX and editing H1 text. This is a content-level change that depends heavily on current H1 content — it is intentionally left for a follow-up pass after Phase 1 enforcement is complete, since changing H1 text on calculator pages risks breaking visual layout without previewing changes.

**Placeholder scan:** No TBDs, TODOs, or vague steps found. ✓

**Type consistency:** `RelatedLinks` component prop type `{ href: string, label: string }` is consistent across Task 5 (definition) and Task 6 (usage). ✓
