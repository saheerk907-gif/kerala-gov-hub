// src/app/api/admin/experiences/[id]/publish/route.js
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Experience ID is required.' }, { status: 400 });
  }

  const headers = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };

  // Fetch the experience first to get the title
  const fetchRes = await fetch(
    `${SUPABASE_URL}/rest/v1/experiences?id=eq.${encodeURIComponent(id)}&select=id,title`,
    { headers: { ...headers, Prefer: 'return=representation' } }
  );

  if (!fetchRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch experience.' }, { status: 500 });
  }

  const experiences = await fetchRes.json();
  if (!Array.isArray(experiences) || experiences.length === 0) {
    return NextResponse.json({ error: 'Experience not found.' }, { status: 404 });
  }

  const experience = experiences[0];

  // Update experience: status='published', published_at=now()
  const publishRes = await fetch(
    `${SUPABASE_URL}/rest/v1/experiences?id=eq.${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify({ status: 'published', published_at: new Date().toISOString() }),
    }
  );

  if (!publishRes.ok) {
    return NextResponse.json({ error: 'Failed to publish experience.' }, { status: 500 });
  }

  // Create a linked forum thread
  const threadBody = `ഈ അനുഭവം കുറിച്ചുള്ള ചർച്ചകൾ ഇവിടെ പങ്കിടാം.\n\n/experiences/${id}`;

  const threadRes = await fetch(`${SUPABASE_URL}/rest/v1/forum_threads`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=representation' },
    body: JSON.stringify({
      title: experience.title,
      body: threadBody,
      category: 'general',
      author_name: 'Kerala Employees Hub',
    }),
  });

  if (!threadRes.ok) {
    // Thread creation failed — experience is published but no forum link
    console.error('Forum thread creation failed for experience', id);
    revalidatePath('/experiences');
    revalidatePath('/');
    return NextResponse.json({ ok: true, forum_thread_id: null }, { status: 200 });
  }

  const threads = await threadRes.json();
  const thread = Array.isArray(threads) ? threads[0] : threads;

  // Update experience with forum_thread_id
  if (thread?.id) {
    await fetch(
      `${SUPABASE_URL}/rest/v1/experiences?id=eq.${encodeURIComponent(id)}`,
      {
        method: 'PATCH',
        headers: { ...headers, Prefer: 'return=minimal' },
        body: JSON.stringify({ forum_thread_id: thread.id }),
      }
    );
  }

  revalidatePath('/experiences');
  revalidatePath(`/experiences/${id}`);
  revalidatePath('/');

  return NextResponse.json({ ok: true, forum_thread_id: thread?.id || null }, { status: 200 });
}
