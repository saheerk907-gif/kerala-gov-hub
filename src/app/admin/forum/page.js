// src/app/admin/forum/page.js
'use client';
import { useState, useEffect } from 'react';

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

  async function fetchAll() {
    setLoading(true);
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
    setLoading(false);
  }

  useEffect(() => { fetchAll(); }, []);

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
          <p className="text-sm text-[#86868b] mt-0.5">Hide or delete threads and replies</p>
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
                    <div className="flex items-center gap-2">
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
