// src/app/experiences/[id]/page.js
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReadingProgress from '@/components/ReadingProgress';
import ExperienceReactions from '@/components/ExperienceReactions';
import ExperienceComments from '@/components/ExperienceComments';
import ExperienceShareActions from '@/components/ExperienceShareActions';
import ExperienceShareCta from '@/components/ExperienceShareCta';
import ExperienceCard from '@/components/ExperienceCard';
import {
  readTime,
  extractPullQuote,
  splitBodyForQuote,
  trendingScore as calcTrendingScore,
} from '@/lib/experiences';

export const revalidate = 60;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const GREEN = '#30d158';

function getAvatarColor(name) {
  if (!name) return 'rgba(255,255,255,0.15)';
  const code = name.charCodeAt(0);
  const hue = (code * 47) % 360;
  return `hsl(${hue}, 60%, 45%)`;
}

function formatDate(str) {
  return new Date(str).toLocaleDateString('ml-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

async function getExperience(id) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/experiences?id=eq.${encodeURIComponent(id)}&status=eq.published&select=id,title,body,author_name,department,is_anonymous,is_pinned,published_at,forum_thread_id`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch {
    return null;
  }
}

async function getReactionCounts(id) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/experience_reactions?experience_id=eq.${encodeURIComponent(id)}&select=type`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return { helpful: 0, relatable: 0 };
    const reactions = await res.json();
    const counts = { helpful: 0, relatable: 0 };
    if (Array.isArray(reactions)) {
      for (const r of reactions) {
        if (r.type === 'helpful') counts.helpful += 1;
        if (r.type === 'relatable') counts.relatable += 1;
      }
    }
    return counts;
  } catch {
    return { helpful: 0, relatable: 0 };
  }
}

async function getForumThreadCommentCount(threadId) {
  if (!threadId) return 0;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/forum_replies?thread_id=eq.${encodeURIComponent(threadId)}&select=id`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return 0;
    const data = await res.json();
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}

// Fetch all published experiences for related stories (same query as listing page)
async function getAllExperiences() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/experiences?status=eq.published&select=id,title,body,author_name,department,is_anonymous,is_pinned,published_at&order=published_at.desc&limit=50`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const experience = await getExperience(params.id);
  if (!experience) {
    return { title: 'Experience Not Found' };
  }
  return {
    title: experience.title,
    description: ([...experience.body || '']).slice(0, 160).join(''),
  };
}

function PullQuote({ text }) {
  return (
    <div
      className="my-5 px-4 py-3"
      style={{
        borderLeft: `3px solid ${GREEN}`,
        background: 'rgba(48,209,88,0.05)',
        borderRadius: 8,
      }}
    >
      <p
        className="text-[16px] italic leading-relaxed"
        style={{
          color: 'rgba(255,255,255,0.85)',
          fontFamily: 'var(--font-noto-malayalam), sans-serif',
        }}
      >
        ❝ {text} ❞
      </p>
    </div>
  );
}

export default async function ExperienceDetailPage({ params }) {
  const { id } = params;
  const experience = await getExperience(id);

  if (!experience) {
    return (
      <div className="relative min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Navbar />
        <main className="px-4 md:px-6 max-w-[800px] mx-auto pt-24 pb-16 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h1 className="text-white text-2xl font-bold mb-2">Experience not found</h1>
          <p className="text-white/50 mb-6">This experience may have been removed or not yet published.</p>
          <Link
            href="/experiences"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[13px] font-bold no-underline"
            style={{ background: `${GREEN}20`, color: GREEN, border: `1px solid ${GREEN}40` }}
          >
            ← Back to Experiences
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const [reactionCounts, commentCount, allExperiences] = await Promise.all([
    getReactionCounts(id),
    getForumThreadCommentCount(experience.forum_thread_id),
    getAllExperiences(),
  ]);

  // Related stories: top 3 by trendingScore, excluding current id
  const related = allExperiences
    .filter((e) => e.id !== id)
    .map((e) => ({
      ...e,
      helpful_count: 0,
      relatable_count: 0,
      recentReactions: 0,
      trendingScore: calcTrendingScore(0, 0, e.published_at),
      readTime: readTime(e.body),
    }))
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
    .slice(0, 3);

  const displayAuthor = experience.is_anonymous ? 'Anonymous' : (experience.author_name || 'Anonymous');
  const displayDate = experience.published_at || experience.created_at;
  const avatarBg = experience.is_anonymous
    ? 'rgba(255,255,255,0.15)'
    : getAvatarColor(experience.author_name || '');
  const avatarLetter = experience.is_anonymous ? '?' : (experience.author_name || '?').charAt(0).toUpperCase();

  // Reading metadata
  const rt = readTime(experience.body);

  // Pull quote
  const pullQuote = extractPullQuote(experience.body);
  let bodyBefore = experience.body;
  let bodyAfter = '';
  if (pullQuote) {
    [bodyBefore, bodyAfter] = splitBodyForQuote(experience.body);
  }

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <ReadingProgress />
      <Navbar />

      <main className="px-4 md:px-6 max-w-[800px] mx-auto pt-24 pb-16">
        {/* Breadcrumb */}
        <Link
          href="/experiences"
          className="inline-flex items-center gap-1.5 text-[12px] text-white/40 hover:text-white/70 transition-colors no-underline mb-6"
        >
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Experiences
        </Link>

        {/* Article card */}
        <article
          className="glass-card rounded-[24px] overflow-hidden"
          style={{ border: '1px solid var(--border-sm)' }}
        >
          {/* Header */}
          <div className="p-6 md:p-8 pb-0">
            <h1
              className="text-[clamp(22px,3.5vw,32px)] font-[900] text-white leading-tight mb-4"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
            >
              {experience.title}
            </h1>

            {/* Reading metadata */}
            <div className="flex items-center gap-2 flex-wrap text-[12px] text-white/40 mb-5">
              <span>📖 ~{rt} min read</span>
              <span>·</span>
              <span>{reactionCounts.helpful} people found this helpful</span>
              <span>·</span>
              <span style={{ color: GREEN }}>✔ Reviewed</span>
            </div>

            {/* Author row */}
            <div className="flex items-center gap-3 pb-6" style={{ borderBottom: '1px solid var(--border-xs)' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: avatarBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 700,
                  color: experience.is_anonymous ? 'rgba(255,255,255,0.6)' : '#fff',
                  flexShrink: 0,
                }}
              >
                {avatarLetter}
              </div>
              <div>
                <div className="text-[14px] font-semibold text-white/85">{displayAuthor}</div>
                <div className="flex items-center gap-2 text-[11px] text-white/40 mt-0.5 flex-wrap">
                  {experience.department && (
                    <>
                      <span>{experience.department}</span>
                      <span>·</span>
                    </>
                  )}
                  {displayDate && <span>{formatDate(displayDate)}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Body — with optional pull quote */}
          <div className="px-6 md:px-8 py-6">
            {pullQuote ? (
              <>
                <p
                  className="text-[15px] text-white/80 leading-[1.8] whitespace-pre-wrap text-justify"
                  style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
                >
                  {bodyBefore}
                </p>
                <PullQuote text={pullQuote} />
                <p
                  className="text-[15px] text-white/80 leading-[1.8] whitespace-pre-wrap text-justify"
                  style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
                >
                  {bodyAfter}
                </p>
              </>
            ) : (
              <p
                className="text-[15px] text-white/80 leading-[1.8] whitespace-pre-wrap text-justify"
                style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
              >
                {experience.body}
              </p>
            )}
          </div>

          {/* Footer: reactions + share */}
          <div
            className="px-6 md:px-8 py-5 flex flex-col gap-4"
            style={{ borderTop: '1px solid var(--border-xs)' }}
          >
            <ExperienceReactions
              experienceId={id}
              initialCounts={reactionCounts}
            />
            <ExperienceShareActions title={experience.title} id={id} />
          </div>
        </article>

        {/* Share CTA */}
        <ExperienceShareCta />

        {/* Comments */}
        <ExperienceComments threadId={experience.forum_thread_id || null} />

        {/* Related Stories */}
        {related.length > 0 && (
          <div className="mt-10">
            <div className="text-[10px] font-black uppercase tracking-widest mb-4 text-white/40">
              മറ്റ് അനുഭവങ്ങൾ
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          </div>
        )}

        {/* Back CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/experiences"
            className="inline-flex items-center gap-2 text-[13px] text-white/40 hover:text-white/70 transition-colors no-underline"
          >
            ← View all experiences
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
