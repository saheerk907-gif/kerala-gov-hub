'use client';
import { useEffect, useState } from 'react';
import { r2upload } from '@/lib/r2upload';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const CATEGORIES = [
  { value: 'da', label: 'ക്ഷാമബത്ത (DA)' },
  { value: 'bonus', label: 'ബോണസ്' },
  { value: 'leave', label: 'അവധി' },
  { value: 'medisep', label: 'മെഡിസെപ്' },
  { value: 'pension', label: 'പെൻഷൻ' },
  { value: 'pay', label: 'ശമ്പളം' },
  { value: 'nps', label: 'NPS' },
  { value: 'gpf', label: 'GPF' },
  { value: 'sli', label: 'SLI' },
  { value: 'gis', label: 'GIS' },
  { value: 'ksr', label: 'KSR Amendment' },
  { value: 'general', label: 'പൊതുവായത്' },
];

const EMPTY = {
  title_ml: '', title_en: '', go_number: '', go_date: '',
  category: 'general', description_ml: '', pdf_url: '',
  is_published: true, is_pinned: false,
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

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');

  async function load() {
    setLoading(true);
    try {
      let path = 'government_orders?select=*&order=go_date.desc';
      if (filter !== 'all') path += `&category=eq.${filter}`;
      const data = await api(path);
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) { setOrders([]); }
    setLoading(false);
  }

  useEffect(() => { load(); }, [filter]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await api(`government_orders?id=eq.${editId}`, 'PATCH', form);
      } else {
        await api('government_orders', 'POST', form);
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
    if (!confirm('ഈ ഉത്തരവ് ഡിലീറ്റ് ചെയ്യണോ?')) return;
    await api(`government_orders?id=eq.${id}`, 'DELETE');
    load();
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('PDF ഫയൽ മാത്രം അനുവദനീയം');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      alert('ഫയൽ വലിപ്പം 50MB-ൽ കൂടരുത്');
      return;
    }
    setUploading(true);
    try {
      const { publicUrl } = await r2upload(file, 'documents');
      setForm(f => ({ ...f, pdf_url: publicUrl }));
    } catch (err) {
      alert('Upload Error: ' + err.message);
    }
    setUploading(false);
  }

  const filtered = orders.filter(o =>
    !search || o.title_ml?.toLowerCase().includes(search.toLowerCase()) ||
    o.go_number?.toLowerCase().includes(search.toLowerCase())
  );

  const inp = "w-full px-3 py-2.5 bg-[#1c1c1e] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">സർക്കാർ ഉത്തരവുകൾ</h1>
        <p className="text-xs text-[#6e6e73]">{orders.length} records total</p>
      </div>


      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search by title or GO number..."
        className="w-full px-4 py-2.5 bg-[#111] border border-white/[0.08] rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors mb-4" />

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-none cursor-pointer transition-all ${filter === 'all' ? 'bg-[#2997ff] text-white' : 'bg-white/5 text-[#86868b] hover:text-white'}`}>
          All ({orders.length})
        </button>
        {CATEGORIES.map(c => (
          <button key={c.value} onClick={() => setFilter(c.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-none cursor-pointer transition-all ${filter === c.value ? 'bg-[#2997ff] text-white' : 'bg-white/5 text-[#86868b] hover:text-white'}`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center pt-16 px-4"
          onClick={() => setShowForm(false)}>
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">{editId ? 'ഉത്തരവ് എഡിറ്റ്' : '+ പുതിയ ഉത്തരവ്'}</h2>
              <button onClick={() => setShowForm(false)} className="text-[#6e6e73] hover:text-white text-xl border-none bg-transparent cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">മലയാളം ശീർഷകം *</label>
                <input required value={form.title_ml} onChange={e => setForm(f => ({...f, title_ml: e.target.value}))}
                  placeholder="ക്ഷാമബത്ത 3% — 01/07/2023 മുതൽ" className={inp} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">GO നമ്പർ *</label>
                  <input required value={form.go_number} onChange={e => setForm(f => ({...f, go_number: e.target.value}))}
                    placeholder="G.O.(P) No.135/2025/Fin" className={inp} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">തീയതി *</label>
                  <input type="date" required value={form.go_date} onChange={e => setForm(f => ({...f, go_date: e.target.value}))} className={inp} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">വിഭാഗം</label>
                <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className={inp}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">വിവരണം</label>
                <textarea value={form.description_ml} onChange={e => setForm(f => ({...f, description_ml: e.target.value}))}
                  rows={3} placeholder="ഉത്തരവിന്റെ സംക്ഷിപ്ത വിവരണം..." className={inp + ' resize-y'} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">
                  PDF Upload <span className="text-[#ff453a]">*</span>
                </label>
                <input type="file" accept=".pdf" onChange={handleUpload} className="text-sm text-[#86868b]" />
                {uploading && <span className="text-xs text-[#ff9f0a] ml-2">Uploading...</span>}
                {form.pdf_url
                  ? <div className="text-xs text-[#30d158] mt-1 truncate">✓ PDF ready: {form.pdf_url.split('/').pop()}</div>
                  : <div className="text-xs text-[#ff453a]/80 mt-1">PDF ഇല്ലാത്ത ഉത്തരവുകൾ പബ്ലിക് പേജിൽ ക്ലിക്ക് ചെയ്യാൻ കഴിയില്ല. PDF upload ചെയ്യുക.</div>
                }
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.is_published} onChange={e => setForm(f => ({...f, is_published: e.target.checked}))} />
                  <span className="text-[#86868b]">Published</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.is_pinned} onChange={e => setForm(f => ({...f, is_pinned: e.target.checked}))} />
                  <span className="text-[#86868b]">📌 Pinned</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-[#2997ff] text-white rounded-xl text-sm font-bold hover:bg-[#0077ed] transition-all disabled:opacity-50 border-none cursor-pointer">
                  {saving ? 'Saving...' : (editId ? 'Update' : 'Add Order')}
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

      {/* Orders List */}
      {loading ? (
        <div className="text-center text-[#6e6e73] py-12">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-[#6e6e73] py-12 bg-[#111] rounded-2xl border border-white/[0.08]">
          <div className="text-4xl mb-3">📭</div>
          <div>ഉത്തരവുകൾ ഒന്നും ഇല്ല</div>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(o => (
            <div key={o.id} className="flex items-center gap-4 px-5 py-3.5 bg-[#111] border border-white/[0.08] rounded-xl hover:bg-[#1a1a1a] transition-all">
              <div className="text-lg">{o.is_pinned ? '📌' : '📄'}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {!o.is_published && <span className="text-[9px] text-[#ff453a] bg-[#ff453a]/10 px-1.5 py-0.5 rounded">Draft</span>}
                  <span className="text-sm font-semibold truncate">{o.title_ml}</span>
                </div>
                <div className="text-[11px] text-[#6e6e73] mt-0.5">
                  {o.go_number} • {o.go_date} • {CATEGORIES.find(c => c.value === o.category)?.label}
                </div>
              </div>
              {o.pdf_url
                ? <a href={o.pdf_url} target="_blank" rel="noopener noreferrer"
                    className="text-[10px] text-[#30d158] font-bold no-underline hover:underline whitespace-nowrap">✓ PDF</a>
                : <span className="text-[10px] text-[#ff453a] font-bold whitespace-nowrap">No PDF</span>
              }
              <button onClick={() => { setForm({ title_ml: o.title_ml||'', title_en: o.title_en||'', go_number: o.go_number||'', go_date: o.go_date||'', category: o.category||'general', description_ml: o.description_ml||'', pdf_url: o.pdf_url||'', is_published: o.is_published, is_pinned: o.is_pinned }); setEditId(o.id); setShowForm(true); }}
                className="px-3 py-1.5 bg-white/5 rounded-lg text-xs text-[#86868b] hover:text-white border-none cursor-pointer transition-all">
                Edit
              </button>
              <button onClick={() => handleDelete(o.id)}
                className="px-3 py-1.5 bg-[#ff453a]/10 rounded-lg text-xs text-[#ff453a] hover:bg-[#ff453a]/20 border-none cursor-pointer transition-all">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Button at Bottom */}
      <div className="mt-8">
        <button
          onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(true); }}
          className="w-full py-4 bg-[#2997ff] text-white rounded-2xl text-sm font-bold hover:bg-[#0077ed] transition-all border-none cursor-pointer">
          + പുതിയ ഉത്തരവ് ചേർക്കുക
        </button>
      </div>
    </div>
  );
}
