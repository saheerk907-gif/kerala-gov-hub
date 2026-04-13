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

      <style>{`
        @keyframes expFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ctaGlow {
          0%, 100% { box-shadow: 0 4px 20px rgba(48,209,88,0.30); }
          50%       { box-shadow: 0 4px 32px rgba(48,209,88,0.52); }
        }
        .exp-section { animation: expFadeUp 0.40s ease-out both; }
        .exp-cta-primary {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 13px 20px; border-radius: 13px;
          background: #30d158; color: #fff;
          font-size: 13.5px; font-weight: 800; letter-spacing: 0.01em;
          text-decoration: none; border: none;
          box-shadow: 0 4px 20px rgba(48,209,88,0.32);
          transition: background 0.20s, transform 0.20s, box-shadow 0.20s;
          animation: ctaGlow 2.8s ease-in-out infinite;
        }
        .exp-cta-primary:hover {
          background: #22c44a;
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(48,209,88,0.52);
          animation: none;
        }
        .exp-cta-secondary {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          width: 100%; padding: 11px 18px; border-radius: 13px;
          background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.65);
          font-size: 12.5px; font-weight: 600;
          text-decoration: none; border: 1px solid rgba(255,255,255,0.11);
          transition: background 0.20s, color 0.20s, transform 0.20s;
        }
        .exp-cta-secondary:hover {
          background: rgba(255,255,255,0.10);
          color: rgba(255,255,255,0.88);
          transform: translateY(-1px);
        }
        .exp-mini-card {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 11px; border-radius: 11px;
          text-decoration: none;
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.07);
          transition: background 0.20s, border-color 0.20s;
        }
        .exp-mini-card:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(48,209,88,0.22);
        }
        @media (prefers-reduced-motion: reduce) {
          .exp-section     { animation: none !important; opacity: 1 !important; }
          .exp-cta-primary { animation: none !important; }
        }
      `}</style>

      {/* Green-accent border wrapper */}
      <div className="exp-section" style={{
        background: 'linear-gradient(135deg,rgba(48,209,88,0.30),rgba(30,140,60,0.20))',
        padding: '1.5px', borderRadius: 28,
        boxShadow: '0 0 0 1px rgba(48,209,88,0.10), 0 12px 48px rgba(0,0,0,0.44)',
      }}>
        <div className="relative overflow-hidden" style={{ borderRadius: 26 }}>

          {/* ── Background: blurred image — optimised WebP via Next.js Image ── */}
          <div style={{ position: 'absolute', inset: '-12px', zIndex: 0, filter: 'blur(3px)', overflow: 'hidden' }}>
            <Image
              src="/images/govtemployees.webp"
              alt=""
              fill
              className="object-cover opacity-[0.25]"
              style={{ objectPosition: 'center 30%', transform: 'scale(1.06)' }}
              sizes="100vw"
              loading="lazy"
              quality={55}
            />
          </div>

          {/* ── Overlays ── */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,10,16,0.92)', zIndex: 1 }} />
          <div style={{ position: 'absolute', inset: 0, zIndex: 2,
            background: 'linear-gradient(110deg, rgba(6,10,16,0.99) 0%, rgba(6,10,16,0.95) 55%, rgba(6,10,16,0.85) 100%)' }} />
          {/* Green ambience at bottom-left */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '50%', height: '45%', zIndex: 2,
            background: 'radial-gradient(ellipse at bottom left, rgba(48,209,88,0.10) 0%, transparent 70%)' }} />

          {/* ── Content ── */}
          <div className="relative p-5 md:p-7" style={{ zIndex: 3 }}>
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">

              {/* ════ LEFT: Featured experience ════ */}
              <div className="flex-1 min-w-0 flex flex-col">

                {/* Label */}
                <div className="flex items-center gap-2 mb-3">
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: GREEN, boxShadow: `0 0 8px ${GREEN}80`, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase', color: GREEN }}>
                    Community
                  </span>
                </div>

                {/* Heading */}
                <h2 style={{
                  fontFamily: "var(--font-noto-malayalam), sans-serif",
                  fontSize: 'clamp(20px,3vw,34px)',
                  fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.18,
                  color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,0.8)',
                  marginBottom: 20,
                }}>
                  അനുഭവങ്ങൾ പങ്കിടുക
                </h2>

                {/* Featured content */}
                {loading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[32, '75%', '100%', '65%'].map((w, i) => (
                      <div key={i} style={{ height: typeof w === 'number' ? w : 14, width: w, borderRadius: 8, background: 'rgba(255,255,255,0.09)' }} />
                    ))}
                  </div>
                ) : experiences.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <div style={{ fontSize: 30, marginBottom: 8 }}>✍️</div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 4 }}>ഇനിയും അനുഭവങ്ങൾ ഇല്ല</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.44)' }}>Be the first to share your experience</div>
                  </div>
                ) : (
                  <>
                    {/* Featured card */}
                    {featured && (
                      <Link href={`/experiences/${featured.id}`} className="block no-underline group mb-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-2.5"
                          style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase',
                            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.78)' }}>
                          ✦ Most Helpful
                        </div>

                        <h3 className="group-hover:text-white/90 transition-colors" style={{
                          fontFamily: "var(--font-noto-malayalam), sans-serif",
                          fontSize: 'clamp(14px,1.8vw,19px)', fontWeight: 900, lineHeight: 1.28,
                          color: '#fff', textShadow: '0 1px 12px rgba(0,0,0,0.9)',
                          marginBottom: 8,
                        }}>
                          {featured.title}
                        </h3>

                        <p className="line-clamp-2" style={{
                          fontSize: 13, lineHeight: 1.68,
                          color: 'rgba(255,255,255,0.78)',
                          fontFamily: "var(--font-noto-malayalam), sans-serif",
                          marginBottom: 12,
                        }}>
                          {featured.body?.replace(/<[^>]*>/g, '')}
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <AuthorAvatar name={featured.is_anonymous ? 'Anonymous' : featured.author_name} size={30} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.88)' }}>
                              {featured.is_anonymous ? 'Anonymous' : featured.author_name}
                            </div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.62)', marginTop: 1 }}>
                              {featured.department} · {getReadTime(featured.body)} min read · {timeAgo(featured.published_at)}
                            </div>
                          </div>
                          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, fontSize: 12, color: 'rgba(255,255,255,0.60)', flexShrink: 0 }}>
                            <span>👍 {featured.helpful_count}</span>
                            <span>❤️ {featured.relatable_count}</span>
                          </div>
                        </div>
                      </Link>
                    )}

                    {/* Secondary mini cards */}
                    {rest.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 'auto' }}>
                        {rest.map(exp => (
                          <Link key={exp.id} href={`/experiences/${exp.id}`} className="exp-mini-card">
                            <AuthorAvatar name={exp.is_anonymous ? 'Anonymous' : exp.author_name} size={26} />
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div className="line-clamp-1" style={{
                                fontFamily: "var(--font-noto-malayalam), sans-serif",
                                fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.82)',
                              }}>
                                {exp.title}
                              </div>
                              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.58)', marginTop: 2 }}>
                                {exp.is_anonymous ? 'Anonymous' : exp.author_name} · {timeAgo(exp.published_at)}
                              </div>
                            </div>
                            <svg width="11" height="11" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2.2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* ════ RIGHT: Social proof + CTAs ════ */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flexShrink: 0 }}
                className="w-full md:w-[220px]">

                {/* Social proof block */}
                <div style={{
                  background: 'rgba(48,209,88,0.08)',
                  border: '1px solid rgba(48,209,88,0.20)',
                  borderRadius: 15,
                  padding: '15px 16px',
                }}>
                  {/* Avatar stack */}
                  <div style={{ display: 'flex', marginBottom: 12 }}>
                    {['/images/employee1.webp', '/images/employee2.webp'].map((src, i) => (
                      <div key={i} style={{
                        width: 34, height: 34, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                        border: '2px solid rgba(48,209,88,0.55)', marginLeft: i > 0 ? -10 : 0,
                        boxShadow: '0 0 8px rgba(48,209,88,0.22)',
                      }}>
                        <Image src={src} alt="Member" width={34} height={34} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                      </div>
                    ))}
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                      border: '2px solid rgba(48,209,88,0.55)', marginLeft: -10,
                      background: 'rgba(48,209,88,0.18)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 900, color: GREEN,
                    }}>
                      +48
                    </div>
                  </div>

                  <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.90)', lineHeight: 1.45, margin: 0 }}>
                    48+ employees sharing their journeys
                  </p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.40)', marginTop: 5, marginBottom: 0 }}>
                    Join the growing community
                  </p>
                </div>

                {/* CTA buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {/* Primary — solid green, pulsing glow */}
                  <Link href="/experiences/submit" className="exp-cta-primary">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.6" viewBox="0 0 24 24">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add Experience
                  </Link>

                  {/* Secondary — ghost */}
                  <Link href="/experiences" className="exp-cta-secondary">
                    എല്ലാം കാണുക
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>

            </div>
          </div>{/* /content */}
        </div>{/* /card */}
      </div>{/* /border wrapper */}
    </section>
  );
}
