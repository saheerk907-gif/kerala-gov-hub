# Experiences Social Feed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `/experiences` into a social feed with hero, SEO block, hybrid trending sort, Story of the Week, updated cards, and an improved detail page with pull quote, share actions, and "share yours" CTA.

**Architecture:** Server components fetch and enrich data (experiences + all-time reactions + recent 7d reactions + hero stats). A client `ExperiencesFeed` component receives the pre-enriched array and handles all sorting/filtering client-side. Detail page gets new client components for sharing and a new server component for the "share yours" CTA.

**Tech Stack:** Next.js 14 App Router, React 18, Tailwind CSS, Supabase REST API, Node built-in `node:test` for utility function tests.

---

## File Map

**New files (create):**
- `src/lib/experiences.js` — Pure utility functions shared across pages
- `src/lib/experiences.test.js` — Unit tests for those functions
- `src/components/ExperiencesHero.js` — Server: hero strip layout + stats fetching
- `src/components/ExperiencesHeroStats.js` — Client: count-up animation
- `src/components/ExperiencesSeoBlock.js` — Server: static SEO content block
- `src/components/ExperiencesSortBar.js` — Client: sort tabs + anonymous toggle state
- `src/components/ExperiencesFeed.js` — Client: Story of Week, grid, inline CTAs, sticky bar
- `src/components/ExperienceShareActions.js` — Client: WhatsApp + Copy Link for detail page
- `src/components/ExperienceShareCta.js` — Server: "Share Your Experience" CTA block

**Modified files:**
- `src/app/experiences/page.js` — Add Query 3, enrich with trendingScore, use new components
- `src/app/experiences/[id]/page.js` — Add pull quote, reading metadata, share components, related stories
- `src/components/ExperienceCard.js` — Add 🔥/🆕/✔ badges, read time, WhatsApp hover

---

## Task 1: Pure Utility Functions

**Files:**
- Create: `src/lib/experiences.js`
- Create: `src/lib/experiences.test.js`

These functions are used across multiple files. Extract them first so every subsequent task can import them.

- [ ] **Step 1: Create `src/lib/experiences.js` with all pure functions**

```js
// src/lib/experiences.js

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://keralaemployees.in';

/**
 * Hybrid trending score with time decay.
 * score = (recentReactions * 2 + totalReactions) / (hoursAge + 2)
 */
export function trendingScore(recentReactions, totalReactions, publishedAt) {
  const hoursAge = (Date.now() - new Date(publishedAt).getTime()) / 3_600_000;
  return (recentReactions * 2 + totalReactions) / (hoursAge + 2);
}

/**
 * Estimated read time in minutes.
 * Uses word count / 200 wpm. Minimum 1.
 */
export function readTime(body) {
  if (!body) return 1;
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Extract a pull quote from Malayalam body text.
 * Splits on '।' (U+0964). Uses [...str] for grapheme-safe codepoint counting.
 * Falls back to first 120 codepoints if no suitable segment found.
 * Returns null if body codepoint count <= 300.
 */
export function extractPullQuote(body) {
  if (!body) return null;
  const bodyChars = [...body];
  if (bodyChars.length <= 300) return null;

  const segments = body.split('।');
  const found = segments.find(s => {
    const len = [...s.trim()].length;
    return len >= 60 && len <= 200;
  });
  if (found) return found.trim();

  // Fallback: first 120 codepoints
  return bodyChars.slice(0, 120).join('');
}

/**
 * Split body into [before, after] at the 150-codepoint mark for pull quote insertion.
 */
export function splitBodyForQuote(body) {
  const chars = [...body];
  return [chars.slice(0, 150).join(''), chars.slice(150).join('')];
}

/**
 * WhatsApp share URL with improved CTR copy.
 */
export function whatsappUrl(title, id) {
  const text = `കേരള സർക്കാർ ജീവനക്കാരന്റെ അനുഭവം:\n\n"${title}"\n\n👉 ${SITE_URL}/experiences/${id}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/**
 * Returns true if published within the last 24 hours.
 */
export function isNew(publishedAt) {
  if (!publishedAt) return false;
  return Date.now() - new Date(publishedAt).getTime() < 24 * 3_600_000;
}
```

- [ ] **Step 2: Create `src/lib/experiences.test.js`**

```js
// src/lib/experiences.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  trendingScore,
  readTime,
  extractPullQuote,
  splitBodyForQuote,
  isNew,
} from './experiences.js';

describe('trendingScore', () => {
  it('favours recent reactions over old ones', () => {
    const recentPost = trendingScore(10, 10, new Date(Date.now() - 3_600_000).toISOString()); // 1h old
    const oldPost   = trendingScore(10, 10, new Date(Date.now() - 720 * 3_600_000).toISOString()); // 30d old
    assert.ok(recentPost > oldPost, 'recent post should score higher');
  });

  it('boosts recent reactions 2x vs total', () => {
    const sameAge = new Date(Date.now() - 24 * 3_600_000).toISOString();
    const highRecent = trendingScore(10, 0, sameAge);
    const highTotal  = trendingScore(0, 10, sameAge);
    assert.ok(highRecent > highTotal, 'recent reactions should outweigh total');
  });
});

describe('readTime', () => {
  it('returns 1 for empty body', () => {
    assert.equal(readTime(''), 1);
    assert.equal(readTime(null), 1);
  });

  it('returns 1 for short text', () => {
    assert.equal(readTime('hello world'), 1);
  });

  it('returns 2 for 250-word body', () => {
    const body = Array(250).fill('word').join(' ');
    assert.equal(readTime(body), 2);
  });
});

describe('extractPullQuote', () => {
  it('returns null for short body', () => {
    assert.equal(extractPullQuote('short text'), null);
  });

  it('extracts first segment split by ।', () => {
    const long = 'a'.repeat(50) + '।' + 'b'.repeat(100) + '।' + 'c'.repeat(50);
    // Second segment (b*100) is 60-200 chars
    const quote = extractPullQuote(long.padStart(310, 'x'));
    assert.ok(quote !== null);
  });

  it('falls back to first 120 codepoints when no । found', () => {
    const body = 'x'.repeat(400);
    const quote = extractPullQuote(body);
    assert.equal([...quote].length, 120);
  });
});

describe('splitBodyForQuote', () => {
  it('splits at 150 codepoints', () => {
    const body = 'a'.repeat(300);
    const [before, after] = splitBodyForQuote(body);
    assert.equal([...before].length, 150);
    assert.equal([...after].length, 150);
  });
});

describe('isNew', () => {
  it('returns true for post published 1 hour ago', () => {
    const oneHourAgo = new Date(Date.now() - 3_600_000).toISOString();
    assert.ok(isNew(oneHourAgo));
  });

  it('returns false for post published 2 days ago', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 3_600_000).toISOString();
    assert.ok(!isNew(twoDaysAgo));
  });

  it('returns false for null', () => {
    assert.ok(!isNew(null));
  });
});
```

- [ ] **Step 3: Run tests — expect all to pass**

```bash
cd /home/saheer-anas-k/kerala-gov-hub-main
node --test src/lib/experiences.test.js
```

Expected output: all tests passing, no failures.

- [ ] **Step 4: Commit**

```bash
git add src/lib/experiences.js src/lib/experiences.test.js
git commit -m "feat: add experiences utility functions with tests"
```

---

## Task 2: Update Data Fetching in `experiences/page.js`

**Files:**
- Modify: `src/app/experiences/page.js`

Add Query 3 (recent reactions, 7d), server-side enrichment with `recentReactions` and `trendingScore`, and pass `enriched` to the new `ExperiencesFeed` client component (which doesn't exist yet — we'll wire it up in Task 7). For now, keep the existing rendering as-is after the data changes.

- [ ] **Step 1: Add `getRecentReactions` function after `getReactionCounts` in `page.js`**

```js
async function getRecentReactions(experienceIds) {
  if (!experienceIds.length) return {};
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const ids = experienceIds.map((id) => `"${id}"`).join(',');
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/experience_reactions?experience_id=in.(${ids})&created_at=gte.${sevenDaysAgo}&select=experience_id`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return {};
    const rows = await res.json();
    const counts = {};
    if (Array.isArray(rows)) {
      for (const r of rows) {
        counts[r.experience_id] = (counts[r.experience_id] || 0) + 1;
      }
    }
    return counts;
  } catch {
    return {};
  }
}
```

- [ ] **Step 2: Update `ExperiencesPage` to call `getRecentReactions` and build enriched array with `trendingScore`**

Replace the existing enrichment block:
```js
// Add import at top of file:
import { trendingScore as calcTrendingScore, readTime } from '@/lib/experiences';

// In ExperiencesPage, after getReactionCounts:
const [reactionCounts, recentCounts] = await Promise.all([
  getReactionCounts(ids),
  getRecentReactions(ids),
]);

const enriched = experiences.map((e) => {
  const helpful = reactionCounts[e.id]?.helpful || 0;
  const relatable = reactionCounts[e.id]?.relatable || 0;
  const recentReactions = recentCounts[e.id] || 0;
  return {
    ...e,
    helpful_count: helpful,
    relatable_count: relatable,
    comment_count: 0,
    recentReactions,
    trendingScore: calcTrendingScore(recentReactions, helpful + relatable, e.published_at),
    readTime: readTime(e.body),
  };
});
```

- [ ] **Step 3: Start the dev server and confirm the page still loads without errors**

```bash
cd /home/saheer-anas-k/kerala-gov-hub-main
npm run dev
```

Open `http://localhost:3000/experiences` — confirm the page renders (existing UI, no crashes).

- [ ] **Step 4: Commit**

```bash
git add src/app/experiences/page.js src/lib/experiences.js
git commit -m "feat: add recent reactions query and trendingScore enrichment to experiences page"
```

---

## Task 3: `ExperiencesHero` + `ExperiencesHeroStats`

**Files:**
- Create: `src/components/ExperiencesHero.js`
- Create: `src/components/ExperiencesHeroStats.js`

- [ ] **Step 1: Create `ExperiencesHeroStats.js` (client, count-up animation)**

```js
// src/components/ExperiencesHeroStats.js
'use client';
import { useEffect, useRef, useState } from 'react';

const GREEN = '#30d158';

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) return;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

export default function ExperiencesHeroStats({ totalStories, totalReactions, anonymousPct }) {
  const stories   = useCountUp(totalStories);
  const reactions = useCountUp(totalReactions);
  const pct       = useCountUp(anonymousPct);

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <span className="text-[13px] font-semibold" style={{ color: GREEN }}>
        {stories} കഥകൾ
      </span>
      <span className="text-white/20 text-sm">·</span>
      <span className="text-[13px] font-semibold text-white/70">
        {reactions} പ്രതികരണങ്ങൾ
      </span>
      <span className="text-white/20 text-sm">·</span>
      <span className="text-[13px] text-white/50">
        {pct}% അജ്ഞാതം
      </span>
      <span className="text-[10px] text-white/25 ml-1">· Updated hourly</span>
    </div>
  );
}
```

- [ ] **Step 2: Create `ExperiencesHero.js` (server component)**

```js
// src/components/ExperiencesHero.js
import Link from 'next/link';
import ExperiencesHeroStats from './ExperiencesHeroStats';

const GREEN = '#30d158';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function getHeroStats() {
  try {
    const headers = {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: 'count=exact',
    };
    const opts = { headers, next: { revalidate: 3600 } };

    const [totalRes, anonRes, reactRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/experiences?status=eq.published&select=id`, { ...opts, method: 'HEAD' }),
      fetch(`${SUPABASE_URL}/rest/v1/experiences?status=eq.published&is_anonymous=eq.true&select=id`, { ...opts, method: 'HEAD' }),
      fetch(`${SUPABASE_URL}/rest/v1/experience_reactions?select=id`, { ...opts, method: 'HEAD' }),
    ]);

    const total    = parseInt(totalRes.headers.get('content-range')?.split('/')[1] || '0', 10);
    const anon     = parseInt(anonRes.headers.get('content-range')?.split('/')[1]  || '0', 10);
    const reactions = parseInt(reactRes.headers.get('content-range')?.split('/')[1] || '0', 10);
    const pct      = total > 0 ? Math.round((anon / total) * 100) : 0;

    return { total, reactions, pct };
  } catch {
    return { total: 0, reactions: 0, pct: 0 };
  }
}

export default async function ExperiencesHero() {
  const { total, reactions, pct } = await getHeroStats();

  return (
    <div className="relative overflow-hidden px-4 md:px-6 pt-8 pb-10 mb-2">
      {/* Radial glow */}
      <div
        style={{
          position: 'absolute', top: '30%', left: '30%',
          width: 500, height: 300,
          background: `radial-gradient(ellipse, ${GREEN}14 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      {/* Decorative quote watermark */}
      <div
        style={{
          position: 'absolute', top: -40, right: 0,
          fontFamily: 'Georgia, serif', fontSize: 300,
          lineHeight: 1, opacity: 0.04,
          color: '#fff', userSelect: 'none', pointerEvents: 'none',
        }}
      >
        &ldquo;
      </div>

      <div className="relative max-w-[1200px] mx-auto">
        {/* Label */}
        <div
          className="text-[10px] font-black uppercase tracking-[0.1em] mb-3"
          style={{ color: GREEN }}
        >
          Community · Real Stories
        </div>

        {/* H1 — English, for SEO */}
        <h1 className="sr-only">
          Kerala Government Employee Experiences – Real Stories on Pension, GPF, Transfer &amp; Service Issues
        </h1>

        {/* Visual headline — Malayalam, large */}
        <p
          className="text-[clamp(32px,5vw,52px)] font-[900] text-white tracking-[-0.02em] leading-tight mb-1"
          style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}
        >
          അനുഭവങ്ങൾ
        </p>

        {/* Visible English subtitle */}
        <p className="text-[15px] text-white/60 mb-4">
          What actually happens in Kerala Government service
        </p>

        {/* Purpose statement — Malayalam */}
        <p
          className="text-[15px] text-white/70 leading-[1.8] max-w-[640px] mb-6"
          style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}
        >
          3 ദിവസത്തിനുള്ളിൽ GPF ലോൺ ലഭിച്ച കഥകൾ. ഒരു വർഷം കാത്തിരുന്ന
          സ്ഥലംമാറ്റം. ഒരു ഫോൺ കോളിൽ തീർന്ന റിട്ടയർമെന്റ് രേഖകൾ.
          കേരള സർക്കാർ ജീവനക്കാർ അവരുടെ യഥാർത്ഥ അനുഭവങ്ങൾ ഇവിടെ
          പങ്കിടുന്നു — അപേക്ഷിക്കുന്നതിന് മുൻപ് നിങ്ങൾ അറിഞ്ഞിരിക്കേണ്ടത്.
        </p>

        {/* Scope pills — decorative only */}
        <div className="flex gap-2 flex-wrap mb-6" style={{ pointerEvents: 'none' }}>
          {[
            '📋 സേവന പ്രക്രിയകൾ',
            '🏦 ലോൺ & GPF',
            '🚌 സ്ഥലംമാറ്റം & സ്ഥാനക്കയറ്റം',
          ].map((pill) => (
            <span
              key={pill}
              className="text-[12px] px-3 py-1 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
                fontFamily: 'var(--font-noto-malayalam), sans-serif',
              }}
            >
              {pill}
            </span>
          ))}
        </div>

        {/* Stats + CTA row */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <ExperiencesHeroStats
            totalStories={total}
            totalReactions={reactions}
            anonymousPct={pct}
          />
          <div className="flex flex-col items-end gap-1">
            <Link
              href="/experiences/submit"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-[13px] font-bold no-underline transition-all"
              style={{
                background: `${GREEN}20`,
                color: GREEN,
                border: `1px solid ${GREEN}40`,
              }}
            >
              + അനുഭവം പങ്കിടുക →
            </Link>
            <span className="text-[11px] text-white/25">Anonymous posting supported</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify dev server — visit `http://localhost:3000/experiences`, import `ExperiencesHero` temporarily in `page.js` to test it renders**

Add temporarily to the top of the page JSX (remove after verification):
```js
import ExperiencesHero from '@/components/ExperiencesHero';
// In JSX: <ExperiencesHero />
```

Confirm: hero renders, Malayalam text is visible, stats count up, no console errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ExperiencesHero.js src/components/ExperiencesHeroStats.js
git commit -m "feat: add ExperiencesHero and ExperiencesHeroStats components"
```

---

## Task 4: `ExperiencesSeoBlock`

**Files:**
- Create: `src/components/ExperiencesSeoBlock.js`

- [ ] **Step 1: Create the component**

```js
// src/components/ExperiencesSeoBlock.js

const TOPICS = [
  {
    icon: '🏦',
    ml: 'പെൻഷൻ & GPF',
    en: 'Pension delays, GPF withdrawals, loan approvals',
  },
  {
    icon: '🚌',
    ml: 'സ്ഥലംമാറ്റം',
    en: 'Transfer requests, hardship quotas, wait times',
  },
  {
    icon: '📋',
    ml: 'സർവ്വീസ് ബുക്ക്',
    en: 'Service record corrections, retirement paperwork',
  },
  {
    icon: '🏥',
    ml: 'മെഡിക്കൽ & ലീവ്',
    en: 'Medical reimbursement, leave encashment, LTC',
  },
];

export default function ExperiencesSeoBlock() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 mb-8">
      <div
        className="text-[10px] font-black uppercase tracking-widest mb-3 text-white/40"
      >
        ഇവിടെ എന്താണ് ലഭിക്കുക?
      </div>

      {/* 4 topic cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {TOPICS.map((t) => (
          <div
            key={t.ml}
            className="rounded-[16px] p-4"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="text-2xl mb-2">{t.icon}</div>
            <div
              className="text-[13px] font-semibold text-white/80 mb-1"
              style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}
            >
              {t.ml}
            </div>
            <div className="text-[11px] text-white/40 leading-relaxed">{t.en}</div>
          </div>
        ))}
      </div>

      {/* SEO paragraph — server-rendered, English */}
      <p className="text-[13px] text-white/35 leading-relaxed max-w-2xl">
        Kerala government employees often face delays in pension processing, GPF
        withdrawals, transfer approvals, and retirement documentation. This page
        collects real, first-hand experiences shared by employees across
        departments — so you know what to expect before you apply, appeal, or
        escalate. Many employees search for real experiences before applying for
        pension, GPF loans, or transfers — this page helps you understand the
        actual process and delays involved.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Confirm it renders by adding it temporarily to `experiences/page.js` JSX**

```js
import ExperiencesSeoBlock from '@/components/ExperiencesSeoBlock';
// In JSX: <ExperiencesSeoBlock />
```

Confirm: 4 cards visible, English paragraph renders, no hydration errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ExperiencesSeoBlock.js
git commit -m "feat: add ExperiencesSeoBlock with topic cards and SEO paragraph"
```

---

## Task 5: `ExperiencesFeed` — Sort, Story of the Week, Grid, CTAs, Sticky Bar

**Files:**
- Create: `src/components/ExperiencesSortBar.js`
- Create: `src/components/ExperiencesFeed.js`

- [ ] **Step 1: Create `ExperiencesSortBar.js`**

```js
// src/components/ExperiencesSortBar.js
'use client';

const GREEN = '#30d158';

const SORTS = [
  { key: 'new',     label: '🕐 പുതിയത്' },
  { key: 'trending', label: '🔥 Trending' },
  { key: 'top',     label: '⭐ Top Rated' },
];

export default function ExperiencesSortBar({ sort, onSort, anonOnly, onAnon }) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
      {/* Sort tabs */}
      <div className="flex gap-1">
        {SORTS.map((s) => (
          <button
            key={s.key}
            onClick={() => onSort(s.key)}
            className="px-4 py-2 rounded-xl text-[12px] font-bold transition-all cursor-pointer"
            style={{
              color: sort === s.key ? '#fff' : 'rgba(255,255,255,0.4)',
              borderBottom: sort === s.key ? `2px solid ${GREEN}` : '2px solid transparent',
              background: 'transparent',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Anonymous toggle */}
      <button
        onClick={() => onAnon(!anonOnly)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all cursor-pointer"
        style={{
          background: anonOnly ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
          border: anonOnly ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.08)',
          color: anonOnly ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)',
          fontFamily: 'var(--font-noto-malayalam), sans-serif',
        }}
      >
        👤 അജ്ഞാതം മാത്രം
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Create `ExperiencesFeed.js`**

```js
// src/components/ExperiencesFeed.js
'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import ExperienceCard from './ExperienceCard';
import ExperiencesSortBar from './ExperiencesSortBar';

const GREEN = '#30d158';
const GOLD  = '#c8960c';

function sortExperiences(list, sort) {
  const copy = [...list];
  if (sort === 'trending') return copy.sort((a, b) => b.trendingScore - a.trendingScore || new Date(b.published_at) - new Date(a.published_at));
  if (sort === 'top')      return copy.sort((a, b) => (b.helpful_count + b.relatable_count) - (a.helpful_count + a.relatable_count) || new Date(b.published_at) - new Date(a.published_at));
  return copy.sort((a, b) => new Date(b.published_at) - new Date(a.published_at)); // 'new'
}

function StoryOfWeek({ exp }) {
  if (!exp || exp.recentReactions < 1) return null;
  const excerpt = exp.body ? ([...exp.body].slice(0, 200).join('')) : '';
  const readMins = exp.readTime || 1;

  return (
    <Link href={`/experiences/${exp.id}`} className="no-underline block mb-8">
      <div
        className="glass-card rounded-[24px] p-6 md:p-8 relative overflow-hidden"
        style={{ borderLeft: `4px solid ${GOLD}`, border: `1px solid rgba(200,150,12,0.25)`, background: 'rgba(200,150,12,0.06)' }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
          <span
            className="text-[10px] font-black uppercase tracking-widest"
            style={{ color: GOLD }}
          >
            ⭐ ഈ ആഴ്ചയിലെ കഥ
          </span>
          <span className="text-[10px] text-white/40">~{readMins} min read</span>
        </div>
        <h2
          className="text-[clamp(18px,3vw,24px)] font-[900] text-white leading-snug mb-3"
          style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}
        >
          {exp.title}
        </h2>
        <p
          className="text-[14px] text-white/60 leading-relaxed mb-4"
          style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}
        >
          {excerpt}{[...exp.body].length > 200 ? '…' : ''}
        </p>
        <div className="flex gap-3">
          <span className="text-[12px] text-white/50">👍 {exp.helpful_count} Helpful</span>
          <span className="text-[12px] text-white/50">❤️ {exp.relatable_count} Relatable</span>
        </div>
      </div>
    </Link>
  );
}

function InlineCta() {
  return (
    <div
      className="rounded-[20px] px-5 py-4 flex items-center justify-between flex-wrap gap-3 col-span-full"
      style={{ background: 'rgba(48,209,88,0.06)', border: '1px solid rgba(48,209,88,0.15)' }}
    >
      <div>
        <p
          className="text-[14px] font-semibold text-white/80"
          style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}
        >
          നിങ്ങൾക്കും ഒരു കഥ പറയാനുണ്ടോ?
        </p>
        <p className="text-[12px] text-white/40 mt-0.5">Your experience could help a colleague.</p>
      </div>
      <Link
        href="/experiences/submit"
        className="px-4 py-2 rounded-xl text-[12px] font-bold no-underline"
        style={{ background: `${GREEN}20`, color: GREEN, border: `1px solid ${GREEN}40` }}
      >
        അനുഭവം പങ്കിടുക →
      </Link>
    </div>
  );
}

function MobileStickyBar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 md:hidden z-[50] px-4"
      style={{
        background: 'rgba(13,13,18,0.95)',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingTop: 12,
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
      }}
    >
      <Link
        href="/experiences/submit"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-[13px] font-black no-underline"
        style={{ background: `linear-gradient(135deg, ${GREEN}, #27b84a)`, color: '#fff' }}
      >
        ✍️ നിങ്ങളുടെ അനുഭവം പങ്കിടുക →
      </Link>
    </div>
  );
}

export default function ExperiencesFeed({ experiences }) {
  const [sort, setSort] = useState('new');
  const [anonOnly, setAnonOnly] = useState(false);

  const storyOfWeek = useMemo(
    () => [...experiences].sort((a, b) => b.trendingScore - a.trendingScore)[0],
    [experiences]
  );

  const sorted = useMemo(() => sortExperiences(experiences, sort), [experiences, sort]);
  const filtered = useMemo(
    () => anonOnly ? sorted.filter(e => e.is_anonymous) : sorted,
    [sorted, anonOnly]
  );

  if (!experiences.length) {
    return (
      <div
        className="glass-card rounded-[20px] p-12 text-center"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="text-4xl mb-4">📝</div>
        <p
          className="text-white/60 text-[15px] mb-4"
          style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}
        >
          ഇതുവരെ ആരും അനുഭവം പങ്കിട്ടിട്ടില്ല.
        </p>
        <Link
          href="/experiences/submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[13px] font-bold no-underline"
          style={{ background: `${GREEN}20`, color: GREEN, border: `1px solid ${GREEN}40` }}
        >
          ആദ്യം ആകൂ →
        </Link>
      </div>
    );
  }

  return (
    <>
      <StoryOfWeek exp={storyOfWeek} />

      <ExperiencesSortBar
        sort={sort}
        onSort={setSort}
        anonOnly={anonOnly}
        onAnon={setAnonOnly}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20 md:pb-0">
        {filtered.map((exp, i) => (
          <>
            <ExperienceCard key={exp.id} experience={exp} />
            {(i + 1) % 6 === 0 && i + 1 < filtered.length && <InlineCta key={`cta-${i}`} />}
          </>
        ))}
      </div>

      <MobileStickyBar />
    </>
  );
}
```

- [ ] **Step 3: Verify no syntax errors**

```bash
cd /home/saheer-anas-k/kerala-gov-hub-main
node -e "require('./src/components/ExperiencesFeed.js')" 2>&1 || true
npm run build 2>&1 | tail -20
```

Expected: no build errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ExperiencesSortBar.js src/components/ExperiencesFeed.js
git commit -m "feat: add ExperiencesSortBar and ExperiencesFeed with sort, Story of Week, and sticky bar"
```

---

## Task 6: Update `ExperienceCard`

**Files:**
- Modify: `src/components/ExperienceCard.js`

Add: 🔥 badge, 🆕 New badge, ✔ Reviewed badge, read time, WhatsApp hover icon.

- [ ] **Step 1: Add imports and helpers at the top of `ExperienceCard.js`**

```js
import { isNew, whatsappUrl } from '@/lib/experiences';
```

- [ ] **Step 2: Update the card's destructuring to include new fields**

```js
const {
  id, title, body,
  author_name, department, is_anonymous, is_pinned,
  published_at, created_at,
  helpful_count = 0, relatable_count = 0, comment_count = 0,
  recentReactions = 0, readTime = 1,
} = experience;
```

- [ ] **Step 3: Add badge rendering after the existing `{(is_pinned || featured) && ...}` badge block**

```js
{/* Status badges row */}
<div className="flex items-center gap-1.5 flex-wrap mb-2">
  {recentReactions >= 5 && (
    <span
      className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
      style={{ background: 'rgba(255,149,0,0.15)', color: '#ff9f0a', border: '1px solid rgba(255,149,0,0.3)' }}
    >
      🔥 Trending
    </span>
  )}
  {isNew(published_at || created_at) && (
    <span
      className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
      style={{ background: `${GREEN}20`, color: GREEN, border: `1px solid ${GREEN}40` }}
    >
      NEW
    </span>
  )}
</div>
```

- [ ] **Step 4: Add read time to the card footer (top-right), alongside the existing time-ago**

Replace the existing right-side footer:
```js
<div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
  <div className="flex items-center gap-2">
    <span className="text-[10px] text-white/40">~{readTime} min read</span>
    <span className="text-[10px] text-white/40">{displayDate ? timeAgo(displayDate) : ''}</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="text-[11px] text-white/50 flex items-center gap-0.5">👍 {helpful_count}</span>
    <span className="text-[11px] text-white/50 flex items-center gap-0.5">❤️ {relatable_count}</span>
    <span className="text-[11px] text-white/50 flex items-center gap-0.5">💬 {comment_count}</span>
  </div>
</div>
```

- [ ] **Step 5: Add ✔ Reviewed + WhatsApp hover icon to card footer**

After the reactions div, inside the footer:
```js
<div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
  <span className="text-[10px] text-white/25">✔ Reviewed by admin</span>
  <a
    href={whatsappUrl(title, id)}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(e) => e.stopPropagation()}
    className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white/40 hover:text-green-400 flex items-center gap-1"
    aria-label="Share on WhatsApp"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
    Share
  </a>
</div>
```

- [ ] **Step 6: Start dev server and visually verify card badges render correctly**

```bash
npm run dev
```

Open `http://localhost:3000/experiences`. Confirm: cards show badges, read time, WhatsApp icon appears on hover.

- [ ] **Step 7: Commit**

```bash
git add src/components/ExperienceCard.js
git commit -m "feat: update ExperienceCard with trending/new/reviewed badges, read time, WhatsApp hover"
```

---

## Task 7: Wire Up `experiences/page.js`

**Files:**
- Modify: `src/app/experiences/page.js`

Replace the existing JSX with the new component structure.

- [ ] **Step 1: Replace the entire `experiences/page.js` with the wired-up version**

```js
// src/app/experiences/page.js
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ExperiencesHero from '@/components/ExperiencesHero';
import ExperiencesSeoBlock from '@/components/ExperiencesSeoBlock';
import ExperiencesFeed from '@/components/ExperiencesFeed';
import { trendingScore as calcTrendingScore, readTime } from '@/lib/experiences';

export const revalidate = 60;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function getExperiences() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/experiences?status=eq.published&select=id,title,body,author_name,department,is_anonymous,is_pinned,published_at,forum_thread_id&order=published_at.desc&limit=50`,
      {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

async function getReactionCounts(ids) {
  if (!ids.length) return {};
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/experience_reactions?experience_id=in.(${ids.map(id => `"${id}"`).join(',')})&select=experience_id,type`,
      {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return {};
    const rows = await res.json();
    const counts = {};
    if (Array.isArray(rows)) {
      for (const r of rows) {
        if (!counts[r.experience_id]) counts[r.experience_id] = { helpful: 0, relatable: 0 };
        if (r.type === 'helpful') counts[r.experience_id].helpful++;
        if (r.type === 'relatable') counts[r.experience_id].relatable++;
      }
    }
    return counts;
  } catch { return {}; }
}

async function getRecentReactions(ids) {
  if (!ids.length) return {};
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/experience_reactions?experience_id=in.(${ids.map(id => `"${id}"`).join(',')})&created_at=gte.${sevenDaysAgo}&select=experience_id`,
      {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return {};
    const rows = await res.json();
    const counts = {};
    if (Array.isArray(rows)) {
      for (const r of rows) counts[r.experience_id] = (counts[r.experience_id] || 0) + 1;
    }
    return counts;
  } catch { return {}; }
}

export default async function ExperiencesPage() {
  const experiences = await getExperiences();
  const ids = experiences.map(e => e.id);

  const [reactionCounts, recentCounts] = await Promise.all([
    getReactionCounts(ids),
    getRecentReactions(ids),
  ]);

  const enriched = experiences.map(e => {
    const helpful = reactionCounts[e.id]?.helpful || 0;
    const relatable = reactionCounts[e.id]?.relatable || 0;
    const recentReactions = recentCounts[e.id] || 0;
    return {
      ...e,
      helpful_count: helpful,
      relatable_count: relatable,
      comment_count: 0,
      recentReactions,
      trendingScore: calcTrendingScore(recentReactions, helpful + relatable, e.published_at),
      readTime: readTime(e.body),
    };
  });

  return (
    <div className="relative min-h-screen" style={{ background: '#0d0d12' }}>
      <Navbar />
      <main className="pt-16">
        <ExperiencesHero />
        <ExperiencesSeoBlock />
        <div className="px-4 md:px-6 max-w-[1200px] mx-auto pb-16">
          <ExperiencesFeed experiences={enriched} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Full visual verification**

```bash
npm run dev
```

Open `http://localhost:3000/experiences`. Confirm all:
- [ ] Hero renders with Malayalam text + English H1 (check page source: `<h1 class="sr-only">Kerala Government Employee...`)
- [ ] Stats count up on load
- [ ] SEO block shows 4 topic cards
- [ ] Sort tabs switch between Trending / Top Rated / New
- [ ] Anonymous toggle filters cards
- [ ] Story of the Week appears if any recent reactions exist
- [ ] Inline CTA appears after every 6 cards
- [ ] Mobile sticky bar visible on narrow viewport
- [ ] Cards show badges, read time, WhatsApp hover

- [ ] **Step 3: Commit**

```bash
git add src/app/experiences/page.js
git commit -m "feat: wire up experiences listing page with hero, SEO block, and social feed"
```

---

## Task 8: `ExperienceShareActions` — WhatsApp + Copy Link

**Files:**
- Create: `src/components/ExperienceShareActions.js`

- [ ] **Step 1: Create the component**

```js
// src/components/ExperienceShareActions.js
'use client';
import { useState } from 'react';
import { whatsappUrl } from '@/lib/experiences';

export default function ExperienceShareActions({ title, id }) {
  const [copied, setCopied] = useState(false);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://keralaemployees.in';
  const pageUrl = `${siteUrl}/experiences/${id}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // silent fail — clipboard not available
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <a
        href={whatsappUrl(title, id)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold no-underline transition-all"
        style={{
          background: 'rgba(37,211,102,0.12)',
          color: '#25d366',
          border: '1px solid rgba(37,211,102,0.25)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        WhatsApp
      </a>

      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.06)',
          color: copied ? '#30d158' : 'rgba(255,255,255,0.6)',
          border: `1px solid ${copied ? 'rgba(48,209,88,0.4)' : 'rgba(255,255,255,0.1)'}`,
        }}
      >
        {copied ? '✓ Copied!' : '🔗 Copy Link'}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ExperienceShareActions.js
git commit -m "feat: add ExperienceShareActions with WhatsApp and Copy Link"
```

---

## Task 9: `ExperienceShareCta` — "Share Yours" Block

**Files:**
- Create: `src/components/ExperienceShareCta.js`

- [ ] **Step 1: Create the component**

```js
// src/components/ExperienceShareCta.js
import Link from 'next/link';

const GREEN = '#30d158';

export default function ExperienceShareCta() {
  return (
    <div
      className="rounded-[24px] p-7 md:p-8 my-8"
      style={{
        background: 'rgba(48,209,88,0.07)',
        border: '1px solid rgba(48,209,88,0.2)',
      }}
    >
      <div className="text-2xl mb-3">✍️</div>
      <h3
        className="text-[18px] font-[900] text-white mb-2"
        style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}
      >
        നിങ്ങൾക്കും ഒരു അനുഭവം ഉണ്ടോ?
      </h3>
      <p
        className="text-[14px] text-white/60 leading-relaxed mb-5"
        style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}
      >
        ഈ ജീവനക്കാരൻ പങ്കിട്ടതുപോലെ, നിങ്ങളുടെ അനുഭവം മറ്റുള്ളവർക്ക് വഴികാട്ടിയാകും.
      </p>
      <Link
        href="/experiences/submit"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-[13px] font-bold no-underline transition-all"
        style={{ background: `${GREEN}20`, color: GREEN, border: `1px solid ${GREEN}40` }}
      >
        + അനുഭവം പങ്കിടുക
      </Link>
      <p className="text-[11px] text-white/30 mt-3">
        Anonymous posting supported · അഡ്മിൻ അവലോകനത്തിനു ശേഷം പ്രസിദ്ധീകരിക്കും
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ExperienceShareCta.js
git commit -m "feat: add ExperienceShareCta component"
```

---

## Task 10: Wire Up `experiences/[id]/page.js`

**Files:**
- Modify: `src/app/experiences/[id]/page.js`

Add: reading metadata, pull quote, `ExperienceShareActions`, `ExperienceShareCta`, related stories. Keep all existing components (`ReadingProgress`, `ExperienceReactions`, `ExperienceComments`) unchanged.

- [ ] **Step 1: Add imports at the top**

```js
import ExperienceShareActions from '@/components/ExperienceShareActions';
import ExperienceShareCta from '@/components/ExperienceShareCta';
import { readTime, extractPullQuote, splitBodyForQuote } from '@/lib/experiences';
```

- [ ] **Step 2: Add related stories query function after `getForumThreadCommentCount`**

```js
async function getRelatedStories(excludeId) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/experiences?status=eq.published&id=neq.${encodeURIComponent(excludeId)}&select=id,title,body,author_name,department,is_anonymous,is_pinned,published_at&order=published_at.desc&limit=20`,
      {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}
```

- [ ] **Step 3: In `ExperienceDetailPage`, fetch related stories and compute reading metadata**

Add to the existing `Promise.all`:
```js
const [reactionCounts, commentCount, relatedRaw] = await Promise.all([
  getReactionCounts(id),
  getForumThreadCommentCount(experience.forum_thread_id),
  getRelatedStories(id),
]);

const mins = readTime(experience.body);
const pullQuote = extractPullQuote(experience.body);
const [bodyBefore, bodyAfter] = pullQuote ? splitBodyForQuote(experience.body) : [experience.body, ''];

// Top 3 related by helpful reactions (no extra query — sort the 20 fetched)
const related = relatedRaw
  .map(e => ({ ...e, helpful_count: 0, relatable_count: 0, comment_count: 0, recentReactions: 0, readTime: readTime(e.body) }))
  .slice(0, 3);
```

- [ ] **Step 4: Update the body section in JSX to include reading metadata, pull quote, and share actions**

Replace the existing body `<div>` block:
```jsx
{/* Reading metadata */}
<div className="px-6 md:px-8 pt-5 pb-0 flex items-center gap-3 flex-wrap text-[12px] text-white/50">
  <span>📖 ~{mins} min read</span>
  <span>·</span>
  <span>{reactionCounts.helpful} people found this helpful</span>
  <span>·</span>
  <span className="text-white/25">✔ Reviewed by admin</span>
</div>

{/* Body with optional pull quote */}
<div className="px-6 md:px-8 py-6">
  <p
    className="text-[16px] text-white/80 leading-[1.9] whitespace-pre-wrap text-justify"
    style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}
  >
    {bodyBefore}
  </p>

  {pullQuote && (
    <blockquote
      className="my-5 px-4 py-3 rounded-lg italic text-[16px] text-white/85"
      style={{
        borderLeft: '3px solid #30d158',
        background: 'rgba(48,209,88,0.05)',
        fontFamily: 'var(--font-noto-malayalam), sans-serif',
      }}
    >
      ❝ {pullQuote} ❞
    </blockquote>
  )}

  {bodyAfter && (
    <p
      className="text-[16px] text-white/80 leading-[1.9] whitespace-pre-wrap text-justify"
      style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}
    >
      {bodyAfter}
    </p>
  )}
</div>
```

- [ ] **Step 5: Add `ExperienceShareActions` in the article footer, alongside existing `ExperienceReactions`**

Inside the existing footer `<div>`:
```jsx
<div className="flex items-center justify-between flex-wrap gap-3">
  <ExperienceReactions experienceId={id} initialCounts={reactionCounts} />
  <ExperienceShareActions title={experience.title} id={id} />
</div>
```

- [ ] **Step 6: Add `ExperienceShareCta` and related stories after the article card**

```jsx
{/* Share CTA */}
<ExperienceShareCta />

{/* Related stories */}
{related.length > 0 && (
  <div className="mt-4">
    <div className="text-[10px] font-black uppercase tracking-widest mb-3 text-white/40">
      മറ്റ് അനുഭവങ്ങൾ
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {related.map(exp => (
        <ExperienceCard key={exp.id} experience={exp} />
      ))}
    </div>
  </div>
)}
```

Add `ExperienceCard` import:
```js
import ExperienceCard from '@/components/ExperienceCard';
```

- [ ] **Step 7: Full visual verification on detail page**

```bash
npm run dev
```

Open any experience detail page `http://localhost:3000/experiences/[some-id]`. Confirm:
- [ ] Reading metadata row visible below title
- [ ] Pull quote appears mid-article (or absent for short posts — both are correct)
- [ ] WhatsApp + Copy Link buttons render in footer
- [ ] Copy Link copies URL and shows `Copied! ✓` briefly
- [ ] "Share Your Experience" CTA block visible below article
- [ ] Related stories grid shows below CTA (or hidden if none)
- [ ] No console errors

- [ ] **Step 8: Commit**

```bash
git add src/app/experiences/[id]/page.js
git commit -m "feat: upgrade experience detail page with pull quote, share actions, share CTA, and related stories"
```

---

## Task 11: Final Checks + Build Verification

- [ ] **Step 1: Run utility tests one more time**

```bash
node --test src/lib/experiences.test.js
```

Expected: all pass.

- [ ] **Step 2: Production build**

```bash
npm run build
```

Expected: no errors. Warnings about missing env vars in build output are acceptable if `NEXT_PUBLIC_SITE_URL` is set in `.env.local`.

- [ ] **Step 3: SEO check — verify H1 in page source**

```bash
curl -s http://localhost:3000/experiences | grep -i "h1"
```

Expected: `<h1 class="sr-only">Kerala Government Employee Experiences`

- [ ] **Step 4: Mobile check**

Open Chrome DevTools → device mode (375px width). Confirm:
- [ ] Mobile sticky bottom bar is visible and not blocked by anything
- [ ] Sort tabs scroll horizontally if needed
- [ ] Cards are single-column
- [ ] Hero text wraps cleanly

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete experiences social feed redesign — hero, SEO block, trending sort, updated cards, detail page improvements"
```
