'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const CATEGORY_LABELS = {
  service_matters: { label: 'സേവന കാര്യങ്ങൾ', color: '#2997ff' },
  pension:         { label: 'പെൻഷൻ',           color: '#ff9f0a' },
  nps_aps:         { label: 'NPS / APS',         color: '#bf5af2' },
  leave:           { label: 'അവധി',              color: '#30d158' },
  general:         { label: 'പൊതു ചർച്ച',       color: '#64d2ff' },
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)} മിനിറ്റ് മുൻപ്`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} മണിക്കൂർ മുൻപ്`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ദിവസം മുൻപ്`;
  return new Date(dateStr).toLocaleDateString('ml-IN');
}

export default function ForumSection() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `${SUPABASE_URL}/rest/v1/forum_threads?select=id,title,category,author_name,reply_count,created_at&is_hidden=eq.false&order=created_at.desc&limit=5`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    )
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setThreads(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="community" className="relative py-7 md:py-10 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">
      <div className="glass-card glow-top rounded-[24px] md:rounded-[28px] p-5 md:p-7" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>

        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="section-label mb-2">Community</div>
            <h2
              className="text-[clamp(22px,3vw,32px)] font-[900] tracking-[-0.02em] text-white leading-tight"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
            >
              ചർച്ചാ വേദി
            </h2>
            <div className="h-[2px] w-10 bg-gradient-to-r from-[#2997ff] to-transparent mt-2 rounded-full" />
          </div>
          <Link
            href="/forum"
            className="text-[12px] font-bold text-[#2997ff] no-underline hover:underline flex-shrink-0"
          >
            എല്ലാം കാണുക →
          </Link>
        </div>

        {/* Thread list */}
        {loading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card h-[64px] rounded-2xl skeleton-shimmer" />
            ))}
          </div>
        ) : threads.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center">
            <p className="text-white/40 text-sm mb-3" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              ഇതുവരെ ചർച്ചകൾ ഒന്നുമില്ല. ആദ്യത്തേത് ആരംഭിക്കൂ!
            </p>
            <Link
              href="/forum"
              className="inline-block px-5 py-2.5 rounded-xl text-sm font-bold text-white no-underline"
              style={{ background: '#2997ff' }}
            >
              + പുതിയ ചർച്ച തുടങ്ങുക
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {threads.map(thread => {
              const cat = CATEGORY_LABELS[thread.category] || CATEGORY_LABELS.general;
              return (
                <Link
                  key={thread.id}
                  href={`/forum/${thread.id}`}
                  className="group flex items-center gap-3 px-4 py-3.5 rounded-[14px] no-underline transition-all duration-200 hover:bg-white/[0.06]"
                >
                  {/* Category dot */}
                  <div
                    className="flex-shrink-0 w-2 h-2 rounded-full"
                    style={{ background: cat.color }}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[13px] font-semibold text-white/90 group-hover:text-white transition-colors leading-snug truncate"
                      style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
                    >
                      {thread.title}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded"
                        style={{ background: `${cat.color}18`, color: cat.color }}
                      >
                        {cat.label}
                      </span>
                      <span className="text-[10px] text-white/35">{thread.author_name}</span>
                      <span className="text-[10px] text-white/25">·</span>
                      <span className="text-[10px] text-white/35">{timeAgo(thread.created_at)}</span>
                    </div>
                  </div>

                  {/* Reply count */}
                  {thread.reply_count > 0 && (
                    <div className="flex-shrink-0 flex items-center gap-1 text-[11px] text-white/40">
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      {thread.reply_count}
                    </div>
                  )}

                  <svg className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all flex-shrink-0"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}

            {/* CTA */}
            <Link
              href="/forum"
              className="mt-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-[#2997ff] no-underline transition-all hover:bg-[#2997ff]/08"
              style={{ border: '1px solid rgba(41,151,255,0.2)' }}
            >
              + പുതിയ ചർച്ച തുടങ്ങുക
            </Link>
          </div>
        )}

      </div>
      </div>
    </section>
  );
}
