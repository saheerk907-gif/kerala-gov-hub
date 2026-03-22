import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  // Only allow keralaservice.org and our own Supabase storage
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const allowed =
    url.startsWith('https://keralaservice.org/') ||
    (SUPABASE_URL && url.startsWith(SUPABASE_URL));

  if (!allowed) {
    return new NextResponse('URL not allowed', { status: 403 });
  }

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!res.ok) {
      return new NextResponse('Failed to fetch PDF', { status: 502 });
    }

    const contentType = res.headers.get('content-type') || 'application/pdf';
    const body = await res.arrayBuffer();

    // Extract a filename from the URL for the download prompt
    const filename = url.split('/').pop()?.split('?')[0] || 'document.pdf';

    return new NextResponse(body, {
      headers: {
        'Content-Type': contentType.includes('pdf') ? 'application/pdf' : contentType,
        'Content-Disposition': `attachment; filename="${filename}.pdf"`,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch {
    return new NextResponse('Error fetching PDF', { status: 500 });
  }
}
