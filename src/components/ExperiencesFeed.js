'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import ExperienceCard from './ExperienceCard';
import ExperiencesSortBar from './ExperiencesSortBar';

const GREEN = '#30d158';
const GOLD = '#c8960c';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function StoryOfWeek({ experience }) {
  const { id, title, body, published_at, created_at, helpful_count = 0, relatable_count = 0, readTime: rt = 1 } = experience;
  const excerpt = body ? ([...body].slice(0, 200).join('') + ([...body].length > 200 ? '…' : '')) : '';
  const displayDate = published_at || created_at;

  return (
    <Link href={`/experiences/${id}`} className="no-underline block mb-8">
      <div
        className="rounded-[24px] p-6 md:p-8 relative overflow-hidden transition-all hover:-translate-y-0.5"
        style={{
          background: 'rgba(200,150,12,0.06)',
          border: '1px solid rgba(200,150,12,0.25)',
          borderLeft: `4px solid ${GOLD}`,
        }}
      >
        {/* Badge */}
        <div
          className="text-[10px] font-black uppercase tracking-[0.1em] mb-3"
          style={{ color: GOLD }}
        >
          ⭐ ഈ ആഴ്ചയിലെ കഥ
        </div>

        {/* Read time — top right */}
        <div
          className="absolute top-5 right-6 text-[10px]"
          style={{ color: 'var(--text-faint)' }}
        >
          ~{rt} min read
        </div>

        {/* Title */}
        <h2
          className="text-[clamp(18px,2.5vw,22px)] font-[900] leading-snug mb-3"
          style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif', color: 'var(--text-primary)' }}
        >
          {title}
        </h2>

        {/* Excerpt */}
        <p
          className="text-[14px] leading-relaxed mb-4"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-noto-malayalam), sans-serif' }}
        >
          {excerpt}
        </p>

        {/* Reactions + time */}
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="text-[12px] px-3 py-1 rounded-full font-semibold"
            style={{ background: 'rgba(48,209,88,0.12)', color: 'var(--accent-green)', border: '1px solid rgba(48,209,88,0.25)' }}
          >
            👍 {helpful_count} Helpful
          </span>
          <span
            className="text-[12px] px-3 py-1 rounded-full font-semibold"
            style={{ background: 'rgba(255,100,100,0.12)', color: '#ff6b6b', border: '1px solid rgba(255,100,100,0.25)' }}
          >
            ❤️ {relatable_count} Relatable
          </span>
          {displayDate && (
            <span className="text-[11px]" style={{ color: 'var(--text-ghost)' }}>{timeAgo(displayDate)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function InlineCta() {
  return (
    <div
      className="col-span-full rounded-[20px] px-5 py-4 flex items-center justify-between flex-wrap gap-3"
      style={{
        background: 'rgba(48,209,88,0.06)',
        border: '1px solid rgba(48,209,88,0.15)',
      }}
    >
      <div>
        <p
          className="text-[14px] font-semibold"
          style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif', color: 'var(--text-dim)' }}
        >
          നിങ്ങൾക്കും ഒരു കഥ പറയാനുണ്ടോ?
        </p>
        <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-faint)' }}>
          Your experience could help a colleague.
        </p>
      </div>
      <Link
        href="/experiences/submit"
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-bold no-underline transition-all flex-shrink-0 experiences-cta-btn"
      >
        അനുഭവം പങ്കിടുക →
      </Link>
    </div>
  );
}

export default function ExperiencesFeed({ experiences }) {
  const [sortBy, setSortBy] = useState('new');
  const [anonOnly, setAnonOnly] = useState(false);

  // Story of Week: highest trendingScore among those with recentReactions >= 1
  const storyOfWeek = useMemo(() => {
    const eligible = experiences.filter((e) => (e.recentReactions || 0) >= 1);
    if (!eligible.length) return null;
    return eligible.reduce((best, e) =>
      (e.trendingScore || 0) > (best.trendingScore || 0) ? e : best
    );
  }, [experiences]);

  // Sort + filter
  const sorted = useMemo(() => {
    let list = [...experiences];

    if (sortBy === 'trending') {
      list.sort((a, b) => {
        const diff = (b.trendingScore || 0) - (a.trendingScore || 0);
        if (diff !== 0) return diff;
        return new Date(b.published_at) - new Date(a.published_at);
      });
    } else if (sortBy === 'top') {
      list.sort((a, b) => {
        const aTotal = (a.helpful_count || 0) + (a.relatable_count || 0);
        const bTotal = (b.helpful_count || 0) + (b.relatable_count || 0);
        const diff = bTotal - aTotal;
        if (diff !== 0) return diff;
        return new Date(b.published_at) - new Date(a.published_at);
      });
    } else {
      // new (default)
      list.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    }

    if (anonOnly) {
      list = list.filter((e) => e.is_anonymous);
    }

    return list;
  }, [experiences, sortBy, anonOnly]);

  if (!experiences.length) {
    return (
      <div
        className="rounded-[20px] p-12 text-center"
        style={{ border: '1px solid var(--border-sm)' }}
      >
        <div className="text-4xl mb-4">📝</div>
        <p
          className="text-[15px]"
          style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif', color: 'var(--text-secondary)' }}
        >
          ഇതുവരെ ആരും അനുഭവം പങ്കിട്ടിട്ടില്ല.
        </p>
        <Link
          href="/experiences/submit"
          className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-2xl text-[13px] font-bold no-underline experiences-cta-btn"
        >
          ആദ്യം ആകൂ →
        </Link>
      </div>
    );
  }

  // Build card list with inline CTAs
  const cards = [];
  let cardIndex = 0;
  for (const exp of sorted) {
    cards.push(
      <ExperienceCard key={exp.id} experience={exp} />
    );
    cardIndex++;
    // Inline CTA after every 6 cards (indices 5, 11, 17…)
    if (cardIndex % 6 === 0) {
      cards.push(<InlineCta key={`cta-${cardIndex}`} />);
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 pb-20 md:pb-0">
      {/* Story of Week */}
      {storyOfWeek && <StoryOfWeek experience={storyOfWeek} />}

      {/* Sort bar */}
      <ExperiencesSortBar
        sortBy={sortBy}
        setSortBy={setSortBy}
        anonOnly={anonOnly}
        setAnonOnly={setAnonOnly}
      />

      {/* Card grid */}
      {sorted.length === 0 ? (
        <p
          className="text-center text-[14px] py-12"
          style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif', color: 'var(--text-faint)' }}
        >
          ഫിൽട്ടറിനായി ഒരു അജ്ഞാത പോസ്റ്റ് ലഭ്യമല്ല.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards}
        </div>
      )}

      {/* Mobile sticky bottom bar */}
      <div
        className="experiences-sticky-bar md:hidden fixed bottom-0 left-0 right-0 z-50 px-4"
        style={{
          paddingTop: 12,
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
        }}
      >
        <Link
          href="/experiences/submit"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-[14px] font-bold no-underline"
          style={{ background: 'var(--accent-green)', color: '#fff' }}
        >
          + അനുഭവം പങ്കിടുക
        </Link>
      </div>
    </div>
  );
}
