'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ACCENT = '#64d2ff';

const CATEGORY_LABELS = {
  service_matters: { label: 'സേവന കാര്യങ്ങൾ', color: '#2997ff' },
  pension:         { label: 'പെൻഷൻ',           color: '#ff9f0a' },
  nps_aps:         { label: 'NPS / APS',         color: '#bf5af2' },
  leave:           { label: 'അവധി',              color: '#30d158' },
  general:         { label: 'പൊതു ചർച്ച',       color: '#64d2ff' },
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 3600) return `${Math.floor(diff/60)} മിനിറ്റ് മുൻപ്`;
  if (diff < 86400) return `${Math.floor(diff/3600)} മണിക്കൂർ മുൻപ്`;
  if (diff < 604800) return `${Math.floor(diff/86400)} ദിവസം മുൻപ്`;
  return new Date(dateStr).toLocaleDateString('ml-IN');
}

export default function ForumSection() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch(
      `${SUPABASE_URL}/rest/v1/forum_threads?select=id,title,category,author_name,reply_count,created_at&is_hidden=eq.false&order=created_at.desc&limit=5`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    )
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setThreads(data); })
      .catch(()=>{})
      .finally(()=> setLoading(false));
  }, []);

  return (
    <section id="community" className="relative py-3 md:py-4 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Gradient border wrapper */}
        <div style={{
          background:'linear-gradient(135deg,rgba(140,80,240,0.55),rgba(60,130,255,0.55))',
          padding:'1.5px', borderRadius:28,
        }}>
          {/* Cinematic photo card */}
          <div className="relative overflow-hidden" style={{
            backgroundImage:"url('/images/forum-bg.jpg')",
            backgroundSize:'cover',
            backgroundPosition:'center 65%',
            borderRadius:26,
            minHeight:380,
          }}>
            {/* Overlays */}
            <div style={{ position:'absolute', inset:0, background:'rgba(4,6,13,0.70)', zIndex:1 }}/>
            <div style={{ position:'absolute', inset:0, zIndex:2,
              background:'linear-gradient(to right, rgba(4,6,13,0.97) 0%, rgba(4,6,13,0.82) 40%, rgba(4,6,13,0.42) 68%, transparent 100%)' }}/>
            <div style={{ position:'absolute', inset:0, zIndex:2,
              background:'linear-gradient(to bottom, rgba(4,6,13,0.85) 0%, transparent 30%, rgba(4,6,13,0.92) 100%)' }}/>
            {/* Teal glow */}
            <div style={{ position:'absolute', bottom:0, left:0, width:'45%', height:'35%', zIndex:2,
              background:'radial-gradient(ellipse at bottom left, rgba(100,210,255,0.12) 0%, transparent 70%)' }}/>

            {/* Content */}
            <div className="relative p-5 md:p-7 flex flex-col" style={{ zIndex:3, minHeight:380 }}>

              {/* Header */}
              <div className="flex items-start justify-between mb-5 gap-3">
                <div>
                  <div className="section-label mb-1" style={{ color:ACCENT, opacity:1, fontWeight:800 }}>Community</div>
                  <h2 className="text-[clamp(26px,4vw,38px)] font-[900] tracking-[-0.03em] text-white leading-tight"
                    style={{ fontFamily:"var(--font-noto-malayalam), sans-serif", textShadow:'0 2px 20px rgba(0,0,0,0.9)' }}>
                    ചർച്ചാ വേദി
                  </h2>
                  <div className="h-[3px] w-12 mt-2 rounded-full"
                    style={{ background:`linear-gradient(to right, ${ACCENT}, transparent)` }}/>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                      style={{ background:'rgba(100,210,255,0.12)', border:'1px solid rgba(100,210,255,0.3)', color:ACCENT }}>
                      💬 Live Discussions
                    </div>
                  </div>
                </div>
                <Link href="/forum"
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold no-underline transition-all hover:bg-white/[0.1] mt-1"
                  style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.13)', color:'rgba(255,255,255,0.8)', backdropFilter:'blur(8px)' }}>
                  എല്ലാം
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>

              {/* Thread list */}
              <div className="flex-grow">
                {loading ? (
                  <div className="space-y-2">
                    {[1,2,3].map(i=>(
                      <div key={i} className="h-16 rounded-2xl skeleton-shimmer" style={{ background:'rgba(255,255,255,0.08)' }}/>
                    ))}
                  </div>
                ) : threads.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-white/40 text-sm mb-3" style={{ fontFamily:"var(--font-noto-malayalam), sans-serif" }}>
                      ഇതുവരെ ചർച്ചകൾ ഒന്നുമില്ല. ആദ്യത്തേത് ആരംഭിക്കൂ!
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {(expanded ? threads : threads.slice(0,3)).map(thread => {
                      const cat = CATEGORY_LABELS[thread.category] || CATEGORY_LABELS.general;
                      return (
                        <Link key={thread.id} href={`/forum/${thread.id}`}
                          className="group relative flex items-center gap-3 px-4 py-3.5 rounded-[14px] no-underline transition-all duration-200 hover:bg-white/[0.07] overflow-hidden"
                          style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(8px)' }}>
                          {/* Glow */}
                          <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                            style={{ background: cat.color+'30' }}/>
                          {/* Icon */}
                          <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                            style={{ background: cat.color+'18', border:`1px solid ${cat.color}35` }}>
                            <svg width="14" height="14" fill="none" stroke={cat.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                          </div>
                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-semibold text-white/90 group-hover:text-white transition-colors leading-snug truncate"
                              style={{ fontFamily:"var(--font-noto-malayalam), sans-serif", textShadow:'0 1px 6px rgba(0,0,0,0.8)' }}>
                              {thread.title}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded"
                                style={{ background:`${cat.color}18`, color: cat.color }}>
                                {cat.label}
                              </span>
                              <span className="text-[10px] text-white/35">{thread.author_name}</span>
                              <span className="text-[10px] text-white/25">·</span>
                              <span className="text-[10px] text-white/35">{timeAgo(thread.created_at)}</span>
                            </div>
                          </div>
                          {thread.reply_count > 0 && (
                            <div className="flex-shrink-0 flex items-center gap-1 text-[11px] text-white/40">
                              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                              </svg>
                              {thread.reply_count}
                            </div>
                          )}
                          <svg className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all flex-shrink-0"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
                          </svg>
                          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            style={{ background:`linear-gradient(90deg, transparent, ${cat.color}70, transparent)` }}/>
                        </Link>
                      );
                    })}
                    {threads.length > 3 && (
                      <button onClick={()=>setExpanded(v=>!v)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-[12px] font-bold transition-all cursor-pointer border-none mt-1"
                        style={{ background:'rgba(100,210,255,0.08)', color:ACCENT, border:'1px solid rgba(100,210,255,0.22)', backdropFilter:'blur(8px)' }}>
                        {expanded ? 'Show Less ↑' : 'Read More ↓'}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <Link href="/forum"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[13px] font-bold no-underline transition-all hover:bg-white/[0.1]"
                  style={{ background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.9)', border:'1px solid rgba(255,255,255,0.14)', backdropFilter:'blur(10px)' }}>
                  എല്ലാ ചർച്ചകളും കാണുക
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link href="/forum"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[13px] font-bold no-underline transition-all hover:opacity-90"
                  style={{ background:'rgba(100,210,255,0.15)', color:ACCENT, border:`1px solid rgba(100,210,255,0.35)`, backdropFilter:'blur(10px)' }}>
                  + പുതിയ ചർച്ച തുടങ്ങുക
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
