import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { buildArticleJsonLd } from '@/lib/seo';

export const dynamic = 'force-dynamic';

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
    twitter: { card: 'summary_large_image', title, description, images: item.image_url ? [item.image_url] : [] },
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
        <main className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center text-[#6e6e73]">
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
      <main className="min-h-screen bg-black text-white">
        {/* Hero */}
        <div className="relative pt-32 pb-12 px-6 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0a0a12 0%, #050508 60%, #000 100%)' }}>
          <div className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, #2997ff20, transparent)' }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #2997ff30, transparent)' }} />
          <div className="relative max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-[#6e6e73] mb-8">
              <a href="/" className="hover:text-white transition-colors no-underline text-[#6e6e73]">Home</a>
              <span>›</span>
              <a href="/articles" className="hover:text-white transition-colors no-underline text-[#6e6e73]">ലേഖനങ്ങൾ</a>
              <span>›</span>
              <span className="capitalize text-[#2997ff]">{item.category || 'general'}</span>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-5"
              style={{ background: '#2997ff15', color: '#2997ff', border: '1px solid #2997ff25' }}>
              {item.category || 'general'}
            </span>
            <h1 className="text-[clamp(24px,4vw,44px)] font-black tracking-tight leading-[1.15] mb-5"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              {item.title_ml}
            </h1>
            {item.title_en && (
              <p className="text-base text-[#6e6e73] mb-4 font-medium">{item.title_en}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-[#6e6e73]">
              <span>{new Date(item.created_at).toLocaleDateString('ml-IN', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}</span>
              {item.source_url && (
                <a href={item.source_url} target="_blank" rel="noopener noreferrer"
                  className="hover:text-white transition-colors no-underline text-[#6e6e73]">
                  Source ↗
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-12">
          {item.image_url && (
            <img src={item.image_url} alt={item.title_ml}
              className="w-full rounded-2xl object-cover mb-10"
              style={{ maxHeight: '420px' }} />
          )}

          {item.summary_ml && (
            <p className="text-[17px] text-[#aeaeb2] leading-relaxed mb-10 pl-5 border-l-2 border-[#2997ff]"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              {stripHtml(item.summary_ml)}
            </p>
          )}

          {item.content_ml && (
            <div className="article-content" dangerouslySetInnerHTML={{ __html: item.content_ml }} />
          )}

          {item.internal_link && (
            <div className="mt-8 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              style={{ background: 'rgba(48,209,88,0.05)', border: '1px solid rgba(48,209,88,0.2)' }}>
              <div className="flex-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#30d158] mb-1">Related Page</div>
                <p className="text-sm text-[#86868b]" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
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

          <div className="mt-12 pt-8 border-t border-white/[0.06] flex gap-3">
            <a href="/articles" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold no-underline transition-all"
              style={{ background: '#2997ff15', color: '#2997ff', border: '1px solid #2997ff30' }}>
              ← ലേഖനങ്ങൾ
            </a>
            <a href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold no-underline transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
              Home
            </a>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .article-content { font-family: var(--font-noto-malayalam), Georgia, serif; line-height: 1.9; color: #aeaeb2; font-size: 1rem; }
          .article-content h2 { font-size: 1.4rem; font-weight: 800; color: white; margin: 2.5rem 0 1rem; }
          .article-content h3 { font-size: 1.1rem; font-weight: 700; color: #e5e5e7; margin: 2rem 0 0.75rem; padding-left: 12px; border-left: 3px solid #2997ff; }
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
        ` }} />
      </main>
      <Footer />
    </>
  );
}
