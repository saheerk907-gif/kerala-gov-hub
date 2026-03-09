import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
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
