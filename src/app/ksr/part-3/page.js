import { supabase } from '@/lib/supabase';
import KsrContent from '@/components/KsrContent';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 60;

export const metadata = buildMetadata({
  title: 'KSR Part III — Pension Rules | Kerala Service Rules',
  description:
    'KSR Part III covers pension rules for Kerala government employees — retirement pension, family pension, commutation, DCRG, voluntary retirement and pensionary benefits.',
  path: '/ksr/part-3',
  keywords: ['KSR Part III', 'Kerala Service Rules pension', 'KSR pension rules', 'Kerala govt pension', 'DCRG Kerala', 'family pension Kerala'],
});

const COLOR = '#bf5af2';

const TOPICS = [
  { icon: '🏦', label: 'Service Pension' },
  { icon: '👨‍👩‍👧', label: 'Family Pension' },
  { icon: '💱', label: 'Commutation of Pension' },
  { icon: '🎖️', label: 'DCRG / Gratuity' },
  { icon: '🚪', label: 'Voluntary Retirement' },
  { icon: '♿', label: 'Invalid Pension' },
  { icon: '📅', label: 'Qualifying Service' },
  { icon: '💵', label: 'Pension Calculation' },
];

export default async function KsrPart3Page() {
  const { data } = await supabase
    .from('schemes')
    .select('*')
    .eq('slug', 'ksr-part-3')
    .single();

  const scheme = data || {};

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#121416] text-white">

        <div className="relative pt-32 pb-16 px-6 overflow-hidden bg-[#121416]">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, rgba(191,90,242,0.12), transparent)` }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, rgba(191,90,242,0.4), transparent)` }} />

          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-8 flex-wrap">
              <a href="/" className="hover:text-white transition-colors no-underline text-white/50">Home</a>
              <span>›</span>
              <Link href="/ksr" className="hover:text-white transition-colors no-underline text-white/50">KSR</Link>
              <span>›</span>
              <span style={{ color: COLOR }}>Part III</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
              style={{ color: COLOR, border: `1px solid ${COLOR}30`, background: `${COLOR}10` }}>
              📘 KSR Part III
            </div>

            <h1 className="text-[clamp(30px,5vw,52px)] font-black tracking-tight leading-[1.05] mb-3">
              {scheme.title_ml || 'KSR Part III — Pension Rules'}
            </h1>
            {scheme.title_en && (
              <p className="text-base text-white/60 mb-2">{scheme.title_en}</p>
            )}
            <p className="text-sm text-white/45 mb-10">
              Service Pension · Family Pension · Commutation · DCRG · Voluntary Retirement
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
            <EmptyContent part="Part III" />
          )}

          {/* Calculator links */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/pension"
              className="group flex items-center justify-between gap-4 p-5 rounded-2xl no-underline transition-all hover:-translate-y-0.5"
              style={{ background: `${COLOR}08`, border: `1px solid ${COLOR}20` }}>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: COLOR }}>Calculator</div>
                <div className="font-black text-white text-base">Pension Calculator</div>
                <div className="text-xs text-white/50 mt-1">Compute retirement pension as per KSR Part III</div>
              </div>
              <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link href="/dcrg"
              className="group flex items-center justify-between gap-4 p-5 rounded-2xl no-underline transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(255,159,10,0.08)', border: '1px solid rgba(255,159,10,0.20)' }}>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#ff9f0a' }}>Calculator</div>
                <div className="font-black text-white text-base">DCRG Calculator</div>
                <div className="text-xs text-white/50 mt-1">KSR Rule 77 — Death-cum-Retirement Gratuity</div>
              </div>
              <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Key Rules in Part III */}
          <div className="mt-12 mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Key Rules in Part III</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: '🎖️', rule: 'Rule 77', label: 'DCRG — Death-cum-Retirement Gratuity', slug: 'dcrg',          desc: 'Gratuity on retirement or death, max ₹20 lakh' },
                { icon: '👨‍👩‍👧', rule: 'Rule 83', label: 'Family Pension',                       slug: 'family-pension', desc: '30% of last pay, spouse & children eligibility' },
              ].map(r => (
                <Link key={r.slug} href={`/ksr/rules/${r.slug}`}
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

          <div className="mt-12 pt-8 border-t border-white/[0.06]">
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
              <Link href="/ksr/part-2"
                className="flex items-center justify-between gap-3 p-4 rounded-xl no-underline transition-all hover:-translate-y-0.5"
                style={{ background: 'rgba(255,159,10,0.06)', border: '1px solid rgba(255,159,10,0.18)' }}>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#ff9f0a] mb-0.5">Part II</div>
                  <div className="text-sm font-bold text-white">Leave Rules</div>
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
