import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { buildArticleJsonLd } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = params;
  const { data: item } = await supabase.from('news').select('title_ml,title_en,summary_ml,image_url,created_at').eq('id', id).single();
  if (!item) return { title: 'വാർത്ത | Kerala Employees' };
  const title = item.title_en || item.title_ml;
  const description = item.summary_ml ? item.summary_ml.replace(/<[^>]+>/g, '').slice(0, 160) : title;
  const url = `https://keralaemployees.in/news/${id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: item.created_at,
      images: item.image_url ? [{ url: item.image_url }] : [],
    },
    twitter: { card: 'summary_large_image', title, description, images: item.image_url ? [item.image_url] : [] },
  };
}

// Strip HTML tags and decode entities
function stripHtml(html = '') {
  return html
    // decode entities first so tags become visible to the next step
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    // strip all tags
    .replace(/<[^>]*>/g, ' ')
    // decode any remaining entities
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

// Returns true if content is just a link/RSS stub, not a real article body
function isJustHtml(str = '') {
  if (!str) return true;
  if (str.includes('news.google.com')) return true;
  const text = stripHtml(str).trim();
  return text.length < 120;
}

// Extract source domain from URL for display
function sourceDomain(url = '') {
  try { return new URL(url).hostname.replace('www.', ''); } catch { return ''; }
}

// Extracts readable paragraphs from raw HTML
function extractContent(html) {
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside[\s\S]*?<\/aside>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  const articleMatch = cleaned.match(/<article[\s\S]*?<\/article>/i) ||
                       cleaned.match(/<main[\s\S]*?<\/main>/i) ||
                       cleaned.match(/class="[^"]*(?:article|content|story|post|body)[^"]*"[\s\S]*?>([\s\S]*?)<\/(?:div|section)/i);

  const source = articleMatch ? articleMatch[0] : cleaned;
  const paragraphs = [];
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = pRegex.exec(source)) !== null) {
    const text = match[1]
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ').trim();
    if (text.length > 40) paragraphs.push(text);
  }
  return paragraphs;
}

// Server-side fetch of full article content
async function fetchArticleContent(url) {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9,ml;q=0.8',
      },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 3600 },
    });
    const html = await res.text();
    const paragraphs = extractContent(html);
    const imgMatch = html.match(/<meta[^>]+(?:property="og:image"|name="twitter:image")[^>]+content="([^"]+)"/i) ||
                     html.match(/content="([^"]+)"[^>]+property="og:image"/i);
    return { paragraphs, image: imgMatch ? imgMatch[1] : null };
  } catch {
    return { paragraphs: [], image: null };
  }
}

export default async function NewsDetailPage({ params }) {
  const { id } = params;

  const { data: item, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !item) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-aurora flex items-center justify-center">
          <div className="text-center text-white/60">
            <div className="text-5xl mb-4">📭</div>
            <p>ലേഖനം കണ്ടെത്താനായില്ല</p>
            <a href="/" className="inline-block mt-6 px-6 py-3 rounded-xl text-sm font-bold no-underline"
              style={{ background: '#2997ff15', color: '#2997ff', border: '1px solid #2997ff30' }}>
              ← Home
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // For RSS articles without real content, fetch the full article server-side
  const needsFetch = isJustHtml(item.content_ml) && item.source_url;
  const fetched = needsFetch ? await fetchArticleContent(item.source_url) : { paragraphs: [], image: null };
  const displayImage = item.image_url || fetched.image;

  const articleJsonLd = buildArticleJsonLd({
    title: item.title_en || item.title_ml,
    description: item.summary_ml ? stripHtml(item.summary_ml).slice(0, 160) : item.title_ml,
    url: `https://keralaemployees.in/news/${id}`,
    image: displayImage,
    datePublished: item.created_at,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <Navbar />
      <main className="min-h-screen bg-aurora text-white">
        {/* Hero */}
        <div className="relative pt-32 pb-12 px-6 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0a0a12 0%, #050508 60%, #000 100%)' }}>
          <div className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, #2997ff20, transparent)' }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #2997ff30, transparent)' }} />
          <div className="relative max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-white/60 mb-8">
              <a href="/" className="hover:text-white transition-colors no-underline text-white/60 hover:text-white">Home</a>
              <span>›</span>
              <span className="capitalize text-[#2997ff]">{item.category || 'news'}</span>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-5"
              style={{ background: '#2997ff15', color: '#2997ff', border: '1px solid #2997ff25' }}>
              {item.category || 'news'}
            </span>
            <h1 className="text-[clamp(24px,4vw,44px)] font-black tracking-tight leading-[1.15] mb-5"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              {item.title_ml}
            </h1>
            {item.title_en && (
              <p className="text-base text-white/70 mb-4 font-medium">{item.title_en}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-white/60">
              <span>{new Date(item.created_at).toLocaleDateString('ml-IN', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}</span>
              {item.source_url && (
                <a href={item.source_url} target="_blank" rel="noopener noreferrer"
                  className="hover:text-white transition-colors no-underline text-white/60">
                  Source ↗
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-12">
          {displayImage && (
            <img src={displayImage} alt={item.title_ml}
              className="w-full rounded-2xl object-cover mb-10"
              style={{ maxHeight: '420px' }} />
          )}

          {item.content_ml && !isJustHtml(item.content_ml) ? (
            /* Admin-written article with real content */
            <>
              {item.summary_ml && !isJustHtml(item.summary_ml) && (
                <p className="text-[17px] text-[#aeaeb2] leading-relaxed mb-10 pl-5 border-l-2 border-[#2997ff]"
                  style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                  {stripHtml(item.summary_ml)}
                </p>
              )}
              <div className="article-content" dangerouslySetInnerHTML={{ __html: item.content_ml }} />
              {item.internal_link && (
                <div className="mt-8 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  style={{ background: 'rgba(48,209,88,0.05)', border: '1px solid rgba(48,209,88,0.2)' }}>
                  <div className="flex-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#30d158] mb-1">Related Page</div>
                    <p className="text-sm text-white/70" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                      ഈ വിഷയത്തെ കുറിച്ചുള്ള കൂടുതൽ വിവരങ്ങൾ ഇവിടെ ലഭ്യമാണ്.
                    </p>
                  </div>
                  <a href={item.internal_link}
                    className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold no-underline transition-all hover:scale-[1.02]"
                    style={{ background: '#30d158', color: 'white' }}>
                    കൂടുതൽ വായിക്കുക →
                  </a>
                </div>
              )}
            </>
          ) : (
            /* RSS article — show fetched full content inline */
            <div className="space-y-8">
              {/* Summary lead */}
              {item.summary_ml && !isJustHtml(item.summary_ml) && (
                <p className="text-[17px] text-[#aeaeb2] leading-relaxed pl-5 border-l-2 border-[#2997ff]"
                  style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                  {stripHtml(item.summary_ml)}
                </p>
              )}

              {/* Fetched article paragraphs */}
              {fetched.paragraphs.length > 0 ? (
                <div className="space-y-4">
                  {fetched.paragraphs.map((para, i) => (
                    <p key={i} className="text-[15px] text-[#c7c7cc] leading-[1.85]"
                      style={{ fontFamily: "var(--font-noto-malayalam), Georgia, serif" }}>
                      {para}
                    </p>
                  ))}
                </div>
              ) : (
                /* Fallback if scraping failed */
                item.source_url && (
                  <div className="rounded-2xl p-6"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="text-sm text-white/70 mb-4">
                      ഈ വാർത്ത ഒറിജിനൽ വെബ്‌സൈറ്റിൽ നിന്ന് ഓട്ടോമാറ്റിക്കായി ശേഖരിച്ചതാണ്.
                    </p>
                    <a href={item.source_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold no-underline transition-all hover:scale-[1.02]"
                      style={{ background: '#2997ff', color: 'white' }}>
                      പൂർണ്ണ ലേഖനം വായിക്കുക ↗
                    </a>
                  </div>
                )
              )}

              {/* Source attribution */}
              {item.source_url && (
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  <span className="text-[11px] text-white/45 uppercase tracking-widest">
                    Source · {sourceDomain(item.source_url)}
                  </span>
                  <a href={item.source_url} target="_blank" rel="noopener noreferrer"
                    className="text-[12px] text-[#2997ff] no-underline hover:underline">
                    Original article ↗
                  </a>
                </div>
              )}

              {/* Admin-set internal link CTA */}
              {item.internal_link && (
                <div className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  style={{ background: 'rgba(48,209,88,0.05)', border: '1px solid rgba(48,209,88,0.2)' }}>
                  <div className="flex-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#30d158] mb-1">Related Page</div>
                    <p className="text-sm text-white/70" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                      ഈ വിഷയത്തെ കുറിച്ചുള്ള കൂടുതൽ വിവരങ്ങൾ ഇവിടെ ലഭ്യമാണ്.
                    </p>
                  </div>
                  <a href={item.internal_link}
                    className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold no-underline transition-all hover:scale-[1.02]"
                    style={{ background: '#30d158', color: 'white' }}>
                    കൂടുതൽ വായിക്കുക →
                  </a>
                </div>
              )}

              {/* Related tools */}
              <div className="rounded-2xl p-5"
                style={{ background: 'rgba(200,150,12,0.04)', border: '1px solid rgba(200,150,12,0.12)' }}>
                <div className="text-[10px] font-black uppercase tracking-widest text-[#c8960c] mb-3">Related Tools</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'DA Arrear Calculator', href: '/da-arrear' },
                    { label: 'Pension Calculator', href: '/pension' },
                    { label: 'PRC Calculator', href: '/prc' },
                    { label: 'NPS vs APS', href: '/nps-aps' },
                  ].map(t => (
                    <a key={t.href} href={t.href}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold no-underline transition-all hover:scale-105"
                      style={{ background: 'rgba(200,150,12,0.1)', color: '#c8960c', border: '1px solid rgba(200,150,12,0.2)' }}>
                      {t.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-white/[0.06]">
            <a href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold no-underline transition-all"
              style={{ background: '#2997ff15', color: '#2997ff', border: '1px solid #2997ff30' }}>
              ← Home
            </a>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .article-content { font-family: var(--font-noto-malayalam), Georgia, serif; line-height: 1.9; color: #aeaeb2; font-size: 1rem; }
          .article-content h2 { font-size: 1.4rem; font-weight: 800; color: white; margin: 2.5rem 0 1rem; text-align: justify; }
          .article-content h3 { font-size: 1.1rem; font-weight: 700; color: #e5e5e7; margin: 2rem 0 0.75rem; padding-left: 12px; border-left: 3px solid #2997ff; text-align: justify; }
          .article-content p { margin-bottom: 1.25rem; }
          .article-content b, .article-content strong { color: white; font-weight: 700; }
          .article-content a { color: #2997ff; text-decoration: underline; }
          .article-content ul { list-style: none; padding: 0; margin: 1rem 0 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
          .article-content ul li { padding: 0.85rem 1.1rem 0.85rem 2rem; background: rgba(41,151,255,0.04); border: 1px solid rgba(41,151,255,0.1); border-radius: 10px; position: relative; }
          .article-content ul li::before { content: '✦'; color: #2997ff; font-size: 0.55rem; position: absolute; left: 0.85rem; top: 1.05rem; }
          .article-content ol { list-style: decimal; padding-left: 1.5rem; }
          .article-content ol li { padding: 0.3rem 0; }
          .article-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
          .article-content th { background: rgba(41,151,255,0.1); color: white; padding: 10px 14px; text-align: left; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; }
          .article-content td { padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 0.9rem; }
          .article-content .ql-align-justify { text-align: justify; }
          .article-content .ql-align-center  { text-align: center; }
          .article-content .ql-align-right   { text-align: right; }
          .article-content .ql-align-left    { text-align: left; }
        ` }} />
      </main>
      <Footer />
    </>
  );
}
