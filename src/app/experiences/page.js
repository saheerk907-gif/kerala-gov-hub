// src/app/experiences/page.js
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ExperiencesHero from '@/components/ExperiencesHero';
import ExperiencesSeoBlock from '@/components/ExperiencesSeoBlock';
import ExperiencesFeed from '@/components/ExperiencesFeed';
import { trendingScore as calcTrendingScore, readTime } from '@/lib/experiences';

export const revalidate = 60;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function getExperiences() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/experiences?status=eq.published&select=id,title,body,author_name,department,is_anonymous,is_pinned,published_at,forum_thread_id&order=published_at.desc&limit=50`,
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

  return (
    <div className="relative min-h-screen" style={{ background: '#0d0d12' }}>
      <Navbar />

      <main className="pt-20">
        {/* Hero strip — full width inside max-width container */}
        <ExperiencesHero />

        {/* SEO content block */}
        <ExperiencesSeoBlock />

        {/* Feed: sort tabs + card grid + sticky mobile bar */}
        <ExperiencesFeed experiences={enriched} />
      </main>

      <Footer />
    </div>
  );
}
