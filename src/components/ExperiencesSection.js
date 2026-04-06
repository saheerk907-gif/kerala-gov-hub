'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const GREEN = '#30d158';

async function fetchReactionCounts(experienceIds) {
  if (!experienceIds.length) return {};
  const ids = experienceIds.map((id) => `"${id}"`).join(',');
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/experience_reactions?experience_id=in.(${ids})&select=experience_id,type`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
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

function getReadTime(body) {
  const words = body?.split(/\s+/)?.length || 0;
  return Math.max(1, Math.ceil(words / 180));
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const d = Math.floor(diff / 86400);
  return d < 30 ? `${d}d ago` : new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

function AuthorAvatar({ name, size = 36 }) {
  const initials = (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#7c3aed', '#2563eb', '#059669', '#d97706', '#dc2626', '#0891b2'];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 800, color: '#fff', flexShrink: 0,
      border: '2px solid rgba(255,255,255,0.2)',
    }}>
      {initials}
    </div>
  );
}

export default function ExperiencesSection() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/experiences?status=eq.published&select=id,title,body,author_name,department,is_anonymous,is_pinned,published_at,forum_thread_id&order=is_pinned.desc,published_at.desc&limit=3`,
          { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) { setExperiences([]); return; }
        const reactionCounts = await fetchReactionCounts(data.map(e => e.id));
        setExperiences(data.map(e => ({
          ...e,
          helpful_count: reactionCounts[e.id]?.helpful || 0,
          relatable_count: reactionCounts[e.id]?.relatable || 0,
        })));
      } catch (err) {
        console.error('ExperiencesSection fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const featured = experiences[0];
  const rest = experiences.slice(1);

  return (
    <section className="py-3 md:py-4 px-4 md:px-6 max-w-[1200px] mx-auto">
      {/* Purple-blue glow border wrapper */}
      <div style={{
        background: 'linear-gradient(135deg,rgba(140,80,240,0.55),rgba(60,130,255,0.55))',
        padding: '1.5px', borderRadius: 28,
      }}>
        {/* Cinematic photo card */}
        <div className="relative overflow-hidden" style={{
          backgroundImage: "url('/images/govtemployees.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          borderRadius: 26,
          minHeight: 420,
        }}>
          {/* ── Cinematic overlays ── */}
          {/* Base dark tint */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,10,16,0.62)', zIndex: 1 }} />
          {/* Left-to-right: darker on left where content lives */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 2,
            background: 'linear-gradient(to right, rgba(8,10,16,0.92) 0%, rgba(8,10,16,0.72) 45%, rgba(8,10,16,0.25) 75%, transparent 100%)' }} />
          {/* Top-to-bottom: dark header + lighter mid + dark bottom for CTAs */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 2,
            background: 'linear-gradient(to bottom, rgba(8,10,16,0.85) 0%, rgba(8,10,16,0.1) 35%, rgba(8,10,16,0.55) 70%, rgba(8,10,16,0.95) 100%)' }} />
          {/* Subtle green glow at bottom-left */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '40%', height: '30%', zIndex: 2,
            background: 'radial-gradient(ellipse at bottom left, rgba(48,209,88,0.12) 0%, transparent 70%)' }} />

          {/* ── Content ── */}
          <div className="relative p-5 md:p-7 flex flex-col" style={{ zIndex: 3, minHeight: 420 }}>

            {/* Header row */}
            <div className="flex items-start justify-between mb-4 md:mb-6">
              <div>
                <div className="section-label mb-1" style={{ color: GREEN, opacity: 1, fontWeight: 800 }}>Community</div>
                <h2 className="text-[clamp(26px,4vw,40px)] font-[900] tracking-[-0.03em] text-white leading-tight"
                  style={{ fontFamily: "var(--font-noto-malayalam), sans-serif", textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
                  അനുഭവങ്ങൾ പങ്കിടുക
                </h2>
                <div className="h-[3px] w-12 mt-2 rounded-full"
                  style={{ background: `linear-gradient(to right, ${GREEN}, transparent)` }} />
              </div>
              {/* Avatar cluster */}
              <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                <div className="flex -space-x-2.5">
                  <div className="w-9 h-9 rounded-full border-2 overflow-hidden flex-shrink-0"
                    style={{ borderColor: 'rgba(48,209,88,0.6)', boxShadow: '0 0 8px rgba(48,209,88,0.3)' }}>
                    <Image src="/images/employee1.jpg" alt="Member" width={36} height={36} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="w-9 h-9 rounded-full border-2 overflow-hidden flex-shrink-0"
                    style={{ borderColor: 'rgba(48,209,88,0.6)', boxShadow: '0 0 8px rgba(48,209,88,0.3)' }}>
                    <Image src="/images/employee2.jpg" alt="Member" width={36} height={36} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                    style={{ background: 'rgba(48,209,88,0.2)', borderColor: 'rgba(48,209,88,0.6)' }}>
                    +48
                  </div>
                </div>
                <span className="text-[10px] font-semibold hidden sm:block" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  sharing experiences
                </span>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-grow">
              {loading ? (
                /* Skeleton */
                <div className="space-y-3">
                  <div className="h-5 w-32 rounded-full skeleton-shimmer" style={{ background: 'rgba(255,255,255,0.1)' }} />
                  <div className="h-8 w-3/4 rounded-xl skeleton-shimmer" style={{ background: 'rgba(255,255,255,0.1)' }} />
                  <div className="h-4 w-full rounded skeleton-shimmer" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <div className="h-4 w-2/3 rounded skeleton-shimmer" style={{ background: 'rgba(255,255,255,0.06)' }} />
                </div>
              ) : experiences.length === 0 ? (
                /* Empty state */
                <div className="py-6 text-center">
                  <div style={{ fontSize: 32, marginBottom: 8 }}>✍️</div>
                  <div className="font-bold text-white text-[14px] mb-1">ഇനിയും അനുഭവങ്ങൾ ഇല്ല</div>
                  <div className="text-[12px]" style={{ color: 'rgba(255,255,255,0.45)' }}>Be the first to share your experience</div>
                </div>
              ) : (
                <div>
                  {/* ── Featured experience ── */}
                  {featured && (
                    <Link href={`/experiences/${featured.id}`} className="block no-underline group mb-5">
                      {/* MOST HELPFUL badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}>
                          <span>✦</span> Most Helpful
                        </div>
                        {featured.is_pinned && (
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
                            style={{ background: `${GREEN}25`, border: `1px solid ${GREEN}50`, color: GREEN }}>
                            📌 Pinned
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-[clamp(17px,2.4vw,24px)] font-[900] text-white leading-[1.2] mb-2 group-hover:text-white/90 transition-colors"
                        style={{ fontFamily: "var(--font-noto-malayalam), sans-serif", textShadow: '0 1px 12px rgba(0,0,0,0.9)' }}>
                        {featured.title}
                      </h3>

                      {/* Body snippet */}
                      <p className="text-[13px] md:text-[14px] leading-relaxed mb-4 line-clamp-2"
                        style={{ color: 'rgba(255,255,255,0.72)', fontFamily: "var(--font-noto-malayalam), sans-serif", textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
                        {featured.body?.replace(/<[^>]*>/g, '')}
                      </p>

                      {/* Author + meta row */}
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2.5">
                          <AuthorAvatar name={featured.is_anonymous ? 'Anonymous' : featured.author_name} size={34} />
                          <div>
                            <div className="text-[13px] font-bold text-white/90">
                              {featured.is_anonymous ? 'Anonymous' : featured.author_name}
                            </div>
                            <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                              {featured.department}
                            </div>
                          </div>
                        </div>
                        {/* Meta */}
                        <div className="flex items-center gap-3 text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          <span>{getReadTime(featured.body)} min read</span>
                          <span>{timeAgo(featured.published_at)}</span>
                          <div className="flex items-center gap-2">
                            <span title="Helpful">👍 {featured.helpful_count}</span>
                            <span title="Relatable">❤️ {featured.relatable_count}</span>
                          </div>
                        </div>
                      </div>

                      {/* Reviewed badge */}
                      <div className="mt-2 flex items-center gap-1.5 text-[11px]" style={{ color: GREEN }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Reviewed by admin
                      </div>
                    </Link>
                  )}

                  {/* ── Other experiences row ── */}
                  {rest.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-2 mb-1">
                      {rest.map(exp => (
                        <Link key={exp.id} href={`/experiences/${exp.id}`}
                          className="flex-1 flex items-center gap-3 p-3 rounded-[14px] no-underline group transition-all hover:bg-white/[0.06]"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                          <AuthorAvatar name={exp.is_anonymous ? 'Anonymous' : exp.author_name} size={30} />
                          <div className="min-w-0">
                            <div className="text-[12px] font-bold text-white/90 line-clamp-2 leading-snug group-hover:text-white transition-colors"
                              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                              {exp.title}
                            </div>
                            <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                              {exp.is_anonymous ? 'Anonymous' : exp.author_name} · {timeAgo(exp.published_at)}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── CTA buttons ── */}
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <Link href="/experiences"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[13px] font-bold no-underline transition-all hover:bg-white/[0.1]"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                എല്ലാ അനുഭവങ്ങളും കാണുക
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href="/experiences/submit"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[13px] font-bold no-underline transition-all hover:opacity-90"
                style={{ background: `${GREEN}22`, color: GREEN, border: `1px solid ${GREEN}50`, backdropFilter: 'blur(10px)' }}>
                + അനുഭവം പങ്കിടുക
              </Link>
            </div>

          </div>{/* /content */}
        </div>{/* /photo card */}
      </div>{/* /gradient border */}
    </section>
  );
}
