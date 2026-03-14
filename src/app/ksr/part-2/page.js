import { supabase } from '@/lib/supabase';
import KsrContent from '@/components/KsrContent';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 60;

export const metadata = buildMetadata({
  title: 'KSR Part II — Leave Rules | Kerala Service Rules',
  description:
    'KSR Part II covers all leave rules for Kerala government employees — Earned Leave, Casual Leave, Medical Leave, Maternity Leave, Study Leave, HPL, and leave encashment.',
  path: '/ksr/part-2',
  keywords: ['KSR Part II', 'Kerala Service Rules leave', 'KSR leave rules', 'Earned Leave Kerala', 'Maternity Leave Kerala govt'],
});

const COLOR = '#ff9f0a';

const TOPICS = [
  { icon: '🏖️', label: 'Earned Leave (EL)' },
  { icon: '☀️', label: 'Casual Leave (CL)' },
  { icon: '🏥', label: 'Medical / Hospital Leave' },
  { icon: '📉', label: 'Half Pay Leave (HPL)' },
  { icon: '👶', label: 'Maternity & Paternity' },
  { icon: '📚', label: 'Study Leave' },
  { icon: '🎗️', label: 'Special Casual Leave' },
  { icon: '💵', label: 'Leave Encashment' },
];

export default async function KsrPart2Page() {
  const { data } = await supabase
    .from('schemes')
    .select('*')
    .eq('slug', 'ksr-part-2')
    .single();

  const scheme = data || {};

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#121416] text-white">

        <div className="relative pt-32 pb-16 px-6 overflow-hidden bg-[#121416]">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,159,10,0.12), transparent)` }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, rgba(255,159,10,0.4), transparent)` }} />

          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-8 flex-wrap">
              <a href="/" className="hover:text-white transition-colors no-underline text-white/50">Home</a>
              <span>›</span>
              <Link href="/ksr" className="hover:text-white transition-colors no-underline text-white/50">KSR</Link>
              <span>›</span>
              <span style={{ color: COLOR }}>Part II</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
              style={{ color: COLOR, border: `1px solid ${COLOR}30`, background: `${COLOR}10` }}>
              📙 KSR Part II
            </div>

            <h1 className="text-[clamp(30px,5vw,52px)] font-black tracking-tight leading-[1.05] mb-3">
              {scheme.title_ml || 'KSR Part II — Leave Rules'}
            </h1>
            {scheme.title_en && (
              <p className="text-base text-white/60 mb-2">{scheme.title_en}</p>
            )}
            <p className="text-sm text-white/45 mb-10">
              Earned Leave · Casual Leave · Medical Leave · Maternity · Study Leave · HPL · Encashment
            </p>

            <div className="flex flex-wrap gap-2">
              {TOPICS.map(t => (
                <span key={t.label}
                  className="text-xs font-semibold text-white/65 px-3 py-1.5 rounded-full"
                  style={{ background: `${COLOR}08`, border: `1px solid ${COLOR}18` }}>
                  {t.icon} {t.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 pb-20">
          {scheme.description_ml && (
            <p className="text-base text-white/70 leading-relaxed mb-10 pb-10 border-b border-white/[0.06]"
              style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}>
              {scheme.description_ml}
            </p>
          )}

          {scheme.content_ml ? (
            <KsrContent html={scheme.content_ml} accentColor={COLOR} />
          ) : (
            <EmptyContent part="Part II" />
          )}

          {/* Key Rules in Part II */}
          <div className="mt-12 mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Key Rules in Part II</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: '🏖️', rule: 'Rule 14–22', label: 'Earned Leave (EL)',          slug: 'earned-leave',     desc: 'EL accumulation, encashment, max 360 days' },
                { icon: '👶', rule: 'Rule 101',   label: 'Maternity & Paternity Leave', slug: 'maternity-leave',  desc: '180 days full pay, counts as duty' },
                { icon: '📚', rule: 'Rule 107',   label: 'Study Leave',                 slug: 'study-leave',      desc: 'Max 24 months, 5 years service required' },
                { icon: '📉', rule: 'Rule 86–100',label: 'Half Pay Leave (HPL)',         slug: 'earned-leave',     desc: '20 days per year, can be commuted' },
              ].map(r => (
                <Link key={r.label} href={`/ksr/rules/${r.slug}`}
                  className="group flex flex-col gap-2 p-4 rounded-2xl no-underline transition-all hover:-translate-y-0.5"
                  style={{ background: `${COLOR}06`, border: `1px solid ${COLOR}18` }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{r.icon}</span>
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: COLOR }}>{r.rule}</div>
                      <div className="text-sm font-bold text-white leading-tight">{r.label}</div>
                    </div>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">{r.desc}</p>
                  <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: COLOR }}>View details →</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/[0.06]">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Other KSR Parts</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              <Link href="/ksr/part-1"
                className="flex items-center justify-between gap-3 p-4 rounded-xl no-underline transition-all hover:-translate-y-0.5"
                style={{ background: 'rgba(41,151,255,0.06)', border: '1px solid rgba(41,151,255,0.18)' }}>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#2997ff] mb-0.5">Part I</div>
                  <div className="text-sm font-bold text-white">General Service Conditions</div>
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
              style={{ background: `${COLOR}10`, color: COLOR, border: `1px solid ${COLOR}25` }}>
              ← Back to KSR
            </Link>
          </div>
        </div>
      </main>
      <Footer />
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
