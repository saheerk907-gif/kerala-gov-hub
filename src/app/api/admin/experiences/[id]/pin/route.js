// src/app/api/admin/experiences/[id]/pin/route.js
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function PATCH(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Experience ID is required.' }, { status: 400 });
  }

  const headers = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };

  // Fetch current is_pinned value
  const fetchRes = await fetch(
    `${SUPABASE_URL}/rest/v1/experiences?id=eq.${encodeURIComponent(id)}&select=id,is_pinned`,
    { headers: { ...headers, Prefer: 'return=representation' } }
  );

  if (!fetchRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch experience.' }, { status: 500 });
  }

  const experiences = await fetchRes.json();
  if (!Array.isArray(experiences) || experiences.length === 0) {
    return NextResponse.json({ error: 'Experience not found.' }, { status: 404 });
  }

  const current = experiences[0];
  const newPinned = !current.is_pinned;

  const updateRes = await fetch(
    `${SUPABASE_URL}/rest/v1/experiences?id=eq.${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify({ is_pinned: newPinned }),
    }
  );

  if (!updateRes.ok) {
    const err = await updateRes.json().catch(() => ({}));
    return NextResponse.json(
      { error: err.message || 'Failed to toggle pin.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, is_pinned: newPinned }, { status: 200 });
}
