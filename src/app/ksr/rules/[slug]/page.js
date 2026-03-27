import { supabase } from '@/lib/supabase';
import KsrContent from '@/components/KsrContent';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 60;

const RULE_META = {
  'earned-leave': {
    title: 'Earned Leave (EL)',
    titleMl: 'ആർജ്ജിത അവധി (Earned Leave)',
    ruleRef: 'KSR Part II, Rules 14–22',
    icon: '🏖️',
    color: '#ff9f0a',
    part: 'part-2',
    partLabel: 'KSR Part II',
    tags: ['EL accumulation', 'Leave encashment', 'Leave salary', 'Max 360 days'],
  },
  'joining-time': {
    title: 'Joining Time on Transfer',
    titleMl: 'ട്രാൻസ്ഫർ — Joining Time',
    ruleRef: 'KSR Part I, Rules 61–67',
    icon: '⏱️',
    color: '#2997ff',
    part: 'part-1',
    partLabel: 'KSR Part I',
    tags: ['Transfer TA', 'Distance calculation', 'Public holidays', 'Max 8 days'],
  },
  'maternity-leave': {
    title: 'Maternity & Paternity Leave',
    titleMl: 'Maternity / Paternity Leave',
    ruleRef: 'KSR Part II, Rule 101',
    icon: '👶',
    color: '#ff453a',
    part: 'part-2',
    partLabel: 'KSR Part II',
    tags: ['180 days', '2 confinements', 'Full pay', 'Counts as duty'],
  },
  'study-leave': {
    title: 'Study Leave',
    titleMl: 'Study Leave',
    ruleRef: 'KSR Part II, Rule 107',
    icon: '📚',
    color: '#30d158',
    part: 'part-2',
    partLabel: 'KSR Part II',
    tags: ['5 years service', 'Max 24 months', 'Bond required', 'Higher studies'],
  },
  'transfer-ta': {
    title: 'Transfer TA Rules',
    titleMl: 'സ്ഥലം മാറ്റ യാത്ര ബത്ത (Transfer TA)',
    ruleRef: 'KSR SR 46–60',
    icon: '🚌',
    color: '#64d2ff',
    part: 'part-1',
    partLabel: 'KSR Part I',
    tags: ['Transportation', 'Personal effects', 'Family TA', 'Road mileage'],
  },
  'dcrg': {
    title: 'DCRG — Death-cum-Retirement Gratuity',
    titleMl: 'DCRG / Gratuity',
    ruleRef: 'KSR Part III, Rule 77',
    icon: '🎖️',
    color: '#c8960c',
    part: 'part-3',
    partLabel: 'KSR Part III',
    tags: ['Rule 77', 'Max ₹20 lakh', 'Death gratuity', 'Retirement gratuity'],
  },
  'family-pension': {
    title: 'Family Pension',
    titleMl: 'ഫാമിലി പെൻഷൻ',
    ruleRef: 'KSR Part III, Rule 83',
    icon: '👨‍👩‍👧',
    color: '#bf5af2',
    part: 'part-3',
    partLabel: 'KSR Part III',
    tags: ['30% of salary', 'Spouse eligibility', 'Children eligibility', 'Enhanced pension'],
  },
  'disciplinary': {
    title: 'Disciplinary Proceedings',
    titleMl: 'അച്ചടക്ക നടപടികൾ',
    ruleRef: 'KCS (CCA) Rules 1960',
    icon: '⚖️',
    color: '#ff453a',
    part: 'part-1',
    partLabel: 'KSR Part I',
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
      <main className="min-h-screen bg-aurora text-white pt-[100px]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/60 mb-8 flex-wrap">
            <a href="/" className="hover:text-white transition-colors no-underline text-white/60">Home</a>
            <span>›</span>
            <Link href="/ksr" className="hover:text-white transition-colors no-underline text-white/60">KSR</Link>
            <span>›</span>
            <Link href={`/ksr/${meta.part}`} className="hover:text-white transition-colors no-underline text-white/60">{meta.partLabel}</Link>
            <span>›</span>
            <span style={{ color: COLOR }}>{meta.title}</span>
          </div>

          {/* Badge */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg"
              style={{ background: `${COLOR}18`, color: COLOR }}>
              {meta.icon} {meta.ruleRef}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-[clamp(24px,4vw,40px)] font-[900] tracking-[-0.03em] leading-tight mb-2 text-white"
            style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}>
            {scheme.title_ml || meta.titleMl}
          </h1>
          {scheme.title_en && (
            <div className="text-base text-white/70 mb-4">{scheme.title_en}</div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {meta.tags.map(tag => (
              <span key={tag}
                className="text-xs font-semibold text-white/70 px-3 py-1.5 rounded-lg"
                style={{ background: `${COLOR}10`, border: `1px solid ${COLOR}22` }}>
                {tag}
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
                📋 Rule Details
              </div>
              <KsrContent html={scheme.content_ml} accentColor={COLOR} />
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-10 mb-6 text-center">
              <div className="text-5xl mb-4">{meta.icon}</div>
              <p className="text-white/60 font-semibold mb-2">Content Coming Soon</p>
              <p className="text-sm text-white/35 max-w-sm mx-auto">
                Detailed rules for <strong className="text-white/60">{meta.title}</strong> will appear here once uploaded from the admin panel.
              </p>
              <p className="text-xs text-white/25 mt-3">Admin slug: <code className="bg-white/5 px-2 py-0.5 rounded">{dbSlug}</code></p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="rounded-2xl p-4 text-xs text-white/60 leading-relaxed mb-8"
            style={{ background: 'rgba(255,159,10,0.06)', border: '1px solid rgba(255,159,10,0.15)' }}>
            ⚠️ ഈ ഉള്ളടക്കം വിവരണ ആവശ്യങ്ങൾക്കുള്ളതാണ്. നിയമ ആവശ്യങ്ങൾക്ക് ഔദ്യോഗിക KSR ഗ്രന്ഥം പരിശോധിക്കുക.
          </div>

          {/* Back nav */}
          <div className="flex flex-wrap gap-3">
            <Link href={`/ksr/${meta.part}`}
              className="text-sm no-underline hover:underline" style={{ color: COLOR }}>
              ← {meta.partLabel}
            </Link>
            <span className="text-white/20">·</span>
            <Link href="/ksr" className="text-sm text-white/50 no-underline hover:text-white hover:underline">
              KSR Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
