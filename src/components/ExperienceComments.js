'use client';
import { useState, useEffect } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const REPLY_COOLDOWN_MS = 30_000;

function formatDate(str) {
  return new Date(str).toLocaleDateString('ml-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function Avatar({ name, isAdmin }) {
  if (isAdmin) {
    return (
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: 'rgba(41,151,255,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 800, color: '#2997ff', flexShrink: 0,
      }}>A</div>
    );
  }
  const hue = name ? (name.charCodeAt(0) * 47) % 360 : 200;
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%',
      background: `hsl(${hue},55%,40%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
    }}>
      {(name || '?').charAt(0).toUpperCase()}
    </div>
  );
}

export default function ExperienceComments({ threadId }) {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ author_name: '', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('forum_author_name');
    if (saved) setForm(p => ({ ...p, author_name: saved }));
  }, []);

  useEffect(() => {
    if (!threadId) { setLoading(false); return; }
    async function load() {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/forum_replies?thread_id=eq.${threadId}&is_hidden=eq.false&order=created_at.asc&select=id,body,author_name,is_admin,created_at`,
          { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
        );
        const data = await res.json();
        setReplies(Array.isArray(data) ? data : []);
      } catch {
        setReplies([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [threadId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!form.author_name.trim()) { setError('പേര് നൽകുക.'); return; }
    if (!form.body.trim()) { setError('കമന്റ് എഴുതുക.'); return; }
    if (form.body.length > 2000) { setError('2000 അക്ഷരത്തിൽ കൂടരുത്.'); return; }

    const lastReply = parseInt(sessionStorage.getItem('forum_last_reply') || '0', 10);
    if (Date.now() - lastReply < REPLY_COOLDOWN_MS) {
      setError('ദയവായി 30 സെക്കൻഡ് കഴിഞ്ഞ് ശ്രമിക്കൂ.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/forum/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, thread_id: threadId }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Error posting comment.'); return; }
      sessionStorage.setItem('forum_last_reply', String(Date.now()));
      localStorage.setItem('forum_author_name', form.author_name.trim());
      setReplies(prev => [...prev, data.reply]);
      setForm(p => ({ ...p, body: '' }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Network error. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const GREEN = '#30d158';

  return (
    <div className="mt-8">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          {loading ? 'Comments' : `${replies.length} Comment${replies.length !== 1 ? 's' : ''}`}
        </div>
        <div className="flex-1 h-px" style={{ background: 'var(--border-xs)' }} />
      </div>

      {/* Replies list */}
      {loading ? (
        <div className="flex flex-col gap-3 mb-6">
          {[1, 2].map(i => (
            <div key={i} className="h-16 rounded-2xl skeleton-shimmer" />
          ))}
        </div>
      ) : replies.length > 0 ? (
        <div className="flex flex-col gap-3 mb-6">
          {replies.map(reply => {
            const isAdmin = reply.is_admin || reply.author_name === 'Admin';
            return (
              <div
                key={reply.id}
                className="glass-card rounded-2xl p-4"
                style={isAdmin ? { borderColor: 'rgba(41,151,255,0.25)', background: 'rgba(41,151,255,0.04)' } : {}}
              >
                <div className="flex gap-3">
                  <Avatar name={reply.author_name} isAdmin={isAdmin} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      {isAdmin ? (
                        <span
                          className="text-[10px] font-black px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(41,151,255,0.15)', color: '#2997ff' }}
                        >
                          ✦ Admin
                        </span>
                      ) : (
                        <span className="text-[12px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {reply.author_name}
                        </span>
                      )}
                      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {formatDate(reply.created_at)}
                      </span>
                    </div>
                    <p
                      className="text-[13px] leading-relaxed whitespace-pre-wrap"
                      style={{ color: 'var(--text-secondary)', fontFamily: "var(--font-noto-malayalam), sans-serif" }}
                    >
                      {reply.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="rounded-2xl py-8 text-center mb-6"
          style={{ background: 'var(--surface-xs)', border: '1px solid var(--border-xs)' }}
        >
          <div style={{ fontSize: 28, marginBottom: 6 }}>💬</div>
          <div className="text-[13px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
            ഇനിയും കമന്റുകൾ ഇല്ല
          </div>
          <div className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
            Be the first to comment
          </div>
        </div>
      )}

      {/* Reply form */}
      {threadId && (
        <div
          className="rounded-2xl p-5"
          style={{ background: 'var(--surface-xs)', border: '1px solid var(--border-xs)' }}
        >
          <div className="text-[11px] font-black uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
            കമന്റ് ചേർക്കുക
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              value={form.author_name}
              onChange={e => setForm(p => ({ ...p, author_name: e.target.value }))}
              placeholder="നിങ്ങളുടെ പേര്"
              maxLength={50}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'var(--surface-sm)',
                border: '1px solid var(--border-sm)',
                color: 'var(--text-primary)',
                fontFamily: "var(--font-noto-malayalam), sans-serif",
              }}
            />
            <textarea
              value={form.body}
              onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
              placeholder="നിങ്ങളുടെ കമന്റ്..."
              maxLength={2000}
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
              style={{
                background: 'var(--surface-sm)',
                border: '1px solid var(--border-sm)',
                color: 'var(--text-primary)',
                fontFamily: "var(--font-noto-malayalam), sans-serif",
              }}
            />
            <div className="text-[10px] text-right" style={{ color: 'var(--text-muted)' }}>
              {form.body.length}/2000
            </div>
            {error && (
              <div
                className="text-xs px-3 py-2 rounded-lg"
                style={{ background: 'rgba(255,69,58,0.1)', color: '#ff453a', fontFamily: "var(--font-noto-malayalam), sans-serif" }}
              >
                {error}
              </div>
            )}
            {success && (
              <div className="text-xs px-3 py-2 rounded-lg" style={{ background: `${GREEN}15`, color: GREEN }}>
                കമന്റ് ചേർത്തു!
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl text-sm font-bold text-white border-none cursor-pointer transition-all disabled:opacity-50"
              style={{ background: '#2997ff' }}
            >
              {submitting ? 'Post ചെയ്യുന്നു...' : 'Post Comment'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
