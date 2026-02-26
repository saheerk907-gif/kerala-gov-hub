'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [detailForm, setDetailForm] = useState({ label: '', content_ml: '' });
  const [showAddDetail, setShowAddDetail] = useState(null);

  const loadSchemes = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('schemes')
      .select('*, scheme_details(*)').order('sort_order');
    setSchemes(data || []);
    setLoading(false);
  };

  useEffect(() => { loadSchemes(); }, []);

  const updateScheme = async (id, field, value) => {
    await supabase.from('schemes').update({ [field]: value }).eq('id', id);
    loadSchemes();
  };

  const addDetail = async (schemeId) => {
    if (!detailForm.label || !detailForm.content_ml) return;
    const maxSort = schemes.find(s => s.id === schemeId)?.scheme_details?.length || 0;
    await supabase.from('scheme_details').insert({
      scheme_id: schemeId, label: detailForm.label,
      content_ml: detailForm.content_ml, sort_order: maxSort + 1,
    });
    setDetailForm({ label: '', content_ml: '' });
    setShowAddDetail(null);
    loadSchemes();
  };

  const deleteDetail = async (id) => {
    if (!confirm('ഈ വിശദാംശം ഡിലീറ്റ് ചെയ്യണോ?')) return;
    await supabase.from('scheme_details').delete().eq('id', id);
    loadSchemes();
  };

  const inputClass = "w-full px-3 py-2 bg-[#1a1a1a] border border-white/[0.08] rounded-lg text-sm text-white outline-none focus:border-[#2997ff] transition-colors";

  if (loading) return <div className="text-center text-[#6e6e73] py-10 text-sm">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">പദ്ധതികൾ</h1>
      <p className="text-xs text-[#6e6e73] font-sans mb-8">Manage Schemes (MEDISEP, GPF, NPS, SLI, GIS, KSR)</p>

      <div className="flex flex-col gap-4">
        {schemes.map(scheme => (
          <div key={scheme.id} className="bg-[#111] border border-white/[0.08] rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{scheme.icon}</span>
                <div>
                  <h3 className="text-lg font-bold">{scheme.title_ml}</h3>
                  <div className="text-[11px] text-[#6e6e73] font-sans">{scheme.title_en} • {scheme.subtitle_en}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded ${scheme.is_published ? 'text-[#30d158] bg-[rgba(48,209,88,0.1)]' : 'text-[#ff453a] bg-[rgba(255,69,58,0.1)]'}`}>
                  {scheme.is_published ? 'Published' : 'Draft'}
                </span>
                <button
                  onClick={() => updateScheme(scheme.id, 'is_published', !scheme.is_published)}
                  className="px-3 py-1.5 bg-white/5 rounded-lg text-xs text-[#86868b] hover:text-white cursor-pointer border-none font-sans transition-all">
                  Toggle
                </button>
              </div>
            </div>

            {/* Description edit */}
            {editing === scheme.id ? (
              <div className="mb-4">
                <textarea
                  defaultValue={scheme.description_ml}
                  rows={2}
                  className={inputClass + ' resize-y mb-2'}
                  onBlur={(e) => { updateScheme(scheme.id, 'description_ml', e.target.value); setEditing(null); }}
                />
                <span className="text-[10px] text-[#6e6e73] font-sans">Click outside to save</span>
              </div>
            ) : (
              <p className="text-sm text-[#86868b] mb-4 cursor-pointer hover:text-white transition-colors" onClick={() => setEditing(scheme.id)}>
                {scheme.description_ml} <span className="text-[10px] text-[#2997ff] font-sans ml-2">✏️ Edit</span>
              </p>
            )}

            {/* Details list */}
            <div className="flex flex-col gap-1.5 mb-4">
              <div className="text-xs font-semibold text-[#6e6e73] mb-1">വിശദാംശങ്ങൾ:</div>
              {scheme.scheme_details?.sort((a, b) => a.sort_order - b.sort_order).map(d => (
                <div key={d.id} className="flex items-start gap-2 py-1.5 px-3 bg-white/[0.02] rounded-lg group">
                  <span className="text-xs text-[#86868b] flex-1">
                    <strong className="text-white">{d.label}</strong> — {d.content_ml}
                  </span>
                  <button onClick={() => deleteDetail(d.id)}
                    className="opacity-0 group-hover:opacity-100 text-[10px] text-[#ff453a] cursor-pointer bg-transparent border-none transition-opacity font-sans">
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Add detail */}
            {showAddDetail === scheme.id ? (
              <div className="flex gap-2 items-end">
                <input placeholder="ലേബൽ (ഉദാ: കവറേജ്)" value={detailForm.label}
                  onChange={e => setDetailForm(f => ({...f, label: e.target.value}))}
                  className={inputClass + ' flex-[1]'} />
                <input placeholder="വിവരണം" value={detailForm.content_ml}
                  onChange={e => setDetailForm(f => ({...f, content_ml: e.target.value}))}
                  className={inputClass + ' flex-[2]'} />
                <button onClick={() => addDetail(scheme.id)}
                  className="px-4 py-2 bg-[#2997ff] text-white rounded-lg text-xs font-semibold cursor-pointer border-none whitespace-nowrap">
                  ചേർക്കുക
                </button>
                <button onClick={() => setShowAddDetail(null)}
                  className="px-3 py-2 bg-white/5 text-[#86868b] rounded-lg text-xs cursor-pointer border-none">✕</button>
              </div>
            ) : (
              <button onClick={() => { setShowAddDetail(scheme.id); setDetailForm({ label: '', content_ml: '' }); }}
                className="text-xs text-[#2997ff] font-semibold cursor-pointer bg-transparent border-none hover:underline font-malayalam">
                + വിശദാംശം ചേർക്കുക
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
