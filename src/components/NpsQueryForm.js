'use client';
import { useState } from 'react';
import { submitNpsQuery } from '@/lib/supabase';

const PURPLE = '#bf5af2';

export default function NpsQueryForm() {
  const [name, setName]         = useState('');
  const [question, setQuestion] = useState('');
  const [status, setStatus]     = useState('idle'); // idle | loading | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !question.trim()) return;
    setStatus('loading');
    try {
      await submitNpsQuery(name.trim(), question.trim());
      setStatus('success');
      setName('');
      setQuestion('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-3">✅</div>
        <p className="text-white font-bold text-lg mb-1">നിങ്ങളുടെ ചോദ്യം ലഭിച്ചു!</p>
        <p className="text-white/60 text-sm">We'll look into it and update our FAQ or contact you.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-5 text-sm font-bold px-5 py-2 rounded-xl border transition-all"
          style={{ color: PURPLE, borderColor: `${PURPLE}40`, background: `${PURPLE}10` }}
        >
          Ask another question
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl mx-auto">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-white/60">Your Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Rajan K"
          required
          className="rounded-xl px-4 py-3 text-sm text-white bg-transparent outline-none transition-all"
          style={{ border: '1px solid rgba(191,90,242,0.25)', background: 'rgba(191,90,242,0.05)' }}
          onFocus={e => e.target.style.borderColor = `${PURPLE}80`}
          onBlur={e  => e.target.style.borderColor = 'rgba(191,90,242,0.25)'}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-white/60">Your Question</label>
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Type your NPS doubt or question here..."
          required
          rows={4}
          className="rounded-xl px-4 py-3 text-sm text-white bg-transparent outline-none resize-none transition-all"
          style={{
            border: '1px solid rgba(191,90,242,0.25)',
            background: 'rgba(191,90,242,0.05)',
            fontFamily: 'var(--font-noto-malayalam), sans-serif',
          }}
          onFocus={e => e.target.style.borderColor = `${PURPLE}80`}
          onBlur={e  => e.target.style.borderColor = 'rgba(191,90,242,0.25)'}
        />
      </div>
      {status === 'error' && (
        <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
        style={{ background: PURPLE, color: '#fff' }}
      >
        {status === 'loading' ? 'Submitting…' : 'Submit Question →'}
      </button>
    </form>
  );
}
