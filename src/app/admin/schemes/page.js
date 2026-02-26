'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchemes();
  }, []);

  // Supabase-ൽ നിന്ന് എല്ലാ സ്കീമുകളും എടുക്കുന്നു
  async function fetchSchemes() {
    setLoading(true);
    const { data, error } = await supabase
      .from('schemes')
      .select('*')
      .order('slug', { ascending: true });
    
    if (error) {
      console.error('Fetch error:', error);
    } else {
      setSchemes(data || []);
    }
    setLoading(false);
  }

  // വിവരങ്ങൾ അപ്‌ഡേറ്റ് ചെയ്യുന്നു
  async function handleUpdate(e) {
    e.preventDefault();
    
    if (!editing) return;

    const { error } = await supabase
      .from('schemes')
      .update({
        title_ml: editing.title_ml,
        title_en: editing.title_en,
        description_ml: editing.description_ml,
        content_ml: editing.content_ml,
      })
      .eq('id', editing.id);

    if (error) {
      console.error("Update error:", error.message);
      alert('സേവ് ചെയ്യാൻ സാധിച്ചില്ല: ' + error.message);
    } else {
      alert('വിവരങ്ങൾ വിജയകരമായി സേവ് ചെയ്തു!');
      setEditing(null);
      fetchSchemes(); // ലിസ്റ്റ് റിഫ്രഷ് ചെയ്യുന്നു
    }
  }

  if (loading) return <div className="p-10 text-white">Loading Schemes...</div>;

  return (
    <div className="p-4 md:p-8 text-white min-h-screen bg-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">പദ്ധതികൾ മാനേജ് ചെയ്യുക (Schemes)</h1>
        <a href="/admin" className="text-sm text-gray-400 hover:text-white">← ഡാഷ്‌ബോർഡ്</a>
      </div>
      
      <div className="grid gap-4">
        {schemes.length === 0 ? (
          <p className="text-gray-500">സ്കീമുകളൊന്നും കണ്ടെത്തിയില്ല.</p>
        ) : (
          schemes.map(s => (
            <div key={s.id} className="bg-[#111] p-5 border border-white/[0.08] rounded-2xl flex justify-between items-center hover:border-white/[0.2] transition-all">
              <div>
                <div className="font-bold text-lg text-blue-400">{s.title_ml || s.title_en}</div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-mono">{s.slug}</div>
              </div>
              <button 
                onClick={() => setEditing({...s})}
                className="bg-white text-black font-bold px-5 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                Edit
              </button>
            </div>
          ))
        )}
      </div>

      {/* Edit Overlay / Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1a1a] p-6 md:p-8 rounded-3xl w-full max-w-3xl border border-white/10 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-blue-500">Editing:</span> {editing.slug}
            </h2>
            
            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Title (Malayalam)</label>
                <input 
                  className="w-full bg-[#0a0a0a] border border-white/10 p-3 rounded-xl focus:border-blue-500 outline-none transition-all"
                  value={editing.title_ml || ''}
                  onChange={e => setEditing({...editing, title_ml: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Short Description (Malayalam)</label>
                <textarea 
                  className="w-full bg-[#0a0a0a] border border-white/10 p-3 rounded-xl h-24 focus:border-blue-500 outline-none transition-all"
                  value={editing.description_ml || ''}
                  onChange={e => setEditing({...editing, description_ml: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Detailed Content / FAQ (Malayalam)</label>
                <textarea 
                  className="w-full bg-[#0a0a0a] border border-white/10 p-3 rounded-xl h-60 focus:border-blue-500 outline-none transition-all font-sans text-sm"
                  placeholder="ഇവിടെ കൂടുതൽ വിവരങ്ങൾ അല്ലെങ്കിൽ FAQ ചേർക്കാം..."
                  value={editing.content_ml || ''}
                  onChange={e => setEditing({...editing, content_ml: e.target.value})}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20"
                >
                  Save Changes
                </button>
                <button 
                  type="button" 
                  onClick={() => setEditing(null)} 
                  className="flex-1 bg-[#222] hover:bg-[#333] text-gray-300 font-bold py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
