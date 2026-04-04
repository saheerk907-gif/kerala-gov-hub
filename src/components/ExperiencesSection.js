'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ExperienceCard from './ExperienceCard';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const GREEN = '#30d158';

function SkeletonCard({ large = false }) {
  return (
    <div
      className={`rounded-[20px] skeleton-shimmer ${large ? 'min-h-[220px] md:min-h-[280px]' : 'min-h-[160px] md:min-h-[200px]'}`}
    />
  );
}

async function fetchReactionCounts(experienceIds) {
  if (!experienceIds.length) return {};
  const ids = experienceIds.map((id) => `"${id}"`).join(',');
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/experience_reactions?experience_id=in.(${ids})&select=experience_id,type`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
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
}

export default function ExperiencesSection() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Fetch top 3: pinned first, then published_at desc
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/experiences?status=eq.published&select=id,title,body,author_name,department,is_anonymous,is_pinned,published_at,forum_thread_id&order=is_pinned.desc,published_at.desc&limit=3`,
          {
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
            },
          }
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          setExperiences([]);
          return;
        }

        const ids = data.map((e) => e.id);
        const reactionCounts = await fetchReactionCounts(ids);

        const enriched = data.map((e) => ({
          ...e,
          helpful_count: reactionCounts[e.id]?.helpful || 0,
          relatable_count: reactionCounts[e.id]?.relatable || 0,
          comment_count: 0,
        }));

        setExperiences(enriched);
      } catch (err) {
        console.error('ExperiencesSection fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <section className="py-3 md:py-4 px-4 md:px-6 max-w-[1200px] mx-auto">
      <div className="glass-card glow-top rounded-[24px] md:rounded-[28px] p-4 md:p-5" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Header */}
      <div className="mb-3">
        <div className="section-label mb-1">Community</div>
        <h2
          className="text-[clamp(22px,3vw,32px)] font-[900] tracking-[-0.02em] text-white"
          style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
        >
          അനുഭവങ്ങൾ പങ്കിടുക
        </h2>
        <div
          className="h-[2px] w-10 mt-2 rounded-full"
          style={{ background: `linear-gradient(to right, ${GREEN}, transparent)` }}
        />
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <SkeletonCard large />
          </div>
          <div className="flex flex-col gap-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      ) : experiences.length === 0 ? (
        <div
          className="rounded-[20px] py-10 text-center"
          style={{ background: 'var(--surface-xs)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>✍️</div>
          <div className="font-bold text-white text-[14px] mb-1">ഇനിയും അനുഭവങ്ങൾ ഇല്ല</div>
          <div className="text-[12px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Be the first to share your experience
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Featured card — takes 2 columns on md */}
          {experiences[0] && (
            <div className="md:col-span-2">
              <ExperienceCard experience={experiences[0]} featured />
            </div>
          )}
          {/* Two smaller cards */}
          <div className="flex flex-col gap-4">
            {experiences[1] && <ExperienceCard experience={experiences[1]} />}
            {experiences[2] && <ExperienceCard experience={experiences[2]} />}
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <Link
          href="/experiences"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[13px] font-bold no-underline transition-all hover:bg-white/[0.08]"
          style={{ background: 'var(--surface-xs)', color: 'var(--text-primary)' }}
        >
          എല്ലാ അനുഭവങ്ങളും കാണുക
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <Link
          href="/experiences/submit"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[13px] font-bold no-underline transition-all"
          style={{
            background: `${GREEN}20`,
            color: GREEN,
            border: `1px solid ${GREEN}40`,
          }}
        >
          + അനുഭവം പങ്കിടുക
        </Link>
      </div>
      </div>
    </section>
  );
}
