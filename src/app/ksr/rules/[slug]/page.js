import { supabase } from '@/lib/supabase';
import KsrContent from '@/components/KsrContent';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 60;

// All valid rule slugs and their metadata
const RULE_META = {
  'earned-leave': {
    title: 'Earned Leave (EL)',
    titleMl: 'ആർജ്ജിത അവധി (Earned Leave)',
    ruleRef: 'KSR Part II, Rules 14–22',
    icon: '🏖️',
    color: '#ff9f0a',
    tags: ['EL accumulation', 'Leave encashment', 'Leave salary', 'Max 360 days'],
  },
  'joining-time': {
    title: 'Joining Time on Transfer',
    titleMl: 'ട്രാൻസ്ഫർ — Joining Time',
    ruleRef: 'KSR Part I, Rules 61–67',
    icon: '⏱️',
    color: '#2997ff',
    tags: ['Transfer TA', 'Distance calculation', 'Public holidays', 'Max 8 days'],
  },
  'maternity-leave': {
    title: 'Maternity & Paternity Leave',
    titleMl: 'Maternity / Paternity Leave',
    ruleRef: 'KSR Part II, Rule 101',
    icon: '👶',
    color: '#ff453a',
    tags: ['180 days', '2 confinements', 'Full pay', 'Counts as duty'],
  },
  'study-leave': {
    title: 'Study Leave',
    titleMl: 'Study Leave',
    ruleRef: 'KSR Part II, Rule 107',
    icon: '📚',
    color: '#30d158',
    tags: ['5 years service', 'Max 24 months', 'Bond required', 'Higher studies'],
  },
  'transfer-ta': {
    title: 'Transfer TA Rules',
    titleMl: 'സ്ഥലം മാറ്റ യാത്ര ബത്ത (Transfer TA)',
    ruleRef: 'KSR SR 46–60',
    icon: '🚌',
    color: '#64d2ff',
    tags: ['Transportation', 'Personal effects', 'Family TA', 'Road mileage'],
  },
  'dcrg': {
    title: 'DCRG — Death-cum-Retirement Gratuity',
    titleMl: 'DCRG / Gratuity',
    ruleRef: 'KSR Part III, Rule 77',
    icon: '🎖️',
    color: '#c8960c',
    tags: ['Rule 77', 'Max ₹20 lakh', 'Death gratuity', 'Retirement gratuity'],
  },
  'family-pension': {
    title: 'Family Pension',
    titleMl: 'ഫാമിലി പെൻഷൻ',
    ruleRef: 'KSR Part III, Rule 83',
    icon: '👨‍👩‍👧',
    color: '#bf5af2',
    tags: ['30% of salary', 'Spouse eligibility', 'Children eligibility', 'Enhanced pension'],
  },
  'disciplinary': {
    title: 'Disciplinary Proceedings',
    titleMl: 'അച്ചടക്ക നടപടികൾ',
    ruleRef: 'KCS (CCA) Rules 1960',
    icon: '⚖️',
    color: '#ff453a',
    tags: ['Minor penalty', 'Major penalty', 'Charge memo', 'Suspension'],
  },
};

export async function generateMetadata({ params }) {
  const meta = RULE_META[params.slug];
  if (!meta) return {};
  return {
    title: `${meta.title} — KSR Rules | Kerala Government Employees`,
    description: `Detailed explanation of ${meta.title} for Kerala government employees. ${meta.ruleRef}.`,
  };
}

export default async function KsrRulePage({ params }) {
  const meta = RULE_META[params.slug];
  if (!meta) notFound();

  const dbSlug = `ksr-rule-${params.slug}`;
  const { data } = await supabase
    .from('schemes')
    .select('*')
    .eq('slug', dbSlug)
    .single();

  const scheme = data || {};
  const COLOR = meta.color;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#121416] text-white">

        {/* HERO */}
        <div className="relative pt-32 pb-16 px-6 overflow-hidden bg-[#121416]">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${COLOR}18, transparent)` }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${COLOR}40, transparent)` }} />

          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-8 flex-wrap">
              <a href="/" className="hover:text-white transition-colors no-underline text-white/50">Home</a>
              <span>›</span>
              <Link href="/ksr" className="hover:text-white transition-colors no-underline text-white/50">KSR</Link>
              <span>›</span>
              <span className="text-white/50">Rules</span>
              <span>›</span>
              <span style={{ color: COLOR }}>{meta.title}</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
              style={{ color: COLOR, border: `1px solid ${COLOR}30`, background: `${COLOR}10` }}>
              {meta.icon} {meta.ruleRef}
            </div>

            <h1 className="text-[clamp(28px,5vw,50px)] font-black tracking-tight leading-[1.05] mb-3"
              style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}>
              {scheme.title_ml || meta.titleMl}
            </h1>
            {scheme.title_en && (
              <p className="text-base text-white/60 mb-3">{scheme.title_en}</p>
            )}

            <div className="flex flex-wrap gap-2 mt-6">
              {meta.tags.map(tag => (
                <span key={tag}
                  className="text-xs font-semibold text-white/60 px-3 py-1.5 rounded-full"
                  style={{ background: `${COLOR}08`, border: `1px solid ${COLOR}18` }}>
                  {tag}
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
            <KsrContent html={scheme.content_ml} accentColor={COLOR} />
          ) : (
            <div className="text-center py-20 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-5xl mb-4">{meta.icon}</div>
              <p className="text-white/60 font-semibold mb-2">Content Coming Soon</p>
              <p className="text-sm text-white/35 max-w-sm mx-auto">
                Detailed rules for <strong className="text-white/60">{meta.title}</strong> will appear here once uploaded from the admin panel.
              </p>
              <p className="text-xs text-white/25 mt-3">Admin slug: <code className="bg-white/5 px-2 py-0.5 rounded">{dbSlug}</code></p>
            </div>
          )}

          {/* Back nav */}
          <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-wrap gap-3">
            <Link href="/ksr"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold no-underline transition-all"
              style={{ background: `${COLOR}10`, color: COLOR, border: `1px solid ${COLOR}25` }}>
              ← Back to KSR
            </Link>
            <Link href="/ksr/part-2"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold no-underline transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
              KSR Part II — Leave Rules →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
