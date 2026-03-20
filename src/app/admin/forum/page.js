// src/app/admin/forum/page.js
'use client';
import { useState, useEffect, useRef } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getToken() {
  return sessionStorage.getItem('admin_token') || SUPABASE_KEY;
}

function formatDate(str) {
  return new Date(str).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function AdminForumPage() {
  const [tab, setTab] = useState('threads');
  const [threads, setThreads] = useState([]);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  // reply state
  const [replyingTo, setReplyingTo] = useState(null); // thread id
  const [replyText, setReplyText] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [replyError, setReplyError] = useState('');
  const textareaRef = useRef(null);

  async function fetchAll() {
    setLoading(true);
    try {
      const token = getToken();
      const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` };
      const [tr, rr] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/forum_threads?select=*&order=created_at.desc`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/forum_replies?select=*&order=created_at.desc`, { headers }),
      ]);
      const td = await tr.json();
      const rd = await rr.json();
      setThreads(Array.isArray(td) ? td : []);
      setReplies(Array.isArray(rd) ? rd : []);
    } catch (err) {
      console.error('Forum fetch error:', err);
      setThreads([]);
      setReplies([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  // Focus textarea when reply box opens
  useEffect(() => {
    if (replyingTo && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyingTo]);

  function openReply(threadId) {
    setReplyingTo(threadId);
    setReplyText('');
    setReplyError('');
  }

  function cancelReply() {
    setReplyingTo(null);
    setReplyText('');
    setReplyError('');
  }

  async function submitReply(threadId) {
    if (!replyText.trim()) { setReplyError('Reply cannot be empty.'); return; }
    if (replyText.length > 2000) { setReplyError('Max 2000 characters.'); return; }
    setReplySubmitting(true);
    setReplyError('');
    try {
      const token = getToken();
      const res = await fetch(`${SUPABASE_URL}/rest/v1/forum_replies`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          body: replyText.trim(),
          author_name: 'Admin',
          thread_id: threadId,
          is_admin: true,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setReplyError(err.message || 'Failed to post reply.');
        return;
      }
      cancelReply();
      await fetchAll();
    } catch {
      setReplyError('Network error.');
    } finally {
      setReplySubmitting(false);
    }
  }

  async function toggleHidden(table, id, currentValue) {
    const token = getToken();
    await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ is_hidden: !currentValue }),
    });
    await fetchAll();
  }

  async function hardDelete(table, id) {
    if (!confirm('ഈ item ശാശ്വതമായി ഡിലീറ്റ് ചെയ്യണോ?')) return;
    const token = getToken();
    await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}`, Prefer: 'return=minimal' },
    });
    await fetchAll();
  }

  const rows = tab === 'threads' ? threads : replies;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Forum Moderation</h1>
          <p className="text-sm text-[#86868b] mt-0.5">Hide, delete, or reply to threads and replies</p>
        </div>
        <button onClick={fetchAll} className="px-4 py-2 rounded-xl text-xs text-[#2997ff] bg-[#2997ff]/10 border-none cursor-pointer hover:bg-[#2997ff]/20 transition-all">
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['threads', 'replies'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 rounded-xl text-sm font-semibold border-none cursor-pointer transition-all capitalize"
            style={{
              background: tab === t ? '#2997ff' : 'rgba(255,255,255,0.05)',
              color: tab === t ? '#fff' : '#86868b',
            }}>
            {t === 'threads' ? `Threads (${threads.length})` : `Replies (${replies.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-[#86868b] text-sm">Loading...</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#6e6e73]">Content</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#6e6e73]">Author</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#6e6e73]">Date</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#6e6e73]">Status</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#6e6e73]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <>
                  <tr key={row.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    style={{ opacity: row.is_hidden ? 0.5 : 1 }}>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="truncate text-white/80 text-xs">{row.title || row.body}</div>
                    </td>
                    <td className="px-4 py-3 text-[#86868b] text-xs whitespace-nowrap">{row.author_name}</td>
                    <td className="px-4 py-3 text-[#86868b] text-xs whitespace-nowrap">{formatDate(row.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${row.is_hidden ? 'bg-red-500/15 text-red-400' : 'bg-green-500/15 text-green-400'}`}>
                        {row.is_hidden ? 'Hidden' : 'Visible'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Reply — threads tab only */}
                        {tab === 'threads' && (
                          replyingTo === row.id ? (
                            <button
                              onClick={cancelReply}
                              className="px-3 py-1 rounded-lg text-[11px] font-semibold border-none cursor-pointer transition-all"
                              style={{ background: 'rgba(255,255,255,0.08)', color: '#86868b' }}>
                              Cancel
                            </button>
                          ) : (
                            <button
                              onClick={() => openReply(row.id)}
                              className="px-3 py-1 rounded-lg text-[11px] font-semibold border-none cursor-pointer transition-all"
                              style={{ background: 'rgba(41,151,255,0.15)', color: '#2997ff' }}>
                              💬 Reply
                            </button>
                          )
                        )}
                        <button
                          onClick={() => toggleHidden(tab === 'threads' ? 'forum_threads' : 'forum_replies', row.id, row.is_hidden)}
                          className="px-3 py-1 rounded-lg text-[11px] font-semibold border-none cursor-pointer transition-all"
                          style={{ background: row.is_hidden ? 'rgba(52,199,89,0.15)' : 'rgba(255,159,10,0.15)', color: row.is_hidden ? '#34c759' : '#ff9f0a' }}>
                          {row.is_hidden ? 'Show' : 'Hide'}
                        </button>
                        <button
                          onClick={() => hardDelete(tab === 'threads' ? 'forum_threads' : 'forum_replies', row.id)}
                          className="px-3 py-1 rounded-lg text-[11px] font-semibold border-none cursor-pointer bg-[#ff453a]/15 text-[#ff453a] transition-all hover:bg-[#ff453a]/25">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Inline reply form */}
                  {tab === 'threads' && replyingTo === row.id && (
                    <tr key={`reply-${row.id}`} className="border-b border-white/[0.04]">
                      <td colSpan={5} className="px-4 py-4" style={{ background: 'rgba(41,151,255,0.04)' }}>
                        <div className="flex items-start gap-3">
                          <div className="text-[10px] font-black text-[#2997ff] uppercase tracking-widest mt-2 whitespace-nowrap">
                            Admin Reply
                          </div>
                          <div className="flex-1">
                            <textarea
                              ref={textareaRef}
                              value={replyText}
                              onChange={e => setReplyText(e.target.value)}
                              placeholder="Type your reply..."
                              rows={3}
                              maxLength={2000}
                              className="w-full px-3 py-2 rounded-xl text-xs text-white outline-none resize-none transition-all"
                              style={{
                                background: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(41,151,255,0.3)',
                              }}
                            />
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => submitReply(row.id)}
                                  disabled={replySubmitting}
                                  className="px-4 py-1.5 rounded-lg text-[11px] font-bold border-none cursor-pointer text-white transition-all disabled:opacity-50"
                                  style={{ background: '#2997ff' }}>
                                  {replySubmitting ? 'Posting...' : 'Post Reply →'}
                                </button>
                                {replyError && (
                                  <span className="text-[11px] text-[#ff453a]">{replyError}</span>
                                )}
                              </div>
                              <span className="text-[10px] text-[#6e6e73]">{replyText.length}/2000</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-[#6e6e73] text-sm">No {tab} yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
