'use client';
import { useState, useEffect, useRef } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BUCKET = 'acts-pdfs';

async function uploadPdf(file) {
  const token = sessionStorage.getItem('admin_token');
  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, '_')}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filename}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${token || SUPABASE_KEY}`,
      'Content-Type': 'application/pdf',
      'x-upsert': 'true',
    },
    body: file,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Upload failed');
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`;
}

const CATEGORIES = [
  { id: 'revenue',    label: 'Revenue / Land' },
  { id: 'service',    label: 'Service Rules' },
  { id: 'labour',     label: 'Labour Laws' },
  { id: 'local_govt', label: 'Local Government' },
  { id: 'forest',     label: 'Forest Laws' },
  { id: 'education',  label: 'Education' },
  { id: 'finance',    label: 'Finance / Tax' },
  { id: 'police',     label: 'Police / Judiciary' },
  { id: 'general',    label: 'General Laws' },
];

function slugify(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const EMPTY = {
  title: '', title_ml: '', slug: '', category: 'revenue',
  summary: '', key_points: '', pdf_url: '', official_url: '',
  act_number: '', year: '', tags: '', is_published: true,
};

async function api(path, method = 'GET', body = null) {
  const token = sessionStorage.getItem('admin_token');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${token || SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: body ? JSON.stringify(body) : null,
  });
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

export default function AdminActs() {
  const [acts, setActs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [saveError, setSaveError] = useState('');
  const fileRef = useRef();

  useEffect(() => { loadActs(); }, []);

  async function loadActs() {
    setLoading(true);
    const data = await api('acts_rules?order=created_at.desc');
    setActs(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  function openNew() {
    setForm(EMPTY);
    setEditId(null);
    setPdfFile(null);
    setUploadProgress('');
    if (fileRef.current) fileRef.current.value = '';
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openEdit(act) {
    setForm({
      title: act.title || '',
      title_ml: act.title_ml || '',
      slug: act.slug || '',
      category: act.category || 'revenue',
      summary: act.summary || '',
      key_points: act.key_points || '',
      pdf_url: act.pdf_url || '',
      official_url: act.official_url || '',
      act_number: act.act_number || '',
      year: act.year || '',
      tags: act.tags || '',
      is_published: act.is_published !== false,
    });
    setEditId(act.id);
    setPdfFile(null);
    setUploadProgress('');
    if (fileRef.current) fileRef.current.value = '';
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    let pdfUrl = form.pdf_url;

    if (pdfFile) {
      try {
        setUploading(true);
        setUploadProgress('Uploading PDF...');
        pdfUrl = await uploadPdf(pdfFile);
        setUploadProgress('PDF uploaded ✓');
        setUploading(false);
      } catch (err) {
        setUploadProgress(`Upload failed: ${err.message}`);
        setUploading(false);
        setSaving(false);
        return;
      }
    }

    const payload = {
      ...form,
      pdf_url: pdfUrl,
      year: form.year ? Number(form.year) : null,
      slug: form.slug || slugify(form.title),
      updated_at: new Date().toISOString(),
    };
    try {
      let result;
      if (editId) {
        result = await api(`acts_rules?id=eq.${editId}`, 'PATCH', payload);
      } else {
        payload.created_at = new Date().toISOString();
        result = await api('acts_rules', 'POST', payload);
      }
      if (result && result.code) {
        setSaveError(`DB Error: ${result.message || result.code}`);
        setSaving(false);
        return;
      }
      // Revalidate the public page so edits show immediately
      const savedSlug = payload.slug;
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'act', slug: savedSlug }),
      });
      setShowForm(false);
      setForm(EMPTY);
      setEditId(null);
      setPdfFile(null);
      setUploadProgress('');
      setSaveError('');
      if (fileRef.current) fileRef.current.value = '';
      loadActs();
    } catch (err) {
      setSaveError(err.message || 'Unknown error');
    }
    setSaving(false);
  }

  async function handleDelete(id, title) {
    if (!confirm(`Delete "${title}"?`)) return;
    await api(`acts_rules?id=eq.${id}`, 'DELETE');
    loadActs();
  }

  async function togglePublish(act) {
    await api(`acts_rules?id=eq.${act.id}`, 'PATCH', { is_published: !act.is_published });
    loadActs();
  }

  const filtered = acts.filter(a => {
    const matchCat = filterCat === 'all' || a.category === filterCat;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const inp = 'w-full px-3 py-2.5 bg-[#1c1c1e] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors';
  const lbl = 'block text-[10px] font-black uppercase tracking-widest text-[#6e6e73] mb-1';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Acts & Rules</h1>
          <p className="text-xs text-[#6e6e73] mt-0.5">{acts.length} acts uploaded</p>
        </div>
        {!showForm && (
          <button onClick={openNew}
            className="px-4 py-2.5 bg-[#2997ff] text-white rounded-xl text-sm font-bold border-none cursor-pointer hover:bg-[#0077ed] transition-all">
            + Add Act / Rule
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-white">{editId ? 'Edit Act' : 'Add New Act / Rule'}</h2>
            <button onClick={() => setShowForm(false)} className="text-[#6e6e73] hover:text-white bg-transparent border-none cursor-pointer text-xl">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Title (English) *</label>
                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: slugify(e.target.value) }))}
                  placeholder="Kerala Land Assignment Act 1960" className={inp} />
              </div>
              <div>
                <label className={lbl}>Title (Malayalam)</label>
                <input value={form.title_ml} onChange={e => setForm(f => ({ ...f, title_ml: e.target.value }))}
                  placeholder="കേരള ഭൂ നിയോഗ നിയമം" className={inp} style={{ fontFamily: "'Meera', sans-serif" }} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={lbl}>Category *</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inp}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Act Number</label>
                <input value={form.act_number} onChange={e => setForm(f => ({ ...f, act_number: e.target.value }))}
                  placeholder="Act 3 of 1960" className={inp} />
              </div>
              <div>
                <label className={lbl}>Year</label>
                <input type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                  placeholder="1960" className={inp} />
              </div>
            </div>

            <div>
              <label className={lbl}>URL Slug (auto-generated)</label>
              <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="kerala-land-assignment-act-1960" className={inp} />
              <div className="text-[10px] text-[#6e6e73] mt-1">
                Page URL: keralaemployees.in/acts-rules/<span className="text-white/50">{form.slug || 'slug'}</span>
              </div>
            </div>

            <div>
              <label className={lbl}>Summary *</label>
              <textarea required rows={5} value={form.summary}
                onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                placeholder="Write a detailed summary of the act — what it covers, who it applies to, key provisions... (This text appears in Google search results)"
                className={inp + ' resize-y'} />
              <div className="text-[10px] text-[#6e6e73] mt-1">This appears as Google snippet. Write clearly for SEO.</div>
            </div>

            <div>
              <label className={lbl}>Key Provisions (one per line)</label>
              <textarea rows={5} value={form.key_points}
                onChange={e => setForm(f => ({ ...f, key_points: e.target.value }))}
                placeholder="Government can assign waste land to landless poor&#10;Assignment is non-transferable for 12 years&#10;Assigned land cannot be used for non-agricultural purposes&#10;Violation leads to resumption of land"
                className={inp + ' resize-y'} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={lbl}>PDF File Upload</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/pdf"
                  onChange={e => { setPdfFile(e.target.files[0] || null); setUploadProgress(''); }}
                  className="w-full text-sm text-white/60 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#2997ff] file:text-white file:cursor-pointer cursor-pointer bg-[#1c1c1e] border border-white/10 rounded-xl px-3 py-2 outline-none"
                />
                {pdfFile && (
                  <div className="text-[11px] text-[#30d158] mt-1.5 flex items-center gap-1">
                    📄 {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
                {uploadProgress && (
                  <div className={`text-[11px] mt-1 ${uploadProgress.includes('failed') ? 'text-[#ff453a]' : 'text-[#30d158]'}`}>
                    {uploadProgress}
                  </div>
                )}
                {form.pdf_url && !pdfFile && (
                  <div className="text-[10px] text-[#6e6e73] mt-1 flex items-center gap-2">
                    Current: <a href={form.pdf_url} target="_blank" rel="noopener noreferrer" className="text-[#2997ff] hover:underline">View existing PDF</a>
                    <button type="button" onClick={() => setForm(f => ({ ...f, pdf_url: '' }))}
                      className="text-[#ff453a] bg-transparent border-none cursor-pointer text-[10px]">Remove</button>
                  </div>
                )}
              </div>
              <div>
                <label className={lbl}>Official Source URL (optional)</label>
                <input value={form.official_url} onChange={e => setForm(f => ({ ...f, official_url: e.target.value }))}
                  placeholder="https://laobrelands.kerala.gov.in/..." className={inp} />
              </div>
            </div>

            <div>
              <label className={lbl}>Tags (comma-separated)</label>
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                placeholder="land assignment, waste land, revenue, landless, assignment certificate" className={inp} />
              <div className="text-[10px] text-[#6e6e73] mt-1">Used for search & Google keywords</div>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="is_published" checked={form.is_published}
                onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
                className="w-4 h-4 accent-[#2997ff]" />
              <label htmlFor="is_published" className="text-sm text-white/70 cursor-pointer">Published (visible to public)</label>
            </div>

            {saveError && (
              <div className="text-[12px] text-[#ff453a] bg-[#ff453a]/10 px-4 py-3 rounded-xl border border-[#ff453a]/20">
                ❌ {saveError}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving || uploading}
                className="flex-1 py-3 bg-[#2997ff] text-white rounded-xl text-sm font-bold border-none cursor-pointer hover:bg-[#0077ed] disabled:opacity-50 transition-all">
                {uploading ? 'Uploading PDF...' : saving ? 'Saving...' : editId ? 'Update Act' : 'Add Act'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-white/5 text-[#86868b] rounded-xl text-sm font-bold border-none cursor-pointer hover:text-white transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search acts..."
          className="px-3 py-2 bg-[#111] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors w-48" />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="px-3 py-2 bg-[#111] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors">
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <span className="text-xs text-[#6e6e73] self-center">{filtered.length} results</span>
      </div>

      {/* Acts list */}
      {loading ? (
        <div className="text-center py-12 text-[#6e6e73]">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-[#6e6e73] bg-[#111] rounded-2xl border border-white/[0.08]">
          <div className="text-3xl mb-2">📭</div>
          <div>No acts found. Click "+ Add Act / Rule" to get started.</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(act => (
            <div key={act.id} className="bg-[#111] border border-white/[0.08] rounded-xl p-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold"
                    style={{ background: '#2997ff18', color: '#2997ff' }}>
                    {CATEGORIES.find(c => c.id === act.category)?.label}
                  </span>
                  {act.year && <span className="text-[10px] text-white/30">{act.year}</span>}
                  {!act.is_published && (
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#ff453a]/10 text-[#ff453a]">Draft</span>
                  )}
                  {act.pdf_url && <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#30d158]/10 text-[#30d158]">PDF</span>}
                </div>
                <div className="text-sm font-semibold text-white/80">{act.title}</div>
                {act.title_ml && <div className="text-xs text-white/40 mt-0.5" style={{ fontFamily: "'Meera', sans-serif" }}>{act.title_ml}</div>}
                {act.summary && <div className="text-xs text-[#6e6e73] mt-1 line-clamp-2">{act.summary}</div>}
                <div className="text-[10px] text-[#6e6e73] mt-1">
                  /acts-rules/<span className="text-white/40">{act.slug}</span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => togglePublish(act)}
                  className="px-2.5 py-1.5 rounded-lg text-xs border-none cursor-pointer transition-all"
                  style={{ background: act.is_published ? 'rgba(48,209,88,0.1)' : 'rgba(255,255,255,0.05)', color: act.is_published ? '#30d158' : '#86868b' }}>
                  {act.is_published ? 'Published' : 'Draft'}
                </button>
                <a href={`/acts-rules/${act.slug}`} target="_blank" rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-white/5 rounded-lg text-xs text-[#86868b] hover:text-white no-underline transition-all">
                  View
                </a>
                <button onClick={() => openEdit(act)}
                  className="px-2.5 py-1.5 bg-white/5 rounded-lg text-xs text-[#86868b] hover:text-white border-none cursor-pointer transition-all">
                  Edit
                </button>
                <button onClick={() => handleDelete(act.id, act.title)}
                  className="px-2.5 py-1.5 bg-[#ff453a]/10 rounded-lg text-xs text-[#ff453a] hover:bg-[#ff453a]/20 border-none cursor-pointer transition-all">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
