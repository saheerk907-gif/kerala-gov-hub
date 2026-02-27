import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const revalidate = 60;

export default async function GpfPage() {
  const { data } = await supabase
    .from('schemes')
    .select('*')
    .eq('slug', 'gpf')
    .single();

  const scheme = data || {};

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white">
        <div className="relative pt-32 pb-20 px-6 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #001a08 0%, #000f05 60%, #000 100%)' }}>
          <div className="absolute inset-0 opacity-30"
            style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, #30d15830, transparent)' }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #30d15850, transparent)' }} />

          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-[#6e6e73] mb-8">
              <a href="/" className="hover:text-white transition-colors no-underline text-[#6e6e73]">Home</a>
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
            <p className="text-lg text-[#6e6e73] font-medium mb-4">General Provident Fund — Mandatory Savings for Government Employees</p>
            {scheme.description_ml && (
              <p className="text-base text-[#86868b] leading-relaxed max-w-2xl">{scheme.description_ml}</p>
            )}
            <div className="grid grid-cols-3 gap-4 mt-10 max-w-xl">
              {[
                { label: 'Min Contribution', value: '6%' },
                { label: 'Interest Rate', value: '7.1%' },
                { label: 'Tax Benefit', value: '80C' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-xl font-black text-[#30d158]">{s.value}</div>
                  <div className="text-[10px] text-[#6e6e73] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16">
          {scheme.content_ml ? (
            <div className="scheme-content" dangerouslySetInnerHTML={{ __html: scheme.content_ml }} />
          ) : (
            <div className="text-center py-20 text-[#6e6e73]">
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
          .scheme-content { font-family: Georgia, serif; line-height: 1.8; color: #e5e5e7; }
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
