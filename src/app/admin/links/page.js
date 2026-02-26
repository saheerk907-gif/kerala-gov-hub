'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const EMPTY = { title_ml: '', title_en: '', url: '', icon: '🔗', color: 'blue', description: '', sort_order: 0, is_published: true };
const COLORS = ['blue', 'green', 'orange', 'purple', 'teal', 'pink', 'gold'];

export default function AdminLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('quick_links').select('*').order('sort_order');
    setLinks(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await supabase.from('quick_links').update(form).eq('id', editId);
    } else {
      await supabase.from('quick_links').insert(form);
    }
    setShowForm(false); setForm(EMPTY); setEditId(null); load();
  };

  const handleEdit = (l) => {
    setForm({ title_ml: l.title_ml, title_en: l.title_en || '', url: l.url, icon: l.icon, color: l.color, description: l.description || '', sort_order: l.sort_order, is_published: l.is_published });
    setEditId(l.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('ഡിലീറ്റ് ചെയ്യണോ?')) return;
    await supabase.from('quick_links').delete().eq('id', id);
    load();
  };

  const inputClass = "w-full px-4 py-2.5 bg-[#1a1a1a] border border-white/[0.08] rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">ക്വിക്ക് ലിങ്കുകൾ</h1>
          <p className="text-xs text-[#6e6e73] font-sans">Manage Quick Links / Portals</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(true); }}
          className="px-5 py-2.5 bg-[#2997ff] text-white rounded-xl text-sm font-semibold cursor-pointer hover:bg-[#0077ed] transition-all border-none font-malayalam">
          + പുതിയ ലിങ്ക്
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-20 px-4" onClick={() => setShowForm(false)}>
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-5">{editId ? 'എഡിറ്റ്' : 'പുതിയ ലിങ്ക്'}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input required value={form.title_ml} onChange={e => setForm(f => ({...f, title_ml: e.target.value}))}
                placeholder="മലയാളം ശീർഷകം" className={inputClass} />
              <input value={form.title_en} onChange={e => setForm(f => ({...f, title_en: e.target.value}))}
                placeholder="English title" className={inputClass + ' font-sans'} />
              <input required value={form.url} onChange={e => setForm(f => ({...f, url: e.target.value}))}
                placeholder="https://..." className={inputClass + ' font-sans'} />
              <div className="grid grid-cols-2 gap-3">
                <input value={form.icon} onChange={e => setForm(f => ({...f, icon: e.target.value}))}
                  placeholder="Emoji icon" className={inputClass} />
                <select value={form.color} onChange={e => setForm(f => ({...f, color: e.target.value}))} className={inputClass}>
                  {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <input value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
                placeholder="വിവരണം" className={inputClass} />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 py-2.5 bg-[#2997ff] text-white rounded-xl text-sm font-semibold cursor-pointer border-none">
                  {editId ? 'അപ്‌ഡേറ്റ്' : 'ചേർക്കുക'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 bg-white/5 text-[#86868b] rounded-xl text-sm cursor-pointer border-none">റദ്ദാക്കുക</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? <div className="text-center text-[#6e6e73] py-10 text-sm">Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {links.map(l => (
            <div key={l.id} className="flex items-center gap-4 px-5 py-4 bg-[#111] border border-white/[0.08] rounded-xl">
              <span className="text-2xl">{l.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{l.title_ml}</div>
                <div className="text-[11px] text-[#6e6e73] font-sans truncate">{l.url}</div>
              </div>
              <button onClick={() => handleEdit(l)} className="px-3 py-1.5 bg-white/5 rounded-lg text-xs text-[#86868b] hover:text-white cursor-pointer border-none font-sans">Edit</button>
              <button onClick={() => handleDelete(l.id)} className="px-3 py-1.5 bg-white/5 rounded-lg text-xs text-[#ff453a] cursor-pointer border-none font-sans">Del</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
