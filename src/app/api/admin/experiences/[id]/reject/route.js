// src/app/api/admin/experiences/[id]/reject/route.js
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Experience ID is required.' }, { status: 400 });
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/experiences?id=eq.${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ status: 'rejected' }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return NextResponse.json(
      { error: err.message || 'Failed to reject experience.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
