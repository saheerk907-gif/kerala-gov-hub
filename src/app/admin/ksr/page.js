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

const KSR_PAGES = [
  { slug: 'ksr-part-1',               icon: '📗', title_en: 'KSR Part I — General Service Conditions',   title_ml: 'KSR Part I — പൊതു സർവ്വീസ് നിയമങ്ങൾ',  group: 'Parts' },
  { slug: 'ksr-part-2',               icon: '📙', title_en: 'KSR Part II — Leave Rules',                 title_ml: 'KSR Part II — അവധി നിയമങ്ങൾ',           group: 'Parts' },
  { slug: 'ksr-part-3',               icon: '📘', title_en: 'KSR Part III — Pension Rules',               title_ml: 'KSR Part III — പെൻഷൻ നിയമങ്ങൾ',         group: 'Parts' },
  { slug: 'ksr-rule-earned-leave',    icon: '🏖️', title_en: 'Earned Leave — Rule 14–22',                  title_ml: 'ആർജ്ജിത അവധി (Earned Leave)',              group: 'Rules' },
  { slug: 'ksr-rule-joining-time',    icon: '⏱️', title_en: 'Joining Time on Transfer — Rule 61–67',      title_ml: 'ജോയിനിങ് ടൈം (Joining Time)',             group: 'Rules' },
  { slug: 'ksr-rule-maternity-leave', icon: '👶', title_en: 'Maternity & Paternity Leave — Rule 101',     title_ml: 'Maternity / Paternity Leave',              group: 'Rules' },
  { slug: 'ksr-rule-study-leave',     icon: '📚', title_en: 'Study Leave — Rule 107',                     title_ml: 'Study Leave',                              group: 'Rules' },
  { slug: 'ksr-rule-transfer-ta',     icon: '🚌', title_en: 'Transfer TA Rules — SR 46–60',               title_ml: 'Transfer TA',                              group: 'Rules' },
  { slug: 'ksr-rule-dcrg',            icon: '🎖️', title_en: 'DCRG — KSR Part III Rule 77',                title_ml: 'DCRG / Gratuity',                          group: 'Rules' },
  { slug: 'ksr-rule-family-pension',  icon: '👨‍👩‍👧', title_en: 'Family Pension — Rule 83',                   title_ml: 'ഫാമിലി പെൻഷൻ',                           group: 'Rules' },
  { slug: 'ksr-rule-disciplinary',    icon: '⚖️', title_en: 'Disciplinary Proceedings',                   title_ml: 'അച്ചടക്ക നടപടികൾ',                        group: 'Rules' },
];

const inp = "w-full px-3 py-2.5 bg-[#1c1c1e] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors";

export default function AdminKsr() {
  const [rows,    setRows]    = useState({});   // slug → db row
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [init,    setInit]    = useState(false); // initialising missing entries

  async function load() {
    setLoading(true);
    try {
      const slugs = KSR_PAGES.map(p => p.slug);
      const qs = slugs.map(s => `slug.eq.${s}`).join(',');
      const data = await api(`schemes?or=(${qs})&select=*`);
      const map = {};
      if (Array.isArray(data)) data.forEach(r => { map[r.slug] = r; });
      setRows(map);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const missing = KSR_PAGES.filter(p => !rows[p.slug]);

  async function initAll() {
    setInit(true);
    for (const p of missing) {
      await api('schemes', 'POST', {
        slug: p.slug, icon: p.icon,
        title_ml: p.title_ml, title_en: p.title_en,
        description_ml: '', content_ml: '',
      });
    }
    await load();
    setInit(false);
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
      });
      setEditing(null);
      load();
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setSaving(false);
  }

  const groups = ['Parts', 'Rules'];

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">KSR Content</h1>
          <p className="text-xs text-[#6e6e73] mt-1">Upload content for Kerala Service Rules pages</p>
        </div>
        {!loading && missing.length > 0 && (
          <button onClick={initAll} disabled={init}
            className="px-4 py-2.5 rounded-xl text-sm font-bold border-none cursor-pointer transition-all disabled:opacity-50"
            style={{ background: 'rgba(41,151,255,0.15)', color: '#2997ff' }}>
            {init ? 'Creating…' : `Initialise ${missing.length} missing pages`}
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center text-[#6e6e73] py-20">Loading...</div>
      ) : (
        <div className="flex flex-col gap-10">
          {groups.map(group => {
            const pages = KSR_PAGES.filter(p => p.group === group);
            return (
              <div key={group}>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#6e6e73] mb-3">
                  KSR {group}
                </p>
                <div className="flex flex-col gap-2">
                  {pages.map(p => {
                    const row = rows[p.slug];
                    const hasContent = !!row?.content_ml;
                    return (
                      <div key={p.slug}
                        className="flex items-center justify-between gap-4 p-4 rounded-2xl border transition-all"
                        style={{ background: '#111', borderColor: 'rgba(255,255,255,0.07)' }}>
                        <div className="flex items-center gap-3">
                          <div className="text-2xl w-10 text-center">{p.icon}</div>
                          <div>
                            <div className="font-semibold text-white text-sm">{p.title_en}</div>
                            <div className="text-xs text-[#6e6e73] mt-0.5" style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}>{p.title_ml}</div>
                            <div className="mt-1">
                              {!row ? (
                                <span className="text-[10px] text-[#ff453a]">● Not initialised — click "Initialise" above</span>
                              ) : hasContent ? (
                                <span className="text-[10px] text-[#30d158]">✓ Content uploaded</span>
                              ) : (
                                <span className="text-[10px] text-[#ff9f0a]">⚠ No content yet — click Edit to add</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <a href={`/ksr${p.slug.replace('ksr', '').replace('-part-', '/part-').replace('-rule-', '/rules/')}`}
                            target="_blank"
                            className="px-3 py-1.5 rounded-lg text-xs font-bold no-underline transition-all"
                            style={{ background: 'rgba(255,255,255,0.05)', color: '#86868b' }}>
                            View ↗
                          </a>
                          <button
                            onClick={() => row && setEditing({ ...row })}
                            disabled={!row}
                            className="px-4 py-1.5 rounded-lg text-xs font-bold border-none cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{ background: 'rgba(41,151,255,0.12)', color: '#2997ff' }}>
                            Edit
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-start justify-center pt-8 px-4"
          onClick={() => setEditing(null)}>
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 w-full max-w-3xl max-h-[92vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-white">{editing.title_en}</h2>
                <code className="text-xs text-[#6e6e73]">{editing.slug}</code>
              </div>
              <button onClick={() => setEditing(null)}
                className="text-[#6e6e73] hover:text-white text-xl border-none bg-transparent cursor-pointer leading-none">✕</button>
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
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Short Description</label>
                <textarea value={editing.description_ml || ''} onChange={e => setEditing({ ...editing, description_ml: e.target.value })}
                  rows={3} placeholder="Short description (optional)" className={inp + ' resize-y'} />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">
                  Full Page Content
                </label>
                <textarea
                  value={editing.content_ml || ''}
                  onChange={e => setEditing({ ...editing, content_ml: e.target.value })}
                  rows={20}
                  placeholder={`Paste content here.\n\nHTML supported:\n<h2>Main Heading</h2>\n<h3>Sub Heading</h3>\n<p>Paragraph text here...</p>\n<ul><li>Point 1</li><li>Point 2</li></ul>\n<b>Bold text</b>`}
                  className={inp + ' resize-y font-mono text-xs leading-relaxed'}
                />
                <div className="text-[10px] text-[#6e6e73] mt-1.5 flex flex-wrap gap-x-3">
                  <span>Supported tags:</span>
                  {['h2', 'h3', 'p', 'b', 'ul', 'li', 'table', 'tr', 'th', 'td', 'br'].map(t => (
                    <code key={t} className="bg-white/5 px-1 rounded">&lt;{t}&gt;</code>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 rounded-xl text-sm font-black transition-all disabled:opacity-50 border-none cursor-pointer"
                  style={{ background: '#30d158', color: 'black' }}>
                  {saving ? 'Saving...' : 'Save Content'}
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
