import { supabase, getNpsDocuments, getNpsArticles } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NpsQueryForm from '@/components/NpsQueryForm';
import NpsCorpusCalculator from '@/components/NpsCorpusCalculator';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 60;

export const metadata = buildMetadata({
  title: 'NPS — National Pension System for Kerala Government Employees',
  description:
    'Complete guide to NPS (National Pension System) for Kerala government employees. Contribution rules, PRAN, withdrawal, APS comparison, circulars, GOs, and calculator.',
  path: '/nps',
  keywords: [
    'NPS Kerala', 'National Pension System Kerala', 'NPS ജീവനക്കാർ',
    'Kerala NPS PRAN', 'NPS vs APS Kerala', 'NPS withdrawal rules Kerala',
    'NPS contribution Kerala', 'NPS circular Kerala',
  ],
});

const PURPLE = '#bf5af2';

const NPS_FAQS = [
  {
    q: 'NPS എന്നാൽ എന്താണ്? (What is NPS?)',
    a: 'NPS (National Pension System) is a market-linked, defined-contribution pension scheme for Kerala government employees appointed on or after 01.04.2013. Both the employee and the government contribute 10% of Basic Pay + DA each month to the PRAN account.',
  },
  {
    q: '01.04.2013-ന് ശേഷം നിയമിതരായ ജീവനക്കാർക്ക് NPS ബാധകമാണോ?',
    a: 'Yes. All Kerala government employees appointed on or after 01.04.2013 are mandatorily covered under NPS. Employees appointed before that date continue under the old pension scheme.',
  },
  {
    q: 'NPS-ൽ PRAN എന്നാൽ എന്ത്?',
    a: "PRAN stands for Permanent Retirement Account Number. It is a unique 12-digit number allotted to every NPS subscriber. All contributions, investments, and transactions are linked to this number throughout the employee's service.",
  },
  {
    q: 'NPS-ൽ നിന്ന് retirement-ൽ എത്ര പണം ലഭിക്കും?',
    a: 'At retirement (age 60), you can withdraw up to 60% of the NPS corpus as a tax-free lump sum. The remaining 40% must be used to purchase an annuity (monthly pension) from an IRDAI-registered insurance company.',
  },
  {
    q: 'NPS-ഉം APS-ഉം തമ്മിലുള്ള വ്യത്യാസം എന്ത്?',
    a: 'NPS is market-linked — your pension depends on investment returns. APS (Assured Pension Scheme) guarantees 50% of last drawn salary as pension, similar to the old pension scheme. APS offers certainty; NPS offers potentially higher returns in a good market.',
  },
  {
    q: 'NPS-ൽ നിന്ന് APS-ലേക്ക് മാറാൻ കഴിയുമോ?',
    a: "Yes. Eligible NPS-covered Kerala government employees can opt for APS as per the state government's notification. Once opted, the accumulated NPS corpus is handled as per APS scheme rules. Check the latest Finance Department GO for current opt-in procedure and deadlines.",
  },
  {
    q: 'NPS കോർപ്പസ് നഷ്ടപ്പെടുമോ?',
    a: 'NPS funds are invested in government securities, corporate bonds, and equities based on the chosen scheme (Tier I). While market fluctuations affect returns, the long-term track record of NPS funds (especially government bond-heavy schemes) has been stable. Capital is not guaranteed but risk is managed through regulated fund managers.',
  },
  {
    q: 'GPF-ന് പകരം NPS ഉണ്ടോ?',
    a: 'No. GPF (General Provident Fund) is separate and continues for employees under the old pension scheme. NPS employees do not have GPF — they have the NPS Tier I account (mandatory) and can optionally open a Tier II account as a savings account.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: NPS_FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default async function NpsPage() {
  const [schemeResult, documents, articles] = await Promise.all([
    supabase.from('schemes').select('*').eq('slug', 'nps').single(),
    getNpsDocuments(),
    getNpsArticles(),
  ]);
  const schemeData = schemeResult?.data || null;

  const scheme = schemeData || {};

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
            style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(191,90,242,0.12), transparent)' }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(191,90,242,0.4), transparent)' }} />

          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-8">
              <a href="/" className="hover:text-white transition-colors no-underline text-white/50">Home</a>
              <span>›</span>
              <span style={{ color: PURPLE }}>NPS</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
              style={{ color: PURPLE, border: `1px solid ${PURPLE}30`, background: `${PURPLE}10` }}>
              📊 National Pension System
            </div>

            <h1 className="text-[clamp(36px,6vw,64px)] font-black tracking-tight leading-[1.05] mb-3"
              style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}>
              {scheme.title_ml || 'നാഷണൽ പെൻഷൻ സ്കീം'}
            </h1>
            <p className="text-lg text-white/70 font-medium mb-2">
              National Pension System — Kerala Government Employees
            </p>
            <p className="text-sm text-white/50 mb-10">
              Applicable for employees appointed on or after{' '}
              <strong className="text-white/80">01.04.2013</strong>
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-xl">
              {[
                { label: 'Employee Contribution', value: '10%', sub: 'of Basic + DA' },
                { label: 'Govt Contribution',     value: '10%', sub: 'of Basic + DA' },
                { label: 'Min. Annuity at Exit',  value: '40%', sub: 'of corpus'     },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-4 text-center"
                  style={{ background: `${PURPLE}08`, border: `1px solid ${PURPLE}20` }}>
                  <div className="text-2xl font-black" style={{ color: PURPLE }}>{s.value}</div>
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
              '📅 Applicable from 01.04.2013',
              '🪪 PRAN mandatory for all',
              '🎯 Exit at age 60',
              '💰 60% lump sum tax-free',
              '📈 Market-linked corpus',
            ].map(fact => (
              <span key={fact}
                className="text-xs font-semibold text-white/65 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {fact}
              </span>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-20">

          {/* ── 3. CALCULATOR LINKS ─────────────────────────────── */}
          <section>
            <SectionLabel label="Calculators" />
            <h2 className="text-2xl font-black text-white mb-6">NPS Calculators</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  href: '/nps-aps',
                  title: 'NPS vs APS Calculator',
                  sub: 'Compare NPS corpus projection with Assured Pension Scheme',
                  icon: '⚖️',
                },
              ].map(c => (
                <Link key={c.href} href={c.href}
                  className="group flex items-start gap-4 p-5 rounded-2xl no-underline transition-all hover:-translate-y-0.5"
                  style={{ background: `${PURPLE}08`, border: `1px solid ${PURPLE}20` }}>
                  <span className="text-3xl">{c.icon}</span>
                  <div>
                    <div className="font-bold text-white group-hover:text-white transition-colors mb-1">{c.title}</div>
                    <div className="text-xs text-white/55 leading-relaxed">{c.sub}</div>
                    <span className="inline-block mt-2 text-xs font-bold" style={{ color: PURPLE }}>Open →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── 3b. NPS CORPUS CALCULATOR ───────────────────────── */}
          <section>
            <SectionLabel label="Calculator" />
            <h2 className="text-2xl font-black text-white mb-2">NPS Corpus Calculator</h2>
            <p className="text-sm text-white/50 mb-8">
              Estimate your NPS corpus and monthly pension at retirement based on your current pay and service years.
            </p>
            <NpsCorpusCalculator />
          </section>

          {/* ── 4. NPS DOCUMENTS ────────────────────────────────── */}
          <section>
            <SectionLabel label="Documents" />
            <h2 className="text-2xl font-black text-white mb-6">NPS Documents & Circulars</h2>
            {documents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {documents.map(doc => (
                  <div key={doc.id}
                    className="flex items-start gap-4 p-5 rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                      style={{ background: `${PURPLE}15` }}>
                      📄
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="mb-1">
                        <DocTypeBadge type={doc.doc_type} />
                      </div>
                      <div className="font-semibold text-white/90 text-sm leading-snug mb-0.5"
                        style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}>
                        {doc.title_ml || doc.title}
                      </div>
                      {doc.description && (
                        <div className="text-xs text-white/50 mb-3 line-clamp-2">{doc.description}</div>
                      )}
                      <a href={doc.pdf_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold no-underline px-3 py-1.5 rounded-lg transition-all"
                        style={{ background: `${PURPLE}15`, color: PURPLE, border: `1px solid ${PURPLE}25` }}>
                        ⬇ Download PDF
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon="📄" text="Documents will appear here once uploaded." />
            )}
          </section>

          {/* ── 5. NPS ARTICLES ─────────────────────────────────── */}
          {articles.length > 0 && (
            <section>
              <SectionLabel label="Articles" />
              <h2 className="text-2xl font-black text-white mb-6">NPS ലേഖനങ്ങൾ</h2>
              <div className="flex flex-col gap-4">
                {articles.map(post => (
                  <Link key={post.id} href={`/news/${post.id}`}
                    className="group block p-6 rounded-2xl no-underline transition-all hover:-translate-y-0.5"
                    style={{ background: `${PURPLE}05`, border: `1px solid ${PURPLE}15` }}>
                    {post.image_url && (
                      <img src={post.image_url} alt="" className="w-full h-44 object-cover rounded-xl mb-4" />
                    )}
                    <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: PURPLE }}>
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
                    <span className="inline-block mt-3 text-xs font-bold" style={{ color: PURPLE }}>
                      വായിക്കുക →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── 6. FAQ ──────────────────────────────────────────── */}
          <section>
            <SectionLabel label="FAQ" />
            <h2 className="text-2xl font-black text-white mb-2">NPS സംശയങ്ങൾ — FAQ</h2>
            <p className="text-sm text-white/50 mb-8">
              Frequently asked questions about NPS for Kerala government employees.
            </p>
            <div className="flex flex-col gap-3">
              {NPS_FAQS.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </section>

          {/* ── 7. ASK A DOUBT ──────────────────────────────────── */}
          <section>
            <SectionLabel label="Ask Us" />
            <h2 className="text-2xl font-black text-white mb-2">NPS സംശയം ചോദിക്കൂ</h2>
            <p className="text-sm text-white/50 mb-8">
              Have a question about NPS not answered above? Submit it and we'll add it to our FAQ.
            </p>
            <NpsQueryForm />
          </section>

          <div className="pt-4 border-t border-white/[0.06]">
            <a href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold no-underline transition-all"
              style={{ background: `${PURPLE}10`, color: PURPLE, border: `1px solid ${PURPLE}25` }}>
              ← Back to Home
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

/* ── Reusable sub-components ──────────────────────────────────── */

function SectionLabel({ label }) {
  return (
    <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-2" style={{ color: PURPLE }}>
      {label}
    </p>
  );
}

function DocTypeBadge({ type }) {
  const map = {
    circular: { label: 'Circular', bg: 'rgba(100,210,255,0.12)', color: '#64d2ff' },
    go:       { label: 'GO',       bg: 'rgba(48,209,88,0.12)',   color: '#30d158' },
    guide:    { label: 'Guide',    bg: 'rgba(191,90,242,0.12)',  color: '#bf5af2' },
  };
  const s = map[type] || map.circular;
  return (
    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
      style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div className="text-center py-16 text-white/40">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-sm">{text}</p>
    </div>
  );
}

function FaqItem({ q, a }) {
  return (
    <details
      className="group rounded-2xl overflow-hidden"
      style={{ background: 'rgba(191,90,242,0.04)', border: '1px solid rgba(191,90,242,0.12)' }}>
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
