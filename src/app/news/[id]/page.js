import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

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
        <main className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center text-[#6e6e73]">
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

  return (
    <>
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
              <span className="capitalize text-[#2997ff]">{item.category || 'news'}</span>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-5"
              style={{ background: '#2997ff15', color: '#2997ff', border: '1px solid #2997ff25' }}>
              {item.category || 'news'}
            </span>
            <h1 className="text-[clamp(24px,4vw,44px)] font-black tracking-tight leading-[1.15] mb-5"
              style={{ fontFamily: "'Meera', sans-serif" }}>
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
            <div className="text-[17px] text-[#aeaeb2] leading-relaxed mb-10 pl-5 border-l-2 border-[#2997ff]"
              style={{ fontFamily: "'Meera', sans-serif" }}>
              {item.summary_ml}
            </div>
          )}
          {item.content_ml ? (
            <div className="article-content" dangerouslySetInnerHTML={{ __html: item.content_ml }} />
          ) : (
            <div className="text-[#6e6e73] text-sm italic">വിശദാംശങ്ങൾ ലഭ്യമല്ല.</div>
          )}
          <div className="mt-16 pt-8 border-t border-white/[0.06]">
            <a href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold no-underline transition-all"
              style={{ background: '#2997ff15', color: '#2997ff', border: '1px solid #2997ff30' }}>
              ← Home
            </a>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .article-content { font-family: 'Meera', Georgia, serif; line-height: 1.9; color: #aeaeb2; font-size: 1rem; }
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
