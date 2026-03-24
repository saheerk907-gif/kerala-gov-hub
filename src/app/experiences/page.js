// src/app/experiences/page.js
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ExperienceCard from '@/components/ExperienceCard';
import { trendingScore as calcTrendingScore, readTime } from '@/lib/experiences';

export const revalidate = 60;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const GREEN = '#30d158';
const GOLD = '#c8960c';

async function getExperiences() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/experiences?status=eq.published&select=id,title,body,author_name,department,is_anonymous,is_pinned,published_at,forum_thread_id&order=is_pinned.desc,published_at.desc&limit=50`,
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

async function getReactionCounts(experienceIds) {
  if (!experienceIds.length) return {};
  try {
    const ids = experienceIds.map((id) => `"${id}"`).join(',');
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/experience_reactions?experience_id=in.(${ids})&select=experience_id,type`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return {};
    const reactions = await res.json();
    const counts = {};
    if (Array.isArray(reactions)) {
      for (const r of reactions) {
        if (!counts[r.experience_id]) counts[r.experience_id] = { helpful: 0, relatable: 0 };
        if (r.type === 'helpful') counts[r.experience_id].helpful += 1;
        if (r.type === 'relatable') counts[r.experience_id].relatable += 1;
      }
    }
    return counts;
  } catch {
    return {};
  }
}

async function getRecentReactions(experienceIds) {
  if (!experienceIds.length) return {};
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const ids = experienceIds.map((id) => `"${id}"`).join(',');
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/experience_reactions?experience_id=in.(${ids})&created_at=gte.${sevenDaysAgo}&select=experience_id`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return {};
    const rows = await res.json();
    const counts = {};
    if (Array.isArray(rows)) {
      for (const r of rows) {
        counts[r.experience_id] = (counts[r.experience_id] || 0) + 1;
      }
    }
    return counts;
  } catch {
    return {};
  }
}

export default async function ExperiencesPage() {
  const experiences = await getExperiences();
  const ids = experiences.map((e) => e.id);
  const [reactionCounts, recentCounts] = await Promise.all([
    getReactionCounts(ids),
    getRecentReactions(ids),
  ]);

  const enriched = experiences.map((e) => {
    const helpful = reactionCounts[e.id]?.helpful || 0;
    const relatable = reactionCounts[e.id]?.relatable || 0;
    const recentReactions = recentCounts[e.id] || 0;
    return {
      ...e,
      helpful_count: helpful,
      relatable_count: relatable,
      comment_count: 0,
      recentReactions,
      trendingScore: calcTrendingScore(recentReactions, helpful + relatable, e.published_at),
      readTime: readTime(e.body),
    };
  });

  const pinnedList = enriched.filter((e) => e.is_pinned);
  const regularList = enriched.filter((e) => !e.is_pinned);

  return (
    <div className="relative min-h-screen" style={{ background: '#0d0d12' }}>
      <Navbar />

      <main className="px-4 md:px-6 max-w-[1200px] mx-auto pt-24 pb-16">
        {/* Page header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="section-label mb-2">Community</div>
            <h1
              className="text-[clamp(26px,4vw,40px)] font-[900] tracking-[-0.02em] text-white"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
            >
              അനുഭവങ്ങൾ
            </h1>
            <div
              className="h-[2px] w-10 mt-2 rounded-full"
              style={{ background: `linear-gradient(to right, ${GREEN}, transparent)` }}
            />
            {enriched.length > 0 && (
              <p className="text-[13px] text-white/50 mt-3">
                {enriched.length} experience{enriched.length !== 1 ? 's' : ''} shared by Kerala government employees
              </p>
            )}
          </div>

          <Link
            href="/experiences/submit"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-[13px] font-bold no-underline transition-all"
            style={{
              background: `${GREEN}20`,
              color: GREEN,
              border: `1px solid ${GREEN}40`,
            }}
          >
            + Share Yours
          </Link>
        </div>

        {enriched.length === 0 ? (
          <div
            className="glass-card rounded-[20px] p-12 text-center"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="text-4xl mb-4">📝</div>
            <p
              className="text-white/60 text-[15px]"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
            >
              ഇതുവരെ ആരും അനുഭവം പങ്കിട്ടിട്ടില്ല.
            </p>
            <Link
              href="/experiences/submit"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-2xl text-[13px] font-bold no-underline"
              style={{ background: `${GREEN}20`, color: GREEN, border: `1px solid ${GREEN}40` }}
            >
              ആദ്യം ആകൂ →
            </Link>
          </div>
        ) : (
          <>
            {/* Pinned section */}
            {pinnedList.length > 0 && (
              <div className="mb-8">
                <div
                  className="text-[10px] font-black uppercase tracking-widest mb-3"
                  style={{ color: GOLD }}
                >
                  📌 Pinned
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pinnedList.map((exp) => (
                    <ExperienceCard key={exp.id} experience={exp} />
                  ))}
                </div>
              </div>
            )}

            {/* Regular experiences */}
            {regularList.length > 0 && (
              <div>
                {pinnedList.length > 0 && (
                  <div className="text-[10px] font-black uppercase tracking-widest mb-3 text-white/40">
                    Recent
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regularList.map((exp) => (
                    <ExperienceCard key={exp.id} experience={exp} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
