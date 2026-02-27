'use client';
import { useEffect, useState } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const CATEGORIES = [
  { value: 'pay', label: 'ശമ്പളം' },
  { value: 'da', label: 'ക്ഷാമബത്ത' },
  { value: 'medisep', label: 'മെഡിസെപ്' },
  { value: 'gpf', label: 'GPF' },
  { value: 'nps', label: 'NPS' },
  { value: 'pension', label: 'പെൻഷൻ' },
  { value: 'general', label: 'പൊതുവായത്' },
];

const EMPTY = { title_ml: '', title_en: '', summary_ml: '', content_ml: '', category: 'general', source_url: '', is_published: true, is_featured: false };

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

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await api('news?select=*&order=published_at.desc');
      setNews(Array.isArray(data) ? data : []);
    } catch { setNews([]); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await api(`news?id=eq.${editId}`, 'PATCH', form);
      } else {
        await api('news', 'POST', { ...form, published_at: new Date().toISOString() });
      }
      setShowForm(false);
      setForm(EMPTY);
      setEditId(null);
      load();
    } catch (err) { alert('Error: ' + err.message); }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this news?')) return;
    await api(`news?id=eq.${id}`, 'DELETE');
    load();
  }

  const inp = "w-full px-3 py-2.5 bg-[#1c1c1e] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">വാർത്തകൾ</h1>
          <p className="text-xs text-[#6e6e73]">{news.length} articles</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(true); }}
          className="px-5 py-2.5 bg-[#ff453a] text-white rounded-xl text-sm font-bold hover:bg-[#d70015] transition-all border-none cursor-pointer">
          + പുതിയ വാർത്ത
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center pt-12 px-4"
          onClick={() => setShowForm(false)}>
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">{editId ? 'Edit News' : '+ പുതിയ വാർത്ത'}</h2>
              <button onClick={() => setShowForm(false)} className="text-[#6e6e73] hover:text-white text-xl border-none bg-transparent cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Malayalam Title *</label>
                <input required value={form.title_ml} onChange={e => setForm(f => ({...f, title_ml: e.target.value}))}
                  placeholder="വാർത്തയുടെ ശീർഷകം" className={inp} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">English Title</label>
                  <input value={form.title_en || ''} onChange={e => setForm(f => ({...f, title_en: e.target.value}))}
                    placeholder="English title" className={inp} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className={inp}>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Summary (Malayalam)</label>
                <textarea value={form.summary_ml || ''} onChange={e => setForm(f => ({...f, summary_ml: e.target.value}))}
                  rows={2} placeholder="Short summary shown on cards..." className={inp + ' resize-y'} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Full Content (HTML supported)</label>
                <textarea value={form.content_ml || ''} onChange={e => setForm(f => ({...f, content_ml: e.target.value}))}
                  rows={8} placeholder="Full article content. HTML: <h3>, <p>, <b>, <ul>, <li>" className={inp + ' resize-y font-mono text-xs'} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Source URL</label>
                <input value={form.source_url || ''} onChange={e => setForm(f => ({...f, source_url: e.target.value}))}
                  placeholder="https://finance.kerala.gov.in" className={inp} />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.is_published} onChange={e => setForm(f => ({...f, is_published: e.target.checked}))} />
                  <span className="text-[#86868b]">Published</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({...f, is_featured: e.target.checked}))} />
                  <span className="text-[#86868b]">⭐ Featured</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-[#ff453a] text-white rounded-xl text-sm font-bold hover:bg-[#d70015] transition-all disabled:opacity-50 border-none cursor-pointer">
                  {saving ? 'Saving...' : (editId ? 'Update' : 'Publish')}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-white/5 text-[#86868b] rounded-xl text-sm font-bold border-none cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center text-[#6e6e73] py-12">Loading...</div>
      ) : news.length === 0 ? (
        <div className="text-center text-[#6e6e73] py-16 bg-[#111] rounded-2xl border border-white/[0.08]">
          <div className="text-4xl mb-3">📰</div>
          <div>No news yet — publish your first article!</div>
        </div>
      ) : (
        <div className="space-y-2">
          {news.map(n => (
            <div key={n.id} className="flex items-center gap-4 px-5 py-4 bg-[#111] border border-white/[0.08] rounded-xl hover:bg-[#1a1a1a] transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {!n.is_published && <span className="text-[9px] text-[#ff453a] bg-[#ff453a]/10 px-1.5 py-0.5 rounded">Draft</span>}
                  {n.is_featured && <span className="text-[9px] text-[#ff9f0a]">⭐</span>}
                  <span className="text-sm font-semibold text-white truncate">{n.title_ml}</span>
                </div>
                <div className="text-[11px] text-[#6e6e73]">
                  {CATEGORIES.find(c => c.value === n.category)?.label} • {new Date(n.published_at).toLocaleDateString('ml-IN')}
                </div>
              </div>
              <button onClick={() => { setForm({ title_ml: n.title_ml||'', title_en: n.title_en||'', summary_ml: n.summary_ml||'', content_ml: n.content_ml||'', category: n.category||'general', source_url: n.source_url||'', is_published: n.is_published, is_featured: n.is_featured }); setEditId(n.id); setShowForm(true); }}
                className="px-3 py-1.5 bg-white/5 rounded-lg text-xs text-[#86868b] hover:text-white border-none cursor-pointer transition-all">Edit</button>
              <button onClick={() => handleDelete(n.id)}
                className="px-3 py-1.5 bg-[#ff453a]/10 rounded-lg text-xs text-[#ff453a] hover:bg-[#ff453a]/20 border-none cursor-pointer transition-all">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
