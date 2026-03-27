'use client';
import { useState } from 'react';

const BLUE = '#2997ff';

export default function KsrQueryForm() {
  const [name, setName]         = useState('');
  const [question, setQuestion] = useState('');
  const [status, setStatus]     = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !question.trim()) return;
    setStatus('loading');
    try {
      // reuse the same nps_queries table with a topic tag
      const { createClient } = await import('@supabase/supabase-js');
      const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      await sb.from('nps_queries').insert({ name: name.trim(), question: `[KSR] ${question.trim()}` });
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
        <button onClick={() => setStatus('idle')}
          className="mt-5 text-sm font-bold px-5 py-2 rounded-xl border transition-all"
          style={{ color: BLUE, borderColor: `${BLUE}40`, background: `${BLUE}10` }}>
          Ask another question
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl mx-auto">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-white/60">Your Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="e.g. Rajan K" required
          className="rounded-xl px-4 py-3 text-sm text-white bg-transparent outline-none transition-all"
          style={{ border: `1px solid ${BLUE}25`, background: `${BLUE}05` }}
          onFocus={e => e.target.style.borderColor = `${BLUE}80`}
          onBlur={e  => e.target.style.borderColor = `${BLUE}25`}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-white/60">Your Question</label>
        <textarea value={question} onChange={e => setQuestion(e.target.value)}
          placeholder="Type your KSR doubt or question here..."
          required rows={4}
          className="rounded-xl px-4 py-3 text-sm text-white bg-transparent outline-none resize-none transition-all"
          style={{ border: `1px solid ${BLUE}25`, background: `${BLUE}05`, fontFamily: 'var(--font-noto-malayalam), sans-serif' }}
          onFocus={e => e.target.style.borderColor = `${BLUE}80`}
          onBlur={e  => e.target.style.borderColor = `${BLUE}25`}
        />
      </div>
      {status === 'error' && (
        <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
      )}
      <button type="submit" disabled={status === 'loading'}
        className="py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
        style={{ background: BLUE, color: '#fff' }}>
        {status === 'loading' ? 'Submitting…' : 'Submit Question →'}
      </button>
    </form>
  );
}
