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
  { icon: '☀️',  label: 'Casual Leave (CL)' },
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
      <main className="min-h-screen bg-aurora text-white pt-[100px]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/60 mb-8 flex-wrap">
            <a href="/" className="hover:text-white transition-colors no-underline text-white/60">Home</a>
            <span>›</span>
            <Link href="/ksr" className="hover:text-white transition-colors no-underline text-white/60">KSR</Link>
            <span>›</span>
            <span style={{ color: COLOR }}>Part II</span>
          </div>

          {/* Badge */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg"
              style={{ background: `${COLOR}18`, color: COLOR }}>
              📙 KSR Part II
            </span>
            <span className="text-[11px] text-white/60 font-semibold">Leave Rules</span>
          </div>

          {/* Title */}
          <h1 className="text-[clamp(24px,4vw,40px)] font-[900] tracking-[-0.03em] leading-tight mb-2 text-white">
            {scheme.title_ml || 'KSR Part II — Leave Rules'}
          </h1>
          {scheme.title_en && (
            <div className="text-base text-white/70 mb-4">{scheme.title_en}</div>
          )}
          <p className="text-sm text-white/50 mb-8">
            Earned Leave · Casual Leave · Medical Leave · Maternity · Study Leave · HPL · Encashment
          </p>

          {/* Topic chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {TOPICS.map(t => (
              <span key={t.label}
                className="text-xs font-semibold text-white/70 px-3 py-1.5 rounded-lg"
                style={{ background: `${COLOR}10`, border: `1px solid ${COLOR}22` }}>
                {t.icon} {t.label}
              </span>
            ))}
          </div>

          {/* Description */}
          {scheme.description_ml && (
            <div className="glass-card rounded-2xl p-5 mb-6">
              <p className="text-sm text-white/75 leading-relaxed"
                style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}>
                {scheme.description_ml}
              </p>
            </div>
          )}

          {/* Main content */}
          {scheme.content_ml ? (
            <div className="glass-card rounded-2xl p-6 mb-6">
              <div className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: COLOR }}>
                📋 Full Content
              </div>
              <KsrContent html={scheme.content_ml} accentColor={COLOR} />
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-10 mb-6 text-center">
              <div className="text-5xl mb-4">📖</div>
              <p className="text-white/60 font-semibold mb-2">Content Coming Soon</p>
              <p className="text-sm text-white/35">
                KSR Part II detailed rules will appear here once uploaded from the admin panel.
              </p>
            </div>
          )}

          {/* Key Rules in Part II */}
          <div className="mb-8">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Key Rules in Part II</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: '🏖️', rule: 'Rule 14–22', label: 'Earned Leave (EL)',          slug: 'earned-leave',    desc: 'EL accumulation, encashment, max 360 days' },
                { icon: '👶', rule: 'Rule 101',   label: 'Maternity & Paternity Leave', slug: 'maternity-leave', desc: '180 days full pay, counts as duty' },
                { icon: '📚', rule: 'Rule 107',   label: 'Study Leave',                 slug: 'study-leave',     desc: 'Max 24 months, 5 years service required' },
                { icon: '📉', rule: 'Rule 86–100',label: 'Half Pay Leave (HPL)',         slug: 'earned-leave',    desc: '20 days per year, can be commuted' },
              ].map(r => (
                <Link key={r.label} href={`/ksr/rules/${r.slug}`}
                  className="group glass-card flex flex-col gap-2 p-4 rounded-2xl no-underline transition-all hover:-translate-y-0.5">
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

          {/* Calculator links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <Link href="/leave"
              className="glass-card group flex items-center justify-between gap-4 p-5 rounded-2xl no-underline transition-all hover:-translate-y-0.5">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: COLOR }}>Calculator</div>
                <div className="font-black text-white text-base">Leave Calculator</div>
                <div className="text-xs text-white/50 mt-1">Compute EL, HPL and leave encashment</div>
              </div>
              <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Other parts */}
          <div className="mb-8">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Other KSR Parts</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/ksr/part-1"
                className="glass-card flex items-center justify-between gap-3 p-4 rounded-xl no-underline transition-all hover:-translate-y-0.5">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#2997ff] mb-0.5">Part I</div>
                  <div className="text-sm font-bold text-white">General Service Conditions</div>
                </div>
                <span className="text-white/30">→</span>
              </Link>
              <Link href="/ksr/part-3"
                className="glass-card flex items-center justify-between gap-3 p-4 rounded-xl no-underline transition-all hover:-translate-y-0.5">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#bf5af2] mb-0.5">Part III</div>
                  <div className="text-sm font-bold text-white">Pension Rules</div>
                </div>
                <span className="text-white/30">→</span>
              </Link>
            </div>
          </div>

          <Link href="/ksr" className="text-sm no-underline hover:underline" style={{ color: COLOR }}>← Back to KSR</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
