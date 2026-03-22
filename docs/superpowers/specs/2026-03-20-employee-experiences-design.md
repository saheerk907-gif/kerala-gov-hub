# Employee Experience Sharing — Design Spec
**Date:** 2026-03-20
**Status:** Approved

---

## Overview

A community section where Kerala government employees share real experiences — pension journeys, MEDISEP claims, GPF loans, transfers, promotions. Free-form stories submitted by users, reviewed by admin, published to the site. Other employees can react (👍 ❤️) and discuss via linked Forum threads.

---

## Pages & Routes

| Route | Purpose |
|---|---|
| `/experiences` | Full list of published experiences |
| `/experiences/submit` | Submission form |
| `/experiences/[id]` | Single experience detail + reactions + forum link |

A **homepage section** (standalone section with `<ScrollReveal>`, placed between Articles and Forum sections) shows top 3 experiences — pinned-first, then by `published_at desc`.

---

## Data Model

### `experiences` table

```sql
CREATE TABLE experiences (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL CHECK (char_length(title) BETWEEN 10 AND 150),
  body          text NOT NULL CHECK (char_length(body) BETWEEN 50 AND 5000),
  author_name   text,                        -- stored even if anonymous, hidden publicly
  department    text,                        -- optional free-text
  is_anonymous  boolean NOT NULL DEFAULT false,
  status        text NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','published','rejected')),
  is_pinned     boolean NOT NULL DEFAULT false,
  forum_thread_id uuid REFERENCES forum_threads(id) ON DELETE SET NULL,  -- nullable
  created_at    timestamptz NOT NULL DEFAULT now(),
  published_at  timestamptz                  -- set explicitly by admin API on publish
);
```

### `experience_reactions` table

```sql
CREATE TABLE experience_reactions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  type          text NOT NULL CHECK (type IN ('helpful','relatable')),
  fingerprint   text NOT NULL,               -- localStorage UUID generated on first visit
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (experience_id, type, fingerprint)  -- one of each type per fingerprint per post
);
```

**Reaction rules:**
- One `helpful` AND one `relatable` reaction allowed per fingerprint per experience (two separate rows)
- Reactions are **toggleable** — clicking again deletes the row (upsert pattern)
- `fingerprint` = a UUID stored in `localStorage` on first visit (generated client-side)

---

## Supabase RLS Policies

```sql
-- experiences: public can only read published
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published" ON experiences
  FOR SELECT USING (status = 'published');
CREATE POLICY "public insert pending" ON experiences
  FOR INSERT WITH CHECK (status = 'pending');
-- admin full access via service role key (bypasses RLS)

-- reactions: public read + insert, no delete via anon (handled by API route)
ALTER TABLE experience_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read reactions" ON experience_reactions FOR SELECT USING (true);
CREATE POLICY "public insert reactions" ON experience_reactions FOR INSERT WITH CHECK (true);
```

Reaction toggle (delete) goes through a Next.js API route (`/api/experiences/react`) using the **service role key** to bypass RLS, after server-side validation of fingerprint ownership.

---

## Architecture

### Submission flow
```
User fills form → honeypot check (client) → POST to /api/experiences/submit
→ INSERT with status='pending'
→ Show confirmation: "Submitted — appears after admin review"
```

### Publish flow (admin)
```
Admin at /admin/experiences clicks Approve
→ POST /api/admin/experiences/[id]/publish  (uses service role key)
→ UPDATE status='published', published_at=now()
→ INSERT into forum_threads (title=experience.title, body=link back, category='experiences')
→ UPDATE experiences SET forum_thread_id = new thread id
→ revalidatePath('/experiences')
→ revalidatePath('/')
```

### Spam prevention
- **Honeypot field** — hidden `<input name="website" />` in submission form; if filled, silently discard
- **No CAPTCHA** — admin moderation is the primary gate (all posts are pending)
- Rate limiting not needed since nothing auto-publishes

---

## Caching (ISR)

| Page | Strategy |
|---|---|
| `/experiences` | `revalidate = 60` (refreshes after admin publishes via `revalidatePath`) |
| `/experiences/[id]` | `revalidate = 60` |
| Homepage section | Client fetch — no ISR needed |
| `/experiences/submit` | `'use client'` — no ISR |

---

## Components

### `ExperiencesSection.js` (homepage teaser)
- `'use client'` — fetches top 3 via Supabase REST on mount
- Pinned first, then `published_at desc`, limit 3
- Featured card (index 0, green gradient) + 2 smaller cards
- Two CTAs: "View All →" + "+ Share Yours" (green)

### `ExperienceCard.js`
- Props: `experience`, `featured` (boolean)
- Avatar: coloured circle with first letter of `author_name`; if anonymous → grey circle with "?"
- Anonymous display: shows "Anonymous" in English (not Malayalam, for consistency)
- Excerpt: first 120 chars of `body` + "..."
- Reaction counts fetched as aggregate from `experience_reactions`

### `/experiences/page.js` (server)
- `revalidate = 60`
- Fetches all published, pinned-first then `published_at desc`
- No pagination in v1 — fetch up to 50
- Shows total count header

### `/experiences/[id]/page.js` (server)
- `revalidate = 60`
- Full `body` rendered (plain text, whitespace preserved with `whitespace-pre-wrap`)
- Reaction buttons: client island `<ExperienceReactions id={id} />`
- Forum link: "💬 N comments — Discuss in Forum →" if `forum_thread_id` exists
- OG metadata: title = experience title, description = first 160 chars of body

### `/experiences/submit/page.js` (client)
Form fields:
- `title` — required, 10–150 chars
- `body` — required textarea, 50–5000 chars, char counter shown
- `is_anonymous` — toggle (default: named)
- `author_name` — shown only when `is_anonymous = false`, required in that case
- `department` — optional free-text input
- `website` — honeypot, `display:none`, aria-hidden

### `/admin/experiences/page.js`
- Lists all experiences grouped: Pending (top) → Published → Rejected
- Each row shows: title, author, department, submitted date, status badge
- Actions per row: **Approve** / **Reject** / **Pin** (toggle)
- Admin reads `author_name` even for anonymous posts (for moderation)
- No editing of user content — approve as-is or reject
- Rejection: no reason stored in v1

---

## Visual Design

| Element | Value |
|---|---|
| Accent colour | `#30d158` (green) — distinct usage: experiences only |
| Featured card | `rgba(48,209,88,0.08)` bg, `rgba(48,209,88,0.2)` border, "✨ Most Helpful" badge |
| Pinned card | Gold gradient bg, `rgba(200,150,12,0.2)` border, "📌 Pinned" badge |
| Avatar (named) | Coloured circle, first letter, colour derived from name charCode |
| Avatar (anonymous) | Grey circle `rgba(255,255,255,0.15)` with `?` |
| Quote decoration | Large `"` in Georgia serif, `opacity: 0.06`, positioned top-right |
| Reaction pills | Pill buttons, coloured bg on active state |
| Section header | `section-label` + h2 + green `#30d158` accent bar (matches other sections) |

---

## Homepage Placement

Between `<ArticlesSection />` and `<ForumSection />` in `page.js`:

```jsx
<ScrollReveal direction="up" delay={100}>
  <ExperiencesSection />
</ScrollReveal>
```

---

## Out of Scope (v1)

- User accounts / login
- Editing or deleting own submission after submit
- Email notification to submitter on publish
- Search or filter on `/experiences` page
- Image attachments
- Pagination (limit 50 in v1)
- Rejection reason stored or shown to submitter
