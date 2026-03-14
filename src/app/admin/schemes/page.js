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

const KSR_SLUGS = [
  { slug: 'ksr-part-1',             label: 'KSR Part I — General Service Conditions' },
  { slug: 'ksr-part-2',             label: 'KSR Part II — Leave Rules' },
  { slug: 'ksr-part-3',             label: 'KSR Part III — Pension Rules' },
  { slug: 'ksr-rule-earned-leave',  label: 'KSR Rule — Earned Leave' },
  { slug: 'ksr-rule-joining-time',  label: 'KSR Rule — Joining Time' },
  { slug: 'ksr-rule-maternity-leave', label: 'KSR Rule — Maternity & Paternity Leave' },
  { slug: 'ksr-rule-study-leave',   label: 'KSR Rule — Study Leave' },
  { slug: 'ksr-rule-transfer-ta',   label: 'KSR Rule — Transfer TA' },
  { slug: 'ksr-rule-dcrg',          label: 'KSR Rule — DCRG / Gratuity' },
  { slug: 'ksr-rule-family-pension',label: 'KSR Rule — Family Pension' },
  { slug: 'ksr-rule-disciplinary',  label: 'KSR Rule — Disciplinary Proceedings' },
];

const BLANK = { slug: '', title_ml: '', title_en: '', description_ml: '', content_ml: '', icon: '📋' };

export default function AdminSchemes() {
  const [schemes, setSchemes]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [editing, setEditing]   = useState(null);   // null | scheme object (has .id if existing)
  const [saving, setSaving]     = useState(false);
  const [creating, setCreating] = useState(false);  // show quick-create panel

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

  // existing scheme slugs for comparison
  const existingSlugs = new Set(schemes.map(s => s.slug));
  const missingSlugs  = KSR_SLUGS.filter(k => !existingSlugs.has(k.slug));

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing.id) {
        // update existing
        await api(`schemes?id=eq.${editing.id}`, 'PATCH', {
          title_ml:       editing.title_ml,
          title_en:       editing.title_en,
          description_ml: editing.description_ml,
          content_ml:     editing.content_ml,
          icon:           editing.icon,
        });
      } else {
        // create new
        await api('schemes', 'POST', {
          slug:           editing.slug,
          title_ml:       editing.title_ml,
          title_en:       editing.title_en,
          description_ml: editing.description_ml,
          content_ml:     editing.content_ml,
          icon:           editing.icon || '📋',
        });
      }
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
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">പദ്ധതികൾ</h1>
        <button
          onClick={() => setEditing({ ...BLANK })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-none cursor-pointer transition-all"
          style={{ background: 'rgba(48,209,88,0.15)', color: '#30d158' }}>
          + New Scheme
        </button>
      </div>
      <p className="text-xs text-[#6e6e73] mb-6">Edit scheme details shown on public site</p>

      {error && (
        <div className="bg-[#ff453a]/10 border border-[#ff453a]/30 rounded-xl p-4 mb-4 text-sm text-[#ff453a]">
          ⚠️ Error: {error}
        </div>
      )}

      {/* KSR Quick-create panel */}
      {!loading && missingSlugs.length > 0 && (
        <div className="mb-6 rounded-2xl border border-[#2997ff]/20 bg-[#2997ff]/05 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-white">KSR Content Entries Missing</p>
              <p className="text-xs text-[#6e6e73] mt-0.5">{missingSlugs.length} slugs not yet in database — click to create</p>
            </div>
            <button onClick={() => setCreating(v => !v)}
              className="text-xs font-bold px-3 py-1.5 rounded-lg border-none cursor-pointer transition-all"
              style={{ background: 'rgba(41,151,255,0.15)', color: '#2997ff' }}>
              {creating ? 'Hide' : 'Show'} slugs
            </button>
          </div>
          {creating && (
            <div className="flex flex-col gap-2">
              {missingSlugs.map(k => (
                <div key={k.slug} className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-[#111] border border-white/[0.06]">
                  <div>
                    <div className="text-sm font-semibold text-white">{k.label}</div>
                    <code className="text-[10px] text-[#6e6e73]">{k.slug}</code>
                  </div>
                  <button
                    onClick={() => setEditing({ ...BLANK, slug: k.slug, title_en: k.label })}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg border-none cursor-pointer transition-all flex-shrink-0"
                    style={{ background: 'rgba(48,209,88,0.15)', color: '#30d158' }}>
                    Create
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center text-[#6e6e73] py-12">Loading...</div>
      ) : schemes.length === 0 ? (
        <div className="text-center text-[#6e6e73] py-16 bg-[#111] rounded-2xl border border-white/[0.08]">
          <div className="text-4xl mb-3">📭</div>
          <div className="font-semibold mb-1">No schemes found</div>
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
                  {s.content_ml && (
                    <div className="text-[10px] text-[#30d158] mt-0.5">✓ Content uploaded</div>
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

      {/* Create / Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center pt-10 px-4"
          onClick={() => setEditing(null)}>
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold">{editing.id ? `Edit: ${editing.title_ml || editing.slug}` : 'Create New Scheme'}</h2>
                {editing.id
                  ? <div className="text-xs text-[#6e6e73]">slug: {editing.slug}</div>
                  : <div className="text-xs text-[#ff9f0a]">New entry will be created in database</div>
                }
              </div>
              <button onClick={() => setEditing(null)} className="text-[#6e6e73] hover:text-white text-xl border-none bg-transparent cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Slug — only editable on create */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">
                  Slug {editing.id ? '(read-only)' : '(required — must be unique)'}
                </label>
                <input
                  value={editing.slug || ''}
                  onChange={e => !editing.id && setEditing({ ...editing, slug: e.target.value })}
                  readOnly={!!editing.id}
                  placeholder="e.g. ksr-part-1"
                  required
                  className={inp + (editing.id ? ' opacity-50 cursor-not-allowed' : '')}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Malayalam Title</label>
                  <input value={editing.title_ml || ''} onChange={e => setEditing({ ...editing, title_ml: e.target.value })}
                    placeholder="e.g. KSR Part I — പൊതു സർവ്വീസ് നിയമങ്ങൾ" className={inp} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">English Title</label>
                  <input value={editing.title_en || ''} onChange={e => setEditing({ ...editing, title_en: e.target.value })}
                    placeholder="e.g. KSR Part I — General Service Conditions" className={inp} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Short Description (Malayalam)</label>
                <textarea value={editing.description_ml || ''} onChange={e => setEditing({ ...editing, description_ml: e.target.value })}
                  rows={3} placeholder="Short description shown on cards..." className={inp + ' resize-y'} />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">
                  Full Content (Malayalam / HTML)
                </label>
                <textarea value={editing.content_ml || ''} onChange={e => setEditing({ ...editing, content_ml: e.target.value })}
                  rows={14} placeholder="Full detailed content. HTML tags supported: <h3>, <b>, <p>, <ul>, <li>, <br>, <table>" className={inp + ' resize-y font-mono text-xs'} />
                <div className="text-[10px] text-[#6e6e73] mt-1">
                  Supported HTML: &lt;h2&gt; &lt;h3&gt; &lt;p&gt; &lt;b&gt; &lt;ul&gt; &lt;li&gt; &lt;table&gt; &lt;tr&gt; &lt;th&gt; &lt;td&gt; &lt;br&gt;
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-[#30d158] text-black rounded-xl text-sm font-black hover:bg-[#28b84c] transition-all disabled:opacity-50 border-none cursor-pointer">
                  {saving ? 'Saving...' : editing.id ? 'Save Changes' : 'Create Scheme'}
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
