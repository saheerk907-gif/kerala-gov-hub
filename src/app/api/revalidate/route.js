import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const secret = request.headers.get('x-revalidate-secret');
    if (!secret || secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, slug, type } = await request.json();

    if (type === 'act') {
      if (slug) revalidatePath(`/acts-rules/${slug}`);
      revalidatePath('/acts-rules');
    } else {
      if (id) revalidatePath(`/articles/${id}`);
      revalidatePath('/articles');
    }
    revalidatePath('/');
    return NextResponse.json({ revalidated: true });
  } catch {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}
