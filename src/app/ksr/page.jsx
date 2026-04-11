import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import KsrGovOrders from '@/components/KsrGovOrders';
import KsrQueryForm from '@/components/KsrQueryForm';
import Link from 'next/link';
import Image from 'next/image';
import RelatedLinks from '@/components/RelatedLinks';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 60;

export const metadata = buildMetadata({
  title: 'Kerala Service Rules (KSR) — Complete Guide',
  description: 'Complete guide to Kerala Service Rules (KSR) for government employees — leave rules, pay, promotion, transfer, pension, and disciplinary proceedings.',
  path: '/ksr',
  keywords: ['Kerala Service Rules', 'KSR', 'Kerala government service rules', 'KSR leave rules', 'KSR pay rules', 'KSR Part I', 'KSR Part II', 'KSR Part III'],
});

const BLUE = '#2997ff';

const KSR_FAQS = [
  {
    q: 'KSR എന്നാൽ എന്ത്? (What is KSR?)',
    a: 'KSR (Kerala Service Rules) is the comprehensive rulebook governing the service conditions of Kerala government employees. It covers pay, leave, transfer, promotion, pension, and conduct — divided into three Parts.',
  },
  {
    q: 'KSR Part I, II, III-ൽ എന്തൊക്കെ ഉണ്ട്?',
    a: 'Part I covers general service conditions — appointments, pay, allowances, transfers, and promotions. Part II covers leave rules — EL, CL, ML, HPL, Study Leave, etc. Part III covers pension rules — retirement pension, family pension, gratuity, and DCRG.',
  },
  {
    q: 'Earned Leave (EL) എത്ര ദിവസം accumulate ചെയ്യാം?',
    a: 'As per amended KSR, Earned Leave can be accumulated up to a maximum of 360 days. EL is earned at 1 day for every 11 days of duty. On retirement, accumulated EL (max 300 days) can be encashed as Leave Salary.',
  },
  {
    q: 'Transfer-ൽ Joining Time എത്ര ദിവസം ലഭിക്കും?',
    a: 'Joining time on transfer depends on the distance between stations. Generally, 1 day for the first 200 km and 1 additional day for every subsequent 200 km or part thereof. Maximum joining time is typically 8 days, excluding travel time.',
  },
  {
    q: 'Maternity Leave കാലയളവ് എത്ര?',
    a: 'As per the latest KSR amendment (2024), Maternity Leave is 180 days for women government employees for the first two confinements. It is granted with full pay and counts as duty for all purposes.',
  },
  {
    q: 'Probation period എത്ര കാലം?',
    a: 'The probation period under KSR is generally 2 years of satisfactory service. For certain posts it may be different as specified. Probation must be declared by the appointing authority; otherwise service continues on probation. Leave periods may not count towards probation unless specified.',
  },
  {
    q: 'Study Leave ലഭിക്കുന്നതിന് എന്തൊക്കെ യോഗ്യതകൾ വേണം?',
    a: 'Study Leave is granted for pursuing higher studies relevant to the employee\'s post. Minimum 5 years of service is required. Maximum 24 months in the entire service period. A bond must be executed to serve for at least 3 years after returning from Study Leave.',
  },
  {
    q: 'KSR-ൽ Suspension-ൽ ആയ ജീവനക്കാർക്ക് subsistence allowance ലഭിക്കുമോ?',
    a: 'Yes. An employee under suspension is entitled to a Subsistence Allowance. For the first 3 months it is 50% of basic pay, and after 3 months it may be increased to 75% or reduced to 25% depending on the conduct of the departmental proceedings.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: KSR_FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default async function KsrPage() {
  const [{ data }, { data: articles }] = supabase ? await Promise.all([
    supabase.from('schemes').select('*').eq('slug', 'ksr').single(),
    supabase.from('news').select('*').eq('category', 'ksr').order('created_at', { ascending: false }),
  ]) : [{ data: null }, { data: [] }];

  const scheme = data || {};
  const posts = articles || [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen bg-[#121416] text-white">

        {/* ── 1. HERO ─────────────────────────────────────────── */}
        <div className="relative pt-32 pb-20 px-6 overflow-hidden bg-[#121416]">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(41,151,255,0.12), transparent)' }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(41,151,255,0.4), transparent)' }} />

          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-8">
              <a href="/" className="hover:text-white transition-colors no-underline text-white/50">Home</a>
              <span>›</span>
              <span style={{ color: BLUE }}>KSR</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
              style={{ color: BLUE, border: `1px solid ${BLUE}30`, background: `${BLUE}10` }}>
              📖 Kerala Service Rules
            </div>

            <h1 className="text-[clamp(36px,6vw,64px)] font-black tracking-tight leading-[1.05] mb-3"
              style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}>
              {scheme.title_ml || 'കേരള സർവ്വീസ് ചട്ടങ്ങൾ'}
            </h1>
            <p className="text-lg text-white/70 font-medium mb-2">
              Kerala Service Rules — Government Employees Handbook
            </p>
            <p className="text-sm text-white/50 mb-10">
              The complete rulebook for all Kerala government employees — pay, leave, transfer, pension & conduct.
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-xl">
              {[
                { label: 'Parts',      value: 'I–III',       sub: 'General · Leave · Pension' },
                { label: 'Applicable', value: 'All Staff',   sub: 'Govt & Aided employees' },
                { label: 'Authority',  value: 'Finance Dept',sub: 'Kerala Government' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-4 text-center"
                  style={{ background: `${BLUE}08`, border: `1px solid ${BLUE}20` }}>
                  <div className="text-lg font-black leading-tight" style={{ color: BLUE }}>{s.value}</div>
                  <div className="text-[10px] text-white/70 mt-1 font-semibold">{s.label}</div>
                  <div className="text-[9px] text-white/40 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 2. KEY FACTS STRIP ──────────────────────────────── */}
        <div className="border-y border-white/[0.06] bg-white/[0.02]">
          <div className="max-w-4xl mx-auto px-6 py-4 flex flex-wrap gap-3">
            {[
              '📋 3 Parts covering all service matters',
              '🏖️ Multiple leave types — EL, CL, ML, HPL',
              '🔄 Transfer & joining time rules',
              '📈 Promotion & DPC guidelines',
              '⚖️ Disciplinary proceedings',
            ].map(fact => (
              <span key={fact}
                className="text-xs font-semibold text-white/65 px-3 py-1.5 rounded-full"
                style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}>
                {fact}
              </span>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-20">

          {/* ── 3. WHAT IS KSR ──────────────────────────────────── */}
          <section>
            <SectionLabel label="What is KSR?" />
            <h2 className="text-2xl font-black text-white mb-4">KSR എന്താണ്?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-2xl" style={{ background: `${BLUE}06`, border: `1px solid ${BLUE}18` }}>
                <div className="text-2xl mb-3">📋</div>
                <h3 className="text-sm font-black text-white mb-2">Kerala Service Rules</h3>
                <p className="text-xs text-white/60 leading-relaxed" style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}>
                  KSR (Kerala Service Rules) കേരള സർക്കാർ ജീവനക്കാരുടെ സർവ്വീസ് വ്യവസ്ഥകൾ നിർണ്ണയിക്കുന്ന ഒരു സമഗ്ര ചട്ടസഞ്ചയം ആണ്. ശമ്പളം, അവധി, സ്ഥലമാറ്റം, സ്ഥാനക്കയറ്റം, പെൻഷൻ, അച്ചടക്കം — ഇവയെല്ലാം KSR-ൽ ഉൾക്കൊള്ളിക്കുന്നു.
                </p>
              </div>
              <div className="p-6 rounded-2xl" style={{ background: 'rgba(48,209,88,0.06)', border: '1px solid rgba(48,209,88,0.18)' }}>
                <div className="text-2xl mb-3">📗</div>
                <h3 className="text-sm font-black text-white mb-2">KSR Part I — General Service</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Covers appointments, pay fixation, allowances (HRA, DA, TA), transfers, promotions, joining time, deputation, and general conditions of service applicable to all government employees.
                </p>
              </div>
              <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,159,10,0.06)', border: '1px solid rgba(255,159,10,0.18)' }}>
                <div className="text-2xl mb-3">📙</div>
                <h3 className="text-sm font-black text-white mb-2">KSR Part II — Leave Rules</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  All leave types — Earned Leave (EL), Casual Leave (CL), Medical Leave, Half Pay Leave (HPL), Maternity/Paternity Leave, Study Leave, Special CL, Hospital Leave — eligibility, accumulation, and encashment.
                </p>
              </div>
              <div className="p-6 rounded-2xl" style={{ background: 'rgba(191,90,242,0.06)', border: '1px solid rgba(191,90,242,0.18)' }}>
                <div className="text-2xl mb-3">📘</div>
                <h3 className="text-sm font-black text-white mb-2">KSR Part III — Pension Rules</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Retirement pension, family pension, commutation, DCRG (Death-cum-Retirement Gratuity), voluntary retirement, and pensionary benefits for pre-2013 employees and their families.
                </p>
              </div>
            </div>

            {/* Quick reference strip */}
            <div className="p-5 rounded-2xl" style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-sm)' }}>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Commonly Referenced Rules</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                {[
                  { icon: '🏖️', rule: 'Rule 14–22',    label: 'Earned Leave',    slug: 'earned-leave' },
                  { icon: '⏱️', rule: 'Rule 61–67',    label: 'Joining Time',    slug: 'joining-time' },
                  { icon: '👶', rule: 'Rule 101',       label: 'Maternity Leave', slug: 'maternity-leave' },
                  { icon: '📚', rule: 'Rule 107',       label: 'Study Leave',     slug: 'study-leave' },
                  { icon: '🚌', rule: 'SR 46–60',       label: 'Transfer TA',     slug: 'transfer-ta' },
                  { icon: '🎖️', rule: 'Rule 77',        label: 'DCRG',            slug: 'dcrg' },
                  { icon: '👨‍👩‍👧', rule: 'Rule 83',        label: 'Family Pension',  slug: 'family-pension' },
                  { icon: '⚖️', rule: 'KCS Rules',      label: 'Disciplinary',    slug: 'disciplinary' },
                ].map(r => (
                  <Link key={r.label} href={`/ksr/rules/${r.slug}`}
                    className="group p-3 rounded-xl no-underline transition-all hover:-translate-y-0.5"
                    style={{ background: `${BLUE}06`, border: `1px solid ${BLUE}12` }}>
                    <div className="text-xl mb-1">{r.icon}</div>
                    <div className="font-black text-white/80 text-[9px] mb-0.5">{r.label}</div>
                    <div className="text-white/35 text-[9px]">{r.rule}</div>
                    <div className="text-[8px] mt-1.5 font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: BLUE }}>View →</div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* ── 4. KSR PART NAVIGATION ──────────────────────────── */}
          <section>
            <SectionLabel label="Parts" />
            <h2 className="text-2xl font-black text-white mb-2">KSR Part-wise Guide</h2>
            <p className="text-sm text-white/50 mb-6">
              Navigate to the section most relevant to your query.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  part: 'Part I',
                  href: '/ksr/part-1',
                  title: 'General Service Conditions',
                  color: BLUE,
                  icon: '🏛️',
                  items: ['Pay Fixation & Increments', 'Transfer & TA Rules', 'Promotion & DPC', 'Deputation Rules', 'Joining Time', 'Conduct & Discipline'],
                },
                {
                  part: 'Part II',
                  href: '/ksr/part-2',
                  title: 'Leave Rules',
                  color: '#ff9f0a',
                  icon: '🏖️',
                  items: ['Earned Leave (EL)', 'Casual Leave (CL)', 'Medical / HPL', 'Maternity & Paternity', 'Study Leave', 'Leave Encashment'],
                },
                {
                  part: 'Part III',
                  href: '/ksr/part-3',
                  title: 'Pension Rules',
                  color: '#bf5af2',
                  icon: '🏦',
                  items: ['Service Pension', 'Family Pension', 'Commutation', 'DCRG / Gratuity', 'Voluntary Retirement', 'Invalid Pension'],
                },
              ].map(p => (
                <Link key={p.part} href={p.href}
                  className="group p-5 rounded-2xl flex flex-col gap-3 no-underline transition-all hover:-translate-y-0.5"
                  style={{ background: 'var(--surface-xs)', border: `1px solid ${p.color}20` }}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{p.icon}</div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: p.color }}>{p.part}</div>
                        <div className="text-sm font-black text-white leading-tight">{p.title}</div>
                      </div>
                    </div>
                    <span className="text-white/25 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all text-sm flex-shrink-0">→</span>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {p.items.map(item => (
                      <li key={item} className="flex items-center gap-2 text-xs text-white/60">
                        <span style={{ color: p.color }} className="text-[8px]">✦</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="text-[10px] font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: p.color }}>
                    View full {p.part} rules →
                  </div>
                </Link>
              ))}
            </div>

            {/* Related calculators */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/pension"
                className="group flex items-center justify-between gap-4 p-5 rounded-2xl no-underline transition-all hover:-translate-y-0.5"
                style={{ background: `${BLUE}08`, border: `1px solid ${BLUE}20` }}>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: BLUE }}>Part III Calculator</div>
                  <div className="font-black text-white text-base leading-tight">Pension Calculator</div>
                  <div className="text-xs text-white/50 mt-1">KSR Part III — compute your retirement pension</div>
                </div>
                <span className="text-2xl flex-shrink-0 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link href="/dcrg"
                className="group flex items-center justify-between gap-4 p-5 rounded-2xl no-underline transition-all hover:-translate-y-0.5"
                style={{ background: 'rgba(255,159,10,0.08)', border: '1px solid rgba(255,159,10,0.20)' }}>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#ff9f0a' }}>Part III Calculator</div>
                  <div className="font-black text-white text-base leading-tight">DCRG Calculator</div>
                  <div className="text-xs text-white/50 mt-1">KSR Rule 77 — Death-cum-Retirement Gratuity</div>
                </div>
                <span className="text-2xl flex-shrink-0 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </section>

          {/* ── 5. KSR GOVERNMENT ORDERS ────────────────────────── */}
          <section>
            <SectionLabel label="Government Orders" />
            <h2 className="text-2xl font-black text-white mb-2">KSR ഉത്തരവുകളും ഭേദഗതികളും</h2>
            <p className="text-sm text-white/50 mb-8">
              Official KSR amendments, Government Orders, and Circulars from Kerala Finance Department.
            </p>
            <KsrGovOrders previewMode previewLimit={5} />
          </section>

          {/* ── 6. ARTICLES ─────────────────────────────────────── */}
          {posts.length > 0 && (
            <section>
              <SectionLabel label="Articles" />
              <h2 className="text-2xl font-black text-white mb-6">KSR ലേഖനങ്ങൾ</h2>
              <div className="flex flex-col gap-4">
                {posts.map(post => (
                  <Link key={post.id} href={`/news/${post.id}`}
                    className="group block p-6 rounded-2xl no-underline transition-all hover:-translate-y-0.5"
                    style={{ background: `${BLUE}05`, border: `1px solid ${BLUE}15` }}>
                    {post.image_url && (
                      <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4">
                        <Image src={post.image_url} alt={`${post.title_ml || post.title_en || 'KSR article'} article thumbnail`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 600px" loading="lazy" />
                      </div>
                    )}
                    <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: BLUE }}>
                      {new Date(post.created_at).toLocaleDateString('ml-IN', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </div>
                    <h3 className="text-base font-bold text-white/90 group-hover:text-white mb-1 transition-colors"
                      style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}>
                      {post.title_ml}
                    </h3>
                    {post.summary_ml && (
                      <p className="text-sm text-white/55 leading-relaxed line-clamp-3">{post.summary_ml}</p>
                    )}
                    <span className="inline-block mt-3 text-xs font-bold" style={{ color: BLUE }}>
                      വായിക്കുക →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── 7. FAQ ──────────────────────────────────────────── */}
          <section>
            <SectionLabel label="FAQ" />
            <h2 className="text-2xl font-black text-white mb-2">KSR സംശയങ്ങൾ — FAQ</h2>
            <p className="text-sm text-white/50 mb-8">
              Frequently asked questions about Kerala Service Rules.
            </p>
            <div className="flex flex-col gap-3">
              {KSR_FAQS.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </section>

          {/* ── 8. ASK A DOUBT ──────────────────────────────────── */}
          <section>
            <SectionLabel label="Ask Us" />
            <h2 className="text-2xl font-black text-white mb-2">KSR സംശയം ചോദിക്കൂ</h2>
            <p className="text-sm text-white/50 mb-8">
              Have a question about KSR not answered above? Submit it and we'll add it to our FAQ.
            </p>
            <KsrQueryForm />
          </section>

          <RelatedLinks
            heading="Related"
            links={[
              { href: '/departmental-tests', label: 'Departmental test eligibility' },
              { href: '/leave', label: 'Leave rules (KSR Part II)' },
              { href: '/forms', label: 'KSR service forms' },
            ]}
          />

          <div className="pt-4 border-t border-white/[0.06]">
            <a href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold no-underline transition-all"
              style={{ background: `${BLUE}10`, color: BLUE, border: `1px solid ${BLUE}25` }}>
              ← Back to Home
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

function SectionLabel({ label }) {
  return (
    <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-2" style={{ color: BLUE }}>
      {label}
    </p>
  );
}

function FaqItem({ q, a }) {
  return (
    <details
      className="group rounded-2xl overflow-hidden"
      style={{ background: `${BLUE}04`, border: `1px solid ${BLUE}12` }}>
      <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none">
        <span className="text-sm font-semibold text-white/90 leading-snug"
          style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}>
          {q}
        </span>
        <span className="text-white/40 flex-shrink-0 text-lg leading-none transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="px-5 pb-5 text-sm text-white/65 leading-relaxed border-t border-white/[0.06] pt-4">
        {a}
      </div>
    </details>
  );
}
