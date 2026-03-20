// src/app/admin/experiences/page.js
'use client';
import { useState, useEffect } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const GREEN = '#30d158';
const GOLD = '#c8960c';

function getToken() {
  return sessionStorage.getItem('admin_token') || SUPABASE_KEY;
}

function formatDate(str) {
  return new Date(str).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

function StatusBadge({ status }) {
  const styles = {
    pending: { bg: 'rgba(255,159,10,0.15)', color: '#ff9f0a' },
    published: { bg: 'rgba(48,209,88,0.15)', color: GREEN },
    rejected: { bg: 'rgba(255,69,58,0.15)', color: '#ff453a' },
  };
  const s = styles[status] || styles.pending;
  return (
    <span
      className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
      style={{ background: s.bg, color: s.color }}
    >
      {status}
    </span>
  );
}

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionState, setActionState] = useState({}); // id -> 'loading'|'error'

  async function fetchAll() {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/experiences?select=id,title,body,author_name,department,is_anonymous,is_pinned,status,created_at,published_at,forum_thread_id&order=created_at.desc`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setExperiences(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Experiences admin fetch error:', err);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  async function callAction(id, url, method = 'POST') {
    setActionState((prev) => ({ ...prev, [id]: 'loading' }));
    try {
      const res = await fetch(url, { method });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Action failed.');
        setActionState((prev) => ({ ...prev, [id]: 'error' }));
        return;
      }
      setActionState((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      await fetchAll();
    } catch {
      alert('Network error.');
      setActionState((prev) => ({ ...prev, [id]: 'error' }));
    }
  }

  function approve(id) {
    callAction(id, `/api/admin/experiences/${id}/publish`, 'POST');
  }

  function reject(id) {
    if (!confirm('Reject this experience?')) return;
    callAction(id, `/api/admin/experiences/${id}/reject`, 'POST');
  }

  function togglePin(id) {
    callAction(id, `/api/admin/experiences/${id}/pin`, 'PATCH');
  }

  // Group: pending first, then published, then rejected
  const pending = experiences.filter((e) => e.status === 'pending');
  const published = experiences.filter((e) => e.status === 'published');
  const rejected = experiences.filter((e) => e.status === 'rejected');
  const grouped = [
    { label: 'Pending', items: pending, accent: '#ff9f0a' },
    { label: 'Published', items: published, accent: GREEN },
    { label: 'Rejected', items: rejected, accent: '#ff453a' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Experiences Moderation</h1>
          <p className="text-sm text-[#86868b] mt-0.5">
            Review, approve, reject, and pin employee experiences
          </p>
        </div>
        <button
          onClick={fetchAll}
          className="px-4 py-2 rounded-xl text-xs border-none cursor-pointer transition-all"
          style={{ background: `${GREEN}15`, color: GREEN }}
        >
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {grouped.map(({ label, items, accent }) => (
          <div
            key={label}
            className="px-4 py-2 rounded-xl text-[12px] font-semibold"
            style={{ background: `${accent}15`, color: accent }}
          >
            {label}: {items.length}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-[#86868b] text-sm">Loading...</div>
      ) : (
        <div className="flex flex-col gap-8">
          {grouped.map(({ label, items, accent }) =>
            items.length === 0 ? null : (
              <div key={label}>
                <div
                  className="text-[10px] font-black uppercase tracking-widest mb-3"
                  style={{ color: accent }}
                >
                  {label} ({items.length})
                </div>
                <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        className="border-b border-white/[0.06]"
                        style={{ background: 'rgba(255,255,255,0.03)' }}
                      >
                        <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#6e6e73]">
                          Title
                        </th>
                        <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] whitespace-nowrap">
                          Author (real)
                        </th>
                        <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#6e6e73]">
                          Dept
                        </th>
                        <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] whitespace-nowrap">
                          Submitted
                        </th>
                        <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#6e6e73]">
                          Status
                        </th>
                        <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#6e6e73]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((exp) => {
                        const isLoading = actionState[exp.id] === 'loading';
                        return (
                          <tr
                            key={exp.id}
                            className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                          >
                            {/* Title + excerpt */}
                            <td className="px-4 py-3 max-w-[240px]">
                              <div
                                className="font-semibold text-white/85 text-xs truncate"
                                title={exp.title}
                              >
                                {exp.title}
                              </div>
                              <div className="text-[10px] text-white/35 mt-0.5 truncate">
                                {(exp.body || '').slice(0, 80)}...
                              </div>
                              {exp.is_anonymous && (
                                <span
                                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 inline-block"
                                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
                                >
                                  Anonymous post
                                </span>
                              )}
                              {exp.is_pinned && (
                                <span
                                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 inline-block ml-1"
                                  style={{ background: `${GOLD}20`, color: GOLD }}
                                >
                                  📌 Pinned
                                </span>
                              )}
                            </td>

                            {/* Author — always show real name for admin */}
                            <td className="px-4 py-3 text-[#86868b] text-xs whitespace-nowrap">
                              {exp.author_name || '—'}
                            </td>

                            {/* Department */}
                            <td className="px-4 py-3 text-[#86868b] text-xs">
                              {exp.department || '—'}
                            </td>

                            {/* Submitted */}
                            <td className="px-4 py-3 text-[#86868b] text-xs whitespace-nowrap">
                              {formatDate(exp.created_at)}
                            </td>

                            {/* Status badge */}
                            <td className="px-4 py-3">
                              <StatusBadge status={exp.status} />
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                {exp.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => approve(exp.id)}
                                      disabled={isLoading}
                                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border-none cursor-pointer transition-all disabled:opacity-50"
                                      style={{ background: `${GREEN}20`, color: GREEN }}
                                    >
                                      {isLoading ? '...' : '✓ Approve'}
                                    </button>
                                    <button
                                      onClick={() => reject(exp.id)}
                                      disabled={isLoading}
                                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border-none cursor-pointer transition-all disabled:opacity-50"
                                      style={{ background: 'rgba(255,69,58,0.15)', color: '#ff453a' }}
                                    >
                                      ✕ Reject
                                    </button>
                                  </>
                                )}

                                {exp.status === 'published' && (
                                  <>
                                    <button
                                      onClick={() => togglePin(exp.id)}
                                      disabled={isLoading}
                                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border-none cursor-pointer transition-all disabled:opacity-50"
                                      style={{
                                        background: exp.is_pinned
                                          ? `${GOLD}25`
                                          : 'rgba(255,255,255,0.08)',
                                        color: exp.is_pinned ? GOLD : 'rgba(255,255,255,0.6)',
                                      }}
                                    >
                                      {isLoading ? '...' : exp.is_pinned ? '📌 Unpin' : '📌 Pin'}
                                    </button>
                                    <button
                                      onClick={() => reject(exp.id)}
                                      disabled={isLoading}
                                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border-none cursor-pointer transition-all disabled:opacity-50"
                                      style={{ background: 'rgba(255,69,58,0.12)', color: '#ff453a' }}
                                    >
                                      Unpublish
                                    </button>
                                  </>
                                )}

                                {exp.status === 'rejected' && (
                                  <button
                                    onClick={() => approve(exp.id)}
                                    disabled={isLoading}
                                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border-none cursor-pointer transition-all disabled:opacity-50"
                                    style={{ background: `${GREEN}15`, color: GREEN }}
                                  >
                                    {isLoading ? '...' : '↩ Re-approve'}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}

          {experiences.length === 0 && (
            <div className="text-center py-12 text-[#6e6e73] text-sm">
              No experiences submitted yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
