'use client';
import { useEffect, useState } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const EMPTY = { title_ml: '', title_en: '', url: '', icon: '🔗', sort_order: 0, is_active: true };

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

export default function AdminLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await api('quick_links?select=*&order=sort_order');
      setLinks(Array.isArray(data) ? data : []);
    } catch { setLinks([]); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await api(`quick_links?id=eq.${editId}`, 'PATCH', form);
      } else {
        await api('quick_links', 'POST', form);
      }
      setShowForm(false);
      setForm(EMPTY);
      setEditId(null);
      load();
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this link?')) return;
    await api(`quick_links?id=eq.${id}`, 'DELETE');
    load();
  }

  const inp = "w-full px-3 py-2.5 bg-[#1c1c1e] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">ക്വിക്ക് ലിങ്കുകൾ</h1>
          <p className="text-xs text-[#6e6e73]">{links.length} links</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(true); }}
          className="px-5 py-2.5 bg-[#30d158] text-black rounded-xl text-sm font-black hover:bg-[#28b84c] transition-all border-none cursor-pointer">
          + Add Link
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center pt-20 px-4"
          onClick={() => setShowForm(false)}>
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 w-full max-w-lg"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">{editId ? 'Edit Link' : '+ Add Link'}</h2>
              <button onClick={() => setShowForm(false)} className="text-[#6e6e73] hover:text-white text-xl border-none bg-transparent cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Icon (emoji)</label>
                  <input value={form.icon} onChange={e => setForm(f => ({...f, icon: e.target.value}))}
                    placeholder="💻" className={inp} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm(f => ({...f, sort_order: parseInt(e.target.value)||0}))}
                    className={inp} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Malayalam Title *</label>
                <input required value={form.title_ml} onChange={e => setForm(f => ({...f, title_ml: e.target.value}))}
                  placeholder="SPARK പോർട്ടൽ" className={inp} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">English Title</label>
                <input value={form.title_en || ''} onChange={e => setForm(f => ({...f, title_en: e.target.value}))}
                  placeholder="SPARK Portal" className={inp} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">URL *</label>
                <input required type="url" value={form.url} onChange={e => setForm(f => ({...f, url: e.target.value}))}
                  placeholder="https://spark.kerala.gov.in" className={inp} />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({...f, is_active: e.target.checked}))} />
                <span className="text-[#86868b]">Active (visible on site)</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-[#2997ff] text-white rounded-xl text-sm font-bold hover:bg-[#0077ed] transition-all disabled:opacity-50 border-none cursor-pointer">
                  {saving ? 'Saving...' : (editId ? 'Update' : 'Add Link')}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-white/5 text-[#86868b] rounded-xl text-sm font-bold hover:text-white transition-all border-none cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Links List */}
      {loading ? (
        <div className="text-center text-[#6e6e73] py-12">Loading...</div>
      ) : links.length === 0 ? (
        <div className="text-center text-[#6e6e73] py-12 bg-[#111] rounded-2xl border border-white/[0.08]">
          <div className="text-4xl mb-3">🔗</div>
          <div>No links yet — add one!</div>
        </div>
      ) : (
        <div className="space-y-2">
          {links.map(l => (
            <div key={l.id} className="flex items-center gap-4 px-5 py-4 bg-[#111] border border-white/[0.08] rounded-xl hover:bg-[#1a1a1a] transition-all">
              <div className="text-2xl w-10 text-center">{l.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {!l.is_active && <span className="text-[9px] text-[#ff453a] bg-[#ff453a]/10 px-1.5 py-0.5 rounded">Hidden</span>}
                  <span className="font-semibold text-sm">{l.title_ml}</span>
                </div>
                <div className="text-xs text-[#6e6e73] truncate">{l.url}</div>
              </div>
              <div className="text-xs text-[#6e6e73]">#{l.sort_order}</div>
              <button onClick={() => { setForm({ title_ml: l.title_ml||'', title_en: l.title_en||'', url: l.url||'', icon: l.icon||'🔗', sort_order: l.sort_order||0, is_active: l.is_active }); setEditId(l.id); setShowForm(true); }}
                className="px-3 py-1.5 bg-white/5 rounded-lg text-xs text-[#86868b] hover:text-white border-none cursor-pointer transition-all">
                Edit
              </button>
              <button onClick={() => handleDelete(l.id)}
                className="px-3 py-1.5 bg-[#ff453a]/10 rounded-lg text-xs text-[#ff453a] hover:bg-[#ff453a]/20 border-none cursor-pointer transition-all">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
