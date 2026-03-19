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

  rateLimitMap.set(ip, now);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return NextResponse.json({ error: err.message || 'Failed to post reply.' }, { status: 500 });
  }

  const [reply] = await res.json();
  return NextResponse.json({ reply }, { status: 201 });
}
