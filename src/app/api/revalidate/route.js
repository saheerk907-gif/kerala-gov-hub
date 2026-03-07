import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { id } = await request.json();
    // Revalidate the specific article page and the articles listing
    if (id) revalidatePath(`/articles/${id}`);
    revalidatePath('/articles');
    revalidatePath('/');
    return NextResponse.json({ revalidated: true });
  } catch {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}
