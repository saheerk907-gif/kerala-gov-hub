'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function AdminAudioPage() {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title_ml: '',
    title_en: '',
    description_ml: '',
    episode_number: '',
    duration_label: '',
  });
  const [file, setFile] = useState(null);

  async function fetchEpisodes() {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/audio_classes?select=*&order=episode_number.asc`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const data = await res.json();
    if (res.ok) setEpisodes(data);
    setLoading(false);
  }

  useEffect(() => { fetchEpisodes(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return alert('Please select an audio file.');
    setUploading(true);

    try {
      // 1. Upload file to Supabase Storage
      const fileName = `ep${form.episode_number}-${Date.now()}.${file.name.split('.').pop()}`;
      const uploadRes = await fetch(
        `${SUPABASE_URL}/storage/v1/object/audio/${fileName}`,
        {
          method: 'POST',
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            'Content-Type': file.type,
            'x-upsert': 'true',
          },
          body: file,
        }
      );

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.message || 'Upload failed');
      }

      const audio_url = `${SUPABASE_URL}/storage/v1/object/public/audio/${fileName}`;

      // 2. Insert metadata
      const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/audio_classes`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          title_ml: form.title_ml,
          title_en: form.title_en || null,
          description_ml: form.description_ml || null,
          episode_number: parseInt(form.episode_number) || 1,
          duration_label: form.duration_label || null,
          audio_url,
        }),
      });

      if (!insertRes.ok) {
        const err = await insertRes.json();
        throw new Error(err.message || 'Insert failed');
      }

      alert('Episode published successfully!');
      setForm({ title_ml: '', title_en: '', description_ml: '', episode_number: '', duration_label: '' });
      setFile(null);
      e.target.reset();
      fetchEpisodes();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(ep) {
    if (!confirm(`Delete "${ep.title_ml}"?`)) return;

    // Extract file name from URL
    const fileName = ep.audio_url.split('/audio/')[1];
    if (fileName) {
      await fetch(`${SUPABASE_URL}/storage/v1/object/audio/${fileName}`, {
        method: 'DELETE',
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      });
    }

    await fetch(`${SUPABASE_URL}/rest/v1/audio_classes?id=eq.${ep.id}`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });

    fetchEpisodes();
  }

  return (
    <div className="min-h-screen bg-[#F5F7F9] p-6 md:p-10 font-sans text-[#1d1d1f]">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 no-underline mb-8 hover:underline">
          ← Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
          ഓഡിയോ ക്ലാസ്സുകൾ
        </h1>
        <p className="text-gray-400 text-sm font-medium mb-10">Upload and manage KSR awareness audio episodes</p>

        {/* Upload Form */}
        <div className="bg-white rounded-[32px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 mb-10">
          <h2 className="text-lg font-bold mb-6">New Episode</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Title (Malayalam) *</label>
                <input
                  required
                  placeholder="ക്ലാസ്സ് തലക്കെട്ട്..."
                  className="w-full px-5 py-3.5 bg-[#F8F9FA] border-none rounded-[16px] outline-none focus:ring-2 focus:ring-green-400 font-medium"
                  style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
                  value={form.title_ml}
                  onChange={e => setForm({ ...form, title_ml: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Title (English)</label>
                <input
                  placeholder="Class title in English..."
                  className="w-full px-5 py-3.5 bg-[#F8F9FA] border-none rounded-[16px] outline-none focus:ring-2 focus:ring-green-400 font-medium"
                  value={form.title_en}
                  onChange={e => setForm({ ...form, title_en: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Episode Number *</label>
                <input
                  required
                  type="number"
                  min="1"
                  placeholder="1"
                  className="w-full px-5 py-3.5 bg-[#F8F9FA] border-none rounded-[16px] outline-none focus:ring-2 focus:ring-green-400 font-medium"
                  value={form.episode_number}
                  onChange={e => setForm({ ...form, episode_number: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Duration (e.g. 24 min)</label>
                <input
                  placeholder="24 min"
                  className="w-full px-5 py-3.5 bg-[#F8F9FA] border-none rounded-[16px] outline-none focus:ring-2 focus:ring-green-400 font-medium"
                  value={form.duration_label}
                  onChange={e => setForm({ ...form, duration_label: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Description (Malayalam)</label>
              <textarea
                rows="3"
                placeholder="ക്ലാസ്സിനെ കുറിച്ച് ഒരു ചെറിയ വിവരണം..."
                className="w-full px-5 py-3.5 bg-[#F8F9FA] border-none rounded-[16px] outline-none resize-none focus:ring-2 focus:ring-green-400 font-medium"
                style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
                value={form.description_ml}
                onChange={e => setForm({ ...form, description_ml: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Audio File *</label>
              <input
                required
                type="file"
                accept="audio/*"
                className="w-full px-5 py-3.5 bg-[#F8F9FA] border-none rounded-[16px] outline-none focus:ring-2 focus:ring-green-400 font-medium text-sm cursor-pointer file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                onChange={e => setFile(e.target.files[0])}
              />
              {file && (
                <p className="text-xs text-gray-500 mt-1.5 ml-1">{file.name} — {(file.size / 1024 / 1024).toFixed(1)} MB</p>
              )}
            </div>

            <button
              disabled={uploading}
              className={`w-full py-4 rounded-[18px] font-bold text-base transition-all ${uploading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#1d1d1f] text-white hover:bg-green-600'}`}
            >
              {uploading ? 'Uploading...' : 'Publish Episode'}
            </button>
          </form>
        </div>

        {/* Episodes List */}
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#86868b] mb-4 ml-1">Published Episodes ({episodes.length})</h2>
        {loading ? (
          <div className="text-sm text-gray-400 p-6">Loading...</div>
        ) : episodes.length === 0 ? (
          <div className="bg-white rounded-[24px] p-8 text-center text-gray-400 text-sm border border-gray-100">No episodes yet.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {episodes.map(ep => (
              <div key={ep.id} className="bg-white rounded-[20px] p-5 border border-gray-100 flex items-center gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-sm font-black text-green-600 flex-shrink-0">
                  {ep.episode_number}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-bold text-[15px] truncate" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>{ep.title_ml}</p>
                  {ep.title_en && <p className="text-xs text-gray-400 truncate">{ep.title_en}</p>}
                  {ep.duration_label && <p className="text-xs text-gray-400">{ep.duration_label}</p>}
                </div>
                <a href={ep.audio_url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-600 hover:underline flex-shrink-0">
                  Play
                </a>
                <button
                  onClick={() => handleDelete(ep)}
                  className="w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center flex-shrink-0 transition-colors"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
