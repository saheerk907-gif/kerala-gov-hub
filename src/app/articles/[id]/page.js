import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { buildArticleJsonLd } from '@/lib/seo';
import { sanitize } from '@/lib/sanitize';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { id } = params;
  const { data: item } = await supabase
    .from('articles')
    .select('title_ml,title_en,summary_ml,image_url,created_at')
    .eq('id', id)
    .single();
  if (!item) return { title: 'ലേഖനം | Kerala Employees' };
  const title = item.title_en || item.title_ml;
  const description = item.summary_ml ? item.summary_ml.replace(/<[^>]+>/g, '').slice(0, 160) : title;
  const url = `https://keralaemployees.in/articles/${id}`;
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
    twitter: { card: 'summary_large_image', title, description, images: item.image_url ? [{ url: item.image_url }] : [] },
  };
}

function stripHtml(html = '') {
  return html
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

export default async function ArticleDetailPage({ params }) {
  const { id } = params;

  const { data: item, error } = await supabase
    .from('articles')
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
            <a href="/articles" className="inline-block mt-6 px-6 py-3 rounded-xl text-sm font-bold no-underline"
              style={{ background: '#2997ff15', color: '#2997ff', border: '1px solid #2997ff30' }}>
              ← ലേഖനങ്ങൾ
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const articleJsonLd = buildArticleJsonLd({
    title: item.title_en || item.title_ml,
    description: item.summary_ml ? stripHtml(item.summary_ml).slice(0, 160) : item.title_ml,
    url: `https://keralaemployees.in/articles/${id}`,
    image: item.image_url,
    datePublished: item.created_at,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <Navbar />
      <main className="min-h-screen bg-aurora">
        {/* Hero */}
        <div className="article-hero relative pt-32 pb-12 px-6 overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, #2997ff20, transparent)' }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #2997ff30, transparent)' }} />
          <div className="relative max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-xs mb-8" style={{ color: 'var(--text-faint)' }}>
              <a href="/" className="no-underline transition-colors" style={{ color: 'var(--text-faint)' }}>Home</a>
              <span>›</span>
              <a href="/articles" className="no-underline transition-colors" style={{ color: 'var(--text-faint)' }}>ലേഖനങ്ങൾ</a>
              <span>›</span>
              <span className="capitalize" style={{ color: 'var(--accent-blue)' }}>{item.category || 'general'}</span>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-5"
              style={{ background: 'rgba(41,151,255,0.12)', color: 'var(--accent-blue)', border: '1px solid rgba(41,151,255,0.22)' }}>
              {item.category || 'general'}
            </span>
            <h1 className="text-[clamp(24px,4vw,44px)] font-black tracking-tight leading-[1.15] mb-5"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif", color: 'var(--text-primary)' }}>
              {item.title_ml}
            </h1>
            {item.title_en && (
              <p className="text-base mb-4 font-medium" style={{ color: 'var(--text-secondary)' }}>{item.title_en}</p>
            )}
            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-faint)' }}>
              <span>{new Date(item.created_at).toLocaleDateString('ml-IN', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}</span>
              {item.source_url && (
                <a href={item.source_url} target="_blank" rel="noopener noreferrer"
                  className="no-underline transition-colors" style={{ color: 'var(--text-faint)' }}>
                  Source ↗
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-12">
          {item.image_url && (
            <Image src={item.image_url} alt={item.title_ml}
              width={1200} height={630}
              className="w-full rounded-2xl object-cover mb-10"
              style={{ maxHeight: '420px' }}
              loading="eager" />
          )}

          {item.summary_ml && (
            <p className="text-[17px] leading-relaxed mb-10 pl-5 border-l-2 border-[#2997ff]"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif", color: 'var(--text-secondary)' }}>
              {stripHtml(item.summary_ml)}
            </p>
          )}

          {item.content_ml && (
            <div className="article-content" dangerouslySetInnerHTML={{ __html: sanitize(item.content_ml) }} />
          )}

          {item.internal_link && item.internal_link.startsWith('/') && !item.internal_link.startsWith('//') && (
            <div className="mt-8 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              style={{ background: 'rgba(48,209,88,0.06)', border: '1px solid rgba(48,209,88,0.22)' }}>
              <div className="flex-1">
                <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--accent-green)' }}>Related Page</div>
                <p className="text-sm" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif", color: 'var(--text-secondary)' }}>
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

          <div className="mt-12 pt-8 flex gap-3" style={{ borderTop: '1px solid var(--border)' }}>
            <a href="/articles" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold no-underline transition-all"
              style={{ background: 'rgba(41,151,255,0.12)', color: 'var(--accent-blue)', border: '1px solid rgba(41,151,255,0.22)' }}>
              ← ലേഖനങ്ങൾ
            </a>
            <a href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold no-underline transition-all"
              style={{ background: 'var(--surface-xs)', color: 'var(--text-faint)' }}>
              Home
            </a>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          /* ── Article hero background ── */
          .article-hero { background: linear-gradient(135deg, #0a0a12 0%, #050508 60%, #000 100%); }
          [data-theme="light"] .article-hero { background: linear-gradient(135deg, #f8f4ee 0%, #f5f0e8 80%, #ede8df 100%); }

          /* ── Article body ── */
          .article-content { font-family: var(--font-ibm-plex-mono), var(--font-noto-malayalam), monospace; line-height: 1.9; color: var(--text-secondary); font-size: 1rem; }
          .article-content h2 { font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin: 2.5rem 0 1rem; text-align: justify; }
          .article-content h3 { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin: 2rem 0 0.75rem; padding-left: 12px; border-left: 3px solid var(--accent-blue); text-align: justify; }
          .article-content p { margin-bottom: 1.25rem; }
          .article-content b, .article-content strong { color: var(--text-primary); font-weight: 700; }
          .article-content a { color: var(--accent-blue); text-decoration: underline; }
          .article-content ul { list-style: none; padding: 0; margin: 1rem 0 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
          .article-content ul li { padding: 0.85rem 1.1rem 0.85rem 2rem; background: var(--surface-xs); border: 1px solid var(--border-xs); border-radius: 10px; position: relative; }
          .article-content ul li::before { content: '✦'; color: var(--accent-blue); font-size: 0.55rem; position: absolute; left: 0.85rem; top: 1.05rem; }
          .article-content ol { list-style: decimal; padding-left: 1.5rem; }
          .article-content ol li { padding: 0.3rem 0; }
          .article-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
          .article-content th { background: var(--surface-sm); color: var(--text-primary); padding: 10px 14px; text-align: left; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid var(--border-sm); }
          .article-content td { padding: 10px 14px; border-bottom: 1px solid var(--border-xs); font-size: 0.9rem; color: var(--text-secondary); }
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
