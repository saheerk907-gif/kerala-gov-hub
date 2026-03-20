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

A **homepage section** (between Articles and Forum) shows the 3 most recent/featured experiences as a teaser.

---

## Data Model

### `experiences` table (Supabase)

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | primary key |
| `title` | text | story headline |
| `body` | text | full experience (Malayalam or English) |
| `author_name` | text | null if anonymous |
| `department` | text | optional, user-provided |
| `is_anonymous` | boolean | if true, show "Anonymous" |
| `status` | text | `pending` / `published` / `rejected` |
| `is_pinned` | boolean | admin can pin a story to top |
| `forum_thread_id` | uuid | FK to `forum_threads` — auto-created on publish |
| `created_at` | timestamptz | |
| `published_at` | timestamptz | set by admin on publish |

### `experience_reactions` table

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `experience_id` | uuid | FK to experiences |
| `type` | text | `helpful` or `relatable` |
| `fingerprint` | text | browser fingerprint to prevent duplicate reactions |
| `created_at` | timestamptz | |

---

## Architecture

### Approach: Hybrid (Option B)
- Experiences and reactions stored in Supabase
- Comments handled by the **existing Forum** — when admin publishes an experience, a Forum thread is auto-created with the experience title and a link back
- No custom comment system needed

### Flow

```
User submits → status: pending
Admin reviews in admin panel → approves
  → status: published
  → Forum thread auto-created (title = experience title)
  → forum_thread_id saved to experience
Experience shows on /experiences and homepage
Readers react (👍 ❤️) — stored in experience_reactions
Readers click "💬 N comments" → goes to Forum thread
```

---

## Components

### `ExperiencesSection.js` (homepage)
- Client component
- Fetches top 3 published experiences from Supabase REST
- Shows: featured card (most helpful) + 2 smaller cards
- Visual: big decorative `"` quote mark, avatar initials, reaction counts
- Two CTAs: "View All" + "Share Yours"

### `ExperienceCard.js`
- Reusable card used on homepage and `/experiences` page
- Props: `experience`, `featured` (boolean for large/small variant)
- Shows: title, excerpt (first 120 chars of body), author avatar, reactions, comment count

### `/experiences/page.js` (server component)
- Fetches all published experiences, ordered by `published_at desc`
- Pinned experiences float to top (`is_pinned = true`)
- Shows total count ("128 employees shared their stories")

### `/experiences/[id]/page.js` (server component)
- Full story display
- Reaction buttons (client island for interactivity)
- "💬 N comments → Discuss in Forum" link to forum thread

### `/experiences/submit/page.js` (client component)
- Fields: title, body (textarea), author name or anonymous toggle, department (optional)
- On submit: inserts to `experiences` with `status: pending`
- Shows confirmation: "Your story has been submitted. It will appear after admin review."

### Admin panel addition (`/admin/experiences`)
- List of pending experiences with Approve / Reject buttons
- On approve: sets `status = published`, auto-creates forum thread via Supabase function or API route

---

## Visual Design

- **Accent colour:** Green (`#30d158`) — distinct from news (blue) and orders (orange)
- **Featured card:** Gradient green border, "✨ Most Helpful This Week" badge
- **Pinned card:** Gold gradient border, "📌 Pinned by Admin" badge
- **Avatar:** Coloured circle with first letter — green for named, blue-grey for anonymous
- **Quote decoration:** Large `"` character as background watermark on cards
- **Reactions:** Pill-shaped buttons with coloured backgrounds on hover/active
- **Section header:** `section-label` + h2 + green accent bar (matches other sections)

---

## Content Moderation

- All submissions go to `status: pending` — never auto-published
- Admin reviews at `/admin/experiences`
- Admin can: Approve, Reject, Pin
- No editing of user content — admin approves as-is or rejects

---

## What's Not In Scope

- User accounts / login (anonymous + optional name only)
- Editing or deleting own submission after submit
- Email notifications to submitter on publish
- Search or filter on `/experiences` page (add in v2)
- Image attachments (add in v2)
