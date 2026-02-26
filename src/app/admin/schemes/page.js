'use client';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// ക്ലയന്റ് സൈഡിൽ മാത്രം ലോഡ് ചെയ്യാൻ വേണ്ടി
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function AdminSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [editing, setEditing] = useState(null);

  // Editor-ൽ വേണ്ട ബട്ടണുകൾ സെറ്റ് ചെയ്യുന്നു
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
  }), []);

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
        content_ml: editing.content_ml, // ഇവിടെയാണ് എഡിറ്ററിലെ ഡാറ്റ സേവ് ആകുന്നത്
      })
      .eq('id', editing.id);

    if (!error) {
      alert('വിജയകരമായി അപ്‌ഡേറ്റ് ചെയ്തു!');
      setEditing(null);
      fetchSchemes();
    }
  }

  return (
    <div className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6">പദ്ധതികൾ മാനേജ് ചെയ്യുക</h1>
      
      <div className="grid gap-4">
        {schemes.map(s => (
          <div key={s.id} className="bg-[#111] p-5 border border-white/10 rounded-2xl flex justify-between items-center">
            <span className="font-bold">{s.title_ml || s.slug}</span>
            <button onClick={() => setEditing({...s})} className="bg-blue-600 px-4 py-2 rounded-lg text-sm">Edit</button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-4xl border border-white/10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Editing: {editing.slug}</h2>
            
            <form onSubmit={handleUpdate} className="space-y-4 text-black">
              <input 
                className="w-full p-3 rounded-xl bg-white outline-none"
                placeholder="Title (Malayalam)"
                value={editing.title_ml || ''}
                onChange={e => setEditing({...editing, title_ml: e.target.value})}
              />

              <div className="bg-white rounded-xl overflow-hidden min-h-[300px]">
                <ReactQuill 
                  theme="snow" 
                  value={editing.content_ml || ''} 
                  onChange={(content) => setEditing({...editing, content_ml: content})}
                  modules={modules}
                  className="h-[250px]"
                />
              </div>

              <div className="flex gap-3 pt-12">
                <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold">Save Changes</button>
                <button type="button" onClick={() => setEditing(null)} className="bg-gray-700 text-white px-8 py-3 rounded-xl font-bold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
