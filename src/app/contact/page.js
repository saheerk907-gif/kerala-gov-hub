'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SUBJECTS = [
  'General Query',
  'Correction / Error Report',
  'Content Suggestion',
  'MEDISEP Information',
  'Pension / Salary Calculator',
  'Government Orders',
  'Departmental Tests',
  'Other',
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // 'sending' | 'sent' | 'error'

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/xpwzoven', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    color: 'rgba(255,255,255,0.8)',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '13px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  };

  return (
    <>
    <Navbar />
    <div className="relative min-h-screen bg-aurora overflow-x-hidden">
      <div className="pt-24 pb-8 px-4 md:px-6">
        <div className="max-w-[720px] mx-auto">

          {/* Header */}
          <div className="mb-10 text-center">
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-white/65 mb-4">Contact</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Get in Touch</h1>
            <p className="text-[14px] text-white/70 leading-relaxed" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              നിങ്ങളുടെ ചോദ്യങ്ങൾ, നിർദ്ദേശങ്ങൾ, അല്ലെങ്കിൽ പ്രശ്‌നങ്ങൾ ഞങ്ങളെ അറിയിക്കൂ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Contact info */}
            <div className="flex flex-col gap-4">
              {[
                {
                  icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
                  label: 'Email',
                  value: 'kerala.employees.gov@gmail.com',
                  href: 'mailto:kerala.employees.gov@gmail.com',
                },
                {
                  icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>,
                  label: 'Telegram',
                  value: '@KeralaEmployees',
                  href: 'https://t.me/KeralaEmployees',
                },
                {
                  icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
                  label: 'Response Time',
                  value: 'Within 48 hours',
                  href: null,
                },
              ].map(({ icon, label, value, href }) => (
                <div key={label} className="glass-card rounded-xl p-4 flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(200,150,12,0.12)', color: '#c8960c' }}>
                    {icon}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-white/65 mb-0.5">{label}</div>
                    {href
                      ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-[12.5px] text-white/80 hover:text-white transition-colors no-underline">{value}</a>
                      : <span className="text-[12.5px] text-white/75">{value}</span>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="md:col-span-2 glass-card rounded-2xl p-6">
              {status === 'sent' ? (
                <div className="flex flex-col items-center justify-center h-full py-10 text-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(48,209,88,0.15)' }}>
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#30d158" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div className="text-[15px] font-semibold text-white/90">Message Sent!</div>
                  <div className="text-[13px] text-white/75">We'll get back to you within 48 hours.</div>
                  <button onClick={() => { setStatus(null); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="mt-2 text-[12px] text-white/50 hover:text-white/60 transition-colors border-none bg-transparent cursor-pointer underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-white/70 uppercase tracking-wider mb-1.5">Name</label>
                      <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name"
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = 'rgba(200,150,12,0.4)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-white/70 uppercase tracking-wider mb-1.5">Email</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="your@email.com"
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = 'rgba(200,150,12,0.4)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-white/70 uppercase tracking-wider mb-1.5">Subject</label>
                    <select name="subject" value={form.subject} onChange={handleChange} required
                      style={{ ...inputStyle, cursor: 'pointer' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(200,150,12,0.4)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                    >
                      <option value="" disabled>Select a subject</option>
                      {SUBJECTS.map(s => <option key={s} value={s} style={{ background: '#1a1c1e' }}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-white/70 uppercase tracking-wider mb-1.5">Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                      placeholder="Write your message here…"
                      style={{ ...inputStyle, resize: 'vertical', minHeight: '110px' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(200,150,12,0.4)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                    />
                  </div>
                  {status === 'error' && (
                    <p className="text-[12px]" style={{ color: 'rgba(255,69,58,0.9)' }}>
                      Something went wrong. Please try emailing us directly at kerala.employees.gov@gmail.com
                    </p>
                  )}
                  <button type="submit" disabled={status === 'sending'}
                    className="w-full py-3 rounded-xl text-[13px] font-bold transition-all duration-200 border-none cursor-pointer"
                    style={{
                      background: status === 'sending' ? 'rgba(200,150,12,0.3)' : 'rgba(200,150,12,0.85)',
                      color: status === 'sending' ? 'rgba(255,255,255,0.5)' : '#000',
                    }}>
                    {status === 'sending' ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
    </>
  );
}
