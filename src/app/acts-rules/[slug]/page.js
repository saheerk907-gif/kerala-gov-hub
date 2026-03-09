import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getCatInfo } from '@/lib/actsData';
import { notFound } from 'next/navigation';

export const revalidate = 86400;

export async function generateStaticParams() {
  const { data } = await supabase
    .from('acts_rules')
    .select('slug')
    .eq('is_published', true);
  return (data || []).map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { data: act } = await supabase
    .from('acts_rules')
    .select('title, title_ml, summary, slug, year, act_number, tags')
    .eq('slug', params.slug)
    .single();

  if (!act) return {};

  const desc = act.summary
    ? act.summary.slice(0, 160)
    : `${act.title} — Full text, PDF download and summary for Kerala government employees.`;

  const keywords = [
    act.title,
    act.title_ml,
    `${act.title} PDF`,
    `${act.title} summary`,
    `Kerala ${act.title}`,
    act.year ? `${act.title} ${act.year}` : '',
    act.tags || '',
    'Kerala government acts', 'Kerala laws PDF',
  ].filter(Boolean).join(', ');

  return {
    title: `${act.title}${act.year ? ` ${act.year}` : ''} — PDF, Summary & Key Provisions`,
    description: desc,
    keywords,
    alternates: { canonical: `https://keralaemployees.in/acts-rules/${act.slug}` },
    openGraph: {
      title: `${act.title} — PDF & Summary`,
      description: desc,
      url: `https://keralaemployees.in/acts-rules/${act.slug}`,
    },
  };
}

export default async function ActPage({ params }) {
  const { data: act } = await supabase
    .from('acts_rules')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single();

  if (!act) notFound();

  const cat = getCatInfo(act.category);
  const tags = act.tags ? act.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: act.title,
    description: act.summary || '',
    url: `https://keralaemployees.in/acts-rules/${act.slug}`,
    publisher: { '@type': 'Organization', name: 'Kerala Employees', url: 'https://keralaemployees.in' },
    keywords: tags.join(', '),
  };

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-black text-white pt-[100px]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#6e6e73] mb-8 flex-wrap">
            <a href="/" className="hover:text-white transition-colors no-underline text-[#6e6e73]">Home</a>
            <span>›</span>
            <Link href="/acts-rules" className="hover:text-white transition-colors no-underline text-[#6e6e73]">Acts & Rules</Link>
            <span>›</span>
            <span className="text-[#2997ff] truncate">{act.title}</span>
          </div>

          {/* Category + Act No */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg"
              style={{ background: cat.color + '18', color: cat.color }}>
              {cat.icon} {cat.en}
            </span>
            {act.act_number && (
              <span className="text-[11px] text-white/40 font-semibold">{act.act_number}</span>
            )}
            {act.year && (
              <span className="text-[11px] text-white/40 font-semibold">{act.year}</span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-[clamp(24px,4vw,40px)] font-[900] tracking-[-0.03em] leading-tight mb-2 text-white">
            {act.title}
          </h1>
          {act.title_ml && (
            <div className="text-[16px] text-white/50 mb-6" style={{ fontFamily: "'Meera', sans-serif" }}>
              {act.title_ml}
            </div>
          )}

          {/* PDF + Official Link Buttons */}
          {(act.pdf_url || act.official_url) && (
            <div className="flex gap-3 flex-wrap mb-8">
              {act.pdf_url && (
                <a href={act.pdf_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-[13px] font-bold no-underline transition-all hover:opacity-90"
                  style={{ background: 'rgba(48,209,88,0.15)', color: '#30d158', border: '1px solid rgba(48,209,88,0.3)' }}>
                  📄 Download PDF
                </a>
              )}
              {act.official_url && (
                <a href={act.official_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-[13px] font-bold no-underline transition-all hover:opacity-90"
                  style={{ background: 'rgba(41,151,255,0.1)', color: '#2997ff', border: '1px solid rgba(41,151,255,0.25)' }}>
                  🔗 Official Source
                </a>
              )}
            </div>
          )}

          {/* Summary */}
          {act.summary && (
            <div className="glass-card rounded-2xl p-6 mb-6">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#2997ff] mb-4">📖 Summary</div>
              <div className="act-content text-[14px] text-white/75 leading-[1.8]"
                dangerouslySetInnerHTML={{ __html: act.summary }} />
            </div>
          )}

          {/* Key Points */}
          {act.key_points && act.key_points.split('\n').filter(Boolean).length > 0 && (
            <div className="glass-card rounded-2xl p-6 mb-6">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#30d158] mb-4">✅ Key Provisions</div>
              <ul className="space-y-3">
                {act.key_points.split('\n').filter(Boolean).map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-[13px] text-white/70 leading-relaxed">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black mt-0.5"
                      style={{ background: 'rgba(48,209,88,0.15)', color: '#30d158' }}>
                      {i + 1}
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mb-8">
              <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">Tags</div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <span key={i} className="text-[11px] px-3 py-1 rounded-lg bg-white/[0.06] text-white/50 border border-white/[0.08]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="rounded-2xl p-4 text-[11px] text-white/40 leading-relaxed"
            style={{ background: 'rgba(255,159,10,0.06)', border: '1px solid rgba(255,159,10,0.15)' }}>
            ⚠️ ഈ സംക്ഷേപം വിവരണ ആവശ്യങ്ങൾക്കുള്ളതാണ്. നിയമ ആവശ്യങ്ങൾക്ക് ഔദ്യോഗിക നിയമ ഗ്രന്ഥം പരിശോധിക്കുക.
          </div>

          <div className="mt-6">
            <Link href="/acts-rules" className="text-[#2997ff] text-sm no-underline hover:underline">← All Acts & Rules</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
