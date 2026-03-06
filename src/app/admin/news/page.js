'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function AddNewsPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title_ml: '',
    title_en: '',
    summary_ml: '',
    category: 'news' // നിങ്ങളുടെ ടേബിളിലെ കൃത്യമായ വാല്യൂ ഉറപ്പാക്കുക
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/news`, {
        method: 'POST',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ വാർത്ത വിജയകരമായി പ്രസിദ്ധീകരിച്ചു!");
        setFormData({ title_ml: '', title_en: '', summary_ml: '', category: 'news' });
      } else {
        console.error("Supabase Error Details:", result);
        alert(`❌ പിശക്: ${result.message || "സേവ് ചെയ്യാൻ കഴിഞ്ഞില്ല. RLS Policy പരിശോധിക്കുക."}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("❌ നെറ്റ്‌വർക്ക് പ്രശ്നം നേരിട്ടു!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F9] p-6 md:p-12 font-sans text-[#1d1d1f]">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 no-underline mb-8 hover:ml-[-5px] transition-all">
          ← ഡാഷ്‌ബോർഡ്
        </Link>

        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Meera', sans-serif" }}>
              പുതിയ വാർത്ത ചേർക്കുക
            </h1>
            <p className="text-gray-400 text-sm font-medium">വിവരങ്ങൾ താഴെ നൽകി പബ്ലിഷ് ചെയ്യുക</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-2">Title (Malayalam)</label>
                <input 
                  required
                  placeholder="വാർത്തയുടെ തലക്കെട്ട് മലയാളത്തിൽ..."
                  className="w-full px-6 py-4 bg-[#F8F9FA] border-none rounded-[20px] outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  style={{ fontFamily: "'Meera', sans-serif" }}
                  value={formData.title_ml}
                  onChange={(e) => setFormData({...formData, title_ml: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-2">Title (English)</label>
                <input 
                  required
                  placeholder="Enter title in English..."
                  className="w-full px-6 py-4 bg-[#F8F9FA] border-none rounded-[20px] outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  value={formData.title_en}
                  onChange={(e) => setFormData({...formData, title_en: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-2">Summary / Content (Malayalam)</label>
                <textarea 
                  required
                  rows="4"
                  placeholder="വാർത്തയുടെ ചുരുക്കം ഇവിടെ നൽകുക..."
                  className="w-full px-6 py-4 bg-[#F8F9FA] border-none rounded-[20px] outline-none resize-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  style={{ fontFamily: "'Meera', sans-serif" }}
                  value={formData.summary_ml}
                  onChange={(e) => setFormData({...formData, summary_ml: e.target.value})}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className={`w-full py-5 rounded-[22px] font-bold text-lg transition-all shadow-xl active:scale-[0.98] ${loading ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-[#1d1d1f] text-white hover:bg-blue-600 shadow-blue-100'}`}
            >
              {loading ? 'പ്രസിദ്ധീകരിക്കുന്നു...' : 'പ്രസിദ്ധീകരിക്കുക'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
