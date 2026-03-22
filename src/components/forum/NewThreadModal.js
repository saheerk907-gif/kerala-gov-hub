// src/components/forum/NewThreadModal.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  { key: 'service_matters', label: 'സേവന കാര്യങ്ങൾ' },
  { key: 'pension',         label: 'പെൻഷൻ' },
  { key: 'nps_aps',         label: 'NPS / APS' },
  { key: 'leave',           label: 'അവധി' },
  { key: 'general',         label: 'പൊതു ചർച്ച' },
];

const COOLDOWN_MS = 60_000;

export default function NewThreadModal({ onClose, defaultCategory }) {
  const router = useRouter();
  const [form, setForm] = useState({
    author_name: '',
    title: '',
    body: '',
    category: defaultCategory || 'general',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Restore saved author name
  useEffect(() => {
    const saved = localStorage.getItem('forum_author_name');
    if (saved) set('author_name', saved);
  }, []);

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function validate() {
    if (!form.author_name.trim()) return 'പേര് നൽകുക.';
    if (form.author_name.length > 50) return 'പേര് 50 അക്ഷരത്തിൽ കൂടരുത്.';
    if (!form.title.trim()) return 'തലക്കെട്ട് നൽകുക.';
    if (form.title.length > 200) return 'തലക്കെട്ട് 200 അക്ഷരത്തിൽ കൂടരുത്.';
    if (!form.body.trim()) return 'ചർച്ച എഴുതുക.';
    if (form.body.length > 3000) return 'ചർച്ച 3000 അക്ഷരത്തിൽ കൂടരുത്.';
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    // Client-side cooldown (UX only — server enforces real limit)
    const lastPost = parseInt(sessionStorage.getItem('forum_last_thread') || '0', 10);
    if (Date.now() - lastPost < COOLDOWN_MS) {
      setError('ദയവായി ഒരു മിനിറ്റ് കഴിഞ്ഞ് ശ്രമിക്കൂ.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/forum/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Post ചെയ്യാൻ കഴിഞ്ഞില്ല.');
        return;
      }
      sessionStorage.setItem('forum_last_thread', String(Date.now()));
      localStorage.setItem('forum_author_name', form.author_name.trim());
      router.push(`/forum/${data.thread.id}`);
    } catch {
      setError('Network error. Refresh cheyyuka.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-lg rounded-3xl p-6 md:p-8"
        style={{ background: 'var(--nav-dropdown-bg)', border: '1px solid var(--glass-border)' }}>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            പുതിയ ചർച്ച തുടങ്ങുക
          </h2>
          <button onClick={onClose} className="text-white/50 hover:text-white text-xl leading-none bg-transparent border-none cursor-pointer">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Author name */}
          <div>
            <label className="block text-[11px] font-black text-white/40 uppercase tracking-widest mb-1.5">
              നിങ്ങളുടെ പേര്
            </label>
            <input
              value={form.author_name}
              onChange={e => set('author_name', e.target.value)}
              placeholder="ഉദാ: Rajan K."
              maxLength={50}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-[#2997ff] transition-all"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', fontFamily: "var(--font-noto-malayalam), sans-serif" }}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-black text-white/40 uppercase tracking-widest mb-1.5">
              വിഭാഗം
            </label>
            <select
              value={form.category}
              onChange={e => set('category', e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-[#2997ff] transition-all cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              {CATEGORIES.map(c => (
                <option key={c.key} value={c.key} style={{ background: '#1c1c1e' }}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[11px] font-black text-white/40 uppercase tracking-widest mb-1.5">
              തലക്കെട്ട്
            </label>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="ചർച്ചയുടെ വിഷയം..."
              maxLength={200}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-[#2997ff] transition-all"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', fontFamily: "var(--font-noto-malayalam), sans-serif" }}
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-[11px] font-black text-white/40 uppercase tracking-widest mb-1.5">
              ചർച്ച / ചോദ്യം
            </label>
            <textarea
              value={form.body}
              onChange={e => set('body', e.target.value)}
              placeholder="വിശദമായി എഴുതുക..."
              maxLength={3000}
              rows={5}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-[#2997ff] transition-all resize-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', fontFamily: "var(--font-noto-malayalam), sans-serif" }}
            />
            <div className="text-[10px] text-white/30 text-right mt-1">{form.body.length}/3000</div>
          </div>

          {error && (
            <div className="text-xs text-[#ff453a] bg-[#ff453a]/10 px-3 py-2 rounded-lg"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={submitting}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 cursor-pointer border-none"
            style={{ background: submitting ? 'var(--surface-xs)' : '#2997ff' }}>
            {submitting ? 'Post ചെയ്യുന്നു...' : 'ചർച്ച പ്രസിദ്ധീകരിക്കുക'}
          </button>
        </form>
      </div>
    </div>
  );
}
