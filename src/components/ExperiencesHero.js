import Link from 'next/link';
import ExperiencesHeroStats from './ExperiencesHeroStats';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function getHeroStats() {
  try {
    const headers = {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: 'count=exact',
    };
    const opts = { headers, next: { revalidate: 3600 } };

    const [totalRes, anonRes, reactRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/experiences?status=eq.published&select=id`, { ...opts, method: 'HEAD' }),
      fetch(`${SUPABASE_URL}/rest/v1/experiences?status=eq.published&is_anonymous=eq.true&select=id`, { ...opts, method: 'HEAD' }),
      fetch(`${SUPABASE_URL}/rest/v1/experience_reactions?select=id`, { ...opts, method: 'HEAD' }),
    ]);

    const total    = parseInt(totalRes.headers.get('content-range')?.split('/')[1] || '0', 10);
    const anon     = parseInt(anonRes.headers.get('content-range')?.split('/')[1]  || '0', 10);
    const reactions = parseInt(reactRes.headers.get('content-range')?.split('/')[1] || '0', 10);
    const pct      = total > 0 ? Math.round((anon / total) * 100) : 0;

    return { total, reactions, pct };
  } catch {
    return { total: 0, reactions: 0, pct: 0 };
  }
}

export default async function ExperiencesHero() {
  const { total, reactions, pct } = await getHeroStats();

  return (
    <div className="relative overflow-hidden px-4 md:px-6 pt-8 pb-10 mb-2">
      {/* Radial glow */}
      <div
        style={{
          position: 'absolute', top: '30%', left: '30%',
          width: 500, height: 300,
          background: 'radial-gradient(ellipse, rgba(48,209,88,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      {/* Decorative quote watermark */}
      <div
        style={{
          position: 'absolute', top: -40, right: 0,
          fontFamily: 'Georgia, serif', fontSize: 300,
          lineHeight: 1, opacity: 0.04,
          color: 'var(--text-primary)', userSelect: 'none', pointerEvents: 'none',
        }}
      >
        &ldquo;
      </div>

      <div className="relative max-w-[1200px] mx-auto text-center">
        {/* Label */}
        <div
          className="text-[10px] font-black uppercase tracking-[0.1em] mb-3"
          style={{ color: 'var(--accent-green)' }}
        >
          Community · Real Stories
        </div>

        {/* H1 — English, for SEO (screen-reader visible, visually hidden) */}
        <h1 className="sr-only">
          Kerala Government Employee Experiences – Real Stories on Pension, GPF, Transfer &amp; Service Issues
        </h1>

        {/* Visual headline — Malayalam, large */}
        <p
          className="text-[clamp(32px,5vw,52px)] font-[900] tracking-[-0.02em] leading-tight mb-1"
          style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif', color: 'var(--text-primary)' }}
        >
          അനുഭവങ്ങൾ
        </p>

        {/* Visible English subtitle */}
        <p className="text-[15px] mb-4" style={{ color: 'var(--text-secondary)' }}>
          What actually happens in Kerala Government service
        </p>

        {/* Purpose statement — Malayalam */}
        <p
          className="text-[15px] leading-[1.8] max-w-[640px] mx-auto mb-6"
          style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif', color: 'var(--text-dim)' }}
        >
          3 ദിവസത്തിനുള്ളിൽ GPF ലോൺ ലഭിച്ച കഥകൾ. ഒരു വർഷം കാത്തിരുന്ന
          സ്ഥലംമാറ്റം. ഒരു ഫോൺ കോളിൽ തീർന്ന റിട്ടയർമെന്റ് രേഖകൾ.
          കേരള സർക്കാർ ജീവനക്കാർ അവരുടെ യഥാർത്ഥ അനുഭവങ്ങൾ ഇവിടെ
          പങ്കിടുന്നു — അപേക്ഷിക്കുന്നതിന് മുൻപ് നിങ്ങൾ അറിഞ്ഞിരിക്കേണ്ടത്.
        </p>

        {/* Scope pills — decorative only */}
        <div className="flex gap-2 flex-wrap mb-6 justify-center" style={{ pointerEvents: 'none' }}>
          {[
            '📋 സേവന പ്രക്രിയകൾ',
            '🏦 ലോൺ & GPF',
            '🚌 സ്ഥലംമാറ്റം & സ്ഥാനക്കയറ്റം',
          ].map((pill) => (
            <span
              key={pill}
              className="text-[12px] px-3 py-1 rounded-full"
              style={{
                background: 'var(--surface-xs)',
                border: '1px solid var(--border-sm)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-noto-malayalam), sans-serif',
              }}
            >
              {pill}
            </span>
          ))}
        </div>

        {/* Stats + CTA row */}
        <div className="flex items-center justify-center flex-wrap gap-4">
          <ExperiencesHeroStats
            totalStories={total}
            totalReactions={reactions}
            anonymousPct={pct}
          />
          <div className="flex flex-col items-center gap-1">
            <Link
              href="/experiences/submit"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-[13px] font-bold no-underline transition-all experiences-cta-btn"
            >
              + അനുഭവം പങ്കിടുക →
            </Link>
            <span className="text-[11px]" style={{ color: 'var(--text-ghost)' }}>Anonymous posting supported</span>
          </div>
        </div>
      </div>
    </div>
  );
}
