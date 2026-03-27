// src/app/api/experiences/submit/route.js
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { title, body: experienceBody, author_name, department, is_anonymous, website } = body;

  // Honeypot check — silently discard if filled
  if (website) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // Validate title
  const trimmedTitle = (title || '').trim();
  if (!trimmedTitle || trimmedTitle.length < 10 || trimmedTitle.length > 150) {
    return NextResponse.json(
      { error: 'Title must be between 10 and 150 characters.' },
      { status: 400 }
    );
  }

  // Validate body
  const trimmedBody = (experienceBody || '').trim();
  if (!trimmedBody || trimmedBody.length < 50 || trimmedBody.length > 5000) {
    return NextResponse.json(
      { error: 'Experience must be between 50 and 5000 characters.' },
      { status: 400 }
    );
  }

  // Validate author_name if not anonymous
  const anonymous = Boolean(is_anonymous);
  const trimmedAuthor = (author_name || '').trim();
  if (!anonymous && !trimmedAuthor) {
    return NextResponse.json(
      { error: 'Author name is required when not posting anonymously.' },
      { status: 400 }
    );
  }

  const payload = {
    title: trimmedTitle,
    body: trimmedBody,
    author_name: trimmedAuthor || null,
    department: (department || '').trim() || null,
    is_anonymous: anonymous,
    status: 'pending',
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/experiences`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return NextResponse.json(
      { error: err.message || 'Failed to submit experience.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
