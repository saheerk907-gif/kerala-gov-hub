'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const PAGE_SIZE = 20;

function formatDate(str) {
  return new Date(str).toLocaleDateString('ml-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function ThreadList({ category }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState(null);

  async function fetchThreads(from, replace = false) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/forum_threads?select=id,title,author_name,reply_count,created_at&category=eq.${category}&is_hidden=eq.false&order=created_at.desc&limit=${PAGE_SIZE}&offset=${from}`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      );
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      if (!Array.isArray(data)) return;
      if (replace) setThreads(data);
      else setThreads(prev => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
      setOffset(from + data.length);
    } catch (e) {
      setError('Threads load cheyyan sadichilla. Refresh cheyyuka.');
    }
  }

  useEffect(() => {
    setLoading(true);
    setOffset(0);
    setError(null);
    fetchThreads(0, true).finally(() => setLoading(false));
  }, [category]);

  async function loadMore() {
    setLoadingMore(true);
    await fetchThreads(offset);
    setLoadingMore(false);
  }

  if (loading) return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="glass-card h-[72px] rounded-2xl animate-pulse" />
      ))}
    </div>
  );

  if (error) return (
    <div className="glass-card rounded-2xl p-8 text-center text-red-400 text-sm">{error}</div>
  );

  if (threads.length === 0) return (
    <div className="glass-card rounded-2xl p-12 text-center text-white/50 text-sm">
      ഈ വിഭാഗത്തിൽ ഇതുവരെ ചർച്ചകൾ ഒന്നുമില്ല. ആദ്യത്തേത് ആരംഭിക്കൂ!
    </div>
  );

  return (
    <div>
      <div className="flex flex-col gap-2">
        {threads.map((thread) => (
          <Link
            key={thread.id}
            href={`/forum/${thread.id}`}
            className="glass-card group flex items-center gap-4 px-5 py-4 rounded-2xl no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
          >
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold text-white/90 group-hover:text-white transition-colors leading-snug truncate"
                style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                {thread.title}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[11px] text-white/50">{thread.author_name}</span>
                <span className="text-[11px] text-white/35">·</span>
                <span className="text-[11px] text-white/50">{formatDate(thread.created_at)}</span>
                {thread.reply_count > 0 && (
                  <>
                    <span className="text-[11px] text-white/35">·</span>
                    <span className="text-[11px] text-white/50">💬 {thread.reply_count}</span>
                  </>
                )}
              </div>
            </div>
            <svg className="w-4 h-4 text-white/40 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all flex-shrink-0"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>

      {hasMore && (
        <button onClick={loadMore} disabled={loadingMore}
          className="w-full mt-4 py-4 rounded-2xl text-sm font-bold border-none cursor-pointer transition-all disabled:opacity-50"
          style={{ background: 'var(--surface-xs)', color: 'var(--text-primary)' }}>
          {loadingMore ? 'Loading...' : 'കൂടുതൽ ചർച്ചകൾ കാണുക'}
        </button>
      )}
    </div>
  );
}
