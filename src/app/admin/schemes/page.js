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

export default function AdminSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await api('schemes?select=*&order=slug');
      if (Array.isArray(data)) {
        setSchemes(data);
      } else if (data?.message) {
        setError(data.message);
        setSchemes([]);
      } else {
        setSchemes([]);
      }
    } catch (e) {
      setError(e.message);
      setSchemes([]);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api(`schemes?id=eq.${editing.id}`, 'PATCH', {
        title_ml: editing.title_ml,
        title_en: editing.title_en,
        description_ml: editing.description_ml,
        content_ml: editing.content_ml,
      });
      setEditing(null);
      load();
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setSaving(false);
  }

  const inp = "w-full px-3 py-2.5 bg-[#1c1c1e] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">പദ്ധതികൾ</h1>
      <p className="text-xs text-[#6e6e73] mb-6">Edit scheme details shown on public site</p>

      {error && (
        <div className="bg-[#ff453a]/10 border border-[#ff453a]/30 rounded-xl p-4 mb-4 text-sm text-[#ff453a]">
          ⚠️ Error: {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-[#6e6e73] py-12">Loading...</div>
      ) : schemes.length === 0 ? (
        <div className="text-center text-[#6e6e73] py-16 bg-[#111] rounded-2xl border border-white/[0.08]">
          <div className="text-4xl mb-3">📭</div>
          <div className="font-semibold mb-1">No schemes found</div>
          <div className="text-xs">Run the SQL seed script in Supabase to add schemes</div>
          <button onClick={load} className="mt-4 px-4 py-2 bg-white/5 rounded-lg text-xs text-[#86868b] hover:text-white border-none cursor-pointer">
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {schemes.map(s => (
            <div key={s.id} className="bg-[#111] border border-white/[0.08] rounded-2xl p-5 flex items-center justify-between hover:bg-[#1a1a1a] transition-all">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{s.icon || '📋'}</div>
                <div>
                  <div className="font-bold text-white">{s.title_ml || s.slug}</div>
                  <div className="text-xs text-[#6e6e73]">{s.title_en} • {s.slug}</div>
                  {s.description_ml && (
                    <div className="text-xs text-[#86868b] mt-1 max-w-lg truncate">{s.description_ml}</div>
                  )}
                </div>
              </div>
              <button onClick={() => setEditing({ ...s })}
                className="px-4 py-2 bg-[#2997ff]/10 text-[#2997ff] rounded-xl text-sm font-bold border-none cursor-pointer hover:bg-[#2997ff]/20 transition-all">
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center pt-16 px-4"
          onClick={() => setEditing(null)}>
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold">Edit: {editing.title_ml}</h2>
                <div className="text-xs text-[#6e6e73]">slug: {editing.slug}</div>
              </div>
              <button onClick={() => setEditing(null)} className="text-[#6e6e73] hover:text-white text-xl border-none bg-transparent cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Malayalam Title</label>
                  <input value={editing.title_ml || ''} onChange={e => setEditing({...editing, title_ml: e.target.value})}
                    placeholder="Malayalam title" className={inp} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">English Title</label>
                  <input value={editing.title_en || ''} onChange={e => setEditing({...editing, title_en: e.target.value})}
                    placeholder="English title" className={inp} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Short Description (Malayalam)</label>
                <textarea value={editing.description_ml || ''} onChange={e => setEditing({...editing, description_ml: e.target.value})}
                  rows={3} placeholder="Short description shown on cards..." className={inp + ' resize-y'} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Full Content (Malayalam)</label>
                <textarea value={editing.content_ml || ''} onChange={e => setEditing({...editing, content_ml: e.target.value})}
                  rows={10} placeholder="Full detailed content. HTML tags supported: <b>, <i>, <ul>, <li>, <p>, <br>" className={inp + ' resize-y font-mono text-xs'} />
                <div className="text-[10px] text-[#6e6e73] mt-1">HTML supported: &lt;b&gt; &lt;i&gt; &lt;ul&gt; &lt;li&gt; &lt;p&gt; &lt;br&gt; &lt;h3&gt;</div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-[#30d158] text-black rounded-xl text-sm font-black hover:bg-[#28b84c] transition-all disabled:opacity-50 border-none cursor-pointer">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setEditing(null)}
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
