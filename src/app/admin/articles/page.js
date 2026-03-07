'use client';
import { useEffect, useState } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const CATEGORIES = [
  { value: 'news',     label: 'വാർത്ത (News)',              page: '/news' },
  { value: 'ksr',      label: 'KSR - Service Rules',        page: '/ksr' },
  { value: 'gpf',      label: 'GPF - Provident Fund',       page: '/gpf' },
  { value: 'medisep',  label: 'Medisep',                    page: '/medisep' },
  { value: 'pension',  label: 'Pension',                    page: '/pension' },
  { value: 'da',       label: 'DA - ക്ഷാമബത്ത',            page: '/da-arrear' },
  { value: 'nps',      label: 'NPS / APS',                  page: '/nps-aps' },
  { value: 'benefits', label: 'ആനുകൂല്യങ്ങൾ (Benefits)',   page: '/' },
  { value: 'general',  label: 'പൊതുവായത് (General)',        page: '/' },
];

const INTERNAL_PAGES = [
  { value: '', label: '— None —' },
  { value: '/medisep', label: '/medisep — MEDISEP Overview' },
  { value: '/medisep/faq', label: '/medisep/faq — MEDISEP FAQ' },
  { value: '/medisep-claim-process', label: '/medisep-claim-process — Claim Process' },
  { value: '/medisep-complaint', label: '/medisep-complaint — Complaint Guide' },
  { value: '/pension', label: '/pension — Pension Calculator' },
  { value: '/pension-calculation', label: '/pension-calculation — Pension Calculation Guide' },
  { value: '/prc', label: '/prc — PRC Calculator' },
  { value: '/da-arrear', label: '/da-arrear — DA Arrear Calculator' },
  { value: '/dcrg', label: '/dcrg — DCRG Calculator' },
  { value: '/nps', label: '/nps — NPS Information' },
  { value: '/nps-aps', label: '/nps-aps — NPS vs APS' },
  { value: '/gpf', label: '/gpf — GPF Information' },
  { value: '/ksr', label: '/ksr — Service Rules' },
  { value: '/departmental-tests', label: '/departmental-tests — Departmental Tests' },
  { value: '/news', label: '/news — All News' },
  { value: '/articles', label: '/articles — All Articles' },
];

const EMPTY = {
  title_ml: '',
  title_en: '',
  summary_ml: '',
  content_ml: '',
  category: 'news',
  image_url: '',
  source_url: '',
  internal_link: '',
};

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

export default function AdminArticles() {
  const [articles, setArticles]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(EMPTY);
  const [editId, setEditId]       = useState(null);
  const [saving, setSaving]       = useState(false);
  const [filterCat, setFilterCat] = useState('all');
  const [search, setSearch]       = useState('');
  const [deleteId, setDeleteId]   = useState(null);
  const [uploading, setUploading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      let path = 'articles?select=*&order=created_at.desc';
      if (filterCat !== 'all') path += `&category=eq.${filterCat}`;
      const data = await api(path);
      setArticles(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [filterCat]);

  function openNew() {
    setForm(EMPTY);
    setEditId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleImageUpload(file) {
    if (!file) return;
    setUploading(true);
    try {
      const token = sessionStorage.getItem('admin_token');
      const ext = file.name.split('.').pop();
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const res = await fetch(
        `${SUPABASE_URL}/storage/v1/object/article-images/${filename}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token || SUPABASE_KEY}`,
            'apikey': SUPABASE_KEY,
            'Content-Type': file.type,
            'x-upsert': 'true',
          },
          body: file,
        }
      );
      if (res.ok) {
        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/article-images/${filename}`;
        setForm(f => ({ ...f, image_url: publicUrl }));
      } else {
        const err = await res.text();
        alert('Upload failed: ' + err + '\n\nMake sure the "article-images" bucket exists in Supabase Storage with public access.');
      }
    } catch (e) {
      alert('Upload error: ' + e.message);
    } finally {
      setUploading(false);
    }
  }

  function openEdit(a) {
    setForm({
      title_ml:      a.title_ml      || '',
      title_en:      a.title_en      || '',
      summary_ml:    a.summary_ml    || '',
      content_ml:    a.content_ml    || '',
      category:      a.category      || 'news',
      image_url:     a.image_url     || '',
      source_url:    a.source_url    || '',
      internal_link: a.internal_link || '',
    });
    setEditId(a.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function save() {
    if (!form.title_ml.trim()) return alert('Title (Malayalam) is required');
    setSaving(true);
    try {
      const payload = {
        title_ml:      form.title_ml,
        title_en:      form.title_en,
        summary_ml:    form.summary_ml,
        content_ml:    form.content_ml,
        category:      form.category,
        image_url:     form.image_url || null,
        source_url:    form.source_url || null,
        internal_link: form.internal_link || null,
      };
      if (editId) {
        await api(`articles?id=eq.${editId}`, 'PATCH', payload);
      } else {
        payload.created_at = new Date().toISOString();
        await api('articles', 'POST', payload);
      }
      setShowForm(false);
      setEditId(null);
      load();
    } catch (e) {
      alert('Error: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!confirm('ഈ ലേഖനം ഡിലീറ്റ് ചെയ്യണോ?')) return;
    await api(`articles?id=eq.${id}`, 'DELETE');
    load();
  }

  const filtered = articles.filter(a =>
    !search || (a.title_ml + ' ' + (a.title_en || '')).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">ലേഖനങ്ങൾ</h1>
          <p className="text-sm text-[#6e6e73] mt-0.5">Articles &amp; News — post to any section of your site</p>
        </div>
        <button onClick={openNew}
          className="px-4 py-2 rounded-xl text-sm font-bold bg-[#2997ff] text-white hover:bg-[#0077ed] transition-all border-none cursor-pointer">
          + പുതിയ ലേഖനം
        </button>
      </div>

      {/* SQL setup notice */}
      <div className="bg-[#1a1200] border border-[#ff9f0a]/30 rounded-2xl px-5 py-4 flex flex-col sm:flex-row gap-3 items-start">
        <div className="text-[#ff9f0a] text-lg flex-shrink-0">⚠</div>
        <div className="flex-1">
          <div className="text-xs font-black uppercase tracking-widest text-[#ff9f0a] mb-1">One-time Supabase setup required</div>
          <p className="text-xs text-[#86868b] mb-2">Run this SQL in Supabase → SQL Editor to create the <b className="text-white">articles</b> table:</p>
          <code className="block text-[11px] bg-black/50 px-3 py-2 rounded-lg text-[#30d158] font-mono select-all whitespace-pre-wrap">
{`CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ml TEXT NOT NULL,
  title_en TEXT,
  summary_ml TEXT,
  content_ml TEXT,
  category TEXT DEFAULT 'general',
  image_url TEXT,
  source_url TEXT,
  internal_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Admin all articles" ON articles FOR ALL USING (auth.role() = 'authenticated');`}
          </code>
          <p className="text-[11px] text-[#6e6e73] mt-1.5">Also create a Storage bucket named <b className="text-white">article-images</b> with <b className="text-white">Public</b> access in Supabase → Storage.</p>
        </div>
      </div>

      {/* Article Form */}
      {showForm && (
        <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-bold text-white">{editId ? 'ലേഖനം തിരുത്തുക' : 'പുതിയ ലേഖനം'}</h2>

          {/* Row 1: Category + Internal Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-3 bg-[#1c1c1e] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors">
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label} → {c.page}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">
                Internal Link <span className="normal-case font-normal text-[#6e6e73]">— Related page on this site</span>
              </label>
              <select value={form.internal_link} onChange={e => setForm(f => ({ ...f, internal_link: e.target.value }))}
                className="w-full px-4 py-3 bg-[#1c1c1e] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#30d158] transition-colors">
                {INTERNAL_PAGES.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              {form.internal_link && (
                <p className="text-[10px] text-[#30d158] mt-1">→ ലേഖനത്തിൽ "{form.internal_link}" CTA button കാണിക്കും</p>
              )}
            </div>
          </div>

          {/* Title ML */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">തലക്കെട്ട് (Malayalam) *</label>
            <input value={form.title_ml} onChange={e => setForm(f => ({ ...f, title_ml: e.target.value }))}
              placeholder="ലേഖനത്തിന്റെ തലക്കെട്ട്"
              className="w-full px-4 py-3 bg-[#1c1c1e] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors"
              style={{ fontFamily: "'Meera', sans-serif" }} />
          </div>

          {/* Title EN */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Title (English) <span className="normal-case font-normal">— for SEO</span></label>
            <input value={form.title_en} onChange={e => setForm(f => ({ ...f, title_en: e.target.value }))}
              placeholder="Article title in English (recommended for Google ranking)"
              className="w-full px-4 py-3 bg-[#1c1c1e] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors" />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">സംക്ഷിപ്തം (Summary) <span className="normal-case font-normal">— article card-ൽ കാണിക്കും</span></label>
            <textarea value={form.summary_ml} onChange={e => setForm(f => ({ ...f, summary_ml: e.target.value }))}
              rows={3} placeholder="ചെറിയ വിവരണം — ഹോം പേജിൽ കാർഡിൽ കാണിക്കും"
              className="w-full px-4 py-3 bg-[#1c1c1e] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors resize-y"
              style={{ fontFamily: "'Meera', sans-serif" }} />
          </div>

          {/* Full Content */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">
              പൂർണ്ണ ഉള്ളടക്കം (Full Content)
              <span className="ml-2 normal-case font-normal text-[#6e6e73]">— HTML: &lt;h3&gt; &lt;p&gt; &lt;b&gt; &lt;ul&gt; &lt;li&gt; &lt;br&gt; supported</span>
            </label>
            <textarea value={form.content_ml} onChange={e => setForm(f => ({ ...f, content_ml: e.target.value }))}
              rows={14} placeholder="<h3>വിഭാഗം 1</h3>&#10;<p>ഇവിടെ ഉള്ളടക്കം എഴുതുക...</p>&#10;<ul>&#10;  <li>പോയിന്റ് 1</li>&#10;  <li>പോയിന്റ് 2</li>&#10;</ul>"
              className="w-full px-4 py-3 bg-[#1c1c1e] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors resize-y font-mono"
              style={{ lineHeight: 1.6 }} />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#6e6e73] mb-2">
              Article Image
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* File upload */}
              <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed cursor-pointer transition-all flex-shrink-0
                ${uploading ? 'opacity-50 cursor-wait' : 'hover:border-[#2997ff] hover:bg-[#2997ff]/5'}`}
                style={{ borderColor: 'rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.02)' }}>
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                <span className="text-xl">{uploading ? '⏳' : '📸'}</span>
                <div>
                  <div className="text-sm font-bold text-white/80">{uploading ? 'Uploading...' : 'Image Upload ചെയ്യുക'}</div>
                  <div className="text-[10px] text-[#6e6e73]">JPG, PNG, WebP — max 5MB</div>
                </div>
              </label>
              {/* URL fallback */}
              <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                placeholder="അല്ലെങ്കിൽ image URL paste ചെയ്യുക..."
                className="flex-1 px-4 py-3 bg-[#1c1c1e] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors" />
            </div>
            {/* Preview */}
            {form.image_url && (
              <div className="mt-3 relative inline-block">
                <img src={form.image_url} alt="preview" className="h-28 rounded-xl object-cover" />
                <button onClick={() => setForm(f => ({ ...f, image_url: '' }))}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#ff453a] text-white text-xs flex items-center justify-center border-none cursor-pointer font-bold">
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Source URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Source URL <span className="normal-case font-normal">— original article link (external)</span></label>
            <input value={form.source_url} onChange={e => setForm(f => ({ ...f, source_url: e.target.value }))}
              placeholder="https://finance.kerala.gov.in/..."
              className="w-full px-4 py-3 bg-[#1c1c1e] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button onClick={save} disabled={saving || uploading}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#2997ff] text-white hover:bg-[#0077ed] transition-all border-none cursor-pointer disabled:opacity-50">
              {saving ? 'സേവ് ചെയ്യുന്നു...' : editId ? 'അപ്ഡേറ്റ് ചെയ്യുക' : 'പ്രസിദ്ധീകരിക്കുക'}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); }}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all border-none cursor-pointer">
              റദ്ദാക്കുക
            </button>
          </div>
        </div>
      )}

      {/* Filter + Search */}
      <div className="flex flex-wrap gap-3 items-center">
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="px-3 py-2 bg-[#111] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#2997ff]">
          <option value="all">എല്ലാ Category</option>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="തിരയൂ..."
          className="px-3 py-2 bg-[#111] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#2997ff] w-48" />
        <span className="text-sm text-[#6e6e73] ml-auto">{filtered.length} ലേഖനങ്ങൾ</span>
      </div>

      {/* Articles List */}
      {loading ? (
        <div className="text-center py-16 text-[#6e6e73] text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[#6e6e73]">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-sm">ഒരു ലേഖനവും ഇല്ല. ആദ്യ ലേഖനം ചേർക്കൂ!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => {
            const cat = CATEGORIES.find(c => c.value === a.category);
            return (
              <div key={a.id}
                className="flex items-start gap-4 p-4 bg-[#111] border border-white/[0.06] rounded-2xl hover:border-white/10 transition-all">
                {a.image_url && (
                  <img src={a.image_url} alt="" className="w-20 h-14 object-cover rounded-lg flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(41,151,255,0.15)', color: '#2997ff' }}>
                      {cat?.label || a.category}
                    </span>
                    <span className="text-[10px] text-[#6e6e73]">
                      {new Date(a.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-white/90 truncate" style={{ fontFamily: "'Meera', sans-serif" }}>
                    {a.title_ml}
                  </div>
                  {a.title_en && <div className="text-xs text-[#6e6e73] truncate">{a.title_en}</div>}
                  {a.summary_ml && (
                    <div className="text-xs text-[#6e6e73] mt-1 line-clamp-2">{a.summary_ml}</div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href={`/articles/${a.id}`} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#6e6e73] hover:text-white bg-white/5 hover:bg-white/10 transition-all no-underline">
                    കാണുക
                  </a>
                  <button onClick={() => openEdit(a)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#2997ff] bg-[#2997ff]/10 hover:bg-[#2997ff]/20 transition-all border-none cursor-pointer">
                    തിരുത്തുക
                  </button>
                  <button onClick={() => remove(a.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#ff453a] bg-[#ff453a]/10 hover:bg-[#ff453a]/20 transition-all border-none cursor-pointer">
                    ഡിലീറ്റ്
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
