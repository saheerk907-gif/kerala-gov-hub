'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 rounded-xl flex items-center justify-center text-sm"
      style={{ background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.10)', color: '#6e6e73' }}>
      Loading editor…
    </div>
  ),
});

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
  { slug: 'ksr-part-1',               icon: '📗', title_en: 'KSR Part I — General Service Conditions',   title_ml: 'KSR Part I — പൊതു സർവ്വീസ് നിയമങ്ങൾ',  group: 'Parts',  color: '#2997ff' },
  { slug: 'ksr-part-2',               icon: '📙', title_en: 'KSR Part II — Leave Rules',                 title_ml: 'KSR Part II — അവധി നിയമങ്ങൾ',           group: 'Parts',  color: '#2997ff' },
  { slug: 'ksr-part-3',               icon: '📘', title_en: 'KSR Part III — Pension Rules',              title_ml: 'KSR Part III — പെൻഷൻ നിയമങ്ങൾ',         group: 'Parts',  color: '#2997ff' },
  { slug: 'ksr-rule-earned-leave',    icon: '🏖️', title_en: 'Earned Leave — Rule 14–22',                 title_ml: 'ആർജ്ജിത അവധി (Earned Leave)',              group: 'Rules',  color: '#ff9f0a' },
  { slug: 'ksr-rule-joining-time',    icon: '⏱️', title_en: 'Joining Time on Transfer — Rule 61–67',     title_ml: 'ജോയിനിങ് ടൈം (Joining Time)',             group: 'Rules',  color: '#ff9f0a' },
  { slug: 'ksr-rule-maternity-leave', icon: '👶', title_en: 'Maternity & Paternity Leave — Rule 101',    title_ml: 'Maternity / Paternity Leave',              group: 'Rules',  color: '#ff9f0a' },
  { slug: 'ksr-rule-study-leave',     icon: '📚', title_en: 'Study Leave — Rule 107',                    title_ml: 'Study Leave',                              group: 'Rules',  color: '#ff9f0a' },
  { slug: 'ksr-rule-transfer-ta',     icon: '🚌', title_en: 'Transfer TA Rules — SR 46–60',              title_ml: 'Transfer TA',                              group: 'Rules',  color: '#ff9f0a' },
  { slug: 'ksr-rule-dcrg',            icon: '🎖️', title_en: 'DCRG — KSR Part III Rule 77',               title_ml: 'DCRG / Gratuity',                          group: 'Rules',  color: '#ff9f0a' },
  { slug: 'ksr-rule-family-pension',  icon: '👨‍👩‍👧', title_en: 'Family Pension — Rule 83',                  title_ml: 'ഫാമിലി പെൻഷൻ',                           group: 'Rules',  color: '#ff9f0a' },
  { slug: 'ksr-rule-disciplinary',    icon: '⚖️', title_en: 'Disciplinary Proceedings',                  title_ml: 'അച്ചടക്ക നടപടികൾ',                        group: 'Rules',  color: '#ff9f0a' },
];

const QUILL_MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ align: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote'],
    ['clean'],
  ],
};

const QUILL_FORMATS = ['header', 'bold', 'italic', 'underline', 'align', 'list', 'bullet', 'blockquote'];

const inp = "w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none transition-colors"
  + " bg-[#1c1c1e] border border-white/10 focus:border-[#2997ff]";

const GROUP_META = {
  Parts: { label: 'KSR Parts',  color: '#2997ff', icon: '📚' },
  Rules: { label: 'KSR Rules',  color: '#ff9f0a', icon: '⚖️' },
};

export default function AdminKsr() {
  const [rows,    setRows]    = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [init,    setInit]    = useState(false);

  async function load() {
    setLoading(true);
    try {
      const slugs = KSR_PAGES.map(p => p.slug);
      const qs = slugs.map(s => `slug.eq.${s}`).join(',');
      const data = await api(`schemes?or=(${qs})&select=*`);
      const map = {};
      if (Array.isArray(data)) data.forEach(r => { map[r.slug] = r; });
      setRows(map);
    } catch (e) { console.error(e); }
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

  return (
    <>
      {/* Quill dark theme */}
      <style>{`
        .ql-toolbar {
          background: #1c1c1e !important;
          border: 1px solid rgba(255,255,255,0.10) !important;
          border-bottom: none !important;
          border-radius: 12px 12px 0 0 !important;
          padding: 8px !important;
        }
        .ql-container {
          background: #1a1a1a !important;
          border: 1px solid rgba(255,255,255,0.10) !important;
          border-top: none !important;
          border-radius: 0 0 12px 12px !important;
          min-height: 400px;
        }
        .ql-editor {
          color: #e5e5e7 !important;
          font-size: 14px;
          line-height: 1.85;
          font-family: var(--font-noto-malayalam), Georgia, serif;
          min-height: 400px;
        }
        .ql-editor.ql-blank::before { color: #6e6e73 !important; font-style: normal; }
        .ql-stroke { stroke: #86868b !important; }
        .ql-fill { fill: #86868b !important; }
        .ql-picker { color: #86868b !important; }
        .ql-picker-label { color: #86868b !important; }
        .ql-picker-options { background: #1c1c1e !important; border-color: rgba(255,255,255,0.1) !important; border-radius: 8px !important; }
        .ql-picker-item { color: #aeaeb2 !important; }
        .ql-picker-item:hover, .ql-picker-item.ql-selected { color: #2997ff !important; }
        .ql-toolbar button:hover .ql-stroke,
        .ql-toolbar button.ql-active .ql-stroke { stroke: #2997ff !important; }
        .ql-toolbar button:hover .ql-fill,
        .ql-toolbar button.ql-active .ql-fill { fill: #2997ff !important; }
        .ql-toolbar button.ql-active { color: #2997ff !important; }
        .ql-editor h2 { font-size: 1.25rem; font-weight: 800; color: white; margin: 1.5rem 0 0.5rem; padding-bottom: 0.4rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .ql-editor h3 { font-size: 1rem; font-weight: 700; color: #2997ff; margin: 1.2rem 0 0.4rem; padding-left: 10px; border-left: 3px solid #2997ff; }
        .ql-editor p { margin-bottom: 0.75rem; color: #aeaeb2; }
        .ql-editor ul, .ql-editor ol { padding-left: 1.5rem; margin-bottom: 0.75rem; }
        .ql-editor li { color: #aeaeb2; margin-bottom: 4px; }
        .ql-editor blockquote { border-left: 3px solid #2997ff; padding: 0.5rem 1rem; background: rgba(41,151,255,0.06); border-radius: 0 8px 8px 0; color: #aeaeb2; margin: 1rem 0; }
        .ql-editor strong, .ql-editor b { color: rgba(255,255,255,0.9); }
        .ql-snow .ql-toolbar button { border-radius: 6px; margin: 1px; }
        .ql-snow .ql-toolbar button:hover { background: rgba(41,151,255,0.1) !important; }
      `}</style>

      {/* Page header */}
      <div className="relative mb-10 pb-8 border-b border-white/[0.06]">
        <div className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(41,151,255,0.06), transparent)' }} />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-2" style={{ color: '#2997ff' }}>
              Admin Panel
            </p>
            <h1 className="text-3xl font-black text-white tracking-tight mb-1">KSR Content</h1>
            <p className="text-sm" style={{ color: '#6e6e73' }}>
              Upload and manage Kerala Service Rules content for all public pages
            </p>
          </div>
          {!loading && missing.length > 0 && (
            <button onClick={initAll} disabled={init}
              className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold border-none cursor-pointer transition-all disabled:opacity-50"
              style={{ background: 'rgba(41,151,255,0.12)', color: '#2997ff', border: '1px solid rgba(41,151,255,0.25)' }}>
              {init ? 'Creating…' : `+ Initialise ${missing.length} missing`}
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20" style={{ color: '#6e6e73' }}>Loading…</div>
      ) : (
        <div className="flex flex-col gap-10">
          {['Parts', 'Rules'].map(group => {
            const meta = GROUP_META[group];
            const pages = KSR_PAGES.filter(p => p.group === group);
            return (
              <section key={group}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-lg">{meta.icon}</span>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: meta.color }}>
                    {meta.label}
                  </p>
                  <div className="flex-1 h-px" style={{ background: `${meta.color}18` }} />
                </div>

                <div className="flex flex-col gap-2">
                  {pages.map(p => {
                    const row = rows[p.slug];
                    const hasContent = !!row?.content_ml;
                    return (
                      <div key={p.slug}
                        className="flex items-center justify-between gap-4 p-4 rounded-2xl transition-all hover:scale-[1.005]"
                        style={{ background: `${p.color}04`, border: `1px solid ${p.color}18` }}>

                        <div className="flex items-center gap-4 min-w-0">
                          <div className="text-2xl w-9 text-center flex-shrink-0">{p.icon}</div>
                          <div className="min-w-0">
                            <div className="font-bold text-white text-sm leading-tight">{p.title_en}</div>
                            <div className="text-xs mt-0.5 truncate" style={{ color: '#6e6e73' }}>{p.title_ml}</div>
                            <div className="mt-1.5">
                              {!row
                                ? <span className="text-[10px] font-semibold" style={{ color: '#ff453a' }}>● Not initialised</span>
                                : hasContent
                                  ? <span className="text-[10px] font-semibold" style={{ color: '#30d158' }}>✓ Content uploaded</span>
                                  : <span className="text-[10px] font-semibold" style={{ color: '#ff9f0a' }}>⚠ No content yet</span>
                              }
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <a href={`/ksr${p.slug.replace('ksr','').replace(/-part-/,'/part-').replace(/-rule-/,'/rules/')}`}
                            target="_blank"
                            className="px-3 py-1.5 rounded-lg text-xs font-bold no-underline transition-all hover:text-white"
                            style={{ background: 'rgba(255,255,255,0.04)', color: '#6e6e73', border: '1px solid rgba(255,255,255,0.08)' }}>
                            View ↗
                          </a>
                          <button
                            onClick={() => row && setEditing({ ...row })}
                            disabled={!row}
                            className="px-4 py-1.5 rounded-lg text-xs font-bold border-none cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{ background: `${p.color}14`, color: p.color }}>
                            Edit
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 px-4"
          style={{ background: 'rgba(0,0,0,0.88)' }}
          onClick={() => setEditing(null)}>
          <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl"
            style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}
            onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 rounded-t-2xl"
              style={{ background: '#111', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: '#2997ff' }}>Editing</p>
                <h2 className="text-base font-bold text-white leading-tight">{editing.title_en}</h2>
                <code className="text-[10px]" style={{ color: '#6e6e73' }}>{editing.slug}</code>
              </div>
              <button onClick={() => setEditing(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-lg border-none bg-transparent cursor-pointer transition-all hover:bg-white/10"
                style={{ color: '#6e6e73' }}>✕</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6e6e73' }}>
                    Malayalam Title
                  </label>
                  <input value={editing.title_ml || ''} onChange={e => setEditing({ ...editing, title_ml: e.target.value })}
                    placeholder="Malayalam title" className={inp} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6e6e73' }}>
                    English Title
                  </label>
                  <input value={editing.title_en || ''} onChange={e => setEditing({ ...editing, title_en: e.target.value })}
                    placeholder="English title" className={inp} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6e6e73' }}>
                  Short Description
                </label>
                <textarea value={editing.description_ml || ''} onChange={e => setEditing({ ...editing, description_ml: e.target.value })}
                  rows={2} placeholder="Short description shown below the heading (optional)" className={inp + ' resize-none'} />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6e6e73' }}>
                  Full Page Content
                </label>
                <QuillEditor
                  value={editing.content_ml || ''}
                  onChange={val => setEditing({ ...editing, content_ml: val })}
                  modules={QUILL_MODULES}
                  formats={QUILL_FORMATS}
                  placeholder="Type or paste the full content. Use the toolbar for headings, bold, lists, alignment…"
                  theme="snow"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 rounded-xl text-sm font-black transition-all disabled:opacity-50 border-none cursor-pointer"
                  style={{ background: '#30d158', color: 'black' }}>
                  {saving ? 'Saving…' : 'Save Content'}
                </button>
                <button type="button" onClick={() => setEditing(null)}
                  className="px-6 py-3 rounded-xl text-sm font-bold transition-all border-none cursor-pointer hover:text-white"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#86868b' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
