# Experiences Page Redesign — Social Feed
**Date:** 2026-03-24
**Status:** Approved
**Scope:** `/experiences` listing page, `/experiences/[id]` detail page

---

## Goal

Transform the experiences page from a basic card grid into a social feed that:
1. Immediately tells first-time visitors what the page is and why it exists
2. Encourages employees to share their own experiences
3. Feels like a modern social platform with votes and discussion front and center

No department filtering. No new Supabase tables required.

---

## Existing Schema (referenced, not changed)

- `experiences` — `id, title, body, author_name, department, is_anonymous, is_pinned, published_at, status`
- `experience_reactions` — `id, experience_id, type ('helpful'|'relatable'), created_at, fingerprint TEXT NOT NULL`
  - `created_at` defaults to `now()` in DB
  - `fingerprint` is used by the existing `/api/experiences/react` route for deduplication — do not omit from any insert
- `forum_replies` — `id, thread_id` — used by `ExperienceComments` on detail page via `experiences.forum_thread_id`. Not changed by this spec.

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

Three Supabase REST queries in `ExperiencesHero` server component:
```
GET /rest/v1/experiences?status=eq.published&select=count&head=true
GET /rest/v1/experience_reactions?select=count&head=true
GET /rest/v1/experiences?status=eq.published&select=is_anonymous
```
Anonymous %: `Math.round(100 * rows.filter(r => r.is_anonymous).length / rows.length)`. If `rows.length === 0`, display `0%` for all stats.

Displayed as: `47 കഥകൾ · 210 പ്രതികരണങ്ങൾ · 60% അജ്ഞാതം`

**Count-up animation**: implemented in `ExperiencesHeroStats` — a `'use client'` child component that receives pre-fetched counts as props. Uses `requestAnimationFrame` loop, 1.2s easeOut. `ExperiencesHero` itself is a server component; it passes counts as props to `ExperiencesHeroStats`.

CTA button: `+ അനുഭവം പങ്കിടുക →` links to `/experiences/submit`.
Below button: `Anonymous posting supported` (white/40, 11px).

---

## Section 2: Sort Tabs + Anonymous Filter + Card Feed

### Data Fetching (server-side, `experiences/page.js`)

**Query 1 — Experiences** (unchanged from today):
```
/rest/v1/experiences?status=eq.published&select=id,title,body,author_name,department,is_anonymous,is_pinned,published_at,forum_thread_id&order=published_at.desc&limit=50
```

**Query 2 — All-time reaction counts** (unchanged from today):
```
/rest/v1/experience_reactions?experience_id=in.(id1,...)&select=experience_id,type
```
Used for `helpful_count` and `relatable_count` only. Subject to PostgREST's default 1,000-row cap — acknowledged as known limitation acceptable at current scale.

**Query 3 — Recent reactions for trending** (new, separate query):
```
/rest/v1/experience_reactions?experience_id=in.(id1,...)&created_at=gte.{ISO_DATE_7D_AGO}&select=experience_id
```
Where `ISO_DATE_7D_AGO = new Date(Date.now() - 7*24*60*60*1000).toISOString()`.

No `type` filter — counts all reactions together for trending. Date-filtered, stays well within the 1,000-row cap.

**Server-side aggregation of Query 3** (in `page.js`, before passing to client):
```js
const recentCounts = {};
for (const r of recentReactions) {
  recentCounts[r.experience_id] = (recentCounts[r.experience_id] || 0) + 1;
}
const enriched = experiences.map(e => ({
  ...e,
  helpful_count: reactionCounts[e.id]?.helpful || 0,
  relatable_count: reactionCounts[e.id]?.relatable || 0,
  recentReactions: recentCounts[e.id] || 0,   // ← required for Trending + Story of Week
}));
```

`ExperiencesFeed` receives `enriched` as a prop and performs all sorting client-side on this pre-computed array.

**1,000-row cap acknowledgement**: Both Query 2 (all-time reactions across 50 stories) and the detail page's single-story reaction fetch are subject to PostgREST's default 1,000-row cap. On the detail page this means a single story with >1,000 reactions would show undercounted totals. This is accepted as a known limitation at current traffic levels for both pages.

**Story of the Week caveat**: fetch is ordered by `published_at desc`, so the Story of the Week reflects the most-engaged story *among the newest 50*, not all-time. This is intentional and acceptable.

### Sort Controls
Two separate controls above the Story of the Week card:

**Sort tabs** (left):
```
🔥 Trending    ⭐ Top Rated    🕐 പുതിയത്
```
- Active: `#30d158` bottom border 2px + white text. Default: `🕐 പുതിയത്`.
- Client-side on fetched data.

**Anonymous filter toggle** (right, separate):
```
[👤 അജ്ഞാതം മാത്രം]
```
- Boolean toggle, default off.
- Applied after sorting: `is_anonymous === true` filter on top of sorted list.
- **Does not affect Story of the Week** — spotlight always shows regardless of toggle state.

### Sort Definitions (client-side)
- **Trending**: `recentReactions` desc, ties by `published_at` desc.
- **Top Rated**: `(helpful_count + relatable_count)` desc, ties by `published_at` desc.
- **പുതിയത്**: `published_at` desc (default, matches server order).

### Story of the Week Card
Experience with highest `recentReactions` among fetched 50. Shown full-width **above** sort tabs. **Hidden entirely** if no experience has `recentReactions >= 1`.

- Gold left border: `4px solid #c8960c`
- Badge: `⭐ ഈ ആഴ്ചയിലെ കഥ` (10px, `#c8960c`, uppercase)
- Title: 22px, font-weight 900, `var(--font-noto-malayalam)`
- Excerpt: first 200 chars of body
- Reaction pills: `👍 N Helpful` · `❤️ N Relatable`
- Read time: `~N min read` (10px, white/40, top-right)

### Card Grid Updates
3 col desktop / 2 col tablet / 1 col mobile:

- **🔥 badge**: if `recentReactions >= 5`
- **Read time**: `Math.ceil(body.split(/\s+/).length / 200)` minutes, top-right (10px, white/40)
- **WhatsApp hover icon**: visible on `group-hover`, bottom-right. Opens:
  ```js
  `https://wa.me/?text=${encodeURIComponent(`ഈ അനുഭവം നോക്കൂ: ${title} — ${process.env.NEXT_PUBLIC_SITE_URL}/experiences/${id}`)}`
  ```
  `target="_blank" rel="noopener noreferrer"`

### Inline Submit CTA
After every 6 cards (indices 5, 11, 17…):
```
നിങ്ങൾക്കും ഒരു കഥ പറയാനുണ്ടോ?
"Your experience could help a colleague."  →  [അനുഭവം പങ്കിടുക]
```
- Links to `/experiences/submit`
- bg `rgba(48,209,88,0.06)`, border `1px solid rgba(48,209,88,0.15)`, border-radius 20px, padding 16px 20px

### Mobile Sticky Bottom Bar (listing page only)

**Z-index**: Navbar uses `z-[1000]` and mobile menu uses `z-[999]`. Sticky bar uses `z-[50]` — safely below both.

```css
position: fixed;
bottom: 0; left: 0; right: 0;
z-index: 50;   /* below navbar z-1000, above page content */
```

- `md:hidden` (hidden tablet and above)
- Background: `rgba(13,13,18,0.95)`, `backdrop-filter: blur(8px)`
- Border-top: `1px solid rgba(255,255,255,0.08)`
- Padding: `12px 16px`, plus `paddingBottom: 'calc(12px + env(safe-area-inset-bottom))'` for iOS
- Full-width green button → `/experiences/submit`
- `<main>` on the listing page gets `pb-20 md:pb-0` to prevent the sticky bar from overlapping the last card

---

## Section 3: Detail Page Improvements

### Reading Metadata (below title, before body)
```
📖 ~N min read  ·  N people found this helpful
```
- Read time: `Math.ceil(body.split(/\s+/).length / 200)`
- Helpful count: `helpful_count` from existing reactions fetch

### Pull Quote
**Condition**: `body.length > 300`

**Algorithm** (grapheme-safe for Malayalam):

Malayalam is multi-codepoint — raw `.length` and `.slice()` operate on UTF-16 code units and can split grapheme clusters. Use `[...str]` (spread to codepoint array) for all length checks and slicing.

1. Split `body` on `।` (U+0964, Malayalam purna viram) — the primary sentence terminator
2. Find the first segment where `[...s.trim()].length` is between 60 and 200 (codepoint count, not `.length`)
3. If found, insert it after the first 150 codepoints of body: `[...body].slice(0, 150).join('')`
4. If no segment in range is found, **skip entirely** — no fallback

```js
const segments = body.split('।');
const quote = segments.find(s => {
  const t = s.trim();
  const len = [...t].length;   // codepoint-safe
  return len >= 60 && len <= 200;
});

// Insertion point — codepoint-safe:
const insertAfter = [...body].slice(0, 150).join('');
const remainder = [...body].slice(150).join('');
// Render: insertAfter + <PullQuote> + remainder (if quote found)
```

Rendered as:
```
❝ [segment.trim()] ❞
```
- Green left border: `3px solid #30d158`, bg `rgba(48,209,88,0.05)`
- Font: 16px italic, white/85, `var(--font-noto-malayalam)`
- Padding: 12px 16px, border-radius 8px, margin 20px 0

### Social Actions (below article)
Existing `ExperienceReactions` component (👍 Helpful, ❤️ Relatable) stays unchanged.

New `ExperienceShareActions` client component adds:
```
[📤 WhatsApp]   [🔗 Copy Link]
```

**WhatsApp**:
```js
`https://wa.me/?text=${encodeURIComponent(`ഈ അനുഭവം നോക്കൂ: ${title} — ${process.env.NEXT_PUBLIC_SITE_URL}/experiences/${id}`)}`
```
`target="_blank" rel="noopener noreferrer"`

**Copy Link**: `navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_SITE_URL}/experiences/${id}`)`. On success: button label → `Copied! ✓` for 1500ms then resets. On failure: silent (no error UI).

### "Share Your Experience" CTA Block
Between article card and related stories:
```
✍️  നിങ്ങൾക്കും ഒരു അനുഭവം ഉണ്ടോ?
"ഈ ജീവനക്കാരൻ പങ്കിട്ടതുപോലെ, നിങ്ങളുടെ അനുഭവം മറ്റുള്ളവർക്ക് വഴികാട്ടിയാകും."
[+ അനുഭവം പങ്കിടുക]
Anonymous posting supported
അഡ്മിൻ അവലോകനത്തിനു ശേഷം പ്രസിദ്ധീകരിക്കും
```
- bg `rgba(48,209,88,0.07)`, border `1px solid rgba(48,209,88,0.2)`, border-radius 24px, padding 28px 32px

### Related Stories
- 3 stories from fetched 50 (no extra query), sorted by `helpful_count + relatable_count` desc, excluding current `id`
- Label: `മറ്റ് അനുഭവങ്ങൾ`
- Uses existing `ExperienceCard` component
- Hide section entirely if no other stories exist

---

## New Components

| Component | Type | Purpose |
|---|---|---|
| `ExperiencesHero` | Server | Hero strip layout, fetches stats |
| `ExperiencesHeroStats` | Client (`'use client'`) | Count-up animation, receives counts as props |
| `ExperiencesSortBar` | Client | Sort tabs + anonymous toggle |
| `ExperiencesFeed` | Client | Card grid, Story of Week, inline CTAs, sticky bar |
| `ExperienceShareActions` | Client | WhatsApp + Copy Link on detail page |
| `ExperienceShareCta` | Server | "Share Your Experience" CTA block |

`ExperiencesPage` (server): fetches data → passes to `ExperiencesHero` + `ExperiencesFeed` as props.

---

## Environment Variables

`NEXT_PUBLIC_SITE_URL=https://keralaemployees.in` — added to `.env.local` and must be set in the deployment environment. All share URLs reference this variable — never hardcode the domain.

---

## Data Flow Summary

| Query | Runs in | Revalidate | Used for |
|---|---|---|---|
| 50 experiences | Server, page.js | 60s | Everything |
| All-time reactions | Server, page.js | 60s | helpful/relatable counts |
| Recent reactions (7d) | Server, page.js | 60s | Trending, 🔥 badge, Story of Week |
| Hero stats (3 counts) | Server, ExperiencesHero | 3600s | Hero strip stats |

---

## Out of Scope

- Department filtering / color coding
- Topic tags (deferred, needs new DB column)
- Infinite scroll / pagination beyond 50 (known debt)
- User accounts / login
- Editorial Story of the Week DB override
- PostgREST pagination for all-time reactions (acceptable at current scale)
