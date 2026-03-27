# Discussion Forum Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a public anonymous discussion forum with 5 categories, paginated thread lists, thread detail pages, and admin moderation to keralaemployees.in.

**Architecture:** Single `/forum` page with category tabs, individual `/forum/[id]` thread detail pages, two API routes for writes, and an `/admin/forum` moderation page. All data stored in Supabase (`forum_threads` + `forum_replies`). Writes validated server-side with IP-based rate limiting.

**Tech Stack:** Next.js 14 App Router, Supabase REST API (direct fetch pattern), Tailwind CSS, `sanitize-html` (already in project)

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/app/forum/page.js` | Forum page — tabs + thread list |
| Create | `src/app/forum/[id]/page.js` | Thread detail page — thread + replies + reply form |
| Create | `src/components/forum/ForumPage.js` | Category tabs, thread list, "New Thread" button |
| Create | `src/components/forum/ThreadList.js` | Thread list for one category with pagination |
| Create | `src/components/forum/NewThreadModal.js` | Modal form to create a thread |
| Create | `src/app/api/forum/threads/route.js` | POST new thread (validates + rate limits) |
| Create | `src/app/api/forum/replies/route.js` | POST new reply (validates + rate limits) |
| Create | `src/app/admin/forum/page.js` | Admin moderation: hide/delete threads & replies |
| Modify | `src/app/admin/layout.js` | Add Forum to admin sidebar nav |
| Modify | `src/components/Navbar.js` | Add Forum link to NAV_ITEMS |
| Modify | `src/app/robots.js` | Disallow `/forum/` from indexing |
| Modify | `src/components/QuickLinksSection.js` | Add Forum card to landing page quick links |

---

## Task 1: Supabase Schema

**Files:** No code files — SQL executed in Supabase SQL Editor

- [ ] **Step 1: Run this SQL in your Supabase project → SQL Editor**

```sql
-- forum_threads table
CREATE TABLE forum_threads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  body        text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 3000),
  category    text NOT NULL CHECK (category IN ('service_matters','pension','nps_aps','leave','general')),
  author_name text NOT NULL CHECK (char_length(author_name) BETWEEN 1 AND 50),
  reply_count int NOT NULL DEFAULT 0,
  is_hidden   boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- forum_replies table
CREATE TABLE forum_replies (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id   uuid NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
  body        text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  author_name text NOT NULL CHECK (char_length(author_name) BETWEEN 1 AND 50),
  is_hidden   boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Trigger: increment reply_count on INSERT
CREATE OR REPLACE FUNCTION increment_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE forum_threads SET reply_count = reply_count + 1 WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reply_insert
AFTER INSERT ON forum_replies
FOR EACH ROW EXECUTE FUNCTION increment_reply_count();

-- Trigger: decrement reply_count on DELETE (floor at 0)
CREATE OR REPLACE FUNCTION decrement_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE forum_threads SET reply_count = GREATEST(reply_count - 1, 0) WHERE id = OLD.thread_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reply_delete
AFTER DELETE ON forum_replies
FOR EACH ROW EXECUTE FUNCTION decrement_reply_count();

-- RLS: public can read non-hidden threads and replies
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read threads" ON forum_threads
  FOR SELECT USING (is_hidden = false);

CREATE POLICY "public read replies" ON forum_replies
  FOR SELECT USING (is_hidden = false);

-- Anon INSERT (used by API routes)
CREATE POLICY "anon insert threads" ON forum_threads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "anon insert replies" ON forum_replies
  FOR INSERT WITH CHECK (true);

-- Admin UPDATE and DELETE (authenticated = logged-in admin via Supabase JWT)
CREATE POLICY "admin update threads" ON forum_threads
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin delete threads" ON forum_threads
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "admin update replies" ON forum_replies
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin delete replies" ON forum_replies
  FOR DELETE TO authenticated USING (true);

-- Admin also needs to read ALL rows (including hidden) for moderation
CREATE POLICY "admin read all threads" ON forum_threads
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "admin read all replies" ON forum_replies
  FOR SELECT TO authenticated USING (true);
```

- [ ] **Step 2: Verify tables exist**

In Supabase → Table Editor, confirm `forum_threads` and `forum_replies` are visible with the correct columns.

> No commit needed for this task — no source files are created here.

---

## Task 2: API Route — POST Thread

**Files:**
- Create: `src/app/api/forum/threads/route.js`

- [ ] **Step 1: Create the API route**

```js
// src/app/api/forum/threads/route.js
import sanitizeHtml from 'sanitize-html';
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// In-memory rate limit: ip -> last post timestamp (ms)
const rateLimitMap = new Map();
const RATE_LIMIT_MS = 60_000; // 1 thread per IP per 60 seconds

const VALID_CATEGORIES = ['service_matters', 'pension', 'nps_aps', 'leave', 'general'];

function clean(str) {
  return sanitizeHtml(str, { allowedTags: [], allowedAttributes: {} }).trim();
}

export async function POST(request) {
  // Rate limiting by IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const last = rateLimitMap.get(ip) || 0;
  if (now - last < RATE_LIMIT_MS) {
    return NextResponse.json(
      { error: 'Please wait before posting again.' },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const title       = clean(body.title || '');
  const content     = clean(body.body || '');
  const authorName  = clean(body.author_name || '');
  const category    = body.category;

  // Validation
  if (!title || title.length > 200)
    return NextResponse.json({ error: 'Title is required (max 200 chars).' }, { status: 400 });
  if (!content || content.length > 3000)
    return NextResponse.json({ error: 'Body is required (max 3000 chars).' }, { status: 400 });
  if (!authorName || authorName.length > 50)
    return NextResponse.json({ error: 'Author name is required (max 50 chars).' }, { status: 400 });
  if (!VALID_CATEGORIES.includes(category))
    return NextResponse.json({ error: 'Invalid category.' }, { status: 400 });

  const res = await fetch(`${SUPABASE_URL}/rest/v1/forum_threads`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ title, body: content, category, author_name: authorName }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return NextResponse.json({ error: err.message || 'Failed to post thread.' }, { status: 500 });
  }

  rateLimitMap.set(ip, now);
  const [thread] = await res.json();
  return NextResponse.json({ thread }, { status: 201 });
}
```

- [ ] **Step 2: Verify manually**

```bash
curl -X POST http://localhost:3000/api/forum/threads \
  -H "Content-Type: application/json" \
  -d '{"title":"Test thread","body":"Hello forum","author_name":"Rajan","category":"general"}'
```

Expected: `{"thread":{"id":"...","title":"Test thread",...}}`

- [ ] **Step 3: Commit**

```bash
git add src/app/api/forum/threads/route.js
git commit -m "feat: add POST /api/forum/threads with rate limiting and sanitization"
```

---

## Task 3: API Route — POST Reply

**Files:**
- Create: `src/app/api/forum/replies/route.js`

- [ ] **Step 1: Create the API route**

```js
// src/app/api/forum/replies/route.js
import sanitizeHtml from 'sanitize-html';
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const rateLimitMap = new Map();
const RATE_LIMIT_MS = 30_000; // 1 reply per IP per 30 seconds

function clean(str) {
  return sanitizeHtml(str, { allowedTags: [], allowedAttributes: {} }).trim();
}

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const last = rateLimitMap.get(ip) || 0;
  if (now - last < RATE_LIMIT_MS) {
    return NextResponse.json(
      { error: 'Please wait before posting again.' },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const content     = clean(body.body || '');
  const authorName  = clean(body.author_name || '');
  const threadId    = body.thread_id;

  if (!content || content.length > 2000)
    return NextResponse.json({ error: 'Reply is required (max 2000 chars).' }, { status: 400 });
  if (!authorName || authorName.length > 50)
    return NextResponse.json({ error: 'Author name is required (max 50 chars).' }, { status: 400 });
  if (!threadId)
    return NextResponse.json({ error: 'thread_id is required.' }, { status: 400 });

  const res = await fetch(`${SUPABASE_URL}/rest/v1/forum_replies`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ body: content, author_name: authorName, thread_id: threadId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return NextResponse.json({ error: err.message || 'Failed to post reply.' }, { status: 500 });
  }

  rateLimitMap.set(ip, now);
  const [reply] = await res.json();
  return NextResponse.json({ reply }, { status: 201 });
}
```

- [ ] **Step 2: Verify manually**

Use the thread `id` from Task 2 Step 2:

```bash
curl -X POST http://localhost:3000/api/forum/replies \
  -H "Content-Type: application/json" \
  -d '{"body":"This is a reply","author_name":"Meera","thread_id":"<paste-thread-id>"}'
```

Expected: `{"reply":{"id":"...","body":"This is a reply",...}}`

Also check Supabase → `forum_threads` and confirm `reply_count` incremented to 1.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/forum/replies/route.js
git commit -m "feat: add POST /api/forum/replies with rate limiting and sanitization"
```

---

## Task 4: ThreadList Component

**Files:**
- Create: `src/components/forum/ThreadList.js`

- [ ] **Step 1: Create component**

```js
// src/components/forum/ThreadList.js
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const PAGE_SIZE = 20;

function formatDate(str) {
  return new Date(str).toLocaleDateString('ml-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function ThreadList({ category }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState(null);

  async function fetchThreads(from, replace = false) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/forum_threads?select=id,title,author_name,reply_count,created_at&category=eq.${category}&is_hidden=eq.false&order=created_at.desc&limit=${PAGE_SIZE}&offset=${from}`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      );
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      if (!Array.isArray(data)) return;
      if (replace) setThreads(data);
      else setThreads(prev => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
      setOffset(from + data.length);
    } catch (e) {
      setError('Threads load cheyyan sadichilla. Refresh cheyyuka.');
    }
  }

  useEffect(() => {
    setLoading(true);
    setOffset(0);
    setError(null);
    fetchThreads(0, true).finally(() => setLoading(false));
  }, [category]);

  async function loadMore() {
    setLoadingMore(true);
    await fetchThreads(offset);
    setLoadingMore(false);
  }

  if (loading) return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="glass-card h-[72px] rounded-2xl animate-pulse" />
      ))}
    </div>
  );

  if (error) return (
    <div className="glass-card rounded-2xl p-8 text-center text-red-400 text-sm">{error}</div>
  );

  if (threads.length === 0) return (
    <div className="glass-card rounded-2xl p-12 text-center text-white/50 text-sm">
      ഈ വിഭാഗത്തിൽ ഇതുവരെ ചർച്ചകൾ ഒന്നുമില്ല. ആദ്യത്തേത് ആരംഭിക്കൂ!
    </div>
  );

  return (
    <div>
      <div className="flex flex-col gap-2">
        {threads.map((thread) => (
          <Link
            key={thread.id}
            href={`/forum/${thread.id}`}
            className="glass-card group flex items-center gap-4 px-5 py-4 rounded-2xl no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
          >
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold text-white/90 group-hover:text-white transition-colors leading-snug truncate"
                style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                {thread.title}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[11px] text-white/50">{thread.author_name}</span>
                <span className="text-[11px] text-white/35">·</span>
                <span className="text-[11px] text-white/50">{formatDate(thread.created_at)}</span>
                {thread.reply_count > 0 && (
                  <>
                    <span className="text-[11px] text-white/35">·</span>
                    <span className="text-[11px] text-white/50">💬 {thread.reply_count}</span>
                  </>
                )}
              </div>
            </div>
            <svg className="w-4 h-4 text-white/40 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all flex-shrink-0"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>

      {hasMore && (
        <button onClick={loadMore} disabled={loadingMore}
          className="w-full mt-4 py-4 rounded-2xl text-sm font-bold border-none cursor-pointer transition-all disabled:opacity-50"
          style={{ background: 'var(--surface-xs)', color: 'var(--text-primary)' }}>
          {loadingMore ? 'Loading...' : 'കൂടുതൽ ചർച്ചകൾ കാണുക'}
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/forum/ThreadList.js
git commit -m "feat: add ThreadList component with pagination"
```

---

## Task 5: NewThreadModal Component

**Files:**
- Create: `src/components/forum/NewThreadModal.js`

- [ ] **Step 1: Create component**

```js
// src/components/forum/NewThreadModal.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  { key: 'service_matters', label: 'സേവന കാര്യങ്ങൾ' },
  { key: 'pension',         label: 'പെൻഷൻ' },
  { key: 'nps_aps',         label: 'NPS / APS' },
  { key: 'leave',           label: 'അവധി' },
  { key: 'general',         label: 'പൊതു ചർച്ച' },
];

const COOLDOWN_MS = 60_000;

export default function NewThreadModal({ onClose, defaultCategory }) {
  const router = useRouter();
  const [form, setForm] = useState({
    author_name: '',
    title: '',
    body: '',
    category: defaultCategory || 'general',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function validate() {
    if (!form.author_name.trim()) return 'പേര് നൽകുക.';
    if (form.author_name.length > 50) return 'പേര് 50 അക്ഷരത്തിൽ കൂടരുത്.';
    if (!form.title.trim()) return 'തലക്കെട്ട് നൽകുക.';
    if (form.title.length > 200) return 'തലക്കെട്ട് 200 അക്ഷരത്തിൽ കൂടരുത്.';
    if (!form.body.trim()) return 'ചർച്ച എഴുതുക.';
    if (form.body.length > 3000) return 'ചർച്ച 3000 അക്ഷരത്തിൽ കൂടരുത്.';
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    // Client-side cooldown (UX only — server enforces real limit)
    const lastPost = parseInt(sessionStorage.getItem('forum_last_thread') || '0', 10);
    if (Date.now() - lastPost < COOLDOWN_MS) {
      setError('ദയവായി ഒരു മിനിറ്റ് കഴിഞ്ഞ് ശ്രമിക്കൂ.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/forum/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Post ചെയ്യാൻ കഴിഞ്ഞില്ല.');
        return;
      }
      sessionStorage.setItem('forum_last_thread', String(Date.now()));
      router.push(`/forum/${data.thread.id}`);
    } catch {
      setError('Network error. Refresh cheyyuka.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-lg rounded-3xl p-6 md:p-8"
        style={{ background: 'var(--nav-dropdown-bg)', border: '1px solid var(--glass-border)' }}>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            പുതിയ ചർച്ച തുടങ്ങുക
          </h2>
          <button onClick={onClose} className="text-white/50 hover:text-white text-xl leading-none bg-transparent border-none cursor-pointer">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Author name */}
          <div>
            <label className="block text-[11px] font-black text-white/40 uppercase tracking-widest mb-1.5">
              നിങ്ങളുടെ പേര്
            </label>
            <input
              value={form.author_name}
              onChange={e => set('author_name', e.target.value)}
              placeholder="ഉദാ: Rajan K."
              maxLength={50}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-[#2997ff] transition-all"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', fontFamily: "var(--font-noto-malayalam), sans-serif" }}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-black text-white/40 uppercase tracking-widest mb-1.5">
              വിഭാഗം
            </label>
            <select
              value={form.category}
              onChange={e => set('category', e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-[#2997ff] transition-all cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              {CATEGORIES.map(c => (
                <option key={c.key} value={c.key} style={{ background: '#1c1c1e' }}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[11px] font-black text-white/40 uppercase tracking-widest mb-1.5">
              തലക്കെട്ട്
            </label>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="ചർച്ചയുടെ വിഷയം..."
              maxLength={200}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-[#2997ff] transition-all"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', fontFamily: "var(--font-noto-malayalam), sans-serif" }}
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-[11px] font-black text-white/40 uppercase tracking-widest mb-1.5">
              ചർച്ച / ചോദ്യം
            </label>
            <textarea
              value={form.body}
              onChange={e => set('body', e.target.value)}
              placeholder="വിശദമായി എഴുതുക..."
              maxLength={3000}
              rows={5}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-[#2997ff] transition-all resize-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', fontFamily: "var(--font-noto-malayalam), sans-serif" }}
            />
            <div className="text-[10px] text-white/30 text-right mt-1">{form.body.length}/3000</div>
          </div>

          {error && (
            <div className="text-xs text-[#ff453a] bg-[#ff453a]/10 px-3 py-2 rounded-lg"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={submitting}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 cursor-pointer border-none"
            style={{ background: submitting ? 'var(--surface-xs)' : '#2997ff' }}>
            {submitting ? 'Post ചെയ്യുന്നു...' : 'ചർച്ച പ്രസിദ്ധീകരിക്കുക'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/forum/NewThreadModal.js
git commit -m "feat: add NewThreadModal component"
```

---

## Task 6: ForumPage Component

**Files:**
- Create: `src/components/forum/ForumPage.js`

- [ ] **Step 1: Create component**

```js
// src/components/forum/ForumPage.js
'use client';
import { useState } from 'react';
import ThreadList from './ThreadList';
import NewThreadModal from './NewThreadModal';

const CATEGORIES = [
  { key: 'service_matters', label: 'സേവന കാര്യങ്ങൾ', en: 'Service Matters' },
  { key: 'pension',         label: 'പെൻഷൻ',           en: 'Pension' },
  { key: 'nps_aps',         label: 'NPS / APS',         en: 'NPS / APS' },
  { key: 'leave',           label: 'അവധി',              en: 'Leave' },
  { key: 'general',         label: 'പൊതു ചർച്ച',       en: 'General' },
];

export default function ForumPage() {
  const [activeCategory, setActiveCategory] = useState('service_matters');
  const [showNewThread, setShowNewThread] = useState(false);

  return (
    <main className="min-h-screen bg-aurora text-white pt-24 pb-16 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <a href="/" className="text-[12px] text-white/70 hover:text-white no-underline transition-colors">
            ← keralaemployees.in
          </a>
          <div className="flex items-end justify-between mt-4 gap-4">
            <div>
              <h1 className="text-[clamp(24px,4vw,38px)] font-[900] tracking-[-0.03em] text-white"
                style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                ചർച്ചാ വേദി
              </h1>
              <p className="text-[13px] text-white/60 mt-1">Kerala government employees discussion forum</p>
            </div>
            <button
              onClick={() => setShowNewThread(true)}
              className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold text-white border-none cursor-pointer transition-all hover:brightness-110"
              style={{ background: '#2997ff' }}>
              + പുതിയ ചർച്ച
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold border-none cursor-pointer transition-all"
              style={{
                fontFamily: "var(--font-noto-malayalam), sans-serif",
                background: activeCategory === cat.key ? 'rgba(41,151,255,0.15)' : 'var(--surface-xs)',
                color: activeCategory === cat.key ? '#2997ff' : 'var(--text-muted)',
                border: activeCategory === cat.key ? '1px solid rgba(41,151,255,0.3)' : '1px solid transparent',
              }}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Thread list */}
        <ThreadList category={activeCategory} />

      </div>

      {showNewThread && (
        <NewThreadModal
          defaultCategory={activeCategory}
          onClose={() => setShowNewThread(false)}
        />
      )}
    </main>
  );
}
```

- [ ] **Step 2: Create the page file**

```js
// src/app/forum/page.js
import ForumPage from '@/components/forum/ForumPage';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'ചർച്ചാ വേദി | Kerala Employees',
  description: 'കേരള സർക്കാർ ജീവനക്കാരുടെ ചർച്ചാ വേദി — NPS, Pension, Leave, Service Matters',
  robots: { index: false },
};

export default function Page() {
  return (
    <>
      <ForumPage />
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verify**

Run `npm run dev` and visit `http://localhost:3000/forum`. You should see:
- Header with "ചർച്ചാ വേദി" title
- 5 category tabs
- Empty state message in each tab (tables are empty)
- "+ പുതിയ ചർച്ച" button opens the modal
- Submitting the modal navigates to `/forum/<id>` (will 404 until Task 7)

- [ ] **Step 4: Commit**

```bash
git add src/components/forum/ForumPage.js src/app/forum/page.js
git commit -m "feat: add /forum page with category tabs and new thread modal"
```

---

## Task 7: Thread Detail Page

**Files:**
- Create: `src/app/forum/[id]/page.js`

- [ ] **Step 1: Create the thread detail page**

```js
// src/app/forum/[id]/page.js
'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const REPLY_COOLDOWN_MS = 30_000;

const CATEGORY_LABELS = {
  service_matters: 'സേവന കാര്യങ്ങൾ',
  pension:         'പെൻഷൻ',
  nps_aps:         'NPS / APS',
  leave:           'അവധി',
  general:         'പൊതു ചർച്ച',
};

function formatDate(str) {
  return new Date(str).toLocaleDateString('ml-IN', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function ThreadPage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [replyForm, setReplyForm] = useState({ author_name: '', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [replyError, setReplyError] = useState(null);
  const [replySuccess, setReplySuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [threadRes, repliesRes] = await Promise.all([
          fetch(`${SUPABASE_URL}/rest/v1/forum_threads?id=eq.${id}&is_hidden=eq.false&select=*`,
            { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }),
          fetch(`${SUPABASE_URL}/rest/v1/forum_replies?thread_id=eq.${id}&is_hidden=eq.false&order=created_at.asc&select=*`,
            { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }),
        ]);
        const [threadData, repliesData] = await Promise.all([threadRes.json(), repliesRes.json()]);
        if (!threadData[0]) { setNotFound(true); return; }
        setThread(threadData[0]);
        setReplies(Array.isArray(repliesData) ? repliesData : []);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleReply(e) {
    e.preventDefault();
    if (!replyForm.author_name.trim()) { setReplyError('പേര് നൽകുക.'); return; }
    if (!replyForm.body.trim()) { setReplyError('മറുപടി എഴുതുക.'); return; }
    if (replyForm.body.length > 2000) { setReplyError('2000 അക്ഷരത്തിൽ കൂടരുത്.'); return; }

    const lastReply = parseInt(sessionStorage.getItem('forum_last_reply') || '0', 10);
    if (Date.now() - lastReply < REPLY_COOLDOWN_MS) {
      setReplyError('ദയവായി 30 സെക്കൻഡ് കഴിഞ്ഞ് ശ്രമിക്കൂ.');
      return;
    }

    setSubmitting(true);
    setReplyError(null);
    try {
      const res = await fetch('/api/forum/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...replyForm, thread_id: id }),
      });
      const data = await res.json();
      if (!res.ok) { setReplyError(data.error || 'Error'); return; }
      sessionStorage.setItem('forum_last_reply', String(Date.now()));
      setReplies(prev => [...prev, data.reply]);
      setReplyForm({ author_name: replyForm.author_name, body: '' });
      setReplySuccess(true);
      setTimeout(() => setReplySuccess(false), 3000);
    } catch {
      setReplyError('Network error.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return (
    <>
      <div className="min-h-screen bg-aurora pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="glass-card h-32 rounded-3xl animate-pulse" />
          <div className="glass-card h-20 rounded-2xl animate-pulse" />
        </div>
      </div>
    </>
  );

  if (notFound) return (
    <>
      <main className="min-h-screen bg-aurora pt-24 pb-16 px-4 text-center text-white">
        <p className="text-white/50 mt-20">Thread കണ്ടെത്തിയില്ല.</p>
        <Link href="/forum" className="mt-4 inline-block text-[#2997ff] text-sm no-underline">← Forum</Link>
      </main>
    </>
  );

  return (
    <>
      <main className="min-h-screen bg-aurora text-white pt-24 pb-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-[12px] text-white/50">
            <Link href="/forum" className="no-underline hover:text-white transition-colors">ചർച്ചാ വേദി</Link>
            <span>›</span>
            <span style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              {CATEGORY_LABELS[thread.category] || thread.category}
            </span>
          </div>

          {/* Thread */}
          <div className="glass-card rounded-3xl p-6 md:p-8 mb-6">
            <h1 className="text-[clamp(18px,3vw,26px)] font-[800] text-white leading-snug mb-4"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              {thread.title}
            </h1>
            <p className="text-[14px] text-white/80 leading-relaxed whitespace-pre-wrap mb-6"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              {thread.body}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-white/40 border-t pt-4"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <span>{thread.author_name}</span>
              <span>·</span>
              <span>{formatDate(thread.created_at)}</span>
            </div>
          </div>

          {/* Replies */}
          {replies.length > 0 && (
            <div className="mb-6">
              <div className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-3">
                {replies.length} മറുപടി{replies.length > 1 ? 'കൾ' : ''}
              </div>
              <div className="flex flex-col gap-3">
                {replies.map(reply => (
                  <div key={reply.id} className="glass-card rounded-2xl p-5">
                    <p className="text-[13px] text-white/80 leading-relaxed whitespace-pre-wrap mb-3"
                      style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                      {reply.body}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-white/35">
                      <span>{reply.author_name}</span>
                      <span>·</span>
                      <span>{formatDate(reply.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reply form */}
          <div className="glass-card rounded-3xl p-6">
            <div className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-4">
              മറുപടി നൽകുക
            </div>
            <form onSubmit={handleReply} className="space-y-3">
              <input
                value={replyForm.author_name}
                onChange={e => setReplyForm(p => ({ ...p, author_name: e.target.value }))}
                placeholder="നിങ്ങളുടെ പേര്"
                maxLength={50}
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-[#2997ff] transition-all"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', fontFamily: "var(--font-noto-malayalam), sans-serif" }}
              />
              <textarea
                value={replyForm.body}
                onChange={e => setReplyForm(p => ({ ...p, body: e.target.value }))}
                placeholder="നിങ്ങളുടെ മറുപടി..."
                maxLength={2000}
                rows={4}
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-[#2997ff] transition-all resize-none"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', fontFamily: "var(--font-noto-malayalam), sans-serif" }}
              />
              <div className="text-[10px] text-white/30 text-right">{replyForm.body.length}/2000</div>
              {replyError && (
                <div className="text-xs text-[#ff453a] bg-[#ff453a]/10 px-3 py-2 rounded-lg"
                  style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>{replyError}</div>
              )}
              {replySuccess && (
                <div className="text-xs text-green-400 bg-green-400/10 px-3 py-2 rounded-lg">
                  മറുപടി ചേർത്തു!
                </div>
              )}
              <button type="submit" disabled={submitting}
                className="w-full py-3 rounded-xl text-sm font-bold text-white border-none cursor-pointer transition-all disabled:opacity-50"
                style={{ background: '#2997ff' }}>
                {submitting ? 'Post ചെയ്യുന്നു...' : 'മറുപടി Post ചെയ്യുക'}
              </button>
            </form>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify end-to-end**

1. Visit `http://localhost:3000/forum`
2. Click "+ പുതിയ ചർച്ച", fill the form, submit
3. Confirm you are redirected to `/forum/<id>` and see the thread
4. Post a reply, confirm it appears without page reload
5. Go back to `/forum`, confirm thread appears in the list with reply count

- [ ] **Step 3: Commit**

```bash
git add src/app/forum/[id]/page.js
git commit -m "feat: add /forum/[id] thread detail page with reply form"
```

---

## Task 8: Admin Forum Page

**Files:**
- Create: `src/app/admin/forum/page.js`
- Modify: `src/app/admin/layout.js`

- [ ] **Step 1: Create admin forum moderation page**

```js
// src/app/admin/forum/page.js
'use client';
import { useState, useEffect } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getToken() {
  return sessionStorage.getItem('admin_token') || SUPABASE_KEY;
}

function formatDate(str) {
  return new Date(str).toLocaleDateString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function AdminForumPage() {
  const [tab, setTab] = useState('threads');
  const [threads, setThreads] = useState([]);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchAll() {
    setLoading(true);
    const token = getToken();
    const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` };
    const [tr, rr] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/forum_threads?select=*&order=created_at.desc`, { headers }),
      fetch(`${SUPABASE_URL}/rest/v1/forum_replies?select=*&order=created_at.desc`, { headers }),
    ]);
    setThreads(await tr.json());
    setReplies(await rr.json());
    setLoading(false);
  }

  useEffect(() => { fetchAll(); }, []);

  async function toggleHidden(table, id, currentValue) {
    const token = getToken();
    await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ is_hidden: !currentValue }),
    });
    await fetchAll();
  }

  async function hardDelete(table, id) {
    if (!confirm('ഈ item ശാശ്വതമായി ഡിലീറ്റ് ചെയ്യണോ?')) return;
    const token = getToken();
    await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}`, Prefer: 'return=minimal' },
    });
    await fetchAll();
  }

  const rows = tab === 'threads' ? threads : replies;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Forum Moderation</h1>
          <p className="text-sm text-[#86868b] mt-0.5">Hide or delete threads and replies</p>
        </div>
        <button onClick={fetchAll} className="px-4 py-2 rounded-xl text-xs text-[#2997ff] bg-[#2997ff]/10 border-none cursor-pointer hover:bg-[#2997ff]/20 transition-all">
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['threads', 'replies'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 rounded-xl text-sm font-semibold border-none cursor-pointer transition-all capitalize"
            style={{
              background: tab === t ? '#2997ff' : 'rgba(255,255,255,0.05)',
              color: tab === t ? '#fff' : '#86868b',
            }}>
            {t === 'threads' ? `Threads (${threads.length})` : `Replies (${replies.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-[#86868b] text-sm">Loading...</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#6e6e73]">Content</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#6e6e73]">Author</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#6e6e73]">Date</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#6e6e73]">Status</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#6e6e73]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  style={{ opacity: row.is_hidden ? 0.5 : 1 }}>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="truncate text-white/80 text-xs">{row.title || row.body}</div>
                  </td>
                  <td className="px-4 py-3 text-[#86868b] text-xs whitespace-nowrap">{row.author_name}</td>
                  <td className="px-4 py-3 text-[#86868b] text-xs whitespace-nowrap">{formatDate(row.created_at)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${row.is_hidden ? 'bg-red-500/15 text-red-400' : 'bg-green-500/15 text-green-400'}`}>
                      {row.is_hidden ? 'Hidden' : 'Visible'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleHidden(tab === 'threads' ? 'forum_threads' : 'forum_replies', row.id, row.is_hidden)}
                        className="px-3 py-1 rounded-lg text-[11px] font-semibold border-none cursor-pointer transition-all"
                        style={{ background: row.is_hidden ? 'rgba(52,199,89,0.15)' : 'rgba(255,159,10,0.15)', color: row.is_hidden ? '#34c759' : '#ff9f0a' }}>
                        {row.is_hidden ? 'Show' : 'Hide'}
                      </button>
                      <button
                        onClick={() => hardDelete(tab === 'threads' ? 'forum_threads' : 'forum_replies', row.id)}
                        className="px-3 py-1 rounded-lg text-[11px] font-semibold border-none cursor-pointer bg-[#ff453a]/15 text-[#ff453a] transition-all hover:bg-[#ff453a]/25">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-[#6e6e73] text-sm">No {tab} yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Add Forum to admin sidebar nav in `src/app/admin/layout.js`**

Find the `navItems` array (line 8) and add the forum item:

```js
// Add after the existing items in the navItems array:
{ href: '/admin/forum', label: 'ഫോറം', icon: '💬', en: 'Forum' },
```

The full updated array should be:
```js
const navItems = [
  { href: '/admin',          label: 'ഡാഷ്‌ബോർഡ്', icon: '🏠', en: 'Dashboard' },
  { href: '/admin/articles', label: 'ലേഖനങ്ങൾ',   icon: '✍️', en: 'Articles' },
  { href: '/admin/orders',   label: 'ഉത്തരവുകൾ',  icon: '📄', en: 'Orders' },
  { href: '/admin/tests',    label: 'Quiz / Tests', icon: '🧠', en: 'Quiz Questions' },
  { href: '/admin/acts',     label: 'നിയമങ്ങൾ',    icon: '⚖️', en: 'Acts & Rules' },
  { href: '/admin/ksr',      label: 'KSR Content',  icon: '📖', en: 'KSR Pages' },
  { href: '/admin/schemes',  label: 'പദ്ധതികൾ',    icon: '📋', en: 'Schemes' },
  { href: '/admin/links',    label: 'ലിങ്കുകൾ',    icon: '🔗', en: 'Links' },
  { href: '/admin/forum',    label: 'ഫോറം',        icon: '💬', en: 'Forum' },
];
```

- [ ] **Step 3: Verify**

Visit `http://localhost:3000/admin/forum` (log in if prompted). Confirm:
- "Forum" appears in the admin sidebar
- The Threads/Replies tabs show the rows you created during earlier testing
- Hide/Show and Delete buttons work

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/forum/page.js src/app/admin/layout.js
git commit -m "feat: add admin forum moderation page with hide/delete controls"
```

---

## Task 9: Navigation & robots.txt

**Files:**
- Modify: `src/components/Navbar.js`
- Modify: `src/app/robots.js`

- [ ] **Step 1: Update `ForumPage.js` to read `?category=` query param**

In `src/components/forum/ForumPage.js`, update the import and initial state to pre-select a category from the URL search params:

```js
// Replace the top of the file (imports + component start) with:
'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ThreadList from './ThreadList';
import NewThreadModal from './NewThreadModal';

// ... CATEGORIES array unchanged ...

export default function ForumPage() {
  const searchParams = useSearchParams();
  const initialCategory = CATEGORIES.find(c => c.key === searchParams.get('category'))?.key || 'service_matters';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  // ... rest of component unchanged
```

- [ ] **Step 2: Add Forum to Navbar NAV_ITEMS**

In `src/components/Navbar.js`, find the `NAV_ITEMS` array. Add it before the `Portals` item with category-specific `?category=` links:

```js
// Add this object to NAV_ITEMS array before the Portals entry:
{
  label: 'Forum',
  en: 'Forum',
  href: '/forum',
  dropdown: [
    { label: 'ചർച്ചാ വേദി',      sub: 'Employee Discussion Forum', href: '/forum' },
    { label: 'സേവന കാര്യങ്ങൾ',   sub: 'Service Matters',           href: '/forum?category=service_matters' },
    { label: 'പെൻഷൻ ചർച്ച',     sub: 'Pension Discussions',       href: '/forum?category=pension' },
    { label: 'NPS / APS ചർച്ച', sub: 'NPS & APS discussions',     href: '/forum?category=nps_aps' },
    { label: 'അവധി ചർച്ച',      sub: 'Leave Discussions',         href: '/forum?category=leave' },
    { label: 'പൊതു ചർച്ച',      sub: 'General Discussion',        href: '/forum?category=general' },
  ],
},
```

- [ ] **Step 2: Update robots.js to disallow forum thread pages**

Open `src/app/robots.js` and add `/forum/` to the disallow list so individual thread pages aren't indexed (the spec requires this):

The file should have a rule like:
```js
{
  userAgent: '*',
  disallow: ['/admin/', '/api/', '/forum/'],
}
```

Check the existing file and add `/forum/` to whatever disallow array is there.

- [ ] **Step 3: Add Forum card to QuickLinksSection on landing page**

Open `src/components/QuickLinksSection.js` and find where quick link cards are rendered. Add a Forum link card in the same pattern as existing cards. Look for a hardcoded links array or a `links` prop and add:

```js
{ label: 'ചർച്ചാ വേദി', sub: 'Employee Forum', href: '/forum', icon: '💬' }
```

The exact integration depends on whether `QuickLinksSection` uses Supabase data or hardcoded links — read the file first to match the existing pattern.

- [ ] **Step 4: Verify**

1. Visit `http://localhost:3000` — confirm "Forum" appears in the desktop nav and mobile drawer
2. Visit `http://localhost:3000/robots.txt` — confirm `/forum/` is in the Disallow list
3. Visit `http://localhost:3000` and find QuickLinks section — confirm Forum card is visible

- [ ] **Step 5: Commit**

```bash
git add src/components/Navbar.js src/app/robots.js src/components/QuickLinksSection.js src/components/forum/ForumPage.js
git commit -m "feat: add Forum to navbar, quick links, and disallow forum threads from robots.txt"
```

---

## Task 10: Final Verification

- [ ] **Step 1: Full flow test**

1. `npm run build` — confirm no build errors
2. Visit `/forum` — 5 tabs visible, empty state shown
3. Post a thread — redirected to `/forum/<id>`
4. Post a reply — reply appears, reply count in thread list increments
5. Open `/admin/forum` — thread and reply appear
6. Hide the thread — visit `/forum`, confirm thread is gone
7. Show the thread — confirm it's back
8. Delete the reply — confirm `reply_count` decrements in Supabase

- [ ] **Step 2: Mobile check**

Open DevTools → mobile viewport. Confirm:
- Category tabs scroll horizontally without overflow
- New thread modal is usable
- Thread detail page is readable

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete discussion forum — threads, replies, admin moderation, nav"
```
