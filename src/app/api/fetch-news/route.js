import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// RSS feeds related to Kerala government employees
const RSS_FEEDS = [
  {
    url: 'https://news.google.com/rss/search?q=kerala+government+employees+salary+pension+DA&hl=en&gl=IN&ceid=IN:en',
    lang: 'en',
  },
  {
    url: 'https://news.google.com/rss/search?q=kerala+finance+department+government+order+pay+revision&hl=en&gl=IN&ceid=IN:en',
    lang: 'en',
  },
  {
    url: 'https://news.google.com/rss/search?q=%E0%B4%95%E0%B5%87%E0%B4%B0%E0%B4%B3+%E0%B4%9C%E0%B5%80%E0%B4%B5%E0%B4%A8%E0%B4%95%E0%B5%8D%E0%B4%95%E0%B4%BE%E0%B4%B0%E0%B5%8D+%E0%B4%B6%E0%B4%AE%E0%B5%8D%E0%B4%AA%E0%B4%B3%E0%B4%82&hl=ml&gl=IN&ceid=IN:ml',
    lang: 'ml',
  },
];

// Keywords to filter relevant articles
const KEYWORDS_EN = [
  'kerala government', 'kerala employees', 'kerala service',
  'da revision', 'pay revision', 'prc', 'salary', 'pension',
  'dcrg', 'gratuity', 'gpf', 'medisep', 'nps', 'spark',
  'treasury', 'finance department', 'secretariat',
];
const KEYWORDS_ML = [
  'ജീവനക്കാർ', 'ശമ്പളം', 'പെൻഷൻ', 'ക്ഷാമബത്ത', 'ഡി.എ',
  'സർക്കാർ', 'ഉത്തരവ്', 'ട്രഷറി', 'ഫിനാൻസ്',
];

// ─── Parse RSS XML manually (no extra deps) ───────────────────────────────────
function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const title   = decode(extract(block, 'title'));
    const link    = decode(extract(block, 'link') || extract(block, 'guid'));
    const desc    = decode(strip(extract(block, 'description')));
    const pubDate = extract(block, 'pubDate');

    // Extract image from media:content or enclosure
    const imgMatch = block.match(/url="([^"]+\.(jpg|png|jpeg|webp)[^"]*)"/i)
      || block.match(/<media:content[^>]+url="([^"]+)"/i);
    const image = imgMatch ? imgMatch[1] : null;

    if (title && link) {
      items.push({ title, link, desc, pubDate, image });
    }
  }
  return items;
}

function extract(str, tag) {
  const m = str.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i'))
    || str.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return m ? m[1].trim() : '';
}
function strip(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
function decode(str) {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .trim();
}

// ─── Resolve Google News redirect to the actual article URL ───────────────────
async function resolveGoogleNewsUrl(url) {
  if (!url.includes('news.google.com')) return url;
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(6000),
    });
    // res.url is the final URL after all redirects
    const finalUrl = res.url;
    return finalUrl && !finalUrl.includes('news.google.com') ? finalUrl : url;
  } catch {
    return url;
  }
}

// ─── Check if article is relevant ─────────────────────────────────────────────
function isRelevant(title, desc, lang) {
  const text  = (title + ' ' + desc).toLowerCase();
  const words = lang === 'ml' ? KEYWORDS_ML : KEYWORDS_EN;
  return words.some(kw => text.includes(kw.toLowerCase()));
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function GET(request) {
  // Verify cron secret (set CRON_SECRET in Vercel env vars)
  const secret = request.headers.get('x-cron-secret')
    || new URL(request.url).searchParams.get('secret');
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Use service role key to bypass RLS for inserts
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  const results = { fetched: 0, inserted: 0, skipped: 0, errors: [] };

  for (const feed of RSS_FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KeralaGovHub/1.0)' },
        next: { revalidate: 0 },
      });
      if (!res.ok) { results.errors.push(`${feed.url}: ${res.status}`); continue; }

      const xml   = await res.text();
      const items = parseRSS(xml);
      results.fetched += items.length;

      for (const item of items) {
        if (!isRelevant(item.title, item.desc, feed.lang)) { results.skipped++; continue; }

        // Check duplicate by original Google News link first (covers old records)
        const { data: existingByLink } = await supabase
          .from('news')
          .select('id')
          .eq('source_url', item.link)
          .maybeSingle();

        if (existingByLink) { results.skipped++; continue; }

        // Resolve Google News redirect to the actual article URL
        const resolvedUrl = await resolveGoogleNewsUrl(item.link);

        // Also check duplicate by resolved URL (covers records already stored with resolved URL)
        if (resolvedUrl !== item.link) {
          const { data: existingByResolved } = await supabase
            .from('news')
            .select('id')
            .eq('source_url', resolvedUrl)
            .maybeSingle();
          if (existingByResolved) { results.skipped++; continue; }
        }

        // Insert with the resolved (real) article URL
        const { error } = await supabase.from('news').insert({
          title_en:   item.title,
          title_ml:   feed.lang === 'ml' ? item.title : item.title, // same for now
          summary_ml: item.desc?.slice(0, 300) || '',
          content_ml: item.desc || '',
          category:   'news',
          source_url: resolvedUrl,
          image_url:  item.image || null,
          created_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        });

        if (error) {
          results.errors.push(`Insert failed: ${error.message}`);
        } else {
          results.inserted++;
        }
      }
    } catch (err) {
      results.errors.push(`${feed.url}: ${err.message}`);
    }
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    ...results,
  });
}
