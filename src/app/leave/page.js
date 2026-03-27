import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Leave Rules — Kerala Government Employees | KSR',
  description: 'Kerala government employee leave rules — earned leave, HPL, casual leave, maternity leave, study leave. KSR Part I leave provisions explained clearly.',
  path: '/leave',
  keywords: ['Kerala leave rules', 'Kerala government leave', 'KSR leave rules', 'earned leave Kerala', 'HPL half pay leave Kerala'],
});

const CARDS = [
  {
    href: '/leave/earned',
    icon: '📅',
    color: '#ff9f0a',
    title: 'Earned Leave Calculator',
    titleMl: 'Earned Leave കാൽക്കുലേറ്റർ',
    desc: 'Calculate EL balance for permanent, temporary, vacation-department and limited-period officers as per KSR Part I.',
    tags: ['EL', 'LPR', 'Vacation Dept', 'KSR'],
  },
  {
    href: '/leave/hpl',
    icon: '📋',
    color: '#64d2ff',
    title: 'HPL & Commuted Leave Calculator',
    titleMl: 'HPL & Commuted Leave കാൽക്കുലേറ്റർ',
    desc: 'Calculate Half-Pay Leave and Commuted Leave balance. Includes "Can I take X days?" eligibility checker and LWA exclusion.',
    tags: ['HPL', 'Commuted', 'CL', 'LWA'],
  },
];

export default function LeavePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-aurora text-white pt-[100px]">
        <div className="max-w-4xl mx-auto px-6 py-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/60 mb-8">
            <a href="/" className="hover:text-white transition-colors no-underline text-white/60">Home</a>
            <span>›</span>
            <a href="/ksr" className="hover:text-white transition-colors no-underline text-white/60">Kerala Service Rules</a>
            <span>›</span>
            <span className="text-[#ff9f0a]">Leave Calculator</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="section-label mb-2">Leave Calculators</div>
            <h1
              className="text-[clamp(22px,3vw,32px)] font-[900] tracking-[-0.02em] text-white leading-tight"
              style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}
            >
              ലീവ് കണക്കുകൂട്ടൽ
            </h1>
            <p className="text-sm text-white/55 mt-2">
              Kerala Service Rules (KSR) Part I — Choose a calculator below
            </p>
            <div className="h-[2px] w-10 bg-gradient-to-r from-[#ff9f0a] to-transparent mt-3 rounded-full" />
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CARDS.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="glass-card group relative flex flex-col rounded-2xl p-6 no-underline transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)] overflow-hidden"
              >
                {/* Glow blob */}
                <div
                  className="absolute -top-6 -left-6 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: card.color + '30' }}
                />

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: `linear-gradient(90deg, transparent, ${card.color}80, transparent)` }}
                />

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-200 group-hover:scale-105"
                  style={{ background: card.color + '20', border: `1px solid ${card.color}35` }}
                >
                  {card.icon}
                </div>

                {/* Title */}
                <h2
                  className="text-base font-[900] text-white leading-snug mb-1 group-hover:text-white transition-colors"
                  style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}
                >
                  {card.titleMl}
                </h2>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-3">
                  {card.title}
                </p>

                {/* Description */}
                <p className="text-xs text-white/55 leading-relaxed mb-4 flex-1">
                  {card.desc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {card.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: card.color + '15', color: card.color, border: `1px solid ${card.color}25` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <div
                  className="absolute top-5 right-5 text-white/20 group-hover:text-white/60 transition-all duration-200 group-hover:translate-x-0.5 text-lg"
                >
                  →
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
