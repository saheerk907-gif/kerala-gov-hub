import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 60;

export const metadata = buildMetadata({
  title: 'Kerala Service Rules (KSR) — Complete Guide',
  description: 'Complete guide to Kerala Service Rules (KSR) for government employees — leave rules, pay, promotion, transfer, pension, and disciplinary proceedings.',
  path: '/ksr',
  keywords: ['Kerala Service Rules', 'KSR', 'Kerala government service rules', 'KSR leave rules', 'KSR pay rules'],
});

export default async function KsrPage() {
  const [{ data }, { data: articles }] = await Promise.all([
    supabase.from('schemes').select('*').eq('slug', 'ksr').single(),
    supabase.from('news').select('*').eq('category', 'ksr').order('created_at', { ascending: false }),
  ]);

  const scheme = data || {};
  const posts = articles || [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white">
        <div className="relative pt-32 pb-20 px-6 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #001228 0%, #000a1a 60%, #000 100%)' }}>
          <div className="absolute inset-0 opacity-30"
            style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, #2997ff30, transparent)' }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #2997ff50, transparent)' }} />

          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-[#6e6e73] mb-8">
              <a href="/" className="hover:text-white transition-colors no-underline text-[#6e6e73]">Home</a>
              <span>›</span>
              <span className="text-[#2997ff]">KSR</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
              style={{ color: '#2997ff', border: '1px solid #2997ff30', background: '#2997ff10' }}>
              📖 Service Rules
            </div>
            <h1 className="text-[clamp(36px,6vw,64px)] font-black tracking-tight leading-[1.05] mb-4">
              {scheme.title_ml || 'കേരള സർവ്വീസ് ചട്ടങ്ങൾ'}
            </h1>
            <p className="text-lg text-[#6e6e73] font-medium mb-4">Kerala Service Rules — Government Employees Handbook</p>
            {scheme.description_ml && (
              <p className="text-base text-[#86868b] leading-relaxed max-w-2xl">{scheme.description_ml}</p>
            )}
            <div className="grid grid-cols-3 gap-4 mt-10 max-w-xl">
              {[
                { label: 'Parts', value: 'I–III' },
                { label: 'Applicable', value: 'All Staff' },
                { label: 'Authority', value: 'Finance Dept' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-xl font-black text-[#2997ff]">{s.value}</div>
                  <div className="text-[10px] text-[#6e6e73] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16">
          {scheme.content_ml && (
            <div className="scheme-content mb-16" dangerouslySetInnerHTML={{ __html: scheme.content_ml }} />
          )}

          {posts.length > 0 && (
            <div>
              <h2 className="text-2xl font-black text-white mb-8">KSR ലേഖനങ്ങൾ</h2>
              <div className="flex flex-col gap-4">
                {posts.map(post => (
                  <Link key={post.id} href={`/news/${post.id}`}
                    className="group block p-6 rounded-2xl no-underline transition-all hover:-translate-y-0.5"
                    style={{ background: 'rgba(41,151,255,0.04)', border: '1px solid rgba(41,151,255,0.12)' }}>
                    {post.image_url && (
                      <img src={post.image_url} alt="" className="w-full h-48 object-cover rounded-xl mb-4" />
                    )}
                    <div className="text-xs text-[#2997ff] font-bold uppercase tracking-widest mb-2">
                      {new Date(post.created_at).toLocaleDateString('ml-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <h3 className="text-lg font-bold text-white/90 group-hover:text-white mb-2 transition-colors"
                      style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                      {post.title_ml}
                    </h3>
                    {post.summary_ml && (
                      <p className="text-sm text-[#86868b] leading-relaxed line-clamp-3">{post.summary_ml}</p>
                    )}
                    <span className="inline-block mt-3 text-xs font-bold text-[#2997ff]">വായിക്കുക →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!scheme.content_ml && posts.length === 0 && (
            <div className="text-center py-20 text-[#6e6e73]">
              <div className="text-5xl mb-4">📖</div>
              <p>Content coming soon.</p>
            </div>
          )}

          <div className="mt-16 pt-8 border-t border-white/[0.06]">
            <a href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold no-underline transition-all"
              style={{ background: '#2997ff15', color: '#2997ff', border: '1px solid #2997ff30' }}>
              ← Back to Home
            </a>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .scheme-content { font-family: Georgia, serif; line-height: 1.8; color: #e5e5e7; }
          .scheme-content h3 { font-size: 1.1rem; font-weight: 700; color: #2997ff; margin: 2rem 0 0.75rem; padding-left: 12px; border-left: 3px solid #2997ff; }
          .scheme-content p { margin-bottom: 1.25rem; color: #aeaeb2; font-size: 0.95rem; }
          .scheme-content b, .scheme-content strong { color: white; font-weight: 700; }
          .scheme-content ul { list-style: none; padding: 0; margin: 1rem 0 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
          .scheme-content ul li { padding: 0.85rem 1.1rem 0.85rem 2rem; background: rgba(41,151,255,0.04); border: 1px solid rgba(41,151,255,0.12); border-radius: 12px; font-size: 0.9rem; color: #aeaeb2; position: relative; }
          .scheme-content ul li::before { content: '✦'; color: #2997ff; font-size: 0.6rem; position: absolute; left: 0.85rem; top: 1rem; }
        ` }} />
      </main>
      <Footer />
    </>
  );
}
