'use client';
import { useEffect, useState } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function api(path, method = 'GET', body = null) {
  const token = sessionStorage.getItem('admin_token');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${token || SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: body ? JSON.stringify(body) : null,
  });
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

const BLANK_DEPT = { icon: '📁', color: '#2997ff', title_ml: '', subtitle_en: '', sort_order: 0, is_active: true };
const BLANK_LINK = { label: '', href: '', sort_order: 0, is_active: true };
const inp = 'w-full px-3 py-2.5 bg-[#1c1c1e] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors';
const PRESET_COLORS = ['#2997ff', '#30d158', '#ff9f0a', '#bf5af2', '#ff453a', '#c8960c', '#5e5ce6', '#64d2ff'];

export default function AdminResources() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [editingDept, setEditingDept] = useState(null); // null | dept object (new has no id)
  const [editingLink, setEditingLink] = useState(null); // null | link object
  const [addingLinkFor, setAddingLinkFor] = useState(null); // dept id
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await api('resource_departments?select=*,resource_links(*)&order=sort_order');
      if (Array.isArray(data)) {
        // Sort links within each dept
        data.forEach(d => {
          if (Array.isArray(d.resource_links)) {
            d.resource_links.sort((a, b) => a.sort_order - b.sort_order);
          }
        });
        setDepartments(data);
      } else if (data?.message) {
        setError(data.message);
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  // --- Department handlers ---
  async function saveDept(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const { id, resource_links, ...fields } = editingDept;
      if (id) {
        await api(`resource_departments?id=eq.${id}`, 'PATCH', fields);
      } else {
        await api('resource_departments', 'POST', fields);
      }
      setEditingDept(null);
      load();
    } catch (err) { alert('Error: ' + err.message); }
    setSaving(false);
  }

  async function deleteDept(dept) {
    if (!confirm(`Delete "${dept.title_ml || dept.subtitle_en}" and all its links?`)) return;
    setDeleting(dept.id);
    try {
      // Delete links first
      await api(`resource_links?department_id=eq.${dept.id}`, 'DELETE');
      await api(`resource_departments?id=eq.${dept.id}`, 'DELETE');
      load();
    } catch (err) { alert('Error: ' + err.message); }
    setDeleting(null);
  }

  // --- Link handlers ---
  async function saveLink(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const { id, ...fields } = editingLink;
      if (id) {
        await api(`resource_links?id=eq.${id}`, 'PATCH', fields);
      } else {
        await api('resource_links', 'POST', { ...fields, department_id: addingLinkFor });
      }
      setEditingLink(null);
      setAddingLinkFor(null);
      load();
    } catch (err) { alert('Error: ' + err.message); }
    setSaving(false);
  }

  async function deleteLink(link) {
    if (!confirm(`Delete link "${link.label}"?`)) return;
    setDeleting(link.id);
    try {
      await api(`resource_links?id=eq.${link.id}`, 'DELETE');
      load();
    } catch (err) { alert('Error: ' + err.message); }
    setDeleting(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-2xl font-bold">വിഭവ ശേഖരം</h1>
          <p className="text-xs text-[#6e6e73]">Manage department resource cards and their links</p>
        </div>
        <button
          onClick={() => setEditingDept({ ...BLANK_DEPT })}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2997ff] text-white rounded-xl text-sm font-bold border-none cursor-pointer hover:bg-[#0071e3] transition-all"
        >
          ＋ Add Department
        </button>
      </div>

      {error && (
        <div className="bg-[#ff453a]/10 border border-[#ff453a]/30 rounded-xl p-4 my-4 text-sm text-[#ff453a]">
          ⚠️ {error}
          <div className="text-[11px] mt-1 text-[#ff453a]/60">
            Make sure the <code>resource_departments</code> and <code>resource_links</code> tables exist in Supabase. See SQL below.
          </div>
          <details className="mt-2">
            <summary className="text-[11px] cursor-pointer text-[#ff453a]/80">Show SQL to create tables</summary>
            <pre className="mt-2 text-[10px] bg-black/40 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap text-[#ff9f0a]/80">{`CREATE TABLE resource_departments (
  id bigint generated always as identity primary key,
  icon text default '📁',
  color text default '#2997ff',
  title_ml text not null,
  subtitle_en text,
  sort_order int default 0,
  is_active boolean default true
);

CREATE TABLE resource_links (
  id bigint generated always as identity primary key,
  department_id bigint references resource_departments(id) on delete cascade,
  label text not null,
  href text not null,
  sort_order int default 0,
  is_active boolean default true
);`}</pre>
          </details>
        </div>
      )}

      {loading ? (
        <div className="text-center text-[#6e6e73] py-12 mt-6">Loading...</div>
      ) : departments.length === 0 && !error ? (
        <div className="text-center text-[#6e6e73] py-16 bg-[#111] rounded-2xl border border-white/[0.08] mt-6">
          <div className="text-4xl mb-3">📭</div>
          <div className="font-semibold mb-1">No departments yet</div>
          <div className="text-xs mb-4">Click "Add Department" to create the first resource card</div>
          <button onClick={load} className="px-4 py-2 bg-white/5 rounded-lg text-xs text-[#86868b] hover:text-white border-none cursor-pointer">
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-3 mt-6">
          {departments.map(dept => {
            const isExpanded = expandedId === dept.id;
            const links = dept.resource_links || [];
            return (
              <div key={dept.id} className="bg-[#111] border border-white/[0.08] rounded-2xl overflow-hidden">
                {/* Department row */}
                <div className="flex items-center gap-4 p-4">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : dept.id)}
                    className="flex items-center gap-3 flex-1 text-left bg-transparent border-none cursor-pointer group"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: dept.color + '18', border: `1px solid ${dept.color}30` }}
                    >
                      {dept.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-sm">{dept.title_ml}</div>
                      <div className="text-[11px] font-bold uppercase tracking-wider mt-0.5" style={{ color: dept.color + 'aa' }}>
                        {dept.subtitle_en}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mr-2">
                      <span className="text-[11px] text-[#6e6e73] bg-white/5 px-2 py-0.5 rounded-full">{links.length} links</span>
                      <span className={`text-[#6e6e73] text-xs transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>›</span>
                    </div>
                  </button>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!dept.is_active && (
                      <span className="text-[10px] text-[#ff453a] bg-[#ff453a]/10 px-2 py-0.5 rounded-full font-bold">Hidden</span>
                    )}
                    <button
                      onClick={() => setEditingDept({ ...dept })}
                      className="px-3 py-1.5 bg-[#2997ff]/10 text-[#2997ff] rounded-lg text-xs font-bold border-none cursor-pointer hover:bg-[#2997ff]/20 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteDept(dept)}
                      disabled={deleting === dept.id}
                      className="px-3 py-1.5 bg-[#ff453a]/10 text-[#ff453a] rounded-lg text-xs font-bold border-none cursor-pointer hover:bg-[#ff453a]/20 transition-all disabled:opacity-50"
                    >
                      {deleting === dept.id ? '…' : 'Delete'}
                    </button>
                  </div>
                </div>

                {/* Links section (expanded) */}
                {isExpanded && (
                  <div className="border-t border-white/[0.06] px-4 pb-4 pt-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#6e6e73]">Links</span>
                      <button
                        onClick={() => { setAddingLinkFor(dept.id); setEditingLink({ ...BLANK_LINK }); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#30d158]/10 text-[#30d158] rounded-lg text-xs font-bold border-none cursor-pointer hover:bg-[#30d158]/20 transition-all"
                      >
                        ＋ Add Link
                      </button>
                    </div>
                    {links.length === 0 ? (
                      <div className="text-center text-[#6e6e73] py-6 bg-black/20 rounded-xl text-xs">No links yet</div>
                    ) : (
                      <div className="space-y-1.5">
                        {links.map(link => (
                          <div key={link.id} className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-3 py-2.5 group">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-white/80 font-medium truncate">{link.label}</div>
                              <div className="text-[11px] text-[#6e6e73] truncate">{link.href}</div>
                            </div>
                            {!link.is_active && (
                              <span className="text-[10px] text-[#ff453a]/80 flex-shrink-0">hidden</span>
                            )}
                            <div className="flex gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => { setAddingLinkFor(null); setEditingLink({ ...link }); }}
                                className="px-2.5 py-1 bg-[#2997ff]/10 text-[#2997ff] rounded-lg text-[11px] font-bold border-none cursor-pointer hover:bg-[#2997ff]/20"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteLink(link)}
                                disabled={deleting === link.id}
                                className="px-2.5 py-1 bg-[#ff453a]/10 text-[#ff453a] rounded-lg text-[11px] font-bold border-none cursor-pointer hover:bg-[#ff453a]/20 disabled:opacity-50"
                              >
                                {deleting === link.id ? '…' : '✕'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Department Edit/Add Modal */}
      {editingDept && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center pt-16 px-4"
          onClick={() => setEditingDept(null)}>
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 w-full max-w-lg"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">{editingDept.id ? 'Edit Department' : 'Add Department'}</h2>
              <button onClick={() => setEditingDept(null)} className="text-[#6e6e73] hover:text-white text-xl border-none bg-transparent cursor-pointer">✕</button>
            </div>
            <form onSubmit={saveDept} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Malayalam Title *</label>
                  <input required value={editingDept.title_ml || ''} onChange={e => setEditingDept({ ...editingDept, title_ml: e.target.value })}
                    placeholder="e.g. ശമ്പളം & ബത്ത" className={inp} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">English Subtitle *</label>
                  <input required value={editingDept.subtitle_en || ''} onChange={e => setEditingDept({ ...editingDept, subtitle_en: e.target.value })}
                    placeholder="e.g. Salary & Allowances" className={inp} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Icon (emoji)</label>
                  <input value={editingDept.icon || ''} onChange={e => setEditingDept({ ...editingDept, icon: e.target.value })}
                    placeholder="💼" className={inp} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Sort Order</label>
                  <input type="number" value={editingDept.sort_order ?? 0} onChange={e => setEditingDept({ ...editingDept, sort_order: parseInt(e.target.value) || 0 })}
                    className={inp} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-2">Card Color</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {PRESET_COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setEditingDept({ ...editingDept, color: c })}
                      className="w-7 h-7 rounded-full border-2 transition-all cursor-pointer"
                      style={{ background: c, borderColor: editingDept.color === c ? 'white' : 'transparent' }}
                    />
                  ))}
                  <input type="color" value={editingDept.color || '#2997ff'} onChange={e => setEditingDept({ ...editingDept, color: e.target.value })}
                    className="w-8 h-7 rounded cursor-pointer bg-transparent border border-white/20" title="Custom color" />
                  <span className="text-xs text-[#6e6e73]">{editingDept.color}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-white/60 flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editingDept.is_active !== false}
                    onChange={e => setEditingDept({ ...editingDept, is_active: e.target.checked })}
                    className="accent-[#30d158] w-4 h-4" />
                  Active (visible on site)
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-[#30d158] text-black rounded-xl text-sm font-black hover:bg-[#28b84c] transition-all disabled:opacity-50 border-none cursor-pointer">
                  {saving ? 'Saving…' : editingDept.id ? 'Save Changes' : 'Create Department'}
                </button>
                <button type="button" onClick={() => setEditingDept(null)}
                  className="px-6 py-3 bg-white/5 text-[#86868b] rounded-xl text-sm font-bold hover:text-white transition-all border-none cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Link Edit/Add Modal */}
      {editingLink && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center pt-16 px-4"
          onClick={() => { setEditingLink(null); setAddingLinkFor(null); }}>
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">{editingLink.id ? 'Edit Link' : 'Add Link'}</h2>
              <button onClick={() => { setEditingLink(null); setAddingLinkFor(null); }} className="text-[#6e6e73] hover:text-white text-xl border-none bg-transparent cursor-pointer">✕</button>
            </div>
            <form onSubmit={saveLink} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Label *</label>
                <input required value={editingLink.label || ''} onChange={e => setEditingLink({ ...editingLink, label: e.target.value })}
                  placeholder="e.g. DA Rates History" className={inp} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">URL / Path *</label>
                <input required value={editingLink.href || ''} onChange={e => setEditingLink({ ...editingLink, href: e.target.value })}
                  placeholder="e.g. /da-arrear or https://..." className={inp} />
                <div className="text-[10px] text-[#6e6e73] mt-1">Use /path for internal pages, or full URL for external links</div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Sort Order</label>
                <input type="number" value={editingLink.sort_order ?? 0} onChange={e => setEditingLink({ ...editingLink, sort_order: parseInt(e.target.value) || 0 })}
                  className={inp} />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-white/60 flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editingLink.is_active !== false}
                    onChange={e => setEditingLink({ ...editingLink, is_active: e.target.checked })}
                    className="accent-[#30d158] w-4 h-4" />
                  Active (visible on site)
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-[#30d158] text-black rounded-xl text-sm font-black hover:bg-[#28b84c] transition-all disabled:opacity-50 border-none cursor-pointer">
                  {saving ? 'Saving…' : editingLink.id ? 'Save Changes' : 'Add Link'}
                </button>
                <button type="button" onClick={() => { setEditingLink(null); setAddingLinkFor(null); }}
                  className="px-6 py-3 bg-white/5 text-[#86868b] rounded-xl text-sm font-bold hover:text-white transition-all border-none cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
