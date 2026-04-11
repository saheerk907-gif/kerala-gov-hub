import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 60;

export const metadata = buildMetadata({
  title: 'GPF Kerala 2026 – Interest Rate, Advance, Withdrawal & Balance Calculator',
  description: 'GPF (General Provident Fund) for Kerala government employees: current interest rate 7.1%, how to apply for advance, withdrawal rules, final settlement, and GPF balance check. All Kerala Treasury GPF rules explained.',
  path: '/gpf',
  keywords: [
    'GPF Kerala',
    'GPF interest rate Kerala 2026',
    'GPF advance Kerala government',
    'GPF withdrawal rules Kerala',
    'Kerala GPF balance check',
    'General Provident Fund Kerala employees',
    'GPF final settlement Kerala',
    'GPF subscription rate Kerala',
    'GPF ജീവനക്കാർ',
    'GPF കേരള 2026',
    'Kerala treasury GPF',
    'GPF loan Kerala govt',
  ],
});

export default async function GpfPage() {
  const [{ data }, { data: articles }] = supabase ? await Promise.all([
    supabase.from('schemes').select('*').eq('slug', 'gpf').single(),
    supabase.from('news').select('*').eq('category', 'gpf').order('created_at', { ascending: false }),
  ]) : [{ data: null }, { data: [] }];

  const scheme = data || {};
  const posts = articles || [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-aurora text-white">
        <div className="relative pt-32 pb-20 px-6 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #001a08 0%, #000f05 60%, #000 100%)' }}>
          <div className="absolute inset-0 opacity-30"
            style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, #30d15830, transparent)' }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #30d15850, transparent)' }} />

          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-white/60 mb-8">
              <a href="/" className="hover:text-white transition-colors no-underline text-white/60">Home</a>
              <span>›</span>
              <span className="text-[#30d158]">GPF</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
              style={{ color: '#30d158', border: '1px solid #30d15830', background: '#30d15810' }}>
              💰 Provident Fund
            </div>
            <h1 className="text-[clamp(36px,6vw,64px)] font-black tracking-tight leading-[1.05] mb-4">
              {scheme.title_ml || 'ജനറൽ പ്രൊവിഡന്റ് ഫണ്ട്'}
            </h1>
            <p className="text-lg text-white/75 font-medium mb-4">General Provident Fund — Mandatory Savings for Government Employees</p>
            {scheme.description_ml && (
              <p className="text-base text-white/70 leading-relaxed max-w-2xl">{scheme.description_ml}</p>
            )}
            <div className="grid grid-cols-3 gap-4 mt-10 max-w-xl">
              {[
                { label: 'Min Contribution', value: '6%' },
                { label: 'Interest Rate', value: '7.1%' },
                { label: 'Tax Benefit', value: '80C' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-xl font-black text-[#30d158]">{s.value}</div>
                  <div className="text-[10px] text-white/65 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16">
          {scheme.content_ml && (
            <div className="scheme-content mb-16" dangerouslySetInnerHTML={{ __html: scheme.content_ml }} />
          )}

          {/* Articles posted from admin */}
          {posts.length > 0 && (
            <div>
              <h2 className="text-2xl font-black text-white mb-8">GPF ലേഖനങ്ങൾ</h2>
              <div className="flex flex-col gap-4">
                {posts.map(post => (
                  <Link key={post.id} href={`/news/${post.id}`}
                    className="group block p-6 rounded-2xl no-underline transition-all hover:-translate-y-0.5"
                    style={{ background: 'rgba(48,209,88,0.04)', border: '1px solid rgba(48,209,88,0.12)' }}>
                    {post.image_url && (
                      <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
                        <Image src={post.image_url} alt={`${post.title_ml || post.title_en || 'GPF article'} article thumbnail`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 600px" loading="lazy" />
                      </div>
                    )}
                    <div className="text-xs text-[#30d158] font-bold uppercase tracking-widest mb-2">
                      {new Date(post.created_at).toLocaleDateString('ml-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <h3 className="text-lg font-bold text-white/90 group-hover:text-white mb-2 transition-colors"
                      style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                      {post.title_ml}
                    </h3>
                    {post.summary_ml && (
                      <p className="text-sm text-white/70 leading-relaxed line-clamp-3">{post.summary_ml}</p>
                    )}
                    <span className="inline-block mt-3 text-xs font-bold text-[#30d158]">വായിക്കുക →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!scheme.content_ml && posts.length === 0 && (
            <div className="text-center py-20 text-white/60">
              <div className="text-5xl mb-4">💰</div>
              <p>Content coming soon.</p>
            </div>
          )}

          <div className="mt-16 pt-8 border-t border-white/[0.06]">
            <a href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold no-underline transition-all"
              style={{ background: '#30d15815', color: '#30d158', border: '1px solid #30d15830' }}>
              ← Back to Home
            </a>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .scheme-content { font-family: var(--font-ibm-plex-mono), var(--font-noto-malayalam), monospace; line-height: 1.8; color: #e5e5e7; }
          .scheme-content h3 { font-size: 1.1rem; font-weight: 700; color: #30d158; margin: 2rem 0 0.75rem; padding-left: 12px; border-left: 3px solid #30d158; }
          .scheme-content p { margin-bottom: 1.25rem; color: #aeaeb2; font-size: 0.95rem; }
          .scheme-content b, .scheme-content strong { color: white; font-weight: 700; }
          .scheme-content ul { list-style: none; padding: 0; margin: 1rem 0 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
          .scheme-content ul li { padding: 0.85rem 1.1rem 0.85rem 2rem; background: rgba(48,209,88,0.04); border: 1px solid rgba(48,209,88,0.12); border-radius: 12px; font-size: 0.9rem; color: #aeaeb2; position: relative; }
          .scheme-content ul li::before { content: '✦'; color: #30d158; font-size: 0.6rem; position: absolute; left: 0.85rem; top: 1rem; }
        ` }} />
      </main>
      <Footer />
    </>
  );
}
