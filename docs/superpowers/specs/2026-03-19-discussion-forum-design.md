# Discussion Forum — Design Spec
Date: 2026-03-19

## Overview

Add a public discussion forum to keralaemployees.in where Kerala government employees can ask questions and discuss topics anonymously. No login required. Posts go live immediately; admin can delete/hide from the admin panel.

---

## Architecture

### Pages & Routes
- `/forum` — main forum page (client component, category tabs + thread list)
- `/forum/[id]` — thread detail page (server or client component, full thread + replies)
- `/admin/forum` — admin moderation page (delete/hide threads and replies)

### API Routes
- `POST /api/forum/threads` — create a new thread (server-side validation + rate limit)
- `POST /api/forum/replies` — create a new reply (server-side validation + rate limit)

### Data Fetching
- Thread and reply reads go directly via Supabase client
- Writes go through API routes for server-side validation and rate limiting

---

## Database Schema (Supabase)

### `forum_threads`
| Column       | Type        | Notes                                          |
|--------------|-------------|------------------------------------------------|
| id           | uuid (PK)   | auto-generated                                 |
| title        | text        | max 200 chars, required                        |
| body         | text        | max 3000 chars, required                       |
| category     | text        | CHECK constraint: one of 5 valid values        |
| author_name  | text        | max 50 chars, required                         |
| reply_count  | int         | default 0, managed by DB triggers              |
| is_hidden    | boolean     | soft-delete, default false                     |
| created_at   | timestamptz | auto                                           |

### `forum_replies`
| Column       | Type        | Notes                                          |
|--------------|-------------|------------------------------------------------|
| id           | uuid (PK)   | auto-generated                                 |
| thread_id    | uuid (FK)   | references forum_threads(id) ON DELETE CASCADE |
| body         | text        | max 2000 chars, required                       |
| author_name  | text        | max 50 chars, required                         |
| is_hidden    | boolean     | soft-delete, default false                     |
| created_at   | timestamptz | auto                                           |

### Category CHECK Constraint
```sql
ALTER TABLE forum_threads
  ADD CONSTRAINT forum_threads_category_check
  CHECK (category IN (
    'service_matters',
    'pension',
    'nps_aps',
    'leave',
    'general'
  ));
```

### DB Triggers
- **On INSERT into `forum_replies`**: increment `forum_threads.reply_count` by 1
- **On DELETE from `forum_replies`**: decrement `forum_threads.reply_count` by 1 (floor at 0)
- Note: `is_hidden` toggles do NOT affect `reply_count` — it reflects total (including hidden) replies so admin can see activity

---

## Categories (5)
| key             | Display label (Malayalam)         |
|-----------------|-----------------------------------|
| service_matters | സേവന കാര്യങ്ങൾ (Service Matters) |
| pension         | പെൻഷൻ (Pension)                   |
| nps_aps         | NPS / APS                         |
| leave           | അവധി (Leave)                      |
| general         | പൊതു ചർച്ച (General Discussion)  |

---

## Components

### `src/app/forum/page.js`
Client component. Renders `ForumPage`.

### `src/app/forum/[id]/page.js`
Thread detail page. Fetches thread + replies by id from Supabase. Shareable URL, supports browser back button. Contains reply form at bottom.

### `src/components/forum/ForumPage.js`
- Category tabs (5 tabs)
- Thread list for selected category (fetched per category, paginated)
- "New Thread" button → opens `NewThreadModal`
- Clicking a thread → navigates to `/forum/[id]`

### `src/components/forum/ThreadList.js`
- Lists threads for active category (title, author name, date, reply count)
- Fetches 20 threads per page, "Load more" button for pagination
- Filters out `is_hidden = true`
- Sorted by `created_at` descending

### `src/components/forum/NewThreadModal.js`
- Fields: author name (max 50), title (max 200), body (max 3000), category (pre-selected from active tab)
- Client-side length validation before submit
- Submit → POST `/api/forum/threads`
- On success: navigate to the new thread's `/forum/[id]` page

### `src/app/admin/forum/page.js`
- Two tabs: Threads / Replies
- Table with `is_hidden` toggle (soft delete) and hard delete button for each row
- Hard-deleting a thread cascades to delete all its replies (via FK constraint)

---

## Data Flow

1. `/forum` page load → fetch first 20 threads for default category (service_matters) from Supabase
2. Category tab click → fetch first 20 threads for new category
3. "Load more" click → fetch next 20 threads (offset pagination)
4. Thread click → navigate to `/forum/[id]`
5. `/forum/[id]` load → fetch thread + all non-hidden replies
6. New thread submit → POST `/api/forum/threads` → on success navigate to `/forum/[id]`
7. New reply submit → POST `/api/forum/replies` → on success reload replies list

---

## Input Validation & Sanitization

Enforced in API routes before inserting into Supabase:

| Field       | Max length | Required | Sanitization          |
|-------------|------------|----------|-----------------------|
| author_name | 50 chars   | yes      | strip HTML            |
| title       | 200 chars  | yes      | strip HTML            |
| body        | 3000 chars | yes      | strip HTML (existing `sanitize-html` lib already in project) |
| category    | —          | yes      | must match one of 5 valid keys (reject otherwise) |

Reply body: max 2000 chars, strip HTML.

---

## Spam Protection

Server-side IP-based rate limiting in API routes:

- Max 1 thread per IP per 60 seconds
- Max 1 reply per IP per 30 seconds
- Implemented with an in-memory Map (ip → last_post_timestamp) in the API route module
- On limit hit: return HTTP 429 with a user-facing error message
- Client also shows a 30-second cooldown indicator after each post (UX convenience only)

Note: in-memory store resets on server restart (Vercel serverless). Acceptable for MVP — upgrade to Upstash Redis later if needed.

---

## Error Handling

- Supabase fetch errors: show inline error message, no crash
- POST 429: show "Please wait before posting again" message
- POST 400/500: show inline error, do not navigate away
- Empty/invalid fields: client-side validation before submit (no request made)

---

## Admin Integration

- New `/admin/forum` page added to existing admin panel sidebar nav
- Uses existing admin auth (same pattern as other admin pages)
- `is_hidden = true` → soft delete (reversible, post not shown to public)
- Hard delete → permanent row removal, replies cascade via FK

---

## Navigation

- Add "Forum" link to Navbar (desktop + mobile hamburger menu)
- Add "Forum" card to QuickLinksSection on landing page

---

## Out of Scope

- User accounts / authentication
- Thread voting / upvotes
- Rich text / image uploads in posts
- Email notifications
- Search within forum
- Persistent server-side rate limiting across restarts (MVP uses in-memory)
- Thread permalinks with SEO metadata (thread pages are not indexed — add to robots.txt exclusion)
