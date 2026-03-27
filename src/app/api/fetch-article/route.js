export const runtime = 'nodejs';

// Extracts readable paragraphs from raw HTML
function extractContent(html) {
  // Remove scripts, styles, nav, header, footer, ads
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside[\s\S]*?<\/aside>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  // Try to find article/main body first
  const articleMatch = cleaned.match(/<article[\s\S]*?<\/article>/i) ||
                       cleaned.match(/<main[\s\S]*?<\/main>/i) ||
                       cleaned.match(/class="[^"]*(?:article|content|story|post|body)[^"]*"[\s\S]*?>([\s\S]*?)<\/(?:div|section)/i);

  const source = articleMatch ? articleMatch[0] : cleaned;

  // Extract all <p> tag contents
  const paragraphs = [];
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = pRegex.exec(source)) !== null) {
    const text = match[1]
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ').trim();
    if (text.length > 40) paragraphs.push(text);
  }

  return paragraphs;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) return Response.json({ error: 'No URL' }, { status: 400 });

  try {
    // Follow redirects to resolve Google News URLs to real article URL
    const res = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9,ml;q=0.8',
      },
      signal: AbortSignal.timeout(8000),
    });

    const finalUrl = res.url; // actual article URL after redirect
    const html = await res.text();
    const paragraphs = extractContent(html);

    // Extract og:image for article image
    const imgMatch = html.match(/<meta[^>]+(?:property="og:image"|name="twitter:image")[^>]+content="([^"]+)"/i) ||
                     html.match(/content="([^"]+)"[^>]+property="og:image"/i);
    const image = imgMatch ? imgMatch[1] : null;

    return Response.json({
      paragraphs,
      finalUrl,
      image,
      success: paragraphs.length > 0,
    });
  } catch (e) {
    return Response.json({ error: e.message, success: false }, { status: 200 });
  }
}
