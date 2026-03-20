// src/app/forum/[id]/page.js
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const REPLY_COOLDOWN_MS = 30_000;

const CATEGORY_LABELS = {
  service_matters: 'സേവന കാര്യങ്ങൾ',
  pension:         'പെൻഷൻ',
  nps_aps:         'NPS / APS',
  leave:           'അവധി',
  general:         'പൊതു ചർച്ച',
};

function formatDate(str) {
  return new Date(str).toLocaleDateString('ml-IN', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

const URL_RE = /(https?:\/\/[^\s]+)/g;

function TextWithLinks({ text, className, style }) {
  const parts = text.split(URL_RE);
  return (
    <p className={className} style={style}>
      {parts.map((part, i) =>
        URL_RE.test(part) ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer"
            className="underline break-all"
            style={{ color: '#2997ff' }}>
            {part}
          </a>
        ) : part
      )}
    </p>
  );
}

export default function ThreadPage({ params }) {
  const { id } = params;
  const router = useRouter();

  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [replyForm, setReplyForm] = useState({ author_name: '', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [replyError, setReplyError] = useState(null);
  const [replySuccess, setReplySuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [threadRes, repliesRes] = await Promise.all([
          fetch(`${SUPABASE_URL}/rest/v1/forum_threads?id=eq.${id}&is_hidden=eq.false&select=*`,
            { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }),
          fetch(`${SUPABASE_URL}/rest/v1/forum_replies?thread_id=eq.${id}&is_hidden=eq.false&order=created_at.asc&select=*`,
            { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }),
        ]);
        const [threadData, repliesData] = await Promise.all([threadRes.json(), repliesRes.json()]);
        if (!threadData[0]) { setNotFound(true); return; }
        setThread(threadData[0]);
        setReplies(Array.isArray(repliesData) ? repliesData : []);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleReply(e) {
    e.preventDefault();
    if (!replyForm.author_name.trim()) { setReplyError('പേര് നൽകുക.'); return; }
    if (!replyForm.body.trim()) { setReplyError('മറുപടി എഴുതുക.'); return; }
    if (replyForm.body.length > 2000) { setReplyError('2000 അക്ഷരത്തിൽ കൂടരുത്.'); return; }

    const lastReply = parseInt(sessionStorage.getItem('forum_last_reply') || '0', 10);
    if (Date.now() - lastReply < REPLY_COOLDOWN_MS) {
      setReplyError('ദയവായി 30 സെക്കൻഡ് കഴിഞ്ഞ് ശ്രമിക്കൂ.');
      return;
    }

    setSubmitting(true);
    setReplyError(null);
    try {
      const res = await fetch('/api/forum/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...replyForm, thread_id: id }),
      });
      const data = await res.json();
      if (!res.ok) { setReplyError(data.error || 'Error'); return; }
      sessionStorage.setItem('forum_last_reply', String(Date.now()));
      setReplies(prev => [...prev, data.reply]);
      setReplyForm({ author_name: replyForm.author_name, body: '' });
      setReplySuccess(true);
      setTimeout(() => setReplySuccess(false), 3000);
    } catch {
      setReplyError('Network error.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return (
    <main className="min-h-screen bg-aurora pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="glass-card h-32 rounded-3xl animate-pulse" />
        <div className="glass-card h-20 rounded-2xl animate-pulse" />
      </div>
    </main>
  );

  if (notFound) return (
    <main className="min-h-screen bg-aurora pt-24 pb-16 px-4 text-center text-white">
      <p className="text-white/50 mt-20">Thread കണ്ടെത്തിയില്ല.</p>
      <Link href="/forum" className="mt-4 inline-block text-[#2997ff] text-sm no-underline">← Forum</Link>
    </main>
  );

  return (
    <>
      <main className="min-h-screen bg-aurora text-white pt-24 pb-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-[12px] text-white/50">
            <Link href="/forum" className="no-underline hover:text-white transition-colors">ചർച്ചാ വേദി</Link>
            <span>›</span>
            <span style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              {CATEGORY_LABELS[thread.category] || thread.category}
            </span>
          </div>

          {/* Thread */}
          <div className="glass-card rounded-3xl p-6 md:p-8 mb-6">
            <h1 className="text-[clamp(18px,3vw,26px)] font-[800] text-white leading-snug mb-4"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              {thread.title}
            </h1>
            <TextWithLinks text={thread.body}
              className="text-[14px] text-white/80 leading-relaxed whitespace-pre-wrap mb-6"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }} />
            <div className="flex items-center gap-3 text-[11px] text-white/40 border-t pt-4"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <span>{thread.author_name}</span>
              <span>·</span>
              <span>{formatDate(thread.created_at)}</span>
            </div>
          </div>

          {/* Replies */}
          {replies.length > 0 && (
            <div className="mb-6">
              <div className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-3">
                {replies.length} മറുപടി{replies.length > 1 ? 'കൾ' : ''}
              </div>
              <div className="flex flex-col gap-3">
                {replies.map(reply => {
                  const isAdmin = reply.is_admin || reply.author_name === 'Admin';
                  return (
                    <div key={reply.id} className="glass-card rounded-2xl p-5"
                      style={isAdmin ? { borderColor: 'rgba(41,151,255,0.25)', background: 'rgba(41,151,255,0.04)' } : {}}>
                      <TextWithLinks text={reply.body}
                        className="text-[13px] text-white/80 leading-relaxed whitespace-pre-wrap mb-3"
                        style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }} />
                      <div className="flex items-center gap-2 text-[11px] text-white/35">
                        {isAdmin ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black"
                            style={{ background: 'rgba(41,151,255,0.15)', color: '#2997ff' }}>
                            ✦ Admin
                          </span>
                        ) : (
                          <span>{reply.author_name}</span>
                        )}
                        <span>·</span>
                        <span>{formatDate(reply.created_at)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reply form */}
          <div className="glass-card rounded-3xl p-6">
            <div className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-4">
              മറുപടി നൽകുക
            </div>
            <form onSubmit={handleReply} className="space-y-3">
              <input
                value={replyForm.author_name}
                onChange={e => setReplyForm(p => ({ ...p, author_name: e.target.value }))}
                placeholder="നിങ്ങളുടെ പേര്"
                maxLength={50}
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-[#2997ff] transition-all"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', fontFamily: "var(--font-noto-malayalam), sans-serif" }}
              />
              <textarea
                value={replyForm.body}
                onChange={e => setReplyForm(p => ({ ...p, body: e.target.value }))}
                placeholder="നിങ്ങളുടെ മറുപടി..."
                maxLength={2000}
                rows={4}
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-[#2997ff] transition-all resize-none"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', fontFamily: "var(--font-noto-malayalam), sans-serif" }}
              />
              <div className="text-[10px] text-white/30 text-right">{replyForm.body.length}/2000</div>
              {replyError && (
                <div className="text-xs text-[#ff453a] bg-[#ff453a]/10 px-3 py-2 rounded-lg"
                  style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>{replyError}</div>
              )}
              {replySuccess && (
                <div className="text-xs text-green-400 bg-green-400/10 px-3 py-2 rounded-lg">
                  മറുപടി ചേർത്തു!
                </div>
              )}
              <button type="submit" disabled={submitting}
                className="w-full py-3 rounded-xl text-sm font-bold text-white border-none cursor-pointer transition-all disabled:opacity-50"
                style={{ background: '#2997ff' }}>
                {submitting ? 'Post ചെയ്യുന്നു...' : 'മറുപടി Post ചെയ്യുക'}
              </button>
            </form>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
