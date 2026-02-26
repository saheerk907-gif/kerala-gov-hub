'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchSchemes();
  }, []);

  async function fetchSchemes() {
    const { data } = await supabase.from('schemes').select('*').order('slug');
    setSchemes(data || []);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    const { error } = await supabase
      .from('schemes')
      .update({
        title_ml: editing.title_ml,
        description_ml: editing.description_ml,
        content_ml: editing.content_ml,
      })
      .eq('id', editing.id);

    if (!error) {
      setEditing(null);
      fetchSchemes();
      alert('വിജയകരമായി അപ്‌ഡേറ്റ് ചെയ്തു!');
    }
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">പദ്ധതികൾ എഡിറ്റ് ചെയ്യുക (Schemes)</h1>
      
      <div className="grid gap-4">
        {schemes.map(s => (
          <div key={s.id} className="bg-[#111] p-4 border border-white/[0.08] rounded-xl flex justify-between items-center">
            <div>
              <div className="font-bold">{s.title_ml || s.slug}</div>
              <div className="text-xs text-gray-500 uppercase">{s.slug}</div>
            </div>
            <button 
              onClick={() => setEditing(s)}
              className="bg-blue-600 px-4 py-2 rounded-lg text-sm"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Edit Modal/Form */}
      {editing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <form onSubmit={handleUpdate} className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-2xl border border-white/10">
            <h2 className="text-xl font-bold mb-4">Edit {editing.slug}</h2>
            
            <label className="block text-sm mb-1">Title (Malayalam)</label>
            <input 
              className="w-full bg-[#111] border border-white/10 p-2 rounded mb-4"
              value={editing.title_ml || ''}
              onChange={e => setEditing({...editing, title_ml: e.target.value})}
            />

            <label className="block text-sm mb-1">Short Description</label>
            <textarea 
              className="w-full bg-[#111] border border-white/10 p-2 rounded mb-4 h-24"
              value={editing.description_ml || ''}
              onChange={e => setEditing({...editing, description_ml: e.target.value})}
            />

            <label className="block text-sm mb-1">Detailed Content (FAQ etc.)</label>
            <textarea 
              className="w-full bg-[#111] border border-white/10 p-2 rounded mb-4 h-48"
              value={editing.content_ml || ''}
              onChange={e => setEditing({...editing, content_ml: e.target.value})}
            />

            <div className="flex gap-3">
              <button type="submit" className="bg-green-600 px-6 py-2 rounded-lg">Save Changes</button>
              <button type="button" onClick={() => setEditing(null)} className="bg-gray-700 px-6 py-2 rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
