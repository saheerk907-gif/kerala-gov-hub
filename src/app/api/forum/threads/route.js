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
  // Prune stale entries to prevent unbounded map growth
  for (const [key, ts] of rateLimitMap) {
    if (now - ts > RATE_LIMIT_MS * 2) rateLimitMap.delete(key);
  }
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

  rateLimitMap.set(ip, now);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return NextResponse.json({ error: err.message || 'Failed to post thread.' }, { status: 500 });
  }

  const [thread] = await res.json();
  return NextResponse.json({ thread }, { status: 201 });
}
