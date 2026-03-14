import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 60;

export const metadata = buildMetadata({
  title: 'KSR Part I — General Service Conditions | Kerala Service Rules',
  description:
    'KSR Part I covers appointments, pay fixation, allowances, transfers, promotions, joining time, deputation and general service conditions for Kerala government employees.',
  path: '/ksr/part-1',
  keywords: ['KSR Part I', 'Kerala Service Rules Part 1', 'KSR pay rules', 'KSR transfer rules', 'KSR promotion rules'],
});

const BLUE = '#2997ff';

const TOPICS = [
  { icon: '💼', label: 'Appointments & Probation' },
  { icon: '💰', label: 'Pay Fixation & Increments' },
  { icon: '🏠', label: 'HRA & Other Allowances' },
  { icon: '🔄', label: 'Transfer Rules' },
  { icon: '⏱️', label: 'Joining Time' },
  { icon: '📈', label: 'Promotion & DPC' },
  { icon: '🤝', label: 'Deputation Rules' },
  { icon: '⚖️', label: 'Conduct & Discipline' },
];

export default async function KsrPart1Page() {
  const { data } = await supabase
    .from('schemes')
    .select('*')
    .eq('slug', 'ksr-part-1')
    .single();

  const scheme = data || {};

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#121416] text-white">

        {/* HERO */}
        <div className="relative pt-32 pb-16 px-6 overflow-hidden bg-[#121416]">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(41,151,255,0.12), transparent)' }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(41,151,255,0.4), transparent)' }} />

          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-8 flex-wrap">
              <a href="/" className="hover:text-white transition-colors no-underline text-white/50">Home</a>
              <span>›</span>
              <Link href="/ksr" className="hover:text-white transition-colors no-underline text-white/50">KSR</Link>
              <span>›</span>
              <span style={{ color: BLUE }}>Part I</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
              style={{ color: BLUE, border: `1px solid ${BLUE}30`, background: `${BLUE}10` }}>
              📗 KSR Part I
            </div>

            <h1 className="text-[clamp(30px,5vw,52px)] font-black tracking-tight leading-[1.05] mb-3">
              {scheme.title_ml || 'KSR Part I — General Service Conditions'}
            </h1>
            {scheme.title_en && (
              <p className="text-base text-white/60 mb-2">{scheme.title_en}</p>
            )}
            <p className="text-sm text-white/45 mb-10">
              Appointments · Pay · Allowances · Transfers · Promotions · Joining Time · Deputation
            </p>

            {/* Topic chips */}
            <div className="flex flex-wrap gap-2">
              {TOPICS.map(t => (
                <span key={t.label}
                  className="text-xs font-semibold text-white/65 px-3 py-1.5 rounded-full"
                  style={{ background: `${BLUE}08`, border: `1px solid ${BLUE}18` }}>
                  {t.icon} {t.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto px-6 pb-20">
          {scheme.description_ml && (
            <p className="text-base text-white/70 leading-relaxed mb-10 pb-10 border-b border-white/[0.06]"
              style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}>
              {scheme.description_ml}
            </p>
          )}

          {scheme.content_ml ? (
            <div className="scheme-content" dangerouslySetInnerHTML={{ __html: scheme.content_ml }} />
          ) : (
            <EmptyContent part="Part I" />
          )}

          {/* Nav to other parts */}
          <div className="mt-16 pt-8 border-t border-white/[0.06]">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Other KSR Parts</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              <Link href="/ksr/part-2"
                className="flex items-center justify-between gap-3 p-4 rounded-xl no-underline transition-all hover:-translate-y-0.5"
                style={{ background: 'rgba(255,159,10,0.06)', border: '1px solid rgba(255,159,10,0.18)' }}>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#ff9f0a] mb-0.5">Part II</div>
                  <div className="text-sm font-bold text-white">Leave Rules</div>
                </div>
                <span className="text-white/30">→</span>
              </Link>
              <Link href="/ksr/part-3"
                className="flex items-center justify-between gap-3 p-4 rounded-xl no-underline transition-all hover:-translate-y-0.5"
                style={{ background: 'rgba(191,90,242,0.06)', border: '1px solid rgba(191,90,242,0.18)' }}>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#bf5af2] mb-0.5">Part III</div>
                  <div className="text-sm font-bold text-white">Pension Rules</div>
                </div>
                <span className="text-white/30">→</span>
              </Link>
            </div>
            <Link href="/ksr"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold no-underline transition-all"
              style={{ background: `${BLUE}10`, color: BLUE, border: `1px solid ${BLUE}25` }}>
              ← Back to KSR
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <SchemeStyles accentColor={BLUE} />
    </>
  );
}

function EmptyContent({ part }) {
  return (
    <div className="text-center py-20 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="text-5xl mb-4">📖</div>
      <p className="text-white/60 font-semibold mb-2">Content Coming Soon</p>
      <p className="text-sm text-white/35">
        KSR {part} detailed rules will appear here once uploaded from the admin panel.
      </p>
    </div>
  );
}

function SchemeStyles({ accentColor }) {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      .scheme-content { font-family: Georgia, serif; line-height: 1.85; color: #e5e5e7; }
      .scheme-content h2 { font-size: 1.4rem; font-weight: 800; color: white; margin: 2.5rem 0 1rem; }
      .scheme-content h3 { font-size: 1.05rem; font-weight: 700; color: ${accentColor}; margin: 2rem 0 0.75rem; padding-left: 12px; border-left: 3px solid ${accentColor}; }
      .scheme-content p { margin-bottom: 1.25rem; color: #aeaeb2; font-size: 0.95rem; font-family: var(--font-noto-malayalam), Georgia, serif; }
      .scheme-content b, .scheme-content strong { color: white; font-weight: 700; }
      .scheme-content ul { list-style: none; padding: 0; margin: 1rem 0 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
      .scheme-content ul li { padding: 0.85rem 1.1rem 0.85rem 2rem; background: rgba(41,151,255,0.04); border: 1px solid rgba(41,151,255,0.10); border-radius: 12px; font-size: 0.9rem; color: #aeaeb2; position: relative; font-family: var(--font-noto-malayalam), Georgia, serif; }
      .scheme-content ul li::before { content: '✦'; color: ${accentColor}; font-size: 0.6rem; position: absolute; left: 0.85rem; top: 1rem; }
      .scheme-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.875rem; }
      .scheme-content th { background: rgba(41,151,255,0.10); color: white; font-weight: 700; padding: 0.75rem 1rem; text-align: left; border: 1px solid rgba(41,151,255,0.15); }
      .scheme-content td { padding: 0.65rem 1rem; color: #aeaeb2; border: 1px solid rgba(255,255,255,0.06); }
      .scheme-content tr:nth-child(even) td { background: rgba(255,255,255,0.02); }
    ` }} />
  );
}
