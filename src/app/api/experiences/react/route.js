// src/app/api/experiences/react/route.js
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const VALID_TYPES = ['helpful', 'relatable'];

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { experience_id, type, fingerprint } = body;

  if (!experience_id) {
    return NextResponse.json({ error: 'experience_id is required.' }, { status: 400 });
  }
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: 'type must be helpful or relatable.' }, { status: 400 });
  }
  if (!fingerprint || fingerprint.length > 100) {
    return NextResponse.json({ error: 'fingerprint is required.' }, { status: 400 });
  }

  const headers = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };

  // Check if reaction already exists
  const checkUrl = `${SUPABASE_URL}/rest/v1/experience_reactions?experience_id=eq.${encodeURIComponent(experience_id)}&type=eq.${type}&fingerprint=eq.${encodeURIComponent(fingerprint)}&select=id`;
  const checkRes = await fetch(checkUrl, { headers });

  if (!checkRes.ok) {
    return NextResponse.json({ error: 'Failed to check reaction.' }, { status: 500 });
  }

  const existing = await checkRes.json();

  if (Array.isArray(existing) && existing.length > 0) {
    // Toggle off — DELETE existing reaction
    const deleteUrl = `${SUPABASE_URL}/rest/v1/experience_reactions?experience_id=eq.${encodeURIComponent(experience_id)}&type=eq.${type}&fingerprint=eq.${encodeURIComponent(fingerprint)}`;
    const deleteRes = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: { ...headers, Prefer: 'return=minimal' },
    });

    if (!deleteRes.ok) {
      return NextResponse.json({ error: 'Failed to remove reaction.' }, { status: 500 });
    }

    return NextResponse.json({ action: 'removed' }, { status: 200 });
  }

  // Insert new reaction
  const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/experience_reactions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ experience_id, type, fingerprint }),
  });

  if (!insertRes.ok) {
    const err = await insertRes.json().catch(() => ({}));
    return NextResponse.json(
      { error: err.message || 'Failed to add reaction.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ action: 'added' }, { status: 201 });
}
