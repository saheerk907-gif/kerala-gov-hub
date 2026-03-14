'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => (
    <div style={{ minHeight: 400, background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6e6e73', fontSize: 14 }}>
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
  { slug: 'ksr-part-1',               icon: '📗', title_en: 'KSR Part I — General Service Conditions',   title_ml: 'KSR Part I — പൊതു സർവ്വീസ് നിയമങ്ങൾ',  group: 'Parts' },
  { slug: 'ksr-part-2',               icon: '📙', title_en: 'KSR Part II — Leave Rules',                 title_ml: 'KSR Part II — അവധി നിയമങ്ങൾ',           group: 'Parts' },
  { slug: 'ksr-part-3',               icon: '📘', title_en: 'KSR Part III — Pension Rules',              title_ml: 'KSR Part III — പെൻഷൻ നിയമങ്ങൾ',         group: 'Parts' },
  { slug: 'ksr-rule-earned-leave',    icon: '🏖️', title_en: 'Earned Leave — Rule 14–22',                 title_ml: 'ആർജ്ജിത അവധി (Earned Leave)',              group: 'Rules' },
  { slug: 'ksr-rule-joining-time',    icon: '⏱️', title_en: 'Joining Time on Transfer — Rule 61–67',     title_ml: 'ജോയിനിങ് ടൈം (Joining Time)',             group: 'Rules' },
  { slug: 'ksr-rule-maternity-leave', icon: '👶', title_en: 'Maternity & Paternity Leave — Rule 101',    title_ml: 'Maternity / Paternity Leave',              group: 'Rules' },
  { slug: 'ksr-rule-study-leave',     icon: '📚', title_en: 'Study Leave — Rule 107',                    title_ml: 'Study Leave',                              group: 'Rules' },
  { slug: 'ksr-rule-transfer-ta',     icon: '🚌', title_en: 'Transfer TA Rules — SR 46–60',              title_ml: 'Transfer TA',                              group: 'Rules' },
  { slug: 'ksr-rule-dcrg',            icon: '🎖️', title_en: 'DCRG — KSR Part III Rule 77',               title_ml: 'DCRG / Gratuity',                          group: 'Rules' },
  { slug: 'ksr-rule-family-pension',  icon: '👨‍👩‍👧', title_en: 'Family Pension — Rule 83',                  title_ml: 'ഫാമിലി പെൻഷൻ',                           group: 'Rules' },
  { slug: 'ksr-rule-disciplinary',    icon: '⚖️', title_en: 'Disciplinary Proceedings',                  title_ml: 'അച്ചടക്ക നടപടികൾ',                        group: 'Rules' },
];

// Explicit alignment buttons so they show as separate icons (not a hidden picker)
const QUILL_MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote'],
    ['clean'],
  ],
};

const QUILL_FORMATS = ['header', 'bold', 'italic', 'underline', 'align', 'list', 'blockquote'];

const inp = {
  width: '100%', padding: '10px 14px', background: '#1c1c1e',
  border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12,
  fontSize: 14, color: 'white', outline: 'none',
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

  const parts = KSR_PAGES.filter(p => p.group === 'Parts');
  const rules = KSR_PAGES.filter(p => p.group === 'Rules');

  return (
    <>
      <style>{`
        /* ── Quill dark theme ─────────────────────────────── */
        .ql-toolbar.ql-snow {
          background: #222 !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
          border-bottom: none !important;
          border-radius: 12px 12px 0 0 !important;
          padding: 10px 12px !important;
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 4px !important;
        }
        .ql-container.ql-snow {
          background: #1a1a1a !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
          border-top: none !important;
          border-radius: 0 0 12px 12px !important;
          font-size: 14px !important;
        }
        .ql-editor {
          color: #e5e5e7 !important;
          line-height: 1.85 !important;
          min-height: 380px !important;
          font-family: var(--font-noto-malayalam), Georgia, serif !important;
        }
        .ql-editor.ql-blank::before { color: #555 !important; font-style: italic; }

        /* toolbar icon colours */
        .ql-toolbar .ql-stroke { stroke: #aaa !important; }
        .ql-toolbar .ql-fill   { fill:   #aaa !important; }
        .ql-toolbar .ql-picker-label { color: #aaa !important; }
        .ql-toolbar button:hover .ql-stroke,
        .ql-toolbar button.ql-active .ql-stroke { stroke: #2997ff !important; }
        .ql-toolbar button:hover .ql-fill,
        .ql-toolbar button.ql-active .ql-fill   { fill: #2997ff !important; }
        .ql-toolbar button.ql-active { background: rgba(41,151,255,0.12) !important; border-radius: 6px !important; }
        .ql-toolbar button:hover    { background: rgba(255,255,255,0.06) !important; border-radius: 6px !important; }

        /* header picker */
        .ql-snow .ql-picker-options { background: #222 !important; border-color: rgba(255,255,255,0.12) !important; border-radius: 10px !important; }
        .ql-snow .ql-picker-item    { color: #ccc !important; }
        .ql-snow .ql-picker-item:hover { color: #2997ff !important; }
        .ql-snow .ql-picker.ql-header .ql-picker-label::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item::before { color: #aaa !important; }

        /* editor content styles */
        .ql-editor h2 { font-size: 1.25rem; font-weight: 800; color: #fff; margin: 1.5rem 0 0.6rem; padding-bottom: 0.4rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .ql-editor h3 { font-size: 1rem; font-weight: 700; color: #2997ff; margin: 1.2rem 0 0.4rem; padding-left: 10px; border-left: 3px solid #2997ff; }
        .ql-editor p  { margin-bottom: 0.75rem; color: #ccc; }
        .ql-editor ul, .ql-editor ol { padding-left: 1.5rem; margin-bottom: 0.75rem; }
        .ql-editor li { color: #ccc; margin-bottom: 4px; }
        .ql-editor blockquote { border-left: 3px solid #2997ff; padding: 0.6rem 1rem; background: rgba(41,151,255,0.08); border-radius: 0 8px 8px 0; color: #aaa; margin: 1rem 0; }
        .ql-editor strong, .ql-editor b { color: #fff; }

        /* ── KSR card hover ──────────────────────────────── */
        .ksr-card:hover { transform: translateY(-1px); }
        .ksr-card { transition: transform 0.15s ease; }
      `}</style>

      {/* ── Page header ────────────────────────────────────── */}
      <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 120% at 0% 50%, rgba(41,151,255,0.08), transparent)', borderRadius: 16, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#2997ff', marginBottom: 6 }}>
              KSR Admin
            </p>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', marginBottom: 4 }}>
              KSR Content Manager
            </h1>
            <p style={{ fontSize: 13, color: '#6e6e73' }}>
              Edit content for all Kerala Service Rules public pages
            </p>
          </div>
          {!loading && missing.length > 0 && (
            <button onClick={initAll} disabled={init}
              style={{ padding: '10px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700, border: '1px solid rgba(41,151,255,0.3)', background: 'rgba(41,151,255,0.12)', color: '#2997ff', cursor: 'pointer', flexShrink: 0 }}>
              {init ? 'Creating…' : `+ Init ${missing.length} missing`}
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#6e6e73' }}>Loading…</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

          {/* ── Parts ───────────────────────────────────────── */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#2997ff' }}>📚 KSR Parts</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(41,151,255,0.2)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {parts.map(p => <KsrCard key={p.slug} p={p} row={rows[p.slug]} accentColor="#2997ff" onEdit={setEditing} />)}
            </div>
          </section>

          {/* ── Rules ───────────────────────────────────────── */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#ff9f0a' }}>⚖️ KSR Rules</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,159,10,0.2)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rules.map(p => <KsrCard key={p.slug} p={p} row={rows[p.slug]} accentColor="#ff9f0a" onEdit={setEditing} />)}
            </div>
          </section>
        </div>
      )}

      {/* ── Edit Modal ──────────────────────────────────────── */}
      {editing && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.90)', zIndex: 50, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 32, paddingLeft: 16, paddingRight: 16 }}
          onClick={() => setEditing(null)}>
          <div
            style={{ width: '100%', maxWidth: 760, maxHeight: '92vh', overflowY: 'auto', background: '#111', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20 }}
            onClick={e => e.stopPropagation()}>

            {/* sticky modal header */}
            <div style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: '#111', borderBottom: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px 20px 0 0' }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2997ff', marginBottom: 2 }}>Editing</p>
                <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0 }}>{editing.title_en}</h2>
                <code style={{ fontSize: 10, color: '#555' }}>{editing.slug}</code>
              </div>
              <button onClick={() => setEditing(null)}
                style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'rgba(255,255,255,0.06)', borderRadius: 8, color: '#999', cursor: 'pointer', fontSize: 16 }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555', marginBottom: 6 }}>Malayalam Title</label>
                  <input value={editing.title_ml || ''} onChange={e => setEditing({ ...editing, title_ml: e.target.value })}
                    placeholder="Malayalam title" style={inp} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555', marginBottom: 6 }}>English Title</label>
                  <input value={editing.title_en || ''} onChange={e => setEditing({ ...editing, title_en: e.target.value })}
                    placeholder="English title" style={inp} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555', marginBottom: 6 }}>Short Description</label>
                <textarea value={editing.description_ml || ''} onChange={e => setEditing({ ...editing, description_ml: e.target.value })}
                  rows={2} placeholder="Short description shown below the title (optional)"
                  style={{ ...inp, resize: 'none', lineHeight: 1.6 }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555', marginBottom: 6 }}>
                  Full Page Content
                </label>
                <QuillEditor
                  value={editing.content_ml || ''}
                  onChange={val => setEditing({ ...editing, content_ml: val })}
                  modules={QUILL_MODULES}
                  formats={QUILL_FORMATS}
                  placeholder="Type or paste content here. Use toolbar: headings, bold, lists, alignment…"
                  theme="snow"
                />
              </div>

              <div style={{ display: 'flex', gap: 10, paddingTop: 6 }}>
                <button type="submit" disabled={saving}
                  style={{ flex: 1, padding: '12px 0', borderRadius: 12, fontSize: 14, fontWeight: 900, border: 'none', background: '#30d158', color: 'black', cursor: 'pointer', opacity: saving ? 0.5 : 1 }}>
                  {saving ? 'Saving…' : 'Save Content'}
                </button>
                <button type="button" onClick={() => setEditing(null)}
                  style={{ padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, border: 'none', background: 'rgba(255,255,255,0.06)', color: '#888', cursor: 'pointer' }}>
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

function KsrCard({ p, row, accentColor, onEdit }) {
  const hasContent = !!row?.content_ml;
  const viewHref = `/ksr${p.slug.replace('ksr','').replace(/-part-/,'/part-').replace(/-rule-/,'/rules/')}`;

  return (
    <div className="ksr-card" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      padding: '14px 18px', borderRadius: 16,
      background: `rgba(${accentColor === '#2997ff' ? '41,151,255' : '255,159,10'},0.07)`,
      border: `1px solid rgba(${accentColor === '#2997ff' ? '41,151,255' : '255,159,10'},0.22)`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
        <div style={{ fontSize: 22, width: 36, textAlign: 'center', flexShrink: 0 }}>{p.icon}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, lineHeight: 1.3 }}>{p.title_en}</div>
          <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{p.title_ml}</div>
          <div style={{ marginTop: 5 }}>
            {!row
              ? <span style={{ fontSize: 10, fontWeight: 700, color: '#ff453a' }}>● Not initialised</span>
              : hasContent
                ? <span style={{ fontSize: 10, fontWeight: 700, color: '#30d158' }}>✓ Content uploaded</span>
                : <span style={{ fontSize: 10, fontWeight: 700, color: '#ff9f0a' }}>⚠ No content yet</span>
            }
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <a href={viewHref} target="_blank"
          style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none', background: 'rgba(255,255,255,0.06)', color: '#888', border: '1px solid rgba(255,255,255,0.10)' }}>
          View ↗
        </a>
        <button
          onClick={() => row && onEdit({ ...row })}
          disabled={!row}
          style={{ padding: '6px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', cursor: row ? 'pointer' : 'not-allowed', opacity: row ? 1 : 0.3, background: `rgba(${accentColor === '#2997ff' ? '41,151,255' : '255,159,10'},0.18)`, color: accentColor }}>
          Edit
        </button>
      </div>
    </div>
  );
}
