'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const CATEGORIES = [
  { value: 'da', label: 'ക്ഷാമബത്ത (DA)' },
  { value: 'bonus', label: 'ബോണസ് / ഉത്സവബത്ത' },
  { value: 'leave', label: 'അവധി ചട്ടങ്ങൾ' },
  { value: 'medisep', label: 'മെഡിസെപ്' },
  { value: 'pension', label: 'പെൻഷൻ' },
  { value: 'pay', label: 'ശമ്പളം / Pay Revision' },
  { value: 'nps', label: 'NPS' },
  { value: 'gpf', label: 'GPF' },
  { value: 'sli', label: 'SLI' },
  { value: 'gis', label: 'GIS' },
  { value: 'general', label: 'പൊതുവായത്' },
];

const EMPTY_FORM = {
  title_ml: '', title_en: '', go_number: '', go_date: '',
  category: 'general', description_ml: '', pdf_url: '', source_url: 'https://www.finance.kerala.gov.in',
  is_published: true, is_pinned: false,
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');
  const [uploading, setUploading] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    let q = supabase.from('government_orders').select('*').order('go_date', { ascending: false });
    if (filter !== 'all') q = q.eq('category', filter);
    const { data } = await q;
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { loadOrders(); }, [filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (editId) {
      await supabase.from('government_orders').update(form).eq('id', editId);
    } else {
      await supabase.from('government_orders').insert(form);
    }
    setSaving(false);
    setShowForm(false);
    setForm(EMPTY_FORM);
    setEditId(null);
    loadOrders();
  };

  const handleEdit = (order) => {
    setForm({
      title_ml: order.title_ml || '',
      title_en: order.title_en || '',
      go_number: order.go_number || '',
      go_date: order.go_date || '',
      category: order.category || 'general',
      description_ml: order.description_ml || '',
      pdf_url: order.pdf_url || '',
      source_url: order.source_url || '',
      is_published: order.is_published,
      is_pinned: order.is_pinned,
    });
    setEditId(order.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('ഈ ഉത്തരവ് ഡിലീറ്റ് ചെയ്യണോ?')) return;
    await supabase.from('government_orders').delete().eq('id', id);
    loadOrders();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('documents').upload(fileName, file);
    if (!error) {
      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName);
      setForm(f => ({ ...f, pdf_url: urlData.publicUrl }));
    }
    setUploading(false);
  };

  const inputClass = "w-full px-4 py-2.5 bg-[#1a1a1a] border border-white/[0.08] rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">സർക്കാർ ഉത്തരവുകൾ</h1>
          <p className="text-xs text-[#6e6e73] font-sans">Manage Government Orders</p>
        </div>
        <button
          onClick={() => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); }}
          className="px-5 py-2.5 bg-[#2997ff] text-white rounded-xl text-sm font-semibold cursor-pointer hover:bg-[#0077ed] transition-all border-none font-malayalam"
        >
          + പുതിയ ഉത്തരവ്
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-none transition-all font-sans ${
            filter === 'all' ? 'bg-[#2997ff] text-white' : 'bg-white/5 text-[#86868b] hover:text-white'
          }`}>All</button>
        {CATEGORIES.map(c => (
          <button key={c.value} onClick={() => setFilter(c.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-none transition-all ${
              filter === c.value ? 'bg-[#2997ff] text-white' : 'bg-white/5 text-[#86868b] hover:text-white'
            }`}>{c.label}</button>
        ))}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-20 px-4" onClick={() => setShowForm(false)}>
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 w-full max-w-xl max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-5">{editId ? 'ഉത്തരവ് എഡിറ്റ് ചെയ്യുക' : 'പുതിയ ഉത്തരവ് ചേർക്കുക'}</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-[#86868b] mb-1 font-semibold">മലയാളം ശീർഷകം *</label>
                <input required value={form.title_ml} onChange={e => setForm(f => ({...f, title_ml: e.target.value}))}
                  placeholder="ക്ഷാമബത്ത 3% — 01/07/2023 മുതൽ" className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#86868b] mb-1 font-semibold">GO നമ്പർ *</label>
                  <input required value={form.go_number} onChange={e => setForm(f => ({...f, go_number: e.target.value}))}
                    placeholder="G.O.(P) No.135/2025/Fin" className={inputClass + ' font-sans'} />
                </div>
                <div>
                  <label className="block text-xs text-[#86868b] mb-1 font-semibold">തീയതി *</label>
                  <input type="date" required value={form.go_date} onChange={e => setForm(f => ({...f, go_date: e.target.value}))}
                    className={inputClass + ' font-sans'} />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#86868b] mb-1 font-semibold">വിഭാഗം</label>
                <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}
                  className={inputClass}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#86868b] mb-1 font-semibold">വിവരണം (മലയാളം)</label>
                <textarea value={form.description_ml} onChange={e => setForm(f => ({...f, description_ml: e.target.value}))}
                  rows={3} placeholder="ഉത്തരവിന്റെ സംക്ഷിപ്ത വിവരണം..." className={inputClass + ' resize-y'} />
              </div>

              <div>
                <label className="block text-xs text-[#86868b] mb-1 font-semibold">PDF അപ്‌ലോഡ്</label>
                <input type="file" accept=".pdf" onChange={handleFileUpload}
                  className="text-sm text-[#86868b] font-sans" />
                {uploading && <span className="text-xs text-[#ff9f0a] ml-2">Uploading...</span>}
                {form.pdf_url && (
                  <a href={form.pdf_url} target="_blank" rel="noopener noreferrer"
                    className="block text-xs text-[#2997ff] mt-1 font-sans truncate">{form.pdf_url}</a>
                )}
              </div>

              <div>
                <label className="block text-xs text-[#86868b] mb-1 font-semibold">ഉറവിട URL</label>
                <input value={form.source_url} onChange={e => setForm(f => ({...f, source_url: e.target.value}))}
                  placeholder="https://www.finance.kerala.gov.in" className={inputClass + ' font-sans'} />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.is_published} onChange={e => setForm(f => ({...f, is_published: e.target.checked}))} />
                  പ്രസിദ്ധീകരിക്കുക
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.is_pinned} onChange={e => setForm(f => ({...f, is_pinned: e.target.checked}))} />
                  📌 Pin to top
                </label>
              </div>

              <div className="flex gap-3 mt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-[#2997ff] text-white rounded-xl text-sm font-semibold cursor-pointer hover:bg-[#0077ed] transition-all disabled:opacity-50 border-none font-malayalam">
                  {saving ? 'സേവ് ചെയ്യുന്നു...' : (editId ? 'അപ്‌ഡേറ്റ്' : 'ചേർക്കുക')}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 bg-white/5 text-[#86868b] rounded-xl text-sm font-semibold cursor-pointer hover:text-white transition-all border-none font-malayalam">
                  റദ്ദാക്കുക
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Orders Table */}
      {loading ? (
        <div className="text-center text-[#6e6e73] py-10 text-sm">Loading...</div>
      ) : (
        <div className="flex flex-col gap-2">
          {orders.map(o => (
            <div key={o.id} className="flex items-center gap-4 px-5 py-3 bg-[#111] border border-white/[0.08] rounded-xl hover:bg-[#1a1a1a] transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {o.is_pinned && <span className="text-xs">📌</span>}
                  {!o.is_published && <span className="text-[10px] text-[#ff453a] bg-[rgba(255,69,58,0.1)] px-1.5 py-0.5 rounded font-sans">Draft</span>}
                  <span className="text-sm font-semibold truncate">{o.title_ml}</span>
                </div>
                <div className="text-[11px] text-[#6e6e73] font-sans mt-0.5">
                  {o.go_number} • {o.go_date} • {CATEGORIES.find(c => c.value === o.category)?.label || o.category}
                </div>
              </div>
              {o.pdf_url && (
                <a href={o.pdf_url} target="_blank" rel="noopener noreferrer"
                  className="text-[10px] text-[#2997ff] font-sans font-semibold no-underline hover:underline">PDF</a>
              )}
              <button onClick={() => handleEdit(o)}
                className="px-3 py-1.5 bg-white/5 rounded-lg text-xs text-[#86868b] hover:text-white cursor-pointer border-none font-sans transition-all">
                Edit
              </button>
              <button onClick={() => handleDelete(o.id)}
                className="px-3 py-1.5 bg-white/5 rounded-lg text-xs text-[#ff453a] hover:bg-[rgba(255,69,58,0.1)] cursor-pointer border-none font-sans transition-all">
                Delete
              </button>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center text-[#6e6e73] py-10 text-sm">ഉത്തരവുകൾ ഒന്നും ഇല്ല</div>
          )}
        </div>
      )}
    </div>
  );
}
