import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import KsrContent from '@/components/KsrContent';
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

const COLOR = '#2997ff';

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
  const { data } = supabase
    ? await supabase.from('schemes').select('*').eq('slug', 'ksr-part-1').single()
    : { data: null };

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
            <span style={{ color: COLOR }}>Part I</span>
          </div>

          {/* Badge */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg"
              style={{ background: `${COLOR}18`, color: COLOR }}>
              📗 KSR Part I
            </span>
            <span className="text-[11px] text-white/60 font-semibold">General Service Conditions</span>
          </div>

          {/* Title */}
          <h1 className="text-[clamp(24px,4vw,40px)] font-[900] tracking-[-0.03em] leading-tight mb-2 text-white">
            {scheme.title_ml || 'KSR Part I — General Service Conditions'}
          </h1>
          {scheme.title_en && (
            <div className="text-base text-white/70 mb-4">{scheme.title_en}</div>
          )}
          <p className="text-sm text-white/50 mb-8">
            Appointments · Pay · Allowances · Transfers · Promotions · Joining Time · Deputation
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
                KSR Part I detailed rules will appear here once uploaded from the admin panel.
              </p>
            </div>
          )}

          {/* Key Rules in Part I */}
          <div className="mb-8">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Key Rules in Part I</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: '⏱️', rule: 'Rule 61–67', label: 'Joining Time on Transfer',  slug: 'joining-time',  desc: 'Joining time allowed on transfer between stations' },
                { icon: '🚌', rule: 'SR 46–60',   label: 'Transfer TA Rules',          slug: 'transfer-ta',   desc: 'Travel allowance for transfer of station' },
                { icon: '⚖️', rule: 'KCS Rules',  label: 'Disciplinary Proceedings',  slug: 'disciplinary',  desc: 'Minor & major penalties, charge memo, suspension' },
              ].map(r => (
                <Link key={r.slug} href={`/ksr/rules/${r.slug}`}
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

          {/* Other parts */}
          <div className="mb-8">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Other KSR Parts</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/ksr/part-2"
                className="glass-card flex items-center justify-between gap-3 p-4 rounded-xl no-underline transition-all hover:-translate-y-0.5">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#ff9f0a] mb-0.5">Part II</div>
                  <div className="text-sm font-bold text-white">Leave Rules</div>
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
