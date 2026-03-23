# Pension & Retirement Page Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve SEO by converting the pension page to a server component with bilingual content, and adding server-rendered content sections to the retirement page — both with schema markup.

**Architecture:** The pension page's calculator logic is extracted into a separate `'use client'` component so the page wrapper can become a server component, allowing intro text and FAQs to be indexed by Google. The retirement page is already a server component; content sections are added additively. Static FAQ HTML (not the `FAQSection` accordion) is used for crawler visibility. Schema is injected via `layout.js` files using `<script dangerouslySetInnerHTML>` — the existing pension pattern.

**Tech Stack:** Next.js 14 App Router, React 18, Tailwind CSS, CSS custom properties (`var(--surface-xs)` etc.)

**Spec:** `docs/superpowers/specs/2026-03-23-pension-retirement-rebuild-design.md`

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/components/PensionCalculator.jsx` | **Create** | Client component — all calculator logic/UI extracted from pension page |
| `src/app/pension/page.jsx` | **Rewrite** | Server component — breadcrumb, H1, bilingual intro, `<PensionCalculator />`, example block, link cards, static FAQ |
| `src/app/pension/layout.js` | **Modify** | Add 6th FAQ to schema, add `SoftwareApplication` JSON-LD, update metadata title |
| `src/app/retirement/page.js` | **Modify** | Add H1, intro, benefits grid, link card, static FAQ sections around existing calculator |
| `src/app/retirement/layout.js` | **Create** | Move metadata from page.js, add `SoftwareApplication` + `FAQPage` JSON-LD |

---

## Task 1: Extract PensionCalculator client component

**Files:**
- Create: `src/components/PensionCalculator.jsx`
- Read: `src/app/pension/page.jsx` (source of truth)

- [ ] **Step 1: Create `src/components/PensionCalculator.jsx`**

  Copy everything from the current `src/app/pension/page.jsx` **except** the `PENSION_FAQS` array and the `<FAQSection />` import/usage. The new file is a `'use client'` component that exports the calculator as its default export. Rename the default export from `PensionPage` to `PensionCalculator`.

  The file should contain exactly:
  - `'use client';` at the top
  - All imports (`useState`, `useEffect`, `useCallback`, `Link`)
  - `lastDayOfMonth`, `getRetirementDate`, `getRestoreDate`, `fmtDate` helper functions
  - `COMMUTATION_FACTOR` constant
  - `calculate()` function
  - `GLASS`, `inputClass` style constants
  - `Label`, `Field`, `OutputField` UI atom components
  - `DAYS`, `MONTHS`, `YEARS` arrays
  - `export default function PensionCalculator()` — the full JSX from line 191 to end of current `PensionPage`, but **stop before** the `<FAQSection />` call (i.e. end after the closing `</div>` of the guide/forms links section, line ~334). Actually stop after the action buttons section and the disclaimer — end just before `{/* Guide + Forms links */}` comment. The link cards and FAQ will live in the server page instead.

  **Read `src/app/pension/page.jsx` first** to confirm the exact structure. The cut point is the closing `</div>` of the action buttons section (the `flex` row containing HOME + CLEAR buttons), which is followed immediately by a `{/* Guide + Forms links */}` comment. Stop there — everything from that comment onward stays in the server page, not in this component.

  So the component renders: card with inputs + outputs + disclaimer + action buttons (HOME + CLEAR). Nothing else.

- [ ] **Step 2: Verify the component file looks correct**

  Run: `node -e "require('./src/components/PensionCalculator.jsx')" 2>&1 || true`

  Expected: no syntax errors (will error on JSX but that's fine — just checking it parses).

  Actually, just re-read the file and confirm:
  - First line is `'use client';`
  - `export default function PensionCalculator()` exists
  - No `PENSION_FAQS` array
  - No `FAQSection` import

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/PensionCalculator.jsx
  git commit -m "feat: extract PensionCalculator as standalone client component"
  ```

---

## Task 2: Update pension/layout.js

**Files:**
- Modify: `src/app/pension/layout.js`

- [ ] **Step 1: Add the 6th FAQ entry to `faqJsonLd`**

  The existing `mainEntity` array has 5 entries. Add this 6th entry after the 5th:

  ```js
  { '@type': 'Question', name: 'What is Normal Family Pension in Kerala?', acceptedAnswer: { '@type': 'Answer', text: 'Normal Family Pension = 30% of last emoluments (Basic Pay + DA). Minimum is ₹4,500/month and maximum is ₹17,960/month as per current rules.' } },
  ```

- [ ] **Step 2: Add `SoftwareApplication` JSON-LD**

  Add a second constant after `faqJsonLd`:

  ```js
  const softwareAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Kerala Pension Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: 'https://keralaemployees.in/pension',
    description: 'Calculate Kerala government employee Basic Pension, DCRG, Commutation Value and Family Pension based on KSR Part III rules.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  };
  ```

  Update the layout component to render both scripts:

  ```jsx
  export default function PensionLayout({ children }) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }} />
        {children}
      </>
    );
  }
  ```

- [ ] **Step 3: Update metadata title**

  Change the `title` in the `buildMetadata` call from:
  `'Kerala Pension Calculator — Retirement Benefits'`
  to:
  `'Kerala Govt Pension Calculator 2026 – Calculate Basic Pension & Commutation'`

- [ ] **Step 4: Commit**

  ```bash
  git add src/app/pension/layout.js
  git commit -m "feat: add SoftwareApplication schema and update FAQ schema on pension layout"
  ```

---

## Task 3: Rewrite pension/page.jsx as server component

**Files:**
- Rewrite: `src/app/pension/page.jsx`

The `PENSION_FAQS` constant from the old file is needed here. Copy it from the old page (it's the 6-item array at the top of the current file).

- [ ] **Step 1: Rewrite `src/app/pension/page.jsx`**

  Write the entire file as follows. There is **no** `'use client'` directive.

  ```jsx
  import Link from 'next/link';
  import PensionCalculator from '@/components/PensionCalculator';

  const PENSION_FAQS = [
    {
      q: 'How is pension calculated for Kerala government employees?',
      a: "Basic Pension = (50% × Average Emoluments ÷ 30) × Qualifying Service (in years). Average Emoluments is the average of the last 10 months' salary. Maximum qualifying service counted is 30 years.",
    },
    {
      q: 'What is Average Emoluments (AE) in pension calculation?',
      a: 'Average Emoluments is the average of the Basic Pay + DA drawn during the last 10 months before retirement. If there was an increment or promotion in the last 10 months, a weighted average is calculated.',
    },
    {
      q: 'What is the maximum qualifying service for pension?',
      a: 'Maximum qualifying service counted for pension calculation is 30 years under KSR Part III. Service beyond 30 years does not increase the pension amount.',
    },
    {
      q: 'What is pension commutation and when can it be restored?',
      a: 'Commutation allows you to take a lump sum by surrendering a portion (maximum 40%) of your monthly pension. The commuted pension is restored after 12 years from the date of retirement. Commutation value = Commuted amount × 11.10 × 12.',
    },
    {
      q: 'What is Normal Family Pension in Kerala?',
      a: 'Normal Family Pension = 30% of last emoluments (Basic Pay + DA). Minimum is ₹4,500/month and maximum is ₹17,960/month as per current rules.',
    },
    {
      q: 'What is the retirement age for Kerala government employees?',
      a: 'The retirement age is 56 years for most Kerala government employees. For teachers under superannuation, retirement is at the end of the academic term (31st March or 31st May) after turning 56.',
    },
  ];

  export default function PensionPage() {
    return (
      <div className="relative min-h-screen bg-aurora overflow-x-hidden">
        <div className="max-w-[960px] mx-auto px-4 pt-[100px] pb-16">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-white/50 mb-6">
            <Link href="/" className="hover:text-white/70 transition-colors no-underline text-white/50">Home</Link>
            <span className="text-white/30">›</span>
            <span className="text-white/70">Pension Calculator</span>
          </div>

          {/* H1 */}
          <h1 className="text-[clamp(20px,3.5vw,36px)] font-[900] tracking-[-0.03em] text-white leading-tight mb-3"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            Kerala Govt Pension Calculator 2026 — Calculate Basic Pension &amp; Commutation
          </h1>

          {/* Bilingual intro */}
          <div className="mb-8 flex flex-col gap-3">
            <p className="text-[14px] text-white/70 leading-relaxed">
              Kerala government employees retiring under the traditional pension scheme can use this calculator to estimate their monthly pension, Death-cum-Retirement Gratuity (DCRG), commutation value, and family pension — all calculated as per Kerala Service Rules (KSR) Part III. Enter your date of birth, total qualifying service, average emoluments, and commutation percentage to get instant results. This tool supports all retirement types: Pension, Superannuation, Invalid, and Voluntary. Applicable for employees who joined service before January 1, 2013.
            </p>
            <p className="text-[13px] text-white/60 leading-relaxed"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              കേരള സർക്കാർ ജീവനക്കാർക്ക് Retirement-ൽ ലഭിക്കുന്ന പെൻഷൻ Kerala Service Rules (KSR) Part III-ന് അനുസൃതമായി കണക്കാക്കുന്നു. Basic Pension = (Average Emoluments × Qualifying Service Years) ÷ 60 എന്ന ഫോർമുല ഉപയോഗിക്കുന്നു. Average Emoluments എന്നത് Retirement-ന് മുൻപുള്ള അവസാന 10 മാസത്തെ Basic Pay + DA-ന്റെ ശരാശരിയാണ്. Maximum Qualifying Service 30 വർഷമാണ്; അതിൽ കൂടുതൽ സർവ്വീസ് Pension Amount വർദ്ധിപ്പിക്കില്ല. ഈ Calculator ഉപയോഗിച്ച് Basic Pension, Normal Family Pension, DCRG, Commutation Value എന്നിവ ഒരേ സമയം കണക്കാക്കാം. Pension-ന്റെ Maximum 40% വരെ Commute ചെയ്ത് Lump Sum ആയി സ്വീകരിക്കാം; Commuted Pension 12 വർഷം കഴിഞ്ഞ് Restore ആകും. 2013 January 1-ന് ശേഷം Join ചെയ്ത ജീവനക്കാർ NPS-ൽ ഉൾപ്പെടുന്നതിനാൽ ഈ Calculator Traditional Pension ആനുകൂല്യങ്ങൾ കണക്കാക്കാൻ ഉദ്ദേശിച്ചതാണ്.
            </p>
          </div>

          {/* Calculator */}
          <PensionCalculator />

          {/* Example output block */}
          <div className="mt-8 rounded-2xl p-6"
            style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}>
            <h2 className="text-[13px] font-black uppercase tracking-widest mb-4"
              style={{ color: '#ff9f0a', fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              ഉദാഹരണം — Example Calculation
            </h2>
            <p className="text-[12px] text-white/50 mb-4">Average Emoluments: ₹70,000 · Qualifying Service: 30 years · Commutation: 40%</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[13px]">
              {[
                { label: 'Basic Pension', value: '₹35,000 / month' },
                { label: 'DCRG', value: '₹10,50,000' },
                { label: 'Family Pension', value: '₹21,000 / month' },
                { label: 'Commuted Value (40%)', value: '₹16,80,000 lump sum' },
                { label: 'Reduced Pension', value: '₹21,000 / month' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <span style={{ color: '#30d158' }}>✔</span>
                  <span className="text-white/60">{label}:</span>
                  <span className="text-white font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rich link cards */}
          <div className="mt-8">
            <p className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-4">ഇനിയും വായിക്കുക</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/pension-calculation" className="no-underline group">
                <div className="rounded-2xl p-5 h-full flex flex-col gap-2 transition-all hover:scale-[1.01]"
                  style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}>
                  <p className="text-[13px] font-bold text-white leading-snug"
                    style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                    പെൻഷൻ കണക്കുകൂട്ടൽ — ഘട്ടം ഘട്ടമായുള്ള മാർഗ്ഗനിർദ്ദേശം
                  </p>
                  <p className="text-[12px] text-white/50 leading-relaxed flex-1">
                    KSR Part III pension formula, half-year units, and worked examples explained step by step
                  </p>
                  <span className="text-[12px] font-bold mt-1" style={{ color: '#2997ff' }}>
                    Read Guide <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
              <Link href="/pension-forms" className="no-underline group">
                <div className="rounded-2xl p-5 h-full flex flex-col gap-2 transition-all hover:scale-[1.01]"
                  style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}>
                  <p className="text-[13px] font-bold text-white leading-snug">
                    Pension Forms Download
                  </p>
                  <p className="text-[12px] text-white/50 leading-relaxed flex-1">
                    All 24 official pension forms — Form 1 to Form 24 — ready to download
                  </p>
                  <span className="text-[12px] font-bold mt-1" style={{ color: '#30d158' }}>
                    Download Forms <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Static FAQ — server-rendered for SEO */}
          <section className="mt-10 max-w-[960px]">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/45 mb-2">FAQ</div>
            <h2 className="text-[clamp(18px,2.5vw,26px)] font-[900] tracking-[-0.02em] text-white mb-6"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              പതിവ് ചോദ്യങ്ങൾ
            </h2>
            <div className="flex flex-col gap-2">
              {PENSION_FAQS.map((faq, i) => (
                <details key={i} className="rounded-2xl overflow-hidden group"
                  style={{ border: '1px solid var(--surface-xs)', background: 'var(--surface-xs)' }}>
                  <summary className="px-5 py-4 cursor-pointer list-none flex items-center justify-between gap-4"
                    style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                    <span className="text-[14px] font-bold text-white/80 leading-snug">{faq.q}</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" className="flex-shrink-0" style={{ color: '#ff9f0a' }}>
                      <path d="M2 5l5 5 5-5"/>
                    </svg>
                  </summary>
                  <p className="px-5 pb-5 text-[13px] text-white/78 leading-relaxed"
                    style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Verify no `'use client'` at top of `page.jsx`**

  Run: `head -1 src/app/pension/page.jsx`
  Expected: `import Link from 'next/link';` (not `'use client'`)

- [ ] **Step 3: Run build to check for errors**

  Run: `npm run build 2>&1 | tail -30`
  Expected: build succeeds, no errors on `/pension` route.

- [ ] **Step 4: Commit**

  ```bash
  git add src/app/pension/page.jsx
  git commit -m "feat: convert pension page to server component with bilingual intro, example block, rich link cards, static FAQ"
  ```

---

## Task 4: Create retirement/layout.js

**Files:**
- Create: `src/app/retirement/layout.js`
- Modify: `src/app/retirement/page.js` (remove `metadata` export)

- [ ] **Step 1: Create `src/app/retirement/layout.js`**

  ```js
  export const metadata = {
    title: 'Retirement Calculator — Kerala Government Employees | Countdown, Pension, DCRG',
    description:
      'Calculate your retirement date, countdown, LPR start date, monthly pension, DCRG and leave encashment. Supports both traditional pension (pre-2013) and NPS subscribers.',
    alternates: { canonical: 'https://keralaemployees.in/retirement' },
    keywords:
      'retirement calculator Kerala, Kerala government retirement date, pension calculator Kerala, DCRG calculator, LPR leave preparatory to retirement, NPS retirement Kerala',
  };

  const softwareAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Kerala Retirement Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: 'https://keralaemployees.in/retirement',
    description: 'Calculate retirement date, LPR start date, monthly pension and DCRG for Kerala government employees. Supports traditional pension and NPS.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What is the retirement age for Kerala government employees?', acceptedAnswer: { '@type': 'Answer', text: 'കേരള സർക്കാർ ജീവനക്കാർക്ക് Retirement Age 56 വർഷം ആണ്. Superannuation Retirement-ൽ (Teachers etc.) 56 വർഷം തികയുന്നതിന് ശേഷമുള്ള Academic Term-ന്റെ അവസാനം (March 31 or May 31) ആണ് Retirement Date. മറ്റ് ജീവനക്കാർ ജനന മാസത്തിന്റെ അവസാന ദിവസം Retire ആകും.' } },
      { '@type': 'Question', name: 'What is LPR (Leave Preparatory to Retirement)?', acceptedAnswer: { '@type': 'Answer', text: 'Leave Preparatory to Retirement (LPR) എന്നത് Retirement-ന് തൊട്ടുമുൻപ് Earned Leave ആയി വാങ്ങുന്ന അവകാശ അവധിയാണ്. Maximum 300 ദിവസം LPR ആയി എടുക്കാം. LPR Start Date = Retirement Date − Earned Leave Balance Days.' } },
      { '@type': 'Question', name: 'How is the retirement date calculated when born on the 1st of a month?', acceptedAnswer: { '@type': 'Answer', text: 'ജനനം മാസത്തിന്റെ 1-ആം തീയ്യതിയാണെങ്കിൽ, Retirement Date അതിന് ഒരു മാസം മുൻപുള്ള മാസത്തിന്റെ അവസാന ദിവസം ആയി കണക്കാക്കും. ഉദാഹരണം: 01/06/1968 ജനിച്ചവർ 31/05/2024-ൽ Retire ആകും.' } },
      { '@type': 'Question', name: 'What benefits does a Kerala government employee get on retirement?', acceptedAnswer: { '@type': 'Answer', text: 'Retirement-ൽ ലഭിക്കുന്ന ആനുകൂല്യങ്ങൾ: (1) Monthly Pension — Basic Pension + DA, (2) DCRG — Lump sum, maximum ₹14,00,000, (3) Leave Encashment — Surrendered Earned Leave-ന്റെ Salary, (4) Commutation — Pension-ന്റെ 40% വരെ Lump Sum ആയി, (5) Group Insurance maturity.' } },
      { '@type': 'Question', name: 'What is the difference between traditional pension and NPS at retirement?', acceptedAnswer: { '@type': 'Answer', text: '2013 January 1-ന് മുൻപ് Join ചെയ്തവർ Traditional Pension Scheme-ൽ ആണ്: Fixed Monthly Pension, DCRG, Family Pension ഉണ്ട്. 2013-ന് ശേഷം Join ചെയ്തവർ NPS-ൽ ആണ്: Retirement-ൽ Corpus-ന്റെ 60% Tax-free ആയി withdraw ചെയ്യാം; 40% Annuity ആയി Monthly Income ലഭിക്കും.' } },
    ],
  };

  export default function RetirementLayout({ children }) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        {children}
      </>
    );
  }
  ```

- [ ] **Step 2: Remove `metadata` export from `src/app/retirement/page.js`**

  Read `src/app/retirement/page.js` first. Locate and delete the entire `export const metadata = { ... }` block (it currently spans from `export const metadata = {` to the closing `};` around line 5–12). The file should now start with the imports and go straight to `export default function RetirementPage()`. Do not delete by line number — find the block by its content.

- [ ] **Step 3: Commit**

  ```bash
  git add src/app/retirement/layout.js src/app/retirement/page.js
  git commit -m "feat: add retirement layout with SoftwareApplication + FAQPage schema"
  ```

---

## Task 5: Add content sections to retirement/page.js

**Files:**
- Modify: `src/app/retirement/page.js`

The retirement FAQ data (5 items) needs to be defined in this file for the static FAQ section.

- [ ] **Step 1: Add `RETIREMENT_FAQS` constant and `H1 + intro` block**

  At the top of the file (after imports), add:

  ```js
  const RETIREMENT_FAQS = [
    {
      q: 'What is the retirement age for Kerala government employees?',
      a: 'കേരള സർക്കാർ ജീവനക്കാർക്ക് Retirement Age 56 വർഷം ആണ്. Superannuation Retirement-ൽ (Teachers etc.) 56 വർഷം തികയുന്നതിന് ശേഷമുള്ള Academic Term-ന്റെ അവസാനം (March 31 or May 31) ആണ് Retirement Date. മറ്റ് ജീവനക്കാർ ജനന മാസത്തിന്റെ അവസാന ദിവസം Retire ആകും.',
    },
    {
      q: 'What is LPR (Leave Preparatory to Retirement)?',
      a: 'Leave Preparatory to Retirement (LPR) എന്നത് Retirement-ന് തൊട്ടുമുൻപ് Earned Leave ആയി വാങ്ങുന്ന അവകാശ അവധിയാണ്. Maximum 300 ദിവസം LPR ആയി എടുക്കാം. LPR Start Date = Retirement Date − Earned Leave Balance Days.',
    },
    {
      q: 'How is the retirement date calculated when born on the 1st of a month?',
      a: 'ജനനം മാസത്തിന്റെ 1-ആം തീയ്യതിയാണെങ്കിൽ, Retirement Date അതിന് ഒരു മാസം മുൻപുള്ള മാസത്തിന്റെ അവസാന ദിവസം ആണ് കണക്കാക്കും. ഉദാഹരണം: 01/06/1968 ജനിച്ചവർ 31/05/2024-ൽ Retire ആകും.',
    },
    {
      q: 'What benefits does a Kerala government employee get on retirement?',
      a: 'Retirement-ൽ ലഭിക്കുന്ന ആനുകൂല്യങ്ങൾ: (1) Monthly Pension — Basic Pension + DA, (2) DCRG — Lump sum, maximum ₹14,00,000, (3) Leave Encashment — Surrendered Earned Leave-ന്റെ Salary, (4) Commutation — Pension-ന്റെ 40% വരെ Lump Sum ആയി, (5) Group Insurance maturity.',
    },
    {
      q: 'What is the difference between traditional pension and NPS at retirement?',
      a: '2013 January 1-ന് മുൻപ് Join ചെയ്തവർ Traditional Pension Scheme-ൽ ആണ്: Fixed Monthly Pension, DCRG, Family Pension ഉണ്ട്. 2013-ന് ശേഷം Join ചെയ്തവർ NPS-ൽ ആണ്: Retirement-ൽ Corpus-ന്റെ 60% Tax-free ആയി withdraw ചെയ്യാം; 40% Annuity ആയി Monthly Income ലഭിക്കും.',
    },
  ];
  ```

  Then, inside `RetirementPage`, add the H1 and intro **between** the breadcrumb `<div>` and `<RetirementCalculator />`:

  ```jsx
  {/* H1 + intro */}
  <h1 className="text-[clamp(20px,3.5vw,34px)] font-[900] tracking-[-0.03em] text-white leading-tight mb-3"
    style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
    Retirement Calculator — Kerala Government Employees
  </h1>
  <p className="text-[13px] text-white/60 leading-relaxed mb-8"
    style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
    കേരള സർക്കാർ ജീവനക്കാരുടെ Retirement Date, Leave Preparatory to Retirement (LPR) Start Date, Monthly Pension, DCRG തുക എന്നിവ ഈ Calculator ഉപയോഗിച്ച് കണക്കാക്കാം. KSR Part III-ന് അനുസൃതമായി Retirement Age 56 വർഷം ആണ്. ജനന മാസത്തിന്റെ അവസാന ദിവസം ആണ് Retirement Date; ജനനം 1-ആം തീയ്യതിയാണെങ്കിൽ ഒരു മാസം മുൻപ് Retire ആകും. Superannuation Retirement-ൽ (Teachers) 56 വർഷം ശേഷം Academic Term-ന്റെ അവസാനം (March 31 / May 31) ആണ് തീയ്യതി. Traditional Pension (pre-2013) ഉം NPS (2013-ന് ശേഷം) ഉം ഈ Calculator-ൽ Support ചെയ്യുന്നു.
  </p>
  ```

- [ ] **Step 2: Add benefits grid, link card, and static FAQ after `<RetirementCalculator />`**

  Add immediately after `<RetirementCalculator />`:

  ```jsx
  {/* Benefits summary grid */}
  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
    {[
      { label: 'Retirement Date', sub: 'ജനന തീയ്യതി അനുസരിച്ച് KSR Rule പ്രകാരം' },
      { label: 'LPR Start Date', sub: 'Earned Leave Balance-ന് അനുസൃതമായ Duty Exemption' },
      { label: 'Monthly Pension', sub: 'Basic Pension (Traditional) / NPS Corpus Estimate' },
      { label: 'DCRG Amount', sub: 'Lump Sum Gratuity, Maximum ₹14,00,000' },
    ].map(({ label, sub }) => (
      <div key={label} className="rounded-2xl p-4"
        style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}>
        <p className="text-[13px] font-bold text-white mb-1">{label}</p>
        <p className="text-[12px] text-white/50 leading-relaxed"
          style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>{sub}</p>
      </div>
    ))}
  </div>

  {/* Link card → pension calculator */}
  <div className="mt-6">
    <a href="/pension" className="no-underline">
      <div className="rounded-2xl p-5 flex flex-col gap-2 transition-all hover:scale-[1.01]"
        style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}>
        <p className="text-[13px] font-bold text-white">Pension Calculator</p>
        <p className="text-[12px] text-white/50 leading-relaxed">
          Calculate Basic Pension, DCRG, commutation value and family pension based on KSR Part III rules.
        </p>
        <span className="text-[12px] font-bold mt-1" style={{ color: '#2997ff' }}>
          Open Calculator <span aria-hidden="true">→</span>
        </span>
      </div>
    </a>
  </div>

  {/* Static FAQ — server-rendered for SEO */}
  <section className="mt-10">
    <div className="text-[10px] font-black uppercase tracking-widest text-white/45 mb-2">FAQ</div>
    <h2 className="text-[clamp(18px,2.5vw,26px)] font-[900] tracking-[-0.02em] text-white mb-6"
      style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
      Frequently Asked Questions
    </h2>
    <div className="flex flex-col gap-2">
      {RETIREMENT_FAQS.map((faq, i) => (
        <details key={i} className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid var(--surface-xs)', background: 'var(--surface-xs)' }}>
          <summary className="px-5 py-4 cursor-pointer list-none flex items-center justify-between gap-4"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            <span className="text-[14px] font-bold text-white/80 leading-snug">{faq.q}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" className="flex-shrink-0" style={{ color: '#30d158' }}>
              <path d="M2 5l5 5 5-5"/>
            </svg>
          </summary>
          <p className="px-5 pb-5 text-[13px] text-white/78 leading-relaxed"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            {faq.a}
          </p>
        </details>
      ))}
    </div>
  </section>
  ```

- [ ] **Step 3: Run build**

  Run: `npm run build 2>&1 | tail -30`
  Expected: build succeeds, no errors on `/retirement` route.

- [ ] **Step 4: Commit**

  ```bash
  git add src/app/retirement/page.js
  git commit -m "feat: add H1, bilingual intro, benefits grid, link card, static FAQ to retirement page"
  ```

---

## Task 6: Final verification

- [ ] **Step 1: Run full build**

  Run: `npm run build 2>&1 | grep -E 'error|Error|warn|✓|λ|○' | tail -40`
  Expected: both `/pension` and `/retirement` show as static (`○`) or server (`λ`) routes with no errors.

- [ ] **Step 2: Verify pension page is server-rendered**

  Start dev server in background, then:
  ```bash
  npm run dev &
  sleep 5
  curl -s http://localhost:3000/pension | grep -o 'Kerala Govt Pension Calculator'
  ```
  Expected output: `Kerala Govt Pension Calculator` (confirms H1 is in raw HTML, not client-rendered)

  ```bash
  curl -s http://localhost:3000/pension | grep -o 'പതിവ് ചോദ്യങ്ങൾ'
  ```
  Expected output: `പതിവ് ചോദ്യങ്ങൾ` (confirms FAQ heading is in raw HTML)

- [ ] **Step 3: Verify retirement page content**

  ```bash
  curl -s http://localhost:3000/retirement | grep -o 'Retirement Calculator'
  curl -s http://localhost:3000/retirement | grep -o 'application/ld+json'
  ```
  Expected: both return matches (H1 and schema present in HTML).

- [ ] **Step 4: Kill dev server and commit verification note**

  ```bash
  kill %1
  git tag v-phase1-complete
  ```
