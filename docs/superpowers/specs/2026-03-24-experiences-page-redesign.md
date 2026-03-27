# Experiences Page Redesign — Social Feed + SEO Engine
**Date:** 2026-03-24
**Status:** Approved
**Scope:** `/experiences` listing page, `/experiences/[id]` detail page

---

## Goal

Transform the experiences page into a **community + UGC + retention loop** that:
1. Immediately tells first-time visitors what the page is and why it exists
2. Encourages employees to share their own experiences
3. Feels like a modern social platform with votes and discussion front and center
4. Ranks for low-competition, high-intent Malayalam/English search queries

No department filtering. No new Supabase tables required.

---

## Existing Schema (referenced, not changed)

- `experiences` — `id, title, body, author_name, department, is_anonymous, is_pinned, published_at, status`
- `experience_reactions` — `id, experience_id, type ('helpful'|'relatable'), created_at, fingerprint TEXT NOT NULL`
  - `created_at` defaults to `now()` in DB
  - `fingerprint` used by `/api/experiences/react` for deduplication — never omit from inserts
- `forum_replies` — `id, thread_id` — used by `ExperienceComments` on detail page via `experiences.forum_thread_id`. Not changed.

---

## Section 1: Hero Strip

### Layout
Full-width section below navbar. Background `#0d0d12` with:
- Subtle radial green glow (`#30d158`, 8% opacity, centered behind headline)
- Large faint `"` watermark (font-size 300px, opacity 0.04, top-right, `font-family: Georgia, serif`, `pointer-events: none`, `user-select: none`)

### Content (top to bottom)

**Row 1 — Identity**
- Label: `COMMUNITY · REAL STORIES` (10px, `#30d158`, uppercase, letter-spacing 0.1em)
- Headline: `അനുഭവങ്ങൾ` (48px, font-weight 900, `var(--font-noto-malayalam)`)
- English sub-headline: `"What actually happens in Kerala Government service"` (15px, white/60)

**Row 2 — Purpose Statement (Malayalam)**
> *"3 ദിവസത്തിനുള്ളിൽ GPF ലോൺ ലഭിച്ച കഥകൾ. ഒരു വർഷം കാത്തിരുന്ന സ്ഥലംമാറ്റം. ഒരു ഫോൺ കോളിൽ തീർന്ന റിട്ടയർമെന്റ് രേഖകൾ. കേരള സർക്കാർ ജീവനക്കാർ അവരുടെ യഥാർത്ഥ അനുഭവങ്ങൾ ഇവിടെ പങ്കിടുന്നു — അപേക്ഷിക്കുന്നതിന് മുൻപ് നിങ്ങൾ അറിഞ്ഞിരിക്കേണ്ടത്."*

(15px, white/70, max-width 640px, `var(--font-noto-malayalam)`, line-height 1.8)

**Row 3 — Scope Pills**
Three **non-clickable, decorative-only** pills — `pointer-events: none`, no routing:
- `📋 സേവന പ്രക്രിയകൾ`
- `🏦 ലോൺ & GPF`
- `🚌 സ്ഥലംമാറ്റം & സ്ഥാനക്കയറ്റം`

(bg `rgba(255,255,255,0.06)`, white/50 text, 12px, border-radius 999px, border `1px solid rgba(255,255,255,0.1)`)

**Row 4 — Stats + CTA**

Stats fetched server-side (ISR revalidate 3600). Label: **"Updated hourly"** (not "Live").

Hero stats use **two count queries** (not full row fetch — avoids data volume issues):
```
GET /rest/v1/experiences?status=eq.published&select=count&head=true
    → Prefer: count=exact header → total stories

GET /rest/v1/experiences?status=eq.published&is_anonymous=eq.true&select=count&head=true
    → Prefer: count=exact header → anonymous story count

GET /rest/v1/experience_reactions?select=count&head=true
    → Prefer: count=exact header → total reactions
```

Anonymous %: `Math.round(100 * anonymousCount / totalCount)`. If `totalCount === 0`, display `0%` for all stats.

Displayed as: `47 കഥകൾ · 210 പ്രതികരണങ്ങൾ · 60% അജ്ഞാതം`

**Count-up animation**: `ExperiencesHeroStats` — `'use client'` component, receives counts as props from server parent `ExperiencesHero`. Uses `requestAnimationFrame`, 1.2s easeOut.

**H1 tag** — the page `<h1>` must be the English string (Google reads this first):
```
Kerala Government Employee Experiences – Real Stories on Pension, GPF, Transfer & Service Issues
```
The Malayalam `അനുഭവങ്ങൾ` heading is a `<p>` or styled `<div>`, visually larger but not the semantic H1.

CTA button: `+ അനുഭവം പങ്കിടുക →` → `/experiences/submit`
Below button: `Anonymous posting supported` (white/40, 11px)

---

## Section 2: SEO Content Block (NEW — between Hero and Feed)

**This is a server-rendered static block. It must not be hidden, collapsed, or rendered client-side.**

Purpose: gives Google indexable keyword-dense content that answers real search queries. Styled to feel like editorial context, not raw SEO spam.

### Visual design
- Heading: `ഇവിടെ എന്താണ് ലഭിക്കുക?` (14px, white/50, uppercase, section-label style)
- 4 topic cards in a 2×2 grid (or horizontal scroll on mobile), each with:
  - Icon (emoji)
  - Malayalam topic title
  - 1-line English description (for SEO, white/40, 12px)

| Icon | Malayalam | English description |
|------|-----------|---------------------|
| 🏦 | പെൻഷൻ & GPF | Pension delays, GPF withdrawals, loan approvals |
| 🚌 | സ്ഥലംമാറ്റം | Transfer requests, hardship quotas, wait times |
| 📋 | സർവ്വീസ് ബുക്ക് | Service record corrections, retirement paperwork |
| 🏥 | മെഡിക്കൽ & ലീവ് | Medical reimbursement, leave encashment, LTC |

- Cards: bg `rgba(255,255,255,0.04)`, border `1px solid rgba(255,255,255,0.08)`, border-radius 16px, padding 16px

### Below the 4 cards — static paragraph (server-rendered, English, for SEO)

```html
<p class="text-[13px] text-white/40 leading-relaxed mt-4 max-w-2xl">
  Kerala government employees often face delays in pension processing, GPF withdrawals,
  transfer approvals, and retirement documentation. This page collects real, first-hand
  experiences shared by employees across departments — so you know what to expect
  before you apply, appeal, or escalate. Many employees search for real experiences
  before applying for pension, GPF loans, or transfers — this page helps you understand
  the actual process and delays involved.
</p>
```

Targets: "Kerala govt pension delay", "GPF withdrawal experience Kerala", "transfer delay Kerala govt", "before applying pension Kerala".

---

## Section 3: Sort Tabs + Anonymous Filter + Card Feed

### Data Fetching (server-side, `experiences/page.js`, revalidate 60)

**Query 1 — Experiences:**
```
/rest/v1/experiences?status=eq.published&select=id,title,body,author_name,department,is_anonymous,is_pinned,published_at,forum_thread_id&order=published_at.desc&limit=50
```

**Query 2 — All-time reaction counts:**
```
/rest/v1/experience_reactions?experience_id=in.(id1,...)&select=experience_id,type
```
Used for `helpful_count` and `relatable_count`. PostgREST 1,000-row cap acknowledged — accepted at current scale.

**Query 3 — Recent reactions (7 days) for trending:**
```
/rest/v1/experience_reactions?experience_id=in.(id1,...)&created_at=gte.{ISO_DATE_7D_AGO}&select=experience_id
```
Date-filtered — small dataset, safe from row cap.

**Server-side enrichment** (in `page.js`):
```js
const recentCounts = {};
for (const r of recentReactions) {
  recentCounts[r.experience_id] = (recentCounts[r.experience_id] || 0) + 1;
}
const enriched = experiences.map(e => ({
  ...e,
  helpful_count: reactionCounts[e.id]?.helpful || 0,
  relatable_count: reactionCounts[e.id]?.relatable || 0,
  recentReactions: recentCounts[e.id] || 0,
  // trendingScore with time decay — prevents old viral posts dominating forever:
  // score = (recentReactions * 2 + totalReactions) / (hoursAge + 2)
  trendingScore: (() => {
    const recent = recentCounts[e.id] || 0;
    const total = (reactionCounts[e.id]?.helpful || 0) + (reactionCounts[e.id]?.relatable || 0);
    const hoursAge = (Date.now() - new Date(e.published_at).getTime()) / 3600000;
    return (recent * 2 + total) / (hoursAge + 2);
  })(),
}));
```

`ExperiencesFeed` receives `enriched` as a prop. All sort/filter is client-side.

**1,000-row cap**: Both Query 2 and the detail page's single-story reaction fetch are subject to this cap. Accepted limitation for both pages at current scale.

**Story of the Week caveat**: covers newest 50 stories only (not all-time). Intentional — acknowledged.

### Sort Controls

**Sort tabs** (left):
```
🔥 Trending    ⭐ Top Rated    🕐 പുതിയത്
```
- Active: `#30d158` bottom border 2px + white. Default: `🕐 പുതിയത്`.
- Client-side.

**Anonymous filter toggle** (right, separate):
```
[👤 അജ്ഞാതം മാത്രം]
```
- Applied after sorting. Does not affect Story of the Week.

### Sort Definitions (client-side)
- **Trending**: `trendingScore` desc (= `recentReactions * 2 + totalReactions`), ties by `published_at` desc.
  - Hybrid formula keeps fresh posts visible while rewarding quality older posts.
- **Top Rated**: `(helpful_count + relatable_count)` desc, ties by `published_at` desc.
- **പുതിയത്**: `published_at` desc (default).

### Story of the Week Card
Experience with highest `trendingScore` among fetched 50. Full-width, **above** sort tabs. **Hidden entirely** if no experience has `recentReactions >= 1`.

- Gold left border: `4px solid #c8960c`
- Badge: `⭐ ഈ ആഴ്ചയിലെ കഥ` (10px, `#c8960c`, uppercase)
- Title: 22px, font-weight 900, `var(--font-noto-malayalam)`
- Excerpt: first 200 chars of body
- Reaction pills: `👍 N Helpful` · `❤️ N Relatable`
- Read time: `~N min read` (10px, white/40, top-right)

### Card Grid Updates
3 col desktop / 2 col tablet / 1 col mobile:

- **🔥 badge**: if `recentReactions >= 5`
- **🆕 New badge**: if `published_at` is within last 24 hours — show `NEW` badge (10px, green, uppercase). Boosts early engagement.
- **✔ Reviewed badge**: all published experiences are admin-reviewed — show `✔ Reviewed by admin` (10px, white/30) on every card. Builds trust, especially for anonymous posts.
- **Read time**: `Math.ceil(body.split(/\s+/).length / 200)` minutes (top-right, 10px, white/40)
- **Time ago**: already present via `timeAgo()` — keep as is
- **WhatsApp hover icon**: on `group-hover`, bottom-right:
  ```js
  `https://wa.me/?text=${encodeURIComponent(
    `കേരള സർക്കാർ ജീവനക്കാരന്റെ അനുഭവം:\n\n"${title}"\n\n👉 ${process.env.NEXT_PUBLIC_SITE_URL}/experiences/${id}`
  )}`
  ```
  `target="_blank" rel="noopener noreferrer"`

### Inline Submit CTA
After every 6 cards (indices 5, 11, 17…):
```
നിങ്ങൾക്കും ഒരു കഥ പറയാനുണ്ടോ?
"Your experience could help a colleague."  →  [അനുഭവം പങ്കിടുക]
```
- → `/experiences/submit`
- bg `rgba(48,209,88,0.06)`, border `1px solid rgba(48,209,88,0.15)`, border-radius 20px, padding 16px 20px

### Mobile Sticky Bottom Bar (listing page only)
- `position: fixed; bottom: 0; z-index: 50` (Navbar is `z-[1000]` — safely below)
- `md:hidden`
- bg `rgba(13,13,18,0.95)`, `backdrop-filter: blur(8px)`
- Border-top: `1px solid rgba(255,255,255,0.08)`
- Padding: `12px 16px` + `env(safe-area-inset-bottom)` for iOS
- Full-width green button → `/experiences/submit`
- `<main>` gets `pb-20 md:pb-0`

---

## Section 4: Detail Page Improvements

### Reading Metadata (below title, before body)
```
📖 ~N min read  ·  N people found this helpful  ·  ✔ Reviewed
```
- Read time: `Math.ceil(body.split(/\s+/).length / 200)`
- Helpful count: from existing reactions fetch
- ✔ Reviewed: static, all published experiences are admin-approved

### Pull Quote
**Condition**: `[...body].length > 300` (codepoint count)

**Algorithm** (grapheme-safe — use `[...str]` spread throughout, never raw `.length` or `.slice()`):

1. Split `body` on `।` (U+0964, primary Malayalam sentence terminator)
2. Find the first segment where `[...s.trim()].length` is between 60 and 200
3. If found: insert after the first 150 codepoints of body
4. If no `।`-delimited segment found: **fallback** — use `[...body].slice(0, 120).join('')` as the pull quote text
5. If body has fewer than 300 codepoints total: skip entirely

```js
const bodyChars = [...body];
if (bodyChars.length <= 300) return null;

const segments = body.split('।');
let quote = segments.find(s => {
  const len = [...s.trim()].length;
  return len >= 60 && len <= 200;
})?.trim();

// Fallback: first 120 codepoints if no segment found
if (!quote) {
  quote = bodyChars.slice(0, 120).join('');
}

const insertAfter = bodyChars.slice(0, 150).join('');
const remainder = bodyChars.slice(150).join('');
// Render: insertAfter + <PullQuote text={quote} /> + remainder
```

Rendered as:
```
❝ [quote] ❞
```
- Green left border: `3px solid #30d158`, bg `rgba(48,209,88,0.05)`
- Font: 16px italic, white/85, `var(--font-noto-malayalam)`
- Padding: 12px 16px, border-radius 8px, margin 20px 0

### Social Actions (below article)
Existing `ExperienceReactions` (👍 Helpful, ❤️ Relatable) — unchanged.

New `ExperienceShareActions` (`'use client'`) adds:
```
[📤 WhatsApp]   [🔗 Copy Link]
```

**WhatsApp** (improved CTR copy):
```js
`https://wa.me/?text=${encodeURIComponent(
  `കേരള സർക്കാർ ജീവനക്കാരന്റെ അനുഭവം:\n\n"${title}"\n\n👉 ${process.env.NEXT_PUBLIC_SITE_URL}/experiences/${id}`
)}`
```
`target="_blank" rel="noopener noreferrer"`

**Copy Link**: `navigator.clipboard.writeText(...)`. On success: `Copied! ✓` for 1500ms then reset. On failure: silent.

### "Share Your Experience" CTA Block
Between article and related stories:
```
✍️  നിങ്ങൾക്കും ഒരു അനുഭവം ഉണ്ടോ?
"ഈ ജീവനക്കാരൻ പങ്കിട്ടതുപോലെ, നിങ്ങളുടെ അനുഭവം മറ്റുള്ളവർക്ക് വഴികാട്ടിയാകും."
[+ അനുഭവം പങ്കിടുക]
Anonymous posting supported · അഡ്മിൻ അവലോകനത്തിനു ശേഷം പ്രസിദ്ധീകരിക്കും
```
- bg `rgba(48,209,88,0.07)`, border `1px solid rgba(48,209,88,0.2)`, border-radius 24px, padding 28px 32px

### Related Stories
- 3 stories from fetched 50 (no extra query), sorted by `trendingScore` desc, excluding current `id`
- Label: `മറ്റ് അനുഭവങ്ങൾ`
- Uses existing `ExperienceCard`
- Hide section if no other stories exist

---

## New Components

| Component | Type | Purpose |
|---|---|---|
| `ExperiencesHero` | Server | Hero strip layout, fetches stats |
| `ExperiencesHeroStats` | Client | Count-up animation, receives counts as props |
| `ExperiencesSeoBlock` | Server | Static SEO content block (topic cards + paragraph) |
| `ExperiencesSortBar` | Client | Sort tabs + anonymous toggle |
| `ExperiencesFeed` | Client | Card grid, Story of Week, inline CTAs, sticky bar |
| `ExperienceShareActions` | Client | WhatsApp + Copy Link on detail page |
| `ExperienceShareCta` | Server | "Share Your Experience" CTA block |

`ExperiencesPage` (server): fetches data → Hero → SeoBlock → Feed (client, receives enriched as prop).

---

## Environment Variables

`NEXT_PUBLIC_SITE_URL=https://keralaemployees.in` — added to `.env.local`. Must be set in deployment environment. Never hardcode the domain.

---

## Data Flow Summary

| Query | Where | Revalidate | Purpose |
|---|---|---|---|
| 50 experiences | Server, page.js | 60s | Feed, sort, Story of Week |
| All-time reactions | Server, page.js | 60s | helpful/relatable counts |
| Recent reactions (7d) | Server, page.js | 60s | trendingScore, 🔥 badge |
| Hero stats (3 counts) | Server, ExperiencesHero | 3600s | Hero strip numbers |

---

## SEO Targets

| Query | Type |
|---|---|
| "Kerala govt pension delay experience" | Long-tail, Malayalam intent |
| "GPF withdrawal experience Kerala" | Long-tail |
| "transfer issues Kerala government employee" | Long-tail |
| "കേരള സർക്കാർ ജീവനക്കാർ അനുഭവം" | Malayalam search |

These are low-competition, high-intent. The static SEO block + UGC titles together cover them.

---

## Out of Scope

- Department filtering / color coding
- Topic tags (deferred, needs new DB column)
- Infinite scroll / pagination beyond 50 (next phase — add `/experiences/page/2`)
- User accounts / login
- Editorial Story of the Week DB override
- Reaction rate limiting beyond fingerprint (next phase)
- PostgREST pagination for all-time reactions (acceptable at current scale)
