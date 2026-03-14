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

const KSR_ENTRIES = [
  { slug: 'ksr-part-1',              icon: '📗', title_ml: 'KSR Part I — പൊതു സർവ്വീസ് നിയമങ്ങൾ',    title_en: 'KSR Part I — General Service Conditions' },
  { slug: 'ksr-part-2',              icon: '📙', title_ml: 'KSR Part II — അവധി നിയമങ്ങൾ',            title_en: 'KSR Part II — Leave Rules' },
  { slug: 'ksr-part-3',              icon: '📘', title_ml: 'KSR Part III — പെൻഷൻ നിയമങ്ങൾ',          title_en: 'KSR Part III — Pension Rules' },
  { slug: 'ksr-rule-earned-leave',   icon: '🏖️', title_ml: 'ആർജ്ജിത അവധി (Earned Leave)',             title_en: 'Earned Leave — Rule 14–22' },
  { slug: 'ksr-rule-joining-time',   icon: '⏱️', title_ml: 'ജോയിനിങ് ടൈം (Joining Time)',            title_en: 'Joining Time on Transfer — Rule 61–67' },
  { slug: 'ksr-rule-maternity-leave',icon: '👶', title_ml: 'Maternity / Paternity Leave',              title_en: 'Maternity & Paternity Leave — Rule 101' },
  { slug: 'ksr-rule-study-leave',    icon: '📚', title_ml: 'Study Leave',                              title_en: 'Study Leave — Rule 107' },
  { slug: 'ksr-rule-transfer-ta',    icon: '🚌', title_ml: 'Transfer TA',                              title_en: 'Transfer TA Rules — SR 46–60' },
  { slug: 'ksr-rule-dcrg',           icon: '🎖️', title_ml: 'DCRG / Gratuity',                         title_en: 'DCRG — KSR Part III Rule 77' },
  { slug: 'ksr-rule-family-pension', icon: '👨‍👩‍👧', title_ml: 'ഫാമിലി പെൻഷൻ',                          title_en: 'Family Pension — Rule 83' },
  { slug: 'ksr-rule-disciplinary',   icon: '⚖️', title_ml: 'അച്ചടക്ക നടപടികൾ',                        title_en: 'Disciplinary Proceedings' },
];

const inp = "w-full px-3 py-2.5 bg-[#1c1c1e] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors";

export default function AdminSchemes() {
  const [schemes,  setSchemes]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [editing,  setEditing]  = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await api('schemes?select=*&order=slug');
      setSchemes(Array.isArray(data) ? data : []);
      if (data?.message) setError(data.message);
    } catch (e) {
      setError(e.message);
      setSchemes([]);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const existingSlugs = new Set(schemes.map(s => s.slug));
  const missing = KSR_ENTRIES.filter(k => !existingSlugs.has(k.slug));

  async function createAllKsr() {
    setCreating(true);
    try {
      for (const entry of missing) {
        await api('schemes', 'POST', {
          slug:           entry.slug,
          icon:           entry.icon,
          title_ml:       entry.title_ml,
          title_en:       entry.title_en,
          description_ml: '',
          content_ml:     '',
        });
      }
      await load();
    } catch (e) {
      alert('Error creating KSR entries: ' + e.message);
    }
    setCreating(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api(`schemes?id=eq.${editing.id}`, 'PATCH', {
        title_ml:       editing.title_ml,
        title_en:       editing.title_en,
        description_ml: editing.description_ml,
        content_ml:     editing.content_ml,
        icon:           editing.icon,
      });
      setEditing(null);
      load();
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setSaving(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-2xl font-bold">പദ്ധതികൾ</h1>
          <p className="text-xs text-[#6e6e73] mt-1">Edit scheme details shown on public site</p>
        </div>
        {!loading && missing.length > 0 && (
          <button
            onClick={createAllKsr}
            disabled={creating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-none cursor-pointer transition-all disabled:opacity-50"
            style={{ background: 'rgba(41,151,255,0.15)', color: '#2997ff' }}>
            {creating ? 'Creating…' : `+ Add ${missing.length} KSR Pages`}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-[#ff453a]/10 border border-[#ff453a]/30 rounded-xl p-4 my-4 text-sm text-[#ff453a]">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-[#6e6e73] py-16">Loading...</div>
      ) : (
        <div className="space-y-3 mt-6">
          {schemes.map(s => (
            <div key={s.id}
              className="bg-[#111] border border-white/[0.08] rounded-2xl p-5 flex items-center justify-between hover:bg-[#1a1a1a] transition-all">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{s.icon || '📋'}</div>
                <div>
                  <div className="font-bold text-white">{s.title_ml || s.slug}</div>
                  <div className="text-xs text-[#6e6e73]">{s.title_en} · <code>{s.slug}</code></div>
                  {s.description_ml && (
                    <div className="text-xs text-[#86868b] mt-1 max-w-lg truncate">{s.description_ml}</div>
                  )}
                  {s.content_ml
                    ? <div className="text-[10px] text-[#30d158] mt-1">✓ Content uploaded</div>
                    : <div className="text-[10px] text-[#ff9f0a] mt-1">⚠ No content yet</div>
                  }
                </div>
              </div>
              <button onClick={() => setEditing({ ...s })}
                className="px-4 py-2 bg-[#2997ff]/10 text-[#2997ff] rounded-xl text-sm font-bold border-none cursor-pointer hover:bg-[#2997ff]/20 transition-all flex-shrink-0">
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center pt-10 px-4"
          onClick={() => setEditing(null)}>
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold">{editing.title_ml || editing.slug}</h2>
                <code className="text-xs text-[#6e6e73]">{editing.slug}</code>
              </div>
              <button onClick={() => setEditing(null)}
                className="text-[#6e6e73] hover:text-white text-xl border-none bg-transparent cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Malayalam Title</label>
                  <input value={editing.title_ml || ''} onChange={e => setEditing({ ...editing, title_ml: e.target.value })}
                    placeholder="Malayalam title" className={inp} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">English Title</label>
                  <input value={editing.title_en || ''} onChange={e => setEditing({ ...editing, title_en: e.target.value })}
                    placeholder="English title" className={inp} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Short Description (Malayalam)</label>
                <textarea value={editing.description_ml || ''} onChange={e => setEditing({ ...editing, description_ml: e.target.value })}
                  rows={3} placeholder="Short description shown on preview cards..." className={inp + ' resize-y'} />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">
                  Full Content
                </label>
                <textarea value={editing.content_ml || ''} onChange={e => setEditing({ ...editing, content_ml: e.target.value })}
                  rows={16} placeholder="Paste full content here. HTML supported: <h2> <h3> <p> <b> <ul> <li> <table> <br>"
                  className={inp + ' resize-y font-mono text-xs'} />
                <div className="text-[10px] text-[#6e6e73] mt-1">
                  HTML tags: &lt;h2&gt; &lt;h3&gt; &lt;p&gt; &lt;b&gt; &lt;ul&gt; &lt;li&gt; &lt;table&gt; &lt;tr&gt; &lt;th&gt; &lt;td&gt; &lt;br&gt;
                </div>
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
